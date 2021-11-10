
var url=location.pathname;
if(url.endsWith('home'))
{
    GetData();
}
function GetData()
{
    $.ajax({
        url: "/Get_Data"
     })
     .done(function( data ) {
        console.log(data);
        Prepare_Data_Table(data);
       // $('#tbl_data').html(data.message);
     });

}

var base_url="https://uatenviro33.expy.bio/";
function Prepare_Data_Table(data)
{
    var TableData='<thead style="background-color:#1A2035; color:#fff;">'+
    '<tr>'+
        '<th scope="col" class="hed-th" style="font-size:17px;">Name</th>'+
        '<th scope="col" class="hed-th" style="font-size:17px;">Email</th>'+
        '<th align="center" class="hed-th" style="font-size:17px;width: 10%">Actions</th>'+
    '</tr>'+
'</thead><tbody bgcolor="#FFFFFF" style="color:#000; font-family:Corbel;">';
    if(data!=null && data.length >0)
    {
        for(var i=0; i<data.length; i++)
        {
            TableData += '<td>'+data[i].username+'</td>';
            TableData += '<td>'+data[i].email+'</td>';
            TableData +='<td><div class="form-button-action">';
            TableData +="<button type='button' title='' class='btn btn-link btn-primary btn-lg' data-toggle='modal' data-target='#Edit_Modal' onclick='return Edit_Details("+JSON.stringify(data[i])+");'>";
            TableData += '<i class="fa fa-edit" style="color:#000;"></i>Edit';
            TableData +='</button>';
            TableData += "<button type='button' data-toggle='tooltip' title='' class='btn btn-link btn-danger' data-original-title='Remove' onclick='return Delete_Details("+JSON.stringify(data[i])+");'>";//onclick='return Delete_DD_Details("+JSON.stringify(data[i])+");'>
            TableData +='<i class="fa fa-times"></i> Delete';
            TableData +='</button>';
            TableData +='</div>';
            TableData +='</td></tr>';
        }
       
        TableData += '</tbody>';

        $("#tbl_data").html(TableData);
        
      
    }
}
function Insert_user() //
{ 
    event.preventDefault();
    $("#Add_user_div").show();
    var username= $("#username").val();
    var email=$("#email").val();
    var password =$("#password").val();
    if(username=="")
    {
       doAlert('Empty Field',"User Name Can't be blank");
       return false;
    }
    if(email=="")
    {
       doAlert('Empty Field',"Email Can't be blank");
       return false;
    }
    if(password=="")
    {
       doAlert('Empty Field',"Password Can't be blank");
       return false;
    }
    var formdata = { number: $('input[name="number"]').val() };

    $.post('/Inser_User', { 
        username:$('#username').val(),
        password:$('#password').val(),
        email: $('#email').val()

     }).done(function(data){

       // alert(data.msg);
        doAlert(data.msg);
        GetData();
   });

    
    // $.post('/output2', formdata, function(data){
    //    alert(data);
    //});
       
   
}

//================== 
$("#btn_add").on("click", function () {
    event.preventDefault();
    $("#Add_user_div").show();
});
$("#btn_cancel").on("click", function () {
    event.preventDefault();
    $("#Add_user_div").hide();
});
$("#btn_insert_user").on("click", function () {
    event.preventDefault();
    $("#Add_user_div").hide();
    Insert_user();
});

function Edit_Details(data)
{
    event.preventDefault();
    $("#Add_user_div").show();
    $("#btn_update").show();
    $("#btn_add").hide();
    $("#btn_insert_user").hide();
    
    $("#username").val(data.username);
    $("#email").val(data.email);
    $("#password").val(data.password); 
    $("#userId").val(data.id);
}
$("#btn_cancel").on('click',function(){

    $("#btn_add").show();

});
$("#btn_add").on('click',function(){
    $("#btn_insert_user").show();
    $("#btn_update").hide();
});

$("#btn_update").on('click',function(){
   var username= $("#username").val();
   var email=$("#email").val();
   var password =$("#password").val();

   if(username=="")
   {
      doAlert('Empty Field',"User Name Can't be blank");
      return false;
   }
   if(email=="")
   {
      doAlert('Empty Field',"Email Can't be blank");
      return false;
   }
   if(password=="")
   {
      doAlert('Empty Field',"Password Can't be blank");
      return false;
   }
   UpdateUser();
});

function UpdateUser(){
        event.preventDefault();
    if (typeof FormData !== 'undefined') {

        // send the formData
        var formData = new FormData( $("#userForm")[0] );
        //alert();
        $.ajax({
            type:'POST',
            url:"/Update_User",
            async : false,
            cache : false,
            contentType : false,
            processData : false,
            data : formData,
            success: function(res){
            if(res.msg=='Done'){
                doAlert('Success',res.msg);
                GetData();
                ResetAll();
            }else{
                doAlert('Failed','Unable to update');
            }
              
            }, 
            error:function(res)
            {
                //MessageBox(res,"danger");
                doAlert(res.msg);
            }
        
            });
    }else {
        doAlert("Not Supported","Your Browser Don't support FormData API! Use IE 10 or Above!");
    }
}
OkCancel=0;
function Delete_Details(data)
{
   
        $("#userId").val(data.id);
        deleteUser();
    
  console.log(OkCancel);
}
function deleteUser()
{
    event.preventDefault();
    if (typeof FormData !== 'undefined') {

        // send the formData
        var formData = new FormData( $("#userForm")[0] );
        //alert();
        $.ajax({
            type:'POST',
            url:"/deleteUser",
            async : false,
            cache : false,
            contentType : false,
            processData : false,
            data : formData,
            success: function(res){
            if(res.msg=='Done'){
                doAlert('Success',res.msg);
                GetData();
                ResetAll();
            }else{
                doAlert('Failed','Unable to update');
            }
              
            }, 
            error:function(res)
            {
                //MessageBox(res,"danger");
                doAlert(res.msg);
            }
        
            });
    }else {
        doAlert("Not Supported","Your Browser Don't support FormData API! Use IE 10 or Above!");
    }
}


function ResetAll()
{
    $("input[type='text'], textarea, input[type='password'],input[type='number'], input[type='file']").val("");
    $("select").prop("selectedIndex", 0);
    
}













//========================================== Alerts
function doAlert(heading,msg) {
    Dialog.alert(msg, heading);
}

function doConfirm(msg) {
    Dialog.confirm(msg, 'Question', (dlg) => {
      //  alert('Bye!');
      console.log(1);
      OkCancel=1;
        dlg.close();
        return 1;
    }, (dlg) => {
        //alert('Thank you!');
        console.log(0);
        OkCancel=0;
        dlg.close();
        return 0;
       
    });
}


$("#submit").on('click',function(){
    event.preventDefault();
    $("#msg").text('');
    let email=$("#email").val();
    let password=$("#password").val();
    if(email.length == 0)
    {
        $("#msg").text(" * email is empty");
 
        return false;
    }
    if(email.includes('.') && email.includes('@'))
    {
       
    }
    else
    {
        $("#msg").text(" * email is invalid");
        return false;
    }
    if(password.length == 0)
    {
        $("#msg").text(" * password is empty");
        return false;
    }
    const jsonData = {
        AM_Email: email,
        AM_Password:password
    };
    JsonPostData("admin/auth",jsonData);
});
function JsonPostData(url,jsonData)
{   
    
    fetch(base_url+url, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.status==1)
                location.href='/admin/exp_admin_panel/dashboard';
            else
                $("#msg").text(" * "+data.msg);
        });
}

$("#btn_verify").on('click',function(){
    event.preventDefault();
    $("#msg").text(''); 
    let password    = $("#BM_Password").val();
    let BM_Url_ID   = $("#BM_Url_ID").val();
    if(password.length == 0)
    {
        $("#msg").text(" * password is empty"); 
        return false;
    }
    
    const JSONdata = {
        BM_Url_ID: BM_Url_ID,
        BM_Password:password
    };

  
   

        let srcArray=[];
        const API_url = base_url + "admin/validateDecrypt";
        fetch(API_url,
          {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(JSONdata)
          })
        .then((response) => response.json())
        .then(data => 
            {
                    if(data.status===1)
                    { 
                        srcArray=data.srcArray;//src="http://localhost:9000/Zj7gqdv3uVZKAJU3erw9_3a370dcee6e1d7b70981114bb146180e.mp3";
                        console.log(srcArray);
                        prepareContent(srcArray);
                    }
                    else
                    {
                       $("#msg").text(data.msg);
                    }
        });
       

      

});

function prepareContent(srcArray)
{
    var dwnloadData='<p class="txtStyle">Download Content</p>';
   
    if(srcArray!=null && srcArray.length > 0 && srcArray.length == 1)
    {
        var fileArray=JSON.parse(srcArray[0].BM_FileUrl);
       
        if(fileArray!=null && fileArray.length > 0 && fileArray.length == 1)
        {
            var src="";
            src=base_url+'adm/store/'+fileArray[0];
            if(src.includes('.mp3'))
            {
            
                dwnloadData+='<audio controls="" autoplay="" name="media" style="width: 100%;">';
                dwnloadData+='<source id="data_id" src="'+src+'" type="audio/mpeg">';
                dwnloadData+='</audio>';
            }
            else if(src.includes('.mp4'))
            {
                dwnloadData+='<video controls="" autoplay="" name="media" style="width: 100%;">';
                dwnloadData+='<source id="data_id" src="'+src+'" type="video/mp4">';
                dwnloadData+='</video>';
            }
            else if(src.includes('.jpeg') || src.includes('.jpg') || src.includes('.png'))
            {
                //dwnloadData+='<video controls="" autoplay="" name="media">';
                
                dwnloadData+='<img id="data_id" src="'+src+'" style="width: 100%;">';
               // dwnloadData+='</video>';
            }
        }
        else // for multiple images
        {
            var src="";
            for(let i=0;i<fileArray.length;i++)
            {
                src=base_url+fileArray[0];
                dwnloadData+='<img id="data_id" src="'+src+'" style="width: 100%;"></br>';
            }
        }
       
    }
   
    
    
        $("#verify_div").html('');
        $("#dwnld_div").html(dwnloadData);
}



function doVerify(id)
{
   let isChecked =$("#chk_"+id).prop("checked");
  
   console.log(isChecked);
   let JM_Verified=0;
   if(isChecked)
    JM_Verified=1;

   const JSONdata = {
    JM_ID: id,
    JM_Verified:JM_Verified
};

    let srcArray=[];
    const API_url = base_url + "admin/verifycelebrity";
    fetch(API_url,
        {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(JSONdata)
        })
    .then((response) => response.json())
    .then(data => 
        {
           		 let msg="";
                if(data.status===1)
                { 
                    msg="<strong>Success !</strong>"+data.msg;
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").html(msg);
                    hideAlert("alertcustom");
                }
                else
                {
                    msg="<strong>Success !</strong>"+data.msg;
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").text(msg);
                    hideAlert("alertcustom");
                }
    });
  

}
function hideAlert(id){
    setTimeout(function() {
        $("#"+id).css('display','none');
     }, 2000);
    
     
  }

//05-apr-2021
 $(document).on('click', ".editProfile", function() {
   
try{

    var JM_Email = $(this).attr("data-value");
    var goto = $(this).attr("data-type")
    if(JM_Email.length > 0 )
    {

      let inserted_id=0;
      let API_url=base_url+"admin/userProfile";
      var JSONdata  = {           
          JM_Email:JM_Email             
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => { 
          
          if(data.status===1)
            {
              //const data=decryptJson(data1.flag);
              var userDetails=data.userDetails;
              if(userDetails!=null && userDetails.length > 0)
              {
                console.log(data.msg);
                localStorage.setItem('JM_ID', data.JM_ID);          
                localStorage.setItem('JM_User_Profile_Url', data.userDetails[0].JM_User_Profile_Url);            
                localStorage.setItem('JM_Email', JM_Email);                    
                localStorage.setItem('userDetails', JSON.stringify(userDetails)); 
                localStorage.setItem('directAccess', JSON.stringify(data.directAccess));  
                localStorage.setItem('linkMaster', JSON.stringify(data.linkMaster));                                            
                localStorage.setItem('auth', data.token);  

                    var minutes=60;
                    var dt=new Date();
                    var FromNewTime=new Date();
                    var ToNewTime=new Date(dt.getTime() + minutes*60000);
                        
                    console.log(FromNewTime)    
                    console.log(ToNewTime)  
              
                    localStorage.setItem('FromNewTime',FromNewTime);
                    localStorage.setItem('ToNewTime',ToNewTime);                 
                    localStorage.setItem('keepLogin',0);  
                    
              
                    window.open(
                      base_url+goto,
                      '_blank' // <- This is what makes it open in a new window.
                    );
                  
           
              }
            }
            else
            {
              document.getElementById("msg").innerHTML=data.msg;
              return false;
            }          

      });
        
    }

  }
  catch(e)
  {
    alert("connection error");
  }
});
 $(document).on('click', ".block", function() {
   
try{

    var JM_ID = parseInt($(this).val());
	let isBlocked=0;  
 	let isChecked =$(this).prop("checked");
     if(isChecked)
      isBlocked=1;

    if(JM_ID > 0 )
    {

      let inserted_id=0;
      let API_url=base_url+"admin/blockCelebrity";
      var JSONdata  = {           
          JM_ID:JM_ID,
		isBlocked:isBlocked
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => 
			{           
          
              let msg="";
              if(data.status===1)
              { 
                msg="<strong> Success! </strong> "+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").html(msg);
                hideAlert("alertcustom");
              }
              else
              {
                msg="<strong>Success !</strong>"+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").text(msg);
                hideAlert("alertcustom");
         	 }         

     	 });
        
    }

  }catch(e)
  {
    alert("connection error");
  }

});
//MS=================================== 29-may-2021
function openModal(id)
{	
	$("#JM_ID").val(id);
}

$(document).on('click', ".delete", function() {
   
try{

    var JM_ID = parseInt($("#JM_ID").val());
	  let isDeleted=1;  
 

    if(JM_ID > 0 )
    {

      let inserted_id=0;
      let API_url=base_url+"admin/deleteCelebrity";
      var JSONdata  = {           
          JM_ID:JM_ID,
		  isDeleted:isDeleted
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => 
			{           
          
              let msg="";
              if(data.status===1)
              { 
                msg="<strong> Success! </strong> "+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").html(msg);
                hideAlert("alertcustom");
 					 window.location.reload(true);
              }
              else
              {
                msg="<strong>Success !</strong>"+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").text(msg);
                hideAlert("alertcustom");
         	 }         

     	 });
      
    }
		

  }
	catch(e)
  {
    alert("connection error");
  }

});
// $(document).on('click', ".delete", function() {
   
// try{

//     var JM_ID = parseInt($(this).val());
// 	let isDeleted=0;  
//  	let isChecked =$(this).prop("checked");
//      if(isChecked)
//       isDeleted=1;

//     if(JM_ID > 0 )
//     {

//       let inserted_id=0;
//       let API_url=base_url+"admin/deleteCelebrity";
//       var JSONdata  = {           
//           JM_ID:JM_ID,
// 		  isDeleted:isDeleted
//         };	
//       fetch(API_url, {
//       method: 'post',
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify(JSONdata)
//         }).then(function(response) {
//           return response.json();
//         }).then(data => 
// 			{           
          
//               let msg="";
//               if(data.status===1)
//               { 
//                 msg="<strong> Success! </strong> "+data.msg;
//                 $("#alertcustom").css('display','block');
//                 $("#alertcustom").html(msg);
//                 hideAlert("alertcustom");
//  					 window.location.reload(true);
//               }
//               else
//               {
//                 msg="<strong>Success !</strong>"+data.msg;
//                 $("#alertcustom").css('display','block');
//                 $("#alertcustom").text(msg);
//                 hideAlert("alertcustom");
//          	 }         

//      	 });
      
//     }
		

//   }
// 	catch(e)
//   {
//     alert("connection error");
//   }

// });

$("#password").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
});




$(document).on('click', ".sendCode", function() {
    
		var Code=$(this).attr('data-value');
		var Email=$(this).attr('data-email');
		

	if(Code.length > 0 && Email.length > 0 )
    {

     
      let API_url=base_url+"admin/sendReferralCode";
      var JSONdata  = {           
          Code:Code,
		  Email:Email
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => 
			{  
              let msg="";
              if(data.status===1)
              { 
                msg="<strong> Success! </strong> "+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").html(msg);
                hideAlert("alertcustom");
 				//window.location.reload(true);
				$(this).hide();
              }
              else
              {
                msg="<strong>Success !</strong>"+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").text(msg);
                hideAlert("alertcustom");
         	 }         
			
     	 });
       
    }
		

});

if(url.endsWith('/celebrity'))
{
   $('#tbl_celebrity').dataTable( {
    "columnDefs": [
      { "width": "20%", "targets": 0 }
    ]
  } );

   CreateTable_OrderBy('tbl_celebrity',5);
}
if(url.endsWith('/purchaseMade'))
{
   $('#tbl_purchase').dataTable();
   CreateTable_OrderBy('tbl_purchase',7);
}
if(url.endsWith('/referralRequest'))
{
   $('#tbl_referral').dataTable();
   CreateTable_OrderBy('tbl_referral',1);
}
if(url.endsWith('/newsletter'))
{
   $('#tbl_news_letter').dataTable();
   CreateTable_OrderBy('tbl_news_letter',0);
}
//MS2
//31-may-2021

if(url.endsWith('/discarded-premium-features'))
{
   $('#tbl_discarded').dataTable();
   CreateTable_OrderBy('tbl_discarded',0);
}
function CreateTable_OrderBy(tableName,col)
{
    	try{
                var isDataTable = $.fn.DataTable.isDataTable('#'+tableName);
                //console.log('isDataTable: ' + isDataTable); 
                table = $('#'+tableName).DataTable({ 
                destroy : true,
                "order": [[ col , "desc" ]],
                    'iDisplayLength': 100
                });
            }catch(e){}
    
}


$(document).on('click', ".pay", function() {

var BM_ID=parseInt($(this).attr('data-value'));

	if(BM_ID > 0 )
    {

     
      let API_url=base_url+"admin/doPaidCompletedRequest";
      var JSONdata  = {           
          BM_ID:BM_ID		
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => 
			{  
              let msg="";
              if(data.status===1)
              { 
                msg="<strong> Success! </strong> "+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").html(msg);
                hideAlert("alertcustom");
 				        //window.location.reload(true);
                $(this).text('Paid');
                $(this).attr('disabled',true);
              }
              else
              {
                msg="<strong>Success !</strong>"+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").text(msg);
                hideAlert("alertcustom");
         	 }         
			
     	 });
       
    }
});






$(document).on('click', ".priority", function() {
   
try{

    var JM_ID = parseInt($(this).val());
	let displayLanding=0;  
 	let isChecked =$(this).prop("checked");
     if(isChecked)
      displayLanding=1;

    if(JM_ID > 0 )
    {

      let inserted_id=0;
      let API_url=base_url+"admin/updateCelebrityPrority";
      var JSONdata  = {           
          JM_ID:JM_ID,
		  displayLanding:displayLanding
        };	
      fetch(API_url, {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(JSONdata)
        }).then(function(response) {
          return response.json();
        }).then(data => 
			{           
          
              let msg="";
              if(data.status===1)
              { 
                msg="<strong> Success! </strong> "+data.msg;
                $("#alertcustom").css('display','block');
                $("#alertcustom").html(msg);
                hideAlert("alertcustom");
 				window.location.reload(true);
              }
              else
              {
                msg="Success ! "+data.msg;
				$(this).prop("checked",false);
                $("#alertcustom").css('display','block');
                $("#alertcustom").text(msg);
                hideAlert("alertcustom");
         	 }         

     	 });
      
    }
		

  }
	catch(e)
  {
    alert("connection error");
  }

});




$(document).on('click', "#btn_update_pass", function() {

  var current_pass=$("#pwd").val();
  var new_pass=$("#new_pwd").val();
  if(current_pass.length == 0)
  {
    $("err").text("Enter Current Password");
    return false;
  }
  if(new_pass.length == 0)
  {
    $("#err").text("Enter New Password");
    return false;
  }
     if(current_pass!=new_pass)
      {
  
       
            let API_url=base_url+"admin/doUpdateAdminPassword";
            var JSONdata  = {           
              current_pass:current_pass	,
              new_pass:new_pass
              };	
            fetch(API_url, {
            method: 'post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(JSONdata)
              }).then(function(response) {
                return response.json();
              }).then(data => 
              {  
                    let msg="";
                    // if(data.status===1)
                    // { 
                      $("#err").text(data.msg);
                    //}
                  
              });
         
      }
      else
      {
        $("#err").text("Current Password and  New Password are same");
        return false;
      }
  });


  $(document).on('click', ".changeUrl", function() {
   
    try{
    
     var JM_ID=parseInt($(this).attr('data-value'));
     var old_url=$(this).attr('data-old');
     var new_url=$(this).attr('data-new');
  
    
        if(JM_ID > 0 )
        {
    
          let inserted_id=0;
          let API_url=base_url+"admin/changeUrlByAdmin";
          var JSONdata  = {           
              JM_ID:JM_ID,
              old_url:old_url,
              new_url:new_url         
            };	
          fetch(API_url, {
          method: 'post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(JSONdata)
            }).then(function(response) {
              return response.json();
            }).then(data => 
          {           
              
                  let msg="";
                  if(data.status===1)
                  { 
                    msg="<strong> Success! </strong> "+data.msg;
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").html(msg);
                    hideAlert("alertcustom");
                    window.location.reload(true);
                  }
                  else
                  {
                    msg="info! "+data.msg;              
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").text(msg);
                    hideAlert("alertcustom");
                }         
    
            });
          
        }
        
    
      }
      catch(e)
      {
        alert("connection error");
      }
    
    });
    

    //05-jul-2021======================================================================================= MS2
    if(url.endsWith('/create-discount'))
    {
       $('#tbl_discount').dataTable();
      CreateTable_OrderBy('tbl_discount',0);
      var maxDate=getMaxDate();
      $("#DM_DeadLine_Date").attr('min',maxDate);
     $("#date_deadline").attr('min',maxDate);
  
    }
  
  function getMaxDate()
  {
      var dtToday = new Date();    
      var month = dtToday.getMonth() + 1;
      var day = dtToday.getDate();
      var year = dtToday.getFullYear();
      if(month < 10)
          month = '0' + month.toString();
      if(day < 10)
          day = '0' + day.toString();
      
      var maxDate = year + '-' + month + '-' + day;
      return maxDate;
      // or instead:
      // var maxDate = dtToday.toISOString().substr(0, 10);
      //$('#txtDate').attr('min', maxDate);
  }
      
  
   $('#DM_type').val('A');  
      $('#rdo_amt').on('click',function(){
        let isChecked = $(this).prop( "checked" );
        if(isChecked)
          { $('#lbl_amt_per').html('Amount');$('#DM_type').val('A');}
        else
          { $('#lbl_amt_per').html('Percentage');$('#DM_type').val('P');}
      })
  
      $('#rdo_per').on('click',function(){
        let isChecked = $(this).prop( "checked" );
        if(isChecked)
         {  $('#lbl_amt_per').html('Percentage');  $('#DM_type').val('P');}
        else
        {$('#lbl_amt_per').html('Amount'); $('#DM_type').val('A');}
      })
  
      $('.tab_quota').on('click',function()
      {
        $('#DM_type').val('Q');    
      })
      $('.tab_deadline').on('click',function()
      {
        $('#DM_type').val('D');    
      })
      //Create_Code
  
      
    $(document).on('click', ".Create_Code_amt_per", function(event) 
    {
      event.preventDefault();
      let DM_Code=$('#DM_Code').val();
      let DM_type=$('#DM_type').val();
      let DM_Amount_Percent=parseFloat($('#DM_Amount_Percent').val());
      if(DM_Code.length==0)
      {
          $("#DM_Code").css('border-bottom','1px solid #d01b0d');
          $("#DM_Code").css('box-shadow','0 1px 0 0 #d01b0d'); 
          msg="<strong> Error! </strong> Empty field ";
          $("#alertcustom").css('display','block');
          $("#alertcustom").html(msg);
          hideAlert("alertcustom");  
          return false;
        
      }
      if(DM_Amount_Percent==0)
      {
        $("#DM_Amount_Percent").css('border-bottom','1px solid #d01b0d');
        $("#DM_Amount_Percent").css('box-shadow','0 1px 0 0 #d01b0d'); 
        msg="<strong> Error! </strong> Empty field ";
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");  
        return false;
      }
  
  
           let API_url=base_url+"admin/insertCode";
            var JSONdata  = {             
               DM_Code:DM_Code,
                DM_type:DM_type,
                DM_Amount_Percent:DM_Amount_Percent         
              };	
            fetch(API_url, {
            method: 'post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(JSONdata)
              }).then(function(response) {
                return response.json();
              }).then(data => 
            {           
                
                    let msg="";
                    if(data.status===1)
                    { 
                      msg="<strong> Success! </strong> "+data.msg;
                      $("#alertcustom").css('display','block');
                      $("#alertcustom").html(msg);
                      hideAlert("alertcustom");
                      window.location.reload(true);
                    }
                    else
                    {
                      msg="info! "+data.msg;              
                      $("#alertcustom").css('display','block');
                      $("#alertcustom").text(msg);
                      hideAlert("alertcustom");
                  }         
      
              });
      
     
  
    });
  
  
  //Create_Code_quota
    $(document).on('click', ".Create_Code_quota", function(event) 
    {
      event.preventDefault();
      let DM_Code=$('#DM_Code').val();
      let DM_type='Q';
      let DM_Amount_Percent=parseFloat($('#quota_amt').val());
      let DM_Uses_Times=parseFloat($('#DM_Uses_Times').val());
  
  
     if(isNaN(DM_Amount_Percent))
        DM_Amount_Percent=0;
      if(isNaN(DM_Uses_Times))
         DM_Uses_Times=0;
  
  
     if(DM_Code.length==0)
      {
          $("#DM_Code").css('border-bottom','1px solid #d01b0d');
          $("#DM_Code").css('box-shadow','0 1px 0 0 #d01b0d'); 
          msg="<strong> Error! </strong> Empty Code ";
          $("#alertcustom").css('display','block');
          $("#alertcustom").html(msg);
          hideAlert("alertcustom");  
          return false;
        
      }
      $("#quota_amt").css('border-bottom','1px solid #9e9e9e');
      $("#quota_amt").css('box-shadow','none'); 
      if(DM_Amount_Percent==0)
      {
        $("#quota_amt").css('border-bottom','1px solid #d01b0d');
        $("#quota_amt").css('box-shadow','0 1px 0 0 #d01b0d'); 
        msg="<strong> Error! </strong> Empty Amount ";
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");  
        return false;
      }
      $("#DM_Uses_Times").css('border-bottom','1px solid #9e9e9e');
      $("#DM_Uses_Times").css('box-shadow','none'); 
      if(DM_Uses_Times==0)
      {
        $("#DM_Uses_Times").css('border-bottom','1px solid #d01b0d');
        $("#DM_Uses_Times").css('box-shadow','0 1px 0 0 #d01b0d'); 
        msg="<strong> Error! </strong> Empty No Of Quota ";
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");  
        return false;
      }
  
           let API_url=base_url+"admin/insertCode";
            var JSONdata  = {             
                DM_Code:DM_Code,
                DM_type:DM_type,
                DM_Amount_Percent:DM_Amount_Percent,
                DM_Uses_Times:DM_Uses_Times         
              };	
            fetch(API_url, {
            method: 'post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(JSONdata)
              }).then(function(response) {
                return response.json();
              }).then(data => 
            {           
                
                    let msg="";
                    if(data.status===1)
                    { 
                      msg="<strong> Success! </strong> "+data.msg;
                      $("#alertcustom").css('display','block');
                      $("#alertcustom").html(msg);
                      hideAlert("alertcustom");
                      window.location.reload(true);
                    }
                    else
                    {
                      msg="info! "+data.msg;              
                      $("#alertcustom").css('display','block');
                      $("#alertcustom").text(msg);
                      hideAlert("alertcustom");
                  }         
      
              });
      
     
  
    });
  
  //Create_Code_deadline
  $(document).on('click', ".Create_Code_deadline", function(event) 
  {
    event.preventDefault();
    let DM_Code=$('#DM_Code').val();
    let DM_type='D';
    let DM_Amount_Percent=parseFloat($('#dead_amt').val());  
    let DM_DeadLine_Date=$('#DM_DeadLine_Date').val();
  
    if(isNaN(DM_Amount_Percent))
      DM_Amount_Percent=0;
  
  
    if(DM_Code.length==0)
    {
        $("#DM_Code").css('border-bottom','1px solid #d01b0d');
        $("#DM_Code").css('box-shadow','0 1px 0 0 #d01b0d'); 
        msg="<strong> Error! </strong> Empty Code ";
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");  
        return false;
      
    }
    $("#dead_amt").css('border-bottom','1px solid #9e9e9e');
    $("#dead_amt").css('box-shadow','none'); 
    if(DM_Amount_Percent==0)
    {
      $("#dead_amt").css('border-bottom','1px solid #d01b0d');
      $("#dead_amt").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty Amount ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
    $("#DM_DeadLine_Date").css('border-bottom','1px solid #9e9e9e');
    $("#DM_DeadLine_Date").css('box-shadow','none'); 
    if(DM_DeadLine_Date=='')
    {
      $("#DM_DeadLine_Date").css('border-bottom','1px solid #d01b0d');
      $("#DM_DeadLine_Date").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty Deadline ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
  
         let API_url=base_url+"admin/insertCode";
          var JSONdata  = {             
              DM_Code:DM_Code,
              DM_type:DM_type,
              DM_Amount_Percent:DM_Amount_Percent,
              DM_DeadLine_Date:DM_DeadLine_Date         
            };	
          fetch(API_url, {
          method: 'post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(JSONdata)
            }).then(function(response) {
              return response.json();
            }).then(data => 
          {           
              
                  let msg="";
                  if(data.status===1)
                  { 
                    msg="<strong> Success! </strong> "+data.msg;
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").html(msg);
                    hideAlert("alertcustom");
                    window.location.reload(true);
                  }
                  else
                  {
                    msg="info! "+data.msg;              
                    $("#alertcustom").css('display','block');
                    $("#alertcustom").text(msg);
                    hideAlert("alertcustom");
                }         
    
            });
    
   
  
  });
  

    //editCode
    $(document).on('click', ".editCode", function(event) 
    {
      event.preventDefault();
  
      var $this=$(this);
      var data=$this.attr('data-value');
      var jsonData=JSON.parse(data);
      console.log(jsonData)
       $(".code").val(jsonData.DM_Code);
      $("#DM_ID").val(jsonData.DM_ID);
      if(jsonData.DM_Type=='A' || jsonData.DM_Type=='P' )
      {       
        let title=jsonData.DM_Type=='A'? 'Update Amount Of Discount' : jsonData.DM_Type=='P'? 'Update Percentage Of Discount' : '';
        let lbl=jsonData.DM_Type=='A'? 'Amount' : jsonData.DM_Type=='P'? 'Percentage' : '' ;
         $("#title_A_P").text(title);
        $("#lbl_A_P").text(lbl);
  
            
      
             $("#amt_per").val(jsonData.DM_Amount_Percent);
      }
    else  if(jsonData.DM_Type=='Q' )
    {
     $("#amt_quota_edit").val(jsonData.DM_Amount_Percent);
      $("#DM_Uses_Times_edit").val(jsonData.DM_Uses_Times);
    }
   else 
    {
     $("#amt_deadline").val(jsonData.DM_Amount_Percent);
      $("#date_deadline").val(jsonData.DM_DeadLine_Date);
    }
  
  
    });
  
   $(document).on('click', "#btn_update_code_A_P", async function(event) 
    {
      event.preventDefault();
    let DM_Amount_Percent=parseFloat($('#amt_per').val());
    let DM_ID=parseFloat($('#DM_ID').val());
       if(DM_Amount_Percent==0)
      {
        $("#amt_per").css('border-bottom','1px solid #d01b0d');
        $("#amt_per").css('box-shadow','0 1px 0 0 #d01b0d'); 
        msg="<strong> Error! </strong> Empty field ";
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");  
        return false;
      }
    var DM_Type='A';
             
      var JSONdata  = {      
          DM_Type:DM_Type,  
            DM_ID:DM_ID,           
            DM_Amount_Percent:DM_Amount_Percent         
        };	
        var data=await JsonAPI('updateCode',JSONdata);
        let msg="";
      if(data.status===1)
      { 
        msg="<strong> Success! </strong> "+data.msg;
        $("#alertcustom").css('display','block');
        $("#alertcustom").html(msg);
        hideAlert("alertcustom");
        window.location.reload(true);
      }
      else
      {
        msg="info! "+data.msg;              
        $("#alertcustom").css('display','block');
        $("#alertcustom").text(msg);
        hideAlert("alertcustom");
      }         
      
            
      
  
   });
  
  
  
  $(document).on('click', "#btn_update_code_quota", async function(event) 
  {
    event.preventDefault();
  let DM_Amount_Percent=parseFloat($('#amt_quota_edit').val());
  let DM_ID=parseFloat($('#DM_ID').val());
  let DM_Uses_Times=parseFloat($('#DM_Uses_Times_edit').val());
  
    $("#amt_quota_edit").css('border-bottom','1px solid #9e9e9e');
    $("#amt_quota_edit").css('box-shadow','none'); 
     if(DM_Amount_Percent==0)
    {
      $("#amt_quota_edit").css('border-bottom','1px solid #d01b0d');
      $("#amt_quota_edit").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty field ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
  
    $("#DM_Uses_Times_edit").css('border-bottom','1px solid #9e9e9e');
    $("#DM_Uses_Times_edit").css('box-shadow','none'); 
    if(DM_Uses_Times==0)
    {
      $("#DM_Uses_Times_edit").css('border-bottom','1px solid #d01b0d');
      $("#DM_Uses_Times_edit").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty No Of Quota ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
           
    var JSONdata  = {     
          DM_Type:'Q',           
          DM_ID:DM_ID,           
          DM_Amount_Percent:DM_Amount_Percent,
          DM_Uses_Times:DM_Uses_Times         
      };	
      var data=await JsonAPI('updateCode',JSONdata);
      let msg="";
    if(data.status===1)
    { 
      msg="<strong> Success! </strong> "+data.msg;
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");
      window.location.reload(true);
    }
    else
    {
      msg="info! "+data.msg;              
      $("#alertcustom").css('display','block');
      $("#alertcustom").text(msg);
      hideAlert("alertcustom");
    }         
    
          
    
  
  });
  

  

$(document).on('click', ".Create_Code_deadline_quota", function(event) 
{
  event.preventDefault();
  let DM_Code=$('#DM_Code').val();
  let DM_type=$('#DM_type').val();
  let DM_Amount_Percent=parseFloat($('#dead_quota_amt').val());  
  let DM_DeadLine_Date=$('#DM_DeadLine_Date_quota').val();
  let DM_Uses_Times=parseFloat($('#DM_Uses_Times_dead_quota').val());

  if(isNaN(DM_Amount_Percent))
    DM_Amount_Percent=0;

  if(isNaN(DM_Uses_Times))
    DM_Uses_Times=0;

  if(DM_Code.length==0)
  {
      $("#DM_Code").css('border-bottom','1px solid #d01b0d');
      $("#DM_Code").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty Code ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    
  }

  $("#dead_quota_amt").css('border-bottom','1px solid #9e9e9e');
  $("#dead_quota_amt").css('box-shadow','none'); 
  if(DM_Amount_Percent==0)
  {
    $("#dead_amt").css('border-bottom','1px solid #d01b0d');
    $("#dead_amt").css('box-shadow','0 1px 0 0 #d01b0d'); 
    msg="<strong> Error! </strong> Empty Amount ";
    $("#alertcustom").css('display','block');
    $("#alertcustom").html(msg);
    hideAlert("alertcustom");  
    return false;
  }


  if(DM_DeadLine_Date=='' && DM_Uses_Times==0)
  {
  	DM_type='A';
  }
  else if(DM_DeadLine_Date=='' && DM_Uses_Times > 0)
  {
  	DM_type='Q';
  }
  else if(DM_Uses_Times==0 && DM_DeadLine_Date!='')
  {
  	DM_type='D';
  }
 else if(DM_Uses_Times>0 && DM_DeadLine_Date!='')
  {
  	DM_type='QD';
  }

       let API_url=base_url+"admin/insertCode";
        var JSONdata  = {             
            DM_Code:DM_Code,
            DM_type:DM_type,
            DM_Amount_Percent:DM_Amount_Percent,
            DM_DeadLine_Date:DM_DeadLine_Date,
			DM_Uses_Times:DM_Uses_Times
          };	
        fetch(API_url, {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(JSONdata)
          }).then(function(response) {
            return response.json();
          }).then(data => 
        {           
            
                let msg="";
                if(data.status===1)
                { 
                  msg="<strong> Success! </strong> "+data.msg;
                  $("#alertcustom").css('display','block');
                  $("#alertcustom").html(msg);
                  hideAlert("alertcustom");
                  window.location.reload(true);
                }
                else
                {
                  msg="info! "+data.msg;              
                  $("#alertcustom").css('display','block');
                  $("#alertcustom").text(msg);
                  hideAlert("alertcustom");
              }         
  
          });
  
 

});



$(document).on('click', "#btn_update_code_deadLine_quota", async function(event) 
{
  		event.preventDefault();
        let DM_Code=$('#DM_Code').val();
        let DM_type=$('#DM_type').val();
        let DM_Amount_Percent=parseFloat($('#dead_quota_amt_edit').val());  
        let DM_DeadLine_Date=$('#DM_DeadLine_Date_quota_edit').val();
        let DM_Uses_Times=parseFloat($('#DM_Uses_Times_dead_quota_edit').val());

  let DM_ID=parseFloat($('#DM_ID').val());

 let msg="";

        if(isNaN(DM_Amount_Percent))
          DM_Amount_Percent=0;

        if(isNaN(DM_Uses_Times))
          DM_Uses_Times=0;

        if(DM_Code.length==0)
        {
            $("#DM_Code").css('border-bottom','1px solid #d01b0d');
            $("#DM_Code").css('box-shadow','0 1px 0 0 #d01b0d'); 
            msg="<strong> Error! </strong> Empty Code ";
            $("#alertcustom").css('display','block');
            $("#alertcustom").html(msg);
            hideAlert("alertcustom");  
            return false;

        }

        $("#dead_quota_amt").css('border-bottom','1px solid #9e9e9e');
        $("#dead_quota_amt").css('box-shadow','none'); 
        if(DM_Amount_Percent==0)
        {
          $("#dead_amt").css('border-bottom','1px solid #d01b0d');
          $("#dead_amt").css('box-shadow','0 1px 0 0 #d01b0d'); 
          msg="<strong> Error! </strong> Empty Amount ";
          $("#alertcustom").css('display','block');
          $("#alertcustom").html(msg);
          hideAlert("alertcustom");  
          return false;
        }


        if(DM_DeadLine_Date=='' && DM_Uses_Times==0)
        {
          DM_type='A';
        }
        else if(DM_DeadLine_Date=='' && DM_Uses_Times > 0)
        {
          DM_type='Q';
        }
        else if(DM_Uses_Times==0 && DM_DeadLine_Date!='')
        {
          DM_type='D';
        }
       else if(DM_Uses_Times>0 && DM_DeadLine_Date!='')
        {
          DM_type='QD';
        }

         let API_url=base_url+"admin/updateCode";

        var JSONdata  = {    
  			DM_ID:DM_ID,          
            DM_Type:DM_type,
            DM_Amount_Percent:DM_Amount_Percent,
            DM_DeadLine_Date:DM_DeadLine_Date,
			DM_Uses_Times:DM_Uses_Times
          };	

     var data=await JsonAPI('updateCode',JSONdata);

  if(data.status===1)
  { 
    msg="<strong> Success! </strong> "+data.msg;
    $("#alertcustom").css('display','block');
    $("#alertcustom").html(msg);
    hideAlert("alertcustom");
    window.location.reload(true);
  }
  else
  {
    msg="info! "+data.msg;              
    $("#alertcustom").css('display','block');
    $("#alertcustom").text(msg);
    hideAlert("alertcustom");
  }         
  

});

  
  
  
  //update discount
  
  
  
  
  $(document).on('click', "#btn_update_code_deadLine", async function(event) 
  {
    event.preventDefault();
  let DM_Amount_Percent=parseFloat($('#amt_deadline').val());
  let DM_ID=parseFloat($('#DM_ID').val());
  let DM_DeadLine_Date=$('#date_deadline').val();
  
    $("#amt_deadline").css('border-bottom','1px solid #9e9e9e');
    $("#amt_deadline").css('box-shadow','none'); 
     if(DM_Amount_Percent==0)
    {
      $("#amt_quota_edit").css('border-bottom','1px solid #d01b0d');
      $("#amt_quota_edit").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty field ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
  
    $("#date_deadline").css('border-bottom','1px solid #d01b0d');
    $("#date_deadline").css('box-shadow','none'); 
    if(DM_DeadLine_Date.length==0)
    {
      $("#DM_Uses_Times_edit").css('border-bottom','1px solid #d01b0d');
      $("#DM_Uses_Times_edit").css('box-shadow','0 1px 0 0 #d01b0d'); 
      msg="<strong> Error! </strong> Empty No Of Quota ";
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");  
      return false;
    }
           
    var JSONdata  = {   
          DM_Type:'D',             
          DM_ID:DM_ID,           
          DM_Amount_Percent:DM_Amount_Percent,
          DM_DeadLine_Date:DM_DeadLine_Date         
      };	
      var data=await JsonAPI('updateCode',JSONdata);
      let msg="";
    if(data.status===1)
    { 
      msg="<strong> Success! </strong> "+data.msg;
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");
      window.location.reload(true);
    }
    else
    {
      msg="info! "+data.msg;              
      $("#alertcustom").css('display','block');
      $("#alertcustom").text(msg);
      hideAlert("alertcustom");
    }         
    
          
    
  
  });
  
  
  
  
  $(document).on('click', ".deleteCode",async function(event){
  
    var DM_ID = parseInt($(this).attr("data-value"));
    if(isNaN(DM_ID))
      DM_ID=0;
  
    var JSONdata={
      DM_ID:DM_ID
    }
    var data=await JsonAPI('deleteCode',JSONdata);
    let msg="";
    if(data.status===1)
    { 
      msg="<strong> Success! </strong> "+data.msg;
      $("#alertcustom").css('display','block');
      $("#alertcustom").html(msg);
      hideAlert("alertcustom");
      window.location.reload(true);
    }
    else
    {
      msg="info! "+data.msg;              
      $("#alertcustom").css('display','block');
      $("#alertcustom").text(msg);
      hideAlert("alertcustom");
    }         
    
  });
  
  
  
  
   async function JsonAPI(apiName,JSONdata)
   {
     let API_url=base_url+"admin/"+apiName;    
     let response = await fetch(API_url, {
       method: 'post',
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(JSONdata)
     })
  
     const data = await response.json();
     console.log(data)
     return data;
   }

//06-aug-2021
function  decryptJson(flag)
{
  var bytes  = CryptoJS.AES.decrypt(flag, 'ae25e95570a100bc69d3b44fe1124773');
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
function encryptJson(data)
{
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'ae25e95570a100bc69d3b44fe1124773').toString();   
  return ciphertext;

}



$(document).on('click', ".news_letter",async function() {

 try{
 
     var JM_ID = parseInt($(this).val());
   let isBlocked=0;  
    let isChecked =$(this).prop("checked");
      if(isChecked)
       isBlocked=1;
 
     if(JM_ID > 0 )
     {
 
       let inserted_id=0;
       let API_url=base_url+"admin/isSentNewsLater";

       var flagData  = {           
         ID:JM_ID,
         isSentNewsLater:isBlocked
       };

       const flag=await encryptJson(flagData);
       console.log(flag)

       var JSONdata  = {           
            flag:flag
         };	


       fetch(API_url, {
       method: 'post',
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify(JSONdata)
         }).then(function(response) {
           return response.json();
         }).then(data => 
       {           
           
               let msg="";
               if(data.status===1)
               { 
                 msg="<strong> Success! </strong> "+data.msg;
                 $("#alertcustom").css('display','block');
                 $("#alertcustom").html(msg);
                 hideAlert("alertcustom");
                 setTimeout(function() {
                  window.location.reload();          
                 }, 2000);   
                 
               }
               else
               {
                 msg="<strong>Success !</strong>"+data.msg;
                 $("#alertcustom").css('display','block');
                 $("#alertcustom").text(msg);
                 hideAlert("alertcustom");
             }         
 
         });
         
     }
 
   }
   catch(e)
   {
     alert("connection error");
   }
 
 });


 if(url.endsWith('/referral-ranking') || url.endsWith('/referral-ranking/'))
{
   $('#tbl_ref_ranking').dataTable();
   CreateTable_OrderBy('tbl_ref_ranking',0);
}


//16-aug-2021

$(document).on('click', ".viewPayment",async function() {

  try{
  
      var JM_ID = parseInt($(this).attr("data-value"));
      if(isNaN(JM_ID)) JM_ID=0;
  
	  $("#JM_ID").val(0);

      if(JM_ID > 0 )
      {
  
        let inserted_id=0;
        var base_url=location.origin;
        let API_url=base_url+"/admin/celebrityPaymentDetails";
 
        var flagData  = {           
          JM_ID:JM_ID        
        };
 
		
        const flag=await encryptJson(flagData);
        console.log(flag)
 
        var JSONdata  = {           
             flag:flag
          };	
 
 
        fetch(API_url, {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(JSONdata)
          }).then(function(response) {
            return response.json();
          }).then(async resp => 
        {           
            
					var bank_pay=$(this).attr("data-bankpay");
			   		$("#btn_payout_ok").attr('data-id',JM_ID)
			   		$("#btn_payout_ok").attr('data-bankpay',bank_pay)

					         $("#totalEarning").html('Total Earnings <br/> 0');
                    $("#totalPayout").html('Total Payout <br/>  0' );
                    $("#totalWallet").html('Total Wallet <br/>  0');


                let msg="";
				$("#tbl_all_payment_tbody").html('');
 				$("#tbl_all_tran_tbody").html('');   
                	let totalEarning=0,totalPayout=0,totalWallet=0;
                if(resp.status===1)
                { 
                  const data=decryptJson(resp.flag);
                  let {paymentDetails,allTransaction,allPayout}=data;
		
                  if(paymentDetails !=null && paymentDetails.length > 0)
                  {
                   	  	 totalEarning = paymentDetails[0].totalEarning;
            			 totalPayout  = paymentDetails[0].totalPayout;
            			 totalWallet  = paymentDetails[0].totalWallet;
                  } 
                    $("#totalEarning").html('Total Earnings <br/>' + totalEarning.toFixed(2));
                    $("#totalPayout").html('Total Payout <br/>' + totalPayout.toFixed(2));
                    $("#totalWallet").html('Total Wallet <br/>' + totalWallet.toFixed(2));

                  if(allTransaction !=null && allTransaction.length > 0)
                  {
 					
                    createAlltransactionTable(allTransaction)
                  }
                  if(allPayout !=null && allPayout.length > 0)
                  {
                    createAllpayoutTable(allPayout)
                  }
		
                }
                else
                {
                 
                }         
  
          });
          
      }
  
    }
    catch(e)
    {
      alert("connection error");
    }
  
  });

  function  createAlltransactionTable(data)
  {
    let len=data.length;
    let TableData='';

		const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
       

        for (let i = 0; i < len; i++) 
        {
           const item = data[i];         
            TableData +='<tr>';        
            TableData += '<td>'+ item.BM_Purchase_Date +'</td>';
            TableData += '<td>'+item.BM_Name+'</td>';
            TableData += '<td>'+item.BM_Email+'</td>';
            TableData += '<td>'+item.DA_Title+'</td>';
            TableData += '<td>'+item.BM_Purchase_Amt+'</td>';
            TableData += '<td>'+item.Status+'</td>';        
            TableData +='</tr>';
        }
       
     

                         
    $("#tbl_all_tran_tbody").html(TableData);
                                
    $('#tbl_all_tran').dataTable();
    CreateTable_OrderBy('tbl_all_tran',0);
  }

  function  createAllpayoutTable(data)
  {
    let len=data.length;
    let TableData='';
        for (let i = 0; i < len; i++) 
        {
          const item = data[i]; 		
          TableData +='<tr>';
          TableData += '<td>'+item.tranDate+'</td>';     
          TableData += '<td>'+item.amount+'</td>';
          TableData += '<td>'+item.payout_id+'</td>';         
          TableData +='</tr>';
        }
       
     
 	
    $("#tbl_all_payment_tbody").html(TableData);
    $('#tbl_all_payment').dataTable();
    CreateTable_OrderBy('tbl_all_payment',0);
  }


   function openAlertModal(event,id,type,name)
  {
	var chk= event.getAttribute("data-type");
	console.log(event.checked);
	var checked=event.checked;

		
    $('.JM_ID').val(id);  
    $('#btn_ok_alert').attr("data-type",type); 
    $('#btn_cancel_alert').attr("data-type",type); 
    let title='';
    if(type=='B') 
    {
		if(checked==true)
		  title='Block';
		else
		 title='Unblock';

		$('#alert_title').html(title +" "+ name +"'s Prfoile ?");  
    } 
    else if(type=='V')
    {
		if(checked==true)
			title='Verify';
		else
		    title='Unverify';
 		
			$('#alert_title').html(title +" "+ name +"'s Prfoile ?");  
    }
    else if(type=='L')
    {
		if(checked==true)
			$('#alert_title').html(" set up "+ name +"'s Prfoile in landing page?");  
		else
		   $('#alert_title').html(" remove  "+ name +"'s Prfoile from landing page?");  

		
 		
    }

    
    
  }


  
$(document).on('click', ".btn_cancel_alert",async function() {

  var type=$(this).attr("data-type"); 
  var id=$('.JM_ID').val(); 

  if(type=='B')
  {
   var chk= $("#block_"+id).prop("checked");
   if(chk==true)
      $("#block_"+id).prop("checked",false);
	else
	  $("#block_"+id).prop("checked",true);
  }
 else if(type=='V')
  {
   var chk= $("#chk_"+id).prop("checked");
   if(chk==true)
      $("#chk_"+id).prop("checked",false);
	else
 	  $("#chk_"+id).prop("checked",true);
  }
 else if(type=='L')
  {
   var chk= $("#priority_"+id).prop("checked");
   if(chk==true)
      $("#priority_"+id).prop("checked",false);
	else
 	  $("#priority_"+id).prop("checked",true);
	
  }
  
});


$(document).on('click', ".btn_ok_alert", function() {
   
  try{
  
    var type=$(this).attr("data-type"); 
    var id=$('.JM_ID').val(); 

    
      if(type=='B')
      {     
          let isBlocked=0;  
           var chk= $("#block_"+id).prop("checked");
        
            var JM_ID = parseInt(id);
    		if(isNaN(JM_ID)) JM_ID=0;
            let isChecked=chk;
            if(isChecked)
             isBlocked=1;
      
            if(JM_ID > 0 )
            {
        
                  let inserted_id=0;
                  let API_url=base_url+"admin/blockCelebrity";
                  var JSONdata  = {           
                      JM_ID:JM_ID,
                      isBlocked:isBlocked
                    };	
                  fetch(API_url, {
                  method: 'post',
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify(JSONdata)
                    }).then(function(response) 
                    {
                      return response.json();
                    }).then(data => 
                    {           
                      
                          let msg="";
                          if(data.status===1)
                          { 
							hideModal("alertModal");
                            msg="<strong> Success! </strong> "+data.msg;
                            $("#alertcustom").css('display','block');
                            $("#alertcustom").html(msg);
                            hideAlert("alertcustom");
  							window.location.reload(true);
                          }
                          else
                          {
                            msg="<strong>Success !</strong>"+data.msg;
                            $("#alertcustom").css('display','block');
                            $("#alertcustom").text(msg);
                            hideAlert("alertcustom");
                        }         
            
                    });
                    
          }  
         
      }
    else if(type=='V')
      {
        var chk= $("#chk_"+id).prop("checked");
       
         doVerify(id);
		 hideModal("alertModal");
         window.location.reload(true);
      }
   else if(type=='L')
      {
            var chk= $("#priority_"+id).prop("checked");  
			try{

                var JM_ID = parseInt(id);
    			if(isNaN(JM_ID)) JM_ID=0;
                let displayLanding=0;  
                let isChecked =chk;
                 if(isChecked)
                  displayLanding=1;

                if(JM_ID > 0 )
                {

                  let inserted_id=0;
                  let API_url=base_url+"admin/updateCelebrityPrority";
                  var JSONdata  = {           
                      JM_ID:JM_ID,
                      displayLanding:displayLanding
                    };	
                  fetch(API_url, {
                  method: 'post',
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify(JSONdata)
                    }).then(function(response) {
                      return response.json();
                    }).then(data => 
                        {           

                          let msg="";
                          if(data.status===1)
                          { 
 							hideModal("alertModal");
                            msg="<strong> Success! </strong> "+data.msg;
                            $("#alertcustom").css('display','block');
                            $("#alertcustom").html(msg);
                            hideAlert("alertcustom");
                            window.location.reload(true);
                          }
                          else
                          {
                            msg="Success ! "+data.msg;
                            $(this).prop("checked",false);
                            $("#alertcustom").css('display','block');
                            $("#alertcustom").text(msg);
                            hideAlert("alertcustom");
                         }         

                     });

                }


              }
              catch(e)
              {
                alert("connection error");
              }


         
      }
     
    }catch(e)
    {
      alert("connection error");
    }
  
  });


function hideModal(modalName){
    $("#"+modalName).removeClass("in");
    $(".modal-backdrop").remove();
    $("#"+modalName).hide();
}


function openPayoutModal(JM_ID)
{
  $("#btn_payout_ok").attr('data-id',JM_ID)
}


//btn_payout_ok
$(document).on('click', "#btn_payout_ok", function() {
   
  try{
  
               // var type=$(this).attr("data-id"); 
                var id=$(this).attr("data-id"); 
			        	var bank_pay=$(this).attr("data-bankpay");
                var pay_amt=parseInt($('#pay_amt').val()); 
                if(isNaN(pay_amt)) pay_amt=0;
                if(pay_amt==0)
                {
                    document.getElementById('msg_payout').style.color='red'
                    document.getElementById('msg_payout').innerHTML='* Enter valid Amount';
                    return false;
                }
  

				if(typeof bank_pay=='undefined' || bank_pay=='' ||  bank_pay==null)
                {
                  document.getElementById('msg_payout').style.color='red'
                  document.getElementById('msg_payout').innerHTML='* Update Bank Details';
                  return false;
                }

                var JM_ID = parseInt(id);
    		    if(isNaN(JM_ID)) JM_ID=0;
                if(JM_ID > 0 )
                {

                  let inserted_id=0;
                  let API_url=base_url+"admin/payoutAdmin";
                  var JSONdata = {           
                      type:bank_pay,
                      amount:pay_amt
                    };	
                    fetch(API_url, {
                    method: 'post',
                    headers: {"Content-Type": "application/json","id":JM_ID},
                    body: JSON.stringify(JSONdata)
                      }).then(function(response) {
                        return response.json();
                      }).then(data => 
                          {
                            let msg="";
                            if(data.status===1)
                            { 
								
								              document.getElementById('msg_payout').style.color='green';
          					       	  document.getElementById('msg_payout').innerHTML="Payout process is successfully completed";
                              hideModal("payoutModal");
                              hideModal("paymentModal");
                              $('#pay_amt').val(0);                             
                              document.getElementById('msg_payout').innerHTML='';
                              msg="<strong> Success! </strong> "+data.msg;
                              $("#alertcustom").css('display','block');
                              $("#alertcustom").html(msg);
                              hideAlert("alertcustom");

                              //payoutModal
                              //paymentModal
                              window.location.reload(true);
                            }
                            else
                            {

							           document.getElementById('msg_payout').style.color='red'
                   		      	  document.getElementById('msg_payout').innerHTML=data.msg;
                              msg="Error ! "+data.msg;
                              $(this).prop("checked",false);
                              $("#alertcustom").css('display','block');
                              $("#alertcustom").text(msg);
                              hideAlert("alertcustom");

 							
                          } 
                      });
                }
    }
    catch(e)
    {
      alert("connection error");
    }
  });




//btn_payout_close
$(document).on('click', "#btn_payout_close", function() {

	$('#pay_amt').val('');
	document.getElementById('msg_payout').style.color='red'
    document.getElementById('msg_payout').innerHTML='';
});
  //pay_amt
  $(document).on('keypress', "#pay_amt", function(event) {
    
        if (!/[0-9]/.test(event.key)) 
        {
          event.preventDefault();
        }
  });

//18-aug-2021

 //getKeyData


//18-aug-2021

 //getKeyData

   
 if(url.endsWith('/admin/exp_admin_panel/key-data') || url.endsWith('/admin/exp_admin_panel/key-data/'))
 {
 
     $(document).ready(function() {  //  $("#btn_signup_ref").click();
     });
 }
 
   async function getKeyData(event) 
   {
    
     var id=event.getAttribute('data-id')
     var days=$("#type").val();
   
     if(isNaN(days)) days=0;
       if(days==0)
       {
         alert('select type from dropdown');     
       //data-toggle="modal" data-target="#chartModal"		
         return false;
       }
 
     $("#chartModal").modal("show");
 
         var flagData  = {          
           days:days		 
         };
 
     if(typeof id=='undefined' || id.length ==0)
         {
           return false;
         }
 
     const flag=await encryptJson(flagData);   
     var JSONdata  = {           
          flag:flag
       };	
 
 
 
 
           fetch(base_url+ 'admin/getKeyData', {
             method: 'post',
             headers: {"Content-Type": "application/json"},
             body: JSON.stringify(JSONdata)
               }).then(function(response) {
                 return response.json();
               }).then(data => 
                   {
                     let msg="";
                     if(data.status===1)
                     {          
                   setChart(data,id,days);
                     }
                     else
                     {
                       return false;
                     }
                });
         
   }
 
 
 
 function setChart2()
 {
   var xValues = [50,60,70,80,90,100,110,120,130,140,150];
       var yValues = [7,8,8,9,9,9,10,11,14,14,15];
 
       new Chart("myChart", {
         type: "bar",
         data: {
           labels: xValues,
           datasets: [{
             fill: false,
             lineTension: 0,
             backgroundColor: "rgba(0,0,255,1.0)",
             borderColor: "rgba(0,0,255,0.1)",
             data: yValues
           }]
         },
         options: {
           legend: {display: false},
           scales: {
             yAxes: [{ticks: {min: 6, max:16}}],
           }
         }
       });
 
 }
 
    
  
 
 
 
    $(document).on('change', "#type", async function(event) {    
       var days=parseInt($(this).val());
                                      
       if(isNaN(days)) days=0;
       if(days==0)
       {
                                             
         return false;
       }
 
       var flagData  = {          
         days:days		 
       };
 
       const flag=await encryptJson(flagData);   
       var JSONdata  = {           
           flag:flag
         };	
            
         var expyCommission=0,requestCompleted=0,totalPageViews=0,totalUniquePageVisitor=0;
         var signup_via_referral=0,payout_for_Creator=0,averageCTR_view_click=0,noOfCreator=0,totalSales=0;
         fetch(base_url+ 'admin/getKeyData_by_days', {
           method: 'post',
           headers: {"Content-Type": "application/json"},
           body: JSON.stringify(JSONdata)
             }).then(function(response) {
               return response.json();
             }).then(data => 
                 {
                   let msg="";
                   if(data.status===1)
                   {                    
 
                    $("#tbl_signup_ref").html('');
                     $("#tbl_signup").html('');
           $("#tbl_sales").html('');
                     $("#tbl_payout").html('');
           $("#tbl_exp_com").html('');
                     $("#tbl_com_req_pur").html('');
           $("#tbl_com_page_views").html('');
                     $("#tbl_u_visitor").html('');
           $("#tbl_avg_ctr").html('');
                    
           if(days==1)
              $("#title_days").html('Filter type: Daily ');
           if(days==7)
              $("#title_days").html('Filter type: Weekly ');
           if(days==30)
              $("#title_days").html('Filter type: Monthly ');
           if(days==365)
              $("#title_days").html('Filter type: Yearly ');
 
                     if(data.total_signup_via_referral !=null && data.total_signup_via_referral.length > 0)
                        signup_via_referral=data.total_signup_via_referral[0].total_signup_via_referral;
 
                    if(data.creators !=null && data.creators.length > 0)
                        noOfCreator=data.creators[0].noOfCreator;
 
                   if(data.sales !=null && data.sales.length > 0)
                     {
                       totalSales=data.sales[0].totalSales;
                       expyCommission=totalSales*.10;
                     } 
                     if(data.payoutCreator !=null && data.payoutCreator.length > 0)
                     {
                       payout_for_Creator=data.payoutCreator[0].payoutCreator;                    
                     } 
                     if(data.completedRequest !=null && data.completedRequest.length > 0)
                     {
                       requestCompleted=data.completedRequest[0].completedRequest;                    
                     } 
 
                     if(data.totalViews !=null && data.totalViews.length > 0)
                     {
                       totalPageViews=data.totalViews[0].totalViews;                    
                     } 
                     if(data.uniqueViews !=null && data.uniqueViews.length > 0)
                     {
                       totalUniquePageVisitor=data.uniqueViews[0].uniqueViews;                    
                     } 
                     if(data.averageCTR !=null && data.averageCTR.length > 0)
                     {
                       averageCTR_view_click=data.averageCTR[0].averageCTR;                    
                     } 
                     
                     $("#txt_signup_ref").text(signup_via_referral);
                     $("#txt_signup").text(noOfCreator);
                     $("#txt_sales").text(totalSales);
                     $("#txt_payout").text(payout_for_Creator);                    
                     $("#txt_exp_comt").text(expyCommission.toFixed(2));
                     $("#txt_com_req_pur").text(requestCompleted);
                     $("#txt_page_views").text(totalPageViews);
                     $("#txt_u_visitor").text(totalUniquePageVisitor);
                     $("#txt_avg_ctr").text(averageCTR_view_click);
              
                   }
                   else
                   {
                      $("#alertcustom").css('display','block');
                      $("#alertcustom").text(data.msg);
                      hideAlert("alertcustom");
                       return false;
                   }
              });
 });
  
 
 
  function setChart(data,id,days)
  {
 
     let labels=[];let Dbdata=[];let Dbdata_2=[];
     let inputArray=[];
     var title="";
     var maxY=100;
     var minY=0;
     var beginAtZero=true;
     var stepSize=20;
   
 
     if(id=='signup_ref')
     {
      title="Signup via referral (in count)";
       if(data.total_signup_via_referral !=null && data.total_signup_via_referral.length  > 0)
       {
          inputArray =data.total_signup_via_referral;
          labels = inputArray.map( (item) => item.Date_Values);
          Dbdata = inputArray.map( (item) => item.noOfCount);
       }
     }
    else if(id=='signup')
    {
    title="Signup (in count)";
     if(data.creators!=null && data.creators.length >0)
     {
       inputArray =data.creators;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.noOfCount);
     }
    } 
    else if(id=='sales')
    {
      title="Sales (in INR)";
     if(data.sales!=null && data.sales.length >0)
     {
       inputArray =data.sales;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.totalSales);
       //Dbdata_2 = inputArray.map( (item) => item.totalSales);
       
     }
    }
    else if(id=='payout')
    {
      title="Payout to creators (in INR)";
     if(data.payoutCreator!=null && data.payoutCreator.length >0)
     {
       inputArray =data.payoutCreator;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.amount);  
      
     }
    }
    else if(id=='com_req_pur')
    {
   title="Completed request (in count)";
     if(data.completedRequest!=null && data.completedRequest.length >0)
     {
       inputArray =data.completedRequest;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.noOfCount);  
     }
    }
    else if(id=='exp_com')
    {
   title="Expy Commission (in INR)";
     if(data.sales!=null && data.sales.length >0)
     {
       inputArray =data.sales;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => parseFloat(item.totalSales).toFixed(2) * .10);  
     }
    }
    else if(id=='page_views')
    {
     title="Total pageviews (in count)";
     if(data.totalViews!=null && data.totalViews.length >0)
     {
       inputArray =data.totalViews;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.totalViews);  
     }
    }
    else if(id=='u_visitor')
    {
   title="Unique Visitors (in count)";
     if(data.uniqueViews!=null && data.uniqueViews.length >0)
     {
       inputArray =data.uniqueViews;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) => item.uniqueViews);  
     }
    }
    else if(id=='avg_ctr')
    {
   title="Average CTR (in percentage)";
     if(data.viewClick!=null && data.viewClick.length >0)
     {
       inputArray =data.viewClick;
       labels = inputArray.map( (item) => item.Date_Values);
       Dbdata = inputArray.map( (item) =>  item.averageCTR.toFixed(2) );  
     
 
     }
    }
 
    //totalViews
     console.log(labels)
     console.log(Dbdata)
 
   $('#myChart').remove(); // this is my <canvas> element
   $('#graph-container').append('<canvas id="myChart" width="100%"><canvas>');
 
   if(days=="1")
     {
       if(id=='avg_ctr')
         {
           maxY=10;
           stepSize=2;
         }
         if(id=='u_visitor')
         {
           maxY=2000;
           stepSize=200;
         }
         if(id=='page_views')
         {
           maxY=5000;
           stepSize=500;
         }
         if(id=='exp_com')
         {
           maxY=5000;
           stepSize=500;
         }
         if(id=='payout')
         {
           maxY=5000;
           stepSize=500;
         }
         if(id=='sales')
         {
           maxY=25000;
           stepSize=2500;
         }
         if(id=='signup_ref')
         {
           maxY=50;
           stepSize=10;
         }
         
     }
   else if(days=="7")
     {
       if(id=='avg_ctr')
         {
           maxY=70;
           stepSize=14;
         }
         if(id=='u_visitor')
         {
           maxY=15000;
           stepSize=500;
         }
         if(id=='page_views')
         {
           maxY=25000;
           stepSize=1000;
         }
         if(id=='com_req_pur')
         {
           maxY=700;
           stepSize=100;
         }
         if(id=='exp_com')
         {
           maxY=25000;
           stepSize=1000;
         }
         if(id=='payout')
         {
           maxY=35000;
           stepSize=1500;
         }
         if(id=='sales')
         {
           maxY=50000;
           stepSize=5000;
         }
         if(id=='signup')
         {
           maxY=1000;
           stepSize=100;
         }
         if(id=='signup_ref')
         {
           maxY=350;
           stepSize=50;
         }
     }
   else if(days=="30")
     {
       if(id=='avg_ctr')
         {
             maxY=100;
             stepSize=20;
         }
         if(id=='u_visitor')
         {
           maxY=50000;
           stepSize=5000;
         }
         if(id=='page_views')
         {
           maxY=100000;
           stepSize=5000;
         }
         if(id=='com_req_pur')
         {
           maxY=1200;
           stepSize=200;
         }
         if(id=='exp_com')
         {
           maxY=50000;
           stepSize=5000;
         }
         if(id=='payout')
         {
           maxY=50000;
           stepSize=5000;
         }
         if(id=='sales')
         {
           maxY=100000;
           stepSize=25000;
         }
         if(id=='signup')
         {
           maxY=10000;
           stepSize=500;
         }
         if(id=='signup_ref')
         {
           maxY=700;
           stepSize=100;
         }
     }
 
      var ctx = document.getElementById('myChart');
          var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: labels,
                  datasets: [{
                      label: '#'+ title,
                      data:Dbdata,
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: beginAtZero,
                           min: minY,
                          max: maxY,
                          stepSize: stepSize,
                      }
                  },
               animation: {
                     duration : 200
                  },
           
            plugins: {
                               filler: {
                                 propagate: false,
                               },                              
                             },
                     pointBackgroundColor: '#fff',
                     radius: 4,
                     interaction: {
                       intersect: false,
                     }
            }
          });
  
  
  }
  