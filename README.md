# NowSpeak, a different approach to conference calls

If you're tired of large-group conference calls where everyone speaks at the same time, and an awkward latency makes it hard for users to understand each other, NowSpeak could bring a viable solution to your problem.

[**I've set up an instance of NowSpeak on nowspeak.io, you can try it now.**](http://nowspeak.io)

NowSpeak leverages speech recognition, so that:

 1. people may be speaking simultaneously on their end;
 2. what each person says is recorded and recognized (automatically transcripted into text), and the audio and text are sent as they are;
 3. the messages are read sequentially by receivers;
 4. people may even want to replay a message, save the full transcript of the conversation, ...

*Note that the audio isn't implemented yet, but [feel free to volunteer](#2) to help with it.*

If while using NowSpeak, you start realizing that there are features that would make sense for you, this is definitely valuable information, [please tell it here](https://github.com/rudyrigot/nowspeak/issues/new).

## Technical stack / how it works

NowSpeak uses the Chrome Speech Recognition API, which makes it only executable in Google Chrome or Chromium, whether on desktop or on mobile.

It uses [Firebase](https://www.firebase.com/), which is a tool built for real-time data in the cloud, to ensure that what you see in NowSpeak is always up-to-date, and to ensure a trivial installation.

NowSpeak's code is written in a way that is basic for people to understand, as long as they know JavaScript, and have notions of the MVC design pattern (check out the code!)

### Limits

If you want to use it for a larger scale, you should probably [purchase a Firebase plan](https://www.firebase.com/pricing.html), and deploy your own instance (check out the "Install and deploy your own instance" section)

Also: even though NowSpeak is static (works with front-end-only tech), you will need to host it as HTTPS; this is a Chrome requirement for it to remember you allowed it to use your mic. If you run NowSpeak on HTTP, it will work, but it will bug you about permissions every time you'll try to speak.

## Install and deploy your own instance

### Install

Clone this repository. Everything you might need to change is in `js/nowspeak-configuration.js`, so you might want to take a look first.

Get the various needed vendor librairies by running `bower install` while in the repository (you may need to install [Bower](http://bower.io/) if you haven't yet).

You can execute the project locally as HTTP by executing `./server.sh`.

### Deploy

Since NowSpeak requires HTTPS for Google Chrome not to bug you about permissions each time you want to speak, you can host the project on Google App Engine, in order to benefit from a cheap static hosting with HTTPS.

## Contribute

NowSpeak's code is written in a way that is basic for people to understand, as long as they know JavaScript, and have notions of the MVC design pattern. It is heavily commented, so check out the code.

**Also, you should [subscribe to the mailing-list to know how the app evolves, and/or if you want to help out with it, you're more than welcome!](https://groups.google.com/forum/?hl=en#!forum/nowspeak-dev)**

### What's in the project

 * `index.html` contains the basic layout, but also the reusable templates of each bit of interface (a message, the users list, etc.)
 * `css/` contains all the styling
 * once you executed `bower install`, your `bower_components` folder will contain all of your external libraries (JQuery, Underscore, the Firebase client, etc.)
 * and in `js/`:
   * `nowspeak-configuration.js` is where administrators go to change the basic settings of NowSpeak;
   * `nowspeak-init.js` is where global variables are all initialized;
   * `nowspeak-models.js`, `nowspeak-views.js`, `nowspeak-controllers.js`, which are pretty self-explanatory (and very thoroughly commented);
   * `nowspeak-helpers.js` contains little helper functions that are useful a little bit everywhere in the code;
   * `nowspeak-i18n.en.js` the English labels inside the NowSpeak interface; it's easy to translate NowSpeak in your language!

### The data model

Firebase works with data that are organized in trees; a typical tree for NowSpeak looks like this:

 * `PrivateRooms`
   * `0a35d8b0-9ac6-11e3-971e-0dbc8deba466` : *{ created: 1392966111675, name: "0a35d8b0-9ac6-11e3-971e-0dbc8deba466" }*
     * `Messages`
       * `0dd0bdd0-a4fa-11e3-9bfe-5bb2291d6cf5` : *{ id: "0dd0bdd0-a4fa-11e3-9bfe-5bb2291d6cf5", date: 1394087982359, message: "Hello", user: "d09b0ee0-a501-11e3-a21f-293cc373c2c5", alias: "neo", color: "#488485" }*
       * ...
     * `Users`
       * `d09b0ee0-a501-11e3-a21f-293cc373c2c5` : *{ id: "d09b0ee0-a501-11e3-a21f-293cc373c2c5", alias: "neo", color: "#488485" }*
       * ...
   * ...
 * `Rooms`
   * `general` : *{ created: 1392966111675, name: "general" }*
     * `Messages`
       * `0dd0bdd0-a4fa-11e3-9bfe-5bb2291d6cf5` : *{ id: "0dd0bdd0-a4fa-11e3-9bfe-5bb2291d6cf5", date: 1394087982359, message: "Hello", user: "d09b0ee0-a501-11e3-a21f-293cc373c2c5", alias: "neo", color: "#488485" }*
       * ...
     * `Users`
       * `d09b0ee0-a501-11e3-a21f-293cc373c2c5` : *{ id: "d09b0ee0-a501-11e3-a21f-293cc373c2c5", alias: "neo", color: "#488485" }*
       * ...
   * ...

### Coming features

The main ones that would really make the product cooler, and that are coming shortly:

 * Of course, recording, sending, and playing back the audio, which is one of the main points of the product: recording simultaneously, reading sequentially (#2)
 * A proper graphic design; I can't do it myself, so if you are a designer, I'd love your help; screenshots are in the GitHub issue (#12)
 * A cross-device version, which shouldn't be much work, as the current version was built with future mobile adaptation in mind (#5)
 * Editing recognized text before sending (#11)
 * And [a bunch of other stuff](https://github.com/rudyrigot/nowspeak/issues?state=open)

### How about your needs?

That's the beauty of open-source: [give your ideas here](https://github.com/rudyrigot/nowspeak/issues/new), and either someone will make it happen for you, or you may want to bug your JS developer friends until they do it for you! ;)

### Build your translation for NowSpeak's interface

It's amazingly easy; let's say you want to do an italian translation

 * copy the `nowspeak-i18n.en.js`, into `nowspeak-i18n.it.js`
 * change the first line `var i18n_en = {` into `var i18n_it = {`
 * in `index.html`, add `<script type="text/javascript" src="js/nowspeak-i18n.it.js"></script>` right under `<script type="text/javascript" src="js/nowspeak-i18n.en.js"></script>`

Feel free to commit the changes you just made, so that others benefit from your translation as well. To switch your app into Italian language, you just have to change `var i18n = i18n_en;` into `var i18n = i18n_it;`  in `js/nowspeak-configuration.js`.