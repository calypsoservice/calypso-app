package devtov.calypsoapp.service.web3.btc;

import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.Utils;
import org.bitcoinj.crypto.*;
import org.bouncycastle.math.ec.ECPoint;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkState;

public class HDKeyDerivation {
    static {
        // Init proper random number generator, as some old Android installations have bugs that make it unsecure.
        if (Utils.isAndroidRuntime())
            new LinuxSecureRandom();

        RAND_INT = new BigInteger(256, new SecureRandom());
    }

    // Some arbitrary random number. Doesn't matter what it is.
    private static final BigInteger RAND_INT;

    private HDKeyDerivation() { }

    /**
     * Child derivation may fail (although with extremely low probability); in such case it is re-attempted.
     * This is the maximum number of re-attempts (to avoid an infinite loop in case of bugs etc.).
     */
    public static final int MAX_CHILD_DERIVATION_ATTEMPTS = 100;

    /**
     * Generates a new deterministic key from the given seed, which can be any arbitrary byte array. However resist
     * the temptation to use a string as the seed - any key derived from a password is likely to be weak and easily
     * broken by attackers (this is not theoretical, people have had money stolen that way). This method checks
     * that the given seed is at least 64 bits long.
     *
     * @throws HDDerivationException if generated master key is invalid (private key not between 0 and n inclusive)
     * @throws IllegalArgumentException if the seed is less than 8 bytes and could be brute forced
     */
    public static DeterministicKey createMasterPrivateKey(byte[] seed) throws HDDerivationException {
        checkArgument(seed.length > 8, "Seed is too short and could be brute forced");
        // Calculate I = HMAC-SHA512(key="Bitcoin seed", msg=S)
        byte[] i = hmacSha512("Bitcoin seed".getBytes(), seed);
        // Split I into two 32-byte sequences, Il and Ir.
        // Use Il as master secret key, and Ir as master chain code.
        checkState(i.length == 64, i.length);
        byte[] il = Arrays.copyOfRange(i, 0, 32);
        byte[] ir = Arrays.copyOfRange(i, 32, 64);
        Arrays.fill(i, (byte)0);
        DeterministicKey masterPrivKey = createMasterPrivKeyFromBytes(il, ir);
        Arrays.fill(il, (byte)0);
        Arrays.fill(ir, (byte)0);
        // Child deterministic keys will chain up to their parents to find the keys.
        masterPrivKey.setCreationTimeSeconds(Utils.currentTimeSeconds());
        return masterPrivKey;
    }

    public static byte[] hmacSha512(byte[] key, byte[] data) {
        Mac sha512Hmac;
        byte[] result = null;
        String HMAC_SHA512 = "HmacSHA512";

        try {
            final byte[] byteKey = key;
            sha512Hmac = Mac.getInstance(HMAC_SHA512);
            SecretKeySpec keySpec = new SecretKeySpec(byteKey, HMAC_SHA512);
            sha512Hmac.init(keySpec);
            byte[] macData = sha512Hmac.doFinal(data);

            // Can either base64 encode or put it right into hex
            result = macData;
            //result = bytesToHex(macData);
        } catch (InvalidKeyException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        } finally {
        }

        return result;
    }


    /**
     * @throws HDDerivationException if privKeyBytes is invalid (not between 0 and n inclusive).
     */
    public static DeterministicKey createMasterPrivKeyFromBytes(byte[] privKeyBytes, byte[] chainCode) throws HDDerivationException {
        //BigInteger priv = Utils.bytesToBigInteger(privKeyBytes);
        BigInteger priv = new BigInteger(1,privKeyBytes);

        assertNonZero(priv, "Generated master key is invalid.");
        assertLessThanN(priv, "Generated master key is invalid.");
        return new DeterministicKey(HDPath.m(), chainCode, priv, null);
    }

    public static DeterministicKey createMasterPubKeyFromBytes(byte[] pubKeyBytes, byte[] chainCode) {
        return new DeterministicKey(HDPath.M(), chainCode, new LazyECPoint(ECKey.CURVE.getCurve(), pubKeyBytes), null, null);
    }

    /**
     * Derives a key given the "extended" child number, ie. the 0x80000000 bit of the value that you
     * pass for {@code childNumber} will determine whether to use hardened derivation or not.
     * Consider whether your code would benefit from the clarity of the equivalent, but explicit, form
     * of this method that takes a {@code ChildNumber} rather than an {@code int}, for example:
     * {@code deriveChildKey(parent, new ChildNumber(childNumber, true))}
     * where the value of the hardened bit of {@code childNumber} is zero.
     */
    public static DeterministicKey deriveChildKey(DeterministicKey parent, int childNumber) {
        return deriveChildKey(parent, new ChildNumber(childNumber));
    }

    /**
     * Derives a key of the "extended" child number, ie. with the 0x80000000 bit specifying whether to use
     * hardened derivation or not. If derivation fails, tries a next child.
     */
    public static DeterministicKey deriveThisOrNextChildKey(DeterministicKey parent, int childNumber) {
        int nAttempts = 0;
        ChildNumber child = new ChildNumber(childNumber);
        boolean isHardened = child.isHardened();
        while (nAttempts < MAX_CHILD_DERIVATION_ATTEMPTS) {
            try {
                child = new ChildNumber(child.num() + nAttempts, isHardened);
                return deriveChildKey(parent, child);
            } catch (HDDerivationException ignore) { }
            nAttempts++;
        }
        throw new HDDerivationException("Maximum number of child derivation attempts reached, this is probably an indication of a bug.");

    }

    /**
     * @throws HDDerivationException if private derivation is attempted for a public-only parent key, or
     * if the resulting derived key is invalid (eg. private key == 0).
     */
    public static DeterministicKey deriveChildKey(DeterministicKey parent, ChildNumber childNumber) throws HDDerivationException {
        if (!parent.hasPrivKey())
            return deriveChildKeyFromPublic(parent, childNumber, PublicDeriveMode.NORMAL);
        else
            return deriveChildKeyFromPrivate(parent, childNumber);
    }

    public static DeterministicKey deriveChildKeyFromPrivate(DeterministicKey parent, ChildNumber childNumber)
            throws HDDerivationException {
        RawKeyBytes rawKey = deriveChildKeyBytesFromPrivate(parent, childNumber);
        return new DeterministicKey(parent.getPath().extend(childNumber), rawKey.chainCode,
                new BigInteger(1,rawKey.keyBytes), parent);
    }

    public static RawKeyBytes deriveChildKeyBytesFromPrivate(DeterministicKey parent,
                                                             ChildNumber childNumber) throws HDDerivationException {
        checkArgument(parent.hasPrivKey(), "Parent key must have private key bytes for this method.");
        byte[] parentPublicKey = parent.getPubKeyPoint().getEncoded(true);
        checkState(parentPublicKey.length == 33, "Parent pubkey must be 33 bytes, but is " + parentPublicKey.length);
        ByteBuffer data = ByteBuffer.allocate(37);
        if (childNumber.isHardened()) {
            data.put(parent.getPrivKeyBytes33());
        } else {
            data.put(parentPublicKey);
        }
        data.putInt(childNumber.i());
        byte[] i = HDUtils.hmacSha512(parent.getChainCode(), data.array());
        checkState(i.length == 64, i.length);
        byte[] il = Arrays.copyOfRange(i, 0, 32);
        byte[] chainCode = Arrays.copyOfRange(i, 32, 64);
        //BigInteger ilInt = Utils.bytesToBigInteger(il);
        BigInteger ilInt = new BigInteger(1,il);
        assertLessThanN(ilInt, "Illegal derived key: I_L >= n");
        final BigInteger priv = parent.getPrivKey();
        BigInteger ki = priv.add(ilInt).mod(ECKey.CURVE.getN());
        assertNonZero(ki, "Illegal derived key: derived private key equals 0.");
        return new RawKeyBytes(ki.toByteArray(), chainCode);
    }

    public enum PublicDeriveMode {
        NORMAL,
        WITH_INVERSION
    }

    public static DeterministicKey deriveChildKeyFromPublic(DeterministicKey parent, ChildNumber childNumber,
                                                            PublicDeriveMode mode) throws HDDerivationException {
        RawKeyBytes rawKey = deriveChildKeyBytesFromPublic(parent, childNumber, PublicDeriveMode.NORMAL);
        return new DeterministicKey(parent.getPath().extend(childNumber), rawKey.chainCode,
                new LazyECPoint(ECKey.CURVE.getCurve(), rawKey.keyBytes), null, parent);
    }

    public static RawKeyBytes deriveChildKeyBytesFromPublic(DeterministicKey parent, ChildNumber childNumber, PublicDeriveMode mode) throws HDDerivationException {
        checkArgument(!childNumber.isHardened(), "Hardened derivation is unsupported (%s).", childNumber);
        byte[] parentPublicKey = parent.getPubKeyPoint().getEncoded(true);
        checkState(parentPublicKey.length == 33, "Parent pubkey must be 33 bytes, but is " + parentPublicKey.length);
        ByteBuffer data = ByteBuffer.allocate(37);
        data.put(parentPublicKey);
        data.putInt(childNumber.i());
        byte[] i = HDUtils.hmacSha512(parent.getChainCode(), data.array());
        checkState(i.length == 64, i.length);
        byte[] il = Arrays.copyOfRange(i, 0, 32);
        byte[] chainCode = Arrays.copyOfRange(i, 32, 64);
        //BigInteger ilInt = Utils.bytesToBigInteger(il);
        BigInteger ilInt = new BigInteger(1,il);
        assertLessThanN(ilInt, "Illegal derived key: I_L >= n");

        final BigInteger N = ECKey.CURVE.getN();
        ECPoint Ki;
        switch (mode) {
            case NORMAL:
                Ki = ECKey.publicPointFromPrivate(ilInt).add(parent.getPubKeyPoint());
                break;
            case WITH_INVERSION:
                // This trick comes from Gregory Maxwell. Check the homomorphic properties of our curve hold. The
                // below calculations should be redundant and give the same result as NORMAL but if the precalculated
                // tables have taken a bit flip will yield a different answer. This mode is used when vending a key
                // to perform a last-ditch sanity check trying to catch bad RAM.
                Ki = ECKey.publicPointFromPrivate(ilInt.add(RAND_INT).mod(N));
                BigInteger additiveInverse = RAND_INT.negate().mod(N);
                Ki = Ki.add(ECKey.publicPointFromPrivate(additiveInverse));
                Ki = Ki.add(parent.getPubKeyPoint());
                break;
            default: throw new AssertionError();
        }

        assertNonInfinity(Ki, "Illegal derived key: derived public key equals infinity.");
        return new RawKeyBytes(Ki.getEncoded(true), chainCode);
    }

    private static void assertNonZero(BigInteger integer, String errorMessage) {
        if (integer.equals(BigInteger.ZERO))
            throw new HDDerivationException(errorMessage);
    }

    private static void assertNonInfinity(ECPoint point, String errorMessage) {
        if (point.equals(ECKey.CURVE.getCurve().getInfinity()))
            throw new HDDerivationException(errorMessage);
    }

    private static void assertLessThanN(BigInteger integer, String errorMessage) {
        if (integer.compareTo(ECKey.CURVE.getN()) > 0)
            throw new HDDerivationException(errorMessage);
    }

    public static class RawKeyBytes {
        public final byte[] keyBytes, chainCode;

        public RawKeyBytes(byte[] keyBytes, byte[] chainCode) {
            this.keyBytes = keyBytes;
            this.chainCode = chainCode;
        }
    }
}
