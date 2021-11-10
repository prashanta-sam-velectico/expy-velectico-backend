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

//B-1
var validator = require('validator');




//ratelimiter
const rateLimit = require("express-rate-limit");

const limiter_All = rateLimit({
  windowMs: 5000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message:
  {
	code:429,
	message:"Too many request"	
  }
    
});

const limiterForgotPassword = rateLimit({
	windowMs: 5000, // 15 minutes
	max: 5, // limit each IP to 100 requests per windowMs
	message:
	{
	  code:429,
	  message:"Too many request"	
	}
	  
  });

//  apply to all requests
//app.use(limiter);









// for fileupload
app.use(fileUpload({ safeFileNames: true, preserveExtension: true,uriDecodeFileNames:true, limits: { fileSize: 150 * 1024 * 1024 } }))

app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));
app.use(express.static('uploads'));
app.use(express.static('store'));




//============= middleware for checking toke

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    next();
});



var checkUserFilter = async function(req, res, next) {

	
    if(
		   req._parsedUrl.pathname === '/admin/userDetailsAll' 
		|| req._parsedUrl.pathname === '/admin/GetAllRequest' 		
		|| req._parsedUrl.pathname === '/admin/Update_ReferralCode' 
		|| req._parsedUrl.pathname === '/admin/updateProfileNameDescription'
		|| req._parsedUrl.pathname === '/admin/userDetailsAllSettings'
		|| req._parsedUrl.pathname === '/admin/createContact'
		|| req._parsedUrl.pathname === '/admin/payout'
		|| req._parsedUrl.pathname === '/admin/UpdatePayoutDetails' 		
		|| req._parsedUrl.pathname === '/admin/UpdatePayoutDetailsPayPal' 
		|| req._parsedUrl.pathname === '/admin/updatePassword' 
		|| req._parsedUrl.pathname === '/admin/updateProfileSettings' 
		|| req._parsedUrl.pathname === '/admin/updateEmail' 
		|| req._parsedUrl.pathname === '/admin/updatePhone'

		|| req._parsedUrl.pathname === '/admin/isAvailablePhone'  	
		|| req._parsedUrl.pathname === '/admin/isAvailablePhoneBank'  		
		|| req._parsedUrl.pathname === '/admin/statsDetails' 
		|| req._parsedUrl.pathname === '/admin/pay_balance' 
		|| req._parsedUrl.pathname === '/admin/ValidateURL_Profile'  
		|| req._parsedUrl.pathname === '/admin/changeUrlByAdmin'
		|| req._parsedUrl.pathname === '/admin/deleteProduct' 
		|| req._parsedUrl.pathname === '/admin/deleteContest' 
		|| req._parsedUrl.pathname === '/admin/contestReport' 
		|| req._parsedUrl.pathname === '/admin/setWinner' 		
		|| req._parsedUrl.pathname === '/admin/userAppear' 
		|| req._parsedUrl.pathname === '/admin/updateDefaultTheme' 
		|| req._parsedUrl.pathname === '/admin/removeBackgroundImage' 
		|| req._parsedUrl.pathname === '/admin/uploadBackgroundImage' 
		|| req._parsedUrl.pathname === '/admin/refund' 
		|| req._parsedUrl.pathname === '/admin/video_rq_complete'
		|| req._parsedUrl.pathname === '/admin/updateNofityPref'
	//	|| req._parsedUrl.pathname === '/admin/socialLogin' 	
		|| req._parsedUrl.pathname === '/admin/addImageCarousel' 
		|| req._parsedUrl.pathname === '/admin/updateImageCarousel' 
		|| req._parsedUrl.pathname === '/admin/removeCarouselImg' 		
		|| req._parsedUrl.pathname === '/admin/GetOpenSlots' 
		|| req._parsedUrl.pathname === '/admin/getCalender'  
		||  req._parsedUrl.pathname === '/admin/Get_All_Booking_By_Date_Month'
		//API fntion
		//|| req._parsedUrl.pathname === '/admin/updateClick'  
		|| req._parsedUrl.pathname === '/admin/updateStepStatus'  
		|| req._parsedUrl.pathname === '/admin/updateSeen'  
		//|| req._parsedUrl.pathname === '/admin/ValidateEmail'  
		//|| req._parsedUrl.pathname === '/admin/validReferralCode'
		//|| req._parsedUrl.pathname === '/admin/isAvailablePhone_by_phone'
		|| req._parsedUrl.pathname === '/admin/updateJoiningMaster'
		|| req._parsedUrl.pathname === '/admin/createSchedule'
		|| req._parsedUrl.pathname === '/admin/updateSchedule'
		//|| req._parsedUrl.pathname === '/admin/Get_Config'	
		//myprofile		
		|| req._parsedUrl.pathname === '/admin/deleteLinkSocial'
		|| req._parsedUrl.pathname === '/admin/AddCategory'		
		|| req._parsedUrl.pathname === '/admin/UpdateCategory'	
		|| req._parsedUrl.pathname === '/admin/deleteCategory'
		|| req._parsedUrl.pathname === '/admin/InsertEmbedContent'	
		|| req._parsedUrl.pathname === '/admin/UpdateEmbedContent'
		|| req._parsedUrl.pathname === '/admin/deleteEmbed'
 		|| req._parsedUrl.pathname === '/admin/InsertLink'
		|| req._parsedUrl.pathname === '/admin/UpdateLink'
		|| req._parsedUrl.pathname === '/admin/deleteLink'
		|| req._parsedUrl.pathname === '/admin/updateActiveLink'
		|| req._parsedUrl.pathname === '/admin/updateActiveCategory'
		|| req._parsedUrl.pathname === '/admin/updateActiveEmbed'
		|| req._parsedUrl.pathname === '/admin/updateActiveLinkSocial'
		|| req._parsedUrl.pathname === '/admin/updateActiveNewsLetter'
		|| req._parsedUrl.pathname === '/admin/updateActiveVartualGift'
		|| req._parsedUrl.pathname === '/admin/updateActivePremium'		
		|| req._parsedUrl.pathname === '/admin/deleteVideoSession'
		|| req._parsedUrl.pathname === '/admin/profileImageFromProfile'
		|| req._parsedUrl.pathname === '/admin/updateOrderBySocialWidget'
		|| req._parsedUrl.pathname === '/admin/updateOrderByForEachTable'		
		|| req._parsedUrl.pathname === '/admin/updateOrderByCustomLink'
		|| req._parsedUrl.pathname === '/admin/updateOrderByProductList'
		|| req._parsedUrl.pathname === '/admin/moveLinkToFolder'
		//paypal // no need for now
		|| req._parsedUrl.pathname === '/admin/paypalPayout'
		|| req._parsedUrl.pathname === '/admin/removeBankPayPal'
		//myappear
		|| req._parsedUrl.pathname === '/admin/updateCustomThemeOnclick'
		|| req._parsedUrl.pathname === '/admin/updateCustomTheme'
		||  req._parsedUrl.pathname === '/admin/addProduct' 
		||  req._parsedUrl.pathname === '/admin/addProductNoFile' 
		||  req._parsedUrl.pathname === '/admin/declinedFree' 
		||  req._parsedUrl.pathname === '/admin/uploadFile' 
		||  req._parsedUrl.pathname === '/admin/completeRequest' 
		

		||  req._parsedUrl.pathname === '/admin/addGifts' 
		||  req._parsedUrl.pathname === '/admin/updateProduct'
		||  req._parsedUrl.pathname === '/admin/updateGifts' 		
		||  req._parsedUrl.pathname === '/admin/isUserBlock' 
		||  req._parsedUrl.pathname === '/admin/removeVideoCover' 
		||  req._parsedUrl.pathname === '/admin/blockedSlot' 	
		||  req._parsedUrl.pathname === '/admin/addContest' 
		||  req._parsedUrl.pathname === '/admin/updateContest'	

		||  req._parsedUrl.pathname === '/admin/fetchContest'
		||  req._parsedUrl.pathname === '/admin/graphMonthy'

		||  req._parsedUrl.pathname === '/admin/ValidateEmail_after_login'
		//MS3 B2
		||  req._parsedUrl.pathname === '/admin/GetAllRequest_by_status'
		||  req._parsedUrl.pathname === '/admin/updateRequestStat'
		||  req._parsedUrl.pathname === '/admin/declineRequest2Admin'

		
		
	 ) 		
    {
		console.log(req._parsedUrl.pathname);
		var contype = req.headers['content-type'];
		console.log(contype)
		// if(req._parsedUrl.pathname === '/admin/changeUrlByAdmin')
		// {
		
		// 	if (!contype || contype.includes('multipart/form-data')==false)
		// 	res.json({status:0,msg:'not in format'});
		// 	return false;
		// }
	
		var authorization = req.headers['authorization'];
		var JM_ID = req.headers['id'];
		const isValidApi= await API_Authorization(JM_ID,authorization,req);
        if(isValidApi==false)
        {
          //res.json({status:0,msg:'unable to process'})
		  res.json({status:-1,msg:'Your session has expired. Please relogin'}) 	
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

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });
// app.use(function(req, res, next) {
// 	//res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

// 	if(req._parsedUrl.pathname === '/admin/changeUrlByAdmin')
// 		{
		
// 			if (!contype || contype.includes('multipart/form-data')==false)
// 			res.json({status:0,msg:'not in format'});
// 			return false;
// 		}
// 	next();
//   });


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

// var transporter = mailer.createTransport(smtpTransport({
// 	name: 'localhost',
// 	port: 25,
// 	auth: {
// 		user: "info@velectico.net.in",
// 		pass: "expy@2021"
// 	},
// 	tls:{
// 		rejectUnauthorized: false
// 	}
// }));




require('custom-env').env('dev', '/var/www/html/adm/');
app.post('/admin/mail',function(req,res){


				let transporter = mailer.createTransport({
					service: 'Yandex', // no need to set host or port etc.
					auth: {
						user: "info@expy.bio",
						pass: "NB787gdX"
					}
				});
               

              let to=req.body.Email;
              var mailOptions = {
                  from: "Expy Team <info@expy.bio>",
                  to: to,
                  subject: "Send Email Using Node.js",
                  text: "Node.js New world for me",
                  html: "<b>Node.js New world for me</b>"
              }

			
						transporter.sendMail(mailOptions, (error, info) => {
                          if (error) 
                          {
                              res.json({status:0,msg:"error",error:"error"});	
                          }
                          else
                          {
                              res.json({status:1,msg:'sent'});	
                          }
						});
				

});



app.post('/admin/completeRequest',async function(req,res){

	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


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
		 BM_Purchase_Amt=req.body.Actual_Price;
		// var substr=string.substr(0, 8);
		//"0aeb596abc97d28c6efd6f4fbae8a6ca.jpg"
		var pathTofile= __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
		console.log(pathTofile)
		var premium_url=process.env.BASE_URL+'adm/uploads/Profile/' + ProfileName+"/"+fileName;



		var fs = require("fs"); //Load the filesystem module
		var stats = fs.statSync(pathTofile)
		var fileSizeInBytes = stats.size;
		// Convert the file size to megabytes (optional)
		var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
		console.log(fileSizeInMegabytes)
		
				var mailOptions="";
				if(fileSizeInMegabytes > 20 )
				{	
					mailOptions = {   
						from: "Expy Team <info@expy.bio>",  
						to:to,   
						subject: "Hooray! Your Expy Request is Delivered!",  
						html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request here: <a  href='"+premium_url+"' download><b>Download content</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",				 
					};
				}
				else
				{

					mailOptions = {   
						from: "Expy Team <info@expy.bio>",  
						to:to,   
						subject: "Hooray! Your Expy Request is Delivered!",  
						html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request here: <a  href='"+premium_url+"' download><b>Download content</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
						attachments: [  		 
							{   					
								path: pathTofile
							},
						] 
					};
				}



				var mailOptions2 = {   
					from: "Expy Team <info@expy.bio>",  
					to:to,   
					subject: "Hooray! Your Expy Request is Delivered!",  
					html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request here: <a  href='"+premium_url+"' download><b>Download content</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
					attachments: [  		 
						{   					
							path: pathTofile
						},
					] 
				};


				    console.log(pathTofile)
					var resp2=await wrapedSendMailInfo(mailOptions);
					console.log(premium_url)
          			let sql = "UPDATE buyers_master SET  Status='C',BM_Content_Sent='"+premium_url+"',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
                          let query = connection.query(sql, async (err, results) => {
                          if(err) 
                          {
                              console.log(err);
                              res.json({status:0,msg:"err"});
                          }
                          else
                          {
								//var resp=await wrapedSendMailInfo(mailOptions2);

								let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
								var isSentSMS= await sendSMS(BM_Phone,msg);								
                             	 res.json({status:1,msg:'done',pathTofile:''});	
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
			from: "Expy Team <info@expy.bio>",  
			to:to,   
			subject: "Hooray! Your Expy Live Video Request is Delivered!",  
			html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>You can find your fulfilled request to join the video session here. Date : "+Date_of_session+", Starting-Time:"+Starting_Time+",Ending-Time:"+Ending_Time+" <a  href='"+premium_url+"' ><b>click here to join</b></a></p>                 <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
			
		};

								var resp=await wrapedSendMailInfo(mailOptions);

								let sql = "UPDATE buyers_master SET  Status='C',BM_Content_Sent='"+MeetingId+"',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
								let query = connection.query(sql, (err, results) => {
								if(err) 
								{
									//console.log(err);
									res.json({status:0,msg:"err"});
								}
								else
								{
									//let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
									//	var isSentSMS=sendSMS(BM_Phone,sms);								
									res.json({status:1,msg:'done',link:premium_url});	
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
					   res.json({status:0,msg:"unable to complete request, try again later",error:"error"});	
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
								//console.log(err);
								res.json({status:0,msg:"internal error try again later",err:"err"});
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
app.post('/admin/uploadFile',async function(req,res)
{



			var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
			var JM_ID=parseInt(req.headers['id']);
			JM_ID=await check_IntegerValue(JM_ID);
			const respond=await Creators_Specific_Details(JM_ID);
			console.log(respond)
			if(respond.status==1)
			{
				ProfileName=respond.Creators[0].JM_User_Profile_Url_plus_JM_ID;	
			}

				

				if (!req.files || Object.keys(req.files).length === 0) 				
				{
					res.json({status:0,msg:'Missing param'});
					return false;
				}


				let videoFile = req.files.sampleFile;
				var ext = path.extname(videoFile.name);	
				
				const allowedExtension = ['.mp3','.mp4','.mov'];			
				if(!allowedExtension.includes(ext))
				{
					res.json({status:0,msg:"File type must be mp4 or mp3"});
					return false;
				}
			

				var fileName=videoFile.md5+ext;														
				var	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;
				
				videoFile.mv(uploadPath, async function(err) 
				{
				  if (err)
						  res.json({status:0,msg:"Failed to upload file, try again later"});
				  else	
				  {			

					  var dbData={
						fileName:fileName								                              
					  }
						const flag=await jsonEncrypt(dbData);
					  res.json({status:1,msg:'Uploaded now you can submit it',flag:flag});
  
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
						//console.log(err);
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
						//console.log(err);
						res.json({status:0,msg:"error",err:"err"});
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

	
	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}
		
	var fileName="thankYou.jpg";
	var fileArray=[fileName];
	var DA_Collection=JSON.stringify(fileArray);

	//DA_Title=connection.escape(DA_Title);
	//DA_Description=connection.escape(DA_Description);


	const values = [
		[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
	];
	const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
	const query = connection.query(sal, [values], function(err, result)
	{
		if (err) 
		{
			res.json({status:0,msg:"err"});
		}
		else
		{			
			res.json({status:1,msg:'Done',DA_ID:DA_DA_ID});
		}	
	});
					
					//res.json({status:0,msg:"err",sql:"sal",body:req.body,values:values});
});



var Jimp = require('jimp');
app.post('/admin/addProduct',async function(req,res){

	let videoFile,imageFile,coverFile,album;
	let uploadPath;





	
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	const respond=await Creators_Specific_Details(JM_ID);
	if(respond.status==1)
	{
		ProfileName=respond.Creators[0].JM_User_Profile_Url_plus_JM_ID;	

	}
	var DA_Cover=req.body.DA_Cover;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var DA_Price=req.body.DA_Price;
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;

	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}

	DA_Allow_Cust_Pay=await check_IntegerValue(DA_Allow_Cust_Pay);
	if(DA_Allow_Cust_Pay!=0 && DA_Allow_Cust_Pay!=1) //1
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	DA_Price=await check_IntegerValue(DA_Price);

	// if(DA_Price > 0) //1
	// {
	// 	DA_Min_Amount=0;DA_Allow_Cust_Pay=0;	
	// }
	// if(DA_Min_Amount > 0) //1
	// {
	// 	DA_Price=0;	DA_Allow_Cust_Pay=1;	
	// }

	DA_DA_ID=await check_IntegerValue(DA_DA_ID);
	if(DA_DA_ID!=1 && DA_DA_ID!=2 && DA_DA_ID!=3 ) //1
	{
		res.json({status:0,msg:"invalid product"});
		return false;
	}
	var fileName="";
	

	//11-oct-2021
	//DA_Title=connection.escape(DA_Title);
	//DA_Description=connection.escape(DA_Description);



	if (!req.files || Object.keys(req.files).length === 0) 
	{		
			
        
 					var DA_Collection="[]";		
					  const values = [
						  [DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,"",DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					  ];
					  const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  

					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {
                           
                            res.json({status:0,msg:"err"});
                        }
                        else
                        {			
                            res.json({status:1,msg:'Done',DA_DA_ID:DA_DA_ID});

                        }	
					});
              
	}
	else
	{
		//console.log("file exist ---> "+ DA_Type);
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
					[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
				];
				const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
				const query = connection.query(sal, [values], function(err, result) {
				if (err) 
				{
					//console.log(err);
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
									//console.log("success");
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
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						//console.log(err);
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
										//console.log("success");
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
					console.log(DA_Collection)
					var DA_Collection=JSON.stringify(fileArray);		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection ,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						//console.log(err);
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
										//console.log("success");
										

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
											//console.error(err);
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
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection ,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						//console.log(err);
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
										//console.log("success");
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
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection ,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						//console.log(err);
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
										//console.log("success");
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
			//console.log(album)	
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
							[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection ,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
						];
						const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection) VALUES ?";	  
						const query = connection.query(sal, [values], function(err, result) 
                        {
                              if (err) 
                              {
                                  //console.log(err);
                                  res.json({status:0,msg:"err"});
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
                                          //console.log("success");
                                          res.json({status:1,msg:'Done',DA_ID:DA_ID});
                                      }
                                  }
                                  catch (err) {
                                      //console.log("error in image");
                                      res.json({status:0,msg:"error in exception"});
                                  }

                              }	
					  });

			}    
		}
		else
		{
			res.json({status:0,msg:"invalid file type"});
		}
	}

});

//09-apr-2021
app.post('/admin/updateProduct',async function(req,res){

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

	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}


	DA_Allow_Cust_Pay=await check_IntegerValue(DA_Allow_Cust_Pay);
	if(DA_Allow_Cust_Pay!=0 && DA_Allow_Cust_Pay!=1) //1
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	DA_Price=await check_IntegerValue(DA_Price);


	// if(DA_Price > 0) //1
	// {
	// 	DA_Min_Amount=0;DA_Allow_Cust_Pay=0;	
	// }
	// if(DA_Min_Amount > 0) //1
	// {
	// 	DA_Price=0;	DA_Allow_Cust_Pay=1;	
	// }

	DA_DA_ID=await check_IntegerValue(DA_DA_ID);
	if(DA_DA_ID!=1 && DA_DA_ID!=2 && DA_DA_ID!=3 ) //1
	{
		res.json({status:0,msg:"invalid product"});
		return false;
	}


	var fileName="";

	DA_Title=connection.escape(DA_Title);
	DA_Description=connection.escape(DA_Description);

	if (!req.files || Object.keys(req.files).length === 0) 
	{		
		
		
			let sql = "UPDATE direct_access_master_user SET  DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+",DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+",DA_Suggested_Amont="+DA_Suggested_Amont+"   WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
  
			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"err"});
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
						//console.log(DA_Collection)
						
						let sql = "UPDATE direct_access_master_user SET DA_Type='"+DA_Type+"', DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"', DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+",DA_Suggested_Amont="+DA_Suggested_Amont+"   WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
			
						let query = connection.query(sql, (err, results) => {
							if(err) 
							{
								//console.log(err);
								res.json({status:0,msg:"err"});
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
										//console.log("success");

									
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
				//console.log(DA_Collection)
				
				let sql = "UPDATE direct_access_master_user SET  DA_Type='"+DA_Type+"',DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"', DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+",DA_Suggested_Amont="+DA_Suggested_Amont+"  WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;

				let query = connection.query(sql, (err, results) => {
					if(err) 
					{
						//console.log(err);
						res.json({status:0,msg:"err"});
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
								//console.log("success");
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
				//console.log(DA_Collection)
				
				let sql = "UPDATE direct_access_master_user SET  DA_Type='"+DA_Type+"',DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"' WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
	
				let query = connection.query(sql, (err, results) => {
					if(err) 
					{
						//console.log(err);
						res.json({status:0,msg:"err"});
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
								//console.log("success");

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
									//console.error(err);
									
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

app.post('/admin/addGifts',async function(req,res){

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	
	var JM_ID=req.body.JM_ID;		
	var DA_Title=req.body.DA_Title;	
	var image=req.body.image;
	var DA_Price=req.body.DA_Price;
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;

	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	console.log("DA_Min_Amount")
	console.log(DA_Min_Amount)
	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}

	var fileName="";
	//DA_Title=connection.escape(DA_Title);
	
					
					var fileArray=[image];
					var DA_Collection=image;					
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title,'NA',DA_Price,DA_Collection,1,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Price,DA_Collection,DA_Active,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {
                            console.log(err.sqlMessage);
							console.log("here====");
                            res.json({status:0,msg:"err"});


                        }
                        else
                        {						
                                            let DA_ID=result.insertId;
                                            //console.log("success");
                                            res.json({status:1,msg:'Done'});


                        }	
					});
});

//16-apr-2021

app.post('/admin/updateGifts',async function(req,res)
{

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	


	var DA_ID=req.body.DA_ID;	
	var JM_ID=req.body.JM_ID;		
	var DA_Title=req.body.DA_Title;	
	var DA_Price=req.body.DA_Price;
	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}


	DA_Title=connection.escape(DA_Title);

	if(DA_ID > 0)
	{
        let sql = "UPDATE direct_access_master_user SET  DA_Title="+DA_Title+",DA_Price='"+DA_Price+"',DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+",DA_Suggested_Amont="+DA_Suggested_Amont+"  WHERE DA_ID="+DA_ID;
        let query = connection.query(sql, (err, results) => 
        {
            if(err) 
            {
                //console.log(err);
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

app.post('/admin/addDoner',async (req,res)=>{

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
		
		let jsonData=await decryptJsonData(req.body.flag)
		console.log(jsonData)

		if(jsonData==false)
		{
			res.json({status:0,msg:"Invalid data"});
			return false;
		}
		req.body=jsonData;

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
		const hashPassword = "********"; //bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
		//var BM_Purchase_Amt=1;
		//console.log("paymentId ->  "+ paymentId)
		
		//console.log("DA_ID ->  "+ DA_ID)
		var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	

		if(paymentId!='')
		{

			//================================================== calculation for tax fee, actual amt
			const result=await fetchPayment(paymentId);
			let amount=0;let fee=0;let tax=0;
			var paymentData=result.data;
			console.log("paymentData")
			console.log(paymentData)
			console.log(paymentData.status)


			if(result.status==0)
			{
				res.json({status:0,err:"invalid id"});
				return false;
			}			



			let creator_get=0;
			if(result.status==1 && paymentData!=null  && (paymentData.status=='captured' || paymentData.status=='authorized' ))
			{
				amount=parseFloat(paymentData.amount);
				fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
				tax=parseFloat(paymentData.tax);
				creator_get=(amount - fee) / 100; 
				var expy_get=((amount - fee) * .10) / 100;						
				creator_get=creator_get - expy_get;
				console.log(creator_get)
				fee=fee/100;	
				tax=tax/100;


				if(await isValidPayment(paymentId)==false)
				{
					res.json({status:0,err:"invalid payment, you are under attack"});
					return false;
				}


			}     
			BM_Purchase_Amt=amount/100;
			var Actual_Price=amount/100;
			var BM_Purchase_Amt_calculated=creator_get.toFixed(2)
			//================================================== calculation for tax fee, actual amt
			var LM_ID=parseInt(req.body.LM_ID);
			if(isNaN(LM_ID)) LM_ID=0;
			let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
			console.log(q)
			const done=await model.sqlPromise(q);
			console.log("here 1")
			var responseData=req.body.responseData;
			await updateTran(responseData.razorpay_payment_id,'captured',responseData.razorpay_order_id)
			console.log("here 3")
			//console.log("Successfully copied and moved the file!")


			
			// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
			// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
			// BM_Email=await removeSpecialChar_email(BM_Email)


			//BM_Instruction=connection.escape(BM_Instruction);
			//BM_Name=connection.escape(BM_Name);
			BM_Email=await removeSpecialChar_email(BM_Email)

			const values = [
				[DA_ID," ",BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt_calculated,BM_Instruction,' ',"D",'C',paymentId,JM_ID,LM_ID,fee,tax,Actual_Price]			
			];
			const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID,LM_ID,Fee,Tax,Actual_Price) VALUES ?";	  
		


			const query = connection.query(sql, [values], async function(err, result) {
				if (err) 
				{
					console.log(err);
					res.json({status:0,msg:"err"});
				}
				else
				{

					if(DA_Title.length==0)
					{
						DA_Title='gift';
					}
					DA_Title='gift';

					 let msg="<p>Hi "+BM_Name+",</p></br><p> Your "+DA_Title+" of ₹ "+BM_Purchase_Amt+"  was successfully received by "+JM_Name+". Thank you for supporting your favorite creator! </p><p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span>";

					// var text="Product Link : "+premium_url+BM_Url_ID;
					var mailOptions = {
						from: "Expy Team <info@expy.bio>",
						to: BM_Email,
						subject: "Your Expy Gift was delivered! ",
						text: "Thanks for Support",
						html: msg
					}

					
					console.log("here 4")

					
					var datetime = new Date();					
					var purchased_date=datetime.toISOString().slice(0,10);

					let made_sale="You received a Gift";
					let price=BM_Purchase_Amt;
					let lastText=DA_Title;
					//var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";
					var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto; color:#333;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0; color:#000;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";

					let msg2="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p>Hi "+JM_Name+",</p><p> Congratulations! You have received a new gift on your Expy Page. </p><span> Details  :</span><br/> <span> Name: "+BM_Name+"</span><br/>   <span> Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Gift Item: "+DA_Title+" </span><br/>          <span>Item Price: ₹ "+BM_Purchase_Amt+"</span><br/><p>Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Keep creating awesome content to receive more gifts from your followers!</p>  <p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";

					var mailOptions2 = {
						from: "Expy Team <info@expy.bio>",
						to: JM_Email,
						subject: "You have received a new Gift on Expy!",
						text: "Thanks for Support",
						html: msg2
					}
					//"Congrats "+JM_Name+" ! You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
					var sms="Congrats "+JM_Name+" You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
					
					console.log("here 5")
					console.log(JM_Phone)
					var isSentSMS=await sendSMS(JM_Phone,sms);

					console.log(isSentSMS)

					var resp=await wrapedSendMailInfo(mailOptions);
					var resp2=await wrapedSendMailInfo(mailOptions2);

					res.json({status:1,msg:"msg"});

					
				}	
			});

		
		}
		else
		{
			//console.log('no payment id');
			res.json({status:0,msg:"no payment id"});
		}
		
})

//24-jun-2021
app.post('/admin/addImageCarousel',async (req,res)=>{



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
		//console.log("file exist ---> "+ DA_Type);
	
		if(DA_Type=="image") 
		{
			
					let carousel_1 = req.files.carousel_1;
					let carousel_2 = req.files.carousel_2;
					let carousel_3 = req.files.carousel_3;
				
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
									//console.log("success1");	
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
									//console.log("success2");	
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
									//console.log("success3");	
							}
						});
					}
				
					
				
					var trimmedIds = fileNames.replace(/^,|,$/g,'');
					var fileArray=[trimmedIds];	
					var DA_Collection=JSON.stringify(fileArray);
					//console.log(DA_Collection)
		
					const values = [
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Car_Image1,DA_Car_Image2,DA_Car_Image3,carousel_title_1,carousel_title_2,carousel_title_3]
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,DA_Car_Image1,DA_Car_Image2,DA_Car_Image3,DA_Car_Image1_Title,DA_Car_Image2_Title,DA_Car_Image3_Title) VALUES ?";	  
					const query = connection.query(sal, [values], function(err, result) {
					if (err) 
					{
						//console.log(err);
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
	var JM_ID=await check_IntegerValue(parseInt(req.body.JM_ID));
	var DA_ID=await check_IntegerValue(parseInt(req.body.DA_ID));
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var DA_Type=req.body.DA_Type;
	var fileName="";
	var DA_Car_Image1='NA';
	var DA_Car_Image2='NA'; 
	var DA_Car_Image3='NA';

	var carousel_title_1=req.body.carousel_title_1;
	var carousel_title_2=req.body.carousel_title_2;
	var carousel_title_3=req.body.carousel_title_3;




	if(DA_ID ==0 || JM_ID==0)
	{
		res.json({status:0,msg:'missing param'});
		return false;
	}



	let q="SELECT *  from direct_access_master_user da inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and da.DA_ID="+DA_ID+" and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0;";
	const response=await model.sqlPromise(q);
	if(response!=null && response.length === 0)
	{
		res.json({status:0,msg:'not authorized to update'});
		return false;
	}


	

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
		//console.log("file exist ---> "+ DA_Type);
	
		if(DA_Type=="image") 
		{
			
					let carousel_1 = req.files.carousel_1;
					let carousel_2 = req.files.carousel_2;
					let carousel_3 = req.files.carousel_3;
					
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
								//console.log("success1");	
								
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
								//console.log("success2");	
								
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
									//console.log("success3");	
								
								
							}
						});
					}


							if(DA_Car_Image1!='NA')
                            {
								let sql="Update direct_access_master_user set DA_Car_Image1='"+DA_Car_Image1+"' where DA_ID="+DA_ID;
								const rows = await model.sqlPromise(sql);
								//console.log("update1")
								//console.log(rows)
								countResponse++;
                            }
							if(DA_Car_Image2!='NA')
                            {
								let sql="Update direct_access_master_user set DA_Car_Image2='"+DA_Car_Image2+"'  where DA_ID="+DA_ID;
								const rows = await model.sqlPromise(sql);
								//console.log("update2")
								//console.log(rows)
								countResponse++;
                            }
							if(DA_Car_Image3!='NA')
                            {
									let sql="Update direct_access_master_user set DA_Car_Image3='"+DA_Car_Image3+"' where DA_ID="+DA_ID;
									const rows = await model.sqlPromise(sql);
									//console.log("update3")
									//console.log(rows)
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

	var html="";
	var followerName=req.body.data.BM_Name;
	var Creator_Name=req.body.data.JM_Name;
	var purchased_date=req.body.data.BM_Purchase_Date; 
	var JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;
	var DA_Title=req.body.data.DA_Title;
	var BM_Purchase_Amt=req.body.data.Actual_Price;
	var BM_Email=req.body.data.BM_Email;
	var BM_Phone=req.body.data.BM_Phone;
	var BM_ID=req.body.BM_ID;
	var ES_ID=req.body.data.ES_ID;
	var JM_ID=req.body.data.JM_ID;
	var DA_DA_ID=req.body.data.DA_DA_ID;

	if(typeof pay_id=='undefined' 
		|| typeof followerName=='undefined' 
		|| typeof Creator_Name=='undefined' 
		|| typeof purchased_date=='undefined' 
		|| typeof JM_User_Profile_Url=='undefined' 
		|| typeof DA_Title=='undefined' 
		|| typeof BM_Purchase_Amt=='undefined' 
		|| typeof BM_Email=='undefined' 
		|| typeof BM_Phone=='undefined' 

	)
	{
		res.json({status:0,msg:"param undefined"});
		return false;
	}
	if(  await check_IntegerValue(DA_DA_ID)==0 
		|| await check_IntegerValue(BM_ID)==0	
		|| await check_IntegerValue(JM_ID)==0
	)
	{
		res.json({status:0,msg:"missing param"});
		return false;
	}


	var isFree=parseInt(req.body.data.isFree);
	if(isNaN(isFree)) isFree=0;
	if(typeof isFree=='undefined') isFree=0;

		var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
		var mailOptions = {
			from: "Expy Team <info@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been declined.",			
			html: html
		}


	
		//let url="https://rzp_test_FLoVSsJykW8cff:YY9ZWVKr9rH7obEDOJA4f49P@api.razorpay.com/v1/payments/"+pay_id+"/refund";
	
	//live must uncomment before live
	let url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payments/"+pay_id+"/refund";
	
	request({
	  method: 'POST',
	  url: url,
	}, function (error, response, body) {
        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
		
        if(response.statusCode!=400)
        {
			let transporter = mailer.createTransport({
				service: 'Yandex', // no need to set host or port etc.
				auth: {
					user: "info@expy.bio",
					pass: "NB787gdX"
				}
			});

			transporter.sendMail(mailOptions, async (error, info) => {
				if (error) 
				{
					res.json({
						status:0,
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
								//console.log(err);
								res.json({status:0,msg:"unable to query "});
							}
							else
							{
								if(DA_DA_ID===5)
								{
									var response=await unblockSlot(JM_ID,ES_ID,BM_ID);
								}
								
								let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
								
							//	var isSentSMS=sendSMS(BM_Phone,msg);
								res.json({
											status:1,
											msg:'refund done',
											statusCode:"done"
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

//17-jul-2021 mail id change personal,unlock,digital 
app.post("/admin/capture",async function(req,res)
{

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

			let jsonData=await decryptJsonData(req.body.flag)
			//console.log(jsonData)

			if(jsonData==false)
			{
				res.json({status:0,msg:"Invalid data"});
				return false;
			}
			req.body=jsonData;

			
//================================================
		var crsf_id=req.headers['token'];
		 let paymentId=req.body.paymentId;
		if(typeof crsf_id=='undefined' || crsf_id.length == 0)
        {
            res.json({status:0,msg:'invalid api calling'});
            return false;
        }

        let valid=await decryptData_Str(crsf_id,paymentId);
        if(valid==false)
        {
            res.json({status:0,msg:'invalid api calling'});
            return false;
        }



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
	
			// let jsonData=await decryptJsonData(req.body.flag)
			// console.log(jsonData)
			// var JM_ID=parseInt(jsonData.JM_ID);	
		
			//================================================== calculation for tax fee, actual amt
			const result=await fetchPayment(paymentId);
			let amount=0;let fee=0;let tax=0;
			var paymentData=result.data;
			console.log("paymentData")
			console.log(paymentData)
			console.log(paymentData.status)

			if(result.status==0)
			{
				res.json({status:0,err:"invalid id"});
				return false;
			}			


			let creator_get=0;
			if(result.status==1 && paymentData!=null  && (paymentData.status=='captured' || paymentData.status=='authorized' ))
			{
				amount=parseFloat(paymentData.amount);
				
				fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
				tax=parseFloat(paymentData.tax);
				creator_get=(amount - fee) / 100;	
				var expy_get=((amount - fee) * .10) / 100;						
				creator_get=creator_get - expy_get;
				console.log(creator_get)
				fee=fee/100;	
				tax=tax/100;

				if(await isValidPayment(paymentId)==false)
				{
					res.json({status:0,err:"invalid payment, you are under attack"});
					return false;
				}


			}     
			BM_Purchase_Amt=amount/100;
			var Actual_Price=amount/100;
			var BM_Purchase_Amt_calculated=creator_get.toFixed(2)
			//================================================== calculation for tax fee, actual amt

			console.log("req.body.responseData");
			console.log(req.body.responseData);
		
			var responseData=req.body.responseData;
			await updateTran(responseData.razorpay_payment_id,'captured',responseData.razorpay_order_id)


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


					//console.log(fileArr[0]);
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


					//console.log(BM_FileUrl);
					fs.copyFile(pathToFile, pathToNewDestination, async function(err) 
					{
						//console.log("inside copyFile");
						if (err) 
						{
							res.json({status:0,err:"err"});
						} 
						else 
						{							

							//console.log("Successfully copied and moved the file!") //1,2,3

								// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
								// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
								// BM_Email=await removeSpecialChar_email(BM_Email)


							

								//BM_Instruction=connection.escape(BM_Instruction);
								//BM_Name=connection.escape(BM_Name);
								BM_Email=await removeSpecialChar_email(BM_Email)


							var Status='P';
							if(DA_DA_ID == 2 || DA_DA_ID == 3 )
								Status='C';						
							const values = [
								[DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt_calculated,BM_Instruction,BM_FileUrl,Consent,paymentId,Status,LM_ID,fee,tax,Actual_Price]			
							];
							const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,Payment_ID,Status,LM_ID,Fee,Tax,Actual_Price) VALUES ?; UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;	  	  
							
							const query = connection.query(sql, [values], async function(err, result) {
								if (err) 
								{
									//console.log(err);
									res.json({status:0,msg:"err"});
								}
								else
								{
									
									let made_sale="You made a sale";
                                    let price=BM_Purchase_Amt;
									let lastText=DA_Title;
									var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto; color:#333;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0; color:#000;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";

									var datetime = new Date();
									//console.log(datetime.toISOString().slice(0,10));
									var purchased_date=datetime.toISOString().slice(0,10);
									var text="Product Link : "+premium_url+BM_Url_ID;								
									var html="";var from='Expy Team <info@expy.bio>';
									// for followers
									if(DA_DA_ID == 2) // unlock content
									{
										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>Download content</b></a><p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p> <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										from='Expy Team <info@expy.bio>';
									}
									else if(DA_DA_ID == 3) // digital goods content
									{
										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>Download content</b></a> <p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										from='Expy Team <info@expy.bio>';
									}
									else //any request
										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. </p>                 <p> To ensure a smooth experience for both the creators and requesters on Expy, the creator will need to accept your request before fulfilling the request. </p>                    <p>If the creator chooses to decline it, you will receive a full refund of your amount within 48 hours from the decline date.</p>                 <p>We will notify you as soon as the creator accepts or declines the request.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
								

									var mailOptions = {
                                        from: from,
                                        to: BM_Email,
                                        subject: "Transaction Success on Expy!",
                                        text: "Thanks for Buying product",
                                       //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									     html: html
                                    }
									var mailOptionsAdmin = {
                                        from: "Expy Admin <admin@expy.bio>",
                                        to: BM_Email,
                                        subject: "Transaction Success on Expy!",
                                        text: "Thanks for Buying product",
                                       //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									     html: html
                                    }
									// for creators
									var NewreqEmail='',NewunlockEmail='',NewSelleingEmail='';
									var mailOptions2={};		var mailOptionsAdminFollower={};
									var msg="";
									if(DA_DA_ID == 1)
									{

										NewreqEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! You have received a new Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>To ensure your followers have a smooth time purchasing from you, you have 7 days to decline or accept, and 14 days to complete from the date of request. Beyond this, the request will be automatically declined. </p><p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify'>click here.</a></p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
										mailOptions2 = {
											from: "Expy Team <info@expy.bio>",
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
										NewunlockEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your content has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
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
										NewSelleingEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your digital good has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details:  </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	//<a href='"+downLoadContent+"'><b>View Content</b></a>
										mailOptions2 = {
											from: "Expy Team <info@expy.bio>",
											to: JM_Email,
											subject: "Someone has purchased your digital good on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewSelleingEmail
										}

										mailOptionsAdminFollower = {
											from: "Expy Admin <admin@expy.bio>",
											to: JM_Email,
											subject: "Someone has purchased your digital good on Expy! ",
											text: "Thanks for Buying product",										  
											html: NewSelleingEmail
										}
										msg="Congrats "+JM_Name+" You have made a new sale of your Premium Content on your Expy page. To view details visit: expy.bio/notify";
									}
							
								
									//var emailAdmin=await wrapedSendMail(mailOptionsAdmin);
									var resp2=await wrapedSendMailInfo(mailOptions);
							



									
									var dbData={
										url:downLoadContent,
										arr:req.body,
										DA_DA_ID:DA_DA_ID,
										result:result,
										JM_Phone:JM_Phone						                              
									  }

									const flag=await jsonEncrypt(dbData);						
					
		


										if(resp2)
										{
											if(JM_Email_Pref=='Y' && JM_SMS_Pref=='Y')
											{
												
												 // var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
													var resp=await wrapedSendMailInfo(mailOptions2);
													var isSentSMS=await sendSMS(JM_Phone,msg);
													//console.log(isSentSMS);	
													if(isSentSMS)
													{
														res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
													}
													else
													{
														res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
													}
													
											}
											else if(JM_Email_Pref=='Y' && JM_SMS_Pref=='N')
											{
												
												//var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
												var resp=await wrapedSendMailInfo(mailOptions2);
												if(resp)
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}
												else
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}

											}	
											else if(JM_Email_Pref=='N' && JM_SMS_Pref=='Y')
											{
												var isSentSMS=await sendSMS(JM_Phone,msg);
												if(isSentSMS)
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}
												else
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}
											}
										}
										else
										{
											res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
										}
							

									
								}	
							});

						}

					});
					
				}
				// if purchased for multiple files
				if(fileArr!=null && fileArr.length > 0 && fileArr.length > 1)
				{
					//console.log("multiple file code")
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
// 							res.json({status:0,err:"err"});
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
// 									res.json({status:0,msg:"err"});
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
// 										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>Download content</b></a> <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
// 									}
// 									else //any request
// 										html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. </p>                 <p> To ensure a smooth experience for both the creators and requesters on Expy, the creator will need to accept your request before fulfilling the request. </p>                    <p>If the creator chooses to decline it, you will receive a full refund of your amount within 48 hours from the decline date.</p>                 <p>We will notify you as soon as the creator accepts or declines the request.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
								

// 									var mailOptions = {
//                                         from: "Expy Admin <admin@expy.bio>",
//                                         to: BM_Email,
//                                         subject: "Transaction Success on Expy!",
//                                         text: "Thanks for Buying product",
//                                        //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
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
  
		  //console.log("DA_ID ->  "+ DA_ID)
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
			  //console.log('no payment id');
			  res.json({status:0,msg:"no payment id"});
		  }
		  
		  
  
});



app.get('/admin/copyfile',function(req,res){


	  
	var fileName="198918f40ecc7cab0fc4231adaf67c96.mp4";	
	var name =path.parse(fileName).name;
	 const fs = require('fs');
	

	var ext = path.extname(fileName);
	//console.log(name);
	const pathToFile = path.join(__dirname, "uploads/Profile/bob_45/198918f40ecc7cab0fc4231adaf67c96.mp4");

	const pathToNewDestination = path.join(__dirname, "store", "customfile"+ext);
	
     

  fs_Extra.copy(pathToFile, pathToNewDestination, function (err) 
    {
      if (err) 
      {
     	 res.json({status:0,lastId:0,msg:"err"});
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
	//console.log(name);
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


	let code=req.body.code;
	connection.query('SELECT * FROM referal_code_master WHERE Code = ?',[code], function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:0,
			  msg:"err"
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
				res.json({status:0,msg:"err"});
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
app.post('/admin/letter', async function(req, res) 
{

		let news_email=req.body.news_email;
		if(typeof news_email =='undefined' || news_email.length==0 )
		{
			res.json({status:0,lastId:0,msg:"empty param"});
			return false;
		}	
			
			
		//news_email=connection.escape(news_email);
		let q="SELECT Email from news_letter where Email='"+news_email+"'";
		console.log(q);
		const dataQ=await model.sqlPromise(q);
		console.log(dataQ);
		if(dataQ!=null && dataQ.length > 0)
		{
			res.json({status:0,msg:"Use another email id"});
			return false;
		}
		const values=[
			[news_email]
		]
		const sql = "INSERT INTO  news_letter (Email) VALUES ?";
		const query = connection.query(sql, [values], function(err, result) 
		{
			if (err) 
			{
				console.log(err)
				res.json({status:0,msg:"err"});
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
app.post('/admin/join', async function(req, res) {

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;





	if(typeof req.body.JM_Name =='undefined' || req.body.JM_Name=="")
	{
		res.json({status:0,lastId:0,msg:"empty name"});
		return false;
	}
	if(typeof req.body.JM_Email =='undefined' || req.body.JM_Email=="")
	{
		res.json({status:0,lastId:0,msg:"empty Email"});
		return false;
	}

	if(validator.isEmail(req.body.JM_Email)==false)
	{
		res.json({status:-1,msg:"invalid Email"});
		return false;
	}

	if(typeof req.body.JM_User_Profile_Url =='undefined' ||  req.body.JM_User_Profile_Url=="")
	{
		res.json({status:0,lastId:0,msg:"empty Url"});
		return false;
	}
	
	if(typeof req.body.JM_Password =='undefined'  || req.body.JM_Password=="")
	{
		res.json({status:0,lastId:0,msg:"empty Password"});
		return false;
	}

	let JM_Email=req.body.JM_Email;


	const Q="SELECT * FROM joining_master WHERE JM_Email ='"+JM_Email+"'";
	const Qdata=await model.sqlPromise(Q);
	if(Qdata!=null && Qdata.length > 0)
	{
		res.json({status:0,flag:"flag",msg:"use another email id"});
		return false;
	}



	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	connection.query('SELECT * FROM joining_master WHERE JM_User_Profile_Url = ?',[JM_User_Profile_Url], async function (error, results, fields) {
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in query execution',
				flag:"flag"
			  })
		}
		else
		{
			if(results.length >0)
			{
				res.json({
					status:0,
					msg:'Url is Not available',
					flag:"flag"
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
                        let query = connection.query(sql, data,async (err, results) => 
                        {
                                        if(err) 
                                            res.json({status:0,lastId:0,msg:"unable to insert",err:"err"});
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

                                                fs_Extra.copy(sourceDir, ProfdirLinks, async function (err) 
												{
                                                  if (err) 
                                                  {
                                                 	 console.error(err);
													  res.json({status:0,flag:"flag"});
                                                  } 
                                                  else 
                                                  {      


													var dbData={
														status:1,													
														lastId:results.insertId                              
													  }
													const flag=await jsonEncrypt(dbData);
													res.json({
														status:1,
														flag:flag
													});

													
													//res.json({status:1,lastId:results.insertId,msg:"successfull"});
                                                                  
                                                  }

                                              });

                                        }
                        });

			}	
		}	
	});	



	

	   

		//model.InsertData(tableName,data);

});




app.post('/admin/ValidateURL', async function(req, res) {	

	
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;

	if(typeof JM_User_Profile_Url=='undefined' || JM_User_Profile_Url.length==0)
	{
		res.json({status:0,msg:"missing params"});
		return false;
	}


	JM_User_Profile_Url=await removeSpecialChar(JM_User_Profile_Url);
	JM_User_Profile_Url=JM_User_Profile_Url.replace(/\s/g, '')
	console.log(JM_User_Profile_Url)


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

app.post('/admin/ValidateEmail', async function(req, res) {
	
	var JM_Email=req.body.JM_Email;

	if(typeof JM_Email=='undefined' || JM_Email.length==0)
	{
		res.json({status:0,msg:"missing params"});
		return false;
	}
	if(validator.isEmail(JM_Email)==false)
	{
		res.json({
			status:-1,
			msg:'Invalid email'
			})
			return false;
	}

	connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[JM_Email], function (error, results, fields) {
		if (error) 
		{
			res.json({
				  status:-1,
			 	 msg:'Network error, try again later'
			  })
		}
		else
		{
			if(results.length > 0)
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

app.post('/admin/ValidateEmail_after_login', async function(req, res) {
	


	var JM_Email=req.body.JM_Email;
	var JM_ID=await check_IntegerValue(parseInt(req.body.JM_ID));

	if(typeof JM_Email=='undefined' || JM_Email.length==0 || JM_ID==0)
	{
		res.json({status:0,msg:"missing params"});
		return false;
	}
	if(validator.isEmail(JM_Email)==false)
	{
		res.json({
			status:-1,
			msg:'Invalid email'
			})
			return false;
	}
	var JM_Google_ID=req.body.JM_Google_ID;
	if(typeof JM_Google_ID=='undefined' || JM_Google_ID.length==0)
	{
		res.json({status:0,msg:"missing params"});
		return false;
	}




		connection.query('SELECT * FROM joining_master WHERE JM_Email = ? and JM_ID != ?' ,[JM_Email,JM_ID], async function (error, results, fields) {
		if (error) 
		{
			res.json({
				  status:-1,
			 	 msg:'Network error, try again later'
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


				let sql="UPDATE joining_master set JM_Email='"+JM_Email+"', JM_Google_ID='"+JM_Google_ID+"'  where JM_ID="+JM_ID;
				const dataUpdate=await model.sqlPromise(sql);
				if(dataUpdate.affectedRows==1)
				{
					res.json({
						status:1,
						msg:'Email is updated successfully.'
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
		}	
	});	
		
});


app.post('/admin/update_url',async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


	var JM_ID= req.body.JM_ID;
	JM_ID = await check_IntegerValue(parseInt(JM_ID));	 
	if(JM_ID==0)
	{
		res.json({status:0,msg:"invalid params 1"});
		return false;
	}


	var JM_Insta_Url=req.body.JM_Insta_Url;
	var JM_Utube_Url=req.body.JM_Utube_Url;
	var JM_Twiter_Url=req.body.JM_Twiter_Url;
	var JM_User_Profile_Url_plus_JM_ID=req.body.JM_User_Profile_Url_plus_JM_ID;


	if(typeof JM_Insta_Url=='undefined' 
	|| typeof JM_Utube_Url=='undefined'
	|| typeof JM_Twiter_Url=='undefined'
	|| typeof JM_User_Profile_Url_plus_JM_ID=='undefined'
	)
	{
		res.json({status:0,msg:"invalid params"});
		return false;
	}

	

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
			  res.json({status:0,msg:"err"});
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
			  res.json({status:0,msg:"err"});
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
			  res.json({status:0,msg:"err"});
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
			  res.json({status:0,msg:"err"});
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
			  res.json({status:0,msg:"err"});
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
			  res.json({status:0,msg:"err"});
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
		res.json({status:1,msg:'Done'});
	}
	
});

app.post('/admin/profileImage',async function(req,res)
{

	let sampleFile;
	let uploadPath;
  
	if (!req.files || Object.keys(req.files).length === 0) 
	{
	 
	  res.json({status:0,msg:"Select png or jpg or jpeg file"});
	  return false;
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	sampleFile = req.files.sampleFile;
	var fileName=sampleFile.name;

	if(typeof sampleFile=='undefined' || sampleFile==null)
	{
		res.json({status:0,msg:"Invalid param"});
		return false;
	}


	const extensionName = path.extname(sampleFile.name); // fetch the file extension
	const allowedExtension = ['.png','.jpg','.jpeg'];
	console.log(extensionName);
	if(!allowedExtension.includes(extensionName))
	{
		res.json({status:0,msg:"File type must be png or jpg or jpeg"});
		return false;
	}



	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	console.log("flag")
	console.log(req.body.flag)

	let jsonData=await decryptJsonData(req.body.flag)

	console.log(jsonData)
	console.log("jsonData")

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	console.log("req body")
	console.log("req.body")



	if(typeof req.body.JM_ID=='undefined' || req.body.JM_ID==null)
	{
		res.json({status:0,msg:"missing params id"});
		return false;
	}


	var JM_ID=req.body.JM_ID;	
	var ProfileName=req.body.JM_User_Profile_Url;
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
					
					var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+";Select * from direct_access_master_user where JM_ID="+JM_ID+"";
					connection.query(sql1, async function (error, results, fields) 
					{
						var user;
						var directAccess,linkMaster,productList;
						if (!error)
						{
									user=results[0];
									directAccess=results[1];
									linkMaster=results[2];
									productList=results[3];
									

									const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,TM_Border_Color,TM_Thumbnail_Icon_Color,TM_SocialWidget_Icon_Color) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,'','',''  FROM theme_master  WHERE theme_master.TM_ID=10";
						   			const query = connection.query(sql, async function(err2, result) {
										if (err2) 
										{
											console.log(err2);
											res.json({status:0,msg:"err2"});
										}
										else
										{
                                                let TMU_ID=result.insertId;
                                              	var text="Thank you for joinig Expy";


												//var ProfileName=results[0].JM_User_Profile_Url;
												var anotherLine='<p>To make the most out of your Expy page, just update your link-in-bio space on your social media pages with your Expy link:</p> <ol><li>Just visit your profile on Instagram or Twitter or any other social media platform.</li> <li>Click on "Edit Profile".</li> <li>Paste expy.bio/'+ProfileName+' in "Website".</li> 	</ol>';
												
												
												var newVisual='<img src="'+process.env.BASE_URL+'adm/uploads/welcome.jpg" width="100%"/>';

                                                var mailOptions = {
                                                        from: "Expy Team <info@expy.bio>",
                                                        to: req.body.JM_Email,
                                                        subject: "Welcome to Expy!",
                                                        text: "Thank you for joinig Expy",
                                                        html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newVisual+"<p>Hi "+req.body.JM_Name+", Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p> "+ anotherLine +"<p> If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
													}
													var resp=await wrapedSendMailInfo(mailOptions);

											

														var dbData={
															status:1,msg:'uploaded',
															JM_ID:JM_ID,
															userDetails:user,
															directAccess:directAccess,
															linkMaster:linkMaster,
															productList:productList,
															token:token			                               
														  }
														const flag=await jsonEncrypt(dbData);
														res.json({
															status:1,
															flag:flag
														});
										
										}	
									});


									
						}	
						else
						{

							res.json({
								status:0,
								flag:""
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
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	var ProfileName=req.body.JM_User_Profile_Url;
	const respond=await Creators_Specific_Details(JM_ID);
	if(respond.status==1)
	{
		ProfileName=respond.Creators[0].JM_User_Profile_Url;	
	}


	
	sampleFile = req.files.sampleFile;

	if(typeof sampleFile =='undefined' || sampleFile==null)
	{
		return res.status(400).send('No files were uploaded.');
		return false;
	}


	var fileName=sampleFile.name;
	uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"_"+JM_ID+"/"+fileName;
	
	db_fileName="Profile/" + ProfileName+"_"+JM_ID+"/"+fileName;

	// Use the mv() method to place the file somewhere on your server
	let result={};
	console.log(db_fileName);
	sampleFile.mv(uploadPath, async function(err) 
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
							
									var dbData={
										msg:'uploaded',
										JM_ID:JM_ID,
										userDetails:user,
										directAccess:directAccess,
										linkMaster:linkMaster,
										productList:productList									                              
									  }

									const flag=await jsonEncrypt(dbData);
									res.json({
										status:1,
										flag:flag
									});
					
		
							    // res.json({
								// 	status:1,msg:'uploaded',
								// 	JM_ID:JM_ID,
								// 	userDetails:user,
								// 	directAccess:directAccess,
								// 	linkMaster:linkMaster,
								// 	productList:productList						
								// });	

									
						}	
						else
						{

								
							res.json({
								status:1,
								flag:"flag"
							});
						}	
					});

				}
				
			});
		
	  }  
	
	});
	

});



app.post('/admin/noprofileImage',async function(req,res){


				if(typeof req.body.flag=='undefined' || req.body.flag==null)
				{
					res.json({status:0,msg:"Invalid key"});
					return false;
				}

				console.log("flag")
				console.log(req.body.flag)

				let jsonData=await decryptJsonData(req.body.flag)

				console.log(jsonData)
				console.log("jsonData")

				if(jsonData==false)
				{
					res.json({status:0,msg:"Invalid data"});
					return false;
				}
				req.body=jsonData;



				if(typeof req.body.JM_ID=='undefined' || req.body.JM_ID==null)
				{
					res.json({status:0,msg:"missing params id"});
					return false;
				}
			


					var JM_ID=req.body.JM_ID;
					//28-jul-2021
					const token=await addToken(JM_ID);
					//=========================== create token 


					var ProfileName='';
					const respond=await Creators_Specific_Details(JM_ID);
					console.log(respond)
					if(respond.status==1)
					{
						ProfileName=respond.Creators[0].JM_User_Profile_Url;	
					}


				
					var sql1="SELECT JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic FROM joining_master where JM_ID="+JM_ID+";Select * from direct_access_master;Select * from link_master where JM_ID="+JM_ID+";Select * from direct_access_master_user where JM_ID="+JM_ID+"";
					connection.query(sql1, async function (error, results, fields) 
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
								[1,JM_ID,"theme/profile_back_10.jpg", "default_theme_10"]							
							];
							const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,TM_Border_Color,TM_Thumbnail_Icon_Color,TM_SocialWidget_Icon_Color) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,'','',''  FROM theme_master  WHERE theme_master.TM_ID=10";
							const query = connection.query(sql, async function(err, result) {
								if (err) 
								{
									console.log(err);
									res.json({status:0,msg:"err"});
								}
								else
								{
                                         let TMU_ID=result.insertId;
							
                                          var text="Thank you for joinig Expy";
										  
										
								
										  var anotherLine='<p>To make the most out of your Expy page, just update your link-in-bio space on your social media pages with your Expy link:</p> <ol><li>Just visit your profile on Instagram or Twitter or any other social media platform.</li> <li>Click on "Edit Profile".</li> <li>Paste expy.bio/'+ProfileName+' in "Website".</li>	</ol>';
										
										
										
										  var newVisual='<img src="'+process.env.BASE_URL+'adm/uploads/welcome.jpg" width="100%"/>';
                                          var mailOptions = {
                                                  from: "Expy Team <info@expy.bio>",
                                                  to: req.body.JM_Email,
                                                  subject: "Welcome To Expy!",
                                                  text: "Thank you for joinig Expy",
                                                  html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newVisual+"<p> Hi "+req.body.JM_Name+", Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p>"+anotherLine+"     <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
                                              }
											  var resp=await wrapedSendMailInfo(mailOptions);
											 
												//   res.json({
												// 	  status:1,msg:'uploaded',
												// 	  JM_ID:JM_ID,
												// 	  userDetails:user,
												// 	  directAccess:directAccess,
												// 	  linkMaster:linkMaster,
												// 	  productList:productList,
												// 	  token:token								
												//   });	

													var dbData={
														status:1,msg:'uploaded',
														JM_ID:JM_ID,
														userDetails:user,
														directAccess:directAccess,
														linkMaster:linkMaster,
														productList:productList,
														token:token			                               
													}
													const flag=await jsonEncrypt(dbData);
													res.json({
														status:1,
														flag:flag
													});
											 
                                           

								}	
							});
	
						}	
						else
						{

								
							res.json({
								status:0,
								flag:""
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
					res.json({status:0,msg:"unable to add folder",err:"err"});
				
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
						res.json({status:0,msg:"unable to add folder",err:"err"});
					
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
app.post('/admin/InsertLink',async function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
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
					msg:"err",
					JM_ID:0					
				});	
			}
		});
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

	

});
app.post('/admin/UpdateEmbedContent',async function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= parseInt(req.headers['id']);
	var EC_ID=parseInt(req.body.EC_ID);

	JM_ID=await check_IntegerValue(JM_ID);
	EC_ID=await check_IntegerValue(EC_ID);


	if(EC_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}

	if(await isCreators_embed(JM_ID,EC_ID)==false)
	{
		res.json({status:0,msg:"not authorized to update"});
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
app.post('/admin/UpdateLink',async function(req,res){
	let sampleFile;
	let uploadPath;
	var db_fileName="";
	var JM_ID= parseInt(req.headers['id']);
	JM_ID= await check_IntegerValue(JM_ID)



	var LM_ID= parseInt(req.body.LM_ID);
	LM_ID= await check_IntegerValue(LM_ID)
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	if(await isCreators_link(JM_ID,LM_ID)==false)
	{
		res.json({status:0,msg:"not authorized to update"});
		return false;
	}

	var LM_Title=connection.escape(req.body.LM_Title);
	var LM_Url=connection.escape(req.body.LM_Url);
	  if (!req.files) 
	 {
		// File does not exist.
			console.log("No file");
		
		
		
			var LM_Image=req.body.LM_Image;
			var LM_Who_Will_See=req.body.LM_Who_Will_See;
			var LM_Icon=req.body.LM_Icon;		
			
		

			let sql = "UPDATE link_master SET  LM_Title="+LM_Title+",LM_Url="+LM_Url+",LM_Who_Will_See='"+LM_Who_Will_See+"',LM_Icon='"+LM_Icon+"',LM_Image='"+LM_Image+"' WHERE LM_ID="+LM_ID;
  			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
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

		// var LM_Url=req.body.LM_Url;		
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


					let sql = "UPDATE link_master SET  LM_Title="+LM_Title+",LM_Url="+LM_Url+",LM_Who_Will_See='"+LM_Who_Will_See+"',LM_Icon='', LM_Image='"+LM_Image+"' WHERE LM_ID="+LM_ID;
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
app.post('/admin/updateProfileSettings',async function(req,res){

	var JM_ID= parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	var JM_Name=req.body.JM_Name;
	var JM_Description=req.body.JM_Description;
	var JM_Social_Widget_Position=req.body.JM_Social_Widget_Position;
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	if(typeof JM_Name=='undefined' || JM_Name.length ==0)
	{
		res.json({status:0,msg:"error in name"});
		return false;
	}
	if(typeof JM_Description=='undefined' || JM_Description.length ==0)
	{
		res.json({status:0,msg:"error in description"});
		return false;
	}
	if(typeof JM_Social_Widget_Position=='undefined' )
	{
		res.json({status:0,msg:"empty widget position"});
		return false;
	}
	if( JM_Social_Widget_Position!="bottom"  && JM_Social_Widget_Position!="top")
	{
		res.json({status:0,msg:"error in widget position"});
		return false;
	}
		
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
app.post('/admin/updatePassword',async function(req,res){

	var JM_ID= parseInt(req.body.JM_ID);
	var Current_Password=req.body.Current_Password;
	var New_Password=req.body.New_Password;
	var Confirm_Password=req.body.Confirm_Password;
	JM_ID=await check_IntegerValue(JM_ID);
	if(JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
	JM_ID=await check_IntegerValue(JM_ID);
	if( typeof  New_Password=='undefined' ||   typeof  Confirm_Password=='undefined' || New_Password.length==0 || Confirm_Password.length ==0)
	{
		res.json({status:0,msg:"empty field"});
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
						  msg:"Current password does not match"
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
app.post('/admin/UpdatePayoutDetails',async function(req,res){



			var JM_ID= parseInt(req.body.JM_ID);
			JM_ID=await check_IntegerValue(JM_ID);
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

			if(typeof JM_Beneficiary_Name =='undefined' || JM_Beneficiary_Name.length ==0)
			{
				res.json({status:0,msg:"JM Beneficiary Name No is empty"});
				return false;
			}
			if(typeof JM_Phone_Bank =='undefined' || JM_Phone_Bank.length ==0)
			{
				res.json({status:0,msg:"Phone No is empty"});
				return false;
			}
			//A/C No must be within 18 digits
			if(typeof JM_Acc_No =='undefined' || JM_Acc_No.length ==0)
			{
				res.json({status:0,msg:"A/C No is empty"});
				return false;
			}
			if(JM_Acc_No.length > 18)
			{
				res.json({status:0,msg:"A/C No must be within 18 digits"});
				return false;
			}
			if(typeof JM_Acc_Code =='undefined' || JM_Acc_Code.length !=11)
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
app.post('/admin/updateActiveLink',async function(req,res){

	try {
		console.log("No file");
		var LM_ID=parseInt(req.body.LM_ID);
		LM_ID =await check_IntegerValue(LM_ID)
		var LM_Active=parseInt(req.body.LM_Active);
		LM_Active =await check_IntegerValue(LM_Active);
		if(LM_Active !=0 && LM_Active!=1)
		{
			res.json({status:0,msg:"wrong value"});
			return false;
		}
	
		var JM_ID=parseInt(req.headers['id']);
		JM_ID =await check_IntegerValue(JM_ID);
		if(await isCreators_link(JM_ID,LM_ID)==false)
		{
			res.json({status:0,msg:"not authorized"});
			return false;
		}
	
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
	} catch (error) {
		res.json({status:0,msg:"error"});
	}
	
})

//MS2 01-jun-2021
app.post('/admin/updateActiveNewsLetter',async (req,res)=>{

	
	var JM_NewsLetter_Active=req.body.JM_NewsLetter_Active;
	var JM_NewsLetter_Title=req.body.JM_NewsLetter_Title;
	var type=req.body.type;let sql ="";



	JM_NewsLetter_Title=connection.escape(JM_NewsLetter_Title);

	var JM_NewsLetter_Active=parseInt(req.body.JM_NewsLetter_Active);
	JM_NewsLetter_Active =await check_IntegerValue(JM_NewsLetter_Active);
	if(JM_NewsLetter_Active !=0 && JM_NewsLetter_Active!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}

	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID =await check_IntegerValue(JM_ID);


	if(type=='active')
		 sql = "UPDATE joining_master SET  JM_NewsLetter_Active="+JM_NewsLetter_Active+" WHERE JM_ID="+JM_ID;
	else
		 sql = "UPDATE joining_master SET  JM_NewsLetter_Title="+JM_NewsLetter_Title+" WHERE JM_ID="+JM_ID;
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
app.post('/admin/updateActiveVartualGift',async (req,res)=>
{

	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	var JM_Gift_Active=parseInt(req.body.JM_Gift_Active);
	JM_Gift_Active=await check_IntegerValue(JM_Gift_Active);

	var JM_Gift_Title=req.body.JM_Gift_Title;
	var type=req.body.type;let sql ="";

	if(typeof JM_Gift_Title=='undefined' || typeof type=='undefined')
	{
		res.json({status:0,msg:"undefined params"});
		return false;
	}

	if(JM_Gift_Active !=0 && JM_Gift_Active!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	

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
app.post('/admin/updateEmail',async (req,res)=>{

	var JM_Email=req.body.JM_Email;	
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	
	if(typeof JM_Email=='undefined' || JM_Email.length ==0)
	{
		res.json({status:0,msg:"empty email"});
		return false;
	}



	var password=req.body.JM_Password;
		console.log(password)
	if( typeof password=='undefined' ||  password.length==0)
	{
		res.json({
            status:0,
            msg:'invalid param'
            })
		return false;

	}

	const isValidPassword=await validPassword(password,JM_ID)
	console.log(isValidPassword)
	if(isValidPassword==false)
	{
		res.json({
            status:0,
            msg:'Wrong password'
            })
		return false;
	}






	if(req.body.JM_ID > 0 && req.body.JM_Email.length > 0)
	{
	
	
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
						msg:'Email is not available,use another email id'
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
							res.json({status:1,msg:"Email is updated"});
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

app.post('/admin/updateEmail_for_google',async (req,res)=>{

	var JM_Email=req.body.JM_Email;	
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	
	if(typeof JM_Email=='undefined' || JM_Email.length ==0)
	{
		res.json({status:0,msg:"empty email"});
		return false;
	}
	if(validator.isEmail(JM_Email)==false)
	{
		res.json({
           		 status:0,
            	msg:'Invalid email'
            })
      	return false;
	}

	if(JM_ID > 0 && JM_Email.length > 0)
	{
	
	
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
							msg:'Email is not available,use another email id'
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
							res.json({status:1,msg:"Email is updated"});
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
app.post('/admin/updateNofityPref',async (req,res)=>{

	try {
			var JM_ID=req.body.JM_ID;
			var id=req.body.id;	
			var checked=req.body.checked;	

			if(await check_IntegerValue(JM_ID)==0 || 
			await checkUndefined_String(id)==true ||
			await checkUndefined_String(checked)==true 
			)
			{
				res.json({status:0,msg:"missing param"});
				return false;
			}
			if(checked !='N' && checked!='Y')
			{
				res.json({status:0,msg:"wrong value"});
				return false;
			}
			
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
				res.json({status:0,msg:"empty params"});
		}
	} catch (error) 
	{
		res.json({status:0,msg:" wrong binding"});
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
		res.json({status:0,msg:"empty params"});
  }
})                    
               



app.post('/admin/updatePhone',async (req,res)=>{
	var JM_ID=parseInt(req.body.JM_ID);
	var JM_Phone=req.body.JM_Phone;	
	JM_ID=await check_IntegerValue(JM_ID);

	if(typeof JM_Phone=='undefined' || JM_Phone.length==0)
	{
		res.json({status:0,msg:"empty phone"});
		return false;
	}

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
app.post('/admin/updateActiveLinkSocial',async function(req,res){
	



	var SWM_ID=parseInt(req.body.SWM_ID);
	SWM_ID =await check_IntegerValue(SWM_ID)
	var SWM_Active=parseInt(req.body.SWM_Active);
	SWM_Active =await check_IntegerValue(SWM_Active);
	if(SWM_Active !=0 && SWM_Active!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}

	var JM_ID=parseInt(req.headers['id']);
	JM_ID =await check_IntegerValue(JM_ID);
	if(await isCreators_social(JM_ID,SWM_ID)==false)
	{
		res.json({status:0,msg:"not authorized"});
		return false;
	}





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
app.post('/admin/updateActiveCategory',async function(req,res){

	console.log("I am here")

	var CM_ID=parseInt(req.body.CM_ID);
	CM_ID =await check_IntegerValue(CM_ID)
	var CM_Active_Status=parseInt(req.body.CM_Active_Status);
	CM_Active_Status =await check_IntegerValue(CM_Active_Status);
	if(CM_Active_Status !=0 && CM_Active_Status!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}

	var JM_ID=parseInt(req.headers['id']);
	JM_ID =await check_IntegerValue(JM_ID);
	if(await isCreators_category(JM_ID,CM_ID)==false)
	{
		res.json({status:0,msg:"not authorized"});
		return false;
	}




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

app.post('/admin/updateActiveEmbed',async function(req,res){



	var EC_ID=parseInt(req.body.EC_ID);
	EC_ID =await check_IntegerValue(EC_ID)
	var LM_Active=parseInt(req.body.LM_Active);
	LM_Active =await check_IntegerValue(LM_Active);
	if(LM_Active !=0 && LM_Active!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}

	var JM_ID=parseInt(req.headers['id']);
	JM_ID =await check_IntegerValue(JM_ID);
	if(await isCreators_embed(JM_ID,EC_ID)==false)
	{
		res.json({status:0,msg:"not authorized"});
		return false;
	}





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
app.post('/admin/updateActivePremium',async function(req,res){

	var DA_ID=parseInt(req.body.DA_ID);
	DA_ID=await check_IntegerValue(DA_ID);

	var DA_Active=parseInt(req.body.DA_Active);
	DA_Active=await check_IntegerValue(DA_Active);

	var JM_ID=parseInt(req.headers['id']);
	JM_ID=await check_IntegerValue(JM_ID);

	if(await isCreators_product(JM_ID,DA_ID)==false)
	{
		res.json({status:0,msg:"not authorized"});
		return false;
	}
	if(DA_Active!=0 && DA_Active!=1)
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}

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



	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;




	var email=req.body.JM_Email	;
    var password=req.body.JM_Password;
	

	if(typeof email=='undefined' ||  typeof password=='undefined' || email.length ==0 || password.length==0)
	{
		res.json({
            status:0,
            msg:'invalid param'
            })
		return false;

	}
	var Keep=parseInt(req.body.Keep);
	Keep=await check_IntegerValue(Keep);
	if(typeof Keep=='undefined')
	{
		res.json({
            status:0,
            msg:'invalid param'
            })
		return false;

	}
	password=await decryptJsonData(password)
	console.log(password)

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

        if(results.length >0)
		{
			var JM_ID=results[0].JM_ID;
            bcrypt.compare(password, results[0].JM_Password, async function(err, ress) {
                if(!ress){
                    res.json({
                      status:0,                  
                      msg:"Email and password does not match"
                    });
                }
				else
				{                 

					//var token=await addToken(JM_ID);
					var token=await getToken(JM_ID);
					console.log(token)
					//14-sep-2021
					let Cql = "UPDATE token_master SET  Keep="+Keep+"  WHERE JM_ID="+JM_ID;
					const Cdata=await model.sqlPromise(Cql);

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


					
								var dbData={
									msg:'uploaded',
									JM_ID:JM_ID,
									userDetails:user,
									directAccess:directAccess,
									linkMaster:linkMaster,
									token:token	                                 
								  }
								const flag=await jsonEncrypt(dbData);
								res.json({
									status:1,
									flag:flag
								});
				

						}	
						else
						{
						
							res.json({
								status:0,
								msg:'failed',
								flag:"flag"
							});
						
						}	
					});

                    
                }
            });         
        }
        else
		{




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
			

			 var JM_ID=req.body.JM_ID;

			let IsTheme=await  isExistTheme(JM_ID);

			connection.query("call mixedDetails(?)", [JM_ID], async function (err, result) {
			if (err) 
			{
				res.json({
					status:0,
					flag:"err"
				});

			} else {


				var dbData={
					data:result[0],
					themeMasterUser:result[1],			
					userDetails:result[2],
					socialWidget:result[3],			
					gifts:result[4],
					category_master:result[5],                                     
				  }
				 // console.log(dbData)
				const flag=await jsonEncrypt(dbData);
				res.json({
					status:1,
					flag:flag
				});


				// console.log("results:", result);	
				// res.json({
				// 	status:1,
				// 	data:result[0],
				// 	themeMasterUser:result[1],			
				// 	userDetails:result[2],
				// 	socialWidget:result[3],			
				// 	gifts:result[4],
				// 	category_master:result[5],		
				// });
			}
		});
	
});


async function isExistTheme(JM_ID)
{
	try{
		if(parseInt(JM_ID) > 0)
		{
			let sql="SELECT * FROM theme_master_user where JM_ID="+JM_ID;
			let response=await model.sqlPromise(sql);
			if(response!=null && response.length==0)
			{
				//let q="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color  FROM theme_master  WHERE theme_master.TM_ID=10";
				const q="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,TM_Border_Color,TM_Thumbnail_Icon_Color,TM_SocialWidget_Icon_Color) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name,TM_Name_Color,TM_Footer_Color,'','',''  FROM theme_master  WHERE theme_master.TM_ID=10";
				let data=await model.sqlPromise(q);
				 
			}	
		}
	}
	catch(e)
	{
		return false
	}	 
}

//26-jun-2021
app.post('/admin/userDetailsAllSettings', async function(req, res) 
{
	var JM_ID=req.body.JM_ID;
	let sql="Select *  from notification_pref where JM_ID="+JM_ID;
	var settings=await model.sqlPromise(sql);
	console.log(settings)
	if(typeof settings !='undefined' && settings.length > 0)
	{
			connection.query("call mixedDetails(?)", [JM_ID], async function (err, result) {
			if (err) {
				res.json({
					status:0,
					flag:"err"
				});

			} else {
				// console.log("results:", result);	
				// res.json({
				// 	status:1,
				// 	data:result[0],
				// 	themeMasterUser:result[1],			
				// 	userDetails:result[2],
				// 	socialWidget:result[3],			
				// 	gifts:result[4],
				// 	category_master:result[5],	
				// 	notific_pref:settings
				// });

				var dbData={
					data:result[0],
					themeMasterUser:result[1],			
					userDetails:result[2],
					socialWidget:result[3],			
					gifts:result[4],
					category_master:result[5],	
					notific_pref:settings                                       
				  }
			  const flag=await jsonEncrypt(dbData);

			  res.json({
				  status:1,
				  flag:flag
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
			let query = connection.query(sql, data,async(err, Dataresults) => 
			{
					
					connection.query("call mixedDetails(?)", [JM_ID], async function (err, result) {
						if (err) 
						{
							res.json({
								status:0,
								flag:"err"
							});
				
						} 
						else 
						{
							// console.log("results:", result);	
							// res.json({
							// 	status:1,
							// 	data:result[0],
							// 	themeMasterUser:result[1],			
							// 	userDetails:result[2],
							// 	socialWidget:result[3],			
							// 	gifts:result[4],
							// 	category_master:result[5],	
							// 	notific_pref:settings
							// });
							var dbData={
								data:result[0],
								themeMasterUser:result[1],			
								userDetails:result[2],
								socialWidget:result[3],			
								gifts:result[4],
								category_master:result[5],	
								notific_pref:settings                                  
							  }
						  const flag=await jsonEncrypt(dbData);
			
						  res.json({
							  status:1,
							  flag:flag
						  });
						}
					});
			});
	}
});
                                           
                           

app.post('/admin/isExistUrl_Profile', async function(req, res) {

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	if(typeof JM_User_Profile_Url=='undefined' || JM_User_Profile_Url.length==0)
	{
		res.json({status:0,msg:"missing params"});
		return false;
	}


	JM_User_Profile_Url=await removeSpecialChar(JM_User_Profile_Url);
	JM_User_Profile_Url=JM_User_Profile_Url.replace(/\s/g, '')
	console.log(JM_User_Profile_Url)
	var myquery = "SELECT * FROM joining_master WHERE JM_User_Profile_Url = '" + JM_User_Profile_Url+"'  and  isDeleted=0 and isBlocked=0 and JM_User_Profile_Url!='' ";
	

	connection.query(myquery , async function (error, results, fields) {
	if (error)
	 {
		res.json({
		  status:0,
		  msg:"unable to excecute process",
		  error:"error"
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
					let query = connection.query(sql, data,async (err, Dataresults) => 
					{
							
							connection.query("call mixedDetails(?)", [JM_ID],async  function (err, result) {
								if (err) 
								{
									res.json({
										status:0,
										flag:"error"
									});
						
								} 
								else 
								{

									
									var dbData={
										data:result[0],
										themeMasterUser:result[1],			
										userDetails:result[2],
										socialWidget:result[3],			
										gifts:result[4],
										category_master:result[5]                                         
									  }
								 	 const flag=await jsonEncrypt(dbData);
									res.json({
										status:1,
										flag:flag
									});

									// console.log("results:", result);	
									// res.json({
									// 	status:1,
									// 	data:result[0],
									// 	themeMasterUser:result[1],			
									// 	userDetails:result[2],
									// 	socialWidget:result[3],			
									// 	gifts:result[4],
									// 	category_master:result[5],		
									// });
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
app.post("/admin/order", async (req, res) => {
	try {


		if(typeof req.body.flag=='undefined' || req.body.flag==null)
		{
			res.json({status:0,msg:"Invalid key"});
			return false;
		}
	

		let jsonData=await decryptJsonData(req.body.flag)
		//console.log(jsonData)
		if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
		req.body=jsonData;
		
		console.log("i am here order "+ req.body.amount)
		var receipt=cryptoRandomString({length: 10, type: 'alphanumeric'});
		var currency=req.body.currency;
		const options = {
			amount: req.body.amount, // amount == Rs 10
			currency: currency,//"INR",
			receipt: receipt,
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

			//==================================== 03-sep-2021 for track
				console.log(order)
			console.log(order.id)
			var Product_Id=req.body.Product_Id;
			var Order_Id=order.id;
			var Amount=parseFloat(order.amount / 100);
			var created_at = order.created_at
			var Status= order.status;
			var Name=req.body.Name;
			var Email=req.body.Email;
			const tranData = [
				[Name,Email,Product_Id,Order_Id,Amount,Status,created_at]
			];
			await addTrackRecord(tranData)

			//==================================== 03-sep-2021 for track


			var dbData={
				order:order                                  
			  }
			const flag=await jsonEncrypt(order);
		
			return res.status(200).json({status:1,flag:flag});
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

	
	var DA_ID=parseInt(req.body.DA_ID);
	var JM_ID=parseInt(req.headers['id']);
	DA_ID=await check_IntegerValue(DA_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	let q="SELECT *  from direct_access_master_user da inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and da.DA_ID="+DA_ID+" and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0;";
	
	const response=await model.sqlPromise(q);
	if(response!=null && response.length === 0)
	{
		res.json({status:0,msg:'not authorized to delete'});
		return false;
	}

	if(DA_ID > 0)
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

app.post('/admin/Get_Four_Users',async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

		
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


		var JM_ID=parseInt(req.body.JM_ID);
		var limit=req.body.limit;
			
					var sql1="SELECT JM_ID,JM_Name,JM_Email,IFNULL(Landing_Bio,'') JM_Description,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,JM_Verified,isForLandingPage,Landing_Image  FROM joining_master where isForLandingPage=1 order by JM_Name";
						connection.query(sql1, async function (error, result, fields) 
						{
							exploreData=result;
							if (!error)
							{
							
						
								var dbData={
									JM_ID:JM_ID,
									exploreData:exploreData	                          
								  }
								const flag=await jsonEncrypt(dbData);
								res.json({
									status:1,
									flag:flag
								});								
							}
							else{

								console.log(error)
								res.json({
									status:0,
									flag:'no data found',									
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
// 															res.json({status:0,msg:"err"});
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
// 																				res.json({status:0,msg:"mail not sent",url:'',arr:"err"});
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
// 						res.json({status:0,JM_ID:0,msg:"err"});
											
// 					}	
// 			});
// 	}
// 	else
// 		res.json({status:0,JM_ID:0,msg:"need email and name"});	
// });


//social sign up by google
app.post('/admin/socialLogin',async function(req,res){

	if(await valid_jsonFlag(req)==false)
	{
		res.json({
			status:0,msg:'invalid jsondata'
		})
		return false;
	}

	
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
									
											fs_Extra.copy(sourceDir, ProfdirLinks, async function (err) {
											if (err) 
											{
											console.error(err);
											} 
											else 
											{  
												let values = [
													[1,JM_ID,"theme/profile_back_1.jpg", "default_theme_1"]							
												];
												const sql="INSERT INTO theme_master_user (TM_ID,JM_ID,TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name) SELECT TM_ID,"+JM_ID+",TM_Back_Color,TM_Back_Image,TM_Item_Color,TM_Item_Style,TM_Highlight_Color,TM_Font,TM_Font_Color,TM_Bio_Color,TM_Active,TM_Class_Name FROM theme_master  WHERE theme_master.TM_ID=10";
												
													//const sal = "INSERT INTO link_master(JM_ID, LM_Title, LM_Url,LM_Image,LM_Who_Will_See) VALUES ?";	  
													const query = connection.query(sql, async function(err, result) {
														if (err) 
														{
															console.log(err);
															res.json({status:0,msg:"err"});
														}
														else
														{
															let TMU_ID=result.insertId;							
															var text="Thank you for joinig Expy";

															var ProfileName=JM_User_Profile_Url;
															var anotherLine='<p>To make the most out of your Expy page, just update your link-in-bio space on your social media pages with your Expy link:</p> <ol><li>Just visit your profile on Instagram or Twitter or any other social media platform.</li> <li>Click on "Edit Profile".</li> <li>Paste expy.bio/'+ProfileName+' in "Website".</li>	</ol>';
														
															var newVisual='<img src="'+process.env.BASE_URL+'adm/uploads/welcome.jpg" width="100%"/>';
														
														
															var mailOptions = {
																	from: "Expy Team <info@expy.bio>",
																	to: req.body.email,
																	subject: "Welcome to Expy!",
																	text: "Thank you for joinig Expy",
																	html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newVisual+"<p> Hi "+req.body.first_name+", Congratulations! Your Expy account is now active.</p>  <p>You can begin setting up your Expy Page by Logging in to your account. </p>            <p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p> "+ anotherLine +"    <p>If you wish to know more about how Expy works, please refer to this page. <a href='"+process.env.BASE_URL+"how-it-work'>"+process.env.BASE_URL+"how-it-work</a></p>   <p>You can also invite a creator to join expy; you can do that by using the invite code in your dashboard. </p>   <p><i>For any queries, you can write to us at support@expy.bio</i></p>    <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>" 
																}
																var resp=await wrapedSendMailInfo(mailOptions);
															 // transporter.sendMail(mailOptions, (error, info) => 
															  //{
																	if (resp==false) 
																		{
																				res.json({status:0,msg:"mail not sent",url:'',arr:"error"});
																		}																		
																		else
																		{
																			   //res.json({status:1, msg:"inserted"});	
																			   var dbData={
																				JM_ID:JM_ID,
																				msg:"inserted",
																				TMU_ID:TMU_ID,
																				JM_Email:JM_Email,
																				JM_User_Profile_Url:JM_User_Profile_Url,
																				token:token                             
																			  }
																			const flag=await jsonEncrypt(dbData);
																			res.json({
																				status:1,
																				flag:flag
																			});

																				//res.json({status:1,JM_ID:JM_ID,msg:"inserted",TMU_ID:TMU_ID,JM_Email:JM_Email,JM_User_Profile_Url:JM_User_Profile_Url,token:token});																			
																		}

															 // });							
														
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
						res.json({status:0,JM_ID:0,msg:"error"});											
					}	
			});
	}
	else
		res.json({status:0,JM_ID:0,msg:"need email and name"});	
});

app.post('/admin/socialSignIn',async (req,res)=>{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	
	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


	var email=req.body.JM_Email;
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


						// res.json({
						// 	status:1,msg:'success',
						// 	JM_ID:JM_ID,
						// 	userDetails:user,
						// 	directAccess:directAccess,
						// 	linkMaster:linkMaster,
						// 	token:token							
						// 	});	

							var dbData={
								status:1,msg:'success',
								JM_ID:JM_ID,
								userDetails:user,
								directAccess:directAccess,
								linkMaster:linkMaster,
								token:token		                             
							  }
							const flag=await jsonEncrypt(dbData);
							res.json({
								status:1,
								flag:flag
							});
					}	
					else
					{

						res.json({
							status:0,
							flag:"flag",
							msg:"Email does not exist, please sign up with gmail"
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
app.post('/admin/ValidateURL_Profile', async function(req, res) {
	

	var JM_ID=parseInt(req.body.JM_ID);
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	JM_ID=await check_IntegerValue(JM_ID);

	if(typeof JM_User_Profile_Url=='undefined' || JM_User_Profile_Url.length ==0)
	{
		res.json({
			status:1,
			msg:'empty param'
			})
		return false;
	}


	JM_User_Profile_Url=await removeSpecialChar(JM_User_Profile_Url);
	JM_User_Profile_Url=JM_User_Profile_Url.replace(/\s/g, '')
	console.log(JM_User_Profile_Url)

	var sql="SELECT * FROM joining_master WHERE JM_ID not in ("+JM_ID+") and JM_User_Profile_Url = '"+JM_User_Profile_Url+"'";
	connection.query(sql, function (error, results, fields) 
	{	
		if (error) 
		{
			res.json({
			  status:2,
			  msg:'error in  execution'
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
app.post('/admin/updateProfileUrl',async function(req,res){

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var JM_ID=req.body.JM_ID;
	var old_url=req.body.old_url;
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;
	


	if(JM_ID > 0 && old_url!=JM_User_Profile_Url)
    {


		var q="SELECT * FROM joining_master WHERE JM_ID not in ("+JM_ID+") and JM_User_Profile_Url = '"+JM_User_Profile_Url+"'";
		const data=await model.sqlPromise(q);
		if(data!=null && data.length > 0)
		{
			res.json({
				status:0,
				msg:'Url is Not available'
				})
			return false;
		}


                    var DA_Collection="[]";
                        const values = [
                            [JM_ID,JM_User_Profile_Url,old_url]
                        ];
                        const sal = "INSERT INTO request_for_url_change(JM_ID,New_Url,Old_Url) VALUES ?";

                        const query = connection.query(sal, [values], function(err, result) {
                        if(err) 
                        {
                            console.log(err);
                            res.json({status:0,msg:"err"});
                        }
                        else
                        {


                              	 let sql = "UPDATE joining_master SET  isRequestForChangeUrl=1 WHERE JM_ID="+JM_ID;
                             
                                  let query = connection.query(sql, (err, results) => {
                                  if (err) 
                                  {
                                      res.json({status:0,msg:"err"});
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
app.post('/admin/deleteLink',async (req, res) => {

		var LM_ID=parseInt(req.body.LM_ID);
		LM_ID=await check_IntegerValue(LM_ID);

		var JM_ID=parseInt(req.headers['id']);
		JM_ID=await check_IntegerValue(JM_ID);
		
		if(await isCreators_link(JM_ID,LM_ID)==false)
		{
			res.json({status:0,msg:'not authorized to delete'});
			return false;
		}


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
			res.json({status:0,msg:'empty id'});
		}		 
  });


//deleteLinkSocial
app.post('/admin/deleteLinkSocial',async (req, res) => {


	var JM_ID=await check_IntegerValue(parseInt(req.headers['id']));
	var SWM_ID=await check_IntegerValue(parseInt(req.body.SWM_ID));
	
	if(await isCreators_social(JM_ID,SWM_ID)==false)
	{
		res.json({status:0,msg:'not authorized to delete'});
		return false
	}

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
  app.post('/admin/deleteCategory',async (req, res) => {


	var CM_ID=await check_IntegerValue(parseInt(req.body.CM_ID));
	var JM_ID=await check_IntegerValue(parseInt(req.body.JM_ID));

	if(await isCreators_category(JM_ID,CM_ID)==false)
	{
			res.json({status:0,msg:'not authorized to delete'});
			return false;
	}


	if(req.body.CM_ID > 0 && req.body.JM_ID > 0)
	{


			let sql = "Select * FROM link_master WHERE JM_ID="+req.body.JM_ID+" and LM_Folder_ID="+req.body.CM_ID;
			connection.query(sql, function (err, reslt) {
			if (err) 
				res.json({status:0,msg:"err",CM_ID:0});
			else
			{
				if(reslt.length > 0)
				{
						let sql = "UPDATE link_master SET  LM_Folder_ID=0 WHERE JM_ID="+req.body.JM_ID+" and LM_Folder_ID="+req.body.CM_ID;	
						let query = connection.query(sql, (err, results) => {
						if (err) 
						{
							res.json({status:0,msg:"err"});
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
								if (err) res.json({status:0,msg:"err",CM_ID:0});
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
  app.post('/admin/deleteEmbed',async (req, res) => {

	var JM_ID=await check_IntegerValue(parseInt(req.headers['id']));
	var EC_ID=await check_IntegerValue(parseInt(req.body.EC_ID));
	
	if(await isCreators_embed(JM_ID,EC_ID)==false)
	{
		res.json({status:0,msg:'not authorized to delete'});
		return false
	}

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
app.post('/admin/userAppear',async function(req,res)
{

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var JM_ID=req.body.JM_ID;
		console.log(JM_ID);
		var sql="SELECT * FROM theme_master; SELECT * from theme_master_user where JM_ID="+JM_ID+" order by TMU_ID desc Limit 1; SELECT * from link_master where JM_ID="+JM_ID+"; SELECT * from joining_master where JM_ID="+JM_ID;
		
		//console.log(sql);
		connection.query(sql, async function (error, results, fields) 
		{
			var user;
			var themeMaster,userThemeDetails,linkMaster,userDetails;
			if (!error)
			{
					themeMaster=themeMaster=results[0];
					userThemeDetails=results[1];	
					linkMaster=results[2];		
					userDetails=results[3];
					

				var dbData={
								JM_ID:JM_ID,
								themeMaster:themeMaster,
								userThemeDetails:userThemeDetails,
								linkMaster:linkMaster,
								userDetails:userDetails	                                   
				  }
				const flag=await jsonEncrypt(dbData);
				res.json({
					status:1,
					flag:flag
				});

			}	
			else
			{
				res.json({
					status:0,
					flag:"flag"
				});

			}	
	});
		

})
//UpdateDefaultTheme
app.post('/admin/updateDefaultTheme',async function(req,res)
{
	

	 if(
			typeof req.body.TM_ID =='undefined' 
			|| typeof req.body.JM_ID =='undefined' 
			|| typeof req.body.TM_Back_Image =='undefined' 
			|| typeof req.body.TM_Item_Color =='undefined' 
			|| typeof req.body.TM_Item_Style =='undefined' 
			|| typeof req.body.TM_Highlight_Color =='undefined' 
			|| typeof req.body.TM_Font =='undefined' 
			|| typeof req.body.TM_Font_Color =='undefined' 
			|| typeof req.body.TM_Bio_Color =='undefined' 
			|| typeof req.body.TM_Active =='undefined' 
			|| typeof req.body.TM_Class_Name =='undefined' 
			
		)
		{
			res.json({
				status:0,
			  msg:'missing param'
		  })
		}


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
	  var JM_ID=parseInt(req.body.JM_ID);
	  var TM_ID=parseInt(req.body.TM_ID);

	  JM_ID=await check_IntegerValue(JM_ID);
	  TM_ID=await check_IntegerValue(TM_ID);
	  if(JM_ID==0 || TM_ID==0)
	  {
		res.json({
			status:0,
		  msg:'missing param'
	 	 })
		  return false;
	  }


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
			 	let sql = "UPDATE theme_master_user SET  TM_ID="+req.body.TM_ID+",JM_ID="+req.body.JM_ID+",TM_Back_Color='' ,TM_Back_Image='"+req.body.TM_Back_Image+"',TM_Item_Color='' ,TM_Item_Style='' ,TM_Highlight_Color='' ,TM_Font='',TM_Font_Color='' ,TM_Bio_Color='' ,TM_Name_Color='' ,TM_Footer_Color='' ,TM_Border_Color='',TM_Item_Effect='',TM_Thumbnail_Icon_Color='',TM_SocialWidget_Icon_Color='',TM_Active='"+req.body.TM_Active+"' ,TM_Class_Name='"+req.body.TM_Class_Name+"',TM_Name_Size='22px',TM_Bio_Size='18px' WHERE JM_ID="+JM_ID;
	
	
	
				//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
				let query = connection.query(sql, (err, resul) => {
					if (err) 
					{
						res.json({status:0,msg:"err"});
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
							res.json({status:0,msg:"err"});
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
													res.json({status:0,msg:"err"});
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
									res.json({status:0,msg:"err"});
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
			msg:"err"
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
                                                                 if(err) res.json({status:0,msg:"err"}); 												
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
                                  msg:"err",
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


app.post('/admin/forgotPassword',limiterForgotPassword,async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	console.log("hey")
	
	req.body=jsonData;
	var email=req.body.JM_Email;
	console.log(email)		
	if(validator.isEmail(email)==false)
	{
		res.json({
            status:0,
            msg:'Invalid email'
            })
      return false;
	}
	var randomPassword = model.RandomAlpha();
    const hashPassword = bcrypt.hashSync(randomPassword, saltRounds);


    connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[email], function (error, results, fields) {
      if (error) 
	  {
          res.json({
            status:0,
            msg:'Network error'
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
								subject: "Expy - Reset your password",
								text: "This is your new password "+randomPassword,
								html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p>We received a request to reset your Expy.bio password.</p><p>You can Enter the following auto-generated password to login: <b> "+randomPassword+"</b></p><p>If you wish to reset your password, you can login to your expy account and reset it from the <b>settings</b> page in your Menu.</p><p> <a href='"+process.env.BASE_URL+"signin'>Click here to login</a></p><p><i>If this reset request was not made by you, please let us know by emailing the same to info@expy.bio</i> .</p><span><b>Regards,</b></span><br/><span><b>Team Expy</b></span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>"
							}


							transporter.sendMail(mailOptions, (error, info) => 
							{
                             	 if (error) 
								  {
                                          res.json({status:0,msg:"Email server error",url:'',arr:""});
                                  }
                                    
								else
								{
									
									let sql = "UPDATE joining_master SET  JM_Password='"+hashPassword+"' WHERE JM_ID="+JM_ID;	
							
									let query = connection.query(sql, (err, result) =>
									 {
										if (err) 
										{
											res.json({status:0,msg:"err"});
										}
										else
										{
										
									 		res.json({status:1,msg:"sent",url:'',arr:"req.body"});
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
					body:""
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

app.post('/admin/updateOrderBySocialWidget',async function(req,res){

	//console.log(req.body.socialWidget)

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}



	let jsonData=await decryptJsonData(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}

	let sql="";
	if(typeof  jsonData.socialWidget!='undefined' &&   jsonData.socialWidget!=null && jsonData.socialWidget.length > 0)
	{
		let len=jsonData.socialWidget.length ;
		var SocialWidget=jsonData.socialWidget;

		for(let i=0;i<len;i++)
		{
			sql+= "UPDATE social_widget_master SET  SWM_OrderBy="+i+" WHERE JM_ID="+SocialWidget[i].JM_ID+" and SWM_ID="+SocialWidget[i].SWM_ID+";";	
			
		}
		
			let query = connection.query(sql, (err, result) =>
			{
				if (err) 
				{
					res.json({status:0,msg:"err"});
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
		res.json({status:0,msg:"Unable to update"});
	}
	// function callback () {
	// 	res.json({status:1,msg:"Profile is Updated"});
	// };

})

app.post('/admin/updateOrderByCustomLink',async function(req,res){

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	let sql="";
	if(typeof req.body.customLink!='undefined' && req.body.customLink!=null && req.body.customLink.length > 0)
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
					res.json({status:0,msg:"err"});
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
		res.json({status:0,msg:"Unable to update"});
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
					res.json({status:0,msg:"err"});
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
app.post('/admin/uploadBackgroundImage',async function(req,res){
	let sampleFile;
	let uploadPath;
	var TM_Back_Image="";
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	if(JM_ID==0)
	{
		res.json({
				status:0,
				msg:'invalid id'
			})
		return false;
	}
	console.log( req.body)
	if( typeof  req.body.TM_ID=='undefined' ||  typeof  req.body.TM_Active=='undefined' ||  typeof  req.files.sampleFile =='undefined')
	{
		res.json({
			status:0,
			msg:'invalid params'
		})
			return false;
	}
	if( isNaN(parseInt(req.body.TM_Active)) || parseInt(req.body.TM_Active) < 0   )
	{
		res.json({
			status:0,
			msg:'invalid params'
		})
			return false;
	}
	if( isNaN(parseInt(req.body.TM_ID)) || parseInt(req.body.TM_ID) < 0)
	{
		res.json({
			status:0,
			msg:'invalid params'
		})
			return false;
	}	

	if(req.files.sampleFile!=null)
	{
		var ProfileName="";

		let query="select CONCAT(JM_User_Profile_Url,'_',JM_ID) JM_User_Profile_Url_plus_JM_ID from joining_master where JM_ID="+JM_ID;
		const Qdata=await model.sqlPromise(query);
		if(Qdata!=null && Qdata.length==0)
		{
			res.json({
				status:0,
				msg:' profilename does not exist'
			})
			return false;			
		}
		else
		{
			ProfileName=Qdata[0].JM_User_Profile_Url_plus_JM_ID;
		}

		sampleFile = req.files.sampleFile;
		var fileName="bg_"+JM_ID+"_"+sampleFile.name;
		uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;		
		TM_Back_Image='Profile/' + ProfileName+"/"+fileName;
		let result={};
		sampleFile.mv(uploadPath, async function(err) 
		{
			if(err)
			{
				res.json({
					status:0,
					msg:"err"
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
				connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID],async function (error, results, fields) {
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
							let query = connection.query(sql,async (err, results) => {
								if (err) 
								{
									res.json({status:0,msg:"err"});
								}
								else
								{
										connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], async function (error, results, fields) {
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
													var dbData={
														userThemeDetails:results                                                                                     
													}
													const flag=await jsonEncrypt(dbData);
													res.json({
														status:1,
														flag:flag
													});
												
												}
											}
									});
								}	
							});
			
					}
					else // insert 
					{
						const sql = "INSERT INTO  theme_master_user(TM_ID, JM_ID,TM_Back_Image,TM_Active) VALUES ?";
				
						const query = connection.query(sql, [values], async function(err, result) {
						if (err) 
						{
							res.json({status:0,msg:"error in insert"});
						}
						else
						{
								let TMU_ID=result.insertId;
								connection.query('SELECT * FROM theme_master_user WHERE JM_ID = ?',[JM_ID], async function (error, results, fields) {
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
											
												var dbData={
													userThemeDetails:results                                                                                     
												}
												const flag=await jsonEncrypt(dbData);
												res.json({
													status:1,
													flag:flag
												});
											
												//res.json({status:1,msg:'Done',userThemeDetails:results});
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
app.post('/admin/moveLinkToFolder',async function(req,res){

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	
	let sql ="";
	if(req.body.type=='customLink')
	{
		 sql = "UPDATE link_master SET LM_Folder_ID='"+req.body.CM_ID+"'  WHERE LM_ID="+req.body.LM_ID+" and JM_ID="+req.body.JM_ID;
	}

		//let sql = "UPDATE joining_master SET  JM_Profile_Pic='"+db_fileName+"' WHERE JM_ID="+JM_ID;
	let query = connection.query(sql, (err, results) => {
		if (err) 
		{
			res.json({status:0,msg:"err"});
		}
		else
		{
						
			res.json({status:1,msg:'Done'});
		}	
	});
})
//4-mar-2021
app.post('/admin/UpdateCategory',async function(req,res){

	let sampleFile;
	let uploadPath;
	var TM_Back_Image="";
	var JM_ID=req.body.JM_ID;

	var ProfileName="";
	JM_ID=await check_IntegerValue(JM_ID);	
	CM_ID = await check_IntegerValue(parseInt(req.body.CM_ID));
	if(await isCreators_category(JM_ID,CM_ID)==false)
	{

		res.json({
			status:0,
			msg:' not authorized to update'
		})
		return false;	
	}
	let q="select CONCAT(JM_User_Profile_Url,'_',JM_ID) JM_User_Profile_Url_plus_JM_ID from joining_master where JM_ID="+JM_ID;
	const Qdata=await model.sqlPromise(q);
	if(Qdata!=null && Qdata.length==0)
	{
		res.json({
			status:0,
			msg:' profilename does not exist'
		})
		return false;			
	}
	else
	{
		ProfileName=Qdata[0].JM_User_Profile_Url_plus_JM_ID;
	}




	CM_Folder_Title=connection.escape(req.body.CM_Folder_Title);
	CM_Folder_Sub_Title=connection.escape(req.body.CM_Folder_Sub_Title);


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
				let sql = "UPDATE category_master SET CM_Folder_Title="+CM_Folder_Title+",CM_Folder_Sub_Title="+CM_Folder_Sub_Title+",CM_Folder_Back_Image='"+CM_Folder_Back_Image+"',CM_Icon=''  WHERE CM_ID="+req.body.CM_ID+" and JM_ID="+JM_ID;
				let query = connection.query(sql, (err, results) => {
					if (err) 
					{
						res.json({status:0,msg:"err"});
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
									
										res.json({status:1,msg:'Done'});
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


		let sql = "UPDATE category_master SET CM_Folder_Title="+CM_Folder_Title+",CM_Folder_Sub_Title="+CM_Folder_Sub_Title+",CM_Icon='"+CM_Icon+"'  WHERE CM_ID="+req.body.CM_ID+" and JM_ID="+JM_ID;
		let query = connection.query(sql, (err, results) => {
			if (err) 
			{
				res.json({status:0,msg:"err"});
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
							
								res.json({status:1,msg:'Done'});
							}
						}
				});
			}	
		});
	}
});

//05-mar-2021
app.post('/admin/updateCustomThemeOnclick',async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData

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
			  msg:'there are some error'
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
                            res.json({status:0,msg:"err"});
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

                                            res.json({status:1,msg:'Done'});										

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
									
									res.json({status:1,msg:'Done'});
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



app.post('/admin/removeBackgroundImage',async function(req,res){
	
	var JM_ID= parseInt(req.body.JM_ID);
	if(typeof JM_ID =='undefined' ||   JM_ID==0)
	{
		res.json({status:0,msg:"error in id"});
		return false;
	}
 


	 let sql = "UPDATE theme_master_user SET  TM_Back_Image='' WHERE JM_ID="+JM_ID;
	   let query = connection.query(sql, async (err, results) => 
	   {
		 if(err) 
		 {
			 console.log(err);
			 res.json({status:0,msg:"error"});
		 }
		 else
		 {

				let sql="SELECT * from theme_master_user where JM_ID="+JM_ID+" order by TMU_ID desc Limit 1;";
				const userThemeDetails=await model.sqlPromise(sql);
				var dbData={								
					userThemeDetails:userThemeDetails                             
				}
				const flag=await jsonEncrypt(dbData);
				res.json({
					status:1,
					flag:flag,
					msg:'Profile is Updated'
				});
					
		 }	
	 });

 
});





//====================================================== premium content


//03-apr-2021
//for leads

//31-may-2021
app.post('/admin/addLeads',async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}

	req.body=jsonData;



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

	// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
	// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
	// BM_Email=await removeSpecialChar_email(BM_Email)

	//BM_Name=connection.escape(BM_Name);	
	//BM_Instruction=connection.escape(BM_Instruction);
	BM_Email=await removeSpecialChar_email(BM_Email)

	const values = [
		[DA_ID,BM_Name, BM_Email,BM_Phone,BM_Purchase_Amt,BM_Instruction,Consent]			
	];
	const sql = "INSERT INTO  lead_master(DA_ID,BM_Name, BM_Email,BM_Phone,BM_Purchase_Amt,BM_Instruction,Consent) VALUES ?";	  
	const query = connection.query(sql, [values], async function(err, result)
	{
			if (err) 
			{
				console.log(err);
				res.json({status:0,msg:"err",flag:"flag"});
			}
			else
			{
				var dbData={								
					LM_ID:result.insertId                                
				}
				const flag=await jsonEncrypt(dbData);
				res.json({
					status:1,
					flag:flag
				});

				//res.json({status:1,msg:"done",LM_ID:result.insertId});
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
										html: "<h1>"+text+"</h1><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><a href='https://expy.in'><b>more info..</b></a>"
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
	var ip = req.headers['x-forwarded-for'].split(',')[0];
	console.log("ip")
	console.log(ip)
	if(Stat_Type=='E')
	{	
		tableName='embed_content';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID,
			IP:ip
		};
		
	}
	if(Stat_Type=='S')
	{	
		tableName='social_widget_master';
		data  = {
			Stat_Type: Stat_Type,
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID,
			IP:ip
		};
		
	}
	if(Stat_Type=='L')
	{	
		tableName='link_master';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID,
			IP:ip
		};
		
	}
	if(Stat_Type=='P')
	{	
		tableName='direct_access_master_user';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID,
			IP:ip
		};
		
	}
	if(Stat_Type=='C')
	{	
		tableName='category_master';
		data  = {
			Stat_Type: Stat_Type,		
			Stat_ID: Stat_ID,
			tableName:tableName,
            JM_ID:JM_ID,
			IP:ip
		};
		
	}

   let sql = "INSERT INTO stat_master SET ?";
   let query = connection.query(sql, data,(err, results) =>
   {
   			 if(err) res.json({status:0,msg:"err"});
   			 res.json({status:1,msg:'done'});
  });

});


//26-mar-2021
//statsDetails




// app.post('/admin/statsDetails', async function(req, res) {

// 	var JM_ID=parseInt(req.body.JM_ID);
// 	if(parseInt(req.body.JM_ID) > 0)
//     {
//  		let sql="";
// 		if(parseInt(req.body.param)==365)
// 		{
// 				// graphDetails
// 				sql="SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title  from (   SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName   union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	 ) Y	  left outer join(	 SELECT Stat_ID,SUM(Stat_Click) TotClicks,	 MONTH(Create_Date) Create_Month, MONTHNAME(Create_Date) MonthName, 	 JM_ID,	 CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  	 WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM  stat_master  where JM_ID="+req.body.JM_ID+" 	 GROUP By MONTH(Create_Date),JM_ID	 )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
//  				//unique clicks //clickDetails
// 				sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+req.body.JM_ID+" GROUP By Stat_ID   ) M where M.Title!='NA'; ";
// 				//total views //viewsDetails
// 				sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" GROUP by JM_ID;";
// 				 //views //graphViewDetails
// 				sql+=" SELECT  Y.MonthName Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews  from (    SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName      union  SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	    left outer join(	       SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,MONTH(Create_Date) Create_Month,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";

// 				//totalActivePeople
// 				sql+="  SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X ;";
// 				//InAppPurchase
// 				sql+="(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 365 DAY and  bm.Status not in('D')  GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -365 DAY)  GROUP BY DA_ID);";
// 				//transaction
// 				sql+=" SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title  from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	                 ) Y	   left outer join   (	                           Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Create_Month,m.MonthName, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        MONTH(bm.BM_Purchase_Date) Create_Month,MONTHNAME(bm.BM_Purchase_Date) as  MonthName, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+"                         group by MONTH(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Month    )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";

// 				//uniqueViews
// 				sql+="Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and YEAR(vm.Create_Date) GROUP BY DATE(vm.Create_Date),vm.IP ) A;";
// 				// monitization table
// 				sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue, A.Stat_Type from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 365 DAY  GROUP By Stat_ID   ) A left outer join    (   					(SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price, SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,  ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,      DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,     da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm     inner join direct_access_master_user da on da.DA_ID=bm.DA_ID     inner join joining_master jm on jm.JM_ID=da.JM_ID    where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 365 DAY   and bm.Status not in('D') and da.DA_DA_ID not in(6)    GROUP BY Stat_ID  )  UNION    (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price, SUM(IFNULL(bm.Actual_Price,0)) totalPurchases, ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,  DAYNAME(bm.Create_Date) Stat_day,    DATE(bm.Create_Date) as  Create_Date, jm.JM_ID, da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -365 DAY) 				   GROUP BY Stat_ID )) B on B.Stat_ID=A.Stat_ID;";

	
	
// 		}
// 	else if(parseInt(req.body.param)==30)
// 			{
// 		// graphDetails
// 		sql=" SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join ( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY 	GROUP By Date(Create_Date),JM_ID	)   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date; ";
// 		//unique clicks //clickDetails
// 		sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP By Stat_ID  ) M where M.Title!='NA';";
// 			//total views //viewsDetails
// 		sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP by JM_ID;"
// 		//views //graphViewDetails
// 		sql+="  SELECT Y.Create_Date Labels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date   from (  select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v   where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join (  SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 30 DAY GROUP BY DATE(Create_Date))   Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date;";
// 		//totalActivePeople
// 		sql+=" SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X;";
// 		//InAppPurchase
// 		sql+=" (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY and  bm.Status not in('D')  GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -30 DAY)  GROUP BY DA_ID);";
		
		
// 		//transaction
// 		sql+=" SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date  from ( select Create_Date  from   (  select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from ( select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,(select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,                          (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4 ) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()   ) Y  left outer join( Select  m.Stat_ID,SUM(m.TotTran) TotTran, m.Stat_day,m.Create_Date, m.JM_ID, m.Title from ( SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran, DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID, 'Transaction' Title FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY  group by DATE(bm.BM_Purchase_Date),bm.DA_ID ) as m  group by m.Create_Date ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";
// 				//uniqueViews
// 		sql+=" Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 30 DAY GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";

// 		// monitization table
// 		sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue, A.Stat_Type   from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 30 DAY  GROUP By Stat_ID   ) A left outer join   	( 	  (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,   ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,     	  DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  	  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 30 DAY  and bm.Status not in('D') and da.DA_DA_ID not in(6)   GROUP BY Stat_ID)  	  UNION  	   (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,   ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,     	  DAYNAME(bm.Create_Date) Stat_day,DATE(bm.Create_Date) as  Create_Date, jm.JM_ID,  	  da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"	  and DATE(bm.Create_Date) >= DATE(NOW()) - INTERVAL 30 DAY   GROUP BY Stat_ID)  ) B on B.Stat_ID=A.Stat_ID;";


// 		}
// 	else if(parseInt(req.body.param)==7)
// 			{
// 			// graphDetails
// 			sql="Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date  union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date   union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date        union      Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   union   Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date       union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date         union     Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y    left outer join( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where 	LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP By Date(Create_Date),JM_ID  )   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";
// 			//unique clicks //clickDetails
// 			sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)    WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY GROUP By Stat_ID ) M where M.Title!='NA'; "; 
// 				//total views //viewsDetails
// 			sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP by JM_ID;";
				
// 			//views //graphViewDetails
// 			sql+=" SELECT Y.Stat_day Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date  from (  Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day, (CURDATE() - INTERVAL 6 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date   union Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   						  union Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date     union      Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date  	     union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y left join (SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 7 DAY GROUP BY DATE(Create_Date)  ) Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date;";
		
// 			//totalActivePeople
// 			sql+=" SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; ";
			

// 			//InAppPurchase
// 			//sql+=" SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 6 DAY GROUP BY DA_ID;";
// 			//InAppPurchase
// 			sql+="(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -7 DAY) and  bm.Status not in('D') GROUP BY DA_ID)		UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -7 DAY)  GROUP BY DA_ID);";
		
// 			//transaction
// 			sql+=" Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date                    union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date                        union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date           ) Y  left outer join(                    Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Stat_day,m.Create_Date, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 7 DAY                        group by DATE(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Date          ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";	

// 			//uniqueViews
// 			sql+="Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 7 DAY    GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";

			
// 			///sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+"  and Create_Date >= DATE(NOW()) - INTERVAL 7 DAY  GROUP By Stat_ID   ) A left outer join    (   SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,    ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),0) as revenue,   DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+req.body.JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 7 DAY   GROUP BY Stat_ID  ) B on B.Stat_ID=A.Stat_ID;";
// 			// monitization table
// 			sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+"  and Create_Date >= DATE(NOW()) - INTERVAL 7 DAY  GROUP By Stat_ID   ) A left outer join   (     (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,    ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,   DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 7 DAY    and bm.Status not in('D') and da.DA_DA_ID not in(6)  GROUP BY Stat_ID)  UNION     (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,    ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,   DAYNAME(bm.Create_Date) Stat_day,DATE(bm.Create_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= DATE(NOW()) - INTERVAL 7 DAY   GROUP BY Stat_ID)) B on B.Stat_ID=A.Stat_ID;";
			
		
// 		}
//       else
//       {
//  		// graphDetails
// 		sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Z.Create_Date  from ( select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union  select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM   ) Y     left outer join(     SELECT Stat_ID,SUM(Stat_Click) TotClicks,JM_ID,HOUR(Create_Date) hours,Create_Date,    CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)      WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)     WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)      WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title     FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP By HOUR(Create_Date) ) Z on Z.hours=Y.hours   Order by Y.hours;";

			
// 		//unique clicks //clickDetails
//  		sql+="SELECT * from (      SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID, CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)   WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)      WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)       WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title      FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)     GROUP By Stat_ID ) M where M.Title!='NA'; ";

// 		//total views //viewsDetails
// 		sql+="SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)  GROUP by JM_ID;";


// 		//views //graphViewDetails
// 		sql+="SELECT Y.hours Lebels,Y.AM_PM,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews from    (             select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y    left join     (            SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,HOUR(Create_Date) hours,Create_Date             FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)            GROUP By HOUR(Create_Date)    ) Z on Z.hours=Y.hours     Order by Y.hours;";

// 		//totalActivePeople
// 		sql+="SELECT COUNT(X.cnt) totalPeopleVisited  from (       SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; ";




// 		//InAppPurchase
// 		sql+="(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR) and  bm.Status not in('D') GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR)  GROUP BY DA_ID) ;";

// 		//transaction
// 		sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title, Z.Create_Date   from (                   select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y                      left outer join(                          SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        HOUR(bm.BM_Purchase_Date) as  hours, jm.JM_ID, bm.BM_Purchase_Date as  Create_Date,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and bm.BM_Purchase_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR)                        GROUP BY HOUR(bm.BM_Purchase_Date)          )  Z on Z.hours=Y.hours                      Order by Y.hours;";
// 		//uniqueViews
// 		sql+="Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and vm.Create_Date >=  DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP BY DATE(vm.Create_Date),vm.IP ) A;";



// 		// monitization table
// 		//sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+req.body.JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP By Stat_ID   ) A left outer join    (         SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,            SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,            ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),0) as revenue,  DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                 da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm                  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID             inner join joining_master jm on jm.JM_ID=da.JM_ID               where jm.JM_ID="+req.body.JM_ID+"   and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR)          GROUP BY Stat_ID        ) B on B.Stat_ID=A.Stat_ID;";
// 		sql+="Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(B.DA_Price,0) DA_Price,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+" and Create_Date >= DATE_ADD(NOW(), INTERVAL -24 HOUR) GROUP By Stat_ID   ) A left outer join    (   (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,      ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,  DAYNAME(bm.BM_Purchase_Date) Stat_day, DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm    inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID    where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR)   and bm.Status not in('D') and da.DA_DA_ID not in(6)   GROUP BY Stat_ID )  UNION (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount, SUM(IFNULL(bm.Actual_Price,0)) totalPurchases, ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,  DAYNAME(bm.Create_Date) Stat_day,    DATE(bm.Create_Date) as  Create_Date, jm.JM_ID, da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -24 HOUR)   and bm.Status not in('D') and da.DA_DA_ID in(6)    GROUP BY Stat_ID )) B on B.Stat_ID=A.Stat_ID;";

//      	 }
//       connection.query(sql, async function (err, results, fields) 
//       {
		
// 			var clickDetails,viewsDetails,graphDetails,graphViewDetails,totalActivePeople,InAppPurchase,tranDetails,uniqueViews,monitization;
//             if(err) 	
// 				res.json({
// 					status:0,
// 					flag:"err"
// 				});
// 			else
// 			{					

// 								let currentBalance=0;
// 								let dataArr=await Get_Total_Bal(JM_ID);
// 								if(dataArr.length > 0)
// 								{
// 									console.log(dataArr[0])
// 									currentBalance=parseFloat(dataArr[0].currentBalance);
// 								}
// 								//const payoutBal=await getTotalPayout(JM_ID);
// 								graphDetails=results[0];
// 								clickDetails=results[1];
// 								viewsDetails=results[2];
//                                 graphViewDetails=results[3];
// 								totalActivePeople=results[4];
// 								InAppPurchase=results[5];
// 								tranDetails=results[6];
// 								uniqueViews=results[7];
// 								monitization=results[8];
// 								currentBalance=currentBalance;
						
// 								// res.json(
// 								// 			{
// 								// 				status:1,
// 								// 				msg:'success',
// 								//                 graphDetails:graphDetails,
// 								// 				clickDetails:clickDetails,
// 								// 				viewsDetails:viewsDetails,
// 								//                 graphViewDetails:graphViewDetails,
// 								// 				totalActivePeople:totalActivePeople,
// 								// 				InAppPurchase:InAppPurchase,
// 								// 				tranDetails:tranDetails,
// 								// 				uniqueViews:uniqueViews,
// 								// 				monitization:monitization,
// 								// 			}
// 								// 	);	
						
					

												
// 								var dbData={								
// 									graphDetails:graphDetails,
// 									clickDetails:clickDetails,
// 									viewsDetails:viewsDetails,
// 									graphViewDetails:graphViewDetails,
// 									totalActivePeople:totalActivePeople,
// 									InAppPurchase:InAppPurchase,
// 									tranDetails:tranDetails,
// 									uniqueViews:uniqueViews,
// 									monitization:monitization,
// 									currentBalance:currentBalance,  
									                                
// 								}
// 								const flag=await jsonEncrypt(dbData);
// 								res.json({
// 									status:1,
// 									flag:flag
// 								});

						

// 			}
           
//       });
//    }
	
// });


//29-jul-2021

//26-mar-2021

//statsDetails
app.post('/admin/statsDetails', async function(req, res) {

	var JM_ID=parseInt(req.body.JM_ID);
	var year=req.body.year;


	if(parseInt(req.body.JM_ID) > 0)
    {
 		let sql="";
		if(parseInt(req.body.param)==365)
		{
				// graphDetails
				sql="SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title  from (   SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName   union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	 ) Y	  left outer join(	 SELECT Stat_ID,SUM(Stat_Click) TotClicks,	 MONTH(Create_Date) Create_Month, MONTHNAME(Create_Date) MonthName, 	 JM_ID,	 CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  	 WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM  stat_master  where JM_ID="+req.body.JM_ID+"  and YEAR(Create_Date)="+year+"	 GROUP By MONTH(Create_Date),JM_ID	 )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
 				// clicks //clickDetails
				sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+JM_ID+"  and YEAR(Create_Date)="+year+" GROUP By Stat_ID   ) M where M.Title!='NA'; ";
			
			
				//total views //viewsDetails
				sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and YEAR(Create_Date)="+year+"   GROUP by JM_ID;";
				 //views //graphViewDetails
				sql+=" SELECT  Y.MonthName Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews  from (    SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName      union  SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	    left outer join(	       SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,MONTH(Create_Date) Create_Month,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+JM_ID+"  and YEAR(Create_Date)="+year+" GROUP by MONTH(Create_Date))   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";

				//totalActivePeople
				sql+="  SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X ;";
				//InAppPurchase
				sql+=" (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.BM_Purchase_Date)="+year+"  and  bm.Status not in('D')  GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.Create_Date) ="+year+"  GROUP BY DA_ID);";
				//transaction
				sql+=" SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title  from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName ) Y	  left outer join   (	  Select  m.Stat_ID,SUM(m.TotTran) TotTran,                 				m.Create_Month,m.JM_ID,    m.Title from (     (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID Stat_ID, MONTH(bm.BM_Purchase_Date) Create_Month,COUNT(*) TotTran,'Transaction' Title FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.BM_Purchase_Date)="+year+" and  bm.Status not in('D')  GROUP BY MONTH(bm.BM_Purchase_Date),da.DA_ID)     UNION    (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID Stat_ID, MONTH(bm.Create_Date) Create_Month, COUNT(*) TotTran,'Transaction' Title  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and YEAR(bm.Create_Date)="+year+"  group by MONTH(bm.Create_Date),bm.DA_ID )				) as m  group by m.Create_Month   )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";
				
				//uniqueViews
				sql+=" Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+JM_ID+"  and YEAR(vm.Create_Date)="+year+"  GROUP BY DATE(vm.Create_Date),vm.IP ) A;";
				
				// monitization table
				sql+=" Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(Z.DA_Price,0) DA_Price,IFNULL(Z.DA_Allow_Cust_Pay,0) DA_Allow_Cust_Pay,IFNULL(Z.DA_Min_Amount,0) DA_Min_Amount,IFNULL(B.revenue,0) revenue, A.Stat_Type from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+" and YEAR(Create_Date)="+year+"  GROUP By Stat_ID   ) A left outer join    (   					(SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,  ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,      DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,     da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm     inner join direct_access_master_user da on da.DA_ID=bm.DA_ID     inner join joining_master jm on jm.JM_ID=da.JM_ID    where jm.JM_ID="+JM_ID+"  and YEAR(bm.BM_Purchase_Date)="+year+"   and bm.Status not in('D') and da.DA_DA_ID not in(6)    GROUP BY Stat_ID  )  UNION    (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases, ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,  DAYNAME(bm.Create_Date) Stat_day,    DATE(bm.Create_Date) as  Create_Date, jm.JM_ID, da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and YEAR(bm.Create_Date)="+year+"   GROUP BY Stat_ID )) B on B.Stat_ID=A.Stat_ID left join (  select da2.DA_ID,da2.DA_Price,da2.DA_Allow_Cust_Pay,da2.DA_Min_Amount from direct_access_master_user da2 where da2.JM_ID="+JM_ID+") as Z on Z.DA_ID=A.Stat_ID;";
				//unique clicks
				sql+=" SELECT IFNULL(SUM(clickCount),0) uniqueClicks from (  select vm.IP,vm.Create_Date,SUM(vm.Stat_Click) clickCount from stat_master vm where vm.JM_ID="+JM_ID+" and YEAR(vm.Create_Date)="+year+" and vm.IP IS NOT NULL GROUP BY DATE(vm.Create_Date),vm.IP  ) X ;";

				
				
		}
		else if(parseInt(req.body.param)==30)
			{
		// graphDetails
		sql=" SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join ( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY 	GROUP By Date(Create_Date),JM_ID	)   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date; ";
		// clicks //clickDetails
		sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP By Stat_ID  ) M where M.Title!='NA';";
			//total views //viewsDetails
		sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 30 DAY GROUP by JM_ID;"
		
		//views //graphViewDetails
		sql+="  SELECT Y.Create_Date Labels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date   from (  select Create_Date  from  (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,	(select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,(select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v   where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()  ) Y left outer join (  SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 30 DAY GROUP BY DATE(Create_Date))   Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date;";
		
		//totalActivePeople
		sql+=" SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X;";
		//InAppPurchase
		sql+=" (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY and  bm.Status not in('D')  GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -30 DAY)  GROUP BY DA_ID);";
		
		
		//transaction
		sql+=" SELECT Y.Create_Date Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date  from ( select Create_Date  from   (  select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) Create_Date from ( select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,  (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,(select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,                          (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4 ) v where Create_Date between CURDATE() - INTERVAL 30 DAY  and  CURDATE()   ) Y  left outer join( Select  m.Stat_ID,SUM(m.TotTran) TotTran, m.Stat_day,m.Create_Date, m.JM_ID, m.Title from ( SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran, DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID, 'Transaction' Title FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 30 DAY  group by DATE(bm.BM_Purchase_Date),bm.DA_ID ) as m  group by m.Create_Date ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";
				//uniqueViews
		sql+=" Select COUNT(*) uniqueViews FROM(   select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 30 DAY GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";

		// monitization table
		sql+=" Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(Z.DA_Price,0) DA_Price,IFNULL(Z.DA_Allow_Cust_Pay,0) DA_Allow_Cust_Pay,IFNULL(Z.DA_Min_Amount,0) DA_Min_Amount,IFNULL(B.revenue,0) revenue, A.Stat_Type   from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+" and Create_Date >= DATE(NOW()) - INTERVAL 30 DAY  GROUP By Stat_ID   ) A left outer join   	( 	  (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,   SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,   ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,     	  DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  	  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 30 DAY  and bm.Status not in('D') and da.DA_DA_ID not in(6)   GROUP BY Stat_ID)  	  UNION  	   (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,   SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,   ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,     	  DAYNAME(bm.Create_Date) Stat_day,DATE(bm.Create_Date) as  Create_Date, jm.JM_ID,  	  da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= DATE(NOW()) - INTERVAL 30 DAY   GROUP BY Stat_ID)  ) B on B.Stat_ID=A.Stat_ID left join (  select da2.DA_ID,da2.DA_Price,da2.DA_Allow_Cust_Pay,da2.DA_Min_Amount from direct_access_master_user da2 where da2.JM_ID="+JM_ID+") as Z on Z.DA_ID=A.Stat_ID;";

		//unique clicks
		sql+=" SELECT IFNULL(SUM(clickCount),0) uniqueClicks from (  select vm.IP,vm.Create_Date,SUM(vm.Stat_Click) clickCount from stat_master vm where vm.JM_ID="+JM_ID+" and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 30 DAY and vm.IP IS NOT NULL GROUP BY DATE(vm.Create_Date),vm.IP  ) A";

		}
		else if(parseInt(req.body.param)==7)
			{
			// graphDetails
			sql=" Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date  union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date   union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date        union      Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   union   Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date       union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date         union     Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y    left outer join( SELECT Stat_ID,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Date(Create_Date) Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where 	LM_ID=Stat_ID)    WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title FROM    stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP By Date(Create_Date),JM_ID  )   Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";
			//unique clicks //clickDetails
			sql+=" SELECT * from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)    WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY GROUP By Stat_ID ) M where M.Title!='NA'; "; 
				//total views //viewsDetails
			sql+=" SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date>=DATE(NOW()) - INTERVAL 7 DAY  GROUP by JM_ID;";
				
			//views //graphViewDetails
			sql+=" SELECT Y.Stat_day Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews,Y.Create_Date  from (  Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day, (CURDATE() - INTERVAL 6 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date  union   Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date   union Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date   						  union Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date     union      Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date  	     union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date  ) Y left join (SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,DAYNAME(Create_Date) Stat_day,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >=CURDATE() - INTERVAL 7 DAY GROUP BY DATE(Create_Date)  ) Z on DATE(Z.Create_Date)=Y.Create_Date Order by Y.Create_Date;";
		
			//totalActivePeople
			sql+=" SELECT COUNT(X.cnt) totalPeopleVisited  from (  SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; ";

			//InAppPurchase
			//sql+=" SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 7 DAY GROUP BY DA_ID;";
			//InAppPurchase
			sql+=" (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -7 DAY) and  bm.Status not in('D') GROUP BY DA_ID)		UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= DATE_ADD(NOW(), INTERVAL -7 DAY)  GROUP BY DA_ID);";
		
			//transaction
			sql+=" Select Y.Stat_day Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title,Y.Create_Date   from (   Select DAYNAME(CURDATE() - INTERVAL 6 DAY) Stat_day,(CURDATE() - INTERVAL 6 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 5 DAY) Stat_day,(CURDATE() - INTERVAL 5 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 4 DAY) Stat_day,(CURDATE() - INTERVAL 4 DAY) Create_Date                 union    Select DAYNAME(CURDATE() - INTERVAL 3 DAY) Stat_day,(CURDATE() - INTERVAL 3 DAY) Create_Date                  union    Select DAYNAME(CURDATE() - INTERVAL 2 DAY) Stat_day,(CURDATE() - INTERVAL 2 DAY) Create_Date                    union    Select DAYNAME(CURDATE() - INTERVAL 1 DAY) Stat_day,(CURDATE() - INTERVAL 1 DAY) Create_Date                        union    Select DAYNAME(CURDATE()) Stat_day,CURDATE()  Create_Date           ) Y  left outer join(                    Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Stat_day,m.Create_Date, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and DATE(bm.BM_Purchase_Date) >= CURDATE() - INTERVAL 7 DAY                        group by DATE(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Date          ) Z on Z.Create_Date=Y.Create_Date Order by Y.Create_Date;";	

			//uniqueViews
			sql+=" Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 7 DAY    GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";
		
			// monitization table
			sql+=" Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(Z.DA_Price,0) DA_Price,IFNULL(Z.DA_Allow_Cust_Pay,0) DA_Allow_Cust_Pay,IFNULL(Z.DA_Min_Amount,0) DA_Min_Amount,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+"  and Create_Date >= DATE(NOW()) - INTERVAL 7 DAY  GROUP By Stat_ID   ) A left outer join   (     (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,   SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,    ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,   DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= DATE(NOW()) - INTERVAL 7 DAY    and bm.Status not in('D') and da.DA_DA_ID not in(6)  GROUP BY Stat_ID)  UNION     (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,   SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,    ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,   DAYNAME(bm.Create_Date) Stat_day,DATE(bm.Create_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID  where jm.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= DATE(NOW()) - INTERVAL 7 DAY   GROUP BY Stat_ID)) B on B.Stat_ID=A.Stat_ID  left join (  select da2.DA_ID,da2.DA_Price,da2.DA_Allow_Cust_Pay,da2.DA_Min_Amount from direct_access_master_user da2 where da2.JM_ID="+JM_ID+"    ) as Z on Z.DA_ID=A.Stat_ID;";
			
			//unique clicks
			sql+=" SELECT IFNULL(SUM(clickCount),0) uniqueClicks from (  select vm.IP,vm.Create_Date,SUM(vm.Stat_Click) clickCount from stat_master vm where vm.JM_ID="+JM_ID+" and DATE(vm.Create_Date) >= CURDATE() - INTERVAL 7 DAY and vm.IP IS NOT NULL GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";
		
		}
     	else
       {
				// graphDetails
				sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) TotClicks,IFNULL(Z.Title,'NA') Title,Z.Create_Date  from ( select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union  select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM   ) Y     left outer join(     SELECT Stat_ID,SUM(Stat_Click) TotClicks,JM_ID,HOUR(Create_Date) hours,Create_Date,    CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)      WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)     WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)      WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else '' end as Title     FROM stat_master  where JM_ID="+req.body.JM_ID+" and Create_Date >= CURDATE() GROUP By HOUR(Create_Date) ) Z on Z.hours=Y.hours   Order by Y.hours;";

					
				//unique clicks //clickDetails
				sql+="SELECT * from (      SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID, CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)   WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)      WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)       WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title      FROM    stat_master   where JM_ID="+req.body.JM_ID+" and Create_Date >= CURDATE()     GROUP By Stat_ID ) M where M.Title!='NA'; ";

				//total views //viewsDetails
				sql+="SELECT JM_ID,Count(*) totViews FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= CURDATE()  GROUP by JM_ID;";

				//views //graphViewDetails
				sql+="SELECT Y.hours Lebels,Y.AM_PM,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) TotalViews from    (             select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y    left join     (            SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,HOUR(Create_Date) hours,Create_Date             FROM view_master where JM_ID="+req.body.JM_ID+" and Create_Date >= CURDATE()           GROUP By HOUR(Create_Date)    ) Z on Z.hours=Y.hours     Order by Y.hours;";

				//totalActivePeople
				sql+="SELECT COUNT(X.cnt) totalPeopleVisited  from (       SELECT COUNT(*) cnt,JM_ID,JM_Profile_Url,JM_Views,IP FROM view_master where Create_Date >= DATE_SUB(NOW(),INTERVAL 30 minute) and JM_ID="+req.body.JM_ID+" group by JM_ID,IP  ) X; ";
				//InAppPurchase
				sql+="(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >=CURDATE() and  bm.Status not in('D') GROUP BY DA_ID) UNION (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.JM_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and DATE(bm.Create_Date) >= CURDATE() GROUP BY DA_ID) ;";

				//transaction
				sql+="Select Y.hours Lebels,Y.AM_PM, IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) TotTran,IFNULL(Z.Title,'NA') Title, Z.Create_Date   from (                   select 1 as hours,'AM' as AM_PM union select 2 as hours,'AM' as AM_PM  union  select 3 as hours,'AM' as AM_PM  union  select 4 as hours,'AM' as AM_PM  union  select 5 as hours,'AM' as AM_PM  union  select 6 as hours,'AM' as AM_PM  union          select 7 as hours,'AM' as AM_PM  union select 8 as hours,'AM' as AM_PM  union  select 9 as hours,'AM' as AM_PM  union  select 10 as hours,'AM' as AM_PM  union select 11 as hours,'AM' as AM_PM  union  select 12 as hours,'PM' as AM_PM         union select 13 as hours,'PM' as AM_PM  union  select 14 as hours,'PM' as AM_PM  union  select 15 as hours,'PM' as AM_PM  union  select 16 as hours,'PM' as AM_PM  union  select 17 as hours,'PM' as AM_PM  union  select 18 as hours,'PM' as AM_PM         union select 19 as hours,'PM' as AM_PM   union  select 20 as hours,'PM' as AM_PM  union  select 21 as hours,'PM' as AM_PM  union  select 22 as hours,'PM' as AM_PM  union  select 23 as hours,'PM' as AM_PM     ) Y                      left outer join(                          SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        HOUR(bm.BM_Purchase_Date) as  hours, jm.JM_ID, bm.BM_Purchase_Date as  Create_Date,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+req.body.JM_ID+" and bm.BM_Purchase_Date >= CURDATE()                      GROUP BY HOUR(bm.BM_Purchase_Date)          )  Z on Z.hours=Y.hours                      Order by Y.hours;";
				//uniqueViews
				sql+="Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm where vm.JM_ID="+req.body.JM_ID+"  and vm.Create_Date >= CURDATE() GROUP BY DATE(vm.Create_Date),vm.IP ) A;";

				// monitization table
				sql+=" Select A.Stat_ID,IFNULL(B.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(B.TotTran,0) TotTran,IFNULL(B.totalPurchases,0) totalPurchases,A.Create_Date,A.JM_ID,A.Title,IFNULL(A.TotClicks,0) TotClicks,IFNULL(Z.DA_Price,0) DA_Price,IFNULL(Z.DA_Allow_Cust_Pay,0) DA_Allow_Cust_Pay,IFNULL(Z.DA_Min_Amount,0) DA_Min_Amount,IFNULL(B.revenue,0) revenue,A.Stat_Type    from (  SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID,(CASE WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)       WHEN Stat_Type='S'   THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)    WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)     WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end) as Title FROM `stat_master` WHERE JM_ID="+JM_ID+"  and Create_Date >= CURDATE() GROUP By Stat_ID   ) A left outer join    (   (SELECT bm.DA_ID Stat_ID,bm.BM_Purchase_Amt,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,       SUM(IFNULL(bm.Actual_Price,0)) totalPurchases,      ROUND(SUM(IFNULL(bm.BM_Purchase_Amt,0)),2) as revenue,  DAYNAME(bm.BM_Purchase_Date) Stat_day, DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID,  da.DA_Title Title FROM buyers_master bm CROSS JOIN charges_master cm    inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID    where jm.JM_ID="+JM_ID+"  and DATE(bm.BM_Purchase_Date) >= CURDATE()  and bm.Status not in('D') and da.DA_DA_ID not in(6)   GROUP BY Stat_ID )  UNION (SELECT bm.DA_ID Stat_ID,bm.CM_Amount,COUNT(*) TotTran,da.DA_Price,da.DA_Allow_Cust_Pay,da.DA_Min_Amount,  SUM(IFNULL(bm.Actual_Price,0)) totalPurchases, ROUND(SUM(IFNULL(bm.CM_Amount,0)),2) as revenue,  DAYNAME(bm.Create_Date) Stat_day,    DATE(bm.Create_Date) as  Create_Date, jm.JM_ID, da.DA_Title Title FROM contest_master bm CROSS JOIN charges_master cm   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and DATE(bm.Create_Date) >= CURDATE()  and bm.Status not in('D') and da.DA_DA_ID in(6)    GROUP BY Stat_ID )) B on B.Stat_ID=A.Stat_ID left join (  select da2.DA_ID,da2.DA_Price,da2.DA_Allow_Cust_Pay,da2.DA_Min_Amount from direct_access_master_user da2 where da2.JM_ID="+JM_ID+"    ) as Z on Z.DA_ID=A.Stat_ID;";
				
				//unique clicks
				sql+=" SELECT IFNULL(SUM(clickCount),0) uniqueClicks from (  select vm.IP,vm.Create_Date,SUM(vm.Stat_Click) clickCount from stat_master vm where vm.JM_ID="+JM_ID+" and DATE(vm.Create_Date) >= CURDATE()  and vm.IP IS NOT NULL GROUP BY DATE(vm.Create_Date),vm.IP  ) A;";
				

     	}
      connection.query(sql, async function (err, results, fields) 
      {
		
			var clickDetails,viewsDetails,graphDetails,graphViewDetails,totalActivePeople,InAppPurchase,tranDetails,uniqueViews,monitization;
			var uniqueClicks;
            if(err) 	
				res.json({
					status:0,
					flag:"err"
				});
			else
			{					
					
					let currentBalance=0;
					let dataArr=await Get_Total_Bal(JM_ID);
					if(dataArr.length > 0)
					{
						console.log(dataArr[0])
						currentBalance=parseFloat(dataArr[0].currentBalance);
					}

					//const payoutBal=await getTotalPayout(JM_ID);
					graphDetails=results[0];
					clickDetails=results[1];
					viewsDetails=results[2];
					graphViewDetails=results[3];
					totalActivePeople=results[4];
					InAppPurchase=results[5];
					tranDetails=results[6];
					uniqueViews=results[7];
					monitization=results[8];
					uniqueClicks=results[9];
					currentBalance=currentBalance;

												
					var dbData={								
						graphDetails:graphDetails,
						clickDetails:clickDetails,
						viewsDetails:viewsDetails,
						graphViewDetails:graphViewDetails,
						totalActivePeople:totalActivePeople,
						InAppPurchase:InAppPurchase,
						tranDetails:tranDetails,
						uniqueViews:uniqueViews,
						monitization:monitization, 
						currentBalance:currentBalance,uniqueClicks:uniqueClicks
					}
					const flag=await jsonEncrypt(dbData);
					res.json({
						status:1,
						flag:flag
					});

						

			}
           
      });
   }
	
});


//20-sep-2021
//graphMonthy
app.post('/admin/graphMonthy', async function(req, res) {

	if(await valid_jsonFlag(req)==false)
	{
		res.json({
			status:0,msg:'invalid jsondata'
		})
		return false;
	}
	var JM_ID=parseInt(req.headers['id']);	
	if(await check_IntegerValue(JM_ID)==0)
	{
		res.json({
			status:0,msg:'missing params'
		})
		return false;
	}
	var id=req.body.id;
	if(typeof id=='undefined' || id.length ==0)
	{
		res.json({
			status:0,msg:'missing id'
		})
		return false;
	}
	var year=req.body.year;
	if(typeof year=='undefined' || year.length ==0)
	{
		res.json({
			status:0,msg:'missing year'
		})
		return false;
	}


	let sql="";
	//total views by monthy
	let CTR=[];
	if(id==1)
	{
		sql="SELECT  Y.MonthName Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) dataValue  from (    SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName      union  SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	    left outer join(				SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,MONTH(Create_Date) Create_Month,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+JM_ID+" and YEAR(Create_Date) ="+year+"  GROUP by MONTH(Create_Date) )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
	}		
	else if(id==2) //total clicks
	{
		sql=" SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) dataValue,IFNULL(Z.Title,'NA') Title  from (   SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName   union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	 ) Y	  left outer join(	 SELECT Stat_ID,SUM(Stat_Click) TotClicks,	 MONTH(Create_Date) Create_Month, MONTHNAME(Create_Date) MonthName, 	 JM_ID,	 CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  	 WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM  stat_master  where JM_ID="+JM_ID+" and YEAR(Create_Date) ="+year+"  GROUP By MONTH(Create_Date),JM_ID	 )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
	}		
	else if(id==3) //Click through rate
	{
		sql="SELECT  Y.MonthName Lebels,IFNULL(Z.VM_ID,0) VM_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotalViews,0) dataValue  from (    SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName      union  SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName    union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName     union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	    left outer join(				SELECT VM_ID,JM_ID,SUM(JM_Views) TotalViews,MONTH(Create_Date) Create_Month,DATE(Create_Date) Create_Date FROM view_master where JM_ID="+JM_ID+"  and YEAR(Create_Date) ="+year+" GROUP by MONTH(Create_Date))   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
		sql+=" SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotClicks,0) dataValue,IFNULL(Z.Title,'NA') Title  from (   SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName   union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName   union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	 ) Y	  left outer join(	 SELECT Stat_ID,SUM(Stat_Click) TotClicks,	 MONTH(Create_Date) Create_Month, MONTHNAME(Create_Date) MonthName, 	 JM_ID,	 CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)  	 WHEN Stat_Type='S'  THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)   WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID)  WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM  stat_master  where JM_ID="+JM_ID+" and YEAR(Create_Date) ="+year+"	 GROUP By MONTH(Create_Date),JM_ID	 )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
		CTR=await model.sqlPromise(sql);
		if(CTR!=null && CTR.length > 0)
		{
			var dbData={		
				totalViews:CTR[0],
				totalClicks:CTR[1],           
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag
			});

			return false;
		}
		else
		{
			res.json({
				status:0,
				flag:""
			});
			return false;
		}
	}
	else if(id==4) //Total transactions
	{
		//sql="SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) dataValue,IFNULL(Z.Title,'NA') Title  from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	                 ) Y	   left outer join   (	                           Select  m.Stat_ID,SUM(m.TotTran) TotTran,                        m.Create_Month,m.MonthName, m.JM_ID,                        m.Title from (                         SELECT bm.DA_ID Stat_ID,COUNT(*) TotTran,                        MONTH(bm.BM_Purchase_Date) Create_Month,MONTHNAME(bm.BM_Purchase_Date) as  MonthName, jm.JM_ID,                        'Transaction' Title FROM buyers_master bm                            inner join direct_access_master_user da on da.DA_ID=bm.DA_ID                         inner join joining_master jm on jm.JM_ID=da.JM_ID                         where jm.JM_ID="+JM_ID+"    and YEAR(bm.BM_Purchase_Date) ="+year+"                     group by MONTH(bm.BM_Purchase_Date),bm.DA_ID                     ) as m  group by m.Create_Month    )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";
		sql="SELECT  Y.MonthName Lebels,IFNULL(Z.Stat_ID,0) Stat_ID,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.TotTran,0) dataValue,IFNULL(Z.Title,'NA') Title  from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	   ) Y	   left outer join   (	    Select  m.Stat_ID,SUM(m.TotTran) TotTran,    m.Create_Month, m.JM_ID,    m.Title from (  (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID Stat_ID, MONTH(bm.BM_Purchase_Date) Create_Month,COUNT(*) TotTran,'Transaction' Title FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and YEAR(bm.BM_Purchase_Date)="+year+" and  bm.Status not in('D')  GROUP BY MONTH(bm.BM_Purchase_Date),da.DA_ID)  UNION    (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID Stat_ID, MONTH(bm.Create_Date) Create_Month, COUNT(*) TotTran,'Transaction' Title  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.Create_Date)="+year+" group by MONTH(bm.Create_Date),bm.DA_ID )      ) as m  group by m.Create_Month    )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";
	}
	else if(id==5) //Unique views
	{
		sql="SELECT  Y.MonthName Lebels,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.dataValue,0) dataValue from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	                 ) Y left outer join   (SELECT MONTH(P.Create_Date) Create_Month,P.JM_ID,COUNT(*) dataValue from   	(      select vm.IP,vm.Create_Date, vm.JM_ID,SUM(vm.JM_Views) dataValue from view_master vm where vm.JM_ID="+JM_ID+" and YEAR(vm.Create_Date) ="+year+"    GROUP BY MONTH(vm.Create_Date),vm.IP      ) P  GROUP BY MONTH(P.Create_Date))   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";
	}
	else if(id==6) //Unique clicks
	{
		sql=" SELECT  Y.MonthName Lebels,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.dataValue,0) dataValue from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	                 ) Y left outer join   (    SELECT P.JM_ID,IFNULL(SUM(P.clickCount),0) dataValue,P.Create_Month from (  			select vm.IP,vm.JM_ID,MONTH(vm.Create_Date) Create_Month,SUM(vm.Stat_Click) clickCount from stat_master vm where vm.JM_ID="+JM_ID+" and YEAR(vm.Create_Date) ="+year+"   and vm.IP IS NOT NULL GROUP BY MONTH(vm.Create_Date),vm.IP    ) P GROUP BY P.Create_Month )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month; ";

	}
	else if(id==7) //Total sales
	{
		sql=" SELECT  Y.MonthName Lebels,IFNULL(Z.JM_ID,0) JM_ID,IFNULL(Z.dataValue,0) dataValue from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	            ) Y left outer join   (    SELECT MONTH(P.BM_Purchase_Date) Create_Month,P.JM_ID,SUM(IFNULL(P.Actual_Price,0)) dataValue from (			(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.BM_Purchase_Date) ="+year+" and  bm.Status not in('D')  GROUP BY da.DA_ID) UNION   (SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+"  and YEAR(bm.Create_Date)="+year+"  GROUP BY da.DA_ID) ) P GROUP by MONTH(P.BM_Purchase_Date) )   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";

	}
	else if(id==8)
	{
		sql="SELECT  Y.MonthName Lebels,IFNULL(Z.JM_ID,0) JM_ID,CAST(IFNULL(Z.dataValue,0) as decimal(10,2)) dataValue from (          SELECT 'JAN' MonthName, 1 Create_Month, YEAR(CURRENT_DATE()) YearName          union   SELECT 'FEB' MonthName, 2 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAR' MonthName, 3 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'APR' MonthName, 4 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'MAY' MonthName, 5 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'JUN' MonthName, 6 Create_Month,YEAR(CURRENT_DATE()) YearName         union   SELECT 'JUL' MonthName, 7 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'AUG' MonthName, 8 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'SEP' MonthName, 9 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'OCT' MonthName, 10 Create_Month,YEAR(CURRENT_DATE()) YearName          union   SELECT 'NOV' MonthName, 11 Create_Month,YEAR(CURRENT_DATE()) YearName           union   SELECT 'DEC' MonthName, 12 Create_Month,YEAR(CURRENT_DATE()) YearName	            ) Y left outer join   (    SELECT MONTH(P.BM_Purchase_Date) Create_Month,P.JM_ID,SUM(IFNULL(P.BM_Purchase_Amt,0)) dataValue from (				(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.BM_Purchase_Date) BM_Purchase_Date,COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,SUM(bm.Revenue) Revenue FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.BM_Purchase_Date) ="+year+" and  bm.Status not in('D')  GROUP BY da.DA_ID)			UNION 			(SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, DATE(bm.Create_Date) BM_Purchase_Date, COUNT(*) purchases,SUM(bm.Actual_Price) Actual_Price,SUM(bm.CM_Amount) BM_Purchase_Amt,0 Revenue  FROM contest_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID where da.JM_ID="+JM_ID+" and YEAR(bm.Create_Date)="+year+"  GROUP BY da.DA_ID) ) P GROUP BY MONTH(P.BM_Purchase_Date))   Z on Z.Create_Month=Y.Create_Month GROUP BY Y.Create_Month Order by Y.Create_Month;";
		
	}


		const graphMonthy=await model.sqlPromise(sql);
		if(graphMonthy!=null && graphMonthy.length > 0)
		{
			var dbData={		
				graphMonthy:graphMonthy             
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag
			});
		}
		else
		{
			res.json({
				status:0,
				flag:""
			});
		}
	
	
});

//10-apr-2021
app.post('/admin/GetAllRequest',async (req,res)=>{

	if(parseInt(req.body.JM_ID) > 0)
	{
			var JM_ID=parseInt(req.body.JM_ID);

			let ext=req.headers['ext']
			console.log(ext)
			if(typeof ext=='undefined' || ext==null || ext=='')
			{
				ext='';
			}
			let sql="";	
			if(ext=='header')
			{
				//sql="(SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  order by DATE(bm.BM_Purchase_Date) desc ) UNION  ";
			//	sql+=" (SELECT  0 as BM_ID,'' BM_Url_ID,cm.CM_Name BM_Name,'' BM_Phone,cm.CM_Email BM_Email,'' BM_Password,da.DA_ID, cm.CM_Amount BM_Purchase_Amt,cm.Create_Date BM_Purchase_Date,'' BM_Instruction,'' BM_FileUrl,0 Revenue, 'B' BM_Type,'C' as Status,0 Consent,cm.Payment_Id,0 Admin_Payment,jm.JM_ID,'' BM_Content_Sent,'' BM_Updated_Date,1 IsSeen, 'C' Updated_By,0 ES_ID,0 isFree,0 isReminder,cm.LM_ID,cm.Fee,cm.Tax,cm.Actual_Price,'' Accept_Decline_Date,da.*,jm.*,'' JM_Password, cm.Actual_Price actualPrice, DATE_FORMAT(cm.Create_Date,'%D %b %Y')   BM_Purchase_Date,TIME(cm.Create_Date) BM_Purchase_Time,cm.Create_Date as actualPurchaseDate from contest_master cm inner join direct_access_master_user da on da.DA_ID=cm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE cm.JM_ID="+JM_ID+" order by DATE(cm.Create_Date) desc);";
				sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE IsSeen=0 and jm.JM_ID="+JM_ID+"  GROUP BY jm.JM_ID;";
				sql+=" SELECT * FROM referal_code_master where JM_ID="+JM_ID+";"; 
				sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
				sql+=" SELECT * from buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where bm.isReminder=1 and jm.JM_ID="+req.body.JM_ID+"; ";
				sql+=" SELECT count(*) noOfContest from direct_access_master_user dm WHERE dm.JM_ID="+JM_ID+" and dm.DA_DA_ID=6 and dm.Archive=0;"
			
				connection.query(sql,async function (error, results, fields) 
				{
					var allRequest,newRequest,referralCode,userDetails,reminderDetails,contest;
					 if (error) 
					 {
						 console.log(error);
						 res.json({
								status:0,flag:"err"
							 });	
					 }
					 else
					 {	
									 allRequest=[];
									 newRequest=results[0];
									referralCode=results[1];
									userDetails=results[2];
									reminderDetails=results[3];
									contest=results[4];
						
		
									 var dbData={
										status:1,msg:'success',
										JM_ID:req.body.JM_ID,
										allRequest:allRequest,
										newRequest:newRequest,
										referralCode:referralCode,
										userDetails:userDetails,
										reminderDetails:reminderDetails,
										contest:contest[0]                     
									  }
									const flag=await jsonEncrypt(dbData);
									res.json({
										status:1,
										flag:flag
									});
					
					 }
				 });
			}
			else
			{
				sql="(SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  order by DATE(bm.BM_Purchase_Date) desc ) UNION  ";
				sql+=" (SELECT  0 as BM_ID,'' BM_Url_ID,cm.CM_Name BM_Name,'' BM_Phone,cm.CM_Email BM_Email,'' BM_Password,da.DA_ID, cm.CM_Amount BM_Purchase_Amt,cm.Create_Date BM_Purchase_Date,'' BM_Instruction,'' BM_FileUrl,0 Revenue, 'B' BM_Type,'C' as Status,0 Consent,cm.Payment_Id,0 Admin_Payment,jm.JM_ID,'' BM_Content_Sent,'' BM_Updated_Date,1 IsSeen, 'C' Updated_By,0 ES_ID,0 isFree,0 isReminder,cm.LM_ID,cm.Fee,cm.Tax,cm.Actual_Price,'' Accept_Decline_Date,da.*,jm.*,'' JM_Password, cm.Actual_Price actualPrice, DATE_FORMAT(cm.Create_Date,'%D %b %Y')   BM_Purchase_Date,TIME(cm.Create_Date) BM_Purchase_Time,cm.Create_Date as actualPurchaseDate from contest_master cm inner join direct_access_master_user da on da.DA_ID=cm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE cm.JM_ID="+JM_ID+" order by DATE(cm.Create_Date) desc);";
				sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE IsSeen=0 and jm.JM_ID="+JM_ID+"  GROUP BY jm.JM_ID;";
				sql+=" SELECT * FROM referal_code_master where JM_ID="+JM_ID+";"; 
				sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
				sql+=" SELECT * from buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where bm.isReminder=1 and jm.JM_ID="+req.body.JM_ID+"; ";
				sql+=" SELECT count(*) noOfContest from direct_access_master_user dm WHERE dm.JM_ID="+JM_ID+" and dm.DA_DA_ID=6 and dm.Archive=0;"
				
				connection.query(sql,async function (error, results, fields) 
				{
					var allRequest,newRequest,referralCode,userDetails,reminderDetails,contest;
					 if (error) 
					 {
						 console.log(error);
						 res.json({
								status:0,flag:"err"
							 });	
					 }
					 else
					 {	
									allRequest=results[0];
									newRequest=results[1];
									referralCode=results[2];
									userDetails=results[3];
									reminderDetails=results[4];
									contest=results[5];
						
		
									 var dbData={
										status:1,msg:'success',
										JM_ID:req.body.JM_ID,
										allRequest:allRequest,
										newRequest:newRequest,
										referralCode:referralCode,
										userDetails:userDetails,
										reminderDetails:reminderDetails,
										contest:contest[0]                     
									  }
									const flag=await jsonEncrypt(dbData);
									res.json({
										status:1,
										flag:flag
									});
					
					 }
				 });
			}

		
				
		
	
	}
	else
	{
		res.json({status:0,msg:"JM_ID is empty",flag:"error"});
	}

})

//MS3 B2 28-oct-2021
app.post('/admin/GetAllRequest_by_status',async (req,res)=>{	
	
	let JM_ID=parseInt(req.body.JM_ID);
	let Status_IN=req.body.type;
	if(typeof Status_IN=='undefined' || Status_IN.length==0 )
	{
		res.json({	status:0,flag:"missing param" });	
		return false;
	}
	if(JM_ID > 0)
	{		
		const results=await GetAllRequest_by_status(JM_ID,Status_IN);
			
		if(results!='undefined' && results!=null)
		{
		
			var dbData={												
				allRequest:results[0],
				userDetails:results[1],
				pendingRequest:results[2],			
				productList:results[3],					                    
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag
			});

		}
		else
		{
			res.json({status:0,msg:" empty",flag:"error"});
		}
})


//updateRequestStat

app.post('/admin/updateRequestStat', async function(req,res){


	let Status=req.body.Status;
	let BM_ID=parseInt(req.body.BM_ID);
	let JM_ID=parseInt(req.body.JM_ID);
	var html="";
	var followerName=req.body.data.BM_Name;
	var Creator_Name=req.body.data.JM_Name;
	var purchased_date=req.body.data.BM_Purchase_Date; 
	var JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;
	var DA_Title=req.body.data.DA_Title;
	var BM_Purchase_Amt=req.body.data.Actual_Price;
	var BM_Email=req.body.data.BM_Email;
	var JM_Phone=req.body.data.JM_Phone;
	var BM_Phone=req.body.data.BM_Phone;

	BM_ID=await check_IntegerValue(BM_ID);
	JM_ID=await check_IntegerValue(JM_ID);

	if(typeof Status=='undefined' || Status==null || Status.length==0)
	{
		res.json({status:0,msg:"missing param 1"});
		return false;
	}

	if(typeof BM_ID=='undefined' ||  BM_ID==0)
	{
		res.json({status:0,msg:"missing param 2"});
		return false;
	}


	var msg="";
	if(Status=='A')
	{
		var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", Congratulations! Your Request was accepted by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>         <p>You will be notified as soon as the creator fulfills your request.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
		var mailOptions = {
			from: "Expy Admin <admin@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been accepted!",			
			html: html
		}
		var mailOptions2 = {
			from: "Expy Team <info@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been accepted!",			
			html: html
		}
		 msg="Congrats "+followerName+" Your Request was accepted by "+Creator_Name+" on Expy. You will be notified as your request is fulfilled. Thank you.";
	}
	
	if(BM_ID > 0)
	{
		let sql = "UPDATE buyers_master SET  Status='"+Status+"',BM_Updated_Date=NOW(),Accept_Decline_Date=NOW() WHERE BM_ID="+BM_ID;
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
						 res.json({	status:0,flag:"err" });	
					 }
					 else
					 {	
							var isSentSMS=await sendSMS(BM_Phone,msg);	
							var respon=await wrapedSendMailInfo(mailOptions2);	
							res.json({	
								status:1,			
								flag:""
							})
								
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
app.post('/admin/updateSeen', async (req, res) => {

	var JM_ID=parseInt(req.headers['id']);
	if(isNaN(JM_ID) || typeof JM_ID=='undefined') JM_ID=0
	if(JM_ID > 0)
	{
		
		let sql="Update buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID		set bm.isReminder=2		WHERE bm.isReminder=1 and jm.JM_ID="+JM_ID+"; ";
		 sql+="Update buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID		set bm.IsSeen=1		WHERE bm.IsSeen=0 and jm.JM_ID="+JM_ID+";";
		
		 const result=await model.sqlPromise(sql);
		 res.json({
			status:1,			
			msg:"Successfully updated Seen status"
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



app.get('/admin/exp_admin_panel', async function(req, res) {

	if(parseInt(req.session.AM_ID)> 0)
		return res.redirect('/admin/exp_admin_panel/dashboard');
		
	console.log(req.session.AM_ID);
	console.log(req.session.loggedin);

	var unique_id=cryptoRandomString({length: 20, type: 'alphanumeric'});
		req.session.key=unique_id;
	
	res.render('pages/login',{key:unique_id});
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

	
		var sql1=" SELECT X.JM_ID,X.JM_Name,X.JM_Email,X.JM_User_Profile_Url,X.JM_Insta_Url,X.JM_Utube_Url,X.JM_Twiter_Url,					X.JM_Profile_Pic,X.JM_Verified,X.Create_Date,	X.isRequested,X.isBlocked,X.isDeleted,X.isForLandingPage,X.JM_Referral,					IFNULL(X.JM_Acc_No,'NA') JM_Acc_No,IFNULL(X.JM_Acc_Code,'NA') JM_Acc_Code,					IFNULL(X.JM_SWIFT_Code,'NA') JM_SWIFT_Code,IFNULL(X.JM_Beneficiary_Name,'NA') JM_Beneficiary_Name,					IFNULL(X.JM_PayPal_Name,'NA') JM_PayPal_Name,IFNULL(X.JM_PayPal_Phone,'NA') JM_PayPal_Phone,IFNULL(X.JM_PayPal_Email,'NA') JM_PayPal_Email,					IFNULL(X.JM_PayPal_UserName,'NA') JM_PayPal_UserName,IFNULL(X.Code,'') as Code,IFNULL(Y.totalRef,0) as totalRef,X.Landing_Image from				(					  SELECT joining_master.JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,IFNULL(Landing_Image,'') Landing_Image,JM_Verified,DATE(joining_master.Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral,					  JM_Acc_No,JM_Acc_Code,JM_SWIFT_Code,JM_Beneficiary_Name,JM_PayPal_Name,JM_PayPal_Phone,JM_PayPal_Email,JM_PayPal_UserName,						  IFNULL(rfm.Code,'') as Code	FROM  joining_master left join referal_code_master rfm on rfm.JM_ID=joining_master.JM_ID							  where isDeleted=0 order by joining_master.JM_ID DESC			) X left join ( 		  SELECT joining_master.JM_Referral,COUNT(joining_master.JM_Referral) as totalRef,	(select JM_ID from referal_code_master where referal_code_master.Code=joining_master.JM_Referral) JM_ID	FROM joining_master					  where joining_master.isDeleted=0 group by joining_master.JM_Referral						) Y   on Y.JM_ID=X.JM_ID  where DATE(X.Create_Date) >= CURDATE() - INTERVAL 1 WEEK order by X.JM_ID DESC ";

					connection.query(sql1, function (error, result, fields) 
					{
						exploreData=result;
						console.log(error)
						if (!error)
						{
						
							console.log(exploreData);								
							 res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
							
						}
						else{
							res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
						}
					});
			


});
app.get('/admin/exp_admin_panel/celebrity_all', function(req, res) {

	console.log(req.session)
if(req.session.AM_ID == undefined )
	return res.redirect('/admin/exp_admin_panel');
if(parseInt(req.session.AM_ID) == 0 )
	return res.redirect('/admin/exp_admin_panel');

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var AM_ID=parseInt(req.session.AM_ID);

	
	//	var sql1="SELECT X.JM_ID,X.JM_Name,X.JM_Email,X.JM_User_Profile_Url,X.JM_Insta_Url,X.JM_Utube_Url,X.JM_Twiter_Url,					X.JM_Profile_Pic,X.JM_Verified,X.Create_Date,									X.isRequested,X.isBlocked,X.isDeleted,X.isForLandingPage,X.JM_Referral,					IFNULL(X.JM_Acc_No,'NA') JM_Acc_No,IFNULL(X.JM_Acc_Code,'NA') JM_Acc_Code,					IFNULL(X.JM_SWIFT_Code,'NA') JM_SWIFT_Code,IFNULL(X.JM_Beneficiary_Name,'NA') JM_Beneficiary_Name,					IFNULL(X.JM_PayPal_Name,'NA') JM_PayPal_Name,IFNULL(X.JM_PayPal_Phone,'NA') JM_PayPal_Phone,IFNULL(X.JM_PayPal_Email,'NA') JM_PayPal_Email,					IFNULL(X.JM_PayPal_UserName,'NA') JM_PayPal_UserName,IFNULL(X.Code,'') as Code,IFNULL(Y.totalRef,0) as totalRef from					(						  SELECT joining_master.JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,					  JM_Verified,DATE(joining_master.Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral,					  JM_Acc_No,JM_Acc_Code,JM_SWIFT_Code,JM_Beneficiary_Name,JM_PayPal_Name,JM_PayPal_Phone,JM_PayPal_Email,JM_PayPal_UserName,						  IFNULL(rfm.Code,'') as Code	FROM 					  joining_master						  left join referal_code_master rfm on rfm.JM_ID=joining_master.JM_ID							  where isDeleted=0 order by joining_master.JM_ID DESC					) X 					left join ( 					  SELECT joining_master.JM_Referral,COUNT(joining_master.JM_Referral) as totalRef,								  (select JM_ID from referal_code_master where referal_code_master.Code=joining_master.JM_Referral) JM_ID	FROM joining_master							  where joining_master.isDeleted=0 group by joining_master.JM_Referral					) Y   on Y.JM_ID=X.JM_ID  order by X.JM_ID DESC	";
		var sql1=" SELECT X.JM_ID,X.JM_Name,X.JM_Email,X.JM_User_Profile_Url,X.JM_Insta_Url,X.JM_Utube_Url,X.JM_Twiter_Url,					X.JM_Profile_Pic,X.JM_Verified,X.Create_Date,	X.isRequested,X.isBlocked,X.isDeleted,X.isForLandingPage,X.JM_Referral,					IFNULL(X.JM_Acc_No,'NA') JM_Acc_No,IFNULL(X.JM_Acc_Code,'NA') JM_Acc_Code,					IFNULL(X.JM_SWIFT_Code,'NA') JM_SWIFT_Code,IFNULL(X.JM_Beneficiary_Name,'NA') JM_Beneficiary_Name,					IFNULL(X.JM_PayPal_Name,'NA') JM_PayPal_Name,IFNULL(X.JM_PayPal_Phone,'NA') JM_PayPal_Phone,IFNULL(X.JM_PayPal_Email,'NA') JM_PayPal_Email,					IFNULL(X.JM_PayPal_UserName,'NA') JM_PayPal_UserName,IFNULL(X.Code,'') as Code,IFNULL(Y.totalRef,0) as totalRef,X.Landing_Image from				(					  SELECT joining_master.JM_ID,JM_Name,JM_Email,JM_User_Profile_Url,JM_Insta_Url,JM_Utube_Url,JM_Twiter_Url,JM_Profile_Pic,IFNULL(Landing_Image,'') Landing_Image,JM_Verified,DATE(joining_master.Create_Date) Create_Date,isRequested,isBlocked,isDeleted,isForLandingPage,JM_Referral,					  JM_Acc_No,JM_Acc_Code,JM_SWIFT_Code,JM_Beneficiary_Name,JM_PayPal_Name,JM_PayPal_Phone,JM_PayPal_Email,JM_PayPal_UserName,						  IFNULL(rfm.Code,'') as Code	FROM  joining_master left join referal_code_master rfm on rfm.JM_ID=joining_master.JM_ID							  where isDeleted=0 order by joining_master.JM_ID DESC			) X left join ( 		  SELECT joining_master.JM_Referral,COUNT(joining_master.JM_Referral) as totalRef,	(select JM_ID from referal_code_master where referal_code_master.Code=joining_master.JM_Referral) JM_ID	FROM joining_master					  where joining_master.isDeleted=0 group by joining_master.JM_Referral						) Y   on Y.JM_ID=X.JM_ID  order by X.JM_ID DESC ";
					connection.query(sql1, function (error, result, fields) 
					{
						exploreData=result;
						console.log(error)
						if (!error)
						{
						
							console.log(exploreData);								
							 res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
							
						}
						else{
							res.render('pages/celebrity',{data:exploreData,title:' Expy | Celebrity',moment:moment});
						}
					});
			


});
//16-aug-2021
app.post('/admin/celebrityPaymentDetails',async function(req,res){
	



			if(await isValidSession(req.session.AM_ID)== false )
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;		
			}

			if(typeof req.body.flag=='undefined' || req.body.flag==null)
			{
				res.json({status:0,msg:"Invalid key"});
				return false;
			}
			
			let jsonData=await decryptJsonData(req.body.flag);

			if(jsonData==false)
			{
				res.json({status:0,msg:"Invalid data"});
				return false;
			}

			console.log(jsonData)
			var JM_ID=parseInt(jsonData.JM_ID);		
			if(typeof JM_ID=='undefined')
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;
			}
			if(isNaN(JM_ID))
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;
			}

			//payment details
	    	//let sql=" SELECT X.JM_ID,	SUM(IFNULL(X.Actual_Price,0)) totalEarning,		SUM(IFNULL(X.BM_Purchase_Amt,0)) totalRevenue,	IFNULL(Y.amount,0) totalPayout,			(SUM(IFNULL(X.BM_Purchase_Amt,0)) - IFNULL(Y.amount,0)) as totalWallet,	cm.CM_Creator_Get,cm.CM_Expy_Take		from 	(			SELECT da.JM_ID,da.DA_Price,jm.JM_Name,da.DA_ID,da.DA_Title, 		DATE(bm.BM_Purchase_Date) BM_Purchase_Date,						COUNT(*) purchases, SUM(bm.BM_Purchase_Amt) BM_Purchase_Amt,  ROUND(SUM(bm.Actual_Price),0) Actual_Price,  			SUM(bm.Revenue) Revenue  		FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID  inner join joining_master jm on jm.JM_ID=da.JM_ID 		where da.JM_ID="+JM_ID+" and DATE(bm.BM_Purchase_Date) >= DATE_ADD(NOW(), INTERVAL -365 Day) GROUP BY DA_ID			  ) X left join 	 (	 SELECT pm.JM_ID,pm.payout_id,SUM(IFNULL(pm.amount,0)) amount ,pm.status,DATE(Create_Date) tranDate,pm.INR_USD,				pm.type from payout_master pm 	  where JM_ID="+JM_ID+" group by pm.JM_ID	) Y on Y.JM_ID=X.JM_ID	cross join charges_master cm  	GROUP by X.JM_ID;  ";
		
			let sql="select X.JM_ID, (SUM(IFNULL(X.totalRevenue,0)) - IFNULL(Y.totalPayout,0)) as totalWallet,		SUM(IFNULL(X.totalRevenue,0)) totalEarning,					IFNULL(Y.totalPayout,0) totalPayout,							 SUM(IFNULL(X.totalPurchase,0))  totalPurchase			from ( 							(SELECT    CAST(SUM(IFNULL(bm.Actual_Price,0)) as decimal(6,2)) totalPurchase,       						  CAST(SUM(IFNULL(bm.BM_Purchase_Amt,0)) as decimal(6,2)) as totalRevenue,     						   DAYNAME(bm.BM_Purchase_Date) Stat_day,DATE(bm.BM_Purchase_Date) as  Create_Date, jm.JM_ID        						   FROM buyers_master bm CROSS JOIN charges_master cm      						   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    						   inner join joining_master jm on jm.JM_ID=da.JM_ID  						  where jm.JM_ID="+JM_ID+" and bm.Status not in('D'))						  UNION ALL							 (SELECT    CAST(SUM(IFNULL(bm.Actual_Price,0)) as decimal(6,2)) totalPurchase,       						  CAST(SUM(IFNULL(bm.CM_Amount,0)) as decimal(6,2)) as totalRevenue,     						   DAYNAME(bm.Create_Date) Stat_day,DATE(bm.Create_Date) as  Create_Date, jm.JM_ID        						   FROM contest_master bm    						   inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    						   inner join joining_master jm on jm.JM_ID=da.JM_ID    where jm.JM_ID="+JM_ID+" )						  					  ) X    					   left join (						  SELECT pm.JM_ID,CAST(SUM(IFNULL(pm.amount,0)) as decimal(6,2)) totalPayout FROM payout_master pm 						  inner join joining_master jm2 on jm2.JM_ID=pm.JM_ID  where jm2.JM_ID="+JM_ID+"											 ) Y on Y.JM_ID=X.JM_ID;";


			//allTran
		sql+=" Select * from (	(SELECT bm.BM_Name,bm.BM_Email,da.DA_Title,bm.BM_Purchase_Amt,bm.Status, DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y') BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  and bm.Status not in('D'))		  UNION ALL		  (SELECT bm.CM_Name,bm.CM_Email,da.DA_Title,bm.CM_Amount,bm.Status, DATE_FORMAT(bm.Create_Date,'%D %b %Y') BM_Purchase_Date,TIME(bm.Create_Date) BM_Purchase_Time FROM contest_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+")			) as X order by X.BM_Purchase_Date desc;";
			//allpayout
		sql+=" SELECT pm.JM_ID,pm.PM_ID,pm.payout_id,pm.fund_account_id,pm.amount,pm.status, DATE_FORMAT(Create_Date,'%D %b %Y') tranDate,pm.type, pm.INR_USD,pm.type from payout_master pm  where JM_ID="+JM_ID+" order by pm.PM_ID DESC;";
		const data=await model.sqlPromise(sql);
		if(data!=null && data.length > 0)
		{

			var dbData={
				paymentDetails:data[0],
				allTransaction:data[1],
				allPayout:data[2],		                             
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({	
				status:1,			
				flag:flag
			})
		}
		else
		{

			res.json({	
				status:0,
				flag:"no data found"
			})
		}
});


//request purcaase made
app.get('/admin/exp_admin_panel/purchaseMade', function(req, res) {

		console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

		res.setHeader('Access-Control-Allow-Origin', '*');	
		var AM_ID=parseInt(req.session.AM_ID);	
		console.log(AM_ID);
			//var sql1="  SELECT * from ( SELECT * from ( SELECT bm2.BM_ID,bm2.BM_Name,bm2.BM_Phone,bm2.BM_Email,'Support Me' as  DA_Title,bm2.BM_Purchase_Amt as DA_Price,bm2.BM_Instruction,bm2.Status,	jm2.JM_ID,jm2.JM_Name,jm2.JM_Email,DATE(bm2.BM_Purchase_Date) requestDate,	bm2.BM_Purchase_Date,Time(bm2.BM_Purchase_Date) requesTime,	CASE WHEN bm2.Status='A' THEN 'OnGoing'	WHEN bm2.Status='C' THEN 'Completed'	WHEN bm2.Status='D' THEN 'Declined' 	WHEN bm2.Status='P' THEN 'Pending'  END as Req_Status,	Admin_Payment,'Gift and Donation' as creatorService 	FROM buyers_master bm2 inner join joining_master jm2 on jm2.JM_ID=bm2.JM_ID where jm2.isDeleted=0 and bm2.JM_ID > 0 order by bm2.BM_Purchase_Date DESC				   ) X	UNION 	SELECT * from (	SELECT bm.BM_ID,bm.BM_Name,bm.BM_Phone,bm.BM_Email,	da.DA_Title,bm.BM_Purchase_Amt as DA_Price,bm.BM_Instruction,bm.Status,	jm.JM_ID,jm.JM_Name,jm.JM_Email,DATE(bm.BM_Purchase_Date) requestDate,	bm.BM_Purchase_Date,Time(bm.BM_Purchase_Date) requesTime,	CASE WHEN bm.Status='A' THEN 'OnGoing' 	WHEN bm.Status='C' THEN 'Completed' 	WHEN bm.Status='D' THEN 'Declined' 	WHEN bm.Status='P' THEN 'Pending' end as Req_Status,	Admin_Payment, 	CASE WHEN da.DA_DA_ID=0 THEN 'Gift and Donation' WHEN da.DA_DA_ID=1 THEN 'Personalized video or audio message' WHEN da.DA_DA_ID=2 THEN 'Unlock Content' else 'NA' END as creatorService FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0 and bm.JM_ID = 0 order by bm.BM_Purchase_Date DESC	  ) Y ) Z order by Z.requestDate DESC";
			var sql1=" SELECT * from ( 		( 				SELECT jm2.JM_User_Profile_Url, bm2.BM_ID,bm2.BM_Name,bm2.BM_Phone,bm2.BM_Email,'Support Me' as  DA_Title,bm2.Actual_Price as DA_Price,bm2.BM_Instruction,bm2.Status,	jm2.JM_ID,jm2.JM_Name,jm2.JM_Email,DATE(bm2.BM_Purchase_Date) requestDate,	bm2.BM_Purchase_Date,Time(bm2.BM_Purchase_Date) requesTime,	CASE WHEN bm2.Status='A' THEN 'OnGoing'	WHEN bm2.Status='C' THEN 'Completed'	WHEN bm2.Status='D' THEN 'Declined' 	WHEN bm2.Status='P' THEN 'Pending'  END as Req_Status,	Admin_Payment,'Gift and Donation' as creatorService 	FROM buyers_master bm2 inner join joining_master jm2 on jm2.JM_ID=bm2.JM_ID where jm2.isDeleted=0 and bm2.JM_ID > 0 order by bm2.BM_Purchase_Date DESC				  ) 					 					 					 UNION 	ALL					 		  (		   SELECT jm.JM_User_Profile_Url,bm.BM_ID,bm.BM_Name,bm.BM_Phone,bm.BM_Email,	da.DA_Title,bm.Actual_Price as DA_Price,bm.BM_Instruction,bm.Status,	jm.JM_ID,jm.JM_Name,jm.JM_Email,DATE(bm.BM_Purchase_Date) requestDate,	bm.BM_Purchase_Date,Time(bm.BM_Purchase_Date) requesTime,	CASE WHEN bm.Status='A' THEN 'OnGoing' 	WHEN bm.Status='C' THEN 'Completed' 	WHEN bm.Status='D' THEN 'Declined' 	WHEN bm.Status='P' THEN 'Pending' end as Req_Status,	Admin_Payment, 	CASE WHEN da.DA_DA_ID=0 THEN 'Gift and Donation' WHEN da.DA_DA_ID=1 THEN 'Personalized video or audio message' WHEN da.DA_DA_ID=2 THEN 'Unlock Content' else 'NA' END as creatorService FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0 and bm.JM_ID = 0 order by bm.BM_Purchase_Date DESC		  	  ) 					 UNION 	ALL					 		  (			 SELECT jm.JM_User_Profile_Url,bm.CM_ID,bm.CM_Name,bm.CM_Phone,bm.CM_Email,da.DA_Title,bm.Actual_Price as DA_Price,'' BM_Instruction,'' as Status,	jm.JM_ID,jm.JM_Name,jm.JM_Email,DATE(bm.Create_Date) requestDate,	bm.Create_Date BM_Purchase_Date,Time(bm.Create_Date) requesTime,'' Req_Status,	0 Admin_Payment,'Contest or Giveaways' as creatorService FROM contest_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0  order by bm.Create_Date DESC		  ) 	 						 ) Z order by Z.requestDate DESC";
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
				res.json({status:0,msg:"err"});
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
		subject: "Your Expy invite code has arrived!",
		text: "Your INVITE CODE",	
		html:"<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi,</h3><p>thank you for showing interest in Expy.</p><p>We received a request for an invite code from you to join Expy</p>    <p>Our team went through your social media profile and we would be happy to offer you an exclusive invite to be one of Expy’s first Users.</p>    <p>Please use the following as your invite code to Sign up:<b>"+req.body.Code+"</b></p>    <p> <a href='"+process.env.BASE_URL+"'>Click here to login</a></p><p>You can also invite a creator to join expy, you can do that using the invite code on your dashboard.</p><span><b>Regards,</b></span><br/><span><b>Team Expy,</b></span><br/><span><b>Expy.bio</b> </span></div>"      
	}
	
	
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.json({status:0,msg:"err"});	
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
			  msg:"err"
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

//14-aug-2021
app.get('/admin/exp_admin_panel/referral-ranking',async(req,res)=>{

	try{
			if(await isValidSession(req.session.AM_ID)== false )
			{
				return res.redirect('/admin/exp_admin_panel');		
			}
			const sql="SELECT A.JM_ID,jm.JM_Name,A.JM_Referral,A.noOfUsers from (    SELECT JM_Referral,rcm.JM_ID,COUNT(*) noOfUsers FROM joining_master   inner join referal_code_master rcm on rcm.Code=JM_Referral  where JM_Referral !='' and JM_Referral IS NOT NULL and JM_Referral!='NA' and JM_Referral not in('EXP-BYC1023','EXP-BYC1024')   and isDeleted=0  GROUP by JM_Referral  ) A inner join joining_master jm on jm.JM_ID=A.JM_ID order by A.noOfUsers desc; ";
			const data =await model.sqlPromise(sql);
			res.render('pages/referralRanking',{data:data,title:' Expy | Referral Ranking',moment:moment});
		}
		catch(e)
		{

		}
})


app.post('/admin/userProfile', async function(req, res) {

            console.log(req.session)
        if(req.session.AM_ID == undefined )
            return res.redirect('/admin/exp_admin_panel');
        if(parseInt(req.session.AM_ID) == 0 )
            return res.redirect('/admin/exp_admin_panel');


        
            var email=req.body.JM_Email;

            connection.query('SELECT * FROM joining_master WHERE JM_Email = ?',[email], async function (error, results, fields) {
              if (error) {
                  res.json({
                    status:0,
                    msg:'there are some error with query'
                    })
              }else{

                if(results.length >0)
                {
                    var JM_ID=results[0].JM_ID;
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
					res.json({status:0,msg:"err"});
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
					res.json({status:0,msg:"err"});
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


app.post('/admin/updateCelebrityPrority',async function(req, res) 
{

			var JM_ID= req.body.JM_ID;
			var displayLanding=req.body.displayLanding;
			var Landing_Bio=connection.escape(req.body.Landing_Bio);


			if(JM_ID==0)
			{
				res.json({status:0,msg:"error in id"});
				return false;
			}
            if(displayLanding==1)
            {
				var sql="Select JM_Name from joining_master WHERE isForLandingPage=1 GROUP BY JM_ID";
				connection.query(sql, function (error, results, fields) 
				{
						if (!error)
						{

								if(results.length > 4 )
								{
										res.json({status:0,msg:" 5 Creators already in landing Page"});
								}
								else
								{
									let q = "UPDATE joining_master SET  isForLandingPage="+displayLanding+",Landing_Bio="+Landing_Bio+" WHERE JM_ID="+JM_ID;
									console.log(q)
									let query = connection.query(q, (err, output) => 
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
							res.json({status:0,error:"error", msg:"try later"});
						}
				});
            }
            else
            {
				let sql = "UPDATE joining_master SET  isForLandingPage="+displayLanding+",Landing_Image='' WHERE JM_ID="+JM_ID;
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

//MS3 B-1 18-oct-2021
app.post('/admin/landingImageFromAdmin',async function(req,res){

	try {
			let sampleFile;
				let uploadPath;
			
				if (!req.files || Object.keys(req.files).length === 0) {
				return res.status(400).send('No files were uploaded.');
				}
				console.log("file exist");
				// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
				var JM_ID=parseInt(req.body.JM_ID);
				JM_ID=await check_IntegerValue(JM_ID);
				var ProfileName=req.body.JM_User_Profile_Url;
				const respond=await Creators_Specific_Details(JM_ID);
				if(respond.status==1)
				{
					ProfileName=respond.Creators[0].JM_User_Profile_Url;	
				}


				
				sampleFile = req.files.sampleFile;

				if(typeof sampleFile =='undefined' || sampleFile==null)
				{
					return res.status(400).send('No files were uploaded.');
					return false;
				}

				var ext = path.extname(sampleFile.name);		
				var Name=sampleFile.md5;
				var fileName=Name+ext;
			
				uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"_"+JM_ID+"/"+fileName;
				
				db_fileName="Profile/" + ProfileName+"_"+JM_ID+"/"+fileName;

				// Use the mv() method to place the file somewhere on your server
				let result={};
				console.log(db_fileName);
				sampleFile.mv(uploadPath, async function(err) 
				{
					if (err)
					{
							console.log(err)
							res.json({status:0,msg:"error in upload"});
					}
					else	
					{
						let sql = "UPDATE joining_master SET  Landing_Image='"+db_fileName+"' WHERE JM_ID="+JM_ID;
							let query = connection.query(sql, async (error, results) => {
								if(error) 
								{
									console.log(error)
									res.json({status:0,msg:"error in query"});
								}			
								else
								{
									
									res.json({
										status:1,
										url:db_fileName
									});
								}
								
							});
						
					}  	
				});
	
	}
	catch (error) 
	{
		console.log(error);
		console.log("exception in  landingImageFromAdmin");
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

//13-aug-2021
app.post('/admin/isSentNewsLater',async(req, res)=>{
			
		try{
			if(await isValidSession(req.session.AM_ID)== false )
				{
					res.json({
						status:0,msg:'invalid session'
					})
					return false;	
				}
		
				if(typeof req.body.flag=='undefined' || req.body.flag==null)
				{
					res.json({status:0,msg:"Invalid key"});
					return false;
				}

				let jsonData=await decryptJsonData(req.body.flag)
				console.log(jsonData)
				if(jsonData==false)
				{
					res.json({status:0,msg:"Invalid data"});
					return false;
				}
				var ID=parseInt(jsonData.ID);
				var isSentNewsLater=parseInt(jsonData.isSentNewsLater);
				
		
				let sql="UPDATE news_letter set isSentNewsLater="+isSentNewsLater+" where ID="+ID;
				const data=await model.sqlPromise(sql);
				if(data.affectedRows==1)
				{
					res.json({
						status:1,msg:'updated'
					})
					return false;
				}
				else
				{
					res.json({
						status:0,msg:'Failed to update'
					})
					return false;	
				}
		
		}
		catch(e)
		{
			res.json({
						status:0,msg:'internal errot'
					})
					return false;
		}
			
	})
	
	async function isValidSession(AM_ID)
	{
		if(typeof AM_ID == 'undefined' )
		{
			return false;	
		}
		else if(
			isNaN(parseInt(AM_ID))
		 )
		{		
			return false;
		}
		else if(parseInt(AM_ID) == 0 )
		{		
			return false;	
		}
		else
		{
			return true;
		}
		

	}
	

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
app.post('/admin/changeUrlByAdmin',async (req,res)=>{

	// var contype = req.headers['content-type'];
	// console.log(contype)
	// if (!contype || contype.includes('multipart/form-data')==false)
	//   return res.send(400);


	var JM_ID=parseInt(req.body.JM_ID);
	var old_url=req.body.old_url;
	var new_url=req.body.new_url;
	JM_ID=await check_IntegerValue(JM_ID);
	if(JM_ID==0)
	{
		res.json({status:0})
		return false;
	}
	if(await checkUndefined_String(old_url)==true)
	{
		res.json({status:0})
		return false;
	}
	if(await checkUndefined_String(new_url)==true)
	{
		res.json({status:0})
		return false;
	}

	var OldProfileName=old_url+"_"+JM_ID;
	var NewProfileName=new_url+"_"+JM_ID;
	const currPath = __dirname + '/uploads/Profile/' + OldProfileName;
	const newPath = __dirname + '/uploads/Profile/' + NewProfileName;
	
	try 
	{
		fs.rename(currPath, newPath, async function(err) 
		{
			if (err)
			 {
				res.json({
					status:0,
					data:"err",
					msg:"error renameing"
				});
			} 
			else 
			{
				  console.log("Successfully renamed the directory.")
				connection.query("call changeProfileUrl(?,?,?)", [JM_ID,old_url,new_url], async function (err, result) {
					if (err) 
					{
						res.json({
							status:0,
							data:"err",
							msg:"error in sp"
						});
	
					} 
					else 
					{
						console.log("results:", result);			

			
							let sql = "UPDATE joining_master SET  JM_User_Profile_Url='"+new_url+"',isRequestForChangeUrl=0 WHERE JM_ID="+JM_ID;
							let query = connection.query(sql, async (err, results) => {
							if(err) 
							{
								console.log(err);
								res.json({status:0,msg:"err"});
							}
							else
							{
										let referal=old_url+"-"+JM_ID;
							let new_referal=new_url+"-"+JM_ID;
							let q="update joining_master jm set jm.JM_Referral='"+new_referal+"'  where jm.JM_Referral='"+referal+"'";
									console.log(q)
									const updateQuery=await model.sqlPromise(q);

										res.json({
											status:1,
											data:result,
											msg:"Successfully updated the url.",
											update:updateQuery.affectedRows
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
app.get('/admin/exp_admin_panel/dashboard', async function(req, res) {

	
	console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

		

    var sql="  SELECT CAST(SUM(X.totalSales) as decimal(10,2)) totalSales,SUM(X.noOfSales) noOfSales  from (   (Select IFNULL(SUM(IFNULL(bm.Actual_Price,0)),0) totalSales, COUNT(*)    noOfSales from buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0   GROUP BY YEAR(bm.BM_Purchase_Date),MONTH(bm.BM_Purchase_Date),DAY(bm.BM_Purchase_Date)  order by DATE(bm.BM_Purchase_Date) desc)  UNION ALL (Select IFNULL(SUM(IFNULL(bm.Actual_Price,0)),0) totalSales, COUNT(*)    noOfSales from contest_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0 and bm.Actual_Price > 0  GROUP BY YEAR(bm.Create_Date),MONTH(bm.Create_Date),DAY(bm.Create_Date)   order by DATE(bm.Create_Date) desc) ) X;";
		
		sql+=" Select COUNT(*)  noOfCreator from joining_master where isDeleted=0; Select COUNT(*)  noOfReferral from referral_code_request WHERE referral_code_request.isCodeSent=0; Select COUNT(*)  completedRequest from buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0  and bm.Status='C';";
     
		sql+=" Select COUNT(*) uniqueViews FROM(  select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount 			from view_master vm where 			 YEAR(vm.Create_Date) GROUP BY DATE(vm.Create_Date),vm.IP 		) A;";

		sql+="Select SUM(IFNULL(viewCount,0)) totalViews FROM(  select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount 			from view_master vm where 			 YEAR(vm.Create_Date) GROUP BY DATE(vm.Create_Date),vm.IP 		) A;";

		sql+="Select SUM(IFNULL(viewCount,0)) totalViews FROM(  select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount 			from view_master vm where 			 YEAR(vm.Create_Date) GROUP BY DATE(vm.Create_Date),vm.IP 		) A;";

		connection.query(sql, function (error, results, fields) 
		{
			var sales,creators,referralRequest,completedRequest,uniqueViews;
			console.log(results)
			if (!error)
			{
				sales=results[0];
				creators=results[1];
				referralRequest=results[2];		
				completedRequest=results[3];	
				uniqueViews=results[4];
				totalViews=results[5];
				res.render('admin/home',{
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,
					title:' Expy | Dashboard'			
				});		
			}
			else
			{
				res.render('admin/home',{
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,
					title:' Expy | Dashboard'				
				});		
			}
	    });
});


app.post('/admin/auth', async function(request, response) {


	console.log(request.headers['auth']);
	let key=request.session.key;
	console.log(request.session);
	let auth=request.headers['auth'];
	if(typeof auth=='undefined' || auth==null || auth.length==0)
	{
		response.json({status:0,msg:"Invalid param"});
		return false;
	}
	if(auth!=key)
	{
		response.json({status:0,msg:"Network authintication failed, refresh the page and try again"});
		return false;
	}
	if(typeof request.body.flag=='undefined' || request.body.flag==null)
	{
		response.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData_coin(request.body.flag,key)
	console.log(jsonData)
	
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}

	request.body=jsonData;

	var AM_Email = request.body.AM_Email;
	var AM_Password = request.body.AM_Password;

	if(typeof AM_Email=='undefined' || AM_Email.lnegth ==0)
	{
		response.json({status:0,msg:"invalid param"});
		return false;
	}
	if(typeof AM_Password=='undefined' || AM_Password.lnegth ==0)
	{
		response.json({status:0,msg:"invalid param"});
		return false;
	}



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
				request.session.key='';
				response.json({status:1,msg:"success"});
			
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
app.post('/admin/updateOrderByForEachTable',async function(req,res){

	//console.log(req.body.userDetailsAll)
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}

	req.body=jsonData;

	let sql="";
	if(typeof req.body!='undefined' && req.body.userDetailsAll!=null && req.body.userDetailsAll.length > 0)
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
					res.json({status:0,msg:"err"});
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
		res.json({status:0,msg:"Unable to update"});
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
// 						pathTofile:"err"
// 					});
// 		})
// 		.catch(err => {
			
// 		res.json({
// 				pathTofile:"err"
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
					res.json({status:0,msg:"err"});
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
					res.json({status:0,msg:"err"});
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
                            res.json({status:0,msg:"err"});
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
						  
					  res.json({status:0,msg:"err",newsLetter:newsLetter});
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

cron.schedule(midNightCron, async () => {
 	console.log("Task is running every night " + new Date());
 	await SendReminderEmail();
	await declinePendingAcceptRequest();
	await DeleteTokens_Last_Hours();

});

async function SendReminderEmail()
{
	try 
	{
		let days_interval="3,6,7,9,11,13";
		// let sql="SELECT datediff( CURDATE(),DATE(bm.BM_Purchase_Date)) as days,jm.JM_ID,jm.JM_Email,jm.JM_Phone,jm.JM_Name,jm.JM_User_Profile_Url,bm.*,da.DA_DA_ID,da.DA_Type,da.DA_Title,da.DA_Description,da.DA_Price	 FROM buyers_master bm  	 inner join direct_access_master_user da on da.DA_ID=bm.DA_ID 	 inner join joining_master jm on jm.JM_ID=da.JM_ID 	 WHERE bm.Status='P' and jm.isDeleted=0 and datediff( CURDATE(),DATE(bm.BM_Purchase_Date)) >= 14;"; 
	 	let sql="SELECT datediff( CURDATE(),DATE(bm.BM_Purchase_Date)) as days,	 (CASE WHEN bm.Status='P' THEN (7 - datediff( CURDATE(),DATE(bm.BM_Purchase_Date))) 	  WHEN bm.Status='A' THEN  (14 - datediff( CURDATE(),DATE(bm.BM_Purchase_Date))) END) as remDays,bm.Status, 	  jm.JM_Name,bm.BM_Name,bm.BM_Purchase_Date,da.DA_Title,	  bm.BM_Purchase_Amt,bm.Actual_Price,	  jm.JM_User_Profile_Url,jm.JM_Email,bm.BM_ID,jm.JM_Phone	   FROM buyers_master bm      inner join direct_access_master_user da on da.DA_ID=bm.DA_ID    inner join joining_master jm on jm.JM_ID=da.JM_ID   WHERE bm.Status in ('P','A') and da.DA_DA_ID = 1 and jm.isDeleted=0 and datediff( CURDATE(),DATE(bm.BM_Purchase_Date)) in ("+days_interval+");";
	 
	 
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
					var Actual_Price=result[i].Actual_Price;
					var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
					var JM_Email=result[i].JM_Email;
					var BM_ID=result[i].BM_ID;
					var JM_Phone=result[i].JM_Phone;
					
					let remDays=result[i].remDays;
					let Status=result[i].Status;
					let acceptDays=0,completeDays=0;				
					
					let acceptText="";let completeText="";
					let daysOver=result[i].days;
					if(Status=='P')
					{
						acceptText="you have "+remDays+" more days to decline or accept, and "; //4

						completeText=(14 - daysOver)+" more days to complete the request"; //10
					}
					else if(Status=='A')
					{
						//acceptText="you have "+remDays+" more days to decline or accept, and ";
						completeText= remDays+" more days to complete the request"; //5
					}
						

					var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+JM_Name+", you have a pending Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+Actual_Price+"</span><br/>         <p>To ensure your followers have a smooth time purchasing from you, "+ acceptText + completeText+". Beyond this, the request will be automatically declined.</p> <p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify?Pending'>click here</a>.</p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
					var mailOptions = {
						from: "Expy Team <info@expy.bio>",
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
                                          
                                           
                     var resp=await wrapedSendMailInfo(mailOptions);			
					 let msg="Hi "+JM_Name+" , you have PENDING Personalized Message Requests on your Expy page. To accept/decline visit: expy.bio/notify. If not accepted, the request will automatically be declined.";
				  	 var isSentSMS=await sendSMS(JM_Phone,msg);

					 
                   	 console.log("response "+ BM_ID + " " + JM_Email + " " + resp)						
					 console.log("count "+c)
				}
		
			}
	}
	catch(error) 
	{
		console.log("SendReminderEmail ")
		console.log(error)
		//res.status(error.response.status)
		//return res.send(error.message);
	}   
}


async function declinePendingAcceptRequest()
{

      try{
		let sql="SELECT jm.JM_ID,jm.JM_Email,jm.JM_Name,jm.JM_User_Profile_Url,bm.*,da.DA_DA_ID,da.DA_Type,da.DA_Title,da.DA_Description,da.DA_Price,	DATE_ADD(DATE(bm.BM_Purchase_Date), INTERVAL 7 DAY) declineDate_Pending,  DATE_ADD(DATE(bm.BM_Updated_Date), INTERVAL 7 DAY) declineDate_Accept,  	CURDATE() as currentDate,   (    CASE WHEN (CURDATE() >  DATE_ADD(DATE(bm.BM_Purchase_Date), INTERVAL 7 DAY))  and bm.Status='P'  THEN 'Y'     ELSE 'N'     END  ) as doDecline,    (CASE WHEN (CURDATE() >  DATE_ADD(DATE(bm.BM_Purchase_Date), INTERVAL 14 DAY)) and  bm.Status='A'     THEN 'Y'  ELSE 'N'   END  ) as doDeclineAfterAccept  FROM buyers_master bm  inner join direct_access_master_user da on da.DA_ID=bm.DA_ID       inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE bm.Status in('P','A') and jm.isDeleted=0 and da.DA_DA_ID=1";

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
				var BM_Purchase_Amt=result[i].Actual_Price;
				var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
				var JM_Email=result[i].JM_Email;
				var BM_ID=result[i].BM_ID;
				var doDecline=result[i].doDecline;
				var doDeclineAfterAccept=result[i].doDeclineAfterAccept;                     
									   
				var isFree=parseInt(result[i].isFree);
									   
									   
				if(doDecline=='Y')
				{
					console.log("I am here doDecline")
					console.log(BM_ID)
					// do refund and update status to decline
					var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
					var mailOptions = 
					{
						from: "Expy Team <info@expy.bio>",
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
									   
							var resp=await wrapedSendMailInfo(mailOptions);
							let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
							var isSentSMS=await sendSMS(BM_Phone,msg);
									   
						}


						if(isFree==1)
						{
							let updateSql="UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW(),Updated_By='S' WHERE BM_ID="+BM_ID;
							const rows = await model.sqlPromise(updateSql);
									   

							 console.log("done")
							 console.log(rows)    
									   
							var resp=await wrapedSendMailInfo(mailOptions);
							let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
							var isSentSMS=await sendSMS(BM_Phone,msg);
						}
									   
				}
									   
				if(doDeclineAfterAccept=='Y') // 14 days from purchase date
				{
					console.log(" doDeclineAfterAccept ")
					console.log("I am here doDecline")
					console.log(BM_ID)
									   
					// do refund and update status to decline
					var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
					var mailOptions = 
					{
						from: "Expy Team <info@expy.bio>",
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
									   
							var resp=await wrapedSendMailInfo(mailOptions);
							let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
							var isSentSMS=await sendSMS(BM_Phone,msg);
						}
						if(isFree==1)
						{
							let updateSql="UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW(),Updated_By='S' WHERE BM_ID="+BM_ID;
							const rows = await model.sqlPromise(updateSql);
									   

							 console.log("done")
							 console.log(rows)    
									   
							var resp=await wrapedSendMailInfo(mailOptions);
							let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
							var isSentSMS=await sendSMS(BM_Phone,msg);
						}
									   
				}
										
			
			}
		}     
	  }
	  catch(error) 
	  {
		console.log("declinePendingAcceptRequest ")
		console.log(error)
	  } 
			                                
}

//19-oct-2021

           
app.get('/admin/SendReminderEmail', async(req,res)=>
{
	console.log("Task is running every night " + new Date());
 	await SendReminderEmail();
	 res.json({status:1})
});
             
                                    
                                           
                                           
// sending multiple email
async function wrapedSendMail(mailOptions)
{
	let transporter = mailer.createTransport({
		service: 'Yandex', // no need to set host or port etc.
		auth: {
			user: "admin@expy.bio",
			pass: "H3Scx9Bt"
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

var request = require('request');

const util = require('util')                                     
                               
// calling refund  API 
async function refund(pay_id)
{
	        
	//live must uncomment before live
	let url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payments/"+pay_id+"/refund";
                                           
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
	try {
		
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
	} 
	catch (error) {
		return false;
	}
	

	//return true;
}

app.get('/admin/sendSMS', async(req,res)=>
{

	let followerName="Sam"; let Creator_Name="maman";
	let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
							

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
	let JM_ID=parseInt(req.body.JM_ID);
	let acc_name=req.body.acc_name;
	let acc_num=req.body.acc_num;
	let acc_ifsc=req.body.acc_ifsc;
	let reference_id=req.body.reference_id;
	let email=req.body.email;	
	let contact =req.body.contact;
	let contact_id=req.body.contact_id;
	let fund_id=req.body.fund_id;

	JM_ID=await check_IntegerValue(JM_ID);
	if(JM_ID ==0)
	{
		res.json({
			status:0,
			msg:'The  id is empty.'
		})
		return false;
	}
	if(typeof acc_name=='undefined' || acc_name.length==0)
    {
			res.json({
            	  status:0,
				  msg:'The account name is empty.'
              })
			return false;
    }
	if(typeof acc_ifsc=='undefined' || acc_ifsc.length != 11)
    {

			res.json({
            	  status:0,
				  msg:'The ifsc must be 11 characters.'
              })
			return false;
    }
	if(typeof contact=='undefined' || contact.length != 10)
    {

			res.json({
            	  status:0,
				  msg:'The mobile must be 10 digits.'
              })
			return false;
    }
	if(typeof email=='undefined' || email.length == 0)
    {

			res.json({
            	  status:0,
				  msg:'The email is empty.'
              })
			return false;
    }
	if(typeof acc_num=='undefined' || acc_num.length == 0)
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
		   

			
	
  		//update 
	}
	
})
//ACC_NO_RAZORPAY_X=4564565701856236
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
	 var type=req.body.type;


  if(type=='B')
	{

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
	 let dataArr=await Get_Total_Withdrawable_Bal(JM_ID);
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

	 if(currentBalance == 0)
	 {
		res.json({
			status:0,
			msg:"No available balance"
		})
		 return false;
	 }
	 if(amount > currentBalance)
	 {
		res.json({
			status:0,
			msg:"balence is not available"
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
	 if(typeof fund_account_id=='undefined' || fund_account_id.length==0)
	 {
		 res.json({
			 status:0,
			 msg:"Fund Id missing, Update payout details in settings and try again"
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




	// var data={
	// 	"account_number": "2323230044353275",
	// 	"fund_account_id": "fa_HbENdudTJdUY29",
	// 	"amount": 10000000,
	// 	"currency": "INR",
	// 	"mode": "IMPS",
	// 	"purpose": "payout",
	// 	"queue_if_low_balance": false,
	// 	"reference_id": "Acme Transaction ID 12345",
	// 	"narration": "Acme Corp Fund Transfer",
	// 	"notes": {
	// 	  "notes_key_1":"Tea, Earl Grey, Hot",
	// 	  "notes_key_2":"Tea, Earl Grey… decaf."
	
	// 	}
	// }

	var response=await withdrawlMoney(data);
	if(response.status==1)
	{
		console.log('response.data', response.data); 
		let obj=response.data;		
	
		const values = [
			[JM_ID,obj.id,obj.fund_account_id,amount,obj.status,obj.entity,obj.created_at,obj.fees,obj.tax]
		];
		const sql = "INSERT INTO payout_master (JM_ID,payout_id,fund_account_id,amount,status,entity,created_at,Fee,Tax) VALUES ?";
	


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
			msg:"Update Payout details and try again later...",
			error
		})
	}
	
  }	
  else if(type=='P') //paypal
  {
	
		
		res.json({
			status:0,
			msg:"Payout method not available"			
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


		// amount: 1500
		// batch_id: null
		// created_at: 1630995803
		// currency: "INR"
		// entity: "payout"
		// failure_reason: null
		// fee_type: "free_payout"
		// fees: 0
		// fund_account_id: "fa_HuTQBDULtbmHZ3"
		// id: "pout_HuTUxoeAS7wU9V"
		// mode: "IMPS"
		// narration: "HELLOSTAR MEDIA PRIVATE LIMITE"
		// notes: {notes_key_1: 'Tea, Earl Grey, Hot', notes_key_2: 'Tea, Earl Grey… decaf.'}
		// purpose: "payout"
		// reference_id: "Z2itSb/+ef6ZlsEYFNCucti7RZX8LP"
		// status: "processing"
		// tax: 0

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
async function Get_Total_Withdrawable_Bal(JM_ID)
{

	var sql="call sp_get_withdrawable_balance(?)";
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
//sp_get_withdrawable_balance

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
	let dataArr_withdrawal=await Get_Total_Withdrawable_Bal(JM_ID);
	

	console.log(dataArr)
	if(dataArr.length > 0)
	{
	
		const sql="select pm.payout_id,pm.amount,pm.status,DATE(Create_Date) tranDate,pm.INR_USD,pm.type from payout_master pm where JM_ID="+JM_ID+" order by PM_ID DESC;"
		const result=await model.sqlPromise(sql);

		currentBalance=dataArr[0].currentBalance;
		withDrawableBalance=dataArr_withdrawal[0].currentBalance;
		res.json({
			status:1,result:result,currentBalance:currentBalance,withDrawableBalance:withDrawableBalance
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
 
	 value=connection.escape(value);
	 let sql="Update joining_master set "+colName+" ="+value+" where JM_ID="+tableId;
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
		from: 'Expy Team <info@expy.bio>',
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
	try {
		
		
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
		//  .catch(err => console.log(err));
	}
	catch (error) 
	{
		console.log("exeption in wrapedSendMailInfo");
		return false;
	}
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
	let JM_ID=parseInt(req.body.JM_ID);
	let EM_Title=req.body.EM_Title;
	let EM_Desc=req.body.EM_Desc;
	let EM_Mail_Text=req.body.EM_Mail_Text;
	let EM_Duration=parseInt(req.body.EM_Duration);
	let EM_Plan_Days=parseInt(req.body.EM_Plan_Days);
	let EM_Price=req.body.EM_Price;
	let days=JSON.parse(req.body.days);
	

	if(typeof JM_ID=='undefined' 
	|| typeof EM_Title=='undefined' 
	|| typeof EM_Desc=='undefined' 
	|| typeof EM_Mail_Text=='undefined' 
	|| typeof EM_Duration=='undefined' 
	|| typeof EM_Price=='undefined' 
	|| typeof days=='undefined' 
	)
	{
		res.json({
			status:0,msg:'undefined params'
		})
		return false;
	}

	JM_ID=await check_IntegerValue(JM_ID);

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
	if(EM_Plan_Days !=7 && EM_Plan_Days !=30 && EM_Plan_Days !=60 && EM_Plan_Days !=90 && EM_Plan_Days !=180 )
	{
		res.json({
			status:0,msg:'invalid plan days '
		})
		return false;
	}

	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}
		
		console.log(req.body)
		console.log("req.files")
		console.log(req.files)

		let imageFile;
		var ext ='';	
		var fileName="";	
		var fileArray=[];	
		var DA_Collection="[]";	

		if (!req.files) 
		{
          // File does not exist.     

		} 
		else 
		{
          // File exists.
         	imageFile = req.files.sampleFile;
			ext = path.extname(imageFile.name);	
			fileName=imageFile.md5+ext;			
			fileArray=[fileName]	
			DA_Collection=JSON.stringify(fileArray);	

        }
	


		// EM_Title=connection.escape(EM_Title);	
		// EM_Desc=connection.escape(EM_Desc);
		// EM_Mail_Text=connection.escape(EM_Mail_Text);
	

		const values = [
			[5,'videoCam',JM_ID,EM_Title, EM_Desc,EM_Price,EM_Mail_Text,EM_Duration,EM_Plan_Days,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont]
		];
		const sql = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Price,EM_Mail_Text,EM_Duration,EM_Plan_Days,DA_Collection,DA_Allow_Cust_Pay,DA_Min_Amount,DA_Suggested_Amont) VALUES ?";	  
	


		const DataInserted=await model.sqlInsert(sql,values)
		if(DataInserted.affectedRows == 0)
		{
			res.json({
				status:0,msg:'failed to insert event master'
			})
			return false;
		}
		EM_ID = DataInserted.insertId;
		//==================================== if image exist
		if (!req.files) 
		{
          // File does not exist.

        } else 
		{
          var ProfileName=req.body.JM_User_Profile_Url + "_"+JM_ID;					
			uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
			var DA_Collection='Profile/' + ProfileName+"/"+fileName;
			imageFile.mv(uploadPath, async function(err) 
			{
				if (err)
					console.log(err);
				else	
				   console.log("success");
				
			});


        }
	

	


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
		
		let p=" delete from event_slots_config where ESC_EM_ID="+ESC_EM_ID+" and JM_ID="+JM_ID;
		const result_p=await model.sqlPromise(p);
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




	var query ="Select es.ES_ID from event_slots es where  es.ES_Calendar_Date > CURDATE() and  es.ES_EM_ID="+ES_EM_ID+"  and es.ES_Calendar_Date NOT IN( SELECT ES_Calendar_Date from event_slots WHERE ES_EM_ID="+ES_EM_ID+" and ES_Status='Booked')";
	var bookedRecords=await model.sqlPromise(query);
	let lenBooked=bookedRecords.length;
	for (let i = 0; i < lenBooked; i++) 
	{
		const ES_Calendar_Date = bookedRecords[i].ES_Calendar_Date;
		const ES_ID = bookedRecords[i].ES_ID;
		let n=" delete from event_slots  where  ES_ID="+ES_ID; 
		const result_n=await model.sqlPromise(n);
		console.log("result_n.affectedRows")
		console.log(result_n.affectedRows)
	}

	// blocked oen slots of a booking date
	let Q="SELECT es.ES_ID from event_slots es  where es.JM_ID="+JM_ID+" and es.ES_EM_ID="+ES_EM_ID+" and es.ES_Calendar_Date IN(  SELECT ES_Calendar_Date from event_slots WHERE ES_EM_ID="+ES_EM_ID+" and ES_Status='Booked') and es.ES_Status='Open';";
	let Qdata=await model.sqlPromise(Q);
	let lenQdata=Qdata.length;
	for (let i = 0; i < lenQdata; i++) 
	{		
		const ID = Qdata[i].ES_ID;	
		let sql="Update event_slots set ES_Status='Blocked' WHERE ES_ID="+ID;
		const data=await model.sqlPromise(sql);
	}
		


	console.log(days);
	var now = new Date();
	var planDays= now.setDate(now.getDate() + days)
	var today = new Date();
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	var daysOfYear = [];
	let isDone=0;
	for (var d = tomorrow; d <= planDays; d.setDate(d.getDate() + 1)) 
	{
		daysOfYear.push(new Date(d),new Date(d).getDay());
		
		let day = new Date(d).getDay();
  
        var ES_Calendar_Date = new Date(d).toISOString().substr(0,10);
		
		if(day==0)
		  day=7;
                       console.log("day num");
                       console.log(day);
                      console.log("ES_Calendar_Date");
                       console.log(ES_Calendar_Date);
		  console.log("inside insert slot looooop " + day);
		let sql="SELECT * from event_slots_config where ESC_Day_ID="+day+ " and ESC_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID ;
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
				var query1="SELECT ES_ID,ES_EM_ID,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration,ES_Blocked_Due_To from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Status='Booked' and ES_EM_ID="+ESC_EM_ID;
				var bookedRecords1=await model.sqlPromise(query1);
				let bookLenUpdate=bookedRecords1.length;
				for (let j = ESC_Avail_Start_Time; j < ESC_Avail_End_Time; j+=duration) 
				{
					
						if((ESC_Avail_End_Time - j) < duration) 
						break;

					let ES_Slot_Start=ESC_Avail_Start_Time;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';


					// while update/....
			
					//if booklen > 0 then skip this calendar date
					if(bookLenUpdate == 0)
					{                   
						
						var query="SELECT ES_ID,ES_EM_ID,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration,ES_Blocked_Due_To from event_slots where ES_Status='Booked' and ES_Calendar_Date >=CURDATE() and JM_ID="+JM_ID;
						var bookedRecords=await model.sqlPromise(query);
						let bookLen=bookedRecords.length;
						if(bookLen > 0)
						{
							for (let k = 0; k < bookLen; k++) 
							{
								//Check for this slot, for this event id, for this date, if data exist in table, then update, not insert
								// If the existing record is "Blocked" then dont update or insert						
												
								if(ES_Calendar_Date==bookedRecords[k].ES_Calendar_Date)
								{   
														
									
											if( 
												((ES_Slot_Start <= bookedRecords[k].ES_Slot_Start) && (ES_Slot_End >= bookedRecords[k].ES_Slot_End))
												|| 
												(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start && bookedRecords[k].ES_Slot_End > ES_Slot_Start  && bookedRecords[k].ES_Slot_End <=ES_Slot_End)
												||
												(bookedRecords[k].ES_Slot_Start >=ES_Slot_Start && bookedRecords[k].ES_Slot_Start < ES_Slot_End && bookedRecords[k].ES_Slot_End >=ES_Slot_End)
												||
												(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start &&  bookedRecords[k].ES_Slot_End >= ES_Slot_End)
												
										
											) 
										{
											let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
											let resp_q=await model.sqlPromise(q);
											if(resp_q.length == 0)
											{

												ES_Status='Blocked';
												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
												const insertSlot=await model.sqlInsert(q,values);	
												isDone++;   
											}
											else
											{
												

												let ES_ID=resp_q[0].ES_ID;	

												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="UPDATE event_slots set ES_Status='Blocked' where ES_ID="+ES_ID;
												const updateBlocked=await model.sqlPromise(q);	
												isDone++;   
											}                   
					
										}	  
										else
										{

											let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
											let resp_q=await model.sqlPromise(q);
											if(resp_q.length == 0)
											{
												ES_Status='Open';
												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
												const insertSlot=await model.sqlInsert(q,values);	
												isDone++;  
											}
										                                                                                        
										}
					
							
								}
								else
								{

									let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
									let resp_q=await model.sqlPromise(q);
									if(resp_q.length == 0)
									{
										ES_Status='Open';
										const values = [
												[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
										];	
										let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
										const insertSlot=await model.sqlInsert(q,values);	
										isDone++;  
									}
																																	
								}
							
							}//for loop
						}
						else
						{							

							let values = [
								[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
							];
							let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
							const insertSlot=await model.sqlInsert(q,values);	
							isDone++;
						}
					}	
					//============================== end 
                 	 ESC_Avail_Start_Time=ES_Slot_End;
				}// slot range created
				
                //second schedule
                for (let j = ESC_Avail_Start_Time2; j < ESC_Avail_End_Time2; j+=duration) 
				{
					
					if((ESC_Avail_End_Time2 - j) < duration) 
					  break;


					let ES_Slot_Start=ESC_Avail_Start_Time2;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';
			
					if(bookLenUpdate == 0)
					{  

						var query="SELECT ES_ID,ES_EM_ID,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration,ES_Blocked_Due_To from event_slots where ES_Status='Booked' and ES_Calendar_Date >=CURDATE() and JM_ID="+JM_ID;
						var bookedRecords=await model.sqlPromise(query);
						let bookLen=bookedRecords.length;
						if(bookLen> 0)
						{
							for (let k = 0; k < bookLen; k++) 
							{
									if(ES_Calendar_Date==bookedRecords[k].ES_Calendar_Date)
									{    
													
											if( 
												((ES_Slot_Start <= bookedRecords[k].ES_Slot_Start) && (ES_Slot_End >= bookedRecords[k].ES_Slot_End))
												|| 
												(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start && bookedRecords[k].ES_Slot_End > ES_Slot_Start  && bookedRecords[k].ES_Slot_End <=ES_Slot_End)
												||
												(bookedRecords[k].ES_Slot_Start >=ES_Slot_Start && bookedRecords[k].ES_Slot_Start < ES_Slot_End && bookedRecords[k].ES_Slot_End >=ES_Slot_End)
												||
												(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start &&  bookedRecords[k].ES_Slot_End >= ES_Slot_End)
												
										
											) 
										{
											
											
											let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
											let resp_q=await model.sqlPromise(q);
											if(resp_q.length == 0)
											{

												ES_Status='Blocked';
												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
												const insertSlot=await model.sqlInsert(q,values);	
												isDone++;  
												
											}
											else
											{												

												let ES_ID=resp_q[0].ES_ID;	

												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="UPDATE event_slots set ES_Status='Blocked' where ES_ID="+ES_ID;
												const updateBlocked=await model.sqlPromise(q);	
												isDone++;   
											}    


					
										}	  
										else
										{

											let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
											let resp_q=await model.sqlPromise(q);
											if(resp_q.length == 0)
											{
												ES_Status='Open';
												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
												let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
												const insertSlot=await model.sqlInsert(q,values);	
												isDone++;   
											}
											                                                                                       
										} 
											
									}
									else
									{


										let q="SELECT ES_ID,ES_Status from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Slot_Start='"+ES_Slot_Start+"' and ES_Slot_End='"+ES_Slot_End+"' and ES_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID;
										let resp_q=await model.sqlPromise(q);
										if(resp_q.length == 0)
										{
												ES_Status='Open';
												const values = [
													[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
												];	
											let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
											const insertSlot=await model.sqlInsert(q,values);	
											isDone++;      
										}                                                                                    
									}
							
							}
						}
						else
						{
							let values = [
								[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
							];	
							let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
							const insertSlot=await model.sqlInsert(q,values);	
							isDone++;
						}	
					}

                 	 ESC_Avail_Start_Time2=ES_Slot_End;
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


			var dbData={
				data:data[0],                             
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag
			});
			// res.json({
			// 	status:1,
			// 	data:data[0],
			// 	msg:'data found'
			// })
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

});

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

//26-aug-2021           
app.post('/admin/updateSchedule',async (req,res)=>{

	let JM_ID=parseInt(req.body.JM_ID);
	let EM_Title=req.body.EM_Title;
	let EM_Desc=req.body.EM_Desc;
	let EM_Mail_Text=req.body.EM_Mail_Text;
	let EM_Duration=parseInt(req.body.EM_Duration);
	let EM_Plan_Days=parseInt(req.body.EM_Plan_Days);
	let EM_Price=req.body.EM_Price;
	let days=JSON.parse(req.body.days);
	



	
	if(typeof JM_ID=='undefined' 
	|| typeof EM_Title=='undefined' 
	|| typeof EM_Desc=='undefined' 
	|| typeof EM_Mail_Text=='undefined' 
	|| typeof EM_Duration=='undefined' 
	|| typeof EM_Price=='undefined' 
	|| typeof days=='undefined' 
	)
	{
		res.json({
			status:0,msg:'undefined params'
		})
		return false;
	}

	JM_ID=await check_IntegerValue(JM_ID);

	//console.log(req.body)
	let ESC_Day_ID=0;
	let ES_EM_ID=req.body.ES_EM_ID;
	ES_EM_ID=await check_IntegerValue(ES_EM_ID);



	if(JM_ID ==0 && ES_EM_ID==0)
	{
		res.json({
			status:0,
			msg:'param missing'
		})
		return false;
	}
	
	if(ES_EM_ID > 0 || JM_ID > 0)
	{
		let q="SELECT *  from direct_access_master_user da inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and da.DA_ID="+ES_EM_ID+" and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0 ;";
	
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
		{
			res.json({status:0,msg:'not authorized to update'});
			return false;
		}
	
	}


	
	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;
	var DA_Suggested_Amont=req.body.DA_Suggested_Amont;

	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	if( typeof DA_Suggested_Amont=='undefined' || isNaN(DA_Suggested_Amont)  || DA_Suggested_Amont==null)
	{
		DA_Suggested_Amont=0;
	}




		console.log(req.body)
		console.log("req.files")
		console.log(req.files)

		let imageFile;
		var ext ='';	
		var fileName="";	
		var fileArray=[];	
		var DA_Collection="[]";	


			
	




		if (!req.files) 
		{
          // File does not exist.
     	
					let q="UPDATE direct_access_master_user set DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+", DA_Min_Amount="+DA_Min_Amount+" where DA_ID="+ES_EM_ID;
					const updateResp=await model.sqlPromise(q);
					console.log(updateResp);

        } else 
		{
          // File exists.
         	imageFile = req.files.sampleFile;
			ext = path.extname(imageFile.name);	
			fileName=imageFile.md5+ext;			
			fileArray=[fileName]	
			DA_Collection=JSON.stringify(fileArray);	
			var ProfileName=req.body.JM_User_Profile_Url + "_"+JM_ID;					
			uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
			//var DA_Collection='Profile/' + ProfileName+"/"+fileName;
			imageFile.mv(uploadPath, async function(err) 
			{
				if (err)
					console.log(err);
				else	
				{
					
					let q="UPDATE direct_access_master_user set DA_Collection='"+DA_Collection+"',DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+", DA_Min_Amount="+DA_Min_Amount+" where DA_ID="+ES_EM_ID;
					const updateResp=await model.sqlPromise(q);
					console.log(updateResp);
				}
				   
				
			});

        }




		//EM_Title=connection.escape(EM_Title);	
		//EM_Desc=connection.escape(EM_Desc);
		//EM_Mail_Text=connection.escape(EM_Mail_Text);


		console.log(EM_Title)

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
					console.log("slotInserted  not insertion");
					res.json({
						status:1,msg:'Item is updated successfully.'
				  })
				}
			}
		
	}
	else
	{



              let DA_ID=ES_EM_ID;
              const sql="call archive_event_delete_slot_if_booked_present(?,?,?,?,?,?,?,?)";
              const values=[
                  JM_ID,DA_ID,EM_Title,EM_Desc,EM_Mail_Text,EM_Duration,EM_Plan_Days,EM_Price
              ]

              const data_resp=await call_sp(sql,values);		
              //var query="Select * from event_slots es where  es.ES_Calendar_Date > CURDATE() and  es.ES_EM_ID="+ES_EM_ID+" and es.JM_ID="+JM_ID;
         
              //let n=" DELETE from event_slots es1  where es1.ES_Calendar_Date IN( select DISTINCT b.ES_Calendar_Date from event_slots b WHERE b.ES_Calendar_Date > CURDATE()  and b.ES_Status!=1 and b.ES_EM_ID="+ES_EM_ID+" ) and es1.ES_EM_ID="+ES_EM_ID;




                  const respInsert=await InsertSchedule(days,ES_EM_ID,JM_ID);
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
						console.log("slotInserted  not insertion");
                          res.json({
								status:1,msg:'Item is updated successfully.'
                        })
                      }
                  }
                  else
                  {
                      res.json({
                            status:0,msg:'Nothing to update'
                    })
                  }



           // res.json({
           //     status:0,
           //     msg:'Unable to update,booked slot present'
           // })
           // return false;
	}
})

app.post('/admin/removeVideoCover',async (req,res)=>{

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

		let jsonData=await decryptJsonData(req.body.flag)
		console.log(jsonData)
		if(jsonData==false)
		{
			res.json({status:0,msg:"Invalid data"});
			return false;
		}
		req.body=jsonData;
		
		var DA_ID=req.body.DA_ID;
		if(typeof DA_ID=='undefined' || isNaN(parseInt(DA_ID)) || parseInt(DA_ID)===0)
		{
			res.json({
				status:0
			})
			return false;
		}

		var JM_ID=parseInt(req.headers['id']);
		JM_ID=await check_IntegerValue(JM_ID);
		if(await isCreators_product(JM_ID,DA_ID)==false)
		{
			res.json({status:0,msg:'not authorized to delete'}); return false;
		}
		

		
		let q="UPDATE direct_access_master_user set DA_Collection='"+DA_Collection+"'  where DA_ID="+DA_ID;
		const updateResp=await model.sqlPromise(q);
		
		if(updateResp.affectedRows===1)
		{
			res.json({
				status:1
			})
		}
		else{
			res.json({
				status:0
			})
		}


});


async function bookedSlot(JM_ID,ES_EM_ID)
{
	var query="Select * from event_slots es where es.ES_Status='Booked' and  es.ES_EM_ID="+ES_EM_ID+" and es.JM_ID="+JM_ID;

	var bookedRecords=await model.sqlPromise(query);
	if(bookedRecords!=null && bookedRecords.length > 0)
		return true;
	else
		return false
}

//update slost 28-aug-2021
async function UpdateSlot(duration,days,ES_EM_ID,JM_ID)
{


	
	console.log(days);
	var now = new Date();
	var planDays= now.setDate(now.getDate() + days)
	var today = new Date();
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	var daysOfYear = [];
	let isDone=0;
	for (var d = tomorrow; d <= planDays; d.setDate(d.getDate() + 1)) 
	{
		daysOfYear.push(new Date(d),new Date(d).getDay());
		
		let day = new Date(d).getDay();
  
        var ES_Calendar_Date = new Date(d).toISOString().substr(0,10);
		
		if(day==0)
		  day=7;

		console.log("day num");
		console.log(day);
		console.log("ES_Calendar_Date");
		console.log(ES_Calendar_Date);
		console.log("inside insert slot looooop " + day);

		let sql="SELECT * from event_slots_config where ESC_Day_ID="+day+ " and ESC_EM_ID="+ES_EM_ID+" and JM_ID="+JM_ID ;
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

				var query="SELECT ES_ID,ES_EM_ID,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration,ES_Blocked_Due_To from event_slots where ES_Calendar_Date='"+ES_Calendar_Date+"' and ES_Status='Booked' and ES_EM_ID="+ESC_EM_ID;
				var bookedRecords=await model.sqlPromise(query);
				let bookLen=bookedRecords.length;

				for (let j = ESC_Avail_Start_Time; j < ESC_Avail_End_Time; j+=duration) 
				{
					
						if((ESC_Avail_End_Time - j) < duration) 
						break;

					let ES_Slot_Start=ESC_Avail_Start_Time;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';
					
					if(bookLen == 0)
					{                    
						console.log("inside 1st slot" + ES_Calendar_Date);
						let values = [
							[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
						];
						let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
						const insertSlot=await model.sqlInsert(q,values);	
						isDone++;
					}	
                 	 ESC_Avail_Start_Time=ES_Slot_End;
				}// slot range created
				
                //second schedule
                for (let j = ESC_Avail_Start_Time2; j < ESC_Avail_End_Time2; j+=duration) 
				{
					
					if((ESC_Avail_End_Time2 - j) < duration) 
					  break;


					let ES_Slot_Start=ESC_Avail_Start_Time2;
					let ES_Slot_End= j + duration;				
					let ES_Status='Open';				
					if(bookLen == 0)
					{
						console.log("inside second slot " + ES_Calendar_Date);
						let values = [
							[ESC_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,duration]
						];	
						let q="INSERT INTO event_slots (ES_EM_ID,ES_Calendar_Date,ES_Slot_Start,ES_Slot_End,ES_Status,JM_ID,Duration) VALUES ?";
						const insertSlot=await model.sqlInsert(q,values);	
						isDone++;
					}	
                 	 ESC_Avail_Start_Time2=ES_Slot_End;
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












app.post('/admin/Get_Config',async (req,res)=>{
	

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}


	var DA_ID=parseInt(jsonData.DA_ID);
	var type=parseInt(jsonData.order);

	let ES_EM_ID=parseInt(jsonData.ES_EM_ID);
	let JM_ID=parseInt(jsonData.JM_ID);

	if( typeof ES_EM_ID =='undefined' || ES_EM_ID==0 )
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	
	if( typeof JM_ID =='undefined' || JM_ID==0 )
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}

	const sql="select esc.ESC_ID,esc.ESC_EM_ID,(CASE WHEN esc.ESC_Day_ID=7 THEN 0 ELSE esc.ESC_Day_ID END) as ESC_Day_ID,(SELECT ES_Calendar_Date from event_slots  where ES_EM_ID="+ES_EM_ID+" GROUP BY ES_Calendar_Date LIMIT 1) as cal_start_date, (SELECT ES_Calendar_Date from event_slots  where ES_EM_ID="+ES_EM_ID+" GROUP BY ES_Calendar_Date order by ES_ID DESC LIMIT 1) as cal_end_date  from event_slots_config esc where esc.ESC_EM_ID="+ES_EM_ID+" and esc.JM_ID="+JM_ID;

	const data=await model.sqlPromise(sql);
	if(data!=null && data.length >0)
	{		
		var dbData={
			data:data			                             
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:1,
			flag:flag
		});
		// res.json({
		// 	status:1,data
		// })
	}
	else{

		res.json({
			status:0,msg:'no data found'
		})
		return false;
	
	}
})


//25-jul-2021
//25-jul-2021
app.post('/admin/open_slots',async(req,res)=>{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	
	let ES_EM_ID=parseInt(req.body.ES_EM_ID);
	ES_EM_ID=await check_IntegerValue(ES_EM_ID);

	let ES_Calendar_Date=req.body.date;
	let Duration=req.body.Duration;
	if(ES_EM_ID==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	if(typeof ES_Calendar_Date =='undefined' || ES_Calendar_Date.length==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	
	if(typeof Duration =='undefined' || Duration.length==0)
	{
		res.json({
			status:0,msg:'missing param'
		})
		return false;
	}
	//const sql="select es.ES_ID,es.ES_EM_ID,es.ES_Calendar_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,	CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime,	CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime	from event_slots es where ES_EM_ID="+ES_EM_ID+" and ES_Status='Open' and es.ES_Calendar_Date='"+ES_Calendar_Date+"' and Duration='"+Duration+"';";
	//and es.ES_Slot_Start > HOUR(convert_tz(now(),@@session.time_zone,'+05:30')) * 60 + Minute(convert_tz(now(),@@session.time_zone,'+05:30'))
	

	var minutesToAdd=60;
	var currentDate = new Date();
	var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
	var ES_Slot_Start=futureDate.getHours() * 60 + futureDate.getMinutes();
	console.log(ES_Slot_Start);

	const sql="select es.ES_ID,es.ES_EM_ID,es.ES_Calendar_Date,(HOUR(NOW()) * 60) + minute(NOW()),now(),ADDTIME(CONVERT('2021-09-16' , DATETIME),es.ES_Slot_Start) as DATE_TIME,   es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum, CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime, CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime    from event_slots es where es.ES_EM_ID="+ES_EM_ID+"  and ES_Status='Open' and Duration='"+Duration+"'  and DATE(es.ES_Calendar_Date)='"+ES_Calendar_Date+"'"; // >  (HOUR(NOW()) * 60) + minute(NOW());";
	

	const data=await model.sqlPromise(sql);

	if(data!=null && data.length > 0)
	{

		var dbData={
			data:data			                             
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:1,
			flag:flag
		});
	
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
//26-jul-2021
// order id -- order_HiGzWiS8s6lv8t


app.post('/admin/videoSession',async(req,res)=>{

	const ical = require('ical-generator');
	let cal = ical();
	let cal_follow = ical();


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	
	var premium_url=process.env.PREMIUM_URL;
	var DA_ID=req.body.DA_ID;
	var ES_ID=parseInt(req.body.ES_ID);
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


			//================================================== calculation for tax fee, actual amt
			const result=await fetchPayment(paymentId);
			let amount=0;let fee=0;let tax=0;
			var paymentData=result.data;
			console.log("paymentData")
			console.log(paymentData)
			console.log(paymentData.status)

			if(result.status==0)
			{
				res.json({status:0,err:"invalid id"});
				return false;
			}			
			var Actual_Price=0;

			let creator_get=0;
			if(result.status==1 && paymentData!=null && (paymentData.status=='captured' || paymentData.status=='authorized' ))
			{
				amount=parseFloat(paymentData.amount);
				fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
				tax=parseFloat(paymentData.tax);
				creator_get=(amount - fee) / 100; 
				var expy_get=((amount - fee) * .10) / 100;						
				creator_get=creator_get - expy_get;
				console.log(creator_get)
				fee=fee/100;	
				tax=tax/100;
				Actual_Price=amount/100;
				if(await isValidPayment(paymentId)==false)
				{
					res.json({status:0,err:"invalid payment, you are under attack"});
					return false;
				}



			}     
			BM_Purchase_Amt=Actual_Price;		
			var BM_Purchase_Amt_calculated=creator_get.toFixed(2);
			//================================================== calculation for tax fee, actual amt

					
				console.log("req.body.responseData");
				console.log(req.body.responseData);	
			
				var responseData=req.body.responseData;
				await updateTran(responseData.razorpay_payment_id,'captured',responseData.razorpay_order_id)



				//var jitsee_URL='https://meet.jit.si/expy/'+JM_User_Profile_Url+"-"+BM_ID;
				var randomPassword = Math.random().toString(36).slice(-10);
				var MeetingId=JM_User_Profile_Url+"-"+ES_ID+"-"+randomPassword;
				var premium_url=process.env.BASE_URL+"meet?id="+JM_User_Profile_Url+"-"+ES_ID+"-"+randomPassword;
				var Date_of_session=req.body.session_date;	
				var session_timeing=req.body.session_timeing;

				var date = new Date();		
				let BM_Purchase_Date=date.toISOString().substring(0, 10);




					console.log("ES_ID")
					console.log(ES_ID)
					ES_ID=await check_IntegerValue(ES_ID);
					if(typeof ES_ID=='undefined' || ES_ID == 0)
					{
						res.json({status:0,msg:'invalid es id'});
						return false;
					}

					if(await isVailableSlot_final_step(ES_ID)==false)
					{
						res.json({status:0,msg:'slot not avalaible'});
						return false;
					}




					// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
					// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
					// BM_Email=await removeSpecialChar_email(BM_Email)

					//BM_Instruction=connection.escape(BM_Instruction);	
					//BM_Name=connection.escape(BM_Name);
					BM_Email=await removeSpecialChar_email(BM_Email)
			
			


				const values = [
					[DA_ID,'NA',BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt_calculated,BM_Instruction,Consent,paymentId,Status,BM_FileUrl,MeetingId,ES_ID,LM_ID,fee,tax,Actual_Price]			
				];

				const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,Consent,Payment_ID,Status,BM_FileUrl,BM_Content_Sent,ES_ID,LM_ID,Fee,Tax,Actual_Price) VALUES ?";	 	


				var data=await model.sqlInsert(sql,values);
				if(data.affectedRows > 0)
				{
					let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
					var update_lead=await model.sqlPromise(q);	



					let query="UPDATE event_slots set ES_Status='Booked' where JM_ID="+JM_ID+" and ES_ID="+ES_ID;		
					var update=await model.sqlPromise(query);	
					let ES_EM_ID=data.insertId;
					if(update.affectedRows===1)
					{
						var blocked=await blockSlot(JM_ID,ES_ID,ES_EM_ID);
					}



			
					let made_sale="You made a sale";
					let price=BM_Purchase_Amt;
					let lastText="Video session";
					var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";

					
							

				
			
			//ics file ====================================================================
			var Startdate = Date_of_session;
			var Starttime = session_timeing.split('-')[0];

			var EndDate = Startdate;
			var Endtime = session_timeing.split('-')[1];

		  

			let new_Starttime = Starttime.padStart(8,'0')
			let new_Endtime  = Endtime.padStart(8,'0')

			var momentObj = moment.tz(Startdate +" "+ new_Starttime, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");
			var momentObj2 = moment.tz(EndDate  +" "+ new_Endtime, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");


			console.log(Startdate +" "+ new_Starttime);
			 console.log(EndDate +" "+ new_Endtime);

			console.log(momentObj);
			console.log(momentObj2);

			// conversion
			var dateTime_start = momentObj.format('YYYY-MM-DDTHH:mm');
			var dateTime_end = momentObj2.format('YYYY-MM-DDTHH:mm');

			console.log(dateTime_start);
			console.log(dateTime_end);
			//===================================================== creator ics



			var creatorMessage = 'Hi '+JM_Name+',\nCongratulations! A video session slot has been booked from your Expy Page.' +
			'\n'+BM_Instruction+
			'\nRequest Details:'+
			'\nRequester Name:' +BM_Name+
			'\nRequest Date :' +BM_Purchase_Date+
			'\nExpy Creator Name:' +JM_Name+
			'\nExpy Creator URL: '+process.env.BASE_URL+JM_User_Profile_Url+''+
			'\nRequested Item:'+DA_Title+
			'\nRequested Item Price: ₹ '+BM_Purchase_Amt+
			'\nTo join the video session, please click on the following link:'+
			'\nDate:'+Date_of_session+
			'\nTime:'+session_timeing+
			'\nJoining Link:'+premium_url+
			'\nYour money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.'+
			'\nContinue creating awesome content to keep your followers engaged!'+
			'\nFor any queries, you can write to us at support@expy.bio'+
			'\nRegards,\nTeam Expy\nwww.expy.bio';


		  var options = {
			  start: momentObj,
			  end: momentObj2,
			  timestamp: moment(),
			  summary: DA_Title,
			  title : DA_Title,
			  description : creatorMessage,
			  id : MeetingId, 
			  organiser : {'name' : JM_Name, 'email':JM_Email},
			  location : premium_url
		  }


		  cal.createEvent({
			   start: new Date(options.start),
				  end: new Date(options.end),
				summary: options.summary || options.subject,
				description: options.description || "",
				location: options.location,
				organizer: {
					name: options.organiser.name,
					email: options.organiser.email
				},
				method: 'REQUEST'
			});

				//creators
				//"+newFormatText+"
				var videoMail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<h3> Hi "+JM_Name+",</h3><p> Congratulations! A video session slot has been booked from your Expy Page.</p><p>"+BM_Instruction+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
				mailOptions2 = {
					from: "Expy Team <info@expy.bio>", 
					to: JM_Email,
					subject: "Someone has booked a video session with you on Expy!",
					text: "Thanks for Buying product",										  
					html: videoMail,
					alternatives: [{
						contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
						content:  Buffer.from(cal.toString())
					}]
				}

			
				//===================================================== followers ics

					var  followerMessage = 'Hi '+BM_Name+',\nCongratulations! Your Video Session Request with '+JM_Name+' has been booked.' +
					'\n'+BM_Instruction+
					'\nRequest Details:'+
					'\nRequester Name:' +BM_Name+
					'\nRequest Date :' +BM_Purchase_Date+
					'\nExpy Creator Name:' +JM_Name+
					'\nExpy Creator URL: '+process.env.BASE_URL+JM_User_Profile_Url+''+
					'\nRequested Item:'+DA_Title+
					'\nRequested Item Price: ₹ '+BM_Purchase_Amt+
					'\nTo join the video session, please click on the following link:'+
					'\nDate:'+Date_of_session+
					'\nTime:'+session_timeing+
					'\nJoining Link:'+premium_url+
					'\nYour money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.'+
					'\nContinue creating awesome content to keep your followers engaged!'+
					'\nFor any queries, you can write to us at support@expy.bio'+
					'\nRegards,\nTeam Expy\nwww.expy.bio';

					var options_follower = {
						start: momentObj,
						end: momentObj2,
						timestamp: moment(),
						summary: DA_Title,
						title : DA_Title,
						description : followerMessage,
						id : MeetingId, 
						organiser : {'name' : JM_Name, 'email':JM_Email},
						location : premium_url
					}


					cal_follow.createEvent({
						start: new Date(options_follower.start),
							end: new Date(options_follower.end),
						summary: options_follower.summary || options_follower.subject,
						description: options_follower.description || "",
						location: options_follower.location,
						organizer: {
							name: options_follower.organiser.name,
							email: options_follower.organiser.email
						},
						method: 'REQUEST'
					});

					//follower
				var mailOptions = {   
						from: "Expy Team <info@expy.bio>",  
						to:BM_Email,   
						subject: "Video session booked on Expy!",
						html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Video Session Request with "+JM_Name+" has been booked.</p><p>"+mailText+".</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
						alternatives: [{
							contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
							content:  Buffer.from(cal_follow.toString())
						}]

					};



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
	



async function blockSlot(JM_ID,ES_ID,ES_EM_ID)
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
							((ES_Slot_Start <= bookedRecords[k].ES_Slot_Start) && (ES_Slot_End >= bookedRecords[k].ES_Slot_End))
							|| 
							(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start && bookedRecords[k].ES_Slot_End > ES_Slot_Start  && bookedRecords[k].ES_Slot_End <=ES_Slot_End)
							||
							(bookedRecords[k].ES_Slot_Start >=ES_Slot_Start && bookedRecords[k].ES_Slot_Start < ES_Slot_End && bookedRecords[k].ES_Slot_End >=ES_Slot_End)
                            ||
							(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start &&  bookedRecords[k].ES_Slot_End >= ES_Slot_End)
							
							//inRange(ES_Slot_Start,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End)==true || 
                             // inRange(ES_Slot_End,bookedRecords[k].ES_Slot_Start, bookedRecords[k].ES_Slot_End) ==true  
                       ) 
                      {
                          ES_Status='Blocked';

                           var query="UPDATE event_slots set ES_Status='"+ES_Status+"',ES_Blocked_Due_To="+ES_EM_ID+" where JM_ID="+JM_ID+" and ES_ID="+event_id ;
                         var updateRecord=await model.sqlPromise(query);                     

                      }	                     
					  
                  }   
                                                                                                                      	
					isDone++;
				}

			}
	}
}

async function unblockSlot(JM_ID,ES_ID,BM_ID)
{
  let query="UPDATE event_slots set ES_Status='Open' where JM_ID="+JM_ID+" and ES_ID="+ES_ID;		
  var update=await model.sqlPromise(query);	
  if(update.affectedRows==1)
  {
	  let sql="Update event_slots set ES_Status='Open' where ES_Status='Blocked' and ES_Blocked_Due_To="+BM_ID;
	  //let sql="Select ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where ES_Status='Blocked' and JM_ID="+JM_ID+" and ES_ID="+ES_ID;
	  const data1=await model.sqlPromise(sql);let isDone=0;
  
  }

   let q="Select ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where  JM_ID="+JM_ID+" and ES_ID="+ES_ID;
  	const data=await model.sqlPromise(q);let isDone=0;
	if(data!=null && data.length > 0)
	{
			console.log("data");
			console.log(data);
		
			let ES_Slot_Start = data[0].ES_Slot_Start;
			let ES_Slot_End = data[0].ES_Slot_End;
			let ES_Calendar_Date = data[0].ES_Calendar_Date;
			var query1="SELECT ES_ID,ES_Slot_Start,ES_Slot_End,DATE_FORMAT(ES_Calendar_Date,'%Y-%m-%d') AS ES_Calendar_Date from event_slots where ES_Status='Blocked' and JM_ID="+JM_ID+" and DATE(ES_Calendar_Date)='"+ES_Calendar_Date+"'" ;
			console.log("query");
			console.log(query);
			var bookedRecords=await model.sqlPromise(query1);
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
										((ES_Slot_Start <= bookedRecords[k].ES_Slot_Start) && (ES_Slot_End >= bookedRecords[k].ES_Slot_End))
										|| 
										(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start && bookedRecords[k].ES_Slot_End > ES_Slot_Start  && bookedRecords[k].ES_Slot_End <=ES_Slot_End)
										||
										(bookedRecords[k].ES_Slot_Start >=ES_Slot_Start && bookedRecords[k].ES_Slot_Start < ES_Slot_End && bookedRecords[k].ES_Slot_End >=ES_Slot_End)
										||
										(bookedRecords[k].ES_Slot_Start<=ES_Slot_Start &&  bookedRecords[k].ES_Slot_End >= ES_Slot_End)
										
										
									) 
									{
										ES_Status='Open';

										var query2="UPDATE event_slots set ES_Status='"+ES_Status+"' where JM_ID="+JM_ID+" and ES_ID="+event_id ;
									var updateRecord=await model.sqlPromise(query2);                     

									}	
						}   
																															
					isDone++;
				}

			}
	}
}


app.post('/admin/video_rq_complete',async (req,res)=>{

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


			let response=await validDateforComplete(ES_ID);
			if(response==false)
			{
				res.json({status:2,msg:"unable to complete"});
				return false;
			}


			var mailOptions2 = {   
				from: "Expy Team <info@expy.bio>",  
				to:to,   
				subject: "Hooray! Your Expy Request is Delivered!",  
				html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Request was fulfilled by "+JM_Name+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>   <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
				
			};

			let sql = "UPDATE buyers_master SET  Status='C', BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
            let query = connection.query(sql, async (err, results) => 
			{
                if(err) 
                {
                    console.log(err);
                    res.json({status:0,msg:"err"});
                }
                else
                {
                    var resp=await wrapedSendMailInfo(mailOptions2);
                    let msg="Congrats "+BM_Name+" Your request was fulfilled by "+JM_Name+" on Expy. We have emailed you the download link. Thank you.";
                    var isSentSMS=await sendSMS(BM_Phone,msg);								
                    res.json({status:1,msg:'done',bode:[]});	
                }	
          });

})

async function validDateforComplete(ES_ID)
{

	var query="Select * from event_slots es where es.ES_Status='Booked' and  es.ES_ID="+ES_ID+" and DATE(es.ES_Calendar_Date)=CURDATE();";
	var valid=await model.sqlPromise(query);
	if(valid!=null && valid.length > 0)
		return true; // do complete
	else 
		return false; // do no complete
}

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




	const ical = require('ical-generator');
	let cal = ical();
	let cal_follow = ical();



	let DA_ID=parseInt(req.body.DA_ID);
	DA_ID=await check_IntegerValue(DA_ID);
	let JM_ID=parseInt(req.headers['id']);
	JM_ID=await check_IntegerValue(JM_ID);

	if(DA_ID==0)
	{
		res.json({status:0,msg:'empty param'}); return false;
	}

	if(await isCreators_product(JM_ID,DA_ID)==false)
	{
		res.json({status:0,msg:'not authorized to delete'}); return false;
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


//authorization
//authorization
async function API_Authorization(JM_ID,authorization,req)
{	
	try{

		if(typeof authorization=='undefined' || authorization =='' || authorization.length==0)
		{
		
			return false;
		}
		if(typeof JM_ID =='undefined' || isNaN(parseInt(JM_ID))==true || parseInt(JM_ID) == 0)
		{
			return false;
		}

		if(
			req._parsedUrl.pathname == '/admin/updateProfileNameDescription' 
			|| req._parsedUrl.pathname == '/admin/Update_ReferralCode'
			|| req._parsedUrl.pathname == '/admin/createContact'
			|| req._parsedUrl.pathname == '/admin/userDetailsAll'
			|| req._parsedUrl.pathname === '/admin/GetAllRequest' 		
			|| req._parsedUrl.pathname === '/admin/userDetailsAllSettings' 
			|| req._parsedUrl.pathname === '/admin/createContact'
			|| req._parsedUrl.pathname === '/admin/UpdatePayoutDetails'
			|| req._parsedUrl.pathname === '/admin/updatePassword'
			|| req._parsedUrl.pathname === '/admin/updateProfileSettings'
		
			|| req._parsedUrl.pathname === '/admin/updatePhone'		
			|| req._parsedUrl.pathname === '/admin/ValidateURL_Profile'
			|| req._parsedUrl.pathname === '/admin/changeUrlByAdmin'
			|| req._parsedUrl.pathname === '/admin/deleteContest'
		
		
			|| req._parsedUrl.pathname === '/admin/removeBackgroundImage' 
			|| req._parsedUrl.pathname === '/admin/uploadBackgroundImage' 
			|| req._parsedUrl.pathname === '/admin/addImageCarousel' 
			|| req._parsedUrl.pathname === '/admin/updateNofityPref' 
			|| req._parsedUrl.pathname === '/admin/updateImageCarousel' 
			|| req._parsedUrl.pathname === '/admin/updateStepStatus' 
			|| req._parsedUrl.pathname === '/admin/createSchedule' 
			|| req._parsedUrl.pathname === '/admin/updateSchedule' 			
			|| req._parsedUrl.pathname === '/admin/deleteCategory' 
			|| req._parsedUrl.pathname === '/admin/AddCategory' 
			|| req._parsedUrl.pathname === '/admin/UpdateCategory'
			|| req._parsedUrl.pathname === '/admin/InsertEmbedContent' 	
			|| req._parsedUrl.pathname === '/admin/InsertLink' 	
			|| req._parsedUrl.pathname === '/admin/updateActiveNewsLetter'
			|| req._parsedUrl.pathname === '/admin/updateActiveVartualGift'
			|| req._parsedUrl.pathname === '/admin/profileImageFromProfile'
			|| req._parsedUrl.pathname === '/admin/addProduct' 		
			||  req._parsedUrl.pathname === '/admin/updateProduct'
			||  req._parsedUrl.pathname === '/admin/addContest'
			||  req._parsedUrl.pathname === '/admin/updateContest'
			
			
		)
		{
			var id=parseInt(req.body.JM_ID); 
			if(typeof id =='undefined' || isNaN(id)==true || id == 0)
			{
				return false;
			}

				let sql="Select JM_ID,TM_Token from token_master where JM_ID="+id;
			var data=await model.sqlPromise(sql);		
			if(data!=null && data.length > 0)	
			{
				//console.log("here==>" + data[0].TM_Token)
				//console.log("authorization==>" +authorization)			
				if(data[0].TM_Token==authorization && data[0].JM_ID==JM_ID)
					return true;
				else
					return false;
			}	
			else
              return false;
		}
		else if( req._parsedUrl.pathname === '/admin/refund' 
		||  req._parsedUrl.pathname === '/admin/declinedFree'
		||  req._parsedUrl.pathname === '/admin/declineRequest2Admin'			
		)
		{
			if(typeof req.body.flag=='undefined' || req.body.flag==null)
			{
				res.json({status:0,msg:"Invalid key"});
				return false;
			}

			let jsonData=await decryptJsonData(req.body.flag)
			console.log(jsonData)
			if(jsonData==false)
			{
				res.json({status:0,msg:"Invalid data"});
				return false;
			}
			req.body=jsonData;

			
			var id=parseInt(req.body.data.JM_ID); 
			if(typeof id =='undefined' || isNaN(id)==true || id == 0)
			{
				return false;
			}

			let sql="Select JM_ID,TM_Token from token_master where JM_ID="+id;
			var data=await model.sqlPromise(sql);		
			if(data!=null && data.length > 0)	
			{					
				if(data[0].TM_Token==authorization && data[0].JM_ID==JM_ID)
					return true;
				else
					return false;
			}	
			else
              return false;
		}		
		else if(req._parsedUrl.pathname === '/admin/updateDefaultTheme' 
		||  req._parsedUrl.pathname === '/admin/addProductNoFile' 
		||  req._parsedUrl.pathname === '/admin/contestReport'
		|| req._parsedUrl.pathname === '/admin/setWinner'
	
		)
		{
			if(typeof req.body.flag=='undefined' || req.body.flag==null)
			{
				res.json({status:0,msg:"Invalid key"});
				return false;
			}

			let jsonData=await decryptJsonData(req.body.flag)
			console.log(jsonData)
			if(jsonData==false)
			{
				res.json({status:0,msg:"Invalid data"});
				return false;
			}
			req.body=jsonData;
			var id=parseInt(req.body.JM_ID); 
			if(typeof id =='undefined' || isNaN(id)==true || id == 0)
			{
				return false;
			}

			let sql="Select JM_ID,TM_Token from token_master where JM_ID="+id;
			var data=await model.sqlPromise(sql);		
			if(data!=null && data.length > 0)	
			{
				//console.log("here==>" + data[0].TM_Token)
				//console.log("authorization==>" +authorization)			
				if(data[0].TM_Token==authorization && data[0].JM_ID==JM_ID)
					return true;
				else
					return false;
			}	
			else
              return false;
		}
		else if(
			req._parsedUrl.pathname === '/admin/updateEmail'
			|| req._parsedUrl.pathname === '/admin/ValidateEmail_after_login'
			|| req._parsedUrl.pathname === '/admin/GetAllRequest_by_status'
			||  req._parsedUrl.pathname === '/admin/updateRequestStat'
			)
		{

						
				if(typeof req.body.flag=='undefined' || req.body.flag==null)
				{
					res.json({status:0,msg:"Invalid key"});
					return false;
				}
				let jsonData=await decryptJsonData(req.body.flag)
				if(jsonData==false)
				{
					res.json({status:0,msg:"Invalid data"});
					return false;
				}
				req.body=jsonData;
			
			var id=parseInt(req.body.JM_ID); 
			if(typeof id =='undefined' || isNaN(id)==true || id == 0)
			{
				return false;
			}

			let sql="Select JM_ID,TM_Token from token_master where JM_ID="+id;
			var data=await model.sqlPromise(sql);		
			if(data!=null && data.length > 0)	
			{					
				if(data[0].TM_Token==authorization && data[0].JM_ID==JM_ID)
					return true;
				else
					return false;
			}	
			else
              return false;
		}
		else
		{
			let sql="Select JM_ID,TM_Token from token_master where TM_Token='"+authorization+"' and JM_ID="+JM_ID;
			var data=await model.sqlPromise(sql);		
			if(data!=null && data.length > 0)		
				return true;
			else
				return false;

		}

	}catch(e)
	{
		console.log("exception in API_Authorization");
		return false;
	}
	
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
		let sql = "UPDATE token_master SET  TM_Token='"+TM_Token+"',Modified_Date=NOW() WHERE JM_ID="+JM_ID;

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


		// console.log(data[0].TM_Token)
		// return data[0].TM_Token;

		const token=await addToken(JM_ID);
		return token;

	
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

var CryptoJS = require("crypto-js");
async function jsonEncrypt(data)
{
	var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'ae25e95570a100bc69d3b44fe1124773').toString();
	return ciphertext;
}


//=====================================================================







//04-aug-2021  ======================================== contest


app.post('/admin/addContestNoFile',async function(req,res){


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	
	var DA_DA_ID=req.body.DA_DA_ID;
	var JM_ID=req.body.JM_ID;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var DA_Price=parseInt(req.body.DA_Price);

	var DA_Type='NA';
	var Q1=req.body.Q1;
	var Q2=req.body.Q2;
	var Q3=req.body.Q3;
	var Q4=req.body.Q4;
	var File_Upload=req.body.File_Upload;
	var File_upload_text=req.body.File_upload_text;



	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;


	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	
		
	if( typeof DA_Type=='undefined')
	{
		res.json({status:0,msg:"no file"});
		return false;
	}

	if( typeof Q1=='undefined')
	{
		Q1="";
	}
	if( typeof Q2=='undefined')
	{
		Q2="";
	}
	if( typeof Q3=='undefined')
	{
		Q3="";
	}
	if( typeof Q4=='undefined')
	{
		Q4="";
	}


	DA_Allow_Cust_Pay=await check_IntegerValue(DA_Allow_Cust_Pay);
	if(DA_Allow_Cust_Pay!=0 && DA_Allow_Cust_Pay!=1) //1
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	DA_Price=await check_IntegerValue(DA_Price);
	if(DA_Price > 0) //1
	{
		DA_Min_Amount=0;DA_Allow_Cust_Pay=0;	
	}
	if(DA_Min_Amount > 0) //1
	{
		DA_Price=0;	DA_Allow_Cust_Pay=1;	
	}
	DA_DA_ID=await check_IntegerValue(DA_DA_ID);
	if(DA_DA_ID!=6 ) //1
	{
		res.json({status:0,msg:"invalid product"});
		return false;
	}
	
				var fileName="thankYou.jpg";
				var fileArray=[fileName];
				var DA_Collection=JSON.stringify(fileArray);

			 
				
				// DA_Title=connection.escape(DA_Title);
				// DA_Description=connection.escape(DA_Description);
				// Q1=connection.escape(Q1);
				// Q2=connection.escape(Q2);
				// Q3=connection.escape(Q3);
				// Q4=connection.escape(Q4);
				// File_upload_text=connection.escape(File_upload_text);
			




					  const values = [
						  [DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount]
					  ];
					  const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount) VALUES ?";	  

					const query = connection.query(sal, [values], function(err, result)
					{
                        if (err) 
                        {                           
                            res.json({status:0,msg:"err in query"});
                        }
                        else
                        {			
                            res.json({status:1,msg:'Done'});
                        }	
					});
					
					//res.json({status:0,msg:"err",sql:"sal",body:req.body,values:values});
});



app.post('/admin/addContest',async function(req,res){

	let videoFile,imageFile,coverFile,album;
	let uploadPath;
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;

	const respond=await Creators_Specific_Details(JM_ID);
	console.log(respond)
	if(respond.status==1)
	{
		ProfileName=respond.Creators[0].JM_User_Profile_Url_plus_JM_ID;	
	}



	var DA_Cover=req.body.DA_Cover;
	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	
	var DA_Price=parseInt(req.body.DA_Price);
	var DA_Type=req.body.DA_Type;
	var DA_DA_ID=req.body.DA_DA_ID;

	var Q1=req.body.Q1;
	var Q2=req.body.Q2;
	var Q3=req.body.Q3;
	var Q4=req.body.Q4;
	var File_Upload=req.body.File_Upload;

	var File_upload_text=req.body.File_upload_text;

	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;




	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	

	if( typeof DA_Type=='undefined')
	{
		res.json({status:0,msg:"no file"});
		return false;
	}
	if( DA_Type!='image' &&  DA_Type!='video'  )
	{
		res.json({status:0,msg:"invlid product type"});
		return false;
	}

	if( typeof Q1=='undefined')
	{
		Q1="";
	}
	if( typeof Q2=='undefined')
	{
		Q2="";
	}
	if( typeof Q3=='undefined')
	{
		Q3="";
	}
	if( typeof Q4=='undefined')
	{
		Q4="";
	}


	DA_Allow_Cust_Pay=await check_IntegerValue(DA_Allow_Cust_Pay);
	if(DA_Allow_Cust_Pay!=0 && DA_Allow_Cust_Pay!=1) //1
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	DA_Price=await check_IntegerValue(DA_Price);
	if(DA_Price > 0) //1
	{
		DA_Min_Amount=0;DA_Allow_Cust_Pay=0;	
	}
	if(DA_Min_Amount > 0) //1
	{
		DA_Price=0;	DA_Allow_Cust_Pay=1;	
	}
	DA_DA_ID=await check_IntegerValue(DA_DA_ID);
	if(DA_DA_ID!=6 ) //1
	{
		res.json({status:0,msg:"invalid product"});
		return false;
	}



	// DA_Title=connection.escape(DA_Title);
	// DA_Description=connection.escape(DA_Description);
	// Q1=connection.escape(Q1);
	// Q2=connection.escape(Q2);
	// Q3=connection.escape(Q3);
	// Q4=connection.escape(Q4);
	// File_upload_text=connection.escape(File_upload_text);

	var fileName="";
	
	if (!req.files || Object.keys(req.files).length === 0) 
	{		
 					var DA_Collection="[]";		
					  const values = [
						  [DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,"",DA_Price,"[]",Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount]
					  ];
					  const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount) VALUES ?";	  

					const query = connection.query(sal, [values], async function(err, result)
					{
                        if (err) 
                        {
                           
							res.json({status:0,msg:"err in query"});
                        }
                        else
                        {			
                            res.json({status:1,msg:'Done'});

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
					[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount]
				];
				const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_Upload,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount) VALUES ?";	  
				
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
										res.json({status:0,msg:'failed'});
								else	
								{
									console.log("success");
									res.json({status:1,msg:'Done'});

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
						[DA_DA_ID,DA_Type,JM_ID,DA_Title, DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount]  
					];
					const sal = "INSERT INTO direct_access_master_user(DA_DA_ID,DA_Type,JM_ID,DA_Title,DA_Description,DA_Cover,DA_Price,DA_Collection,Q1,Q2,Q3,Q4,File_upload_text,DA_Allow_Cust_Pay,DA_Min_Amount) VALUES ?";	  
					
					
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

												res.json({status:1,msg:'Done'});
										
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
                                            
        
	}

});



app.post('/admin/updateContest',async function(req,res){



	


	let videoFile,imageFile,coverFile,album;
	let uploadPath;
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;

	const respond=await Creators_Specific_Details(JM_ID);
	console.log(respond)
	if(respond.status==1)
	{
		ProfileName=respond.Creators[0].JM_User_Profile_Url_plus_JM_ID;	
	}







	var DA_Type=req.body.DA_Type;

	var DA_ID=parseInt(req.body.DA_ID);
	DA_ID=await check_IntegerValue(DA_ID);

	var DA_Title=req.body.DA_Title;
	var DA_Description=req.body.DA_Description;	

	var DA_Price=parseInt(req.body.DA_Price);	
	var DA_DA_ID=parseInt(req.body.DA_DA_ID);

	var Q1=req.body.Q1;
	var Q2=req.body.Q2;
	var Q3=req.body.Q3;
	var Q4=req.body.Q4;
	var File_Upload=req.body.File_Upload;
	var File_upload_text=req.body.File_upload_text;

	
	var DA_Allow_Cust_Pay=parseInt(req.body.DA_Allow_Cust_Pay);
	var DA_Min_Amount=req.body.DA_Min_Amount;


	if( typeof DA_Allow_Cust_Pay=='undefined' || isNaN(DA_Allow_Cust_Pay) || DA_Allow_Cust_Pay==null )
	{
		DA_Allow_Cust_Pay=0;
	}
	if( typeof DA_Min_Amount=='undefined' || isNaN(DA_Min_Amount) || DA_Min_Amount==null )
	{
		DA_Min_Amount=0;
	}
	



	if( typeof Q1=='undefined')
	{
		Q1="";
	}
	if( typeof Q2=='undefined')
	{
		Q2="";
	}
	if( typeof Q3=='undefined')
	{
		Q3="";
	}
	if( typeof Q4=='undefined')
	{
		Q4="";
	}


	DA_Allow_Cust_Pay=await check_IntegerValue(DA_Allow_Cust_Pay);
	if(DA_Allow_Cust_Pay!=0 && DA_Allow_Cust_Pay!=1) //1
	{
		res.json({status:0,msg:"wrong value"});
		return false;
	}
	DA_Price=await check_IntegerValue(DA_Price);

	// if(DA_Price > 0) //1
	// {
	// 	DA_Min_Amount=0;DA_Allow_Cust_Pay=0;	
	// }
	// if(DA_Min_Amount > 0) //1
	// {
	// 	DA_Price=0;	DA_Allow_Cust_Pay=1;	
	// }


	DA_DA_ID=await check_IntegerValue(DA_DA_ID);
	if(DA_DA_ID!=6 ) //1
	{
		res.json({status:0,msg:"invalid product"});
		return false;
	}



	DA_Title=connection.escape(DA_Title);
	DA_Description=connection.escape(DA_Description);
	Q1=connection.escape(Q1);
	Q2=connection.escape(Q2);
	Q3=connection.escape(Q3);
	Q4=connection.escape(Q4);
	File_upload_text=connection.escape(File_upload_text);

	var fileName="";
	
	if (!req.files || Object.keys(req.files).length === 0) 
	{		
		
		
			let sql = "UPDATE direct_access_master_user SET  DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+", Q1="+Q1+",Q2="+Q2+",Q3="+Q3+",Q4="+Q4+",File_Upload="+File_Upload+",File_upload_text="+File_upload_text+",DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+"  WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
  
			let query = connection.query(sql, (err, results) => {
				if(err) 
				{
					console.log(err);
					res.json({status:0,msg:"err"});
				}
				else
				{
					res.json({status:1,msg:'Profile is Updated'});
				}	
			});
	}
	else
	{	
		if( typeof DA_Type=='undefined')
		{
			res.json({status:0,msg:"no file"});
			return false;
		}
		if( DA_Type!='image' &&  DA_Type!='video'  )
		{
			res.json({status:0,msg:"invlid product type"});
			return false;
		}

		if(DA_DA_ID==6)
		{
			
						let videoFile = req.files.sampleFile;
						var ext = path.extname(videoFile.name);	
						fileName=videoFile.md5+ext;
						var fileArray=[fileName]
						var DA_Collection=JSON.stringify(fileArray);
						console.log(DA_Collection)
						
						let sql = "UPDATE direct_access_master_user SET DA_Type='"+DA_Type+"', DA_Title="+DA_Title+",DA_Description="+DA_Description+",DA_Price="+DA_Price+", DA_Collection='"+DA_Collection+"',Q1="+Q1+",Q2="+Q2+",Q3="+Q3+",Q4="+Q4+",File_Upload="+File_Upload+",File_upload_text="+File_upload_text+",DA_Allow_Cust_Pay="+DA_Allow_Cust_Pay+",DA_Min_Amount="+DA_Min_Amount+"     WHERE DA_ID="+DA_ID+" and JM_ID="+JM_ID;
			
						let query = connection.query(sql, (err, results) => {
							if(err) 
							{
								console.log(err);
								res.json({status:0,msg:"err"});
							}
							else
							{
													
								uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
								var DA_Collection='Profile/' + ProfileName+"/"+fileName;
								videoFile.mv(uploadPath, function(err) 
								{
									if (err)
											res.json({status:0,msg:'failed'});
									else	
									{
										console.log("success");

									
										res.json({status:1,msg:'Done'});

									}
								});
								
								
							}	
						});
					
			
			  
		}
		else
		{

			res.json({status:0,msg:'error'});
		}	
		
	}

});





app.post('/admin/addFollowerContest',async function(req,res){



	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	console.log(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	console.log(req.files)

//====================================



	let crsf_id=req.headers['token'];
	let Payment_Id=req.body.Payment_Id;
	let LM_ID=req.body.LM_ID;


	console.log(req.headers)
	console.log(req.body)
	
	if(typeof LM_ID=='undefined' || isNaN(LM_ID))
	{
		LM_ID=0;
		res.json({status:0,err:"invalid lid"});
		return false;
	}
	if(typeof Payment_Id=='undefined' || Payment_Id.length ==0)
	{
		res.json({status:0,err:"invalid pid"});
		return false;
	}

	let sampleFile;
	let uploadPath;
	var DA_ID=parseInt(req.body.DA_ID);
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var CM_Name=req.body.CM_Name;
	var CM_Email=req.body.CM_Email;
	var CM_A1=req.body.CM_A1;	
	var CM_A2=req.body.CM_A2;
	var CM_A3=req.body.CM_A3;
	var CM_A4=req.body.CM_A4;
	var JM_Name=req.body.JM_Name;
	var JM_Email=req.body.JM_Email;
	
	var CM_Phone=req.body.CM_Phone;
	var Consent=req.body.Consent;

	if(typeof JM_Email=='undefined' || JM_Email.length ==0)
	{
		res.json({status:0,err:"invalid cm"});
		return false;
	}
	if(typeof CM_Email=='undefined' || CM_Email.length ==0)
	{
		res.json({status:0,err:"invalid fm"});
		return false;
	}

	// check this email id already exists for this contest or not if not then allow else not allowed
	

	if(await check_IntegerValue(DA_ID)==0)
	{
		console.log("DA_ID")
		res.json({status:0,msg:'invalid params'})
		return false;
	}


	if(await email_Already_inContest(CM_Email,DA_ID)==false)
	{	
		res.json({status:0,msg:'email already in this contest '});
		return false;

	}

		





	var JM_Phone=req.body.JM_Phone;
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;	
	var BM_Purchase_Amt=parseFloat(req.body.CM_Amount);





		
			//================================================== calculation for tax fee, actual amt
			const result=await fetchPayment(Payment_Id);
			let amount=0;let fee=0;let tax=0;
			var paymentData=result.data;
			console.log("paymentData")
			console.log(paymentData)
			console.log(paymentData.status)


			if(result.status==0)
			{
				res.json({status:0,err:"invalid id"});
				return false;
			}			


			
			let creator_get=0;
			if(result.status==1 && paymentData!=null && (paymentData.status=='captured' || paymentData.status=='authorized' ))
			{
				amount=parseFloat(paymentData.amount);
				fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
				tax=parseFloat(paymentData.tax);
				creator_get=(amount - fee) / 100; 
				var expy_get=((amount - fee) * .10) / 100;						
				creator_get=creator_get - expy_get;
				console.log(creator_get)
				fee=fee/100;	
				tax=tax/100;

				if(await isValidPayment_Contest(Payment_Id)==false)
				{
					res.json({status:0,err:"invalid payment, you are under attack"});
					return false;
				}
			}     
	
			var Actual_Price=amount/100;
			BM_Purchase_Amt=Actual_Price;
			var BM_Purchase_Amt_calculated=creator_get.toFixed(2);
			//================================================== calculation for tax fee, actual amt
			console.log("req.body.responseData");
			console.log(req.body.responseData);	
			var responseData=JSON.parse(req.body.responseData);	
			await updateTran(responseData.razorpay_payment_id,'captured',responseData.razorpay_order_id)
	
	





	if(
		parseInt(DA_ID)==0 || parseInt(JM_ID)==0 || JM_User_Profile_Url.length ==0 	
		|| ProfileName.length ==0 || CM_Name.length==0
		|| JM_User_Profile_Url.length ==0 || CM_Email.length==0
		||  JM_Email.length ==0 || JM_Name.length==0
	)
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	var datetime = new Date();
	var purchased_date=datetime.toISOString().slice(0,10);
	var contestTitle=req.body.dataTitle;
	
	var mailOptions = {   
							from: "Expy Team <info@expy.bio>",  
                              to:CM_Email,   
                              subject: "Contest Participation Successful on Expy!",  
                              html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+CM_Name+",</h3><p>Thanks for your participation in the "+contestTitle+" of "+JM_Name+"</p>     <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>   <p>You will receive further updates from "+JM_Name+" via email about the contest.</p>   <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                                  <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
							
						};

	var mailOptions2 = {   
							from: "Expy Team <info@expy.bio>",  
                              to:JM_Email,   
                              subject: "Someone has joined your contest/giveaway on Expy!",  
                              html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p>Congratulations! Someone has signed up to participate in your contest / giveaway from your Expy Page.</p>  <span> Participant Details :</span><br/> <span>Participant Name: "+CM_Name+"</span><br/>   <span>Participation Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+contestTitle+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>       <p>To view submission responses to your contest questions, <a href='"+process.env.BASE_URL+"me'>please click here</a></p><p>Continue creating awesome content to keep your followers engaged!</p>                                  <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
							
						};



					
						// CM_Name=await removeSpecialChar_withSpace(CM_Name);	
						// CM_Email=await removeSpecialChar_email(CM_Email);
						// CM_A1=await removeSpecialChar_withSpace(CM_A1);
						// CM_A2=await removeSpecialChar_withSpace(CM_A2);
						// CM_A3=await removeSpecialChar_withSpace(CM_A3);
						// CM_A4=await removeSpecialChar_withSpace(CM_A4);


						//CM_Name=connection.escape(CM_Name);
						CM_Email=await removeSpecialChar_email(CM_Email);
						//CM_A1=connection.escape(CM_A1);
						//CM_A2=connection.escape(CM_A2);
						//CM_A3=connection.escape(CM_A3);
						//CM_A4=connection.escape(CM_A4);
					


	if (!req.files || Object.keys(req.files).length === 0) 
	{		
 				
	
		
		const values = [
			[DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,'',Payment_Id,LM_ID,BM_Purchase_Amt_calculated,fee,tax,Actual_Price,CM_Phone,Consent]
		];
		let sal = "INSERT INTO contest_master(DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,CM_Amount,Fee,Tax,Actual_Price,CM_Phone,Consent) VALUES ?";	  
		
		
		let inserted=await model.sqlInsert(sal,values)						
		if(inserted.affectedRows==1)
		{
		
			
			if(LM_ID > 0)
			{
				let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
				var update_lead=await model.sqlPromise(q);	
			}

							let resp=await wrapedSendMailInfo(mailOptions)
							let resp2=await wrapedSendMailInfo(mailOptions2)
							res.json({status:1,msg:'no file inserted Done'});
		}
		else
		{
			res.json({status:0,msg:'no file not inserted'});
		}
              
	}
	else
	{

			let videoFile = req.files.sampleFile;
			var ext = path.extname(videoFile.name);	
			let fileName=videoFile.md5+ext;			

			console.log(fileName)							
					
			uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
			var CM_File='Profile/' + ProfileName+"/"+fileName;
			videoFile.mv(uploadPath, async function(err) 
			{
				if (err)
						res.json({status:0,msg:'failed'});
				else	
				{
					const values = [
						[DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,BM_Purchase_Amt_calculated,fee,tax,Actual_Price,CM_Phone,Consent]
					];
					let sal = "INSERT INTO contest_master(DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,CM_Amount,Fee,Tax,Actual_Price,CM_Phone,Consent) VALUES ?";	  
					
					
					let inserted=await model.sqlInsert(sal,values)						
					if(inserted.affectedRows==1)
					{

						if(LM_ID > 0)
						{
							let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
							var update_lead=await model.sqlPromise(q);	
						}
					

							let resp=await wrapedSendMailInfo(mailOptions)

							let resp2=await wrapedSendMailInfo(mailOptions2)

						res.json({status:1,msg:'file and inserted Done'});
					}
					else
					{
						res.json({status:0,msg:'file done not inserted'});
					}
				}
			});
	
				
	}

});

app.post('/admin/addFollowerContestFree',async function(req,res){
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)
	console.log(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

//====================================






	let crsf_id=req.headers['token'];
	let Payment_Id=req.headers['p'];
	let LM_ID=parseInt(req.headers['l']);


	console.log(req.headers)
	console.log(req.body)
	
	if(typeof LM_ID=='undefined' || isNaN(LM_ID))
	{
		LM_ID=0;
	}




	let sampleFile;
	let uploadPath;
	var DA_ID=parseInt(req.body.DA_ID);
	var JM_ID=req.body.JM_ID;
	var ProfileName=req.body.JM_User_Profile_Url_plus_JM_ID;
	var CM_Name=req.body.CM_Name;
	var CM_Email=req.body.CM_Email;
	var CM_A1=req.body.CM_A1;	
	var CM_A2=req.body.CM_A2;
	var CM_A3=req.body.CM_A3;
	var CM_A4=req.body.CM_A4;
	var JM_Name=req.body.JM_Name;
	var JM_Email=req.body.JM_Email;
	var JM_Phone=req.body.JM_Phone;
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;	
	var BM_Purchase_Amt=parseFloat(req.body.CM_Amount);

	var CM_Phone=req.body.CM_Phone;
	var Consent=req.body.Consent;


	// check this email id already exists for this contest or not if not then allow else not allowed
	if(typeof CM_Email=='undefined' || CM_Email.length ==0)
	{
		res.json({status:0,err:"invalid fm"});
		return false;
	}

	if(await check_IntegerValue(DA_ID)==0)
	{
		console.log("DA_ID")
		res.json({status:0,msg:'invalid params'})
		return false;
	}


	if(await email_Already_inContest(CM_Email,DA_ID)==false)
	{	
		res.json({status:0,msg:'email already in this contest '});
		return false;

	}






		    
			//BM_Purchase_Amt=creator_get.toFixed(2);
			var fee=0;var tax=0;
			var Actual_Price=0;
			var BM_Purchase_Amt_calculated=0;
			//================================================== calculation for tax fee, actual amt
	


    	if(typeof crsf_id=='undefined' || crsf_id.length == 0)
        {
            res.json({status:0,msg:'invalid api calling'});
            return false;
        }

        let valid=await decryptData(crsf_id,JM_ID);
        if(valid==false)
        {
            res.json({status:0,msg:'invalid api calling'});
            return false;
        }




	if(
		parseInt(DA_ID)==0 || parseInt(JM_ID)==0 || JM_User_Profile_Url.length ==0 	
		|| ProfileName.length ==0 || CM_Name.length==0
		|| JM_User_Profile_Url.length ==0 || CM_Email.length==0
		||  JM_Email.length ==0 || JM_Name.length==0
	)
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	var datetime = new Date();
	var purchased_date=datetime.toISOString().slice(0,10);
	var contestTitle=req.body.dataTitle;
	
	var mailOptions = {   
							from: "Expy Team <info@expy.bio>",  
                              to:CM_Email,   
                              subject: "Contest Participation Successful on Expy!",  
                              html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+CM_Name+",</h3><p>Thanks for your participation in the "+contestTitle+" of "+JM_Name+"</p>     <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>   <p>You will receive further updates from "+JM_Name+" via email about the contest.</p>   <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                                  <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
							
						};

	var mailOptions2 = {   
							from: "Expy Team <info@expy.bio>",  
                              to:JM_Email,   
                              subject: "Someone has joined your contest/giveaway on Expy!",  
                              html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p>Congratulations! Someone has signed up to participate in your contest / giveaway from your Expy Page.</p>  <span> Participant Details :</span><br/> <span>Participant Name: "+CM_Name+"</span><br/>   <span>Participation Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+contestTitle+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>       <p>To view submission responses to your contest questions, <a href='"+process.env.BASE_URL+"me'>please click here</a></p><p>Continue creating awesome content to keep your followers engaged!</p>                                  <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
							
						};



							
						// CM_Name=await removeSpecialChar_withSpace(CM_Name);	
						// CM_Email=await removeSpecialChar_email(CM_Email);

						// CM_A1=await removeSpecialChar_withSpace(CM_A1);
						// CM_A2=await removeSpecialChar_withSpace(CM_A2);
						// CM_A3=await removeSpecialChar_withSpace(CM_A3);
						// CM_A4=await removeSpecialChar_withSpace(CM_A4);

						// CM_Name=connection.escape(CM_Name);
						CM_Email=await removeSpecialChar_email(CM_Email);
						// CM_A1=connection.escape(CM_A1);
						// CM_A2=connection.escape(CM_A2);
						// CM_A3=connection.escape(CM_A3);
						// CM_A4=connection.escape(CM_A4);

	if (!req.files || Object.keys(req.files).length === 0) 
	{		
 				
	
		
		const values = [
			[DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,'',Payment_Id,LM_ID,BM_Purchase_Amt_calculated,fee,tax,Actual_Price,CM_Phone,Consent]
		];
		let sal = "INSERT INTO contest_master(DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,CM_Amount,Fee,Tax,Actual_Price,CM_Phone,Consent) VALUES ?";	  
		
		
		let inserted=await model.sqlInsert(sal,values)						
		if(inserted.affectedRows==1)
		{
		
			
			if(LM_ID > 0)
			{
				let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
				var update_lead=await model.sqlPromise(q);	
			}

							let resp=await wrapedSendMailInfo(mailOptions)
							let resp2=await wrapedSendMailInfo(mailOptions2)
							res.json({status:1,msg:'no file inserted Done'});
		}
		else
		{
			res.json({status:0,msg:'no file not inserted'});
		}
              
	}
	else
	{

			let videoFile = req.files.sampleFile;
			var ext = path.extname(videoFile.name);	
			let fileName=videoFile.md5+ext;			

			console.log(fileName)							
					
			uploadPath = __dirname + '/uploads/Profile/' + ProfileName+"/"+fileName;	
			var CM_File='Profile/' + ProfileName+"/"+fileName;
			videoFile.mv(uploadPath, async function(err) 
			{
				if (err)
						res.json({status:0,msg:'failed'});
				else	
				{
					const values = [
						[DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,BM_Purchase_Amt,fee,tax,Actual_Price,CM_Phone,Consent]
					];
					let sal = "INSERT INTO contest_master(DA_ID,JM_ID,CM_Name,CM_Email,CM_A1,CM_A2,CM_A3,CM_A4,CM_File,Payment_Id,LM_ID,CM_Amount,Fee,Tax,Actual_Price,CM_Phone,Consent) VALUES ?";	  
					
					
					let inserted=await model.sqlInsert(sal,values)						
					if(inserted.affectedRows==1)
					{

						if(LM_ID > 0)
						{
							let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
							var update_lead=await model.sqlPromise(q);	
						}
					

							let resp=await wrapedSendMailInfo(mailOptions)

							let resp2=await wrapedSendMailInfo(mailOptions2)

						res.json({status:1,msg:'file and inserted Done'});
					}
					else
					{
						res.json({status:0,msg:'file done not inserted'});
					}
				}
			});
	
				
	}

});
async function checkPaymentOrNot(LM_ID)
{
	if(LM_ID > 0)
	{
		let sql="SELECT * FROM lead_master WHERE LM_ID="+LM_ID+" and isCompletePayment=1;";
		const data=await model.sqlPromise(sql);
		if(data!=null && data.length >0)
			return true;
		else
			return false
	}
	else
		return false
	
		
}



app.post('/admin/deleteContest',async(req,res)=>{

	var DA_ID=parseInt(req.body.DA_ID);
	DA_ID=await check_IntegerValue(DA_ID);
	var JM_ID=parseInt(req.body.JM_ID);
	JM_ID=await check_IntegerValue(JM_ID);

	if(DA_ID==0 || JM_ID==0)
	{
		res.json({status:0,msg:'missing param'});
		return false;
	}
	if(DA_ID > 0 || JM_ID > 0)
	{
		let q="SELECT *  from direct_access_master_user da inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and da.DA_ID="+DA_ID+" and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0;";
	
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
		{
			res.json({status:0,msg:'not authorized to delete'});
			return false;
		}
	
	}

	let sql="Select * from contest_master where DA_ID="+DA_ID+" and Status='S'";
	let response=await model.sqlPromise(sql);
	if(response!=null && response.length > 0)
	{
		res.json({status:0,msg:'Please, closed the contest by picking winner'});
		return false;
	}
	let q = "UPDATE direct_access_master_user SET  Archive=1 WHERE DA_ID="+DA_ID;
	let query = connection.query(q, (err, results) => {
		if (err) {res.json({status:0,msg:'error in'});}
		else
		{							
			res.json({status:1,msg:'success'});
		}
	});
	
})



app.post('/admin/contestReport',async(req,res)=>{
	


	var JM_ID=req.body.JM_ID;
	var DA_ID=req.body.DA_ID;

	if(parseInt(JM_ID) ==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	if(parseInt(DA_ID) ==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}


	let sql="select cm.Status,cm.JM_ID,cm.DA_ID,jm.JM_User_Profile_Url,jm.JM_Email,jm.JM_Name,cm.CM_ID,cm.CM_Name,cm.CM_Email,da.Q1,da.Q2,da.Q3,da.Q4,cm.CM_A1,cm.CM_A2,cm.CM_A3,cm.CM_A4,cm.CM_File,DATE_FORMAT(cm.Create_Date,'%Y-%m-%d')  submitDate from contest_master cm 		inner join direct_access_master_user da on da.DA_ID=cm.DA_ID		inner join joining_master jm on jm.JM_ID=cm.JM_ID		where cm.DA_ID="+DA_ID+" and da.Archive=0;";
	
	

	const data=await model.sqlPromise(sql);
	if(data!=null && data.length > 0)
	{
		var dbData={
			reportData:data			                             
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:1,
			flag:flag
		});
	}
	else
	{
		res.json({
			status:0,
			flag:"no data found"
		});
	}


})


async function decryptData(data,JM_ID)
{
	try {
		var bytes  = CryptoJS.AES.decrypt(data, 'ae25e95570a100bc69d3b44fe1124773');
	var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	console.log(decryptedData)
	if(parseInt(decryptedData)==JM_ID)
		return true;
	else
		return false;
	} catch (error) {
		return false;
	}
	
}
async function decryptData_Str(data,str)
{
	try {
		var bytes  = CryptoJS.AES.decrypt(data, 'ae25e95570a100bc69d3b44fe1124773');
	var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	console.log(decryptedData)
	if(decryptedData==str)
		return true;
	else
		return false;
	} catch (error) {
		return false;
	}
	
}

async function decryptJsonData(data)
{
	try {
		console.log("here 1")
		var bytes  = CryptoJS.AES.decrypt(data, 'ae25e95570a100bc69d3b44fe1124773');
		var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		console.log("here 2")
		return decryptedData;
	} 
	catch (error)
	{
		console.log(error);
		return false;
	}
	
}
async function decryptJsonData_coin(data,coin)
{
	//let  coin=localstorage.getItem('coin');
	try {
		console.log("here 1")
		var bytes  = CryptoJS.AES.decrypt(data, coin);
		var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		console.log("here 2")
		return decryptedData;
	} 
	catch (error)
	{
		console.log(error);
		return false;
	}
	
}


function mailText()
{
	
	//let made_sale="You made a sale";
	//	let price=BM_Purchase_Amt;
	//let lastText="for Ultimate list of 200+ Resources for";
	//var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";



}
app.post('/admin/setWinner',async(req,res)=>{

	var CM_ID=req.body.CM_ID;
	var DA_ID=req.body.DA_ID;
	var JM_ID=req.body.JM_ID;

	var emailArray=req.body.email;
	if(typeof JM_ID=='undefined' || parseInt(JM_ID) ==0 || isNaN(parseInt(JM_ID)))
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	if(typeof DA_ID=='undefined' || parseInt(DA_ID)==0 || isNaN(parseInt(DA_ID)) )
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	if(typeof CM_ID=='undefined' || CM_ID.length==0 )
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	if(typeof emailArray=='undefined' || emailArray.length==0 )
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	if(typeof req.body.JM_User_Profile_Url=='undefined' || req.body.JM_User_Profile_Url.length==0 )
	{
		res.json({status:0,msg:'param missing'});
		return false;
	}
	var JM_User_Profile_Url="",DA_Title="";
		let qry="Select * from direct_access_master_user da inner join  joining_master jm on jm.JM_ID=da.JM_ID inner join contest_master cm on cm.DA_ID=da.DA_ID 	where jm.JM_ID="+JM_ID+" and da.DA_ID="+DA_ID+"  and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0 GROUP by da.DA_ID;";

		const d=await model.sqlPromise(qry);
	if(d!=null && d.length===0)
	{
		
		res.json({status:0,msg:'not authorized'});
		return false;
		
	}
	else
	{
		JM_User_Profile_Url=d[0].JM_User_Profile_Url;
		DA_Title=d[0].DA_Title;
	}
	
	//contest closed or not
	let Cquery="Select * from contest_master where  DA_ID="+DA_ID+" and JM_ID="+JM_ID+" and (Status='C' or Status='W')";
	const cData=await model.sqlPromise(Cquery);
	if(cData!=null && cData.length > 0)
	{
		res.json({status:0,msg:'contest alrready closed'});
		return false;
	}

	let CM_IDs = CM_ID.toString();
	console.log(emailArray)
	let sql="UPDATE contest_master set Status='C',CM_Win_Date=NOW() where  DA_ID="+DA_ID;
	let resp1=await model.sqlPromise(sql);
		console.log("resp1");
		console.log(resp1);
	if(resp1.affectedRows > 0)
	{
	
		let q="UPDATE contest_master set Status='W',CM_Win_Date=NOW() where  DA_ID="+DA_ID+" and  CM_ID in("+CM_IDs+")";
		let resp2=await model.sqlPromise(q);
		console.log("resp2");
		console.log(resp2);
		var c=0;
		if(resp1.affectedRows > 0)
		{

			if(emailArray!=null && emailArray.length > 0)
			{
				
				for (let i = 0; i < emailArray.length; i++) 
				{
					const element = emailArray[i];
					var JM_Name=element.JM_Name;
					var CM_Email=element.CM_Email;
					var CM_Name=element.CM_Name;
					var contestTitle=DA_Title;
					var JM_User_Profile_Url=JM_User_Profile_Url;
					var mailOptions = {   
						from: "Expy Team <info@expy.bio>",  
						  to:CM_Email,   
						  subject: "You WON a Contest on Expy!",  
						  html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+CM_Name+",</h3><p>CONGRATULATIONS! "+JM_Name+" selected you as the winner of "+contestTitle+"!</p> <p>They will reach out to you shortly if needed as part of the contest/giveaway.</p>     <span>Expy Creator URL: <a href='"+process.env.BASE_URL + JM_User_Profile_Url+"'> "+process.env.BASE_URL + JM_User_Profile_Url+" </a></span><br/>     <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                                  <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
						
					};
					let resp=await wrapedSendMailInfo(mailOptions)
					c++;
				}
				

			}

			let Query = "UPDATE direct_access_master_user SET  DA_Active=0 WHERE DA_ID="+DA_ID;
			let Qdata=await model.sqlPromise(Query);
			res.json({status:1,c:c,msg:'closed and set winner'});
			return false;
		}
		else
		{
			res.json({status:0,msg:'closed but not set winner'});
			return false;
		}
	}
	else
	{
		res.json({status:0,msg:'nothing to update'});
		return false;
	}

})

app.post('/admin/isPaymentMade',async(req,res)=>{

	var payment_id=req.body.payment_id;
	////pay_HiH5LaYWkRDEeg
	let data=await isPaymentMade(payment_id);

});
async function isPaymentMade(payment_id)
{
	//pay_HiH5LaYWkRDEeg
		// request('https://'+key_id+":"+key_secret+'@api.razorpay.com/v1/payments/'+payment_id, function (error, response, body) {
		// 	console.log('Response:', body);
		// });

		//live must uncomment before live
	let url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payments/"+payment_id;
	                  
	//var pay_id="pay_GylCw0ur5hfuZr";
  //let url="https://rzp_test_kocmleqxctrzl5:QYAf19nkFI90DO34gvdxCNO8@api.razorpay.com/v1/payments/"+payment_id; 
										 
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




//remove carousel image
app.post('/admin/removeCarouselImg',async(req,res)=>{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}


	console.log(jsonData)
	var DA_ID=parseInt(jsonData.DA_ID);
	var type=parseInt(jsonData.order);
	if(isNaN(DA_ID)) DA_ID=0;if(isNaN(DA_ID)) type=0;
	if(typeof DA_ID=='undefined' || DA_ID==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;	
	}
	if(typeof type=='undefined' || type==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;	
	}
	var colName="";
	if(type==1)
		colName='DA_Car_Image1'
	else if(type==2)
		colName='DA_Car_Image2'
	else if(type==3)
		colName='DA_Car_Image3'

	let sql="UPDATE direct_access_master_user set "+colName+"='NA' where DA_ID="+DA_ID;
	//console.log(sql)
	const data=await model.sqlPromise(sql)
	if(data.affectedRows===1)
	{
		res.json({status:1,msg:'Removed'});
		return false;	
	}
	else
	{
		res.json({status:0,msg:'error'});
		return false
	}

})

app.post('/admin/GetOpenSlots',async(req,res)=>{



	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}


	console.log(jsonData);
	var ES_Calendar_Date=jsonData.date;
	if(typeof ES_Calendar_Date=='undefined' || ES_Calendar_Date.length ==0)
	{
		res.json({status:0,msg:'date missing'});
		return false
	}
	var JM_ID=parseInt(req.headers['id']);
	if(isNaN(JM_ID)) JM_ID=0;
	if(typeof JM_ID=='undefined' || JM_ID ==0)
	{
		res.json({status:0,msg:'date missing'});
		return false
	}
	//let sql="SELECT da.DA_ID,da.DA_Title,da.DA_Description,	DATE_FORMAT(es.ES_Calendar_Date,'%d-%m-%Y') as ES_Calendar_Date,es.Duration,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,es.ES_Status,  es.ES_EM_ID,	CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime,	CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime    	from event_slots es	inner join joining_master jm on jm.JM_ID=es.JM_ID	inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID	WHERE es.JM_ID="+JM_ID+" and DATE(es.ES_Calendar_Date)='"+ES_Calendar_Date+"' and es.ES_Status in('Open','Booked') and da.DA_Active=1 and da.Archive=0";
	
	//let sql="SELECT es.ES_ID,IFNULL(bm.BM_Name,'') BM_Name,IFNULL(bm.BM_Instruction,'') BM_Instruction,IFNULL(bm.BM_Content_Sent,'') BM_Content_Sent,da.DA_ID,da.DA_Title,da.DA_Description,  DATE_FORMAT(es.ES_Calendar_Date,'%d-%m-%Y') as ES_Calendar_Date,es.Duration,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,es.ES_Status,  es.ES_EM_ID, CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime, CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime  from event_slots es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID left join buyers_master bm on bm.ES_ID=es.ES_ID WHERE es.JM_ID="+JM_ID+" and DATE(es.ES_Calendar_Date)='"+ES_Calendar_Date+"' and es.ES_Status in('Open','Booked') and da.DA_Active=1 and da.Archive=0";

	let sql="SELECT es.ES_ID,IFNULL(bm.BM_Name,'') BM_Name,IFNULL(bm.BM_Instruction,'') BM_Instruction,IFNULL(bm.BM_Content_Sent,'') BM_Content_Sent, IFNULL(bm.Payment_ID,'') Payment_ID,IFNULL(bm.BM_ID,0) BM_ID,jm.JM_Name,jm.JM_Email,DATE(IFNULL(bm.BM_Purchase_Date,'')) BM_Purchase_Date,jm.JM_User_Profile_Url,IFNULL(bm.BM_Purchase_Amt,0) BM_Purchase_Amt,IFNULL(bm.Actual_Price,0) Actual_Price,IFNULL(bm.BM_Email,'') BM_Email,IFNULL(bm.BM_Phone,'') BM_Phone,da.JM_ID,da.DA_DA_ID,bm.isFree,da.DA_ID,da.DA_Title,da.DA_Description,DATE_FORMAT(es.ES_Calendar_Date,'%d-%m-%Y') as ES_Calendar_Date,es.Duration,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,es.ES_Status,  es.ES_EM_ID, CONCAT(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2)) startSlotTime, CONCAT(FLOOR(IFNULL(es.ES_Slot_End,0) /60),':', TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2)) endSlotTime  from event_slots es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID left join buyers_master bm on bm.ES_ID=es.ES_ID WHERE es.JM_ID="+JM_ID+" and DATE(es.ES_Calendar_Date)='"+ES_Calendar_Date+"' and es.ES_Status in('Open','Booked') and da.DA_Active=1 and da.Archive=0;";


	const data=await model.sqlPromise(sql);
	//console.log(sql);
	if(data!=null && data.length > 0)
	{
		var dbData={
			available:data
		}
		const flag=await jsonEncrypt(data);
		//console.log(flag)
		res.json({status:1,flag:flag});
		return false;	
	}
	else
	{
			res.json({status:0,msg:'no data found'});
			return false;	
	}
})


app.post('/admin/getCalender',async (req,res)=>{
	var JM_ID=parseInt(req.headers['id']);
	if(isNaN(JM_ID)) JM_ID=0;
	if(typeof JM_ID=='undefined' || JM_ID ==0)
	{
		res.json({status:0,msg:'id missing'});
		return false
	}

	let yearMonthString=req.body.yearMonthString;
	let currMonth=parseInt(req.body.currMonth);


	if(typeof yearMonthString=='undefined' || yearMonthString.length ==0
	 || typeof currMonth=='undefined'   || currMonth ==0  )
	{
		res.json({status:0,msg:'missing params'});
		return false
	}

	
	if(JM_ID > 0 && yearMonthString.length > 0 && currMonth > 0)
	{
		const sql="call get_creator_calender_by_month(?,?,?)";
		const values=[
			yearMonthString,JM_ID,currMonth
		]
		const data=await call_sp(sql,values);
		if(data!=null && data.length > 0)
		{

			var dbData={	
				data:data[0]          
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag,				
			});

			// res.json({
			// 	status:1,
			// 	data:data[0],
			// 	msg:'data found'
			// })
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


//admin
// fetch all payout to creators

app.post('/admin/totalPayout_creators_rzpx',async (req,res)=>{
	
	await validSession(req,res);
	//https://api.razorpay.com/v1/payouts?account_number=7878780080316316
	const data=await totalPayoutRzpx();
	let sql="select * from payout_master where DATE(Create_Date) >= (CURDATE() - INTERVAL 30 DAY)";
	const payoutDb=await model.sqlPromise(sql)
	if(data!=null && data.length > 0)
	{
		var payout=JSON.parse(data);
		res.json({
			status:1,
			totalPayout_Rzpz:payout.items,
			totalPayout_Db:payoutDb
		})
	}
	else{
		res.json({
			status:0,
			totalPayout:data,
			msg:'no data found'
		})
	}
});
//admin
async function validSession(req,res)
{
	let AM_ID=parseInt(req.session.AM_ID)
	if(AM_ID == undefined ) return res.redirect('/admin/exp_admin_panel');		
	if(isNaN(AM_ID)) return res.redirect('/admin/exp_admin_panel');
	if(parseInt(AM_ID) == 0 ) return res.redirect('/admin/exp_admin_panel');		
	return true;
}
// calling refund  API 
async function totalPayoutRzpx()
{
	let acc_no=process.env.ACC_NO_RAZORPAY_X;
	let url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payouts?account_number="+acc_no;                                     
    const requestPromise = util.promisify(request);
    const response = await requestPromise({url: url, method: 'get'});   
	if(response.statusCode!=400)
    {
		return response.body;
    }
	else
    {
		var data=[];
		return data;
    }

       
}

//======================================== paypal payout

// 12-aug-2021
//======================================== paypal payout

app.post('/admin/paypalPayout',async (req,res)=>{

	var JM_ID=parseInt(req.headers['id']);	

	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	var type=jsonData.type;
	let amount=parseFloat(jsonData.amount);
	//var type=req.body.type;
	if(type.length==0)
	{	
		res.json({status:0,msg:'type missing'});
		return false;
	}
	if(type=='B')
	{	
		res.json({status:0,msg:'only for paypal users'});
		return false;
	}

	if(isNaN(JM_ID)) JM_ID=0;
	var maxAmount=1000;
	if(typeof JM_ID=='undefined' || JM_ID==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;	
	}
	
	if(isNaN(amount)) 	amount=0;
	if(amount === 0)
	{
	   res.json({
		   status:0,
		   msg:"invalid amount"
	   })
		return false;
	}
	var converted_amount_usd = amount / 74.26;
	console.log("converted_amount_usd");
	console.log(converted_amount_usd);
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
														 


   let sql="select jm.JM_Contact_Id,jm.JM_Fund_Id,jm.JM_PayPal_UserName,jm.JM_PayPal_Phone,jm.JM_PayPal_Email from joining_master jm	WHERE jm.JM_ID="+JM_ID; //and jm.JM_Contact_Id=='NA'and jm.JM_Fund_Id=='NA'
	const payPalPay=await model.sqlPromise(sql);
	console.log(payPalPay)
	var JM_PayPal_Email='';
	if(payPalPay!=null && payPalPay.length > 0)
	{
		JM_PayPal_Email=payPalPay[0].JM_PayPal_Email;
		if(JM_PayPal_Email.length ==0)
        {
			 res.json({
               status:0,
               msg:"Paypal email-id required, update paypal email in settings"
           })
            return false;
        }

	}
	var sender_batch_id = cryptoRandomString({length: 100, type: 'alphanumeric'});
	var pay={
		receiver_email:JM_PayPal_Email,
		amount_in_USD:converted_amount_usd.toFixed(2),
		sender_batch_id:sender_batch_id
	}
	console.log(pay)

	var response=await payPalPayout(pay);
	if(response.status==1)
	{
		console.log('response.data', response.data); 
		let obj=response.data;		
		const values = [
			[JM_ID,obj.payout_batch_id,sender_batch_id,amount,obj.batch_status,'payout','P',converted_amount_usd.toFixed(2)]
		];
		const sql = "INSERT INTO payout_master (JM_ID,payout_id,fund_account_id,amount,status,entity,type,INR_USD) VALUES ?";
	
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
});



const paypal = require('@paypal/payouts-sdk');
const { check } = require('express-validator');

const { parse } = require('path');
// Creating an environment
let clientId = process.env.PAY_PAL_CLIENT_ID;
let clientSecret = process.env.PAY_PAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
//let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

async function payPalPayout(data)
{
	
	var sender_item_id= cryptoRandomString({length: 50, type: 'numeric'});
	const requestBody={
		"sender_batch_header": {
		  "sender_batch_id": data.sender_batch_id,
		  "email_subject": "You have a payout from Expy",
		  "email_message": "You have received a payout! Thanks for using our expy service!"
		},
		"items": [
				   {
					"recipient_type": "EMAIL",
					"amount": {
					  "value": data.amount_in_USD,
					  "currency": "USD"
					},
					"note": "Thanks for using our expy service!",
					"sender_item_id": sender_item_id,
					"receiver":  data.receiver_email,//"sb-47ktmy6985536@personal.example.com"
					
				  }
			   ]
	  }


		 // Construct a request object and set desired parameters
    	// Here, PayoutsPostRequest() creates a POST request to /v1/payments/payouts

        let request = new paypal.payouts.PayoutsPostRequest();
        request.requestBody(requestBody);



          let createPayouts  = async function()
		  {
                  try {
                        let response = await client.execute(request);
                        console.log(`Response: ${JSON.stringify(response)}`);
                        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
                        console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
				
							const razorFund={
                              data:response.result.batch_header,
                              status:1
                          }
                          return razorFund;
					}	
                    catch (e) 
                    {
                        if (e.statusCode) 
                        {
                          //Handle server side/API failure response
                          console.log("Status code: ", e.statusCode);
                          // Parse failure response to get the reason for failure
                          const error = JSON.parse(e.message)
                          console.log("Failure response: ", error)
                          console.log("Headers: ", e.headers)

                          const razorFund={
                                data:[],
                                status:0
                            }
                            return razorFund;
                        } 
                        else 
                        {
                          //Hanlde client side failure
                         	 console.log(e)
					 	 const razorFund={
                                data:[],
                                status:0
                            }
                            return razorFund;
                        }
                    }
        }
	
		return createPayouts();

}


//removeBankPayPal
app.post('/admin/removeBankPayPal',async (req,res)=>{

	var JM_ID=parseInt(req.headers['id']);	
	if(isNaN(JM_ID)) JM_ID=0;
	var type=req.body.type;
	if(typeof JM_ID=='undefined' || JM_ID==0)
	{
		res.json({status:0,msg:'param missing'});
		return false;	
	}
	

	let sql="";
	if(type=='B')
	{
		let q="select IFNULL(JM_Acc_No,0) JM_Acc_No  from joining_master where JM_ID="+JM_ID;
		const dt=await model.sqlPromise(q)
		if(dt!=null && dt.length > 0)
		{
			if(dt.JM_Acc_No.length > 2)
			{
				console.log("JM_Acc_No")
				console.log(dt.JM_Acc_No)
			}
		}

		 sql="UPDATE joining_master set JM_Acc_No='',JM_Acc_Code='',JM_SWIFT_Code='',JM_Beneficiary_Name='',JM_Phone_Bank='NA',JM_Contact_Id='NA',JM_Fund_Id='NA' where JM_ID="+JM_ID;
	}
	else if(type=='P')
	{
		let q="select IFNULL(JM_PayPal_Email,'NA') JM_PayPal_Email,IFNULL(JM_PayPal_Email,'NA') JM_PayPal_Email  from joining_master where JM_ID="+JM_ID;
		let dt2=await model.sqlPromise(q)
		if(dt2!=null && dt2.length > 0)
		{
			if(dt2.JM_PayPal_Email.length > 2)
			{
				console.log("JM_PayPal_Email")
				console.log(dt2.JM_PayPal_Email)
			}
		}
		 sql="UPDATE joining_master set JM_PayPal_Name='NA',JM_PayPal_Phone='NA',JM_PayPal_Email='NA' where JM_ID="+JM_ID;

	}
	else
	{
		res.json({status:0,msg:'type missing'});
		return false;	
	}

	const data=await model.sqlPromise(sql);
	if(data.affectedRows==1)
	{
		res.json({status:1,msg:'updated'});
		return false;	
	}
	else
	{
		res.json({status:0,msg:'failed'});
		return false;	
	}

});


//17-aug-2021
app.post('/admin/payoutAdmin',async (req,res)=>{
	let maxAmount=1;
	 var JM_ID=parseInt(req.headers['id']);	
	 var type=req.body.type;


  if(type=='B')
	{

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
	 let dataArr=await Get_Total_Withdrawable_Bal(JM_ID);
	 if(dataArr.length > 0)
	 {
		 console.log(dataArr[0])
		currentBalance=parseFloat(dataArr[0].currentBalance);
	 }

	 console.log("currentBalance")
	 console.log(currentBalance)
	
	 if(isNaN(currentBalance))	 currentBalance=0;	
 	if(currentBalance == 0)
	 {
		res.json({
			status:0,
			msg:"No available balance"
		})
		 return false;
	 }
	 if(amount > currentBalance)
	 {
		res.json({
			status:0,
			msg:"balence is not available"
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
     console.log("bankPay")
     console.log(bankPay)
	 if(bankPay!=null && bankPay.length > 0)
	 {
		fund_account_id=bankPay[0].JM_Fund_Id;
	 }
	 console.log("fund_account_id")
	 console.log(fund_account_id)
	if(typeof fund_account_id=='undefined' || fund_account_id.length==0)
	{
		res.json({
			status:0,
			msg:"Fund Id missing, Update payout details in settings and try again"
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
			[JM_ID,obj.id,obj.fund_account_id,amount,obj.status,obj.entity,obj.created_at,obj.fees,obj.tax]
		];
		const sql = "INSERT INTO payout_master (JM_ID,payout_id,fund_account_id,amount,status,entity,created_at,Fee,Tax) VALUES ?";
	
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
			msg:"Update bank accounts details and try again later...",
			error
		})
	}
	
  }	
  else if(type=='P') //paypal
  {
	
		
		res.json({
			status:0,
			msg:"Payout method not available"			
		})
  }
  else
  {
	res.json({
		status:0,
		msg:"invalid type"			
	})
  }

})



//18-aug-2021


app.get('/admin/exp_admin_panel/key-data',async (req,res)=>{	
	console.log(req.session)
if(typeof req.session.AM_ID == 'undefined' )
	return res.redirect('/admin/exp_admin_panel');
if(parseInt(req.session.AM_ID) == 0 )
	return res.redirect('/admin/exp_admin_panel');

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var AM_ID=parseInt(req.session.AM_ID);

	var days=0;
	

			var sales,creators,referralRequest,completedRequest,uniqueViews,total_signup_via_referral,payoutCreator,averageCTR,viewClick;
			const results=await GetkeyData(days);
			console.log(results)
			if(results!=null && results.length > 0)
			{
				sales=results[0];
				creators=results[1];
				referralRequest=results[2];		
				completedRequest=results[3];	
				uniqueViews=results[4];
				totalViews=results[5];
				total_signup_via_referral=results[6];
				payoutCreator=results[7];
				averageCTR=results[8];		
			
		
			
                res.render('pages/keydata',{
               	    status:1,
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,			
					total_signup_via_referral:total_signup_via_referral, 
					payoutCreator:payoutCreator,
					averageCTR:averageCTR,
                    title:' Expy |  Key-Data',
                    moment:moment			
                });		
					
			}
			else
			{
			
                res.render('pages/keydata',{
                	status:0,
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,			
					total_signup_via_referral:total_signup_via_referral, 
					payoutCreator:payoutCreator,
					averageCTR:averageCTR,
                    title:' Expy |  Key-Data',
                    moment:moment			
                });		
			}


	
});


app.post('/admin/getKeyData',async (req,res)=>{


	if(await isValidSession(req.session.AM_ID)== false )
	{
		res.json({
			status:0,
			msg:'missing param'
		})
		return false;		
	}


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}

	console.log(jsonData)
	let days=parseInt(jsonData.days);					
	if(typeof days=='undefined')
	{
		res.json({
			status:0,
			msg:'missing param'
		})
		return false;
	}	
	if(isNaN(days)) days=0;		
	if(days==0) 
	{
		res.json({
			status:0,
			msg:'missing param'
		})
		return false;
	}
	const values=[
			days
		]
	var sql="";
	
 if(days==1)
	sql="call sp_get_key_data_daily(?)";
 else if(days==7)
	sql="call sp_get_key_data_weekly(?)";
 else if(days==30)
	sql="call sp_get_key_data_monthly(?)";

	var sales,creators,referralRequest,completedRequest,uniqueViews,total_signup_via_referral,payoutCreator,averageCTR,viewClick;
	const results=await await call_sp(sql,values);
	if(results!=null && results.length > 0)
	{
		sales=results[0];
		creators=results[1];
		referralRequest=results[2];		
		completedRequest=results[3];	
		uniqueViews=results[4];
		totalViews=results[5];
		total_signup_via_referral=results[6];
		payoutCreator=results[7];		
		viewClick=results[8];

		res.json({
			status:1,
			sales:sales,
			creators:creators, 
			referralRequest:referralRequest,
			completedRequest:completedRequest,
			uniqueViews:uniqueViews,
			totalViews:totalViews,
			total_signup_via_referral:total_signup_via_referral,
			payoutCreator:payoutCreator,			
			viewClick:viewClick,

		})
			
	}
	else
	{
		res.json({
			status:0,
			sales:sales,
			creators:creators, 
			referralRequest:referralRequest,
			completedRequest:completedRequest,
			uniqueViews:uniqueViews,
			totalViews:totalViews,
			total_signup_via_referral:total_signup_via_referral,
			payoutCreator:payoutCreator,			
			viewClick:viewClick,
			msg:'no data found'
		})
	}


})



app.post('/admin/getKeyData_by_days',async (req,res)=>{

			if(await isValidSession(req.session.AM_ID)== false )
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;		
			}

			if(typeof req.body.flag=='undefined' || req.body.flag==null)
			{
				res.json({status:0,msg:"Invalid key"});
				return false;
			}

			let jsonData=await decryptJsonData(req.body.flag)
			if(jsonData==false)
			{
				res.json({status:0,msg:"Invalid data"});
				return false;
			}


			console.log(jsonData)
			let days=parseInt(jsonData.days);					
			if(typeof days=='undefined')
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;
			}	
			if(isNaN(days)) days=0;		
			if(days==0) 
			{
				res.json({
					status:0,
					msg:'missing param'
				})
				return false;
			}

			var sales,creators,referralRequest,completedRequest,uniqueViews,total_signup_via_referral,payoutCreator,averageCTR,viewClick;
			const results=await GetkeyData(days);
			console.log(results)
			if(results!=null && results.length > 0)
			{
				sales=results[0];
				creators=results[1];
				referralRequest=results[2];		
				completedRequest=results[3];	
				uniqueViews=results[4];
				totalViews=results[5];
				total_signup_via_referral=results[6];
				payoutCreator=results[7];
				averageCTR=results[8];		
			
		
				res.json({
					status:1,
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,			
					total_signup_via_referral:total_signup_via_referral, 
					payoutCreator:payoutCreator,
					averageCTR:averageCTR,
				})
					
			}
			else
			{
				res.json({
					status:0,
					sales:sales,
					creators:creators, 
					referralRequest:referralRequest,
					completedRequest:completedRequest,
					uniqueViews:uniqueViews,
					totalViews:totalViews,			
					total_signup_via_referral:total_signup_via_referral, 
					payoutCreator:payoutCreator,
					averageCTR:averageCTR,
					msg:'no data found'
				})
			}

});


async function GetkeyData(days)
{

		//sales, 
		var sql=" SELECT CAST(SUM(X.totalSales) as decimal(10,2)) totalSales,SUM(X.noOfSales) noOfSales  from (   (Select IFNULL(SUM(IFNULL(bm.Actual_Price,0)),0) totalSales, COUNT(*)    noOfSales from buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0   GROUP BY YEAR(bm.BM_Purchase_Date),MONTH(bm.BM_Purchase_Date),DAY(bm.BM_Purchase_Date)  order by DATE(bm.BM_Purchase_Date) desc)  UNION ALL (Select IFNULL(SUM(IFNULL(bm.Actual_Price,0)),0) totalSales, COUNT(*)    noOfSales from contest_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0 and bm.Actual_Price > 0  GROUP BY YEAR(bm.Create_Date),MONTH(bm.Create_Date),DAY(bm.Create_Date)   order by DATE(bm.Create_Date) desc) ) X;";


		//	creators  
		sql+=" SELECT IFNULL(SUM(noOfCreator),0) noOfCreator from( Select DATE(Create_Date) Create_Date,COUNT(*) noOfCreator from joining_master where isDeleted=0 GROUP BY YEAR(Create_Date),MONTH(Create_Date),DAY(Create_Date)  order by DATE(Create_Date) desc ) Y; ";
	
		 //referralRequest 
		sql+=" Select COUNT(*)  noOfReferral from referral_code_request WHERE referral_code_request.isCodeSent=0 and DATE(Create_Date) >= DATE_ADD(NOW(), INTERVAL -"+days+" DAY);";
		
		// /completedRequest
		sql+=" SELECT IFNULL(SUM(completedRequest),0) completedRequest from ( Select DATE(bm.BM_Updated_Date) Create_Date,COUNT(*)  completedRequest from buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.isDeleted=0  and bm.Status='C' GROUP BY YEAR(bm.BM_Updated_Date),MONTH(bm.BM_Updated_Date),DAY(bm.BM_Updated_Date)  order by DATE(bm.BM_Updated_Date) desc ) Y;";
	   
		//uniqueViews
		sql+=" Select COUNT(*) uniqueViews FROM( select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm GROUP BY  YEAR(vm.Create_Date),MONTH(vm.Create_Date),DAY(vm.Create_Date),vm.IP order by DATE(vm.Create_Date)) A;";
		
		//totalViews
		sql+="Select SUM(IFNULL(viewCount,0)) totalViews FROM(  select vm.IP,vm.Create_Date,vm.JM_Profile_Url,SUM(vm.JM_Views) viewCount from view_master vm GROUP BY  YEAR(vm.Create_Date),MONTH(vm.Create_Date),DAY(vm.Create_Date),vm.IP order by DATE(vm.Create_Date)) A;";
		
		//	total_signup_via_referral
		sql+=" SELECT IFNULL(SUM(total_signup_via_referral),0) total_signup_via_referral from ( SELECT X.Create_Date,COUNT(*) total_signup_via_referral from ( select IFNULL(rcm.JM_ID,0) referral_Id,jm.JM_Referral,jm.JM_ID,jm.JM_Name,jm.JM_Email,jm.JM_User_Profile_Url,IFNULL(jm.JM_Profile_Pic,'') JM_Profile_Pic,jm.JM_Phone,DATE(jm.Create_Date) Create_Date  from joining_master jm left join referal_code_master rcm on rcm.Code=jm.JM_Referral where  jm.JM_Referral!='NA' and jm.JM_Referral!='' and jm.isDeleted=0 and DATE(jm.Create_Date)  >= DATE_ADD(NOW(), INTERVAL -365 DAY)  ) X inner join joining_master jm2 on jm2.JM_ID=X.referral_Id where X.referral_Id!=0 and jm2.isDeleted=0   GROUP BY YEAR(X.Create_Date),MONTH(X.Create_Date),DAY(X.Create_Date)  order by DATE(X.Create_Date) desc) Y;";
	
	//payoutCreator
	sql+="SELECT IFNULL(SUM(IFNULL(X.amount,0)),0) payoutCreator from( SELECT pm.JM_ID,pm.payout_id,SUM(IFNULL(pm.amount,0)) amount ,pm.status,DATE(Create_Date) tranDate,pm.INR_USD,DATE(pm.Create_Date) Create_Date, pm.type from payout_master pm  GROUP BY YEAR(pm.Create_Date),MONTH(pm.Create_Date),DAY(pm.Create_Date),pm.JM_ID  ) X;";
	
	//averageCTR
	sql+="SELECT SUM(IFNULL(M.TotClicks,0)) TotClicks,IFNULL(N.totViews,0) totViews,CAST(( SUM(IFNULL(M.TotClicks,0))/ (IFNULL(N.totViews,0) * 100) ) as decimal(6,3)) averageCTR from ( SELECT Stat_ID,Stat_Type,SUM(Stat_Click) TotClicks,DAYNAME(Create_Date) Stat_day,Create_Date, JM_ID, CASE  WHEN Stat_Type='L'  THEN (SELECT LM_Title from link_master where LM_ID=Stat_ID)   WHEN Stat_Type='S' THEN (SELECT SWM_Title from social_widget_master where SWM_ID=Stat_ID)  WHEN Stat_Type='C'  THEN (SELECT category_master.CM_Folder_Title from category_master where CM_ID=Stat_ID) WHEN Stat_Type='P'  THEN (SELECT DA_Title from direct_access_master_user where DA_ID=Stat_ID)  else 'NA' end as Title FROM    stat_master GROUP By Stat_ID ) M left join ( SELECT JM_ID,Count(*) totViews FROM view_master  GROUP by JM_ID ) N on N.JM_ID=M.JM_ID where M.Title!='NA';";
	
	const data=await model.sqlPromise(sql);
	return data;
}

app.post('/admin/freeCapture',async (req,res)=>{



	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


	
	var crsf_id=req.headers['token'];
	let paymentId=req.body.paymentId;
	if(typeof crsf_id=='undefined' || crsf_id.length == 0)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}

	let valid=await decryptData_Str(crsf_id,paymentId);
	if(valid==false)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}


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

	// let jsonData=await decryptJsonData(req.body.flag)
	// console.log(jsonData)
	// var JM_ID=parseInt(jsonData.JM_ID);		

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
			console.log(fileArr)	
			var JM_Profile_Url=	jsonRes[0].JM_Profile_Url;
			var JM_User_Profile_Url=jsonRes[0].JM_User_Profile_Url;
			var DA_DA_ID=jsonRes[0].DA_DA_ID;
			var JM_Email=jsonRes[0].JM_Email;
			var JM_Name=jsonRes[0].JM_Name;

			var JM_Phone=jsonRes[0].JM_Phone;
			var JM_Email_Pref=jsonRes[0].JM_Email_Pref;
			var JM_SMS_Pref=jsonRes[0].JM_SMS_Pref;
			console.log("jsonRes[0]");
			console.log(jsonRes[0]);

			if(fileArr!=null && fileArr.length > 0 && fileArr.length==1)
			{

				console.log("jsonRes[0]");
				console.log(jsonRes[0]);
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


				//console.log(BM_FileUrl);
				fs.copyFile(pathToFile, pathToNewDestination, async function(err) 
				{
					//console.log("inside copyFile");
					if (err) 
					{
						res.json({status:0,err:"err"});
					} 
					else 
					{							

						//console.log("Successfully copied and moved the file!")


						
					// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
					// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
					// BM_Email=await removeSpecialChar_email(BM_Email)



					//BM_Instruction=connection.escape(BM_Instruction);
					//BM_Name=connection.escape(BM_Name);
					BM_Email=await removeSpecialChar_email(BM_Email)

						var Status='P';
						if(DA_DA_ID == 2 || DA_DA_ID == 3)
							Status='C';

						const values = [
							[DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,paymentId,Status,1]			
						];
						const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,Consent,Payment_ID,Status,isFree) VALUES ?;";	  	  
						const query = connection.query(sql, [values], async function(err, result) {
							if (err) 
							{
								//console.log(err);
								res.json({status:0,msg:"err"});
							}
							else
							{
								
								let made_sale="You made a sale";
								let price=BM_Purchase_Amt;
								let lastText=DA_Title;
								var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto; color:#333;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0; color:#000;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";
								//var newFormatText="";
								var datetime = new Date();
								//console.log(datetime.toISOString().slice(0,10));
								var purchased_date=datetime.toISOString().slice(0,10);
								var text="Product Link : "+premium_url+BM_Url_ID;								
								var html="";var from='Expy Team <info@expy.bio>';
								// for followers
								if(DA_DA_ID == 2) // unlock content
								{
									html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>Download content</b></a> <p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
									from='Expy Team <info@expy.bio>';
								}
								else if(DA_DA_ID == 3) // digital goods content
								{
									html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. <a href='"+downLoadContent+"'><b>Download content</b></a> <p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
									from='Expy Team <info@expy.bio>';
								}
								else //any request
									html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+BM_Name+", Your transaction on Expy was successful.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Thank you for purchasing on Expy. </p>                 <p> To ensure a smooth experience for both the creators and requesters on Expy, the creator will need to accept your request before fulfilling the request. </p>                    <p>If the creator chooses to decline it, you will receive a full refund of your amount within 48 hours from the decline date.</p>                 <p>We will notify you as soon as the creator accepts or declines the request.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
							

								var mailOptions = {
									from: from,
									to: BM_Email,
									subject: "Transaction Success on Expy!",
									text: "Thanks for Buying product",
								   //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									 html: html
								}
								var mailOptionsAdmin = {
									from: "Expy Admin <admin@expy.bio>",
									to: BM_Email,
									subject: "Transaction Success on Expy!",
									text: "Thanks for Buying product",
								   //html: "<h3>"+text+"</h3><a href='"+premium_url+BM_Url_ID+"'><b>Download content</b></a><br><a href='"+process.env.BASE_URL+"'><b> more info..</b></a>"
									 html: html
								}
								// for creators
								var NewreqEmail='',NewunlockEmail='',NewSelleingEmail='';
								var mailOptions2={};		var mailOptionsAdminFollower={};
								var msg="";
								if(DA_DA_ID == 1)
								{

									NewreqEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! You have received a new Premium request on your Expy Page.</p> <span> Request Details  :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>To ensure your followers have a smooth time purchasing from you, you have 7 days to decline or accept, and 14 days to complete from the date of request. Beyond this, the request will be automatically declined. </p><p>To check further details and accept/decline the request, please <a href='"+process.env.BASE_URL+"notify'>click here.</a></p><p>Upon completion of the request, your account will be credited with the amount mentioned in your premium goods and services item.</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
									mailOptions2 = {
										from: "Expy Team <info@expy.bio>",
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
									NewunlockEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your content has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
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
									NewSelleingEmail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p style='font-size:18px'> Hi "+JM_Name+", Congratulations! Your Product has been purchased from your Expy Page.</p> <span>Details  :</span><br/><span>Content Details: <a href='"+downLoadContent+"'><b>View Content</b></a> </span> <br/> <span>Requester Name: "+BM_Name+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>Your money amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Continue creating awesome content to keep your followers engaged!</p><p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
									mailOptions2 = {
										from: "Expy Team <info@expy.bio>",
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
						
							

									
								var dbData={
									url:downLoadContent,
									arr:req.body,
									DA_DA_ID:DA_DA_ID,
									result:result,
									JM_Phone:JM_Phone						                              
								  }

								const flag=await jsonEncrypt(dbData);						
				
	


								
								//var emailAdmin=await wrapedSendMail(mailOptionsAdmin);
								var resp2=await wrapedSendMailInfo(mailOptions); //follower
						
									if(resp2)
									{
										if(JM_Email_Pref=='Y' && JM_SMS_Pref=='Y')
										{
											
											 // var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
												var resp=await wrapedSendMailInfo(mailOptions2); //creator
												var isSentSMS=await sendSMS(JM_Phone,msg);
												//console.log(isSentSMS);	
												if(isSentSMS)
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}
												else
												{
													res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
												}
												
										}
										else if(JM_Email_Pref=='Y' && JM_SMS_Pref=='N')
										{
											
											//var emailAdmin=await wrapedSendMail(mailOptionsAdminFollower);
											var resp=await wrapedSendMailInfo(mailOptions2);
											if(resp)
											{
												res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
											}
											else
											{
												res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
											}

										}	
										else if(JM_Email_Pref=='N' && JM_SMS_Pref=='Y')
										{
											var isSentSMS=await sendSMS(JM_Phone,msg);
											if(isSentSMS)
											{
												res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
											}
											else
											{
												res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
											}
										}
									}
									else
									{
										res.json({flag:flag,status:1,msg:"mail sent, sms sent"});
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
		console.log('no payment id');
		res.json({status:0,msg:"no payment id"});
	}

})

//declinedFree
app.post('/admin/declinedFree',async (req,res)=>{
	var request = require('request');


	var pay_id=req.body.paymentId;
	var BM_ID=req.body.BM_ID;

	var html="";
	var followerName=req.body.data.BM_Name;
	var Creator_Name=req.body.data.JM_Name;
	var purchased_date=req.body.data.BM_Purchase_Date; 
	var JM_User_Profile_Url=req.body.data.JM_User_Profile_Url;
	var DA_Title=req.body.data.DA_Title;
	var BM_Purchase_Amt=req.body.data.Actual_Price;
	var BM_Email=req.body.data.BM_Email;
	var BM_Phone=req.body.data.BM_Phone;

	var ES_ID=req.body.data.ES_ID;
	var JM_ID=req.body.data.JM_ID;
	var DA_DA_ID=req.body.data.DA_DA_ID;

	var isFree=parseInt(req.body.data.isFree);
	if(isNaN(isFree)) isFree=0;
	if(typeof isFree=='undefined') isFree=0;

		var html= "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><p style='font-size:18px'> Hi "+followerName+", We are sorry to inform you that Your Request was declined by "+Creator_Name+".</p> <span> Request Details  :</span><br/> <span>Requester Name: "+followerName+"</span><br/>   <span>Request Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+Creator_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>      <p>There could be a variety of reasons why a Creator could not fulfill the request right now. Hence, we ask you to try again in a few days </p>  <p>You will receive a full refund of your amount within 48 hours from the decline date.</p> <p>Thank you for purchasing on Expy. </p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";	
		var mailOptions = {
			from: "Expy Team <info@expy.bio>",
			to: BM_Email,
			subject: "Your Expy Request has been declined.",			
			html: html
		}

				var resp2=await wrapedSendMailInfo(mailOptions);
				//update status
				let sql = "UPDATE buyers_master SET  Status='D',BM_Updated_Date=NOW() WHERE BM_ID="+BM_ID;
				let query = connection.query(sql, async (err, results) => {
				if(err) 
				{
					//console.log(err);
					res.json({status:0,msg:"unable to query "});
				}
				else
				{
					if(DA_DA_ID===5)
					{
						var response=await unblockSlot(JM_ID,ES_ID,BM_ID);
					}
					
					let msg="Hi "+followerName+" , we are sorry to inform you that your request has been declined by "+Creator_Name+" on Expy. A refund will be initiated in 48 hours. Thank you.";
					
				//	var isSentSMS=sendSMS(BM_Phone,msg);
					res.json({
								status:1,
								msg:'free declined done',
								statusCode:"done"
						});
				}	
			});


})



app.post('/admin/addDonerFree',async (req,res)=>{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;



	var crsf_id=req.headers['token'];
	let paymentId=req.body.paymentId;
	if(typeof crsf_id=='undefined' || crsf_id.length == 0)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}

	let valid=await decryptData_Str(crsf_id,paymentId);
	if(valid==false)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}


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
	var DA_DA_ID=req.body.DA_DA_ID;
	const hashPassword = bcrypt.hashSync(BM_Password, saltRounds); // encrypted password
	//var BM_Purchase_Amt=1;
	//console.log("paymentId ->  "+ paymentId)

	//console.log("DA_ID ->  "+ DA_ID)
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;


	//BM_Instruction=connection.escape(BM_Instruction);
	//BM_Name=connection.escape(BM_Name);
	BM_Email=await removeSpecialChar_email(BM_Email)

	if(paymentId!='')
	{
	
		//console.log("Successfully copied and moved the file!")
		const values = [
			[DA_ID," ",BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,' ',"D",'C',paymentId,JM_ID,1]			
		];
		const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID,isFree) VALUES ?";	  
	
		const query = connection.query(sql, [values], async  function(err, result) {
			if (err) 
			{
				//console.log(err);
				res.json({status:0,msg:"err"});
			}
			else
			{
				 let msg="<p>Hi "+BM_Name+",</p></br><p> Your "+DA_Title+" of ₹ "+BM_Purchase_Amt+"  was successfully received by "+JM_Name+". Thank you for supporting your favorite creator! </p><p>We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form</a>.</p><p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span>";

				// var text="Product Link : "+premium_url+BM_Url_ID;
				var mailOptions = {
					from: "Expy Team <info@expy.bio>",
					to: BM_Email,
					subject: "Your Expy Gift was delivered! ",
					text: "Thanks for Support",
					html: msg
				}

				


				
				var datetime = new Date();					
				var purchased_date=datetime.toISOString().slice(0,10);

				let made_sale="You received a Gift";
				let price=BM_Purchase_Amt;
				let lastText=DA_Title;
				//var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";
				var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto; color:#333;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0; color:#000;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";

				//let msg2="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p>Hi "+JM_Name+", Congratulations! You have received a new gift on your Expy Page. </p><span> Details  :</span><br/> <span> Name: "+BM_Name+"</span><br/>   <span> Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Gift Item: "+DA_Title+" </span><br/>          <span>Item Price: ₹ "+BM_Purchase_Amt+"</span><br/><p>Your Gift amount will be sent to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Keep creating awesome content to receive more gifts from your followers!</p>  <p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
				let msg2="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<p>Hi "+JM_Name+",</p><p> Congratulations! You have received a new gift on your Expy Page. </p><span> Details  :</span><br/> <span> Name: "+BM_Name+"</span><br/>   <span> Date: "+purchased_date+"</span><br/>             <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Gift Item: "+DA_Title+" </span><br/>          <span>Item Price: ₹ "+BM_Purchase_Amt+"</span><br/><p>Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p><p>Keep creating awesome content to receive more gifts from your followers!</p>  <p>For any queries, you can write to us at support@expy.bio</p> <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";

				var mailOptions2 = {
					from: "Expy Team <info@expy.bio>",
					to: JM_Email,
					subject: "You have received a new Gift on Expy!",
					text: "Thanks for Support",
					html: msg2
				}
				//"Congrats "+JM_Name+" ! You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
				var sms="Congrats "+JM_Name+" You have received a new gift from someone on your Expy page. To view details visit: expy.bio/notify";
			
				//var isSentSMS=sendSMS(JM_Phone,sms);
				var dbData={
					url:'',
					arr:req.body,
					DA_DA_ID:DA_DA_ID,									                              
				  }

				const flag=await jsonEncrypt(dbData);						



				var resp=await wrapedSendMailInfo(mailOptions);
				var resp2=await wrapedSendMailInfo(mailOptions2);

				res.json({status:1,flag:flag});		
				
			}	
		});

	
	}
	else
	{
		//console.log('no payment id');
		res.json({status:0,msg:"no payment id"});
	}
	
})

app.post('/admin/isUserBlock',async (req,res)=>{

	var JM_ID=parseInt(req.headers['id'])
	if(typeof JM_ID=='undefined' || isNaN(JM_ID))
		JM_ID=0;

			
	var TM_Token=req.headers['authorization'];
	if(typeof TM_Token=='undefined' || TM_Token.length ==0)
		TM_Token="";

		let q="SELECT * FROM token_master tm where JM_ID="+JM_ID+" and TM_Token='"+TM_Token+"'";
		const isValidToken=await model.sqlPromise(q);
		let isValid=0;
		if(isValidToken!=null && isValidToken.length > 0)
		{
			isValid=1;
		}


	let sql="SELECT JM_ID,isBlocked,isDeleted from joining_master where JM_ID="+JM_ID+" and (isBlocked=1 or isDeleted=1);" ;
	const data=await model.sqlPromise(sql);
	if(data!=null && data.length > 0)
	{	
		//blocked or deleted
		const isBlocked=data[0].isBlocked;
		const isDeleted=data[0].isDeleted;


		console.log(data[0].isBlocked)

		


		var dbData={	
			isBlocked:isBlocked,
			isDeleted:isDeleted,
			isValid:isValid         
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:0,
			flag:flag
		});

		// res.json({
		// 	status:0,
		// 	isBlocked:isBlocked,
		// 	isDeleted:isDeleted,
		// 	isValid:isValid
		// });
	}
	else
	{
		//active user

		var dbData={			
			isValid:isValid         
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:1,
			flag:flag
		});
		
	}
});



app.post('/admin/sendIcs',async (req,res)=>{

	let data=await icsGenerator();
	console.log(data)
});
//ics file generator
async function icsGenerator()
{
const ical = require('ical-generator');
const cal = ical();

var Startdate = '2021-08-30';
var Starttime = '08:24 PM';

var EndDate = Startdate;
var Endtime = '09:24 PM';

var momentObj = moment(Startdate + Starttime, 'YYYY-MM-DDLT');
var momentObj2 = moment(EndDate + Endtime, 'YYYY-MM-DDLT');
// conversion
var dateTime_start = momentObj.format('YYYY-MM-DDTHH:mm');
var dateTime_end = momentObj2.format('YYYY-MM-DDTHH:mm');

console.log(dateTime_start);
console.log(dateTime_end);



	return new Promise(async function(resolve,reject)
	{
				var options = {
					start: moment(),
					end: moment().add(1, 'hour'),
					timestamp: moment(),
					summary: 'My Event',
					title : 'Annual function',
					description : 'Lets enjoy and relax',
					id : 'wdcwe76234e127eugb', 
					organiser : {'name' : 'Vishnu Singh', 'email':'vsvishnusingh@gmail.com'},
					location : 'School'
				}

			


					 cal.createEvent({
					 start: new Date(dateTime_start),
						end: new Date(dateTime_end),
					  summary: options.summary || options.subject,
					  description: options.description || "",
					  location: options.location,
					  organizer: {
						  name: options.organiser.name,
						  email: options.organiser.email
					  },
					  method: 'REQUEST'
				  });



						var to='prashanta.das@velectico.com';

						var mailOptions = {   
							from: "Expy Admin <admin@expy.bio>",  
							to:to,   
							subject: "Hooray! Your Expy Request is Delivered!",  
							html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>  <p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
							alternatives: [{
								contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
								content:  Buffer.from(cal.toString())
							}]
						};

						const respons=await wrapedSendMail(mailOptions);
						console.log(respons)

	});
}



app.post('/admin/videoSessionFree',async(req,res)=>{


			
	const ical = require('ical-generator');
	let cal = ical();
	let cal_follow = ical();

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}



	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;


	var premium_url=process.env.PREMIUM_URL;
	
	var crsf_id=req.headers['token'];
	let paymentId=req.body.paymentId;
	if(typeof crsf_id=='undefined' || crsf_id.length == 0)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}

	let valid=await decryptData_Str(crsf_id,paymentId);
	if(valid==false)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}





	var DA_ID=req.body.DA_ID;
	var ES_ID=parseInt(req.body.ES_ID);
	var BM_Instruction=req.body.BM_Instruction;
	var BM_Name=req.body.BM_Name;
	var BM_Email=req.body.BM_Email;
	var BM_Phone=req.body.BM_Phone;
	var BM_Password=req.body.BM_Password;



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


	console.log("ES_ID")
	console.log(ES_ID)
	ES_ID=await check_IntegerValue(ES_ID);
	if(typeof ES_ID=='undefined' || ES_ID == 0)
	{
		res.json({status:0,msg:'invalid es id'});
		return false;
	}

	if(await isVailableSlot_final_step(ES_ID)==false)
	{
		res.json({status:0,msg:'slot not avalaible'});
		return false;
	}



	// BM_Instruction=await removeSpecialChar_withSpace(BM_Instruction);	
	// BM_Name=await removeSpecialChar_withSpace(BM_Name);	
	// BM_Email=await removeSpecialChar_email(BM_Email)


	//BM_Instruction=connection.escape(BM_Instruction);	
	//BM_Name=connection.escape(BM_Name);
	BM_Email=await removeSpecialChar_email(BM_Email);

	const values = [
		[DA_ID,'NA',BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,Consent,paymentId,Status,BM_FileUrl,MeetingId,ES_ID,1]			
	];



	const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,Consent,Payment_ID,Status,BM_FileUrl,BM_Content_Sent,ES_ID,isFree) VALUES ?";	 	
	
	var data=await model.sqlInsert(sql,values);
	if(data.affectedRows > 0)
	{
		let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
		var update_lead=await model.sqlPromise(q);	



		let query="UPDATE event_slots set ES_Status='Booked' where JM_ID="+JM_ID+" and ES_ID="+ES_ID;		
		var update=await model.sqlPromise(query);	
		let ES_EM_ID=data.insertId;
		if(update.affectedRows===1)
		{
			var blocked=await blockSlot(JM_ID,ES_ID,ES_EM_ID);
		}


		let made_sale="You made a sale";
		let price=BM_Purchase_Amt;
		let lastText="Video session";
		var newFormatText="<div id='latest_div'  style='width: 400px; height: 400px; background: url("+process.env.BASE_URL+"adm/uploads/win.jpg); background-size: cover; background-position:center; border-radius:10px; margin: 10px 0; position: relative; display:table;'><div style='width: 260px; height:50px; margin: auto; margin-top:215px; text-align: center; display: flex; align-content: center;'><h3 style='font-size: 22px; font-weight: bold; margin: auto;'>"+made_sale+"</h3></div><div style='width: 160px; height:45px;  margin: auto; text-align: center;'><h2 style='margin: 0; font-size: 30px; padding: 6px 0;'>&#8377;"+price+"</h2></div><div style='width: 225px; height:40px; margin: auto;  margin-top:10px; text-align: center;'><p style='margin: 0;font-size: 16px; color: #666; line-height: 18px;'>"+lastText+"</p></div></div>";

			
			

				//ics file ====================================================================
				var Startdate = Date_of_session;
                var Starttime = session_timeing.split('-')[0];

                var EndDate = Startdate;
                var Endtime = session_timeing.split('-')[1];

      		

            	  let new_Starttime = Starttime.padStart(8,'0')
             	 let new_Endtime  = Endtime.padStart(8,'0')

                var momentObj = moment.tz(Startdate +" "+ new_Starttime, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");
                var momentObj2 = moment.tz(EndDate  +" "+ new_Endtime, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");


                console.log(Startdate +" "+ new_Starttime);
 				console.log(EndDate +" "+ new_Endtime);

				console.log(momentObj);
                console.log(momentObj2);

                // conversion
                var dateTime_start = momentObj.format('YYYY-MM-DDTHH:mm');
                var dateTime_end = momentObj2.format('YYYY-MM-DDTHH:mm');

                console.log(dateTime_start);
                console.log(dateTime_end);
	//===================================================== creator ics
	



			  var creatorMessage = 'Hi '+JM_Name+',\nCongratulations! A video session slot has been booked from your Expy Page.' +
				  '\n'+BM_Instruction+
				  '\nRequest Details:'+
				  '\nRequester Name:' +BM_Name+
				  '\nRequest Date :' +BM_Purchase_Date+
				  '\nExpy Creator Name:' +JM_Name+
				  '\nExpy Creator URL: '+process.env.BASE_URL+JM_User_Profile_Url+''+
				  '\nRequested Item:'+DA_Title+
				  '\nRequested Item Price: ₹ '+BM_Purchase_Amt+
				  '\nTo join the video session, please click on the following link:'+
				  '\nDate:'+Date_of_session+
				  '\nTime:'+session_timeing+
				  '\nJoining Link:'+premium_url+
				  '\nYour money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.'+
				  '\nContinue creating awesome content to keep your followers engaged!'+
				  '\nFor any queries, you can write to us at support@expy.bio'+
				  '\nRegards,\nTeam Expy\nwww.expy.bio';


                var options = {
                    start: momentObj,
                    end: momentObj2,
                    timestamp: moment(),
                    summary: DA_Title,
                    title : DA_Title,
                    description : creatorMessage,
                    id : MeetingId, 
                    organiser : {'name' : JM_Name, 'email':JM_Email},
                    location : premium_url
                }


				cal.createEvent({
					 start: new Date(options.start),
						end: new Date(options.end),
					  summary: options.summary || options.subject,
					  description: options.description || "",
					  location: options.location,
					  organizer: {
						  name: options.organiser.name,
						  email: options.organiser.email
					  },
					  method: 'REQUEST'
				  });

		

				//var videoMail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<h3> Hi "+JM_Name+",</h3><p> Congratulations! Your video session has been purchased from your Expy Page.</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹  "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
				//var videoMail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<h3> Hi "+JM_Name+",</h3><p> Congratulations! Your video session has been purchased from your Expy Page.</p><p>"+BM_Instruction+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹  "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
				var videoMail="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'>"+newFormatText+"<h3> Hi "+JM_Name+",</h3><p> Congratulations! A video session slot has been booked from your Expy Page.</p><p>"+BM_Instruction+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='"+process.env.BASE_URL+JM_User_Profile_Url+"'>"+process.env.BASE_URL+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
				mailOptions2 = {
					from: "Expy Team <info@expy.bio>", 
					to: JM_Email,
					subject: "Someone has booked a video session with you on Expy!",
					text: "Thanks for Buying product",										  
					html: videoMail,
					alternatives: [{
						contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
						content:  Buffer.from(cal.toString())
					}]
				}




					//===================================================== followers ics

	var  followerMessage = 'Hi '+BM_Name+',\nCongratulations! Your Video Session Request with '+JM_Name+' has been booked.' +
				'\n'+BM_Instruction+
				'\nRequest Details:'+
				'\nRequester Name:' +BM_Name+
				'\nRequest Date :' +BM_Purchase_Date+
				'\nExpy Creator Name:' +JM_Name+
				'\nExpy Creator URL: '+process.env.BASE_URL+JM_User_Profile_Url+''+
				'\nRequested Item:'+DA_Title+
				'\nRequested Item Price: ₹ '+BM_Purchase_Amt+
				'\nTo join the video session, please click on the following link:'+
				'\nDate:'+Date_of_session+
				'\nTime:'+session_timeing+
				'\nJoining Link:'+premium_url+
				'\nYour money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.'+
				'\nContinue creating awesome content to keep your followers engaged!'+
				'\nFor any queries, you can write to us at support@expy.bio'+
				'\nRegards,\nTeam Expy\nwww.expy.bio';

				  var options_follower = {
                    start: momentObj,
                    end: momentObj2,
                    timestamp: moment(),
                    summary: DA_Title,
                    title : DA_Title,
                    description : followerMessage,
                    id : MeetingId, 
                    organiser : {'name' : JM_Name, 'email':JM_Email},
                    location : premium_url
                }


				cal_follow.createEvent({
					 start: new Date(options_follower.start),
						end: new Date(options_follower.end),
					  summary: options_follower.summary || options_follower.subject,
					  description: options_follower.description || "",
					  location: options_follower.location,
					  organizer: {
						  name: options_follower.organiser.name,
						  email: options_follower.organiser.email
					  },
					  method: 'REQUEST'
				  });


		var mailOptions = {   
					from: "Expy Team <info@expy.bio>",  
					to:BM_Email,   
					subject: "Video session booked on Expy!",
					html: "<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p>Congratulations! Your Video Session Request with "+JM_Name+" has been booked.</p> <p>"+mailText+".</p><span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>          <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> We’d also love to learn how your experience with Expy was to serve you better in the future. Please fill out this short <a href='https://docs.google.com/forms/d/10eWWjpWuirOlY8l8D8HXo3WoeF_oskQw1qzfdF4A92M/'>feedback form.</a></p>                    <p>Thank you for purchasing on Expy.</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>",
					alternatives: [{
						contentType: 'text/calendar; charset=UTF-8; method=REQUEST',
						content:  Buffer.from(cal_follow.toString())
					}]

				};





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
						status:1,msg:'mail not sent'
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



//30-aug-2021======================================================
// cron for complete video request if booking date is past
//UPDATE event_slots set ES_Status='Blocked';UPDATE buyers_master SET  Status='C', BM_Updated_Date=NOW() WHERE BM_ID=513;
// no decline on cron  , declined can be done from calender by pressing cancel button in booked slot
// toggle button for removing avalable slot 

var everyFifteenMins='00 */15 * * * * ';
cron.schedule(everyFifteenMins, () => {

 	 console.log("Task is running every 15 mins minute " + new Date());
 	 reminderForVideoSession();	
	  completeVideoSession();
});




async function reminderForVideoSession()
{
	//cronTime: '00 */15 * * * * ' => Executes every 1 minute.

	try 
	{
		// var minutesToAdd=60;
		// var currentDate = new Date();
		// var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
		// var ES_Slot_Start=futureDate.getHours() * 60 + futureDate.getMinutes();
		// console.log(ES_Slot_Start);
	
		var minutesToAdd=60;
		var day=new Date();
		const options= {timeZone:"Asia/Kolkata"};
		const today=moment(new Date()).utc().utcOffset("+05:30").add(minutesToAdd,'minutes')
		console.log(today);
		var mins=moment(today).minute();
		var hours=moment(today).hours();
		var ES_Slot_Start=hours * 60 + mins;
		console.log(ES_Slot_Start);


		
			//var purchased_date=datetime.toISOString().slice(0,10);
			//const sql="SELECT jm.JM_ID,jm.JM_User_Profile_Url,bm.BM_ID,DATE_FORMAT(es.ES_Calendar_Date,'%M %e,%Y') ES_Calendar_Date,jm.JM_Email,jm.JM_Phone,bm.BM_Email,bm.BM_Phone,da.DA_Title,da.DA_Description,da.EM_Mail_Text,bm.BM_Instruction,bm.BM_Purchase_Amt,DATE_FORMAT(bm.BM_Purchase_Date,'%M %e,%Y') BM_Purchase_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,    CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),2,'0'),':', RPAD(TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2),2,'0')) startSlotTime, CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_End,0) /60),2,'0'),':',RPAD(TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2),2,'0')) endSlotTime from event_slots  es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join buyers_master bm on bm.ES_ID=es.ES_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID where es.ES_Calendar_Date=CURDATE() and es.ES_Status='Booked' and es.ES_Slot_Start="+ES_Slot_Start+";";
			const sql="SELECT bm.BM_Name,jm.JM_Name,es.ES_ID,bm.BM_Content_Sent,jm.JM_ID,jm.JM_User_Profile_Url,bm.BM_ID,DATE_FORMAT(es.ES_Calendar_Date,'%M %e,%Y') ES_Calendar_Date,jm.JM_Email,jm.JM_Phone,bm.BM_Email,bm.BM_Phone,da.DA_Title,da.DA_Description,da.EM_Mail_Text,bm.BM_Instruction,bm.BM_Purchase_Amt,DATE_FORMAT(bm.BM_Purchase_Date,'%M %e,%Y') BM_Purchase_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,    CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),2,'0'),':', RPAD(TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2),2,'0')) startSlotTime, CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_End,0) /60),2,'0'),':',RPAD(TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2),2,'0')) endSlotTime from event_slots  es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join buyers_master bm on bm.ES_ID=es.ES_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID where es.ES_Calendar_Date=CURDATE() and es.ES_Status='Booked' and es.ES_Slot_Start="+ES_Slot_Start+";";
			//const sql="SELECT bm.BM_Name,jm.JM_Name,es.ES_ID,bm.BM_Content_Sent,jm.JM_ID,jm.JM_User_Profile_Url,bm.BM_ID,DATE_FORMAT(es.ES_Calendar_Date,'%M %e,%Y') ES_Calendar_Date,jm.JM_Email,jm.JM_Phone,bm.BM_Email,bm.BM_Phone,da.DA_Title,da.DA_Description,da.EM_Mail_Text,bm.BM_Instruction,bm.BM_Purchase_Amt,DATE_FORMAT(bm.BM_Purchase_Date,'%M %e,%Y') BM_Purchase_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,    CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),2,'0'),':', RPAD(TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2),2,'0')) startSlotTime, CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_End,0) /60),2,'0'),':',RPAD(TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2),2,'0')) endSlotTime from event_slots  es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join buyers_master bm on bm.ES_ID=es.ES_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID where es.ES_Calendar_Date=CURDATE() and es.ES_Status='Booked' and es.ES_Slot_Start="+ES_Slot_Start+";";
			
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
					var BM_Name=result[i].BM_Name;var BM_Email=result[i].BM_Email;
					var BM_Purchase_Date=result[i].BM_Purchase_Date;
					var DA_Title=result[i].DA_Title;
					var BM_Purchase_Amt=result[i].BM_Purchase_Amt;
					var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
					var JM_Email=result[i].JM_Email;
					var BM_ID=result[i].BM_ID;
					var JM_Phone=result[i].JM_Phone;
					var BM_Instruction=result[i].BM_Instruction;
	
					var Date_of_session=result[i].ES_Calendar_Date;
					let startTime=result[i].startSlotTime;
					let endTime=result[i].endSlotTime;
					let mailText=result[i].EM_Mail_Text;
					var startSlotTime=await tConvert24To12(startTime);
					var endSlotTime=await tConvert24To12(endTime);
					let premium_url=result[i].BM_Content_Sent;
					
					 premium_url=process.env.BASE_URL+"meet?id="+premium_url;

					let ES_ID=result[i].ES_ID;
	
					var session_timeing=startSlotTime + ":" + endSlotTime;
	
					var html_creator="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p> Get ready! You have a video session slot in 1 hour on Expy.</p><p>"+BM_Instruction+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
			
					var html_follower="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p> Congratulations! Your Video Session with "+JM_Name+" is in 1 hour.</p><p>"+mailText+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
			
					var mailOptions = {
						from: "Expy Team <info@expy.bio>",
						to: JM_Email,
						subject: "You have a video session in 1 hour on Expy!",			
						html: html_creator                       
					}
					var mailOptions2 = {
						from: "Expy Team <info@expy.bio>",
						to: BM_Email,
						subject: "You have a video session in 1 hour on Expy!",			
						html: html_follower                       
					}                
										   
					 var resp=await wrapedSendMailInfo(mailOptions);			
					 var resp2=await wrapedSendMailInfo(mailOptions2);	
	
					 let u="UPDATE buyers_master set isReminder=1 where BM_ID="+BM_ID+" and ES_ID="+ES_ID;
					 let updateDone=await model.sqlPromise(u);
					 console.log(" updated --> "+updateDone.affectedRows)
					 
				}
				console.log("count "+c)
			}
	}
	catch(error) 
	{
		res.status(error.response.status)
		return res.send(error.message);
	}   
}

async function tConvert24To12(time)
{
  // Check correct time format and split into components
  time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
	time = time.slice (1);  // Remove full string match value
	time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
	time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

//31-aug-2021======================================================
app.post('/admin/testReminder',async(req,res)=>{

			const sql="SELECT bm.BM_Name,jm.JM_Name,es.ES_ID,bm.BM_Content_Sent,jm.JM_ID,jm.JM_User_Profile_Url,bm.BM_ID,DATE_FORMAT(es.ES_Calendar_Date,'%M %e,%Y') ES_Calendar_Date,jm.JM_Email,jm.JM_Phone,bm.BM_Email,bm.BM_Phone,da.DA_Title,da.DA_Description,da.EM_Mail_Text,bm.BM_Instruction,bm.BM_Purchase_Amt,DATE_FORMAT(bm.BM_Purchase_Date,'%M %e,%Y') BM_Purchase_Date,es.ES_Slot_Start slotStartNum,es.ES_Slot_End slotEndNum,    CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_Start,0) /60),2,'0'),':', RPAD(TRUNCATE((IFNULL(es.ES_Slot_Start,0) % 60),2),2,'0')) startSlotTime, CONCAT(LPAD(FLOOR(IFNULL(es.ES_Slot_End,0) /60),2,'0'),':',RPAD(TRUNCATE((IFNULL(es.ES_Slot_End,0) % 60),2),2,'0')) endSlotTime from event_slots  es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join buyers_master bm on bm.ES_ID=es.ES_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID where es.ES_Calendar_Date=CURDATE() and es.ES_Status='Booked';";
		
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
					var BM_Name=result[i].BM_Name;var BM_Email=result[i].BM_Email;
					var BM_Purchase_Date=result[i].BM_Purchase_Date;
					var DA_Title=result[i].DA_Title;
					var BM_Purchase_Amt=result[i].BM_Purchase_Amt;
					var JM_User_Profile_Url=result[i].JM_User_Profile_Url;
					var JM_Email=result[i].JM_Email;
					var BM_ID=result[i].BM_ID;
					var JM_Phone=result[i].JM_Phone;
					var BM_Instruction=result[i].BM_Instruction;
	
					var Date_of_session=result[i].ES_Calendar_Date;
					let startTime=result[i].startSlotTime;
					let endTime=result[i].endSlotTime;
					let mailText=result[i].EM_Mail_Text;
					var startSlotTime=await tConvert24To12(startTime);
					var endSlotTime=await tConvert24To12(endTime);
					let premium_url=result[i].BM_Content_Sent;
					
					let ES_ID=result[i].ES_ID;
	
					var session_timeing=startSlotTime + ":" + endSlotTime;
	
					var html_creator="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+JM_Name+",</h3><p> Get ready! You have a video session slot in 1 hour on Expy.</p><p>"+BM_Instruction+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
			
					var html_follower="<div style='margin: 5px;padding: 10px;text-align: justify;font-size: 16px;'><h3> Hi "+BM_Name+",</h3><p> Congratulations! Your Video Session with "+JM_Name+" is in 1 hour.</p><p>"+mailText+"</p> <span><u> Request Details </u> :</span><br/> <span>Requester Name: "+BM_Name+"</span><br/> <span>Request Date : "+BM_Purchase_Date+"</span><br/>        <span>Expy Creator Name: "+JM_Name+"</span><br/>          <span>Expy Creator URL: <a href='https://expy.bio/"+JM_User_Profile_Url+"'> https://expy.bio/"+JM_User_Profile_Url+" </a></span><br/>          <span>Requested Item: "+DA_Title+" </span><br/>          <span>Requested Item Price: ₹ "+BM_Purchase_Amt+"</span><br/>           <p>To join the video session, please click on the following link:</p><span>Date :"+Date_of_session+"</span><br/><span>Time:"+session_timeing+"</span><br/><span>Joining Link: <a href='"+premium_url+"'><b>click here to join</b></a></span><p> Your money amount will be available for payout to your mentioned Bank account details once your wallet reaches ₹1,000. Please ensure that your bank account details are updated.</p>                    <p>Continue creating awesome content to keep your followers engaged!</p>                 <p><i>For any queries, you can write to us at support@expy.bio</i></p>  <span><b>Regards,</b></span><br/><span>Team Expy,</span><br/><span><a href='"+process.env.BASE_URL+"'>www.expy.bio</a></span></div>";
			
					var mailOptions = {
						from: "Expy Team <info@expy.bio>",
						to: JM_Email,
						subject: "You have a video session in 1 hour on Expy!",			
						html: html_creator                       
					}
					var mailOptions2 = {
						from: "Expy Team <info@expy.bio>",
						to: BM_Email,
						subject: "You have a video session in 1 hour on Expy!",			
						html: html_follower                       
					}                
										   
					 var resp=await wrapedSendMailInfo(mailOptions);			
					 var resp2=await wrapedSendMailInfo(mailOptions2);	
	
					 let u="UPDATE buyers_master set isReminder=1 where BM_ID="+BM_ID+" and ES_ID="+ES_ID;
					 let updateDone=await model.sqlPromise(u);
					 console.log(" updated --> "+updateDone.affectedRows)
					 
				}
				console.log("count "+c)
			}
})





app.post('/admin/blockedSlot',async(req,res)=>{


	var JM_ID=parseInt(req.headers['id']);
	JM_ID=await check_IntegerValue(JM_ID);	
	var ES_ID=parseInt(req.body.ES_ID)
	if(await isCreators_Slot(JM_ID,ES_ID)==false)
	{
		res.json({
			status:0,msg:'not authorized'
		})
	}

	 if(await check_IntegerValue(ES_ID) > 0)
	 {
		let sql="Update event_slots set ES_Status='Blocked' WHERE ES_ID="+ES_ID;
		const data=await model.sqlPromise(sql);
		res.json({
			status:1,msg:'update'
		})
	 }
	 else
	 {
		res.json({
			status:0,msg:'no update'
		})
	 }
});

async function check_IntegerValue(value)
{
	if(typeof value=='undefined' || isNaN(value) || value==null)
	  value=0;
	
	return value;
}

app.post('/admin/Get_All_Booking_By_Date_Month',async(req,res)=>
{
	var JM_ID=parseInt(req.headers['id'])
	var month=await check_IntegerValue(parseInt(req.body.month));
	var year=await check_IntegerValue(parseInt(req.body.year));

	if(await check_IntegerValue(JM_ID) > 0)
	{
		let sql="SELECT DAY(ES_Calendar_Date) calDay, MONTH(ES_Calendar_Date) calMonth,YEAR(ES_Calendar_Date) calYear,COUNT(*) noOfBooking from  event_slots WHERE JM_ID="+JM_ID+" and ES_Status='Booked' and MONTH(ES_Calendar_Date)="+month+" and YEAR(ES_Calendar_Date)="+year+"  and DATE(ES_Calendar_Date) >= CURDATE() GROUP By DATE(ES_Calendar_Date) order by DATE(ES_Calendar_Date);";
		const data=await model.sqlPromise(sql);
		if(data!=null && data.length > 0)
		{

			var dbData={	
				bookingData:data            
			  }
			const flag=await jsonEncrypt(dbData);
			res.json({
				status:1,
				flag:flag
			});
			// res.json({
			// 	status:1,bookingData:data
			// })
		}		
		else
			res.json({
				status:0,msg:'no booking'
			})
	}
	else
	{
		res.json({
			status:0,msg:'param missing'
		})
	}

	
});


app.post('/admin/testComplete',async(req,res)=>{
	completeVideoSession();
});


async function completeVideoSession()
{
	try {
		// var minutesToAdd=1;
		// var currentDate = new Date();
		// var futureDate = new Date(currentDate.getTime() - minutesToAdd*60000);
		// var ES_Slot_End=futureDate.getHours() * 60 + futureDate.getMinutes();
		// console.log(ES_Slot_End);


		var day=new Date();
		const options= {timeZone:"Asia/Kolkata"};
		const today=moment(new Date()).utc().utcOffset("+05:30").subtract(1,'minutes')
		console.log(today);
		var mins=moment(today).minute();
		var hours=moment(today).hours();
		var ES_Slot_End=hours * 60 + mins;
		console.log(ES_Slot_End);



		let sql="SELECT bm.BM_ID,es.ES_ID from event_slots  es inner join joining_master jm on jm.JM_ID=es.JM_ID inner join buyers_master bm on bm.ES_ID=es.ES_ID inner join direct_access_master_user da on da.DA_ID=es.ES_EM_ID where es.ES_Calendar_Date <= CURDATE() and es.ES_Status='Booked' and es.ES_Slot_End <= "+ES_Slot_End+" and  bm.Status='B'";
	
		const data=await model.sqlPromise(sql);
		console.log(data)
		if(data.length > 0)
		{
			let len=data.length;
			for (let i = 0; i < len; i++) 
			{
				const element = data[i];
				let q="UPDATE buyers_master  set Status='C' where BM_ID="+element.BM_ID+";";
					q+="UPDATE event_slots es2 set es2.ES_Status='Completed' where es2.ES_ID="+element.ES_ID+";";
					const resp=await model.sqlPromise(q);
			}
		}
	} catch (error) 
	{
		console.log("error in completeVideoSession in cron")
	}
	
	
}





async function addTrackRecord(values)
{	
	

	try{
		const sql = "INSERT INTO tbl_transaction(Name,Email,Product_Id,Order_Id,Amount,Status,created_at) VALUES ?";	  
		const transaction=await model.sqlInsert(sql,values);
	}
	catch(e)
	{
		console.log(" exception in addTrackRecord")
	}
}



async function verifyPayment(response)
{
	let body=response.razorpay_order_id + "|" + response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_PAY_KEY_SECRET)
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig received " ,response.razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
  var response = {"signatureIsValid":"false"}
  if(expectedSignature === response.razorpay_signature) 
	{
		console.log("done")
		return true;
	}
  else
   return false;
  
}

async function updateTran(Payment_Id,Status,Order_Id)
{
	try{
		let sql="UPDATE tbl_transaction set Payment_Id='"+Payment_Id+"',Status='"+Status+"' where Order_Id='"+Order_Id+"'";
		const data=await model.sqlPromise(sql);
	}
	catch(e)
	{
		console.log("here 2")
	}
}


app.post('/admin/sever_update',async(req,res)=>{

	let sql="SELECT * FROM tbl_server_msg";
	const data=await model.sqlPromise(sql);
	if(data.length > 0)
	{
		const Active=data[0].Active;
		const Message=data[0].Message;
		if(Active==1)
		{
			res.json({
				status:1,msg:Message
			})
		}
		else
		{
			res.json({
				status:0
			})
		}
		
	}
	else
	{
		res.json({
			status:0
		})
		
	}
});


app.post('/admin/fetchPayment',async(req,res)=>{

	var payment_id=req.body.payment_id;

	const result=await fetchPayment(payment_id);
	let amount=0;let fee=0;let tax=0;
	var paymentData=result.data;
	console.log("paymentData")
	console.log(paymentData)
	console.log(paymentData.status)

	let creator_get=0;
	if(result.status==1 && paymentData!=null  && (paymentData.status=='captured' || paymentData.status=='authorized' ))
	{
		amount=parseFloat(paymentData.amount);
		fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
		tax=parseFloat(paymentData.tax);
		var expy_get=(amount * .10) / 100;						
		creator_get=creator_get - expy_get
		console.log(creator_get)
		fee=fee/100;	
		tax=tax/100;
	}                


});



async function fetchPayment(payment_id)
{
	var request = require('request');

		//request('https://[YOUR_KEY_ID]:[YOUR_KEY_SECRET]@api.razorpay.com/v1/payments/pay_29QQoUBi66xm2f', function (error, response, body) {
		//console.log('Response:', body);
		//});
	try 
	{		
		if(typeof payment_id!='undefined' && payment_id.length > 0 && payment_id.startsWith('pay_'))
		{
			let url='';var method="GET";
			url="https://"+key_id+":"+key_secret+"@api.razorpay.com/v1/payments/"+payment_id;
		   
		   
		   console.log('url  --> ', url); 
		   const requestPromise = util.promisify(request);
		   const response = await requestPromise({
						   url: url,
						   method: method			
		   
			   });
			console.log('contact --->');    
			console.log('response', response.body.id);                         
		   if(response.statusCode!=400)
		   {	
			   
			  var data=response.body;
			  var str=data.replace(/\\/g, ''); 
			  var jsonObj =JSON.parse(str)
	   
				console.log('response',jsonObj);     
			   var result={
				   status:1,
				   data:jsonObj
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
	catch (error) 
	{
		var result={
			   status:0,
			   data:[]
		   }
		   return result;
	}


}

app.post('/admin/fetchContest',async(req,res)=>{
	
	var JM_ID = await check_IntegerValue(req.headers['id']);
	





	let sql="Select dam.DA_ID tableId, dam.DA_DA_ID prodId, dam.DA_Type as prodType, dam.JM_ID JM_ID, dam.DA_Cover cover,'' image,'' icon,	dam.DA_Title title,dam.DA_Description description,dam.DA_Price price,dam.DA_Active activeInactive,dam.DA_Collection collection,	dam.Archive archive,dam.Create_Date Create_Date,0 folderId,'' URL,dam.Order_By_All,    dam.DA_Car_Image1 carousel_1,    dam.DA_Car_Image2 carousel_2,    dam.DA_Car_Image3 carousel_3,     dam.DA_Car_Image1_Title carousel_title_1,     dam.DA_Car_Image2_Title carousel_title_2,		 dam.DA_Car_Image3_Title carousel_title_3,    dam.DA_INR_Doller,    dam.EM_Mail_Text mailText,       dam.EM_Duration duration,       dam.EM_Plan_Days planDays,    	dam.Q1 Q1,    dam.Q2 Q2,    dam.Q3 Q3,    dam.Q4 Q4,    dam.File_Upload File_Upload,		dam.DA_Allow_Cust_Pay,    dam.DA_Min_Amount,      dam.DA_Suggested_Amont,    dam.File_upload_text File_upload_text		from direct_access_master_user dam inner join joining_master jm on jm.JM_ID=dam.JM_ID where dam.Archive=0 and jm.JM_ID="+JM_ID+" and dam.DA_DA_ID in(6)";
	
	const data=await model.sqlPromise(sql);
	if(data.length > 0)
	{	
	
		var dbData={	
			contestData:data               
		  }
		const flag=await jsonEncrypt(dbData);
		res.json({
			status:1,
			flag:flag
		});
	}
	else
	{
		res.json({
			status:0,flag:'no data found'
		})
	}

});

app.post('/admin/declinePendingAcceptRequest',async(req,res)=>{
	
	await declinePendingAcceptRequest();
});

app.post('/admin/dataUncaptured',async(req,res)=>{
	


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;




	
	var crsf_id=req.headers['token'];
	let paymentId=req.body.paymentId;

	console.log("paymentId")
	console.log(paymentId)
	if(typeof crsf_id=='undefined' || crsf_id.length == 0)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}

	let valid=await decryptData_Str(crsf_id,paymentId);
	if(valid==false)
	{
		res.json({status:0,msg:'invalid api calling'});
		return false;
	}

		var dataJson={
				"paymentId": "pay_123456",
				"entity": "payment",
				"amount": 999900,
				"currency": "INR",
			}
		const unCapturedData=req.body;

		let stringyFi=JSON.stringify(unCapturedData);

		const values = [
			[stringyFi]
		];
		const sal = "INSERT INTO tbl_uncaptured (Data) VALUES ?";	 
		const data=await model.sqlInsert(sal,values);
		if(data.affectedRows == 1)
			res.json({
				status:1
			})
		else res.json({
			status:0
		})
});


async function checkUndefined_String(str)
{
	if(typeof str=='undefined' || str.length ==0)
		return true;
	else 
		return false;
}

async function isCreators_product(JM_ID,DA_ID)
{
		let q="SELECT *  from direct_access_master_user da inner join joining_master jm on jm.JM_ID=da.JM_ID where jm.JM_ID="+JM_ID+" and da.DA_ID="+DA_ID+" and da.Archive=0  and jm.isBlocked=0 and jm.isDeleted=0 ;";
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return false;
		else return true;
}
async function isCreators_social(JM_ID,SWM_ID)
{
		let q="SELECT * from social_widget_master sm  inner join joining_master jm on jm.JM_ID=sm.JM_ID where sm.JM_ID="+JM_ID+" and sm.SWM_ID="+SWM_ID+" and jm.isBlocked=0 and jm.isDeleted=0;";
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return false;
		else return true;
}
async function isCreators_category(JM_ID,CM_ID)
{
		let q="SELECT * from category_master sm  inner join joining_master jm on jm.JM_ID=sm.JM_ID where sm.JM_ID="+JM_ID+" and sm.CM_ID="+CM_ID+" and jm.isBlocked=0 and jm.isDeleted=0;";
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return false;
		else return true;
}
async function isCreators_embed(JM_ID,EC_ID)
{
		let q="SELECT * from embed_content sm  inner join joining_master jm on jm.JM_ID=sm.JM_ID where sm.JM_ID="+JM_ID+" and sm.EC_ID="+EC_ID+" and jm.isBlocked=0 and jm.isDeleted=0;";
		const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return false;
		else return true;
}
async function isCreators_link(JM_ID,LM_ID)
{
		let q="SELECT * from link_master sm  inner join joining_master jm on jm.JM_ID=sm.JM_ID where sm.JM_ID="+JM_ID+" and sm.LM_ID="+LM_ID+" and jm.isBlocked=0 and jm.isDeleted=0;";
		
		console.log(q)
		const response=await model.sqlPromise(q);
		console.log(response)
		if(response!=null && response.length === 0)
			return false;
		else return true;
}

async function Creators_Specific_Details(JM_ID)
{
		let query="select JM_User_Profile_Url,CONCAT(JM_User_Profile_Url,'_',JM_ID) JM_User_Profile_Url_plus_JM_ID,JM_Email,JM_Phone from joining_master where JM_ID="+JM_ID;
	
		const Qdata=await model.sqlPromise(query);

		if(Qdata!=null && Qdata.length==0)
		{
			var data={
				status:0,
				msg:' profilename does not exist'
			}
			return data;			
		}
		else
		{

			var data={
				status:1,
				Creators:Qdata
			}
			return data;		
		}
}

async function isCreators_Slot(JM_ID,ES_ID)
{
	try {
		let q="SELECT es.ES_ID,es.ES_EM_ID,es.JM_ID from event_slots es inner join joining_master jm on jm.JM_ID=es.JM_ID where es.JM_ID="+JM_ID+" and es.ES_ID="+ES_ID+";";
	const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return false;
		else return true;
	} catch (error) {
		return false;
	}
	
}

async function isValidPayment(Payment_ID)
{
	try {
		let q="SELECT bm.DA_ID,bm.BM_ID,bm.Payment_ID,bm.LM_ID FROM buyers_master bm  	where bm.Payment_ID='"+Payment_ID+"'";
	const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return true;
		else return false;
	} catch (error) {
		return false;
	}
	
}

async function isValidPayment_Contest(Payment_ID)
{
	try {
		let q="select * from contest_master cm where cm.Payment_Id='"+Payment_ID+"'";
	const response=await model.sqlPromise(q);
		if(response!=null && response.length === 0)
			return true;
		else return false;
	} catch (error) {
		return false;
	}
	
}

//delete tokens
async function DeleteTokens_Last_Hours(hours=24)
{
	let sql="DELETE from token_master  WHERE DATE(Create_Date) > (NOW() - INTERVAL "+hours+" HOUR) and Keep=0;";
	const data=await model.sqlPromise(sql);
	console.log(data)

	let q="DELETE from token_master  WHERE DATE(Create_Date) > (NOW() - INTERVAL 7 DAY) and Keep=1;";
	const Qdata=await model.sqlPromise(q);

	console.log(Qdata)
}


// var tokenDeleteCron= '00 */3 * * * * ';                         
// cron.schedule(tokenDeleteCron, async () => {
// 	console.log("Task is running every 3 minute " + new Date());
	
// 	//await DeleteTokens_Last_Hours();
// });                                    
       
app.post('/admin/email_Already_inContest',async(req,res)=>{

	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}


	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	console.log(req.body)


	var CM_Email=req.body.Email;
	var DA_ID=parseInt(req.body.Product_Id);
	if(typeof CM_Email=='undefined' || CM_Email.length==0)
	{
		console.log("CM_Email")
		res.json({status:0,msg:'invalid params'})
		return false;
	}
	if(await check_IntegerValue(DA_ID)==0)
	{
		console.log("DA_ID")
		res.json({status:0,msg:'invalid params'})
		return false;
	}


	if(await email_Already_inContest(CM_Email,DA_ID)==false)
		res.json({status:0})
	else
		res.json({status:1})

});
async function email_Already_inContest(CM_Email,DA_ID) 
{
	try {
		
		const q="SELECT * from contest_master cm WHERE cm.DA_ID="+DA_ID+" and cm.CM_Email='"+CM_Email+"';";
		const data=await model.sqlPromise(q);
		if(data!=null && data.length > 0)
			return false;
		else
			return true;
	}
	 catch (error) 
	{
		console.log("inside exception in email_Already_inContest" +CM_Email + " "+ DA_ID)
		return false;
	}
	
}

async function isVailableSlot_final_step(ES_ID)
{
	if(ES_ID > 0)
	{
		let v="select bm.ES_ID,bm.isFree,es.ES_Status from buyers_master bm inner join event_slots es on es.ES_ID=bm.ES_ID where bm.ES_ID="+ES_ID;
		const Vdata=await model.sqlPromise(v);
		if(Vdata!=null && Vdata.length > 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

async function valid_jsonFlag(req)
{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}

	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
	return true;
}


// data updation 28-sep-2021
app.get('/admin/migrate_tax_fee_actual',async(req,res)=>{

	console.log("working");
	// this query for those who have no payment id , ============================================
	//for buyers master , update actual amount,purcahsed amount,fee,tax
	//for contest master================================
	//purcahsed amount will be 90% and Actual amount will be 100%

	
	//let q1="UPDATE buyers_master set 	Actual_Price=BM_Purchase_Amt,	BM_Purchase_Amt=((BM_Purchase_Amt/100) * 90)	 where Payment_ID='' and BM_Purchase_Amt > 0";
	//let q1="UPDATE buyers_master set 	UPDATE buyers_master set Actual_Price=BM_Purchase_Amt,Fee=((BM_Purchase_Amt * 2/100) + ((BM_Purchase_Amt * 2/100) * .18)),	BM_Purchase_Amt=CAST((BM_Purchase_Amt - (BM_Purchase_Amt * 1.65/100) - ((BM_Purchase_Amt - (BM_Purchase_Amt * 1.65/100)) * .10)) as decimal(10,2))	where Payment_ID='' and Actual_Price=0;";
	//const noPayment=await model.sqlPromise(q1);
	//================================ buyer master end

	//for contest master=======


	//================================ contest master end
								
	




	// this query for those who have payment id =============================================================
	//and have to fetch paymentdetails from razorpay and update the purcahsed_amount,fee, actual price,tax,  


	
		//================================================== calculation for tax fee, actual amt

//buyer 
	let q2="select bm.BM_ID,bm.Payment_ID,bm.BM_Purchase_Amt,bm.Actual_Price,bm.Tax,bm.Fee from buyers_master bm where Actual_Price=0;";
	//1.99 18
		const data=await model.sqlPromise(q2);
		if(data!=null && data.length > 0)
		{
			for (let i = 0; i < data.length; i++) 
			{
				const item=data[i];
				let BM_ID=item.BM_ID;
                let BM_Purchase_Amt=parseFloat(item.BM_Purchase_Amt);
				const result=await fetchPayment(item.Payment_ID);
				let amount=0;let fee=0;let tax=0;
				var paymentData=result.data;
                                            
				console.log("database")
				console.log(item.Payment_ID)
				console.log("razorpay")
				console.log(paymentData.id)
                                            
				let creator_get=0;
				if(result.status==1 && paymentData!=null  && (paymentData.status=='captured' || paymentData.status=='authorized' ))
				{
					amount=parseFloat(paymentData.amount);
					fee=parseFloat(paymentData.fee) ;// fee + 18/100 of fee
					tax=parseFloat(paymentData.tax);
					creator_get=(amount - fee) / 100; 
					var expy_get=((amount - fee) * .10) / 100;						
					creator_get=creator_get - expy_get;
					console.log(creator_get)
					fee=fee/100;	
					tax=tax/100;
					var Actual_Price=amount/100;
					var BM_Purchase_Amt_calculated=creator_get.toFixed(2);
                                            
                    console.log("Actual_Price")
					console.log(Actual_Price)
					console.log("fee")
					console.log(fee)
					console.log("tax")
					console.log(tax)                        
                                            
					let sql="UPDATE buyers_master set Actual_Price="+Actual_Price+",BM_Purchase_Amt='"+BM_Purchase_Amt_calculated+"',Fee='"+fee.toFixed(2)+"',Tax='"+tax.toFixed(2)+"'  where BM_ID="+BM_ID+";";
                 	const sql_data=await model.sqlPromise(sql);
					console.log(BM_ID)
				}
                else
				{
					if(BM_Purchase_Amt > 0)
					{
						//update with fixed 1.65% on total amount
						amount=BM_Purchase_Amt * 100;
						fee=(amount * 2/100) + ((amount * 2/100) * .18);// fee + 18/100 of fee
						tax=(amount * 2/100) * .18; //100-2.36
						creator_get=(amount - fee) / 100; 
						var expy_get=((amount - fee) * .10) / 100;						
						creator_get=creator_get - expy_get;
						console.log(creator_get)
						fee=fee/100;	
						tax=tax/100;
						var Actual_Price=amount/100;
						var BM_Purchase_Amt_calculated=creator_get.toFixed(2);

						let q3="UPDATE buyers_master set 	Actual_Price="+Actual_Price+",	BM_Purchase_Amt="+BM_Purchase_Amt_calculated+",Fee="+fee.toFixed(2)+",Tax="+tax.toFixed(2)+"	 where BM_ID="+BM_ID;
						const q3_data=await model.sqlPromise(q3);
						console.log("else")
						console.log(BM_ID)
					}
				}
			}

		}
                                            
        // res.json({
		// 	status:1
		// })
		
});

async function removeSpecialChar(str)
{
	
	str=str.replace(/[^A-Za-z0-9_-]/g, "");
	console.log(str);
	return str;
}


async function removeSpecialChar_withSpace(str)
{
	return str.replace(/[^A-Za-z0-9_-]/g, " ");
}

async function removeSpecialChar_email(str)
{
	return str.replace(/[^A-Za-z0-9@._-]/g, "");
}

app.post('/admin/callback_url',async(req,res)=>{

	console.log(req.body)

});


async function decryptFlag(req)
{


	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	//console.log(jsonData)
	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;
}


app.post('/admin/rateLimit',async(req,res)=>{

	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	console.log(req.body)
	console.log("i am here rate limit");
	res.send("hello");

})
function isEmptyObject(obj) {
	return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  async function validPassword(password,JM_ID)
  {
	try 
	{
		JM_ID=connection.escape(JM_ID);

	  let sql="SELECT JM_Password,JM_ID,JM_Email FROM joining_master WHERE JM_ID="+JM_ID+" and isBlocked=0 and isDeleted=0";
	  const data=await model.sqlPromise(sql);
		if(data!=null && data.length > 0)
		{
			console.log( data[0].JM_Password)
			let JM_Password=data[0].JM_Password;
			const match = await bcrypt.compare(password, data[0].JM_Password);
			console.log( match)
			return match; 
		}
		else
		{
			return false; // not match
		}
	} catch (error)
	{
		console.log(error);
		return false; // not match
	}
	  

  }



  async function GetAllRequest_by_status(JM_ID,Status_IN)
  {
	  try{		  
				//SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID=338 and bm.Status in('A') order by DATE(bm.BM_Purchase_Date) desc;
				let DA_DA_ID_IN="";		
				let sql="";
				let PENDING_REQUEST_IN="1"; // 1 for personalized video and audio request
				let COMPLETED_DA_DA_ID="1,5"; // 1 for personalized video and audio request, video session complete
				if(Status_IN=='S') // for purchased, prod id 0 =gift,999=support,2=unlock,3=digital goods
				{
					DA_DA_ID_IN="0,2,3,999";
					sql="(SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  and bm.Status in('C') and da.DA_DA_ID in("+DA_DA_ID_IN+") order by DATE(bm.BM_Purchase_Date) desc ) UNION  ";
					sql+=" (SELECT  0 as BM_ID,'' BM_Url_ID,cm.CM_Name BM_Name,'' BM_Phone,cm.CM_Email BM_Email,'' BM_Password,da.DA_ID, cm.CM_Amount BM_Purchase_Amt,cm.Create_Date BM_Purchase_Date,'' BM_Instruction,'' BM_FileUrl,0 Revenue, 'B' BM_Type,'C' as Status,0 Consent,cm.Payment_Id,0 Admin_Payment,jm.JM_ID,'' BM_Content_Sent,'' BM_Updated_Date,1 IsSeen, 'C' Updated_By,0 ES_ID,0 isFree,0 isReminder,cm.LM_ID,cm.Fee,cm.Tax,cm.Actual_Price,'' Accept_Decline_Date,0 isDeclined,'' Dec_Reason,da.*,jm.*,'' JM_Password, cm.Actual_Price actualPrice, DATE_FORMAT(cm.Create_Date,'%D %b %Y')   BM_Purchase_Date,TIME(cm.Create_Date) BM_Purchase_Time,cm.Create_Date as actualPurchaseDate from contest_master cm inner join direct_access_master_user da on da.DA_ID=cm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE cm.JM_ID="+JM_ID+" and cm.Status in('S','C','W') order by DATE(cm.Create_Date) desc);";
					sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
					sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" and da.DA_DA_ID in("+PENDING_REQUEST_IN+") and bm.Status in('P') GROUP BY jm.JM_ID;";
					sql+="SELECT DA_ID as DA_DA_ID,DA_Title FROM direct_access_master where Status='A' and DA_ID not in(999,4) order by DA_ID;";
				}
				else if(Status_IN=='All')
				{
					sql="(SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" order by DATE(bm.BM_Purchase_Date) desc ) UNION  ";
					sql+=" (SELECT  0 as BM_ID,'' BM_Url_ID,cm.CM_Name BM_Name,'' BM_Phone,cm.CM_Email BM_Email,'' BM_Password,da.DA_ID, cm.CM_Amount BM_Purchase_Amt,cm.Create_Date BM_Purchase_Date,'' BM_Instruction,'' BM_FileUrl,0 Revenue, 'B' BM_Type,'C' as Status,0 Consent,cm.Payment_Id,0 Admin_Payment,jm.JM_ID,'' BM_Content_Sent,'' BM_Updated_Date,1 IsSeen, 'C' Updated_By,0 ES_ID,0 isFree,0 isReminder,cm.LM_ID,cm.Fee,cm.Tax,cm.Actual_Price,'' Accept_Decline_Date,0 isDeclined,'' Dec_Reason,da.*,jm.*,'' JM_Password, cm.Actual_Price actualPrice, DATE_FORMAT(cm.Create_Date,'%D %b %Y')   BM_Purchase_Date,TIME(cm.Create_Date) BM_Purchase_Time,cm.Create_Date as actualPurchaseDate from contest_master cm inner join direct_access_master_user da on da.DA_ID=cm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE cm.JM_ID="+JM_ID+" and cm.Status in('S','C','W') order by DATE(cm.Create_Date) desc);";
					sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
					sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" and da.DA_DA_ID in("+PENDING_REQUEST_IN+") and bm.Status in('P') GROUP BY jm.JM_ID;";
					sql+="SELECT DA_ID as DA_DA_ID,DA_Title FROM direct_access_master where Status='A' and DA_ID not in(999,4) order by DA_ID;";
				}
				else if(Status_IN=='C') //completed
				{
				
					sql="SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  and bm.Status in('"+Status_IN+"') and da.DA_DA_ID in("+COMPLETED_DA_DA_ID+") order by DATE(bm.BM_Purchase_Date) desc; ";
					sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
					sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" and da.DA_DA_ID in("+PENDING_REQUEST_IN+") and bm.Status in('P') GROUP BY jm.JM_ID;";
					sql+="SELECT DA_ID as DA_DA_ID,DA_Title FROM direct_access_master where Status='A' and DA_ID not in(999,4) order by DA_ID;";
				}
				else if(Status_IN=='P') //completed
				{
					COMPLETED_DA_DA_ID="1"
					sql="SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  and bm.Status in('P') and da.DA_DA_ID in("+COMPLETED_DA_DA_ID+") order by DATE(bm.BM_Purchase_Date) desc; ";
					sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
					sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" and da.DA_DA_ID in("+PENDING_REQUEST_IN+") and bm.Status in('P') GROUP BY jm.JM_ID;";
					sql+="SELECT DA_ID as DA_DA_ID,DA_Title FROM direct_access_master where Status='A' and DA_ID not in(999,4) order by DA_ID;";
				}
				else // for Pending,accept,declined, booked,
				{
				
					sql="SELECT *,'' JM_Password, ROUND(IFNULL(((bm.BM_Purchase_Amt+bm.Fee)*100/90),0),0) actualPrice,DATE_FORMAT(bm.BM_Purchase_Date,'%D %b %Y')   BM_Purchase_Date,TIME(bm.BM_Purchase_Date) BM_Purchase_Time,bm.BM_Purchase_Date as actualPurchaseDate FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+"  and bm.Status in('"+Status_IN+"') order by DATE(bm.BM_Purchase_Date) desc; ";
					sql+=" Select *,'' JM_Password from joining_master where JM_ID="+JM_ID+";";
					sql+="SELECT COUNT(*) pendingRequest FROM buyers_master bm inner join direct_access_master_user da on da.DA_ID=bm.DA_ID inner join joining_master jm on jm.JM_ID=da.JM_ID WHERE jm.JM_ID="+JM_ID+" and da.DA_DA_ID in("+PENDING_REQUEST_IN+") and bm.Status in('P') GROUP BY jm.JM_ID;";
					sql+="SELECT DA_ID as DA_DA_ID,DA_Title FROM direct_access_master where Status='A' and DA_ID not in(999,4) order by DA_ID;";
				}
				const data=await model.sqlPromise(sql);
				return data;
		} 
		catch (error)
		{
					console.log("exception in GetAllRequest_by_status")
					console.log(error)
					return null;
		}
  }


  //05-nov-2021
  app.post('/admin/declineRequest2Admin',async (req,res)=>{

	try {
			let data= req.body.data;
			if(typeof req.body.Dec_Reason == 'undefined' || req.body.Dec_Reason.length ==0)
			{
				res.json({status:0,msg:"Empty reason"});
				return false;
			}
			let Dec_Reason=connection.escape(req.body.Dec_Reason);
			let BM_ID=data.BM_ID;

			let sql="UPDATE buyers_master set isDeclined=1, Dec_Reason="+Dec_Reason+",Accept_Decline_Date=now() where BM_ID="+BM_ID;
			const result=await model.sqlPromise(sql);
			if(result.affectedRows > 0)
			{

				//mail will be fired
				let adminEmail="admin@expy.bio";		
				let ccEmail="sayan@expy.bio";
				NewreqEmail="<div style='font-size: 16px;'>Decline request received from "+data.BM_Name+" please check admin for more details.</div>";	
				mailOptions2 = {
					from: "Expy Team <admin@expy.bio>",
					to: adminEmail,
					subject: "Decline request received from "+data.BM_Name,
					text: "decline request received ",	
					cc: ccEmail,									  
					html: NewreqEmail
				}

				 const mail=await wrapedSendMail(mailOptions2);
				res.json({
					status:1,
					msg:"Decline request has been sent to admin."
				})
			}
			else
			{
				res.json({status:0,msg:"Network error, try again later."})
			}
	} 
	catch (error) 
	{
		console.log(error);
		res.json({status:0,msg:"Network error, try again later.",exception:"true"})
	}
		

  })


app.get('/admin/exp_admin_panel/approve-decline-request', async (req, res)=>{

	console.log(req.session)
	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');

	res.setHeader('Access-Control-Allow-Origin', '*');	
	var AM_ID=parseInt(req.session.AM_ID);

	var sql="call Get_Declined_Req_from_creators(?)";
	const values=[
		AM_ID
	]
	let dataSP=await call_sp(sql,values);
	if(dataSP!=null && dataSP.length > 0)
	{
		console.log(dataSP[0]);	
		res.render('pages/ApproveUnapproveDecline',{data:dataSP[0],title:' Expy | Approve Decline Request',moment:moment});
	}	
	else
	{
		res.render('pages/ApproveUnapproveDecline',{data:[],title:' Expy | Approve Decline Request',moment:moment});
	}

});

app.post('/admin/approve-decline-request', async (req, res)=>{

	if(req.session.AM_ID == undefined )
		return res.redirect('/admin/exp_admin_panel');
	if(parseInt(req.session.AM_ID) == 0 )
		return res.redirect('/admin/exp_admin_panel');
	var AM_ID=parseInt(req.session.AM_ID);
	
	if(typeof req.body.flag=='undefined' || req.body.flag==null)
	{
		res.json({status:0,msg:"Invalid key"});
		return false;
	}
	
	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)

	if(jsonData==false)
	{
		res.json({status:0,msg:"Invalid data"});
		return false;
	}
	req.body=jsonData;

	let JM_ID = req.body.JM_ID;
	let BM_ID = req.body.BM_ID;
	let isApprove=req.body.isApprove;
	
	let Tax=req.body.Tax;
	let Fee=req.body.Fee;
	let Actual_Price=req.body.Actual_Price;
	let BM_Purchase_Amt=req.body.BM_Purchase_Amt;
	let isFree=req.body.isFree;
	if(isFree==1)  // free declined
	{

	}
	else // paid declined
	{

	}


});


app.listen(port,function(req,res){
	console.log("running..hello  hiiiiiiiiiiii"+__dirname);
});





//{"id":"pay_HiH5LaYWkRDEeg","entity":"payment","amount":1000,"currency":"INR","status":"captured","order_id":"order_HiH4RlPpb8KXPz","invoice_id":null,"international":false,"method":"card","amount_refunded":0,"refund_status":null,"captured":true,"description":"Purchase Description","card_id":"card_HiH5Le0CJw5WW5","bank":null,"wallet":null,"vpa":null,"email":"prashanta.das@velectico.com","contact":"+917894561230","notes":{"address":"Hello World"},"fee":20,"tax":0,"error_code":null,"error_description":null,"error_source":null,"error_step":null,"error_reason":null,"acquirer_data":{"auth_code":"878461"},"created_at":1628332007}
