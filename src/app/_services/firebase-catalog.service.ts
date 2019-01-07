import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FirebaseProductsService {

	// categoryTreeDoc: AngularFirestoreDocument<any>;
	// productsDoc: AngularFirestoreDocument<any>;

	// tree: Observable<any>
	// products_fs: Observable<any>

	productCollection: AngularFirestoreCollection<any>;
  	products: Observable<any[]>;


	constructor(public afs: AngularFirestore) {
		afs.firestore.settings({ timestampsInSnapshots: true });
		// this.tree = this.categoryTreeDoc.collection<any>('catalog/tree').valueChanges();
		// this.products_fs = this.categoryTreeDoc.collection<any>('catalog/products').valueChanges();
		this.productCollection = this.afs.collection('products');
    	this.products = this.productCollection.valueChanges();
	}

	addProducts(data) {
		// console.log('adding to fb', data);
		// this.productCollection.update(data);
    	// this.afs.collection('posts').doc('my-custom-id').set({'title': this.title, 'content': this.content});
	}

}
	

