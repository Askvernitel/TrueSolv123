import ItemDetailsModal from 'c/itemDetailsModal';
import { api, LightningElement } from 'lwc';
import imgURL from '@salesforce/resourceUrl/SiteSamples'
//wish this was typescript would define item object
export default class ItemCard extends LightningElement {
    @api cardItem;
    url = imgURL + '/Img/clock.png';
    constructor(){
        super();
        console.log(this.cardItem)
    }


    async handleDetailsClick(){
        const result = await ItemDetailsModal.open({
            size: 'small',
            itemData:this.cardItem,
        });
        console.log(result);
    }
    handleAddClick(){
    }
}