public with sharing class UnsplashAPIService {
    public UnsplashAPIService() {

    }

    public static String getImage(String query){
        HttpRequest req = new HttpRequest();
        req.setEndpoint('api.unsplash.com/search/photos?query=' + EncodingUtil.urlEncode(query, 'UTF-8'));
        req.setMethod('GET');

        req.setHeader('Authorization', 'Client-ID' + getApiKey());

        Http http = new Http();
        HttpResponse resp = http.send(req);

        if (resp.getStatusCode() == 200) {
            return resp.getBody();
        } else {
            throw new CalloutException('Unsplash API call failed: ' + resp.getStatus());
        }
    }
    //This Should be saved in env or db logically could be more save
    public static String getApiKey(){
        return 'uoTwCf9t7ttrqp3q1OHpNp6nBNo2iybJcwUdZ9iwdQA';
    }
    
}