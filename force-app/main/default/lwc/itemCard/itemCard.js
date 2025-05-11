import ItemDetailsModal from 'c/itemDetailsModal';
import { api, LightningElement } from 'lwc';
import imgURL from '@salesforce/resourceUrl/SiteSamples'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningToast from "lightning/toast"
import ToastContainer from "lightning/toastContainer";;
//wish this was typescript would define item object
export default class ItemCard extends LightningElement {
    @api cardItem;
    url = imgURL + '/img/clock.png';
    addedCount = 0;
    toastDelay;
    constructor(){
        super();
        console.log(this.cardItem)
    }
    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxToasts = 4;
        toastContainer.toastPosition = "top-right";
    }

    async handleDetailsClick(){
        const result = await ItemDetailsModal.open({
            size: 'small',
            itemData:this.cardItem,
        });
        console.log(result);
    }
    async handleAddClick(){
        await LightningToast.show(
            {
              label: "Item Added To Cart",
              message: `${this.cardItem.Name__c} Added To Cart`,
              mode:"pester",
              variant: "success",
            },
            this,
          );
    }
}