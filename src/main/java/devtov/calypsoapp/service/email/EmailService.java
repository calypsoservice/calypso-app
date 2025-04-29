package devtov.calypsoapp.service.email;

import devtov.calypsoapp.enums.EmailType;
import devtov.calypsoapp.util.EmailUtils;
import devtov.calypsoapp.util.RandomizerUtils;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final EmailUtils emailUtils;
    private final RandomizerUtils randomizerUtils;
    private final String SENDER = "support@calypso.icu";


    public void sendSimpleEmail(String toAddress, String code,EmailType emailType) {


        try {


            String body = "";
            String subject = "";

            if (emailType.equals(EmailType.AUTH)) {
                subject = "Welcome to Calypso service!";
                body = emailUtils.buildMessageAuth(code);
            } else if (emailType.equals(EmailType.RECEIVE)) {
                subject = "Welcome to Calypso service!";
                body = emailUtils.buildMessageReceive(code);
            }


            MimeMessage message = javaMailSender.createMimeMessage();

            message.setFrom(new InternetAddress(SENDER));
            message.setRecipients(MimeMessage.RecipientType.TO, toAddress);
            message.setSubject(subject);
            message.setHeader("Content-ID", "<image>");
            message.setContent(body, "text/html; charset=utf-8");

//
            DataSource imgFile = new FileDataSource("datahub/123123123.png");
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(new InternetAddress(SENDER));
            helper.setSentDate(new Date());
            helper.setText(body, true);
            helper.addInline("image", imgFile);


//
            javaMailSender.send(message);

        } catch (Exception ex) {
            log.warn("Email exception.", ex);
        }
    }


}
