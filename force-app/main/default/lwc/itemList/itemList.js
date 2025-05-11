import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';
import FILTER_ITEM_CH  from '@salesforce/messageChannel/FilterItemChannel__c';
import { subscribe, MessageContext} from 'lightning/messageService';
import { filterItemsByFilter } from 'c/helpers';
export default class ItemList extends LightningElement {
    items = [];
    filteredItems = [];
    currentFilter = {filterData:{}};
    @wire(MessageContext) messageContext;

    connectedCallback(){
        subscribe(this.messageContext, ADD_ITEM_CH, (message) => {
            this.loadAllItems();
        });

        subscribe(this.messageContext, FILTER_ITEM_CH, (filterData)=>{
            this.currentFilter = filterData;
            this.filteredItems = (filterItemsByFilter(this.items, this.currentFilter));
        })
        this.loadAllItems();
    }

    constructor(){
        super();
        //cleanUp().then((resp)=>{console.log(resp)}).catch(console.error);//for test purposes
    }

    loadAllItems(){
        console.log("Getting All The Items");
        getAllItems().then((resp)=>{
            console.log("ITEM RESPONSE: ", resp);
            this.items = resp;
            console.log("THIS: ", this)
            this.filteredItems = filterItemsByFilter(this.items, this.currentFilter);
            console.log("FILTERED ITEMS: ", this.filteredItems);
        }).catch(console.error);
    }
}