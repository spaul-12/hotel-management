 function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

      
        let xhr= new XMLHttpRequest();
        let url="http://127.0.0.1:3000/api/user/signup";
    
         xhr.open("POST",url,true);
         xhr.setRequestHeader("Content-type", "application/json");
    
         xhr.onreadystatechange= function ()
         {
           if(xhr.readyState ===4 && xhr.status===200 )
           {
             console.log(this.reponseText);
           }
         };
          var data =JSON.stringify({"email": profile.getEmail(),"username": profile.getName(), "password":profile.getEmail()});
    
          xhr.send(data);
      
    

  } 
 /* 
  const modal_btn=document.getElementById("sign-up");
  const close_btn=document.getElementById('close_btn');
  const modal=document.getElementById("modal");
  const submitbtn=document.getElementById("submit_btn");
  const username=document.getElementById("username");
  const email=document.getElementById("email");
  const password=document.getElementById("password");


  modal_btn.addEventListener('click',()=>{
    console.log(modal);
    modal.classList.add('active');
    
  });

  close_btn.addEventListener('click',()=>{
    modal.classList.remove('active');
  });

  

  submitbtn.addEventListener('click',submit);

  function submit()
  {
     let xhr= new XMLHttpRequest();
    let url="http://127.0.0.1:3000/api/user/signup";

     xhr.open("POST",url,true);
     xhr.setRequestHeader("Content-type", "application/json");

     xhr.onreadystatechange= function ()
     {
       if(xhr.readyState ===4 && xhr.status===200 )
       {
         console.log(this.reponseText);
         console.log(email.value);
         console.log(username.value);
         console.log(password.value);
       }
     };
      var data =JSON.stringify({"email": email.value, "username": username.value, "password":password.value});

      xhr.send(data);
    
  }*/