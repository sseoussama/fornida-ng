import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'layout-2up',
  templateUrl: './layout-2up.component.html',
  styleUrls: ['./layout-2up.component.scss']
})
export class Layout2upComponent implements OnInit {

	@Input() data: any;

	constructor() { }

	ngOnInit() {
	}

}