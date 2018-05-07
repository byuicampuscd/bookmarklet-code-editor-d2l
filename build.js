var fs = require('fs'),
    boomlet = require('boomlet'),
    package = require('./package.json'),
    loadName = "loadDependances.js",
    bookmarkletName = "codeThatGoesInBookmarklet.js",
    loadFile = fs.readFileSync(`./${loadName}`, 'utf8'),
    bookmarkletFile = fs.readFileSync(`./${bookmarkletName}`, 'utf8'),
    mainCode = `var main = "${package.byui.prodMain}";`,
    loadCode = `var loadDependencies = "${package.byui.prodLoad}";`;

//sub out the urls for prod urls
loadFile = loadFile.replace(/^\s+var\s+main.*?$/m, mainCode);
bookmarkletFile = bookmarkletFile.replace(/^\s+var\s+loadDependencies.*?$/m, loadCode);

//make the dir if we need to
try{
    fs.mkdirSync('./prod/');
}catch(e){
    //do nothing cus we have it already
}

//writeOut the files
fs.writeFileSync(`./prod/${loadName}`, loadFile);
fs.writeFileSync(`./prod/${bookmarkletName}`, bookmarkletFile);

//todo make it update importMe.html with the output of boomlet

console.log("Wrote out the two prod files.");