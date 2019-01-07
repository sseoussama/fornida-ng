import { Component, OnInit, OnDestroy, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { BcProductService, LocalstorageService } from '../../_services/index';
import { _log } from '../../utils';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy, AfterViewInit {

	@Input() parent_id;

	parent_slug: string;
	child_slug: string;
	current_parent: any[];
	// categoryTree: any;
	Products: any;
	treeObserver: any;
	params: any;
	queryParams: any;
	defaultParams: object = {};
	current_child: any[];
	active_parent: any[];
	current_category: any[];
	active_cat_id: number;
	active_parent_id: number;
	_routeListener:Subscription;
	_routeEvents:Subscription;
	_productListener:Subscription;

	get categoryTree() { return this.bcProductService.CategoryTree; }
	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public bcProductService: BcProductService,
		public elRef: ElementRef,
		public localstorageService: LocalstorageService
	) {}

	ngOnInit() {
		// this.category_init();
		if(this.localstorageService.isBrowser) {
			$('body').addClass('category');
		}
	}

	ngAfterViewInit() {
		setTimeout(e=>this.updateAll(),500); // wait for category tree
		this.onRouteChange(); // Not needed (?)
		// setTimeout(e=>this.param_listener(this.categoryTree),500); // wait for category tree
    }

	category_init() {
		// this.categoryTree = this.bcProductService.categoryTree;
		// this.getCategoryTree(tree => this.param_listener(tree));
		// this.param_listener()
	}

	// getCategoryTree(next) { // not needed
	// 	this.treeObserver = this.bcProductService.getCategoryTree_packed().subscribe (res => {
	// 		_log(' == categoryTree (category.comp.ts) ==> ','bc', res);
	// 		this.categoryTree = res.data;
	// 		next(this.categoryTree)
	// 	});
	// 	// setTimeout(this.treeObserver.unsubscribe(),6000); // no reason to stay subscribed
	// }

	// param_listener(categoryTree) {
	// 	const self = this;
	// 	this._routeListener = this.route.params.subscribe(params => {
	// 		self.params = params;
	// 		self.setRouteData();
	// 	});
	// 	this.onRouteChange();
	// 	// setTimeout(e=>this._routeListener.unsubscribe(), 1000);
	// }

	updateAll() {
		this.queryParams = this.route.snapshot.queryParams;
        this.params = this.route.snapshot.params;
        this.setRouteData();
	}

	onRouteChange() {
		this._routeEvents = this.router.events.subscribe((event) => {
			if(event instanceof NavigationEnd && event.url.includes('category')) {
				_log("onRouteChange (category):", 'listener');
				this.updateAll();
			}
		});
	}

	setRouteData() {
		const self = this;
		let params = this.params;
		let categoryTree = this.categoryTree;
		const parent_slug = params['collection'];
		const child_slug = params['child'];
		let active_slug = (child_slug && child_slug !== 'all') ? child_slug : parent_slug;
		self.active_cat_id = (self.query_categoryTree(active_slug, categoryTree, 'id'));
		self.active_parent_id = self.query_categoryTree(active_slug, categoryTree, 'parent_id');
		// active state on top nav
		if(this.localstorageService.isBrowser) {
			$('#category-'+self.active_parent_id).addClass('active');
		}
		this.assembleParams(self.active_cat_id);
	}

	assembleParams(active_cat_id) {
		this.setDefaultParams();
		const self = this;
		let queryParams = self.route.snapshot.queryParams;
		try {
			let allParams = Object.assign({"categories:in": active_cat_id, "page":1}, queryParams );
			allParams = Object.assign(self.defaultParams, allParams);
			self.getProducts(allParams);
		} catch(err) {
			console.error(err);
		    // self.notice.warning( err, `Cant find category_id`, failedCat_id);
		}
	}

	setDefaultParams() {
		this.defaultParams = {};
		this.defaultParams['limit'] = localStorage.getItem("limit") || 21;
		this.defaultParams['sort'] = localStorage.getItem("sort") || 'total_sold';
		if(this.defaultParams['brand_id']) { delete this.defaultParams['brand_id']; }
	}

	subscribe_product_changes() {
		if(this._productListener) {this._productListener.unsubscribe();}
		this._productListener = this.bcProductService.productDataChange.subscribe(products => {
			// _log(' == productDataChange (category.c.ts) ==> ', 'bc', products);
			// this.bcProductService.productDataChange.next(products);
			_log("product_changes (category):", 'listener');
			this.Products = products.data;
		});
	}

	getProducts(allParams) {
		this.Products = [];
		_log("allParams:", 'i', allParams);
		this.subscribe_product_changes();
		this.bcProductService.getProducts(allParams);
	}

	query_categoryTree(query, categoryTree, val) {
		return categoryTree.reduce((a, { url, children, id }) => {
		  if (a) { return a; }
		  if (url.includes(query)) { return id; }
		  const foundChild = children.find(({ url }) => url.includes(query));
		  if (foundChild) { return foundChild[val]; }
		}, null);
	}


	ngOnDestroy() {
		// if(this._routeListener) { this._routeListener.unsubscribe(); }
		// if(this._routeEvents) { this._routeEvents.unsubscribe(); }
		// if(this._productListener) { this._productListener.unsubscribe(); }
	}

}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}







