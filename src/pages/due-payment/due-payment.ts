import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  ItemSliding,
  AlertController
} from "ionic-angular";
import { AddDebtPage } from "../add-debt/add-debt";
import { DatabaseProvider } from "../../providers/database/database";
import { EditduePage } from "../editdue/editdue";

@Component({
  selector: "page-due-payment",
  templateUrl: "due-payment.html"
})
export class DuePaymentPage {

  type: any = 0;
  typeFlag: boolean = false;
  segmentType: any = "remaining";
  debtRecord: Array<{
    id: any;
    date: any;
    type: any;
    typename: any;
    amount: any;
    details: any;
    duedate: any;
    icon: any;
    flag: any;
  }> = [];

  temp: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private dbService: DatabaseProvider,
    public modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.getAllTransaction();
  }

  getAllTransaction() {
    this.debtRecord.length = 0;
    this.temp.length = 0;
    let query =
      "select db.date,db.type,db.amount,db.details,db.flag,ct.name,ct.icon from debt db,category ct where db.category = ct.rowid";

    this.dbService
      .getdata(query)
      .then(res => {

        for (var i = 0; i < res.rows.length; i++) {
          let typename;
          if (res.rows.item(i).type === 0) {
            typename = "Credit";
          } else if (res.rows.item(i).type === 1) {
            typename = "Debit";
          } else {
          }

          this.temp.push({
            id: res.rows.item(i).rowid,
            date: res.rows.item(i).date,
            type: res.rows.item(i).type,
            typename: typename,
            amount: res.rows.item(i).amount,
            details: res.rows.item(i).details,

            icon: res.rows.item(i).icon,
            flag: res.rows.item(i).flag
          });

        }
        this.typeSelected(0);
      })
      .catch(e => {
        console.log(e);
      });
  }

  addRecord() {
    const modal = this.modalCtrl.create(AddDebtPage, undefined, {
      cssClass: "modal-adddebt"
    });
    modal.onDidDismiss(data => {
      this.getAllTransaction();
    });
    modal.present();
  }

  typeSelected(value) {
    if (value === 0) {
      this.type = 0;
      this.typeFlag = false;
      const temp =this.temp.filter(x=> x.flag === 0);
      this.debtRecord = temp;
    } else if (value === 1) {
      this.type = 1;
      this.typeFlag = true;
      const temp =this.temp.filter(x=> x.flag === 1);
      this.debtRecord = temp;
    } else {
    }
  }

  deleteData(rowid, id, slidingItem: ItemSliding) {
    let alert = this.alertCtrl.create({
      title: "Confirm",
      message: "Are you sure you want to complete this transaction ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: "Complete",
          handler: () => {
            slidingItem.close();
          let query = 'UPDATE debt SET flag = ? WHERE  rowid= ?';
            this.dbService.putdata(query,[1, rowid]).then(res => {
              let tempid = this.temp.indexOf(this.debtRecord[id]);
              this.temp[tempid].flag = 1;
              this.typeSelected(this.type);
              }).catch(e => console.log("----- Error ------",e));
          }
        }
      ]
    });
    alert.present();
  }

  editData(rowid, slidingItem: ItemSliding) {
    slidingItem.close();
    this.navCtrl.push(EditduePage, {
      rowid: rowid
    });
  }
}
