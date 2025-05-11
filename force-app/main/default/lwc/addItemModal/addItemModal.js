import { LightningElement, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import insertItem from '@salesforce/apex/ItemController.insertItem';
import { ItemEntity } from 'c/itemEntity';
import Id from '@salesforce/user/Id';
//TODO: MAKE THIS THING WORK WITHOUT ERROR
export default class AddItemModal extends LightningModal{


    handleSubmit(event) {
        console.log(event.detail);
        let inputFields = this.template.querySelectorAll('lightning-input-field');
        //insert item
        const fields = event.detail.fields

        
        const newItem = {
            name :fields.Name__c.value,
            description: fields.Description__c.value,
            type: fields.Type__c.value,
            price: fields.Price__c.value,
            family: fields.Family__c.value,
        }
        
        insertItem({jsonData:JSON.stringify(newItem)})
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