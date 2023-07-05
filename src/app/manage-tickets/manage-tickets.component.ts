import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { EditTicketModalComponent } from '../edit-ticket-modal/edit-ticket-modal.component';

import { TicketSubmission } from '../create-ticket/create-ticket.component';

/// Unscrew TS
declare let $: Function;

// Stripped Down Ticket for Ticket Management
export interface ClientTicket extends TicketSubmission {
    _id:            string,

    createdAt:      Date,
    status:         TicketStatus,
	statusHistory:	StatusUpdate[],
}

/**
 * Status Update
 * Functions as a snapshot in the Status History
 */
export interface StatusUpdate {
    timestamp:      Date,
    status:         TicketStatus,
    detail:    		string,
}

/// Ticket Status
export enum TicketStatus {
    New = 1,
	InProgress = 2,
	Resolved = 3,
}

/// Ticket Loading Response
export interface TicketLoadingResponse {
    newTickets:             ClientTicket[],
    inProgressTickets:      ClientTicket[],
    resolvedTickets:        ClientTicket[],
}

@Component({
    selector: 'app-manage-tickets',
    templateUrl: './manage-tickets.component.html',
    styleUrls: ['./manage-tickets.component.scss']
})
export class ManageTicketsComponent implements OnInit, AfterViewInit {

    /// Child View for Main Add Model Form
    @ViewChild(EditTicketModalComponent)
    public editTicketModal!: EditTicketModalComponent

    // Init View
    constructor(private http: HttpClient) { }

    // Start loading the Tickets here
    ngOnInit() {
        this.loadTickets();
    }

    // Set pointer on child view here
    ngAfterViewInit() {
        this.editTicketModal.reloadTickets = () => { this.loadTickets(); }
    }

    // MARK: GLOBALS 

    // New Tickets in the System
    newTickets: ClientTicket[] = [];

    // Tickets in Progress
    inProgressTickets: ClientTicket[] = [];

    // Resolved Tickets
    resolvedTickets: ClientTicket[] = [];


    // MARK: SERVER INTERACTION 

    /// Property for Client to Hide / Show Loading Icon
    loadingTickets = false;

    /**
     * Load All Tickets from Server
     */
    async loadTickets() {
        // Load from DB
        this.loadingTickets = true;
        let response: TicketLoadingResponse = await this.getTickets().catch((err) => { console.log(err) }) as any;
        this.loadingTickets = false;

        // Check if we were successful
        if (!response || !response.newTickets || !response.inProgressTickets || !response.resolvedTickets) {
            alert('There was an issue loading the Tickets, please contact customer support');
            return;
        }

        // Set Globals
        this.newTickets = response.newTickets; 
        this.formatClientTickets(this.newTickets);

        this.inProgressTickets = response.inProgressTickets; 
        this.formatClientTickets(this.inProgressTickets);

        this.resolvedTickets = response.resolvedTickets; 
        this.formatClientTickets(this.resolvedTickets);
    }

    /**
     * Create Promise for loading Tickets from Server
     * @returns Promise of HTTP Get
     */
    getTickets(): Promise<any> { 
        return this.http.get(environment.serverURL + 'getTickets').toPromise().catch((err) => { console.log(err) }); 
    }


    // MARK: CLIENT INTERACTION

    /**
     * Pull Up Modal to Edit New Ticket
     * @param index Ticket index in Array
     */
    editNewTicket(index: number) {
        // Populate Modal
        this.editTicketModal.populateModal(this.newTickets[index]);

        // Show Modal
        ($('#editTicketsModal') as any).modal('show');
    }

    /**
     * Pull Up Modal to Edit In Progress Ticket
     * @param index Ticket index in Array
     */
    editInProgressTicket(index: number) {
        // Populate Modal
        this.editTicketModal.populateModal(this.inProgressTickets[index]);

        // Show Modal
        ($('#editTicketsModal') as any).modal('show');
    }

    /**
     * Pull Up Modal to Edit New Ticket
     * @param index Ticket index in Array
     */
    editResolvedTicket(index: number) {
        // Populate Modal
        this.editTicketModal.populateModal(this.resolvedTickets[index]);

        // Show Modal
        ($('#editTicketsModal') as any).modal('show');
    }


    // MARK: CLIENT FORMATTING

    /**
     * Formats Client Tickets
     * @param tickets Client Tickets
     * @returns Formatted Client Tickets
     */
    formatClientTickets(tickets: ClientTicket[]) {
        for(let ticket of tickets) {
            ticket.createdAt = new Date(ticket.createdAt);

            for(let statusUpdate of ticket.statusHistory) {
                statusUpdate.timestamp = new Date(statusUpdate.timestamp);
            }
        }
    }
}
