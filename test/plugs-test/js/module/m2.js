define(function(require, exports) {
    require('module/m1').done(function(m1) {
        exports.m1 = m1;
        exports.val = "I am m2";
    });
});