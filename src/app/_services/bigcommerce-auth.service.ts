import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { _log, notice, SnotifyService } from '../utils';
import { LocalstorageService } from './localstorage.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

const params = notice;
// const api_url = environment.api_url;
const stencil = environment.stencil;

@Injectable()
export class BcAuthService {

	admins = [
		'contactomarnow@gmail.com',
		'jybarra@cloudnavigators.com',
		'Steven.Huang@fornida.com',
		'steven.huang@fornida.com',
		'farzad.vahid@fornida.com',
		'kamlesh.k@cisinlabs.com'
	];
	authenticated: boolean;
	dev: boolean;
	mode: BehaviorSubject<any> = new BehaviorSubject<any>('');
	user: any;
	user_data: Subject<any> = new Subject<any>();
	session_id: any;
	firebase: any;
	local_email: any;
	local_cartId: any;


	constructor(
		public http: HttpClient,
		private localstorageService: LocalstorageService,
		// tslint:disable-next-line:no-shadowed-variable
		public notice: SnotifyService,
		public afAuth: AngularFireAuth
	) {
		// firebase login
		// this.firebase = this.signInAnonymously();
		_log('signInAnonymously', 'd');
		this.session_id = this.localstorageService.getItem('session_id') || (generateID(5)).toLowerCase();
		localStorage.setItem( "session_id", this.session_id );
		this.local_email = this.localstorageService.getItem('email');
		this.local_cartId = this.localstorageService.getItem('cartId');

		if (this.local_email) { this.update_user(); }
		// setTimeout(e=>this.reSetMode(),0); // wait for firebase signin
	}

	update_user() {
		this.subscribeUserData();
		let email = this.localstorageService.getItem('email');
		let u = this.http.get<any>(this.localstorageService.apiUrl + "/get_user_address", { params: {email:email} }).catch(this.errHandler);
		u.subscribe(user => {
			return this.user_data.next(user);
		});
	}

	giveAccess(res) {
		localStorage.setItem("sso_url", res.sso_url);
		localStorage.setItem("email", res.email);
		localStorage.setItem("bc_token", res.token);
		this.update_user();
		// this.checkAuth();
		this.notice.success(
			`We hope you are having a great ${w[new Date().getDay()]}!`,
			`Login Successful`,
			params('checkIcon')
		);
	}

	subscribeUserData() {
		this.user_data.subscribe(user => {
			this.user = user;
			this.reSetMode(user);
		});
	}

	reSetMode(u?) {
		if(!u) { u = false; }
		this.setMode({ // defaults
			admin: this.admins.includes(this.localstorageService.getItem('email')),
			edit: false,
			dev: false,
			auth: this.isAuth(),
			// authenticated: this.isAuth(),
			user: u,
			email: this.localstorageService.getItem('email'),
			// firebase_uid: this.firebase.i.user.uid
		});
	}

	signOut() {
		this.authenticated = false;
		localStorage.removeItem( "sso_url" );
		localStorage.removeItem( "email" );
		this.notice.success(
			`You were succesfully logged out`,
			`Good bye ${this.user.first_name}`,
			params('checkIcon')
		);
		this.user = null;
		this.reSetMode();
	}

	signInAnonymously() {
		if( this.isAuth() ) {
			return this.afAuth.auth.signInAnonymously().catch(function(error) {
				_log(" == Firebase Auth Error ==> ", 'e', error);
			});
		}
	}

	getMode() {
		return this.mode.asObservable();
	}

	get_user(data, address?) {
		let u;
		if(address) {
			u = this.http.get<any>( this.localstorageService.apiUrl + "/get_user_address", {params: data} ).catch(this.errHandler);
		} else {
			u = this.http.get<any>( this.localstorageService.apiUrl + "/get_user", {params: data} ).catch(this.errHandler);
		}
		// u.subscribe(user=> this.user=user);
		return u;
	}

	login(data) {
		return this.http.get<any>( this.localstorageService.apiUrl + "/login", {params: data} ).catch(this.errHandler);
	}

	isAuth() {
	    return this.authenticated = (this.localstorageService.getItem('email') != null);
	}

	isAdmin() {
		return this.admins.includes(this.localstorageService.getItem('email'));
	}

	create_customer(customer) {
		return this.http.post<any>( this.localstorageService.apiUrl + "/create_customer", customer ).catch(this.errHandler);
	}

	update_customer(payload) {
		return this.http.post<any>( this.localstorageService.apiUrl + "/update_customer", {params: payload} ).catch(this.errHandler);
	}

	setMode(value) {
		this.mode.next(value);
	}

	errHandler(error: HttpErrorResponse) {
		_log(" == Auth Error ==> ", 'e', error);
		return Observable.throw(error.error || "unknown error");
	}

	goto(path) {
		this.getPath({ path: path }, ret_path => {
			_log('no user (goto) =>', 'd', ret_path);
			return window.open(`${ret_path}`, '_blank').focus();
		}).subscribe( res => {
			_log(res, 'd');
			window.open(`${res.url}`, '_blank').focus();
		});
	}

	getPath(data, nouser?) {
		try {
			const cart_id = this.local_cartId || null;
			data.uid = this.user.id;
			data.stencil = stencil;
			data.path = data.path;
			return this.http.get<any>( this.localstorageService.apiUrl + "/goto", {params: data} ).catch(this.errHandler);
		} catch (err) {
			return nouser(`${stencil}${data.path}`);
		}
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

let w = new Array(7);
w[0] = "Sunday";
w[1] = "Monday";
w[2] = "Tuesday";
w[3] = "Wednesday";
w[4] = "Thursday";
w[5] = "Friday";
w[6] = "Saturday";
