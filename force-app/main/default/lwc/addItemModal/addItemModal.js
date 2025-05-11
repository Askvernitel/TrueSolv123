import { LightningElement, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import insertItem from '@salesforce/apex/ItemController.insertItem';
import { ItemEntity } from 'c/itemEntity';

//TODO: MAKE THIS THING WORK WITHOUT ERROR
export default class AddItemModal extends LightningModal{


    handleSubmit(event) {
        console.log(event.detail);
        let inputFields = this.template.querySelectorAll('lightning-input-field');
        //insert item
        const newItem = new ItemEntity(
            event.detail.fields.Name__c,
            event.detail.fields.Description__c,
            event.detail.fields.Type__c,
            event.detail.fields.Price__c,
            event.detail.fields.Family__c);
        insertItem({item:newItem.toObj()})
        .then(result => this.close("okay"))
        .catch(error => {console.log(error); this.close("okay")})
        //this.resetFields(inputFields) ;
    }
    handleOkay(){
        this.close("okay");
    }
    handleError(error){
        this.close(error);
    }
    resetFields(inputFields){
        inputFields.forEach(field => {
            field.value=null;
        });
    }
    constructor(){
            super();
    }
}