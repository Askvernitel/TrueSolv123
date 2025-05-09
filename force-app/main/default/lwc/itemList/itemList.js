import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
export default class ItemList extends LightningElement {
    items
    
    constructor(){
        super();
        cleanUp().then((resp)=>{console.log(resp)}).catch(console.error);//for test purposes
    }

    
    async addItem(){
        const result = await addItemModal.open({
            // `label` is not included here in this example.
            // it is set on lightning-modal-header instead
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
        });
        // if modal closed with X button, promise returns result = 'undefined'
        // if modal closed with OK button, promise returns result = 'okay'
        console.log(result);
    }
    loadAllItems(){
        getAllItems().then((resp)=>{
            this.items = resp;
        }).catch(console.error)
    }
}