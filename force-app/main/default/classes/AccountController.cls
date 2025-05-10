public with sharing class AccountController {
    public AccountController() {

    }
    @AuraEnabled(cacheable=true)
    public static Account getAccountByUserId(Id userId){
        List<Account> account = [SELECT Name,AccountNumber,Industry FROM Account WHERE OwnerId = :userId LIMIT 1];
        if(!account.isEmpty()){
            return account[0];
        }
        return null;
    }
}