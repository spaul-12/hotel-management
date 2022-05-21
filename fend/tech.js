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
  }
  
  const modal_btn=document.getElementById("sign-up");
  const close_btn=document.getElementById('close_btn');
  const modal=document.getElementById("modal");

  modal_btn.addEventListener('click',()=>{
    console.log(modal);
    modal.classList.add('active');
    
  });

  close_btn.addEventListener('click',()=>{
    modal.classList.remove('active');
  });