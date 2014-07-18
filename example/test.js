var render = require('../render.js');

var test =function(file){

    var test_data = require(file);
    console.log("\r\n-----------------------test : "+file+" ----------------\r\n");
    console.log(render.render(test_data));
    console.log("----------------------------------------")
}
var testPage =function(file){

    var test_data = require(file);
    console.log("\r\n-----------------------test page : "+file+" ----------------\r\n");
    console.log(render.renderPage(test_data));
    console.log("----------------------------------------")
}

test('./text.json');
test('./floor+text.json');
test('./2coloums+text.json');
test('./4coloums+text.json');
testPage('./page.json');
testPage('./page_2.json');
testPage('./page_ref.json');