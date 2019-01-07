import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FlamelinkService, BcProductService } from '../../../_services';
import { ISubscription, Subscription } from "rxjs/Subscription";
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnInit, OnDestroy {

  @Input() mode: any;

  constructor(
    private flamelinkService: FlamelinkService,
    private bcProductService: BcProductService,
  ) {
  }

  showing: any;
  s_topics: any;
  _topics: Subscription;

  ngOnInit() {
    // console.log('mode (mobile-nav)', this.mode);
    this.triggerTab($('.wz-itm')[0]);
    this.getTopics();
  }

  ngOnDestroy() { }

  onTab(e, showing) {
    const $t = $(e.target);
    this.showing = showing;
    $('.wz-itm.active').removeClass('active');
    $t.addClass('active');
    this.place_underline($t);
  }

  place_underline(target) {
    const $underline = $('.underline');
    const activeL = target.position().left;
    // const pad = parseInt(target.css('padding-left').replace('px', ''));
    const pad = 0;
    const containerL = $('.forunderlines.taj').position().left;
    // const containerL = 0;
    const pos = activeL - containerL + pad + 'px';
    $underline.css({
      'margin-left': pos,
      'width': target.outerWidth() + 'px'
      // 'width': target.width() + 'px'
    });
  }

  triggerTab(target) {
    target.dispatchEvent(new Event('click'));
  }

  getTopics() {
    this._topics = this.flamelinkService.getExisting('supportTopics', data => {
      this.s_topics = data;
    });
  }

  closeNav() {
    this.bcProductService.toggleMobileNav.next(false);
  }

}
