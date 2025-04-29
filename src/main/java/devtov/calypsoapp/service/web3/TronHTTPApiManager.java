package devtov.calypsoapp.service.web3;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@AllArgsConstructor
@Slf4j
public class TronHTTPApiManager {

//    https://nile.trongrid.io


        public void checkValidAddress() throws IOException, InterruptedException {
            HttpRequest request = HttpRequest.newBuilder()
//                    .uri(URI.create("https://api.shasta.trongrid.io/wallet/validateaddress"))
                    .uri(URI.create("https://go.getblock.io/ddfd999505e843ed9f00df4a4a3bffa9/wallet/validateaddress"))
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .method("POST", HttpRequest.BodyPublishers.ofString("{\"address\":\"TEjmjXxcqE1ssUostV2y4eLpUQa9fr5eq2\",\"visible\":true}"))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println(response.body());
        }

        public void getAccount() throws IOException, InterruptedException {

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.shasta.trongrid.io/wallet/getaccount"))
                    .header("accept", "application/json")
                    .header("content-type", "application/json")
                    .method("POST", HttpRequest.BodyPublishers.ofString("{\"address\":\"TEjmjXxcqE1ssUostV2y4eLpUQa9fr5eq2\",\"visible\":true}"))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println(response.body());

        }



}
