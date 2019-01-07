import { Component, OnInit, Input, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ConfigsService, BcProductService, BcAuthService } from '../../../../_services';
// import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { _log, notice, SnotifyService } from '../../../../utils';
import { slugify } from '../../../../utils/_global';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

const noticeParams = notice;


@AutoUnsubscribe()
@Component({
  selector: 'builder-options',
  templateUrl: './builder-options.component.html',
  styleUrls: ['./builder-options.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuilderOptionsComponent implements OnInit, OnDestroy {

	@Input() product: string;

	mode: any;
	// current: Observable<any[]>;
	current: any;
	savedConfigs: any;
	contexts = [];
	all:any;
	sets:any;
	config_id: any;
	modal_content: any;
	json_loc: any;
	sett: any = {};
	configs: any;
	base: any;
	submitted: boolean;
	editorContent: any;
	detailContent: any;
	itemSelected: any;
	setHovered:any;
	_configSubmitted: Subscription;
	_mode: Subscription;
	_setCurrent: Subscription;
	_getSets: Subscription;
	_listSnapshotChanges: Subscription;

	get sample() { return this.configsService.Sample_data; }
	get All() { return this.bcProductService.AllProducts; }

	constructor(
		public configsService: ConfigsService,
		public bcAuthService: BcAuthService,
		public bcProductService: BcProductService,
		public elRef: ElementRef,
		// tslint:disable-next-line:no-shadowed-variable
		public notice: SnotifyService
	) {
		this._configSubmitted = this.configsService.configSubmitted.subscribe((value) => {
        	this.checkRequiredSets(val=> {
        		this.submitted = value;
        		setTimeout(e=> this.submitted = false, 2000);
        	});
        });
		this.config_id = this.configsService.config_id;
		this._mode = this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		setTimeout(e=>this.onConfigs(),500); // wait for "input.option_input" to render
	}


	ngOnInit() {
		const self = this;
		this.base = `/products/${this.product['sku']}/data/config`;
		this._setCurrent = this.configsService.setCurrent(this.product['sku']).subscribe(current => {
			this.current = current;
		});
		this._getSets = this.configsService.getSets(this.product['sku']).subscribe(sets => {
			this.sets = sets.sort(byOrder);
		});
		this.inputStyle();
		setTimeout( function() {
			// self.all = new Map(self.All.map(i => [i.id, i]));
			self.all = mapId(self.All);
		}, 500);
	}

	ngOnDestroy() { }

	onConfigs() {
		const self = this;
		this._listSnapshotChanges = this.configsService.listSnapshotChanges.subscribe(configs => {
			_log(' == configs {builder-options} == ', 'd', configs);
			this.configs = configs;
			// mark chosen components
			setTimeout(e=> {
				$("input.option_input").each( function(i, itm) {
					const checkbox_container = $(itm).closest('.checkbox-container');
					const itm_id = $(itm).attr('id').replace('i_', '');
					const chosen = JSON.stringify(configs).indexOf(itm_id);
					if( chosen>0 ) {
						$(itm).prop('checked', true);
						checkbox_container.addClass('chosen');
					} else {
						$(itm).prop('checked', false);
						checkbox_container.removeClass('chosen');
					}
				});
			}, 0);
		});
	}

	saveNote(note, set) {
		set.hovered = null;
		set.edit = null;
		let loc = `${this.base}/${set.slug}`;
		this.configsService.set(loc,set);
	}


	optionLoc(op) {
		return `${this.base}/${op.set.slug}/options/${op.key}`;
	}

	checkRequiredSets(callback) {
		$.each(this.sets, function(i, set) {
			if(set.required) {
				const $set = $(`#set-${set.slug}`);
				const isValid = $('.chosen', $set).length;
				set.valid = ( isValid>0 ) ? true : false;
			} else {
				set.valid = true;
			}
		});
		callback('val');
	}


	hidepreconfigs() {
		// needs work
		setTimeout(function() {
			let $container = $('.checkbox-container.preconfigs');
			if ( $container.find('label') ) {
				$('.form-section.pre').hide();
			} else {
			}
		}, 1000);
	}

	checkToggled(e, op, set) {
		const self = this;
		let checked = e.target.checked;
		if(set.radio) {
			this.unsetAllOptionsInSet(set.slug);
		}
		op.key = $(`#key-${op.id}`).attr('key')||op.key; // cant remember why i got the key this way
		op.order = set.order;
		// add or take from config list in summary
		(checked) ? this.configsService.add_config(op) : this.configsService.remove_config(op);

	}

	updateValidity(e, set) {
		this.unsetPreConfigs();
		// let checked = $(e.target).find('.option_input').is(":checked");
		// (checked) ? (set.valid = (set.valid||0)+1) : (set.valid = set.valid-1);
	}

	unsetAllOptionsInSet(setSlug) {
		const self = this;
		const set_options = `.option_input.${setSlug}`;
		let i = -1;
		$(set_options).each(function() {
			i++;
			let element = self.elRef.nativeElement.querySelectorAll(set_options)[i];
			if (element.checked) {
				element.checked = false;
				element.dispatchEvent(new Event('change'));
			}
		});
	}



	onPreConfig(e, pre) {
		const checked = e.target.checked;
		const self = this;
		self.unsetAllOptions();
		setTimeout(function() {
			// self.configsService.set_configs(pre.values); // still need to figure out keys
			$.each(pre.values, function(index, data) {
				// self.configsService.add_config(data);
				const query = 'input#i_' + data.key;
				$(query).css('border', '2px solid red');
				const element = self.elRef.nativeElement.querySelector(query);
				// element.checked = true;
				try {
					element.checked = e.target.checked;
					element.dispatchEvent(new Event('change'));
					// update summary with saved qtys
					setTimeout( function() {
						const configs = self.configsService.Configs;
						configs[index].quantity = data.quantity;
						self.configsService.set_config(data);
					}, 200);
				} catch(err) {
					self.notice.warning(`This component is not available on this server.`, `${data.key}`, noticeParams('errIcon'));
				}
			});
		}, 0);
	}


	unsetAllOptions() {
		const self = this;
		let i = -1;
		$("input.option_input").each(function() {
			i++;
			let element = self.elRef.nativeElement.querySelectorAll("input.option_input")[i];
			if (element.checked) {
				element.checked = false;
				element.dispatchEvent(new Event('change'));
			}
		});
	}

	unsetPreConfigs() {
		$("input.preconfig").prop('checked', false);
	}


	inputStyle() {
		// input
		$('input, select, textarea').on('click focus', function() {
			const parent = $(this).parent('.stylefield');
			$(this).siblings('input, select, textarea').focus();
			parent.addClass('focused filled');
		});
		$('input, select, textarea').on('focusout', function() {
			const parent = $(this).parent('.stylefield');
			parent.removeClass('focused');
			if ((<any>this).value === '') {
				parent.removeClass('filled');
			}
		});
	}

	addItemToSet(set, selected) {
		this.configsService.addItemToSet({
			product_sku: this.product['sku'],
			set: set.key,
			selected: {
				min: 1,
				max: 20,
				key: slugify(selected.sku),
				id: selected.id,
				name: selected.name,
				sku: selected.sku,
				set: {
					name: set.name,
					slug: set.slug,
					key: set.key
				}
			},
			key: slugify(selected.sku)
		});
	}

	duplicateConfigs(e) {
		const selected_sku = $(e.target).find('select').val();
		let current = this.current[0];
		this.configsService.duplicateConfigs(selected_sku,current);
	}

	addSetToProduct(e) {
		const name = $(e.target).find('.input-name').val();
		const radio = $(e.target).find('[name="radio"]').is(":checked");
		const required = $(e.target).find('[name="required"]').is(":checked");
		this.configsService.addSetToProduct({
			product_sku: this.product['sku'],
			set: {
				name: name,
				slug: slugify(name), // maybe this should be in the set... ?
				options: {},
                radio: radio,
				required: required
			},
		});
		// clear field
		$(e.target).find('.input-name').val(null);
		$("[type='checkbox']").prop( "checked", false );
	}

	removeOptionFromSet(setKey, itemId) {
		this.configsService.removeOptionFromSet({
			sku: this.product['sku'],
			set: setKey,
			itemId: itemId
		});
	}

	rmPreConfig(name) {
		this.configsService.removePreConfig({
			sku: this.product['sku'],
			item: slugify(name)
		});
	}

	removeSavedConfig(name) {
		this.configsService.removeSavedConfig({
			sku: this.product['sku'],
			item: slugify(name)
		});
	}

	rmSet(slug) {
		this.configsService.removeSet({
			sku: this.product['sku'],
			item: slug
		});
	}

	toArray(obj_obj) {
		return Object.keys(obj_obj).map(i => obj_obj[i]);
	}

	closeContext(t) {
		$(t).find('.contextMenu').fadeOut("fast");
	}

	close() {
		this.modal_content = false;
		this.json_loc = false;
	}

	smooth(target, offset: number) {
		const c = target;
		const self = this;
		const ev = event;
		setTimeout(e => {
			offset = offset || 0;
			target = $(`#${target}`);
			if (target.length) {
				ev.preventDefault();
				$('html, body').animate({
					scrollTop: target.offset().top - offset,
					easing: 'easeOutCirc'
				}, 500, function () {
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
		}, 200);
	}




}



function mapId(arr) {
	// let map = [];
	return arr.reduce(function(map, obj) {
	    map[obj.id] = obj;
	    return map;
	}, {});
}

function generateID() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < 15; i++)  {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function byOrder(a,b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
}



