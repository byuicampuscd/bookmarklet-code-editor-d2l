/*jslint plusplus: true, browser: true, devel: true */
/*global ace, $, html_beautify, MouseEvent*/
function jmD2LAceEditor() {
    "use strict";
    //stop double clicks 
    if (window.jmLoadCodeEditor) {
        return;
    }
    window.jmLoadCodeEditor = true;

    var e,
        dialogOpen,
        waitForDialog,
        options,
        localstorgeKey = "jmBookmarkletCodeEditor",
        editorDivHTML = '',
        editorDivStyle = '',
        footerHTML = '',
        editorDivId = 'editorDiv';

    //the function below was modified from duncansmart found at https://gist.github.com/duncansmart/5267653
    function makeEditor() {

        //make container
        // Hook up ACE editor to the textarea
        var containerDiv = $(editorDivHTML).insertBefore('.d2l-dialog'),
            startingOptions = {
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

        $('.d2l-dialog-inner iframe').contents().find('textarea').each(function () {
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

            //when you click the close button put the updated code back
            $('#' + editorDivId + ' button.beautify').click(function () {
                editor.getSession().setValue(makePretty(editor.getSession().getValue()));
            });

            //when you click the close button put the updated code back
            $('#' + editorDivId + ' button.close').click(function () {
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
    }

    editorDivStyle += "background-color: white; ";
    editorDivStyle += "height: 95vh; ";
    editorDivStyle += "width: 95vw; ";
    editorDivStyle += "position: absolute; ";
    editorDivStyle += "top: 2.5vh; ";
    editorDivStyle += "left: 2.5vw; ";
    editorDivStyle += "z-index: 2000; ";

    editorDivHTML += '<div id="' + editorDivId + '" style="' + editorDivStyle + '">';
    editorDivHTML += '<style>\n';
    editorDivHTML += '#editorFooter{margin-top:5px}\n';
    editorDivHTML += '#editorFooter>* {margin-right:20px}\n';
    editorDivHTML += '</style></div>';

    footerHTML += '<div id="editorFooter">';
    footerHTML += '<button class="close" style="font-size:20px; ">close</button>';
    footerHTML += '<label>Wrap Text<input type="checkbox" /></label>';
    footerHTML += '<a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" style="color:blue;" target="_blank" >Keyboard Shortcuts</a>';
    footerHTML += '<a href="https://content.byui.edu/items/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/1/" style="color:blue;" target="_blank">Equella Location</a>';
    footerHTML += '<button class="beautify" style="font-size:15px;" >Beautify HTML</button>';
    footerHTML += '<button class="resetSettings" style="font-size:15px;" >Reset Settings</button>';
    footerHTML += '<button class="settings" style="font-size:15px;" >Open Settings Panel</button>';
    footerHTML += '</div>';

    // find if they clicked the code edit button 
    dialogOpen = $('.d2l-dialog-inner iframe').length > 0;

    if (!dialogOpen) {
        e = new MouseEvent('click', {
            'view': window,
            'bubbles': false,
            'cancelable': true
        });

        //click the button for you
        document.querySelector('.d2l-htmleditor-button[title="HTML Source Editor"]').dispatchEvent(e);

        waitForDialog = setInterval(function () {

            var hasDialog = $('.d2l-dialog').length > 0,
                doneLoading = $('.d2l-dialog-loading').length < 1;

            if (hasDialog && doneLoading) {
                clearInterval(waitForDialog);
                makeEditor();
            }

        }, 100);

    } else {
        makeEditor();
    }

}
