import { api, LightningElement, wire } from 'lwc';
import getAccountByUserId from '@salesforce/apex/AccountController.getAccountByUserId';
import Id from '@salesforce/user/Id';
import addItemModal from "c/addItemModal";
import { publish, MessageContext } from 'lightning/messageService';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';

export default class NavBar extends LightningElement {
    account = {};
	@wire(MessageContext) messageContext;
	connectedCallback(){
		getAccountByUserId({userId: Id}).then((resp)=>{
			console.log("RESPONSE ACCCOUNT: ", resp);
			this.account = resp;
		}).catch((error)=>{
			console.log(error);
		}
		)
	}
	async handleCreateItem(){
        const result = await addItemModal.open({
            size: 'medium',
        });

        if (result == "okay"){
			publish(this.messageContext,ADD_ITEM_CH,null);
            console.log("Items:", this.items)
        }else{
            console.log("Result:" + JSON.stringify(result));
        }
    }

	get accountNumber(){
		return this.account ? this.account.AccountNumber : "";
	}
	get accountName(){
		return this.account ? this.account.Name : "";
	}
	get accountIndustry(){
		return this.account ? this.account.Industry : "";
	}

   
}