import ItemDetailsModal from 'c/itemDetailsModal';
import { api, LightningElement, wire } from 'lwc';
import imgURL from '@salesforce/resourceUrl/SiteSamples'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningToast from "lightning/toast"
import ToastContainer from "lightning/toastContainer";
import ADD_CART_CH from '@salesforce/messageChannel/AddToCart__c';
import { MessageContext, publish } from 'lightning/messageService';
//wish this was typescript would define item object
export default class ItemCard extends LightningElement {
    @api cardItem;
    @wire(MessageContext) messageContext;
    url='';
    addedCount = 0;
    toastDelay;
    constructor(){
        super();
    }
    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxToasts = 4;
        toastContainer.toastPosition = "top-right";
        console.log('CARD', this.cardItem);
        console.log('URL', this.cardItem.Image__c);


        this.url = this.cardItem.Image__c;
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
        publish(this.messageContext, ADD_CART_CH, {message:this.cardItem});
    }
}