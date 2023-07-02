import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { TicketSubmitResult } from '../create-ticket/create-ticket.component';
import { ClientTicket, TicketStatus } from '../manage-tickets/manage-tickets.component';

import { loadingIconHTML, getErrorMessage } from '../htmlSnippets';

/// Ticket Update
export interface TicketUpdate {
    ticketID:               string,
    newStatus:              TicketStatus,
    response:               string,
}

/// Unscrew TS
declare let $: Function;

@Component({
    selector: 'app-edit-ticket-modal',
    templateUrl: './edit-ticket-modal.component.html',
    styleUrls: ['./edit-ticket-modal.component.scss']
})
export class EditTicketModalComponent {

    // Init View
    constructor(private http: HttpClient) { }

    // Reload Table Function to Call
    reloadTickets: (() => void) | null = null;

    // Ticket Info (init with empty ticket so we don't need null checks in Anuglar View Code)
    clientTicket: ClientTicket = {
        '_id':              'Empty',

        'name':             'Empty',
        'email':            'Empty',
        'description':      'Empty',

        'createdAt':	    new Date(),
        'status':			TicketStatus.New,
    };

    // Edit Ticket Response
    ticketResponse = '';

    // Error Message to Display to User
    errorMessage = '';

    /**
     * Populate Ticket Edit Modal
     * @param clientTicket Client Ticket to populate Modal With
     */
    populateModal(clientTicket: ClientTicket) {
        this.clientTicket = clientTicket;
        this.ticketResponse = '';
    }

    /// Hide Modal
    hideModal() { ($('#editTicketsModal') as any).modal('hide'); }


    // MARK: SERVER INTERACTION 

    /**
     * Send Response to Server and inform User of the Result
     * @param event Event passed in from View
     */
    async submitTicketResponse(event: any) {
        // Set Variables and Reset Error
        let submitButton = event.target;
        this.errorMessage = '';

        // Validate Form
        let ticketResponseForm = document.getElementById("ticketResponseForm") as any;
        ticketResponseForm.classList.remove('was-validated');

        if (ticketResponseForm.checkValidity() === false) { 
            this.errorMessage = 'The submitted Ticket Response form was invalid, please review and resubmit.'
            ticketResponseForm.classList.add('was-validated');
            return; 
        }

        // Add loading Icon & Disable button for now
        submitButton.innerHTML = loadingIconHTML;
        submitButton.disabled = true;

        // Prep & Make Server Call
        let body: TicketUpdate = {
            'ticketID':     this.clientTicket._id,
            'newStatus':    this.clientTicket.status,
            'response':     this.ticketResponse,
        }
        let response: any = await this.submitResponsePost(body);

        // If we failed show error
        if (!response || response.result !== TicketSubmitResult.Success) {
            this.errorMessage = getErrorMessage(response.result ?? TicketSubmitResult.UnknownError);

            submitButton.innerHTML = 'Try Again';
            submitButton.disabled = false;
        }
        // If we succeeded, show success message
        else { 
            submitButton.innerHTML = 'Success';
            submitButton.disabled = false;

            // Reload Tickets and Hide Modal
            if (this.reloadTickets) { this.reloadTickets(); }
            this.hideModal();
        }
    }

    /**
     * Create Promise for Ticket Response Submission Server Call
     * @param response The response data going to the server
     * @returns Promise of HTTP Post
     */
    submitResponsePost(body: any): Promise<any> { 
        return this.http.post(environment.serverURL + 'submitTicketResponse', body).toPromise(); 
    }
}
