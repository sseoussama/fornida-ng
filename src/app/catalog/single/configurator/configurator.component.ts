import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BcAuthService, ConfigsService } from '../../../_services';
import { ActivatedRoute } from '@angular/router';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit, OnDestroy {


	@Input() product: any;
	@Output() toggle_builder = new EventEmitter<any>();

	show_builder: boolean;
	save_modal: boolean;
	mode: any;
	queryParams: any;
	join: any;
	configs: any;
	submitted: boolean;
	_configSubmitted: Subscription;
	_mode: Subscription;
	_listSnapshotChanges: Subscription;

	constructor(
		public bcAuthService: BcAuthService,
		public route: ActivatedRoute,
		public configsService: ConfigsService,
	) {
		this._configSubmitted = this.configsService.configSubmitted.subscribe((value) => {
        	this.submitted = value;
        });
		this.getConfigs();
		this._mode = this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		this.queryParams = this.route.snapshot.queryParams;
		this.join = this.queryParams.join;
		if (this.join) {
			// this.show_builder = true;
			this.toggleBuilder(true);
		}
	}

	ngOnInit() { }
	ngOnDestroy() { }

	toggleBuilder(v) {
		this.show_builder = v;
		this.toggle_builder.emit(v);
	}

	addtocart() { // also do this for other add to cart
		console.error('hook other button up');
		// this.configsService.addtocart(this.configs);
	}


	loading(e, dur) {
		const target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next) {
			target.removeClass('is-loading');
			target.dequeue();
		});
	}

	calculate_price() {
		const configs_sum = sum(this.configs, 'calculated_price')||0;
		return (configs_sum)+this.product.price;
	}

	getConfigs() {
		this._listSnapshotChanges = this.configsService.listSnapshotChanges.subscribe( configs => {
			this.configs = configs;
		});
	}

	toNumber(str) {
		return parseInt(str);
	}

}


function sum(items, prop) {
    return items.reduce( function(a, b) {
        return a + b[prop]*b['quantity'];
    }, 0);
}
