public without sharing class CL_eventCalendar {
    
    @AuraEnabled(cacheable=true)
    public static List<Event> fetchEvents() {
        return [SELECT Id, Subject, StartDateTime, IsAllDayEvent, EndDateTime 
                FROM Event
                ORDER BY CreatedDate DESC
                LIMIT 100];
    }
    
    @AuraEnabled
    public static Id createEvent(String event){
        
        if(String.isBlank(event)){
            return null;
        }
        
        Map<String, Object> eventMap = (Map<String, Object>) JSON.deserializeUntyped(event);
        
        Event newEvent = new Event();
        newEvent.Subject = eventMap.get('title') != null ? (String)eventMap.get('title') : null;

        String startdate = eventMap.get('start') != null ? 
                            ((String)eventMap.get('start')).replace('T', ' ').replace('.000Z', '') : 
                            null;
        String endDate = eventMap.get('end') != null ? 
                            ((String)eventMap.get('end')).replace('T', ' ').replace('.000Z', '') : 
                            null;
        
		system.debug('startdate '+startdate);
		system.debug('endDate '+endDate);
        
        newEvent.StartDateTime = startdate != null ? DateTime.valueOfgmt(startdate) : null;
        newEvent.EndDateTime = endDate != null ? DateTime.valueOfgmt(endDate) : null;
        
        insert newEvent;
        
        return newEvent.Id;

    }
    
    @AuraEnabled
    public static void deleteEvent(Id eventid) {
        
        if(eventid != null){
            delete [SELECT Id FROM Event Where Id=:eventid];
        }

    }
    
}