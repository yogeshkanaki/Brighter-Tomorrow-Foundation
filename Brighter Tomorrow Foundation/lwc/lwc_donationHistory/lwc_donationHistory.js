import { LightningElement, track, api, wire } from 'lwc';
import getDonations from '@salesforce/apex/CL_Opportunity.getDonations';

export default class Lwc_donationHistory extends LightningElement {

    @track Columns = [{

        label: 'Name',
        fieldName: 'recordLink',
        type: 'url',
        typeAttributes: {
            label: {
                fieldName: 'Name'
            },
            tooltip: 'Name',
            target: '_blank'
        }
    }, {
        label: 'Amount',
        fieldName: 'Amount',
        type: 'Currency'
    }, {
        label: 'Received Amount',
        fieldName: 'npe01__Payments_Made__c',
        type: 'Currency'
    }, {
        label: 'Closed Date',
        fieldName: 'CloseDate',
        type: 'date'
    }, {
        label: 'Created On',
        fieldName: 'CreatedDate',
        type: 'date',
        typeAttributes: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
    }
    ];

    @track page = 1;
    @track items = [];
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track pageSize = 50;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track error;
    @track OppList;
    @track searchKey = '';
    @track amount = null;

    connectedCallback() {
        this.handleData();
    }

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleAmountChange(event) {
        this.amount = event.target.value;
    }

    handleReset() {
        this.searchKey = '';
        this.amount = null;
    }

    handleData() {
        getDonations()
            .then((data) => {
                if (data) {
                    var tempOppList = [];
                    for (var i = 0; i < data.length; i++) {
                        let tempRecord = Object.assign({}, data[i]);
                        tempRecord.recordLink = "/" + tempRecord.Id;
                        tempOppList.push(tempRecord);
                    }

                    this.items = tempOppList;
                    this.totalRecountCount = tempOppList.length;
                    this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);


                    this.OppList = this.items.slice(0, this.pageSize);
                    this.endingRecord = this.pageSize;
                } else if (error) {
                    this.error = error;
                }
            });
    }

    @wire(getDonations, { searchKeyText: '$searchKey', amount: '$amount' })
    wiredAccounts({ error, data }) {
        if (data) {
            var tempOppList = [];
            for (var i = 0; i < data.length; i++) {
                let tempRecord = Object.assign({}, data[i]);
                tempRecord.recordLink = "/" + tempRecord.Id;
                tempOppList.push(tempRecord);
            }

            this.items = tempOppList;
            this.totalRecountCount = tempOppList.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);


            this.OppList = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
        } else if (error) {
            this.error = error;
        }
    }

    exportFilteredData() {

        const donationData = this.prepareDonationData();
        const workbook = XLSX.utils.book_new();
        const donationSheet = XLSX.utils.json_to_sheet(donationData);
        XLSX.utils.book_append_sheet(workbook, donationSheet, 'Donations');

        XLSX.writeFile(workbook, 'Donation_Data.xlsx');
    }


    prepareDonationData() {

        return this.OppList.map(record => ({
            'Name': record.Name,
            'Amount': record.Amount,
            'Account': record.Account_Name__c,
            'Payment Made': record.npe01__Payments_Made__c,
            'Outstanding Amount': record.npe01__Amount_Outstanding__c,
            'Number of Payments': record.npe01__Number_of_Payments__c,
            'Close Date': record.CloseDate,
            'Created On': new Date(record.CreatedDate).toISOString().split('T')[0]
        }));
    }


}
