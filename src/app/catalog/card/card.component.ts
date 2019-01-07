import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'product-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

	@Input() product;
	isConfig = false;

	constructor() { }

	ngOnInit() {
		this.isConfigurable(this.product);
	}

	isConfigurable(p) {
		const is = JSON.stringify(p.custom_fields).includes('use_builder');
		this.isConfig = (is) ? true : false;
	}

}
