import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BcProductService, ConfigsService, LocalstorageService } from '../../../_services';
import { productCondition } from '../../../utils/_global';

@Component({
  selector: 'choose-server',
  templateUrl: './choose-server.component.html',
  styleUrls: ['./choose-server.component.scss']
})
export class ChooseServerComponent implements OnInit {

	@Input() Products: any;
	@Output() selection = new EventEmitter<any>();
	loading: any;

	get brand_list() { return this.bcProductService.Brands; }

	constructor(
		public bcProductService: BcProductService,
		public configsService: ConfigsService,
		public localstorageService: LocalstorageService
	) { bcProductService.getBrands(); }

	ngOnInit() {
	}

	chose_product(e, product) {
		this.selection.emit(product);
		this.nextTab();
	}

	nextTab() {
		if(this.localstorageService.isBrowser) { window.scrollTo(0, 0); }
		const $current = $('.wz-itm.active');
		const target_index = $current.index()+1;
		const $next = $('.wz-itm')[target_index];
		setTimeout(e=> this.triggerTab($next), 200);
	}

	triggerTab(target) {
		target.dispatchEvent(new Event('click'));
	}

	pSpecs(p) {
		return [
			{
				key: 'price',
				val: p.price
			},{
				key: 'width',
				val: p.width
			},{
				key: 'height',
				val: p.height
			},{
				key: 'weight',
				val: p.weight
			},{
				key: 'condition',
				val: productCondition(p.sku).val,
				info: productCondition(p.sku).info
			},{
				key: 'brand',
				val: this.brand(p.brand_id).name,
			}
		];
	}


	brand(id) {
		return this.brand_list.find(x => x.id === id);
	}

}
