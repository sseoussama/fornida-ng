import { Injectable, Inject } from '@angular/core';
// import * as firebase from 'firebase';
import * as flamelink from 'flamelink';
import { FirebaseApp } from '@angular/fire';
// import { environment } from '../../environments/environment';
import { slugify, toArray, _log } from '../utils';
import { LocalstorageService } from "./localstorage.service";


@Injectable({
  providedIn: 'root'
})
export class FlamelinkService {

	flame: any;
	content: any;
	storage: any;
	// faQs: any;
	// supportTopics: any;
	// contactTopics: any;

	// GET|SET flApp
	private _flApp: flamelink.App;
	get flApp(): flamelink.App {
		return this._flApp;
	}
	set flApp(value: flamelink.App) {
		this._flApp = value;
	}

	constructor(@Inject(FirebaseApp) private _fb: firebase.app.App, private localstorageService: LocalstorageService) {
		if(localstorageService.isBrowser) {
			this.flame = flamelink({
				firebaseApp: this._fb,
				env: 'production',
				locale: 'en-US'
			});
			this.content = this.flame.content;
			this.storage = this.flame.storage;
		}
	}

	getData(data:string, next) {
		this.content.get(data).then(response => {
			_log(`Flamelink ${data} :`,'fl', response);
			this[data] = toArray(response);
			return next(toArray(response));
		}).catch(error => {
			console.error(`flamelink (${data})`, error);
		});
	}

	getExisting(data:string, next) {
		return (this[data] !== undefined) ? next(this[data]) : this.getData(data, next);
	}

	getbySlug(page:string, slug:string, next) {
		this.content.getByField(page, 'slug', slug).then(response => {
			_log(`Flamelink ${slug} :`,'fl', response)
			return next(toArray(response));
		}).catch(error => {
			console.error(`flamelink (${slug})`, error);
		});
	}

	getFile(fileId, next) {
		this.storage.getFile(fileId).then(response => {
			_log(`Flamelink - file: ${fileId} :`,'fl', response)
			return next(response);
		}).catch(error => {
			console.error(`flamelink (File: ${fileId})`, error);
		});
	}

	getURL(fileId, next) {
		this.storage.getURL(fileId).then(response => {
			_log(`Flamelink - file: ${fileId} :`,'fl', response)
			return next(response);
		}).catch(error => {
			console.error(`flamelink (File: ${fileId})`, error);
		});
	}



}



















