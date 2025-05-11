import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
import DEFAULT_CH from '@salesforce/messageChannel/DefaultMessage__c';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';
import FILTER_ITEM_CH  from '@salesforce/messageChannel/FilterItemChannel__c';
import { subscribe, MessageContext, publish} from 'lightning/messageService';
import { filterItemsByFamilyAndType, filterItemsBySearchText } from 'c/helpers';
export default class ItemList extends LightningElement {
    items = [];
    filteredItems = [];
    currentFilter = {filterData:{}};
    @wire(MessageContext) messageContext;

    connectedCallback(){
        subscribe(this.messageContext, ADD_ITEM_CH, (message) => {
            console.log("LOAD ITEMS MESSAGE");
            this.loadAllItems();
        });
        subscribe(this.messageContext, FILTER_ITEM_CH, (filterData)=>{
            this.currentFilter = filterData;
            filterItemsByFamilyAndType(this.items, this.currentFilter).then((res)=>{console.log("RES1: ", res, this), this.filteredItems=res; this.updateAmount()});
        })
        subscribe(this.messageContext, DEFAULT_CH, (message) => {
            filterItemsBySearchText(this.items, message.msg).then((res)=>{
                this.filteredItems=res;
                this.updateAmount();
                console.log("SEARCH RES:", res);
            }).catch(console.log);
        });

        this.loadAllItems();
    }
    updateAmount(){
        publish(this.messageContext, DEFAULT_CH, {
            message: this.filteredItems.length });
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
            filterItemsByFamilyAndType(this.items, this.currentFilter).then((res)=>{ console.log("RES2: ", res, this); this.filteredItems=res;

            this.updateAmount();
              });
            console.log("FILTERED ITEMS: ", this.filteredItems);
        }).catch(console.error);
    }
}