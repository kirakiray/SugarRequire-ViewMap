(function($, Global) {

    //冒泡事件机
    var PopEvent = function() {
        this._map = {};
    };
    PopEvent.fn = PopEvent.prototype;
    PopEvent.fn._get = function(eventName) {
        return this._map[eventName] || (this._map[eventName] = {
            eves: []
        });
    };

    //注册事件
    PopEvent.fn.on = function(eventName, fun, data) {
        //先获取事件对象
        var eventObj = this._get(eventName);

        //挂载函数
        eventObj.eves.push({
            _call: fun,
            data: data
        });
    };

    //触发事件
    PopEvent.fn.trigger = function(eventName, data) {
        //先获取事件对象
        var eventObj = this._get(eventName);

        eventObj.eves.forEach(function(e) {
            e._call({
                name: eventName,
                data: e.data
            }, data);
        });
    };

    var SrViewGroup = function() {
        PopEvent.apply(this, arguments);
        this.element = $('<div class="vm-group"><div class="vm-block-line"></div><div class="vm-group-container"></div></div>');
        this.$container = this.element.find('.vm-group-container');
        this.blocks = [];
        this.nextGroups = [];
        this.height = 20;
        this.marBottom = 0;
    };
    SrViewGroup.fn = SrViewGroup.prototype = Object.create(PopEvent.prototype);

    //添加block
    SrViewGroup.fn.addBlock = function(text) {
        var viewBlock = new SrViewBlock(text);
        this.blocks.push(viewBlock);
        this.$container.append(viewBlock.element);
        viewBlock.parentGroup = this;
        //更新当前高度
        this.reloadSizeInfo();
        return viewBlock;
    };

    //刷新group大小信息
    SrViewGroup.fn.reloadSizeInfo = function() {
        //更新group高度
        var tHei = 20;
        this.blocks.forEach(function(e) {
            tHei += 36 + e.space * 2 + e.spaceBottom;
        });
        this.height = tHei;

        if (this.prevGroup) {
            //更新前级块大小
            var theLargest = 0;
            this.prevGroup.nextGroups.forEach(function(e) {
                var eTotalHei = e.height + e.marBottom;
                (eTotalHei > theLargest) && (theLargest = eTotalHei)
            });
            this.prevGroup.marBottom = theLargest + 42;

            //刷新上一组UI数据
            this.prevGroup.reloadSizeInfo();
        } else if (this.parentBlock) {
            var parentBlock = this.parentBlock;

            //更新间距
            parentBlock.space = this.height / 2;

            //更新下距离
            //parentBlock.spaceBottom = this.marBottom;

            //更新父级块大小
            parentBlock.reSize();

            //更新父级组大小
            parentBlock.parentGroup.reloadSizeInfo();
        }
    };

    //添加下一级Group 
    SrViewGroup.fn.addNext = function() {
        var nextGroup = new SrViewGroup();
        nextGroup.prevGroup = this;
        if (!this.$nextContainer) {
            this.$nextContainer = $('<div class="vm-nexts" />');
            this.element.append(this.$nextContainer);
        }
        this.nextGroups.push(nextGroup);
        this.$nextContainer.append(nextGroup.element);
        return nextGroup;
    };


    var SrViewBlock = function(text) {
        PopEvent.apply(this, arguments);
        this.element = $('<div class="vm-block"><div class="vm-block-content">' + text + '</div></div>');
        this.space = 10;
        this.spaceBottom = 0;
    };
    SrViewBlock.fn = SrViewBlock.prototype = Object.create(PopEvent.prototype);

    //添加子级Group
    SrViewBlock.fn.appendGroup = function() {
        if (!this.$childContainer) {
            this.$childContainer = $('<div class="vm-block-child"></div>');
            this.element.append(this.$childContainer);
        }
        var childViewGroup = new SrViewGroup();
        this.$childContainer.append(childViewGroup.element);
        childViewGroup.parentBlock = this;

        if (!this.childGroup) {
            this.childGroup = [];
        }
        this.childGroup.push(childViewGroup);

        var _this = this;
        return childViewGroup;
    };

    //更新UI
    SrViewBlock.fn.reSize = function() {
        var cHei = -20;
        var lastId = this.childGroup.length - 1;
        var _this = this;
        this.childGroup.forEach(function(e, i) {
            if (lastId == i) {
                //如果是最后一个
                _this.spaceBottom = e.marBottom;
                cHei += e.height + 20;
            } else {
                cHei += e.height + 20 + e.marBottom;
                //不是最后一个，则将当前的group添加margin-bottom
                e.element.css('margin-bottom', e.marBottom + 'px');
            }
        });
        this.element.css({
            "margin-top": cHei / 2 + "px",
            "margin-bottom": cHei / 2 + this.spaceBottom + "px"
        });
    };

    //改变状态
    SrViewBlock.fn.changeStatus = function(color) {
        var statusClass = "";
        switch (color) {
            case "succeed":
                statusClass = "gr";
                break;
            case "safe":
                statusClass = "bl";
                break;
            case "warn":
                statusClass = "or";
                break;
            case "error":
                statusClass = "re";
                break;
        }
        this.element.attr('class', "vm-block " + statusClass);
    };

    //test
    Global.SrViewGroup = SrViewGroup;
    Global.SrViewBlock = SrViewBlock;
})(jQuery, window);