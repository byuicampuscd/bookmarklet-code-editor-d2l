/*jslint plusplus: true, browser: true, devel: true */
/*global ace, $, html_beautify, MouseEvent*/
function jmD2LAceEditor() {
    "use strict";
    //stop double clicks 
    if (window.jmLoadCodeEditor) {
        return;
    }
    var title = document.title;
    var url = window.location.href;
    if (title.includes("Edit HTML File")) {
        var divId = '.d2l-dialog',
            innerDiv = '.d2l-dialog-inner',
            location = "content";
        window.jmLoadCodeEditor = true;
    } else if (title.includes("Manage Files")) {
        if (!$('.ddial_o')) {
            return;
        }
        var divId = '.d2l-dialog',
            innerDiv = '.d2l-dialog-inner',
            location = "manage";
        window.jmLoadCodeEditor = true;
    } else if (url.includes("instructure")) {
        var location = "canvas",
            innerDiv = '.ic-app-main-content',
            divId = '#wrapper';
    } else
        return;
    var e,
        dialogOpen,
        waitForDialog,
        options,
        localstorgeKey = "jmBookmarkletCodeEditor",
        editorDivHTML = '',
        editorDivStyle = '',
        editorDivBackground = '',
        editorDivBackgroundStyle = '',
        footerHTML = '',
        editorDivId = 'editorDiv',
        editorDivBackgroundId = 'editorBackground',
        textArea = '';

    //the function below was modified from duncansmart found at https://gist.github.com/duncansmart/5267653
    function makeEditor() {
        
        //make container
        // Hook up ACE editor to the textarea
        //var containerDiv = $(editorDivHTML).insertBefore(divId),
        if (location !== 'console') {
            var containerDiv = $(editorDivHTML).insertBefore(divId)
        } else {
            var containerDiv = $(editorDivHTML).insertBefore(innerDiv)
            var temp = $(editorDivBackground).insertBefore("#" + editorDivId);
            //var containerDiv = $("<span>Hello world!</span>").insertBefore(divId)
        }
        var startingOptions = {
            "animatedScroll": false,
            "behavioursEnabled": true,
            "displayIndentGuides": true,
            "dragDelay": 0,
            "fadeFoldWidgets": false,
            "fontSize": 12,
            "highlightActiveLine": true,
            "highlightGutterLine": true,
            "highlightSelectedWord": true,
            "hScrollBarAlwaysVisible": false,
            "keyboardHandler": null,
            "mode": "ace/mode/html",
            "newLineMode": "auto",
            "overwrite": false,
            "printMarginColumn": 80,
            "readOnly": false,
            "scrollSpeed": 2,
            "showFoldWidgets": true,
            "showGutter": true,
            "showInvisibles": false,
            "showPrintMargin": false,
            "tabSize": 4,
            "theme": "ace/theme/iplastic",
            "useSoftTabs": true,
            "useWorker": true,
            "wrap": "off",
            "vScrollBarAlwaysVisible": false,
            "wrapBehavioursEnabled": true
        };

        function makePretty(html) {
            return html_beautify(html, {
                "wrap_line_length": 0,
                unformatted: ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'cite', 'data', 'datalist', 'del', 'dfn', 'em', 'i', 'input', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'small', 'strike', 'tt', 'pre'],
                extra_liners: []
            });
        }

        //add footer
        $(footerHTML).appendTo("#" + editorDivId);
        if (location !== 'canvas') {
            textArea = $(innerDiv + ' iframe').contents().find('textarea');
        } else {
            textArea = $(innerDiv).contents().find('textarea').not('#default_grading_standard_data');
            var quizDescription = $(innerDiv).contents().find('#quiz_description');
            if(quizDescription && quizDescription.length > 0){
                textArea = quizDescription;
            }
        }
        textArea.each(function () {
            var textarea = $(this),
                editor,
                editDiv;

            //make the div for the editor add it to the container;
            editDiv = $('<div>', {
                width: "100%",
                height: "calc(100% - 40px)"
            }).prependTo(containerDiv);

            //make editor in the correct div
            editor = ace.edit(editDiv[0]);
            //set options
            options = JSON.parse(localStorage.getItem(localstorgeKey)) || startingOptions;
            editor.setOptions(options);

            //put the text in
            editor.getSession().setValue(makePretty(textarea.val()));

            //when you click the beautifyHTML button, clean the code
            $('#' + editorDivId + ' button.beautify').click(function () {
                editor.getSession().setValue(makePretty(editor.getSession().getValue()));
            });

            //when you click the close button put the updated code back
            $('#' + editorDivId + ' button.closeButton').click(function () {
                //save the settings
                localStorage.setItem(localstorgeKey, JSON.stringify(editor.getOptions()));
                //put the text back
                textarea.val(editor.getSession().getValue());
                //remove the editor
                editor.destroy();
                editor.container.remove();
                //remove my container
                $('#' + editorDivId).remove();
                //we have closed the editor now
                window.jmLoadCodeEditor = false;
            });

            //when you click the settings button open the settings pannel
            $('#' + editorDivId + ' button.settings').click(function () {
                editor.execCommand("showSettingsMenu");
            });

            //when you click the reset settings button it sets it back to default
            $('#' + editorDivId + ' button.resetSettings').click(function () {
                editor.setOptions(startingOptions);
            });

            //set up the wrap no wrap check box
            $('#' + editorDivId + ' input').click(function () {
                editor.getSession().setUseWrapMode(this.checked);
            });
        });
        console.log()
    }

    editorDivStyle += "background-color: white; ";
    editorDivStyle += "border:3px solid black; ";
    editorDivStyle += "padding: 5px; ";
    editorDivStyle += "height: 95vh; ";
    editorDivStyle += "width: 95vw; ";
    editorDivStyle += "position: absolute; ";
    editorDivStyle += "top: 2.5vh; ";
    editorDivStyle += "left: 2.5vw; ";
    editorDivStyle += "z-index: 2000; ";
    if (location === 'canvas') {
        editorDivStyle += "1.5px solid #999;"
    }

    editorDivHTML += '<div id="' + editorDivId + '" style="' + editorDivStyle + '">';
    editorDivHTML += '<style>\n';
    editorDivHTML += '#editorFooter{margin-top:5px}\n';
    editorDivHTML += '#editorFooter>* {margin-right:20px}\n';
    editorDivHTML += '</style></div>';

    editorDivBackgroundStyle += "background-color: #333300; ";
    editorDivBackgroundStyle += "opactity: 0.5; ";
    editorDivBackgroundStyle += "z-index: 1999; ";

    editorDivBackground += '<div id="' + editorDivBackgroundId + '" style="' + editorDivBackgroundStyle + '">'
    editorDivBackground += '</div>';

    footerHTML += '<div id="editorFooter">';
    footerHTML += '<button class="closeButton" style="font-size:20px; ">close</button>';
    footerHTML += '<label>Wrap Text<input type="checkbox" /></label>';
    footerHTML += '<a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" style="color:blue;" target="_blank" >Keyboard Shortcuts</a>';
    footerHTML += '<a href="https://content.byui.edu/items/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/1/" style="color:blue;" target="_blank">Equella Location</a>';
    footerHTML += '<button class="beautify" style="font-size:15px;" >Beautify HTML</button>';
    footerHTML += '<button class="resetSettings" style="font-size:15px;" >Reset Settings</button>';
    footerHTML += '<button class="settings" style="font-size:15px;" >Open Settings Panel</button>';
    footerHTML += '</div>';

    // find if they clicked the code edit button 
    if (location != "canvas") {
        dialogOpen = $(innerDiv + ' iframe').length > 0;
    } else if (location === "canvas") {
        dialogOpen = Array.from(document.querySelectorAll('a')).filter((item)=>item.innerText.trim() === "HTML Editor")[0];
        if (dialogOpen && dialogOpen.style.display !== "none") {
            dialogOpen = false;
        }
    }

    if (!dialogOpen) {
        e = new MouseEvent('click', {
            'view': window,
            'bubbles': false,
            'cancelable': true
        });
        //click the button for you
        var temp;
        if (location === "manage") {
            // checks each iframe in the page for the target and then stores the result in temp
            [].forEach.call(document.querySelectorAll('iframe'),
                function (elem) {
                    temp = elem.contentWindow.document.body.querySelector('.d2l-htmleditor-button[title="HTML Source Editor"]');
                });
        } else if (location === "content") {
            temp = document.querySelector('.d2l-htmleditor-button[title="HTML Source Editor"]')
        } else if (location === "canvas") {
            //there are two but we will always click the first one
            Array.from(document.querySelectorAll('a')).filter((item)=>item.innerText.trim() === "HTML Editor")[0].click();
        }
        // perform the click
        if (location != "canvas")
            temp.dispatchEvent(e);
        waitForDialog = setInterval(function () {

            var hasDialog = $(divId).length > 0,
                doneLoading = $('.d2l-dialog-loading').length < 1;

            if ((hasDialog && doneLoading) || location === "canvas") {
                clearInterval(waitForDialog);
                makeEditor();
            }
        }, 100);

    } else {
        makeEditor();
    }
}