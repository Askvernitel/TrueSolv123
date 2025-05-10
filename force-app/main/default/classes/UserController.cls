public with sharing class UserController {
    public UserController() {

    }
    @AuraEnabled
    public static User getUserById(Id userId){
        System.debug(userId);
        List<User> accounts = [SELECT Id,Name FROM User WHERE Id = :userId LIMIT 1];
        if(!accounts.isEmpty()){
            return accounts[0];
        }else {
            System.debug('No Account Found');
            return null;
        }
    }
}