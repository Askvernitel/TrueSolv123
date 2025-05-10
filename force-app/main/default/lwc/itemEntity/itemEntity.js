export class ItemEntity{ 
    description;
    family;
    name;
    price;
    type;
    constructor(name, description, type, price, family){
        this.name =name;
        this.description = description;
        this.type = type;
        this.price = price;
        this.family = family;

    }

    toObj(){
        return {
            name: this.name,
            description: this.description,
            type: this.type,
            price: this.price,
            family: this.family
        };
    }
}