import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AddcategoryPage } from "../addcategory/addcategory"
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  category: Array<{id: any,type: any,typename: any,name: any,icon: any}> = [];

  constructor(public navCtrl: NavController,
              private dbService: DatabaseProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.category.length = 0;

      this.dbService.getdata('select * from category').then(res=>{
        for(var i=0; i<res.rows.length; i++) {

          let typename;
          if(res.rows.item(i).type == 0){
            typename = "Income";
          }
          else if(res.rows.item(i).type == 1){
            typename = "Expense";
          }
          else{

          }
          this.category.push({ id: res.rows.item(i).rowid,type: res.rows.item(i).type,
                               typename: typename, name: res.rows.item(i).name,
                               icon: res.rows.item(i).icon});
        }
      }).catch(e=>{console.log(e);})

  }

  ionViewWillEnter(){

  }



  deleteCategory(rowid){

      let alert = this.alertCtrl.create({
        title: "Confirm Delete",
        message: "All transaction related to this category will be deleted !",
        buttons: [
          {
            text: "Cancel",
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: "Delete",
            handler: () => {
              console.log('logout clicked');


                this.dbService.deletedata('DELETE FROM category WHERE rowid=?', [rowid])
                  .then(res => {

                    this.dbService.deletedata('DELETE FROM expense WHERE category=?',[rowid]).then(res1=>{
                      this.ionViewDidLoad();
                    }).catch(err=>{console.log(err)})

                  })
                  .catch(e => console.log(e));

            }
          }
        ]
      });
      alert.present();
    }



  addCategory(){
      const modal = this.modalCtrl.create(AddcategoryPage,undefined,{ cssClass: "modal-addcategory" });
      modal.onDidDismiss(data => {
        // Do things with data coming from modal, for instance :
        this.ionViewDidLoad();
    });
      modal.present();
  }

}
