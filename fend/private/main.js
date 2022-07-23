const book = document.getElementById('book')
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


const cancel=document.getElementById('cancelorder')
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

const logout=document.getElementById("logout");
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
            location.assign(data.url)
        }
    }catch(e)
    {
        console.log(e)
    }
})





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