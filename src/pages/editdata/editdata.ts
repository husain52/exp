import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { DatePicker } from '@ionic-native/date-picker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AppModule } from '../../app/app.module';
import { NotificationsService } from 'angular2-notifications'

@Component({
  selector: 'page-editdata',
  templateUrl: 'editdata.html',
})
export class EditdataPage {

  rowid: any;
  selectedType: any = '';
  category: Array<{id: any,type: any,name: any}> = [];
  copyCategory: Array<{id: any,type: any,name: any}> = [];

  updateExpenseForm: FormGroup;
  data = { rowid: 0, date: "", type: "", category: "", amount: 0, description: "" };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private datePicker: DatePicker,
              public _notifications: NotificationsService,
              private dbService: DatabaseProvider) {
                this.initializeForm();
  }



  ionViewDidLoad() {

    let rowid = this.navParams.get("rowid");
    this.rowid = this.navParams.get("rowid");
    let query = "select * from expense where rowid= "+rowid;
    this.dbService.getdata(query).then(res=>{
      for(var i=0; i<res.rows.length; i++) {
        this.data.rowid = res.rows.item(i).rowid;
        this.data.date = res.rows.item(i).date;
        this.data.type = res.rows.item(i).type;
        this.data.category = res.rows.item(i).category;
        this.data.amount = res.rows.item(i).amount;
        this.data.description = res.rows.item(i).description;
      }
      this.typeSelected(this.data.type);
      this.updateExpenseForm.setValue({date: this.data.date,type: this.data.type,category: this.data.category,
                                       amount: this.data.amount,description: this.data.description});

    }).then(err=>{

    });

    this.getCategory();
  }

  initializeForm(){

    this.updateExpenseForm = new FormGroup({

      date: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, [
        Validators.required,
      ]),
      category: new FormControl(null,[
        Validators.required,
      ]),
      amount: new FormControl(null, [
        Validators.required,
      ]),
      description: new FormControl(null,[
        Validators.required,
      ]),
  });

  }


  async getCategory(){
    this.category.length = 0;
    let promise = new Promise((resolve,reject)=>{

      this.dbService.getdata('select * from category').then(res=>{
        for(var i=0; i<res.rows.length; i++) {
          this.category.push({ id: res.rows.item(i).rowid,type: res.rows.item(i).type,
                               name: res.rows.item(i).name});
        }
        resolve('done');
      }).catch(e=>{reject('Error');console.log(e);});
    });

    let result = await promise;
    this.typeSelected(this.selectedType);
  }

  typeSelected(value){
    this.selectedType = value;
    if(value == "0"){
   //  this.updateExpenseForm.patchValue({amount: this.lunch});
   this.copyCategory = this.category.filter(x => {
     if(x.type == 0) {
       return true;
     } else {
       return false;
     }
   });
   }
   else if(value == "1"){
     //this.updateExpenseForm.patchValue({amount: this.dinner});
     this.copyCategory = this.category.filter(x => {
       if(x.type == 1) {
         return true;
       } else {
         return false;
       }
     });
   }
   else{

   }
 }

 categorySelected(value){

}

 selectdate(){
  this.datePicker.show({
    date: new Date(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
  }).then(
    date => {
            let format = moment(date).format("YYYY-MM-DD");
            this.updateExpenseForm.patchValue({date: format})},
    err => console.log('Error occurred while getting date: ', err)
  );
}

updateData(){

  let amount;

    if(this.updateExpenseForm.get('type').value == 0){
      amount = this.updateExpenseForm.get('amount').value;
     }
     else if(this.updateExpenseForm.get('type').value == 1){
      amount = -this.updateExpenseForm.get('amount').value;
     }

  let query = 'UPDATE expense SET date=?,type=?,category=?,amount=?,description=?,debtid=? WHERE rowid=?';
   this.dbService.putdata(query,[ this.updateExpenseForm.get('date').value, this.updateExpenseForm.get('type').value,
                                  this.updateExpenseForm.get('category').value, amount,
                                  this.updateExpenseForm.get('description').value, 0, this.rowid]).then(res=>{

                                    this._notifications.success('Success', "Record Updated", {
                                      timeOut: 1000,
                                      showProgressBar: true,
                                      pauseOnHover: true,
                                      clickToClose: true,
                                      clickIconToClose: true
                                    });
                                    this.navCtrl.pop();


                                  });

}



}
