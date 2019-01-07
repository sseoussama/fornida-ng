import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigsService } from '../../_services';

@Component({
  selector: 'admin-itemized',
  templateUrl: './admin-itemized.component.html',
  styleUrls: ['./admin-itemized.component.scss']
})
export class AdminItemizedComponent implements OnInit {

	@Input() cID: any;
	@Input() build: any;
	@Input() build_stats: any;
	@Output() changeBuildStatus = new EventEmitter<string>();

	commentsChanged:any;
	edits: any;
	editMode: any;
	ready: any;
	components:any;

	statuses = [
		{
			val: 'on-order',
			bg: 'orange-bg',
			color: 'white'
		},{
			val: 'installed',
			bg: 'green-bg',
			color: 'white'
		},{
			val: 'testing',
			bg: 'light-bg',
			color: 'green'
		},{
			val: 'done',
			bg: 'green-bg',
			color: 'white'
		},{
			val: 'issue_discovered',
			bg: 'red-bg',
			color: 'white'
		},{
			val: 'not_needed',
			bg: 'light-bg',
			color: 'dark'
		},{
			val: 'received',
			bg: 'light-bg',
			color: 'dark'
		}
	];

	constructor(public configsService: ConfigsService) {
	}

	ngOnInit() {
		console.log("====>",this.build_stats);
		this.components = this.build.components;
		this.component_colors();

		// so comments are not saved on load
		setTimeout(e=>this.ready=true, 1300);
	}

	onBuildStatus(stat) {
		this.build.status = stat;
		this.changeBuildStatus.emit(this.build);
	}

	component_colors(next?) {
		this.components.map(b=> {
			try {
				b.status_color = this.statuses.find(e=>e.val==b.status).color;
				b.status_bg = this.statuses.find(e=>e.val==b.status).bg;
			} catch {
				b.status_color = this.statuses.find(t=>t.val==='received').color; // same as above
				b.status_bg = this.statuses.find(t=>t.val==='received').bg; // same as above
				b.status = this.statuses.find(t=>t.val==='received').val;
			}
		});
		if(next) { next(); }
	}
	saveItem(item, single) {
		console.log(this.indx(item));
		this.component_colors( () => this.configsService.set(`stashed/${this.build.build_id}/components/${this.indx(item)}`, item));
		// this.builds = this.configsService.stashed;
	}

	indx(item) {
		let obj = this.components.find(c=>c.id==item.id);
		return this.components.indexOf(obj);
	}

	saveBuild() {
		if(this.ready) {
			this.configsService.modify_a_build(this.build);
			this.edits = false;
		}
	}

	onComments() {
		if(this.ready) {
			this.edits = true;
		}
	}

}










