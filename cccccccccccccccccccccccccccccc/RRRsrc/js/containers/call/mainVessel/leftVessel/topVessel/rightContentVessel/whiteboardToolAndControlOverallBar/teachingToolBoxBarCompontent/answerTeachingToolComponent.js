/**
 * 右侧内容-教学工具箱 Smart组件
 * @module answerTeachingToolComponent
 * @description   答题器组件
 * @author liujianhang
 * @date 2017/09/19
 */
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling' ;
import AnswerStudentToolSmart from './answerStudentTool' ;
import { DragSource } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

class AnswerTeachingToolSmart extends React.Component {
	constructor(props){
		super(props);
		this.state={
			initArr:[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false}],
			brr:[],
            allResult:"",
            allResultX:"",
            allResultHover:"",
			crr:[],
            trueSelect:"",
            endQuestion:null,
            restartQuestion:null,
            answerTeachWrapDiv:'none',
            resultTeachDisplay:null,
            beginStyle:null,
			lisStyle:false,
            plusStyle:"#368bcb",
            reduceStyle:"#368bcb",
            resultTeachStyleDisplay:null,
            numz:0,
            afterArrayA:[],
            afterArrayB:[],
            afterArrayC:[],
            afterArrayD:[],
            afterArrayE:[],
            afterArrayF:[],
            afterArrayG:[],
            afterArrayH:[],
            studentNumbers:[],
            allStudentNameA:[],
            allStudentNameB:[],
            allStudentNameC:[],
            allStudentNameD:[],
            allStudentNameE:[],
            allStudentNameF:[],
            allStudentNameG:[],
            allStudentNameH:[],
            allNumbers:0,
            studentSendArry:[],
            liA:"hidden",
            liB:"hidden",
            liC:"hidden",
            liD:"hidden",
            liE:"hidden",
            liF:"hidden",
            liG:"hidden",
            liH:"hidden",
            idA:[],
            idB:[],
            idC:[],
            idD:[],
            idE:[],
            idF:[],
            idG:[],
            idH:[],
            trueNum:0,
            trueLV:0,
            allStudentChosseAnswer:{},
            round:false,
            isShow:false,
            dataInit:[],
            publishAnswerText:"",
            xiangQingText:"",
            tableStyle:"",
            columnar:"",
            isXiangQing:false,
            tableArry:[],
            tableObject:{},
            isPublished:false,
            publishedWarning:"none",
            publishedWarningColor:"#074496",
            answerDrag:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
		}

		this.liArr=[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false},{id:4,"name":"E","sel":false},{id:5,"name":"F","sel":false},{id:6,"name":"G","sel":false},{id:7,"name":"H","sel":false}];
		this.selects=false;
		this.stop=null;
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
	};
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        that.trueArr();
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener('changeMainContentVesselSmartSize' , that.changeMainContentVesselSmartSize.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件
        eventObjectDefine.CoreController.addEventListener( 'resizeHandler' , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'handleAnswerShow' , that.handleAnswerShow.bind(that) , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-submitAnswers" , that.handlerMsglistResultStudent.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-answer" , that.handlerMsglistAnswerShow.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid );
    };
    /*添加全屏监测处理函数*/
    handlerOnFullscreenchange(){
        if(TK.SDKTYPE !== 'mobile' && (!TkUtils.tool.isFullScreenStatus() || (TkUtils.tool.getFullscreenElement().id && TkUtils.tool.getFullscreenElement().id == "lc-full-vessel"))){
            this.anewCountPosition();
        }
    };
    changeMainContentVesselSmartSize() {
        this.anewCountPosition();
    }
    handlerOnResize(){
        this.anewCountPosition();
    };
    /*重新计算位置*/
    anewCountPosition() {
        let that = this;
        let {percentLeft,percentTop,id} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        this.setState({[id]:this.state[id]});
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {

            case "answer":
                if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant ||TkConstant.hasRole.rolePatrol){
                    that._teacherRecevedServiceDataShow(pubmsgData);
                }
                break;
            case "submitAnswers":
                that._updateStudentShow(pubmsgData);

                break;

        }
    };
    handleAnswerShow(data){
        const that = this;
        if(data.className=="answer-implement-bg")
        {
            if(that.state.answerTeachWrapDiv=="none"){
                that.state.answerTeachWrapDiv="block";
                that.state.resultTeachDisplay = "none";
                that.state.plusStyle="#368bcb";
                that.state.reduceStyle="#368bcb";
                that.clearTeacherShowData();
                that.setState({answerTeachWrapDiv:that.state.answerTeachWrapDiv,resultTeachDisplay:that.state.resultTeachDisplay,plusStyle: that.state.plusStyle,
                    reduceStyle: that.state.plusStyle,})
            }
        }
    };
    /*老师或者助教接收服务器端的数据*/
    handlerMsglistAnswerShow(recvEventData){
        const that = this ;
        for(let message of recvEventData.message.answerShowArr){
            if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){
                that._teacherRecevedServiceDataShow(message);
            }
        }
    };
    /*老师或者助教接收数据*/
    _teacherRecevedServiceDataShow(data){
        const that = this ;
        that.coordArr(data.data.optionalAnswers);

        that.state.crr = data.data.rightAnswers;
        that.state.init = data.data.optionalAnswers;
        that.state.dataInit = data.data.optionalAnswers;
        that.state.initArr = data.data.optionalAnswers;
        that.setState({
            crr:that.state.crr,
            dataInit:that.state.dataInit,
            initArr:that.state.initArr,
            init:that.state.init
        });
        if(data.data.isShow){
            that.clearTeacherShowData();
            that.state.initArr=[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false}]
            that.state.plusStyle="#368bcb";
            that.state.reduceStyle="#368bcb";
            that.state.answerTeachWrapDiv="block";
            that.state.resultTeachDisplay="none";
            that.state.publishedWarning="none";
            that.setState({
                plusStyle: that.state.plusStyle,
                reduceStyle: that.state.plusStyle,
                answerTeachWrapDiv:that.state.answerTeachWrapDiv,
                resultTeachDisplay:that.state.resultTeachDisplay,
                initArr:that.state.initArr,
                publishedWarning:that.state.publishedWarning
            });
        }
        else{
            if(data.data.isRound){
                clearInterval(that.stop);
                that.state.endQuestion="none";
                that.state.answerTeachWrapDiv="none";
                that.state.resultTeachDisplay="block";
                that.state.restartQuestion="block";
                that.state.tableArry=[];
                that.state.xiangQingText = TkGlobal.language.languageData.answers.details.text;
                that.state.publishAnswerText = TkGlobal.language.languageData.answers.PublishTheAnswer.text;
                that.state.resultTeachStyleDisplay = "block";
                that.state.crr = data.data.rightAnswers;
                that.state.dataInit = data.data.optionalAnswers;
                document.getElementById("result-teach-mytime").textContent="";
                document.getElementById("result-teach-mytime").textContent= data.data.quizTimes
                that.setState({
                    tableArry:that.state.tableArry,
                    publishAnswerText:that.state.publishAnswerText,
                    xiangQingText:that.state.xiangQingText,
                    endQuestion:that.state.endQuestion,
                    restartQuestion:that.state.restartQuestion,
                    crr:that.state.crr,
                    dataInit:that.state.dataInit,
                    answerTeachWrapDiv:that.state.answerTeachWrapDiv,
                    resultTeachDisplay:that.state.resultTeachDisplay,
                    resultTeachStyleDisplay: that.state.resultTeachStyleDisplay
                });
                if(data.data.isPublished){
                    that.state.publishedWarning="none";
                    that.state.publishAnswerText = TkGlobal.language.languageData.answers.published.text;
                    that.setState({
                        publishAnswerText:that.state.publishAnswerText,
                        publishedWarning:that.state.publishedWarning
                    });
                }
                that.trueArr();
                that.coordArr(that.state.dataInit)
                that.coordArrX(that.state.dataInit)
            }else{
                clearInterval(that.stop);
                that.state.numz = TkGlobal.serviceTime/1000-data.ts; // tkpc2.0.8
                that.time_fun();
                that.state.endQuestion="block";
                that.state.restartQuestion="none";
                that.state.answerTeachWrapDiv="none";
                that.state.resultTeachDisplay="block";
                that.state.resultTeachStyleDisplay = "none";
                that.state.columnar = "block";
                that.state.tableStyle = "none";
                that.state.publishedWarningColor = "#074496";
                that.state.dataInit = data.data.optionalAnswers;
                that.state.xiangQingText = TkGlobal.language.languageData.answers.details.text;
                that.state.publishAnswerText = TkGlobal.language.languageData.answers.PublishTheAnswer.text;
                that.state.afterArrayA = [];
                that.state.afterArrayB = [];
                that.state.afterArrayC = [];
                that.state.afterArrayD = [];
                that.state.afterArrayE = [];
                that.state.afterArrayF = [];
                that.state.afterArrayG = [];
                that.state.afterArrayH = [];
                that.state.afterArray = [];
                that.state.allStudentName = [];
                that.state.allStudentChosseAnswer={};
                that.state.publishedWarning="none";
                that.state.trueLV = 0;
                that.state.allNumbers = 0;
                that.state.idA = [];
                that.state.idB = [];
                that.state.idC = [];
                that.state.idD = [];
                that.state.idE = [];
                that.state.idF = [];
                that.state.idG = [];
                that.state.idH = [];
                that.trueArr();
                that.coordArr(that.state.dataInit);
                that.coordArrX(that.state.dataInit);
                that.setState({
                	numz:that.state.numz, // tkpc2.0.8
                    publishedWarningColor:that.state.publishedWarningColor,
                    columnar:that.state.columnar,
                    tableStyle:that.state.tableStyle,
                    publishedWarning:that.state.publishedWarning,
                    publishAnswerText:that.state.publishAnswerText,
                    xiangQingText:that.state.xiangQingText,
                    answerTeachWrapDiv:that.state.answerTeachWrapDiv,
                    allStudentChosseAnswer:that.state.allStudentChosseAnswer,
                    resultTeachDisplay:that.state.resultTeachDisplay,
                    crr:that.state.crr,
                    dataInit:that.state.dataInit,
                    endQuestion:that.state.endQuestion,
                    restartQuestion:that.state.restartQuestion,
                    afterArray: that.state.afterArray,
                    afterArrayA: that.state.afterArrayA,
                    afterArrayB: that.state.afterArrayB,
                    afterArrayC: that.state.afterArrayC,
                    afterArrayD: that.state.afterArrayD,
                    afterArrayE: that.state.afterArrayE,
                    afterArrayF: that.state.afterArrayF,
                    afterArrayG: that.state.afterArrayG,
                    afterArrayH: that.state.afterArrayH,
                    trueLV: that.state.trueLV,
                    allNumbers: that.state.allNumbers,
                    idA: that.state.idA,
                    idB: that.state.idB,
                    idC: that.state.idC,
                    idD: that.state.idD,
                    idE: that.state.idE,
                    idF: that.state.idF,
                    idG: that.state.idG,
                    idH: that.state.idH,
                    resultTeachStyleDisplay: that.state.resultTeachStyleDisplay
                });
            }
        }

    }
    displayASHow(){
        this.state.liA="visible";
        this.setState({liA:this.state.liA})
        this.state.allStudentNameA=this.state.idA.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameA:this.state.allStudentNameA})


    };
    displayAHide(){
        this.state.liA="hidden";
        this.setState({liA:this.state.liA})
        this.state.allStudentNameA=this.state.idA.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameA:this.state.allStudentNameA})

    };
    displayBSHow(){
        this.state.liB="visible";
        this.setState({liB:this.state.liB})
        this.state.allStudentNameB=this.state.idB.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameB:this.state.allStudentNameB})


    };
    displayBHide(){
        this.state.liB="hidden";
        this.setState({liB:this.state.liB})
        this.state.allStudentNameB=this.state.idB.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameB:this.state.allStudentNameB})

    };
    displayCSHow(){
        this.state.liC="visible";
        this.setState({liC:this.state.liC})
        this.state.allStudentNameC=this.state.idC.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameC:this.state.allStudentNameC})


    };
    displayCHide(){
        this.state.liC="hidden";
        this.setState({liC:this.state.liC})
        this.state.allStudentNameC=this.state.idC.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameC:this.state.allStudentNameC})

    };
    displayDSHow(){
        this.state.liD="visible";
        this.setState({liD:this.state.liD})
        this.state.allStudentNameD=this.state.idD.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameD:this.state.allStudentNameD})
    };
    displayDHide(){
        this.state.liD="hidden";
        this.setState({liD:this.state.liD})
        this.state.allStudentNameD=this.state.idD.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameD:this.state.allStudentNameD})

    };
    displayESHow(){
        this.state.liE="visible";
        this.setState({liE:this.state.liE})
        this.state.allStudentNameE=this.state.idE.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameE:this.state.allStudentNameE})
    };
    displayEHide(){
        this.state.liE="hidden";
        this.setState({liE:this.state.liE})
        this.state.allStudentNameE=this.state.idE.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameE:this.state.allStudentNameE})
    };
    displayFSHow(){
        this.state.liF="visible";
        this.setState({liF:this.state.liF})
        this.state.allStudentNameF=this.state.idF.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameF:this.state.allStudentNameF})
    };
    displayFHide(){
        this.state.liF="hidden";
        this.setState({liF:this.state.liF})
        this.state.allStudentNameF=this.state.idF.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameF:this.state.allStudentNameF})
    };
    displayGSHow(){
        this.state.liG="visible";
        this.setState({liG:this.state.liG})
        this.state.allStudentNameG=this.state.idG.map((item,index) => {
            return <p key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameG:this.state.allStudentNameG})
    };
    displayGHide(){
        this.state.liG="hidden";
        this.setState({liG:this.state.liG})
        this.state.allStudentNameG=this.state.idG.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameG:this.state.allStudentNameG})
    };
    displayHSHow(){
        this.state.liH="visible";
        this.setState({liH:this.state.liH})
        this.state.allStudentNameH=this.state.idH.map((item,index) => {
            return <p  key={index}>{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameH:this.state.allStudentNameH})
    };
    displayHHide(){
        this.state.liH="hidden";
        this.setState({liA:this.state.liH})
        this.state.allStudentNameH=this.state.idH.map((item,index) => {
            return <p  key={index} >{item}</p>;
        });
        this.coordArrHoverDiv(this.state.dataInit);
        this.setState({allStudentNameH:this.state.allStudentNameH})
    };
    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "answer":
                that.state.answerTeachWrapDiv="none";
                that.state.resultTeachDisplay="none";
                that.state.tableObject={};
                that.clearTeacherShowData(); //清空数据 tkpc2.0.8
                that.setState({tableObject:that.state.tableObject,answerTeachWrapDiv:that.state.answerTeachWrapDiv,resultTeachDisplay:that.state.resultTeachDisplay})
                break;
            case "ClassBegin":
                that.state.answerTeachWrapDiv="none";
                that.state.resultTeachDisplay="none";
                that.setState({answerTeachWrapDiv:that.state.answerTeachWrapDiv,resultTeachDisplay:that.state.resultTeachDisplay})
        }
    };
    handlerMsglistResultStudent(recvEventData){
        const that = this ;
        let message=recvEventData.message.submitAnswersArr;
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol) {
            for(let item in message){
                that._updateStudentShow(message[item]);
            }
        }
    };
    handlerMsglistAnswerIconShow(recvEventData){
        this.state.answerTeachWrapDiv = "block";
        this.setState({answerTeachWrapDiv: this.state.answerTeachWrapDiv});
    }

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that.clearTeacherShowData(); //清空数据
    };

    _updateStudentShow(pubmsgData){
        const that = this ;
        that.state.studentNumbers.push(pubmsgData.fromID);
        let userId = pubmsgData.fromID;
        that.setState({
            studentNumbers: that.state.studentNumbers
        });
        let userSelect = pubmsgData.data.mySelect;
        let userName = pubmsgData.data.sendStudentName;
        let userName0 = userId+"0";
        let userName1 = userId+"1";
        let userName2 = userId+"2"
        that.state.tableObject[userId] = {};
       
        that.state.tableObject[userId][userName0] = pubmsgData.data.sendStudentName;
        that.state.tableObject[userId][userName1] = pubmsgData.data.mySelect;
        that.state.tableObject[userId][userName2] = pubmsgData.ts - pubmsgData.data.times;
        that.state.allStudentChosseAnswer[userId] = {};
        that.state.allStudentChosseAnswer[userId][userName]=userSelect;
        that.setState({
            allStudentChosseAnswer: that.state.allStudentChosseAnswer,
            tableObject:that.state.tableObject
        });
        for(let i = 0; i < that.state.studentNumbers.length; i++) {
            if(pubmsgData.fromID == that.state.studentNumbers[i]) {
                that.state.allStudentChosseAnswer[userId][userName]=userSelect;
                that.state.tableObject[userId][userName0] = pubmsgData.data.sendStudentName;
                that.state.tableObject[userId][userName1] = pubmsgData.data.mySelect;
                that.state.tableObject[userId][userName2] = pubmsgData.ts - pubmsgData.data.times;
                that.setState({
                    allStudentChosseAnswer: that.state.allStudentChosseAnswer,
                    tableObject:that.state.tableObject,
                });
            }
        }
        let newCrr = Array.from(new Set(that.state.studentNumbers));
        that.state.allNumbers = newCrr.length;
        that.state.idA = [];
        that.state.idB = [];
        that.state.idC = [];
        that.state.idD = [];
        that.state.idE = [];
        that.state.idF = [];
        that.state.idG = [];
        that.state.idH = [];
        that.state.afterArrayA = [];
        that.state.afterArrayB = [];
        that.state.afterArrayC = [];
        that.state.afterArrayD = [];
        that.state.afterArrayE = [];
        that.state.afterArrayF = [];
        that.state.afterArrayG = [];
        that.state.afterArrayH = [];
        that.state.trueNum = 0;
        that.setState({afterArrayA:that.state.afterArrayA,afterArrayB:that.state.afterArrayB,afterArrayC:that.state.afterArrayC,afterArrayD:that.state.afterArrayD,afterArrayE:that.state.afterArrayE,
            afterArrayF:that.state.afterArrayF,afterArrayG:that.state.afterArrayG,afterArrayH:that.state.afterArrayH});
        let liLength = pubmsgData.data.mySelect.length;
        for(let a in that.state.allStudentChosseAnswer) {
            for(let names in that.state.allStudentChosseAnswer[a]){
                let namesValue = names;
                that.state.allStudentChosseAnswer[a][namesValue].map((item, index) => {
                    if(item == "A") {
                        that.state.idA.push(namesValue);
                        that.state.afterArrayA = [];
                        that.setState({
                            afterArray: that.state.afterArray
                        });
                        let A = <div className="answer-stu-lis" key={index} style={{height:that.state.idA.length<13?that.state.idA.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayAHide.bind(that)} onMouseOver={that.displayASHow.bind(that)}><p>{that.state.idA.length}</p></div>;
                        that.state.afterArrayA.push(A);
                        that.setState({
                            afterArrayA: that.state.afterArrayA,
                            idA: that.state.idA,
                        })
                    }
                    if(item == "B") {
                        that.state.idB.push(namesValue);
                        that.state.afterArrayB = [];
                        that.setState({
                            afterArray: that.state.afterArray
                        });
                        let B =  <div className="answer-stu-lis" key={index} style={{height:that.state.idB.length<13?that.state.idB.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayBHide.bind(that)} onMouseOver={that.displayBSHow.bind(that)}><p>{that.state.idB.length}</p></div>;
                        that.state.afterArrayB.push(B);
                        that.setState({
                            afterArrayB: that.state.afterArrayB,
                            idB: that.state.idB,
                        })
                    }
                    if(item == "C") {
                        that.state.idC.push(namesValue);
                        that.state.afterArrayC = [];
                        that.setState({
                            afterArray: that.state.afterArray
                        });
                        let C =  <div className="answer-stu-lis" key={index} style={{height:that.state.idC.length<13?that.state.idC.length/10+"rem":1.2+"rem" }} onMouseOut={that.displayCHide.bind(that)} onMouseOver={that.displayCSHow.bind(that)}><p>{that.state.idC.length}</p></div>;
                        that.state.afterArrayC.push(C);
                        that.setState({
                            afterArrayC: that.state.afterArrayC,
                            idC: that.state.idC,
                        })
                    }
                    if(item == "D") {
                        that.state.idD.push(namesValue);
                        that.state.afterArrayD = [];
                        let D =  <div className="answer-stu-lis" key={index} style={{height:that.state.idD.length<13?that.state.idD.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayDHide.bind(that)} onMouseOver={that.displayDSHow.bind(that)}><p>{that.state.idD.length}</p></div>;
                        that.state.afterArrayD.push(D);
                        that.setState({
                            afterArrayD: that.state.afterArrayD,
                            idD: that.state.idD,
                        })
                    }
                    if(item == "E") {
                        that.state.idE.push(namesValue);
                        that.state.afterArrayE = [];
                        let E =  <div className="answer-stu-lis" key={index} style={{height:that.state.idE.length<13?that.state.idE.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayEHide.bind(that)} onMouseOver={that.displayESHow.bind(that)}><p>{that.state.idE.length}</p></div>;
                        that.state.afterArrayE.push(E);
                        that.setState({
                            afterArrayE: that.state.afterArrayE,
                            idE: that.state.idE,
                        })
                    }
                    if(item == "F") {
                        that.state.idF.push(namesValue);
                        that.state.afterArrayF = [];
                        let F =  <div className="answer-stu-lis" key={index} style={{height:that.state.idF.length<13?that.state.idF.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayFHide.bind(that)} onMouseOver={that.displayFSHow.bind(that)}><p>{that.state.idF.length}</p></div>;
                        that.state.afterArrayF.push(F);
                        that.setState({
                            afterArrayF: that.state.afterArrayF,
                            idF: that.state.idF,
                        })
                    }
                    if(item == "G") {
                        that.state.idG.push(namesValue);
                        that.state.afterArrayG = [];
                        let G = <div className="answer-stu-lis" key={index} style={{height:that.state.idG.length<13?that.state.idG.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayGHide.bind(that)} onMouseOver={that.displayGSHow.bind(that)}><p>{that.state.idG.length}</p></div>;
                        that.state.afterArrayG.push(G);
                        that.setState({
                            afterArrayG: that.state.afterArrayG,
                            idG: that.state.idG,
                        })
                    }
                    if(item == "H") {
                        that.state.idH.push(namesValue);
                        that.state.afterArrayH = [];
                        let H =  <div className="answer-stu-lis" key={index} style={{height:that.state.idH.length<13?that.state.idH.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayHHide.bind(that)} onMouseOver={that.displayHSHow.bind(that)}><p>{that.state.idH.length}</p></div>;
                        that.state.afterArrayH.push(H);
                        that.setState({
                            afterArrayH: that.state.afterArrayH,
                            idH: that.state.idH,
                        })
                    }
                })
                let XArry=pubmsgData.data.optionalAnswers
                that.coordArr(XArry);
                that.coordArrX(XArry)
                let newCrrs = Array.from(new Set(that.state.crr));
                newCrrs = newCrrs.sort();
                if(that.state.allStudentChosseAnswer[a][namesValue].sort().toString() == newCrrs.toString()) {
                    that.state.trueNum++;
                    that.setState({
                        trueNum: that.state.trueNum
                    });
                    that.state.trueLV = that.state.trueNum / that.state.allNumbers * 100
                    that.state.trueLV = that.state.trueLV.toFixed(0)
                    that.setState({
                        trueLV: that.state.trueLV
                    })
                } else {
                    let newCrr = Array.from(new Set(that.state.studentNumbers));
                    that.state.trueLV = that.state.trueNum / that.state.allNumbers * 100;
                    that.state.trueLV = that.state.trueLV.toFixed(0)
                    that.setState({
                        trueLV: that.state.trueLV
                    })
                }
            }
        }
    };
    /*表格数据*/
    _loadTableDescArray(tableObject){
        let afterArry = [] ;
        let newCrr=Array.from(new Set(this.state.crr));
        newCrr=newCrr.sort();
        for(let item in tableObject){
            let item0 = item+"0";
            let item1 = item+"1";
            let item2 = item+"2";
            let trueResult = tableObject[item][item1].toString()==newCrr.toString();
            let m = (parseInt(tableObject[item][item2] / 60) < 10 ? '0' + parseInt(tableObject[item][item2] / 60) : parseInt(tableObject[item][item2] / 60));
            let n = (parseInt(tableObject[item][item2] % 60) < 10 ? '0' + parseInt(tableObject[item][item2] % 60) : parseInt(tableObject[item][item2] % 60));
            let student = <tr key ={item}><td>{tableObject[item][item0]}</td><td className={trueResult?'table-true-result':'table-false-result'}>{tableObject[item][item1]}</td><td>{m}:{n}</td></tr>;
            afterArry.push(student)
        }
        return{
            afterArry:afterArry
        }
    };
    _loadTimeDescArray(desc){
        let beforeArray = [] ;
        desc.map((item,index) => {
            let a = <li className="answer-teach-lis" key={item.id} style={{background:this.state.initArr[index].sel? "#2196f3" : null , cursor:"pointer"}}   onClick={this.changeColor.bind(this,index)}>{item.name}</li>;
            beforeArray.push(a)
        });
        return{
            beforeArray:beforeArray
        }
    };
    /*增加*/
    addHandel(e){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            let initLength=this.state.initArr.length;
            if(initLength>=2){
                this.state.plusStyle="#368bcb";
                this.state.reduceStyle="#368bcb";
                this.setState({plusStyle:this.state.plusStyle,reduceStyle:this.state.reduceStyle})
            }
            if(initLength>7){
                this.state.plusStyle="#202C4A";
                this.setState({plusStyle:this.state.plusStyle,})
                return false;
            }
            if(initLength==7){
                this.state.plusStyle="#202C4A";
                this.setState({plusStyle:this.state.plusStyle,})
            }
            this.liArr[initLength].sel=false;
            this.state.initArr.push(this.liArr[initLength])
            this.setState({
                initArr:this.state.initArr
            })
        }
    };
    /* 减少 */
    reduceHandel(e){
    	let arry=[];
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            let initLength=this.state.initArr.length;
            if(initLength>=2){
                this.state.plusStyle="#368bcb";
                this.setState({plusStyle:this.state.plusStyle})
            }
            if(initLength>=3){

                this.state.initArr.pop();
                this.state.reduceStyle="#368bcb";
                this.setState({reduceStyle:this.state.reduceStyle,plusStyle:this.state.plusStyle})
            }
            if(initLength==3){
                this.state.reduceStyle="#202C4A";
                this.setState({reduceStyle:this.state.reduceStyle,})
            }
            for(let [key, value] of Object.entries(this.state.initArr)){ //tkpc2.0.8 start
            	arry.push(value.sel);
            	if(arry.indexOf(true)>=0){
            		this.state.beginStyle="#2196f3";
                    this.setState({beginStyle:this.state.beginStyle});
            	}else{
            		this.state.beginStyle="";
                    this.setState({beginStyle:this.state.beginStyle});
            	}	
            }//tkpc2.0.8 end
            this.setState({
                initArr:this.state.initArr
            });
        }
    };
    // 改变颜色
    changeColor(index,e){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            this.state.crr=[];
            this.state.initArr[index].sel=!this.state.initArr[index].sel;
            this.setState({initArr:this.state.initArr,crr:this.state.crr});
            if(this.state.initArr[index].sel==false){
                this.state.beginStyle="";
                this.setState({beginStyle:this.state.beginStyle});
            }
            for(let value of this.state.initArr){
                if(value.sel){
                    this.state.beginStyle="#2196f3";
                    this.setState({beginStyle:this.state.beginStyle});
                }
            }
        }
    };
    /*开始答题*/
    beginAnswer(e){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            let initLength=this.state.initArr.length;
            for(let i=0;i<this.state.initArr.length;i++){
                if(this.state.initArr[i].sel){
                    this.state.crr.push(this.state.initArr[i].name);
                    this.state.crr=Array.from(new Set(this.state.crr))
                    this.setState({crr:this.state.crr});
                }
            }
            if(e.target.style.background==""){
                return false;
            };
            this.state.afterArrayA = [];
            this.state.afterArrayB = [];
            this.state.afterArrayC = [];
            this.state.afterArrayD = [];
            this.state.afterArrayE = [];
            this.state.afterArrayF = [];
            this.state.afterArrayG = [];
            this.state.afterArrayH = [];
            this.state.answerTeachWrapDiv="none";
            this.state.resultTeachDisplay="block";
            this.state.resultTeachStyleDisplay="none";
            this.state.endQuestion="block";
            this.state.restartQuestion="none";
            this.state.columnar = "block";
            this.state.tableStyle = "none";
            this.state.publishedWarningColor = "#074496";
            this.state.publishAnswerText = TkGlobal.language.languageData.answers.PublishTheAnswer.text;
            this.state.xiangQingText = TkGlobal.language.languageData.answers.details.text;
            this.state.isPublished = false;
            this.state.publishedWarning="none";
            this.setState({
                publishedWarningColor:this.state.publishedWarningColor,
                columnar:this.state.columnar,
                tableStyle:this.state.tableStyle,
                publishedWarning:this.state.publishedWarning,
                isPublished:this.state.isPublished,
                xiangQingText:this.state.xiangQingText,
                publishAnswerText:this.state.publishAnswerText,
                answerTeachWrapDiv:this.state.answerTeachWrapDiv,
                resultTeachDisplay:this.state.resultTeachDisplay,
                resultTeachStyleDisplay:this.state.resultTeachStyleDisplay,
                endQuestion:this.state.endQuestion,
                restartQuestion:this.state.restartQuestion,
                afterArray: this.state.afterArray,
                afterArrayA: this.state.afterArrayA,
                afterArrayB: this.state.afterArrayB,
                afterArrayC: this.state.afterArrayC,
                afterArrayD: this.state.afterArrayD,
                afterArrayE: this.state.afterArrayE,
                afterArrayF: this.state.afterArrayF,
                afterArrayG: this.state.afterArrayG,
                afterArrayH: this.state.afterArrayH,
                trueLV: this.state.trueLV,
                allNumbers: this.state.allNumbers,
                idA: this.state.idA,
                idB: this.state.idB,
                idC: this.state.idC,
                idD: this.state.idD,
                idE: this.state.idE,
                idF: this.state.idF,
                idG: this.state.idG,
                idH: this.state.idH,
            })
            clearInterval(this.stop)
            document.getElementById("result-teach-mytime").textContent="00" + ":" + "00" + ":" + "00";
            this.trueArr();
            this.time_fun();
            for(let value of this.state.initArr){
                value.sel=false;
                this.setState({initArr:this.state.initArr});
            }
            this.state.isShow=false;
            this.setState({isShow:this.state.isShow});
            let iconShow=this.state.isShow;
            let rounds = this.state.round;
            let optionalAnswer=this.state.initArr;
            let studentSels = this.state.brr;
            let trueLV= this.state.trueLV;
            let allNumbers= this.state.allNumbers;
            let dataChoose = this.state.allStudentChosseAnswer;
            let dataTable = this.state.tableObject;
            let idAS = this.state.idA;
            let idBS = this.state.idB;
            let idCS = this.state.idC;
            let idDS = this.state.idD;
            let idES = this.state.idE;
            let idFS = this.state.idF;
            let idGS = this.state.idG;
            let idHS = this.state.idH;
            let isPublished = this.state.isPublished;
            let quizTime=document.getElementById("result-teach-mytime").textContent;
            let newCrr=Array.from(new Set(this.state.crr));
            newCrr=newCrr.sort();
            let data = {
                optionalAnswers:optionalAnswer,
                quizTimes:quizTime,
                rightAnswers:newCrr,
                isRound:rounds,
                studentSelect:studentSels,
                trueLV:trueLV,
                allNumbers:allNumbers,
                dataChoose:dataChoose,
                dataTable:dataTable,
                isPublished:isPublished,
                idAS:idAS,
                idBS:idBS,
                idCS:idCS,
                idDS:idDS,
                idES:idES,
                idFS:idFS,
                idGS:idGS,
                idHS:idHS,
                isShow:iconShow
            }
            ServiceSignalling.sendSignallingAnswerToStudent(data);
            this.coordArr(this.state.initArr);
            this.coordArrX(this.state.initArr);
            this.coordArrHoverDiv(this.state.initArr)
            let {id,percentLeft,percentTop} = this.props;
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'changeDragEleTranstion',
                message: {data: {id, percentLeft, percentTop},isSendSignalling:true},
            });
        }
    };
    //坐标X轴值
    coordArrX(arrX){
        this.state.allResultX = arrX.map((value,index) => {
            return <li key={index} style={{width:1/arrX.length*100-5+"%"}}>{value.name}</li>
        })
        this.setState({
            allResultX:this.state.allResultX
        })
    };
    coordArr(arrX){
        this.state.allResult = arrX.map((value,index) => {
            if(value.name=="A"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayA}</li>
            }
            if(value.name=="B"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayB}</li>
            }
            if(value.name=="C"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayC}</li>
            }
            if(value.name=="D"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayD}</li>
            }
            if(value.name=="E"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayE}</li>
            }
            if(value.name=="F"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayF}</li>
            }
            if(value.name=="G"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayG}</li>
            }
            if(value.name=="H"){
                return <li key={index} style={{width:7.5+"%",left:0.5+"%"}} >{this.state.afterArrayH}</li>
            }
        });
        this.setState({
            allResult:this.state.allResult
        })
    };
    /*鼠標划過bg*/
    coordArrHoverDiv(initArr){
        this.state.allResultHover = initArr.map((value,index) => {
            if(value.name=="A"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=25;
                }if(initArr.length==7){
                    leftValue=20;
                }if(initArr.length==6){
                    leftValue=20;
                }if(initArr.length==5){
                    leftValue=25;
                }if(initArr.length==4){
                    leftValue=25;
                }if(initArr.length==3){
                    leftValue=25;
                }if(initArr.length==2){
                    leftValue=25;
                }
                return <div key={index} className="answer-A-hover" style={{visibility:this.state.liA , marginLeft:leftValue+"%"}}>{this.state.allStudentNameA}</div>
            }
            if(value.name=="B"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-3;
                }if(initArr.length==7){
                    leftValue=5;
                }if(initArr.length==6){
                    leftValue=0;
                }if(initArr.length==5){
                    leftValue=5;
                }if(initArr.length==4){
                    leftValue=10;
                }if(initArr.length==3){
                    leftValue=20;
                }if(initArr.length==2){
                    leftValue=25;
                }
                return <div key={index} className="answer-B-hover" style={{visibility:this.state.liB , marginLeft:leftValue+"%"}}>{this.state.allStudentNameB}</div>
            }
            if(value.name=="C"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-0;
                }if(initArr.length==7){
                    leftValue=0;
                }if(initArr.length==6){
                    leftValue=3;
                }if(initArr.length==5){
                    leftValue=5;
                }if(initArr.length==4){
                    leftValue=10;
                }if(initArr.length==3){
                    leftValue=20;
                }
                return <div key={index} className="answer-C-hover" style={{visibility:this.state.liC , marginLeft:leftValue+"%"}}>{this.state.allStudentNameC}</div>
            }
            if(value.name=="D"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-2;
                }if(initArr.length==7){
                    leftValue=0;
                }if(initArr.length==6){
                    leftValue=3;
                }if(initArr.length==5){
                    leftValue=5;
                }if(initArr.length==4){
                    leftValue=10;
                }
                return <div key={index} className="answer-D-hover" style={{visibility:this.state.liD , marginLeft:leftValue+"%"}}>{this.state.allStudentNameD}</div>
            }
            if(value.name=="E"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-2;
                }if(initArr.length==7){
                    leftValue=0;
                }if(initArr.length==6){
                    leftValue=0;
                }if(initArr.length==5){
                    leftValue=5;
                }
                return <div key={index} className="answer-E-hover" style={{visibility:this.state.liE , marginLeft:leftValue+"%"}}>{this.state.allStudentNameE}</div>
            }
            if(value.name=="F"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-4;
                }if(initArr.length==7){
                    leftValue=0;
                }if(initArr.length==6){
                    leftValue=5;
                }
                return <div key={index} className="answer-F-hover" style={{visibility:this.state.liF , marginLeft:leftValue+"%"}}>{this.state.allStudentNameF}</div>
            }
            if(value.name=="G"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-1;
                }if(initArr.length==7){
                    leftValue=0;
                }
                return <div key={index} className="answer-G-hover" style={{visibility:this.state.liG , marginLeft:leftValue+"%"}}>{this.state.allStudentNameG}</div>
            }
            if(value.name=="H"){
                let leftValue=0
                if(initArr.length==8){
                    leftValue=-5;
                }
                return <div key={index} className="answer-H-hover" style={{visibility:this.state.liH , marginLeft:leftValue+"%"}}>{this.state.allStudentNameH}</div>
            }
        });
        this.setState({
            allResultHover:this.state.allResultHover
        })
    };
    //正确答案
    trueArr(){
        let newCrr=Array.from(new Set(this.state.crr));
        newCrr=newCrr.sort();
        this.state.trueSelect = newCrr.map((value,index) => {
            return <span className="spans" key={index}>{value}</span>
        });
        this.setState({
            trueSelect:this.state.trueSelect
        })
    };
    //计时器
    two_char(n) {
        return n >= 10 ? n : "0" + n;
    };
    /*開始計時*/
    time_fun() {
        //let sec=0;
        let that=this;
        that.stop=setInterval(function () {
            that.setState({
            numz:that.state.numz+1
        	})
            let date = new Date(0, 0);
            date.setSeconds(that.state.numz);
            let h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
            document.getElementById("result-teach-mytime").textContent = that.two_char(h) + ":" + that.two_char(m) + ":" + that.two_char(s);
        }, 1000);
        that.setState({
            stop:that.state.stop
        })
    };
    //结束答题
    endHandel(){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            clearInterval(this.stop);
            this.state.endQuestion="none";
            this.state.restartQuestion="block";
            this.state.resultTeachStyleDisplay="block";
            this.state.round = true;
            if(!TkConstant.joinRoomInfo.isShowTheAnswer){
            	this.state.isPublished=true;  // tkpc2.0.8  暂时不需要公布答案的功能，暂时隐去
            };
            this.setState({
                endQuestion:this.state.endQuestion,
                restartQuestion:this.state.restartQuestion,
                round:this.state.round,
                resultTeachStyleDisplay:this.state.resultTeachStyleDisplay,
                isPublished:this.state.isPublished
            })
            this.state.isShow=false;
            this.setState({isShow:this.state.isShow});
            let iconShow=this.state.isShow;
            let quizTime=document.getElementById("result-teach-mytime").textContent;
            let optionalAnswer=this.state.initArr;
            let newCrr=Array.from(new Set(this.state.crr));
            let	teacherTrueSelect=newCrr.sort();
            let studentSels = this.state.brr;
            let trueLV= this.state.trueLV;
            let rounds= this.state.round;
            let allNumbers= this.state.allNumbers;
            let dataChoose = this.state.allStudentChosseAnswer;
            let dataTable = this.state.tableObject;
            let isPublished = this.state.isPublished;
            let idAS = this.state.idA;
            let idBS = this.state.idB;
            let idCS = this.state.idC;
            let idDS = this.state.idD
            let idES = this.state.idE
            let idFS = this.state.idF
            let idGS = this.state.idG
            let idHS = this.state.idH
            let data={
                optionalAnswers:optionalAnswer,
                quizTimes:quizTime,
                rightAnswers:teacherTrueSelect,
                isRound:rounds,
                studentSelect:studentSels,
                trueLV:trueLV,
                allNumbers:allNumbers,
                dataChoose:dataChoose,
                dataTable:dataTable,
                isPublished:isPublished,
                idAS:idAS,
                idBS:idBS,
                idCS:idCS,
                idDS:idDS,
                idES:idES,
                idFS:idFS,
                idGS:idGS,
                idHS:idHS,
                isShow:iconShow
            }
            ServiceSignalling.sendSignallingAnswerToStudent(data);
            this.state.isPublished=true;
            this.setState({
                isPublished:this.state.isPublished
            });
        }
    }
    //重新开始
    restartHandel(){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            this.clearTeacherShowData();
            clearInterval(this.stop);
            document.getElementById("result-teach-mytime").textContent = "00" + ":" + "00" + ":" + "00";
            this.state.initArr=[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false}]
            this.state.answerTeachWrapDiv="block";
            this.state.allStudentName=[];
            this.state.tableArry=[];
            this.state.allStudentChosseAnswer={};
            this.state.round = false;
            this.state.crr=[];
            this.state.brr=[];
            this.state.trueLV = 0;
            this.state.allNumbers=0;
            this.state.studentNumbers=[];
            this.state.tableObject={};
            this.state.isPublished=false;
            this.state.publishAnswerText="";
            this.state.allResult="";
            this.setState({
                allResult:this.state.allResult,
                publishAnswerText:this.state.publishAnswerText,
                tableObject:this.state.tableObject,
                tableArry:this.state.tableArry,
                allStudentChosseAnswer:this.state.allStudentChosseAnswer,
                studentNumbers:this.state.studentNumbers,
                brr:this.state.brr,
                crr:this.state.crr,
                trueLV:this.state.trueLV,
                allNumbers:this.state.allNumbers,
                answerTeachWrapDiv:this.state.answerTeachWrapDiv,
                allStudentName:this.state.allStudentName,
                round:this.state.round,
                initArr:this.state.initArr,
                isPublished:this.state.isPublished
            });
            this.state.isShow=true;
            this.setState({isShow:this.state.isShow});
            let iconShow=this.state.isShow;
            let quizTime=document.getElementById("result-teach-mytime").textContent;
            let optionalAnswer=this.state.initArr;
            let newCrr=Array.from(new Set(this.state.crr));
            let	teacherTrueSelect=newCrr.sort();
            let studentSels = this.state.brr;
            let trueLV= this.state.trueLV;
            let rounds= this.state.round;
            let allNumbers= this.state.allNumbers;
            let dataChoose = this.state.allStudentChosseAnswer;
            let dataTable = this.state.tableObject;
            let isPublished = this.state.isPublished;
            let idAS = this.state.idA;
            let idBS = this.state.idB;
            let idCS = this.state.idC;
            let idDS = this.state.idD
            let idES = this.state.idE
            let idFS = this.state.idF
            let idGS = this.state.idG
            let idHS = this.state.idH
            let data={
                optionalAnswers:optionalAnswer,
                quizTimes:quizTime,
                rightAnswers:teacherTrueSelect,
                isRound:rounds,
                studentSelect:studentSels,
                trueLV:trueLV,
                allNumbers:allNumbers,
                dataChoose:dataChoose,
                dataTable:dataTable,
                isPublished:isPublished,
                idAS:idAS,
                idBS:idBS,
                idCS:idCS,
                idDS:idDS,
                idES:idES,
                idFS:idFS,
                idGS:idGS,
                idHS:idHS,
                isShow:iconShow
            }
            let isDelMsg=true;
            ServiceSignalling.sendSignallingAnswerToStudent(data,isDelMsg);
            isDelMsg=false;
            ServiceSignalling.sendSignallingAnswerToStudent(data,isDelMsg);
        }
    };
    /*公布答案*/
    publishAnswerHandel(e){
        if(this.state.isPublished==false){
            this.state.publishedWarning="block";
            this.setState({publishedWarning:this.state.publishedWarning})
            return false;
        }
        e.target.textContent = TkGlobal.language.languageData.answers.published.text;
        this.state.publishedWarningColor = "#3C75BB";
        this.state.publishedWarning="none";
        this.setState({
            publishAnswerText: this.state.publishAnswerText,
            publishedWarning:this.state.publishedWarning,
            publishedWarningColor:this.state.publishedWarningColor
        });
        let iconShow=this.state.isShow;
        let quizTime=document.getElementById("result-teach-mytime").textContent;
        let optionalAnswer=this.state.initArr;
        let newCrr=Array.from(new Set(this.state.crr));
        let	teacherTrueSelect=newCrr.sort();
        let studentSels = this.state.brr;
        let trueLV= this.state.trueLV;
        let rounds= this.state.round;
        let allNumbers= this.state.allNumbers;
        let dataChoose = this.state.allStudentChosseAnswer;
        let dataTable = this.state.tableObject;
        let isPublished = this.state.isPublished;
        let idAS = this.state.idA;
        let idBS = this.state.idB;
        let idCS = this.state.idC;
        let idDS = this.state.idD
        let idES = this.state.idE
        let idFS = this.state.idF
        let idGS = this.state.idG
        let idHS = this.state.idH
        let data={
            optionalAnswers:optionalAnswer,
            quizTimes:quizTime,
            rightAnswers:teacherTrueSelect,
            isRound:rounds,
            studentSelect:studentSels,
            trueLV:trueLV,
            allNumbers:allNumbers,
            dataChoose:dataChoose,
            dataTable:dataTable,
            isPublished:isPublished,
            idAS:idAS,
            idBS:idBS,
            idCS:idCS,
            idDS:idDS,
            idES:idES,
            idFS:idFS,
            idGS:idGS,
            idHS:idHS,
            isShow:iconShow
        }
        ServiceSignalling.sendSignallingAnswerToStudent(data);//是否公布答案
    };
    /*图表*/
    xiangQingHandel(){
        this.state.isXiangQing = !this.state.isXiangQing;
        this.state.publishedWarning="none";
        this.setState({
            isXiangQing:this.state.isXiangQing,
            publishedWarning:this.state.publishedWarning,
        });
        if(this.state.isXiangQing){
            this.state.columnar = "none";
            this.state.tableStyle = "block";
            this.state.xiangQingText = TkGlobal.language.languageData.answers.statistics.text;
            this.setState({
                columnar:this.state.columnar,
                tableStyle:this.state.tableStyle,
                xiangQingText:this.state.xiangQingText
            })
        }else{
            this.state.columnar = "block";
            this.state.tableStyle = "none";
            this.state.xiangQingText = TkGlobal.language.languageData.answers.details.text;
            this.setState({
                columnar:this.state.columnar,
                tableStyle:this.state.tableStyle,
                xiangQingText:this.state.xiangQingText
            })
        }

    };
    /*清空数据*/
    clearTeacherShowData(){
        for(let value of this.state.initArr){
            value.sel=false;
            this.setState({initArr:this.state.initArr});
        };
        clearInterval(this.stop)
        this.state.trueNum = 0;
        this.state.numz = 0 ; // tkpc2.0.8
        this.state.brr = [];
        this.state.crr = [];
        this.state.afterArrayA = [];
        this.state.afterArrayB = [];
        this.state.afterArrayC = [];
        this.state.afterArrayD = [];
        this.state.afterArrayE = [];
        this.state.afterArrayF = [];
        this.state.afterArrayG = [];
        this.state.afterArrayH = [];
        this.state.afterArray = [];
        this.state.studentNumbers=[];
        this.state.allStudentName = [];
        this.state.tableObject={};
        this.state.trueLV = 0;
        this.state.allNumbers = 0;
        this.state.idA = [];
        this.state.idB = [];
        this.state.idC = [];
        this.state.idD = [];
        this.state.idE = [];
        this.state.idF = [];
        this.state.idG = [];
        this.state.idH = [];
        this.state.tableArry=[];
        this.state.initArr = [{
            id: 0,
            "name": "A",
            "sel": false
        }, {
            id: 1,
            "name": "B",
            "sel": false
        }, {
            id: 2,
            "name": "C",
            "sel": false
        }, {
            id: 3,
            "name": "D",
            "sel": false
        }]
        document.getElementById("result-teach-mytime").textContent = "00" + ":" + "00" + ":" + "00";
        this.state.endQuestion = "block";
        this.state.restartQuestion = "none";
        this.state.beginStyle = "";
        this.state.resultTeachDisplay = "none";
        this.state.plusStyle = "#368bcb";
        this.state.reduceStyle = "#368bcb";
        this.state.publishedWarning="none";
        this.setState({
        	numz: this.state.numz,// tkpc2.0.8
            publishedWarning:this.state.publishedWarning,
            tableObject:this.state.tableObject,
            tableArry:this.state.tableArry,
            endQuestion: this.state.endQuestion,
            studentNumbers:this.state.studentNumbers,
            restartQuestion: this.state.restartQuestion,
            answerTeachWrapDiv: this.state.answerTeachWrapDiv,
            resultTeachDisplay: this.state.resultTeachDisplay,
            beginStyle: this.state.beginStyle,
            brr: this.state.brr,
            crr: this.state.crr,
            initArr: this.state.initArr,
            afterArray: this.state.afterArray,
            afterArrayA: this.state.afterArrayA,
            afterArrayB: this.state.afterArrayB,
            afterArrayC: this.state.afterArrayC,
            afterArrayD: this.state.afterArrayD,
            afterArrayE: this.state.afterArrayE,
            afterArrayF: this.state.afterArrayF,
            afterArrayG: this.state.afterArrayG,
            afterArrayH: this.state.afterArrayH,
            trueLV: this.state.trueLV,
            allNumbers: this.state.allNumbers,
            idA: this.state.idA,
            idB: this.state.idB,
            idC: this.state.idC,
            idD: this.state.idD,
            idE: this.state.idE,
            idF: this.state.idF,
            idG: this.state.idG,
            idH: this.state.idH,
            trueNum: this.state.trueNum,
            plusStyle: this.state.plusStyle,
            reduceStyle: this.state.plusStyle,
        })
    }
    /*选择答案界面关闭*/
    answerTeachCloseHandel (){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            this.state.answerTeachWrapDiv="none";
            this.clearTeacherShowData();
            for(let value of this.state.initArr){
                value.sel=false;
                this.setState({initArr:this.state.initArr});
            }
            clearInterval(this.stop);
            this.state.allStudentChosseAnswer={};
            this.state.tableObject={};
            this.state.tableArry=[];
            document.getElementById("result-teach-mytime").textContent="00"+":"+"00"+":"+"00";
            this.state.round = false;
            this.state.plusStyle="#368bcb";
            this.state.reduceStyle="#368bcb";
            this.state.endQuestion="block";
            this.state.restartQuestion="none";
            this.state.crr=[];
            this.state.trueSelect="";
            this.state.beginStyle="";
            this.state.trueLV=0;
            this.state.allNumbers=0;
            this.state.initArr=[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false}];
            this.state.isPublished=false;
            this.state.publishAnswerText= TkGlobal.language.languageData.answers.PublishTheAnswer.text;
            this.state.publishedWarning="none";
            this.setState({
                publishedWarning:this.state.publishedWarning,
                publishAnswerText:this.state.publishAnswerText,
                isPublished:this.state.isPublished,
                tableObject:this.state.tableObject,
                tableArry:this.state.tableArry,
                allStudentChosseAnswer:this.state.allStudentChosseAnswer,
                answerTeachWrapDiv:this.state.answerTeachWrapDiv,
                initArr:this.state.initArr,
                beginStyle:this.state.beginStyle,
                plusStyle:this.state.plusStyle,
                trueLV:this.state.trueLV,
                allNumbers:this.state.allNumbers,
                reduceStyle:this.state.plusStyle,
                crr:this.state.crr,
                trueSelect:this.state.trueSelect,
                endQuestion:this.state.endQuestion,
                restartQuestion:this.state.restartQuestion,
                round:this.state.round,
            });
            let data={
                answerClose:'none'
            };
            let isDelMsg=true;
            ServiceSignalling.sendSignallingAnswerToStudent(data , isDelMsg);
            //初始化拖拽元素的位置
			let {id} = this.props;
			let percentLeft = 0;
			let percentTop = 0;
			eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:true},});
        }
    };
    /*结果界面关闭*/
    resultTeachCloseHandel(){
        if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant){
            this.clearTeacherShowData();
            clearInterval(this.stop);
            this.state.round = false;
            this.state.allStudentChosseAnswer={};
            this.state.tableObject={};
            this.state.tableArry=[];
            this.state.isPublished=false;
            document.getElementById("result-teach-mytime").textContent="00"+":"+"00"+":"+"00";
            this.state.plusStyle="#368bcb";
            this.state.reduceStyle="#368bcb";
            this.state.resultTeachDisplay="none";
            this.state.endQuestion="block";
            this.state.restartQuestion="none";
            this.state.crr=[];
            this.state.trueSelect="";
            this.state.trueLV=0;
            this.state.allNumbers=0;
            this.state.publishAnswerText= TkGlobal.language.languageData.answers.PublishTheAnswer.text;
            this.state.publishedWarning="none";
            this.setState({
                publishedWarning:this.state.publishedWarning,
                isPublished:this.state.isPublished,
                publishAnswerText:this.state.publishAnswerText,
                tableObject:this.state.tableObject,
                tableArry:this.state.tableArry,
                allStudentChosseAnswer:this.state.allStudentChosseAnswer,
                resultTeachDisplay:this.state.resultTeachDisplay,
                plusStyle:this.state.plusStyle,
                round:this.state.round,
                trueLV:this.state.trueLV,
                allNumbers:this.state.allNumbers,
                reduceStyle:this.state.plusStyle,
                crr:this.state.crr,
                trueSelect:this.state.trueSelect,
                endQuestion:this.state.endQuestion,
                restartQuestion:this.state.restartQuestion
            });
            let data={
                answerClose:'none'
            }
            let isDelMsg=true;
            ServiceSignalling.sendSignallingAnswerToStudent(data , isDelMsg);
            //初始化拖拽元素的位置
			let {id} = this.props;
			let percentLeft = 0;
			let percentTop = 0;
			eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:true},});
        }
    };
    render(){
        let that = this;
        let {initArr , brr ,tableObject} = this.state ;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = that.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
        if (isDragging) {
            //layerIsShowOfDraging = false;
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }
        let {beforeArray} = this._loadTimeDescArray(initArr);
        let {afterArry} = this._loadTableDescArray(tableObject);
        let answerDragStyle = {
            position: 'absolute',
            zIndex: 110,
            display: 'inline-block',
            transition: 'all 0.4s',
            cursor: "move",
            left: (isDrag ? pagingToolLeft : "0") + "rem",
            top: (isDrag ? pagingToolTop : "0") + "rem"
        };
        return connectDragSource(
			<div id="answerDrag" style={answerDragStyle}>
				<div className="answer-teach-wrapDiv"  style={{display:this.state.answerTeachWrapDiv}} ref="dragBox">
					<div className="answer-teach-header" >
						<div className="answer-teach-header-left">
							<span className="answer-teach-headerImg"></span>
							<span className="answer-teach-header-left-grey">{TkGlobal.language.languageData.answers.headerTopLeft.text}</span>
							<span className="answer-teach-header-left-green">{TkGlobal.language.languageData.answers.headerMiddel.text}</span>
						</div>
						<div className="answer-teach-header-right" onClick={this.answerTeachCloseHandel.bind(this)}></div>
					</div>
					<div className="answer-teach-content">
						<ul className="answer-teach-optionUl" >
                            {beforeArray}
						</ul>
						<div className="answer-teach-add" ref="addDiv" onClick={this.addHandel.bind(this)} style={{background:this.state.plusStyle}}>+</div>
						<div className="answer-teach-reduce" ref="reduceDiv" onClick={this.reduceHandel.bind(this)} style={{background:this.state.reduceStyle}}>-</div>
						<div className="answer-teach-begin" onClick={this.beginAnswer.bind(this)} style={{background:this.state.beginStyle}}>{TkGlobal.language.languageData.answers.beginAnswer.text}</div>
					</div>
				</div>
				<div  className="result-teach-wrapDiv" style={{display:this.state.resultTeachDisplay}} ref="resultRef">
					<div className="result-teach-header" >
						<div className='result-teach-header-left'>
							<span className="result-teach-headerImg"></span>
							<span className="result-teach-header-left-grey">{TkGlobal.language.languageData.answers.headerTopLeft.text}</span>
							<span id="result-teach-mytime"></span>
						</div>
						<p className="result-teach-close" onClick={this.resultTeachCloseHandel.bind(this)} style={{display:this.state.resultTeachStyleDisplay}}></p>
					</div>
					<div className="result-teach-content">
						<p className="answersPeople">{TkGlobal.language.languageData.answers.numberOfAnswer.text}:<span ref="anss">{this.state.allNumbers}</span><span className="xiang-qing-div" onClick={this.xiangQingHandel.bind(this)}>({this.state.xiangQingText})</span></p>
						<span className="result-teach-accuracy-right"><span className="result-teach-accuracy-right-text">{TkGlobal.language.languageData.answers.tureAccuracy.text}：</span><span style={{color:"red"}}>{this.state.trueLV}%</span></span>
						<div className="result-teach-coordinate-div" style={{display:this.state.columnar}}>
							<span className="result-teach-heart-span">0</span>
							<div className="result-teach-staff-div">
								<ul className="result-student-allResult">
                                    {this.state.allResult}
								</ul>
							</div>
							<div className="answer-hover">
                                {this.state.allResultHover}
							</div>
							<ul className="result-teach-allResult" >
                                {this.state.allResultX}
							</ul>
						</div>
						<div className="answer-table-div" style={{display:this.state.tableStyle}}>
							<table className="answer-table" >
								<tbody>
								<tr className="answer-table-first-tr">
									<th>{TkGlobal.language.languageData.answers.student.text}</th>
									<th>{TkGlobal.language.languageData.answers.TheSelectedTheAnswer.text}</th>
									<th>{TkGlobal.language.languageData.answers.AnswerTime.text}</th>
								</tr>
                                {afterArry}
								</tbody>
							</table>
						</div>
						<div className="result-teach-true-result">
							<span style={{color:"white"}}>{TkGlobal.language.languageData.answers.trueAnswer.text}:</span>
							<span className="result-teach-trueSelect">{this.state.trueSelect}</span>
							<span className="result-teach-published-warning" style={{display:this.state.publishedWarning}}>{TkGlobal.language.languageData.answers.end.text}</span>
							<span className="publish-the-answer" onClick={this.publishAnswerHandel.bind(this)} style={{background:this.state.publishedWarningColor,display:TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.isShowTheAnswer?"block":"none"}}>{this.state.publishAnswerText}</span>
						</div>
						<div className="result-teach-end-question" style={{display:this.state.endQuestion}} onClick={this.endHandel.bind(this)}>{TkGlobal.language.languageData.answers.endAnswer.text}</div>
						<div className="result-teach-restart-question" style={{display:this.state.restartQuestion}} onClick={this.restartHandel.bind(this)}>{TkGlobal.language.languageData.answers.restarting.text}</div>

					</div>
				</div>
				<AnswerStudentToolSmart />
			</div>
        )
    }
}

export default DragSource('talkDrag', specSource, collect)(AnswerTeachingToolSmart);
