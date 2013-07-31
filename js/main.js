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
  var displayHome, displayPage, displayQuestion, getQuestions, goBack, init, loadNextQuestion, loadPrevQuestion, preventDefault;
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
      var arr, section, section_name, topic_name, topic_options;
      console.log("Questions: " + JSON.stringify(response));
      window.cookieJar("questions_obj", response);
      arr = [];
      for (section_name in response) {
        if (!__hasProp.call(response, section_name)) continue;
        section = response[section_name];
        for (topic_name in section) {
          if (!__hasProp.call(section, topic_name)) continue;
          topic_options = section[topic_name];
          arr.push({
            section: section_name,
            topic: topic_name,
            options: topic_options,
            selected: 0
          });
        }
      }
      return window.cookieJar("questions", arr);
    }, "json");
  };
  goBack = function(e) {
    var $modal, _base;
    console.log("Back button fired");
    $modal = $(".modal");
    if ($modal.is(":visible")) {
      $modal.filter(":visible").modal("hide");
    } else if (window.cookieJar("currentPage") !== "#homePage") {
      displayPage(window.cookieJar("previousPage"));
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
    window.cookieJar("previousPage", previousPage);
    window.cookieJar("currentPage", baseID);
    $(previousPage).slideUp("normal", function() {
      return $(baseID).slideDown("normal");
    });
    return true;
  };
  displayHome = function() {
    return displayPage("#homePage");
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
  loadNextQuestion = function() {
    var currentQuestion, questions;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    currentQuestion++;
    $("#questionsPage_prev, #questionsPage_next").show();
    if (currentQuestion >= questions.length) {
      $("#questionsPage_next").hide();
    }
    window.cookieJar("currentQuestion", currentQuestion);
    return displayQuestion(currentQuestion);
  };
  loadPrevQuestion = function() {
    var currentQuestion, questions;
    currentQuestion = parseInt(window.cookieJar("currentQuestion"), 10) || 0;
    questions = window.cookieJar("questions") || [];
    currentQuestion--;
    $("#questionsPage_prev, #questionsPage_next").show();
    if (currentQuestion <= 0) {
      $("#questionsPage_prev").hide();
    }
    window.cookieJar("currentQuestion", currentQuestion);
    return displayQuestion(currentQuestion);
  };
  init = function() {
    displayHome();
    document.addEventListener("backbutton", goBack, false);
    $("#homePage_begin").on("click", displayQuestion);
    $("#questionsPage_next").on("click", loadNextQuestion);
    $("#questionsPage_prev").on("click", loadPrevQuestion);
    $("input[type='radio']").on("change", function() {
      var $this, id, index, level, questions, _ref;
      $this = $(this);
      id = $this.attr("id");
      level = id[id.length - 1];
      id = id.substring(0, id.length - 1) + "Display";
      $("#" + id).text("Level " + level);
      index = $("#questionsPage_subTitle").data("index");
      questions = window.cookieJar("questions");
      if (questions != null) {
        if ((_ref = questions[index]) != null) {
          _ref.selected = level;
        }
      }
      window.cookieJar("questions", questions);
      return true;
    });
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
  return setTimeout(init, 0);
})(jQuery);