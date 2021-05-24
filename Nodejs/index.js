const express=require('express');
const cors=require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const app=express();

const con=mysql.createPool({
    host:"localhost",
    user:"root",
    post:"3306",
    password:"bharatH?718",
    database:"Bbank",
    insecureAuth:true
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("Welcome to Red Mate");
});

app.post('/uregister',(req,res)=>{
    const {name,password,age,city,state,address,type,sugar,bp,ht,wt,ailment1,ailment2,ailment3}=req.body;
    con.getConnection((err)=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        let pts=0;
        con.query("SELECT MAX(UserID) as uid FROM USER;",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            const id=Number(result[0].uid)+1;
            console.log(id,"created");
            let hash_v;
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    hash_v=hash;
                    console.log(hash_v);
                    con.query("INSERT INTO User Values ("+mysql.escape(id)+","+mysql.escape(hash_v)+","+mysql.escape(name)+","+mysql.escape(age)+","+mysql.escape(state)+","+mysql.escape(city)+","+mysql.escape(address)+","+mysql.escape(pts)+");",(err,result,fields)=>{
                        if(err){
                            console.log(err);
                            res.end(err['sqlMessage']);
                        }
                        console.log('User'+id+'created sucessfully');
                        res.end("Success");
                    });
                    var ailments=ailment1+ailment2+ailment3;
                    con.query("INSERT INTO health_history Values("+mysql.escape(id)+","+mysql.escape(type)+","+mysql.escape(sugar)+","+mysql.escape(bp)+","+mysql.escape(ht)+","+mysql.escape(wt)+","+mysql.escape(ailments)+",NULL);",(err,result,fields)=>{
                        if(err){
                            console.log(err);
                            res.end(err['sqlMessage']);
                        }
                        console.log('User'+id+'health history created ');
                    });
                });
            });
        });
    });

});


app.post('/ulogin',(req,res)=>{
    const {id,password}=req.body;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT password FROM USER where UserID="+mysql.escape(id)+";",(err,result,fields)=>{
            console.log(result);
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            if(result==={}){
                res.send("User doesn't exist");
            }
            var found=0;
            var hash_v;
            /*bcrypt.hash(password, null, null, function(err, hash) {
                 hash_v=hash;
            });*/
            bcrypt.compare(password,result[0].password, function(err, result){
                console.log(hash_v);
                if(result===true){
                    //console.log(res[0].password);
                    console.log("Login sucess");
                    found=1;
                }
                //res.end("Login Success");
               
                console.log(found);
                if(found==1){
                    res.end("Login Sucesss");
                    //route to url /:id/profile
                }
                else{
                    res.end("Wrong passowrd");
                    //reload the form page
                }
            });
        });
    });
});

app.post('/:id/profile',(req,res)=>{
    const id=req.params;
    //display static profile of id
    //buttons to donate and request 
})

app.post('/bregister',(req,res)=>{
    const {name,password,cat,address,city,state,contact,license,website}=req.body;
    var hash_v;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        //let pts=0;
        let id;
       // var hash_v;
        con.query("SELECT MAX(BloodBankID) as bbid FROM BLOOD_BANK;",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            id=result[0].bbid+1;
            console.log(id,"created");
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, null, null, function(err, hash) {
                        hash_v=hash;
            
                    con.query("INSERT INTO BLOOD_BANK Values ("+mysql.escape(id)+","+mysql.escape(hash_v)+","+mysql.escape(name)+","+mysql.escape(cat)+","+mysql.escape(address)+","+mysql.escape(contact)+","+mysql.escape(license)+","+mysql.escape(website)+","+mysql.escape(state)+","+mysql.escape(city)+");",(err,result,fields)=>{
                        if(err){
                            console.log(err);
                            res.end(err['sqlMessage']);
                        }
                        console.log('Bloodbank'+id+'created sucessfully');
                        res.end("Success,your id is"+id);
                        //res.end(1);
                    });
                });
            });
         });
    });

});

app.post('/blogin',(req,res)=>{
    const {id,password}=req.body;
    con.getConnection(err=>{
        if(err){
            console.log(err);
        }
        con.query("SELECT password FROM blood_bank where BloodbankID="+mysql.escape(id)+";",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            if(result==={}){
                res.send("Bank doesn't exist");
            }
            var found=0;
            var hash_v;
            console.log(result[0].password);
            bcrypt.compare(password,result[0].password, function(err, resu){
               // console.log(hash_v);
                if(resu===true){
                   // console.log(resu[0].password);
                    console.log("Login sucess");
                    found=1;
                }
                //res.end("Login Success");
                if(found==1){
                    res.end("Login Sucesss");
                    //route to url /:id/bprofile
                }
                else{
                    res.end("Wrong passowrd");
                    //reload the form page
                }
            });
        });
    });
});

app.get('/:id/bprofile',(req,res)=>{
    const id=req.params;
    //display static profile
    //buttons to check pending req and pending donations
})

app.post('/:id/udonate',(req,res)=>{
    const {name,date}=req.body;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT MAX(DonationID) as did FROM Donations;",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            let did=result[0].did+1;
            console.log(did,"created");
            con.query("SELECT BloodbankID FROM blood_bank WHERE NAME="+mysql.escape(name)+";",(err,result,fields)=>{
                let bbid=result[0].BloodbankID;
                let status="Pending";
                let uid=req.params.id;
                console.log(uid);
                con.query("INSERT INTO Donations Values("+mysql.escape(did)+","+mysql.escape(uid)+","+mysql.escape(bbid)+","+mysql.escape(date)+","+mysql.escape(status)+");",(err,result,fields)=>{
                    if(err){
                        console.log(err);
                        res.end(err['sqlMessage']);
                    }
                    console.log("Donation request submitted");
                    res.end("Success");
                    //alert blood bank,increment donation counts
                    //trigger to increment points
                });

            });
        });
    });
});

app.post('/:id/urequest',(req,res)=>{
    const {type,comp,units,area,name}=req.body;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT BloodbankID as bid FROM blood_bank WHERE NAME="+mysql.escape(name)+";",(err,result,fields)=>{
            var bbid=result[0].bid;
            var status="Pending";
            var uid=req.params.id;
            var reqid;
            var date_time;
            con.query("SELECT MAX(requestID) as reqID from REQUESTS",(err,result,fields)=>{
                if(result==={}){
                    reqid=1;
                }
                reqid=result[0].reqID+1;
                con.query("SELECT NOW() as dt;",(err,result,fields)=>{
                    date_time=result[0].dt;
                    console.log(date_time);
                })
                console.log(date_time);
                con.query("INSERT INTO REQUESTS Values("+mysql.escape(reqid)+","+mysql.escape(uid)+","+mysql.escape(bbid)+","+mysql.escape(type)+","+mysql.escape(comp)+","+mysql.escape(status)+","+mysql.escape(area)+","+mysql.escape(date_time)+","+mysql.escape(units)+");",(err,result,fields)=>{
                    if(err){
                        console.log(err);
                        res.end(err['sqlMessage']);
                    }
                    console.log("Blood request submitted");
                    res.send("Success");
                    //alert blood bank,increment req counts(trigger)
                });

            });
        });
    });
});

app.get('/uavailable',(req,res)=>{
    let type=req.query.bloodtype;
    let comp=req.query.bloodcomp;
    let state=req.query.state;
    let city=req.query.city;

    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT U_AVAIL("+mysql.escape(city)+","+mysql.escape(state)+","+mysql.escape(type)+","+mysql.escape(comp)+") as avail;",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            console.log("Blood details shown");
            res.send(JSON.parse(result[0].avail));
        });
    });
});

app.get('/:id/dprequest',(req,res)=>{

    //display static page of requests
});

app.get('/:id/prequest',(req,res)=>{
    var bbid=req.params.id;
    var n_req;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("CALL SERVE_REG("+mysql.escape(bbid)+mysql.escape(n_req)+");",(err,resu,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);

            }
            console.log(n_req+"requests served");           
        });
        //function to loop through requests and see if it can be served. Simulatneously trigger to decrease availablity status and 
        // request status
        //trigger to insert in Transactions tab
        //res.send("No pending requests!");
        });        
});


app.get('/:id/pdonations',(req,res)=>{
    let bbid=req.params.id;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);

        }
        con.query("SELECT * FROM DONATIONS WHERE BloodBankID="+mysql.escape(bbid),(err,result,field)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            if(result.length){
                res.send(result);
                  //display static page of donations list
                 //route to accept donation endpoint(form) the donation id should be appened in url
                  //function to loop through donations and if data matches update availability status
                  // donation status
                
            }
            else{
                res.send("No pending requests!");
            }
          
        });
    });
});

app.get('/:id/pdonations/:did',(req,res)=>{
    let bid=req.params.id;
    let did=req.params.did;
    let units=req.query.units;
    let comp=req.query.comp;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("CALL UPDATE_DONATIONS("+mysql.escape(did)+","+mysql.escape(bid)+","+mysql.escape(units)+","+mysql.escape(comp)+");",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            console.log("Donation completed success");
            res.end("Success");
        });
    });
});


app.post('/:id/campreq',(req,res)=>{
    const {city,state,date}=req.body;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT MAX(CampID) as cid from CAMPS",(err,result,field)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            var cid,bid;
            if(!result.length){
                cid=1;
            }
            cid=result[0].cid+1;
            bid=req.params.id;
            status="Pending";
            con.query("INSERT INTO CAMPS VALUES("+mysql.escape(cid)+","+mysql.escape(bid)+","+mysql.escape(date)+","+mysql.escape(status)+","+mysql.escape(city)+","+mysql.escape(state)+");",(err,result,fields)=>{
                if(err){
                    console.log(err);
                    res.end(err['sqlMessage']);
                }
                res.send("Camp registered");
            });
        });
    });
});

app.get('/:id/campavail',(req,res)=>{
    let uid=req.params.id;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT city,state FROM USER WHERE Userid="+mysql.escape(uid)+";",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            console.log(result[0].state);
            city=result[0].city;
            state=result[0].state;
            con.query("SELECT *  FROM CAMPS WHERE City="+mysql.escape(city)+"AND State="+mysql.escape(state)+";",(err,resu,fields)=>{
                if(err){
                    console.log(err);
                    res.end(err['sqlMessage']);
                }
                //display camps
                console.log(resu);
                res.send(resu);
            });
        });
        //display all camps with an option
    }); 
});

app.get('/:id/bavailable',(req,res)=>{
    let bid=req.params.id;
    con.getConnection(err=>{
        if(err){
            console.log(err);
            res.end(err['sqlMessage']);
        }
        con.query("SELECT B_AVAIL("+mysql.escape(bid)+")as avail;",(err,result,fields)=>{
            if(err){
                console.log(err);
                res.end(err['sqlMessage']);
            }
            res.send(JSON.parse(result[0].avail));
        });
    });
});

app.listen(3000,()=>{
    console.log('app is listening on port 3000');
});




//res=this is working
//login -->POST  sucess/fail
//request -->POST  request obj created
//donate -->POST  