import { LightningElement, api, track, wire } from 'lwc';
import getDonationInformation from '@salesforce/apex/CL_UserController.getDonationInformation';

export default class Lwc_progressBar extends LightningElement {
    @track totalOpportunityAmount = 0;
    @track totalPaymentAmount = 0;
    @track donationPercentage = 0;


    @wire(getDonationInformation)
    wiredDonationInfo({ error, data }) {
        if (data) {
            this.totalOpportunityAmount = data.totalOpportunityAmount || 0;
            this.totalPaymentAmount = data.totalPaymentAmount || 0;
            this.calculateDonationPercentage();
        } else if (error) {
            // Handle error
        }
    }


    calculateDonationPercentage() {
        if (this.totalOpportunityAmount > 0) {
            this.donationPercentage = (this.totalPaymentAmount / this.totalOpportunityAmount) * 100;
        }
    }
}