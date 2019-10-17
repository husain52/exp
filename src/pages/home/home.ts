import { Component,ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, Content, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AdddataPage } from '../adddata/adddata';
import { ListPage } from '../list/list';
import { SummaryPage } from "../summary/summary";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit{

  index: any;
  savings: any = '';
  @ViewChild(Content) content: Content;
  selectedYear: any = new Date().getFullYear();
  selectedType: any = 0;

  year: Array<{ year: any, amount: any, showDetails: boolean }> = [];
  month: Array<{month: any,monthname: string,total: any,year: any,icon: 'calendar',data: Array<{type: any,typename: any,category: any,name: any,amount: any,icon: any}> }> = [];
  monthIncome: Array<{month: any,monthname: string,total: any,year: any,icon: 'calendar',data: Array<{type: any,typename: any,category: any,name: any,amount: any,icon: any}> }> = [];


  constructor(private dbService: DatabaseProvider,public navCtrl: NavController,
              private platform:Platform,public navParams: NavParams,
              private storage: Storage,public loadingCtrl: LoadingController) {


  }

  ngOnInit(){
    if (this.platform.is('mobileweb') && this.platform.is('ios')) {
      this.content.enableJsScroll()
      }
   }

  ionViewWillEnter() {

    this.storage.get('first_time').then((val) => {
      if (val !== null) {
        this.getyear();
        this.getAllAmount();
      } else {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();
       setTimeout(()=>{
        this.getyear();
        this.getAllAmount();
        loading.dismiss();
       },3000)
      }
   });

  }

 async getyear(){
    this.year.length = 0;
      let promise = new Promise((resolve, reject) => {
      this.dbService.getdata('select strftime(\'%Y\',date) AS YEAR ,SUM(amount) AS TOTAL from expense group by strftime(\'%Y\',date) order by strftime(\'%Y\',date) desc').then(res => {
        for(var i=0; i<res.rows.length; i++) {
          this.year.push({year: res.rows.item(i).YEAR,amount: res.rows.item(i).TOTAL, showDetails: false});
        }
        resolve("done!")
     }).catch(err=>{reject('Error in year');  console.log("--- Error in year ---"+JSON.stringify(err))});
    });

    let result = await promise;
    this.getmonthdata(this.selectedYear);
  }

  async getmonthdata(year){

    this.month.length = 0;
    this.monthIncome.length =0;
    this.selectedYear = year;

    let promise = new Promise((resolve, reject) => {

      this.dbService.getdata('select strftime(\'%m\',date) AS MONTH ,SUM(amount) AS TOTAL from expense where strftime(\'%Y\',date)='+"'"+year+"'"+'group by strftime(\'%m\',date) order by strftime(\'%m\',date) desc')
      .then(res => {

        for(var i=0; i<res.rows.length; i++) {

        let monthname;
        if(res.rows.item(i).MONTH == '01')
        {
          monthname = 'January';
        }else if(res.rows.item(i).MONTH == '02')
        {
          monthname = 'February';
        }else if(res.rows.item(i).MONTH == '03')
        {
          monthname = 'March';
        }else if(res.rows.item(i).MONTH == '04')
        {
          monthname = 'April';
        }else if(res.rows.item(i).MONTH == '05')
        {
          monthname = 'May';
        }else if(res.rows.item(i).MONTH == '06')
        {
          monthname = 'June';
        }else if(res.rows.item(i).MONTH == '07')
        {
          monthname = 'July';
        }else if(res.rows.item(i).MONTH == '08')
        {
          monthname = 'August';
        }else if(res.rows.item(i).MONTH == '09')
        {
          monthname = 'September';
        }else if(res.rows.item(i).MONTH == '10')
        {
          monthname = 'October';
        }else if(res.rows.item(i).MONTH == '11')
        {
          monthname = 'November';
        }else if(res.rows.item(i).MONTH == '12')
        {
          monthname = 'December';
        }
        this.month.push({month: res.rows.item(i).MONTH,monthname: monthname,total: res.rows.item(i).TOTAL,year: year, icon: 'calendar',data: []});
        this.monthIncome.push({month: res.rows.item(i).MONTH,monthname: monthname,total: res.rows.item(i).TOTAL,year: year, icon: 'calendar',data: []});
      }
       resolve('done');
        }).catch(e => {reject('Error in get month'); });

     });

    let result = await promise;
    this.getDetailData(this.selectedYear);
  }

  getDetailData(year){
    let query = "select distinct year, month, type, typename, category, Max(name) name, sum(amount) amount , icon  from (select strftime('%Y', A.date) year, strftime('%m', A.date) month, A.type,case when A.type=='0' then 'Income' else 'Expense' end typename, A.category, B.name,sum(A.Amount) amount, Max(B.icon) icon from expense A, category B where A.category=B.rowid group by strftime('%Y', A.date), strftime('%m', A.date), A.type, A.category) WHERE year='"+year+"' group by year, month, category order by year, month, type,category,amount"
    this.dbService.getdata(query).then(res=>{

      for(var i=0; i<res.rows.length; i++) {
        let data = {type: res.rows.item(i).type,typename: res.rows.item(i).typename,category: res.rows.item(i).category,name: res.rows.item(i).name,amount:  res.rows.item(i).amount,icon: res.rows.item(i).icon}
        let objIndex = this.month.findIndex((obj => obj.month == res.rows.item(i).month));
        this.month[objIndex].data.push(data);
        this.toggleIncome(0,objIndex);
      }
    }).catch(err=>{console.log("Error in detail data"+JSON.stringify(err))})
  }

  getAllAmount(){
    let query = "select SUM(amount) AS TOTAL from expense";
    this.dbService.getdata(query).then(res=>{
      for(var i=0; i<res.rows.length; i++){

           this.savings = res.rows.item(i).TOTAL;
      }
    })
  }

  addData() {
    this.navCtrl.push(AdddataPage);
  }


  // ---- For Toggling between Income and Expense --------
  accordionClick(id){
      this.toggleIncome(0,id);
  }
  toggleIncome(type,id){
    this.selectedType = type;
    const filtered = this.month[id].data.filter(x => x.type == type);
    this.monthIncome[id].data = filtered;
  }
  //-----------------------------------------------------

  openCategoryWiseDetail(id,dataid){
    let month = this.monthIncome[id].month;
    let categoryId = this.monthIncome[id].data[dataid].category;
    let name = this.monthIncome[id].data[dataid].name;
    let year = this.monthIncome[id].year;
    this.navCtrl.push(ListPage,{name: name,categoryId: categoryId,month: month,year: year});
  }

  allTransaction(id){
    let month = this.monthIncome[id].month;
    let year = this.monthIncome[id].year;
    let query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = \'month\' and strftime(\'%Y\',date)= \'year\'";
    //let query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = '"+month+"' group by ex.category";
    let query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = \'month\' and strftime(\'%Y\',date)= \'year\' group by ex.category";
    this.dbService.getdata(query).then(res=>{

      this.dbService.getdata(query1).then(res1=>{
        this.navCtrl.push(SummaryPage,{result: res,result1: res1,month: month,year: year});
      })

    }).catch(err=>{console.log("-- Error in openCategoryWise --"+err)})
  }

}
