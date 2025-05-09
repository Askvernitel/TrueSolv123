import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
export default class ItemList extends LightningElement {
    @track items;
    
    renewItems(){
    }
    addItem(){
        insertItem().then((resp)=>{
            console.log(resp)
        }).catch(console.log)
    }
    printAllItems(){
        getAllItems().then((resp)=>{
            this.items = resp;
        }).catch(console.log)
    }
}