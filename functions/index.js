// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Track on totalUser
exports.countTotalUser = functions.database.ref('/employee/{userid}').onWrite(
    (change) => {
        console.log('Count user function');
      const collectionRef = change.after.ref.parent;
      const countRef = collectionRef.parent.child('stat/user/total');

      let increment;
      if (change.after.exists() && !change.before.exists()) {
        increment = 1;
      } else if (!change.after.exists() && change.before.exists()) {
        increment = -1;
      } else {
        return null;
      }
      return countRef.transaction((current) => {
        return (current || 0) + increment;
      }).then(() => {
        return console.log('Counter updated.');
      });
    });

// Track on totalUser
exports.countCreateRoleUser = functions.database.ref('/employee/{userid}').onCreate(
    (change) => {
        console.log('Count Manager function');
      const collectionRef = change.ref.parent;
      const countManagerRef = collectionRef.parent.child('stat/user/manager');
      const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
      let increment;
      console.log("Current role: "+ change.val().role);
      if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()+1);
        })
      }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()+1);
        })
      }else {
          return null;
      }
      
    });

exports.countDeleteRoleUser = functions.database.ref('/employee/{userid}').onDelete(
    (change) => {
        console.log('Count Manager function');
        const collectionRef = change.ref.parent;
        const countManagerRef = collectionRef.parent.child('stat/user/manager');
        const countEmployeeRef = collectionRef.parent.child('stat/user/employee');
        let increment;
        console.log("Current role: "+ change.val().role);
        if(change.val().role==1){
        return countManagerRef.once('value').then(function(snapshot){
            countManagerRef.set(snapshot.val()-1);
        })
        }else if(change.val().role==2){
        return countEmployeeRef.once('value').then(function(snapshot){
            countEmployeeRef.set(snapshot.val()-1);
        })
        }else {
            return null;
        }
        
    });

exports.shopTotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total revenue');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('revenue');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().price;
                    })
                })
            })
            console.log("Total: "+ total);
                countRef.set(total);
        })
        
    });

exports.shopTotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count shop total Sale');
        const collectionRef = change.after.ref.parent;
        const recordRef = collectionRef.parent;
        const countRef = collectionRef.parent.parent.child('sale');
        var total=0;
        return recordRef.on('value',function(date){
            date.forEach(function(dateRecord){
                dateRecord.ref.on('value',function(record){
                    record.forEach(function(snapshot){
                        total += snapshot.val().qty;
                    })
                })
            })
            console.log("Sale: "+ total);
                countRef.set(total);
        })
        
    });

exports.TotalRevenue = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total revenue');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.child('revenue');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().price;
                            })
                        })
                    })
                })
            })
            console.log("Total: "+ total);
                    countRef.set(total);
        })     
        
    });

exports.TotalSale = functions.database.ref('/shop/{shopid}/record/{date}/{recordid}').onWrite(
    (change) => {
        console.log('Count total revenue');
        const collectionRef = change.after.ref.parent;
        const shopRef = collectionRef.parent.parent.parent;
        const countRef = collectionRef.parent.parent.parent.child('sale');
        var total=0;
        return shopRef.on('value',function(shopID){
            shopID.forEach(function(record){
                record.ref.child('record').on('value',function(date){
                    date.forEach(function(dateRecord){
                        dateRecord.ref.on('value',function(record){
                            record.forEach(function(snapshot){
                                total += snapshot.val().qty;
                            })
                        })
                    })
                })
            })
            console.log("Sale: "+ total);
                    countRef.set(total);
        })     
        
    });