(function($, Global) {

    //冒泡事件机
    var PopEvent = function() {
        this._map = {};
        this._parentEvent = "";
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

        //触发父事件
        this._parentEvent && this._parentEvent.trigger(eventName, data);
    };

    //监听事件
    PopEvent.fn.monite = function(popevent) {
        popevent._parentEvent = this;
    };

    var SrViewGroup = function() {
        PopEvent.apply(this, arguments);
        this.element = $('<div class="vm-group"><div class="vm-block-line"></div><div class="vm-group-container"></div></div>');
        this.$container = this.element.find('.vm-group-container');
        this.blocks = [];
    };
    SrViewGroup.fn = SrViewGroup.prototype = Object.create(PopEvent.prototype);

    //添加block
    SrViewGroup.fn.addBlock = function(text) {
        var viewBlock = new SrViewBlock(text);
        this.blocks.push(viewBlock);
        this.$container.append(viewBlock.element);
        viewBlock.parentGroup = this;
        return viewBlock;
    };

    //添加下一级Group 
    SrViewGroup.fn.addNext = function() {
        var nextGroup = new SrViewGroup();
        nextGroup.prevGroup = this;
        if (!this.$nextContainer) {
            this.nextGroups = [];
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
        return childViewGroup;
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