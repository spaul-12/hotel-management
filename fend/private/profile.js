let booking_card = document.getElementById("booking_card");
let html = "";
var mail;
var username;

let Displayprofile = async () => {

    let res = await fetch("/api/user/private/profile");

    if (res.status !== 200) {
        console.log("failed to fetch profile details");
    }

    let data = await res.json();
    
console.log(data.length)
    html = "";
    if (data.length === 0) {
        html += `
    <div class="card" >
                <div class="card_body">
                    <h3>No Bookings to show</h3>
                </div>
            </div>`;

        booking_card.innerHTML = html;

    } else {

        data.forEach(element => {
            createbooking(element)
        });
    }


};

function createbooking(element) {
    html += `
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

    booking_card.innerHTML = html;

}


let Getemail = async () => {
    let res = await fetch("/api/user/private/email");

    if (res.status !== 200) {
        console.log("failed to get email");
    } else {
        console.log("fetched email")

        data = await res.json();
        //console.log(data);
        mail = data.email;
        username = data.username;
        console.log(mail);
        console.log(username);
    
        let identity = document.getElementById("identity");
    
        html += `
        <div class="card_body">
        <table>
            <tbody>
                <tr>
                    <td>NAME</td>
                    <td>:</td>
                    <td>${username}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>${mail}</td>
                </tr>
            </tbody>
        </table>
    
    </div>`;
    
        identity.innerHTML = html;
        Displayprofile();
    }
    
}

function Cancellation(id) {
    console.log(id);
    console.log("cancellation working");

    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:3000/api/user/private/deleteentry";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("ok");
            console.log(this.responseText);
            alert("cancellation successful")
            window.location.href = "profile.html";
        }

    };

    var data = JSON.stringify({
        "hotelid": id
    });

    xhr.send(data);
}