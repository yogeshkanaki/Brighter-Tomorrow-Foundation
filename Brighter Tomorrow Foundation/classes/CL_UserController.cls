public class CL_UserController {
	@AuraEnabled(cacheable=true)
    public static User getUserInfo() {
        return [SELECT Id, AccountId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
    }
    
    @AuraEnabled(cacheable=true)
    public static DonationInfo getDonationInformation(){
        
        DonationInfo result = new DonationInfo();
        
        List<AggregateResult> opportunityAggregates = [SELECT SUM(Amount) totalAmount 
                                                       FROM Opportunity 
                                                       WHERE CreatedById = :UserInfo.getUserId()];
        if (opportunityAggregates.size() > 0) {
            result.totalOpportunityAmount = (Decimal)opportunityAggregates[0].get('totalAmount');
        }
        
        List<AggregateResult> paymentAggregates = [SELECT SUM(npe01__Payment_Amount__c) totalAmount 
                                                   FROM npe01__OppPayment__c 
                                                   WHERE npe01__Paid__c =: true 
                                                   AND npe01__Opportunity__r.CreatedById = :UserInfo.getUserId()];
        if (paymentAggregates.size() > 0) {
            result.totalPaymentAmount = (Decimal)paymentAggregates[0].get('totalAmount');
        }
        
        system.debug('result '+result);
        return result;
    }
    
    public class DonationInfo {
        @AuraEnabled public Decimal totalOpportunityAmount;
        @AuraEnabled public Decimal totalPaymentAmount;
    }
}