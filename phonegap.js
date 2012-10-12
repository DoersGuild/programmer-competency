/*
 * Code to auto-select script file in Android/iOS
 * http://www.12robots.com/index.cfm/2011/12/12/Dynamically-loading-the-correct-PhoneGapjs-file-for-Android-or-iPhone
 */

if (navigator.userAgent.toLowerCase().match(/android/)) {
	document.write('<script charset="utf-8" src="./js/libs/cordova-2.0.0-android.js"><\/script>');
} else if (navigator.userAgent.toLowerCase().match(/iphone/) || navigator.userAgent.toLowerCase().match(/ipad/)) {
	document.write('<script charset="utf-8" src="./js/libs/cordova-2.0.0.js"><\/script>');
}
