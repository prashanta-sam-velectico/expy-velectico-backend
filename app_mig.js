var express = require('express')
  , app = express()
  , port = process.env.PORT || 7000

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

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).send({ status: 404, message: err.message }); // Bad request
    }
    next();
});



	

// data updation 28-sep-2021
app.post('/admin/migrate_tax_fee_actual',async(req,res)=>{

	console.log("working");
	// this query for those who have no payment id , ============================================
	//for buyers master , update actual amount,purcahsed amount,fee,tax
	//for contest master================================
	//purcahsed amount will be 90% and Actual amount will be 100%

	
	//let q1="UPDATE buyers_master set 	Actual_Price=BM_Purchase_Amt,	BM_Purchase_Amt=((BM_Purchase_Amt/100) * 90)	 where Payment_ID='' and BM_Purchase_Amt > 0";
	//const noPayment=await model.sqlPromise(q1);
	//================================ buyer master end

	//for contest master=======


	//================================ contest master end

	// this query for those who have payment id =============================================================
	//and have to fetch paymentdetails from razorpay and update the purcahsed_amount,fee, actual price,tax,  

    //================================================== calculation for tax fee, actual amt

//buyer 
	let q2="select bm.BM_ID,bm.Payment_ID,bm.BM_Purchase_Amt,bm.Actual_Price,bm.Tax,bm.Fee from buyers_master bm where bm.Payment_ID!='' and Actual_Price=0;";

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
                                            
				let sql="UPDATE buyers_master set Actual_Price="+Actual_Price+",BM_Purchase_Amt='"+BM_Purchase_Amt_calculated+"',Fee='"+fee+"',Tax='"+tax+"'  where BM_ID="+BM_ID+";";
                 	const sql_data=await model.sqlPromise(sql);
					console.log(BM_ID)
				}
                else
				{
					if(BM_Purchase_Amt > 0)
					{
						//update with fixed 1.65% on total amount
						amount=BM_Purchase_Amt * 100;
						fee=(amount * 1.65/100) ;// fee + 18/100 of fee
						tax=0;
						creator_get=(amount - fee) / 100; 
						var expy_get=((amount - fee) * .10) / 100;						
						creator_get=creator_get - expy_get;
						console.log(creator_get)
						fee=fee/100;	
						tax=tax/100;
						var Actual_Price=amount/100;
						var BM_Purchase_Amt_calculated=creator_get.toFixed(2);

						let q3="UPDATE buyers_master set 	Actual_Price="+Actual_Price+",	BM_Purchase_Amt="+BM_Purchase_Amt_calculated+"	 where BM_ID="+BM_ID;
						const q3_data=await model.sqlPromise(q3);
						console.log("else")
						console.log(BM_ID)
					}
				}
			}

		}
                                            
        res.json({
			status:1
		})
		
});



app.post('/admin/addDoner_Dum',async (req,res)=>{
		
	let jsonData=await decryptJsonData(req.body.flag)
	console.log(jsonData)

	if(typeof jsonData=='undefined' || jsonData==null)
	{
		res.json({status:0,msg:"missing params"});
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
	var JM_User_Profile_Url=req.body.JM_User_Profile_Url;

	let order_id=req.body.ord_id;
	// var instance = new Razorpay({
	// 	key_id:process.env.RAZOR_PAY_KEY_ID,
	// 	key_secret:process.env.RAZOR_PAY_KEY_SECRET,
	// });

	// instance.orders.fetchPayments(order_id)
	var LM_ID=parseInt(req.body.LM_ID);
		if(isNaN(LM_ID)) LM_ID=0;
	if(typeof order_id=='undefined' || order_id.length ==0)
	{
		res.json({status:0,msg:"no order id"});
		return false;
	}
	if(order_id.startsWith('order_'))
	{
				
	
		// let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
		// console.log(q)
		// const done=await model.sqlPromise(q);
		// console.log("here 1")
		// var responseData=req.body.responseData;
		// await updateTran(responseData.razorpay_payment_id,'captured',responseData.razorpay_order_id)
		// console.log("here 3")



		let creator_get=0;
		const values = [
			[DA_ID,"",BM_Name, BM_Email,BM_Phone,hashPassword,BM_Purchase_Amt,BM_Instruction,'',"D",'C',paymentId,JM_ID,LM_ID,0,0,BM_Purchase_Amt,order_id]			
		];
		const sql = "INSERT INTO  buyers_master_dummy(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID,LM_ID,Fee,Tax,Actual_Price,Order_Id) VALUES ?";	  
	
		const respData=await model.sqlInsert(sql,values)
		if(respData.affectedRows == 1)
		{		
			res.json({status:1,msg:"insertion"});
		}
		else
		{
			res.json({status:0,msg:"no insertion"});	
		}
	}
	else
	{
		//console.log('no payment id');
		res.json({status:0,msg:"no order id"});
	}
	
})
const paidMonitizationMsg ="Congratulations! Your transaction was successful. Please check your email for more details.";
app.post('/admin/addDoner_Dum_callback',async (req,res)=>{



		//================================================== calculation for tax fee, actual amt
		console.log(req.body.razorpay_order_id)
		var razorpay_order_id=req.body.razorpay_order_id;
		var razorpay_payment_id=req.body.razorpay_payment_id;
		var razorpay_signature=req.body.razorpay_signature;


	


		const result=await fetchPayment(razorpay_payment_id);
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
		let q="SELECT * FROM buyers_master_dummy bmd inner join direct_access_master_user da on da.DA_ID=bmd.DA_ID inner join joining_master jm on jm.JM_ID=da.DA_ID where bmd.Order_Id='"+razorpay_order_id+"' limit 1";
		const data_q=await model.sqlPromise(q);
		var LM_ID=0,BM_Name='',DA_Title='',BM_Purchase_Amt=0,JM_Email='',JM_Phone'',JM_Name='';
		var sourceDir="";
		if(data_q!=null && data_q.length > 0)
		{
			LM_ID=data_q[0].LM_ID;
			BM_Name=data_q[0].BM_Name;
			JM_Name=data_q[0].JM_Name;
			DA_Title=data_q[0].DA_Title;
			BM_Purchase_Amt=data_q[0].BM_Purchase_Amt;
			BM_Email=data_q[0].BM_Email;
			JM_Email=data_q[0].JM_Email;		
			JM_Phone=data_q[0].JM_Phone;
			JM_User_Profile_Url=data_q[0].JM_User_Profile_Url;
			var fileArr=JSON.parse(jsonRes[0].DA_Collection);	
			var fileName=fileArr[0];	

					var name =path.parse(fileName).name;    
					var ext = path.extname(fileName);
				
					if(fileName!="thankYou.jpg")
                    {
						 sourceDir = 'uploads/Profile/'+JM_User_Profile_Url+"/"+fileName;		
                    }
					else
                    {
 					     sourceDir = "uploads/"+fileName;	
                    }
					var downLoadContent=process.env.BASE_URL+"adm/"+sourceDir;
		}
		else
		{
			res.json({status:0,err:"invalid order id"});
			return false;
		}



		if(typeof razorpay_payment_id=='undefined' || razorpay_payment_id.length ==0)
		{			
			console.log("razorpay_payment_id undfined")
			
			res.redirect(process.env.BASE_URL+JM_User_Profile_Url)
		}

		if(await isValidPayment(razorpay_payment_id)==false)
		{
			//res.json({status:0,err:"invalid payment, you are under attack"});
			res.redirect(process.env.BASE_URL+JM_User_Profile_Url)
			return false;
		}





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

		}     
		//BM_Purchase_Amt=creator_get.toFixed(2);
		var Actual_Price=amount/100;
		var BM_Purchase_Amt_calculated=creator_get.toFixed(2)
		//================================================== calculation for tax fee, actual amt



		var LM_ID=parseInt(req.body.LM_ID);
		if(isNaN(LM_ID)) LM_ID=0;
		let q="UPDATE lead_master set isCompletePayment=1 where LM_ID="+LM_ID;
		console.log(q)
		const done=await model.sqlPromise(q);
		console.log("here 1")
		
		await updateTran(razorpay_payment_id,'captured',razorpay_order_id)
		console.log("here 3")
		//console.log("Successfully copied and moved the file!")


	
		const sql = "INSERT INTO  buyers_master(DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,BM_Purchase_Amt,BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID,LM_ID,Fee,Tax,Actual_Price) SELECT DA_ID,BM_Url_ID,BM_Name, BM_Email,BM_Phone,BM_Password,"+BM_Purchase_Amt+",BM_Instruction,BM_FileUrl,BM_Type,Status,Payment_ID,JM_ID,LM_ID,"+fee+","+tax+","+Actual_Price+" from buyers_master_dummy where Order_Id='"+razorpay_order_id+"'";

		const query = connection.query(sql, async function(err, result) {
			if (err) 
			{
				console.log(err);
				res.json({status:0,msg:err});
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


				var SuccessMessage=paidMonitizationMsg;
			
				var showImageVideo='<div style="width: 100%; height: auto; position: relative; margin-bottom: 10px;"><img src="content.jpg" style="width: 100%;">		</div>';

				var downloadContent='<a href="#" style="background: #8104fa; color: #fff; text-decoration: none; padding: 5px 15px; border-radius: 3px; display: inline-block;">Download</a>';
				var backToProfile='<a href="#" style="background: #8104fa; color: #fff; text-decoration: none; padding: 5px 15px; border-radius: 3px; display: inline-block;">Back To Profile</a>';

				var backToProfile='<a href="'+process.env.BASE_URL+JM_User_Profile_Url+'" style="background: #8104fa; color: #fff; text-decoration: none; padding: 5px 15px; border-radius: 3px; display: inline-block;">Back To Profile</a>';

				var html='<!DOCTYPE html><html><head>	<title>Thankyou</title>	<meta name="viewport" content="width=device-width, initial-scale=1.0">	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet"></head><body style="margin: 0; padding: 0; font-family: Poppins, sans-serif;">';
				html+='<div style="width: 300px; border: 1px solid #ccc; padding:0 10px 20px; border-radius: 5px; margin: 100px auto;">';
				html+='<div style="width: 150px; height: auto; margin: auto; background: #fff; position: relative; top: -15px; padding: 0 10px;"><img src="logo.png" style="width: 100%;"></div>';
				html+='	<div style="width: 130px; height: auto; margin: auto;"><img src="success.gif" style="width: 100%;"> </div>';
				html+='	<h3 style="font-size: 40px; text-align: center; margin: 0; padding: 0; font-weight: 600; line-height: 34px;">Thank You!</h3>';

				html+='<p style="text-align: center; margin: 0; padding: 0; font-size: 14px; color: #238d00; font-weight: 600; margin-bottom: 10px;">'+SuccessMessage+'</p>';
				html+=showImageVideo;
				html+='<div style="width: 100%; height: auto; position: relative; text-align: center;">';
						html+='';
						html+='';
				html+='</div>';
				html+='</div></body></html>';			

				res.send(html);

				
			}	
		});
	
})

app.listen(port,function(req,res){

	var moment = require('moment');
	console.log("running..."+__dirname);
	console.log("running..."+port);

	// var minutesToAdd=60;
	// var day=new Date();
	// console.log(day);
	// const options= {timeZone:"Asia/Kolkata"};
	// const today=moment(new Date()).utc().utcOffset("+05:30").add(minutesToAdd,'minutes')
	// console.log(today);
	// var mins=moment(today).minute();
	// var hours=moment(today).hours();
	// var ES_Slot_Start=hours * 60 + mins;
	// console.log(ES_Slot_Start);



	
	
	
		const today=moment(new Date()).utc().utcOffset("+05:30").subtract(10,'minutes')
		console.log(today);
		var mins=moment(today).minute();
		var hours=moment(today).hours();
		var ES_Slot_End=hours * 60 + mins;
		console.log(ES_Slot_End);
});


try {
	
} catch (error) {
	
}


//{"id":"pay_HiH5LaYWkRDEeg","entity":"payment","amount":1000,"currency":"INR","status":"captured","order_id":"order_HiH4RlPpb8KXPz","invoice_id":null,"international":false,"method":"card","amount_refunded":0,"refund_status":null,"captured":true,"description":"Purchase Description","card_id":"card_HiH5Le0CJw5WW5","bank":null,"wallet":null,"vpa":null,"email":"prashanta.das@velectico.com","contact":"+917894561230","notes":{"address":"Hello World"},"fee":20,"tax":0,"error_code":null,"error_description":null,"error_source":null,"error_step":null,"error_reason":null,"acquirer_data":{"auth_code":"878461"},"created_at":1628332007}