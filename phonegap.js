/*
 * Code to auto-select script file in Android/iOS
 * http://www.12robots.com/index.cfm/2011/12/12/Dynamically-loading-the-correct-PhoneGapjs-file-for-Android-or-iPhone
 */
window.cordovaAgent = false;
window.navString = navigator.userAgent.toLowerCase();

if (window.navString.match(/android/)) {
    window.cordovaAgent = "Android";
    // document.write('<script charset="utf-8" src="./js/libs/cordova-2.2.0.js"><\/script>');
}