package devtov.calypsoapp.util;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class EmailUtils {

    private String MESSAGE_AUTH = "<!DOCTYPE html>\n" +
            "    <html lang=\"en\" xmlns:th=\"http://www.thymeleaf.org\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
            "    <head>\n" +
            "        <meta charset=\"utf-8\"> <!-- utf-8 works for most cases -->\n" +
            "        <meta name=\"viewport\" content=\"width=device-width\"> <!-- Forcing initial-scale shouldn't be necessary -->\n" +
            "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <!-- Use the latest (edge) version of IE rendering engine -->\n" +
            "        <meta name=\"x-apple-disable-message-reformatting\">  <!-- Disable auto-scale in iOS 10 Mail entirely -->\n" +
            "        <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->\n" +
            "    \n" +
            "        <link href=\"https://fonts.googleapis.com/css?family=Lato:300,400,700\" rel=\"stylesheet\">\n" +
            "    \n" +
            "        <!-- CSS Reset : BEGIN -->\n" +
            "     </head>\n" +
            "    \n" +
            "    <body style=\"background-color: #1b1e1f;\">\n" +
            "    <table classname=\"body-wrap\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n" +
            "        <tbody>\n" +
            "            <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0\">\n" +
            "                <td style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n" +
            "                <td classname=\"container\" width=\"600\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                    font-size: 14px; vertical-align: top; display: block !important;\n" +
            "                    max-width: 600px !important; clear: both; margin: 0 auto;\" valign=\"top\">\n" +
            "                    <div classname=\"content\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                        font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n" +
            "                        <table classname=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                            box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n" +
            "                            <tbody>\n" +
            "                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; font-size: 14px; margin: 0;\">\n" +
            "                                    <td classname=\"content-wrap\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                        box-sizing: border-box; color: #495057; font-size: 14px;\n" +
            "                                        vertical-align: top; margin: 0; padding: 30px;\n" +
//            "                                        box-shadow: 18px 20px 15px rgb(0 0 0 / 6%); border-radius: 24px;\n" +
            "                                        border-radius: 24px;\n" +
            "                                        background-color: #16302d;\" valign=\"top\">\n" +
            "                                        <meta itemprop=\"name\" content=\"Confirm\" email=\"\" style=\"font-family: Robot, sansSerif; box-sizing: border-box;\n" +
            "                                            font-size: 14px; margin: 0;\">\n" +
            "                                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                            font-size: 14px; margin: 0;\">\n" +
            "                                            <tbody>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                                    font-size: 14px; margin: 0;\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                                        box-sizing: border-box; font-size: 14px;\n" +
            "                                                        vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n" +
            "                                                        <div style=\"text-align: center;\">\n" +
            "                                                                       <img style=\"background-color: #1b1e1f;border-radius: 20px;\" src=\"cid:image\"  />                                            "   +
             "                                                        </div>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                                    font-size: 14px; margin: 0;\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px; text-align: center;\" align=\"top\">\n" +
            "                                                        <h4 style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                                            margin-bottom: 0px; font-weight: 800; line-height: 1.5; color: #037867;\">\n" +
            "                                                            Please Verify your email</h4>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;; color: #ffffff;\n" +
            "                                                        box-sizing: border-box; font-size: 15px;\n" +
            "                                                        vertical-align: top; margin: 0; padding: 0 0 12px;\n" +
            "                                                        text-align: center;\" valign=\"top\">\n" +
            "                                                        <p style=\"margin-bottom: 13px; line-height: 1.5;\">Please validate your email address in order to get started using product.</p>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0;\">\n" +
            "                                                    <td style=\"padding: 0 20%;\">\n" +
            "                                                        <table style=\"width: 100%;\">\n" +
            "                                                            <tbody style=\"text-align: center;\">\n" +
            "                                                                <tr><td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                            ___number___0___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                            ___number___1___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                             ___number___2___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                             ___number___3___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                            </tr></tbody>\n" +
            "                                                        </table>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                            </tbody>\n" +
            "                                        </table>\n" +
            "                                    </td>\n" +
            "                                </tr>\n" +
            "                            </tbody>\n" +
            "                        </table>\n" +
            "                        <div style=\"text-align: center; margin: 28px auto 0px auto;\">\n" +
            "                            <h4 style=\"font-size: 16px; font-weight: 800; color: #ffffff;\">Need Help ?</h4>\n" +
            "                            <p style=\"color: #878a99;\">Please send and feedback or bug info to\n" +
            "                                <link to=\"/\" style=\"font-weight: 500px;\">info@calypso.icu\n" +
            "                            </p>\n" +
            "                            <p style=\"font-family: &quot;Roboto, sans-serif&quot;; font-size: 14px; color: #98a6ad;\n" +
            "                                margin: 0px;\">2024 Calypso</p>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </td>\n" +
            "            </tr>\n" +
            "        </tbody>\n" +
            "    </table>\n" +
            "\n" +
            "\n" +
            "</body>" +
            "    </html>";

    private String MESSAGE_RECEIVE = "<!DOCTYPE html>\n" +
            "    <html lang=\"en\" xmlns:th=\"http://www.thymeleaf.org\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
            "    <head>\n" +
            "        <meta charset=\"utf-8\"> <!-- utf-8 works for most cases -->\n" +
            "        <meta name=\"viewport\" content=\"width=device-width\"> <!-- Forcing initial-scale shouldn't be necessary -->\n" +
            "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"> <!-- Use the latest (edge) version of IE rendering engine -->\n" +
            "        <meta name=\"x-apple-disable-message-reformatting\">  <!-- Disable auto-scale in iOS 10 Mail entirely -->\n" +
            "        <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->\n" +
            "    \n" +
            "        <link href=\"https://fonts.googleapis.com/css?family=Lato:300,400,700\" rel=\"stylesheet\">\n" +
            "    \n" +
            "        <!-- CSS Reset : BEGIN -->\n" +
            "     </head>\n" +
            "    \n" +
            "    <body style=\"background-color: #1b1e1f;\">\n" +
            "    <table classname=\"body-wrap\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; width: 100%; background-color: transparent; margin: 0;\">\n" +
            "        <tbody>\n" +
            "            <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0\">\n" +
            "                <td style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;\" valign=\"top\"></td>\n" +
            "                <td classname=\"container\" width=\"600\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                    font-size: 14px; vertical-align: top; display: block !important;\n" +
            "                    max-width: 600px !important; clear: both; margin: 0 auto;\" valign=\"top\">\n" +
            "                    <div classname=\"content\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                        font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;\">\n" +
            "                        <table classname=\"main\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" itemprop=\"action\" itemscope=\"\" itemtype=\"http://schema.org/ConfirmAction\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                            box-sizing: border-box; font-size: 14px; border-radius: 3px; margin: 0; border: none;\">\n" +
            "                            <tbody>\n" +
            "                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; font-size: 14px; margin: 0;\">\n" +
            "                                    <td classname=\"content-wrap\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                        box-sizing: border-box; color: #495057; font-size: 14px;\n" +
            "                                        vertical-align: top; margin: 0; padding: 30px;\n" +
//            "                                        box-shadow: 18px 20px 15px rgb(0 0 0 / 6%); border-radius: 24px;\n" +
            "                                        border-radius: 24px;\n" +
            "                                        background-color: #16302d;\" valign=\"top\">\n" +
            "                                        <meta itemprop=\"name\" content=\"Confirm\" email=\"\" style=\"font-family: Robot, sansSerif; box-sizing: border-box;\n" +
            "                                            font-size: 14px; margin: 0;\">\n" +
            "                                        <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                            font-size: 14px; margin: 0;\">\n" +
            "                                            <tbody>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                                    font-size: 14px; margin: 0;\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                                        box-sizing: border-box; font-size: 14px;\n" +
            "                                                        vertical-align: top; margin: 0; padding: 0 0 20px;\" valign=\"top\">\n" +
            "                                                        <div style=\"text-align: center;\">\n" +
            "                                                                       <img style=\"background-color: #1b1e1f;border-radius: 20px;\" src=\"cid:image\"  />                                            "   +
            "                                                        </div>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box;\n" +
            "                                                    font-size: 14px; margin: 0;\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 24px; vertical-align: top; margin: 0; padding: 0 0 10px; text-align: center;\" align=\"top\">\n" +
            "                                                        <h4 style=\"font-family: &quot;Roboto, sans-serif&quot;;\n" +
            "                                                            margin-bottom: 0px; font-weight: 800; line-height: 1.5; color: #037867;\">\n" +
            "                                                            Please Verify your email</h4>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0\">\n" +
            "                                                    <td classname=\"content-block\" style=\"font-family: &quot;Roboto, sans-serif&quot;; color: #ffffff;\n" +
            "                                                        box-sizing: border-box; font-size: 15px;\n" +
            "                                                        vertical-align: top; margin: 0; padding: 0 0 12px;\n" +
            "                                                        text-align: center;\" valign=\"top\">\n" +
            "                                                        <p style=\"margin-bottom: 13px; line-height: 1.5;\">Please validate your email address in order to get started using product.</p>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                                <tr style=\"font-family: &quot;Roboto, sans-serif&quot;; box-sizing: border-box; font-size: 14px; margin: 0;\">\n" +
            "                                                    <td style=\"padding: 0 20%;\">\n" +
            "                                                        <table style=\"width: 100%;\">\n" +
            "                                                            <tbody style=\"text-align: center;\">\n" +
            "                                                                <tr><td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                            ___number___0___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                            ___number___1___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                             ___number___2___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                                <td style=\"width: 25%; height: 80px; padding: 20px 8px;\">\n" +
            "                                                                    <div style=\"width: 100%; height: 100%; border-radius: 16px; background-color: #1b1e1f; color: #037867; font-size: 24px; font-weight: 800;\">\n" +
            "                                                                        <div style=\"padding-top: 24px;\">\n" +
            "                                                                             ___number___3___\n" +
            "                                                                        </div>\n" +
            "                                                                    </div>\n" +
            "                                                                </td>\n" +
            "                                                            </tr></tbody>\n" +
            "                                                        </table>\n" +
            "                                                    </td>\n" +
            "                                                </tr>\n" +
            "                                            </tbody>\n" +
            "                                        </table>\n" +
            "                                    </td>\n" +
            "                                </tr>\n" +
            "                            </tbody>\n" +
            "                        </table>\n" +
            "                        <div style=\"text-align: center; margin: 28px auto 0px auto;\">\n" +
            "                            <h4 style=\"font-size: 16px; font-weight: 800; color: #ffffff;\">Need Help ?</h4>\n" +
            "                            <p style=\"color: #878a99;\">Please send and feedback or bug info to\n" +
            "                                <link to=\"/\" style=\"font-weight: 500px;\">info@calypso.icu\n" +
            "                            </p>\n" +
            "                            <p style=\"font-family: &quot;Roboto, sans-serif&quot;; font-size: 14px; color: #98a6ad;\n" +
            "                                margin: 0px;\">2024 Calypso</p>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </td>\n" +
            "            </tr>\n" +
            "        </tbody>\n" +
            "    </table>\n" +
            "\n" +
            "\n" +
            "</body>" +
            "    </html>";


    public String buildMessageAuth(String code){
        char[] codeArray = code.toCharArray();
        String result = MESSAGE_AUTH;
        result = result.replace("___number___0___", String.valueOf(codeArray[0]));
        result = result.replace("___number___1___", String.valueOf(codeArray[1]));
        result = result.replace("___number___2___", String.valueOf(codeArray[2]));
        result = result.replace("___number___3___", String.valueOf(codeArray[3]));

        return result;
    }


    public String buildMessageReceive(String code){
        char[] codeArray = code.toCharArray();
        String result = MESSAGE_RECEIVE;
        result = result.replace("___number___0___", String.valueOf(codeArray[0]));
        result = result.replace("___number___1___", String.valueOf(codeArray[1]));
        result = result.replace("___number___2___", String.valueOf(codeArray[2]));
        result = result.replace("___number___3___", String.valueOf(codeArray[3]));
        return result;
    }

}
