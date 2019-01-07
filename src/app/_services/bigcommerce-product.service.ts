import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/Rx';
import { FirebaseProductsService } from './firebase-catalog.service';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { _log } from '../utils';
import { LocalstorageService } from '../_services/localstorage.service';
import { ConfigsService } from '../_services/configs.service';

declare var require: any;
// const colors = require('colors');



@Injectable()
export class BcProductService {

	allProducts: any = [];
	all_products_done: boolean = false;
	products: any;
	productMeta: any;
	collections: any;
	allBrands: any;
	categoryTree: any;
	current_collection: any;
	current_name: any;
	productDataChange: Subject<any> = new Subject<any>();
	toggleMobileNav: Subject<any> = new Subject<any>();
	nav: any;

	get Products() { return this.products; }
	get AllProducts() { return this.allProducts; }
	get Brands() { return this.allBrands; }
	get ProductMeta() { return this.productMeta; }
	get CategoryTree() { return this.categoryTree; }

	constructor(
		private http: HttpClient,
		private fProductsService: FirebaseProductsService,
		private route: ActivatedRoute,
		private router: Router,
		private localstorageService: LocalstorageService,
		private configsService: ConfigsService,
		private injector: Injector
	) {
		const self = this;
		// this.getCategories();

		if(localstorageService.isBrowser) {
			this.getAllProducts({limit:250});
			this.getCategoryTree();
			// this.getBrands();
		}

	}

	onNav(val) {
		_log(`onNav(${val})`, 'd');
		this.nav = val;
		this.toggleMobileNav.next(val);
	}

	getProducts(params?, next?) {
		params = (params) ? params : {};
		return this.http.get<any>( this.localstorageService.apiUrl + '/products',{params: params}).subscribe(products => {
	        _log(' == products (prod.service) ==> ', 'bc', products);
	        // this.fProductsService.addProducts(products.data[0]);
	        if (products == null) {
	        	if(next) { next([]); }
	        	return this.products = [];
			}
	        this.productMeta = products.meta;
	        this.productDataChange.next(products); // create event
	        return this.products = products.data;
	    });
	}

	getProducts_packed(params?) {
		params = (params) ? params : {};
		return this.http.get<any>( this.localstorageService.apiUrl + '/products',{params: params});
	}

	getAllProducts(params) {
		const self = this;
		// dont bother with api if is in localstorage
		this.allProducts_get( (ret)=> {
			if (ret) {
				getPage(params);
			} else {
				return false;
			}
		});
		function getPage(x) {
			return self.http.get<any>( self.localstorageService.apiUrl + '/products',{params: x}).subscribe(products => {
				const current_page = products.meta.pagination.current_page;
				const total_pages = products.meta.pagination.total_pages;
				_log(` == AllProducts (page ${current_page}) ==> `, 'bc', products);

				Array.prototype.push.apply(self.allProducts,products.data);

				// get next page if exists
				if(current_page < total_pages) {
					getPage({limit:250, page: current_page+1});
				} else {
					self.all_products_done = true;
					self.allProducts_store( self.allProducts );
					// self.allProducts_store( JSON.stringify(self.allProducts) );
				}
			});
		}
	}

	allProducts_store(data) {
		this.configsService.set('all_products', data);
	}

	allProducts_get(next) {
		return this.configsService.get('all_products').subscribe( (fb_prods) => {
			if (fb_prods) {
				this.allProducts = fb_prods;
				// this.allProducts = JSON.parse(<any>fb_prods);
				_log('fb_prods: ', 'fb',this.allProducts);
				return next(false);
			}
			return next(true);
		});
	}

	getCategories(params?) { // use this to get id with slug or other filters
		params = (params) ? params : {};
		return this.http.get<any>( this.localstorageService.apiUrl + '/categories',{params: params});
	}

	getCategoryTree() {
		this.http.get<any>( this.localstorageService.apiUrl + '/getCategoryTree')
		.subscribe (res => {
			_log(' == categoryTree ==> ','bc', res);
			return this.categoryTree = res.data;
		});
	}

	getCategoryTree_packed() {
		return this.http.get<any>( this.localstorageService.apiUrl + '/getCategoryTree');
	}

	serialize(obj) {
		let str = '';
		for( let key in obj ) {
		    if (str !== '') {
		        str += '&';
		    }
		    return str += key + '=' + obj[key];
		}
	}

	addParam(key, value, store) {
		if (store) { localStorage.setItem( key, value ); }
		if( !value ) { console.error('need to add Remove Param Method'); }
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {[key]: value},
			queryParamsHandling: 'merge',
			skipLocationChange: false
		});
	}

	getProductImages(product_id, limit) {
		limit = (limit) ? limit : 20;
		const data = {product_id: product_id, limit: limit };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getProductImages', {params: data} );
	}

	getProductImage(product_id, image_id?) {
		image_id = (image_id) ? image_id : 0;
		const data = {product_id: product_id, image_id: image_id };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getProductImage', {params: data} );
	}

	getCustomFields(product_id) {
		const data = { id: product_id };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getCustomFields', {params: data} );
	}

	getProductById(product_id) {
		console.log('getProductById');
		const data = { product_id: product_id };
		return this.http.get<any>(this.localstorageService.apiUrl + '/getProductById', { params: data }).catch(this.errHandler);
	}

	getProductModifier(product_id) {
		const data = { product_id: product_id };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getProductModifier', {params: data} );
	}

	getOptionById(product) {
		const data = { product: product };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getOptionById', {params: product} );
	}

	getOptions(product) {
		return this.http.get<any>( this.localstorageService.apiUrl + '/getOptions', {params: product} );
	}

	getVariantsByProductId(product_id) {
		const id = { id: product_id };
		return this.http.get<any>( this.localstorageService.apiUrl + '/getVariantsByProductId', {params: id} );
	}

	getBrands() {
		return this.http.get<any>( this.localstorageService.apiUrl + '/getBrands' ).subscribe(brands => {
	        _log(' == getBrands ==> ', 'bc', brands);
	        return this.allBrands = brands.data;
	    });
	}

	generateSitemap() {
		return this.http.get<any>( this.localstorageService.apiUrl + '/sitemap', {params: {}} );
	}

	errHandler(error: HttpErrorResponse) {
		_log(" == Product Service Error ==> ", 'e', error);
		return Observable.throw(error.error || "unknown error");
	}
}






