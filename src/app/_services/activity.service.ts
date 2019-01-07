import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { _log } from '../utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { slugify } from '../utils/_global';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

	email: string;
	slug: string;
	ref: any;
	activityObj: any;
	activityList: any;
	activity: any;
	unseenActivity: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(
		public db: AngularFireDatabase,
		private http: HttpClient,
		private localstorageService: LocalstorageService
	) {
		this.email = this.localstorageService.getItem('email');
	}

	get ActivityList():any {
		return this.activityList.snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).sort((a, b) => b.created - a.created );
		});
	}

	setRefs() {
		this.slug = slugify(this.email);
		this.ref = `user/${this.slug}/activity/data`;
        this.activityObj = this.db.object(this.ref);
        this.activityList = this.db.list(this.ref);
        // this.activityList = this.db.list(this.ref, ref => ref.orderByValue('created').equalTo('large'));
	}

	forRef(email) {
		const ref = `user/${slugify(email)}/activity/data`;
		return this.db.list(ref);
	}

	newActivity(item) {
		item.created =  Date.now();
		item.seen = false;
		_log(` == newActivity() ==> `, 'i', item);
		this.forRef(item.for).push(item);
	}

	updateActivity(item) {
		_log(` == trying newActivity() ==> `, 'i', item);
		const itemObj = this.db.object(this.ref+`/${item.key}`);
		itemObj.update(item);
	}

	setNewActivity(value) {
		this.unseenActivity.next(value);
	}

	getNewActivity() {
    	return this.unseenActivity.asObservable();
    }

}


































