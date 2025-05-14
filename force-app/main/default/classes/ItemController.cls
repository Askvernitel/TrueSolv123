public with sharing class ItemController {

    public ItemController() {
    }
    @AuraEnabled
    public static List<Item__c> getAllItems(){
        try {
            return [SELECT Name__c, Description__c, Family__c, Image__c,Price__c,Type__c FROM Item__c];
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
    @AuraEnabled 
    public static Boolean insertItem(Id userId, String jsonData){
            if(userId != UserInfo.getUserId() || !UserController.isManager(userId)){
                return false;
            }
            System.debug(jsonData);
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonData);
            String name = (String) data.get('Name__c');
            String description = (String) data.get('Description__c');
            String family = (String) data.get('Family__c');
            String type = (String) data.get('Type__c');
            Decimal price = Decimal.valueOf(String.valueOf(data.get('Price__c')));
            System.debug('PRICE: '+price);
     
            String rawJson =UnsplashAPIService.getImage(name);
            String url = UnsplashAPIService.urlExtract(rawJson);
            System.debug(url);

            Item__c newItem = new Item__c(Name__c=name, Description__c=description,Family__c=family,Price__c=price, Type__c=type, Image__c=url);
            insert newItem;
            return true;
    }
    //For Test Purposes
    @AuraEnabled
    public static void cleanUp(){
        try {
            List<Item__c> items = [SELECT Id FROM Item__c];
            delete items;
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getImageUrlByItemId(Id itemId){
        try {
            List<Item__c> item = [SELECT Image__c FROM Item__c WHERE Id = :itemId LIMIT 1];
            if(item.isEmpty()){
                return null;
            }
            String str = item[0].Image__c;
            return str;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Item__c getItemById(Id itemId){
        try {
            List<Item__c> item = [SELECT Name__c, Price__c, Image__c, Description__c, Family__c, Type__c FROM Item__c WHERE Id = :itemId LIMIT 1];
            if(item.isEmpty()){
                return null;
            }
            return item[0];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<String> getAllItemTypes(){
        try {
            Schema.DescribeFieldResult F = Item__c.Type__c.getDescribe();
            List<Schema.PicklistEntry> P = F.getPicklistValues();
            
            List<String> types = new List<String>(); 
            for(Schema.PicklistEntry val:P){

                types.add(val.getLabel());
            }
            return types;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<String> getAllItemFamilies(){
        try {
            Schema.DescribeFieldResult F = Item__c.Family__c.getDescribe();
            List<Schema.PicklistEntry> P = F.getPicklistValues();
            
            List<String> families = new List<String>(); 
            for(Schema.PicklistEntry val:P){
                families.add(val.getLabel());
            }
            return families;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}