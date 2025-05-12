public with sharing class PurchaseController {
    public static Id accountId;
    public PurchaseController() {

    }
    @AuraEnabled
    public static Boolean makePurchase(Id userId, String itemIdsJson) {
        Map<String,Object> itemsMap = (Map<String,Object>) JSON.deserializeUntyped(itemIdsJson);
        System.debug(itemsMap);
        Account account = getAccountById();
        System.debug('ACCOUNt ' + account);
        if(account == null){
            return false;
        }
        accountId = account.Id;
        List<Object> data = (List<Object>) JSON.deserializeUntyped(itemIdsJson);

        System.debug('DATA ' + data);
        List<PurchaseLine__c> purchaseLines = new List<PurchaseLine__c>();
        for(Object elem : data){
            Map<String,Object> it = (Map<String,Object>)elem;
            Id itemId = Id.valueOf(((String)elem.get('itemId')));
            System.debug('ItemID ' + itemId);
            Integer amount = Integer.valueOf((String)elem.get('amount'));
            System.debug('amount ' + amount);
            Item__c item = ItemController.getItemById(itemId);
            PurchaseLine__c currentPurchaseLine = new PurchaseLine__c(ItemId__c=itemId, Amount__c=amount, UnitCost__c=item.Price__c);
            purchaseLines.add(currentPurchaseLine);
        }
        insert purchaseLines;
        return false;
    }
    
}