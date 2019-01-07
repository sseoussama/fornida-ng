import { Component, OnInit, Input } from '@angular/core';
import { BcAuthService, BcProductService } from '../../_services';

@Component({
  selector: 'links-account',
  templateUrl: './links-account.component.html',
  styleUrls: ['./links-account.component.scss']
})
export class LinksAccountComponent implements OnInit {
  @Input() mode: any;
  loginModal:any;

  constructor(private bcAuthService: BcAuthService, private bcProductService: BcProductService,) {
  }

  ngOnInit() {
  }

  goto(path) {
    this.bcAuthService.goto(path);
  }

  out() {
    this.bcAuthService.signOut();
  }

  closeNav() {
    this.bcProductService.toggleMobileNav.next(false);
  }

}
