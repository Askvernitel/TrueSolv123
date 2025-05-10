public with sharing class Validator {
    public Validator() {
    }

    public static Boolean checkItem(AddItemDTO item){
        if(item.name == null || String.isEmpty(item.name)){
            return false;
        }
        if(item.description == null || String.isEmpty(item.description)){
            return false;
        }
        if(item.price == null){
            return false;
        }
        if(item.price <= 0){
            return false;
        }
        return true;
    }
}