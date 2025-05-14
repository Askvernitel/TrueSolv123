public with sharing class UserController {
    public UserController() {

    }
    @AuraEnabled
    public static User getUserById(Id userId){
        System.debug(userId);
        List<User> accounts = [SELECT Id,Name,isManager__c FROM User WHERE Id = :userId LIMIT 1];
        if(!accounts.isEmpty()){
            return accounts[0];
        }else {
            System.debug('No Account Found');
            return null;
        }
    }

    @AuraEnabled
    public static Boolean isManager(Id userId){
        try {
            if(userId != UserInfo.getUserId()){
                return false;
            }
            List<User> users = [SELECT IsManager__c FROM User WHERE Id = :userId];
            if(!users.isEmpty()){
                return users[0].IsManager__c;
            }
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //NOTE: for test purposes
    @AuraEnabled 
    public static Boolean makeManager(Id userId){
        User user  = getUserById(userId);
        user.isManager__c = true;
        update user;
        return true;
    }
}