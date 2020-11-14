const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res)=>{
    res.sendFile(`${__dirname}/Sign_up.html`)
})

app.post("/", (req, res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.Email;

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }

    const datajson = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/listkey"
    const options = {
        method: "POST",
        auth: "mjavad976:apikey"
    }

    const request = https.request(url, options, (response)=>{

        if(response.statusCode === 200){
            res.sendFile(`${__dirname}/Success.html`)
        }else{
            res.sendFile(`${__dirname}/Failure.html`)
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    });
    
    request.write(datajson);
    request.end();

})

app.post("/Failure", (req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port 3000.");
})
