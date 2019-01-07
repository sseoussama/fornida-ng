import { Component, OnInit, OnDestroy } from '@angular/core';
import { BcProductService } from '../../_services';
import { _log } from '../../utils/_global';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'links-category',
  templateUrl: './links-category.component.html',
  styleUrls: ['./links-category.component.scss']
})
export class LinksCategoryComponent implements OnInit, OnDestroy {

  categories: any[] = [];
  _categories: Subscription;
  get categoryTree() { return this.bcProductService.CategoryTree; }

  constructor(private bcProductService: BcProductService, ) {
    this.getCategories();
  }

  ngOnInit() {}
  ngOnDestroy() {}

  getCategories() {
    const self = this;
    this._categories = this.bcProductService.getCategories().subscribe(categories => {
      _log(' == categories (links-category) ==> ', 'bc', categories);
      // set id as key
      categories.data.forEach(itm => {
        self.categories[itm.id] = itm;
      });
    });
  }

  closeNav() {
    this.bcProductService.toggleMobileNav.next(false);
  }

}
