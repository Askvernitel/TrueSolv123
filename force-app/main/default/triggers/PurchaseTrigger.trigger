trigger PurchaseTrigger on PurchaseLine__c (before insert) {
    Purchase__c purchase = new Purchase__c(ClientId__c=PurchaseController.accountId);
    Decimal grandTotal = 0;
    Integer totalItems = 0;
    //idk what to put in name
    for (PurchaseLine__c pl : Trigger.new) {
        totalItems += (Integer)pl.Amount__c;
        grandTotal = pl.Amount__c * pl.UnitCost__c;
    }
    insert purchase;

    for(PurchaseLine__c pl : Trigger.new){
        pl.PurchaseId__c = purchase.Id;
    }
}