declare var require: any;
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { price, Sample } from '../utils';
// import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ActivityService } from './activity.service';
import { slugify } from '../utils/_global';
import { _log, notice, SnotifyService } from '../utils';
import { BcCartService } from './bigcommerce-cart.service';
import { LocalstorageService } from './localstorage.service';

const noticeParams = notice;
// const api_url = environment.api_url;
const noticeg = notice;

@Injectable()
export class ConfigsService {
	sample_data = Sample;

	Configs: any = [];
	current: any;
	productsCollection: any;
    ConfigsChange: Subject<any> = new Subject<any>();
    stashedSubject: Subject<any> = new Subject<any>();
    configSubmitted: Subject<any> = new Subject<any>();
    config_id: any;
    product: any;
    configsObj: any;
    configsList: any;
    ref: any;
    collabRef: any;
    collabs: any;
    user: any;
    ConfigMetaRef: any;
    allConfig: any;
    allList: any;
    stashed: any;
	current_build_id: any;
    configMeta: any;

	constructor(
		public db: AngularFireDatabase,
		private http: HttpClient,
		public activityService: ActivityService,
		// tslint:disable-next-line:no-shadowed-variable
		public notice: SnotifyService,
		public bcCartService: BcCartService,
		public localstorageService: LocalstorageService
	)  {
		this.getStashedConfigs();
		this.setBuildId();
        // this.ConfigsChange.subscribe((value) => {
        // 	this.Configs = value;
        // 	this.updateConfiguration(value);
        // });
    }

    get Sample_data() { return this.sample_data; }
    get Current() { return this.current; }
    get Stashed() { return this.stashed; }

    setRefs(config_id, user, editing?) {
    	// 98_36W4kgRM7F
    	const root = (editing !== undefined) ? `stashed/${editing}/config_copy` : `config_sessions/${config_id}`;
		_log('configs location ==> ', 'e', root);
		this.config_id = config_id;
    	this.ConfigMetaRef = `${root}/meta`;
    	this.allConfig = `${root}`;
    	this.collabRef = `${root}/collaborators`;
    	this.ref = `${root}/configs`;
        this.configsObj = this.db.object(this.ref);
        this.configsList = this.db.list(this.ref);
        this.allList = this.db.list(this.allConfig);
        _log(` config_id:  ${this.config_id} `, 'd');
        this.updateCollaborator(user);
    }

    configModified(reason) { // not needed for now
    	// this.db.object(this.ConfigMetaRef).update({data:{
    	// 	modified:Date.now(),
    	// 	modified_reason: reason
    	// }});
	}

	setBuildId() {
		this.get('current_build_id').subscribe(current_build_id => {
			_log(' current_build_id => ', 'fb', current_build_id);
			if (!current_build_id) {
				return this.newBuildId();
			}
			this.current_build_id = current_build_id;
		});
	}

	newBuildId() {
		const id = (this.current_build_id || 949000) + 1;
		_log(' newBuildId => ', 'd', id);
		this.set('current_build_id', id);
		return this.current_build_id + 1;
	}


	adjustBuildQTY(qty) {
    	return this.db.object(`${this.ConfigMetaRef}/data/build_qty`).set(qty);
    }

    getConfigMeta() {
		return this.db.list(`${this.ConfigMetaRef}`).valueChanges();
	}

	get listSnapshotChanges():any {
		this.configModified('get listSnapshotChanges');
		return this.configsList.snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
	}

	get collabList():any {
		return this.db.list(this.collabRef).snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
	}

	get ConfigMetaList():any {
		return this.db.list(this.ConfigMetaRef).snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
	}

	get configAll():any {
		return this.db.object(this.allConfig).valueChanges();
	}

	// get getMessages():any {
	// 	return this.db.object('contact_form').valueChanges();
	// }

	get getMessages():any {
		return this.db.list('contact_form').snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
	}

	updateCollaborator(user) {
    	this.user = user;
    	const email = localStorage.getItem("email");
    	let data:any = {};
    	if(user === 'anonymous') {
    		_log(`/** anonymous Collaborator **/ `, 'd');
    		data = {
	    		email: 'anonymous@anonymous.com',
	    		slug:slugify('anonymous@anonymous.com'),
	    		modified:  Date.now(),
	    		user: {
	    			first_name: 'anonymous'
	    		}
	    	};
	    	this.user = data;
    	} else {
    		_log(`/** update Collabor ==> ${email} **/ `, 'fb');
	    	data = {
	    		email: email,
	    		slug:slugify(email),
	    		modified:  Date.now(),
	    		user: user
	    	};
    	}
    	data.visible = true;
		const configsObj = this.db.object(this.collabRef+`/${data.slug}`);
		configsObj.update(data);
    }

	update_last_seen(mod_stamp) {
		this.db.object(this.collabRef+`/${slugify(this.user.email)}`).update({last_seen:mod_stamp});
	}

	update_collab_visible(visible) {
		this.db.object(this.collabRef+`/${slugify(this.user.email)}`).update({visible:visible});
	}

	delete_collab(users_email) {
		this.db.object(this.collabRef+`/${slugify(users_email)}`).remove();
	}

	removeCollab() {
		const slug = slugify(localStorage.getItem("email"));
		this.configModified('remove_config');
		_log(`/** REMOVE Collab ==> ${slug} **/ `, 'fb');
		this.db.list(`${this.collabRef}`).remove(slug);
	}

  //   updateConfiguration(data) {
  //   	data.modified =  Date.now();
  //   	data.last_modifier = localStorage.getItem("email") || 'not_logged_in';
  //   	const key = slugify(data.last_modifier);
  //   	const p = this.product.data;
  //   	const product = {
  //   		name: p.name,
  //   		sku: p.sku,
  //   		id: p.id
  //   	};
  //   	this.db.object(`/config_sessions/${this.config_id}/data/contributors`).update({[key]:data.last_modifier});
  //   	this.db.object(`/config_sessions/${this.config_id}/data/product`).update(product);
		// return this.db.object( `/config_sessions/${this.config_id}/data/configs`).set(this.Configs);
  //   }


    add_config(item) {
    	this.configModified('config added');
		_log(`/** ADD ==> ${item.key} **/ `, 'fb');
		if (!item.quantity) { item = Object.assign(item, {quantity:item.min}); }
		item['modified'] = Date.now();
		// item['order'] = ;
		const configsObj = this.db.object(this.ref+`/${item.key}`);
		configsObj.set(item);
	}

	remove_config(item) {
		this.configModified('remove_config');
		_log(`/** REMOVE ==> ${item.key} **/ `, 'fb');
		// this.ref = `config_sessions/${this.config_id}/configs`;
		const configsList = this.db.list(this.ref);
		configsList.remove(item.key);
	}

	set_configs(data) {
		this.configModified('set_configs');
		_log(`/** Set ==> ${data.key} **/ `, 'fb');
		this.configsObj.set(data);
	}

	set_config(item) {
		this.configModified('set_config (item)');
		_log(`/** Set ==> ${item.key} **/ `, 'fb', item);
		const configsObj = this.db.object(this.ref+`/${item.key}`);
		configsObj.set(item);
	}

    setCurrent_bak(product_sku) {
    	return this.db.list(`products/${product_sku}/data`).snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
	      )
	    );
    }

    removeOptionFromSet(data) {
    	const ref = `/products/${data.sku}/data/config/${data.set}/options`;
    	return this.db.list(ref).remove(data.itemId);
    }

    removePreConfig(data) {
    	const ref = `/products/${data.sku}/data/pre_configs`;
    	return this.db.list(ref).remove(data.item);
    }

    removeSet(data) {
    	const ref = `/products/${data.sku}/data/config`;
    	return this.db.list(ref).remove(data.item);
    }

    duplicateConfigs(selected_sku,data) {
    	const ref = `/products/${selected_sku}/data/config`;
    	return this.db.object(ref).set(data);
    }

    set(loc,data) {
    	return this.db.object(loc).set(data);
	}

	get(loc) {
		return this.db.object(loc).valueChanges();
	}

    push(loc,data) {
    	return this.db.list(loc).push(data);
    }

    remove(loc,data) {
    	return this.db.list(loc).remove(data);
    }

	//   setCurrent(product_sku) {
	//   	return this.db.list(`products/${product_sku}/data`).snapshotChanges().pipe(map(changes => {
	//  		return changes.map( c => ({
	//  			key: c.payload.key,
	//  			...c.payload.val()
	//  		}));
	// }));
	//   }
  	setCurrent(product_sku) {
  		const ref = this.db.object(`products/${product_sku}/data`);
  		return ref.valueChanges();
		// return ref.snapshotChanges().map(changes => {
		// 	return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		// });
	}

	getSets(product_sku) {
		return this.db.list(`products/${product_sku}/data/config`).snapshotChanges().pipe(
	      map(changes =>
	        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
	      )
	    );
	}

	// get collabList():any {
	// 	return this.db.list(this.collabRef).snapshotChanges().map(changes => {
	// 		return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
	// 	});
	// }


    savePreConfig(data) {
    	data.created =  Date.now();
		return this.db.object(`/products/${data.sku}/data/pre_configs`).update(data.data);
    }

    newConfig(data) {
    	// data.sku = 'CGLD';
    	data.created =  Date.now();
    	data = Object.assign({values: this.Configs}, data);
    	_log(' == newConfig() res ==> ', 'fb', data);
		return this.db.object(`/user/${data.email_id}/pre_configs/${data.sku}/${data.slug}`).update(data);
    }

    save4customer(data) {
    	data.created =  Date.now();
    	data = Object.assign({values: this.Configs}, data);
    	this.activityService.newActivity({
    		for: data.customer_email,
    		title: "SHARED CONFIGURATION",
    		color: "blue",
    		link: `/product/${data.product_id}`,
    		msg: `${this.user.first_name} shared a configuration with you. (${data.name})`
    	});
    	return this.db.object(`/user/${data.customer_email}/pre_configs/${data.sku}/${data.slug}`).update(data);
    }

    getSavedConfigs(product_sku) {
    	const email = slugify(localStorage.getItem("email"));
		return this.db.list(`user/${email}/pre_configs/${product_sku}`).valueChanges();
	}


	removeSavedConfig(data) {
    	const email = slugify(localStorage.getItem("email"));
		return this.db.list(`user/${email}/pre_configs/${data.sku}`).remove(data.slug);
	}

    newPreConfig(data) {
    	// data.sku = 'CGLD';
    	data.created =  Date.now();
    	data = Object.assign({values: this.Configs}, data);
		return this.db.object(`/products/${data.sku}/data/pre_configs/${data.slug}`).update(data);
    }

    addConfigsToStashed(data) {
    	data['created'] =  Date.now();
    	return this.db.object(`/stashed/${data.build_id}`).set(data);
    }

    modify_a_build(build) {
    	build['modified'] =  Date.now();
    	return this.db.object(`/stashed/${build.build_id}`).update(build);
    }

    getStashedConfigs() {
		return this.db.list(`/stashed`).valueChanges().subscribe(stashed => {
			_log(' == stashed (in service) ==> ', 'fb', stashed);
			this.stashed = stashed;
			this.stashedSubject.next(stashed);
		});
	}

	deleteBuild(buildId) {
		_log(`Deleting Stash ${buildId}...`, 'e');
		this.db.list(`/stashed`).remove(buildId.toString());
	}

    addConfigurable(data) {
    	data.created =  Date.now();
    	return this.db.object(`/products/${data.sku}/data`).update(data);
    }

    addItemToSet(data) {
    	_log(' == addItemToSet ==> ', 'fb', data);
    	const ref = `/products/${data.product_sku}/data/config/${data.set}/options`;
    	return this.db.list(ref).update(data.key,data.selected);
    }

    addSetToProduct(data) {
    	const ref = `/products/${data.product_sku}/data/config`;
    	return this.db.list(ref).update(data.set.slug, data.set);
    	// const ref = `/products/${data.product_sku}/data/config`;
    	// const itemsRef = this.db.list(ref);
    	// return itemsRef.push(data.set);
    }

    makeCustomField(data) {
		return this.http.get<any>( this.localstorageService.apiUrl + '/makeCustomField', {params: data} ).subscribe(res => {
			_log(' == makeCustomField() res ==> ', 'fb', res);
		});
	}

	updateCustomField(data) {
		return this.http.get<any>( this.localstorageService.apiUrl + '/updateCustomField', {params: data} ).subscribe(res => {
			_log(' == updateCustomField() res ==> ', 'fb', res);
		});
	}

	addProductModifier(data, cb) {
		return this.http.get<any>( this.localstorageService.apiUrl + '/addProductModifier', {params: data} ).catch(this.errHandler.bind(this)).subscribe(res => {
			_log(' == addProductModifier() res ==> ', 'fb', res);
			cb(res.data.id);
		});
	}

	removeCustomField(data) {
		return this.http.get<any>( this.localstorageService.apiUrl + '/removeCustomField', {params: data} ).subscribe(res => {
			_log(' == removeCustomField() res ==> ', 'fb', res);
		});
	}

	get_current_configs() {
		return this.Configs.map(x => x.key);
	}

	// set_configs(specs) {
	// 	// this.Configs = specs;
	// 	this.ConfigsChange.next(specs);
	// }

	toggleConfigs() {
        this.ConfigsChange.next(!this.Configs);
    }


	clear_config() {
		const self = this;
		return $.each( this.Configs, function( index, data ) {
			self.remove_config(data);
		});
	}

	addtocart(items, buildQty) { // also do this for other add to cart
		const self = this;
		// this.show_errors();
		self.bcCartService.addMulti(items, buildQty);
		// setTimeout( function() {
		// 	const isErr = ($('h3.ti.red').length);
		// 	if( isErr ) {
		// 		console.error('isErr: ', typeof $('h3.ti.red'));
		// 		self.err_add_to_cart();
		// 	} else {
		// 		self.bcCartService.addMulti(items, buildQty);
		// 	}
		// }, 500);
	}

	show_errors() {
		this.configSubmitted.next(true);
	}

	err_add_to_cart() {
		this.notice.warning(
			`Please select required options.`,
			`There was a problem`,
			noticeParams('errIcon')
		);
	}

	errHandler(error: HttpErrorResponse) {
		let show = error.error.formatted || error.statusText;
		this.notice.warning(
			show,
			`There was a problem`,
			noticeParams('errIcon')
		);
		_log( show, 'e');
		return Observable.throw(error.error || "unknown error");
	}

}
