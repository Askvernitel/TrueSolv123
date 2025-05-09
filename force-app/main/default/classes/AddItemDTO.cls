public with sharing class AddItemDTO {
    @AuraEnabled public String name;
    @AuraEnabled public String description;
    @Auraenabled public Decimal  price;
    @AuraEnabled public String type;
    @AuraEnabled public String family;
    public AddItemDTO(String name, String description, Decimal price, String type, String family){
        this.name = name;
        this.description=description;
        this.price=price;
        this.type=type;
        this.family=family;
    }
   
}