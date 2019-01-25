$(document).ready(() => {
    console.log("Document ready");
    $(".errormsg").hide();
    var socket = io();

    // Place the remaining code of this article here...
    $("#assessment_form").submit((e) => {
        // Hide previous error message in case it's still visible
        $(".errormsg").hide();

        // Retrieve text entered into text box
        var enteredText = $("#assessment_text").val();
        console.log("Form submitted - entered text: " + enteredText);

        // Send the message to the server via socket.io
        socket.emit("assessment", enteredText);

        // Clear the entered text from the text box
        $("#assessment_text").val("");

        // Do not reload page
        e.preventDefault();
    });

    socket.on("Temperature", (msg) => {
        $(".result_temperature").html(msg);
    });
    socket.on("Precipitation", (msg) => {
        $(".result_precipitation").html(msg);
    });
    socket.on("Humidity", (msg) => {
        $(".result_humidity").html(msg);
    });
    socket.on("Wind", (msg) => {
        $(".result_wind").html(msg);
    });
    socket.on("Error", (msg) => {
        $(".errormsg").html(msg);
        $(".errormsg").show();
    });

    //Zusatz: Clientseite reagiert auf Antwort des Servers bzgl Erhalt/Nichterhalt der Form/des Contents
    /*socket.on("EmptyFormServer", (msg) => {
        console.log(msg);
        $("#addCompletionText").html("Form not complete. Please add the missing content.");
    });*/

    //Zusatz: Clientseite reagiert auf Antwort des Servers bzgl Erhalt/Nichterhalt der Form/des Contents
    /*socket.on("CompleteFormServer", (msg) => {
        console.log(msg);
        $("#addCompletionText").html("Form complete. Server received data.");
    });*/

    /*Überprüfung ob Form/Content vollständig ist oder nicht, reicht primär Clientseitig aus. Es kann aber auch abgefragt werden ob Server Daten vollständig erhalten hat.
    Wurde als Zusatz hinzugefügt.*/
    $("#completion").click(() => {
        $("#addCompletionText").empty();
        if (($(".result_temperature").html()) == "" || ($(".result_precipitation").html()) == "" || ($(".result_humidity").html()) == "" || ($(".result_wind").html()) == "") {
            //Versenden der Nachricht an den Server, dass erkannt wurde, dass Form/Content nicht vollständig ist.
            //socket.emit("EmptyFormClient", "Form not complete.");
            $("#addCompletionText").css("color", "red");
            $("#addCompletionText").html("Form not complete. Please add the missing content.");
            console.log("Form not complete. Please add the missing content.");
        } else {
            //Versenden der Nachricht an den Server, dass erkannt wurde, dass Form/Content vollständig ist.
            //socket.emit("CompleteFormClient", "Form complete.");
            $("#addCompletionText").css("color", "green");
            $("#addCompletionText").html("Form complete. Data received.");
            console.log("Form complete. Data received.");
        }
    });
});