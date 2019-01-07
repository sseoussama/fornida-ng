import { Component, Input, OnInit } from '@angular/core';
import { ConfigsService } from '../../_services';
import { _log } from '../../utils';

@Component({
  selector: 'admin-builds',
  templateUrl: './admin-builds.component.html',
  styleUrls: ['./admin-builds.component.scss']
})
export class AdminBuildsComponent implements OnInit {

	@Input() builds: any;
	ready: any;
	detailContent: any;
	componentsModal: any;
	cID: any;
	editorContent: any;
	buildQuery: string;
	reverse = true;
	order:string = "created"; // default sort
	statuses = [
		{
			val: 'being_assembled',
			bg: 'yellow-bg',
			color: 'white'
		},{
			val: 'waiting_parts',
			bg: 'orange-bg',
			color: 'white'
		},{
			val: 'on_hold',
			bg: 'red-bg',
			color: 'white'
		},{
			val: 'un-touched',
			bg: 'light-bg',
			color: 'dark'
		},{
			val: 'cancelled',
			bg: 'light-bg',
			color: 'dark'
		},{
			val: 'ready_to_ship',
			bg: 'blue-bg',
			color: 'white'
		},{
			val: 'testing',
			bg: 'light-bg',
			color: 'green'
		},{
			val: 'shipped',
			bg: 'green-bg',
			color: 'white'
		}
	];

	status_color(build, next?) {
		this.builds.map(b=> {
			try {
				b.status_color = this.statuses.find(e=>e.val===b.status).color;
				b.status_bg = this.statuses.find(e=>e.val===b.status).bg;
			} catch {
				b.status_color = this.statuses.find(t=>t.val==='un-touched').color; // same as above
				b.status_bg = this.statuses.find(t=>t.val==='un-touched').bg; // same as above
				b.status = this.statuses.find(t=>t.val==='un-touched').val;
			}
		});
		if(next) { next(); }
	}

	build_color(b, next?) {
		try {
			b.status_color = this.statuses.find(e=>e.val===b.status).color;
			b.status_bg = this.statuses.find(e=>e.val===b.status).bg;
		} catch {
			b.status_color = this.statuses.find(t=>t.val==='un-touched').color; // same as above
			b.status_bg = this.statuses.find(t=>t.val==='un-touched').bg; // same as above
			b.status = this.statuses.find(t=>t.val==='un-touched').val;
		}
		if(next) { next(b); }
	}

	constructor(
		public configsService: ConfigsService,
	) {
		console.log('ADMIN BUILDS');
	}


	ngOnInit(): void {
		_log('admin-builds','d',this.builds);
		this.reverse = true;
		this.status_color(this.builds, () => this.ready = true );
	}

	re() {
		const self = this;
		this.ready = false;
		setTimeout(e=> {
			self.ready=true;
		},1000);
	}
	saveBuild(build, single) {
		this.ready = false;
		if(!single) {
			this.status_color(build, () => this.configsService.modify_a_build(build));
		} else {
			this.build_color(build, (b) => this.configsService.modify_a_build(b));
		}
		this.builds = this.configsService.stashed;
		this.ready = true;
	}

	sort(key) {
		(this.order !== key) ? this.order = key : this.reverse = !this.reverse;
	}

	rmBuild(build) {
		this.configsService.remove(`stashed`, build.build_id);
	}


}







