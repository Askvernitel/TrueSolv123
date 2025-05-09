import { api, LightningElement } from 'lwc';

//wish this was typescript would define item object
export default class ItemCard extends LightningElement {
    @api cardItem;

    constructor(){
        super();
        console.log(this.cardItem)
    }
}