public with sharing class UnsplashAPIService {
    public UnsplashAPIService() {

    }

    public static String getImage(String query){
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.unsplash.com/search/photos?query=' + EncodingUtil.urlEncode(query, 'UTF-8'));
        req.setMethod('GET');

        req.setHeader('Authorization', 'Client-ID '+ getApiKey());
        Http http = new Http();
        HttpResponse resp = http.send(req);

            
        System.debug('Image Request '+ resp.getBody());
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

    public static String urlExtract(String rawJson){   
        Map<String, Object> json = (Map<String, Object>) JSON.deserializeUntyped(rawJson);
        List<Object> results = (List<Object>) json.get('results');
        if (results != null && !results.isEmpty()) {
            Map<String, Object> firstResult = (Map<String, Object>) results[0];
            Map<String, Object> imgUrls = (Map<String, Object>) firstResult.get('urls');
            return String.valueOf(imgUrls.get('raw'));
        }
        return null;
    }
    
}