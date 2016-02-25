//顶部工具控制模块
define(function(require, exports, module) {
    //base
    var nav = $('header nav');

    //class
    var NavBlock = function(text) {
        this.element = $('<div class="nav_block"><span>' + text + '</span></div>');
    };
    //激活
    NavBlock.prototype.active = function() {
        this.element.addClass('nav_active');
    };

    //CONTROL
    var headerControl = {
        //添加导航block
        appendNav: function(text, callback) {
            // 生成元素
            // var navblock = $('<div class="nav_block"><span>' + text + '</span></div>');
            var navblock = new NavBlock(text);

            // 添加点击callback
            navblock.element.click(function(e) {
                if (navblock.element.hasClass('nav_active')) {
                    return;
                }
                $('.nav_active').removeClass('nav_active');
                var isSwitchSucceed = callback && callback();
                if (isSwitchSucceed == undefined || !!isSwitchSucceed) {
                    navblock.active();
                }
            });

            nav.append(navblock.element);

            return navblock;
        },
        getActiveIndex: function() {
            return $('.nav_active').index();
        }
    };
    return headerControl;
});
