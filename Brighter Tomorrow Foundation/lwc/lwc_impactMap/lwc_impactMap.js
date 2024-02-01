import { LightningElement, wire, track } from 'lwc';
import fetchProjects from '@salesforce/apex/CL_impactMap.fetchProjects';

export default class Lwc_impactMap extends LightningElement {
    @track error;
    @track mapMarkers = [];
    @track markersTitle = 'Projects';
    @track zoomLevel = 4;
    @track listView;
    @wire(fetchProjects, {})
    wireAccount({ error, data }) {
        if (data) {
            data.forEach(dataItem => {
                this.mapMarkers = [...this.mapMarkers,
                {
                    location: {
                        City: dataItem.Address__City__s,
                        Country: dataItem.Address__CountryCode__s,
                        PostalCode: dataItem.Address__PostalCode__s,
                        State: dataItem.Address__StateCode__s,
                        Street: dataItem.Address__Street__s,
                    },
                    icon: 'custom:custom26',
                    title: dataItem.Name,
                    description: '<b>Budget:</b> $' + dataItem.Budget_Amount__c + '<br/><b>Amount Expenditure:</b> $' + dataItem.Amount__c + '<br/><b>Impact Metrics:</b> ' + dataItem.Impact_Metrics__c + '<br/><b>Description:</b> ' + dataItem.Description__c,
                }
                ];
            });

            this.zoomLevel = 5;
            this.error = undefined;

        } else if (error) {
            this.error = error;
        }
    }
}