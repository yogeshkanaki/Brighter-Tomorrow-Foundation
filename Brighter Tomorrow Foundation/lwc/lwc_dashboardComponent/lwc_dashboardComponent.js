import { LightningElement, track, api, wire } from 'lwc';
import firstOpportunity from '@salesforce/apex/CL_dashboardController.firstOpportunity';
import opportunityData from '@salesforce/apex/CL_dashboardController.opportunityData';
import getProjects from '@salesforce/apex/CL_dashboardController.getProjects';

export default class Lwc_dashboardComponent extends LightningElement {
    @track firstOppName;
    @track firstOppAmount;
    @track firstOppCloseDate;
    @track lastOpportunityData;
    @track totalOpportunity;
    @track totalOppDonations;
    @track todayOppCount;
    @track todayTotalAmount;
    @track activeCampaigns;
    @track allProjects;
    @track projectCount;
    @track projectTotalAmount;
    @track projectTotalBudget;
    @track totalPaymentsMade;

    connectedCallback() {

        firstOpportunity()
            .then(result => {
                this.firstOppName = JSON.parse(JSON.stringify(result)).Name;
                this.firstOppAmount = JSON.parse(JSON.stringify(result)).Amount;
                this.firstOppCloseDate = JSON.parse(JSON.stringify(result)).CloseDate;
            })
            .catch(error => {
                console.log('error', error);
            });

        opportunityData()
            .then(result => {
                this.totalOpportunity = JSON.parse(result).oppCount;
                this.totalOppDonations = JSON.parse(result).totalAmount;
                this.totalPaymentsMade = JSON.parse(result).totalPaymentsMade ? JSON.parse(result).totalPaymentsMade : 0;

                this.todayOppCount = JSON.parse(result).todayOppCount;
                this.todayTotalAmount = JSON.parse(result).todayTotalAmount ? JSON.parse(result).todayTotalAmount : 0;

                this.projectCount = JSON.parse(result).projectCount ? JSON.parse(result).projectCount : 0;
                this.projectTotalAmount = JSON.parse(result).projectTotalAmount ? JSON.parse(result).projectTotalAmount : 0;
                this.projectTotalBudget = JSON.parse(result).projectTotalBudget ? JSON.parse(result).projectTotalBudget : 0;


            })
            .catch(error => {
                console.log('error', error);
            });

        getProjects()
            .then((result) => {
                this.allProjects = result;
            }).catch(error => {
                this.error = error;
            });


    }


}