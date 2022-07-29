
    let html="";
    let booking_card=document.getElementById("booking_card");
let Displayprofile = async() => {

    let res= await fetch("/api/user/private/profile");

    if(res.status!==200) {
        console.log("failed to fetch profile details");
    }
    
    let data=await res.json();
    console.log(data[0].username);
    
    let identity=document.getElementById("identity");
    
    html+=`
    <div class="card_body">
    <table>
        <tbody>
            <tr>
                <td>NAME</td>
                <td>:</td>
                <td>${data[0].username}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>:</td>
                <td>Hello@gmail.com</td>
            </tr>
        </tbody>
    </table>

</div>`;

identity.innerHTML=html;
html="";
data.forEach(element => {
    createbooking(element)
});


};

function createbooking(element) {
    html+=`
    <div class="card" >
                <div class="card_body">
                    <p>Hotel Name : ${element.hotelname}</p>
                    <table>
                        <tr>
                            <td>Arrival Date</td>
                            <td>:</td>
                            <td>${element.entrydate}</td>
                            <td>Departure Date</td>
                            <td>:</td>
                            <td>${element.exitdate}</td>
                        </tr>
                    </table>
                    <button type="submit"  class="btn" id="${element.hotelid}" onClick="Cancellation(this.id)">Cancel Your Booking</button>
                </div>
            </div>`;

    booking_card.innerHTML=html;        

}

function Cancellation(id)
{
    console.log("cancellation working");
   
    let xhr=new XMLHttpRequest();
    let url ="http://127.0.0.1:3000/api/user/private/deleteentry";
    
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-type","application/json");
    
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200)
        {console.log("ok");
        console.log(this.responseText);
        alert("cancellation successful")
    }
    
    };
    
    var data=JSON.stringify({
        "hotelid" : id
    });
    
    xhr.send(data);  
}