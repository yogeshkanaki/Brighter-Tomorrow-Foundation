public class CL_Opportunity {
    
    Private static string searchQuery = '';
    Private static string searchAmountQuery = '';
    Private static string oppQuery = 'SELECT Id, AccountId, Account.Name, Account_Name__c, Name, npsp__Primary_Contact__c, npe01__Amount_Outstanding__c, npe01__Number_of_Payments__c, Amount, CloseDate, CreatedDate, CreatedById, npe01__Payments_Made__c FROM Opportunity';
    
     @AuraEnabled(cacheable=true)
    public static List<Opportunity> getDonations(String searchKeyText, Decimal amount){
        
        List<Opportunity> oppList = new List<Opportunity>();
        
        String consQuery = oppQuery + ' WHERE CreatedById = '+ '\''+UserInfo.getUserId() + '\'';
        
        if(String.isNotEmpty(searchKeyText)){
                    searchQuery = ' AND (Name LIKE '+ '\'%'+ searchKeyText + '%\')';
        } 
        
        if(amount != null ){
                    searchAmountQuery = ' AND (npe01__Payments_Made__c <= '+ amount + 
                        ' OR Amount <= '+ amount + ')';
        } 
        
         consQuery = consQuery + searchQuery + searchAmountQuery + 'ORDER BY CreatedDate DESC';
                     system.debug('consQuery '+consQuery);
                     
                     oppList = database.query(consQuery);
        
        return oppList;
    }
}