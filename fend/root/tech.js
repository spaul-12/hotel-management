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
  let html="";
  let hotellist=document.getElementById('hotellist')
 
  const displaybooks = async() => {

    const res=await fetch('/api/user/hotel');

    if(res.status!==200) {
    console.log("Could not fetch data");
    }
    else{
      console.log("fetched")
    }
    
    let data=await res.json();
    //console.log(data.length)
    console.log(data)

    data.forEach(element => {
      createhotel(element)
    });


  };
  function createhotel(element) {
   console.log(element.price)
    html+=`
    <div class="box" id="${element.id}">
                <img src="img/p-1.jpg" alt="image">
                <div class="content">
                    <h3><i class="fas fa-map-marker-alt"></i> ${element.hotelname}</h3>
                    <p>Lorem Ipsum is simply dummy text of the farhan and typesetting industry.</p>
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                    <div class="price"> starting from Rs ${element.price}</div>
                    <a href="#" class="btn">book now</a>
                </div>
            </div>`;

            hotellist.innerHTML=html;
    
  }

  displaybooks();