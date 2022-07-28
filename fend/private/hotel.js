var id;
const navbar=document.getElementById("navinfo");

let displayhotel = async() => {
    
    let res=await fetch('/api/user/private/showhotel');

    if(res.status!==200) {
        console.log("could not fetch hotel data");
    }
    

    let data=await res.json();
    id=data.hotelid;
     let html="";
    html+=`
    <div class="container" ">
            <nav>
                <a href="#" id="hotelname" class="${data.hotelid}">${data.hotelname}</a>
                <ul class="nav-menu">
                    <li><a href="#home" class="navlinks">Home</a></li>
                    <li><a href="#home" class="navlinks">Book</a></li>
                    <li><a href="#home" class="navlinks">Amenities</a></li>
                    <li><a href="#home" class="navlinks">Gallery</a></li>
                    <li><a href="#home" class="navlinks">Contact</a></li>
                </ul>
            </nav>
        </div>`;
        
    
    navbar.innerHTML=html;
   

}


const book=document.getElementById('book_btn')
book.addEventListener('click',details)

function details(){
    console.log(id);
    let arrival_date=document.getElementById('arrival').value;
    console.log(arrival_date);

    let departure_date=document.getElementById('departure').value;
    console.log(departure_date);

    let children=parseInt(document.getElementById('children').value);
    console.log(children);

    let adult=parseInt(document.getElementById('adult').value);
    console.log(adult);

    let roomno=parseInt(document.getElementById('roomno').value);
    console.log(roomno);

    let roomtype=document.querySelector('input[name=roomtype]:checked').value;
    console.log(roomtype);

    let xhr = new XMLHttpRequest();
    let url = "http://127.0.0.1:3000/api/user/private/addentry";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Print received data from server
            console.log(this.responseText);
            alert("booking successful");
            

        }
    };
    var data = JSON.stringify({
        "hotelid": id,
        "adult": adult,
        "children": children,
        "entrydate": arrival_date,
        "exitdate" : departure_date,
        "roomtype" : roomtype,
        "roomno" : roomno        
    });

    xhr.send(data);
}