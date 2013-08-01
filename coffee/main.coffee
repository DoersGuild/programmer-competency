
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
          count_per_section = {}
          for own section_name, section of response
            count_per_section[section_name]=0
            for own topic_name, topic_options of section
              arr.push
                section: section_name
                topic: topic_name
                options: topic_options
                selected: 0
                section_index: count_per_section[section_name]
              count_per_section[section_name]++
          window.cookieJar("questions", arr)
          window.cookieJar("count_per_section", count_per_section)
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

  displaySummary=()->
    # Display the home page
    questions = window.cookieJar("questions") || []
    markup = ''
    currentSection = ""
    total = 0
    count = 0
    sectionTotal = 0
    for question, index in questions
      if question.section != currentSection
        # Section change
        currentSection = question.section
        total += parseInt(sectionTotal, 10)
        sectionCount = parseInt(window.cookieJar("count_per_section")?[question.section], 10)
        count += sectionCount
        console.log currentSection, "Counts", sectionTotal, sectionCount, total, count
        if markup != ''
          # Add closing tags iff not first
          markup += '<tr><th>Average</th><th>'+(sectionTotal/sectionCount).toFixed(2)+'</th></tr>'
          markup += '</table>'
          markup += '</div>'
        sectionCount = 0
        sectionTotal = 0
        markup += '<div class="well well-small">'
        markup += '<h4>' + question.section + '</h4>'
        markup += '<hr/>'
        markup += '<table class="table table-bordered table-striped">'
        markup += '<tr><th>Topic</th><th>Level</th></tr>'
      # Add this topic row
      markup += '<tr><td>'+question.topic+'</td><td>'+question.selected+'</td></tr>'
      sectionTotal += parseInt(question.selected, 10)
      if index == questions.length-1
        # Last item
        total += parseInt(sectionTotal, 10)
        sectionCount = parseInt(window.cookieJar("count_per_section")?[question.section], 10)
        count += sectionCount
        markup += '<tr><th>Average</th><th>'+(sectionTotal/sectionCount).toFixed(2)+'</th></tr>'
        markup += '</table>'
        markup += '</div>'
    markup = '<h3> Overall Level : ' + (total/count).toFixed(2) + '</h3>' + markup
    $("#summaryPage_summary").html(markup)
    displayPage("#summaryPage")

  displayQuestion=(index)->
    # Display the question from the given index
    index = parseInt(index, 10) || 0
    question = window.cookieJar("questions")?[index] || {}
    $("#questionsPage_title").text(question.section)
    $("#questionsPage_subTitle").text(question.topic).data("index", index)
    $("#questionsPage_field_text_level" + i).text(option) for own i, option of question.options
    $("#questionsPage_field_level"+question.selected).prop("checked", true).trigger("change")
    displayPage("#questionsPage")

  toggleNextAndPrevButtons=()->
    # Show/Hide Next and prev section buttons
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []

    if questions[questions.length - 1].section == questions[currentQuestion].section then $("#questionsPage_section_next").hide() else $("#questionsPage_section_next").show()
    if questions[0].section == questions[currentQuestion].section then $("#questionsPage_section_prev").hide() else $("#questionsPage_section_prev").show()

    # Show/Hide Next and prev question buttons
    if currentQuestion<=0 then $("#questionsPage_prev").hide() else $("#questionsPage_prev").show()
    if currentQuestion>=questions.length-1 then $("#questionsPage_next").hide() else $("#questionsPage_next").show()

  loadNextSection=()->
    # Load the first item in the next section
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    question = questions[currentQuestion]
    currentQuestion+=(window.cookieJar("count_per_section")?[question.section] - question.section_index)
    window.cookieJar("currentQuestion", Math.min(currentQuestion, questions.length-1))
    toggleNextAndPrevButtons()
    displayQuestion(currentQuestion)

  loadPrevSection=()->
    # Load the first item in the previous section
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    currentQuestion -= questions[currentQuestion].section_index + 1
    currentQuestion -= window.cookieJar("count_per_section")?[questions[currentQuestion].section] - 1
    window.cookieJar("currentQuestion", Math.max(currentQuestion, 0))
    toggleNextAndPrevButtons()
    displayQuestion(currentQuestion)

  loadNextQuestion=()->
    # load & display the next question
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    currentQuestion++
    # currentQuestion = if currentQuestion>=questions.length then 0 else currentQuestion
    window.cookieJar("currentQuestion", Math.min(currentQuestion, questions.length-1))
    toggleNextAndPrevButtons()
    displayQuestion(currentQuestion)

  loadPrevQuestion=()->
    # load & display the next question
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
    questions = window.cookieJar("questions") || []
    currentQuestion--
    # currentQuestion = if currentQuestion<0 then questions.length else currentQuestion
    window.cookieJar("currentQuestion", Math.max(currentQuestion, 0))
    toggleNextAndPrevButtons()
    displayQuestion(currentQuestion)


  init=()->
    # Initialize the app
    displayHome()
    document.addEventListener("backbutton", goBack, false)
    $('.button-back').on("click", goBack)
    $('a[target="_blank"]').on("click", (e)->
      preventDefault(e)
      window.open($(this).prop("href"), '_blank', 'location=yes')
      false
    )
    $("#homePage_begin").on("click", displayQuestion)
    $("#questionsPage_summary").on("click", displaySummary)
    $("#questionsPage").on("swipeleft", loadNextQuestion).on("swiperight", loadPrevQuestion)
    $("#questionsPage_next").on("click", loadNextQuestion)
    $("#questionsPage_prev").on("click", loadPrevQuestion)
    $("#questionsPage_section_next").on("click", loadNextSection)
    $("#questionsPage_section_prev").on("click", loadPrevSection)
    $("input[type='radio']").on "change", ()->
      #Update the level display
      $this = $(this);
      id = $this.attr("id");

      #Get the Level-display's id
      level = id[id.length - 1];
      $("#questionsPage_field_levelDisplay").text("Level " + level);
      index = $("#questionsPage_subTitle").data("index")

      # Show section item index
      currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0
      questions = window.cookieJar("questions")
      question = questions[currentQuestion]
      $("#questionsPage_field_itemIndex").text((question.section_index + 1) + " of " + window.cookieJar("count_per_section")?[question.section])

      # Update level in DB
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

  $ ()->setTimeout(init, 0)

