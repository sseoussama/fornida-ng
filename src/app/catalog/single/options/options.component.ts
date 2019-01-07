import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BcProductService } from '../../../_services';
import { _log } from '../../../utils';

@Component({
  selector: 'product-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

	@Input() product: any[];
	options: any[];
	variants: any[];
	variant: any[] = [];
	option_selections: any = {};
	original: object = {};
	@Output() optionSelected = new EventEmitter<object>();

	constructor( public bcProductService: BcProductService ) {
	}

	ngOnInit() {
		// const self = this;
		this.onGetOptions(this.product);
		this.getVariants(this.product);
		// setTimeout( function() {
		// 	this.original['sku'] = this.product.sku;
		// },1000);
	}


	onGetOptions(product) {
		this.bcProductService.getOptions(product).subscribe (res => {
			_log(' == getOptions ==> ', "i", res);
			return this.options = res.data;
		});
	}

	onOptionSelected(option_id, val) {
		this.option_selections[option_id] = val; // object
		this.variant = this.getVariant(this.variants, this.option_selections)[0];
		console.log('variant: ',this.variant);
		this.showVariantData(this.product, this.variant);
		this.optionSelected.emit({
			option_selections: this.option_selections,
			variants: this.variants,
			variant: this.variant
		});
	}

	getVariants(product) {
		this.bcProductService.getVariantsByProductId(product.id).subscribe (res => {
			_log(' == getVariantsByProductId ==> ','i', res);
			return this.variants = res.data;
		});
	}

	getVariant(variants, selected){
		selected = Object.values(selected); // convert (o of o) to (a of o)
		const selected_ids  = selected.map(e=>e.id); // just ids
		return variants.filter( e => {
			if (selected_ids.length == e.option_values.length)
			return e.option_values.every( e => selected_ids.indexOf(e.id) > -1);
		});
	}

	showVariantData(product, variant) {
		// product.sku = (variant) ? variant.sku : this.original['sku'];
	}



}



