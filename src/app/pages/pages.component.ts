import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlamelinkService, BcAuthService } from '../_services';
import { Meta, Title }  from '@angular/platform-browser';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

	page:any;
	mode:any;
	imageObj:any;
	image:any;
	imageSrc:any;
	editorContent: any;

	constructor(
		public route: ActivatedRoute,
		public router: Router,
		public bcAuthService: BcAuthService,
		public flamelinkService: FlamelinkService,
		private meta: Meta,
		private title: Title
	) {
		this.bcAuthService.mode.subscribe(mode => {
			this.mode = mode;
		});
		this.getPage(this.route.snapshot.paramMap.get('page'), ()=> {
			let def = 'https://cdn7.bigcommerce.com/s-2bihpr2wvz/product_images/uploaded_images/fornida-servers2.png';
			let i = (this.imageSrc===undefined) ? def : this.imageSrc;
			title.setTitle(this.page.title+" — Fornida");
			meta.addTags([
			    { name: 'og:title', content: this.page.title },
			    { name: 'og:description', content: this.page.summary },
			    { name: 'description', content: this.page.summary },
			    { name: 'og:image', content: i },
			]);
		});
	}

	ngOnInit() {
	}


	getPage(slug, next?) {
		this.flamelinkService.getbySlug('pages', slug, data => {
			this.page = data[0];
			try {
				this.imageObj = this.page.images[0];
				this.getURL(this.imageObj.image[0])
			} catch(err) {
				// console.error(err);
			}
			if(next) next();
		})
	}

	getURL(imageId) {
		this.flamelinkService.getURL(imageId, i => {
			setTimeout(e=>this.imageSrc = i,0);
		})
	}

}
