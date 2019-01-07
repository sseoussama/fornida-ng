import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BcProductService } from '../../../_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'category-aside',
  templateUrl: './category-aside.component.html',
  styleUrls: ['./category-aside.component.scss']
})
export class CategoryAsideComponent implements OnInit, OnDestroy {

	@Input() categoryTree: any;
	@Input() active_parent_id: string;

	i40: boolean;
	option4: boolean;
	params: any = {};

	get brands() { return this.bcProductService.Brands; }

	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public bcProductService: BcProductService
	) {
		this.bcProductService.getBrands();
	}

	ngOnInit() {
		this.markParams();
		const self = this;
		// setTimeout( function(){
		// 	self.i40 = true;
		// 	self.option4 = true;
		// }, 2000);
		setTimeout(e=>this.autoChildrenNav(),800);
	}
	ngOnDestroy() {
		// console.error('aside destroyed');
	}

	onBrand(e, brand_id) {
		const isChecked = e.target.checked;
		const value = (isChecked) ? brand_id : null;
		this.bcProductService.addParam( 'brand_id', value, false);
	}

	det(id) {
		return (this.params.brand_id === id) ? true : false;
	}

	markParams() {
		this.route.queryParams.subscribe(params => {
	        this.params = params;
	        // this.params.push(params);
	        // this.params.push(params['param2']);
	    });
	}


	isActive(p){
		return p.id===this.active_parent_id;
	}

	parentClick(parent) {
		// this.closeCurrent();
		this.router.navigate([`/category${parent.url}all`]);
			// parent.child_open = !parent.child_open;
	}

	autoChildrenNav() {
		let parent = this.categoryTree.find(p=>p.id===this.active_parent_id);
		parent.child_open = true;
	}

	closeCurrent(cb?) {
		let parent = this.categoryTree.find(p => p.id === this.active_parent_id);
		if(parent.child_open === true){
			parent.child_open = false;
		}
		// cb();
	}

}

















