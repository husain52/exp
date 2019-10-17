import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  category;
  month;

  constructor(private viewCtrl: ViewController, 
              public navCtrl: NavController, 
              private dbService: DatabaseProvider,
              private alrtCtrl: AlertController,
              public navParams: NavParams) {
  
  this.category = navParams.get('category');
  this.month = navParams.get('month');

  console.log("=== Category ==="+this.category+"====="+this.month)
  }

  ionViewDidLoad() {
   
  }
  close() {
    this.viewCtrl.dismiss();
  }

  deleteAll(){
    let alert = this.alrtCtrl.create({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this record ?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: () => { }
        },
        {
          text: "Delete",
          handler: () => {
            
            let query = "DELETE FROM expense WHERE category = '"+this.category+"' and strftime('%m',date) = '"+this.month+"'";
            this.dbService.getdata(query).then(res=>{

             this.viewCtrl.dismiss();
              
            }).catch(err=>{});

          }
        }
      ]
    });
    alert.present();

  }

}
