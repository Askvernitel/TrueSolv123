import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import makePurchase from '@salesforce/apex/PurchaseController.makePurchase';
import Id from '@salesforce/user/Id';
const columns = [
    { label: 'Name', fieldName: 'Name__c' },
    { label: 'Description', fieldName: 'Description__c',  },
    { label: 'Type', fieldName: 'Type__c',  },
    { label: 'Family', fieldName: 'Family__c',   },
    { label: 'Price', fieldName: 'Price__c', type: 'currency' },
    { label: 'Image', fieldName: 'ImageUrl__c'},
    { label: 'Amount', fieldName: 'amount'}
];
export default class CartItemsModal extends LightningModal {
    @api cartItems;
    columns = columns;
    displayItems = []; 
    constructor(){
        super();
        console.log("TIME MODAL CONSTRUCTOR");
    }
    connectedCallback(){
        this.displayItems = this.cartItems.map((obj)=>{let {item, amount} = obj; return {...item, amount:amount};});
        console.log(JSON.stringify(this.displayItems));
    }
    handleCheckout(){
        console.log(Id);
        let idAmountArray= this.cartItems.map((obj)=>{return {itemId:obj.item.Id , amount:obj.amount}});
        makePurchase({userId:Id, itemIdsJson:JSON.stringify(idAmountArray)}).then((resp)=>{
            console.log(resp);
        }).catch((error)=>console.log(error));
        this.close('checkout');
    }
    handleClose(){
        this.close("close");
    }
}