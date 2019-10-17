import { Component } from '@angular/core';
import { NavController, NavParams, ItemSliding, AlertController, PopoverController  } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { PopoverPage } from "../popover/popover";
import { EditdataPage } from '../editdata/editdata';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {


  year: any;
  expenses: any = [];
  iconname: any;


  title: any;
  categoryId: any;
  month: any;

  constructor( public navCtrl: NavController, public navParams: NavParams,
               public popoverCtrl: PopoverController,
               private dbService: DatabaseProvider,private alrtCtrl: AlertController) {

                this.title = this.navParams.get('name');
                this.categoryId = this.navParams.get('categoryId');
                this.month = this.navParams.get('month');
                this.year = this.navParams.get('year');


  }

  ionViewWillEnter() {

    this.getRecords();
  }


  getRecords(){
    this.expenses.length = 0;
    let query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and ex.category= "+this.categoryId+" and strftime('%m',date) = '"+this.month+"' and strftime('%Y',date)= '"+this.year+"'";
    this.dbService.getdata(query).then(result=>{

      for(var i=0; i<result.rows.length; i++){

        console.log(JSON.stringify(result.rows.item(i)))
        let incexp;
        if(result.rows.item(i).type == 0){
          incexp = "Income";
        }
        else if(result.rows.item(i).type == 1){
          incexp = "Expense";
        }
       this.expenses.push({rowid: result.rows.item(i).rowid,date: result.rows.item(i).date,
                           type: result.rows.item(i).type,typename: incexp,category: result.rows.item(i).category,
                           amount: result.rows.item(i).amount,description: result.rows.item(i).description,
                           categoryname: result.rows.item(i).name,icon: result.rows.item(i).icon});
             }

    }).catch(err=>{console.log("-- Error in openCategoryWise --"+err)});
  }


  deleteData(rowid, slidingItem: ItemSliding) {

    let alert = this.alrtCtrl.create({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this record ?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
          handler: () => {
            slidingItem.close();
            console.log('Cancel clicked');
          }
        },
        {
          text: "Delete",
          handler: () => {
            console.log('logout clicked');
            slidingItem.close();

              this.dbService.deletedata('DELETE FROM expense WHERE rowid=?', [rowid])
                .then(res => {
                         this.getRecords();   }).catch(err=>{console.log(err)})
          }
        }
      ]
    });
    alert.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage,{category: this.categoryId,month: this.month});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      this.getRecords();
    });
  }

  editData(rowid, slidingItem: ItemSliding) {

    slidingItem.close();
    this.navCtrl.push(EditdataPage, {
      "rowid": rowid
    });
  }

}
