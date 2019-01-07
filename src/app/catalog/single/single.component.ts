import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BcProductService, ConfigsService, BcAuthService, BcCartService, LocalstorageService } from '../../_services';
import { _log, Loader, slugify } from '../../utils';
import { Meta, Title } from '@angular/platform-browser';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
// const loader = Loader;

@AutoUnsubscribe()
@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingleComponent implements OnInit, OnDestroy {

	product_id: string;
	product: any;
	fields: any;
	reload: boolean;
	option_selections: any = {};
	variant: any = {};
	variants: any = {};
	loader: any = Loader;
	mode: any;
	config_id: any;
	show_builder: boolean;
	queryParams: any;
	join: any;
	editing: any;
	email: any;
	loadBuilder: boolean;
	editorContent: any;
	options: any;
	simpleQty = 1;
	cart_id: any = this.bcCartService.local_cartId;
	_queryParams: Subscription;
	_param_listener: Subscription;
	_getOptions: Subscription;
	_getOptionById: Subscription;
	_getProductById: Subscription;
	_getCustomFields: Subscription;
	_generateSitemap: Subscription;

	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public bcProductService: BcProductService,
		public bcCartService: BcCartService,
		public configsService: ConfigsService,
		public bcAuthService: BcAuthService,
		private meta: Meta,
		private title: Title,
		private localstorageService: LocalstorageService
	) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		this.param_listener();
		this.queryParams = this.route.snapshot.queryParams;
		this.join = this.queryParams.join;
		this.email = this.bcCartService.local_email;
		if (this.join) { this.show_builder = true; }
	}


	ngOnInit() {
		// this.getProduct(this.route.snapshot.paramMap.get('id'));
	}


  	ngOnDestroy() {
		this.editing = false;
		this.setConfigId(this.product_id);
	}

	syncProducts() {
		this.configsService.remove('all_products', '');
	}

	convert(p) {
		this.configsService.addConfigurable({
			sku: p.sku,
			name: p.name
		});

		this.configsService.makeCustomField({
			id: p.id,
			name: 'use_builder',
			value: 'true'
		});
		this.getProduct(p.id);
	}

	remove_builder(p) {
		const field_id = p.custom_fields.find(x => x.name === 'use_builder').id;
		this.configsService.removeCustomField({
			id: p.id,
			field_id: field_id
		});
		this.getProduct(p.id);
	}

	param_listener() {
		const self = this;
		this._param_listener = this.route.params.subscribe(params => {
			self.loader.show();
			setTimeout( function() {
				self.loader.hide();
			}, 2000);
			this.reload = false;
			this.product_id = params['id'];
			this.getProduct(this.product_id);
			// this.getCustomFields(this.product_id);
		});
	}

	onGetOptions(product) {
		this._getOptions = this.bcProductService.getOptions(product).subscribe (res => {
			_log(' == getOptions ==> ', "i", res);
			return this.options = res.data;
		});
	}

	getOptionById(product) {
		this._getOptionById = this.bcProductService.getOptionById(product.id).subscribe (res => {
			_log(' == getOptions (id) ==> ', "i", res);
			return this.options = res.data;
		});

	}


	getProduct(id) {
		this._getProductById = this.bcProductService.getProductById(id).subscribe(single => {
	        _log('== single ==>:', 'i', single);
	        this.setProductMeta(single);
	        this.reload = true;
        	this.queryParam_listener(); // reload builder if query "join" change;
        	// this.getOptionById(single.data);
        	return this.product = single.data;
		});
		setTimeout(() => {
			if(!this.product) {
				this.router.navigate(['/404']);
			}
		}, 2000);
	}

	queryParam_listener() { // reload builder if query "join" change;
		this._queryParams = this.route.queryParams.subscribe(params => {
	        this.loadBuilder = false;
	        this.join = params['join'];

			this.editing = params['editing'];
			if(this.localstorageService.isBrowser) {
				this.setConfigId(this.product_id);
			}
	    });
	}

	setConfigId(id) {
		const self = this;
		setTimeout( function() {
			try {
				_log("use_builder ==> ==> ", 'd', self.product.custom_fields[0].name==='use_builder');
				// const unique = (self.bcAuthService.user !== undefined) ? "m"+self.bcAuthService.user.id : self.localstorageService.getItem('session_id');
				const unique = self.localstorageService.getItem('session_id');
				self.product['editing'] = self.editing || null;
				self.config_id = self.editing || self.join || `${self.product.id}_${unique}`;
				if(self.mode.auth) {
					_log('== AUTH For Config ==', 's');
					self.configsService.setRefs(self.config_id, self.bcAuthService.user, self.editing);
				} else { // anonymous
					_log(' == setting anonymous refs == ', 'd');
					self.configsService.setRefs(self.config_id, "anonymous", self.editing);
				}
			} catch (err) {
			    _log(' ==> Not Configurable <== ', 'd', err);
			}
			self.loadBuilder = true;
		}, 500); // wait for user
	}

	setProductMeta(product) {
		const p = product.data;
		this.configsService.product = product;
		let i;
		try {
			i = p.images[0].url_standard;
		} catch (err) {
		    i = 'https://cdn7.bigcommerce.com/s-2bihpr2wvz/product_images/uploaded_images/fornida-servers2.png';
		}

		// meta
		this.title.setTitle(`${p.name} - Fornida`);
		this.meta.addTags([
		    { name: 'og:title', content: `${p.name} - Fornida` },
		    { name: 'og:description', content: `${p.description.replace(/<(?:.|\n)*?>/gm, '')}` },
		    { name: 'og:image', content: i },
		]);
	}

	getCustomFields(id) {
		this._getCustomFields = this.bcProductService.getCustomFields(id).subscribe(fields => {
	        _log('== getCustomFields ==>:', 'i', fields);
	        return this.product['custom_fields'] = fields.data;
	    });
	}

	onAddToCart(product, qty) {
		this.bcCartService.onAddToCart(product, qty, this.variant.id);
		this.simpleQty = 1;
	}

	optionSelectedEvent(optionData) {
		_log('optionData<==>',"i", optionData);
		this.option_selections = optionData.option_selections;
		this.variants = optionData.variants;
		this.variant = optionData.variant;
	}

	loading(e,dur) {
		let target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next) {
			target.removeClass('is-loading');
			target.dequeue();
		});
	}

	generateSitemap() {
		this._generateSitemap = this.bcProductService.generateSitemap().subscribe( res => {
			_log("res", 'd', res);
		}, error => {
			_log("error", 'd', error);
		});
	}
}



function generateID(len) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < len; i++)  {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
