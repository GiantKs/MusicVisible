import React from 'react';
import ReactDom from 'react-dom';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import BlackboardSmart from '../balckBoard/blackboard';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController' ;

class VideoDrawingBoard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            videoDrawBoardInfo:{
                containerWidthAndHeight:{
                    width:0,
                    height:0,
                },
                watermarkImageScalc:16/9,
                isShow:false,
                backgroundColor:'transparent',
                instanceId:'videoDrawBoard',
                saveImage:false,
                nickname:'videoDrawBoard',
                deawPermission:false,
                associatedMsgID:'VideoWhiteboard',
            },
            useToolInfo:{
                useToolKey:'tool_pencil',
                useToolColor:'#FF0000',
                blackboardToolsInfo:TK.SDKTYPE !== 'mobile'?{pencil:5 , text:30 , eraser:30} : {pencil:5 , text:45 , eraser:150} ,
                selectBlackboardToolSizeId:'blackboard_size_small' ,
            },
            BlackboardSmartIsShow:false,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };

    componentDidMount(){
        let that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that)  ,  that.listernerBackupid ) ;//room-delmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener( 'receive-msglist-VideoWhiteboard' , that.receiveMsglistVideoWhiteboard.bind(that) , that.listernerBackupid );
    }
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用。在初始化时不会被调用
        if (prevState.videoDrawBoardInfo.isShow !== this.state.videoDrawBoardInfo.isShow) {
            this.setState({BlackboardSmartIsShow:this.state.videoDrawBoardInfo.isShow});
        }
    };
    handlerRoomPlaybackClearAll() {
        let videoDrawBoardInfoCopy = {...this.state.videoDrawBoardInfo};
        videoDrawBoardInfoCopy.isShow = false;
        this.setState({videoDrawBoardInfo:videoDrawBoardInfoCopy});
    }
    handlerRoomDisconnected() {
        let videoDrawBoardInfoCopy = {...this.state.videoDrawBoardInfo};
        videoDrawBoardInfoCopy.isShow = false;
        this.setState({videoDrawBoardInfo:videoDrawBoardInfoCopy});
    }
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "VideoWhiteboard":
                let videoDrawBoardInfoCopy = {...this.state.videoDrawBoardInfo};
                videoDrawBoardInfoCopy.isShow = true;
                videoDrawBoardInfoCopy.deawPermission = CoreController.handler.getAppPermissions('isShowVideoDrawTool');
                if(pubmsgData.data && typeof pubmsgData.data === 'object' && pubmsgData.data.videoRatio) {
                    videoDrawBoardInfoCopy.watermarkImageScalc = pubmsgData.data.videoRatio;
                }
                this.setState({videoDrawBoardInfo:videoDrawBoardInfoCopy});
                break;
            default:
                break;
        }
    };
    handlerRoomDelmsg(delmsgDataEvent){
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "VideoWhiteboard":
                let videoDrawBoardInfoCopy = {...this.state.videoDrawBoardInfo};
                videoDrawBoardInfoCopy.isShow = false;
                videoDrawBoardInfoCopy.deawPermission = false;
                this.setState({videoDrawBoardInfo:videoDrawBoardInfoCopy});
                break;
        }
    };
    receiveMsglistVideoWhiteboard(handleData) {//视频标注msglist
        let data = handleData.message.VideoWhiteboardArray[0].data;
        let videoDrawBoardInfoCopy = {...this.state.videoDrawBoardInfo};
        videoDrawBoardInfoCopy.isShow = true;
        videoDrawBoardInfoCopy.deawPermission = CoreController.handler.getAppPermissions('isShowVideoDrawTool');
        if (data && typeof data === 'object' && data.videoRatio) {
            videoDrawBoardInfoCopy.watermarkImageScalc = data.videoRatio;
        }
        this.setState({videoDrawBoardInfo:videoDrawBoardInfoCopy});
    }
    _colorFilter(text){
        return text.replace(/#/g,"");
    };
    changeStrokeColorClick(colorValue){
        this.state.useToolInfo.useToolColor = colorValue;
        this.setState({
            useToolInfo:this.state.useToolInfo,
        });
    };
    _loadToolColorsElementArray(){
        let colorsArray = [];
        let colors =  [] ;
        if(TK.SDKTYPE !== 'mobile' ){
            colors =["#FF0000" , "#FFFF00" , "#00FF00" , "#00FFFF" , "#0000FF" , "#FF00FF" ,
                "#FE9401" , "#FF2C55" , "#007AFF" , "#7457F1" , "#626262" , "#000000"
            ] ;
        }else{
            colors =["#FF0000" , "#FFFF00" , "#007AFF" , "#000000"] ;
        }
        colors.forEach(  (item , index) => {
            {/*<li className="blackboard-tool-option" >
             <button id="blackboard_tool_vessel_eraser" className={"tool-btn eraser-icon"+ (useToolKey ===  'tool_eraser' ? ' active':'')}    title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.eraser }  onTouchStart={that.handleToolClick.bind(that , 'tool_eraser')}  ></button>
             </li>*/}
            let reactElement = TK.SDKTYPE !== 'mobile' ?
                (<li className={"color-option " + (this.state.useToolInfo.useToolColor === item ? ' active' : '') } key={index}  onClick={this.changeStrokeColorClick.bind( this , item )} style={{backgroundColor:item}}  id={"video_drawBoard_color_"+this._colorFilter(item)} ></li>) :
                (<li key={index} className="blackboard-tool-option" >
                    <button id={"video_drawBoard_color_"+this._colorFilter(item)} className={"color-option " + (this.state.useToolInfo.useToolColor === item ? ' active' : '') }   style={{backgroundColor:item}}  onTouchStart={this.changeStrokeColorClick.bind( this , item )} ></button>
                </li>);
            colorsArray.push(reactElement);
        });
        return{
            toolColorsArray:colorsArray
        }
    };
    handleToolClick(toolKey){
        if(toolKey === 'tool_pencil' || toolKey ==='tool_text' || toolKey ==='tool_eraser'){
            this.state.useToolInfo.useToolKey = toolKey;
            this.setState({
                useToolInfo:this.state.useToolInfo,
            });
        }
    };
    /*改变大小的点击事件*/
    _changeStrokeSizeClick(selectBlackboardToolSizeId , strokeJson ){
        this.state.useToolInfo.selectBlackboardToolSizeId = selectBlackboardToolSizeId;
        this.state.useToolInfo.blackboardToolsInfo = strokeJson;
        this.setState({
            useToolInfo:this.state.useToolInfo,
        });
    };

    render() {
        let that = this;
        let {videoDrawBoardInfo,useToolInfo} = that.state ;
        let {containerWidthAndHeight} = this.props;
        let {useToolKey} = useToolInfo;
        let {toolColorsArray} = that._loadToolColorsElementArray();
        let useWidth = useToolKey ===  'tool_eraser' ? useToolInfo.blackboardToolsInfo.eraser : useToolInfo.blackboardToolsInfo.pencil ;
        return(
            <div className="video-drawing-board-box" style={{display:videoDrawBoardInfo.isShow?'block':'none'}}>
                <div className="video-drawing-board" style={{display:videoDrawBoardInfo.isShow?'flex':'none'}}>
                    {this.state.BlackboardSmartIsShow? <BlackboardSmart isBaseboard={false} containerWidthAndHeight={containerWidthAndHeight} instanceId={videoDrawBoardInfo.instanceId} nickname={videoDrawBoardInfo.nickname}
                                                                        show={this.state.BlackboardSmartIsShow} backgroundColor={videoDrawBoardInfo.backgroundColor} useToolKey={useToolKey}
                                                                        fontSize={useToolInfo.blackboardToolsInfo.text} useToolColor={useToolInfo.useToolColor}  pencilWidth={useWidth}  showRemoteRemindContent={false}
                                                                        deawPermission={videoDrawBoardInfo.deawPermission} watermarkImageScalc={videoDrawBoardInfo.watermarkImageScalc} associatedMsgID={videoDrawBoardInfo.associatedMsgID}/>:undefined}
                </div>
                <ul className="blackboard-tool clear-float" style={{display:videoDrawBoardInfo.deawPermission?'':'none'}}   >
                    <li className={"blackboard-tool-option" + (useToolKey ===  'tool_pencil' ? ' active':'')} >
                        <button id="video_blackboard_tool_pencil" className={"tool-btn pencil-icon " + (useToolKey ===  'tool_pencil' ? ' active':'')} title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.pen }  onClick={that.handleToolClick.bind(that , 'tool_pencil')}  ></button>
                    </li>
                    <li className={"blackboard-tool-option" + (useToolKey ===  'tool_text' ? ' active':'')} style={{display:'none'}} > {/*todo 暂时不要文本输入框*/}
                        <button id="video_blackboard_tool_text" className={"tool-btn text-icon"+ (useToolKey ===  'tool_text' ? ' active':'')}   title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.text }  onClick={that.handleToolClick.bind(that , 'tool_text')}  ></button>
                    </li>
                    <li className={"blackboard-tool-option" + (useToolKey ===  'tool_eraser' ? ' active':'')} >
                        <button id="video_blackboard_tool_eraser" className={"tool-btn eraser-icon"+ (useToolKey ===  'tool_eraser' ? ' active':'')}    title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.eraser }  onClick={that.handleToolClick.bind(that , 'tool_eraser')}  ></button>
                    </li>
                    {TK.SDKTYPE !== 'mobile' ? (
                        <li className="blackboard-tool-option colors  add-position-relative" >
                            <button id="video_blackboard_tool_color" className="tool-btn colors-icon"   title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.color }  >
                                <span className="current-color" style={{backgroundColor:useToolInfo.useToolColor}} ></span>
                            </button>
                            <div className="blackboard-color-size-box">
                                {/*<p className="blackboard-size-title">{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectMeasure}</p>*/}
                                <ul className="tool-size-container" id="video_blackboard_tool_size">
                                    <li id="video_blackboard_size_small" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_small' , {pencil:5 , text:30 , eraser:30 } ) } className={"size-small "+(this.state.useToolInfo.selectBlackboardToolSizeId === 'blackboard_size_small'?'active':'')}  >
                                        <span></span>
                                    </li>
                                    <li id="video_blackboard_size_middle" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_middle' , {pencil:15 , text:36 , eraser:90 } ) } className={"size-middle "+(this.state.useToolInfo.selectBlackboardToolSizeId === 'blackboard_size_middle'?'active':'') } >
                                        <span></span>
                                    </li>
                                    <li id="video_blackboard_size_big" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_big' , {pencil:30 , text:72 , eraser:150 } ) } className={"size-big "+(this.state.useToolInfo.selectBlackboardToolSizeId === 'blackboard_size_big'?'active':'')}  >
                                        <span></span>
                                    </li>
                                </ul>
                                {/*<p className="colors-container-title">{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectColorText}</p>*/}
                                <ol className="colors-container">
                                    {toolColorsArray}
                                </ol>
                            </div>
                        </li>
                    ):(
                        toolColorsArray
                    )}
                </ul>
            </div>
        )
    }
}

export default VideoDrawingBoard;