import { LightningElement, track, wire } from 'lwc';
import insertItem from "@salesforce/apex/ItemController.insertItem";
import getAllItems from "@salesforce/apex/ItemController.getAllItems"
import addItemModal from "c/addItemModal"
import cleanUp from '@salesforce/apex/ItemController.cleanUp';
export default class ItemList extends LightningElement {
    @track items = [];
    
    constructor(){
        super();
        cleanUp().then((resp)=>{console.log(resp)}).catch(console.error);//for test purposes
        this.loadAllItems();
    }

     
    async addItem(){
        const result = await addItemModal.open({
            size: 'medium',
        });


        if (result == "okay"){
            this.loadAllItems();
            console.log("Items:", this.items)
        }else{
            console.log("Result:" + JSON.stringify(result));
        }
    }
    loadAllItems(){
        console.log("Getting All The Items");
        getAllItems().then((resp)=>{
            console.log(resp);
            this.items = resp;
        }).catch(console.error);
    }
}