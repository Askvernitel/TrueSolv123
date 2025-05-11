import { MessageContext, publish } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import DEFAULT_CH from '@salesforce/messageChannel/DefaultMessage__c';
export default class ItemSearchBar extends LightningElement {
    @wire(MessageContext) MessageContext;
    searchText;
    handleChange(event){
        this.searchText = event.detail.value;
        publish(this.MessageContext, DEFAULT_CH, {
            msg:{searchText: this.searchText}});
    }

    handleSearch(event){
    }

}