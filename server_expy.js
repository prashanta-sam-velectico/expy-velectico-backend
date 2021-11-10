var express = require('express');
var app = express();

var mysql = require('mysql');
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

var path = require('path');
var fs = require('fs');
var base_url="https://expy.bio/";

const json = require('body-parser/lib/types/json');
eval(fs.readFileSync('/var/www/html/adm/connection.js')+''); 

//20-may-2021




require('custom-env').env('dev', '/var/www/html/app');



//13-jul-2021 jitsee meeting
//var model=require('/home/velectic/node_code/adm/model.js');
var model=require('/var/www/html/adm/model.js');
app.get('/meet',async (req,res)=>{
    var  BM_Content_Sent = req.query.id;

    if(typeof BM_Content_Sent=='undefined')
    {
      res.sendFile('/var/www/html/app/404.html')
    }
	let sql="SELECT * FROM buyers_master WHERE BM_Content_Sent ='"+BM_Content_Sent+"' and Status='B'";
    console.log(" I am here " + BM_Content_Sent);
	const result=await model.sqlPromise(sql);
    if(typeof result!='undefined' && result!=null)
    {
        console.log(result);
        //let nameMeeting='Testing meeting';
        let password='12345';
        if(result.length > 0)
        {            
            res.render('pages/meeting',{nameMeeting:BM_Content_Sent,password:password,title:' Expy | Video Session'});
        }
        else
        {
            res.sendFile('/var/www/html/app/404.html')
        }

                                    
    }
    else
    {
        res.sendFile('/var/www/html/app/404.html')
    }
})





app.get("/:url/:id", (req, res) => {

  var url = req.params.url;
  var id = req.params.id;
 
    console.log(url + " " + id);
    console.log('visited! ' + url);

     
					

    const filePath = path.resolve(__dirname, './build', 'index.html');  

      var JM_User_Profile_Url=url;     
  
      var myquery = "SELECT * FROM joining_master WHERE JM_User_Profile_Url = '" + JM_User_Profile_Url+"'  and  isDeleted=0 and isBlocked=0";
      connection.query(myquery , function (error, results, fields) {
          if (error)
          {
              console.log('inside error --> ' + url);
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


				          	 if(id=='gift')
                      {
  							
                     	 console.log('inside result --> ' + url);

                          var JM_ID=results[0].JM_ID;
                          var JM_Name=results[0].JM_Name;
                        var JM_Profile_Pic=results[0].JM_Profile_Pic;
						var JM_Name=results[0].JM_Name;
                          fs.readFile(filePath, 'utf8', function (err,data) 
                         {
                            if (err) {
                              return console.log(err);
                            }


                            data = data.replace(/\$OG_TITLE/g, JM_Name + "- Gift | Expy ");

                            data = data.replace(/\$OG_DESCRIPTION/g, "Everything about "+JM_Name+" in one place. Follow and Connect!");
      
                            result = data.replace(/\$OG_IMAGE/g,base_url+'adm/uploads/'+ JM_Profile_Pic);
                            res.send(result);

                          });
					             }
                      else
                      {
                        console.log(' no gift --> ' + url);
                        res.sendFile('/var/www/html/app/404.html')
                        // res.send("<h1>Not found</h1>");
							
                      }


              } 
              else 
              {

                	console.log('i am in else  --> ' + url);
                    var filepath2=path.resolve(__dirname,'./build',url);
                    res.sendFile(filepath2);
              	 //	res.sendFile('/home/velectic/node_code/app/404.html');

              }
          }
      });

 });


app.get("/:url", (req, res) => {
	
	 var url = req.params.url;
    if(url.includes('.'))
     {
      console.log('inside if --> ' + url);

      var filepath2=path.resolve(__dirname,'./build',url);
      res.sendFile(filepath2);


    }
  else
  {
			console.log('visited! ' + url);

        const filePath = path.resolve(__dirname, './build', 'index.html');  
		
          var JM_User_Profile_Url=url;     
    	
          var myquery = "SELECT * FROM joining_master WHERE JM_User_Profile_Url = '" + JM_User_Profile_Url+"'  and  isDeleted=0 and isBlocked=0";
          connection.query(myquery , function (error, results, fields) {
          if (error)
           {
				console.log('inside error --> ' + url);
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

                       console.log('inside result --> ' + url);

                          var JM_ID=results[0].JM_ID;
                          var JM_Name=results[0].JM_Name;
                         var JM_Profile_Pic=results[0].JM_Profile_Pic;

					      fs.readFile(filePath, 'utf8', function (err,data) 
						  {
                            if (err) {
                              return console.log(err);
                            }


                            data = data.replace(/\$OG_TITLE/g, JM_Name + " | Expy ");

                            data = data.replace(/\$OG_DESCRIPTION/g, "Everything about "+JM_Name+" in one place. Follow and Connect!");
			
                           result = data.replace(/\$OG_IMAGE/g,base_url+'adm/uploads/'+ JM_Profile_Pic);

                            res.send(result);



                          });


              } 
			 else // how-it-works
              {
						 const filePath = path.resolve(__dirname, './build', 'index.html');  
                  

                 		
						fs.readFile(filePath, 'utf8', function (err,data) 
						  {
                            if (err) {
                              return console.log(err);
                            }


                            data = data.replace(/\$OG_TITLE/g,  " Expy: The Only Page You Need to Monetize & Grow as a Creator ");

                            data = data.replace(/\$OG_DESCRIPTION/g, "Use Expy to SHARE all your important links, content and OFFER paid, personalized, premium features under one beautiful Bio-Link 				page. FREE and FAST to set up");

                           result = data.replace(/\$OG_IMAGE/g,base_url+'adm/uploads/favicon.jpg');

                            res.send(result);



                          });
					
              }
		

          }
      });

  }

  		


  })


app.get('/', function(req, res) {
  console.log('root,,,....!');
  					 const filePath = path.resolve(__dirname, './build', 'index.html');  
                  

                 		
						fs.readFile(filePath, 'utf8', function (err,data) 
						  {
                            if (err) {
                              return console.log(err);
                            }


                            data = data.replace(/\$OG_TITLE/g,  " Expy: The Only Page You Need to Monetize & Grow as a Creator ");

                            data = data.replace(/\$OG_DESCRIPTION/g, "Use Expy to SHARE all your important links, content and OFFER paid, personalized, premium features under one beautiful Bio-Link page. FREE and FAST to set up");

                           result = data.replace(/\$OG_IMAGE/g,base_url+'adm/uploads/favicon.jpg');

                            res.send(result);



                          });

});





app.use(express.static(path.resolve(__dirname, './build')));


app.get('*', function (req, res) { 

  const filePath = path.resolve(__dirname, './build', 'index.html');
  res.sendFile(filePath);

});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
