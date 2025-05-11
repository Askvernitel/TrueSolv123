import { LightningElement, wire } from 'lwc';
import getAllItemTypes from '@salesforce/apex/ItemController.getAllItemTypes';
import getAllItemFamilies from '@salesforce/apex/ItemController.getAllItemFamilies';
import { transformToRadioGroupArray } from 'c/helpers';
import FILTER_ITEM_CH from '@salesforce/messageChannel/FilterItemChannel__c'
import { MessageContext, publish } from 'lightning/messageService';
export default class ItemFilterBar extends LightningElement {
    @wire(MessageContext) messageContext;
    typeValue="";
    familyValue="";
    types = [];
    families = [];
    constructor(){
        super();
        getAllItemTypes().then((resp)=>{this.types=transformToRadioGroupArray(resp)}).catch(console.log);
        getAllItemFamilies().then((resp)=>{this.families=transformToRadioGroupArray(resp)}).catch(console.log);
    }
    handleFilterClick(){
        publish(this.messageContext, FILTER_ITEM_CH, {
            filterData: {
                family: this.familyValue,
                type: this.typeValue}
            }
        )
    }

    handleFamilyChange(event){
        this.familyValue = event.detail.value
   }
    handleTypeChange(event){
        this.typeValue = event.detail.value
    }
    get typeOptions(){
        return this.types;
    }

    get familyOptions(){
        return this.families;
    }
}