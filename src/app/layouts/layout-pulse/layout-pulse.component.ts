import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'layout-pulse',
  templateUrl: './layout-pulse.component.html',
  styleUrls: ['./layout-pulse.component.scss']
})
export class LayoutPulseComponent implements OnInit {

	current: number = 1;
	@Input() data: any;

	constructor() { }

	ngOnInit() {
	}

}
