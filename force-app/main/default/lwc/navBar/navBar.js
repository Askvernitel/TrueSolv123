import { api, LightningElement, wire } from 'lwc';
import getAccountByUserId from '@salesforce/apex/AccountController.getAccountByUserId';
import Id from '@salesforce/user/Id';
import AddItemModal from "c/addItemModal";
import CartItemsModal from "c/cartItemsModal";
import { publish, MessageContext, subscribe } from 'lightning/messageService';
import ADD_ITEM_CH from '@salesforce/messageChannel/AddItemChannel__c';
import ADD_CART_CH from '@salesforce/messageChannel/AddToCart__c'
import isManager from '@salesforce/apex/UserController.isManager';
import makeManager from '@salesforce/apex/UserController.makeManager';
import {NavigationMixin} from 'lightning/navigation';
export default class NavBar extends NavigationMixin(LightningElement) {
    account = {};
	isNotManager = true;
	
	cartItems;
	@wire(MessageContext) messageContext;
	constructor(){
		super();
		this.cartItems = new Map();
	}
	connectedCallback(){
		getAccountByUserId({userId: Id}).then((resp)=>{
			console.log("RESPONSE ACCCOUNT: ", resp);
			this.account = resp;
		}).catch((error)=>{
			console.log(error);
		}
		);
		isManager({userId:Id}).then((resp)=>{
			console.log("MANAGER", resp);
			this.isNotManager = !resp;
		}).catch(console.log);
		subscribe(this.messageContext, ADD_CART_CH, (message) => {
			this.addItemToCart(message);
		})
	}
	addItemToCart(message){
			const {amount} = (this.cartItems.get(message.message.Id) || {amount:0});
			const val ={item: message.message, amount: amount+1};
			this.cartItems.set(message.message.Id, val);
			for (const key of this.cartItems.keys()) {
				console.log("KEY:", key, "VAL:", this.cartItems.get(key).item);
			}
	}

	navigateToPurchaseLayout(){
		this[NavigationMixin.Navigate]({
				type: 'standard__objectPage',
				attributes: {
					objectApiName: 'Purchase__c',
					actionName: 'list'
				},
				state: {
                filterName: 'All' 
				}
			});
	}

	async handleCartClick(){
		try{
			const cartArray = Array.from(this.cartItems.values()) || [];
			//console.log("CART ARRAY", cartArray[0].item);
			const result = await CartItemsModal.open(
				{
					size:'medium',
					cartItems:cartArray
				},this
			)
			console.log(result);
			if(result === "checkout"){
				this.cartItems=new Map();
				this.navigateToPurchaseLayout();
			
			}else if(result === "close"){
				console.log("Closed");
			}
		}catch(e){
			console.error(e.toString());
		}
	}
	async handleCreateItem(){
        const result = await AddItemModal.open({
            size: 'medium',
        },this);

        if (result == "okay"){
			publish(this.messageContext,ADD_ITEM_CH,null);
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