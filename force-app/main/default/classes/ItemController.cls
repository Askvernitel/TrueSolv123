public with sharing class ItemController {
    public ItemController() {
    }
    @AuraEnabled
    public static List<Item__c> getAllItems(){
        try {
            return [SELECT Name__c FROM Item__c];
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled 
    public static Boolean insertItem(){
        try{ 
            Item__c newItem = new Item__c(Name__c='New Item');
            insert newItem;
            return true;
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

}
