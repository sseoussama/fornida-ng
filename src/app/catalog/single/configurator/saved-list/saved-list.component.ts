import { Component, OnInit, Input } from '@angular/core';
import { ConfigsService, BcAuthService } from '../../../../_services';
import { _log } from '../../../../utils/';
import { BuilderOptionsComponent } from '../builder-options/builder-options.component';
import { slugify } from '../../../../utils/_global';

@Component({
  selector: 'saved-configs',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.scss']
})
export class SavedListComponent implements OnInit {

	mode: any;
	@Input() product: string;
	savedConfigs: any;
	onDeck: any;
	modal: boolean;
	set: any = {};

	constructor(
		public configsService: ConfigsService,
		public bcAuthService: BcAuthService,
		public optionsComponent: BuilderOptionsComponent
	) {}

	ngOnInit() {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
			this.getSavedConfigs();
		});
	}


	getSavedConfigs() {
		this.configsService.getSavedConfigs(this.product['sku']).subscribe(savedConfigs => {
			_log(' == getSavedConfigs() res ==> ', 'i', savedConfigs);
			this.savedConfigs = savedConfigs;
		});
	}

	removeSavedConfig(name) {
		this.configsService.removeSavedConfig({
			sku: this.product['sku'],
			slug: slugify(name)
		});
	}

	onPreConfig(e, s) {
		this.optionsComponent.onPreConfig(e,s);
	}

	loading(e,dur) {
		const self = this;
		let target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next){
			target.removeClass('is-loading').dequeue();
			self.modal = false;
		});
	}

}

