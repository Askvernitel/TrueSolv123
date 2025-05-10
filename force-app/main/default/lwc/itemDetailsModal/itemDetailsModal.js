import { api,LightningElement } from 'lwc';
import LightningModal from 'lightning/modal';
export default class ItemDetailsModal extends LightningModal {
    @api itemData;
    handleClose(){
        this.close("Success");
    }
    
}