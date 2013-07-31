
###
 Author: Sathvik P, Doers' Guild
 http://www.doersguild.com
 [CC-BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
###

do ($ = jQuery)=>
  "use strict"

  ## Libraries
  preventDefault=(e)->
    # Prevent the default action and the propagation of an event
    methods = ["preventDefault", "stopImmediatePropagation", "stopPropagation", "stop"]
    e[method]?() for method in methods
    e.returnValue = false
    false

  ## Web-Services
  getQuestions=()->
    # Get the questions data
    $.get("./js/data/questions.json", {}, (response) ->
          # Update the locally stored questions
          console.log("Questions: " + JSON.stringify(response))
          window.cookieJar("questions_obj", response)
          # Put it in an array for easier traversal
          arr = []
          for own section_name, section of response
            for own topic_name, topic_options of section
              arr.push
                section: section_name
                topic: topic_name
                options: topic_options
                selected: 0
          window.cookieJar("questions", arr)
    , "json")


  ## Actions
  goBack=(e)->
    # Handle the Back-Button
    console.log "Back button fired"
    $modal = $(".modal")
    if $modal.is(":visible")
      # Hide the modal that is currently visible
      $modal.filter(":visible").modal("hide")
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

    $(previousPage).slideUp("normal", ()->$(baseID).slideDown("normal"))
    true

  displayHome=()->
    # Display the home page
    displayPage("#homePage")

  displayQuestion=(index)->
    # Display the question from the given index
    index = parseInt(index, 10) || 0
    question = window.cookieJar("questions")?[index] || {}
    $("#questionsPage_title").text(question.section)
    $("#questionsPage_subTitle").text(question.topic).data("index", index)
    $("#questionsPage_field_text_level" + i).text(option) for own i, option of question.options
    $("#questionsPage_field_level"+question.selected).prop("checked", true).trigger("change")
    displayPage("#questionsPage")

  loadNextQuestion=()->
    # load & display the next question
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    currentQuestion++
    $("#questionsPage_prev, #questionsPage_next").show()
    $("#questionsPage_next").hide() if currentQuestion>=questions.length
    # currentQuestion = if currentQuestion>=questions.length then 0 else currentQuestion
    window.cookieJar("currentQuestion", currentQuestion)
    displayQuestion(currentQuestion)

  loadPrevQuestion=()->
    # load & display the next question
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    currentQuestion--
    $("#questionsPage_prev, #questionsPage_next").show()
    $("#questionsPage_prev").hide() if currentQuestion<=0
    # currentQuestion = if currentQuestion<0 then questions.length else currentQuestion
    window.cookieJar("currentQuestion", currentQuestion)
    displayQuestion(currentQuestion)


  init=()->
    # Initialize the app
    displayHome()
    document.addEventListener("backbutton", goBack, false)
    $("#homePage_begin").on("click", displayQuestion)
    $("#questionsPage_next").on("click", loadNextQuestion)
    $("#questionsPage_prev").on("click", loadPrevQuestion)
    $("input[type='radio']").on "change", ()->
      #Update the level display
      $this = $(this);
      id = $this.attr("id");
      #Get the Level-display's id
      level = id[id.length - 1];
      id = id.substring(0, id.length - 1) + "Display";
      $("#" + id).text("Level " + level);
      index = $("#questionsPage_subTitle").data("index")
      questions = window.cookieJar("questions")
      questions?[index]?.selected = level
      window.cookieJar("questions", questions)
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

  window.cookieJar=(key, value)->
    return window.storage[key] if value==undefined
    window.storage[key] = value
    return true

  # Storage
  window.storage = {}


  getQuestions()

  setTimeout(init, 0)

