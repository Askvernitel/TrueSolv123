import { MessageContext, publish } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import SEARCH_CH from '@salesforce/messageChannel/SearchChannel__c';
export default class ItemSearchBar extends LightningElement {
    @wire(MessageContext) MessageContext;
    searchText;
    handleChange(event){
        this.searchText = event.detail.value;
        publish(this.MessageContext, SEARCH_CH, {
            search:{searchText: this.searchText}});
    }

    handleSearch(event){
    }

}