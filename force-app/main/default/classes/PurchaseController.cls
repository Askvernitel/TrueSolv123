public with sharing class PurchaseController {
    public static Id accountId;
    public PurchaseController() {

    }
    //it is more logical to return reason but i return bool
    @AuraEnabled
    public static Boolean makePurchase(Id userId, String itemIdsJson) {
        if(userId != UserInfo.getUserId()){
            return false;
        }
        System.debug('ITEMS ' + itemIdsJson);
        List<Object> data = (List<Object>) JSON.deserializeUntyped(itemIdsJson);
        System.debug(data);
        Account account = AccountController.getAccountByUserId(userId);
        System.debug('ACCOUNt ' + account);
        if(account == null){
            return false;
        }
        PurchaseController.accountId = account.Id;

        System.debug('DATA ' + data);
        List<PurchaseLine__c> purchaseLines = new List<PurchaseLine__c>();
        for(Object elem : data){
            System.debug(elem);
            Map<String,Object> it = (Map<String,Object>)elem;
            Id itemId = Id.valueOf(((String)it.get('itemId')));
            System.debug('ItemID ' + itemId);
            Integer amount = Integer.valueOf(String.valueOf(it.get('amount')));
            System.debug('amount ' + amount);
            Item__c item = ItemController.getItemById(itemId);
            PurchaseLine__c currentPurchaseLine = new PurchaseLine__c(ItemId__c=itemId, Amount__c=amount, UnitCost__c=item.Price__c);
            purchaseLines.add(currentPurchaseLine);
        }
        insert purchaseLines;
        return true;
    }
    
}