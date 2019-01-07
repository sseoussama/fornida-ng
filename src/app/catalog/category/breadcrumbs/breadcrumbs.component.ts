import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
	
	@Input() active_parent;
	@Input() child_slug;

	constructor() { }

	ngOnInit() {
	}

}
