/**
 * ChairmanDefaultVideo 组件
 * @module ChairmanDefaultVideo
 * @description   提供 ChairmanDefaultVideo 老师默认视频组件
 * @author qiugs
 * @date 2017/10/16
 */

'use strict';
import React  from 'react';
import TkGlobal from 'TkGlobal';
import Video from "../../../components/video/realVideo";
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import WebAjaxInterface from 'WebAjaxInterface' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;
import { DragSource,DropTarget } from 'react-dnd';


class ChairmanDefaultVideo extends React.Component{
    constructor(props){
        super(props);
        this.state= {
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();

    };
    componentDidMount(){
    }
    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    }

    render(){
        return(
            <div className="clear-float video-participants-vessel">
                <div id="video_container_live" className="video-chairman-wrap"> {/*老师类名:video-chairman-wrap*/}
                    <div   className="video-permission-container add-position-relative clear-float">
                        <div  className="video-wrap  participant-right video-participant-wrap add-position-relative" >
                            <div style={{height:'100%'}} />
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export  default ChairmanDefaultVideo;


