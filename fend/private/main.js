/*const book = document.getElementById('book')
book.addEventListener("click", Booking)


function Booking() {
    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:3000/api/user/private/addentry";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Print received data from server
            console.log(this.responseText);
            

        }
    };
    let id="h1";
    let entrydate="0708";
    let exitdate="0807";
    let type="deluxe";
    var data = JSON.stringify({
        "hotelid": id,
        "adult": 1,
        "children": 1,
        "entrydate": entrydate,
        "exitdate" : exitdate,
        "roomtype" : type,
        "roomno" : 1,
        "price" : 8000        
    });

    xhr.send(data);
}

/*---------cancellation---------------*/


/*const cancel=document.getElementById('cancelorder')
cancel.addEventListener('click',Cancellation)


function Cancellation() {
    console.log("cancellation working");
   
let xhr=new XMLHttpRequest();
let url ="http://127.0.0.1:3000/api/user/private/deleteentry";

xhr.open("POST",url,true);
xhr.setRequestHeader("Content-type","application/json");

xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200)
    {console.log("ok");
    console.log(this.responseText);}

};

let id="h1";
 
var data=JSON.stringify({
    "hotelid" : id
});

xhr.send(data);
 
}

/* ----------------logout function------------------- */

/*const logout=document.getElementById("logout");
logout.addEventListener('click', async(e)=>{
    e.preventDefault()

    try{

        const res= await fetch('/api/user/private/logout',{
            method:'GET',
            redirect:"follow"
        })

        const data=await res
        console.log(data)
        if(data.redirect)
        {
            window.location.href="/";
        }
    }catch(e)
    {
        console.log(e)
    }
})*/





/*async (e) => {
    e.preventDefault()
    
    console.log("booking button working")
    try {
        const res = await fetch('/api/user/private/addentry', {
            method: 'POST',
           // redirect: "follow",
            body: JSON.stringify({
                hotelid: 12345,
                adult: 1,
                children: 1,
                entrydate: 07/08/2022,
                exitdate : 08/08/2022,
                roomtype : 1,
                roomno : 1,
                price : 10000

                
            }),
            headers: {
                'Content-Type':'application/json'
            }
        })
        
        const data = await res
        console.log(data)
        if(data.redirected){
            location.assign(data.url)
        } 
        
    } catch (e) {
       console.log(e) 
    }
})*/

const displayname= async() => {

    const res=await fetch('/api/user/username');

    if(res.status!==200){
        console.log("failed to fetch username");
    }
    else{
        console.log("fetched username");
    }

    const data=await res.json();
    console.log(data);

    var links=document.getElementById("link");
    var l=document.createElement("li");
    var textnode = document.createTextNode(JSON.stringify(data));
    l.appendChild(textnode)
    console.log(l);
    links.appendchild(l);
}

displayname();


let html="";
  let hotellist=document.getElementById('hotellist')
 
  const displayhotels = async() => {

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
    <div class="box" ">
                <img src="img/${element.hotelid}.jpg" alt="image">
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
                    <a href="#" class="btn" id="${element.hotelid}" onClick="Hotelpage(this.id)">View Deal</a>
                </div>
            </div>`;

            hotellist.innerHTML=html;
    
  }

  displayhotels();

    async function Hotelpage(clicked_id) {
        const response = await fetch("/api/user/private/createhotelcookie", {
            method: 'POST',
            body: JSON.stringify({
                hotelid: clicked_id,
            }),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        if(response.status !== 200) {
            console.log("cannot fetch data");
        }
        let data = await response.json();
        if(data.error){
            console.log("cookie could not be created");
        } else {
            window.location.href = "hotel.html";
        }
    }