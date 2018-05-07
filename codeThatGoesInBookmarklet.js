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

var loadDependencies = "http://127.0.0.1:8080/loadDependances.js";

jmLoadScript(loadDependencies, function () {
    "use strict";
    jmLoadScriptsD2lAceEditor()
});
