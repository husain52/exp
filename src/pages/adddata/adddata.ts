import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';
import { CategoryPage } from "../category/category";
import { DatabaseProvider } from "../../providers/database/database";
import * as moment from 'moment';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'page-adddata',
  templateUrl: 'adddata.html',
})
export class AdddataPage {
  @ViewChild('input') descriptionFocus ;

  selectedType: any = '';
  expenseForm: FormGroup;
  trimdate = new Date().toISOString();

  category: Array<{id: any,type: any,name: any}> = []
  copyCategory: Array<{id: any,type: any,name: any}> = []
  lunch: number = 50;
  dinner: number = 60;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    private dbService: DatabaseProvider,
    public _notifications: NotificationsService,
    private toast: Toast) {

          this.initializeForm();
  }

  initializeForm(){
    this.expenseForm = new FormGroup({
      date: new FormControl(this.trimdate.substring(0, 10), [
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
      description: new FormControl("No Description",[
        Validators.required,
      ]),
  });
  }

  ionViewWillEnter(){
    this.getCategory();
  }

  async getCategory(){

    this.category.length = 0;
    let promise = new Promise((resolve,reject)=>{

      this.dbService.getdata('select * from category').then(res=>{
        for(var i=2; i<res.rows.length; i++) {
          this.category.push({ id: res.rows.item(i).rowid,type: res.rows.item(i).type,
                               name: res.rows.item(i).name});
        }
        resolve('done');
      }).catch(e=>{reject('Error');console.log(e);});
    });

    let result = await promise;
    this.typeSelected(this.selectedType);
  }


  saveData() {

    let amount;

    if(this.expenseForm.get('type').value == 0){
      amount = this.expenseForm.get('amount').value;
     }
     else if(this.expenseForm.get('type').value == 1){
      amount = -this.expenseForm.get('amount').value;
     }

    this.dbService.putdata('INSERT INTO expense VALUES(NULL,?,?,?,?,?,?)',
                          [ this.expenseForm.get('date').value,this.expenseForm.get('type').value,
                            this.expenseForm.get('category').value,amount,
                            this.expenseForm.get('description').value,0])
        .then(res => {

          this.initializeForm();

          this._notifications.success('Success', "Data Inserted", {
            timeOut: 1000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true,
            clickIconToClose: true
          });


        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
   }


  selectdate(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
              let format = moment(date).format("YYYY-MM-DD");
              this.expenseForm.patchValue({date: format})},
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  typeSelected(value){
     this.selectedType = value;
     if(value == "0"){
    //  this.expenseForm.patchValue({amount: this.lunch});
    this.copyCategory = this.category.filter(x => {
      if(x.type == 0) {
        return true;
      } else {
        return false;
      }
    });
    }
    else if(value == "1"){
      //this.expenseForm.patchValue({amount: this.dinner});
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

  openCategory(){
    this.navCtrl.push(CategoryPage);
  }

  resetDesc(){
     this.expenseForm.patchValue({
      description: ''
    })
  }



}
