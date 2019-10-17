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
  selector: "page-add-debt",
  templateUrl: "add-debt.html"
})
export class AddDebtPage {
  debtForm: FormGroup;
  date: any;

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

  ionViewDidLoad() {}

  initializeForm() {
    this.debtForm = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required])
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
            this.debtForm.patchValue({ date: format });
          } else if (type == 1) {
            this.date = date;
            this.debtForm.patchValue({ duedate: format });
          } else {
          }
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }


  typeSelected(value) {
    if (value == "0") {
      this.debtForm.patchValue({type: 0,category: 1});
    } else if (value == "1") {
      this.debtForm.patchValue({type: 1,category: 2});
    } else {
    }
  }

  saveData() {

    let amount;

    if(this.debtForm.get('type').value == 0){
      amount = this.debtForm.get('amount').value;
     }
     else if(this.debtForm.get('type').value == 1){
      amount = -this.debtForm.get('amount').value;
     }

    this.dbService.putdata("INSERT INTO debt VALUES(NULL,?,?,?,?,?,?)", [
        this.debtForm.get("date").value,
        this.debtForm.get("type").value,
        this.debtForm.get("category").value,
        amount,
        this.debtForm.get("details").value,
        0
      ])
      .then(res => {
        this.dbService.putdata("INSERT INTO expense VALUES(NULL,?,?,?,?,?,?)", [
              this.debtForm.get("date").value,
              this.debtForm.get("type").value,
              this.debtForm.get("category").value,
              amount,
              this.debtForm.get("details").value,
              res.insertId
            ])
            .then(res => {
              this.initializeForm();
              // const id = Date.now();
              // this.localNotification.schedule({
              //   id: id,
              //   title: "Due Reminder",
              //   text: this.debtForm.get("details").value,
              //   data: { mydata: "My hidden message this is" },

              //   trigger: { at: new Date(this.date) }
              // });

              this._notifications.success("Success", "Data Inserted", {
                timeOut: 2500,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
                clickIconToClose: true
              });
            })
            .catch(e => {
              console.log(e);
              this.toast.show(e, "5000", "center").subscribe(toast => {
                console.log(toast);
              });
            });


        this.toast.show("Data saved", "2000", "center").subscribe(toast => {
          this.viewCtrl.dismiss({ foo: "bar" });
        });
      })
      .catch(e => {
        console.log(e);
      });
  }
}
