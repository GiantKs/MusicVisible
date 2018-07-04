/**
 * 右侧内容-教学工具箱 Smart组件
 * @module DialStudentToolSmart
 * @description   转盘组件
 * @author liujianhang
 * @date 2017/09/20
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

class DialStudentToolSmart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            turnContent:"",
            turnContentTransform:"",
            dialTeachComponentBgDisplay:"none",
            studenDontClick:false,
            dialCircleClick:true,
             dialIcon:true,
            dialStudentName:[]
        }
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-dialShow" , that.handlerMsglistDialShow.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
    };
        toRadian(angle) {
            return angle / 180 * Math.PI;
        }
        /*弧度转角度*/
        toAngle(radian) {
            return radian / Math.PI * 180;
        }
        describingCircle(length,arry) {
            let cv = document.getElementById("dial-teachComponent-turnContents");
            let ctx = cv.getContext("2d");
            cv.width = 355;
            cv.height = 355;
           
            let startAngle = -360 /length,
                step = 360 / length;
            const that = this;
            arry.forEach(function (value, index) {
                ctx.beginPath();
                ctx.fillStyle = value;
                ctx.moveTo(177.5, 177.5);
                ctx.arc(177.5, 177.5, 177.5, that.toRadian(startAngle), that.toRadian(startAngle += step));
                ctx.fill();
            });
        };
    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "dialShow":{
                that.state.dialTeachComponentBgDisplay="block";
        		that.setState({dialTeachComponentBgDisplay:that.state.dialTeachComponentBgDisplay});
                break;
            }
            case "dialTurn":{
                that._updateDialTurn(pubmsgData);
                break;
            }
        }
    };
    /*房间关闭事件*/
    handlerRoomDelmsg(recvEventData){
         const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "dialShow":{
                that.state.dialIcon=true;
                that.setState({
                    dialIcon:that.state.dialIcon
                })
                break;
            }
             case "dialTurn":{
				
                that._updateDialTurn(pubmsgData);
                break;
            }
        }
    }
    handlerMsglistDialShow(recvEventData){
        const that = this ;
        let message=recvEventData.message.dialShowArr[0];
        if (TkConstant.hasRole.roleStudent) {
            	 that._updateDialShow(message);
         		that._updateDialTurn(message);
        	}
       
    };
    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that.setState({
            turnContent:"",
            turnContentTransform:"",
            dialTeachComponentBgDisplay:"none",
            studenDontClick:false,
            dialCircleClick:true,
            dialIcon:true,
            dialStudentName:[]
        });
    };
    _updateDialShow(pubmsgData){
        const that = this ;
        that.state.dialStudentName = pubmsgData.data.studentNameText;
        that.setState({dialStudentName:that.state.dialStudentName})
        that.state.dialTeachComponentBgDisplay="block";
        that.setState({dialTeachComponentBgDisplay:that.state.dialTeachComponentBgDisplay});
       	
    }
    _updateDialTurn(pubmsgData){
        const that = this ;
         ReactDOM.findDOMNode(that.refs.turnTable).style.transform=pubmsgData.data.dataTransform ;
         that.sector();
    }
    /*权限*/
    handlerInitAppPermissions(){
        this.state.dialCircleClick = CoreController.handler.getAppPermissions('dialCircleClick');
        
        this.setState({dialCircleClick:this.state.dialCircleClick});

    };
    /*根据学生人数分配扇形和配色*/
    sector(){
    	
    		if(this.state.dialStudentName.length>5){
    			let colors = ["red", "green", "blue", "yellow", "pink","grey"]
    			this.state.turnContent = this.state.dialStudentName.map((value,index)=>{
                return <div key={index} style={{transform:"rotateZ("+(index+1)*60+"deg)"}} className="studentName">
				 			<p style={{transform:"rotateZ("+(index+1)*-60+"deg)"}}>{value}</p>
				 		</div>
            });
            	this.describingCircle(colors.length,colors)
    		}
                		if(this.state.dialStudentName.length==5){
    			let colors = ["red", "green", "blue", "yellow", "pink"]
    			this.state.turnContent = this.state.dialStudentName.map((value,index)=>{
                return <div key={index} style={{transform:"rotateZ("+(index+1)*65+"deg)"}} className="studentName">
				 			<p style={{transform:"rotateZ("+(index+1)*-65+"deg)"}}>{value}</p>
				 		</div>
            });
            	this.describingCircle(colors.length,colors)
    		}    		if(this.state.dialStudentName.length==4){
    			let colors = ["red", "green", "blue", "yellow"]
    			this.state.turnContent = this.state.dialStudentName.map((value,index)=>{
                return <div key={index} style={{transform:"rotateZ("+(index+1)*78+"deg)"}} className="studentName">
				 			<p style={{transform:"rotateZ("+(index+1)*-78+"deg)"}}>{value}</p>
				 		</div>
            });
            	this.describingCircle(colors.length,colors)
    
    		}    		if(this.state.dialStudentName.length==3){
    			let colors = ["red", "green", "blue"]
    			this.state.turnContent = this.state.dialStudentName.map((value,index)=>{
                return <div key={index} style={{transform:"rotateZ("+(index+1)*130+"deg)"}} className="studentName">
				 			<p style={{transform:"rotateZ("+(index+1)*-130+"deg)"}}>{value}</p>
				 		</div>
            });
            	this.describingCircle(colors.length,colors)
    		}    		if(this.state.dialStudentName.length==2){
    			let colors = ["green", "blue", "green", "blue", "green", "blue"];
    			this.state.dialStudentName = this.state.dialStudentName.concat(this.state.dialStudentName,this.state.dialStudentName);
    			this.setState({
                dialStudentName:this.state.dialStudentName,
            });
    			this.state.turnContent = this.state.dialStudentName.map((value,index)=>{
                return <div key={index} style={{transform:"rotateZ("+(index+1)*60+"deg)"}} className="studentName">
				 			<p style={{transform:"rotateZ("+(index+1)*-60+"deg)"}}>{value}</p>
				 		</div>
            });
            	this.describingCircle(colors.length,colors)
    		}
            this.setState({
                turnContent:this.state.turnContent,
            });
    };

    render(){
        return(
            <div className="dial-teachComponent-bgs" ref="dialTeachComponentBg"  style={{display:this.state.dialIcon?"none":"block"}}>
                <button alt="pointer" style={{backgroundColor:this.state.a}} className="dial-teachComponent-pointer-buttons"  disabled={this.state.dialCircleClick}></button>
                <div className="dial-teachComponent-turntables" ref='turnTable'>
                    <canvas id="dial-teachComponent-turnContents" >
                    </canvas>
                    {this.state.turnContent}
                </div>
            </div>
        )
    }
}

export default DialStudentToolSmart;
