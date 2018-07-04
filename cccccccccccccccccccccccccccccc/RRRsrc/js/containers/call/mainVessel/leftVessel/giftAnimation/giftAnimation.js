/**
 * 礼物动画smart组件
 * @module GiftAnimationSmart
 * @description   提供发送礼物时显示的动画
 * @author QiuShao
 * @date 2017/08/25
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;
import TkConstant from 'TkConstant' ;
import TkGlobal from 'TkGlobal' ;

class GiftAnimationSmart extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.giftAnimationElement = undefined ;
        this.giftAnimationJson = {} ;
        this.giftAnimationJsonIndex = 0 ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that)  , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'playbackControl_seek_position' , that.handlerPlaybackControl_seek_position.bind(that)  , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerPlaybackControl_seek_position(recvEventData){
        for(let giftAnimationJsonIndex in this.giftAnimationJson ){
            if(this.giftAnimationJson[giftAnimationJsonIndex]){
                clearTimeout( this.giftAnimationJson[giftAnimationJsonIndex]['timer'] );
                if(this.giftAnimationJson[giftAnimationJsonIndex]['element'] && this.giftAnimationJson[giftAnimationJsonIndex]['element'].remove){
                    this.giftAnimationJson[giftAnimationJsonIndex]['element'].remove();
                }
                this.giftAnimationJson[giftAnimationJsonIndex] = null ;
                delete this.giftAnimationJson[giftAnimationJsonIndex]  ;
            }
        }
    }

    handlerRoomUserpropertyChanged(recvEventData){
        const that = this ;
        let changeUserproperty = recvEventData.message;
        let user = recvEventData.user;
        let fromID = recvEventData.fromID;
        for (let key of Object.keys(changeUserproperty)) {
            if (key === "giftnumber" && user.id !== fromID) {
                if (user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                    that._triggerTrophyTones();
                    let $giftAnimationContainer = $("#gift_animation_container")
                    let $giftAnimation = $('<div class="gift-animation"></div>');
                    $giftAnimationContainer.append($giftAnimation);
                    $giftAnimation.removeClass("giftAnimationSmall giftAnimationBig scalc").addClass(" giftAnimationBig ");
                    that.giftAnimationElement = $giftAnimation ;
                    that.giftAnimationJsonIndex++ ;
                    let giftAnimationJsonIndex = that.giftAnimationJsonIndex ;
                    that.giftAnimationJson[giftAnimationJsonIndex] = {timer:undefined , element:$giftAnimation};
                    that.giftAnimationJson[giftAnimationJsonIndex]['timer'] = setTimeout(function () {
                        $giftAnimation.removeClass("giftAnimationBig giftAnimationSmall scalc").addClass("scalc giftAnimationSmall");
                        let processedPariicipantId = user.id;
                        let $videoParticipant = $("#hvideo" + processedPariicipantId);
                        $videoParticipant = $videoParticipant.length > 0 ? $videoParticipant : $("#vvideo" + processedPariicipantId)
                        let defalutFontSize = TkGlobal.windowInnerWidth /  TkConstant.STANDARDSIZE ;
                        if ($videoParticipant.length > 0) {
                            let left = $videoParticipant.offset().left + $videoParticipant.width() - 0.25 * defalutFontSize ;
                            let top = $videoParticipant.offset().top + 0.25 * defalutFontSize ;
                            $giftAnimation.animate({
                                left: left / defalutFontSize + "rem",
                                top: top / defalutFontSize + "rem"
                            }, 500, function () {
                                $giftAnimation.remove();
                                if(that.giftAnimationJson[giftAnimationJsonIndex]){
                                    clearTimeout( that.giftAnimationJson[giftAnimationJsonIndex]['timer'] );
                                    that.giftAnimationJson[giftAnimationJsonIndex] = null ;
                                    delete that.giftAnimationJson[giftAnimationJsonIndex]  ;
                                }
                            });
                        } else {
                            $giftAnimation.remove();
                            if(that.giftAnimationJson[giftAnimationJsonIndex]){
                                clearTimeout( that.giftAnimationJson[giftAnimationJsonIndex]['timer'] );
                                that.giftAnimationJson[giftAnimationJsonIndex] = null ;
                                delete that.giftAnimationJson[giftAnimationJsonIndex]  ;
                            }
                        }
                    }, 1300);
                }
            }
        }
    };
    _triggerTrophyTones() {
        L.Utils.mediaPlay('trophyTones');
    };
    render(){
        return (
            <section className="gift-animation-container" id="gift_animation_container">
                <audio id="trophyTones" src="./music/Trophy_tones.mp3"></audio>
            </section>
        )
    }
};
export default  GiftAnimationSmart;