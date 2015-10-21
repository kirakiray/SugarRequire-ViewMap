//导出数据用viewmap插件
sr.extend(function(baseResources, R, Require, GatherEvent) {
    //function
    var groupData = [];
    var groupID = 0;
    var getGroupID = function() {
        return groupID++;
    };

    var scriptData = [];
    var scriptId = 1;
    var getScriptId = function() {
        return scriptId++;
    };

    //替换
    var oldsplitter = R.splitter;
    R.splitter = function(requireObj) {
        requireObj._ViewMap = {
            groupId: getGroupID()
        };
        //继承旧方法
        oldsplitter.apply(R, arguments);
        requireObj._rEvent.on('adddely', function(e) {
            var parentRequireObj = e.data;
            console.log(e);
        });
    };

    var oldscriptAgent = R.scriptAgent;
    R.scriptAgent = function(url, requireObj) {
        var scriptEvent = oldscriptAgent.apply(R, arguments);
        if (scriptEvent.ViewMap) {
            if (scriptEvent.ViewMap.scriptId) {
                //记录数据
                var scriptid = scriptEvent.ViewMap.newScriptId = getScriptId();
                scriptData[scriptid] = scriptEvent;
            }
        } else {
            //记录数据
            scriptEvent._ViewMap = {
                scriptId: getScriptId()
            };
            scriptData[scriptEvent._ViewMap.scriptId] = scriptEvent;
        }
        console.log(requireObj, scriptEvent);
        return scriptEvent;
    };

});