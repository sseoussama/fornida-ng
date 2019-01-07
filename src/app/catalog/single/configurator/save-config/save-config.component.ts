import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ConfigsService, BcAuthService } from '../../../../_services';
import { ActivatedRoute } from '@angular/router';
import { _log, notice, SnotifyService, slugify } from '../../../../utils/_global';
const params = notice;

@Component({
  selector: 'save-config-form',
  templateUrl: './save-config.component.html',
  styleUrls: ['./save-config.component.scss']
})
export class SaveConfigComponent implements OnInit, OnDestroy {

	@Input() product: any;
	@Input() join: any;
	@Input() joined: boolean;
	@Input() content: any;
	@Input() save_modal: string;
	@Output() closeModal = new EventEmitter<any>();

	configs: any;
	mode: any;
	error: boolean;
	config_id: any;
	path: any;
	queryParams: any;

	constructor(
		public configsService: ConfigsService,
		public bcAuthService: BcAuthService,
		public notice: SnotifyService
	) {
		this.getConfigs();
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		this.config_id = configsService.config_id;
		this.path = window.location.pathname;
		$('.x.gallery').css('z-index', '9')
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		$('.x.gallery').css('z-index', '1')
	}

	onCloseModal() {
		this.closeModal.emit(false);
	}

	getConfigs() {
		// this.configs = this.configsService.Configs;
		this.configsService.listSnapshotChanges.subscribe(configs => {
			this.configs = configs;
		});
	}

	save_config(sku) {
		const email = localStorage.getItem("email");
		console.log(email);
		if (
			this.checkfield($('.is-name')) &&
			this.checkfield($('.is-description'))
		) {
			// save to user
			this.configsService.newConfig({
				name: $('.is-name').val(),
				slug: slugify($('.is-name').val()),
				desc: $('.is-description').val(),
				sku: sku,
				email_id: slugify(email)
			});
			this.notice.success(
				`The configuration was saved.`,
				`Success`,
				params('checkIcon')
			);
		}
	}

	save_preConfig(sku) {
		this.configsService.newPreConfig({
			name: $('.is-name').val(),
			slug: slugify($('.is-name').val()),
			desc: $('.is-description').val(),
			sku: sku
		});
		this.notice.success(
			`Pre-Config Saved.`,
			`Success`,
			params('checkIcon')
		);
	}

	save4customer(t, sku) {
		// console.log('save4customer', t, sku);
		this.error = false;
		const email = localStorage.getItem("email");
		if (
			this.checkfield($('.is-name')) &&
			this.checkfield($('.is-description')) &&
			this.checkfield($('#email'), true)
		) {
			this.configsService.save4customer({
				name: $('.is-name').val(),
				customer_email: slugify($(t).find('#email').val()),
				slug: slugify($('.is-name').val()),
				desc: $('.is-description').val(),
				sku: sku,
				saved_by: email,
				product_id: this.product.id
			});
			this.notice.success(
				`The configuration was shared.`,
				`Success`,
				params('checkIcon')
			);
		}
	}

	checkfield( el, email? ) {
		const self = this;
		const valid = (!email) ? el.val() : e(el.val());
		if (!valid) {
			this.error = true;
			el.addClass('error').delay(2000).queue(function(next){
				$(this).removeClass('error').dequeue();
				self.error = false;
			});
			$('.button').removeClass('is-loading');
			// return false;
		} else {
			this.error = false;
			return true;
		}
	}

	loading( e, dur ) {
		const self = this;
		const target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next){
			target.removeClass('is-loading').dequeue();
			if(!self.error) {
				self.onCloseModal();
			}
		});
	}


	joinURL(joinId) {
		if(joinId) {
			return `/product/${joinId.split('_')[0]}`
		}
	}



	// updateConfigs() {
	// 	console.log('=====================')
	// 	this.configsService.ConfigsChange.subscribe(value => {
	// 		console.log('configs ==> ', value);
	// 		this.configs = value;
	// 	});
	// }

}

function e(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
