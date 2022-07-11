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
    let id="B1234";
    let entrydate="458";
    let exitdate="0875";
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