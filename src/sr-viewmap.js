//导出数据用viewmap插件
sr.extend(function(baseResources, R, Require, GatherEvent) {
    //data
    var requireData = [];
    var groupID = 0;
    var getGroupID = function() {
        return groupID++;
    };

    var scriptData = [];
    var scriptId = 0;
    var getScriptId = function() {
        return scriptId++;
    };

    //替换
    var oldscriptAgent = R.scriptAgent;
    R.scriptAgent = function(url, requireObj, inputUrl) {
        var scriptEvent = oldscriptAgent.apply(R, arguments);

        //记录基础数据
        var sid = getScriptId();
        var sdata = {
            url: url,
            input: inputUrl,
            start: new Date().getTime(),
            //eventObj: scriptEvent,
            groupid: requireObj._ViewMap.groupId,
            childGroupId: []
        };
        scriptData[sid] = sdata;

        scriptEvent.on('adddely', function(e) {
            e.data._rEvent.one('setGroupId', function(e2) {
                sdata.childGroupId.push(e2.data);
            });
        });

        //记录完成时间
        scriptEvent.one('done', function(e) {
            sdata.end = new Date().getTime();
            sdata.type = baseResources.dataMap[url].type;
        });

        return scriptEvent;
    };

    var oldsplitter = R.splitter;
    R.splitter = function(requireObj) {
        //获取groupid
        var groupid = getGroupID();
        var gdata = requireObj._ViewMap = {
            groupId: groupid,
            startTime: new Date().getTime(),
            afterRequire: []
        };

        //设置相应的group
        requireData[groupid] = gdata;

        //触发设置id事件
        requireObj._rEvent.trigger('setGroupId', groupid);

        //判断后代requireObj并设置groupid
        if (requireObj._subRequire.length) {
            requireObj._subRequire.forEach(function(e) {
                e._rEvent.on('setGroupId', function(e2) {
                    requireObj._ViewMap.afterRequire.push(e2.data);
                });
            });
        }

        //继承旧方法
        oldsplitter.apply(R, arguments);
    };

    //导出方法
    sr.ViewMap = {
        data: {
            v: "1.0",
            r: requireData,
            s: scriptData
        },
        export: function() {
            return JSON.stringify(this.data);
        }
    };
});