import { Component, OnInit, Input } from '@angular/core';
import { BcAuthService, BcCartService, LocalstorageService } from './../../../../_services';
import { _log, notice, SnotifyService } from '../../../../utils';

const params = notice;

function validEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}


@Component({
  selector: 'app-mini-user',
  templateUrl: './mini-user.component.html',
  styleUrls: ['./mini-user.component.scss']
})
export class MiniUserComponent implements OnInit {

	// active = "login";
	user: any;
	user_unauthenticated: any;
	authenticated: boolean;
	email: any;
	mode: any;

	@Input() active: string;

	constructor(
		public bcAuthService: BcAuthService,
		// tslint:disable-next-line:no-shadowed-variable
		public notice: SnotifyService,
		public bcCartService: BcCartService,
		public localstorageService: LocalstorageService
	) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
			this.user = mode.user;
		});
		this.email = this.localstorageService.getItem('email');
	}

	ngOnInit() { }

	userFormSubmit(e) {
		const $target = $(e.target);
		this[this.active]($target);
	}

	login($target) {
		const $e = $target.find('#email');
		const $p = $target.find('#password');
		const $uId = $target.find('#uId');
		if (!$e.val()) { this.er($e); return false; }
		if (!$p.val()) { this.er($p); return false; }
		if (!$uId.val()) { this.noUser(); this.er($e); return false; }
		this.bcAuthService.login({
			email: $e.val(),
			password: $p.val(),
			id: $uId.val()
		}).subscribe(res => {
			_log(' == login ==> ', 'bc', res);
			if ( !res.success ) {
				this.notice.warning(
					`The provided password was incorrect. please try again`,
					params('errIcon')
				);
				return false;
			}
			this.bcAuthService.giveAccess(res);
		});
	}


	er(el) {
		el.closest('span').addClass('er').delay(2000).queue(function (next) {
			$(this).removeClass('er').dequeue();
		});
	}

	noUser() {
		this.user = null;
		$('#uId').val(null);
		// this.active = "register";
		if (this.active === 'login') {
			this.notice.warning(
				`${$('input#email').val()} is not registered. Please register an account.`,
				params('errIcon')
			);
		}
	}

	onEmailVal(e) {
		const self = this;
		let $input = $('input#email');
		let $passField = $('input#password');
		let $userForm = $('form#user');
		let $uid = $('input#uId');
		$uid.val(null);
		$input.unbind();
		$passField.unbind();
		$userForm.unbind();
		$input.focusout(function () {
			d();
		});
		// $passField.click( function() {
		// 	d();
		// });
		// $('form#user').submit(function () {
		// 	d();
		// });
		function d() {
			if (validEmail($input.val())) {
				self.quickUser($input.val());
			} else {
				self.er($input);
			}
		}
	}

	quickUser(email) {
		this.bcAuthService.get_user({ email: email }).subscribe(res => {
			_log(' == get_user ==> ', 'bc', res);
			(res) ? $('#uId').val(res[0].id) : this.noUser();
		});
	}

	register($target) {
		let customer = {
			email: $target.find('#email').val(),
			company: $target.find('#company').val(),
			first_name: $target.find('#first').val(),
			last_name: $target.find('#last').val(),
			phone: $target.find('#phone').val(),
			_authentication: {
				password: $target.find('#password').val(),
				password_confirmation: $target.find('#confirm').val()
			}
		};
		let pass = this.checkRegisterData(customer);
		// const password = {
		// };
		if (pass) {
			_log(' == customer payload ==> ', 'd', customer);
			this.bcAuthService.create_customer(customer).subscribe(res => {
				_log(' == create_customer res ==> ', 'bc', res);
				if (res.first_name) {
					this.active = 'login';
					this.bcAuthService.giveAccess(res);
				}
			});
		}
	}

	checkRegisterData(customer) {
		const creds = customer._authentication;
		const c = customer;
		if (!c.company || !c.last_name || !c.first_name) {
			this.notice.warning(
				`Form Incomplete`,
				params('errIcon')
			);
			return false;
		}
		if (!c.email) {
			this.notice.warning(
				`Missing Email Address`,
				params('errIcon')
			);
			return false;
		}
		if (!validEmail(c.email)) {
			this.notice.warning(
				`Invalid Email`,
				params('errIcon')
			);
			return false;
		}
		if (creds.password !== creds.password_confirmation) {
			this.notice.warning(
				`Passwords do not match.`,
				params('errIcon')
			);
			return false;
		}
		if (creds.password.length < 6) {
			this.notice.warning(
				`Your password should be more than 6 charecter`,
				params('errIcon')
			);
			return false;
		}
		return true;
	}

	signOut() {
		this.bcAuthService.signOut();
	}

	goto(path) {
		this.bcAuthService.goto(path);
	}


}
