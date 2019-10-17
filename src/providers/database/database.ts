import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject} from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

  db: SQLiteObject;

  constructor(private sqlite: SQLite,private storage: Storage) {

    this.sqlite.create({
      name: 'myexpensetracker.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      this.db = db;
      this.storage.get('first_time').then((val) => {
        if (val !== null) {
          console.log("-----Second time-----")
        } else {
         this.createTableExpense();
        }
     });


    }).catch(e => console.log(e));
  }

  createTableExpense(){
    this.db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date DATETIME, type INT, category INT, amount INT, description TEXT default "NoDescription", debtid INT)', [])
    .then(res => {
           this.createTableCategory();
           this.createTableDebt();
    })
    .catch(e => console.log(JSON.stringify(e)));
  }
  createTableCategory(){
    this.db.executeSql('CREATE TABLE IF NOT EXISTS category(rowid INTEGER PRIMARY KEY, type INT, name TEXT, icon TEXT)', [])
    .then(res => {
      let data = [{type: 0,name: 'Credit',icon: 'md-cash'},{type: 1,name: 'Debit',icon: 'md-cash'},{type: 0,name: 'Salary',icon: 'md-cash'},{type: 1,name: 'Bill',icon: 'ios-paper'}];
      data.map(category => this.db.executeSql('INSERT INTO category VALUES(NULL,?,?,?)',[category.type, category.name, category.icon]).then(res =>{ }));
      this.storage.set('first_time', 'done');
    }).catch(e => console.log(JSON.stringify(e)));
  }
  createTableDebt(){
    // this.db.executeSql('CREATE TABLE IF NOT EXISTS debt(rowid INTEGER PRIMARY KEY, date DATETIME, type INT, category INT, amount INT, details TEXT, duedate DATETIME, flag INT)', [])
    //             .then(res=>{})
    //             .catch(e =>{});
  this.db.executeSql('CREATE TABLE IF NOT EXISTS debt(rowid INTEGER PRIMARY KEY, date DATETIME, type INT, category INT, amount INT, details TEXT, flag INT)', [])
     .then(res=>{})
     .catch(e =>{});
  }


  getdata(query){
   return this.db.executeSql(query,[]);
  }

  putdata(query, params){
    return this.db.executeSql(query, params);
  }

  deletedata(query,params){ return this.db.executeSql(query, params);}

}
