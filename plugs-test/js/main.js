sr.config({
    baseUrl: "js"
});
require('module/m1', 'module/m2').done(function(m1, m2) {
    console.log('完成', arguments);
});