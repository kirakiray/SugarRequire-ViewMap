//顶部loading控制器
define(function(require) {
    //main
    var header = $('header');

    //动画添加渐进的方法

    //初始化头部动画方法
    var initAnimeHeader = function() {
        //还原logo
        header.find('.logo_content').css("width", "");
        header.find('.logo_content_loading').css('animation', "fadeout ease .4s");
        setTimeout(function() {
            header.find('.logo_content_loading').remove();
            setTimeout(function() {
                header.find('.logo_end_centent').css('animation', "fadein ease .4s").show();
                setTimeout(function() {
                    header.find('.logo_end_centent').css('animation', '');
                    setTimeout(function() {
                        //收起高度 
                        header.css('height', '52px');
                        //还原左距离
                        var logoleft = header.find('.logo').offset().left;
                        setTimeout(function() {
                            //展示边框和靠左动画
                            header.css({
                                'border-bottom-width': "",
                                'align-items': "",
                                'justify-content': "",
                                'display': "",
                                'height': ""
                            });
                            header.find('.logo').css('margin-left', logoleft + 'px').css('transition', 'margin ease .8s');
                            setTimeout(function() {
                                header.find('.logo').css('margin-left', 0).removeClass('hasanime');
                                setTimeout(function() {
                                    headerLoading.inited();
                                }, 800);
                            }, 100);
                        }, 500);
                    }, 200);
                }, 400);
            }, 200)
        }, 350);
    };

    var p1, p2, p3, p4, p5, p6, p7, p8, p9, p10;

    var headerLoading = {
        //进度
        process: function(percentage) {
            if (percentage > 10 && !p1) {
                p1 = true;
                header.find('.logo_l1').css('width', "");
            }
            if (percentage > 20 && !p2) {
                p2 = true;
                header.find('.logo_l2').css('height', "");
            }
            if (percentage > 30 && !p3) {
                p3 = true;
                header.find('.logo_l3').css('width', "");
            }
            if (percentage > 40 && !p4) {
                p4 = true;
                header.find('.logo_ib2').css('width', "");
            }
            if (percentage > 50 && !p5) {
                p5 = true;
                header.find('.logo_l4').css('width', "");
            }
            if (percentage > 60 && !p6) {
                p6 = true;
                header.find('.logo_ib3').css('width', "");
            }
            if (percentage > 70 && !p7) {
                p7 = true;
                header.find('.logo_ib2').css('background-color', "");
            }
            if (percentage > 80 && !p8) {
                p8 = true;
                header.find('.logo_ib3').css('background-color', "");
            }
            if (percentage > 90 && !p9) {
                p9 = true;
                header.find('.logo_ib1').css('background-color', "");
            }
            if (percentage >= 100 && !p10) {
                p10 = true;
                setTimeout(this.loaded, 500);
                initAnimeHeader();
            }
        },
        loaded: function() {},
        //总进度完成callback
        inited: function() {},
    };

    return headerLoading;
});
