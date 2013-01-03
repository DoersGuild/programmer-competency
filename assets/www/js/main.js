// Generated by CoffeeScript 1.4.0
/*
 Author: Doers' Guild
 http://www.doersguild.com
 [CC-BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
*/

var displayComputerScience, displayHome, displayPage, goBack, init, preventDefault, _ref;

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
  $(previousPage).hide();
  $(baseID).show();
  return true;
};

displayHome = function() {
  return displayPage("#homePage");
};

displayComputerScience = function() {
  return displayPage("#computerScience");
};

init = function() {
  displayHome();
  document.addEventListener("backbutton", goBack, false);
  $("#homePage_begin").on("click", displayComputerScience);
  $("input[type='radio']").on("change", function() {
    var $this, id, level;
    $this = $(this);
    id = $this.attr("id");
    level = id[id.length - 1];
    id = id.substring(0, id.length - 1) + "Display";
    $("#" + id).text("Level " + level);
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

if ((_ref = window.cookieJar) == null) {
  window.cookieJar = $.cookie;
}

setTimeout(init, 0);