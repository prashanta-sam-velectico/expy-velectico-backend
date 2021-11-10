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
    let jsonData = {
      AM_Email: email,
      AM_Password:password,
  };
    let  coin=sessionStorage.getItem('coin');
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(jsonData), coin).toString();   
   
    const flagData = {
     flag:ciphertext    
  };  
  
    JsonPostData("auth",flagData);
  });
  function JsonPostData(url,jsonData)
  {   
    
    fetch(root_url+url, {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8','auth':sessionStorage.getItem('coin')
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