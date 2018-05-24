// Is the editor open? Starts false, changes to true when open
var openEditor = false;

function loadEditor() {
    'use strict';

    // Get the title of the current webpage.
    var title = document.title;
    // Get the url of the current webpage.
    var url = window.location.href;

    switch (getLocation()) {
    case 'd2l':
        // Calls d2l functions
        d2lDriver();
        break;
    case 'canvas':
        // Call canvas functions
        canvasDriver();
        break;
    }

    function getLocation() {
        if (url.includes('d2l')) {
            return 'd2l';
        }
        if (url.includes('instructure')) {
            return 'canvas';
        }
    }

    /*******************************************************************************************************************************/

    // D2L Functions

    function d2lDriver() {
        // If the editor is already open, don't do anything
        if (!openEditor) {
            d2lClickButton()
                .then(d2lGetHTML)
                .then(runEditor)
                .catch(err => {
                    console.log(err);
                    if (confirm('The editor has encountered an error or the current page is not an edit page. Would you like to submit a ticket? (This will take you to another page)')) {
                        window.location = 'https://docs.google.com/forms/d/e/1FAIpQLSfJQX_njx43MMLkatwn-MvPUmJfB6IHnzIyVwdkK1GaqtQ7Lw/viewform?usp=sf_link';
                    }
                    return;
                });
        } else {
            console.log('The editor is already open!');
            return;
        }

    }

    function d2lClickButton() {
        return new Promise((resolve, reject) => {
            // Find out if the user is inside of manage files or content
            if (!title.includes('Manage Files')) {
                try {
                    // User is inside of content
                    // Check if the button has already been clicked
                    if (!document.getElementsByClassName('d2l-dialog').length > 0) {
                        // Click the button
                        resolve(document.querySelector('.d2l-htmleditor-button[title="HTML Source Editor"]').dispatchEvent(new MouseEvent('click', {
                            'view': window,
                            'bubbles': false,
                            'cancelable': true
                        })));

                    } else {
                        // The button has already been clicked
                        resolve();
                    }
                } catch (err) {
                    reject('The editor has stopped working. Would you like to submit a ticket?');
                }

            } else if (title.includes('Manage Files')) {
                // User is inside of Manage Files
                // Check if an edit file window is active
                if (document.getElementsByClassName('ddial_o2').length > 0) {
                    if (!document.getElementsByClassName('d2l-dialog').length > 0) {
                        // Find the iframe contating the text editor.
                        [].forEach.call(document.querySelectorAll('iframe'), iframe => {
                            // Click the button
                            resolve(iframe.contentWindow.document.body.querySelector('.d2l-htmleditor-button[title="HTML Source Editor"]').dispatchEvent(new MouseEvent('click', {
                                'view': window,
                                'bubbles': false,
                                'cancelable': true
                            })));
                        });
                    } else {
                        // The button has already been clicked
                        resolve();
                    }
                } else {
                    reject('There isn\'t an Edit File window active!');
                }
            }
        });
    }

    function d2lGetHTML() {
        return new Promise((resolve, reject) => {
            var htmlString,
                whereToInjectCode,
                placeToPutBack;
            // Find out if the user is inside of manage files or content
            if (!title.includes('Manage Files')) {
                // User is inside of content
                // If the iFrame has finished loading, get the text and the textarea's DOM object.
                if (document.querySelectorAll('.d2l-dialog-inner iframe')[0] &&
                    document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0]) {
                    htmlString = document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0].value;
                    whereToInjectCode = 'body';
                    placeToPutBack = document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0];
                    resolve({
                        htmlString,
                        whereToInjectCode,
                        placeToPutBack
                    });
                } else {
                    // The iFrame still hasn't loaded, call d2lGetHTML until it has loaded every 100 milliseconds.
                    setTimeout(() => {
                        d2lGetHTML().then(resolve);
                    }, 100);
                }
            } else if (title.includes('Manage Files')) {
                // User is inside of Manage Files
                // Find the iframe containing the text editor
                [].forEach.call(document.querySelectorAll('iframe'), () => {
                    // If the iFrame has finished loading, get the text and the textarea's DOM object.
                    if (document.querySelectorAll('.d2l-dialog-inner iframe')[0] &&
                        document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0]) {
                        htmlString = document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0].value;
                        whereToInjectCode = 'body';
                        placeToPutBack = document.querySelectorAll('.d2l-dialog-inner iframe')[0].contentDocument.querySelectorAll('textarea')[0];
                        resolve({
                            htmlString,
                            whereToInjectCode,
                            placeToPutBack
                        });
                    } else {
                        // The iFrame still hasn't loaded, call d2lGetHTML until it has loaded every 100 milliseconds.
                        setTimeout(() => {
                            d2lGetHTML().then(resolve);
                        }, 100);
                    }
                });
            }
        });
    }

    // End D2L Functions

    /*******************************************************************************************************************************/

    // Canvas Functions

    // Calls all the necessary Canvas Functions
    function canvasDriver() {
        // If the editor is already open, don't do anything
        if (!openEditor) {
            canvasClickButton()
                .then(canvasGetHTML)
                .then(runEditor)
                .catch(err => {
                    console.log(err);
                    if (confirm('The editor has encountered an error or the current page is not an edit page. Would you like to submit a ticket? (This will take you to another page)')) {
                        window.location = 'https://docs.google.com/forms/d/e/1FAIpQLSfJQX_njx43MMLkatwn-MvPUmJfB6IHnzIyVwdkK1GaqtQ7Lw/viewform?usp=sf_link';
                    }
                    return;
                });
        } else {
            console.log('The editor is already open!');
            return;
        }
    }

    function canvasClickButton() {
        return new Promise((resolve, reject) => {
            var button;
            // Check if the user is editing a quiz
            if (!url.includes('quizzes')) {
                // Check if the user has already clicked the HTML Editor button
                // Get the Button to click 
                button = Array.from(document.querySelectorAll('a')).filter((item) => item.innerText.trim() === 'HTML Editor')[0];
                if (button.style.display !== 'none') {
                    // Click the button 
                    button.click();
                    resolve();
                } else {
                    // HTML Editor button already clicked
                    resolve();
                }
            } else {
                // The user is editing Quizzes

                // Find out if the user is editing the quiz description or quiz questions
                if (document.getElementsByClassName('ui-tabs-active ui-state-active')[0].getAttribute('aria-controls') === 'options_tab') {
                    // User is editing the Quiz Description
                    // Get the Button to click 
                    button = Array.from(document.querySelectorAll('a')).filter((item) => item.innerText.trim() === 'HTML Editor')[0];
                    // Check if the user has already clicked the HTML Editor button
                    if (button.style.display !== 'none') {
                        // Click the button 
                        button.click();
                        resolve();
                    } else {
                        // HTML Editor button already clicked
                        resolve();
                    }
                } else if (document.getElementsByClassName('ui-tabs-active ui-state-active')[0].getAttribute('aria-controls') === 'questions_tab') {
                    // User is editing Quiz Questions

                    // Check if the user has a question in focus
                    if (document.activeElement.tagName === 'IFRAME' || document.activeElement.tagName === 'TEXTAREA') {
                        // The following line of code needs to be improved. It can easily break.
                        var parent = document.activeElement.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('toggle_question_content_views_link');
                        // check if the user has already clicked the HTML editor button
                        if (parent[1].style.display !== 'inline') {
                            parent[1].click();
                            // Now set the html editor's display to 'none', and the rich text editor button to 'block'
                            parent[0].style.display = 'none';
                            parent[1].style.display = 'inline';
                            resolve();
                        } else {
                            // HTML Editor button already clicked
                            resolve();
                        }
                    } else {
                        // Just grab the first question's html
                        // Get the button to click
                        button = Array.from(document.querySelectorAll('a')).filter((item) => item.innerText.trim() === 'HTML Editor')[0];
                        // Check if the user has already clicked the HTML Editor button
                        if (button.style.display !== 'none') {
                            // Click the button 
                            button.click();
                            resolve();
                        } else {
                            // HTML Editor button already clicked
                            resolve();
                        }
                    }
                }
            }
        });
    }

    function canvasGetHTML() {
        return new Promise((resolve, reject) => {
            var htmlString,
                whereToInjectCode,
                placeToPutBack;
            // Check if the user is editing a quiz
            if (!url.includes('quizzes')) {
                htmlString = document.querySelectorAll('textarea[id][class]')[0].value;
                whereToInjectCode = 'body';
                placeToPutBack = document.querySelectorAll('textarea[id][class]')[0];
            } else {
                // The user is editing a Quiz
                // check if the user is editing a quiz description or question
                if (document.getElementsByClassName('ui-tabs-active ui-state-active')[0].getAttribute('aria-controls') === 'options_tab') {
                    // User is editing the Quiz Description
                    htmlString = document.getElementById('quiz_description').value;
                    whereToInjectCode = 'body';
                    placeToPutBack = document.getElementById('quiz_description');
                } else if (document.getElementsByClassName('ui-tabs-active ui-state-active')[0].getAttribute('aria-controls') === 'questions_tab') {
                    // User is editing Quiz Questions

                    // Check if the user has a question in focus
                    if (document.activeElement.tagName === 'TEXTAREA') {
                        // Get its HTML
                        var currentElement = document.activeElement;
                        htmlString = currentElement.value;
                        whereToInjectCode = 'body';
                        placeToPutBack = currentElement;
                    } else {
                        // Just get the first open question's HTML, then resolve
                        var textAreas = Array.from(document.querySelectorAll('textarea'));
                        var questions = textAreas.filter(textArea => {
                            return textArea.id.includes('question_content_');
                        });
                        htmlString = questions[0].value;
                        whereToInjectCode = 'body';
                        placeToPutBack = questions[0];
                    }
                }
            }
            resolve({
                htmlString,
                whereToInjectCode,
                placeToPutBack
            });
        });
    }
    // End Canvas Functions
}

/*****************************************************************************************************************************************/

// Creates, maintains, and handles the editor
function runEditor({
    htmlString,
    whereToInjectCode,
    placeToPutBack
}) {
    // Create the variables needed to create the editor
    var wrapperDiv,
        editorDiv,
        footerDiv,
        localstorageKey = 'jmBookmarkletCodeEditor',
        editor,
        options,
        footerHTML = '';

    // Create the HTML for the the footer    
    footerHTML += '<button class="closeButtonEditor" style="font-size:20px;margin-right:15px;">close</button>';
    footerHTML += '<label style="margin-right:15px;font-size: 20px;">Wrap Text<input type="checkbox" class="wrapTextEditor" /></label>';
    footerHTML += '<a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" style="color:blue;margin-right: 15px;font-size: 20px;" target="_blank" >Keyboard Shortcuts</a>';
    footerHTML += '<a href="https://content.byui.edu/items/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/1/" style="color:blue;margin-right:15px;font-size: 20px;" target="_blank">Equella Location</a>';
    footerHTML += '<button class="beautifyEditor" style="font-size:15px;margin-right:15px;" >Beautify HTML</button>';
    footerHTML += '<button class="resetSettingsEditor" style="font-size:15px;margin-right:15px;" >Reset Settings</button>';
    footerHTML += '<button class="editorSettings" style="font-size:15px;" >Open Settings Panel</button>';

    // Create the divs needed to create the editor
    wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute('id', 'editorDiv');
    wrapperDiv.style.cssText = 'background-color: white;border:3px solid black;height: 90%;width: 90%;position: absolute;top: 50px;left: 5vw;z-index: 2000;';
    editorDiv = document.createElement('div');
    editorDiv.style.cssText = 'width: 100%; height: calc(100% - 40px);';
    footerDiv = document.createElement('div');
    footerDiv.setAttribute('id', 'editorFooter');
    footerDiv.style.cssText = 'margin-top:5px;margin-right:20px;';

    // Put the footer HTML into the footerDiv
    footerDiv.innerHTML = footerHTML;

    // Append the editor and footer divs to the wrapperDiv
    wrapperDiv.appendChild(editorDiv);
    wrapperDiv.appendChild(footerDiv);
    document.querySelector(whereToInjectCode).appendChild(wrapperDiv);

    // Make the editor, place it in the editorDiv
    editor = ace.edit(editorDiv);
    openEditor = true;
    console.log('Editor Opened');

    // Set the options
    // Starting Options for the Editor
    var startingOptions = {
        'animatedScroll': false,
        'behavioursEnabled': true,
        'displayIndentGuides': true,
        'dragDelay': 0,
        'fadeFoldWidgets': false,
        'fontSize': 14,
        'highlightActiveLine': true,
        'highlightGutterLine': true,
        'highlightSelectedWord': true,
        'hScrollBarAlwaysVisible': false,
        'keyboardHandler': null,
        'mode': 'ace/mode/html',
        'newLineMode': 'auto',
        'overwrite': false,
        'printMarginColumn': 80,
        'readOnly': false,
        'scrollSpeed': 2,
        'showFoldWidgets': true,
        'showGutter': true,
        'showInvisibles': false,
        'showPrintMargin': false,
        'tabSize': 4,
        'theme': 'ace/theme/iplastic',
        'useSoftTabs': true,
        'useWorker': true,
        'wrap': 'off',
        'vScrollBarAlwaysVisible': false,
        'wrapBehavioursEnabled': true
    };
    options = JSON.parse(localStorage.getItem(localstorageKey)) || startingOptions;
    editor.setOptions(options);

    // Beautify the text, then put the text into the editor
    editor.getSession().setValue(makePretty(htmlString));

    // Set focus to the editor
    document.getElementsByClassName('ace_text-input')[0].focus();

    // When you click the beautifyHTML button, clean the code.
    document.getElementsByClassName('beautifyEditor')[0].onclick = () => {
        editor.getSession().setValue(makePretty(editor.getSession().getValue()));
        console.log('Code Beautified');
    };

    // When you click the close button, save the user's settings, put the code back in, and close the editor.
    document.getElementsByClassName('closeButtonEditor')[0].onclick = () => {
        localStorage.setItem(localstorageKey, JSON.stringify(editor.getOptions()));
        console.log('Settings Saved');
        placeToPutBack.value = editor.getSession().getValue();
        placeToPutBack.focus();
        editor.destroy();
        editor.container.remove();
        document.body.removeChild(wrapperDiv);
        openEditor = false;
        console.log('Editor Closed');
    };

    // When you click the settings button, open the editor's settings.
    document.getElementsByClassName('editorSettings')[0].onclick = () => {
        editor.execCommand('showSettingsMenu');
        console.log('Settings Opened');
    };

    // When you click the reset settings button, reset the editor's settings.
    document.getElementsByClassName('resetSettingsEditor')[0].onclick = () => {
        editor.setOptions(startingOptions);
        console.log('Settings Reset');
    };

    // When you click the wrap text checkbox, wrap, or unwrap the text
    document.getElementsByClassName('wrapTextEditor')[0].onclick = () => {
        editor.getSession().setUseWrapMode(document.getElementsByClassName('wrapTextEditor')[0].checked);
        console.log('Wrapping Text =', document.getElementsByClassName('wrapTextEditor')[0].checked);
    };

    // Call this function to clean up the editor's text.
    function makePretty(html) {
        return html_beautify(html, {
            'wrap_line_length': 0,
            unformatted: ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'cite', 'data', 'datalist', 'del', 'dfn', 'em', 'i', 'input', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'small', 'strike', 'tt', 'pre'],
            extra_liners: []
        });
    }
}