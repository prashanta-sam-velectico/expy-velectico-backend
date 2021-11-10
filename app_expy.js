var express = require('express')
  , app = express()
  , port = process.env.PORT || 9000

var mysql = require('mysql');
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');


var session = require('express-session');
var router = express.Router();
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const json = require('body-parser/lib/types/json');
eval(fs.readFileSync('/var/www/html/adm/connection.js')+''); 

var model=require('./model.js');

var moment = require('moment');

const expressip = require('express-ip');
app.use(expressip().getIpInfoMiddleware);



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var fs_Extra = require('fs-extra');

// let allowCrossDomain = function(req, res, next) {
// 	res.header('Access-Control-Allow-Origin', "*");
// 	res.header('Access-Control-Allow-Headers', "*");
// 	next();
//   }

//12-may-2021


// for fileupload
app.use(fileUpload({ safeFileNames: true, preserveExtension: true,uriDecodeFileNames:true, limits: { fileSize: 50 * 1024 * 1024 } }))

app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(express.static('uploads'));
app.use(express.static('store'));




//============= middleware for checking toke


var checkUserFilter = async function(req, res, next) {
    if(
		req._parsedUrl.pathname === '/admin/userDetailsAll' 
		||req._parsedUrl.pathname === '/admin/GetAllRequest' 
		|| req._parsedUrl.pathname === '/admin/socialLogin' 
		|| req._parsedUrl.pathname === '/admin/Update_ReferralCode' 
		|| req._parsedUrl.pathname === '/admin/updateProfileNameDescription' 
		|| req._parsedUrl.pathname === '/admin/createContact'
		|| req._parsedUrl.pathname === '/admin/payout'
		||  req._parsedUrl.pathname === '/admin/UpdatePayoutDetails' 
		||  req._parsedUrl.pathname === '/admin/UpdatePayoutDetailsPayPal' 
		||  req._parsedUrl.pathname === '/admin/updatePassword' 
		||  req._parsedUrl.pathname === '/admin/updateProfileSettings' 
		||  req._parsedUrl.pathname === '/admin/updateEmail' 
		||  req._parsedUrl.pathname === '/admin/statsDetails' 
		||  req._parsedUrl.pathname === '/admin/userDetailsAllSettings' 
		||  req._parsedUrl.pathname === '/admin/pay_balance' 

		//statsDetails userDetailsAllSettings pay_balance pay_balance
		  
	
	 ) 		
    {
		console.log(req._parsedUrl.pathname);
		var authorization = req.headers['authorization'];
		var JM_ID = req.headers['id'];
		console.log("id ->" + JM_ID);
		console.log("token->"+ authorization);
		const isValidApi= await API_Authorization(JM_ID,authorization);
        if(isValidApi==false)
        {
          res.json({status:0,msg:'unable to process'})
          return false;
        }
		next();
    } 
    else
	{		
		console.log("checkUserFilter next");
		next();      
		
    }
}

app.use(checkUserFilter);

//=======




var mailer = require("nodemailer");

var smtpTransport  = require('nodemailer-smtp-transport');


// var transporter = mailer.createTransport(smtpTransport({
//     name: 'smtp.yandex.ru',
//     port: 465,  
// 	secureConnection: true, // use SSL
//     auth: {
//     	user: "admin@expy.bio",
//     	pass: "H3Scx9Bt"
//     },
	
// 	tls:{
//         rejectUnauthorized: false
//     }
// }));


// var transporter = mailer.createTransport(smtpTransport({
//     name: 'localhost',
//     port: 25,
//     auth: {
//     	user: "info@velectico.net.in",
//     	pass: "expy@2021"
//     },
//     tls:{
//         rejectUnauthorized: false
//     }
// }));

let transporter = mailer.createTransport({
	service: 'Yandex', // no need to set host or port etc.
	auth: {
		user: "admin@expy.bio",
    	pass: "H3Scx9Bt"
	}
});


// let transporter = nodeMailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: true,
//     auth: {
//         user: 'example@gmail.com',
//         pass:'your gmail pass'
//     }
// });
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

require('custom-env').env('dev', '/var/www/html/adm/');
app.post('/admin/mail',function(req,res){


	// let transporter = nodemailer.createTransport({
	// 	host: 'smtp.example.com',
	// 	port: 465,
	// 	secure: true,
	// 	auth: {
	// 		type: 'custom',
	// 		method: 'CRAM-MD5',
	// 		user: 'username',
	// 		pass: 'verysecret'
	// 	},
	// 	customAuth: {
	// 		'CRAM-MD5': nodemailerCramMd5
	// 	}
	// });
	
	// transporter.sendMail({
	// 	from: 'sender@example.com',
	// 	to: 'recipient@example.com',
	// 	subject: 'hello world!',
	// 	text: 'hello!'
	// }, console.log)


              let to=req.body.Email;
              var mailOptions = {
                  from: "Expy Admin <admin@expy.bio>",
                  to: to,
                  subject: "Send Email Using Node.js",
                  text: "Node.js New world for me",
                  html: "<b>Node.js New world for me</b>"
              }

			
						transporter.sendMail(mailOptions, (error, info) => {
                          if (error) 
                          {
                              res.json({status:0,msg:"error",error:error});	
                          }
                          else
                          {
                              res.json({status:1,msg:'sent'});	
                          }
						});
				

});



app.post('/admin/completeRequest',async function(req,res){

		let fileName = req.body.fileName;
		let ProfileName = req.body.ProfileName;

	 	 let to=req.body.BM_Email;
		 let BM_ID=req.body.BM_ID;

		 
		 let BM_Name=req.body.BM_Name;
		 let BM_Purchase_Date=req.body.BM_Purchase_Date.substr(0, 10);
		 let JM_Name=req.body.JM_Name;
		 let JM_User_Profile_Url=req.body.JM_User_Profile_Url;		 
		 let DA_Title=req.body.DA_Title;
		 let BM_Purchase_Amt=req.body.BM_Purchase_Amt;
		 let BM_Phone=req.body.BM_Phone;
		// var substr=string.substr(0, 8);
		//"0aeb596abc97d28c6efd6f4fbae8a6ca.jpg"
		var pathTofile= __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
		var premium_url=process.env.BASE_URL+'adm/uploads/Profile/' + ProfileName+"/"+fileName;
		var mailOptions = {   
        from: "Expy Admin <admin@expy.bio>",  
        to:to,   
        subject: "Hooray! Your Expy Request is Delivered!",  
        html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request here: <a  href='"+premium_url+"' download><b>download content</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
         attachments: [  		 
			{   					
				path: pathTofile
			},
        ] 
    };

	var mailOptions2 = {   
        from: "Expy Admin <info@expy.bio>",  
        to:to,   
        subject: "Hooray! Your Expy Request is Delivered!",  
        html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request here: <a  href='"+premium_url+"' download><b>download content</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
         attachments: [  		 
			{   					
				path: pathTofile
			},
        ] 
    };




	transporter.sendMail(mailOptions,async (error, info) => {
      if (error) 
	  {
          res.json({status:0,msg:error,bode:""});	
      }
      else
      {
          			let sql = "UPDATE buyers_master SET  Status='C',BM_Content_Sent='"+premium_url+"',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
                          let query = connection.query(sql, async (err, results) => {
                          if(err) 
                          {
                              console.log(err);
                              res.json({status:0,msg:err});
                          }
                          else
                          {
								var resp=await wrapedSendMailInfo(mailOptions2);

							let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
								var isSentSMS=sendSMS(BM_Phone,sms);								
                              res.json({status:1,msg:'done',bode:req.body,pathTofile:''});	
                          }	
                      });
      }
      			
		
    });
	  
				
});

//07-jul-2021
app.post('/admin/setMeeting',async(req,res)=>{

			let fileName = req.body.fileName;
			let ProfileName = req.body.ProfileName;

			let to=req.body.BM_Email;
			let BM_ID=req.body.BM_ID;

			
			let BM_Name=req.body.BM_Name;
			let BM_Purchase_Date=req.body.BM_Purchase_Date.substr(0, 10);
			let JM_Name=req.body.JM_Name;
			let JM_User_Profile_Url=req.body.JM_User_Profile_Url;		 
			let DA_Title=req.body.DA_Title;
			let BM_Purchase_Amt=req.body.BM_Purchase_Amt;
			let BM_Phone=req.body.BM_Phone;
		
			//var jitsee_URL='https://meet.jit.si/expy/'+JM_User_Profile_Url+"-"+BM_ID;
			var randomPassword = Math.random().toString(36).slice(-10);
			var MeetingId=JM_User_Profile_Url+"-"+BM_ID+"-"+randomPassword;
			var premium_url=process.env.BASE_URL+"meet?id="+JM_User_Profile_Url+"-"+BM_ID+"-"+randomPassword;
			var Date_of_session=req.body.session_date;
			var Starting_Time=req.body.session_time;
			var Ending_Time=req.body.session_time_end;
			var mailOptions = {   
			from: "Expy Admin <admin@expy.bio>",  
			to:to,   
			subject: "Hooray! Your Expy Live Video Request is Delivered!",  
			html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request to join the video session here. Date : "+Date_of_session+", Starting-Time:"+Starting_Time+",Ending-Time:"+Ending_Time+" <a  href='"+premium_url+"' ><b>click here to join</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
			
		};

			transporter.sendMail(mailOptions, (error, info) => {
			if (error) 
			{
				res.json({status:0,msg:error,bode:""});	
			}
			else
			{
							let sql = "UPDATE buyers_master SET  Status='C',BM_Content_Sent='"+MeetingId+"',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
								let query = connection.query(sql, (err, results) => {
								if(err) 
								{
									console.log(err);
									res.json({status:0,msg:"err"});
								}
								else
								{
									//let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
									//	var isSentSMS=sendSMS(BM_Phone,sms);								
									res.json({status:1,msg:'done',link:premium_url});	
								}	
							});
			}
						
				
			});
  
})


//15-apr-2021


app.post('/admin/contactUsMail',function(req,res)
{

	var Name=req.body.Name;
	var Email=req.body.Email;
	var Message=req.body.Message;

	let transporter = mailer.createTransport({
        service: 'Yandex', // no need to set host or port etc.
        auth: {
            user: "support@expy.bio",
            pass: "TXs6YuLZ"
        }
    });
	if(Name.length > 0 && Email.length > 0 && Message.length > 0 )
	{

			let to=process.env.CONTACT_US_MAIL;

			//let to="prashanta.das@velectico.com";
			var mailOptions = {
				from: "Expy Admin <support@expy.bio>",
				to: Email,
				subject: "Thank You for Contacting Us",
				text: "Thank You for Contacting Us",
				html: "<b>We will contact you soon..</b>"
			}

			transporter.sendMail(mailOptions, (error, info) => 
			{

				if (error) 
				{
					   res.json({status:0,msg:"unable to complete request, try again later",error:error});	
				}
				else
				{
						
					const values = [
							[Name,Email,Message]
						];
						const sal = "INSERT INTO contacts_details (Name,Email,Message) VALUES ?";	  
						const query = connection.query(sal, [values], function(err, result) 
						{
							if (err) 
							{
								console.log(err);
								res.json({status:0,msg:"internal error try again later",err:err});
							}
							else
							{	

								res.json({status:1,msg:'Thank you for contacting us'});
							}
						});
				}
			});
		
	}
	else
	{
		res.json({status:0,msg:'Empty Input Fields'});
	}

});







//for uploading requested file by Creator
 app.post('/admin/uploadFile',function(req,res)
{

				var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
				let videoFile = req.files.sampleFile;
				var ext = path.extname(videoFile.name);	
				var fileName=videoFile.md5+ext;														
				var	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
				
			 	videoFile.mv(uploadPath, function(err) 
				{
				  if (err)
						  res.json({status:0,msg:'failed',fileName:fileName});
				  else	
				  {
					  console.log("success");


			
					  res.json({status:1,msg:'uploaded',fileName:fileName});
  
				  }
			  });
             
	
});




app.get('/admin/uploadTest',function(req,res){

	res.render('pages/uploadMulter');

});


var multer  = require('multer')
var upload = multer({ dest: '/var/www/html/app/adm/uploads/Profile/sss_46' })



app.post('/uploadMulter', upload.single('avatar'), function (req, res, next) 
{
  
  upload(req, res, (err) => {
      if(err) {
        res.status(400).send("Something went wrong!");
      }
      res.send(req.file);
    });
})




//updateCurrentStatus




app.get('/admin/updateCurrentStatus', function (req, res) {


	var ip = req.headers['x-forwarded-for'].split(',')[0];
	var JM_Profile_Url=req.body.JM_Profile_Url;

	   let sql1="SELECT Count(*) cnt FROM view_master where JM_Profile_Url='"+JM_Profile_Url+"' and IP='"+ip+"' and Active=1";
	   connection.query(sql1, function (error, results, fields) 
	   {
		 if (error) 
		 {
			 res.json({
			   status:2,
			   msg:'error in query execution'
			   })
		 }
		 else
		 {
			 if(results.length > 0)
			 {
				let sql = "UPDATE view_master SET  Active=0  WHERE JM_Profile_Url='"+JM_Profile_Url+"' and IP='"+ip+"'" ;
					let query = connection.query(sql, (err, results) => {
					if(err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{
						res.json({status:1,msg:'Profile is Updated'});
					}	
				});
			 }	
			 else
			 {
				 res.json({
					 status:0,
					 msg:'no data found'
					 })
			 }	
		 }	
	 });	

   
   
});




//26-apr-2021
app.post('/admin/doUpdateAdminPassword',(req,res)=>{

	var current_pass=req.body.current_pass;
	var new_pass=req.body.new_pass;
	var email='admin@expy.bio';
	connection.query('SELECT * FROM admin_master WHERE AM_Email= ? and AM_Password= ?',[email,current_pass], function (error, results, fields) {
		if (error)
		{
			res.json({
			 	 status:0,
			 	 msg:'there are some error with query'
			  })
		}
		else
		{
			if(results.length > 0)
			{

				let sql = "UPDATE admin_master SET  AM_Password='"+new_pass+"'  WHERE  AM_Email='"+email+"'";
					let query = connection.query(sql, (err, result) => {
					if(err) 
					{
						console.log(err);
						res.json({status:0,msg:"error",err:err});
					}
					else
					{
						res.json({status:1,msg:'Password has been updated'});
					}	
				});
			}
			else
			{
				res.json({
					status:0,
					msg:"Current Password Does't match"
				})
			}

		}
	});

})



app.get('/admin/ip', function (req, res) {
 	var ip = req.headers['x-forwarded-for'].split(',')[0];
	res.end(ip);
});

























app.post('/admin/addProductNoFile',function(req,res){





	var DA_DA_ID=req.body.DA_DA_ID;

	var JM_ID=req.body.JM_ID;

	var DA_Title=req.body.DA_Title;

	var DA_Description=req.body.DA_Description;	

	var DA_Price=req.body.DA_Price;

	var DA_Type='NA';


		
				var fileName="thankYou.jpg";
				var fileArray=[fileName];
				var DA_Collection=JSON.stringify(fileArray);

				

 			
					  const values = [
						  [DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,DA_Collection]
					  ];
					  const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  

					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {
                           
                            res.json({status:0,msg:err});
                        }
                        else
                        {			
                            res.json({status:1,msg:'Done',DA_ID:DA_DA_ID});

                        }	
					});
					
					//res.json({status:0,msg:"err",sql:"sal",body:req.body,values:values});
});



var Jimp = require('jimp');
app.post('/admin/addProduct',function(req,res){

	let videoFile,imageFile,coverFile,album;
	let uploadPath;
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var DA_Cover=req.body.DA_Cover;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var DA_Price=req.body.DA_Price;
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;
	var fileName="";
	
	if (!req.files || Object.keys(req.files).length === 0) 
	{		
			
        
 					var DA_Collection="[]";		
					  const values = [
						  [DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,""]
					  ];
					  const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  

					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {
                           
                            res.json({status:0,msg:err});
                        }
                        else
                        {			
                            res.json({status:1,msg:'Done',DA_DA_ID:DA_DA_ID});

                        }	
					});
              
	}
	else
	{
		console.log("file exist ---> "+ DA_Type);
		//var stringObj = JSON.stringify(meida_array);
		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		if(DA_Type=="video")
		{
			
				let videoFile = req.files.sampleFile;
				var ext = path.extname(videoFile.name);	
				fileName=videoFile.md5+ext;
				var fileArray=[fileName]
				var DA_Collection=JSON.stringify(fileArray);
				console.log(DA_Collection)
				const values = [
					[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
				];
				const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
				const query = connection.query(sal, [values], function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{						
							let DA_ID=result.insertId;						
							uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
							var DA_Collection='Profile/' + ProfileName+"/"+fileName;
							videoFile.mv(uploadPath, function(err) 
							{
								if (err)
										res.json({status:0,msg:'failed',DA_ID:DA_ID});
								else	
								{
									console.log("success");
									res.json({status:1,msg:'Done',DA_ID:DA_ID});

								}
							});
					
				}	
			});
		}
		else if(DA_Type=="audio") 
		{
			
					let audioFile = req.files.sampleFile;
					var ext = path.extname(audioFile.name);	
					fileName=audioFile.md5+ext;			
					var fileArray=[fileName]	
					var DA_Collection=JSON.stringify(fileArray);		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{						
								let DA_ID=result.insertId;							
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								audioFile.mv(uploadPath, function(err) 
								{
									if (err)
										result={status:0,msg:'Failed!'}
									else	
									{
										console.log("success");
										res.json({status:1,msg:'Done',DA_ID:DA_ID});

									}
								});
						
					}	
				});
					
		}     
		else if(DA_Type=="image") 
		{
			
					let audioFile = req.files.sampleFile;
					var ext = path.extname(audioFile.name);	
					fileName=audioFile.md5+ext;	
					var fileArray=[fileName]	
					var DA_Collection=JSON.stringify(fileArray);		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{						
								let DA_ID=result.insertId;							
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								audioFile.mv(uploadPath, function(err) 
								{
									if (err)
										result={status:0,msg:'Failed!'}
									else	
									{
										console.log("success");
										

										Jimp.read(uploadPath)
										.then(image => 
											{
											
												image.blur(20); 
												image.write(__dirname + "/cover/"+fileName);

												res.json({status:1,msg:'Done',DA_ID:DA_ID});
										
										})
										.catch(err => 
										{
											
											result={status:0,msg:'Failed to make blur'}
											console.error(err);
										});
										

									}
								});
						
					}	
				});
					
		}

		else if(DA_Type=="pdf") 
		{
			
					let audioFile = req.files.sampleFile;
					var ext = path.extname(audioFile.name);	
					fileName=audioFile.md5+ext;			
					var fileArray=[fileName]	
					var DA_Collection=JSON.stringify(fileArray);		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{						
								let DA_ID=result.insertId;							
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								audioFile.mv(uploadPath, function(err) 
								{
									if (err)
										result={status:0,msg:'Failed!'}
									else	
									{
										console.log("success");
										res.json({status:1,msg:'Done',DA_ID:DA_ID});

									}
								});
						
					}	
				});
					
		}
		else if(DA_Type=="txt") 
		{
			
					let audioFile = req.files.sampleFile;
					var ext = path.extname(audioFile.name);	
					fileName=audioFile.md5+ext;			
					var fileArray=[fileName]	
					var DA_Collection=JSON.stringify(fileArray);		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{						
								let DA_ID=result.insertId;							
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								audioFile.mv(uploadPath, function(err) 
								{
									if (err)
										result={status:0,msg:'Failed!'}
									else	
									{
										console.log("success");
										res.json({status:1,msg:'Done',DA_ID:DA_ID});

									}
								});
						
					}	
				});
					
		}

		// for multiple images
		else if(DA_Type=="album") 
		{

				
			var fileArray=[];
			album = req.files.img_multiple;

			console.log(album)
			
			
            if(album!=null && album.length > 0)
			{
						var fileName="";					
						for(let i=0;i<album.length;i++)
						{
							var ext = path.extname(album[i].name);	
							fileName=album[i].md5+ext;
							fileArray.push(fileName);
						}
                                                        
                        var DA_Collection=JSON.stringify(fileArray);					
				
				
						const values = [
							[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
						];
						const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
						const query = connection.query(sal, [values], function(err, result) 
                        {
                              if (err) 
                              {
                                  console.log(err);
                                  res.json({status:0,msg:err});
                              }
                              else
                              {					
                                  let data = []; 	
                                  let DA_ID=result.insertId;
                                  let c=0;
                                  try
                                  {
		
                                      for(let i=0;i<album.length;i++)
                                      {
                                          var ext = path.extname(album[i].name);
                                          let albumFile=album[i];		
                                          let	fileName=album[i].md5+ext;
                                          uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
                                          albumFile.mv(uploadPath);
                                          data.push({
                                              name: album[i].name,
                                              md5: album[i].md5						
                                          });
                                          c++;
                                      }
                                      if(c!=album.length)
                                          res.json({status:0,msg:"error"});
                                      else	
                                      {
                                          console.log("success");
                                          res.json({status:1,msg:'Done',DA_ID:DA_ID});
                                      }
                                  }
                                  catch (err) {
                                      console.log("error in image");
                                      res.json({status:0,msg:"error in exception"});
                                  }

                              }	
					  });

			} 
                                                        
         
		}
	}

});

//09-apr-2021
app.post('/admin/updateProduct',function(req,res){

	let videoFile,imageFile,coverFile,album;
	let uploadPath;

	var DA_Type=req.body.DA_Type;
	var JM_ID=req.body.JM_ID;
	var DA_ID=req.body.DA_ID;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var DA_Price=req.body.DA_Price;	
	var DA_DA_ID=req.body.DA_DA_ID;

	var fileName="";
	
	if (!req.files || Object.keys(req.files).length === 0) 
	{		
		
		
			let sql = "UPDATE direct_access_master_user SET  DA_Title='"+DA_Title+"',DA_Description='"+DA_Description+"',DA_Price="+DA_Price+" WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
  
			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});
	}
	else
	{	
		if(DA_DA_ID==1)
		{
			//if(DA_Type=="video")
			//{
						let videoFile = req.files.sampleFile;
						var ext = path.extname(videoFile.name);	
						fileName=videoFile.md5+ext;
						var fileArray=[fileName]
						var DA_Collection=JSON.stringify(fileArray);
						console.log(DA_Collection)
						
						let sql = "UPDATE direct_access_master_user SET DA_Type='"+DA_Type+"', DA_Title='"+DA_Title+"',DA_Description='"+DA_Description+"',DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
			
						let query = connection.query(sql, (err, results) => {
							if(err) 
							{
								console.log(err);
								res.json({status:0,msg:err});
							}
							else
							{
													
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								videoFile.mv(uploadPath, function(err) 
								{
									if (err)
											res.json({status:0,msg:'failed',DA_ID:DA_ID});
									else	
									{
										console.log("success");

									
										res.json({status:1,msg:'Done',DA_ID:DA_ID});

									}
								});
								
								
							}	
						});
					
			//}
			  
		}		
		if(DA_DA_ID==2)
		{
			if(DA_Type=="txt")
			{
				let videoFile = req.files.sampleFile;
				var ext = path.extname(videoFile.name);	
				fileName=videoFile.md5+".docx";
				var fileArray=[fileName]
				var DA_Collection=JSON.stringify(fileArray);
				console.log(DA_Collection)
				
				let sql = "UPDATE direct_access_master_user SET  DA_Type='"+DA_Type+"',DA_Title='"+DA_Title+"',DA_Description='"+DA_Description+"',DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;

				let query = connection.query(sql, (err, results) => {
					if(err) 
					{
						console.log(err);
						res.json({status:0,msg:err});
					}
					else
					{
											
						uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
						var DA_Collection='Profile/' + ProfileName+"/"+fileName;
						videoFile.mv(uploadPath, function(err) 
						{
							if (err)
									res.json({status:0,msg:'failed',DA_ID:DA_ID});
							else	
							{
								console.log("success");
								res.json({status:1,msg:'update unlock content',DA_ID:DA_ID,fileName:videoFile});

							}
						});
						
						
					}	
				});

			}
			else
			{
				let videoFile = req.files.sampleFile;
				var ext = path.extname(videoFile.name);	
				fileName=videoFile.md5+ext;
				var fileArray=[fileName]
				var DA_Collection=JSON.stringify(fileArray);
				console.log(DA_Collection)
				
				let sql = "UPDATE direct_access_master_user SET  DA_Type='"+DA_Type+"',DA_Title='"+DA_Title+"',DA_Description='"+DA_Description+"',DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
	
				let query = connection.query(sql, (err, results) => {
					if(err) 
					{
						console.log(err);
						res.json({status:0,msg:err});
					}
					else
					{
											
						uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
						var DA_Collection='Profile/' + ProfileName+"/"+fileName;
						videoFile.mv(uploadPath, function(err) 
						{
							if (err)
									res.json({status:0,msg:'failed',DA_ID:DA_ID});
							else	
							{
								console.log("success");

								Jimp.read(uploadPath)
								.then(image => 
									{
									
										image.blur(20); 
										image.write(__dirname + "/cover/"+fileName);

										//res.json({status:1,msg:'Done',DA_ID:DA_ID});
								
										res.json({status:1,msg:'update unlock content',DA_ID:DA_ID,fileName:videoFile});
								})
								.catch(err => 
								{
									
									result={status:0,msg:'Failed to make blur'}
									console.error(err);
									
										res.json({status:1,msg:'Failed to make blur',DA_ID:DA_ID,fileName:videoFile});
								});


	
							}
						});
						
						
					}	
				});
	
			}
			
		}
	}

});

app.post('/admin/addGifts',function(req,res){


	var JM_ID=req.body.JM_ID;		
	var DA_Title=req.body.DA_Title;	
	var image=req.body.image;
	var DA_Price=req.body.DA_Price;
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;
	var fileName="";
	
	
					
					var fileArray=[image];
					var DA_Collection=image;					
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title,'NA',DA_Price,DA_Collection,1]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Price,DA_Collection,DA_Active) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {
                            console.log(err);
                            res.json({status:0,msg:err});
                        }
                        else
                        {						
                                            let DA_ID=result.insertId;
                                            console.log("success");
                                            res.json({status:1,msg:'Done',DA_ID:DA_ID});


                        }	
					});
});

//16-apr-2021

app.post('/admin/updateGifts',function(req,res)
{
	var DA_ID=req.body.DA_ID;	
	var JM_ID=req.body.JM_ID;		
	var DA_Title=req.body.DA_Title;	
	var DA_Price=req.body.DA_Price;
	if(DA_ID > 0)
	{
        let sql = "UPDATE direct_access_master_user SET  DA_Title='"+DA_Title+"',DA_Price='"+DA_Price+"' WHERE DA_ID="+DA_ID;
        let query = connection.query(sql, (err, results) => 
        {
            if(err) 
            {
                console.log(err);
                res.json({status:0,msg:"error occured, try later"});
            }
            else
            {
                res.json({status:1,msg:"Profile is Updated"});
            }	
        });
    }
	else
    {
        res.json({status:1,msg:"unable to update"});
    }

});


//08-apr-2021

app.post('/admin/addDoner',(req,res)=>{


		let paymentId=req.body.paymentId;
		var premium_url=process.env.PREMIUM_URL;
		var DA_ID=req.body.DA_ID;
		var BM_Instruction=req.body.BM_Instruction;
		var BM_Name=req.body.BM_Name;
		var BM_Email=req.body.BM_Email;
		var BM_Phone=req.body.BM_Phone;
		var BM_Password=req.body.BM_Password;
		var BM_Purchase_Amt=req.body.amount;

		var DA_Title=req.body.DA_Title;
		var JM_Name=req.body.JM_Name;
		var JM_Email=req.body.JM_Email;
		var JM_Phone=req.body.JM_Phone;
		var JM_ID=req.body.JM_ID;
		const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
		//var BM_Purchase_Amt=1;
		console.log("paymentId ->  "+ paymentId)

		console.log("DA_ID ->  "+ DA_ID)
		var JM_User_Profile_Url=req.body.JM_User_Profile_Url;



		if(paymentId!='' && (DA_ID == 0 || DA_ID > 0))
		{
		
			console.log("Successfully copied and moved the file!")
			const values = [
				[DA_ID,"",BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,'',"D",'C',paymentId,JM_ID]			
			];
			const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID) VALUES ?";	  
			const query = connection.query(sql, [values], function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
					 let msg="<h1>Hi "+BM_Name+"</h1></br><p> Your  "+DA_Title+" of ₹ "+BM_Purchase_Amt+"  was successfully received by "+JM_Name+". Thank you for supporting your favorite creator! </p><p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span>";

					// var text="Product Link : "+premium_url+BM_Url_ID;
					var mailOptions = {
						from: "Expy Team <admin@expy.bio>",
						to: BM_Email,
						subject: "Your Expy Gift was delivered! ",
						text: "Thanks for Support",
						html: msg
					}

					
					var datetime = new Date();					
					var purchased_date=datetime.toISOString().slice(0,10);

					let msg2="<h1>Hi "+JM_Name+", Congratulations! You have received a new gift on your Expy Page. </h1><span> Details  :</span><br/> <span> Name: "+BM_Name+"</span><br/>   <span> Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Gift Item: "+DA_Title+" </span><br/>          <span>Item Price: "+BM_Purchase_Amt+"</span><br/><p>Your Gift amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Keep creating awesome content to receive more gifts from your followers!</p>  <p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span>";

					var mailOptions2 = {
						from: "Expy Team <admin@expy.bio>",
						to: JM_Email,
						subject: "You have received a new Gift on Expy!",
						text: "Thanks for Support",
						html: msg2
					}
					//"Congrats "+JM_Name+" ! You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
					var sms="Congrats "+JM_Name+" You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
					var isSentSMS=sendSMS(JM_Phone,sms);
					transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
							res.json({status:1,msg:"mail not sent",url:'',arr:req.body});
						}							
					   else
					   {
							  transporter.sendMail(mailOptions2, (error, info) => {
								  if (error) 
								  {
									  res.json({status:1,msg:"unable to send mail to creator"});	
								  }
								  else
								  {

										res.json({status:1,msg:msg,url:'',arr:req.body});
								  }	
								});
						}
							
					 });

					
				}	
			});

		
		}
		else
		{
			console.log('no payment id');
			res.json({status:0,msg:"no payment id"});
		}
		
})

//24-jun-2021
app.post('/admin/addImageCarousel',(req,res)=>{

	let videoFile,imageFile,coverFile,album;
	let uploadPath;
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var DA_Cover=req.body.DA_Cover;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var DA_Price=req.body.DA_Price;
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;
	var fileName="";
	var DA_Car_Image1='NA';
	var DA_Car_Image2='NA'; 
	var DA_Car_Image3='NA';

	var carousel_title_1=req.body.carousel_title_1;
	var carousel_title_2=req.body.carousel_title_2;
	var carousel_title_3=req.body.carousel_title_3;


	if (!req.files || Object.keys(req.files).length === 0) 
	{		
			
     res.json({status:0,msg:'no file found',DA_DA_ID:DA_DA_ID});	
	 return false;

	}
	else
	{
		console.log("file exist ---> "+ DA_Type);
	
		if(DA_Type=="image") 
		{
			
					let carousel_1 = req.files.carousel_1;
					let carousel_2 = req.files.carousel_2;
					let carousel_3 = req.files.carousel_3;
					console.log("carousel_1")
					console.log(carousel_1)

					console.log("carousel_2")
					console.log(carousel_2)

					console.log("carousel_3")
					console.log(carousel_3)
				
				
					
			

					
					var fileNames="";
					if(typeof carousel_1!='undefined' && carousel_1!=null)
					{
						var carousel_1_ext = path.extname(carousel_1.name);	
						var fileName1=carousel_1.md5+carousel_1_ext;
						fileNames+=fileName1+",";
						DA_Car_Image1='Profile/' + ProfileName+"/"+fileName1;
						var uploadPath1 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName1;
						carousel_1.mv(uploadPath1, function(err) 
						{
							if (err)
								result={status:0,msg:' failed 1st image upload'}
							else	
							{
									console.log("success1");	
							}
						});
						
					}
					if(typeof carousel_2!='undefined' && carousel_2!=null)
					{						
						var carousel_2_ext = path.extname(carousel_2.name);	
						var fileName2=carousel_2.md5+carousel_2_ext;
						fileNames+=fileName2+",";
						DA_Car_Image2='Profile/' + ProfileName+"/"+fileName2;
						var uploadPath2 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName2;
						carousel_2.mv(uploadPath2, function(err) 
						{
							if (err)
								result={status:0,msg:' failed 2nd image upload'}
							else	
							{
									console.log("success2");	
							}
						});
					}
					if(typeof carousel_3!='undefined' && carousel_3!=null)
					{
						var carousel_3_ext = path.extname(carousel_3.name);	
						var fileName3=carousel_3.md5+carousel_3_ext;	
						fileNames+=fileName3+",";
						DA_Car_Image3='Profile/' + ProfileName+"/"+fileName3;
						var uploadPath3 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName3;
						carousel_3.mv(uploadPath3, function(err) 
						{
							if (err)
								result={status:0,msg:' failed 3rd image upload'}
							else	
							{
									console.log("success3");	
							}
						});
					}
				
					
				
					var trimmedIds = fileNames.replace(/^,|,$/g,'');
					var fileArray=[trimmedIds];	
					var DA_Collection=JSON.stringify(fileArray);
					console.log(DA_Collection)
		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Car_Image1,DA_Car_Image2,DA_Car_Image3,carousel_title_1,carousel_title_2,carousel_title_3]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Car_Image1,DA_Car_Image2,DA_Car_Image3,DA_Car_Image1_Title,DA_Car_Image2_Title,DA_Car_Image3_Title) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{						
								
						res.json({status:1,msg:"done",DA_Collection:DA_Collection});
						
					}	
				});
					
		}
	}

})

                              
                                           
                                           
                                           
                                           
//25-jun-2021
app.post('/admin/updateImageCarousel',async function(req,res){

	let videoFile,imageFile,coverFile,album;
	let uploadPath;
	var JM_ID=req.body.JM_ID;
	var DA_ID=req.body.DA_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var DA_Type=req.body.DA_Type;
	var fileName="";
	var DA_Car_Image1='NA';
	var DA_Car_Image2='NA'; 
	var DA_Car_Image3='NA';

	var carousel_title_1=req.body.carousel_title_1;
	var carousel_title_2=req.body.carousel_title_2;
	var carousel_title_3=req.body.carousel_title_3;

	if (!req.files || Object.keys(req.files).length === 0) 
	{		
			
  		let sql="Update direct_access_master_user set DA_Car_Image1_Title='"+carousel_title_1+"',DA_Car_Image2_Title='"+carousel_title_2+"',DA_Car_Image3_Title='"+carousel_title_3+"' where DA_ID="+DA_ID;
		const rows = await model.sqlPromise(sql);
		if(rows.affectedRows==1)
			res.json({status:1,msg:'Updated',DA_DA_ID:4});	
		else
			res.json({status:0,msg:'error in updating',DA_DA_ID:4});	

	}
	else
	{
		console.log("file exist ---> "+ DA_Type);
	
		if(DA_Type=="image") 
		{
			
					let carousel_1 = req.files.carousel_1;
					let carousel_2 = req.files.carousel_2;
					let carousel_3 = req.files.carousel_3;
					console.log("carousel_1")
					console.log(carousel_1)

					console.log("carousel_2")
					console.log(carousel_2)

					console.log("carousel_3")
					console.log(carousel_3)
				
				
					
					var fileNames="";var countResponse=0;
					if(typeof carousel_1!='undefined' && carousel_1!=null)
					{
						var carousel_1_ext = path.extname(carousel_1.name);	
						var fileName1=carousel_1.md5+carousel_1_ext;
						fileNames+=fileName1+",";
						DA_Car_Image1='Profile/' + ProfileName+"/"+fileName1;
						var uploadPath1 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName1;
						carousel_1.mv(uploadPath1, async function(err) 
						{
							if (err)
								result={status:0,msg:' failed 1st image upload'}
							else	
							{
								console.log("success1");	
								
							}
						});
						
					}
					if(typeof carousel_2!='undefined' && carousel_2!=null)
					{						
						var carousel_2_ext = path.extname(carousel_2.name);	
						var fileName2=carousel_2.md5+carousel_2_ext;
						fileNames+=fileName2+",";
						DA_Car_Image2='Profile/' + ProfileName+"/"+fileName2;
						var uploadPath2 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName2;
						carousel_2.mv(uploadPath2, async function(err) 
						{
							if (err)
								result={status:0,msg:' failed 2nd image upload'}
							else	
							{
								console.log("success2");	
								
							}
						});
					}
					if(typeof carousel_3!='undefined' && carousel_3!=null)
					{
						var carousel_3_ext = path.extname(carousel_3.name);	
						var fileName3=carousel_3.md5+carousel_3_ext;	
						fileNames+=fileName3+",";
						DA_Car_Image3='Profile/' + ProfileName+"/"+fileName3;
						var uploadPath3 = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName3;
						carousel_3.mv(uploadPath3, async function(err) 
						{
							if (err)
								result={status:0,msg:' failed 3rd image upload'}
							else	
							{
									console.log("success3");	
								
								
							}
						});
					}


							if(DA_Car_Image1!='NA')
                            {
								let sql="Update direct_access_master_user set DA_Car_Image1='"+DA_Car_Image1+"' where DA_ID="+DA_ID;
								const rows = await model.sqlPromise(sql);
								console.log("update1")
								console.log(rows)
								countResponse++;
                            }
							if(DA_Car_Image2!='NA')
                            {
								let sql="Update direct_access_master_user set DA_Car_Image2='"+DA_Car_Image2+"'  where DA_ID="+DA_ID;
								const rows = await model.sqlPromise(sql);
								console.log("update2")
								console.log(rows)
								countResponse++;
                            }
							if(DA_Car_Image3!='NA')
                            {
									let sql="Update direct_access_master_user set DA_Car_Image3='"+DA_Car_Image3+"' where DA_ID="+DA_ID;
									const rows = await model.sqlPromise(sql);
									console.log("update3")
									console.log(rows)
									countResponse++;
                            }
								

																		
  								let sql="Update direct_access_master_user set DA_Car_Image1_Title='"+carousel_title_1+"',DA_Car_Image2_Title='"+carousel_title_2+"',DA_Car_Image3_Title='"+carousel_title_3+"' where DA_ID="+DA_ID;
								const response = await model.sqlPromise(sql);
				
					
					if(countResponse > 0 || response.affectedRows==1)
					{
						res.json({status:1,msg:'updated',DA_ID:DA_ID});	
					}
					else
					{
						res.json({status:0,msg:'nothing to update',DA_ID:DA_ID});	
					}
					
		}
	}

})




//do decline and refund

app.post('/admin/refund',async (req,res)=>{
	var request = require('request');

	var pay_id=req.body.paymentId;
	var BM_ID=req.body.BM_ID;

	var html="";
	var followerName=req.body.data.BM_Name;
	var Creator_Name=req.body.data.JM_Name;
	var purchased_date=req.body.data.BM_Purchase_Date; 
	var JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;
	var DA_Title=req.body.data.DA_Title;
	var BM_Purchase_Amt=req.body.data.BM_Purchase_Amt;
	var BM_Email=req.body.data.BM_Email;
	var BM_Phone=req.body.data.BM_Phone;

	var ES_ID=req.body.data.ES_ID;
	var JM_ID=req.body.data.JM_ID;
	var DA_DA_ID=req.body.data.DA_DA_ID;


		var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
		var mailOptions = {
			from: "Expy Admin <admin@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been declined.",			
			html: html
		}


	
		//let url="https://rzp_test_FLoVSsJykW8cff:YY9ZWVKr9rH7obEDOJA4f49P@api.razorpay.com/v1/payments/"+pay_id+"/refund";
	
	//live must uncomment before live
	let url="https://rzp_live_dBcgBotnhmUdtA:2uvZW0HgnI8bY9hX75PdxkMQ@api.razorpay.com/v1/payments/"+pay_id+"/refund";
	
	request({
	  method: 'POST',
	  url: url,
	}, function (error, response, body) {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
		
        if(response.statusCode!=400)
        {

			transporter.sendMail(mailOptions, async (error, info) => {
				if (error) 
				{
					res.json({
						status:1,
						msg:"mail error",
						statusCode:response.statusCode
					});
					
				}
				else
				{
					
							//update status
							let sql = "UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
							let query = connection.query(sql, async (err, results) => {
							if(err) 
							{
								console.log(err);
								res.json({status:1,msg:"unable to query "});
							}
							else
							{
								if(DA_DA_ID===5)
								{
									var response=await unblockSlot(JM_ID,ES_ID);
								}
								
								let msg="Hi "+BM_Name+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
								
								var isSentSMS=sendSMS(BM_Phone,msg);
								res.json({
											status:1,
											msg:'refund done',
											statusCode:response.statusCode
									});
							}	
						});
					
				}	
			});
					

        }
		else
        {
			res.json({status:0,msg:'failed'});
        }
		
	});

})

//17-jul-2021 mail id change
app.post("/admin/capture", async function(req,res)
{

		let paymentId=req.body.paymentId;
		var premium_url=process.env.PREMIUM_URL;
		var DA_ID=req.body.DA_ID;
		var BM_Instruction=req.body.BM_Instruction;
		var BM_Name=req.body.BM_Name;
		var BM_Email=req.body.BM_Email;
		var BM_Phone=req.body.BM_Phone;
		var BM_Password=req.body.BM_Password;
		var LM_ID=req.body.LM_ID;

		var JM_Name=req.body.JM_Name;
		var DA_Title=req.body.DA_Title;

		var BM_Purchase_Amt=req.body.amount;
		const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
		//var BM_Purchase_Amt=1;
		console.log("paymentId ->  "+ paymentId)

		console.log("DA_ID ->  "+ DA_ID)
		var fs = require('fs');

		var Consent=req.body.Consent;

		if(paymentId!='' && DA_ID > 0)
		{
		
			model.getPremiumContent_By_Id(DA_ID, async function(results)
			{
				records = results;
				
				var string=JSON.stringify(results);				
				var jsonRes =  JSON.parse(string);	
				var fileArr=JSON.parse(jsonRes[0].DA_Collection);		
				var JM_Profile_Url=	jsonRes[0].JM_Profile_Url;
				var JM_User_Profile_Url=jsonRes[0].JM_User_Profile_Url;
				var DA_DA_ID=jsonRes[0].DA_DA_ID;
				var JM_Email=jsonRes[0].JM_Email;
				var JM_Name=jsonRes[0].JM_Name;

				var JM_Phone=jsonRes[0].JM_Phone;
				var JM_Email_Pref=jsonRes[0].JM_Email_Pref;
				var JM_SMS_Pref=jsonRes[0].JM_SMS_Pref;
				if(fileArr!=null && fileArr.length > 0 && fileArr.length==1)
				{


					console.log(fileArr[0]);
					var fileName=fileArr[0];	

					var name =path.parse(fileName).name;    
					var ext = path.extname(fileName);
					var sourceDir="";
					if(fileName!="thankYou.jpg")
                    {
						 sourceDir = 'uploads/Profile/'+JM_Profile_Url+"/"+fileName;		
                    }
					else
                    {
 					     sourceDir = "uploads/"+fileName;	
                    }
                                       			
					let destDir=	'store';
					var unique_id=cryptoRandomString({length: 20, type: 'alphanumeric'});

					const pathToFile = path.join(__dirname, sourceDir)
					const pathToNewDestination = path.join(__dirname, destDir,"expy_"+unique_id+"_"+fileName);
					var BM_Url_ID=unique_id;				
					var NewfileArray=["expy_"+BM_Url_ID+"_"+fileName]
					var BM_FileUrl=JSON.stringify(NewfileArray);

					var downLoadContent=process.env.BASE_URL+"adm/"+sourceDir;


					console.log(BM_FileUrl);
					fs.copyFile(pathToFile, pathToNewDestination, async function(err) 
					{
						console.log("inside copyFile");
						if (err) 
						{
							res.json({status:0,err:err});
						} 
						else 
						{							

							console.log("Successfully copied and moved the file!")
							var Status='P';
							if(DA_DA_ID == 2)
								Status='C';

							const values = [
								[DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,paymentId,Status]			
							];
							const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,Payment_ID,Status) VALUES ?; UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;	  	  
							const query = connection.query(sql, [values], async function(err, result) {
								if (err) 
								{
									console.log(err);
									res.json({status:0,msg:err});
								}
								else
								{
									var datetime = new Date();
									console.log(datetime.toISOString().slice(0,10));
									var purchased_date=datetime.toISOString().slice(0,10);
									var text="Product Link : "+premium_url+BM_Url_ID;								
									var html="";var from='Expy Admin <info@expy.bio>';
									// for followers
									if(DA_DA_ID == 2) // unlock content
									{
										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>download content</b></a> <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										from='Expy Team <info@expy.bio>';
									}
									else //any request
										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. </p>                 <p> To ensure a smooth experience for both the creators and requesters on Expy, the creator will need to accept your request before fulfilling the request. </p>                    <p>If the creator chooses to decline it, you will receive a full refund of your amount within 48 hours from the decline date.</p>                 <p>We will notify you as soon as the creator accepts or declines the request.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
								

									var mailOptions = {
                                        from: from,
                                        to: BM_Email,
                                        subject: "Transaction Success on Expy!",
                                        text: "Thanks for Buying product",
                                       //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									     html: html
                                    }
									var mailOptionsAdmin = {
                                        from: "Expy Admin <admin@expy.bio>",
                                        to: BM_Email,
                                        subject: "Transaction Success on Expy!",
                                        text: "Thanks for Buying product",
                                       //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									     html: html
                                    }
									// for creators
									var NewreqEmail='',NewunlockEmail='',NewSelleingEmail='';
									var mailOptions2={};		var mailOptionsAdminFollower={};
									var msg="";
									if(DA_DA_ID == 1)
									{

										NewreqEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! You have received a new Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>To ensure your followers have a smooth time purchasing from you, you have 7 days to decline or accept, and 14 days to complete from the date of request. Beyond this, the request will be automatically declined. </p><p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify'>click here.</a></p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										mailOptions2 = {
											from: "Expy Admin <info@expy.bio>",
											to: JM_Email,
											subject: "You have received a new Premium Request on Expy!",
											text: "Thanks for Buying product",										  
											html: NewreqEmail
										}
										mailOptionsAdminFollower = {
											from: "Expy Admin <admin@expy.bio>",
											to: JM_Email,
											subject: "You have received a new Premium Request on Expy!",
											text: "Thanks for Buying product",										  
											html: NewreqEmail
										}


										 msg="Congrats "+JM_Name+" You have received a New Personalized Message Request on Expy. To accept/decline visit: expy.bio/notify";
									}
									if(DA_DA_ID == 2) //unlock content
									{
										NewunlockEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your content has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										mailOptions2 = {
											from: from,
											to: JM_Email,
											subject: "Someone has purchased your content on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewunlockEmail
										}

										mailOptionsAdminFollower = {
											from: "Expy Admin <admin@expy.bio>",
											to: JM_Email,										
											subject: "Someone has purchased your content on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewunlockEmail
										}

										msg="Congrats "+JM_Name+" You have made a new sale of your Premium Content on your Expy page. To view details visit: expy.bio/notify";
									}
									if(DA_DA_ID == 3)
									{
										NewSelleingEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your Product has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										mailOptions2 = {
											from: "Expy Admin <info@expy.bio>",
											to: JM_Email,
											subject: "Someone has purchased your e-commerce product on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewSelleingEmail
										}

										mailOptionsAdminFollower = {
											from: "Expy Admin <admin@expy.bio>",
											to: JM_Email,
											subject: "Someone has purchased your e-commerce product on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewSelleingEmail
										}
										msg="Congrats "+JM_Name+" You have made a new sale of your Premium Content on your Expy page. To view details visit: expy.bio/notify";
									}
							
								
									var emailAdmin=await wrapedSendMail(mailOptionsAdmin);
									var resp2=await wrapedSendMailInfo(mailOptions);
									// send mail to follower/buyer		
                                //    transporter.sendMail(mailOptions, async (error, info) => {
                                //     if (error) 
								// 	{
                                //            res.json({status:0,msg:"mail not sent to buyer",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,error:error,mailOptions:mailOptions});
                                //     }
								// 	else
								// 	{
										if(resp2)
										{
											if(JM_Email_Pref=='Y' && JM_SMS_Pref=='Y')
											{
												
												  var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
													var resp=await wrapedSendMailInfo(mailOptions2);
													var isSentSMS=sendSMS(JM_Phone,msg);
													console.log(isSentSMS);	
													if(isSentSMS)
													{
														res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
													}
													else
													{
														res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
													}
													// transporter.sendMail(mailOptions2, (error, info) => 
													// {
													// 	if (error) 
													// 	{
																
													// 			var isSentSMS=sendSMS(JM_Phone,msg);
													// 			if(isSentSMS)
													// 			{
													// 				res.json({status:1,msg:"mail sent and sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
													// 			}
													// 			else
													// 			{
													// 				res.json({status:1,msg:"mail sent , sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
													// 			}
																
													// 	}
													// 	else
													// 	{
													// 			console.log("isSentSMS");		
													// 			//msg="Hello sam, This is a test message from spring edge";
															
													// 	}	
													// });
											}
											else if(JM_Email_Pref=='Y' && JM_SMS_Pref=='N')
											{
												
												var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
												var resp=await wrapedSendMailInfo(mailOptions2);
												if(resp)
												{
													res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
												}
												else
												{
													res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
												}

											}	
											else if(JM_Email_Pref=='N' && JM_SMS_Pref=='Y')
											{
												var isSentSMS=sendSMS(JM_Phone,msg);
												if(isSentSMS)
												{
													res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
												}
												else
												{
													res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,JM_Phone:JM_Phone});
												}
											}
										}
										else
										{
											res.json({status:0,msg:"mail not sent to buyer",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,error:error,mailOptions:mailOptions});
										}
								// 	}
                                      
                                //   });

									
								}	
							});

						}

					});
					
				}
				// if purchased for multiple files
				if(fileArr!=null && fileArr.length > 0 && fileArr.length > 1)
				{
					console.log("multiple file code")
				}
                else
                {

                }
			
			});
		}
		else
		{
			console.log('no payment id');
			res.json({status:0,msg:"no payment id"});
		}
		

});


//30-jun-2021

// app.post("/admin/capture", function(req,res)
// {

// 		let paymentId=req.body.paymentId;
// 		var premium_url=process.env.PREMIUM_URL;
// 		var DA_ID=req.body.DA_ID;
// 		var BM_Instruction=req.body.BM_Instruction;
// 		var BM_Name=req.body.BM_Name;
// 		var BM_Email=req.body.BM_Email;
// 		var BM_Phone=req.body.BM_Phone;
// 		var BM_Password=req.body.BM_Password;
// 		var LM_ID=req.body.LM_ID;

// 		var JM_Name=req.body.JM_Name;
// 		var DA_Title=req.body.DA_Title;

// 		var BM_Purchase_Amt=req.body.amount;
// 		const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
// 		//var BM_Purchase_Amt=1;
// 		console.log("paymentId ->  "+ paymentId)

// 		console.log("DA_ID ->  "+ DA_ID)
// 		var fs = require('fs');

// 		var Consent=req.body.Consent;

// 		if(paymentId!='' && DA_ID > 0)
// 		{
		
// 			model.getPremiumContent_By_Id(DA_ID,function(results)
// 			{
// 				records = results;
				
// 				var string=JSON.stringify(results);				
// 				var jsonRes =  JSON.parse(string);	
// 				var fileArr=JSON.parse(jsonRes[0].DA_Collection);		
// 				var JM_Profile_Url=	jsonRes[0].JM_Profile_Url;
// 				var JM_User_Profile_Url=jsonRes[0].JM_User_Profile_Url;
// 				var DA_DA_ID=jsonRes[0].DA_DA_ID;
// 				var JM_Email=jsonRes[0].JM_Email;
// 				var JM_Name=jsonRes[0].JM_Name;

// 				var JM_Phone=jsonRes[0].JM_Phone;
// 				var JM_Email_Pref=jsonRes[0].JM_Email_Pref;
// 				var JM_SMS_Pref=jsonRes[0].JM_SMS_Pref;
// 				if(fileArr!=null && fileArr.length > 0 && fileArr.length==1)
// 				{


// 					console.log(fileArr[0]);
// 					var fileName=fileArr[0];	

// 					var name =path.parse(fileName).name;    
// 					var ext = path.extname(fileName);
// 					var sourceDir="";
// 					if(fileName!="thankYou.jpg")
//                     {
// 						 sourceDir = 'uploads/Profile/'+JM_Profile_Url+"/"+fileName;		
//                     }
// 					else
//                     {
//  					     sourceDir = "uploads/"+fileName;	
//                     }
                                       			
// 					let destDir=	'store';
// 					var unique_id=cryptoRandomString({length: 20, type: 'alphanumeric'});

// 					const pathToFile = path.join(__dirname, sourceDir)
// 					const pathToNewDestination = path.join(__dirname, destDir,"expy_"+unique_id+"_"+fileName);
// 					var BM_Url_ID=unique_id;				
// 					var NewfileArray=["expy_"+BM_Url_ID+"_"+fileName]
// 					var BM_FileUrl=JSON.stringify(NewfileArray);

// 					var downLoadContent=process.env.BASE_URL+"adm/"+sourceDir;


// 					console.log(BM_FileUrl);
// 					fs.copyFile(pathToFile, pathToNewDestination, function(err) 
// 					{
// 						console.log("inside copyFile");
// 						if (err) 
// 						{
// 							res.json({status:0,err:err});
// 						} 
// 						else 
// 						{							

// 							console.log("Successfully copied and moved the file!")
// 							var Status='P';
// 							if(DA_DA_ID == 2)
// 								Status='C';

// 							const values = [
// 								[DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,paymentId,Status]			
// 							];
// 							const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,Payment_ID,Status) VALUES ?; UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;	  	  
// 							const query = connection.query(sql, [values], function(err, result) {
// 								if (err) 
// 								{
// 									console.log(err);
// 									res.json({status:0,msg:err});
// 								}
// 								else
// 								{
// 									var datetime = new Date();
// 									console.log(datetime.toISOString().slice(0,10));
// 									var purchased_date=datetime.toISOString().slice(0,10);
// 									var text="Product Link : "+premium_url+BM_Url_ID;								
// 									var html="";
// 									// for followers
// 									if(DA_DA_ID == 2) // unlock content
// 									{
// 										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>download content</b></a> <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
// 									}
// 									else //any request
// 										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. </p>                 <p> To ensure a smooth experience for both the creators and requesters on Expy, the creator will need to accept your request before fulfilling the request. </p>                    <p>If the creator chooses to decline it, you will receive a full refund of your amount within 48 hours from the decline date.</p>                 <p>We will notify you as soon as the creator accepts or declines the request.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
								

// 									var mailOptions = {
//                                         from: "Expy Admin <admin@expy.bio>",
//                                         to: BM_Email,
//                                         subject: "Transaction Success on Expy!",
//                                         text: "Thanks for Buying product",
//                                        //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
// 									     html: html
//                                     }

// 									// for creators
// 									var NewreqEmail='',NewunlockEmail='',NewSelleingEmail='';
// 									var mailOptions2={};
// 									var msg="";
// 									if(DA_DA_ID == 1)
// 									{

// 										NewreqEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! You have received a new Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>To ensure your followers have a smooth time purchasing from you, you have 7 days to decline or accept, and 14 days to complete from the date of request. Beyond this, the request will be automatically declined. </p><p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify'>click here.</a></p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
// 										mailOptions2 = {
// 											from: "Expy Admin <admin@expy.bio>",
// 											to: JM_Email,
// 											subject: "You have received a new Premium Request on Expy!",
// 											text: "Thanks for Buying product",										  
// 											html: NewreqEmail
// 										}
// 										 msg="Hi "+JM_Name+", You have received a new Premium Request on Expy. Team Expy";
// 									}
// 									if(DA_DA_ID == 2) //unlock content
// 									{
// 										NewunlockEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your content has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
// 										mailOptions2 = {
// 											from: "Expy Admin <admin@expy.bio>",
// 											to: JM_Email,
// 											subject: "Someone has purchased your content on Expy! ",
// 											text: "Thanks for Buying product",										  
// 											html: NewunlockEmail
// 										}
// 										 msg="Hi "+JM_Name+", Someone has purchased your e-commerce product on Expy. Team Expy";
// 									}
// 									if(DA_DA_ID == 3)
// 									{
// 										NewSelleingEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your Product has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
// 										mailOptions2 = {
// 											from: "Expy Admin <admin@expy.bio>",
// 											to: JM_Email,
// 											subject: "Someone has purchased your e-commerce product on Expy! ",
// 											text: "Thanks for Buying product",										  
// 											html: NewSelleingEmail
// 										}
// 										 msg="Hi "+JM_Name+", Someone has purchased your e-commerce product on Expy. Team Expy";
// 									}
							

// 									// send mail to follower/buyer		
//                                    transporter.sendMail(mailOptions, (error, info) => {
//                                     if (error) 
// 									{
//                                          res.json({status:0,msg:"mail not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result,error,mailOptions:mailOptions});
//                                     }
// 									else
// 									{
// 										if(JM_Email_Pref=='Y' && JM_SMS_Pref=='Y')
// 										{
// 												transporter.sendMail(mailOptions2, (error, info) => 
// 												{
// 													if (error) 
// 													{
															
// 															var isSentSMS=await sendSMS(JM_Phone,msg);
// 															if(isSentSMS)
// 															{
// 																res.json({status:1,msg:"mail not sent and sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 															}
// 															else
// 															{
// 																res.json({status:1,msg:"mail sent , sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 															}
															
// 													}
// 													else
// 													{
// 															console.log('Message %s sent: %s', info.messageId, info.response);													
// 															var isSentSMS=await sendSMS(JM_Phone,msg);
// 															if(isSentSMS)
// 															{
// 																res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 															}
// 															else
// 															{
// 																res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 															}
// 													}	
// 											  });
// 										}
// 										else if(JM_Email_Pref=='Y' && JM_SMS_Pref=='N')
// 										{
// 											var resp=wrapedSendMail(mailOptions2);
// 											if(resp)
// 											{
// 												res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 											}
// 											else
// 											{
// 												res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 											}

// 										}	
// 										else if(JM_Email_Pref=='N' && JM_SMS_Pref=='Y')
// 										{
// 											var isSentSMS=sendSMS(JM_Phone,msg);
// 											if(isSentSMS)
// 											{
// 												res.json({status:1,msg:"mail sent, sms sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 											}
// 											else
// 											{
// 												res.json({status:1,msg:"mail sent, sms not sent",url:downLoadContent,arr:req.body,DA_DA_ID:DA_DA_ID,result:result});
// 											}
// 										}
// 									}
                                      
//                                   });

									
// 								}	
// 							});

// 						}

// 					});
					
// 				}
// 				// if purchased for multiple files
// 				if(fileArr!=null && fileArr.length > 0 && fileArr.length > 1)
// 				{
// 					console.log("multiple file code")
// 				}
//                 else
//                 {

//                 }
			
// 			});
// 		}
// 		else
// 		{
// 			console.log('no payment id');
// 			res.json({status:0,msg:"no payment id"});
// 		}
		

// });


//21-jun-2021







  app.post("/admin/capture2", function(req,res)
  {
  
  let paymentId=req.body.paymentId;
  var premium_url=process.env.PREMIUM_URL;
  var DA_ID=req.body.DA_ID;
  var BM_Instruction=req.body.BM_Instruction;
  var BM_Name=req.body.BM_Name;
  var BM_Email=req.body.BM_Email;
  var BM_Phone=req.body.BM_Phone;
  var BM_Password=req.body.BM_Password;
  
		  var JM_Name=req.body.JM_Name;
		  var DA_Title=req.body.DA_Title;
  
	  var BM_Purchase_Amt=req.body.amount;
		  const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
		  //var BM_Purchase_Amt=1;
		  console.log("paymentId ->  "+ paymentId)
  
		  console.log("DA_ID ->  "+ DA_ID)
		  var fs = require('fs');
  
		  var Consent=req.body.Consent;
  
		  if(paymentId!='' && DA_ID > 0)
		  {

			model.getPremiumContent_By_Id(DA_ID,function(results)
			{
				records = results;
			    res.json({status:0,msg:req.body,records:records,DA_ID:DA_ID});

			});

		  }
		  else
		  {
			  console.log('no payment id');
			  res.json({status:0,msg:"no payment id"});
		  }
		  
		  
  
});



app.get('/admin/copyfile',function(req,res){


	  
	var fileName="198918f40ecc7cab0fc4231adaf67c96.mp4";	
	var name =path.parse(fileName).name;
	 const fs = require('fs');
	

	var ext = path.extname(fileName);
	console.log(name);
	const pathToFile = path.join(__dirname, "uploads/Profile/bob_45/198918f40ecc7cab0fc4231adaf67c96.mp4");

	const pathToNewDestination = path.join(__dirname, "store", "customfile"+ext);
	
     

  fs_Extra.copy(pathToFile, pathToNewDestination, function (err) 
    {
      if (err) 
      {
     	 res.json({status:0,lastId:0,msg:err});
      } 
      else 
      {         	
      
     	 res.json({status:1,lastId:0,msg:"successfull"});
      }

    });





});

app.get('/admin/fold',function(req,res){
	
	var src = "./uploads/Profile/sam_16/451ee5c982a22bfc5d650877823f3275.jpg";				
	let destDir='./store';	

	  
	var fileName="451ee5c982a22bfc5d650877823f3275.jpg";	
	var name =path.parse(fileName).name;
	const fs = require('fs');
	

	var ext = path.extname(fileName);
	console.log(name);
	const pathToFile = path.join(__dirname, "uploads/Profile/sam_9999");
	const pathToNewDestination = path.join(__dirname, "store", "your-file-copy"+ext);

	
	var chmodr = require('chmodr');

   chmodr(pathToFile, 0o777, (err) => {
  	if (err) {
      console.log('Failed to execute chmod', err);
    } else {
      res.end('done');
    }
  });

	
});


































app.get('/admin/folder/', function(req, res) {
    console.log("auth")
   
	var fileName="451ee5c982a22bfc5d650877823f3275.jpg";
	var name =path.parse(fileName).name;    
	var ext = path.extname(fileName);
	console.log(name);
	const pathToFile = path.join(__dirname, "uploads/Profile/sam_16/451ee5c982a22bfc5d650877823f3275.jpg")
	const pathToNewDestination = path.join(__dirname, "store", "your-file-copy"+ext);

		
		ren.json({pathToFile:__dirname});
});



app.post('/auth', function(request, response) {

console.log("auth")
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

	var AM_Email = request.body.AM_Email;
	var AM_Password = request.body.AM_Password;
	if (AM_Email && AM_Password)
	 {
		connection.query('SELECT * FROM admin_master WHERE AM_Email = ? AND AM_Password = ?', [AM_Email, AM_Password], function(error, results, fields) {
	
			if (results.length > 0) 
			{
				request.session.loggedin = true;
				request.session.AM_Email = AM_Email;
				request.session.AM_ID= results[0].AM_ID;
				request.session.userDetails= results;
				console.log(request.session.AM_ID);
				response.json({status:1,msg:"success",userDetails:request.session.userDetails});
			
			} 
			else 
			{
				response.json({status:0,msg:"wrong username or password"});
			}					
		});
	} else {
		response.json({status:0,msg:'Please enter Username and Password!'});		
	}
});

app.get('/logout', (req, res) => 
{
	req.session.destroy((err) => 
	{
		res.redirect('/') // will always fire after session is destroyed
	})
});




















//======================================================================== API front end


const bcrypt = require('bcrypt');
const saltRounds = 10;

app.get('/admin/hashpassword/:key', function(req, res) {
	var password = req.params.key;
	const hashPassword = bcrypt.hashSync(password, saltRounds);
	const match = bcrypt.compareSync(password, hashPassword); // true
	 console.log(match);  
	// res.end(password + " " );
	// res.end(" matched "+match + " ");
	 res.end(" password  "+password + " hashPassword  "+  hashPassword +" matched "+match + " ");
});










//11-apr-2021
app.post('/admin/validReferralCode',(req,res)=>{

	res.setHeader('Access-Control-Allow-Origin', '*');	
	let code=req.body.code;
	connection.query('SELECT * FROM referal_code_master WHERE Code = ?',[code], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:0,
			  msg:error
			  })
		}
		else
		{
			if(results.length > 0)
				res.json({status:1,msg:'match'});
			else
				res.json({status:0,msg:'Invalid Referral Code'});
		}
	});

})


app.post('/admin/sendReuqest',(req,res)=>{

	let Ref_Email=req.body.Ref_Email;
	let Ref_Name=req.body.Ref_Name;
	let Ref_Social=req.body.Ref_Social;
	const values=[
		[Ref_Email,Ref_Name,Ref_Social]
	]
	if(Ref_Email.length > 0)
	{
		const sql = "INSERT INTO  referral_code_request(Ref_Email,Ref_Name,Ref_Social) VALUES ?";
		const query = connection.query(sql, [values], function(err, result) 
		{
			if (err) 
			{
				res.json({status:0,msg:err});
			}
			else
			{
				let id=result.insertId;
				if(id > 0)
					res.json({status:1,msg:"Request has been sent to admin"});
				else
					res.json({status:0,msg:"unable to send Request, Try after sometimes"});
			}
		});
	}
	else
	{
		res.json({status:0,msg:"empty email id"});
	}
})








//22-apr-2021
//Letter
app.post('/admin/letter', function(req, res) {

	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(req.body.news_email.length==0)
	{
		res.json({status:0,lastId:0,msg:"empty Email"});
		return false;
	}	
	
	let news_email=req.body.news_email;
	const values=[
		[news_email]
	]
		const sql = "INSERT INTO  news_letter (Email) VALUES ?";
		const query = connection.query(sql, [values], function(err, result) 
		{
			if (err) 
			{
				res.json({status:0,msg:err});
			}
			else
			{
				let id=result.insertId;
				if(id > 0)
					res.json({status:1,msg:"Request has been sent to admin"});
				else
					res.json({status:0,msg:"unable to send Request, Try after sometimes"});
			}
		});
});




//json post
app.post('/admin/join', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');	

	if(req.body.JM_Name=="")
	{
		res.json({status:0,lastId:0,msg:"empty name"});
		return false;
	}
	if(req.body.JM_Email=="")
	{
		res.json({status:0,lastId:0,msg:"empty Email"});
		return false;
	}
	if(req.body.JM_User_Profile_Url=="")
	{
		res.json({status:0,lastId:0,msg:"empty Url"});
		return false;
	}
	
	if(req.body.JM_Password=="")
	{
		res.json({status:0,lastId:0,msg:"empty Password"});
		return false;
	}

	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	connection.query('SELECT * FROM joining_master WHERE JM_User_Profile_Url = ?',[JM_User_Profile_Url], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in query execution',
				lastId:0
			  })
		}
		else
		{
			if(results.length >0)
			{
				res.json({
					status:0,
					msg:'Url is Not available',
					lastId:0
					})
			}	
			else
			{
				
                     const hashPassword = bcrypt.hashSync(req.body.JM_Password, saltRounds);
                    var ProfURL=req.body.JM_User_Profile_Url;
                    var sourceDir = path.join(__dirname,'/uploads/Links');

                    var status=false;


                    var data  = {
                            JM_Name: req.body.JM_Name,
                            JM_Email: req.body.JM_Email,
                            JM_Password:hashPassword,
                            JM_User_Profile_Url:req.body.JM_User_Profile_Url,
							JM_Referral:req.body.JM_Referral,
							JM_Phone:req.body.JM_Phone
                        };	
                        var tableName='joining_master';
                        let sql = "INSERT INTO joining_master SET ?";
                        let query = connection.query(sql, data,(err, results) => 
                        {
                                        if(err) 
                                            res.json({status:0,lastId:0,msg:"unable to insert",err:err});
                                        else
                                        {
                                            let JM_ID=results.insertId;
                                            var Profdir =  path.join(__dirname, 'uploads/Profile/'+ProfURL+"_"+JM_ID) ;
                                            var ProfdirLinks =  path.join(__dirname,'uploads/Profile/'+ProfURL+"_"+JM_ID+'/Links');

                                            //const pathToFile = path.join(__dirname, "uploads/Profile/sam_16/451ee5c982a22bfc5d650877823f3275.jpg");
                                                if (!fs.existsSync(Profdir))
                                                {
                                                    fs.mkdirSync(Profdir);

                                                    if (!fs.existsSync(ProfdirLinks))
                                                    {
                                                        fs.mkdirSync(ProfdirLinks);
                                                    }
                                                }

                                                fs_Extra.copy(sourceDir, ProfdirLinks, function (err) 
												{
                                                  if (err) 
                                                  {
                                                 	 console.error(err);
                                                  } 
                                                  else 
                                                  {      
													res.json({status:1,lastId:results.insertId,msg:"successfull"});
                                                                  
                                                  }

                                              });

                                        }
                        });

			}	
		}	
	});	



	

	   

		//model.InsertData(tableName,data);

});




app.post('/admin/ValidateURL', function(req, res) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	connection.query('SELECT * FROM joining_master WHERE JM_User_Profile_Url = ?',[JM_User_Profile_Url], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in query execution'
			  })
		}
		else
		{
			if(results.length >0)
			{
				res.json({
					status:1,
					msg:'Url is Not available'
					})
			}	
			else
			{
				res.json({
					status:0,
					msg:'available'
					})
			}	
		}	
	});	
		
});

app.post('/admin/ValidateEmail', function(req, res) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_Email=req.body.JM_Email;
	connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[JM_Email], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in query execution'
			  })
		}
		else
		{
			if(results.length >0)
			{
				res.json({
					status:1,
					msg:'Email is Not available'
					})
			}	
			else
			{
				res.json({
					status:0,
					msg:'available'
					})
			}	
		}	
	});	
		
});
app.post('/admin/update_url',async function(req,res){


	var JM_ID= req.body.JM_ID;
	var JM_Insta_Url=req.body.JM_Insta_Url;
	var JM_Utube_Url=req.body.JM_Utube_Url;
	var JM_Twiter_Url=req.body.JM_Twiter_Url;
	var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;
	//var profileName=JM_User_Profile_Url_plus_JM_ID;	
	
 //var profileName=JM_User_Profile_Url_plus_JM_ID;	
	if(JM_Insta_Url.length > 0 && JM_Utube_Url.length > 0 && JM_Twiter_Url.length > 0)
	{
		const values = [
			[JM_ID, 'Instagram',JM_Insta_Url,"faInstagram"],		
			[JM_ID, 'YouTube',JM_Utube_Url,"faYoutube"],	
			[JM_ID, 'Twitter',JM_Twiter_Url,"faTwitter"],
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Insta_Url.length > 0 && JM_Utube_Url.length > 0)
	{
		const values = [
			[JM_ID, 'Instagram',JM_Insta_Url,"faInstagram"],		
			[JM_ID, 'YouTube',JM_Utube_Url,"faYoutube"],				
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Insta_Url.length > 0 && JM_Twiter_Url.length > 0)
	{
		const values = [
			[JM_ID, 'Instagram',JM_Insta_Url,"faInstagram"],		
			[JM_ID, 'Twitter',JM_Twiter_Url,"faTwitter"],		
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Utube_Url.length > 0 && JM_Twiter_Url.length > 0)
	{
		const values = [
			[JM_ID, 'YouTube',JM_Utube_Url,"faYoutube"],	
			[JM_ID, 'Twitter',JM_Twiter_Url,"faTwitter"],		
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Insta_Url.length > 0)
	{
		const values = [
			[JM_ID, 'Instagram',JM_Insta_Url,"faInstagram"],		
					
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Utube_Url.length > 0)
	{
		const values = [
			[JM_ID, 'YouTube',JM_Utube_Url,"faYoutube"],	
					
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else if(JM_Twiter_Url.length > 0)
	{
		const values = [
			[JM_ID, 'Twitter',JM_Twiter_Url,"faTwitter"],						
		];
		const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";
		const query = connection.query(sal, [values], function(err, result) {
		  if (err) 
		  {
			  res.json({status:0,msg:err});
		  }
		  else
		  {
			  res.json({status:1,msg:'Done'});
		  }	
		});
	}
	else
	{
		res.json({status:1,msg:'Done'});
	}
	
});

app.post('/admin/profileImage',async function(req,res){
	let sampleFile;
	let uploadPath;
  
	if (!req.files || Object.keys(req.files).length === 0) {
	  return res.status(400).send('No files were uploaded.');
	}
	console.log("file exist");
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url;
	sampleFile = req.files.sampleFile;
	var fileName=sampleFile.name;
	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"_"+JM_ID+"/"+fileName;
	
	db_fileName="Profile/" + ProfileName+"_"+JM_ID+"/"+fileName;

	//28-jul-2021
	const token=await addToken(JM_ID);
	//=========================== create token 


	// Use the mv() method to place the file somewhere on your server
	let result={};
	console.log(db_fileName);
	sampleFile.mv(uploadPath,async function(err) 
	{
	  if (err)
	 	 result={status:0,msg:'Failed!'}
	  else	
	  {
			let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
			let query = connection.query(sql, async (err, results) => {
				if(err) 
					res.json({status:0,msg:"error in query"});
				else
				{
					
					var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+";Select * from direct_access_master_user where JM_ID="+JM_ID+"";
					connection.query(sql, async function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster,productList;
						if (!error)
						{
									user=results[0];
									directAccess=results[1];
									linkMaster=results[2];
									productList=results[3];
							
									const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color  FROM theme_master  WHERE theme_master.TM_ID=10";
						   			const query = connection.query(sql, async function(err2, result) {
										if (err2) 
										{
											console.log(err2);
											res.json({status:0,msg:err2});
										}
										else
										{
                                                let TMU_ID=result.insertId;
                                              	var text="Thank you for joinig Expy";
                                                var mailOptions = {
                                                        from: "Expy Admin <info@expy.bio>",
                                                        to: req.body.JM_Email,
                                                        subject: "Welcome to Expy!",
                                                        text: "Thank you for joinig Expy",
                                                        html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+req.body.JM_Name+",</h3><p>Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p>     <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
                                                    }
													var resp=await wrapedSendMailInfo(mailOptions);

													if(resp)
													{
														res.json({
															status:1,msg:'uploaded',
															JM_ID:JM_ID,
															userDetails:user,
															directAccess:directAccess,
															linkMaster:linkMaster,
															productList:productList,
															token:token					
														});	
													}
													else
														{
															res.json({
															  status:1,msg:'mail not send',
															  JM_ID:JM_ID,
															  userDetails:user,
															  directAccess:directAccess,
															  linkMaster:linkMaster,
															  productList:productList,
															  token:token						
														  });		
														}	

                                          
										}	
									});


									
						}	
						else
						{

								
							res.json({
								status:0,msg:'failed',
								JM_ID:0,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								productList:productList	
								});	
						}	
					});

				}
				
			});
		
	  }  
	
	});
	

});

//04-may-2021
app.post('/admin/profileImageFromProfile',async function(req,res){
	let sampleFile;
	let uploadPath;
  
	if (!req.files || Object.keys(req.files).length === 0) {
	  return res.status(400).send('No files were uploaded.');
	}
	console.log("file exist");
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url;
	sampleFile = req.files.sampleFile;
	var fileName=sampleFile.name;
	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"_"+JM_ID+"/"+fileName;
	
	db_fileName="Profile/" + ProfileName+"_"+JM_ID+"/"+fileName;

	// Use the mv() method to place the file somewhere on your server
	let result={};
	console.log(db_fileName);
	sampleFile.mv(uploadPath, function(err) 
	{
	  if (err)
	 	 result={status:0,msg:'Failed!'}
	  else	
	  {
		   let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
			let query = connection.query(sql, (err, results) => {
				if(err) 
					res.json({status:0,msg:"error in query"});
				else
				{
					
					var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+";Select * from direct_access_master_user where JM_ID="+JM_ID+"";
					connection.query(sql, function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster,productList;
						if (!error)
						{
									user=results[0];
									directAccess=results[1];
									linkMaster=results[2];
									productList=results[3];
							

		
							    res.json({
									status:1,msg:'uploaded',
									JM_ID:JM_ID,
									userDetails:user,
									directAccess:directAccess,
									linkMaster:linkMaster,
									productList:productList						
								});	

									
						}	
						else
						{

								
							res.json({
								status:0,msg:'failed',
								JM_ID:0,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								productList:productList	
								});	
						}	
					});

				}
				
			});
		
	  }  
	
	});
	

});



app.post('/admin/noprofileImage',async function(req,res){

					var JM_ID=req.body.JM_ID;
					//28-jul-2021
					const token=await addToken(JM_ID);
					//=========================== create token 
				
					var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+";Select * from direct_access_master_user where JM_ID="+JM_ID+"";
					connection.query(sql, async function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster,productList;
						if (!error)
						{
							user=results[0];
							directAccess=results[1];
							linkMaster=results[2];
							productList=results[3];
							//let sql = `INSERT INTO theme_master_user(TM_ID,JM_ID,TM_Back_Image,TM_Class_Name)  VALUES ?  `;
							let values = [
								[1,JM_ID,"theme/profile_back_1.jpg", "default_theme_1"]							
							];
							const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name FROM theme_master  WHERE theme_master.TM_ID=10";
						
							//const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
							const query = connection.query(sql, async function(err, result) {
								if (err) 
								{
									console.log(err);
									res.json({status:0,msg:err});
								}
								else
								{
                                         let TMU_ID=result.insertId;
							
                                          var text="Thank you for joinig Expy";
                                          var mailOptions = {
                                                  from: "Expy Admin <info@expy.bio>",
                                                  to: req.body.JM_Email,
                                                  subject: "Welcome To Expy!",
                                                  text: "Thank you for joinig Expy",
                                                  html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+req.body.JM_Name+",</h3><p>Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p>     <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
                                              }
											  var resp=await wrapedSendMailInfo(mailOptions);
											  if(resp)
											  {
												  res.json({
													  status:1,msg:'uploaded',
													  JM_ID:JM_ID,
													  userDetails:user,
													  directAccess:directAccess,
													  linkMaster:linkMaster,
													  productList:productList,
													  token:token								
												  });	
											  }
											  else
												  {
													  res.json({
														status:1,msg:'uploaded',
														JM_ID:JM_ID,
														userDetails:user,
														directAccess:directAccess,
														linkMaster:linkMaster,
														productList:productList,
														token:token					
													});		
												  }	
                                           

								}	
							});
	
						}	
						else
						{

								
							res.json({
								status:0,msg:'failed',
								JM_ID:0,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								productList:productList,
								token:''		
								});	
						}	
					});

				
})


//25-feb-2021
//AddCategory
app.post('/admin/AddCategory',function(req,res){
	let sampleFile;
	let uploadPath;
	
	var JM_ID=req.body.JM_ID;
	var CM_Folder_Title=req.body.CM_Folder_Title;
	var CM_Folder_Sub_Title=req.body.CM_Folder_Sub_Title;	
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	if(CM_Folder_Title=="")
	{
		res.json({status:0,msg:"Enter Folder Title "});
		return false;
	}
	if (!req.files) 
	{	

			var CM_Icon=req.body.LM_Icon;
         	
			const values = [
				[JM_ID, CM_Folder_Title,CM_Folder_Sub_Title,CM_Icon]
			
			];
			
			const sal = "INSERT INTO category_master(JM_ID,CM_Folder_Title, CM_Folder_Sub_Title,CM_Icon) VALUES ?";	  
			const query = connection.query(sal, [values], function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:"unable to add folder",err:err});
				
				}
				else
				{
					res.json({status:1,msg:'Successfully Added'});
				}	
			});
	}
	else
	{
		console.log("file exist");
		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		var JM_ID=req.body.JM_ID;
		var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
		sampleFile = req.files.sampleFile;

		var ext = path.extname(sampleFile.name);		
		var Name=sampleFile.md5;
		var fileName=Name+ext;
	

		uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;		
		var CM_Folder_Back_Image="Profile/" + ProfileName+"/"+fileName;
		console.log(fileName);
		let result={};
		sampleFile.mv(uploadPath, function(err) 
		{
			if (err)
				result={status:0,msg:'Failed! to upload icon'}
			else	
			{
					var CM_Icon="";
				const values = [
					[JM_ID, CM_Folder_Title,CM_Folder_Sub_Title,CM_Folder_Back_Image,CM_Icon]
				
				];
				
				const sal = "INSERT INTO category_master(JM_ID,CM_Folder_Title, CM_Folder_Sub_Title,CM_Folder_Back_Image,CM_Icon) VALUES ?";	  
				const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"unable to add folder",err:err});
					
					}
					else
					{
						res.json({status:1,msg:'Successfully Added'});
					}	
				});
			}  		
		});
	}

});
app.post('/admin/InsertLink',function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	  if (!req.files) 
	 {
		// File does not exist.
			console.log("No file");
			
			var LM_Title=req.body.LM_Title;
			var LM_Url=req.body.LM_Url;
			var LM_Image=req.body.LM_Image;
			var LM_Who_Will_See=req.body.LM_Who_Will_See;
			var LM_Icon=req.body.LM_Icon;

			const values = [
				[JM_ID, LM_Title,LM_Url,LM_Image,LM_Who_Will_See,LM_Icon]
			
			];
			
			const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See,LM_Icon) VALUES ?";	  
			const query = connection.query(sal, [values], function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				
				}
				else
				{
					res.json({status:1,msg:'Done'});
				}	
			});

	  } 
	  else 
	  {
		// File exists.
		console.log("File exists");
		sampleFile = req.files.sampleFile;
		var JM_ID=req.body.JM_ID;
		var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;
		var LM_Image=req.body.LM_Image;

		var fileName=sampleFile.name;
		var profileName=JM_User_Profile_Url_plus_JM_ID;	
		uploadPath = __dirname + '/uploads/Profile/'+profileName+"/Links/"+fileName;
		var LM_Image='Profile/'+profileName+"/Links/"+fileName;
		var LM_Title=req.body.LM_Title;
		var LM_Url=req.body.LM_Url;		

		var LM_Icon="";

		console.log(uploadPath);

		let result={};
		console.log(db_fileName);
		sampleFile.mv(uploadPath, function(err) 
		{
			if (err)
				result={status:0,msg:'Failed!'}
			else	
			{

				console.log("I m here");
				var LM_Who_Will_See=req.body.LM_Who_Will_See;
					const values = [
						[JM_ID, LM_Title,LM_Url,LM_Image,LM_Who_Will_See,LM_Icon]
					
					];
				const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See,LM_Icon) VALUES ?";	  
				const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{
						
						console.log("I m here2");
						res.json({status:1,msg:'Done'});
					}	
				});

			}
		});
	}
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
//09-mar-2021
//InsertEmbedContent
app.post('/admin/InsertEmbedContent',function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= req.body.JM_ID;

	console.log(JM_ID);
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}

	if(JM_ID > 0)
	{
		var sql1="SELECT count(*) cnt FROM embed_content where JM_ID="+JM_ID;
		connection.query(sql1, function (error, result, fields) 
		{
			
			if (!error)
			{	
				
				if(result.length)
				{
					var string=JSON.stringify(result);				
					var json =  JSON.parse(string);			
					console.log(json[0].cnt);		
					let cnt=json[0].cnt;
					if(cnt <=3 )
					{
						if (!req.files) 
						{
							// File does not exist.
                             	 var JM_ID=req.body.JM_ID;
								console.log("No file "+ JM_ID);
								
								var LM_Title=req.body.LM_Title;
								var LM_Url=req.body.LM_Url;
								var LM_Image=req.body.LM_Image;
								var LM_Who_Will_See=req.body.LM_Who_Will_See;
                              	
								const values = [
									[JM_ID, LM_Title,LM_Url,LM_Image,LM_Who_Will_See]
								
								];
								
								const sal = "INSERT INTO embed_content(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
								const query = connection.query(sal, [values], function(err, result) {
									if (err) 
									{
										console.log(err);
										res.json({status:0,msg:"error"});
									
									}
									else
									{
										res.json({status:1,msg:'Done'});
									}	
								});
					
						} 
						else 
						{
							// File exists.
							console.log("File exists");
							sampleFile = req.files.sampleFile;
							var JM_ID=req.body.JM_ID;
							var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;
							var LM_Image=req.body.LM_Image;
					
							var fileName=sampleFile.name;
							var profileName=JM_User_Profile_Url_plus_JM_ID;	
							uploadPath = __dirname + '/uploads/Profile/'+profileName+"/Links/"+fileName;
							var LM_Image='Profile/'+profileName+"/Links/"+fileName;
							var LM_Title=req.body.LM_Title;
							var LM_Url=req.body.LM_Url;		
							console.log(uploadPath);
					
							let result={};
							console.log(db_fileName);
							sampleFile.mv(uploadPath, function(err) 
							{
								if (err)
									result={status:0,msg:'Failed!'}
								else	
								{
					
									console.log("I m here");
									var LM_Who_Will_See=req.body.LM_Who_Will_See;
										const values = [
											[JM_ID, LM_Title,LM_Url,LM_Image,LM_Who_Will_See]
										
										];
									const sal = "INSERT INTO embed_content(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
									const query = connection.query(sal, [values], function(err, result) {
										if (err) 
										{
											console.log(err);
											res.json({status:0,msg:"error"});
										}
										else
										{
											
											console.log("I m here2");
											res.json({status:1,msg:'Done'});
										}	
									});
					
								}
							});
						}
					}
					else
					{
						res.json({
							status:0,
							msg:'Max Limit exceed',
							JM_ID:0					
						});	
					}
				}
				
				
					
			}
			else{
				res.json({
					status:0,
					msg:error,
					JM_ID:0					
				});	
			}
		});
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
app.post('/admin/UpdateEmbedContent',function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= req.body.JM_ID;
	var EC_ID=req.body.EC_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	 if (!req.files) 
	 {
		// File does not exist.
			console.log("No file");
			
			var LM_Title=req.body.LM_Title;
			var LM_Url=req.body.LM_Url;
			var LM_Image='';
			var LM_Who_Will_See=req.body.LM_Who_Will_See;
		
			let sql = "UPDATE embed_content SET  LM_Title='"+LM_Title+"',LM_Url='"+LM_Url+"',LM_Who_Will_See='"+LM_Who_Will_See+"' WHERE EC_ID="+EC_ID;
  
			//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Done'});
				}	
			});

	  } 
	  else 
	  {
		// File exists.
		console.log("File exists");
		sampleFile = req.files.sampleFile;

		var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;
		var LM_Image=req.body.LM_Image;

		var fileName=sampleFile.name;
		var profileName=JM_User_Profile_Url_plus_JM_ID;	
		uploadPath = __dirname + '/uploads/Profile/'+profileName+"/Links/"+fileName;
		var LM_Image='Profile/'+profileName+"/Links/"+fileName;
		var LM_Title=req.body.LM_Title;
		var LM_Url=req.body.LM_Url;		
		console.log(uploadPath);

		let result={};
		console.log(db_fileName);
		sampleFile.mv(uploadPath, function(err) 
		{
			if (err)
				result={status:0,msg:'Failed!'}
			else	
			{

				console.log("I m here");
				var LM_Who_Will_See=req.body.LM_Who_Will_See;
				
					let sql = "UPDATE embed_content SET  LM_Title='"+LM_Title+"',LM_Url='"+LM_Url+"',LM_Who_Will_See='"+LM_Who_Will_See+"', LM_Image='"+LM_Image+"' WHERE EC_ID="+EC_ID;
					let query = connection.query(sql, (err, results) => {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{
						
						console.log("I m here2");
						res.json({status:1,msg:'Done'});
					}	
				});

			}
		});
	}
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});


// maximum 3 embed content will be added
app.post('/admin/checkMaxEmbed',function(req,res){



});




//13-feb-2021
app.post('/admin/InsertSocialWidget',function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	
		// File does not exist.
			console.log("No file");
			
			var SWM_Title=req.body.SWM_Title;
			var SWM_Url=req.body.SWM_Url;
			var SWM_Icon=req.body.SWM_Icon;
			var SWM_Style_Type=req.body.SWM_Style_Type;
			const values = [
				[JM_ID, SWM_Title,SWM_Url,SWM_Icon,SWM_Style_Type]			
			];
			
			//const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon) VALUES ?";	  
			const sal = "INSERT INTO social_widget_master(JM_ID, SWM_Title, SWM_Url,SWM_Icon,SWM_Style_Type) VALUES ?";	  
		
			const query = connection.query(sal, [values], function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Done'});
				}	
			});

	
	 
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
app.post('/admin/UpdateSocialWidget',function(req,res){
		let sampleFile;
		let uploadPath;
		var db_fileName="";
		var SWM_ID= req.body.SWM_ID;
		var JM_ID= req.body.JM_ID;
		if(JM_ID==0)
		{
			res.json({status:0,msg:"error in id"});
			return false;
		}
		
			
			var SWM_Title=req.body.SWM_Title;
			var SWM_Url=req.body.SWM_Url;
			var SWM_Icon=req.body.SWM_Icon;
			var SWM_Style_Type=req.body.SWM_Style_Type;
			const values = [
				[SWM_ID, SWM_Title,SWM_Url,SWM_Icon,SWM_Style_Type]			
			];
			
			let sql = "UPDATE social_widget_master SET  SWM_Title='"+SWM_Title+"',SWM_Url='"+SWM_Url+"', SWM_Icon='"+SWM_Icon+"',SWM_Style_Type='"+SWM_Style_Type+"' WHERE JM_ID="+JM_ID+" and SWM_ID="+SWM_ID;
			//let sql = "UPDATE social_widget_master SET  SWM_Title='"+SWM_Title+"',SWM_Url='"+SWM_Url+"', SWM_Icon='"+SWM_Icon+"' WHERE JM_ID="+JM_ID+" and SWM_ID="+SWM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});

	
	 
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
app.post('/admin/UpdateLink',function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	  if (!req.files) 
	 {
		// File does not exist.
			console.log("No file");
			var LM_ID=req.body.LM_ID;
			var LM_Title=req.body.LM_Title;
			var LM_Url=req.body.LM_Url;
			var LM_Image=req.body.LM_Image;
			var LM_Who_Will_See=req.body.LM_Who_Will_See;
			var LM_Icon=req.body.LM_Icon;			
			let sql = "UPDATE link_master SET  LM_Title='"+LM_Title+"',LM_Url='"+LM_Url+"',LM_Who_Will_See='"+LM_Who_Will_See+"',LM_Icon='"+LM_Icon+"',LM_Image='"+LM_Image+"' WHERE LM_ID="+LM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
					res.json({status:1,msg:'Done'});
				}	
			});

	  } 
	  else 
	  {
		// File exists.
		console.log("File exists");
		sampleFile = req.files.sampleFile;
		var LM_ID=req.body.LM_ID;
		var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;
		var LM_Image=req.body.LM_Image;

		var fileName=sampleFile.name;
		var profileName=JM_User_Profile_Url_plus_JM_ID;	
		uploadPath = __dirname + '/uploads/Profile/'+profileName+"/Links/"+fileName;
		var LM_Image='Profile/'+profileName+"/Links/"+fileName;
		var LM_Title=req.body.LM_Title;
		var LM_Url=req.body.LM_Url;		
		console.log(uploadPath);

		let result={};
		console.log(db_fileName);
		sampleFile.mv(uploadPath, function(err) 
		{
			if (err)
				result={status:0,msg:'Failed!'}
			else	
			{

				console.log("I m here");
				var LM_Who_Will_See=req.body.LM_Who_Will_See;
				
					let sql = "UPDATE link_master SET  LM_Title='"+LM_Title+"',LM_Url='"+LM_Url+"',LM_Who_Will_See='"+LM_Who_Will_See+"',LM_Icon='', LM_Image='"+LM_Image+"' WHERE LM_ID="+LM_ID;
					let query = connection.query(sql, (err, results) => {
					if (err) 
					{
						console.log(err);
						res.json({status:0,msg:"error"});
					}
					else
					{
						
						console.log("I m here2");
						res.json({status:1,msg:'Done'});
					}	
				});

			}
		});
	}
	
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
//23-feb-2021
//updateProfileSettings
app.post('/admin/updateProfileSettings',function(req,res){

	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	

			var JM_Name=req.body.JM_Name;
			var JM_Description=req.body.JM_Description;
			var JM_Social_Widget_Position=req.body.JM_Social_Widget_Position;
		
			let sql = "UPDATE joining_master SET  JM_Name='"+JM_Name+"',JM_Description='"+JM_Description+"', JM_Social_Widget_Position='"+JM_Social_Widget_Position+"' WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});


});
//updatePassword
app.post('/admin/updatePassword',function(req,res){

	var JM_ID= req.body.JM_ID;
	var Current_Password=req.body.Current_Password;
	var New_Password=req.body.New_Password;
	var Confirm_Password=req.body.Confirm_Password;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	if(New_Password!=Confirm_Password)
	{
		res.json({status:0,msg:"New Password and Confirm password does't Matched!!! "});
		return false;
	}
	
	if(New_Password=="")
	{
		res.json({status:0,lastId:0,msg:"empty Password"});
		return false;
	}
	const hashPassword = bcrypt.hashSync(New_Password, saltRounds);
	connection.query('SELECT * FROM joining_master WHERE JM_ID = ?',[JM_ID], function (error, result, fields) 
	{
		if (error) 
		{
			res.json({
				  status:0,
					  msg:'there are some error with query'
			  })
		}
		else
		{
			console.log(hashPassword)
		 	 if(result.length >0)
			  {
				var JM_ID=result[0].JM_ID;
				bcrypt.compare(Current_Password, result[0].JM_Password, function(err, ress) {
					if(!ress)
					{
						res.json({
						  status:0,                  
						  msg:"password does not match"
						});
					}
					else
					{
						let sql = "UPDATE joining_master SET  JM_Password='"+hashPassword+"' WHERE JM_ID="+JM_ID;
						let query = connection.query(sql, (err, results) => 
						{
							if(err) 
							{
								console.log(err);
								res.json({status:0,msg:"error"});
							}
							else
							{
								res.json({status:1,msg:'Profile is Updated'});
							}	
						});
					}
				});
				
			  }
			  else
			  {
				console.log(err);
				res.json({status:0,msg:"user id not found"});	
			  }
		}
	});


});

//IFSC validation
var ifsc = require('ifsc');
//13-jul-2021
app.post('/admin/UpdatePayoutDetails',function(req,res){



	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}

		//ifsc.validate('KKBK0000261');
		// File does not exist.
			console.log("No file");
			var JM_Acc_No=req.body.JM_Acc_No;
			var JM_Acc_Code=req.body.JM_Acc_Code;
			var JM_Beneficiary_Name=req.body.JM_Beneficiary_Name;
			var JM_SWIFT_Code=req.body.JM_SWIFT_Code;
			var JM_Phone_Bank=req.body.JM_Phone_Bank;


			//A/C No must be within 18 digits
			if(JM_Acc_No.length ==0)
			{
				res.json({status:0,msg:"A/C No is empty"});
				return false;
			}
			if(JM_Acc_No.length > 18)
			{
				res.json({status:0,msg:"A/C No must be within 18 digits"});
				return false;
			}
			if(JM_Acc_Code.length !=11)
			{
				res.json({status:0,msg:"The ifsc must be 11 characters."});
				return false;
			}
			if(JM_Acc_Code.length == 11 && ifsc.validate(JM_Acc_Code)==false)
			{
				res.json({status:0,msg:"Invalid ifsc"});
				return false;
			}
			let sql = "UPDATE joining_master SET  JM_Acc_No='"+JM_Acc_No+"',JM_Acc_Code='"+JM_Acc_Code+"', JM_Beneficiary_Name='"+JM_Beneficiary_Name+"',JM_SWIFT_Code='"+JM_SWIFT_Code+"',JM_Phone_Bank='"+JM_Phone_Bank+"', JM_Payout_Details=1  WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});


});


//updateActiveLink
app.post('/admin/updateActiveLink',function(req,res){

	console.log("No file");
	var LM_ID=req.body.LM_ID;
	var LM_Active=req.body.LM_Active;
	let sql = "UPDATE link_master SET  LM_Active='"+LM_Active+"' WHERE LM_ID="+LM_ID;

	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})

//MS2 01-jun-2021
app.post('/admin/updateActiveNewsLetter',(req,res)=>{

	var JM_ID=req.body.JM_ID;
	var JM_NewsLetter_Active=req.body.JM_NewsLetter_Active;
	var JM_NewsLetter_Title=req.body.JM_NewsLetter_Title;
	var type=req.body.type;let sql ="";
	if(type=='active')
		 sql = "UPDATE joining_master SET  JM_NewsLetter_Active="+JM_NewsLetter_Active+" WHERE JM_ID="+JM_ID;
	else
		 sql = "UPDATE joining_master SET  JM_NewsLetter_Title='"+JM_NewsLetter_Title+"' WHERE JM_ID="+JM_ID;
	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})

//13-jul-2021
app.post('/admin/updateActiveVartualGift',(req,res)=>
{

	var JM_ID=req.body.JM_ID;
	var JM_Gift_Active=req.body.JM_Gift_Active;
	var JM_Gift_Title=req.body.JM_Gift_Title;
	var type=req.body.type;let sql ="";
	if(type=='active')
		 sql = "UPDATE joining_master SET  JM_Gift_Active="+JM_Gift_Active+" WHERE JM_ID="+JM_ID;
	else
		 sql = "UPDATE joining_master SET  JM_Gift_Title='"+JM_Gift_Title+"' WHERE JM_ID="+JM_ID;
	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})





//16-apr-2021
app.post('/admin/updateEmail',(req,res)=>{

	var JM_Email=req.body.JM_Email;	
	var JM_ID=req.body.JM_ID;

	
	if(req.body.JM_ID > 0 && req.body.JM_Email.length > 0)
	{
		res.setHeader('Access-Control-Allow-Origin', '*');	
	
		connection.query('SELECT * FROM joining_master WHERE JM_Email = ? and JM_ID !=?',[JM_Email,JM_ID], function (error, results, fields) {
			if (error) 
			{
				res.json({
				status:0,
				msg:'error ,try again later'
				})
			}
			else
			{
				if(results.length > 0)
				{
					res.json({
						status:0,
						msg:'Email is Not available'
						})
				}	
				else
				{
						
					let sql = "UPDATE joining_master SET  JM_Email='"+JM_Email+"' WHERE JM_ID="+JM_ID;
					let query = connection.query(sql, (err, results) => 
					{
						if(err) 
						{
							console.log(err);
							res.json({status:0,msg:"error occured, try later"});
						}
						else
						{
							res.json({status:1,msg:"Email is Updated"});
						}	
					});

				}	
			}	
		});	
			
	}
  else
  {
		res.json({status:1,msg:"empty email"});
  }
})

//17-jun-2021
app.post('/admin/updateNofityPref',(req,res)=>{
	var JM_ID=req.body.JM_ID;
	var id=req.body.id;	
	var checked=req.body.checked;	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(JM_ID > 0 && id!='')
	{	
		let sql = "UPDATE notification_pref SET  "+id+"='"+checked+"' WHERE JM_ID="+JM_ID;
		let query = connection.query(sql, (err, results) => 
		{
			if(err) 
			{
				console.log(err);
				res.json({status:0,msg:"error occured, try later"});
			}
			else
			{
				res.json({status:1,msg:"notific is Updated"});
			}	
		});
			
	}
  else
  {
		res.json({status:1,msg:"empty params"});
  }
})


//21-jun-2021
app.post('/admin/isAvailablePhone',async (req,res)=>{
	var JM_ID=req.body.JM_ID;
	var JM_Phone=req.body.JM_Phone;	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(JM_ID > 0 && JM_Phone.length >=10)
	{	
		let sql = "SELECT * from joining_master WHERE JM_Phone='"+JM_Phone+"' and JM_ID not in("+JM_ID+")";
		const rows = await model.sqlPromise(sql);
		if(rows!=null && rows.length > 0)	
		{
			res.json({status:0,msg:"not available"});
		}
		else
		{
			res.json({status:1,msg:"available"});
		}
	}
  else
  {
		res.json({status:1,msg:"empty params"});
  }
})


//13-jul-2021
//13-jul-2021
app.post('/admin/isAvailablePhoneBank',async (req,res)=>{
	var JM_ID=req.body.JM_ID;
	var JM_Phone_Bank=req.body.JM_Phone_Bank;	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(JM_ID > 0 && JM_Phone_Bank.length >=10)
	{	
		let sql = "SELECT * from joining_master WHERE JM_Phone_Bank='"+JM_Phone_Bank+"' and JM_ID not in("+JM_ID+")";
		const rows = await model.sqlPromise(sql);
		if(rows!=null && rows.length > 0)	
		{
			res.json({status:0,msg:"not available"});
		}
		else
		{
			res.json({status:1,msg:"available"});
		}
	}
  else
  {
		res.json({status:1,msg:"empty params"});
  }
})


//01-jul-2021

                                           
app.post('/admin/isAvailablePhone_by_phone',async (req,res)=>{

	var JM_Phone=req.body.JM_Phone;	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(JM_Phone.length == 10)
	{	
		let sql = "SELECT * from joining_master WHERE JM_Phone='"+JM_Phone+"'";
		const rows = await model.sqlPromise(sql);
		if(rows!=null && rows.length > 0)	
		{
			res.json({status:0,msg:"not available"});
		}
		else
		{
			res.json({status:1,msg:"available"});
		}
	}
  else
  {
		res.json({status:1,msg:"empty params"});
  }
})                    
               



app.post('/admin/updatePhone',(req,res)=>{
	var JM_ID=req.body.JM_ID;
	var JM_Phone=req.body.JM_Phone;	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	if(JM_ID > 0 && JM_Phone.length >=10)
	{	
		let sql = "UPDATE joining_master SET  JM_Phone='"+JM_Phone+"' WHERE JM_ID="+JM_ID;
		let query = connection.query(sql, (err, results) => 
		{
			if(err) 
			{
				console.log(err);
				res.json({status:0,msg:"error occured, try later"});
			}
			else
			{
				res.json({status:1,msg:"Profile is Updated"});
			}	
		});
			
	}
  else
  {
		res.json({status:0,msg:"empty params"});
  }
})







//updateActiveLinkSocial
app.post('/admin/updateActiveLinkSocial',function(req,res){
	
	var SWM_ID=req.body.SWM_ID;
	var SWM_Active=req.body.SWM_Active;
	let sql = "UPDATE social_widget_master SET SWM_Active='"+SWM_Active+"' WHERE SWM_ID="+SWM_ID;
	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})

//11-mar-2021
// /updateActiveCategory
app.post('/admin/updateActiveCategory',function(req,res){

	console.log("No file");
	var CM_ID=req.body.CM_ID;
	var CM_Active_Status=req.body.CM_Active_Status;
	let sql = "UPDATE category_master SET  CM_Active_Status='"+CM_Active_Status+"' WHERE CM_ID="+CM_ID;

	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})

app.post('/admin/updateActiveEmbed',function(req,res){

	console.log("No file");
	var EC_ID=req.body.EC_ID;
	var LM_Active=req.body.LM_Active;
	let sql = "UPDATE embed_content SET  LM_Active='"+LM_Active+"' WHERE EC_ID="+EC_ID;

	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})

//12-mar-2021
//
app.post('/admin/updateActivePremium',function(req,res){

	var DA_ID=req.body.DA_ID;
	var DA_Active=req.body.DA_Active;
	let sql = "UPDATE direct_access_master_user SET  DA_Active='"+DA_Active+"' WHERE DA_ID="+DA_ID;

	let query = connection.query(sql, (err, results) => {
		if(err) 
		{
			console.log(err);
			res.json({status:0,msg:"error"});
		}
		else
		{
			res.json({status:1,msg:'Done'});
		}	
	});
})


app.get('/param',function(req,res){
	var param=req.params;
	res.send(param);
});

app.post('/admin/signin', async function(req, res) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	var email=req.body.JM_Email	;
    var password=req.body.JM_Password;
	//var isBlocked=0;
    connection.query('SELECT * FROM joining_master WHERE (JM_Email= ? or JM_User_Profile_Url= ?) and isBlocked=0 and isDeleted=0',[email,email], function (error, results, fields) {
      if (error) {
          res.json({
            status:0,
            msg:'there are some error with query'
            })
      }
	  else
	  {

        if(results.length >0){
			var JM_ID=results[0].JM_ID;
            bcrypt.compare(password, results[0].JM_Password, async function(err, ress) {
                if(!ress){
                    res.json({
                      status:0,                  
                      msg:"Email and password does not match"
                    });
                }else
				{                 
					var token=await getToken(JM_ID);
					console.log(token)
					var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+"";
					connection.query(sql, async function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster;
						if (!error)
						{
							 user=results[0];
							 directAccess=results[1];
							 linkMaster=results[2];

							
							res.json({
								status:1,msg:'uploaded',
								JM_ID:JM_ID,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								token:token							
								});	


						}	
						else
						{
						

							res.json({
								status:0,msg:'failed',
								JM_ID:0,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								token:''
								});	
						}	
					});

                    
                }
            });         
        }
        else{
          res.json({
              status:0,
			  msg:"Email does not exist, please create a new account"
          });
        }
      }
    });
		
});


//24-apr-2021


app.post('/admin/userDetailsAll', async function(req, res) {

			

			//  var authorization = req.headers['authorization'];
			//  var id = req.headers['id'];
			//  const isValidApi=await API_Authorization(id,authorization);	
			//  if(isValidApi==false)
			//  {
			// 	 res.json({status:0,msg:'unable to process'})
			// 	 return false;
			//  }

			 var JM_ID=req.body.JM_ID;
			connection.query("call mixedDetails(?)", [JM_ID], function (err, result) {
			if (err) 
			{
				res.json({
					status:0,
					data:"err"
				});

			} else {
				console.log("results:", result);	
				res.json({
					status:1,
					data:result[0],
					themeMasterUser:result[1],			
					userDetails:result[2],
					socialWidget:result[3],			
					gifts:result[4],
					category_master:result[5],		
				});
			}
		});
	
});


//26-jun-2021
app.post('/admin/userDetailsAllSettings', async function(req, res) 
{
	var JM_ID=req.body.JM_ID;
	let sql="Select *  from notification_pref where JM_ID="+JM_ID;
	var settings=await model.sqlPromise(sql);
	console.log(settings)
	if(typeof settings !='undefined' && settings.length > 0)
	{
			connection.query("call mixedDetails(?)", [JM_ID], function (err, result) {
			if (err) {
				res.json({
					status:0,
					data:err
				});

			} else {
				console.log("results:", result);	
				res.json({
					status:1,
					data:result[0],
					themeMasterUser:result[1],			
					userDetails:result[2],
					socialWidget:result[3],			
					gifts:result[4],
					category_master:result[5],	
					notific_pref:settings
				});
			}
		});
	}
	else
	{

			var data  = {		
					JM_ID: JM_ID
				};
			let sql = "INSERT INTO notification_pref SET ?";
			let query = connection.query(sql, data,(err, Dataresults) => 
			{
					
					connection.query("call mixedDetails(?)", [JM_ID], function (err, result) {
						if (err) 
						{
							res.json({
								status:0,
								data:err
							});
				
						} 
						else 
						{
							console.log("results:", result);	
							res.json({
								status:1,
								data:result[0],
								themeMasterUser:result[1],			
								userDetails:result[2],
								socialWidget:result[3],			
								gifts:result[4],
								category_master:result[5],	
								notific_pref:settings
							});
						}
					});
			});
	}
});
                                           
                           

app.post('/admin/isExistUrl_Profile', function(req, res) {

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	//var livePreview=req.body.livePreview;
	console.log(JM_User_Profile_Url)
	var myquery = "SELECT * FROM joining_master WHERE JM_User_Profile_Url = '" + JM_User_Profile_Url+"'  and  isDeleted=0 and isBlocked=0";
	connection.query(myquery , function (error, results, fields) {
	if (error)
	 {
		res.json({
		  status:0,
		  msg:"unable to excecute process",
		  error:error
		  })
	}
	else
	{
		if(results.length > 0)
		{
					console.log(" I m here " + results[0].JM_ID);
					var JM_ID=results[0].JM_ID;
					var ip = req.headers['x-forwarded-for'].split(',')[0];
					var data  = {
					JM_Profile_Url : JM_User_Profile_Url,
					JM_ID: JM_ID,
					IP:ip
					};

					let sql = "INSERT INTO view_master SET ?";
					let query = connection.query(sql, data,(err, Dataresults) => 
					{
							
							connection.query("call mixedDetails(?)", [JM_ID], function (err, result) {
								if (err) 
								{
									res.json({
										status:0,
										data:err
									});
						
								} 
								else 
								{
									console.log("results:", result);	
									res.json({
										status:1,
										data:result[0],
										themeMasterUser:result[1],			
										userDetails:result[2],
										socialWidget:result[3],			
										gifts:result[4],
										category_master:result[5],		
									});
								}
							});
					});
			
		}
		else
		{
			res.json({
				status:0,
				msg:'invalid url',
				JM_User_Profile_Url:JM_User_Profile_Url
			  })
		}

	}
});
	
	

});


app.post('/admin/userDetails', function(req, res) {
	
		res.setHeader('Access-Control-Allow-Origin', '*');	
		var JM_ID=req.body.JM_ID;
		console.log(JM_ID);
		var sql="SELECT JM_ID,JM_Name,JM_Description,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Social_Widget_Position,JM_Payout_Details,JM_Verified,isRequested,isBlocked,JM_SWIFT_Code,JM_Acc_Code,JM_Acc_No,JM_Beneficiary_Name,JM_Notify_Pref,isRequestForChangeUrl FROM joining_master where JM_ID="+JM_ID+" and isDeleted=0 and isBlocked=0;Select * from direct_access_master;Select *,Concat('Profile/',jm.JM_User_Profile_Url,'_',jm.JM_ID,'/Links/') as ProfilePath from link_master lm inner join joining_master jm on jm.JM_ID=lm.JM_ID  where lm.JM_ID="+JM_ID+" order by lm.LM_OrderBy; Select * from direct_access_master_user where JM_ID="+JM_ID+" and Archive=0 and DA_Type!='gifts' order by DA_OrderBy; SELECT * from social_widget_master where JM_ID="+JM_ID+" order by SWM_OrderBy; SELECT * from category_master where JM_ID="+JM_ID+"; SELECT * FROM link_master lm inner join category_master cm on cm.CM_ID=lm.LM_Folder_ID where lm.JM_ID="+JM_ID+"; SELECT * from embed_content where JM_ID="+JM_ID+"; Select * from direct_access_master_user where JM_ID="+JM_ID+" and Archive=0 and DA_Type in ('gifts','support') order by DA_OrderBy;";
		
		//console.log(sql);
		connection.query(sql, function (error, results, fields) 
		{
			var user;
			var directAccess,linkMaster,productList,socialWidget,category_master,category_links,embed_content,gifts;
			if (!error)
			{
					user=results[0];
					directAccess=results[1];
					linkMaster=results[2];
					productList=results[3];
					socialWidget=results[4];
					category_master=results[5];
					category_links=results[6];
					embed_content=results[7];
					gifts=results[8];
					res.json(
							{
								status:1,
								msg:'success',
								JM_ID:JM_ID,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								productList	:productList,
								socialWidget:socialWidget,
								category_master:category_master,
								category_links:category_links,
								embed_content:embed_content,
								gifts:gifts
							}
					);	
			}	
			else
			{
				res.json({
					status:0,
					msg:'no data found',
					JM_ID:0,
					userDetails:user,
					directAccess:directAccess,
					linkMaster:linkMaster,
					socialWidget:socialWidget,
					category_master:category_master,
					category_links:category_links,
					embed_content:embed_content,
					gifts:gifts
					});	
			}	
	});

});




//15mar-2021
// app.post('/admin/updateProduct',function(req,res){

// 	let videoFile,imageFile,coverFile,album;
// 	let uploadPath;
// 	var DA_Type=req.body.DA_Type;
// 	var JM_ID=req.body.JM_ID;
// 	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
// 	var DA_Cover=req.body.DA_Cover;
// 	var DA_Title=req.body.DA_Title;
// 	var DA_Description=req.body.DA_Description;	
// 	var DA_Price=req.body.DA_Price;
// 	var DA_ID=req.body.DA_ID;
// 	var DA_DA_ID=req.body.DA_DA_ID;
// 	var fileName="";

// 	if (!req.files) 
// 	{
// 		if(DA_Type=="video" || DA_Type=="audio")
// 		{
// 			let sql = "UPDATE direct_access_master_user SET  DA_Title='"+DA_Title+"', DA_Description='"+DA_Description+"', DA_Price='"+DA_Price+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
// 				let query = connection.query(sql, (err, results) => 
// 				{
// 					if(err) 
// 					{
// 						console.log(err);
// 						res.json({status:0,msg:"error"});
// 					}
// 					else
// 					{						

// 						model.getUserDetails(JM_ID,function(results)
// 						{
// 							records = results;
// 							console.log(records);
					
// 								var user;
// 								var directAccess,linkMaster,productList,socialWidget,category_master,category_links,embed_content;
// 								if (results!=null && results.length > 0)
// 								{
// 										user=results[0];
// 										directAccess=results[1];
// 										linkMaster=results[2];
// 										productList=results[3];
// 										socialWidget=results[4];
// 										category_master=results[5];
// 										category_links=results[6];
// 										embed_content=results[7];
// 										res.json(
// 												{
// 													status:1,
// 													msg:'success',
// 													JM_ID:JM_ID,
// 													userDetails:user,
// 													directAccess:directAccess,
// 													linkMaster:linkMaster,
// 													productList	:productList,
// 													socialWidget:socialWidget,
// 													category_master:category_master,
// 													category_links:category_links,
// 													embed_content:embed_content				
// 												}
// 										);	
// 								}
// 								else{
// 										res.json(
// 											{
// 												status:0,
// 												msg:"failed",
// 												JM_ID:JM_ID,
// 												userDetails:user,
// 												directAccess:directAccess,
// 												linkMaster:linkMaster,
// 												productList	:productList,
// 												socialWidget:socialWidget,
// 												category_master:category_master,
// 												category_links:category_links,
// 												embed_content:embed_content				
// 											}
// 									);	
// 								}			
// 						  });
// 								// console.log("success");
// 								// res.json({status:1,msg:'Done',DA_ID:DA_ID});

// 					}	
// 			});
// 		}
		
		
// 	}
// 	else
// 	{
// 		console.log(" file exist ---> "+ DA_Type);
// 		//var stringObj = JSON.stringify(meida_array);
// 		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
// 		if(DA_Type=="video")
// 		{
			
// 				let videoFile = req.files.sampleFile;
// 				var ext = path.extname(videoFile.name);	
// 				fileName=videoFile.md5+ext;
// 				var fileArray=[fileName]
// 				var DA_Collection=JSON.stringify(fileArray);
// 				console.log(DA_Collection)
// 				const values = [
// 					[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
// 				];

// 				// const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
				
// 				let sql = "UPDATE direct_access_master_user SET  DA_Title='"+DA_Title+"', DA_Description='"+DA_Description+"', DA_Price='"+DA_Price+"', DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
// 				let query = connection.query(sql, (err, results) => 
// 				{
// 					if(err) 
// 					{
// 						console.log(err);
// 						res.json({status:0,msg:"error"});
// 					}
// 					else
// 					{						
// 						let DA_ID=result.insertId;						
// 						uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
// 						var DA_Collection='Profile/' + ProfileName+"/"+fileName;
// 						videoFile.mv(uploadPath, function(err) 
// 						{
// 							if (err)
// 								result={status:0,msg:'Failed!'}
// 							else	
// 							{
// 								console.log("success");
// 								res.json({status:1,msg:'Done',DA_ID:DA_ID});

// 							}
// 						});								
// 					}	
// 			});
// 		}
// 		else if(DA_Type=="audio") 
// 		{
			
// 					let audioFile = req.files.sampleFile;
// 					var ext = path.extname(audioFile.name);	
// 					fileName=audioFile.md5+ext;			
// 					var fileArray=[fileName]	
// 					var DA_Collection=JSON.stringify(fileArray);		
// 					const values = [
// 						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
// 					];
// 					//const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
// 					let sql = "UPDATE direct_access_master_user SET  DA_Title='"+DA_Title+"', DA_Description='"+DA_Description+"', DA_Price='"+DA_Price+"', DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
// 					let query = connection.query(sql, (err, results) => 
// 					{
// 						if (err) 
// 						{
// 							console.log(err);
// 							res.json({status:0,msg:"error"});
// 						}
// 						else
// 						{						
// 								let DA_ID=result.insertId;							
// 								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
// 								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
// 								audioFile.mv(uploadPath, function(err) 
// 								{
// 									if (err)
// 										result={status:0,msg:'Failed!'}
// 									else	
// 									{
// 										console.log("success");
// 										res.json({status:1,msg:'Done',DA_ID:DA_ID});

// 									}
// 								});
						
// 						}	
// 				});
					
// 		}
// 		// for multiple images
// 		// else if(DA_Type=="image") 
// 		// {
// 		// 	var fileArray=[];
// 		// 	album = req.files.img_multiple;
// 		// 	coverFile = req.files.coverFile;
// 		// 	if(album!=null && album.length > 0)
// 		// 	{
// 		// 				var fileName="";					
// 		// 				for(let i=0;i<album.length;i++)
// 		// 				{
// 		// 					var ext = path.extname(coverFile.name);	
// 		// 					fileName=album[i].md5+ext;
// 		// 					fileArray.push(fileName);
// 		// 				}
// 		// 				var DA_Collection=JSON.stringify(fileArray);
// 		// 				var ext = path.extname(coverFile.name);					
// 		// 				let coverFileName=coverFile.md5+ext;
// 		// 				console.log(DA_Collection);
// 		// 				DA_Cover=coverFileName;
// 		// 				const values = [
// 		// 					[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection]
// 		// 				];
// 		// 				const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
// 		// 				const query = connection.query(sal, [values], function(err, result) {
// 		// 				if (err) 
// 		// 				{
// 		// 					console.log(err);
// 		// 					res.json({status:0,msg:"error"});
// 		// 				}
// 		// 				else
// 		// 				{					
// 		// 					let data = []; 	
// 		// 					let DA_ID=result.insertId;
// 		// 					let c=0;
// 		// 					try
// 		// 					{
								
// 		// 						var coverPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+coverFileName;
// 		// 						coverFile.mv(coverPath);							
// 		// 						for(let i=0;i<album.length;i++)
// 		// 						{
// 		// 							var ext = path.extname(album[i].name);
// 		// 							let albumFile=album[i];		
// 		// 							let	fileName=album[i].md5+ext;
// 		// 							uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
// 		// 							albumFile.mv(uploadPath);
// 		// 							data.push({
// 		// 								name: album[i].name,
// 		// 								md5: album[i].md5						
// 		// 							});
// 		// 							c++;
// 		// 						}
// 		// 						if(c!=album.length)
// 		// 							res.json({status:0,msg:"error"});
// 		// 						else	
// 		// 						{
// 		// 							console.log("success");
// 		// 							res.json({status:1,msg:'Done',DA_ID:DA_ID});
// 		// 						}
// 		// 					}
// 		// 					catch (err) {
// 		// 						console.log("error in image");
// 		// 						res.json({status:0,msg:"error in exception"});
// 		// 					}
									
// 		// 				}	
// 		// 			});


// 		// 	}
// 		// }
		
	
		
// 	}

// });

app.get('/admin/getRecords',function(req,res){
	let JM_ID=16;
	model.getUserDetails(JM_ID,function(results){
		records = results;
		console.log(records);

			var user;
			var directAccess,linkMaster,productList,socialWidget,category_master,category_links,embed_content;
			if (results!=null && results.length > 0)
			{
					user=results[0];
					directAccess=results[1];
					linkMaster=results[2];
					productList=results[3];
					socialWidget=results[4];
					category_master=results[5];
					category_links=results[6];
					embed_content=results[7];
					res.json(
							{
								status:1,
								msg:'success',
								JM_ID:JM_ID,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								productList	:productList,
								socialWidget:socialWidget,
								category_master:category_master,
								category_links:category_links,
								embed_content:embed_content				
							}
					);	
			}
			else{
					res.json(
						{
							status:0,
							msg:"failed",
							JM_ID:JM_ID,
							userDetails:user,
							directAccess:directAccess,
							linkMaster:linkMaster,
							productList	:productList,
							socialWidget:socialWidget,
							category_master:category_master,
							category_links:category_links,
							embed_content:embed_content				
						}
				);	
			}			
	  });
})

//razorpay
//npm install express cors razorpay
//npm i custom-env

console.log(process.env.APP_NAME);
const cors = require("cors");
const Razorpay = require('razorpay');
app.use(cors());
const instance = new Razorpay({
    key_id:process.env.RAZOR_PAY_KEY_ID,
    key_secret:process.env.RAZOR_PAY_KEY_SECRET,
});
app.post("/admin/order", (req, res) => {
		try {
			console.log("i am here order "+ req.body.amount)
			var currency=req.body.currency;
			const options = {
				amount: req.body.amount, // amount == Rs 10
				currency: currency,//"INR",
				receipt: "receipt#1",
				payment_capture: 1,
			// 1 for automatic capture // 0 for manual capture
			};
			instance.orders.create(options, async function (err, order) 
			{
				if (err) 
				{
					return res.status(500).json({
					message: "Something Went Wrong",
					});
				}
				return res.status(200).json(order);
			});
		} 
		catch (err) 
		{
			return res.status(500).json({
				message: "Something Went Wrong",
			});
		}
});






app.post('/admin/deleteProduct',async function(req,res){

	
	var DA_ID=req.body.DA_ID;
	if(req.body.DA_ID > 0)
	{
		let sql1="SELECT da.DA_ID,bm.BM_Name,da.DA_Title, bm.BM_Purchase_Amt,bm.Status FROM direct_access_master_user da 		inner join buyers_master bm on bm.DA_ID=da.DA_ID		where bm.Status in('P','A') and da.DA_ID="+DA_ID;
		connection.query(sql1, (err, result) => {
			if (err) 
			{
				res.json({status:0,msg:'error in query',DA_ID:0});
			}
			else
			{		
				
				if(result.length > 0)
				{
					res.json({status:0,msg:'Please, complete all requests on this item',DA_ID:req.body.DA_ID});
				}
				else
				{

					let sql = "UPDATE direct_access_master_user SET  Archive=1 WHERE DA_ID="+req.body.DA_ID;
					let query = connection.query(sql, (err, results) => {
						if (err) {res.json({status:0,msg:'error in query',DA_ID:0});}
						else
						{							
							res.json({status:1,msg:'success',DA_ID:req.body.DA_ID});
						}
					});
				}		
			}
		});
		       


	}
	else
	{
		res.json({status:0,msg:'empty ID'});
	}		 


});



app.get('/admin/ext',function(){
	var ext = path.extname('unnamed.jpg');
	console.log(ext); 
	ren.end('hii');
})
app.post('/admin/Get_All_Users',function(req,res){

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var JM_ID=req.body.JM_ID;
		var limit=req.body.limit;
	//	console.log(JM_ID);
		var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,isForLandingPage FROM joining_master";// where JM_ID="+JM_ID;
		
		
		connection.query(sql, function (error, results, fields) 
		{
			var user;
			var exploreData;
			if (!error)
			{
				console.log("New ---->"+limit);
					if(results.length > 0)
					{
						var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,isForLandingPage  FROM joining_master Limit "+limit;
						connection.query(sql1, function (error, result, fields) 
						{
							exploreData=result;
							if (!error)
							{
							
								console.log(exploreData);
									res.json(
										{
											status:1,
											msg:'success',
											JM_ID:JM_ID,
											exploreData:exploreData													
										}
								);	
							}
							else{
								res.json({
									status:0,
									msg:'no data found',
									JM_ID:0,
									exploreData:exploreData	
								});	
							}
						});
					}
					
			}	
			else
			{
				res.json({
						status:0,
						msg:'user id not found',
						JM_ID:0,
						exploreData:exploreData	
					});	
			}	
	});
});



//Get_Four_Users

app.post('/admin/Get_Four_Users',function(req,res){

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var JM_ID=req.body.JM_ID;
		var limit=req.body.limit;
			
					var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,isForLandingPage  FROM joining_master where isForLandingPage=1";
						connection.query(sql1, function (error, result, fields) 
						{
							exploreData=result;
							if (!error)
							{
							
								console.log(exploreData);
									res.json(
										{
											status:1,
											msg:'success',
											JM_ID:JM_ID,
											exploreData:exploreData													
										}
								);	
							}
							else{
								res.json({
									status:0,
									msg:'no data found',
									JM_ID:0,
									exploreData:exploreData	
								});	
							}
						});
});



// app.post('/admin/socialLogin',function(req,res){

// 	console.log(req.body)
// 	if(req.body.email!="" && req.body.first_name!="")
// 	{
// 			var url=req.body.first_name.replace(/\s+/g, '');
// 			var id=req.body.id;
// 			var JM_User_Profile_Url=url+id;
// 			var JM_Email=req.body.email;
// 			var JM_Referral=req.body.JM_Referral;
// 			var JM_Google_ID=req.body.JM_Google_ID;
// 			var JM_FB_ID=req.body.JM_FB_ID;
// 			var sql="SELECT * FROM joining_master where JM_Email='"+req.body.email+"' and JM_Password=''";
// 				connection.query(sql, function (error, results, fields) 
// 				{
// 					var user;
// 					var exploreData;
// 					if (!error)
// 					{
// 							console.log("New ---->");
// 							if(results.length > 0)
// 							{
// 								var string=JSON.stringify(results);				
// 								var json =  JSON.parse(string);			
// 								console.log(json[0].JM_ID);		
// 								let JM_ID=json[0].JM_ID;
// 								let JM_Email=json[0].JM_Email;
// 								let JM_User_Profile_Url=json[0].JM_User_Profile_Url;
// 								res.json({status:1,JM_ID:JM_ID,JM_Email:JM_Email,JM_User_Profile_Url:JM_User_Profile_Url, msg:"got id"});	
// 							}
// 							else
// 							{

// 								var ProfURL=JM_User_Profile_Url;
								
// 								var data  = {
// 									JM_Name: req.body.first_name,
// 									JM_Email: req.body.email,
// 									JM_Password:'',
// 									JM_User_Profile_Url:JM_User_Profile_Url,
// 									JM_Referral:JM_Referral,
// 									JM_Google_ID:JM_Google_ID,
// 									JM_FB_ID:JM_FB_ID
// 								};	
// 								var tableName='joining_master';
// 								let sql = "INSERT INTO joining_master SET ?";
// 								let query = connection.query(sql, data,(err, results) => 
// 								{
// 									if(err) 
// 										res.json({status:0,lastId:0,msg:"unable to insert"});
// 									else
// 									{


										
// 										  	var sourceDir = path.join(__dirname,'/uploads/Links');
// 										  	let JM_ID=results.insertId;
//                                             var Profdir =  path.join(__dirname, 'uploads/Profile/'+ProfURL+"_"+JM_ID) ;
//                                             var ProfdirLinks =  path.join(__dirname,'uploads/Profile/'+ProfURL+"_"+JM_ID+'/Links');

// 											if (!fs.existsSync(Profdir))
// 											{
// 												fs.mkdirSync(Profdir);
											
// 												if (!fs.existsSync(ProfdirLinks))
// 												{
// 													fs.mkdirSync(ProfdirLinks);
// 												}
// 											}
									
// 											fs_Extra.copy(sourceDir, ProfdirLinks, function (err) {
// 											if (err) 
// 											{
// 											console.error(err);
// 											} 
// 											else 
// 											{  
// 												let values = [
// 													[1,JM_ID,"theme/profile_back_1.jpg", "default_theme_1"]							
// 												];
// 												const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name FROM theme_master  WHERE theme_master.TM_ID=1";
												
// 													//const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
// 													const query = connection.query(sql, function(err, result) {
// 														if (err) 
// 														{
// 															console.log(err);
// 															res.json({status:0,msg:err});
// 														}
// 														else
// 														{
// 															let TMU_ID=result.insertId;							
// 															var text="Thank you for joinig Expy";
// 															var mailOptions = {
// 																	from: "Expy Admin <admin@expy.bio>",
// 																	to: req.body.email,
// 																	subject: "Welcome to Expy!",
// 																	text: "Thank you for joinig Expy",
// 																	html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+req.body.first_name+",</h3><p>Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p>     <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
// 																}
			
// 															  transporter.sendMail(mailOptions, (error, info) => 
// 															  {
// 																	if (error) 
// 																		{
// 																				res.json({status:0,msg:"mail not sent",url:'',arr:error});
// 																		}																		
// 																		else
// 																		{
// 																			   //res.json({status:1, msg:"inserted"});	
// 																				res.json({status:1,JM_ID:JM_ID,msg:"inserted",TMU_ID:TMU_ID,JM_Email:JM_Email,JM_User_Profile_Url:JM_User_Profile_Url,});																			
// 																		}

// 															  });							
														
// 														}	
// 													});
													
// 											}
											
// 										});
										
// 									}
// 								});	
// 							}
// 					}	
// 					else
// 					{
// 						res.json({status:0,JM_ID:0,msg:error});
											
// 					}	
// 			});
// 	}
// 	else
// 		res.json({status:0,JM_ID:0,msg:"need email and name"});	
// });


//social sign up by google
app.post('/admin/socialLogin',async function(req,res){

	console.log(req.body)
	if(req.body.email!="" && req.body.first_name!="")
	{
			var url=req.body.first_name.replace(/\s+/g, '');
			var id=req.body.id;
			var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
			var JM_Email=req.body.email;
			var JM_Referral=req.body.JM_Referral;
			var JM_Google_ID=req.body.JM_Google_ID;
			var JM_FB_ID=req.body.JM_FB_ID;
			var sql="SELECT * FROM joining_master where JM_Email='"+req.body.email+"' and isDeleted=0";
				connection.query(sql, async function (error, results, fields) 
				{
					var user;
					var exploreData;
					if (!error)
					{
							console.log("New ---->");
							if(results.length > 0)
							{
								var string=JSON.stringify(results);				
								var json =  JSON.parse(string);			
								console.log(json[0].JM_ID);		
								let JM_ID=json[0].JM_ID;
								let JM_Email=json[0].JM_Email;
								let JM_User_Profile_Url=json[0].JM_User_Profile_Url;
								res.json({status:0, msg:"Use Another Email Id"});	
							}
							else
							{

								var ProfURL=JM_User_Profile_Url;
								
								var data  = {
									JM_Name: req.body.first_name,
									JM_Email: req.body.email,
									JM_Password:'',
									JM_User_Profile_Url:JM_User_Profile_Url,
									JM_Referral:JM_Referral,
									JM_Google_ID:JM_Google_ID,
									JM_FB_ID:JM_FB_ID
								};	
								var tableName='joining_master';
								let sql = "INSERT INTO joining_master SET ?";
								let query = connection.query(sql, data,async (err, results) => 
								{
									if(err) 
										res.json({status:0,lastId:0,msg:"unable to insert"});
									else
									{


										
										  	var sourceDir = path.join(__dirname,'/uploads/Links');
										  	let JM_ID=results.insertId;

													//28-jul-2021
													const token=await addToken(JM_ID);
													//=========================== create token 


                                            var Profdir =  path.join(__dirname, 'uploads/Profile/'+ProfURL+"_"+JM_ID) ;
                                            var ProfdirLinks =  path.join(__dirname,'uploads/Profile/'+ProfURL+"_"+JM_ID+'/Links');

											if (!fs.existsSync(Profdir))
											{
												fs.mkdirSync(Profdir);
											
												if (!fs.existsSync(ProfdirLinks))
												{
													fs.mkdirSync(ProfdirLinks);
												}
											}
									
											fs_Extra.copy(sourceDir, ProfdirLinks, function (err) {
											if (err) 
											{
											console.error(err);
											} 
											else 
											{  
												let values = [
													[1,JM_ID,"theme/profile_back_1.jpg", "default_theme_1"]							
												];
												const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name FROM theme_master  WHERE theme_master.TM_ID=1";
												
													//const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
													const query = connection.query(sql, function(err, result) {
														if (err) 
														{
															console.log(err);
															res.json({status:0,msg:err});
														}
														else
														{
															let TMU_ID=result.insertId;							
															var text="Thank you for joinig Expy";
															var mailOptions = {
																	from: "Expy Admin <admin@expy.bio>",
																	to: req.body.email,
																	subject: "Welcome to Expy!",
																	text: "Thank you for joinig Expy",
																	html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+req.body.first_name+",</h3><p>Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p>     <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
																}
			
															  transporter.sendMail(mailOptions, (error, info) => 
															  {
																	if (error) 
																		{
																				res.json({status:0,msg:"mail not sent",url:'',arr:error});
																		}																		
																		else
																		{
																			   //res.json({status:1, msg:"inserted"});	
																				res.json({status:1,JM_ID:JM_ID,msg:"inserted",TMU_ID:TMU_ID,JM_Email:JM_Email,JM_User_Profile_Url:JM_User_Profile_Url,token:token});																			
																		}

															  });							
														
														}	
													});
													
											}
											
										});
										
									}
								});	
							}
					}	
					else
					{
						res.json({status:0,JM_ID:0,msg:error});											
					}	
			});
	}
	else
		res.json({status:0,JM_ID:0,msg:"need email and name"});	
});

app.post('/admin/socialSignIn',async (req,res)=>{

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var email=req.body.JM_Email	;
	var JM_Google_ID=req.body.JM_Google_ID;
    var password='';
	//var isBlocked=0;
	
    connection.query('SELECT * FROM joining_master WHERE JM_Email= ? and JM_Google_ID= ? and isBlocked=0 and isDeleted=0',[email,JM_Google_ID], async function (error, results, fields) {
      if (error) 
	  {
          res.json({
           		 status:0,
           		 msg:'there are some error with network'
            })
      }
	  else
	  {

			if(results.length >0)
			{
				var JM_ID=results[0].JM_ID;                       
				const token=await getToken(JM_ID);
				var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+"";
				connection.query(sql, async function (error, results, fields) 
				{
					var user;
					var directAccess,linkMaster;
					if (!error)
					{
							user=results[0];
							directAccess=results[1];
							linkMaster=results[2];
						res.json({
							status:1,msg:'success',
							JM_ID:JM_ID,
							userDetails:user,
							directAccess:directAccess,
							linkMaster:linkMaster,
							token:token							
							});	
					}	
					else
					{

						res.json({
							status:0,msg:'failed',
							JM_ID:0,
							userDetails:user,
							directAccess:directAccess,
							linkMaster:linkMaster,
							token:''
							});	
					}	
				});
						
			}
			else{
				res.json({
					status:0,
					msg:"Email does not exist, please sign up with gmail"
				});
			}
      }
    });

})


app.get('/user',function(req,res){

	console.log("hiii");
	//console.log(model.getAllUsers());
	//model.getAllUsers();
	var arr;
	var userDataList = [];
	  model.getUsers(function(users)
	  {			
		arr=JSON.parse(JSON.stringify(users))
		console.log(arr);	
		res.json(arr);		
	  });
	
	 
});

app.get('/createFolder',function(req,res){

	var sourceDir = './uploads/Links';	
	let ProfURL='sam';
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
			if (err) 
			{
			console.error(err);
			} 
			else 
			{         	
			   console.log('success');			
				status=true;				
				res.json({msg:status});
			}
			
	  });


});
//17-feb-2021
app.post('/admin/ValidateURL_Profile', function(req, res) {
	
	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_ID=req.body.JM_ID;
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	var sql="SELECT * FROM joining_master WHERE JM_ID not in ("+JM_ID+") and JM_User_Profile_Url = '"+JM_User_Profile_Url+"'";
	connection.query(sql, function (error, results, fields) 
	{	
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in query execution'
			  })
		}
		else
		{
			if(results.length >0)
			{
				res.json({
					status:1,
					msg:'Url is Not available'
					})
			}	
			else
			{
				res.json({
					status:0,
					msg:'available'
					})
			}	
		}	
	});	
		
});
app.post('/admin/updateProfileUrl',function(req,res){

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_ID=req.body.JM_ID;
	var old_url=req.body.old_url;
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	
	if(JM_ID > 0 && old_url!=JM_User_Profile_Url)
    {

                    var DA_Collection="[]";
                        const values = [
                            [JM_ID,JM_User_Profile_Url,old_url]
                        ];
                        const sal = "INSERT INTO request_for_url_change(JM_ID,New_Url,Old_Url) VALUES ?";

                        const query = connection.query(sal, [values], function(err, result) {
                        if(err) 
                        {
                            console.log(err);
                            res.json({status:0,msg:err});
                        }
                        else
                        {


                              	 let sql = "UPDATE joining_master SET  isRequestForChangeUrl=1 WHERE JM_ID="+JM_ID;
                             
                                  let query = connection.query(sql, (err, results) => {
                                  if (err) 
                                  {
                                      res.json({status:0,msg:err});
                                  }
                                  else
                                  {
                                      res.json({status:1,msg:'Request has been sent to admin'});
                                  }	
                              });
                         
                        }	
                    });
    }
  else
  {
          res.json({status:0,msg:'you have not edited anything'});
  }
	
});
app.post('/admin/deleteLink',(req, res) => {

	if(req.body.LM_ID > 0)
	{
			let sql = "DELETE FROM link_master WHERE LM_ID="+req.body.LM_ID;
			connection.query(sql, function (err, result) {
				if (err) res.json({status:0,msg:'error in query',LM_ID:0});
				res.json({status:1,msg:'success',LM_ID:req.body.LM_ID});
				console.log("Number of records deleted: " + result.affectedRows);
				
			});
	}
	else
	{
		res.json({status:0,msg:'empty LM_ID'});
	}		 

	
  });
//deleteLinkSocial
app.post('/admin/deleteLinkSocial',(req, res) => {

	if(req.body.SWM_ID > 0)
	{
			let sql = "DELETE FROM  social_widget_master WHERE SWM_ID="+req.body.SWM_ID;
			connection.query(sql, function (err, result) {
				if (err) res.json({status:0,msg:'error in query',SWM_ID:0});
				res.json({status:1,msg:'success',SWM_ID:req.body.SWM_ID});
				console.log("Number of records deleted: " + result.affectedRows);
				
			});
	}
	else
	{
		res.json({status:0,msg:'empty SWM_ID'});
	}		 

	
  });
  
  //11-mar-2021
  //deleteCategory
  app.post('/admin/deleteCategory',(req, res) => {

	if(req.body.CM_ID > 0 && req.body.JM_ID > 0)
	{


			let sql = "Select * FROM link_master WHERE JM_ID="+req.body.JM_ID+" and LM_Folder_ID="+req.body.CM_ID;
			connection.query(sql, function (err, reslt) {
			if (err) 
				res.json({status:0,msg:err,CM_ID:0});
			else
			{
				if(reslt.length > 0)
				{
						let sql = "UPDATE link_master SET  LM_Folder_ID=0 WHERE JM_ID="+req.body.JM_ID+" and LM_Folder_ID="+req.body.CM_ID;	
						let query = connection.query(sql, (err, results) => {
						if (err) 
						{
							res.json({status:0,msg:err});
						}
						else
						{
							let sql = "DELETE FROM category_master WHERE CM_ID="+req.body.CM_ID;
							connection.query(sql, function (err, result)
							 {
								if (err) res.json({status:0,msg:'error in query',CM_ID:0});
								res.json({status:1,msg:'success',CM_ID:req.body.CM_ID});
								console.log("Number of records deleted: " + result.affectedRows);
								
							});
						}	
					});
				}
				else
				{
					let sql = "DELETE FROM category_master WHERE CM_ID="+req.body.CM_ID;
							connection.query(sql, function (err, result)
							 {
								if (err) res.json({status:0,msg:err,CM_ID:0});
								res.json({status:1,msg:'success',CM_ID:req.body.CM_ID});
								console.log("Number of records deleted: " + result.affectedRows);
								
							});
				}	
			}
			
		});
				
		
	}
	else
	{
		res.json({status:0,msg:'empty LM_ID'});
	}		 

  });

   //11-mar-2021
  //deleteCategory
  app.post('/admin/deleteEmbed',(req, res) => {

	if(req.body.EC_ID > 0)
	{
			let sql = "DELETE FROM embed_content WHERE EC_ID="+req.body.EC_ID;
			connection.query(sql, function (err, result) {
				if (err) res.json({status:0,msg:'error in query',EC_ID:0});
				res.json({status:1,msg:'success',EC_ID:req.body.EC_ID});
				console.log("Number of records deleted: " + result.affectedRows);
				
			});
	}
	else
	{
		res.json({status:0,msg:'empty LM_ID'});
	}		 

  });
app.get('/admin/removeFolder',function(req,res){	
		var path=__dirname+'/uploads/Profile/sam_15';
		// fs.unlink(path, function(err) {
		// 	if(err && err.code == 'ENOENT') {
		// 		// file doens't exist
		// 		console.info("File doesn't exist, won't remove it.");
		// 	} else if (err) {
		// 		// other errors, e.g. maybe we don't have enough permission
		// 		console.error("Error occurred while trying to remove file");
		// 	} else {
		// 		console.info(`removed`);
		// 	}
		// });

	
			// delete directory recursively
			fs.rmdir(path, { recursive: true }, (err) => {
				if (err) {
					throw err;
				}
				console.log(`${path} is deleted!`);
			});
});

app.get('Api/removeFile',function(req,res){
		var path=__dirname+'/uploads/Profile/sam_15/abac.png';
		fs.unlink(path, function(err) {
			if(err && err.code == 'ENOENT') {
				// file doens't exist
				console.info("File doesn't exist, won't remove it.");
			} else if (err) {
				// other errors, e.g. maybe we don't have enough permission
				console.error("Error occurred while trying to remove file");
			} else {
				console.info(`removed`);
			}
		});
});
//========== apprearance
app.post('/admin/userAppear',function(req,res)
{

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var JM_ID=req.body.JM_ID;
		console.log(JM_ID);
		var sql="SELECT * FROM theme_master; SELECT * from theme_master_user where JM_ID="+JM_ID+" order by TMU_ID desc Limit 1; SELECT * from link_master where JM_ID="+JM_ID+"; SELECT * from joining_master where JM_ID="+JM_ID;
		
		//console.log(sql);
		connection.query(sql, function (error, results, fields) 
		{
			var user;
			var themeMaster,userThemeDetails,linkMaster,userDetails;
			if (!error)
			{
					themeMaster=themeMaster=results[0];
					userThemeDetails=results[1];	
					linkMaster=results[2];		
					userDetails=results[3];
					res.json(
							{
								status:1,
								msg:'success',
								JM_ID:JM_ID,
								themeMaster:themeMaster,
								userThemeDetails:userThemeDetails,
								linkMaster:linkMaster,
								userDetails:userDetails												
							}
					);	
			}	
			else
			{
				res.json({
					status:0,
					msg:'no data found',
					JM_ID:0,
					themeMaster:themeMaster,
					userThemeDetails:userThemeDetails,
					linkMaster:linkMaster,
					userDetails:userDetails		
					});	
			}	
	});
		

})
//UpdateDefaultTheme
app.post('/admin/updateDefaultTheme',function(req,res)
{
	
	  const values = [
		[
			req.body.TM_ID, 
			req.body.JM_ID,
			'',
			req.body.TM_Back_Image, 
			req.body.TM_Item_Color,
			req.body.TM_Item_Style,
			req.body.TM_Highlight_Color, 
			req.body.TM_Font,
			req.body.TM_Font_Color,
			req.body.TM_Bio_Color,
			req.body.TM_Active,
			req.body.TM_Class_Name	
		]
	
	  ];
	  //console.log(req.body);


	  res.setHeader('Access-Control-Allow-Origin', '*');	
	  var JM_ID=req.body.JM_ID;
	  connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
		if (error)
		 {
			res.json({
			  	  status:0,
				  msg:'there are some error with query'
			  })
		}
		else
		{
		  if(results.length > 0) // update if exist
		  {
			 
					 
				let sql = "UPDATE theme_master_user SET  TM_ID="+req.body.TM_ID+",JM_ID="+req.body.JM_ID+",TM_Back_Color='' ,TM_Back_Image='"+req.body.TM_Back_Image+"',TM_Item_Color='' ,TM_Item_Style='' ,TM_Highlight_Color='' ,TM_Font='',TM_Font_Color='' ,TM_Bio_Color='' ,TM_Name_Color='' ,TM_Footer_Color='' ,TM_Border_Color='',TM_Item_Effect='',TM_Thumbnail_Icon_Color='',TM_SocialWidget_Icon_Color='',TM_Active='"+req.body.TM_Active+"' ,TM_Class_Name='"+req.body.TM_Class_Name+"' WHERE JM_ID="+JM_ID;
	
				//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
				let query = connection.query(sql, (err, resul) => {
					if (err) 
					{
						res.json({status:0,msg:err});
					}
					else
					{
						
						res.json({status:1,msg:'updated',ID:JM_ID});
					}	
				});

		  }
		  else // insert 
		  {
			const sql = "INSERT INTO  theme_master_user(TM_ID, JM_ID, TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active) VALUES ?";
	
			const query = connection.query(sql, [values], function(err, result) {
			  if (err) 
			  {
				  res.json({status:0,msg:"error in insert"});
			  }
			  else
			  {
				  let TMU_ID=result.insertId;
				  res.json({status:1,msg:'inserted',TMU_ID:TMU_ID});
			  }	
			});
		  }
		}
	  });

	 
	
});
//updateCustomTheme
app.post('/admin/updateCustomTheme',function(req,res)
{

	let sampleFile;
	let uploadPath;
	var TM_Back_Image="";
	if (!req.files)
	{
		console.log("no file exist");
		const values = [
			[
				req.body.TM_ID, 
				req.body.JM_ID,
				req.body.TM_Back_Color,
				TM_Back_Image, 
				req.body.TM_Item_Color,
				req.body.TM_Item_Style,
				req.body.TM_Highlight_Color, 
				req.body.TM_Font,
				req.body.TM_Font_Color,
				req.body.TM_Bio_Color,
				req.body.TM_Active,
				req.body.TM_Class_Name	
			]
		
		  ];
		  //console.log(req.body);
	
	
		  res.setHeader('Access-Control-Allow-Origin', '*');	
		  var JM_ID=req.body.JM_ID;
		  connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
			if (error)
			 {
				res.json({
				  status:0,
				  msg:'there are some error with query'
				  })
			}
			else
			{
			  if(results.length > 0) // update if exist
			  {
				 
						 
					let sql = "UPDATE theme_master_user SET  TM_ID='"+req.body.TM_ID+"',JM_ID='"+req.body.JM_ID+"',TM_Back_Color='"+req.body.TM_Back_Color+"',TM_Item_Color='"+req.body.TM_Item_Color+"' ,TM_Item_Style='"+req.body.TM_Item_Style+"' ,TM_Highlight_Color='"+req.body.TM_Highlight_Color+"' ,TM_Font='"+req.body.TM_Font+"',TM_Font_Color='"+req.body.TM_Font_Color+"' ,TM_Bio_Color='"+req.body.TM_Bio_Color+"' ,TM_Active='"+req.body.TM_Active+"' ,TM_Class_Name='"+req.body.TM_Class_Name+"' WHERE JM_ID="+JM_ID;
		
					//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
					let query = connection.query(sql, (err, results) => {
						if (err) 
						{
							res.json({status:0,msg:err});
						}
						else
						{
							let TMU_ID=results.insertId;
							
								connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
										if (error)
										{
											res.json({
											status:0,
											msg:'there are some error with query'
											})
										}
										else
										{
										if(results.length > 0) // update if exist
										{
											
											let sql = "UPDATE joining_master SET  JM_Description='"+req.body.JM_Description+"' WHERE JM_ID="+JM_ID;
		
											//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
											let query = connection.query(sql, (err, result) => {
												if (err) 
												{
													res.json({status:0,msg:err});
												}
												else
												{
													res.json({status:1,msg:'Done',userThemeDetails:results});
												}
											});
											
										}
									}
								});

						}	
					});
	
			  }
			  else // insert 
			  {
				const sql = "INSERT INTO  theme_master_user(TM_ID, JM_ID, TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active) VALUES ?";
		
				const query = connection.query(sql, [values], function(err, result) {
				  if (err) 
				  {
					  res.json({status:0,msg:"error in insert"});
				  }
				  else
				  {
					
					 
						connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
								if (error)
								{
									res.json({
									status:0,
									msg:'there are some error with query'
									})
								}
								else
								{
								if(results.length > 0) // update if exist
								{
									
									res.json({status:1,msg:'Done',userThemeDetails:results});
								}
							}
						});

				  }	
				});
			  }
			}
		  });
	
		 
	}
	else
	{
		console.log("file exist");
		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		var JM_ID=req.body.JM_ID;
		var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
		sampleFile = req.files.sampleFile;
		var fileName="bg_"+JM_ID+"_"+sampleFile.name;
		uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;		
		TM_Back_Image='Profile/' + ProfileName+"/"+fileName;


		let result={};
		sampleFile.mv(uploadPath, function(err) 
		{
			if(err)
			{
				res.json({
					status:0,
					msg:'unable to upload'
					})
			}				
			else	
			{
				const values = [
					[
						req.body.TM_ID, 
						req.body.JM_ID,
						req.body.TM_Back_Color,
						TM_Back_Image, 
						req.body.TM_Item_Color,
						req.body.TM_Item_Style,
						req.body.TM_Highlight_Color, 
						req.body.TM_Font,
						req.body.TM_Font_Color,
						req.body.TM_Bio_Color,
						req.body.TM_Active,
						req.body.TM_Class_Name	
					]
				
				  ];
				  //console.log(req.body);
			
			
				  res.setHeader('Access-Control-Allow-Origin', '*');	
			
				  connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
					if (error)
					 {
						res.json({
						  status:0,
						  msg:'there are some error with query'
						  })
					}
					else
					{
					  if(results.length > 0) // update if exist
					  {
						 
								 
							let sql = "UPDATE theme_master_user SET  TM_ID='"+req.body.TM_ID+"',JM_ID='"+req.body.JM_ID+"',TM_Back_Color='"+req.body.TM_Back_Color+"' ,TM_Back_Image='"+TM_Back_Image+"',TM_Item_Color='"+req.body.TM_Item_Color+"' ,TM_Item_Style='"+req.body.TM_Item_Style+"' ,TM_Highlight_Color='"+req.body.TM_Highlight_Color+"' ,TM_Font='"+req.body.TM_Font+"',TM_Font_Color='"+req.body.TM_Font_Color+"' ,TM_Active='"+req.body.TM_Active+"' ,TM_Class_Name='"+req.body.TM_Class_Name+"' WHERE JM_ID="+JM_ID;
				
							//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
							let query = connection.query(sql, (err, results) => {
								if (err) 
								{
									res.json({status:0,msg:err});
								}
								else
								{

									connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
										if (error)
										 {
											res.json({
											  status:0,
											  msg:'there are some error with query'
											  })
										}
										else
										{
										  if(results.length > 0) // update if exist
										  {
											let TMU_ID=results.insertId;
											res.json({status:1,msg:'Done',userThemeDetails:results});
										  }
										}
									});

								
								}	
							});
			
					  }
					  else // insert 
					  {
						const sql = "INSERT INTO  theme_master_user(TM_ID, JM_ID, TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active) VALUES ?";
				
						const query = connection.query(sql, [values], function(err, result) {
						  if (err) 
						  {
							  res.json({status:0,msg:"error in insert"});
						  }
						  else
						  {
							  let TMU_ID=result.insertId;
							  res.json({status:1,msg:'Done'});
						  }	
						});
					  }
					}
				  });
			}  
		
		});

	}
	

	
	f
});
//====================== profile url

app.post('/admin/isExistUrl',function(req,res){
	
	  res.setHeader('Access-Control-Allow-Origin', '*');	
	  var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
var livePreview=req.body.livePreview;
	  console.log(JM_User_Profile_Url)
var myquery = "SELECT * FROM joining_master WHERE JM_User_Profile_Url = '" + JM_User_Profile_Url+"'  and  isDeleted=0 and isBlocked=0";
	  connection.query(myquery , function (error, result, fields) {
	  if (error)
	   {
		  res.json({
			status:0,
			msg:error
			})
	  }
	  else
	  {
			if(result.length > 0)
			{
				console.log(" I m here " + result[0].JM_ID);
				var JM_ID=result[0].JM_ID;
				var sql="SELECT JM_ID,JM_Name,JM_Email,JM_Description,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Social_Widget_Position,JM_Payout_Details,JM_Verified,isRequested,isBlocked FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select *,Concat('Profile/',jm.JM_User_Profile_Url,'_',jm.JM_ID,'/Links/') as ProfilePath from link_master lm inner join joining_master jm on jm.JM_ID=lm.JM_ID  where lm.JM_ID="+JM_ID+" order by LM_OrderBy; SELECT * from theme_master_user where JM_ID="+JM_ID+" order by TMU_ID desc Limit 1; SELECT * from social_widget_master where JM_ID="+JM_ID+" order by SWM_OrderBy; SELECT * from category_master where JM_ID="+JM_ID+"; SELECT * FROM link_master lm inner join category_master cm on cm.CM_ID=lm.LM_Folder_ID where lm.JM_ID="+JM_ID+"; SELECT * from embed_content where JM_ID="+JM_ID+";  Select * from direct_access_master_user where JM_ID="+JM_ID+" and Archive=0 and DA_Type!='gifts' order by DA_OrderBy; Select * from direct_access_master_user where JM_ID="+JM_ID+" and Archive=0 and DA_Type in('gifts','support')  order by DA_OrderBy;";
					
					//console.log(sql);
					connection.query(sql, function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster,themeMasterUser,socialWidget,category_master,category_links,embed_content,productList,gifts;
						if (!error)
						{
                                    user=results[0];
                                    directAccess=results[1];
                                    linkMaster=results[2];
                                    themeMasterUser=results[3];
                                    socialWidget=results[4];
                                    category_master=results[5];
                                    category_links=results[6];
                                    embed_content=results[7];
                                    productList=results[8];
									gifts=results[9];

									var ip = req.headers['x-forwarded-for'].split(',')[0];
                                 	var data  = {
                                        JM_Profile_Url : JM_User_Profile_Url,
                                        JM_ID: JM_ID,
										IP:ip
                                      };

											if(livePreview==0)
                                            {	
													   let sql = "INSERT INTO view_master SET ?";
                                                       let query = connection.query(sql, data,(err, Dataresults) => 
                                                       {
                                                                 if(err) res.json({status:0,msg:err}); 												
                                                                  res.json(
                                                                        {
                                                                            status:1,
                                                                            msg:'success',
                                                                            JM_ID:results[0].JM_ID,
                                                                            userDetails:user,
                                                                            directAccess:directAccess,
                                                                            linkMaster:linkMaster,
                                                                            themeMasterUser:themeMasterUser,
                                                                            socialWidget:socialWidget,
                                                                            category_master:category_master,
                                                                            category_links:category_links,
                                                                            embed_content:embed_content,
                                                                            productList:productList,
                                                                            gifts:gifts
                                                                        }
                                                                );		
                                                      });

                                            }
                                            else
                                            {
																									
                                                                  res.json(
                                                                        {
                                                                            status:1,
                                                                            msg:'success',
                                                                            JM_ID:results[0].JM_ID,
                                                                            userDetails:user,
                                                                            directAccess:directAccess,
                                                                            linkMaster:linkMaster,
                                                                            themeMasterUser:themeMasterUser,
                                                                            socialWidget:socialWidget,
                                                                            category_master:category_master,
                                                                            category_links:category_links,
                                                                            embed_content:embed_content,
                                                                            productList:productList,
                                                                            gifts:gifts
                                                                        }
                                                                );		

                                            }
                                              

								
						}	
						else
						{


                              res.json({
                                  status:0,
                                  msg:error,
                                  JM_ID:0,
                                  userDetails:user,
                                  directAccess:directAccess,
                                  linkMaster:linkMaster,
                                  themeMasterUser:themeMasterUser,
                                  socialWidget:socialWidget,
                                  category_master:category_master,
                                  category_links:category_links,
                                  embed_content:embed_content,
                                  productList:productList,
								  gifts:gifts
                              });	
                                  

						}	
				});
			}
			else
			{
				res.json({
                      status:0,
                      msg:'invalid url',
						myquery:myquery
					})
			}
	  	}
	});
	
});
//=========session handling
// router.get('/setColor', function(req , res , next){
// 	req.session.favColor = 'Red';
// 	res.send('Setting favourite color ...!');
// });

// router.get('/getColor', function(req , res , next){
// 	res.send('Favourite Color : ' + (req.session.favColor == undefined?"NOT FOUND":req.session.favColor));
// });


app.post('/admin/forgotPassword',function(req,res){

var randomPassword = model.RandomAlpha();
res.setHeader('Access-Control-Allow-Origin', '*');	
	var email=req.body.JM_Email;
    const hashPassword = bcrypt.hashSync(randomPassword, saltRounds);
    connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[email], function (error, results, fields) {
      if (error) 
	  {
          res.json({
            status:0,
            msg:'there are some error with query'
            })
      }
	  else
	  {
			if(results.length >0)
			{
			
							var string=JSON.stringify(results);				
							var json =  JSON.parse(string);			
							console.log(json[0].JM_ID);				
							console.log(randomPassword)
							console.log(hashPassword)	
							var JM_ID=json[0].JM_ID;
							var JM_Name=json[0].JM_Name;
							console.log(email)
							var text="This is your new password "+randomPassword;
							var mailOptions = {
								from: "Expy Admin <admin@expy.bio>",
								to: email,
								subject: "RESET YOUR PASSWORD",
								text: "This is your new password "+randomPassword,
								html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p>We received a request to reset your Expy.bio password.</p><p>You can Enter the following auto-generated password to login: <b> "+randomPassword+"</b></p><p>If you wish to reset your password, you can login to your expy account and reset it from the <b>settings</b> page in your Menu.</p><p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p><p><i>If this reset request was not made by you, please let us know by emailing the same to info@expy.bio</i> .</p><span><b>Regards,</b></span><br/><span><b>Team Expy</b></span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>"
							}


							transporter.sendMail(mailOptions, (error, info) => 
							{
                             	 if (error) 
								  {
                                          res.json({status:0,msg:"mail not sent",url:'',arr:req.body});
                                  }
                                    
								else
								{
									
									let sql = "UPDATE joining_master SET  JM_Password='"+hashPassword+"' WHERE JM_ID="+JM_ID;	
							
									let query = connection.query(sql, (err, result) =>
									 {
										if (err) 
										{
											res.json({status:0,msg:err});
										}
										else
										{
										
									 		res.json({status:1,msg:"sent",url:'',arr:req.body});
										}	
									});
								}
                               		 
							});



			}
			else
			{
				res.json({
					status:0,
					msg:"Email does not exits",
					body:req.body
				});
			}
      }
    });


});
//02-mar-2021
app.post('/admin/updateProfileNameDescription',function(req,res){

	// if(req.session.JM_ID == undefined )
	// {	
		// res.json({status:1,msg:"invalid api calling"});
		// return false;
	// }
	// if(parseInt(req.session.JM_ID) == 0 )
	// {
	// 	res.json({status:0,msg:"invalid api calling"});
	// 	return false;
	// }
	// if(isNaN(req.session.JM_ID))
	// {
	// 	res.json({status:1,msg:"invalid api calling"});
	// 	return false;
	// }
	if(parseInt(req.body.JM_ID) ==0)
	{
		res.json({status:0,msg:"missing param"});
		  return false;
	}

	let sql="";
	if(req.body.name!="")
	{
			if(req.body.name=='JM_Name')
				sql = "UPDATE joining_master SET  JM_Name='"+req.body.JM_Name+"' WHERE JM_ID="+req.body.JM_ID;	
			else
				sql = "UPDATE joining_master SET  JM_Description='"+req.body.JM_Description+"' WHERE JM_ID="+req.body.JM_ID;	
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:"err"});
				}
				else
				{
					
					res.json({status:1,msg:"Profile is Updated"});
				}	
			});
	}
	else
	{
		res.json({status:0,msg:"name parametre is missing"});
	}
})
app.post('/admin/updateOrderBySocialWidget',function(req,res){

	console.log(req.body.socialWidget)
	let sql="";
	if(req.body.socialWidget!=null && req.body.socialWidget.length > 0)
	{
		let len=req.body.socialWidget.length ;
		var SocialWidget=req.body.socialWidget;

		for(let i=0;i<len;i++)
		{
			sql+= "UPDATE social_widget_master SET  SWM_OrderBy="+i+" WHERE JM_ID="+SocialWidget[i].JM_ID+" and SWM_ID="+SocialWidget[i].SWM_ID+";";	
			
		}
		
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:err});
				}
				else
				{
					
						//callback();
						res.json({status:1,msg:"Profile is Updated"});
					
				}	
			});
	}
	// function callback () {
	// 	res.json({status:1,msg:"Profile is Updated"});
	// };

})
app.post('/admin/updateOrderByCustomLink',function(req,res){

	console.log(req.body.customLink)
	let sql="";
	if(req.body.customLink!=null && req.body.customLink.length > 0)
	{
		let len=req.body.customLink.length ;
		var customLink=req.body.customLink;

		for(let i=0;i<len;i++)
		{
			sql+= "UPDATE link_master SET  LM_OrderBy="+i+" WHERE JM_ID="+customLink[i].JM_ID+" and LM_ID="+customLink[i].LM_ID+";";	
			
		}
		
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:err});
				}
				else
				{
					
						//callback();
						res.json({status:1,msg:"Profile is Updated"});
					
				}	
			});
	}
	

})

//08-apr-2021

app.post('/admin/updateOrderByProductList',function(req,res){

	console.log(req.body.productList)
	let sql="";
	if(req.body.productList!=null && req.body.productList.length > 0)
	{
		let len=req.body.productList.length ;
		var productList=req.body.productList;

		for(let i=0;i<len;i++)
		{
			sql+= "UPDATE direct_access_master_user SET  DA_OrderBy="+i+" WHERE JM_ID="+productList[i].JM_ID+" and DA_ID="+productList[i].DA_ID+";";	
			
		}
		
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:err});
				}
				else
				{
					
						//callback();
						res.json({status:1,msg:"Profile is Updated"});
					
				}	
			});
	}


})



















//uploadBackgroundImage
app.post('/admin/uploadBackgroundImage',function(req,res){
	let sampleFile;
	let uploadPath;
	var TM_Back_Image="";
	if(req.files.sampleFile!=null)
	{
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	sampleFile = req.files.sampleFile;
	var fileName="bg_"+JM_ID+"_"+sampleFile.name;
	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;		
	TM_Back_Image='Profile/' + ProfileName+"/"+fileName;
	let result={};
	sampleFile.mv(uploadPath, function(err) 
	{
		if(err)
		{
			res.json({
				status:0,
				msg:err
				})
		}				
		else	
		{
			const values = [
				[
					req.body.TM_ID, 
					req.body.JM_ID,			
					TM_Back_Image, 
					req.body.TM_Active,		
				]
			
			  ];
			  //console.log(req.body);
		
		
			  res.setHeader('Access-Control-Allow-Origin', '*');			
			  connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
				if (error)
				 {
					res.json({
					  status:0,
					  msg:'there are some error with query'
					  })
				}
				else
				{
				  if(results.length > 0) // update if exist
				  {
					 
						let sql = "UPDATE theme_master_user SET TM_Back_Image='"+TM_Back_Image+"',TM_Back_Color=''  WHERE JM_ID="+JM_ID;
			
						//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
						let query = connection.query(sql, (err, results) => {
							if (err) 
							{
								res.json({status:0,msg:err});
							}
							else
							{
									connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
										if (error)
										{
											res.json({
											status:0,
											msg:'there are some error with query'
											})
										}
										else
										{
											if(results.length > 0) // update if exist
											{
											
												res.json({status:1,msg:'Done',userThemeDetails:results});
											}
										}
								});
							}	
						});
		
				  }
				  else // insert 
				  {
					const sql = "INSERT INTO  theme_master_user(TM_ID, JM_ID,TM_Back_Image,TM_Active) VALUES ?";
			
					const query = connection.query(sql, [values], function(err, result) {
					  if (err) 
					  {
						  res.json({status:0,msg:"error in insert"});
					  }
					  else
					  {
							let TMU_ID=result.insertId;
							connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], function (error, results, fields) {
									if (error)
									{
										res.json({
										status:0,
										msg:'there are some error with query'
										})
									}
									else
									{
										if(results.length > 0) // update if exist
										{
										
											res.json({status:1,msg:'Done',userThemeDetails:results});
										}
									}
							});
					  }	
					});
				  }
				}
			  });
		}  
	
	});
	}
	else{
		res.json({status:0,msg:'no file exist'});
	}
});


//3-mar-2021
app.post('/admin/moveLinkToFolder',function(req,res){

	let sql ="";
	if(req.body.type=='customLink')
	{
		 sql = "UPDATE link_master SET LM_Folder_ID='"+req.body.CM_ID+"'  WHERE LM_ID="+req.body.LM_ID+" and JM_ID="+req.body.JM_ID;
	}

		//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
	let query = connection.query(sql, (err, results) => {
		if (err) 
		{
			res.json({status:0,msg:err});
		}
		else
		{
						
			res.json({status:1,msg:'Done'});
		}	
	});
})
//4-mar-2021
app.post('/admin/UpdateCategory',function(req,res){
	let sampleFile;
	let uploadPath;
	var TM_Back_Image="";
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	if(req.files!=null)
	{
	
		sampleFile = req.files.sampleFile;

		var ext = path.extname(sampleFile.name);		
		var Name=sampleFile.md5;
		var fileName=Name+ext;
	

		uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;		
		var CM_Folder_Back_Image="Profile/" + ProfileName+"/"+fileName;
		console.log(fileName);
		let result={};
		sampleFile.mv(uploadPath, function(err) 
		{
			if(err)
			{
				res.json({
					status:0,
					msg:'unable to upload'
					})
			}				
			else	
			{
				
				//console.log(req.body);
				let sql = "UPDATE category_master SET CM_Folder_Title='"+req.body.CM_Folder_Title+"',CM_Folder_Sub_Title='"+req.body.CM_Folder_Sub_Title+"',CM_Folder_Back_Image='"+CM_Folder_Back_Image+"',CM_Icon=''  WHERE CM_ID="+req.body.CM_ID+" and JM_ID="+JM_ID;
				let query = connection.query(sql, (err, results) => {
					if (err) 
					{
						res.json({status:0,msg:err});
					}
					else
					{
							connection.query('SELECT * FROM category_master WHERE JM_ID = ?',[req.body.JM_ID], function (error, results, fields) {
								if (error)
								{
									res.json({
									status:0,
									msg:'there are some error with query'
									})
								}
								else
								{
									if(results.length > 0) // update if exist
									{
									
										res.json({status:1,msg:'Done',category_master:results});
									}
								}
							});
					}	
				});
			}
		});
	}
	else
	{
		let CM_Icon=req.body.CM_Icon;


		let sql = "UPDATE category_master SET CM_Folder_Title='"+req.body.CM_Folder_Title+"',CM_Folder_Sub_Title='"+req.body.CM_Folder_Sub_Title+"',CM_Icon='"+CM_Icon+"'  WHERE CM_ID="+req.body.CM_ID+" and JM_ID="+JM_ID;
		let query = connection.query(sql, (err, results) => {
			if (err) 
			{
				res.json({status:0,msg:err});
			}
			else
			{
					connection.query('SELECT * FROM category_master WHERE JM_ID = ?',[req.body.JM_ID], function (error, results, fields) {
						if (error)
						{
							res.json({
							status:0,
							msg:'there are some error with query'
							})
						}
						else
						{
							if(results.length > 0) // update if exist
							{
							
								res.json({status:1,msg:'Done',category_master:results});
							}
						}
				});
			}	
		});
	}
});

//05-mar-2021
app.post('/admin/updateCustomThemeOnclick',function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');	
	let colName=req.body.colName;
	let colValue=req.body.colValue;
	let JM_ID=req.body.JM_ID;
	const values = [
		[
			colValue
		]
	  ];
	  let sql1="SELECT * FROM theme_master_user WHERE JM_ID = "+JM_ID+" ORDER BY TMU_ID DESC LIMIT 1";
	  connection.query(sql1, function (error, results, fields) {
		if (error)
		 {
			res.json({
			  status:0,
			  msg:'there are some error with query'
			  })
		}
		else
		{
		  if(results.length > 0) // update if exist
		  { 
				let sql="";
				if(colName=='TM_Back_Color')
                {
						 sql = "UPDATE theme_master_user SET "+colName+"='"+colValue+"',TM_Back_Image=''  WHERE JM_ID="+JM_ID;	
                }
				else
				{
                        sql = "UPDATE theme_master_user SET "+colName+"='"+colValue+"' WHERE JM_ID="+JM_ID;	
                   
				}
 				let query = connection.query(sql, (err, results) => {
 	                       if (err) 
                        {
                            res.json({status:0,msg:err});
                        }
                        else
                        {
                            let TMU_ID=results.insertId;
                            let sql2="SELECT * FROM theme_master_user WHERE JM_ID = "+JM_ID+" ORDER BY TMU_ID DESC LIMIT 1";
                                connection.query(sql2, function (error, results, fields) {
                                        if (error)
                                        {
                                            res.json({
                                            status:0,
                                            msg:'there are some error with query'
                                            })
                                        }
                                        else
                                        {

                                            res.json({status:1,msg:'Done',userThemeDetails:results});										

                                        }

                                });

                        }	
                    });

		  }
		  else // insert 
		  {
			const sql = "INSERT INTO  theme_master_user(JM_ID,'"+colName+"') VALUES ?";
	
			const query = connection.query(sql, [values], function(err, result) {
			  if (err) 
			  {
				  res.json({status:0,msg:"error in insert"});
			  }
			  else
			  {
				
				 			let sql="SELECT * FROM theme_master_user WHERE JM_ID = "+JM_ID+" ORDER BY TMU_ID DESC LIMIT 1";
							connection.query(sql, function (error, reslt, fields) {
							if (error)
							{
								res.json({
								status:0,
								msg:'there are some error with query'
								})
							}
							else
							{
								if(reslt.length > 0) // update if exist
								{
									
									res.json({status:1,msg:'Done',userThemeDetails:reslt});
								}
							}
					});

			  }	
			});
		  }
		}
	  });

});

app.get('/admin/testModel',function(req,res){

		model.getPremiumContent_By_Id(23,function(results)
		{
			console.log(results);
		});
});

//19-mar-2021
//removeBackgroundImage



app.post('/admin/removeBackgroundImage',function(req,res){
	
	var JM_ID= parseInt(req.body.JM_ID);
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
 
	 let sql = "UPDATE theme_master_user SET  TM_Back_Image='' WHERE JM_ID="+JM_ID;
	   let query = connection.query(sql, (err, results) => 
	   {
		 if(err) 
		 {
			 console.log(err);
			 res.json({status:0,msg:"error"});
		 }
		 else
		 {
			 res.json({status:1,msg:'Profile is Updated'});
		 }	
	 });

 
});





//====================================================== premium content


//03-apr-2021
//for leads
app.post('/admin/addLeads',function(req,res){

	var premium_url=process.env.PREMIUM_URL;
	var DA_ID=parseInt(req.body.DA_ID);
	var BM_Instruction=req.body.BM_Instruction;
	var BM_Name=req.body.BM_Name;
	var BM_Email=req.body.BM_Email;
	var BM_Phone=req.body.BM_Phone;
	var Consent=req.body.Consent;

	var BM_Purchase_Amt=req.body.BM_Purchase_Amt;	
	if(DA_ID==0)
	{
		res.json({status:0,msg:"provide DA_ID"});
		return false;
	}

	const values = [
		[DA_ID,BM_Name, BM_Email,BM_Phone,BM_Purchase_Amt,BM_Instruction,Consent]			
	];
	const sql = "INSERT INTO  lead_master(DA_ID,BM_Name, BM_Email,BM_Phone,BM_Purchase_Amt,BM_Instruction,Consent) VALUES ?";	  
	const query = connection.query(sql, [values], function(err, result)
	{


			if (err) 
			{
				console.log(err);
				res.json({status:0,msg:err,LM_ID:0});
			}
			else
			{
				res.json({status:1,msg:"done",LM_ID:result.insertId});
			}
	});

});



//16-mar-2021
const cryptoRandomString = require('crypto-random-string');
//addBuyers
app.post('/admin/addBuyers',function(req,res){

		var premium_url=process.env.PREMIUM_URL;
		var DA_ID=parseInt(req.body.DA_ID);
		var BM_Instruction=req.body.BM_Instruction;
		var BM_Name=req.body.BM_Name;
		var BM_Email=req.body.BM_Email;
		var BM_Phone=req.body.BM_Phone;
		var BM_Password=req.body.BM_Password;
		var BM_Purchase_Amt=req.body.BM_Purchase_Amt;

			if(DA_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
		
			model.getPremiumContent_By_Id(DA_ID,function(results)
			{
				records = results;
				console.log(records);
				
				var string=JSON.stringify(results);				
				var jsonRes =  JSON.parse(string);	
				var fileArr=JSON.parse(jsonRes[0].DA_Collection);		
				var JM_Profile_Url=	jsonRes[0].JM_Profile_Url;
				//purchased for only one file
				if(fileArr!=null && fileArr.length > 0 && fileArr.length==1)
				{
					console.log(fileArr[0]);
					var fileName=fileArr[0];			
					var name =path.parse(fileName).name;    
					var ext = path.extname(fileName);
					var sourceDir = 'uploads/Profile/'+JM_Profile_Url+"/"+fileName;				
					let destDir=	'store';
					var unique_id=cryptoRandomString({length: 20, type: 'alphanumeric'});
					const pathToFile = path.join(__dirname, sourceDir)
					const pathToNewDestination = path.join(__dirname, destDir,unique_id+"_"+fileName);
					var BM_Url_ID=unique_id;
					
					var NewfileArray=[BM_Url_ID+"_"+fileName]
					var BM_FileUrl=JSON.stringify(NewfileArray);//		
					fs.copyFile(pathToFile, pathToNewDestination, function(err) 
					{
						if (err) 
						{
							throw err
						} 
						else 
						{
							console.log("Successfully copied and moved the file!")
							const values = [
								[DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl]			
							];
							const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl) VALUES ?";	  
							const query = connection.query(sql, [values], function(err, result) {
								if (err) 
								{
									console.log(err);
									res.json({status:0,msg:"error"});
								}
								else
								{
									var text="Purchased Link "+premium_url+BM_Url_ID;
									var mail = {
										from: "Expy <from@gmail.com>",
										to: BM_Email,
										subject: "Purchased Premium Content",
										text: text,
										html: "<h1>"+text+"</h1><a href='"+premium_url+BM_Url_ID+"'><b>download content</b></a><a href='https://expy.in'><b>more info..</b></a>"
									}
									smtpTransport.sendMail(mail, function(error, response)
									{
										if(error)
										{
											console.log(error);
										}
										else
										{
											
											console.log("Message sent: " + response.message);
											 res.json({status:1,msg:"sent"});
											
										}
									
										smtpTransport.close();
									});

									res.json({status:1,msg:'Done'});
								}	
							});
						}
					})
				}
				// if purchased for multiple files
				if(fileArr!=null && fileArr.length > 0 && fileArr.length > 1)
				{
					console.log("multiple file code")
				}
			});
});
app.get('/admin/decrypt/:key',function(req,res){
	var BM_Url_ID = req.params.key;
	console.log(BM_Url_ID);
	model.getBuyerEmail(BM_Url_ID,function(results)
	{
		console.log(results);
		if(results!=null && results.length > 0)
		{
			var BM_Email=results[0].BM_Email;
			var BM_ID=results[0].BM_ID;
			res.render( 'pages/decrypt',{BM_Url_ID:BM_Url_ID,BM_ID:BM_ID,BM_Email:BM_Email});
		}
		else
		{
			res.send( 'page not found');
		}
	});
  
});
app.post('/admin/validateDecrypt',function(req,res){
	let BM_Url_ID=req.body.BM_Url_ID;
	let password=req.body.BM_Password;
	console.log("validateDecrypt calling..."+ BM_Url_ID)
	console.log("validateDecrypt calling..."+ password)
	
	let sql="SELECT * from buyers_master where BM_Url_ID='"+BM_Url_ID+"'";//0yuIlufbB45PJtd55bcm
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
					const match = bcrypt.compareSync(password, BM_Password); // true
			
					 	 console.log(match)
						if(!match)
						{
							console.log(results[0].BM_Password);
							res.json({status:0,srcArray:[],msg:"invalid password"});								
						}
						else
						{             							
							res.json({status:1,srcArray:results,msg:"matched"});	
						}
			       
			}
		}
	});
})



app.get('/cryptoRandam',function(req,res){
	var unique_id="";
	cryptoRandomString({length: 20, type: 'numeric'});
	//console.log(unique_id) 

	
cryptoRandomString({length: 10});
//=> '2cf05d94db'

cryptoRandomString({length: 10, type: 'base64'});
//=> 'YMiMbaQl6I'

cryptoRandomString({length: 10, type: 'url-safe'});
//=> 'YN-tqc8pOw'

cryptoRandomString({length: 10, type: 'numeric'});
//=> '8314659141'

cryptoRandomString({length: 6, type: 'distinguishable'});
//=> 'CDEHKM'

cryptoRandomString({length: 10, type: 'ascii-printable'});
//=> '`#Rt8$IK>B'

unique_id=cryptoRandomString({length: 20, type: 'alphanumeric'});
//=> 'DMuKL8YtE7'

cryptoRandomString({length: 10, characters: 'abc'});
//=> 'abaaccabac'
	res.send(unique_id);
})

//====================================================== premium content end

//25-mar-2021
app.post("/admin/updateClick", function(req, res){

	let Stat_Type=req.body.Stat_Type;
	var Stat_ID=req.body.Stat_ID;
	var JM_ID=req.body.JM_ID;
	let tableName="";
	var data={};
	
	if(Stat_Type=='E')
	{	
		tableName='embed_content';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID
		};
		
	}
	if(Stat_Type=='S')
	{	
		tableName='social_widget_master';
		data  = {
			Stat_Type: Stat_Type,
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID
		};
		
	}
	if(Stat_Type=='L')
	{	
		tableName='link_master';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID
		};
		
	}
	if(Stat_Type=='P')
	{	
		tableName='direct_access_master_user';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID
		};
		
	}
	if(Stat_Type=='C')
	{	
		tableName='category_master';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID
		};
		
	}

   let sql = "INSERT INTO stat_master SET ?";
   let query = connection.query(sql, data,(err, results) =>
   {
   			 if(err) res.json({status:0,msg:err});
   			 res.json({status:1,msg:'done'});
  });

});


//26-mar-2021
//statsDetails




app.post('/admin/statsDetails', async function(req, res) {

	if(parseInt(req.body.JM_ID) > 0)
    {
 		let sql="";
		if(parseInt(req.body.param)==365)
		{
sql="SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title  from (   SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName   union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	 ) Y	  left outer join(	 SELECT Stat_ID,SUM(Stat_Click) TotClicks,	 MONTH(Create_Date) Create_Month, MONTHNAME(Create_Date) MonthName, 	 JM_ID,	 CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  	 WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM  stat_master  where JM_ID="+req.body.JM_ID+" 	 GROUP By MONTH(Create_Date),JM_ID	 )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+req.body.JM_ID+" GROUP By Stat_ID   ) M where M.Title!='NA'; SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" GROUP by JM_ID; SELECT  Y.MonthName Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews  from (    SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName      union  SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	    left outer join(	       SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,MONTH(Create_Date) Create_Month,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;  SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X ; SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+" GROUP BY DA_ID;SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title  from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	                 ) Y	   left outer join   (	                           Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Create_Month,m.MonthName, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        MONTH(bm.BM_Purchase_Date) Create_Month,MONTHNAME(bm.BM_Purchase_Date) as  MonthName, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+"                         group by MONTH(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Month    )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";

//unique views for a year
sql+="Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and YEAR(vm.Create_Date) GROUP BY DATE(vm.Create_Date),vm.IP ) A;";

// monitization table
sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue, A.Stat_Type     from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 365 DAY  GROUP By Stat_ID   ) A left outer join    (         SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) totalPurchases,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) * (IFNULL(cm.CM_Creator_Get,0) / IFNULL(cm.CM_Chrages_Per,0)) as revenue,       DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                 da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm                  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID             inner join joining_master jm on jm.JM_ID=da.JM_ID               where jm.JM_ID="+req.body.JM_ID+"   and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 365 DAY         GROUP BY Stat_ID        ) B on B.Stat_ID=A.Stat_ID; ";
		}
else if(parseInt(req.body.param)==30)
		{
sql="SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join ( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY 	GROUP By Date(Create_Date),JM_ID	)   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date; SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP By Stat_ID  ) M where M.Title!='NA'; SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP by JM_ID; SELECT Y.Create_Date Labels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date   from (  select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v   where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join (  SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 30 DAY GROUP BY DATE(Create_Date))   Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date; SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY GROUP BY DA_ID; SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date  from ( select Create_Date  from   (  select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from ( select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,(select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,                          (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4 ) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()   ) Y  left outer join( Select  m.Stat_ID,SUM(m.TotTran) TotTran, m.Stat_day,m.Create_Date, m.JM_ID, m.Title from ( SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran, DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID, 'Transaction' Title FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY  group by DATE(bm.BM_Purchase_Date),bm.DA_ID ) as m  group by m.Create_Date ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";

sql+=" Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 30 DAY GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";

// monitization table
sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue, A.Stat_Type   from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 30 DAY  GROUP By Stat_ID   ) A left outer join    (         SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) totalPurchases,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) * (IFNULL(cm.CM_Creator_Get,0) / IFNULL(cm.CM_Chrages_Per,0)) as revenue,       DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                 da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm                  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID             inner join joining_master jm on jm.JM_ID=da.JM_ID               where jm.JM_ID="+req.body.JM_ID+"   and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 30 DAY         GROUP BY Stat_ID        ) B on B.Stat_ID=A.Stat_ID;";

		}
else if(parseInt(req.body.param)==7)
		{
 		sql="Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date  union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date   union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date        union      Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   union   Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date       union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date         union     Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y    left outer join( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where 	LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP By Date(Create_Date),JM_ID  )   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date; SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)    WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY GROUP By Stat_ID ) M where M.Title!='NA'; SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP by JM_ID;SELECT Y.Stat_day Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date  from (  Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day, (CURDATE() - INTERVAL 6 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date   union Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   						  union Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date     union      Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date  	     union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y left join (SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 7 DAY GROUP BY DATE(Create_Date)  ) Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date; SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 6 DAY GROUP BY DA_ID;Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date                    union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date                        union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date           ) Y  left outer join(                    Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Stat_day,m.Create_Date, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 7 DAY                        group by DATE(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Date          ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";	


  sql+="Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 7 DAY    GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";


// monitization table
sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 7 DAY  GROUP By Stat_ID   ) A left outer join    (         SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) totalPurchases,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) * (IFNULL(cm.CM_Creator_Get,0) / IFNULL(cm.CM_Chrages_Per,0)) as revenue,       DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                 da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm                  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID             inner join joining_master jm on jm.JM_ID=da.JM_ID               where jm.JM_ID="+req.body.JM_ID+"   and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 7 DAY         GROUP BY Stat_ID        ) B on B.Stat_ID=A.Stat_ID;";

		}
      else
      {
 // graphDetails
sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Z.Create_Date  from ( select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union  select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM   ) Y     left outer join(     SELECT Stat_ID,SUM(Stat_Click) TotClicks,JM_ID,HOUR(Create_Date) hours,Create_Date,    CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)      WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)     WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)      WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title     FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP By HOUR(Create_Date) ) Z on Z.hours=Y.hours   Order by Y.hours;";

			
//unique clicks //clickDetails
 sql+="SELECT * from (      SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID, CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)   WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)      WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)       WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title      FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)     GROUP By Stat_ID ) M where M.Title!='NA'; ";

//total views //viewsDetails
sql+="SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)  GROUP by JM_ID;";

  //views //graphViewDetails
   sql+="SELECT Y.hours Lebels,Y.AM_PM,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews from    (             select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y    left join     (            SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,HOUR(Create_Date) hours,Create_Date             FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)            GROUP By HOUR(Create_Date)    ) Z on Z.hours=Y.hours     Order by Y.hours;";

//totalActivePeople
 sql+="SELECT COUNT(X.cnt) totalPeopleVisited  from (       SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; ";


//InAppPurchase
 sql+="SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP BY DA_ID; ";

  //transaction
     sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title, Z.Create_Date   from (                   select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y                      left outer join(                          SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        HOUR(bm.BM_Purchase_Date) as  hours, jm.JM_ID, bm.BM_Purchase_Date as  Create_Date,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and bm.BM_Purchase_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)                        GROUP BY HOUR(bm.BM_Purchase_Date)          )  Z on Z.hours=Y.hours                      Order by Y.hours;";

sql+="Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and vm.Create_Date >=  DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP BY DATE(vm.Create_Date),vm.IP ) A;";



// monitization table
sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP By Stat_ID   ) A left outer join    (         SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) totalPurchases,            SUM(IFNULL(bm.BM_Purchase_Amt,0)) * (IFNULL(cm.CM_Creator_Get,0) / IFNULL(cm.CM_Chrages_Per,0)) as revenue,       DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                 da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm                  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID             inner join joining_master jm on jm.JM_ID=da.JM_ID               where jm.JM_ID="+req.body.JM_ID+"   and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR)          GROUP BY Stat_ID        ) B on B.Stat_ID=A.Stat_ID;";


      }
      connection.query(sql, async function (err, results, fields) 
      {
		
			var clickDetails,viewsDetails,graphDetails,graphViewDetails,totalActivePeople,InAppPurchase,tranDetails,uniqueViews,monitization;
            if(err) 	res.json({status:0,msg:"err",
  											 graphDetails:graphDetails,
											clickDetails:clickDetails,
											viewsDetails:viewsDetails,
                                            graphViewDetails:graphViewDetails,
											totalActivePeople:totalActivePeople,
											InAppPurchase:InAppPurchase,
											tranDetails:tranDetails,
											uniqueViews:uniqueViews,
											monitization:monitization,
										

								});
			else
			{					


								const payoutBal=await getTotalPayout(JM_ID);

								graphDetails=results[0];
								clickDetails=results[1];
								viewsDetails=results[2];
                                graphViewDetails=results[3];
								totalActivePeople=results[4];
								InAppPurchase=results[5];
								tranDetails=results[6];
								uniqueViews=results[7];
								monitization=results[8];
						
							res.json(
										{
											status:1,
											msg:'success',
                                            graphDetails:graphDetails,
											clickDetails:clickDetails,
											viewsDetails:viewsDetails,
                                            graphViewDetails:graphViewDetails,
											totalActivePeople:totalActivePeople,
											InAppPurchase:InAppPurchase,
											tranDetails:tranDetails,
											uniqueViews:uniqueViews,
											monitization:monitization,
										}
								);	
					
					
						

			}
           
      });
   }
	
});


//29-jul-2021










//10-apr-2021

app.post('/admin/GetAllRequest',(req,res)=>{

	if(parseInt(req.body.JM_ID) > 0)
	{
			let sql="SELECT *,'' JM_Password, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+req.body.JM_ID+"; SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE IsSeen=0 and jm.JM_ID="+req.body.JM_ID+"  GROUP BY jm.JM_ID; SELECT * FROM referal_code_master where JM_ID="+req.body.JM_ID+"; Select *,'' JM_Password from joining_master where JM_ID="+req.body.JM_ID;

		connection.query(sql, function (error, results, fields) 
		{
			var allRequest,newRequest,referralCode,userDetails;
			 if (error) 
			 {
				 
				 res.json({
					 status:0,msg:"error",
					 JM_ID:req.body.JM_ID,
					 allRequest:allRequest,
					 newRequest:newRequest,
					referralCode:referralCode,
					userDetails:userDetails
					 });	
			 }
			 else
			 {	
							 allRequest=results[0];
							 newRequest=results[1];
							referralCode=results[2];
							userDetails=results[3];
					 
						  res.json({
							 status:1,msg:'success',
							 JM_ID:req.body.JM_ID,
							 allRequest:allRequest,
							 newRequest:newRequest,
								referralCode:referralCode,
								userDetails:userDetails
							 });	
			 }
		 });
	}
	else
	{
		res.json({status:0,msg:"JM_ID is empty"});
	}

})





//updateRequestStat

app.post('/admin/updateRequestStat', async function(req,res){

	let Status=req.body.Status;
	let BM_ID=req.body.BM_ID;
	var html="";
	var followerName=req.body.data.BM_Name;
	var Creator_Name=req.body.data.JM_Name;
	var purchased_date=req.body.data.BM_Purchase_Date; 
	var JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;
	var DA_Title=req.body.data.DA_Title;
	var BM_Purchase_Amt=req.body.data.BM_Purchase_Amt;
	var BM_Email=req.body.data.BM_Email;
	var JM_Phone=req.body.data.JM_Phone;
	var BM_Phone=req.body.data.BM_Phone;
	var msg="";
	if(Status=='A')
	{
		var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", Congratulations! Your Request was accepted by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>         <p>You will be notified as soon as the creator fulfills your request.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
		var mailOptions = {
			from: "Expy Admin <admin@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been accepted!",			
			html: html
		}
		var mailOptions2 = {
			from: "Expy Admin <info@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been accepted!",			
			html: html
		}
		 msg="Congrats "+followerName+" Your Request was accepted by "+Creator_Name+" on Expy. You will be notified as your request is fulfilled. Thank you.";
	}
	
	if(BM_ID > 0)
	{
		let sql = "UPDATE buyers_master SET  Status='"+Status+"',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
		let query = connection.query(sql, async (err, results) => {
			if(err) 
				res.json({status:0,msg:"error in query"});
			else
			{
				let sql="SELECT bm.* FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+req.body.JM_ID+"; SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE  jm.JM_ID="+req.body.JM_ID+" and IsSeen=0 GROUP BY jm.JM_ID;";
				connection.query(sql, async function (error, results, fields) 
				{
					var allRequest,newRequest;
					 if (error) 
					 {
						 
						 res.json({
							 status:0,msg:error,
							 JM_ID:req.body.JM_ID,
							 allRequest:allRequest,
							 newRequest:newRequest,						
							 });	
					 }
					 else
					 {	
							var isSentSMS=sendSMS(BM_Phone,msg);	

							var respon=await wrapedSendMailInfo(mailOptions2);

							transporter.sendMail(mailOptions, (error, info) => {
							if (error) 
							{
								allRequest=results[0];
								newRequest=results[1];	
								
																	
								res.json({
									status:1,msg:'unable to send Mail to follower',
									JM_ID:req.body.JM_ID,
									allRequest:allRequest,
									newRequest:newRequest,						
									});	
								
							}
							else
							{
								
								allRequest=results[0];
								newRequest=results[1];		
								var isSentSMS=sendSMS(JM_Phone,msg);					
								res.json({
									status:1,msg:'mail sent',
									JM_ID:req.body.JM_ID,
									allRequest:allRequest,
									newRequest:newRequest,						
									});	
								
							}	
						});
									
					 }
				 });
			}
		});
	}
	else
	{
		res.json({status:0,msg:"empty id"});
	}
		
})

//14-jun-2021 == update notification seen 
app.post('/admin/updateSeen', (req, res) => {

	var data=req.body.allReq;
		console.log(data)
	if(data!=null && data.length > 0)
	{
		let len=data.length ;
		let	sql = "";		let	Ids = "";
		for(let i=0;i<len;i++)
		{
			Ids+=parseInt(data[i].BM_ID) > 0 ? data[i].BM_ID+"," : '';
		}
		var trimmedIds = Ids.replace(/^,|,$/g,'');
		sql = "UPDATE buyers_master SET IsSeen=1  WHERE BM_ID in("+trimmedIds+")";	

		let query = connection.query(sql, (err, results) => {
			if(err) 
			{
				console.log(err);
				res.json({status:0,msg:err});
			}
			else
			{
				res.json({
					status:1,
					data:results,
					msg:"Successfully updated Seen status"
				});
			}	
		});
	}
	else
	{
		res.json({status:0,msg:"no data"});
	}
});
















//05-apr-2021
//doRequestVerify

app.post('/admin/doRequestVerify', function(req, res) {

	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	
		
			let sql = "UPDATE joining_master SET  isRequested=1  WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});

	
});

//18-jun-2021
// for send monitization code request 



//=========================================================================== end front end


//============================================================ admin panel



app.get('/admin/exp_admin_panel', function(req, res) {

	if(parseInt(req.session.AM_ID)> 0)
		return res.redirect('/admin/exp_admin_panel/dashboard');
		
	console.log(req.session.AM_ID);
	console.log(req.session.loggedin);
	res.render('pages/login');
});

//admin/celebrity                    ====================================================

// app.get('/admin/celebrity', function(req, res) {

// 		console.log(req.session)
// 	if(req.session.AM_ID == undefined )
// 		return res.redirect('/admin/exp_admin_panel');
// 	if(parseInt(req.session.AM_ID) == 0 )
// 		return res.redirect('/admin/exp_admin_panel');

// 		res.setHeader('Access-Control-Allow-Origin', '*');	
// 		var AM_ID=parseInt(req.session.AM_ID);
	
// 		console.log(AM_ID);
			
	
// 						var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,DATE(Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral  FROM joining_master where isDeleted=0 order by JM_ID desc";
// 						connection.query(sql1, function (error, result, fields) 
// 						{
// 							exploreData=result;
// 							if (!error)
// 							{
							
// 								console.log(exploreData);								
// 								 res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
								
// 							}
// 							else{
// 								res.render('pages/celebrity',{data:exploreData});
// 							}
// 						});
				


// });
//exp_admin_panel
app.get('/admin/exp_admin_panel/celebrity', function(req, res) {

	console.log(req.session)
if(req.session.AM_ID == undefined )
	return res.redirect('/admin/exp_admin_panel');
if(parseInt(req.session.AM_ID) == 0 )
	return res.redirect('/admin/exp_admin_panel');

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var AM_ID=parseInt(req.session.AM_ID);

	console.log(AM_ID);
		

					//var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,DATE(Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral,JM_Acc_No,JM_Acc_Code,JM_SWIFT_Code,JM_Beneficiary_Name,JM_PayPal_Name,JM_PayPal_Phone,JM_PayPal_Email,JM_PayPal_UserName  FROM joining_master where isDeleted=0 order by JM_ID desc";
					var sql1="SELECT X.JM_ID,X.JM_Name,X.JM_Email,X.JM_User_Profile_Url,X.JM_Insta_Url,X.JM_Utube_Url,X.JM_Twiter_Url,X.JM_Profile_Pic,X.JM_Verified,X.Create_Date,					X.isRequested,X.isBlocked,X.isDeleted,X.isForLandingPage,X.JM_Referral,X.JM_Acc_No,X.JM_Acc_Code,X.JM_SWIFT_Code,X.JM_Beneficiary_Name,X.JM_PayPal_Name,X.JM_PayPal_Phone,X.JM_PayPal_Email,X.JM_PayPal_UserName,IFNULL(X.Code,'') as Code,IFNULL(Y.totalRef,0) as totalRef from (					   SELECT joining_master.JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,DATE(joining_master.Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral,JM_Acc_No,JM_Acc_Code,JM_SWIFT_Code,JM_Beneficiary_Name,JM_PayPal_Name,JM_PayPal_Phone,JM_PayPal_Email,JM_PayPal_UserName,	IFNULL(rfm.Code,'') as Code	FROM joining_master	left join referal_code_master rfm on rfm.JM_ID=joining_master.JM_ID					where isDeleted=0 order by joining_master.JM_ID DESC ) X   left join (   SELECT joining_master.JM_Referral,COUNT(joining_master.JM_Referral) as totalRef,							(select JM_ID from referal_code_master where referal_code_master.Code=joining_master.JM_Referral) JM_ID	FROM joining_master		where joining_master.isDeleted=0 group by joining_master.JM_Referral ) Y   on Y.JM_ID=X.JM_ID  order by X.JM_ID DESC";
					connection.query(sql1, function (error, result, fields) 
					{
						exploreData=result;
						if (!error)
						{
						
							console.log(exploreData);								
							 res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
							
						}
						else{
							res.render('pages/celebrity',{data:exploreData});
						}
					});
			


});

app.get('/admin/exp_admin_panel/purchaseMade', function(req, res) {

		console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var AM_ID=parseInt(req.session.AM_ID);
	
		console.log(AM_ID);
			var sql1="  SELECT * from ( SELECT * from ( SELECT bm2.BM_ID,bm2.BM_Name,bm2.BM_Phone,bm2.BM_Email,'Support Me' as  DA_Title,bm2.BM_Purchase_Amt as DA_Price,bm2.BM_Instruction,bm2.Status,	jm2.JM_ID,jm2.JM_Name,jm2.JM_Email,DATE(bm2.BM_Purchase_Date) requestDate,	bm2.BM_Purchase_Date,Time(bm2.BM_Purchase_Date) requesTime,	CASE WHEN bm2.Status='A' THEN 'OnGoing'	WHEN bm2.Status='C' THEN 'Completed'	WHEN bm2.Status='D' THEN 'Declined' 	WHEN bm2.Status='P' THEN 'Pending'  END as Req_Status,	Admin_Payment,'Gift and Donation' as creatorService 	FROM buyers_master bm2 inner join joining_master jm2 on jm2.JM_ID=bm2.JM_ID where jm2.isDeleted=0 and bm2.JM_ID > 0 order by bm2.BM_Purchase_Date DESC				   ) X	UNION 	SELECT * from (	SELECT bm.BM_ID,bm.BM_Name,bm.BM_Phone,bm.BM_Email,	da.DA_Title,bm.BM_Purchase_Amt as DA_Price,bm.BM_Instruction,bm.Status,	jm.JM_ID,jm.JM_Name,jm.JM_Email,DATE(bm.BM_Purchase_Date) requestDate,	bm.BM_Purchase_Date,Time(bm.BM_Purchase_Date) requesTime,	CASE WHEN bm.Status='A' THEN 'OnGoing' 	WHEN bm.Status='C' THEN 'Completed' 	WHEN bm.Status='D' THEN 'Declined' 	WHEN bm.Status='P' THEN 'Pending' end as Req_Status,	Admin_Payment, 	CASE WHEN da.DA_DA_ID=0 THEN 'Gift and Donation' WHEN da.DA_DA_ID=1 THEN 'Personalized video or audio message' WHEN da.DA_DA_ID=2 THEN 'Unlock Content' else 'NA' END as creatorService FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0 and bm.JM_ID = 0 order by bm.BM_Purchase_Date DESC	  ) Y ) Z order by Z.requestDate DESC";

						connection.query(sql1, function (error, result, fields) 
						{
							
							exploreData=result;
							if (!error)
							{
							
								console.log(exploreData);								
								 res.render('pages/request_purchase',{data:exploreData,title:' Expy | Requests',moment:moment});
								
							}
							else{
								res.render('pages/request_purchase',{data:exploreData});
							}
						});
				


});

//14-apr-2021
app.post('/admin/doPaidCompletedRequest',function(req,res){

	var BM_ID=req.body.BM_ID;
	let sql = "UPDATE buyers_master SET  Admin_Payment=1 WHERE BM_ID="+BM_ID;
	let query = connection.query(sql, (err, results) => {
			if(err) 
			{
				console.log(err);
				res.json({status:0,msg:err});
			}
			else
			{
				res.json({
							status:1,
							msg:"Status is Updated"
					});
			}	
		});

});

app.get('/admin/exp_admin_panel/referralRequest',(req,res)=>{


		console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

    let sql1="SELECT ID,Ref_Email,isCodeSent,DATE(Create_Date) Create_Date,Ref_Social FROM referral_code_request where isCodeSent=0";
        connection.query(sql1, function (error, results, fields) 
        {
            var codeDetails;
            codeDetails=results;
            if (error) 
            {
               res.render('pages/ReferralRequest',{data:codeDetails,title:' Expy | Referral Requests',moment:moment});
            }
            else
            {			        
                res.render('pages/ReferralRequest',{data:codeDetails,title:' Expy | Referral Requests',moment:moment});
            }
        });
       
	
});


//12-apr-2021
app.post('/admin/sendReferralCode',function(req,res){

	let to=req.body.Email;//"techteam@velectico.com"
	var mailOptions = {
		from: "Expy Admin <admin@expy.bio>",
		to: to,
		subject: "INVITE CODE ",
		text: "Your INVITE CODE",	
		html:"<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi,</h3><p>thank you for showing interest in Expy.</p><p>We received a request for an invite code from you to join Expy</p>    <p>Our team went through your social media profile and we would be happy to offer you an exclusive invite to be one of Expy’s first Users.</p>    <p>Please use the following as your invite code to Sign up:<b>"+req.body.Code+"</b></p>    <p> <a href='"+process.env.BASE_URL+"'>Click here to login</a></p><p>You can also invite a creator to join expy, you can do that using the invite code on your dashboard.</p><span><b>Regards,</b></span><br/><span><b>Team Expy,</b></span><br/><span><b>Expy.bio</b> </span></div>"      
	}
	
	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.json({status:0,msg:error});	
		}
         else
		{
			console.log('Message %s sent: %s', info.messageId, info.response);

			let sql = "UPDATE  referral_code_request SET  isCodeSent=1  WHERE Ref_Email='"+to+"'";
			 let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'sent'});	
				}	
			});
		}
          	
    });
});

//17-apr-2021


app.post('/admin/Update_ReferralCode',(req,res)=>{

	var JM_ID=req.body.JM_ID;
	var Code=req.body.Code;
	res.setHeader('Access-Control-Allow-Origin', '*');	
	let code=req.body.code;
	connection.query("SELECT * FROM referal_code_master WHERE JM_ID = ?",[JM_ID], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:0,
			  msg:error
			  })
		}
		else
		{
			if(results.length > 0)
			{
				//update
				let sql = "UPDATE  referal_code_master SET  Code='"+Code+"' WHERE JM_ID="+JM_ID;
				let query = connection.query(sql, (err, results) => {
					if(err) 
						res.json({status:0,msg:"error in query"});				
					else
					{
						res.json({status:1,msg:'Done'});
					}	
				});
			}				
			else				
			{				
			
				
				var data  = {
					Code:Code,
					Type:"C",// for creator
					JM_ID:JM_ID			
				};	
			
				let sql = "INSERT INTO  referal_code_master SET ?";
				let query = connection.query(sql, data,(err, results) => 
				{
						if(err) 
							res.json({status:0,msg:"error in query"});				
						else
						{
							res.json({status:1,msg:'Done'});
						}	

				});
			
			}
		}
	});


})





app.post('/admin/userProfile', function(req, res) {

            console.log(req.session)
        if(req.session.AM_ID == undefined )
            return res.redirect('/admin/exp_admin_panel');
        if(parseInt(req.session.AM_ID) == 0 )
            return res.redirect('/admin/exp_admin_panel');


            res.setHeader('Access-Control-Allow-Origin', '*');	
            var email=req.body.JM_Email	;

            connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[email], function (error, results, fields) {
              if (error) {
                  res.json({
                    status:0,
                    msg:'there are some error with query'
                    })
              }else{

                if(results.length >0)
                {
                    var JM_ID=results[0].JM_ID;
                    var sql="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+"";
                    connection.query(sql, function (error, results, fields) 
                    {
                        var user;
                        var directAccess,linkMaster;
                        if (!error)
                        {
                             user=results[0];
                             directAccess=results[1];
                             linkMaster=results[2];
                            res.json({
                                status:1,msg:'uploaded',
                                JM_ID:JM_ID,
                                userDetails:user,
                                directAccess:directAccess,
                                linkMaster:linkMaster							
                                });	
                        }	
                        else
                        {
                            res.json({
                                status:0,msg:'failed',
                                JM_ID:0,
                                userDetails:user,
                                directAccess:directAccess,
                                linkMaster:linkMaster	
                                });	
                        }	
                    });

                }
                else{
                  res.json({
                      status:0,
                    msg:"Email does not exits"
                  });
                }
              }
            });
	

});


//verifyUser
app.post('/admin/verifycelebrity',function(req, res) {

			var JM_ID= req.body.JM_ID;
			var JM_Verified= req.body.JM_Verified;
			if(JM_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
	
			let sql = "UPDATE joining_master SET  JM_Verified="+JM_Verified+"  WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"error"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});


	
});

//block user
app.post('/admin/blockCelebrity',function(req, res) {

			var JM_ID= req.body.JM_ID;
			var isBlocked= req.body.isBlocked;
			if(JM_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
	
			let sql = "UPDATE joining_master SET  isBlocked="+isBlocked+" WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
                  if(isBlocked==1)
					msg='Profile is Blocked';
         		  else
					msg='Profile is Un-Block';

                      res.json({status:1,msg:msg});
				}	
			});


	
});

//deleteCelebrity
app.post('/admin/deleteCelebrity',function(req, res) {

			var JM_ID= req.body.JM_ID;
			var isDeleted=req.body.isDeleted;
			if(JM_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
	
			let sql = "UPDATE joining_master SET  isDeleted="+isDeleted+",JM_User_Profile_Url='',JM_Email='', isForLandingPage=0 WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => 
			{
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
                    res.json({status:1,msg:"deleted"});
				}	
			});

 // res.json({status:1,msg:sql});
	
});

//17-apr-2021
//updateCelebrityPrority


app.post('/admin/updateCelebrityPrority',function(req, res) {

			var JM_ID= req.body.JM_ID;
			var displayLanding=req.body.displayLanding;
			if(JM_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
            if(displayLanding==1)
            {



                        var sql="Select * from joining_master WHERE isForLandingPage=1 GROUP BY JM_ID";
                        connection.query(sql, function (error, results, fields) 
                        {
                                if (!error)
                                {


                                        if(results.length > 3 )
                                        {
                                              res.json({status:0,msg:" 4 Creators already in landing Page"});

                                        }
                                        else
                                        {
                                            let sql = "UPDATE joining_master SET  isForLandingPage="+displayLanding+" WHERE JM_ID="+JM_ID;
                                            let query = connection.query(sql, (err, output) => 
                                            {
                                                if(err) 
                                                {
                                                    console.log(err);
                                                    res.json({status:0,msg:"unable to add creator in landing Page"});
                                                }
                                                else
                                                {
                                                    res.json({status:1,msg:"Creator is added in landing Page",output:results});
                                                }	
                                            });

                                        }


                                }
                                else
                                {
                                    res.json({status:0,error:error, msg:"try later"});
                                }

                        });
            }
            else
            {
											 let sql = "UPDATE joining_master SET  isForLandingPage="+displayLanding+" WHERE JM_ID="+JM_ID;
                                            let query = connection.query(sql, (err, results) => 
                                            {
                                                if(err) 
                                                {
                                                    console.log(err);
                                                    res.json({status:0,msg:"unable to add creator in landing Page"});
                                                }
                                                else
                                                {
                                                    res.json({status:1,msg:"Creator is added in landing Page"});
                                                }	
                                            });
            }

});







//newsletter


app.get('/admin/exp_admin_panel/newsletter', function(req, res)
{

	
	console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');


		

   		 var sql="SELECT * FROM news_letter order by ID desc";
     	connection.query(sql, function (error, results, fields) 
		{
			var newsLetters;
			if (!error)
			{
				newsLetters=results;	

					res.render('pages/newsletter',{
						newsLetters:newsLetters, 
					 title:'Expy | News Letter',
					moment:moment
				});		
			}
			else
			{
					res.render('pages/newsletter',{
						newsLetters:newsLetters, 
					 title:'Expy | News Letter',
					moment:moment
				});	
			}
	    });



});




//23-apr-2021

app.get('/admin/exp_admin_panel/urlChangeRequest', function(req, res) {

	console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');


		res.setHeader('Access-Control-Allow-Origin', '*');	
		var AM_ID=parseInt(req.session.AM_ID);
	
		console.log(AM_ID);
			
	
	var sql="SELECT rq.*,jm.JM_Email,jm.JM_Name,jm.JM_Phone from request_for_url_change rq inner join joining_master jm on jm.JM_ID=rq.JM_ID where rq.isUpdateUrl=0 order by rq.ID DESC";
						connection.query(sql, function (error, result, fields) 
						{
							exploreData=result;
							if (!error)
							{
							
								console.log(exploreData);								
								 res.render('pages/changeUrlRequest',{data:exploreData,title:' Expy | Change Url Request',moment:moment});
								
							}
							else{
								res.render('pages/changeUrlRequest',{data:exploreData,title:' Expy | Change Url Request',moment:moment});
							}
						});
				


});

//03-may-2021
// update profile url from admin
app.post('/admin/changeUrlByAdmin',(req,res)=>{
			var JM_ID=req.body.JM_ID;
			var old_url=req.body.old_url;
			var new_url=req.body.new_url;
			var OldProfileName=old_url+"_"+JM_ID;
			var NewProfileName=new_url+"_"+JM_ID;
			const currPath = __dirname + '/uploads/Profile/' + OldProfileName;
			const newPath = __dirname + '/uploads/Profile/' + NewProfileName;
			
			try 
			{
				fs.rename(currPath, newPath, function(err) 
				{
					if (err)
					 {
						res.json({
							status:0,
							data:err,
							msg:"error renameing"
						});
					} 
					else 
					{
					  	console.log("Successfully renamed the directory.")
						connection.query("call changeProfileUrl(?,?,?)", [JM_ID,old_url,new_url], function (err, result) {
							if (err) 
							{
								res.json({
									status:0,
									data:err,
									msg:"error in sp"
								});
			
							} 
							else 
							{
								console.log("results:", result);			

					
									let sql = "UPDATE joining_master SET  JM_User_Profile_Url='"+new_url+"',isRequestForChangeUrl=0 WHERE JM_ID="+JM_ID;
									let query = connection.query(sql, (err, results) => {
									if(err) 
									{
										console.log(err);
										res.json({status:0,msg:err});
									}
									else
									{
										res.json({
											status:1,
											data:result,
											msg:"Successfully updated the url."
										});
									}	
								});
										
							}
						});
					
					}
				  })			 
			} 
			catch(err)
			{
				res.json({
					status:0,
					msg:"exception in changeUrlByAdmin"
				});
			}

			
	
})

// route for user logout
app.get('/admin/exp_admin_panel/logout', (req, res) => {

	req.session.destroy((err) => 
	{
		res.redirect('/admin/exp_admin_panel'); // will always fire after session is destroyed
	})
});



//Inject authHandler as middleware
app.get('/admin/exp_admin_panel/dashboard', function(req, res) {

	console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

		

    var sql="Select IFNULL(SUM(IFNULL(BM_Purchase_Amt,0)),0) totalSales, COUNT(*)  noOfSales from buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0; Select COUNT(*)  noOfCreator from joining_master where isDeleted=0; Select COUNT(*)  noOfReferral from referral_code_request WHERE referral_code_request.isCodeSent=0";
     	 connection.query(sql, function (error, results, fields) 
		{
			var sales,creators,referralRequest;
			if (!error)
			{
				sales=results[0];
				creators=results[1];
				referralRequest=results[2];		

				res.render('admin/home',{
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,title:' Expy | Dashboard'			
				});		
			}
			else
			{
				res.render('admin/home',{
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,title:' Expy | Dashboard'				
				});		
			}
	    });
});


app.post('/admin/auth', function(request, response) {

	console.log("auth")
	var AM_Email = request.body.AM_Email;
	var AM_Password = request.body.AM_Password;
	if (AM_Email && AM_Password)
	 {
		connection.query('SELECT * FROM admin_master WHERE AM_Email = ? AND AM_Password = ?', [AM_Email, AM_Password], function(error, results, fields) {
			if (results.length > 0) 
			{
				request.session.loggedin = true;
				request.session.AM_Email = AM_Email;
				request.session.AM_ID= results[0].AM_ID;
				request.session.userDetails= results;
				console.log(request.session);
				response.json({status:1,msg:"success",userDetails:request.session.userDetails});
			
			} 
			else 
			{
				response.json({status:0,msg:"wrong username or password"});
			}					
		});
	} else {
		response.json({status:0,msg:'Please enter Username and Password!'});		
	}
});












//instagram authintacation

app.get("/admin/auth_instagram", (req, res) => {
	if (req.query.code !== 'undefined') {
	  axios.post('https://api.instagram.com/oauth/access_token', querystring.stringify({
		'client_id': '138441281583659',
		'client_secret': '203ab673c2987c624491f0a4ed08ba3a',
		'grant_type': 'authorization_code',
		'redirect_uri': process.env.BASE_URL+'me',
		'code': req.query.code
	  }))
	  .then(response => {
		console.log(response.data)
		
				response.json({status:1,data:response.data});
		// {
		// 	"access_token": "IGQVJ...",
		// 	"user_id": 17841405793187218
		//   }
	  })
	  .catch(error => {
		console.log(error)
	  })
	}
  })








// app.post('/admin/test_mail_jet',(req,res)=>{

// 	const mailjet = require ('node-mailjet')
// 	.connect('dc0e47bcddbb2d9b260cc82595f10f68', '71d9b6701b99524dc47d121a23b7b6d6')
// 	const request = mailjet
// 	.post("send", {'version': 'v3.1'})
// 	.request({
// 	  "Messages":[
// 		{
// 		  "From": {
// 			"Email": "prashanta.das@velectico.com",
// 			"Name": "prashanta"
// 		  },
// 		  "To": [
// 			{
// 			  "Email": "prashanta.das@velectico.com",
// 			  "Name": "prashanta"
// 			}
// 		  ],
// 		  "Subject": "Greetings from Mailjet.",
// 		  "TextPart": "My first Mailjet email",
// 		  "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
// 		  "CustomID": "AppGettingStartedTest"
// 		}
// 	  ]
// 	})
// 	request
// 	  .then((result) => {
// 		console.log(result.body)
// 	  })
// 	  .catch((err) => {
// 		console.log(err.statusCode)
// 	  })

// })


//10-may-2021
//main drag and drop
app.post('/admin/updateOrderByForEachTable',function(req,res){

	console.log(req.body.userDetailsAll)
	let sql="";
	if(req.body.userDetailsAll!=null && req.body.userDetailsAll.length > 0)
	{
		let len=req.body.userDetailsAll.length ;
		var userDetailsAll=req.body.userDetailsAll;

		for(let i=0;i<len;i++)
		{
			let tableId=userDetailsAll[i].tableId;
			let JM_ID=userDetailsAll[i].JM_ID;
			let ItemType=userDetailsAll[i].ItemType;
			if(ItemType=='customlink')
			{
				sql+= "UPDATE link_master SET  Order_By_All="+i+" WHERE JM_ID="+JM_ID+" and LM_ID="+tableId+";";	
			}
			if(ItemType=='category')
			{
				sql+= "UPDATE category_master SET  Order_By_All="+i+" WHERE JM_ID="+JM_ID+" and CM_ID="+tableId+";";	
			}
			if(ItemType=='embedcontent')
			{
				sql+= "UPDATE embed_content SET  Order_By_All="+i+" WHERE JM_ID="+JM_ID+" and EC_ID="+tableId+";";	
			}
			if(ItemType=='premium' || ItemType=="carousel")
			{
				sql+= "UPDATE direct_access_master_user SET  Order_By_All="+i+" WHERE JM_ID="+JM_ID+" and DA_ID="+tableId+";";	
			}
			if(ItemType=='socialBar')
			{
				sql+= "UPDATE social_widget_master SET  Order_By_All="+i+" WHERE JM_ID="+JM_ID+" and SWM_ID="+tableId+";";	
			}
		}
		
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:err});
				}
				else
				{
						//callback();
					res.json({status:1,msg:"Profile is Updated"});
				}	
			});
	}
	else
	{
		res.json({status:0,msg:"nothing to update"});
	}

})

// app.get('/admin/blur',(req,res)=>{
// 	var pathTofile= __dirname + "/uploads/Profile/akira_49/profile_pic_49_aa.jpg"; //adm/uploads/Profile/akira_49

//    //res.json({
// 	//	pathTofile:pathTofile
//    // });
// 		Jimp.read(pathTofile)
// 		.then(lenna => 
// 			{
// 			return lenna
// 				.resize(256, 256) // resize
// 				.quality(60) // set JPEG quality
// 				.greyscale() // set greyscale
// 				.write(__dirname + "/uploads/lena-small-bw.jpg"); // save

// 				res.json({
// 						pathTofile:err
// 					});
// 		})
// 		.catch(err => {
			
// 		res.json({
// 				pathTofile:err
// 			});
// 			console.error(err);
// 		});
 
// })

//==========================================MS2


//10-jun-2021
app.post('/admin/updateStepStatus',function(req,res){
		let JM_ID=req.body.JM_ID;
		if(JM_ID > 0)
		{
			let sql = "UPDATE joining_master SET  JM_Steps=1  WHERE JM_ID="+JM_ID;
			let query = connection.query(sql, (err, results) => {
				if(err) 
				{					
					res.json({status:0,msg:err});
				}
				else
				{
					res.json({status:1,msg:'status updated'});	
				}	
			});
		}
		else
		{
			res.json({status:0,msg:'JM_ID missing'});	
		}
});














//24-may-2021
//UpdatePayoutDetailsPayPal
app.post('/admin/UpdatePayoutDetailsPayPal',function(req,res){

	var JM_ID= req.body.JM_ID;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	
			// File does not exist.
			console.log("No file");
			var JM_PayPal_Name=req.body.JM_PayPal_Name;
			var JM_PayPal_Phone=req.body.JM_PayPal_Phone;
			//var JM_PayPal_UserName=req.body.JM_PayPal_UserName;
			var JM_PayPal_Email=req.body.JM_PayPal_Email;
			let sql = "UPDATE joining_master SET  JM_PayPal_Name='"+JM_PayPal_Name+"',JM_PayPal_Phone='"+JM_PayPal_Phone+"',JM_PayPal_Email='"+JM_PayPal_Email+"', JM_Payout_Details=1  WHERE JM_ID="+JM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:err});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});


});

app.post('/admin/updateNameBioColor',function(req,res){

	res.setHeader('Access-Control-Allow-Origin', '*');	
	let TM_Bio_Color=req.body.TM_Bio_Color;
	let JM_ID=req.body.JM_ID;
	
		let sql1="SELECT * FROM theme_master_user WHERE JM_ID = "+JM_ID+" ORDER BY TMU_ID DESC LIMIT 1";
		connection.query(sql1, function (error, results, fields) {
		if (error)
		 {
			res.json({
			  status:0,
			  msg:'there are some error with query'
			  })
		}
		else
		{
		  if(results.length > 0) // update if exist
		  { 
				let sql="";	
						
				sql = "UPDATE theme_master_user SET TM_Name_Color='"+TM_Bio_Color+"',TM_Bio_Color='"+TM_Bio_Color+"',TM_Footer_Color='"+TM_Bio_Color+"'  WHERE JM_ID="+JM_ID;	
							
 						let query = connection.query(sql, (err, results) => {
 	                    if (err) 
                        {
                            res.json({status:0,msg:err});
                        }
                        else
                        {
                            let TMU_ID=results.insertId;
                            let sql2="SELECT * FROM theme_master_user WHERE JM_ID = "+JM_ID+" ORDER BY TMU_ID DESC LIMIT 1";
                                connection.query(sql2, function (error, results, fields) {
                                        if (error)
                                        {
                                            res.json({
                                            status:0,
                                            msg:'there are some error with query'
                                            })
                                        }
                                        else
                                        {

                                            res.json({status:1,msg:'Done',themeMasterUser:results});										

                                        }

                                });

                        }	
                    });

		  }
		  else
		  {
			res.json({status:0,msg:'theme not found',userThemeDetails:null});										
		  }
		}
	});

});
//newsLatterCreators
app.post('/admin/newsLatterCreators',(req,res)=>{


	res.setHeader('Access-Control-Allow-Origin', '*');	
	let NL_Name=req.body.NL_Name;
	let NL_Email=req.body.NL_Email;
	let JM_ID=parseInt(req.body.JM_ID);

	
	if(NL_Name.length==0)
	{
		res.json({status:0,msg:"* Enter Name"});
		return false;
	}
	if(NL_Email.length==0)
	{
		res.json({status:0,msg:"* Enter Email-Id"});
		return false;
	}

	if(JM_ID > 0)
	{
		
			let sql="";						
			const values = [
							[JM_ID,NL_Name,NL_Email]
						];
			const sal = "INSERT INTO news_letter_creator (JM_ID,NL_Name,NL_Email) VALUES ?";	  
			const query = connection.query(sal, [values], function(err, result) 
			{		
				 if (err) 
				{
					res.json({status:0,msg:"err"});
				}
				else
				{
					
					res.json({status:1,msg:'Done'});										

				}	
		});
	}
	else
	{
		res.json({status:0,msg:"missing JM_ID"});
		return false;
	}

})
app.post('/admin/Get_NewsLetter_Creator',(req,res)=>{

	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Headers', "*");
  
	  var JM_ID=req.body.JM_ID;
	  var sql="Select NL_ID,NL_Name,NL_Email,DATE(Create_Date) as Create_Date,IsSent_NewsLetter,JM_ID from news_letter_creator where JM_ID="+JM_ID+" order by NL_ID desc";
			  let query = connection.query(sql, (err, results) =>
			  {
				  var newsLetter;
				  if (err) 
				  {
					  newsLetter=results;
						  
					  res.json({status:0,msg:err,newsLetter:newsLetter});
				  }
				  else
				  {	
						  newsLetter=results;
				  
					  res.json({status:1,newsLetter:newsLetter});
				  }	
			  });
  })

//

//31-may-2021
//discarded-premium-features


app.get('/admin/exp_admin_panel/discarded-premium-features', (req, res) => {

console.log(req.session)
if(req.session.AM_ID == undefined )
return res.redirect('/admin');
if(parseInt(req.session.AM_ID) == 0 )
return res.redirect('/admin');

res.setHeader('Access-Control-Allow-Origin', '*');	
var AM_ID=parseInt(req.session.AM_ID);


			var sql="SELECT  jm.JM_Name,damu.DA_ID,damu.DA_Title,lm.LM_ID,lm.BM_Name,lm.BM_Email,lm.BM_Phone,DATE(lm.Create_Date) Create_Date,lm.BM_Purchase_Amt,lm.BM_Instruction  FROM lead_master lm inner join direct_access_master_user damu on damu.DA_ID=lm.DA_ID inner join direct_access_master da on da.DA_ID=damu.DA_DA_ID inner join joining_master jm on jm.JM_ID=damu.JM_ID WHERE lm.isCompletePayment=0 order by lm.LM_ID DESC";
				connection.query(sql, function (error, result, fields) 
				{
					exploreData=result;
					if (!error)
					{
					
						console.log(exploreData);								
						 res.render('pages/discarded_premium_features',{data:exploreData,title:' Expy | Discarded Premium Featues',moment:moment});
						
					}
					else{
						res.render('pages/discarded_premium_features',{data:exploreData,title:' Expy | Discarded Premium Featues',moment:moment});
					}
				});
});

//05-jul-2021
                          
                            
 
//discount code

//05-jul-2021=======================================================================================
app.get('/admin/exp_admin_panel/create-discount',async (req, res)=>{

	console.log("create-discount")
	if(req.session.AM_ID == undefined )
	return res.redirect('/admin');
	if(parseInt(req.session.AM_ID) == 0 )
	return res.redirect('/admin');
	res.setHeader('Access-Control-Allow-Origin', '*');	
	var AM_ID=parseInt(req.session.AM_ID);

	var randomCode= await keyGen(12);
	console.log(randomCode)
	try 
	{
	 	let sql="Select DM_ID,DM_Code,DM_Type,DM_Status,IFNULL(DM_DeadLine_Date,'') as DM_DeadLine_Date,DATE_FORMAT(DM_DeadLine_Date,'%d-%m-%Y') AS DM_DeadLine_Date2, DM_Amount_Percent,DM_Uses_Times,Create_Date from discount_master where isDeleted=0 order by DM_ID desc"; 
	    const data = await model.sqlPromise(sql);
		res.render('pages/create_discount',{data:data,title:' Expy | Create Discount Code',moment:moment,randomCode:randomCode});
	}
	catch(e)
	{
		res.end("<h1>Not Found</h1>");
	}
})                                      
                                           

async function keyGen(keyLength) {
    var i, key = "", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
        key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }
	var DM_Code='EXP-'+key;
	let sql="Select * from discount_master where DM_Code='"+DM_Code+"'"; 
	const row = await model.sqlPromise(sql);
	let resLen=row.length;		
	if(resLen > 0)
	{
		DM_Code = await keyGen(12);
	}
	else
   		 return DM_Code;
}                                   

app.post('/admin/insertCode',async(req,res)=>{

	// try 
	// {
		let DM_Code=req.body.DM_Code;
		let DM_type=req.body.DM_type;
		let DM_Amount_Percent=req.body.DM_Amount_Percent;		


		if(DM_Code.length > 0)
		{
 
		
		 if(DM_type=='A')
			{
				const values = [
					[DM_Code,DM_type,DM_Amount_Percent]
				];
				const sal = "INSERT INTO discount_master (DM_Code,DM_type,DM_Amount_Percent) VALUES ?";	 
				const data=await model.sqlInsert(sal,values);
				if(data.affectedRows == 1)
				{
					console.log(data.insertId);
					res.json({
						status:1,
						msg:'Data inserted successfully',id:data.insertId
					})
				}
				else
				{
					res.json({
						status:0,
						msg:'error'
					})
				}
			
			}
			else if(DM_type=='P')
			{
				const values = [
					[DM_Code,DM_type,DM_Amount_Percent]
				];
				const sal = "INSERT INTO discount_master (DM_Code,DM_type,DM_Amount_Percent) VALUES ?";	 
				const data=await model.sqlInsert(sal,values);
				console.log(data);
				if(data.affectedRows == 1)
				{
					console.log(data.insertId);
					res.json({
						status:1,
						msg:'Data inserted successfully',id:data.insertId
					})
				}
				else
				{
					res.json({
						status:0,
						msg:'error'
					})
				}
			}
			else if(DM_type=='Q')
			{
				
				let	DM_Uses_Times=req.body.DM_Uses_Times;         
					
				const values = [
					[DM_Code,DM_type,DM_Amount_Percent,DM_Uses_Times]
				];
				const sal = "INSERT INTO discount_master (DM_Code,DM_type,DM_Amount_Percent,DM_Uses_Times) VALUES ?";	
				const data=await model.sqlInsert(sal,values);
				console.log(data);
				if(data.affectedRows == 1)
				{
					console.log(data.insertId);
					res.json({
						status:1,
						msg:'Data inserted successfully',id:data.insertId
					})
				}
				else
				{
					res.json({
						status:0,
						msg:'error'
					})
				} 
			}
			else if(DM_type=='D')
			{
 				let DM_DeadLine_Date=req.body.DM_DeadLine_Date;		
				const values = [
					[DM_Code,DM_type,DM_Amount_Percent,DM_DeadLine_Date]
				];
				const sal = "INSERT INTO discount_master (DM_Code,DM_type,DM_Amount_Percent,DM_DeadLine_Date) VALUES ?";	
				const data=await model.sqlInsert(sal,values);
				console.log(data);
				if(data.affectedRows == 1)
				{
					console.log(data.insertId);
					res.json({
						status:1,
						msg:'Data inserted successfully',id:data.insertId
					})
				}
				else
				{
					res.json({
						status:0,
						msg:'error'
					})
				} 
			}
			else if(DM_type=='QD')
			{
				let	DM_Uses_Times=req.body.DM_Uses_Times;         
				let DM_DeadLine_Date=req.body.DM_DeadLine_Date;		
				const values = [
					[DM_Code,DM_type,DM_Amount_Percent,DM_DeadLine_Date,DM_Uses_Times]
				];
				const sal = "INSERT INTO discount_master (DM_Code,DM_type,DM_Amount_Percent,DM_DeadLine_Date,DM_Uses_Times) VALUES ?";	
				const data=await model.sqlInsert(sal,values);
				console.log(data);
				if(data.affectedRows == 1)
				{
					console.log(data.insertId);
					res.json({
						status:1,
						msg:'Data inserted successfully',id:data.insertId
					})
				}
				else
				{
					res.json({
						status:0,
						msg:'error'
					})
				} 
			}
		}
	// } 
	// catch (error)
	// {
	// 	res.json({
	// 		status:0,
	// 		msg:'exception in insertCode'
	// 	})
	// }
	
	
})

app.post('/admin/updateCodeQD',async function(req,res){


	let DM_ID=req.body.DM_ID;
	let DM_Amount_Percent=req.body.DM_Amount_Percent;		
	let DM_Type=req.body.DM_Type;
	console.log("I am here dm type");
	if(DM_ID > 0)
	{
					   if(DM_Type=='QD' )
						{ 
							let DM_DeadLine_Date=req.body.DM_DeadLine_Date;		
						  let DM_Uses_Times=req.body.DM_Uses_Times;	
						  let sal = "UPDATE  discount_master set DM_Amount_Percent="+DM_Amount_Percent+",DM_DeadLine_Date='"+DM_DeadLine_Date+"',DM_Uses_Times="+DM_Uses_Times+" where DM_Status='A' and DM_ID="+DM_ID;
						}
					  const data=await model.sqlPromise(sal);
					  console.log(data);
					  if(data.affectedRows == 1)
					  {

						  res.json({
							  status:1,
							  msg:'Data updated successfully',affectedRows:1
						  })
					  }
					  else
					  {
						  res.json({
							  status:0,
							  msg:'nothing to update'
						  })
					  }
	  }
	else
	{
		res.json({
			status:0,
			msg:'missing param'
		})
	}
		
});
app.post('/admin/updateCode',async function(req,res){
	let DM_ID=req.body.DM_ID;
	let DM_Amount_Percent=req.body.DM_Amount_Percent;		
	let DM_Type=req.body.DM_Type;

	if(DM_ID > 0)
	{
		let sal='';
			if(DM_Type=='A' || DM_Type=='P')
			   sal = "UPDATE  discount_master set DM_Amount_Percent="+DM_Amount_Percent+" where DM_Status='A' and DM_ID="+DM_ID;	 
			else if(DM_Type=='Q' )
			  { 
				  let DM_Uses_Times=req.body.DM_Uses_Times;		
				  sal = "UPDATE  discount_master set DM_Amount_Percent="+DM_Amount_Percent+",DM_Uses_Times="+DM_Uses_Times+" where DM_Status='A' and DM_ID="+DM_ID;
			  }
			  else if(DM_Type=='D' )
			  { 
				  let DM_DeadLine_Date=req.body.DM_DeadLine_Date;		
				  sal = "UPDATE  discount_master set DM_Amount_Percent="+DM_Amount_Percent+",DM_DeadLine_Date='"+DM_DeadLine_Date+"' where DM_Status='A' and DM_ID="+DM_ID;
			  }
			   else if(DM_Type=='QD' )
					{ 
						let DM_DeadLine_Date=req.body.DM_DeadLine_Date;		
					  let DM_Uses_Times=req.body.DM_Uses_Times;	
					   sal = "UPDATE  discount_master set DM_Amount_Percent="+DM_Amount_Percent+",DM_DeadLine_Date='"+DM_DeadLine_Date+"',DM_Uses_Times="+DM_Uses_Times+" where DM_Status='A' and DM_ID="+DM_ID;
					 
					}
			console.log(DM_Type);
			const data=await model.sqlPromise(sal);
			console.log(data);
			if(data.affectedRows == 1)
			{
				
				res.json({
					status:1,
					msg:'Data updated successfully',affectedRows:1
				})
			}
			else
			{
				res.json({
					status:0,
					msg:'nothing to update'
				})
			}
	}
	else
	{
		res.json({
			status:0,
			msg:'missing param'
		})
	}
})


app.post('/admin/deleteCode',async (req,res)=>{

	let DM_ID=req.body.DM_ID;
	if(DM_ID > 0)
	{
		let sql="UPDATE  discount_master set isDeleted=1 where DM_ID="+DM_ID;
		const data=await model.sqlPromise(sql);
		if(data.affectedRows ==1)
			res.json({
				status:1,
				msg:'Code is removed'
			})
	}
	else
	{
		res.json({
			status:0,
			msg:'Unable to delete'
		})
	}
})


//discount code end==============================================================


//==========================================MS2 end

//14-jun-2021
//schedule reminder email to creators


// To understanding something more about cronTime, See the following codes:

// cronTime: '00 */3 * * * * ' => Executes in every 3 seconds.

// cronTime: '* */1 * * * * ' => MEANING LESS. Executes every one second.

// cronTime: '00 */1 * * * * ' => Executes every 1 minute.

// cronTime: '00 30 11 * * 0-5 ' => Runs every weekday (Monday to Friday) @ 11.30 AM

// cronTime: '00 56 17 * * * ' => Will execute on every 5:56 PM
// evrery minutes '* * * * *'






//16-jun-2021======================================================


var cron = require('node-cron');

var midNightCron='0 0 0 * * *'; //'* * * * *'; //

cron.schedule(midNightCron, () => {
 	console.log("Task is running every minute " + new Date());
 	SendReminderEmail();
	declinePendingAcceptRequest();
});

async function SendReminderEmail()
{
	try 
	{
	 let sql="SELECT jm.JM_ID,jm.JM_Email,jm.JM_Phone,jm.JM_Name,jm.JM_User_Profile_Url,bm.*,da.DA_DA_ID,da.DA_Type,da.DA_Title,da.DA_Description,da.DA_Price	 FROM buyers_master bm  	 inner join direct_access_master_user da on da.DA_ID=bm.DA_ID 	 inner join joining_master jm on jm.JM_ID=da.JM_ID 	 WHERE bm.Status='P' and jm.isDeleted=0"; 
	  const result = await model.sqlPromise(sql);
		
	  		let email_To="";
			let resLen=result.length;
			console.log("length ")
 			console.log(resLen)
			if(resLen > 0)
			{
				let c=0;
				for (let i = 0; i < resLen; i++)
				{	c++;

					var JM_Name=result[i].JM_Name;
					var followerName=result[i].BM_Name;
					var purchased_date=result[i].BM_Purchase_Date;
					var DA_Title=result[i].DA_Title;
					var BM_Purchase_Amt=result[i].BM_Purchase_Amt;
					var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
					var JM_Email=result[i].JM_Email;
					var BM_ID=result[i].BM_ID;
					var JM_Phone=result[i].JM_Phone;
					
					var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", you have a pending Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>         <p>To ensure your followers have a smooth time purchasing from you, you have 7 more days to decline or accept, and 7 more days to complete the request. Beyond this, the request will be automatically declined.</p> <p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify?Pending'>click here</a>.</p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
					var mailOptions = {
						from: "Expy Admin <info@velectico.net.in>",
						to: JM_Email,
						subject: "You have a pending Premium Request on Expy!",			
						html: html,
                        dsn: {
                              id: 'some random message specific id',
                              return: 'headers',
                              notify: ['failure', 'delay'],
                              recipient: 'Expy info <admin@expy.bio>'
                          }
					}
                                          
                                           
                     var resp=await wrapedSendMail(mailOptions);			
					 let msg="Hi "+JM_Name+" , you have PENDING Personalized Message Requests on your Expy page. To accept/decline visit: expy.bio/notify. If not accepted, the request will automatically be declined.";
				  	 var isSentSMS=sendSMS(JM_Phone,msg);

					 
                   	 console.log("response "+ BM_ID + " " + JM_Email + " " + resp)						
					console.log("count "+c)
				}
		
			}
	}
	catch(error) 
	{
		res.status(error.response.status)
		return res.send(error.message);
	}   
}


async function declinePendingAcceptRequest()
{

      
			let sql="SELECT jm.JM_ID,jm.JM_Email,jm.JM_Name,jm.JM_User_Profile_Url,bm.*,da.DA_DA_ID,da.DA_Type,da.DA_Title,da.DA_Description,da.DA_Price, DATE_ADD(DATE(bm.BM_Purchase_Date), INTERVAL 7 DAY) declineDate_Pending,  DATE_ADD(DATE(bm.BM_Updated_Date), INTERVAL 7 DAY) declineDate_Accept,  CURDATE() as currentDate,  (    CASE WHEN (CURDATE() >  DATE_ADD(DATE(bm.BM_Purchase_Date), INTERVAL 7 DAY)) and bm.Status='P'  THEN 'Y'        ELSE 'N'     END  ) as doDecline,  (CASE WHEN (CURDATE() >  DATE_ADD(DATE(bm.BM_Updated_Date), INTERVAL 7 DAY)) and  bm.Status='A'  THEN 'Y'  ELSE 'N'   END  ) as doDeclineAfterAccept   FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE bm.Status in('P','A') and jm.isDeleted=0";
			const result = await model.sqlPromise(sql);
			let resLen=result.length;

                                           
                                           
			if(resLen > 0)
			{
				
				for (let i = 0; i < resLen; i++)
				{	
					
					var pay_id=result[i].Payment_ID;
					var declineDate_Pending=result[i].declineDate_Pending;
					var followerName=result[i].BM_Name;
					var BM_Phone=result[i].BM_Phone;
					var BM_Email=result[i].BM_Email;			
					var Creator_Name=result[i].JM_Name;
					var purchased_date=result[i].BM_Purchase_Date;
					var DA_Title=result[i].DA_Title;
					var BM_Purchase_Amt=result[i].BM_Purchase_Amt;
					var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
					var JM_Email=result[i].JM_Email;
					var BM_ID=result[i].BM_ID;
					var doDecline=result[i].doDecline;
                    var doDeclineAfterAccept=result[i].doDeclineAfterAccept;                     
                                           
                                           
                                           
                                           
                    if(doDecline=='Y')
					{
						// do refund and update status to decline
						var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
						var mailOptions = 
						{
							from: "Expy Admin <admin@expy.bio>",
							to: BM_Email,
							subject: "Your Expy Request has been declined.",			
							html: html
						}

                              	var isRefunded=await refund(pay_id);
                                           
                               console.log("count "+isRefunded + pay_id)
                                           
                            if(isRefunded)
							{
                                let updateSql="UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW(),Updated_By='S' WHERE BM_ID="+BM_ID;
                              	 const rows = await model.sqlPromise(updateSql);
                                           

								 console.log("done")
                                 console.log(rows)    
                                           
                                var resp=await wrapedSendMail(mailOptions);
								let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
								var isSentSMS=sendSMS(BM_Phone,msg);
                                           
							}
                                           
					}
                                           
                    if(doDeclineAfterAccept=='Y')
					{
                        console.log(" doDeclineAfterAccept ")
                                           
                                           
						// do refund and update status to decline
						var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
						var mailOptions = 
						{
							from: "Expy Admin <admin@expy.bio>",
							to: BM_Email,
							subject: "Your Expy Request has been declined.",			
							html: html
						}

                            console.log("count "+isRefunded +" "+ pay_id)
                              	var isRefunded=await refund(pay_id);
                                           
                               console.log("count "+isRefunded + " "+ pay_id)
                                           
                            if(isRefunded)
							{
                                let updateSql="UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW(),Updated_By='S' WHERE BM_ID="+BM_ID;
                              	 const rows = await model.sqlPromise(updateSql);
                                           
								 console.log("done")
                                 console.log(rows)    
                                           
                                var resp=await wrapedSendMail(mailOptions);
								let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
								var isSentSMS=sendSMS(BM_Phone,msg);
							}
                                           
					}
                                            
				
				}
			}                                     
}

                                           
                                           
                                           
                                           
                                           
                                           
                                           
// sending multiple email
async function wrapedSendMail(mailOptions)
{
	return new Promise(function (resolve, reject)
	{
			transporter.sendMail(mailOptions, (err, info) => {
              if (err) 
              {
                  console.log("error: ", err);
                  reject(err);
              }
              else 
              {
					  console.log(mailOptions);
                  console.log('Message %s sent: %s', info.messageId, info.response);
                  resolve(true);
              }
			});
	 });
}

var request = require('request');

const util = require('util')                                     
                               
// calling refund  API 
async function refund(pay_id)
{
	        
	//live must uncomment before live
	let url="https://rzp_live_dBcgBotnhmUdtA:2uvZW0HgnI8bY9hX75PdxkMQ@api.razorpay.com/v1/payments/"+pay_id+"/refund";
                                           
  	//var pay_id="pay_GylCw0ur5hfuZr";
	//let url="https://rzp_test_FLoVSsJykW8cff:YY9ZWVKr9rH7obEDOJA4f49P@api.razorpay.com/v1/payments/"+pay_id+"/refund"; 
                                           
    const requestPromise = util.promisify(request);
    const response = await requestPromise({url: url, method: 'POST'});
    console.log('response', response.body); 
	if(response.statusCode!=400)
    {
		return true;
    }
	else
    {
		return false;
    }

       
}


//21-jun-2021

async function sendSMS(phoneNumber,msg)
{
	        
	//msg="Hello sam, This is a test message from spring edge";
	//var demo_apiKey="62659c5asfu4zvd7898g1kj013e77it8v",demo_sender="SEDEMO";

	var live_apiKey="10435yz3yr5797d859w19051fxt7upj8w251"; var live_sender="EXPBIO";	
	let url="https://instantalerts.co/api/web/send?apikey="+live_apiKey+"&sender="+live_sender+"&to="+phoneNumber+"&message="+msg; 
                                           
    const requestPromise = util.promisify(request);
    const response = await requestPromise({url: url, method: 'POST'});
    console.log('response', response.body); 
	if(response.statusCode!=400)
    {
		return true;
    }
	else
    {
		return false;
    }

	//return true;
}
app.get('/admin/sendSMS', async(req,res)=>
{

	let	msg="Hello sam, This is a test message from spring edge";
	var response=await sendSMS('9123654934',msg);
	if(response)
    {
		res.json({
			msg:'sent',
			response:response
		})
    }
	else
    {
		res.json({
			msg:'failed',
			response:response
		})
    }
});



//15-jul-2021
// razorpay-x for automated payout first part ===========================================================================

app.post('/admin/createContact',async(req,res)=>{
	//data format
 	console.log(req.body);
	let JM_ID=req.body.JM_ID;
	let acc_name=req.body.acc_name;
	let acc_num=req.body.acc_num;
	let acc_ifsc=req.body.acc_ifsc;
	let reference_id=req.body.reference_id;
	let email=req.body.email;	
	let contact =req.body.contact;
	let contact_id=req.body.contact_id;
	let fund_id=req.body.fund_id;

	if(acc_name.length==0)
    {

			res.json({
            	  status:0,
				  msg:'The account name is empty.'
              })
			return false;
    }
	if(acc_ifsc.length != 11)
    {

			res.json({
            	  status:0,
				  msg:'The ifsc must be 11 characters.'
              })
			return false;
    }
	if(contact.length != 10)
    {

			res.json({
            	  status:0,
				  msg:'The mobile must be 10 digits.'
              })
			return false;
    }
	if(email.length == 0)
    {

			res.json({
            	  status:0,
				  msg:'The email is empty.'
              })
			return false;
    }
	if(acc_num.length == 0)
    {

			res.json({
            	  status:0,
				  msg:'The A/c number is empty.'
              })
			return false;
    }
	var dataContact={
			name: acc_name,
			email: email,
			contact:contact,
			type: "employee",
			reference_id: reference_id,
			notes: {
				notes_key_1:reference_id,
				notes_key_2:reference_id
			}
	}
	if(typeof contact_id==='undefined' || typeof fund_id==='undefined')
	{
		res.json({status:0,msg:'missing contact id or fund id'})
		return false;
	}
	var resData=[];var resFund=[];
	if(contact_id=='NA' && fund_id=='NA')
	{
		 resData=await CreateContact(dataContact); // insert contact and fund
		 console.log("resData.data.id ")
		 console.log(resData.data.id)

		 let sql="Update joining_master set JM_Contact_Id='"+resData.data.id+"' where JM_ID="+JM_ID;
		 var sqlData=await model.sqlPromise(sql);	
			const fund_data={
				contact_id:resData.data.id,
				account_type:"bank_account",
				bank_account:{
					name:acc_name,
					ifsc:acc_ifsc,
					account_number:acc_num,
					}
				}
		
			 resFund=await CreateFund(fund_data); 			 
			 if(resFund.status===1)
			 {
				let sql="Update joining_master set JM_Fund_Id='"+resFund.data.id+"' where JM_ID="+JM_ID;
				var sqlData=await model.sqlPromise(sql);
				res.json({status:1,response:resFund,msg:'contact and fund created'})
			 }
			 else
			 {
				res.json({status:1,response:resFund,msg:'contact created but  fund is not created'})
			 }
			
	}
	else if(contact_id!='NA' && fund_id=='NA')
	{	
		// update existing contact then create fund
		var resData=await CreateContact(dataContact,contact_id); 
		if(resData.status===1)
		{
			let sql="Update joining_master set JM_Contact_Id='"+resData.data.id+"' where JM_ID="+JM_ID;
			var sqlData=await model.sqlPromise(sql);	
		}			
		
			const fund_data={
				contact_id:contact_id,
				account_type:"bank_account",
				bank_account:{
					name:acc_name,
					ifsc:acc_ifsc,
					account_number:acc_num,
					}
				}
			 var resFund=await CreateFund(fund_data); 			 
			 if(resFund.status===1)
			 {
				let sql="Update joining_master set JM_Fund_Id='"+resFund.data.id+"' where JM_ID="+JM_ID;
				var sqlData=await model.sqlPromise(sql);
				res.json({status:1,response:resFund.data,msg:'contact exist and fund created'})
			 }
			 else
			 {
				res.json({status:1,response:resFund.data,msg:'contact exist and fund is not created'})
			 }
	}
	else if(contact_id!='NA' && fund_id!='NA')
	{
		
		var jsonData = [];
		var resData=await CreateContact(dataContact,contact_id); 
		if(resData.status===1)
		{
			console.log("im here")
			let sql="Update joining_master set JM_Contact_Id='"+contact_id+"' where JM_ID="+JM_ID;
			var sqlData=await model.sqlPromise(sql);	
			
			 jsonData.push({'dataContact':resData.data});
		}	
		const fund_data={
			contact_id:contact_id,
			account_type:"bank_account",
			bank_account:{
				name:acc_name,
				ifsc:acc_ifsc,
				account_number:acc_num,
				}
			}

		//deactivate previous fund acc	
			var activeData=await DeactivateFund(fund_id,'D');
	
      
             var resFund=await CreateFund(fund_data); 			 
             if(resFund.status===1)
             {
                let sql="Update joining_master set JM_Fund_Id='"+resFund.data.id+"' where JM_ID="+JM_ID;
                var sqlData=await model.sqlPromise(sql);
 				jsonData.push({'fund_data':resFund.data});
                res.json({status:1,response:jsonData,msg:'contact update and fund inserted',fund_id:resFund.data.id})
             }
            else
            {
              res.json({status:1,response:jsonData,msg:'contact update and fund not inserted',fund_id:fund_id})
            }
   

			
	
  		//update 
	}
})
//for first time
var key_id=process.env.RAZOR_PAY_KEY_ID;
var key_secret=process.env.RAZOR_PAY_KEY_SECRET;
async function CreateContact(data,contact_id='NA')
{
		//https://rzp_test_pRHhsRU9PaQZoz:2lL0Mp0z9Rp3ccLQbZqB6mB1@api.razorpay.com/payments/pay_H6CtIBJ3Etv5KR/capture
		let url='';var method="POST";
		if(contact_id=='NA')
	      { url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/contacts"; method='POST';}
		 else
			{ url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/contacts/"+contact_id;  method='PATCH';}

		 console.log('url  --> ', url); 
		 const requestPromise = util.promisify(request);
   		 const response = await requestPromise({
						url: url,
						method: method,	
						json: true,   // <--Very important!!!
						body: data
		
			});
     console.log('contact --->');    
     console.log('response', response.body);                         
	if(response.statusCode!=400)
    {	
		var result={
			status:1,
			data:response.body
		}
		return result;
    }
	else
    {
		var result={
			status:0,
			data:[]
		}
		return result;
    }

}

async function CreateFund(data,fund_id='NA')
{
	let url='';var method="POST";
	if(fund_id=='NA')
	{	 url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/fund_accounts"; method="POST"; }
	else
		{ url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/fund_accounts/"+fund_id;  method="PATCH";}

	const requestPromise = util.promisify(request);
	const response = await requestPromise({
				url: url,
				method: method,	
				json: true,   // <--Very important!!!
				body: data

	});
		console.log('response', response.body); 
	if(response.statusCode!=400)
	{						
		const razorFund={
			data:response.body,
			status:1
		}
		return razorFund;
	}
	else
	{
		const razorFund={
			data:[],
			status:0
		}
		return razorFund;
	}
}

async function DeactivateFund(fund_id,type='D')
{
	if(fund_id!='NA')
	{
		var data={};
		if(type=='D')	
			data={active: false }
		if(type=='A')	
			data={active: true }

		var url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/fund_accounts/"+fund_id;  
		console.log('url  --> ', url); 
		const requestPromise = util.promisify(request);
		   const response = await requestPromise({
					   url: url,
					   method: 'PATCH',	
					   json: true,   // <--Very important!!!
					   body: data
	   
		   });
				if(response.statusCode!=400)
				{	
					var result={
						status:1,
						data:response.body
					}
					return result;
				}
				else
				{
					var result={
						status:0,
						data:[]
					}
					return result;
				}
	}
	else
	{
		var result={
			status:0,
			data:[]
		}
		return result;
	}
}
 
                                         
//============================== payout second part                                            
 //20-jul-2021
 app.post('/admin/payout',async (req,res)=>{
	let maxAmount=1000;
	 var JM_ID=parseInt(req.headers['id']);	
	 if(JM_ID==0)
	 {
		res.json({
			status:0,
			msg:"invalid params"
		})
		 return false;
	 }
	 let amount=parseFloat(req.body.amount);	 if(isNaN(amount)) 	amount=0;
	 if(amount === 0)
	 {
		res.json({
			status:0,
			msg:"invalid amount"
		})
		 return false;
	 }
	 let currentBalance=0;
	 let dataArr=await Get_Total_Bal(JM_ID);
	 if(dataArr.length > 0)
	 {
		 console.log(dataArr[0])
		currentBalance=parseFloat(dataArr[0].currentBalance);
	 }

	 console.log("currentBalance")
	 console.log(currentBalance)
	
	 if(isNaN(currentBalance))	 currentBalance=0;
	
	
 	if(currentBalance == 0 || currentBalance < maxAmount)
	 {
		res.json({
			status:0,
			msg:"Minimum balance required of Rs. 1000"
		})
		 return false;
	 }
                                                          
	 let fund_account_id='';
	 let currency='INR';
	let mode=req.body.mode;
	let reference_id=cryptoRandomString({length: 30, type: 'base64'});
	let narration="";
	let account_number=process.env.ACC_NO_RAZORPAY_X;

	let sql="select jm.JM_Contact_Id,jm.JM_Fund_Id,jm.JM_PayPal_UserName,jm.JM_PayPal_Phone,jm.JM_PayPal_Email from joining_master jm	WHERE jm.JM_ID="+JM_ID+"  and jm.JM_Contact_Id!='NA'and jm.JM_Fund_Id!='NA'";
	 const bankPay=await model.sqlPromise(sql);
                                    console.log(bankPay)
	 if(bankPay!=null && bankPay.length > 0)
	 {
		fund_account_id=bankPay[0].JM_Fund_Id;
	 }
	
    if(fund_account_id.length==0)
    {
        res.json({
                status:0,
                msg:"No account found in your profile, update bank details again"
            })
             return false;
    }
	
	
	let data={		
		"account_number":account_number,
		"fund_account_id": fund_account_id,
		"amount": amount * 100,
		"currency": currency,
		"mode":'IMPS',
		"purpose": "payout",
		"queue_if_low_balance": false,
		"reference_id":reference_id,
		"narration": narration,
		"notes": {
		  "notes_key_1":"Tea, Earl Grey, Hot",
		  "notes_key_2":"Tea, Earl Grey… decaf."
		}
	  
	}


	var response=await withdrawlMoney(data);
	if(response.status==1)
	{
		console.log('response.data', response.data); 
		let obj=response.data;		
		const values = [
			[JM_ID,obj.id,obj.fund_account_id,amount,obj.status,obj.entity,obj.created_at]
		];
		const sql = "INSERT INTO payout_master (JM_ID,payout_id,fund_account_id,amount,status,entity,created_at) VALUES ?";
	
		const insertPayout=await model.sqlInsert(sql,values);
		res.json({
			status:1,
			response:response
		})
	}
	else
	{
		let error=response.data.error;
		res.json({
			status:0,
			msg:"try again later...",
			error
		})
	}
	

})
async function withdrawlMoney(data)
{
	console.log("data-------> ")


	let url='';var method="POST";
	url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payouts";
	const requestPromise = util.promisify(request);
	const response = await requestPromise({
				url: url,
				method: method,	
				json: true,   // <--Very important!!!
				body: data

	});

	if(response.statusCode!=400)
	{					
	
		const razorFund={
			data:response.body,
			status:1
		}
		return razorFund;
	}
	else
	{
		const razorFund={
			data:response.body,
			status:0
		}
		return razorFund;
	}
}
                                         
async function Get_Total_Bal(JM_ID)
{

	var sql="call sp_get_current_balance(?)";
	const values=[
		JM_ID
	]
	var data=await call_sp(sql,values);
	if(data!=null && data.length > 0)
	{
		console.log(data)
		 return data[0];
	}
	else
	{
		let dt=[];
		return dt;
	}
}
app.post('/admin/pay_balance',async (req,res)=>{

	var JM_ID=req.headers['id'];	
	if(JM_ID==0)
	{
	   res.json({
		   status:0,
		   msg:"invalid params"
	   })
		return false;
	}
console.log(JM_ID)
	let dataArr=await Get_Total_Bal(JM_ID);
	
console.log(dataArr)
	if(dataArr.length > 0)
	{
	
		const sql="select pm.payout_id,pm.amount,pm.status,DATE(Create_Date) tranDate from payout_master pm where JM_ID="+JM_ID+" order by PM_ID DESC;"
		const result=await model.sqlPromise(sql);
		currentBalance=dataArr[0].currentBalance;
		res.json({
			status:1,result:result,currentBalance:currentBalance
		})
	}
  else
  {
	res.json({
			status:0,msg:'no data found'
		})
  }
})


//=============================================================== end of payout part


//request 
// {
// 	"account_number": "7878780080316316",
// 	"fund_account_id": "fa_00000000000001",
// 	"amount": 1000000,
// 	"currency": "INR",
// 	"mode": "IMPS",
// 	"purpose": "payout",
// 	"queue_if_low_balance": true,
// 	"reference_id": "Acme Transaction ID 12345",
// 	"narration": "Acme Corp Fund Transfer",
// 	"notes": {
// 	  "notes_key_1":"Tea, Earl Grey, Hot",
// 	  "notes_key_2":"Tea, Earl Grey… decaf."
// 	}
// refund response
// {
//     "id": "rfnd_HNihW7Yypt3PWj",
//     "entity": "refund",
//     "amount": 500,
//     "currency": "INR",
//     "payment_id": "pay_HNLjgqtZUVoulv",
//     "notes": [],
//     "receipt": null,
//     "acquirer_data": {
//         "arn": null
//     },
//     "created_at": 1623844116,
//     "batch_id": null,
//     "status": "processed",
//     "speed_processed": "normal",
//     "speed_requested": "normal"
// }
          
app.get('/meet',async (req,res)=>{

	//let sql="";
	//const result=await model.sqlPromise(sql);
	let nameMeeting='Testing meeting';
	res.render('pages/meeting',{nameMeeting:nameMeeting,title:' Expy | Video Session',moment:moment});
								
})



 //16-jul-2021
 app.post('/admin/updateJoiningMaster',async(req,res)=>
 {
 
	 let value=req.body.value;
	 let colName=req.body.colName;
	 let tableId=req.body.tableId;
	 if(value.length==0)
	 {
			 res.json({
				   status:0,
				   msg:'The value is empty.'
			   })
			 return false;
	 }	
	 if(colName.length==0)
	 {
			 res.json({
				   status:0,
				   msg:'The colName is empty.'
			   })
			 return false;
	 }
	 if(tableId.length==0)
	 {
			 res.json({
				   status:0,
				   msg:'The colName is empty.'
			   })
			 return false;
	 }
 
	 let sql="Update joining_master set "+colName+" ='"+value+"' where JM_ID="+tableId;
	 var sqlData=await model.sqlPromise(sql);
	 if(sqlData.affectedRows==1)
		 res.json({status:1,msg:'Item is updated successfully',tableId:tableId});
	 else	
		 res.json({status:0,msg:'Failed to updated',tableId:tableId});
 })

//

 //17-jul-2021
           

app.post('/admin/infoMail',async function(req,res){

	
	var to=req.body.email;
	var mailOptions = {
		from: 'Expy Admin <info@expy.bio>',
		to: to,
		subject: 'Hello',
		text: 'This is auto mail sending'
	};
	
	var data=await wrapedSendMailInfo(mailOptions);
	if(data)								 
	{
		res.json({ msg:'done'})
	}
	else
	{
		res.json({ msg:'failed'})
	}
});                                
// sending multiple email
async function wrapedSendMailInfo(mailOptions)
{
       let transporter = mailer.createTransport({
        service: 'Yandex', // no need to set host or port etc.
        auth: {
            user: "info@expy.bio",
            pass: "NB787gdX"
        }
    });
                          
	return new Promise(function (resolve, reject)
	{
			transporter.sendMail(mailOptions, (err, info) => {
              if (err) 
              {
                  console.log("error: ", err);
                  reject(err);
              }
              else 
              {
				 console.log(mailOptions);
                  console.log('Message %s sent: %s', info.messageId, info.response);
                  resolve(true);
              }
			});
	 });
}

async function wrapedSendMailSupport(mailOptions)
{
       let transporter = mailer.createTransport({
        service: 'Yandex', // no need to set host or port etc.
        auth: {
            user: "support@expy.bio",
            pass: "TXs6YuLZ"
        }
    });
                          
	return new Promise(function (resolve, reject)
	{
			transporter.sendMail(mailOptions, (err, info) => {
              if (err) 
              {
                  console.log("error: ", err);
                  reject(false);
              }
              else 
              {
				 console.log(mailOptions);
                  console.log('Message %s sent: %s', info.messageId, info.response);
                  resolve(true);
              }
			});
	 });
}



//================================================================ calender schedule

//22-jul-2021
app.post('/admin/createSchedule',async (req,res)=>
{
	let JM_ID=req.body.JM_ID;
	let EM_Title=req.body.EM_Title;
	let EM_Desc=req.body.EM_Desc;
	let EM_Mail_Text=req.body.EM_Mail_Text;
	let EM_Duration=parseInt(req.body.EM_Duration);
	let EM_Plan_Days=parseInt(req.body.EM_Plan_Days);
	let EM_Price=req.body.EM_Price;
	let days=req.body.days;
	//console.log(req.body)
	let ESC_Day_ID=0;
	let EM_ID=0; //event master id
	if(JM_ID == 0)
	{
		res.json({
			status:0,msg:'JM_ID missing'
		})
		return false;
	}
	
	if(EM_Duration !=15 && EM_Duration !=30 && EM_Duration !=45 && EM_Duration !=60 && EM_Duration !=90 )
	{
		res.json({
			status:0,msg:'invalid time duration'
		})
		return false;
	}
	if(EM_Duration !=15 && EM_Duration !=30 && EM_Duration !=45 && EM_Duration !=60 && EM_Duration !=90 )
	{
		res.json({
			status:0,msg:'invalid plan days '
		})
		return false;
	}







	// insert to event master first
	var DA_Collection="[]";		
	const values = [
		[5,'videoCam',JM_ID,EM_Title, EM_Desc,EM_Price,EM_Mail_Text,EM_Duration,EM_Plan_Days,DA_Collection]
	];
	const sql = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Price,EM_Mail_Text,EM_Duration,EM_Plan_Days,DA_Collection) VALUES ?";	  
 
	const DataInserted=await model.sqlInsert(sql,values)
	if(DataInserted.affectedRows == 0)
	{
		res.json({
			status:0,msg:'failed to insert event master'
		})
		return false;
	}
		EM_ID = DataInserted.insertId;	
		const respInsert=await InsertSchedule(days,EM_ID,JM_ID);
		console.log("new config");
		console.log(respInsert);
		if(respInsert) // now create slot
		{

			const slotInserted=await InsertSlot(EM_Duration,EM_Plan_Days,EM_ID,JM_ID)
			if(slotInserted)
            {
				res.json({
                      status:1,msg:'Item is inserted successfully.'
              })
            }
            else
            {
				res.json({
                      status:0,msg:'Failed to insert data, try again later.'
              })
            }
		}
	
})
async function InsertSchedule(days,ESC_EM_ID,JM_ID)
{
		let daysLen=days.length;	
		let c=0;
		
		if(daysLen > 0)
		{
			
				for (let j = 0; j < daysLen; j++) 
				{
					const ESC_Day_ID = days[j].Day_ID;
					const Slot_Start = days[j].Slot_Start;
					const Slot_End = days[j].Slot_End;
                                            
                    const Slot_Start2 = days[j].Slot_Start2;
					const Slot_End2 = days[j].Slot_End2;
							const values = [
								[ESC_EM_ID,JM_ID,ESC_Day_ID,Slot_Start,Slot_End,Slot_Start2,Slot_End2]
							];
                                            
                                            
                                            
							if(ESC_Day_ID > 0)
							{
								const sql = "INSERT INTO event_slots_config (ESC_EM_ID,JM_ID,ESC_Day_ID,ESC_Avail_Start_Time,ESC_Avail_End_Time,ESC_Avail_Start_Time2,ESC_Avail_End_Time2) VALUES ?";	  
								const DataInserted=await model.sqlInsert(sql,values)
								c++;
							}
							
				}
		}
		if(c > 0)
			return true;
		else
			return false;
}
async function InsertSlot(duration,days,ES_EM_ID,JM_ID)
{


	var now = new Date();
	var planDays= now.setDate(now.getDate() + days)
	var today = new Date();
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	var daysOfYear = [];
	let isDone=0;
	for (var d = tomorrow; d <= planDays; d.setDate(d.getDate() + 1)) 
	{
		daysOfYear.push(new Date(d));
		var ES_Calendar_Date = new Date(d).toISOString().substr(0,10);
		let day = new Date(d).getDay();
		if(day==0)
		  day=7;

		  console.log("inside insert slot looooop " + day);
		let sql="SELECT * from event_slots_config where ESC_Day_ID="+day+ " and JM_ID="+JM_ID;
		var records=await model.sqlPromise(sql);
		let recordsLen=records.length;
		console.log(recordsLen)
		if(recordsLen > 0)
		{

			for (let i = 0; i < recordsLen; i++) 
			{			
				let ESC_Avail_Start_Time=records[i].ESC_Avail_Start_Time;
				let ESC_Avail_End_Time=records[i].ESC_Avail_End_Time;
                let ESC_Avail_Start_Time2=records[i].ESC_Avail_Start_Time2;
				let ESC_Avail_End_Time2=records[i].ESC_Avail_End_Time2;
				let JM_ID=records[i].JM_ID;
				let ESC_EM_ID=records[i].ESC_EM_ID;
				for (let j = ESC_Avail_Start_Time; j < ESC_Avail_End_Time; j+=duration) 
				{
					
						

					let ES_Slot_Start=ESC_Avail_Start_Time;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';

					var query="SELECT * from event_slots where ES_Status='Booked' and JM_ID="+JM_ID;
					var bookedRecords=await model.sqlPromise(query);
					let bookLen=bookedRecords.length;
					if(bookLen> 0)
					{
						for (let k = 0; k < bookLen; k++) 
						{
                                                    
                                                    
                            if(duration==15 || duration==30)
                             {                       
						
                                if( (ES_Slot_Start > bookedRecords[k].ES_Slot_Start) && (ES_Slot_Start < bookedRecords[k].ES_Slot_End) ) 
                                {
                                    ES_Status='Blocked';
                                    const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }					
                                else if( (ES_Slot_End > bookedRecords[k].ES_Slot_Start) && (ES_Slot_End < bookedRecords[k].ES_Slot_End) ) 
                                {
                                    ES_Status='Blocked';
                                   const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                                else if( (ES_Slot_Start == bookedRecords[k].ES_Slot_Start) && (ES_Slot_End == bookedRecords[k].ES_Slot_End) ) 
                                {
                                    ES_Status='Blocked';

                                  const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                                else
                                {
                                      const values = [
                                            [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                      ];	
                                    let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                    const insertSlot=await model.sqlInsert(q,values);	
                                    isDone++;                                                                                          
                                }
							}
                           else if(duration==45 || duration==60 || duration==90) //reverse logic
                            {
                                                                                                                                       
                                  var Start_Slot= bookedRecords[k].ES_Slot_Start;    var End_Slot= bookedRecords[k].ES_Slot_End;  
                                                                                                                                       
                                if( inRange(Start_Slot,ES_Slot_Start,ES_Slot_End) ==true || 
									inRange(End_Slot,ES_Slot_Start,ES_Slot_End) ==true 
                                  ) 
                                {
                                    ES_Status='Blocked';
                                    const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                                else if( (Start_Slot == ES_Slot_Start) && (End_Slot == ES_Slot_End) ) 
                                {
                                    ES_Status='Blocked';

                                  const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                              else
                                {
                                      const values = [
                                            [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                      ];	
                                    let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                    const insertSlot=await model.sqlInsert(q,values);	
                                    isDone++;                                                                                          
                                }
                                                                                                                                       
							}
                            
						
						}
					}
					else
					{
						let values = [
							[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
						];	
						let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
						const insertSlot=await model.sqlInsert(q,values);	
						isDone++;
					}	
                 	 ESC_Avail_Start_Time=ES_Slot_End+1;
				}// slot range created
				
                //second schedule
                for (let j = ESC_Avail_Start_Time2; j < ESC_Avail_End_Time2; j+=duration) 
				{
					
					

					let ES_Slot_Start=ESC_Avail_Start_Time2;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';
					var query="SELECT * from event_slots where ES_Status='Booked' and JM_ID="+JM_ID;
					var bookedRecords=await model.sqlPromise(query);
					let bookLen=bookedRecords.length;
					if(bookLen> 0)
					{
						for (let k = 0; k < bookLen; k++) 
						{
                                                    
                                                    
                            if(duration==15 || duration==30)
                             {  

                                  if( (ES_Slot_Start > bookedRecords[k].ES_Slot_Start) && (ES_Slot_Start < bookedRecords[k].ES_Slot_End) ) 
                                  {
                                      ES_Status='Blocked';
                                    const values = [
                                      [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                  ];	
                                    let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                    const insertSlot=await model.sqlInsert(q,values);	
                                    isDone++;
                                  }					
                                  else if( (ES_Slot_End > bookedRecords[k].ES_Slot_Start) && (ES_Slot_End < bookedRecords[k].ES_Slot_End) ) 
                                  {
                                      ES_Status='Blocked';
                                     const values = [
                                      [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                  ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                  }
                                  else if( (ES_Slot_Start == bookedRecords[k].ES_Slot_Start) && (ES_Slot_End == bookedRecords[k].ES_Slot_End) ) 
                                  {
                                      ES_Status='Blocked';

                                   const values = [
                                      [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                  ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                  }
							}
                           else if(duration==45 || duration==60 || duration==90) //reverse logic
                            {
                                                                                                                                       
                                  var Start_Slot= bookedRecords[k].ES_Slot_Start;    var End_Slot= bookedRecords[k].ES_Slot_End;  
                                                                                                                                       
                                if( inRange(Start_Slot,ES_Slot_Start,ES_Slot_End) ==true || 
									inRange(End_Slot,ES_Slot_Start,ES_Slot_End) ==true 
                                  ) 
                                {
                                    ES_Status='Blocked';
                                    const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                                else if( (Start_Slot == ES_Slot_Start) && (End_Slot == ES_Slot_End) ) 
                                {
                                    ES_Status='Blocked';

                                  const values = [
                                    [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                    ];	
                                  let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                  const insertSlot=await model.sqlInsert(q,values);	
                                  isDone++;
                                }
                              else
                                {
                                      const values = [
                                            [ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
                                      ];	
                                    let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
                                    const insertSlot=await model.sqlInsert(q,values);	
                                    isDone++;                                                                                          
                                }
                                                                                                                                       
							}
						
						}
					}
					else
					{
						let values = [
							[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID]
						];	
						let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID) VALUES ?";
						const insertSlot=await model.sqlInsert(q,values);	
						isDone++;
					}	
                 	 ESC_Avail_Start_Time2=ES_Slot_End+1;
				}// slot range created
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
                                                                                                                              
			}// date range complete 
		}
		
		
	}
	console.log("inside insert slot");
	console.log(daysOfYear);
	console.log(isDone);
		if(isDone > 0)
			return true;
		else
			return false;
}

function inRange(x, min, max) 
{
    return ((x-min)*(x-max) <= 0);
}

async function validateSlotConfig(days,JM_ID)
{
	let query="select * from event_slots_config where JM_ID="+JM_ID;
	const slots_config=await model.sqlPromise(query);
	let found=0;
	let arrayData=[];
	var WeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                 
                                 
	console.log("slots_config");
	console.log(slots_config);
	if(slots_config.length > 0) // if exists any data
	{
		let daysLen=days.length;
		let lenConfig=slots_config.length;
		let c=0;
		if(lenConfig > 0)
		{
			for (let i = 0; i < lenConfig ; i++) 
			{
				const ESC_Day_ID = slots_config[i].ESC_Day_ID;		
				const ESC_Avail_Start_Time = slots_config[i].ESC_Avail_Start_Time;
				const ESC_Avail_End_Time = slots_config[i].ESC_Avail_End_Time;
				const ESC_Avail_Start_Time2 = slots_config[i].ESC_Avail_Start_Time2;
				const ESC_Avail_End_Time2 = slots_config[i].ESC_Avail_End_Time2;
				// ID=1 monday
				for (let j = 0; j < daysLen; j++) 
				{
					const Day_ID = days[j].Day_ID;
					var dayName = WeekDays[Day_ID];
					const Slot_Start = days[j].Slot_Start;
					const Slot_End = days[j].Slot_End;
					const Slot_Start2 = days[j].Slot_Start2;
					const Slot_End2 = days[j].Slot_End2;
		
				   if(ESC_Day_ID==Day_ID && Slot_Start > 0 && Slot_Start2 > 0 && Slot_End > 0 && Slot_End2 > 0 && ESC_Avail_Start_Time != Slot_Start && ESC_Avail_End_Time != Slot_End && ESC_Avail_Start_Time2 != Slot_Start2 && ESC_Avail_End_Time2 != Slot_End2) // mon 1
					{
						
						if(
							
							inRange(Slot_Start,ESC_Avail_Start_Time,ESC_Avail_End_Time)==true || 
							inRange(Slot_End,ESC_Avail_Start_Time,ESC_Avail_End_Time) ==true ||
							inRange(Slot_Start2,ESC_Avail_Start_Time2,ESC_Avail_End_Time2)==true || 
                            inRange(Slot_End2,ESC_Avail_Start_Time2,ESC_Avail_End_Time2)==true

						)							
                          {
							arrayData.push({
								Day_ID:Day_ID,
								msg:'Both schedule already exist for '+dayName,
								status:true
							})
							found++;
							break;
                          }
                       
					}
				else if(ESC_Day_ID==Day_ID && ESC_Avail_Start_Time != Slot_Start &&
						 ESC_Avail_End_Time != Slot_End && 
						 Slot_Start > 0 && Slot_Start2 == 0 && Slot_End > 0 && Slot_End2== 0 ) // mon 1
                    {
						  if(
                                inRange(Slot_Start,ESC_Avail_Start_Time,ESC_Avail_End_Time)==true && 
                                	inRange(Slot_End,ESC_Avail_Start_Time,ESC_Avail_End_Time)==true
                             )
                            {
								arrayData.push({
									Day_ID:Day_ID,
									msg:'1st schedule already exist for '+dayName,
									status:true
								})
								found++;
								break;
                            
                            }
                    }
				else if(ESC_Day_ID==Day_ID && ESC_Avail_Start_Time2 != Slot_Start2 && ESC_Avail_End_Time2 != Slot_End2 &&
					 Slot_Start == 0 && Slot_Start2 > 0 && Slot_End == 0 && Slot_End2 > 0) // mon 1
                    {
						  if(
                                inRange(Slot_Start2,ESC_Avail_Start_Time2,ESC_Avail_End_Time2)==true && 
                                	inRange(Slot_End2,ESC_Avail_Start_Time2,ESC_Avail_End_Time2) ==true
                             )
                            {

								arrayData.push({
									Day_ID:Day_ID,
									msg:'2nd schedule already exist for '+dayName,
									status:true
								})
								found++;
								break;
                            }
                    }
                    else
                    {
								arrayData.push({
									Day_ID:Day_ID,
									msg:'Schedule already exist for '+dayName,
									status:true
								})
								found++;
								break;
                    }
					
				}			
				
			}
		}
	

		return arrayData;
	}
	else
	{
		let data={
			Day_ID:0,
			msg:"no data found",
			status:false
		}

		return data;
	}
}

//24-jul-2021

app.post('/admin/GetScheduleConfig',async (req,res)=>{
	let JM_ID=req.body.JM_ID;
	let ESC_EM_ID=req.body.ESC_EM_ID;
	if(JM_ID > 0 && ESC_EM_ID > 0)
	{
		const sql="call sp_get_schedule_config(?,?)";
		const values=[
			JM_ID,ESC_EM_ID
		]
		const data=await call_sp(sql,values);
		if(data!=null && data.length > 0)
		{
			res.json({
				status:1,
				data:data[0],
				msg:'data found'
			})
		}
		else
		{
			res.json({
				status:0,
				data:[],
				msg:'no data found'
			})
		}

	}
	else
	{
		res.json({
			status:0,msg:'param missing'
		})
	}

})


async function call_sp(sql,params)
{
    return new Promise((resolve, reject)=>{
        connection.query(sql, params,  (error, results)=>{
            if(error)
			{
                return reject(error);
            }
            return resolve(results);
        });
    });
};





app.post('/admin/updateSchedule',async (req,res)=>{

	let JM_ID=req.body.JM_ID;
	let EM_Title=req.body.EM_Title;
	let EM_Desc=req.body.EM_Desc;
	let EM_Mail_Text=req.body.EM_Mail_Text;
	let EM_Duration=parseInt(req.body.EM_Duration);
	let EM_Plan_Days=parseInt(req.body.EM_Plan_Days);
	let EM_Price=req.body.EM_Price;
	let days=req.body.days;
	//console.log(req.body)
	let ESC_Day_ID=0;

	let ES_EM_ID=req.body.ES_EM_ID;

		if(JM_ID ==0 && ES_EM_ID==0)
		{
			res.json({
				status:0,
				msg:'param missing'
			})
			return false;
		}
		if(EM_Duration !=15 && EM_Duration !=30 && EM_Duration !=45 && EM_Duration !=60 && EM_Duration !=90 )
		{
			res.json({
				status:0,msg:'invalid time duration'
			})
			return false;
		}
		if(EM_Duration !=15 && EM_Duration !=30 && EM_Duration !=45 && EM_Duration !=60 && EM_Duration !=90 )
		{
			res.json({
				status:0,msg:'invalid plan days '
			})
			return false;
		}
	

	const data=await bookedSlot(JM_ID,ES_EM_ID);
	if(data==false)
	{
		
		let DA_ID=ES_EM_ID;
		const sql="call archive_event_delete_slot(?,?,?,?,?,?,?,?)";
		const values=[
			JM_ID,DA_ID,EM_Title,EM_Desc,EM_Mail_Text,EM_Duration,EM_Plan_Days,EM_Price
		]
		const data=await call_sp(sql,values);
		console.log(data)
		
			
		
			const respInsert=await InsertSchedule(days,ES_EM_ID,JM_ID);
			console.log("new config");
			console.log(respInsert);
			if(respInsert) // now create slot
			{
	
				const slotInserted=await InsertSlot(EM_Duration,EM_Plan_Days,ES_EM_ID,JM_ID)
				if(slotInserted)
				{
					res.json({
						  status:1,msg:'Item is updated successfully.'
				  })
				}
				else
				{
					res.json({
						  status:0,msg:'Failed to update data, try again later.'
				  })
				}
			}
		
	}
	else
	{
		res.json({
			status:0,
			msg:'Unable to update,booked slot present'
		})
		return false;
	}
})
async function bookedSlot(JM_ID,ES_EM_ID)
{
	var query="Select * from event_slots es where es.ES_Status='Booked' and  es.ES_EM_ID="+ES_EM_ID+" and es.JM_ID="+JM_ID;

	var bookedRecords=await model.sqlPromise(query);
	if(bookedRecords!=null && bookedRecords.length > 0)
		return true;
	else
		return false
}



app.post('/admin/Get_Config',async (req,res)=>{
	
	let ES_EM_ID=req.body.ES_EM_ID;
	let JM_ID=req.body.JM_ID;
	if(ES_EM_ID==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	
	const sql="select esc.ESC_ID,esc.ESC_EM_ID,(CASE WHEN esc.ESC_Day_ID=7 THEN 0 ELSE esc.ESC_Day_ID END) as ESC_Day_ID,(SELECT ES_Calendar_Date from event_slots  where ES_EM_ID="+ES_EM_ID+" GROUP BY ES_Calendar_Date LIMIT 1) as cal_start_date from event_slots_config esc where esc.ESC_EM_ID="+ES_EM_ID+" and esc.JM_ID="+JM_ID;

	const data=await model.sqlPromise(sql);
	if(data!=null && data.length >0)
	{
		res.json({
			status:1,data
		})
	}
	else{

		res.json({
			status:0,msg:'no data found'
		})
		return false;
	
	}
})


//25-jul-2021
app.post('/admin/open_slots',async(req,res)=>{

	let ES_EM_ID=req.body.ES_EM_ID;
	let ES_Calendar_Date=req.body.date;
	if(ES_EM_ID==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	if(ES_Calendar_Date.length==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
const sql="select es.ES_ID,es.ES_EM_ID,es.ES_Calendar_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,	CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime,	CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime	from event_slots es where ES_EM_ID="+ES_EM_ID+" and ES_Status='Open' and es.ES_Calendar_Date='"+ES_Calendar_Date+"'";

	const data=await model.sqlPromise(sql);

	if(data!=null && data.length > 0)
	{
		res.json({
			status:1,data
		})
	}
	else
	{
			res.json({
				status:0,msg:'no data found'
			})
			return false;
		
	}
})


//26-jul-2021
app.post('/admin/videoSession',async(req,res)=>{

		var premium_url=process.env.PREMIUM_URL;

		var DA_ID=req.body.DA_ID;
		var ES_ID=req.body.ES_ID;
		var BM_Instruction=req.body.BM_Instruction;
		var BM_Name=req.body.BM_Name;
		var BM_Email=req.body.BM_Email;
		var BM_Phone=req.body.BM_Phone;
		var BM_Password=req.body.BM_Password;

		let paymentId=req.body.paymentId;

		var BM_Purchase_Amt=req.body.amount;
		var Consent=req.body.Consent;
		var JM_Name=req.body.JM_Name;
		var DA_Title=req.body.DA_Title;
		var LM_ID=req.body.LM_ID;	
		var JM_Email=req.body.JM_Email;
		var JM_Phone=req.body.JM_Phone;
		var mailText=req.body.mailText;
		var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
		var JM_ID=req.body.userDetails.JM_ID;
		var Status='B';
		const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password

		let BM_Content_Sent=premium_url;
		console.log("JM_ID ->  "+ JM_ID)
		let BM_FileUrl='[]';


					//var jitsee_URL='https://meet.jit.si/expy/'+JM_User_Profile_Url+"-"+BM_ID;
                    var randomPassword = Math.random().toString(36).slice(-10);
                    var MeetingId=JM_User_Profile_Url+"-"+ES_ID+"-"+randomPassword;
                    var premium_url=process.env.BASE_URL+"meet?id="+JM_User_Profile_Url+"-"+ES_ID+"-"+randomPassword;
                    var Date_of_session=req.body.session_date;	
                    var session_timeing=req.body.session_timeing;

                    var date = new Date();		
                    let BM_Purchase_Date=date.toISOString().substring(0, 10);


		const values = [
			[DA_ID,'NA',BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,Consent,paymentId,Status,BM_FileUrl,MeetingId,ES_ID]			
		];
	
		const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,Consent,Payment_ID,Status,BM_FileUrl,BM_Content_Sent,ES_ID) VALUES ?";	 	
		var data=await model.sqlInsert(sql,values);
		if(data.affectedRows > 0)
		{
			let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
			var update_lead=await model.sqlPromise(q);	
	
			let query="UPDATE event_slots set ES_Status='Booked' where JM_ID="+JM_ID+" and ES_ID="+ES_ID;		
			var update=await model.sqlPromise(query);	
			if(update.affectedRows===1)
			{
				var blocked=await blockSlot(JM_ID,ES_ID);
			}


				
                    var mailOptions = {   
                        from: "Expy Admin <info@expy.bio>",  
                        to:BM_Email,   
                        subject: "Transaction Success on Expy!", html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>"+mailText+".</p><p>Congratulations! Your Request will be fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request to join the video session here. Date : "+Date_of_session+", Timeing:"+session_timeing+" <a  href='"+premium_url+"' ><b>click here to join</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>"

                    };

                    var videoMail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your video session has been purchased from your Expy Page.</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>          <p>You can find your request to fulfill the video session here. Date : "+Date_of_session+", Timeing:"+session_timeing+" <a  href='"+premium_url+"' ><b>click here to join</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
                    mailOptions2 = {
                        from: "Expy Admin <info@expy.bio>", 
                        to: JM_Email,
                        subject: "Someone has purchased your video session on Expy! ",
                        text: "Thanks for Buying product",										  
                        html: videoMail
                    }

                    var resp2=await wrapedSendMailInfo(mailOptions);
                    var resp3=await wrapedSendMailInfo(mailOptions2);

                    if(resp2 || resp3)
                    {
                        res.json({
                            status:1,msg:'mail sent'+ resp2 + ' '+ resp3
                        })
                    }
                  else
                  {
                    res.json({
                            status:0,msg:'mail not sent'
                        })
                  }
		}
		else
		{
			res.json({
				status:1,msg:'payment done,failed to insert'
			})
		}
	
	
})

async function blockSlot(JM_ID,ES_ID)
{
	let sql="Select ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where  JM_ID="+JM_ID+" and ES_ID="+ES_ID;
	const data=await model.sqlPromise(sql);let isDone=0;
	if(data!=null && data.length > 0)
	{
			console.log("data");
			console.log(data);
		
			let ES_Slot_Start = data[0].ES_Slot_Start;
			let ES_Slot_End = data[0].ES_Slot_End;
			let ES_Calendar_Date = data[0].ES_Calendar_Date;
			var query="SELECT ES_ID,ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where ES_Status='Open' and JM_ID="+JM_ID+" and DATE(ES_Calendar_Date)='"+ES_Calendar_Date+"'" ;
			console.log("query");
			console.log(query);
			var bookedRecords=await model.sqlPromise(query);
			let bookLen=bookedRecords.length;
			if(bookLen> 0)
			{
			console.log("ES_Calendar_Date");
			console.log(ES_Calendar_Date);
				var ES_Status='Open';
				for (let k = 0; k < bookLen; k++) 
				{
					var event_id= bookedRecords[k].ES_ID;                                            
					console.log("event_id");
					console.log(event_id);
					console.log("bookedRecords[k].ES_Calendar_Date");
					console.log(bookedRecords[k].ES_Calendar_Date);
                  if(ES_Calendar_Date==bookedRecords[k].ES_Calendar_Date)   
                  {
                      if( 
                              inRange(ES_Slot_Start,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End)==true || 
                              inRange(ES_Slot_End,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End) ==true  
                       ) 
                      {
                          ES_Status='Blocked';

                          var query="UPDATE event_slots set ES_Status='"+ES_Status+"' where JM_ID="+JM_ID+" and ES_ID="+event_id;
                          var updateRecord=await model.sqlPromise(query);                     

                      }	
                      else if( (ES_Slot_Start == bookedRecords[k].ES_Slot_Start) && (ES_Slot_End == bookedRecords[k].ES_Slot_End) ) 
                      {
                          ES_Status='Blocked';
                          var query="UPDATE event_slots set ES_Status='"+ES_Status+"' where JM_ID="+JM_ID+" and ES_ID="+event_id;
                          var updateRecord=await model.sqlPromise(query);      

                      }
					  
                  }   
                                                                                                                      	
					isDone++;
				}

			}
	}
}
                                            
 async function unblockSlot(JM_ID,ES_ID)
{
	let query="UPDATE event_slots set ES_Status='Open' where JM_ID="+JM_ID+" and ES_ID="+ES_ID;		
	var update=await model.sqlPromise(query);	
	if(update.affectedRows===1)
	{
		
		let sql="Select ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where ES_Status='Blocked' and JM_ID="+JM_ID+" and ES_ID="+ES_ID;
		const data=await model.sqlPromise(sql);let isDone=0;
		if(data!=null && data.length > 0)
		{
			
				let ES_Slot_Start = data[0].ES_Slot_Start;
				let ES_Slot_End = data[0].ES_Slot_End;
				let ES_Calendar_Date = data[0].ES_Calendar_Date;
				var q="SELECT ES_ID,ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where ES_Status='Blocked' and JM_ID="+JM_ID+" and DATE(ES_Calendar_Date)='"+ES_Calendar_Date+"'" ;
				var bookedRecords=await model.sqlPromise(q);
				let bookLen=bookedRecords.length;
				if(bookLen> 0)
				{
					var ES_Status='Blocked';
					for (let k = 0; k < bookLen; k++) 
					{
					  var event_id= bookedRecords[k].ES_ID;
					  if(ES_Calendar_Date==bookedRecords[k].ES_Calendar_Date)   
					  {
						  if( 
								  inRange(ES_Slot_Start,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End)==true || 
								  inRange(ES_Slot_End,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End) ==true  
						   ) 
						  {
							  ES_Status='Open';
	
							  var q="UPDATE event_slots set ES_Status='"+ES_Status+"' where JM_ID="+JM_ID+" and ES_ID="+event_id;
							  var updateRecord=await model.sqlPromise(q);                     
	
						  }	
						  else if( (ES_Slot_Start == bookedRecords[k].ES_Slot_Start) && (ES_Slot_End == bookedRecords[k].ES_Slot_End) ) 
						  {
							  ES_Status='Open';
							  var q="UPDATE event_slots set ES_Status='"+ES_Status+"' where JM_ID="+JM_ID+" and ES_ID="+event_id;
							  var updateRecord=await model.sqlPromise(q);      
	
						  }
						
					  }   
																															  
						isDone++;
					}
	
				}
		}
	}
}

app.post('/admin/video_rq_complete',(req,res)=>{

	let ProfileName = req.body.data.JM_User_Profile_Url;
	let to=req.body.data.BM_Email;
	let BM_ID=req.body.data.BM_ID;
	
	let BM_Name=req.body.data.BM_Name;
	let BM_Purchase_Date=req.body.data.BM_Purchase_Date.substr(0, 10);
	let JM_Name=req.body.data.JM_Name;
	let JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;		 
	let DA_Title=req.body.data.DA_Title;
	let BM_Purchase_Amt=req.body.data.BM_Purchase_Amt;
	let BM_Phone=req.body.data.BM_Phone;

	let JM_ID=req.body.data.JM_ID;
	let ES_ID=req.body.data.ES_ID;

			var mailOptions2 = {   
				from: "Expy Admin <info@expy.bio>",  
				to:to,   
				subject: "Hooray! Your Expy Request is Delivered!",  
				html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: Rs. "+BM_Purchase_Amt+"</span><br/>   <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
				
			};

			let sql = "UPDATE buyers_master SET  Status='C',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
            let query = connection.query(sql, async (err, results) => 
			{
                if(err) 
                {
                    console.log(err);
                    res.json({status:0,msg:"err"});
                }
                else
                {
                    var response=await unblockSlot(JM_ID,ES_ID);

                   var resp=await wrapedSendMailInfo(mailOptions2);

                   let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
                    var isSentSMS=sendSMS(BM_Phone,msg);								
                    res.json({status:1,msg:'done',bode:[]});	
                }	
          });

})



	





async function bookedSlot_Event(ES_EM_ID)
{
	var query="Select * from event_slots es where es.ES_Status='Booked' and  es.ES_EM_ID="+ES_EM_ID;

	var bookedRecords=await model.sqlPromise(query);
	if(bookedRecords!=null && bookedRecords.length > 0)
		return true;
	else
		return false
}


app.post('/admin/deleteVideoSession',async(req,res)=>{

	
		let DA_ID=req.body.DA_ID;
		if(DA_ID==0)
		{
			res.json({status:0,msg:'empty param'}); return false;
		}
		const response=await bookedSlot_Event(DA_ID)
		if(response==true)
        {
				res.json({
                  status:0,
                  msg:'Unable to delete, booked slot present in request'
              })
              return false;
        }
		let q="delete from event_slots_config where ESC_EM_ID="+DA_ID;
		let deleteConfig=await model.sqlPromise(q);

		let q1="delete from event_slots where ES_EM_ID="+DA_ID;
		let deleteSlot=await model.sqlPromise(q1);

		let sql = "UPDATE direct_access_master_user SET  Archive=1 WHERE DA_ID="+DA_ID;
		let query = connection.query(sql, (err, results) => {
			if (err) {res.json({status:0,msg:'error in query',DA_ID:0});}
			else
			{							
				res.json({status:1,msg:'success',DA_ID:DA_ID});
			}
		});

})


//authorization
async function API_Authorization(JM_ID,authorization)
{
	//var authorization = req.headers['authorization']; 
	//var authorization = req.headers['id']; 

	if(typeof authorization=='undefined' || authorization =='' || authorization.length==0)
	{
	
		return false;
	}
	if(typeof JM_ID =='undefined' || JM_ID == 0)
	{
		return false;
	}
	let sql="Select JM_ID,TM_Token from token_master where TM_Token='"+authorization+"' and JM_ID="+JM_ID;
	var data=await model.sqlPromise(sql);		
	if(data!=null && data.length > 0)		
		return true;
	else
		return false;
}
async function addToken(JM_ID)
{	
	let token=await createWebToken();
	if(token.length > 299)
	{
		const insertToken=await insertTokenMaster(JM_ID,token);
		if(insertToken)
			return token;
		else
			return '';
	}
}

async function createWebToken()
{
	var token = cryptoRandomString({length: 300, type: 'url-safe'});
	let sql="Select JM_ID,TM_Token from token_master where TM_Token='"+token+"'";
	const row=await model.sqlPromise(sql)
	if(row!=null && row.length > 0)
		return createWebToken();
	else
		return token;
}
async function insertTokenMaster(JM_ID,TM_Token)
{

	let sql="Select JM_ID,TM_Token from token_master where JM_ID="+JM_ID;
	const row=await model.sqlPromise(sql)
	if(row!=null && row.length > 0) // update token 
	{
		let sql = "UPDATE token_master SET  TM_Token='"+TM_Token+"',Modified_Date=NOW() WHERE BM_ID="+JM_ID;
		var data=await model.sqlPromise(sql);
		if(data.affectedRows > 0)
			return true;
		else
			return false;
	}
	else
	{
		const values = [
			[JM_ID,TM_Token]
		];
		const sql = "INSERT INTO  token_master(JM_ID,TM_Token) VALUES ?";	 	
		var data=await model.sqlInsert(sql,values);
		if(data.affectedRows > 0)
			return true;
		else
			return false;
	}
	
}
app.post('/admin/token',async (req,res)=>{

	//var JM_ID=187;
	let sql="SELECT JM_ID FROM joining_master where JM_ID not in (select JM_ID from token_master);"
	const row=await model.sqlPromise(sql)
	if(row!=null && row.length > 0)
	{
		let lenRow=row.length;let c,n=0;
		for (let i = 0; i < lenRow; i++) 
		{
			let JM_ID=row[i].JM_ID;
			let data=await addToken(JM_ID);
			if(data)
			{
				c++;
			}
			else
			{
				n++
			}
		}
		
			res.json({
				status:1,complete:c,incomplete:n
			})
		
	}
	else
	{
		res.json({
			statue:0,msg:'no data found to generate token'
		})
	}
	
})

app.post('/admin/authorize',async (req,res)=>{

	var authorization = req.headers['authorization']; 
	var JM_ID = req.headers['id']; 
	var JM_Name = req.body.JM_Name; 
	let data=await API_Authorization(JM_ID,authorization);
	if(data)
    {
      res.json({
      status:1,
          data
      })
    }
    else
    {
        res.json({
            status:0,msg:'invalid calling'
        })
    }
	
})

async function getToken(JM_ID)
{
	let sql="Select JM_ID,TM_Token from token_master where JM_ID="+JM_ID;
	var data=await model.sqlPromise(sql);		
	if(data!=null && data.length > 0)		
	{	
		console.log(data[0].TM_Token)
		return data[0].TM_Token;
	
	}
	else
	{
		const token=await addToken(JM_ID);
		return token;
	}
}


app.post('/admin/encrypt',async (req,res)=>{

	var JM_ID=187;
	var strId=JM_ID.toString();
	
})
// encrypted id ==============================

//=====================================================================


app.listen(port,function(req,res){
	console.log("running..."+__dirname);
});
