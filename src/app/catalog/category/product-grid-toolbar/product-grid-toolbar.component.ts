import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BcProductService, LocalstorageService } from '../../../_services';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'category-toolbar',
  templateUrl: './product-grid-toolbar.component.html',
  styleUrls: ['./product-grid-toolbar.component.scss']
})
export class ProductGridToolbarComponent implements OnInit {

	limit: any;
	queryParams: any;
	sort: string;
	asc: any = true;
	paginate: boolean = false;
	page: any = {};
	pages: any[] = [];
	productMeta: any[];

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public bcProductService: BcProductService,
		public notice: SnotifyService,
		public localstorageService: LocalstorageService
	) {
		this.currentParams();
		this.limit = localStorage.getItem("limit") || 20;
		this.sort = localStorage.getItem("sort") || 'total_sold';
		this.asc = localStorage.getItem("collection_sort") || true;
	}

	ngOnInit() {
		this.productMeta = this.bcProductService.ProductMeta;
		this.init_search(); // frontend stuff (once)
		this.subscribe_product_changes();
	}

	subscribe_product_changes() {
		this.bcProductService.productDataChange.subscribe((productData) => {
            this.pagination(productData);
        });
	}

	pagination(productData) {
		this.productMeta = productData.meta; //set productMeta 
        this.page = this.productMeta['pagination']; // store meta data in 'page' var
        let show = this.productMeta['pagination'].total_pages>1; // determine if pagination is needed
        this.page.show_pages = (show) ? true : false; // template show/hide var
    	let pageLength = this.page.total_pages; 
    	this.pages = Array.from(Array(pageLength).keys()); // make array item foreach
        // if(!show) { this.onPageChange(1); } //if only one page / set it to current
	}

	currentParams() {
		this.route.queryParams.subscribe(queryParams => {
	        this.queryParams = queryParams;
	    });
	}


	onPageChange(page, e?) {
		if(e){
			$(event.target).siblings().removeClass('active');
			$(event.target).addClass('active');
		}
		this.bcProductService.addParam( 'page', page, false);
	}


	onPerPage( value ) {
		setTimeout(e=>this.bcProductService.addParam( 'page', 1, true),400);
		this.bcProductService.addParam( 'limit', value, true);
	}

	onSorter( value ) {
		this.bcProductService.addParam( 'sort', value, false);
	}

	sortDirection( asc ) {
		localStorage.setItem( "collection_sort", asc );
		let value = (asc) ? "asc" : "desc" 
		this.bcProductService.addParam( 'direction', value, false);
	}

	onSearch( value ) {
		this.bcProductService.addParam( 'keyword', value, false);
	}

	init_search() {
		const selff = this;
		let search, button, input, clearButton, input_mobile, clearButton2;
		if(this.localstorageService.isBrowser) {
			search = $('#grid-search');
			button = $('#grid-search-button');
			input = $('#grid-search-input');
			input_mobile = $('#grid-search-input-mobile');
			clearButton = $('#clean');
			clearButton2 = $('#clean2');

			input.focus( onInputFocus );
			input.on( 'blur', onInputBlur );
			button.on('click', e=> { input.focus(); });
			clearButton.on('click', onClear);
			clearButton2.on('click', onClear);
			// button.on('click', submit);
			input.on('keydown', function() {
				if ((<any>event).keyCode === 13) { submit(input.val()); }
			});
			input_mobile.on('keydown', function() {
				if ((<any>event).keyCode === 13) { submit(input_mobile.val()); }
			});
			input_mobile.on('blur', e => submit(input_mobile.val()) );
		}

		function submit(val) {
			selff.onSearch(val);
			search.addClass('loading');
			setTimeout(function() {
				search.removeClass('loading');
			}, 1500);
		}

		function onInputFocus(ev) {
			search.addClass('active');
		}

		function onInputBlur(ev) {
			if ( ev.target.value.trim() === '' ) {
				search.removeClass('active');
				// button.unbind( "click" );
			}
		}

		function onClear(ev) {
			input.val('');
			input.blur();
			selff.onSearch(input.val());
		}
	}



}
