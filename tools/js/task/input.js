//输入数据
defer(function(require, resolve) {
    //主体
    var element = $('<div id="input_panel"><div class="gfui"><textarea name="" id="" cols="60" rows="10" style="margin-bottom:100px" placeholder="在此处粘贴数据"></textarea></div></div>');

    require('viewControl/headerControl').done(function(headerControl) {
        headerControl.appendNav('输入数据', function(e) {
            //点击后触发的callback
            $('.main').append(element);
        });
    });
});
