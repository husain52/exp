import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePicker } from "@ionic-native/date-picker";
import { Toast } from "@ionic-native/toast";
import { DatabaseProvider } from "../../providers/database/database";
import { NotificationsService } from "angular2-notifications";
import { LocalNotifications } from "@ionic-native/local-notifications";
import * as moment from "moment";


@Component({
  selector: 'page-editdue',
  templateUrl: 'editdue.html',
})

export class EditduePage {

  rowid;
  updateDebtForm: FormGroup;
  date: any;
  data = { rowid: 0, date: "", type: "", category: "", amount: 0, details: "", duedate: "" };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    private viewCtrl: ViewController,
    public _notifications: NotificationsService,
    private toast: Toast,
    private dbService: DatabaseProvider,
    private localNotification: LocalNotifications
  ) {
    this.initializeForm();
  }

  ionViewDidLoad() {

    let rowid = this.navParams.get("rowid");
    this.rowid = this.navParams.get("rowid");
    let query = "select * from debt where rowid= "+rowid;
    console.log("====== Result ===1=====",rowid)
    this.dbService.getdata(query).then(res=>{

      for(var i=0; i<res.rows.length; i++) {
        console.log("====== Result ===2=====",res.rows.item(i).rowid)
        this.data.rowid = res.rows.item(i).rowid;
        this.data.date = res.rows.item(i).date;
        this.data.type = res.rows.item(i).type;
        this.data.category = res.rows.item(i).category;
        this.data.amount = res.rows.item(i).amount;
        this.data.details = res.rows.item(i).details;
        this.data.duedate = res.rows.item(i).duedate;
      }
      this.typeSelected(this.data.type);
      this.updateDebtForm.setValue({date: this.data.date,type: this.data.type,category: this.data.category,
                                       amount: this.data.amount,details: this.data.details,duedate: this.data.duedate});

    }).catch(err=>{
     console.log("=== Error -----------",err)
    });
  }

  initializeForm() {
    this.updateDebtForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),
      duedate: new FormControl(null, [Validators.required])
    });
  }

  selectdate(type) {
    this.datePicker
      .show({
        date: new Date(),
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
      })
      .then(
        date => {
          let format = moment(date).format("YYYY-MM-DD");
          if (type == 0) {
            this.updateDebtForm.patchValue({ date: format });
          } else if (type == 1) {
            this.date = date;
            this.updateDebtForm.patchValue({ duedate: format });
          } else {
          }
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }



  typeSelected(value) {
    if (value == "0") {
      this.updateDebtForm.patchValue({type: 0,category: 1});
    } else if (value == "1") {
      this.updateDebtForm.patchValue({type: 1,category: 2});
    } else {
    }
  }

  // updateData() {



  //   this.dbService.putdata("INSERT INTO debt VALUES(NULL,?,?,?,?,?,?,?)", [
  //       this.updateDebtForm.get("date").value,
  //       this.updateDebtForm.get("type").value,
  //       this.updateDebtForm.get("category").value,
  //       amount,
  //       this.updateDebtForm.get("details").value,
  //       this.updateDebtForm.get("duedate"),
  //       0
  //     ])
  //     .then(res => {

  //         this.dbService
  //           .putdata("INSERT INTO expense VALUES(NULL,?,?,?,?,?)", [
  //             this.updateDebtForm.get("date").value,
  //             this.updateDebtForm.get("type").value,
  //             this.updateDebtForm.get("category").value,
  //             amount,
  //             this.updateDebtForm.get("details").value
  //           ])
  //           .then(res => {
  //             this.initializeForm();
  //             const id = Date.now();

  //             this.localNotification.schedule({
  //               id: id,
  //               title: "Due Reminder",
  //               text: this.updateDebtForm.get("details").value,
  //               data: { mydata: "My hidden message this is" },

  //               trigger: { at: new Date(this.date) }
  //             });

  //             this._notifications.success("Success", "Data Inserted", {
  //               timeOut: 2500,
  //               showProgressBar: true,
  //               pauseOnHover: true,
  //               clickToClose: true,
  //               clickIconToClose: true
  //             });
  //           })
  //           .catch(e => {
  //             console.log(e);
  //             this.toast.show(e, "5000", "center").subscribe(toast => {
  //               console.log(toast);
  //             });
  //           });


  //       this.toast.show("Data saved", "2000", "center").subscribe(toast => {
  //         this.viewCtrl.dismiss({ foo: "bar" });
  //       });
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }


  updateData(){
    let amount;

    if(this.updateDebtForm.get('type').value == 0){
      amount = this.updateDebtForm.get('amount').value;
    }
    else if(this.updateDebtForm.get('type').value == 1){
      amount = -this.updateDebtForm.get('amount').value;
    }

    let query = 'UPDATE debt SET date=?,type=?,category=?,amount=?,details=?,duedate =?,flag =? WHERE rowid=?';
    this.dbService.putdata(query,[ this.updateDebtForm.get('date').value, this.updateDebtForm.get('type').value,
                                    this.updateDebtForm.get('category').value, amount,
                                    this.updateDebtForm.get('details').value, this.updateDebtForm.get("duedate"),
                                    0, this.rowid]).then(res=>{

    let query = 'UPDATE expense SET date=?,type=?,category=?,amount=?,description=?,debtid=? WHERE debtid=?';
    this.dbService.putdata(query,[ this.updateDebtForm.get('date').value, this.updateDebtForm.get('type').value,
                                   this.updateDebtForm.get('category').value, amount,
                                   this.updateDebtForm.get('details').value, this.rowid, this.rowid]).then(res=>{

                                 this._notifications.success('Success', "Record Updated", {
                                      timeOut: 1000,showProgressBar: true,
                                      pauseOnHover: true,clickToClose: true,
                                      clickIconToClose: true});
                                this.navCtrl.pop(); });
         });
  }



}
