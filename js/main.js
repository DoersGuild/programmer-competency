/* Author: Doers' Guild
 http://www.doersguild.com
 */

/* Libraries */

function preventDefault(e) {
    // Trying all the various prevent-Default mechanisms
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.stop) {
        e.stop();
    }
    e.returnValue = false;
    return false;
}

/* Web Services */

/* Pages */

function displayPage(baseID) {
    //Display a page given the base ID
    console.log("page", baseID);

    //Store the previous page
    $.cookie("previousPage", $.cookie("currentPage"));
    $.cookie("currentPage", baseID)

    //Hide all pages and show the current one
    $(".page").fadeOut(50, function() {
        $(baseID).fadeIn();
    });
}

function displayHome() {
    //Display the Home page
    displayPage("#homePage");
}

function displayComputerScience() {
    //Display the Home page
    displayPage("#computerScience");
}

/* Setup */

function init() {
    //Run at start

    //Remove Splash-Screen and set background
    $("html,body").css({
        "background" : "none",
    });

    //Show the Home-Page
    displayHome();

    // Setup Event Handlers
    $("#homePage_begin").on("click", displayComputerScience);
    $("input[type='radio']").on("change", function() {
        //Update the level display
        var $this = $(this);
        var id = $this.attr("id");
        //Get the Level-display's id
        var level = id[id.length - 1];
        id = id.substring(0, id.length - 1) + "Display";
        $("#" + id).text("Level " + level);
    });

    //Setup the back-button
    document.addEventListener("backbutton", function(e) {
        //Handle the back-button
        if ($.cookie("previousPage")) {
            //Display the previous page
            displayPage($.cookie("previousPage"));
        } else {
            //Exit the app
            if (confirm("Are you sure you want to exit the app?")) {
                if (device.exitApp) {
                    device.exitApp();
                } else if (navigator.device.exitApp) {
                    navigator.device.exitApp();
                }
            }
            return preventDefault(e);
        }
    }, false);

    /* Setup jQuery defaults */
    $.support.cors = true;
    $.ajaxSetup({
        "cache" : true,
        type : "post",
        tryCount : 0,
        retryLimit : 5,
        beforeSend : null,
        complete : null,
        error : function(jqXHR, textStatus, errorThrown) {
            console.log("Ajax error", this, arguments);
            console.log("Unable to contact server at " + window.settings.baseURL + "\n With Status: " + textStatus + "\n Error: " + errorThrown);
            if (textStatus == 'timeout') {
                this.tryCount++;
                if (this.tryCount <= this.retryLimit) {
                    //try again
                    console.log("Retrying Ajax");
                    $.ajax(this);
                }
                console.log("Still times-out even after " + this.retryLimit + " tries");
                return;
            }
        }
    });
}

init();

/* Settings */

window.settings = {};
