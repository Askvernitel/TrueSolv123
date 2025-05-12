import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
import DEFAULT_CH from '@salesforce/messageChannel/DefaultMessage__c';
import SEARCH_CH from '@salesforce/messageChannel/SearchChannel__c';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';
import FILTER_ITEM_CH  from '@salesforce/messageChannel/FilterItemChannel__c';
import { subscribe, MessageContext, publish} from 'lightning/messageService';


async function filterItemsByFamilyAndType(items, filterObj){
    if(filterObj == undefined) return items;
    let filter = filterObj.filterData 
    console.log("FILTER LOG:", filter);
    console.log("CALLED FILTER FAMILY");
    if(filter.family && filter.type){
        return items.filter(item=>item.Family__c===filter.family && item.Type__c===filter.type);

    }else if(filter.family){
        return items.filter(item=>item.Family__c===filter.family);
    }else if(filter.type){
        return items.filter(item=>item.Type__c===filter.type);
    }else{
        return items;
    }
}

async function filterItemsBySearchText(items, searchObj){
    console.log("FILTER SEARCH TEXT:",searchObj);
    return items.filter((item)=>{
        const text = `${item.Description__c || ''} ${item.Name__c || ''}`.toLowerCase();
        console.log("FILTER TEXT:", text);
        return text.includes((searchObj.searchText || '').toLowerCase());
    });
}

export default class ItemList extends LightningElement {
    items = [];
    filteredItems = [];
    currentFilter = {filterData:{}};
    @wire(MessageContext) messageContext;

    connectedCallback(){
        subscribe(this.messageContext, ADD_ITEM_CH, (message) => {
            if(message != null) return;
            console.log("LOAD ITEMS MESSAGE");
            this.loadAllItems();
        });
        subscribe(this.messageContext, FILTER_ITEM_CH, (filterData)=>{
            this.currentFilter = filterData;
            filterItemsByFamilyAndType(this.items, this.currentFilter).then((res)=>{console.log("RES1: ", res, this), this.filteredItems=res; this.updateAmount()});
        })
        subscribe(this.messageContext, SEARCH_CH, (message) => {
            filterItemsBySearchText(this.filteredItems, message.search).then((res)=>{
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
        cleanUp().then((resp)=>{console.log(resp)}).catch(console.error);//for test purposes
    }

    async loadAllItems(){
        console.log("Getting All The Items");
        getAllItems().then((resp)=>{
            console.log("ITEM RESPONSE: ", resp);
            this.items = resp;
            filterItemsByFamilyAndType(this.items, this.currentFilter).then((res)=>{ console.log("RES2: ", res, this); this.filteredItems=res;

            this.updateAmount();
              });
            console.log("FILTERED ITEMS: ", this.filteredItems);
        }).catch(console.error);
    }
}