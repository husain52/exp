import { Component, ViewChild, ElementRef, Renderer, OnInit, ViewContainerRef } from '@angular/core';
import { NavController, NavParams, Platform, Content, ItemSliding, AlertController, ViewController, Refresher } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";

import { Chart } from 'chart.js';
import { EditdataPage } from "../editdata/editdata";

import { NgZone  } from '@angular/core';
import { Events } from 'ionic-angular';

import { ShrinkingSegmentHeader } from "../../components/shrinking-segment-header/shrinking-segment-header";

@Component({
  providers: [ShrinkingSegmentHeader],
  selector: 'page-summary',
  templateUrl: 'summary.html'
})


export class SummaryPage implements OnInit{
  @ViewChild("head", {read: ViewContainerRef}) headRef: ViewContainerRef;
  @ViewChild("myContent", {read: ViewContainerRef}) contentRef: ViewContainerRef;

  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;

  @ViewChild(Content) content: Content;
  @ViewChild('head') head: Content;
  @ViewChild('myDiv') myButton;
  public doughnutChartLabels: Array<any> = [];
  public doughnutChartData: Array<number> = [];
  public doughnutChartType: string = 'doughnut';

  public barChartData: any[] = [
    { data: [], label: 'Series A' }
  ];

  types: any;
  segmentType: any;

  expenses: Array<{
    rowid: any,
    date: any,
    type: any,
    typename: any,
    category: any,
    amount: any,
    description: any,
    categoryname: any,
    icon: any
  }> = [];
  filterexpenses: Array<{}> = [];
  month: any;
  year: any;


  constructor(private renderer: Renderer, private elementRef: ElementRef,
              private dbService: DatabaseProvider,
              private platform:Platform,
              private alertCtrl: AlertController,
              private viewCtrl: ViewController,
              public navCtrl: NavController, public navParams: NavParams,
              public events: Events) {

    this.types = 2;
    this.segmentType = 'all';
    this.month = this.navParams.get('month');
    this.year = this.navParams.get('year');
     }

  ionViewDidLoad(){

  }

  ionViewWillEnter() {
    console.log("------ IonView Will Enter -------");

    this.typeSelected(this.types);


    //this.viewCtrl._didEnter()
    //this.content.resize();

    //this.renderer.setElementStyle(this.other.nativeElement, 'margin-top', '250px');

  }



  ionViewDidEnter(){

  }


  ngOnInit(){
    if (this.platform.is('mobileweb') && this.platform.is('ios')) {
      this.content.enableJsScroll()
    }
  }

  triggerFalseClick() {
    let el: HTMLElement = this.myButton.nativeElement as HTMLElement;
    el.click();
  }


  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  typeSelected(value) {

    this.types = value;
    this.barChartData[0].data.length = 0;
    this.doughnutChartLabels.length =0;
    this.expenses.length = 0;
    let query;
    let query1;
    if(value>1){
       //query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = '"+this.month+"'";
       //query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = '"+this.month+"' group by ex.category";
       query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = '"+this.month+"' and strftime(\'%Y\',date)= '"+this.year+"'";
       query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and strftime('%m',date) = '"+this.month+"' and strftime(\'%Y\',date)= '"+this.year+"' group by ex.category";
      }else{
      //query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and ex.type= "+value+" and strftime('%m',date) = '"+this.month+"'";
      //query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and ex.type= "+value+" and strftime('%m',date) = '"+this.month+"' group by ex.category";
       query = "select ex.rowid,ex.date,ex.type,ex.category,ex.amount,ex.description,ct.name,ct.icon from expense ex,category ct where ex.category = ct.rowid and ex.type= "+value+" and strftime('%m',date) = '"+this.month+"' and strftime(\'%Y\',date)= '"+this.year+"'";
       query1 = "select ex.category,sum(ex.amount) amount,max(ct.name) name from expense ex,category ct where ex.category = ct.rowid and ex.type= "+value+" and strftime('%m',date) = '"+this.month+"' and strftime(\'%Y\',date)= '"+this.year+"' group by ex.category";
    }


    this.dbService.getdata(query).then(res=>{

      this.dbService.getdata(query1).then(res1=>{

        console.log(JSON.stringify(res1.rows));
        if(res1.rows.length > 0){
          for(var i=0;i<res1.rows.length; i++){
            this.doughnutChartLabels.push(res1.rows.item(i).name);
            this.barChartData[0].data.push(res1.rows.item(i).amount);
           }
           this.doughnutChart.update();
        }
        else{
             this.doughnutChart.clear();
        }

        for(var i=0; i<res.rows.length; i++){
          let incexp;
          if(res.rows.item(i).type == 0){
            incexp = "Income";
          }
          else if(res.rows.item(i).type == 1){
            incexp = "Expense";
          }
         this.expenses.push({rowid:res.rows.item(i).rowid,date:res.rows.item(i).date,
                             type:res.rows.item(i).type,typename: incexp,category:res.rows.item(i).category,
                             amount:res.rows.item(i).amount,description: res.rows.item(i).description,
                             categoryname: res.rows.item(i).name,icon:res.rows.item(i).icon});

         }

      })

    }).catch(err=>{console.log("-- Error in openCategoryWise --"+err)})
  }


  ngAfterViewInit() {
    this.doughnutChart = this.getDoughnutChart();
    console.log("---View INit --")
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      data,
      options,
      type: chartType,
    });
  }

  getDoughnutChart() {
  const data = {
    labels: this.doughnutChartLabels,
    datasets: [{
      label: '# of Votes',
      data: this.barChartData[0].data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 87, 34, 0.7)',
        'rgba(121, 85, 72, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(96, 125, 139, 0.7)',
        'rgba(255, 234, 0, 0.7)',
        'rgba(213, 0, 0, 0.7)',
        'rgba(0, 77, 64, 0.7)'
      ],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5722', '#5d4037', '#9966ff', '#607d8b', '#ffea00', '#d50000', '#004d40' ]
    }]
  };

  return this.getChart(this.doughnutCanvas.nativeElement, 'doughnut', data);
  }

  deleteData(rowid, id ,slidingItem: ItemSliding) {

   let alert = this.alertCtrl.create({
     title: "Confirm Delete",
     message: "Are you sure you want to delete this record ?",
     buttons: [
      {
        text: "Cancel",
        role: 'cancel',
        handler: () => {
          slidingItem.close();

        }
      },
      {
        text: "Delete",
        handler: () => {

          slidingItem.close();

            this.dbService.deletedata('DELETE FROM expense WHERE rowid=?', [rowid])
              .then(res => {

                this.expenses.splice(id,1);
                this.typeSelected(this.types);
                  this.viewCtrl._didEnter()
                  this.content.resize();
              })
              .catch(e => console.log(e));

        }
      }
    ]
  });
  alert.present();
  }

  editData(rowid, slidingItem: ItemSliding) {

  slidingItem.close();
  this.navCtrl.push(EditdataPage, {
    "rowid": rowid
  });
  }



}



