import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-icons',
  templateUrl: 'icons.html',
})
export class IconsPage {

  icons: Array<{iconName: string, names: string}> = [
    {iconName: 'md-medkit', names: 'Medkit'},{iconName: 'ios-train', names: 'Train'},
    {iconName: 'ios-shirt', names: 'Shirt'}, {iconName: 'md-school', names: 'School'},
    {iconName: 'md-restaurant',names: 'Restaurant'},{iconName: 'md-film',names: 'Film'},
    {iconName: 'ios-briefcase',names: 'Briefcase'},{iconName: 'md-bicycle',names: 'Bicycle'},
    {iconName: 'ios-basket',names: 'Basket'},{iconName: 'md-construct',names: 'Construct'},
    {iconName: 'ios-basketball',names: 'BasketBall'},{iconName: 'md-bus',names: 'Bus'},
    {iconName: 'md-car',names: 'Car'},{iconName: 'md-cafe',names: 'Cafe'},
    {iconName: 'md-cart',names: 'Cart'},{iconName: 'md-body',names: 'Body'},
    {iconName: 'md-book',names: 'Book'},{iconName: 'md-cog',names: 'Cog'},
    {iconName: 'ios-football',names: 'FootBall'},{iconName: 'ios-paper',names: 'Paper'},
    {iconName: 'md-document',names: 'Document'},{iconName: 'md-pizza',names: 'Pizza'},
    {iconName: 'md-plane',names: 'Plane'},{iconName: 'md-card',names: 'Card'},
    {iconName: 'md-cash',names: 'Cash'},{iconName: 'md-cloudy',names: 'Cloudy'},
    {iconName: 'md-moon',names: 'Moon'},{iconName: 'md-globe',names: 'Globe'},
    {iconName: 'md-pricetags',names: 'Tags'},{iconName: 'md-photos',names: 'Photos'},
    {iconName: 'md-people',names: 'People'},{iconName: 'md-notifications',names: 'Bell'},
    {iconName: 'md-musical-notes',names: 'Music'},{iconName: 'ios-mail',names: 'Mail'},
    {iconName: 'md-add-circle',names: 'Circle'},{iconName: 'md-attach',names: 'Attach'},
    {iconName: 'md-bookmark',names: 'Bookmark'},{iconName: 'md-beaker',names: 'Beaker'},
    {iconName: 'ios-bulb',names: 'Bulb'},{iconName: 'md-contact',names: 'Contact'},
    {iconName: 'md-egg',names: 'Egg'},{iconName: 'md-happy',names: 'Happy'},
    {iconName: 'md-eye',names: 'Eye'},{iconName: 'md-flame',names: 'Flame'},
    {iconName: 'md-home',names: 'Home'},{iconName: 'ios-leaf',names: 'Leaf'},
    {iconName: 'ios-ice-cream',names: 'Cone'},{iconName: 'md-locate',names: 'Locate'},
    {iconName: 'md-clipboard',names: 'Clipboard'},{iconName: 'md-wallet',names: 'Wallet'}
  ]

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IconsPage');
  }

  close(){
    this.navCtrl.pop()
  }

  slectedIcon(id){
    let icon = this.icons[id].iconName;
    let names = this.icons[id].names;
    this.viewCtrl.dismiss({icon : icon,name: names});
  }

}
