import { LightningElement, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import insertItem from '@salesforce/apex/ItemController.insertItem';
export default class AddItem extends LightningModal{


    handleSubmit(event) {
        console.log(event.detail);
        let inputFields = this.template.querySelectorAll('lightning-input-field');
        //insert item
        this.resetFields(inputFields) ;
    }
    handleOkay(){
        this.close("okay")
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