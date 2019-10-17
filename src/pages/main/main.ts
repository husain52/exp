import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from "../home/home";
import { CategoryPage } from "../category/category";
import { AdddataPage } from "../adddata/adddata";
import { DuePaymentPage } from "../due-payment/due-payment";

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  
  homeRoot = HomePage;
  categoryRoot = CategoryPage;
  addRoot = AdddataPage;
  duePayment = DuePaymentPage;


  constructor(public navCtrl: NavController) {}

}
