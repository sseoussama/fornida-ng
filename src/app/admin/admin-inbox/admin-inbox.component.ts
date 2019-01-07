import { Component, OnInit } from '@angular/core';
import { ConfigsService } from '../../_services';
import { _log, toArray } from '../../utils';

@Component({
  selector: 'admin-inbox',
  templateUrl: './admin-inbox.component.html',
  styleUrls: ['./admin-inbox.component.scss']
})
export class AdminInboxComponent implements OnInit {

	messages:any;
	comments:any;
	content:string = 'details'; // default view

	constructor(public configsService: ConfigsService) {
		this.getMessages();
	}

	ngOnInit() {
	}

	getMessages() {
		this.configsService.getMessages.subscribe( messages => {
			_log(` == messages (from inbox) ==> `, 'fb', messages);
			this.messages = toArray(messages);
		});
	}

	last(fullname) {
		return fullname.split(' ')[1];
	}

	remove(messageKey) {
		this.configsService.remove(`contact_form`, messageKey);
	}

	save(msg) {
		msg.content=null;
		this.configsService.set(`contact_form/${msg.key}`, msg );
		this.comments = false;
	}

	status(status, item) {
		if (item.status === status) {
			item.status = false;
		} else {
			item.status = status;
		}
	}

	current(msg, str) {
		return (msg.content) ? msg.content===str : this.content===str;
	}

// 	view(msg, str) {
// 		item.content==='details'
// item.content==='comments'

// 	}

}
