/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class PurchaseControllerTest {

    @isTest
    static void makePurchaseTest() {
        //----prepare creds
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        User testUser = new User(
            Username = 'runas@example.com',
            LastName = 'RunAs',
            Email = 'runas@example.com',
            Alias = 'rausr',
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = p.Id,
            LanguageLocaleKey = 'en_US',
            isManager__c = false
        );
        insert testUser;
        Account testAccount = new Account(Name='testAccount', OwnerId=testuser.Id);
        insert testAccount;
        //----prepare items
        String testName = 'testName';
        String testDesc = 'testDesc';
        String testFamily = 'ELECTRONICS';
        Integer testPrice = 100;
        String testType = 'BEVERAGE';
        String testUrl = 'http://test.idk.cool.site.com';

        Item__c newItem = new Item__c(Name__c=testName, Description__c=testDesc,Family__c=testFamily,Price__c=testPrice, Type__c=testType, Image__c=testUrl);
        insert newItem;


        List<Item__c> testItems = [SELECT Id,Price__c FROM Item__c LIMIT 5];
        List<Purchase__c> testPurchases = [SELECT Id FROM Purchase__c];
        List<PurchaseLine__c> testPurchaseLines = [SELECT Id FROM PurchaseLine__c];
        List<Integer> amounts = new List<Integer>();

        Integer minAmount = 1;
        Integer maxAmount = 50;
        Integer totalAmount = 0;
        Decimal grandTotal = 0;
        for(Integer i = 0; i < testItems.size();i++){
            Integer randomInteger= (Math.random()*(maxAmount - minAmount)).intValue() +minAmount;
            amounts.add(randomInteger);
            totalAmount += randomInteger;
            grandTotal += testItems[i].Price__c*randomInteger;
        }
        List<Map<String,Object>> jsonMap = new List<Map<String,Object>>();
        for(Integer i = 0;i < testItems.size();i++){
            Map<String,Object> jsonPurchasedMap = new Map<String,Object>();
            jsonPurchasedMap.put('itemId', testItems[i].Id);
            jsonPurchasedMap.put('amount', amounts[i]);
            jsonMap.add(jsonPurchasedMap);
        }

        String jsonData = JSON.serialize(jsonMap);
        Boolean purchaseMade = false;
        Test.startTest();
        System.runAs(testUser){
        purchaseMade = PurchaseController.makePurchase(testUser.Id, jsonData);
        }
        Test.stopTest();

        Id testAccountId = testAccount.Id;
        List<Purchase__c> createdPurchases = [SELECT Id, TotalItems__c, Grandtotal__c FROM Purchase__c WHERE Id NOT IN :testPurchases LIMIT 1];
        List<PurchaseLine__c> createdPurchaseLines = [SELECT Id FROM PurchaseLine__c];

        System.assert(purchaseMade, 'Purchase Not Made');
        System.assert(createdPurchaseLines.size() == testItems.size(), 'Incorrect Amount Of Items Created');
        System.assert(!createdPurchases.isEmpty(), 'Purchase Not Added');

        Purchase__c createdPurchase =  createdPurchases[0];
        System.assertEquals(totalAmount, createdPurchase.TotalItems__c, 'Incorrect Amount Of Total Items');
        System.assertEquals(grandTotal, createdPurchase.GrandTotal__c, 'Incorrect Grand Total Price Of Items');

    }
}