import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigsService } from './../_services';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { _log } from "../utils";

@AutoUnsubscribe()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

	_stashed: Subscription;
	content: string;
	stashed: any;

	topics = [
		{
			content: "builds",
			iconPath: "assets/img/ColoredLineIcons/png/256/bulletin_board.png",
			name: "Build Look Up"
		}, {
			content: "inbox",
			iconPath: "assets/img/ColoredLineIcons/png/256/product.png",
			name: "Contact Requests"
		}
	];

	// get stashed() { return this.configsService.Stashed; }

	constructor(
		public route: ActivatedRoute,
		public configsService: ConfigsService
	) {
		this.getStashed();
		this.routeParams();
	}

	ngOnInit() {
		setTimeout(e=>$('body').addClass('admin-page'),500);
	}
	ngOnDestroy() { }

	routeParams() {
		this.route.queryParams.subscribe(p => this.content = p['content']);
	}
	getStashed() {
		this.stashed = this.configsService.stashed;
		// this._stashed = this.configsService.getStashedConfigs().subscribe(stashed => {
		// 	_log(' == stashed (admin) ==> ', 'fb', stashed);
		// 	this.stashed = stashed;
		// });
	}


}
