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
    public static List<Item__c> filterItemsBySearchText(String searchText) {
        System.debug(searchText);
        if(searchText.equals('') || Decimal.valueOf(searchText) == 0){
            return getAllItems();
        }
        List<Item__c> items = [SELECT Id, Name__c, Description__c, Type__c, Family__c, Price__c 
                               FROM Item__c
                               WHERE Name__c LIKE :('%' + searchText + '%') 
                               OR Description__c LIKE :('%' + searchText + '%')];
        return items;
    }
    @AuraEnabled 
    public static List<Item__c> filterItemsByFamilyAndType(String family, String type){
            if(family == 'All' && type == 'All'){
                return getAllItems();
            }else if(family == 'All'){
                return [SELECT Name__c, Description__c, Type__c, Family__c, Image__c,Price__c FROM Item__c WHERE Type__c =: type];
            }else if(type == 'All'){
                return [SELECT Name__c, Description__c, Type__c, Family__c, Image__c,Price__c FROM Item__c WHERE Family__c =: family];
            }
            return [SELECT Name__c, Description__c, Family__c, Image__c,Price__c,Type__c FROM Item__c WHERE Family__c =: family AND Type__c =: type];
    }
    
    @AuraEnabled 
    public static Boolean insertItem(String jsonData){
        //try{
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonData);
            String name = (String) data.get('name');
            String description = (String) data.get('description');
            String family = (String) data.get('family');
            String type = (String) data.get('type');
            Decimal price = Decimal.valueOf(String.valueOf(data.get('price')));
            AddItemDTO item = new AddItemDTO(name,description,price,type,family);
            //Boolean isValid = Validator.checkItem(item);
            /*if(!isValid){
                throw new AuraHandledException('INVALID');
            }*/
            String rawJson =UnsplashAPIService.getImage(name);
            String url = UnsplashAPIService.urlExtract(rawJson);
            System.debug(url);
            Item__c newItem = new Item__c(Name__c=item.name, Description__c=item.description,Family__c=item.family,Price__c=item.price, Type__c=item.type, Image__c=url);
            insert newItem;
            return true;
        /*}catch(Exception e){
            System.debug('Item Insert: ' + e.getMessage() + e.getCause() + e.getLineNumber() + e.getTypeName());
            throw new AuraHandledException(e.getMessage());
        }*/
    }

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