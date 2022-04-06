var fs = require("fs"), json;
function readJsonFileSync(filepath) {
    var encoding = 'utf8';
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}
function getConfig(file) {
    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}
//assume that config.json is in application root
json = getConfig('deliveryman-sample.json');
console.log(json);