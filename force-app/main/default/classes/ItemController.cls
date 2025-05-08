public with sharing class ItemController {
    public ItemController() {
    }
    @AuraEnabled(cacheable=true)
    public static List<Item__c> methodName(){
        try {
            return [SELECT Name FROM Item__c] ;
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
