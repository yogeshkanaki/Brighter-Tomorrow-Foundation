public class CL_impactMap {
	@AuraEnabled (cacheable=true)
    public static List<Project__c> fetchProjects(){
        return [SELECT Id, Name, Account__c, Start_Date__c, End_Date__c, Status__c, Amount__c, Address__Street__s, Address__City__s, Address__StateCode__s, 
                Address__PostalCode__s, Address__CountryCode__s, Address__Latitude__s, Address__Longitude__s, Address__GeocodeAccuracy__s, Address__c, Description__c 
                FROM Project__c]; 
    }
}