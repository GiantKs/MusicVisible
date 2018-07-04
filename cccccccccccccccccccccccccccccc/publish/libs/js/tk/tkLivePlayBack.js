var TKLIVE = TKLIVE || {};
TKLIVE.SDKTYPE = 'livePc';
var LIVESDKVERSIONS =   "1.0.0";
var LIVESDKVERSIONSTIME =  "2018011018";
TKLIVE.LivePlayBack = function (room) {
	L.Logger.info('[tk-live-sdk-version]sdk-version:'+ LIVESDKVERSIONS +' , sdk-time: '+ LIVESDKVERSIONSTIME) ;
    var that = {} ;
    if(!room){
        L.Logger.error('[tk-live-sdk]room is not exist!');
        return that;
    }
    var _recordJsonCmds = []  ,
        _currentTime = 0 ,
        _startTime = 0 ,
        _endTime = 0 ,
        _temporarilyPause = false ,
        _playbackTimer  ,
        _playbackIndex = 0 ,
        _playState = false ,
        _timerinterval = 0
    ;

    /*初始化直播回放信息*/
    that.joinLivePlaybackRoom = function(params){
        if(!params.recordjsonpath){
            L.Logger.error('[tk-live-sdk]params.recordjsonpath is not exist!');
            return ;
        }
        _getPlaybackJson(params.recordjsonpath , function (recordJson) {
            if(recordJson && recordJson.length >0 ){
                _recordJsonCmds = recordJson ;
                for (var i = 0; i < _recordJsonCmds.length; i++) {
                    if (_recordJsonCmds[i].method === "start"){
                        _startTime = _recordJsonCmds[i].ts;
                        _currentTime = _startTime ;
                    }
                    else if (_recordJsonCmds[i].method === "close"){
                        _endTime = _recordJsonCmds[i].ts;
                    }
                }
                room.liveSimulateServerCommunicationInterface('connectSocketSuccess' , 0 , {roominfo:{} ,msglist:{} , userlist:{} }  );
                room.liveSimulateServerCommunicationInterface('duration' , {startTime: _startTime, endTime: _endTime} );
                _playPlayback();
            }
        });
    };

    /*临时暂停*/
    that.temporarilyPause = function(isPause){
        _temporarilyPause = isPause ;
        if(isPause){
            if(_playState){
                clearInterval(_playbackTimer);
                _playbackTimer = null;
            }
        }else{
            if(_playState){
                _playPlayback();
            }
        }
    };

    /*seek回放进度*/
    that.seekPlayback = function(position){
        var play = _playState ;
        if(play)
            _pausePlayback();
        _currentTime = position ;
        var cmds = _findCmds();
        if (cmds === undefined)
            return;

        for(var i=0 ; i<cmds.length ; i++){
            var cmd = cmds[i] ;
            _executeCmd(cmd);
        }
        if (play)
            _playPlayback();
    };

    that.playPlayback = function(){
        _playPlayback();
    };

    that.pausePlayback = function () {
        _pausePlayback();
    };

    /*获取回放json信令 xgd 2017-12-26 */
    function _getPlaybackJson (_recordjsonpath, callback) {
        //var url = "http://192.168.1.249:8081/9051705-1515207653382-record.json";//_recordjsonpath;
        var url = _recordjsonpath;
        var getPlaybackJsonAjaxXhr = $.ajax({
            url: url,
            dataType: "json",
            type: 'GET',
            async: true,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getPlaybackJson resp = ', L.Utils.toJsonStringify(response));
            if (callback && typeof callback === "function") {
                callback(response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            L.Logger.error("[tk-sdk]getPlaybackJson fail[ jqXHR , textStatus , errorThrown ]:", jqXHR, textStatus, errorThrown);
            callback(undefined);
        });
        return getPlaybackJsonAjaxXhr;
    };

    function _playPlayback() {
        var rePlayerIntervalCycle = 1000 ;
        _playState = true ; //播放
        if(_temporarilyPause){
            return ;
        }
        _timerinterval = new Date().getTime() - _currentTime;
        clearInterval(_playbackTimer);
        _playbackTimer = setInterval( function () {
            _handlerPlayPlaybackCmd();
        } , rePlayerIntervalCycle );

    };

    function _pausePlayback() {
        _playState = false ; //暂停
        clearInterval(_playbackTimer);
        _playbackTimer = null ;
    };

    function _findCmds() {
        if(_recordJsonCmds.length === 0){
            return  ;
        }

        var currReplayData = _recordJsonCmds[_playbackIndex] ; //_playbackIndex对应的数据
        var index = _playbackIndex + 1;
        var cmds = [] ; //命令数组
        var startPos = index;
        if( _currentTime == currReplayData.ts ){//需要回放的位置等于当前播放的位置，则不执行命令
            return cmds;
        }else if( _currentTime < currReplayData.ts ){
            room.liveSimulateServerCommunicationInterface('playback_clearAll');
            startPos = 0;
        }
        for(var i = startPos ;i<_recordJsonCmds.length;i++) {
            var cmd = _recordJsonCmds[i];
            if(cmd.ts > _currentTime)
                return cmds;
            _playbackIndex = i;
            cmds.push(cmd);
        }
        return cmds;
    }

    function _executeCmd(cmd){
        if(cmd!==undefined){
            var method = cmd.method;
            if(method==="join"){
                var notifParams = {};
                notifParams.ts = cmd.ts;
                notifParams.id=cmd.userName;
                notifParams.properties=cmd.properties;
                room.liveSimulateServerCommunicationInterface('participantJoined' , notifParams );
            }
            else if(method==="PubMsg"){
                room.liveSimulateServerCommunicationInterface('pubMsg' , cmd.data );
            }
            else if(method==="DelMsg"){
                room.liveSimulateServerCommunicationInterface('delMsg' , cmd.data );
            }
            else if(method==="SendMessage"){
                var param={};
                param.ts = cmd.ts;
                param.sender = cmd.sender;
                param.message= cmd.message;
                param.toID="__all";
                param.fromID=cmd.fromID;
                room.liveSimulateServerCommunicationInterface('sendMessage' , param );
            }
            else if(method==="setProperty"){
                var param={};
                param.ts = cmd.ts;
                param.id = cmd.id;
                param.properties= cmd.properties;
                room.liveSimulateServerCommunicationInterface('setProperty' , param );
            }
            else if(method==="close"){
                _pausePlayback();
                room.liveSimulateServerCommunicationInterface('playbackEnd');
            }
            else if(method == "LEAVE") {
                room.liveSimulateServerCommunicationInterface('participantLeft' , cmd.userName ,  cmd.ts );
            }
        };
    };

    function _handlerPlayPlaybackCmd() {
        if (_playbackIndex !== undefined && _recordJsonCmds !== undefined && _recordJsonCmds.length <= _playbackIndex + 1) {
            L.Logger.debug('[tk-live-sdk]playBack reach the end',_playbackIndex, _currentTime );
            _pausePlayback();
        }
        _currentTime =  new Date().getTime() - _timerinterval;
        var cmds = _findCmds();
        if (cmds === undefined){
            return ;
        }
        for(var i=0 ; i<cmds.length ; i++){
            var cmd = cmds[i] ;
            _executeCmd(cmd);
        }
        room.liveSimulateServerCommunicationInterface('playback_updatetime' , {current:_currentTime} );
    }

    return that ;
};