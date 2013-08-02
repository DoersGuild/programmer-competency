// Generated by CoffeeScript 1.6.3
/*
 Author: Sathvik P, Doers' Guild
 http://www.doersguild.com
 [CC-BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
*/

var _this = this,
  __hasProp = {}.hasOwnProperty;

(function($) {
  "use strict";
  var displayHome, displayPage, displayQuestion, displaySummary, getQuestions, goBack, init, loadNextQuestion, loadNextSection, loadPrevQuestion, loadPrevSection, preventDefault, toggleNextAndPrevButtons;
  preventDefault = function(e) {
    var method, methods, _i, _len;
    methods = ["preventDefault", "stopImmediatePropagation", "stopPropagation", "stop"];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      if (typeof e[method] === "function") {
        e[method]();
      }
    }
    e.returnValue = false;
    return false;
  };
  getQuestions = function() {
    return $.get("./js/data/questions.json", {}, function(response) {
      var arr, count_per_section, section, section_name, topic_name, topic_options;
      console.log("Questions: " + JSON.stringify(response));
      window.cookieJar("questions_obj", response);
      arr = [];
      count_per_section = {};
      for (section_name in response) {
        if (!__hasProp.call(response, section_name)) continue;
        section = response[section_name];
        count_per_section[section_name] = 0;
        for (topic_name in section) {
          if (!__hasProp.call(section, topic_name)) continue;
          topic_options = section[topic_name];
          arr.push({
            section: section_name,
            topic: topic_name,
            options: topic_options,
            selected: 0,
            section_index: count_per_section[section_name]
          });
          count_per_section[section_name]++;
        }
      }
      window.cookieJar("questions", arr);
      return window.cookieJar("count_per_section", count_per_section);
    }, "json");
  };
  goBack = function(e) {
    var $modal, _base;
    console.log("Back button fired");
    $modal = $(".modal");
    if ($modal.is(":visible")) {
      $modal.filter(":visible").modal("hide");
    } else if (window.cookieJar("currentPage") !== "#homePage") {
      displayPage("#homePage");
    } else {
      if (confirm("Are you sure you want to exit the app?")) {
        if (typeof device.exitApp === "function") {
          device.exitApp();
        }
        if (typeof (_base = navigator.device).exitApp === "function") {
          _base.exitApp();
        }
      }
    }
    return preventDefault(e);
  };
  displayPage = function(baseID) {
    var previousPage;
    console.log("page", baseID);
    previousPage = window.cookieJar("currentPage");
    if (baseID !== previousPage) {
      window.cookieJar("previousPage", previousPage);
      window.cookieJar("currentPage", baseID);
    }
    $(previousPage).slideUp("normal", function() {
      return $(baseID).slideDown("normal");
    });
    return true;
  };
  displayHome = function() {
    return displayPage("#homePage");
  };
  displaySummary = function() {
    var count, currentSection, index, markup, question, questions, sectionCount, sectionTotal, total, _i, _len, _ref, _ref1;
    questions = window.cookieJar("questions") || [];
    markup = '';
    currentSection = "";
    total = 0;
    count = 0;
    sectionTotal = 0;
    for (index = _i = 0, _len = questions.length; _i < _len; index = ++_i) {
      question = questions[index];
      if (question.section !== currentSection) {
        currentSection = question.section;
        sectionCount = 0;
        sectionTotal = 0;
        markup += '<div class="well well-small">';
        markup += '<h4>' + question.section + '</h4>';
        markup += '<hr/>';
        markup += '<table class="table table-bordered table-striped">';
        markup += '<tr><th>Topic</th><th>Level</th></tr>';
      }
      markup += '<tr><td>' + question.topic + '</td><td>' + question.selected + '</td></tr>';
      sectionTotal += parseInt(question.selected, 10);
      if (((_ref = questions[index + 1]) != null ? _ref.section : void 0) !== currentSection) {
        total += parseInt(sectionTotal, 10);
        sectionCount = parseInt((_ref1 = window.cookieJar("count_per_section")) != null ? _ref1[question.section] : void 0, 10);
        count += sectionCount;
        markup += '<tr><th>Average</th><th>' + (sectionTotal / sectionCount).toFixed(2) + '</th></tr>';
        markup += '</table>';
        markup += '</div>';
      }
    }
    markup = '<h3> Overall Level : ' + (total / count).toFixed(2) + '</h3>' + markup;
    $("#summaryPage_summary").html(markup);
    return displayPage("#summaryPage");
  };
  displayQuestion = function(index) {
    var i, option, question, _ref, _ref1;
    index = parseInt(index, 10) || 0;
    question = ((_ref = window.cookieJar("questions")) != null ? _ref[index] : void 0) || {};
    $("#questionsPage_title").text(question.section);
    $("#questionsPage_subTitle").text(question.topic).data("index", index);
    _ref1 = question.options;
    for (i in _ref1) {
      if (!__hasProp.call(_ref1, i)) continue;
      option = _ref1[i];
      $("#questionsPage_field_text_level" + i).text(option);
    }
    $("#questionsPage_field_level" + question.selected).prop("checked", true).trigger("change");
    return displayPage("#questionsPage");
  };
  toggleNextAndPrevButtons = function() {
    var currentQuestion, questions;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    if (questions[questions.length - 1].section === questions[currentQuestion].section) {
      $("#questionsPage_section_next").hide();
    } else {
      $("#questionsPage_section_next").show();
    }
    if (questions[0].section === questions[currentQuestion].section) {
      $("#questionsPage_section_prev").hide();
    } else {
      $("#questionsPage_section_prev").show();
    }
    if (currentQuestion <= 0) {
      $("#questionsPage_prev").hide();
    } else {
      $("#questionsPage_prev").show();
    }
    if (currentQuestion >= questions.length - 1) {
      return $("#questionsPage_next").hide();
    } else {
      return $("#questionsPage_next").show();
    }
  };
  loadNextSection = function() {
    var currentQuestion, question, questions, _ref;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    question = questions[currentQuestion];
    currentQuestion += ((_ref = window.cookieJar("count_per_section")) != null ? _ref[question.section] : void 0) - question.section_index;
    window.cookieJar("currentQuestion", Math.min(currentQuestion, questions.length - 1));
    toggleNextAndPrevButtons();
    return displayQuestion(currentQuestion);
  };
  loadPrevSection = function() {
    var currentQuestion, questions, _ref;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    currentQuestion -= questions[currentQuestion].section_index + 1;
    currentQuestion -= ((_ref = window.cookieJar("count_per_section")) != null ? _ref[questions[currentQuestion].section] : void 0) - 1;
    window.cookieJar("currentQuestion", Math.max(currentQuestion, 0));
    toggleNextAndPrevButtons();
    return displayQuestion(currentQuestion);
  };
  loadNextQuestion = function() {
    var currentQuestion, questions;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    currentQuestion++;
    window.cookieJar("currentQuestion", Math.min(currentQuestion, questions.length - 1));
    toggleNextAndPrevButtons();
    return displayQuestion(currentQuestion);
  };
  loadPrevQuestion = function() {
    var currentQuestion, questions;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    currentQuestion--;
    window.cookieJar("currentQuestion", Math.max(currentQuestion, 0));
    toggleNextAndPrevButtons();
    return displayQuestion(currentQuestion);
  };
  init = function() {
    var _ref;
    displayHome();
    document.addEventListener("backbutton", goBack, false);
    $('#summaryPage .button-back').on("click", function() {
      return displayPage("#questionsPage");
    });
    $('a[target="_blank"]').on("click", function(e) {
      preventDefault(e);
      window.open($(this).prop("href"), '_blank', 'location=yes');
      return false;
    });
    $("#homePage_begin").on("click", displayQuestion);
    $("#questionsPage_summary").on("click", displaySummary);
    $("#questionsPage").on("swipeleft", loadNextQuestion).on("swiperight", loadPrevQuestion);
    $("#questionsPage_next").on("click", loadNextQuestion);
    $("#questionsPage_prev").on("click", loadPrevQuestion);
    $("#questionsPage_section_next").on("click", loadNextSection);
    $("#questionsPage_section_prev").on("click", loadPrevSection);
    $("input[type='radio']").on("change", function() {
      var $this, currentQuestion, id, index, level, question, questions, _ref, _ref1;
      $this = $(this);
      id = $this.attr("id");
      level = id[id.length - 1];
      $("#questionsPage_field_levelDisplay").text("Level " + level);
      index = $("#questionsPage_subTitle").data("index");
      currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
      questions = window.cookieJar("questions");
      question = questions[currentQuestion];
      $("#questionsPage_field_itemIndex").text((question.section_index + 1) + " of " + ((_ref = window.cookieJar("count_per_section")) != null ? _ref[question.section] : void 0));
      if (questions != null) {
        if ((_ref1 = questions[index]) != null) {
          _ref1.selected = level;
        }
      }
      window.cookieJar("questions", questions);
      return true;
    });
    if (typeof navigator !== "undefined" && navigator !== null) {
      if ((_ref = navigator.splashscreen) != null) {
        if (typeof _ref.hide === "function") {
          _ref.hide();
        }
      }
    }
    return true;
  };
  $.support.cors = true;
  $.ajaxSetup({
    cache: true,
    type: "post",
    tryCount: 0,
    retryLimit: 5,
    beforeSend: null,
    complete: null,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Ajax error", this, arguments);
      console.log("Unable to contact server at " + window.settings.baseURL + "\n With Status: " + textStatus + "\n Error: " + errorThrown);
      if (textStatus === 'timeout') {
        this.tryCount++;
        if (this.tryCount <= this.retryLimit) {
          console.log("Retrying Ajax");
          $.ajax(this);
        }
        console.log("Still times-out even after " + this.retryLimit + " tries");
        return false;
      }
    }
  });
  window.settings = {};
  window.cookieJar = function(key, value) {
    if (value === void 0) {
      return window.storage[key];
    }
    window.storage[key] = value;
    return true;
  };
  window.storage = {};
  getQuestions();
  return $(function() {
    return setTimeout(init, 0);
  });
})(jQuery);
