import { LightningElement } from 'lwc';
import getAllItemTypes from '@salesforce/apex/ItemController.getAllItemTypes';
import getAllItemFamilies from '@salesforce/apex/ItemController.getAllItemFamilies';
import { transformToRadioGroupArray } from 'c/helpers';
export default class ItemFilterBar extends LightningElement {
    value="" ;
    types = [];
    families = [];
    constructor(){
        super();

        getAllItemTypes().then((resp)=>{this.types=transformToRadioGroupArray(resp)}).catch(console.log);
        getAllItemFamilies().then((resp)=>{this.families=transformToRadioGroupArray(resp)}).catch(console.log);
    }

    get typeOptions(){
        return this.types;
    }

    get familyOptions(){
        return this.families;
    }
}