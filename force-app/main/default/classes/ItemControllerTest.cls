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
private class ItemControllerTest {
    @isTest
    static void itemInsertPermissionTest() {
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
        String testName = 'testName';
        String testDesc = 'testDesc';
        String testFamily = 'testFamily';
        Integer testPrice = 100;
        String testType = 'testType';
        String testUrl = 'http://test.idk.cool.site.com';

        Item__c newItem = new Item__c(Name__c=testName, Description__c=testDesc,Family__c=testFamily,Price__c=testPrice, Type__c=testType, Image__c=testUrl);
        String jsonItem = JSON.serialize(newItem);

        Test.startTest();

        System.runAs(testUser){
        ItemController.insertItem(testUser.Id, jsonItem);
        }
        Test.stopTest();
        Id newItemId = newItem.Id;
        List<Item__c> items = [SELECT Name__c, Description__c, Price__c, Family__c, Type__c, Image__c FROM Item__c WHERE Id =: newItemId LIMIT 1];
        
        System.assert(items.isEmpty(), 'Item Not Inserted');
    }

    @isTest 
    static void getAllItemsTest(){
        List<Item__c> itemsList = [SELECT Name__c, Description__c, Family__c, Type__c, Image__c FROM Item__c];

        
        Test.startTest();
        List<Item__c> testItemsList = ItemController.getAllItems();
        Test.stopTest();
        System.assertEquals(itemsList.size(), testItemsList.size(), 'Incorrect Amount Of Items');
    }

    @isTest 
    static void getItemTypesTest(){
            Schema.DescribeFieldResult F = Item__c.Type__c.getDescribe();
            List<Schema.PicklistEntry> P = F.getPicklistValues();
        

            Test.startTest();
            List<String> types = ItemController.getAllItemTypes();
            Test.stopTest();

            for(Schema.PicklistEntry val: P){
                Boolean foundLabel=false;
                for(String str: types){
                    if(str == val.getLabel()){
                        foundLabel = true;
                        break;
                    }
                }
                System.assert(foundLabel, 'Inconsistent Labels');
            }
    }

    @isTest
    static void getItemFamilyTest(){
            Schema.DescribeFieldResult F = Item__c.Family__c.getDescribe();
            List<Schema.PicklistEntry> P = F.getPicklistValues();
        

            Test.startTest();
            List<String> families= ItemController.getAllItemFamilies();
            Test.stopTest();

            for(Schema.PicklistEntry val: P){
                Boolean foundLabel=false;
                for(String str: families){
                    if(str == val.getLabel()){
                        foundLabel = true;
                        break;
                    }
                }
                System.assert(foundLabel, 'Inconsistent Labels');
            }
    }
}