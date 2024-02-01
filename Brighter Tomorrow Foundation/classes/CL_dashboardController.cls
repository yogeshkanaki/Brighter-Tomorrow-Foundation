public class CL_dashboardController {
    
    @AuraEnabled(cacheable=true)
    public static Opportunity firstOpportunity(){
        Opportunity firstOpp = [SELECT Id, AccountId, Account.Name, Account_Name__c, Name, npsp__Primary_Contact__c, npe01__Amount_Outstanding__c, 
                                npe01__Number_of_Payments__c, Amount, CloseDate, CreatedDate, CreatedById, npe01__Payments_Made__c 
                                FROM Opportunity
                                WHERE CreatedById = :UserInfo.getUserId()
                                ORDER BY CreatedDAte ASC LIMIT 1];
        return firstOpp;
    }
    
    @AuraEnabled(cacheable=true)
    public static Opportunity lastOpportunity(){
        Opportunity lastOpp = [SELECT Id, AccountId, Account.Name, Account_Name__c, Name, npsp__Primary_Contact__c, npe01__Amount_Outstanding__c, 
                                npe01__Number_of_Payments__c, Amount, CloseDate, CreatedDate, CreatedById, npe01__Payments_Made__c 
                                FROM Opportunity
                                WHERE CreatedById = :UserInfo.getUserId()
                                ORDER BY CreatedDAte DESC LIMIT 1];
        return lastOpp;
    }

    @AuraEnabled(cacheable=true)
    public static string opportunityData(){
        List<AggregateResult> aggOpp = [SELECT Count(Id) oppCount, SUM(Amount) totalAmount 
                                        FROM Opportunity 
                                        WHERE CreatedById = :UserInfo.getUserId()];
        
        List<AggregateResult> aggTodaysOpp = [SELECT Count(Id) todayOppCount, SUM(Amount) todayTotalAmount 
                                              FROM Opportunity 
                                              WHERE CreatedById = :UserInfo.getUserId()
                                              AND CreatedDate >= TODAY
                                              AND CreatedDate < TOMORROW];
        
        Map<String,Object> mp = new Map<String,Object>(); 
        
        mp.put('oppCount',aggOpp[0].get('oppCount'));
        mp.put('totalAmount',aggOpp[0].get('totalAmount'));
        
        mp.put('todayOppCount',aggTodaysOpp[0].get('todayOppCount'));
        mp.put('todayTotalAmount',aggTodaysOpp[0].get('todayTotalAmount'));
        
        return JSON.serialize(mp);
    }
        
    @AuraEnabled(cacheable=true)
    public static list<Project__c> getProjects(){
        return [SELECT Id, Name, CreatedDate, Start_Date__c, End_Date__c, Status__c, Amount__c, Description__c, Address__Street__s, 
                Address__City__s, Address__StateCode__s 
                FROM Project__c
                Order By CreatedDate Desc];
    }
    
    
}