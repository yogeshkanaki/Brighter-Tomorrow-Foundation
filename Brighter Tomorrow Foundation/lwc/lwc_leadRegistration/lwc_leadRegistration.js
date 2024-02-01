import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import MOBILEPHONE_FIELD from '@salesforce/schema/Lead.MobilePhone';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import ANNUALREVENUE_FIELD from '@salesforce/schema/Lead.AnnualRevenue';
import ADDRESS_FIELD from '@salesforce/schema/Lead.Address';

export default class Lwc_leadRegistration extends LightningElement {
    @api objectApiName = 'Lead';
    @track fields = [NAME_FIELD, MOBILEPHONE_FIELD, EMAIL_FIELD, COMPANY_FIELD, ANNUALREVENUE_FIELD, ADDRESS_FIELD];

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Record Created Successfully",
            variant: "success"
        });
        this.dispatchEvent(evt);

    }


}