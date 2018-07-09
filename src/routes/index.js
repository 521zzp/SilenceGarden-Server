var poetry3 = require("./poetry3");
var violin = require("./violin");
var article = require("./article");

module.exports = function(app){
    poetry3(app);  
    violin(app);
    article(app);
}