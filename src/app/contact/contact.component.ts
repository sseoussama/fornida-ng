import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlamelinkService, BcProductService, BcAuthService, LocalstorageService, ConfigsService } from '../_services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements OnInit, AfterViewInit {
	theForm:FormGroup;
	flag:boolean = false;
	success:boolean = false;
	date:any = new Date();
	reason:any;
	itemSelected:any;
	all:any;
	mode:any;
	topics:any;
	faqs:any;
	email:any;
	user:any;
	productList = [];
	related = [];
	allReady = false;
	ready = false;

	get All() { return this.bcProductService.AllProducts; }

	constructor(
		public router:Router,
		public bcProductService: BcProductService,
		public bcAuthService: BcAuthService,
		public configsService: ConfigsService,
		private localstorageService: LocalstorageService,
		public flamelinkService: FlamelinkService,
	) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		this.email = this.localstorageService.getItem('email');
		if(this.email) {
			this.user = this.bcAuthService.get_user({email:this.email}).subscribe(User => {
				this.user = User[0];
				this.setForm();
			});
		}else {
			this.setForm();
		}
	}

	ngOnInit() {
		this.getTopics();
		const self = this;
		this.all = mapId(this.All);
		this.allReady = true;
	}

	ngAfterViewInit() {
		this.getFaqs();
	}

	getTopics() {
		this.flamelinkService.getExisting('contactTopics', data=> {
			this.topics = data;
		});
	}

	setForm() {
		const self = this;
		let u =  v => this.uVals(v);
		self.theForm = new FormGroup({
			'date': new FormControl(new Date(), Validators.required ),
			'full': new FormControl(this.fullName(), Validators.required ),
			// 'full': new FormControl(null, Validators.required ),
			'phone': new FormControl(u('phone'), Validators.required),
			'email': new FormControl(u('email'), [Validators.required, Validators.email] ),
			'company': new FormControl(u('company'), Validators.required),
			'desc': new FormControl(null, Validators.required),
			'order': new FormControl(null),
		});
		setTimeout(e=>self.inputStyle(),500);
	}

	uVals(key) {
		try {
			let val = this.user[key]
			return (val===undefined) ? null : val;
		}catch {
			return null;
		}
	}

	fullName() {
		let u =  v => this.uVals(v);
		if(u('first_name')==null) return null;
		try {
			let f = u('first_name');
			let l = u('last_name');
			return `${f} ${l}`
		}catch {
			return null;
		}
	}

	setReason(item) {
		this.reason = item.slug;
		this.setFaqs(item);
		setTimeout(e=>this.inputStyle(),500);
	}

	setFaqs(reason) {
		this.related = [];
		this.faqs.filter( faq => {
			if(JSON.stringify(faq).toLowerCase().includes(reason.id)){
				this.related.push( faq );
			}
		});
	}

	getFaqs() {
		this.flamelinkService.getExisting('faQs', data=> {
			this.faqs = data;
		});
	}

	addProductToList(itemSelected) {
		itemSelected['qty'] = 1;
		if(itemSelected.name) this.productList.push({
			name: itemSelected.name,
			sku: itemSelected.sku,
			qty: itemSelected.qty,
			// data: itemSelected
		});
		setTimeout(e=> this.itemSelected = null, 100);
	}

	rmProductToList(itemSelected) {
		const index = this.productList.indexOf(itemSelected);
		if (index > -1) {
		  this.productList.splice(index, 1);
		}
	}

	onQty(qty, item) {
		item['qty'] = qty;
	}
	
	extractData(res: Response) {
		let body = res.json();
		return body || {};
	}
	handleErrorPromise (error: Response | any) {
		console.error(error.message || error);
		return Promise.reject(error.message || error);
	}

	onSubmit() {
		this.theForm.value.reason = this.reason;
		this.theForm.value.reason = this.topics.find(a=> a.slug===this.reason).name;
    	this.theForm.value.date = $('#date').val();
    	this.theForm.value.products = this.productList;
    	if(!this.theForm.valid) return this.flag = true;
    	this.success = true;
    	this.configsService.push('/contact_form',this.theForm.value);
    }

    inputStyle(){
    	setTimeout(e=> {
			// this.ready = true;
	    	const parent = $('#cForm');
	    	const inputs = $('input, select, textarea', parent);
			inputs.unbind();
			// input
			inputs.on('click focus', function() {
				var parent = $(this).parent('.stylefield');
				$(this).siblings('input, select, textarea').focus();
				parent.addClass('focused filled');
			});
			inputs.on('focusout', function() {
				var parent = $(this).parent('.stylefield');
				parent.removeClass('focused');
				if ((<any>this).value === '') {
					parent.removeClass('filled')
				}
			});
			inputs.not('.sub').click();
			inputs.not('.sub').focusout();
		},500);
	}

	toArray(obj_obj) {
		return Object.keys(obj_obj).map(i => obj_obj[i]);
	}

	smooth(target, offset: number) {
		setTimeout(e=>{
			const self = this;
			offset = offset || 0;
			target = $(`#${target}`);
			if (target.length) {
				// event.preventDefault();
				$('html, body').animate({
						scrollTop: target.offset().top - offset,
						easing: 'easeOutCirc'
				}, 300, function() {
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
		},200);
	}

}

function mapId(arr) {
	// let map = [];
	return arr.reduce(function(map, obj) {
	    map[obj.id] = obj;
	    return map;
	}, {});
}



