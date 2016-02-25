(function() {
    //根据状态初始化框架
    //判断是否需要开场动画
    // var initAnimation = localStorage.getItem('initAnimation');

    // if (!initAnimation) {
    //     //初始化loading模式
    //     window.addEventListener('load', function() {
    //         document.body.innerHTML = '<header style="position:fixed;width:100%;height:100%;border-bottom-width:0;transition:all ease .5s;display:flex;align-items:center;justify-content:center"><div class="logo hasanime"><div class="logo_img hastransition"><span class="logo_ib1" style="background-color:#aaa"></span> <span class="logo_ib2" style="background-color:#aaa;width:0"></span> <span class="logo_ib3" style="background-color:#aaa;width:0"></span> <span class="logo_l1" style="width:0"></span> <span class="logo_l2" style="height:0"></span> <span class="logo_l3" style="width:0"></span> <span class="logo_l4" style="width:0"></span></div><div class="logo_content" style="width:70px"><span class="logo_end_centent" style="display:none">SugarRequire-ViewMap</span> <span class="logo_content_loading">加载中...</span></div></div></header><div class="main"></div>';
    //     })
    // }

    sr = {
        config: {
            baseUrl: "js"
        },
        ready: function() {
            // 开始载入依赖文件和loading控制器
            require('jquery-2.1.3', 'init/common').require('task/input');
            /* require('viewControl/headerControl').done(function(headerControl) {
                //测试添加导航block
                headerControl.appendNav('haha');
                headerControl.appendNav('haha2');
                headerControl.appendNav('haha3');
            }); */
        }
    };
})();
