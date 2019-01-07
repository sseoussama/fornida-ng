import { Component, OnInit, OnDestroy } from '@angular/core';
import { BcCartService, BcAuthService, ConfigsService, BcProductService } from '../../../../_services';
import { _log, notice, SnotifyService } from '../../../../utils';

@Component({
	selector: 'app-mini-cart',
	templateUrl: './mini-cart.component.html',
	styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit, OnDestroy {
	hov: string = 'checkout';
	cart_path: string;
	cart: any;
	cart_set: boolean;
	changes: boolean;
	line_items: any;
	cart_id: any = this.bcCartService.local_cartId;
	editorContent: any;
	mode: any;
	no_data_msg: string =  'Loading Cart ... ';
	ui_not_ready: string =  'Loading Cart ... ';
	ui_ready: boolean = false;
	per: any = false;
	active_builds = [];
	stashModsMade = false;

	get stashed() { return this.configsService.Stashed; }
	get All() { return this.bcProductService.AllProducts; }

	constructor(
		public bcCartService: BcCartService,
		public bcAuthService: BcAuthService,
		public configsService: ConfigsService,
		public bcProductService: BcProductService
	) {
		this.stashModsMade = false;
		this.cart = this.bcCartService.cart;
		this.bcCartService.init_cart_data("mini-cart",this.cart_id);
		this.bcCartService.cartDataChange.subscribe((value) => {
			this.no_data_msg = 'There are no items in your cart.';
	        this.cart_set = value;
	        this.cart_id = localStorage.getItem('cartId');
	        this.cart_path = `/cart.php?action=load&id=${this.cart_id}`;
        	this.configurable_ui();
        	// this.ui_ready = true; // dev only
	    });
	}

	ngOnInit() {
		const self = this;
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
	    setTimeout(e => {
	    	self.updateBuildTotals();
	    },1000 );
	}

	ngOnDestroy() {
	}

	calculate_per(item) {
		// const components = this.get_stashed_obj(item).components;
		// const configs_sum = this.sum(components, 'price')||0;
		// return (configs_sum)+this.product.price;
	}

	sum(items, prop) {
	    return items.reduce( function(a, b) {
	        return a + b[prop]*b['quantity'];
	    }, 0);
	}

	delete_build(item) {
		const build_id = item['options'].find(x => x.name === 'build_parent').value;
		const build_obj = this.stashed.find(x => x['build_id'] === build_id);

		if(build_obj === undefined) {
			_log('Cant delete this item. no build_id or stashed build_obj found', 'e', item);
			return false;
		}
		this.ui_ready = false; // hide mess till cart is re-initted
		this.bcCartService.delete_build(build_id, () => this.configsService.deleteBuild(build_id));
		// this.bcCartService.delete_item(item.id, this.cart_id);
	}

	delete_item(item) {
		this.bcCartService.delete_item(item.id, this.cart_id);
	}

	update_item(item) {
		this.bcCartService.update_item(item, this.cart_id);
	}

	increment(item) { item.quantity = item.quantity + 1; this.changes = true; }
	decrement(item) {
		if (item.quantity === 0) {
			return false;
		} else {
			item.quantity = item.quantity - 1; this.changes = true;
		}
	}

	// save(item) {
	// 	if (this.changes && item.quantity === 0) {
	// 		this.delete_item(item);
	// 	} else if (this.changes){
	//    		this.update_item(item);
	// 	}
	// 	this.changes=false;
	// }

	save(item) {
		if (this.changes) {
			(item.quantity <= 0 ) ? this.delete_item(item) : this.update_item(item);
		}
		this.changes = false;
	}

	gotoCart() {
		this.bcAuthService.goto(this.cart_path);
	}




	configurable_ui() {
		setTimeout( () => {
			const p = $('[data-option-name="build_parent"]');
			const c = $('[data-option-name="build_id"]');
			const config_parents = p.closest('.cart_item');
			const config_components = c.closest('.cart_item');

			// show or hide
			p.hide(); c.hide();
			config_components.hide();
			config_parents.show();
			const self = this;

			// display cart after scripts finish
			setTimeout( e => {
				self.ui_ready = true;
			}, 1000);

		}, 500); // make sure elements exist
	}

	buildId(item) {
		// return false; // dev only
		// const is = JSON.stringify(item).includes('build_parent');
		try {
		    const build_id = item['options'].find(x => x.name === 'build_parent').value;
		    const idx = $.inArray(build_id, this.active_builds) === -1;
		    if(build_id && idx) {
				this.active_builds.push(build_id);
			}
			return build_id;
		} catch(err) { return false; }
	}

	get_stashed_obj(item) {
		const build_id = item['options'].find(x => x.name === 'build_parent').value;
		const stash = this.stashed.find(x => x['build_id'] === build_id);
		if (stash === undefined) {
			console.error(`stashed undefined => ${item.product_id} (${build_id})`);
		}
		return stash;
	}

	stash(key, item) {
		const stash = this.get_stashed_obj(item);
		if (stash === undefined) {
			// console.error('stashed undefined',item.product_id);
			return 0;
		} else {
			return this.get_stashed_obj(item)[key] || 0;
		}
	}

	updateBuildTotals() { // changes price values in stash with values from cart
		let i;
		for (i = 0; i < this.stashed.length; i++) {
			const ths = this.stashed[i];
			// const active = this.active_builds.indexOf(`${ths.build_id}`);
			const active = $.inArray(ths.build_id, this.active_builds) !== -1;
			if(active) {
				const components = ths.components;
				this.updateComponentPrices(components, ths.parent_product_id, componentsNew => {
					const buildQty = ths.buildQty;
			    	const configs_sum = sum(components, 'price')||0;
			    	ths.per_total = (configs_sum);
			    	ths.total = ths.per_total*buildQty;
			    	this.stashModsMade = true;
				});
			}
		}
    }

    updateComponentPrices(components, pId, next) {
    	const total = components.length;
    	let i;
    	for ( i = 0; i < total; i++ ) {
		    components[i].price = this.getLineItem(components[i].id).list_price;
		    if(i+1 === total) {
		    	next(components);
		    }
		}
    }

    getProduct(id) {
    	return this.All.find(x => x.id === id);
    }

    getLineItem(id) {
    	const list = this.cart.data.data.line_items.physical_items;
    	return list.find(x => x.product_id === id);
    }


}






function sum(items, prop) {
    return items.reduce( function(a, b) {
        return a + b[prop]*b['quantity'];
    }, 0);
}




