import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './catalog/category/category.component';
import { SingleComponent } from './catalog/single/single.component';
import { BuilderComponent } from './catalog/builder/builder.component';
import { CartComponent } from './cart/cart.component';
import { ConfigWizardComponent } from './catalog/config-wizard/config-wizard.component';
import { SupportComponent } from './support/support.component';
import { FaqTemplateComponent } from './faqs/faq-template/faq-template.component';
import { PagesComponent } from './pages/pages.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';
import { NoRoute4Component } from './no-route4/no-route4.component';

const appRoutes: Routes = [
  {
  	path: '',
  	component: HomeComponent,
  	data: { inside: false }
  }, {
    path: 'category/:collection/:child',
    component: CategoryComponent,
    data: { inside: true }
    // children: [{path: ':child', component: CategoryComponent} ]
  }, {
  	path: 'product/:id',
  	component: SingleComponent,
  	data: { inside: true }
  }, {
    path: 'configure',
    component: BuilderComponent,
    data: { inside: true }
  }, {
    path: 'cart',
    component: CartComponent,
    data: { inside: true }
  }, {
    path: 'configurable',
    component: ConfigWizardComponent,
    data: { inside: true }
  }, {
    path: 'support',
    component: SupportComponent,
    data: { inside: true }
  }, {
    path: 'faqs',
    component: FaqTemplateComponent,
    data: { inside: true }
  }, {
    path: 'page/:page',
    component: PagesComponent,
    data: { inside: true }
  }, {
    path: 'contact',
    component: ContactComponent,
    data: { inside: true }
  }, {
  	path: 'admin',
  	component: AdminComponent,
  	data: { inside: true }
  }, {
  	path: '404',
    component: NoRoute4Component,
  	data: { inside: true }
  }, {
  	path: '**',
    component: NoRoute4Component,
  	data: { inside: true }
  }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
