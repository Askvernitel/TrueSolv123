import { LightningElement, wire } from 'lwc';
import getAllItemTypes from '@salesforce/apex/ItemController.getAllItemTypes';
import getAllItemFamilies from '@salesforce/apex/ItemController.getAllItemFamilies';
import { transformToRadioGroupArray } from 'c/helpers';
import FILTER_ITEM_CH from '@salesforce/messageChannel/FilterItemChannel__c'
import DEFAULT_CH from '@salesforce/messageChannel/DefaultMessage__c'
import { MessageContext, publish, subscribe } from 'lightning/messageService';
export default class ItemFilterBar extends LightningElement {
    @wire(MessageContext) messageContext;
    typeValue="";
    familyValue="";
    currentItemAmount=0;
    types = [];
    families = [];
    connectedCallback(){
        subscribe(this.messageContext, DEFAULT_CH,(msg)=>{
            console.log("AMOUNT:", msg);
            this.currentItemAmount=msg.message;
        })
    }
    constructor(){
        super();
        getAllItemTypes().then((resp)=>{
            
            transformToRadioGroupArray(resp).then((res)=>{
                this.types=res;
            }).catch(console.log);
        }).catch(console.log);
        getAllItemFamilies().then((resp)=>{
            
            transformToRadioGroupArray(resp).then((res)=>{
                this.families=res;
            }).catch(console.log);
        
        }).catch(console.log);
    }
    handleFilterClick(){
        publish(this.messageContext, FILTER_ITEM_CH, {
            filterData: {
                family: this.familyValue,
                type: this.typeValue}
            }
        )
    }
    handleResetClick(){
            publish(this.messageContext, FILTER_ITEM_CH, {
                filterData: {
                family:'', 
                type: ''}
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