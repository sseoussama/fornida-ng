import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fa',
  templateUrl: './fa.component.html',
  styleUrls: ['./fa.component.scss']
})
export class FaComponent implements OnInit {

	@Input() name: string;
	@Input() fab: boolean;
	pre:string;

	constructor() {
	}

	ngOnInit() {
		this.pre = (this.fab) ? "fab" : "fa";
	}

}
