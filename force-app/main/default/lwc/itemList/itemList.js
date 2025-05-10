import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';
import { subscribe, MessageContext} from 'lightning/messageService';
export default class ItemList extends LightningElement {
    @track items = [];
    @wire(MessageContext) messageContext;

    connectedCallback(){
        subscribe(this.messageContext, ADD_ITEM_CH, (message) => {
            this.loadAllItems();
        });
    }

    constructor(){
        super();
        cleanUp().then((resp)=>{console.log(resp)}).catch(console.error);//for test purposes
        this.loadAllItems();
    }

    loadAllItems(){
        console.log("Getting All The Items");
        getAllItems().then((resp)=>{
            console.log(resp);
            this.items = resp;
        }).catch(console.error);
    }
}