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
        //block的容器
        this.$container = this.element.find('.vm-group-container');
        //子block
        this.blocks = [];
        //下一组
        this.nextGroups = [];
        //高度
        this.height = 20;
        //下组占用高度
        this.marBottom = 0;

        //nextGroup相关属性（宽度相关逻辑）
        //宽度占位（只在nextGroup的子元素中起作用）
        //this._place = 1;
        //是否节点
        //this._placeNode = true;
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

        //添加宽度定位数据
        if (this._place) {
            viewBlock._cPlace = 1;
            this.upPlace();
        }
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
            var totalSpace = -20;
            parentBlock.childGroup.forEach(function(e, i) {
                totalSpace += e.height + 20;
            });
            parentBlock.space = totalSpace / 2;

            //更新父级块大小
            parentBlock.reSize();

            //更新父级组大小
            parentBlock.parentGroup.reloadSizeInfo();
        }
    };

    //更新宽度(place)数据（仅供nextGroup内元素使用）
    SrViewGroup.fn.upPlace = function() {
        var lagrestPlace = 1;
        //遍历block
        this.blocks.forEach(function(e, i) {
            var totalPlace = e._cPlace;
            if (totalPlace > lagrestPlace) {
                lagrestPlace = totalPlace;
            }
        });
        //遍历nexts
        var nextPlace = 0;
        this.nextGroups.forEach(function(e, i) {
            nextPlace += e._place;
        });
        (nextPlace > lagrestPlace) && (lagrestPlace = nextPlace);

        //是否有改变
        var hasChange = false;
        if (lagrestPlace > this._place) {
            this._place = lagrestPlace;
            hasChange = true;
        }

        //判断是否有父级
        if (this.parentBlock && (this.parentBlock._cPlace < ++lagrestPlace)) {
            this.parentBlock._cPlace = lagrestPlace;
            if (this.parentBlock.parentGroup._place) {
                this.parentBlock.parentGroup.upPlace();
            }
        } else if (this.prevGroup && this.prevGroup._place) {
            this.prevGroup.upPlace();
        }
        //更新UI
        if (this.prevGroup && this.prevGroup.nextGroups && this.prevGroup.nextGroups.length > 1) {
            var lastNextsId = this.prevGroup.nextGroups.length - 1;
            this.prevGroup.nextGroups.forEach(function(e, i) {
                if (i != lastNextsId && e._place != 1) {
                    e.element.css('margin-right', (e._place - 1) * 216 + 'px');
                }
            });
        }
    };

    //添加下一级Group 
    SrViewGroup.fn.addNext = function() {
        var nextGroup = new SrViewGroup();

        //设置nextGroup相关属性
        nextGroup._place = 1;
        this._placeNode = true;

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

        //更新nextGroup相关信息
        if (this.parentGroup._place) {
            childViewGroup._place = 1;
            //更新parentGroup信息
            this.parentGroup.upPlace();
        }

        var _this = this;
        return childViewGroup;
    };

    //更新高度UI数据
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