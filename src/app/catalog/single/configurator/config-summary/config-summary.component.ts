import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfigsService, BcAuthService, BcCartService, BcProductService } from '../../../../_services';
import { slugify, _log, notice, SnotifyService } from '../../../../utils';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

const noticeParams = notice;

@AutoUnsubscribe()
@Component({
  selector: 'config-summary',
  templateUrl: './config-summary.component.html',
  styleUrls: ['./config-summary.component.scss']
})
export class ConfigSummaryComponent implements OnInit, OnDestroy {

	@Input() product: any;
	@Input() show_builder: any;
	_mode: Subscription;
	_getVariantsByProductId: Subscription;
	_getProductModifier: Subscription;
	_listSnapshotChanges: Subscription;
	_collabList: Subscription;
	get sample() { return this.configsService.Sample_data; }
	configs: any;
	mode: any;
	c: any;
	collabs: any;
	lastUpdate: any;
	queryParams: any;
	all: any;
	collabsExist: boolean;
	editorContent: any;
	configsExist: boolean;
	content: string;
	join: string;
	email: string;
	joined: boolean;
	modal: boolean;
	private visibilityChangeCallback: () => void;
	variants: any;
	variant_id: any;
	build_id: string;
	buildIdFieldName = "build_id";
	parentFieldName = "build_parent";
	parentFieldID: any;
	configMeta: any;
	sort: string = 'modified';
	dir: any;
	configMeta_obs: any;
	configAll: any;
	detailContent: any;
	buildQty: number = 1;
	cart_id: any = this.bcCartService.local_cartId;


	get Products() { return this.bcProductService.AllProducts; }
	// get configMetaList() { this.configsService.ConfigMetaList }

	constructor(
		public configsService: ConfigsService,
		public route: ActivatedRoute,
		public bcCartService: BcCartService,
		public bcAuthService: BcAuthService,
		public bcProductService: BcProductService,
		public router: Router,
		// tslint:disable-next-line:no-shadowed-variable
		public notice: SnotifyService
	) {
		this.email = this.bcCartService.local_email;
		this._mode = this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		// queryParams
		this.queryParams = this.route.snapshot.queryParams;
		this.join = this.queryParams.join;
		if (this.join) { this.joined = true; }
		this.getConfigMeta();
	}

	getConfigMeta() {
		this.configMeta_obs = this.configsService.getConfigMeta().subscribe( configMeta => {
			_log(' == configMeta ==> ', 'i', configMeta);
			this.configMeta = configMeta;
			try {
				this.buildQty = configMeta[0]['build_qty'] || 1;
			} catch(er) {
				this.buildQty = 1;
			}
		});
	}

	ngOnInit() {
		const self = this;
		// this.addModifiers(127); // dev only
		setTimeout( function() {
			self.getConfigs();
		}, 500); // wait for user

		// preparing to copy this in stashed
		this.setAll();

		setTimeout( function() {
			self.all = mapId(self.Products);
		}, 1500); // wait for all Products (from bc) to finish
	}

	// toggleBuilder(v) {
	// 	this.show_builder = v;
	// 	this.toggle_builder.emit(v);
	// }

	setAllProducts() {
		this.all = mapId(this.bcProductService.allProducts);
	}

	ngOnDestroy() {
		// this.configMeta_obs.unsubscribe();
		this.unCollab();
	}

	clear() {
		let loc = `config_sessions/${this.configsService.config_id}/configs`;
		this.configsService.set(loc, {});
	}

	getVariants(product) {
		this._getVariantsByProductId = this.bcProductService.getVariantsByProductId(product.id).subscribe(res => {
			_log(' == getVariantsByProductId (from summary) ==> ','i', res.data);
			this.variant_id = res.data[0].id;
			return this.variants = res.data;
		});
	}

	setAll() {
		const self = this;
		const ob = self.configsService.configAll.subscribe( all => {
			_log(' configAll ==> ', 'e', all);
			self.configAll = all;
		});
		setTimeout( e => { ob.unsubscribe(); } ,4000);
	}

	saveConfigEdits(build_id) {
		const self = this;
		const t = build_id;

		// add parent with configs in new array
		const configArr2 = this.configs.slice(0);
		configArr2.push(this.product);

		// only ids
		const ids = configArr2.map(x=>x.id);

		// delete old components from prev build
		this.bcCartService.delete_build(build_id, () => {

			// add edits to cart
			self.addtocart((newBuild) => self.router.navigate(['/cart']) );

			// delete old stashed obj
			// setTimeout(() => this.configsService.deleteBuild(t), 1000); didnt work
			setTimeout(() => this.configsService.remove(`stashed`, t), 1000);
		});

	}

	addtocart(next?) {
		const self = this;

		// setTimeout(e=> {
			// check for set errors
			this.show_errors();
			const $errors = $('h3.ti.false');
			if($errors.length) {
				return $errors.each(function() {
					const set_name = $(this).closest(`.set-container`).attr('data-name');
					return self.err_add_to_cart(set_name);
				});
			}

			// log error if !configAll
			// if (this.configAll === undefined) { console.error(self.configAll); }

			// generate new build_id
			this.build_id = self.configsService.newBuildId();

			// add parent with configs in new array
			const configArr = this.configs.slice(0);
			configArr.push(this.product); // add parent as sibling to configs
			// this.product['components'] = configArr;  // add components to parent

			// add modifiers (for cart and order json) then add-to-cart
			this.handleBuildId(configArr, items => {
				const dev_problem = items.length !== configArr.length; // items length does not equal configArr length
				if(!dev_problem) {
					const toStash = {
						components: items,
						build_id: this.build_id,
						ids: configArr.map(x=>x.id),
						buildQty: this.buildQty,
						parent_product_id: this.product.id,
						config_copy: self.configAll
					};
					_log('ADDING =>', 'd',toStash);
					self.configsService.addtocart(items, this.buildQty);
					self.configsService.addConfigsToStashed(toStash);
					if(next) { next(this.build_id); }
				} else {
					console.error({
						error: "items length does not equal configArr length",
						items: items,
						configArr: configArr,
						parent_product_id: this.product.id,
						counts: {
							items: items.length,
							configArr: configArr.length
						}
					});
				}
			});
		// },0); // wait for valid test

	}

	err_add_to_cart(set_name) {
		this.notice.warning(
			`Please select a components for ${set_name}.`,
			`Select a ${set_name} Component`,
			noticeParams('errIcon')
		);
		return console.error('isErr: ', typeof $('h3.ti.red'));
	}

	handleBuildId(configs, next) {
		const self = this;
		const items = [];
		const last = configs.length;
		const promise =[];
		$.each(configs, function(i, config) {
			self._getProductModifier = self.bcProductService.getProductModifier(config.id).subscribe(modifiers => {
				const buildID_field = modifiers.data.filter(obj => obj.display_name === self.buildIdFieldName )[0];
				const parent_field = modifiers.data.filter(obj => obj.display_name === self.parentFieldName )[0];
				self.addModifiers(config.id, buildID_field, parent_field, function(fieldID) {
					// config.v = config.base_variant_id||null;

					// fill in build_id
					config.option_selections = [{
						"option_id": fieldID,
						"option_value": self.build_id,
						"name": 'build_id',
						"required": false
					}];

					// fill in parent_id
					if(self.parentFieldID) {
						config.option_selections.push({
							"option_id": self.parentFieldID,
							"option_value": self.build_id,
							"name": 'parent_id',
							"required": false
						});
					}

					// add quantity for any item missing it
					config.quantity = config.quantity||1;

					promise.push({...config});
					Promise.all(promise).then( items_ => {
						if (items_.length === last) {
							next(items_);
						}
				    });

				});
			});
		});
	}

	addModifiers(id, buildID_field, parent_field, cb) {
		// parent_field
		const isParent = this.product.id === id;
		if( isParent && parent_field === undefined) {
			this.configsService.addProductModifier({
				product_id: this.product.id,
				field_name: this.parentFieldName,
				default: null,
				required: false
			}, (parentFieldID) => {
				this.parentFieldID = parentFieldID;
			});
		} else if( isParent ) {
			this.parentFieldID = parent_field.id;
		} else {
			this.parentFieldID = null;
		}

		// buid_field
		if(buildID_field === undefined) {
			this.configsService.addProductModifier({
				product_id: id,
				field_name: this.buildIdFieldName,
				default: null,
				required: false
			}, fieldId => { cb(fieldId); } );
		} else {
			cb(buildID_field.id);
		}
	}

	makeParentModifier(id, buildID_field, cb) {
		if(buildID_field === undefined) {
			this.configsService.addProductModifier({
				product_id: id,
				field_name: this.buildIdFieldName,
				default: null
			}, fieldId => { cb(fieldId); } );
		} else {
			cb(buildID_field.id);
		}
	}


	show_errors() {
		this.configsService.configSubmitted.next(true);
	}

	hide_errors() {
		// this.configsService.configSubmitted.next(false);
	}

	getConfigs() {
		this._listSnapshotChanges = this.configsService.listSnapshotChanges.subscribe(configs => {
			this.configs = configs;
			this.configsExist = true;
			this.configsService.Configs = configs;
		});
		const self = this;
		this._collabList = self.configsService.collabList.subscribe(collabs => {
			self.collabs = collabs;
			self.collabsExist = true;
			self.configsService.collabs = collabs;
			// self.checkCollabs(collabs);
		});
		self.configsService.update_collab_visible(true); // default
		self.visibilityChangeCallback = () => self.handleVisibleState();
		document.addEventListener('visibilitychange', self.visibilityChangeCallback, true);
		// setTimeout( e => {
		// },400); // so that we get the collab with the updated last_seen... (this hides all summary until finished)
	}

	handleVisibleState() {
		let vis = document.visibilityState === 'visible';
		console.log(typeof this.configsService);
		this.configsService.update_collab_visible(vis);
	}

	unCollab() {
		console.log('UNCOLLAB');
		// following not working yet
		$(document).unbind();
		document.removeEventListener('visibilitychange', this.visibilityChangeCallback, true);
	}



	calculate_price() {
		const self = this;
		let items = self.configs.map(it => {
			self.all[it.id].quantity = it.quantity;
			return self.all[it.id];
		});
		const configs_sum = sum(items, 'calculated_price')||0;
		return (configs_sum)+this.product.price;
	}

	emphasize(target) {
		const self = this;
		const on = {'background': '#1489DD', 'color': '#ffffff'};
		const off = {'background': '#ffffff', 'color': '#000000'};
		setTimeout( function() {
			target.css(on).delay(200).queue(function(next) {
				target.css(off).dequeue();
			});
		}, 0);
	}

	smooth(target, offset: number) {
		const self = this;
		offset = offset || 0;
		target = $(`#${target}`);
		if (target.length) {
			event.preventDefault();
			$('html, body').animate({
					scrollTop: target.offset().top - offset,
					easing: 'easeOutCirc'
			}, 500, function() {
				self.emphasize(target);
				let $target = $(target);
				$target.focus();
				if ($target.is(':focus')) { // Checking if the target was focused
					return false;
				} else {
					$target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
					$target.focus(); // Set focus again
				}
			});
		}
	}

	removeConfig(data) {
		this.configsService.remove_config(data);
	}

	inc(item) {
		if (item.quantity >= item.max) {
			this.notice.warning(
				`This server is limited to ${item.max} of this component.`,
				`Max Reached`,
				noticeParams('errIcon')
			);
			return false;
		} else {
			item.quantity = item.quantity + 1;
		}
		this.save_config_changes(item);
	}

	dec(item) {
		if (item.quantity <= item.min) {
			this.notice.warning(
				`This server requires at least ${item.min} of this component.`,
				`Minimum Reached`,
				noticeParams('errIcon')
			);
			return false;
		} else {
			item.quantity = item.quantity - 1;
		}
		this.save_config_changes(item);
	}

	save_config_changes(i) {
		this.configsService.set_config(i);
	}

	close() {
		this.modal = false;
		this.content = '';
	}

	loading( e, dur ) {
		const self = this;
		const target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next) {
			target.removeClass('is-loading').dequeue();
			// self.onCloseModal();
		});
	}

	setBuildQTY(buildQty) {
		buildQty = (buildQty<1) ? 1 : buildQty;
		this.configsService.adjustBuildQTY(buildQty);
	}

	minus(buildQty) { // replaced by number-field component
		this.setBuildQTY(buildQty-1);
	}

	plus(buildQty) { // replaced by number-field component
		this.setBuildQTY(buildQty+1);
	}


}

function sum(items, prop) {
    return items.reduce( function(a, b) {
        return a + b[prop]*b['quantity'];
    }, 0);
}

function mapId(arr) {
	// let map = [];
	return arr.reduce(function(map, obj) {
	    map[obj.id] = obj;
	    return map;
	}, {});
}


function generateID(len) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < len; i++)  {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function toArray(obj_obj) { return Object.keys(obj_obj).map(i => obj_obj[i]); }



