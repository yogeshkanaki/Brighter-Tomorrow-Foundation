import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import fetchEvents from '@salesforce/apex/CL_eventCalendar.fetchEvents';
import createEvent from '@salesforce/apex/CL_eventCalendar.createEvent';
import deleteEvent from '@salesforce/apex/CL_eventCalendar.deleteEvent';
import { refreshApex } from '@salesforce/apex';

export default class Lwc_eventCalendar extends LightningElement {
    fullCalendarJsInitialised = false;

    title;
    startDate;
    endDate;

    eventsRendered = false;
    openSpinner = false;
    openModal = false;

    @track events = [];

    eventOriginalData = [];

    @wire(fetchEvents)
    eventObj(value) {
        this.eventOriginalData = value;

        const { data, error } = value;
        if (data) {
            let events = data.map(event => {
                return {
                    id: event.Id,
                    title: event.Subject,
                    start: event.StartDateTime,
                    end: event.EndDateTime,
                    description: event.Description,
                    location: event.Location,
                    allDay: event.IsAllDayEvent
                };
            });
            this.events = JSON.parse(JSON.stringify(events));
            this.error = undefined;

            if (!this.eventsRendered) {
                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('renderEvents', this.events, true);
                this.eventsRendered = true;
            }
        } else if (error) {
            this.events = [];
            this.error = 'No events are found';
        }
    }

    renderedCallback() {
        if (this.fullCalendarJsInitialised) {
            return;
        }
        this.fullCalendarJsInitialised = true;

        Promise.all([
            loadScript(this, FullCalendarJS + "/FullCalendarJS/jquery.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/moment.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.js"),
            loadStyle(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.css"),
        ])
            .then(() => {
                this.initialiseFullCalendarJs();
            })
            .catch((error) => {
                console.error({
                    message: "Error occured on FullCalendarJS",
                    error,
                });
            });
    }

    initialiseFullCalendarJs() {
        const ele = this.template.querySelector("div.fullcalendarjs");
        const modal = this.template.querySelector('div.modalclass');

        var self = this;

        function openActivityForm(startDate, endDate) {
            self.startDate = startDate;
            self.endDate = endDate;
            self.openModal = true;
        }

        $(ele).fullCalendar({
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay",
            },
            defaultDate: new Date(),
            defaultView: 'agendaWeek',
            navLinks: true,
            selectable: true,
            timezone: 'Asia/Kolkata',

            select: function (startDate, endDate) {
                let stDate = startDate.format();
                let edDate = endDate.format();

                openActivityForm(stDate, edDate);
            },
            eventLimit: true,
            events: this.events,
        });
    }

    handleKeyup(event) {
        this.title = event.target.value;
    }

    handleCancel(event) {
        this.openModal = false;
    }

    handleSave(event) {
        let events = this.events;
        this.openSpinner = true;

        this.template.querySelectorAll('lightning-input').forEach(ele => {
            if (ele.name === 'title') {
                this.title = ele.value;
            }
            if (ele.name === 'start') {
                this.startDate = ele.value.includes('.000Z') ? ele.value : ele.value + '.000Z';
            }
            if (ele.name === 'end') {
                this.endDate = ele.value.includes('.000Z') ? ele.value : ele.value + '.000Z';
            }
        });

        let newevent = { title: this.title, start: this.startDate, end: this.endDate };

        this.openModal = false;

        createEvent({ 'event': JSON.stringify(newevent) })
            .then(result => {
                const ele = this.template.querySelector("div.fullcalendarjs");

                newevent.id = result;

                $(ele).fullCalendar('renderEvent', newevent, true);

                this.events.push(newevent);

                this.openSpinner = false;

                this.showNotification('Success!!', 'Your event has been logged', 'success');

            })
            .catch(error => {
                console.log(error);
                this.openSpinner = false;
                this.showNotification('Oops', 'Something went wrong, please review console', 'error');
            })
    }

    removeEvent(event) {
        this.openSpinner = true;

        let eventid = event.target.value;
        deleteEvent({ 'eventid': eventid })
            .then(result => {

                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('removeEvents', [eventid]);

                this.openSpinner = false;

                return refreshApex(this.eventOriginalData);
            })
            .catch(error => {
                console.log(error);
                this.openSpinner = false;
            });
    }

    addEvent(event) {
        this.startDate = null;
        this.endDate = null;
        this.title = null;
        this.openModal = true;
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}