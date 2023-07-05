import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { loadingIconHTML, getErrorMessage } from '../htmlSnippets';

// New Ticket Submission From Client
export interface TicketSubmission {
    name:           string,
    email:          string,
    description:    string,
}

/// Ticket Submission Result
export enum TicketSubmitResult {
    UnknownError = 0,
    Success = 1,

    InvaildData = 100,
}

@Component({
    selector: 'app-create-ticket',
    templateUrl: './create-ticket.component.html',
    styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent {

    // Init View
    constructor(private http: HttpClient) { }

    
    // MARK: GLOBALS 

    // New Ticket Info
    newTicket: TicketSubmission = {
        name: '',
        email: '',
        description: '',
    }

    // Error Message to Display to User
    errorMessage = '';

    // Ticket Successfully Submitted (flips view to confirmation screen)
    successfulSubmit = false;


    // MARK: SERVER INTERACTION 

    /**
     * Send New Ticket to Server and inform User of the Result
     * @param event Event passed in from View
     */
    async submitTicket(event: any) {
        // Set Variables and Reset Error
        let submitButton = event.target;
        this.errorMessage = '';

        // Validate Form
        let newTicketForm = document.getElementById("newTicketForm") as any;
        newTicketForm.classList.remove('was-validated');

        if (newTicketForm.checkValidity() === false) { 
            this.errorMessage = 'The submitted Ticket form was invalid, please review and resubmit.'
            newTicketForm.classList.add('was-validated');
            return; 
        }

        // Add loading Icon & Disable button for now
        submitButton.innerHTML = loadingIconHTML;
        submitButton.disabled = true;

        // Make Server Call
        let response: any = await this.submitTicketPost(this.newTicket).catch((err) => { console.log(err) });

        // If we failed show error
        if (!response || response.result !== TicketSubmitResult.Success) {
            this.errorMessage = getErrorMessage(response && response.result ? response.result : TicketSubmitResult.UnknownError);

            submitButton.innerHTML = 'Try Again';
            submitButton.disabled = false;
        }
        // If we succeeded, show success message
        else { 
            submitButton.innerHTML = 'Success';
            submitButton.disabled = false;
            this.successfulSubmit = true;
        }
    }

    /**
     * Create Promise for Ticket Submission Server Call
     * @param ticket The Ticket we're submitting to the Server
     * @returns Promise of HTTP Post
     */
    submitTicketPost(ticket: TicketSubmission): Promise<any> { 
        return this.http.post(environment.serverURL + 'submitTicket', ticket).toPromise().catch((err) => { console.log(err) }); 
    }
}
