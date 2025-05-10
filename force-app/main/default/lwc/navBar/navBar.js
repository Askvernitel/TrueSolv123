import { api, LightningElement, wire } from 'lwc';
import getAccountByUserId from '@salesforce/apex/AccountController.getAccountByUserId';
import Id from '@salesforce/user/Id';;
export default class NavBar extends LightningElement {


    account = {};
	connectedCallback(){
		getAccountByUserId({userId: Id}).then((resp)=>{
			console.log("RESPONSE ACCCOUNT: ", resp);
			this.account = resp;
		}).catch((error)=>{
			console.log(error);
		}
		)
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