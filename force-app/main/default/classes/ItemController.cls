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
            Item__c newItem = new Item__c(Name__c=item.name, Description__c=item.description,Family__c=item.family,Price__c=item.price);
            insert newItem;
            return true;
        }catch(Exception e){
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

}
