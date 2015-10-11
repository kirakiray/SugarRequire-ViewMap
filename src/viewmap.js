//导出数据用viewmap插件
sr.extend(function(baseResources, R, Require, GatherEvent) {
    //function
    var idRecord = 0;
    var getID = function() {
        return idRecord++;
    };

    //替换
    var oldsplitter = R.splitter;
    R.splitter = function(requireObj) {
        console.log(requireObj);
        requireObj.ViewMap = {
            id: getID()
        };
        //继承旧方法
        oldsplitter.apply(R, arguments);
    };

    var oldscriptAgent = R.scriptAgent;
    R.scriptAgent = function(url, requireObj) {
        return oldscriptAgent.apply(R, arguments);
    };
});