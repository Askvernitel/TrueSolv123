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
    public static Boolean insertItem(AddItemDTO item){
        try{ 
            System.debug(item);
            Boolean isValid = Validator.checkItem(item);
            System.debug(item.name);
            if(!isValid){
                throw new AuraHandledException('INVALID');
            }
            Item__c newItem = new Item__c(Name__c=item.name, Description__c=item.description,Family__c=item.family,Price__c=item.price, Type__c=item.type);
            insert newItem;
            return true;
        }catch(Exception e){
            System.debug('Item Insert: ' + e.getMessage() + e.getCause() + e.getLineNumber() + e.getTypeName());
            throw new AuraHandledException(e.getMessage());
        }
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