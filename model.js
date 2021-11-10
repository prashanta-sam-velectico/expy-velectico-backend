
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var fs_Extra = require('fs-extra');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
const json = require('body-parser/lib/types/json');
var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

eval(fs.readFileSync('/var/www/html/adm/connection.js')+''); 

const bcrypt = require('bcrypt');
const saltRounds = 10;
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'developer',
	password : 'Developer@2021',
	database : 'expy',	
	port : '3306',
	multipleStatements: true,
	charset : 'utf8mb4'
});

var exports=module.exports={};


exports.getUsers = function(JM_ID) {
  var sql="SELECT * FROM joining_master where JM_ID="+JM_ID;
  connection.query(sql, function (error, rows, fields) 
  {
      callback(rows);
  });
};

exports.createFolder=function(ProfURL,callback)
{
  var sourceDir = './uploads/Links';	
	//let ProfURL='sam';
	var Profdir = './uploads/Profile/'+ProfURL;
  var ProfdirLinks = './uploads/Profile/'+ProfURL+'/Links';
  var status=false;
	if (!fs.existsSync(Profdir))
	{
		fs.mkdirSync(Profdir);
	
		if (!fs.existsSync(ProfdirLinks))
		{
			fs.mkdirSync(ProfdirLinks);
		}
	}

		fs_Extra.copy(sourceDir, ProfdirLinks, function (err) {
        if (err) {
          console.error(err);
        } else {         

          callback(true);
        }
	  }); // Copies directory, even if it has subdirectories   

}



exports.RandomAlpha =()=> {
	var randomPassword = Math.random().toString(36).slice(-10);
	return randomPassword;
  };
//   var mailer = require("nodemailer");
//   // Use Smtp Protocol to send Email
//   var smtpTransport = mailer.createTransport("SMTP",{
// 	  service: "Gmail",
// 	  auth: {
// 		  user: "prashanta.das@velectico.com",
// 		  pass: "Prashanta007"
// 	  }
//   });
//   exports.sendEmail=(email,password)=>{
	
	
// 	var mail = {
// 		from: "Expy <from@gmail.com>",
// 		to: email,
// 		subject: "New Password",
// 		text: "This is your new password "+password,
// 		html: "<a href='https://direct.me'><b>more info..</b></a>"
// 	}
	
	// smtpTransport.sendMail(mail, function(error, response)
	// {
	// 	if(error)
	// 	{
	// 		console.log(error);
	// 	}else
	// 	{
	// 		console.log("Message sent: " + response.message);
	// 	}
	
	// 	smtpTransport.close();
	// });

//  }
//function getRecords(id,cb) {
exports.getRecords=function(id,cb)
	{
	connection.query("select * from joining_master where JM_ID = ?", id, function(err, result) {
	  if (err)  console.log('error getRecords : code - ' + err.code + " ,isFatal - " + err.fatal);
	  cb(result);
	});
}

exports.getUserDetails=function(JM_ID,cb)
{
	var sql="SELECT JM_ID,JM_Name,JM_Description,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Social_Widget_Position,JM_Payout_Details FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select *,Concat('Profile/',jm.JM_User_Profile_Url,'_',jm.JM_ID,'/Links/') as ProfilePath from link_master lm inner join joining_master jm on jm.JM_ID=lm.JM_ID  where lm.JM_ID="+JM_ID+" order by lm.LM_OrderBy; Select * from direct_access_master_user where JM_ID="+JM_ID+"; SELECT * from social_widget_master where JM_ID="+JM_ID+" order by SWM_OrderBy; SELECT * from category_master where JM_ID="+JM_ID+"; SELECT * FROM link_master lm inner join category_master cm on cm.CM_ID=lm.LM_Folder_ID where lm.JM_ID="+JM_ID+"; SELECT * from embed_content where JM_ID="+JM_ID;
	connection.query(sql, function (err, results, fields) {
		let error=[];
	if (err)  console.log('error getUserDetails : code - ' + err.code + " ,isFatal - " + err.fatal);
		cb(results);
  });
}

exports.getPremiumContent_By_Id=function(id,cb)
{
	let sql="SELECT damu.DA_Collection,CONCAT(jm.JM_User_Profile_Url,'_',jm.JM_ID) JM_Profile_Url,jm.JM_User_Profile_Url,DA_DA_ID,DA_Type,jm.JM_Email,jm.JM_Name,JM_Email_Pref,JM_SMS_Pref,JM_Phone from direct_access_master_user damu inner join joining_master jm on jm.JM_ID=damu.JM_ID where damu.DA_ID="+id;
	//console.log(sql);
	connection.query(sql, function (err, results, fields) {
	if (err)  console.log('error getPremiumContent_By_Id : code - ' + err.code + " ,isFatal - " + err.fatal);
	cb(results);
	});
}
//16-mar-2021
//addBuyers
exports.validate_Premium_Password=function(BM_Url_ID,password,cb)
{

	let sql="SELECT * from buyers_master where BM_Url_ID='"+BM_Url_ID+"'";
	console.log(sql);
	connection.query(sql, function (err, results, fields) 
	{
		if (err)  console.log('error getPremiumContent_By_Id : code - ' + err.code + " ,isFatal - " + err.fatal);
		else
		{
			
			if(results.length > 0)
			{
				
					var BM_ID=results[0].BM_ID;
					var BM_Password=results[0].BM_Password;
					console.log(BM_Password)
					const match = bcrypt.compareSync(password, BM_Password); 				
					if(!match)
					{
						console.log(results[0].BM_Password);
						var json={status:0,data:[]};
						cb(json);
					}
					else
					{             
						var json={status:1,data:results};
						cb(json);
					}
					     
			}
		}
	});
}

exports.getBuyerEmail=function(BM_Url_ID,cb)
{	
	let sql="SELECT BM_ID,BM_Email from buyers_master where BM_Url_ID='"+BM_Url_ID+"'";
	connection.query(sql, function (err, results, fields) {
  if (err)  console.log('error getBuyerEmail : code - ' + err.code + " ,isFatal - " + err.fatal);
  cb(results);
});
}


                                           
exports.sqlPromise = (sql) =>{
    return new Promise((resolve, reject)=>{
        connection.query(sql,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};
//06-jul-2021
exports.sqlInsert = (sql,values) =>{
    return new Promise((resolve, reject)=>{
        connection.query(sql, [values],  (error, results)=>{
            if(error)
			{
                return reject(error);
            }
            return resolve(results);
        });
    });
};

