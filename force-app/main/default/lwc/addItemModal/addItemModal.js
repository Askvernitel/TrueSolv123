import { LightningElement, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import insertItem from '@salesforce/apex/ItemController.insertItem';
import { ItemEntity } from 'c/itemEntity';
import Id from '@salesforce/user/Id';
//TODO: MAKE THIS THING WORK WITHOUT ERROR
export default class AddItemModal extends LightningModal{


    handleSubmit() {
        //insert item
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        const newItem = {};

        inputFields.forEach(field => {
            const fieldName = field.fieldName;
            const value = field.value;
            console.log("VALUE: ", value);
            newItem[fieldName] = value;
        }); 
        console.log("ITEM", JSON.stringify(newItem));
        console.log("NEW ITEM ", JSON.stringify(newItem)); 
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