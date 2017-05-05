/*jslint  browser: true, devel: true */
/*global jmD2LAceEditor*/

function jaLoadBookmarkletScripts(scripts, callbackDone) {
    "use strict";

    function loadScript(url, callback) {
        i++;

        function scriptIsNotLoaded(url) {
            return document.querySelectorAll('script[src="' + url + '"]').length === 0;
        }

        // don't load a script twice
        if (scriptIsNotLoaded(url)) {
            console.log("url:", url);
            var script = document.createElement("script");
            script.addEventListener("load", callback, false);
            script.src = url;
            document.body.appendChild(script);
        } else {
            callback();
        }

    }

    function loadNext(number) {
        var url;

        function makeCallback(numIn) {
            return function () {
                loadNext(numIn);
            };
        }

        //are we at the end?
        if (number < scripts.length) {
            url = scripts[number];
            number += 1;

            loadScript(url, makeCallback(number));
        } else {
            callbackDone();
        }
    }

    loadNext(0);
}

function jmLoadScriptsD2lAceEditor() {
    "use strict";
    var scripts = [
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.4/beautify.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.4/beautify-css.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.6.4/beautify-html.min.js",
        "https://content.byui.edu/integ/gen/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/0/main.js"
    ];

    jaLoadBookmarkletScripts(scripts, function () {
        jmD2LAceEditor();
    });

}
