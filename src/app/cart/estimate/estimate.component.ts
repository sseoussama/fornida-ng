import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalstorageService, BcAuthService, BcCartService } from '../../_services';
import { _log, states } from '../../utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// const states = states;

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss']
})
export class EstimateComponent implements OnInit {

	states = states;
	email: any;
	flag: boolean = false;
	user: any;
	theForm: any;
	checkout: any;
	shipping_options: any;

	countries = [
		{
			code: 'US',
			name: 'United States'
		}
	];

	@Input() cart: any;
	@Output() closeModal = new EventEmitter<any>();
	@Output() shippingOptions = new EventEmitter<any>();

	constructor(
		private localstorageService: LocalstorageService,
		public bcAuthService: BcAuthService,
		public bcCartService: BcCartService,
	) {
		this.init();
	}

	ngOnInit() {
	}

	init() {
		this.email = this.localstorageService.getItem('email');
		if(this.email) {
			this.user = this.bcAuthService.get_user({email:this.email}, true).subscribe(User => {
				_log(" == Get User (estimate) ==> ", 'i', User);
				this.user = User;
				this.setForm();
			});
		} else {
			_log(" == No User (estimate) ==> ", 'i');
			this.setForm();
		}
	}

	onCloseModal() {
		this.closeModal.emit(false);
	}

	setForm() {
		const self = this;
		let u =  v => this.uVals(v);
		self.theForm = new FormGroup({
			'date': new FormControl(new Date(), Validators.required ),
			'state': new FormControl(u('state'), Validators.required),
			'country': new FormControl(u('country'), Validators.required),
			'city': new FormControl(u('city'), Validators.required),
			'zip': new FormControl(u('zip'), Validators.required)
		});
	}

	uVals(key) {
		try {
			let val = this.user.address[0][key];
			return (val===undefined) ? null : val;
		} catch {
			return null;
		}
	}

	onSubmit() {
		let values = this.theForm.value;
    	values.date = $('#date').val();
    	values.countryCode = this.countries.find(one=>one.name===values.country).code;
    	if(!this.theForm.valid) { return this.flag = true; }
    	this.getShipEstimate(values);
    }

    loading( e, dur ) {
		const self = this;
		const target = (<any>$(e.target));
		target.addClass('is-loading').delay(dur).queue(function(next) {
			target.removeClass('is-loading').dequeue();
			// self.onCloseModal();
		});
	}

	getShipEstimate(form_data) {
		let id = this.cart.id;
		let items = this.cart.line_items.physical_items.map(b=> {
			return {item_id: b.id, quantity: b.quantity};
		});
		let payload = [{
			"shipping_address": {
				// "email": "contactomarnow@gmail.com",
				"country_code": form_data.countryCode,
				"first_name": "TEST_FIRST_NAME",
				// "last_name": "Habash",
				// "address1": "3800 Commerce St #317",
				// "city": "Dallas",
				// "state_or_province": "Texas",
				// "state_or_province_code": "TX",
				"postal_code": form_data.zip,
				// "phone": "2144705176",
				"custom_fields": [
					{
						"field_id": "field_25",
						"field_value": "Great!"
					}
				]
			},
			"line_items": items
		}];
		this.bcCartService.getShipEstimate(id, payload).subscribe( checkout=> {
			this.checkout = checkout.data;
			// this.shipping_options = this.checkout.consignments[0].available_shipping_options;
			this.shippingOptions.emit(this.checkout);
			this.closeModal.emit(false);
		});
	}

}









