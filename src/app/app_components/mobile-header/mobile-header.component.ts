import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { BcProductService } from '../../_services';

@AutoUnsubscribe()
@Component({
  selector: "mobile-header",
  templateUrl: "./mobile-header.component.html",
  styleUrls: ["./mobile-header.component.scss"]
})

export class MobileHeaderComponent implements OnInit, OnDestroy {

  navOpen = false;
  @Input() mode: any;
  _toggleNav: Subscription;

  constructor(private bcProductService: BcProductService) {
    this.navState();
  }

  ngOnInit() { }
  ngOnDestroy() { }

  navState() {
    this._toggleNav = this.bcProductService.toggleMobileNav.subscribe((val) => {
      console.log('toggleMobileNav: ', val);
      this.navOpen = val;
    });
  }


}
