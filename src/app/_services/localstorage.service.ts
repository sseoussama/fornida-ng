import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../environments/environment';
import { _log } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
	
	// email: any = localStorage.getItem("email");
	// cartId: any;
	isBrowser: boolean;
	apiUrl: string;

	constructor(@Inject(PLATFORM_ID) private platformId: Object, private injector: Injector) {
		if (isPlatformBrowser(this.platformId)) {
			// this.email = localStorage.getItem("email");
			// this.cartId = localStorage.getItem("cartId");
			this.isBrowser = true;
			localStorage.setItem("isBrowser", 'true');
		} else  {
			this.isBrowser = false;
			localStorage.setItem("isBrowser", 'false');
		}

		if (isPlatformServer(this.platformId)) {
            const req = this.injector.get('request');
			console.log("reqreq", req.get('host'), req.protocol)
			this.apiUrl = `${req.protocol}://${req.get('host')}${environment.api_url}`;
        } else {
			this.apiUrl = environment.api_url;
            _log('we\'re rendering from the browser, there is no request object.', 'd');
        }
	}

	getItem(query) {
		return localStorage.getItem(query);
	}

	

}
