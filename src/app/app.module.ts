import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// 3rd party vendors
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { SlickModule } from 'ngx-slick';
import * as $ from 'jquery';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgSelectModule } from '@ng-select/ng-select';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import {NgxWigModule} from 'ngx-wig';

import {
	// app_components
	AppComponent,
	HomeComponent,
	HomeBottomComponent,
	HeadComponent,
	CarouselComponent,
	NavComponent,
	MiniCartComponent,
	MiniSearchComponent,
	MiniUserComponent,
	NavigationComponent,
	ChildNavComponent,

	// layouts
	LayoutTabsComponent,
	Layout2upComponent,
	LayoutPulseComponent,

	// catalog
	AddComponent,
	BuilderComponent,
	ProductGridToolbarComponent,
	CategoryComponent,
	GridComponent,
	CartQtyComponent,
	ImageComponent,
	SingleComponent,
	AddtocartComponent,
	OptionsComponent,
	CategoryAsideComponent,
	BreadcrumbsComponent,
	CardComponent,
	RelatedComponent,
	ConfiguratorComponent,
	SavedListComponent,
	SaveConfigComponent,
	ConfigSummaryComponent,
	BuilderOptionsComponent,

	// services
	BcProductService,
	BcAuthService,
	BcCartService,
	FirebaseProductsService,
	ConfigsService,
	ActivityService,
	AssetService,

	// ultils
	FilterPipe,
	ArraySortPipe,
	ContextmenuComponent,
	IsvisiblePipe,
	StripHtmlPipe,
	PluralPipe, SinglePipe,
	FaComponent,
	FieldComponent,
	CheckboxComponent
} from '.';


import { ModalComponent } from './utils/modal/modal.component';
import { OptionDetailsComponent } from './catalog/single/configurator/builder-options/option-details/option-details.component';
import { MiniNoticeComponent } from './app_components/navigation/mini/mini-notice/mini-notice.component';
import { MobileNavComponent } from './app_components/navigation/mobile-nav/mobile-nav.component';
import { CartComponent } from './cart/cart.component';
import { AdminProductConfigComponent } from './catalog/single/configurator/admin-product-config/admin-product-config.component';
import { JsonViewerComponent } from './utils/json-viewer/json-viewer.component';
import { ConfigItemizedComponent } from './app_components/navigation/mini/mini-cart/config-itemized/config-itemized.component';
import { ConfigWizardComponent } from './catalog/config-wizard/config-wizard.component';
import { ChooseServerComponent } from './catalog/config-wizard/choose-server/choose-server.component';
import { OptionAnchorsComponent } from './catalog/single/configurator/option-anchors/option-anchors.component';
import { LayoutDarkComponent } from './layouts/layout-dark/layout-dark.component';
import { NumberFieldComponent } from './utils/number-field/number-field.component';
import { DetailsPopoutComponent } from './catalog/single/configurator/details-popout/details-popout.component';
import { SupportComponent } from './support/support.component';
import { FaqsComponent } from './faqs/faqs.component';
import { FaqTemplateComponent } from './faqs/faq-template/faq-template.component';
import { PagesComponent } from './pages/pages.component';
import { ContactComponent } from './contact/contact.component';
import { CouponComponent } from './cart/coupon/coupon.component';
import { EstimateComponent } from './cart/estimate/estimate.component';
import { AdminComponent } from './admin/admin.component';
import { AdminBuildsComponent } from './admin/admin-builds/admin-builds.component';
import { AdminInboxComponent } from './admin/admin-inbox/admin-inbox.component';
import { AdminItemizedComponent } from './admin/admin-itemized/admin-itemized.component';
import { FooterComponent } from './app_components/footer/footer.component';
import { MobileHeaderComponent } from './app_components/mobile-header/mobile-header.component';
import { LinksAccountComponent } from './app_components/links-account/links-account.component';
import { LinksCategoryComponent } from './app_components/links-category/links-category.component';
import { NoRoute4Component } from './no-route4/no-route4.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContextmenuComponent,
    HeadComponent,
    CheckboxComponent,
    MiniCartComponent,
	MiniSearchComponent,
	MiniUserComponent,
    CarouselComponent,
    ChildNavComponent,
    NavComponent,
    FilterPipe,
    ArraySortPipe,
	IsvisiblePipe,
	StripHtmlPipe,
	HomeBottomComponent,
	PluralPipe,
	SinglePipe,
	NavigationComponent,
	FaComponent,
	FieldComponent,
	LayoutTabsComponent,
	Layout2upComponent,
	LayoutPulseComponent,
	AddComponent,
	BuilderComponent,
	ProductGridToolbarComponent,
	CategoryComponent,
	GridComponent,
	CartQtyComponent,
	ImageComponent,
	SingleComponent,
	AddtocartComponent,
	OptionsComponent,
	CategoryAsideComponent,
	BreadcrumbsComponent,
	CardComponent,
	RelatedComponent,
	ConfiguratorComponent,
	BuilderOptionsComponent,
	ConfigSummaryComponent,
	SaveConfigComponent,
	SavedListComponent,
	ModalComponent,
	OptionDetailsComponent,
	MiniNoticeComponent,
	MobileNavComponent,
	CartComponent,
	AdminProductConfigComponent,
	JsonViewerComponent,
	ConfigItemizedComponent,
	ConfigWizardComponent,
	ChooseServerComponent,
	OptionAnchorsComponent,
	LayoutDarkComponent,
	NumberFieldComponent,
	DetailsPopoutComponent,
	SupportComponent,
	FaqsComponent,
	FaqTemplateComponent,
	PagesComponent,
	ContactComponent,
	CouponComponent,
	EstimateComponent,
	AdminComponent,
	AdminBuildsComponent,
	AdminInboxComponent,
	AdminItemizedComponent,
	FooterComponent,
	MobileHeaderComponent,
	LinksAccountComponent,
	LinksCategoryComponent,
	NoRoute4Component,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'fornida-ng6'}),
	SnotifyModule,
	FormsModule,
	ReactiveFormsModule,
	SlickModule.forRoot(),
    AppRoutingModule,
    NgxWigModule,
    HttpClientModule,
    NgSelectModule,
    // Ng2SmartTableModule,
    // AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
	{ provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    AngularFirestore,
    HttpClientModule,
    BcProductService,
    BcAuthService,
    ConfigsService,
    ActivityService,
    AssetService,
    BcCartService,
    FirebaseProductsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
