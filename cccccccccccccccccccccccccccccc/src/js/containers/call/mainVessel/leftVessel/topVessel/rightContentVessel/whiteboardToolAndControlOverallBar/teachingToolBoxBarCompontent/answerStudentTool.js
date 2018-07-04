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

class AnswerStudentToolSmart extends React.Component {
	constructor(props){
		super(props);
		this.state={
			initArr:[],
			brr:[],
            allResult:"",
            allResultX:"",
            allResultHover:"",
			crr:[],
            trueSelect:"",
            answerTeachWrapDiv:'none',
            resultStudentDisplay:null,
            beginStyle:null,
			lisStyle:false,
            resultTeachStyleDisplay:null,
            changeOneAnswerStyle:"none",
            mySelect:'',
            trueLV:0,
            allNumbers:0,
            afterArrayA:[],
            afterArrayB:[],
            afterArrayC:[],
            afterArrayD:[],
            afterArrayE:[],
            afterArrayF:[],
            afterArrayG:[],
            afterArrayH:[],
            allStudentNameA:[],
            allStudentNameB:[],
            allStudentNameC:[],
            allStudentNameD:[],
            allStudentNameE:[],
            allStudentNameF:[],
            allStudentNameG:[],
            allStudentNameH:[],
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
            userAdmin:"",
            dataInit:[],
            trueResultDivStyle:"",
            teacherSendTime:"",
            xiangQingText:"",
            columnar:"",
            tableStyle:"",
            tableObject:"",
            userSelect:[],
            mouseShape:false,
		};
		this.selects=false;
		this.stop=null;
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-submitAnswers" , that.handlerMsglistResultStudent.bind(that), that.listernerBackupid);
    	eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-answer" , that.handlerMsglistAnswerShow.bind(that), that.listernerBackupid);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
	handlerRoomPubmsg(recvEventData){
		const that = this ;
		let pubmsgData = recvEventData.message ;
		switch(pubmsgData.name)
		{
			case "answer":
				if (TkConstant.hasRole.roleStudent) {
                	that._updateAnswerShow(pubmsgData);
				}
				break;
			case "submitAnswers":
			if (TkConstant.hasRole.roleStudent) {
            	that._updateSubmitAnswerShow(pubmsgData);
			}
			break;
		}
	};
	handlerRoomDelmsg(recvEventData){
		const that = this ;
		let pubmsgData = recvEventData.message ;
		switch(pubmsgData.name)
		{	
				case "ClassBegin":
				that.state.resultStudentDisplay="none";
				that.state.answerTeachWrapDiv="none";
				that.setState({
					answerTeachWrapDiv:that.state.answerTeachWrapDiv,
					resultStudentDisplay:that.state.resultStudentDisplay
				})
				break;
			
			case "answer":
               	that.state.answerTeachWrapDiv="none";
				that.state.resultStudentDisplay="none";
				that.state.userSelect = []; // tkpc2.0.8
				that.state.crr=[];
				that.setState({
					answerTeachWrapDiv:that.state.answerTeachWrapDiv,
					resultStudentDisplay:that.state.answerTeachWrapDiv,//tkpc2.0.8
					crr:that.state.crr, //tkpc2.0.8
					userSelect:that.state.userSelect //tkpc2.0.8
				});
				break;
		}
	};
	/*answer的message-list*/
	handlerMsglistAnswerShow(recvEventData){
        const that = this ;
        let message=recvEventData.message.answerShowArr;
        for(let message of recvEventData.message.answerShowArr){
         if (TkConstant.hasRole.roleStudent) {
        	 that._updateAnswerShow(message);
    	}
       }
	};
	/*submit的message-list*/
	handlerMsglistResultStudent(recvEventData){
		 const that = this ;
        let message=recvEventData.message.submitAnswersArr;
        for(let message of recvEventData.message.submitAnswersArr){
         if (TkConstant.hasRole.roleStudent&&ServiceRoom.getTkRoom().getMySelf().id==message.fromID) {
        	 that._updateSubmitAnswerShow(message);
    		}
        }
	};
	_updateSubmitAnswerShow(pubmsgData){
		if(pubmsgData.data.sendUserID == ServiceRoom.getTkRoom().getMySelf().id){
			this.state.userSelect = pubmsgData.data.mySelect;
			this.state.initArr = pubmsgData.data.optionalAnswers ; //tkpc2.0.8 start
			this.state.crr = pubmsgData.data.mySelect;
	        if(this.state.userSelect.length>0){
				this.state.beginStyle = "#2196f3";
				this.state.lisStyle = true ;
				ReactDOM.findDOMNode(this.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.changeAnswer.text;
			}else{
				this.state.beginStyle = " ";
				this.state.lisStyle = false ;
				ReactDOM.findDOMNode(this.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
			}
			this.setState({ //tkpc2.0.8 end
					beginStyle: this.state.beginStyle,
					userSelect: this.state.userSelect,
	                initArr:this.state.initArr ,
	                crr:this.state.crr
				});
		}
	}
	_updateAnswerShow(pubmsgData){
        const that = this;
        if (pubmsgData.data.isShow == false) {
            that.state.brr = pubmsgData.data.rightAnswers;
            that.state.lisStyle = false;
            that.state.answerAddStyle = "hidden";
            that.state.answerReduceStyle = "hidden";
            that.state.answerTeachWrapDiv = "block";
            that.state.teacherSendTime = pubmsgData.ts;
            that.state.changeOneAnswerStyle = "none";
            ReactDOM.findDOMNode(that.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
            that.state.beginStyle="";
            that.state.initArr = pubmsgData.data.optionalAnswers;
            for (let value of that.state.initArr) {
                value.sel = false;
            }
            that.setState({
                answerTeachWrapDiv: that.state.answerTeachWrapDiv,
                answerAddStyle: that.state.answerAddStyle,
                initArr: that.state.initArr,
                brr: that.state.brr,
                lisStyle: that.state.lisStyle,
                beginStyle:that.state.beginStyle,
                changeOneAnswerStyle:that.state.changeOneAnswerStyle,
                teacherSendTime:that.state.teacherSendTime
            });

            if (pubmsgData.data.isRound) {
                that.state.trueLV = pubmsgData.data.trueLV;
                that.state.allNumbers = pubmsgData.data.allNumbers;
                that.state.dataInit = pubmsgData.data.optionalAnswers;
                that.setState({
                    trueLV: that.state.trueLV,
                    allNumbers: that.state.allNumbers,
                    dataInit: that.state.dataInit
                });
                that.coordArr();
                that.trueArr();
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
                for (var a in pubmsgData.data.dataChoose) {
                	for(var i in pubmsgData.data.dataChoose[a]){
                    pubmsgData.data.dataChoose[a][i].map((item, index) => {
                        if (item == "A") {
                            that.state.idA = pubmsgData.data.idAS;
                            that.state.afterArrayA = [];
                            that.setState({
                                afterArray: that.state.afterArray
                            });
                            let A = <div className="answer-stu-lis" key={index} style={{height:that.state.idA.length<13?that.state.idA.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayAHide.bind(that)} onMouseOver={that.displayASHow.bind(that)}>
                            			<p>{that.state.idA.length}</p>
									</div>;
                            that.state.afterArrayA.push(A);
                            that.setState({
                                afterArrayA: that.state.afterArrayA,
                                idA: that.state.idA,
                            })
                        }
                        if (item == "B") {
                            that.state.idB = pubmsgData.data.idBS;
                            that.state.afterArrayB = [];
                            that.setState({
                                afterArray: that.state.afterArray
                            });
                            let B = <div className="answer-stu-lis" key={index} style={{height:that.state.idB.length<13?that.state.idB.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayBHide.bind(that)} onMouseOver={that.displayBSHow.bind(that)}>
                            			<p>{that.state.idB.length}</p>
									</div>;
                            that.state.afterArrayB.push(B);
                            that.setState({
                                afterArrayB: that.state.afterArrayB,
                                idB: that.state.idB,
                            })
                        }
                        if (item == "C") {
                            that.state.idC = pubmsgData.data.idCS;
                            that.state.afterArrayC = [];
                            that.setState({
                                afterArray: that.state.afterArray
                            });
                            let C = <div className="answer-stu-lis" key={index} style={{height:that.state.idC.length<13?that.state.idC.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayCHide.bind(that)} onMouseOver={that.displayCSHow.bind(that)}>
                            			<p>{that.state.idC.length}</p>
									</div>;
                            that.state.afterArrayC.push(C);
                            that.setState({
                                afterArrayC: that.state.afterArrayC,
                                idC: that.state.idC,
                            })
                        }
                        if (item == "D") {
                            that.state.idD = pubmsgData.data.idDS;
                            that.state.afterArrayD = [];
                            let D = <div className="answer-stu-lis" key={index} style={{height:that.state.idD.length<13?that.state.idD.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayDHide.bind(that)} onMouseOver={that.displayDSHow.bind(that)}>
										 <p>{that.state.idD.length}</p>
									</div>;
                            that.state.afterArrayD.push(D);
                            that.setState({
                                afterArrayD: that.state.afterArrayD,
                                idD: that.state.idD,
                            })
                        }
                        if (item == "E") {
                            that.state.idE = pubmsgData.data.idES;
                            that.state.afterArrayE = [];
                            let E = <div className="answer-stu-lis" key={index} style={{height:that.state.idE.length<13?that.state.idE.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayEHide.bind(that)} onMouseOver={that.displayESHow.bind(that)}>
										 <p>{that.state.idE.length}</p>
									</div>;
                            that.state.afterArrayE.push(E);
                            that.setState({
                                afterArrayE: that.state.afterArrayE,
                                idE: that.state.idE,
                            })
                        }
                        if (item == "F") {
                            that.state.idF = pubmsgData.data.idFS;
                            that.state.afterArrayF = [];
                            let D = <div className="answer-stu-lis" key={index} style={{height:that.state.idF.length<13?that.state.idF.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayFHide.bind(that)} onMouseOver={that.displayFSHow.bind(that)}>
										 <p>{that.state.idF.length}</p>
									</div>;
                            that.state.afterArrayF.push(D);
                            that.setState({
                                afterArrayF: that.state.afterArrayF,
                                idF: that.state.idF,
                            })
                        }
                        if (item == "G") {
                            that.state.idG = pubmsgData.data.idGS;
                            that.state.afterArrayG = [];
                            let G = <div className="answer-stu-lis" key={index} style={{height:that.state.idG.length<13?that.state.idG.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayGHide.bind(that)} onMouseOver={that.displayGSHow.bind(that)}>
										 <p>{that.state.idG.length}</p>
									</div>;
                            that.state.afterArrayG.push(G);
                            that.setState({
                                afterArrayG: that.state.afterArrayG,
                                idG: that.state.idG,
                            })
                        }
                        if (item == "H") {
                            that.state.idH = pubmsgData.data.idHS;
                            that.state.afterArrayH = [];
                            let H = <div className="answer-stu-lis" key={index} style={{height:that.state.idH.length<13?that.state.idH.length/10+"rem":1.2+"rem"}} onMouseOut={that.displayHHide.bind(that)} onMouseOver={that.displayHSHow.bind(that)}>
										 <p>{that.state.idH.length}</p>
									</div>;
                            that.state.afterArrayH.push(H);
                            that.setState({
                                afterArrayH: that.state.afterArrayH,
                                idH: that.state.idH,
                            })
                        }
                    })
				}
				}
                that.coordArrX();
                that.coordArrHoverDiv();
                setTimeout(function(){ //tkpc2.0.8
                	that.mySelectArr(that.state.userSelect)
                },10);
                that.state.resultStudentDisplay = "block";
                document.getElementById("result-teach-mytimes").textContent = pubmsgData.data.quizTimes;
                that.state.resultStudentDisplay = "block";
                that.state.answerTeachWrapDiv = "none";
                that.state.beginStyle = "";
                that.state.trueResultDivStyle="hidden";
                that.state.columnar = "block";
                that.state.tableStyle = "none";
                that.state.tableObject = pubmsgData.data.dataTable;
                ReactDOM.findDOMNode(this.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
                that.state.xiangQingText = TkGlobal.language.languageData.answers.details.text;
                that.setState({
                	columnar:that.state.columnar,
                	tableStyle:that.state.tableStyle,
                	tableObject:that.state.tableObject,
                    resultStudentDisplay: that.state.resultStudentDisplay,
                    answerTeachWrapDiv: that.state.answerTeachWrapDiv,
                    beginStyle: that.state.beginStyle,
                    trueResultDivStyle:that.state.trueResultDivStyle,
                    xiangQingText:that.state.xiangQingText
                });
                if(pubmsgData.data.isPublished){
                	that.state.trueResultDivStyle="visible";
                	that.setState({
                    trueResultDivStyle:that.state.trueResultDivStyle,
                    
                	});
                }
            } else {
                that.state.resultStudentDisplay = "none";
                that.state.answerTeachWrapDiv = "block";
                ReactDOM.findDOMNode(that.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
                that.state.beginStyle="";
                that.setState({
                    answerTeachWrapDiv: that.state.answerTeachWrapDiv,
                    resultStudentDisplay: that.state.resultStudentDisplay,
                    beginStyle:that.state.beginStyle
                });
            }
        } else {
            that.state.crr = [];
            that.state.answerTeachWrapDiv = "none";
            that.state.resultStudentDisplay = "none";
            that.setState({
                answerTeachWrapDiv: that.state.answerTeachWrapDiv,
                resultStudentDisplay: that.state.resultStudentDisplay,
                crr: that.state.crr
            });
        }
    };
    /*显示*/
	displayASHow() {
	 	this.state.liA = "visible";
	 	this.setState({
	 		liA: this.state.liA
	 	});
	 	this.state.allStudentNameA = this.state.idA.map((item, index) => {
	 		return <p key={index} style={{display:this.state.liA}}>{item}</p>
	 	});
	 	this.coordArrHoverDiv();
	 	this.setState({
	 		allStudentNameA: this.state.allStudentNameA
	 	});
	 };
	 /*隐藏*/
	displayAHide() {
	 	this.state.liA = "hidden";
	 	this.setState({
	 		liA: this.state.liA
	 	});
	 	this.state.allStudentNameA = this.state.idA.map((item, index) => {
	 		return <p key={index} style={{display:this.state.liA}}>{item}</p>
	 	});
	 	this.coordArrHoverDiv();
	 	this.setState({
	 		allStudentNameA: this.state.allStudentNameA
	 	});
	 };
	displayBSHow() {
	 	this.state.liB = "visible";
	 	this.setState({
	 		liB: this.state.liB
	 	});
	 	this.coordArrHoverDiv();
	 	this.state.allStudentNameB = this.state.idB.map((item, index) => {
	 		return <p key={index} style={{display:this.state.liB}}>{item}</p>
	 	});
	 	this.setState({
	 		allStudentNameB: this.state.allStudentNameB
	 	});
	 };
	displayBHide() {
		this.state.liB = "hidden";
		this.setState({
			liB: this.state.liB
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameB = this.state.idB.map((item, index) => {
			return <p key={index} style={{display:this.state.liB}}>{item}</p>
		});
		this.setState({
			allStudentNameB: this.state.allStudentNameB
		});
	};
	displayCSHow() {
		this.state.liC = "visible";
		this.setState({
			liC: this.state.liC
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameC = this.state.idC.map((item, index) => {
			return <p  key={index} style={{display:this.state.liC}}>{item}</p>
		});
		this.setState({
			allStudentNameC: this.state.allStudentNameC
		});
	};
	displayCHide() {
		this.state.liC = "hidden";
		this.setState({
			liC: this.state.liC
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameC = this.state.idC.map((item, index) => {
			return <p  key={index} style={{display:this.state.liC}}>{item}</p>
		});
		this.setState({
			allStudentNameC: this.state.allStudentNameC
		});
	};
	displayDSHow() {
		this.state.liD = "visible";
		this.setState({
			liD: this.state.liD
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameD = this.state.idD.map((item, index) => {
			return <p  key={index} style={{display:this.state.liD}}>{item}</p>
		});
		this.setState({
			allStudentNameD: this.state.allStudentNameD
		});
	};
	displayDHide() {
		this.state.liD = "hidden";
		this.setState({
			liD: this.state.liD
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameD = this.state.idD.map((item, index) => {
			return <p  key={index} style={{display:this.state.liD}}>{item}</p>
		});
		this.setState({
			allStudentNameD: this.state.allStudentNameD
		});
	};
	displayESHow() {
		this.state.liE = "visible";
		this.setState({
			liE: this.state.liE
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameE = this.state.idE.map((item, index) => {
			return <p  key={index} style={{display:this.state.liE}}>{item}</p>
		});
		this.setState({
			allStudentNameE: this.state.allStudentNameE
		});
	};
	displayEHide() {
		this.state.liE = "hidden";
		this.setState({
			liE: this.state.liE
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameE = this.state.idE.map((item, index) => {
			return <p  key={index} style={{display:this.state.liE}}>{item}</p>
		});
		this.setState({
			allStudentNameE: this.state.allStudentNameE
		});
	};
	displayFSHow() {
		this.state.liF = "visible";
		this.setState({
			liF: this.state.liF
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameF = this.state.idF.map((item, index) => {
			return <p  key={index} style={{display:this.state.liF}}>{item}</p>
		});
		this.setState({
			allStudentNameF: this.state.allStudentNameF
		});
	};
	displayFHide() {
		this.state.liF = "hidden";
		this.setState({
			liF: this.state.liF
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameF = this.state.idF.map((item, index) => {
			return <p  key={index} style={{display:this.state.liF}}>{item}</p>
		});
		this.setState({
			allStudentNameF: this.state.allStudentNameF
		});
	};
	displayGSHow() {
		this.state.liG = "visible";
		this.setState({
			liG: this.state.liG
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameG = this.state.idG.map((item, index) => {
			return <p key={index} style={{display:this.state.liG}}>{item}</p>
		});
		this.setState({
			allStudentNameG: this.state.allStudentNameG
		});
	};
	displayGHide() {
		this.state.liG = "hidden";
		this.setState({
			liG: this.state.liG
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameG = this.state.idG.map((item, index) => {
			return <p key={index} style={{display:this.state.liG}}>{item}</p>
		});
		this.setState({
			allStudentNameG: this.state.allStudentNameG
		});
	
	};
	displayHSHow() {
		this.state.liH = "visible";
		this.setState({
			liH: this.state.liH
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameH = this.state.idH.map((item, index) => {
			return <p key={index} style={{display:this.state.liH}}>{item}</p>
		});
		this.setState({
			allStudentNameH: this.state.allStudentNameH
		});
	
	};
	displayHHide(){
		this.state.liH = "hidden";
		this.setState({
			liH: this.state.liH
		});
		this.coordArrHoverDiv();
		this.state.allStudentNameH = this.state.idH.map((item, index) => {
			return <p key={index} style={{display:this.state.liH}}>{item}</p>;
		});
		this.coordArrHoverDiv()
		this.setState({
			allStudentNameH: this.state.allStudentNameH
		});
	};
	/*学生可选的选项*/
	_loadTimeDescArray(desc){
			 let beforeArray = [] ;
			  desc.map((item,index) => {		
				let a = <li className="answer-teach-lis" key={item.id} style={{background:desc[index].sel? "#2196f3" : undefined , cursor: this.state.lisStyle?"pointer":"default"}}   onClick={this.changeColor.bind(this,index)}>{item.name}</li>;//tkpc2.0.8
				beforeArray.push(a)
			});
			return{
			        beforeArray:beforeArray
			      }
	};
	/*table*/
	_loadTableDescArray(tableObject){
		let afterArry = [] ;
		if(tableObject!=""){
	 		let newCrr=Array.from(new Set(this.state.brr));
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
	 	}
		return{
		        afterArry:afterArry
		    }
	};
	/*改变颜色*/ 
	changeColor(index,e){
		if(this.state.lisStyle) {
			return false;
		}
		this.state.crr = [];
		this.state.crr.length = 0;
		this.setState({
			crr: this.state.crr
		});
		this.state.initArr[index].sel = !this.state.initArr[index].sel;
		this.setState({
			initArr: this.state.initArr
		});
		if(this.state.initArr[index].sel == false) {
			this.state.beginStyle = "";
			this.setState({
				beginStyle: this.state.beginStyle
			});
		}
		for(let value of this.state.initArr) {
			if(value.sel) {
				this.state.beginStyle = "#2196f3";
				this.setState({
					beginStyle: this.state.beginStyle
				});
			}
		}
		for(var i = 0; i < this.state.initArr.length; i++) {
			if(this.state.initArr[i].sel) {
				this.state.crr.push(this.state.initArr[i].name);
				this.state.crr = Array.from(new Set(this.state.crr))
				this.setState({
					crr: this.state.crr
				});
			}
		}
		if(this.state.crr.length>0){ //tkpc2.0.8
			this.state.changeOneAnswerStyle = "none";
			this.setState({
				changeOneAnswerStyle: this.state.changeOneAnswerStyle
			});
		}
	};
	/*提交答案*/
	beginAnswer(e){
		if(this.state.crr.length == 0) {
			ReactDOM.findDOMNode(this.refs.submitAndChange).textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
			this.state.changeOneAnswerStyle = "block";
			this.setState({
				changeOneAnswerStyle: this.state.changeOneAnswerStyle
			});
			return false;
		};
		if(this.state.crr.length > 0) {
			this.state.changeOneAnswerStyle = "none";
			this.setState({
				changeOneAnswerStyle: this.state.changeOneAnswerStyle
			})
		};
		this.state.lisStyle = !this.state.lisStyle;
		this.setState({
			lisStyle: this.state.lisStyle
		})
		if(this.state.lisStyle == true) {
			this._initSelectArr();
			let studentChoseItem = this.state.crr;
			let isDelMsg = false;
			this.state.userAdmin = ServiceRoom.getTkRoom().getMySelf().nickname;
			this.setState({
				userAdmin: this.state.userAdmin
			});
			let times = this.state.teacherSendTime;
			let sendStudentName = this.state.userAdmin;
			let sendUserID = ServiceRoom.getTkRoom().getMySelf().id;
			let optionalAnswers = this.state.initArr;
			let data = {
				mySelect: studentChoseItem,
				sendStudentName: sendStudentName,
				sendUserID: sendUserID,
				times: times,
				optionalAnswers: optionalAnswers
			};
			e.target.textContent = TkGlobal.language.languageData.answers.changeAnswer.text;
			ServiceSignalling.sendSignallingDataStudentToTeacherAnswer(isDelMsg, data);
		} else {
			this.state.crr = [];
			this.state.beginStyle = "#074496";
			this.setState({
				crr: this.state.crr,
				beginStyle: this.state.beginStyle
			});
			for(let value of this.state.initArr) {
				value.sel = false;
			}
			e.target.textContent = TkGlobal.language.languageData.answers.submitAnswer.text;
		}
	};
	/*初始化数组*/
	_initSelectArr() {
		this.state.crr = [];
		this.state.crr.length = 0;
		this.setState({
			crr: this.state.crr
		});
		for(var i = 0; i < this.state.initArr.length; i++) {
			if(this.state.initArr[i].sel == true) {
				this.state.crr.push(this.state.initArr[i].name);
				this.setState({
					crr: this.state.crr
				});
			}
		}
	}
	/*柱状图*/
	coordArrX(){
	    this.state.allResultX = this.state.dataInit.map((value,index) => {
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
			allResultX: this.state.allResultX
		});
	};
	/*鼠标划过时显示用户的用户名*/
	coordArrHoverDiv(){
		let initArr = this.state.dataInit;
        this.state.allResultHover = this.state.dataInit.map((value,index) => {
			if(value.name=="A"){
				let leftValue = 0;
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
        });
    };
	coordArr(){
	    this.state.allResult = this.state.dataInit.map((value,index) => {
	        return <li key={value.id}>{value.name}</li>
	            });
	    this.setState({
			allResult: this.state.allResult
		})
	};
	//正确答案
	trueArr(){
	   this.state.trueSelect = this.state.brr.map((value,index) => {
	        return <span className="spans" key={index}>{value}</span>
	            });
	        this.setState({trueSelect:this.state.trueSelect})
	};
	/*我的答案*/
	mySelectArr(Arry){
		let newCrr=Array.from(new Set(Arry));
	        newCrr=newCrr.sort();
		this.state.mySelect = newCrr.map((value,index) => {
	        return <span className="spans" key={index}>{value}</span>
	            });
	    this.setState({mySelect:this.state.mySelect})
	};
	/*图表*/
   	xiangQingHandel(){
   		this.state.isXiangQing = !this.state.isXiangQing;
   		this.setState({
       			isXiangQing:this.state.isXiangQing
       		})
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
	render(){
		let {initArr,tableObject} = this.state ;
		this.state.crr=Array.from(new Set(this.state.crr));
    	let {beforeArray} = this._loadTimeDescArray(initArr);
    	
    	let {afterArry} = this._loadTableDescArray(tableObject);
    	//tkpc2.0.8 隐藏关闭 样式   <div className="answer-teach-header-right" style={{display:none}}></div>
		return (
		    <div>
				<div className="answer-teach-wrapDiv"  style={{display:this.state.answerTeachWrapDiv}} ref="dragBox">
					<div className="answer-teach-header" >
						<div className="answer-teach-header-left">
							<span className="answer-teach-headerImg"></span>
							<span className="answer-teach-header-left-grey">{TkGlobal.language.languageData.answers.headerTopLeft.text}</span>
							<span className="answer-teach-header-left-green">{TkGlobal.language.languageData.answers.headerMiddel.text}</span>
						</div>
						<div className="answer-teach-header-right" style={{display:"none"}}></div>    
					</div>
					<div className="answer-teach-content">
						<ul className="answer-teach-optionUl" >
							{beforeArray}
						</ul>
						<p className="changeOneAnswer" style={{display:this.state.changeOneAnswerStyle}}>{TkGlobal.language.languageData.answers.selectAnswer.text}</p>
						<div className="answer-teach-add" style={{visibility:this.state.answerAddStyle}} >+</div>
						<div className="answer-teach-reduce" style={{visibility:this.state.answerReduceStyle}} >-</div>
						<div className="answer-teach-begin" onClick={this.beginAnswer.bind(this)} style={{background:this.state.beginStyle}} ref="submitAndChange">{TkGlobal.language.languageData.answers.submitAnswer.text}</div>
					</div>
				</div>
				<div  className="result-teach-wrapDiv" style={{display:this.state.resultStudentDisplay}} ref="resultRef">
					<div className="result-teach-header" >
						<div className='result-teach-header-left'>
							<span className="result-teach-headerImg"></span>
							<span className="result-teach-header-left-grey">{TkGlobal.language.languageData.answers.headerTopLeft.text}</span>
							<span id="result-teach-mytimes" ref="timeText"></span>
						</div>
						<p className="result-teach-close"  style={{display:this.state.resultTeachStyleDisplay}}>  </p>
					</div>
					<div className="result-teach-content">
						<p className="answersPeople">{TkGlobal.language.languageData.answers.numberOfAnswer.text}:<span  ref="ans">{this.state.allNumbers}</span><span className="xiang-qing-div" onClick={this.xiangQingHandel.bind(this)}>({this.state.xiangQingText})</span></p>
						<span className="result-teach-accuracy-right"><span className="result-teach-accuracy-right-text">{TkGlobal.language.languageData.answers.tureAccuracy.text}：</span><span style={{color:"red"}}>{this.state.trueLV}%</span></span>
						<div className="result-teach-coordinate-div" style={{display:this.state.columnar}}>
							<span className="result-teach-heart-span">0</span>
							<div className="result-teach-staff-div">
							<ul className="result-student-allResult">
								{this.state.allResultX}
							</ul>
							</div>
							<div className="answer-hover">
								{this.state.allResultHover}
							</div>
							<ul className="result-teach-allResult">
								{this.state.allResult}
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
						<div className="result-teach-true-result" style={{visibility:this.state.trueResultDivStyle}}>
							<span style={{color:"white"}}>{TkGlobal.language.languageData.answers.trueAnswer.text}:</span>
							<span className="result-teach-trueSelect">{this.state.trueSelect}</span>
						</div>
						<div className="result-teach-true-result">
							<span style={{color:"white"}}>{TkGlobal.language.languageData.answers.myAnswer.text}:</span>
							<span className="result-teach-trueSelect">{this.state.mySelect}</span>
						</div>
					</div>
				</div>
			</div>
			)
		}
	}

export default AnswerStudentToolSmart;
