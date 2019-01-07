import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { BcProductService, ConfigsService, LocalstorageService } from '../../_services'
import { productCondition } from '../../utils/_global'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-config-wizard',
  templateUrl: './config-wizard.component.html',
  styleUrls: ['./config-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigWizardComponent implements OnInit {

	content: any;
	types: any;
	no_product: any;
	observer: any;
	selected_product: any;
	loading: boolean = false;
	params = {};
	Products: any;
	specs: any;
	pre_configs: any;
	hov: any;
	loadProblem = false;
	editorContent: any;

	// get Products() { return this.bcProductService.Products; }
	// get brand_list() { return this.bcProductService.Brands; }

	generic_types = [
		{
			img: 'https://h50003.www5.hpe.com/digmedialib/prodimg/lowres/c04438275.png',
			label: 'rack server',
			slug: 'rack server',
			cat_id: 24
		},{
			img: 'https://h50003.www5.hpe.com/digmedialib/prodimg/lowres/i00030393.png',
			label: 'tower server',
			slug: 'tower server',
			cat_id: 25
		},{
			img: 'https://smhttp-ssl-67598.nexcesscdn.net/skin/frontend/ultimo/2016//images/megamenu/netapp-disk-shelf.png',
			label: 'Blade Server',
			slug: 'Blade Server',
			cat_id: 26
		},{
			img: 'https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_client_products/desktops/precision%20desktops/desktop_precision_7920/global_spi/desktop-precision-7920-tower-black-front-hero-504x350-ng-2.psd?fmt=png-alpha',
			label: 'Workstation Server',
			slug: 'Workstation Server',
			cat_id: 27
		}
	];

	brands = [
		{
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/1024px-Dell_Logo.svg.png',
			label: 'dell',
			slug: 'dell',
			types: this.generic_types,
			brand_id: 39
		},{
			img: 'http://123-hp-com-oj3830.com/blog/wp-content/uploads/2018/02/hpe1.png',
			label: 'HPE',
			slug: 'HPE',
			types: this.generic_types,
			brand_id: 38
		}
	];

	constructor(
		public elRef: ElementRef,
		public bcProductService: BcProductService,
		public configsService: ConfigsService,
		public localstorageService: LocalstorageService
	) {}

	ngOnInit() {
		this.triggerTab($('.wz-itm')[0]);
	}

	onTab(e, content) {
		const $t = $(e.target);
		this.content = content;
		$('.wz-itm.active').removeClass('active').addClass('done');
		$t.addClass('active').removeClass('done');
		this.place_underline($t);
	}

	place_underline(target) {
		const $underline = $('.underline');
		const activeL = target.position().left;
		const pad = parseInt(target.css('padding-left').replace('px',''));
		const containerL = $('.forunderlines.taj').position().left;
		const pos = activeL-containerL+pad+'px'
    	$underline.css({
			'margin-left': pos,
			'width': target.width()+'px'
    	});
	}

	triggerTab(target) {
		target.dispatchEvent(new Event('click'));
	}

	chose_brand(e, brand) {
		const $t = $(e.target);
		this.types = brand.types;
		this.params["brand_id"] = brand.brand_id;
		this.getProducts(this.params);
	}

	chose_type(e, type) {
		const $t = $(e.target);
		this.params["categories:in"] = type.cat_id;
		this.getProducts(this.params);
	}

	chose_product(product) {
		// called from eventemitter on <choose-server>
		this.selected_product = product;
		this.getPreConfigs(product.sku);
	}

	getPreConfigs(sku) {
		this.configsService.setCurrent(sku).subscribe(pre_configs => {
			this.pre_configs = this.toArray(pre_configs[3]);
		});
	}

	toArray(obj_obj) {
		return Object.keys(obj_obj).map(i => obj_obj[i]);
	}

	nextTab() {
		if(this.localstorageService.isBrowser) {
			window.scrollTo(0, 0);
		}
		const $current = $('.wz-itm.active');
		const target_index = $current.index()+1;
		const $next = $('.wz-itm')[target_index];
		setTimeout(e=> this.triggerTab($next), 200);
	}

	getProducts(params) {
		if (params["categories:in"] && params["brand_id"]) {
			const self = this;

			this.loading = true;
			self.loadProblem = false;

			// if timeout
			setTimeout(e=> { self.loadProblem = true; }, 5000);

			this.observer = this.bcProductService.getProducts_packed(params).subscribe(products => {


				if (products == null){
					this.loading = false;
					this.Products = [];
					return self.no_product = "No Servers Found";
				}


				this.loading = false;
				this.Products = products.data;
			});
			setTimeout(e=> this.observer.unsubscribe(), 2000);
		}else {
		}
	}

	// pSpecs(p) {
	// 	return [
	// 		{
	// 			key: 'price',
	// 			val: p.price
	// 		},{
	// 			key: 'width',
	// 			val: p.width
	// 		},{
	// 			key: 'height',
	// 			val: p.height
	// 		},{
	// 			key: 'weight',
	// 			val: p.weight
	// 		},{
	// 			key: 'condition',
	// 			val: productCondition(p.sku).val,
	// 			info: productCondition(p.sku).info
	// 		},{
	// 			key: 'brand',
	// 			val: this.brand(p.brand_id).name,
	// 		}
	// 	]
	// }


	// brand(id) {
	// 	return this.brand_list.find(x => x.id == id);
	// }

}

// function money(total) {
//     var neg = false;
//     if(total < 0) {
//         neg = true;
//         total = Math.abs(total);
//     }
//     return (neg ? "-$" : '$') + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
// }

function keys(myObject) {
	return Object.keys(myObject).map(function(key, index) {
	   return myObject[key] *= 2;
	});
}
