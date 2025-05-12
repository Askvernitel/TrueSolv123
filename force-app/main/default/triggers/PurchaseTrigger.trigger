trigger PurchaseTrigger on PurchaseLine__c (before insert) {
    for (PurchaseLine__c pl : Trigger.new) {
        pl.Name = 'New Purchase Line';
    }
}