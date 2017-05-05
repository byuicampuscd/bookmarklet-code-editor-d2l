/*eslint-env browser*/
/*global jmLoadScriptsD2lAceEditor */

function jmLoadScript(scriptURL, callback) {
    "use strict";

    //is the script loaded on the page yet?
    function needToLoadScript(scriptURL) {
        return 0 === document.querySelectorAll('script[src="' + scriptURL + '"]').length
    }

    //do we need to load it?
    if (needToLoadScript(scriptURL)) {
        var newScript = document.createElement("script");
        newScript.addEventListener("load", callback);
        newScript.src = scriptURL;
        document.body.appendChild(newScript);

    } else {
        callback();
    }
}


jmLoadScript("https://content.byui.edu/integ/gen/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/0/loadDependances.js", function () {
    "use strict";
    jmLoadScriptsD2lAceEditor()
});
