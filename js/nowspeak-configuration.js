/* CONFIGURATION: variables for administrators to edit, in order to customize their NowSpeak instance */

/* Endpoint of the firebase repository to use */
var firebaseEndpoint = 'https://resplendent-fire-6048.firebaseio.com/';

/* What language will be used in the interface; imitate i18n.en.js to create your own translation */
var i18n = i18n_en;

/* The language used by the speech recognition. */
var lang = 'en';

/* Keep spacebar pressed while talking? */
/* If you don't host your app in HTTPS, your users might be continuously prompted for
permission to use the microphone when they kit the spacebar, so you should set this at false. */
var keepSpacebarPressed = true;

/* Google Analytics tracking code */
var GAnalyticsCode = 'UA-48756055-1';

/* When to redirect to HTTPS */
var mustRedirectToHttps = function() {
  return window.location.hostname !== 'localhost' && window.location.protocol === 'http:';
}
