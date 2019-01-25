//Used IP-adress 127.0.0.1, Port 3000

const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var request = require("request");
var querystring = require("querystring");
const ENDPOINT = "https://westeurope.api.cognitive.microsoft.com/luis/v2.0/apps/";
const APPID = "f6abe075-4b8a-4208-839b-df460d5a2911";
const APPKEY = "c69c3596619746619bd8543aeb15b5f5";

app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("assessment", (msg) => {
        sendToLuis(msg, socket.id);
    });
    //Zusatz: Kommunikation mit Server möglich, um Erhalt/Nichterhalt des vollständigen Form/Contents zu prüfen
    /*socket.on("EmptyFormClient", (msg) => {
        console.log("Message received: " + msg);
        emptyForm(socket.id);
    });
    socket.on("CompleteFormClient", (msg) => {
        console.log("Message received: " + msg);
        completeForm(socket.id);
    });*/
});

//Zusatz: Funktion, Serverantwort auf Nichterhalt des vollständigen Form/Contents
/*function emptyForm(socketId){
    console.log("Complete the missing content.");
    io.to(socketId).emit("EmptyFormServer", "Complete the missing content.");
}*/

//Zusatz: Funktion, Serverantwort auf Erhalt des vollständigen Form/Contents
/*function completeForm(socketId){
    console.log("Complete data received.");
    io.to(socketId).emit("CompleteFormServer", "Data received.");
}*/

function sendToLuis(assessment, socketId) {
    if (!assessment) {
        io.to(socketId).emit("Error", "Please enter an assessment.");
        return;
    }

    // Send to LUIS
    var queryParams = {
        "subscription-key": APPKEY,
        "verbose": true, // If true will return all intents instead of just the topscoring intent
        "q": assessment
    }

    var luisRequest =
        ENDPOINT + APPID +
        '?' + querystring.stringify(queryParams);

        request(luisRequest,
            function (err, response, body) {
                if (err) {
                    io.to(socketId).emit("Error", "Error understanding your assessment: " + err);
                } else {
                    var data = JSON.parse(body);
    
                    // Check if the relevant properties exist
                    if (!data.hasOwnProperty("query") ||
                        !data.topScoringIntent.hasOwnProperty("intent") ||
                        !data.entities[0] ||
                        !data.entities[0].hasOwnProperty("entity")) {
                        io.to(socketId).emit("Error", "Sorry, I could not understand that. [No intent or entity identified]");
                        return;
                    }
    
                    io.to(socketId).emit(data.topScoringIntent.intent, data.entities[0].entity);
                    console.log(data.topScoringIntent.intent + ": " + data.entities[0].entity);
                }
            }
        );
    }

http.listen(3000, () => console.log("Weather analysis checklist server listening on port 3000!"));
