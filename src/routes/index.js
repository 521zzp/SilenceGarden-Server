var poetry3 = require("./poetry3");
var violin = require("./violin");

module.exports = function(app){
    poetry3(app);  
    violin(app);
}