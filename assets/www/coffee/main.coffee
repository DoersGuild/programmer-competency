###
 Author: Doers' Guild
 http://www.doersguild.com
 [CC-BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
###

## Libraries
preventDefault=(e)->
  # Prevent the default action and the propagation of an event
  methods = ["preventDefault", "stopImmediatePropagation", "stopPropagation", "stop"]
  e[method]?() for method in methods
  e.returnValue = false
  false
  
## Actions
goBack=(e)->
  # Handle the Back-Button
  console.log "Back button fired"
  $modal = $(".modal")
  if $modal.is(":visible")
    # Hide the modal that is currently visible
    $modal.modal("hide")
  else if window.cookieJar("currentPage") isnt "#homePage"
    # Go to the previous page
    displayPage(window.cookieJar("previousPage"))
  else
    # Exit the app
    if confirm("Are you sure you want to exit the app?")
      device.exitApp?()
      navigator.device.exitApp?()
  preventDefault(e)

## Pages
displayPage=(baseID)->
  # Display a page given it's baseID
  console.log "page", baseID
  
  previousPage = window.cookieJar("currentPage")
  window.cookieJar("previousPage", previousPage)
  window.cookieJar("currentPage", baseID)
  
  $(previousPage).hide()
  $(baseID).show()
  true

displayHome=()->
  # Display the home page
  displayPage("#home")
  
displayComputerScience=()->
  # Display Computer-Science questions
  displayPage("#computerScience")
  
init=()->
  # Initialize the app
  displayHome()
  document.addEventListener("backbutton", goBack, false)
  $("#homePage_begin").on("click", displayComputerScience)
  $("input[type='radio']").on "change", ()->
    #Update the level display
    $this = $(this);
    id = $this.attr("id");
    #Get the Level-display's id
    level = id[id.length - 1];
    id = id.substring(0, id.length - 1) + "Display";
    $("#" + id).text("Level " + level);
    true
  true
    
# Setup jQuery defaults
$.support.cors = true
$.ajaxSetup
    cache : true
    type : "post"
    tryCount : 0
    retryLimit : 5
    beforeSend : null
    complete : null
    error : (jqXHR, textStatus, errorThrown)->
        console.log "Ajax error", this, arguments
        console.log "Unable to contact server at " + window.settings.baseURL + "\n With Status: " + textStatus + "\n Error: " + errorThrown
        if textStatus == 'timeout'
            this.tryCount++
            if this.tryCount <= this.retryLimit
                # try again
                console.log "Retrying Ajax"
                $.ajax(this)
            console.log "Still times-out even after " + this.retryLimit + " tries"
            false
          

# Settings
window.settings = {}

window.cookieJar?=$.cookie

setTimeout(init, 0)


