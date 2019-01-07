  declare var require: any;
  import { Component, OnInit, AfterViewInit } from '@angular/core';
  import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
  import {Location} from '@angular/common';
  import 'rxjs';
  // import {Observable} from 'rxjs/Observable';
  import { filter } from 'rxjs/operators';
  import { BcAuthService, LocalstorageService } from './_services';
  import { _log } from './utils/_global';
  const Sticky = require('sticky-js');

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
  })

  export class AppComponent implements OnInit, AfterViewInit {

    test = "hello world"
    public fragment: string;
    inside: boolean;
    insideDone: boolean;
    data: any;
    mode: any;
    isMobile: any;

    constructor(
      public route: ActivatedRoute,
      public bcAuthService: BcAuthService,
      public router: Router,
      public localstorageService: LocalstorageService,
      private location: Location
    ) {
      // this.configsService.getStashedConfigs();
    }

    ngOnInit() {
      this.bcAuthService.mode.subscribe(mode => {
        this.mode = mode;
      });

      this.router.events.pipe( filter( (event) => event instanceof NavigationEnd) ).subscribe(e => {
          const self = this;

          this.setInside(e);

          if(this.localstorageService.isBrowser) { window.scrollTo(0, 0); }
          this.route.fragment.subscribe(fragment => { this.fragment = fragment; });

      });
      
      // this.chatIo();
      if(this.localstorageService.isBrowser) {
        this.adapt();
        this.countPageView();
      }
    }

    ngAfterViewInit() {
      this.debugWidths();
    }

    debugWidths() {
      const docWidth = document.documentElement.offsetWidth;
      [].forEach.call(
        document.querySelectorAll('*'),
        function (el) {
          if (el.offsetWidth > docWidth) {
            _log(" DIV Overflow => ",'e',el);
          }
        }
      );
    }

    adapt() {
      this.isMobile = window.matchMedia("(max-width: 700px)").matches;
      _log(`isMobile => ${this.isMobile} `, 'd');
    }

    countPageView() {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });
    }

    prevPage() {
      this.location.back();
    }

    forwardPage() {
      this.location.forward();
    }


    images() {
      [].forEach.call(document.querySelectorAll('img[data-src]'),    function(img) {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.onload = function() {
          img.removeAttribute('data-src');
        };
      });
    }

    chatIo() {
      if(!this.mode.admin && this.localstorageService.isBrowser) {
        (function(c, h, a, t) {
          c[t]=c[t]||function() { (c[t].q=c[t].q||[]).push(arguments); };
          c[t].license = 9931455;
          c[t].d=+new Date;
          const j:any = h.createElement(a); j.type = 'text/javascript'; j.async = true;
          j.src = 'https://cdn.chatio-static.com/widget/init/script.' + c[t].license + '.js';
          const s = h.getElementsByTagName(a)[0]; s.parentNode.insertBefore(j, s);
        })(window, document, 'script', '__chatio');
      }
    }

    setInside(e) {
      const self = this;
      // this.inside = this.route.firstChild.data.value.inside;
      // this.inside = this.route.snapshot.firstChild.data.inside;
      this.inside = e.urlAfterRedirects !== "/";
      if (this.inside) {
        self.insideDone = false;
        if(this.localstorageService.isBrowser) {
          document.getElementById('above').style.overflow = 'visible';
        }
      } else {
           self.insideDone = true;
      }
    }

    editToggle(e) {
      this.mode.edit = e.target.checked;
      this.bcAuthService.setMode(this.mode);
    }

    devToggle(e) {
      this.mode.dev = e.target.checked;
      this.bcAuthService.setMode(this.mode);
    }


    // ngAfterViewInit(): void {
    //   try {
    //     document.querySelector('#' + this.fragment).scrollIntoView();
    //   } catch (e) { }
    // }


  }

















