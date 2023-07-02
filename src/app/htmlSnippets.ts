import { TicketSubmitResult } from "./create-ticket/create-ticket.component";

export { loadingIconHTML, getErrorMessage }

/// HTML to add a Loading Icon
let loadingIconHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>';

/**
 * Get Error message for specific Result returned from Server
 * @param result TicketSubmitResult passed down from Server
 * @returns Error Message
 */
function getErrorMessage(result: TicketSubmitResult): string { 
    switch (result) {
        case TicketSubmitResult.InvaildData: {
            return 'The Data submitted to the Server was invalid. Please review the form and submit again.'
        }
        case TicketSubmitResult.Success: {
            return 'The Submission was Successful.'
        }
        default: {
            return 'An Unknown Error occured, please try again later. Or submit a HelpDesk Ticket (haha?)'
        }
    }
}