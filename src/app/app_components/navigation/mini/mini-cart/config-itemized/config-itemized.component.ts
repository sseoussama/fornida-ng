import { Component, OnInit, Input } from '@angular/core';
import { _log, notice, SnotifyService } from '../../../../../utils';
import { ConfigsService } from '../../../../../_services';

@Component({
  selector: 'itemized',
  templateUrl: './config-itemized.component.html',
  styleUrls: ['./config-itemized.component.scss']
})
export class ConfigItemizedComponent implements OnInit {

	@Input() product: any;
	@Input() show: any;
	build_id: any;
	components: any;
	stash: any;
	per: any;

	constructor(public configsService: ConfigsService) {
	}

	ngOnInit() {
		// this.build_id = this.product['build_id'];
	}

	// getConfigs(build_id) {
	// 	const configs_obj = this.stashed.find(x => x['build_id'] === build_id);
	// 	this.configs = configs_obj.components;
	// 	this.stash = configs_obj;
	// 	// this.configs = toArray(configs_obj);
	// 	// console.log('matching stashed config ==>', this.configs);
	// }

	toggleQty(e) {
		this.per = e.target.checked;
    }



}



function toArray(obj_obj) { return Object.keys(obj_obj).map(i => obj_obj[i]); }





