# Code Editor In LMS

## Get set up to dev

```
git clone https://github.com/byuitechops/code-editor-in-lms.git
npm i
npm run makeTestBookmarklet
npm start
```

1. Clone the repo
2. Install all the dependencies 
3. Open a page in your browser with a link to drag to your bookmark bar
4. Start the local the server so the test bookmarklet works


## Process to update prod

1. Build a prod version of the code
    ```
    npm run build
    ```
2. Replace the files you changed [here](https://content.byui.edu/items/7b0deacf-7b0f-477d-85e0-aaa75dcecb08/0/). Make sure you **DO NOT** make a new version.
    
    Three that need to be on the sever.
    1. loadDependances.js
    2. importMe.html (this file still needs to be updated by hand right now)
    3. main.js (does not need to built)


importMe.html needs to have the contents of `prod/codeThatGoesInBookmarklet.js` put in (this should be automated during build but is not currently)

## Flow Chart
![Code Editor Flow Chart](https://github.com/byuitechops/code-editor-in-lms/blob/master/LMS%20Code%20Editor.png?raw=true)


