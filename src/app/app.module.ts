import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ManageTicketsComponent } from './manage-tickets/manage-tickets.component';
import { EditTicketModalComponent } from './edit-ticket-modal/edit-ticket-modal.component';

const routes: Routes = [
	{ path: '', component: CreateTicketComponent },
	{ path: 'createTicket', component: CreateTicketComponent },

	{ path: 'manageTickets', component: ManageTicketsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CreateTicketComponent,
    ManageTicketsComponent,
    EditTicketModalComponent
  ],
  imports: [
    BrowserModule,
		FormsModule,
    RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled', // Start new page at top
		}),
		HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
