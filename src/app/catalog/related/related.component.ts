import { Component, OnInit, Input } from '@angular/core';
import { BcProductService } from '../../_services';
import { _log } from '../../utils';

@Component({
  selector: 'related-products',
  templateUrl: './related.component.html',
  styleUrls: ['./related.component.scss']
})
export class RelatedComponent implements OnInit {

	related: any = [];
	get Products() { return this.bcProductService.Products; }
	@Input() product;
	L: number = 4;
	limit: number = this.L+1;
	extra: boolean;

	constructor(public bcProductService: BcProductService) {
	}

	ngOnInit() {
		this.init();
	}

	init() {
		const self = this;
		setTimeout( function() {
			const id_list = self.product.related_products;
			const brand_id = self.product.brand_id;
			const cat_id = self.product.categories[0];
			if ( id_list.length > 1 ) {
				// console.log('related: Related');
				self.getRelatedProducts(id_list);
			} else if (brand_id !== 0) {
				// console.log('related: Brand', brand_id);
				self.getSameBrand(brand_id);
			} else {
				// console.log('related: Category', cat_id);
				self.getSameCategory(cat_id);
			}
		}, 2500); // dont interfere with main product load
	}

	dup(relatedId, pId) {
		if (relatedId === pId) {
			// this.L = this.L + 1; //later
			this.extra = true;
			return false;
		} else {
			return true;
		}
	}

	getRelatedProducts(id_list) {
		const self = this;
		for (let i = 0; i < id_list.length; i++) {
		    if ( i === self.limit ) { return false; }
		    self.getProduct(id_list[i]);
		}
	}

	getSameBrand(brand_id) {
		const self = this;
		this.getProducts(brand_id, "brand_id", setTimeout( function() {
			self.related = self.Products;
			self.excludeCurrent();
		}, 500));
	}

	getSameCategory(cat_id) {
		const self = this;
		this.getProducts(cat_id, "categories:in", setTimeout( function() {
			self.related = self.Products;
			self.excludeCurrent();
		}, 500));
	}

	excludeCurrent() {
		// this.related.forEach(ths => {
		// 	let duplicate = (ths.id === this.product.id);
		// 	(duplicate) ? 
		// })
	}

	getProducts(val, key, show) {
		this.bcProductService.getProducts({[key]: val, "limit": this.limit });
	}

	getProduct(id) {
		this.bcProductService.getProductById(id).subscribe(single => {
	        _log('== single (related) ==>:', "i", single);
	        this.related.push(single.data);
	    });
	}


}
