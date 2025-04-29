import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {
  TW,
  initWasm,
  WalletCore,
  KeyStore,
  CoinType,
  Curve,
  HDWallet
} from '@trustwallet/wallet-core'
import { STATUS_CODES, request } from 'http'
import { StatusCodes } from 'http-status-codes'
import { TextDecoder } from 'text-encoding'
import * as fs from 'fs'
import {
  HexCoding,
  Mnemonic
} from '@trustwallet/wallet-core/dist/src/wallet-core'
import dotenv from 'dotenv'
import getAddresses from './getAddresses'
import { mnemonicToKeyPair } from 'tonweb-mnemonic'
import TonWeb from 'tonweb'
import { address, networks, Transaction } from 'bitcoinjs-lib'
import axios from 'axios'

dotenv.config()

const app: Express = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
const routes = express.Router()

const wasm = initWasm()

routes.get(
  '/new-account/:len',
  async (request: Request, response: Response) => {
    console.log('NEW ACCOUNT')
    try {
      if (request.method == 'POST') {
        return response
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .json({ success: true })
      }
      const core = await wasm.then(core => {
        return core
      })
      const wallet = core.HDWallet.create(
        request.params.len ? Number(request.params.len) : 128,
        ''
      )
      const data = {
        mnemonic: wallet.mnemonic()
      }
      // var addresses = getAddresses(wallet, core)
      return response.status(StatusCodes.OK).json({ success: true, data: data })
    } catch (error) {
      console.log(error)
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false })
    }
  }
)

routes.get(
  '/get-account/:mnemonic',
  async (request: Request, response: Response) => {
    console.log('GET ACCOUNT')
    try {
      if (request.method == 'POST') {
        return response
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .json({ success: true })
      }
      const core = await wasm.then(core => {
        return core
      })
      try {
        const wallet = core.HDWallet.createWithMnemonic(
          request.params.mnemonic,
          ''
        )
        const data = {
          mnemonic: wallet.mnemonic()
        }
        var addresses = getAddresses(wallet, core)
        return response
          .status(StatusCodes.OK)
          .json({ success: true, data: data, addresses: addresses })
      } catch {
        return response.status(StatusCodes.OK).json({ success: false })
      }
    } catch (error) {
      console.log(error)
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false })
    }
  }
)

routes.get(
  '/check-account/:mnemonic',
  async (request: Request, response: Response) => {
    console.log('CHECK ACCOUNT')
    try {
      if (request.method == 'POST') {
        return response
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .json({ success: true })
      }
      const core = await wasm.then(core => {
        return core
      })
      try {
        const wallet = core.HDWallet.createWithMnemonic(
          request.params.mnemonic,
          ''
        )
        return response.status(StatusCodes.OK).json({ success: true })
      } catch {
        return response.status(StatusCodes.OK).json({ success: false })
      }
    } catch (error) {
      console.log(error)
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false })
    }
  }
)

routes.get(
  '/send-ton/:mnemonic',
  async (request: Request, response: Response) => {
    console.log('SEND TON')
    try {
      if (request.method == 'POST') {
        return response
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .json({ success: true })
      }
      //   const core = await wasm.then(core => {
      //     return core
      //   })
      try {
        // const wallet = core.HDWallet.createWithMnemonic(
        //   request.params.mnemonic,
        //   ''
        // )
        // const provider = new TonWeb.HttpProvider(
        //   'https://toncenter.com/api/v2/jsonRPC',
        //   {
        //     apiKey: undefined
        //   }
        // )
        // async function start () {
        //   const wordsString = request.params.mnemonic.trim()
        //   const words = wordsString
        //     .replace(/,/g, ' ')
        //     .split(/\s+/)
        //     .map((word: string) => word.trim())
        //     .filter((word: string) => Boolean(word))
        //   const keyPair = await mnemonicToKeyPair(words)
        //   var data: any = {
        //     privateKey: null,
        //     publicKey: null,
        //     wallets: [],
        //     v4R2: null
        //   }
        //   console.log(data)
        //   data.publicKey = {
        //     label: 'Public key',
        //     values: [TonWeb.utils.bytesToHex(keyPair.publicKey)]
        //   }
        //   console.log(data)
        //   data.privateKey = {
        //     label: 'Private key',
        //     values: [TonWeb.utils.bytesToHex(keyPair.secretKey)]
        //   }
        //   for (const walletConstructor of TonWeb.Wallets.list) {
        //     const wallet = new walletConstructor(provider, {
        //       publicKey: keyPair.publicKey
        //     })
        //     const address = await wallet.getAddress()
        //     data.wallets.push({
        //       label: `Wallet: ${wallet.getName()}`,
        //       values: [
        //         address.toString(false),
        //         address.toString(true, true, true),
        //         address.toString(true, true, false),
        //         address.toString(false, true, true)
        //       ]
        //     })
        //     console.log(data)
        //   }
        //   const walletConstructor = TonWeb.Wallets.all.v4R2
        //   const v4R2 = new walletConstructor(provider, {
        //     publicKey: keyPair.publicKey
        //   })
        //   const addressv4R2 = await v4R2.getAddress()
        //   data.v4R2 = {
        //     label: `Wallet: ${v4R2.getName()}`,
        //     values: [
        //       addressv4R2.toString(false),
        //       addressv4R2.toString(true, true, true),
        //       addressv4R2.toString(true, true, false),
        //       addressv4R2.toString(false, true, true),
        //       addressv4R2.wc
        //     ]
        //   }
        //   console.log(data)

        //   //   const key = await mnemonicToWalletKey(words)
        //   //   const wallet = WalletContractV4.create({
        //   //     publicKey: key.publicKey,
        //   //     workchain: 0
        //   //   })

        //   //   // print wallet address
        //   //   console.log(wallet.address.toString({ urlSafe: true }))

        //   let keyPair2 = await mnemonicToPrivateKey(words)

        //   // Create wallet contract
        //   let wallet2 = WalletContractV4.create({
        //     publicKey: keyPair2.publicKey,
        //     workchain: 0 // Usually you need a workchain 0
        //   })
        //   let wallet = WalletContractV5R1.create({
        //     publicKey: keyPair2.publicKey,
        //     workchain: 0 // Usually you need a workchain 0,
        //   })
        //   console.log('\nwalletV4R1:')
        //   console.log(
        //     wallet2.address.toString({ urlSafe: true, bounceable: true })
        //   )
        //   console.log('\nwalletV5R1:')
        //   console.log(
        //     wallet.address.toString({ urlSafe: true, bounceable: true })
        //   )
        //   const USER_ADDRESS = Address.parse(
        //     'UQAI6XTTalXInT7E-2IU1KH6f6KnBEdS52udr9mKKCFybUxQ'
        //   )
        //   console.log('\nUser Address')
        //   console.log(USER_ADDRESS.toString({ urlSafe: true }))
        //   return data
        // }
        const transfer = async () => {
          console.log('\nTRANSFER\n')
          const wordsString = request.params.mnemonic.trim()
          const words = wordsString
            .replace(/,/g, ' ')
            .split(/\s+/)
            .map((word: string) => word.trim())
            .filter((word: string) => Boolean(word))
          const keyPair = await mnemonicToKeyPair(words).catch(e =>
            console.log(`Keypair: ${e}`)
          )
          if (!keyPair) return 'error'
          console.log(`Key Pair: ${keyPair.publicKey.toString()}`)
          const tonweb = new TonWeb()
          //   console.log(keyPair)
          const wallet = tonweb.wallet.create({ publicKey: keyPair.publicKey })

          const address = await wallet
            .getAddress()
            .catch(e => console.log(`Address: ${e}`))
          //   console.log(address)
          if (!address) return 'error'
          console.log(`Address: ${address.toString(true, true, false)}`)

          //   const nonBounceableAddress = address.toString(true, true, false)
          //   console.log(`get seqno`)
          //   const seqno = await wallet.methods
          //     .seqno()
          //     .call()
          //     .catch(e => console.log(`Seqno: ${e}`))
          //   console.log(seqno)

          //   await wallet.deploy(keyPair.secretKey).send().catch(e => console.log(`Wallet: ${e}`)) // deploy wallet to blockchain

          //   if (!seqno) return 'error'
          //   console.log(`Seqno: ${seqno}`)
          //   console.log(`get balance`)
          //   const balance = await tonweb
          //     .getBalance(address)
          //     .catch(e => console.log(`Balance: ${e}`))
          //   console.log(balance)
          console.log('send')
          const fee = await wallet.methods
            .transfer({
              secretKey: keyPair.secretKey,
              toAddress: 'EQD5mxRgCuRNLxKxeOjG6r14iSroLF5FtomPnet-sgP5xNJb',
              amount: TonWeb.utils.toNano('0.01'), // 0.01 TON
              seqno: 1,
              //   payload: 'Hello',
              sendMode: 3
            })
            // .estimateFee()
            .send()
            .then(r => console.log(`Fee response: ${r}`))
            .catch(e => console.log(`Fee: ${e}`))

          console.log(`fee: ${fee}`)
          const Cell = TonWeb.boc.Cell
          const cell = new Cell()
          cell.bits.writeUint(0, 32)
          cell.bits.writeAddress(address)
          cell.bits.writeGrams(1)
          console.log('CELL')
          console.log(cell.print()) // print cell data like Fift
          const bocBytes = await cell
            .toBoc()
            .catch(e => console.log(`BOC: ${e}`))
          if (!bocBytes) return 'error'
          tonweb.sendBoc(bocBytes)
          return 'COmpleted'
        }
        console.log(transfer())
        return response.status(StatusCodes.OK).json({ success: true })
      } catch {
        return response.status(StatusCodes.OK).json({ success: false })
      }
    } catch (error) {
      console.log(error)
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false })
    }
  }
)

app.use('/', routes)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

const getBtcTransactionData = (hash: string) => {
  var tx = Transaction.fromHex(hash)
  console.log(tx.getId())
  // const dt_inputs = tx.ins.map((_in: any) => {
  //   _in.address = address.fromOutputScript(_in.script, networks.bitcoin);
  //   return _in;
  // })
  const dt_outputs = tx.outs.map((_in: any) => {
    _in.address = address.fromOutputScript(_in.script, networks.bitcoin)
    return _in
  })
  // console.log(dt_inputs)
  console.log()
  console.log(dt_outputs)
  // axios.get("https://go.getblock.io/6faa07e99a4a42318197845403a33f91", {data: {
  //   method: "gettransaction",
  //   params: ["1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d", 0]
  // }, headers: {"Content-Type": "application/json"}})
  //   .then(r => {
  //     console.log(r)
  //   })
  //   .catch(e => {
  //     console.log(e)
  //   })
  //   var myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");

  // var raw = JSON.stringify({
  //   "method": "getrawtransaction",
  //   "params": [
  //     "10b54fd708ab2e5703979b4ba27ca0339882abc2062e77fbe51e625203a49642",
  //     0
  //   ]
  // });

  // var requestOptions: RequestInit = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: raw,
  //   redirect: 'follow'
  // };

  // fetch("https://docs-demo.btc.quiknode.pro/", requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));
}

getBtcTransactionData(
  '01000000000101e17e03d21d051aa2bd9d336c3ac0693cfa92ce71592ceec521b1c48019ff77a101000000171600146d76e574b5f4825fe740ba6c41aaf1b319dfb80cffffffff02819a010000000000160014422002d927a1cae901eac668444cce8dd0ae60d529b31b0b0000000017a914f5b48d1130dc3d366d1eabf6783a552d1c8e08f4870247304402206701306a4750908fd48dead54331a3c7b4dce04ec10bfc6dd32049e2cff061a5022013c9d66827fabbeaadeb30b41c09aca2daddf4628cd00e3b993b1c86a12ff5190121034bcb9be1daf6ce1193774d15f863768b621bc95a363f1da5810129e961a2317400000000'
)

// curl -X POST -H "Content-Type: application/json" -d '{"method": "getrawtransaction", "params": ["10b54fd708ab2e5703979b4ba27ca0339882abc2062e77fbe51e625203a49642", 0]}' https://go.getblock.io/6faa07e99a4a42318197845403a33f91

// curl -X POST -H "Content-Type: application/json" --data '{\"method\": \"getrawtransaction\", \"params\": [\"10b54fd708ab2e5703979b4ba27ca0339882abc2062e77fbe51e625203a49642\", 0]}' https://docs-demo.btc.quiknode.pro/

async function getConfirmations (transactionId: string) {
  try {
    const response = await axios.get(
      `https://blockchain.info/rawtx/${transactionId}`
    )
    const blockHeight = response.data.block_height
    const currentBlockHeight = await axios
      .get(`https://blockchain.info/latestblock`)
      .then(res => {console.log(res.data.height - blockHeight + 1); return res.data.height})

    const confirmations = currentBlockHeight - blockHeight + 1
    return confirmations
  } catch (error) {
    console.error(error)
  }
}

console.log(getConfirmations("10b54fd708ab2e5703979b4ba27ca0339882abc2062e77fbe51e625203a49642"))

