import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Toast } from '@ionic-native/toast';
import { DatabaseProvider } from "../../providers/database/database";
import { ModalController } from 'ionic-angular';
import { IconsPage } from '../icons/icons';
@Component({
  selector: 'page-addcategory',
  templateUrl: 'addcategory.html',
})
export class AddcategoryPage {

  icon: string;
  categoryForm: FormGroup;


  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private dbService: DatabaseProvider,
              public modalCtrl: ModalController,
              public toast: Toast) {

    this.categoryForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
      ]),
      typename: new FormControl(null, [
        Validators.required,
      ]),
      type: new FormControl(null, []),
      icon: new FormControl(null, [Validators.required,]),
      iconname: new FormControl(null, []),
  });

  }


  typeSelected(value){
    
    console.log("---- Type ----"+value)
     if(value == "income"){
      this.categoryForm.patchValue({ type: 0});
    }
    else if(value == "expense"){
      this.categoryForm.patchValue({ type: 1});
    }
    else{ }
  }


  saveData(){
    this.dbService.putdata('INSERT INTO category VALUES(NULL,?,?,?)',[this.categoryForm.get('type').value, this.categoryForm.get('name').value, this.categoryForm.get('iconname').value])
    .then(res => {
      console.log(res.insertId);
      this.toast.show('Data saved', '5000', 'center').subscribe(
        toast => {
          this.viewCtrl.dismiss({"foo" : "bar"});
        }
      );
    })
    .catch(e => {
      console.log(e);
    });
  }


 
  openIcon(){
    const modal = this.modalCtrl.create(IconsPage,undefined,{ cssClass: "modalscreenicon" });
    modal.onDidDismiss(data => {
      this.categoryForm.patchValue({icon: data.name,iconname: data.icon})
  });
    modal.present();
}

}
