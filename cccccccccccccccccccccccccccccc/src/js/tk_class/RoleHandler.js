/**
 * 角色相关处理类
 * @class RoleHandler
 * @description   提供角色相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import TkConstant from 'TkConstant' ;
import ServiceRoom from 'ServiceRoom' ;
import TkAppPermissions from 'TkAppPermissions';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import CoreController from 'CoreController';

class RoleHandler{
    constructor(role){
        this.role = role ;
    }
    /*获取角色的默认权限*/
    getRoleHasDefalutAppPermissions(specifiedAppPermissions){
         /*默认权限*/
         let roleHasDefalutAppPermissions = specifiedAppPermissions || TkAppPermissions.productionDefaultAppAppPermissions();
        if(TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomrole!=undefined){
            switch (TkConstant.joinRoomInfo.roomrole){
                case TkConstant.role.roleChairman: //老师
                    let classBtnIsDisableOfRemind = TkAppPermissions.getAppPermissions('classBtnIsDisableOfRemind') ;
                    if( !TkGlobal.classBegin ){ //没有上课时的权限
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            sendSignallingFromLowConsume:true , //发送性能指标信令（适应IOS配置）
                            dynamicPptActionClick:true,//动态PPT点击动作的权限
                            whiteboardPagingPage:true , //白板翻页权限
                            newpptPagingPage:true , //动态ppt翻页权限
                            h5DocumentPagingPage:true , //h5课件翻页权限
                            jumpPage:true ,//能否输入页数跳转到指定文档页权限
                            sendSignallingFromClassBegin:true , //上下课信令权限
                            roomStart:true , //上课发送的web接口roomstart权限
                            hiddenClassBeginAutoClassBegin:true , //隐藏上下课按钮自动上课权限
                            startClassBegin:!TkConstant.joinRoomInfo.hiddenClassBegin && true , //上课权限
                            endClassBegin:!TkConstant.joinRoomInfo.hiddenClassBegin  && false , //下课权限
                            loadUserlist:true , //加载用户列表的权限
                            autoClassBegin:true , //自动上课权限
                            sendSignallingFromDocumentChange:true , //发送文档上传或者删除相关的信令权限
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            publishMediaStream:true , //发布媒体文件流的权限
                            unpublishMediaStream:true , //取消发布媒体文件流的权限
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:true , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            loadClassbeginRemind:TkConstant.joinRoomInfo.companyid ===  10035,//加载上课提示权限(企业id)
                            classBtnIsDisableOfRemind:classBtnIsDisableOfRemind ,//根据提示上课按钮能否点击
                            h5DocumentActionClick:true,//h5课件点击动作的权限
                            localStream:true,//本地视频流
                            mediaPlayAndPause:true,//媒体文件播放暂停的权限   //xgd 17-09-14
                            endClassbeginRevertToStartupLayout:true , //下课后恢复界面的默认界面的权限
                            endClassbeginShowLocalStream:true , //下课后显示本地视频权限
                            delmsgTo__AllAll:true , //清除所有信令的权限
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                            toolListIsShowPairMany:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//在一对三十的界面是否显示用户列表(是否是一起作业)
                        });
                    }else{
                        for(let key of  Object.keys(roleHasDefalutAppPermissions) ){
                            roleHasDefalutAppPermissions[key] = true ; //所有权限都有
                        }
                        Object.assign(roleHasDefalutAppPermissions , {
                            raisehand: false, //举手权限
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            dialCircleClick:false,
                            startClassBegin:!TkConstant.joinRoomInfo.hiddenClassBegin  && false , //上课权限
                            endClassBegin:!TkConstant.joinRoomInfo.hiddenClassBegin  && true , //下课权限
                            forcedEndClassBegin: !TkConstant.joinRoomInfo.hiddenClassBegin  && false, //强制下课权限
                            classBtnIsDisableOfRemind:classBtnIsDisableOfRemind ,//根据提示上课按钮能否点击
                            loadClassbeginRemind:TkConstant.joinRoomInfo.companyid ===  10035 ,//加载上课提示权限(企业id)
                            publishDeskTopShareStream:true, //桌面共享
                            unpublishDeskTopShareStream:true, //取消桌面共享
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
							toolListIsShowPairMany:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//在一对三十的界面是否显示用户列表
                            destTopShareIsShow:TkConstant.joinRoomInfo.destTopShareShow,//桌面共享
                            sendSignallingFromVideoDraghandle:TkConstant.joinRoomInfo.roomtype !== TkConstant.hasRoomtype.oneToOne,//拖拽的信令权限
                        });
                    }
                    break;
                case TkConstant.role.roleTeachingAssistant: //助教
                    if( !TkGlobal.classBegin ){ //没有上课时的权限
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            dynamicPptActionClick:true,//动态PPT点击动作的权限
                            whiteboardPagingPage:true , //白板翻页权限
                            newpptPagingPage:true , //动态ppt翻页权限
                            h5DocumentPagingPage:true , //h5课件ppt翻页权限
                            jumpPage:true ,//能否输入页数跳转到指定文档页权限
                            loadUserlist:true , //加载用户列表的权限
                            sendSignallingFromDocumentChange:true , //发送文档上传或者删除相关的信令权限
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            publishMediaStream:true , //发布媒体文件流的权限
                            unpublishMediaStream:true , //取消发布媒体文件流的权限
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:true , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            h5DocumentActionClick:true,//h5课件点击动作的权限
                            localStream:TkConstant.joinRoomInfo.assistantOpenMyseftAV,//本地视频流           //xgd 17-09-14
                            mediaPlayAndPause:true,//媒体文件播放暂停的权限 //xgd 17-09-14
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                            toolListIsShowPairMany:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//在一对三十的界面是否显示用户列表
                        });
                    }else{
                        for(let key of  Object.keys(roleHasDefalutAppPermissions) ){
                            roleHasDefalutAppPermissions[key] = true ; //先设置所有权限都有，后面再设置特殊权限
                        }
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            sendSignallingFromLowConsume:false , //发送性能指标信令（适应IOS配置）
                            sendSignallingFromClassBegin:false , //上下课信令权限
                            roomStart:false , //上课发送的web接口roomstart权限
                            hiddenClassBeginAutoClassBegin:false , //隐藏上下课按钮自动上课权限
                            roomOver:false , //下课发送的web接口roomove权限
                            startClassBegin:false ,  //上课权限
                            endClassBegin: false, //下课权限
                            raisehand: false, //举手权限
                            laser:false , //激光笔权限
                            giveAllUserSendGift:false , //给所有用户发送礼物权限
                            allUserMute:false , //全体静音权限
                            hasAllSpeaking:false , //全体发言权限
							autoPublishAV:false , //自动发布音视频权限           //xgd 17-09-14 17-10-20 修改回原来状态
//							allUserTools:false, //教学工具箱权限
                            forcedEndClassBegin: !TkConstant.joinRoomInfo.hiddenClassBegin  && false, //强制下课权限
                            classBtnIsDisableOfRemind:false ,//根据提示上课按钮能否点击
                            loadClassbeginRemind:false ,//加载上课提示权限
                            localStream:TkConstant.joinRoomInfo.assistantOpenMyseftAV,//本地视频流                       //xgd 17-09-14
                            /*    userAudioOpenOrClose:TkConstant.joinRoomInfo.assistantOpenMyseftAV , //打开关闭音频权限
                            userVideoOpenOrClose:TkConstant.joinRoomInfo.assistantOpenMyseftAV , //打开关闭视频权限*/
                            userAudioOpenOrClose:true , //打开关闭音频权限
                            userVideoOpenOrClose:true , //打开关闭视频权限
                            endClassbeginRevertToStartupLayout:false , //下课后恢复界面的默认界面的权限
                            endClassbeginShowLocalStream:false , //下课后显示本地视频权限
                            delmsgTo__AllAll:false , //清除所有信令的权限
                            // pairOfManyIsShow:false,//是否显示一对三十的界面和逻辑
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                            toolListIsShowPairMany:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//在一对三十的界面是否显示用户列表
                            sendSignallingFromVideoDraghandle:TkConstant.joinRoomInfo.roomtype !== TkConstant.hasRoomtype.oneToOne,//拖拽的信令权限
                            // teacherVframeBtnIsShow:false,//老师视频框的按钮是否能显示的权限
                            studentVframeBtnIsHide:!(TkConstant.joinRoomInfo.studentCloseMyseftAV&&TkConstant.joinRoomInfo.assistantOpenMyseftAV),//学生关闭音视频的按钮是否隐藏//tkpc2.0.8
                        });
                    }
                    break ;
                case TkConstant.role.rolePatrol: //巡课
                    if( !TkGlobal.classBegin ){ //没有上课时的权限
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            forcedEndClassBegin: !TkConstant.joinRoomInfo.hiddenClassBegin  && true, //强制下课权限
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:false , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            whiteboardPagingPage:false , //白板翻页权限
                            newpptPagingPage:false , //动态ppt翻页权限
                            h5DocumentPagingPage:false , //h5课件ppt翻页权限
                            loadUserlist:true , //加载用户列表的权限
                            loadSystemSettings:false,//加载系统设置的权限
                            loadNoviceHelp:false,//加载新手帮助的权限
                            openFileIsClick:false,//是否能点击打开文档和媒体文件的权限
                            localStream:false,//本地视频流
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                        });
                    }else{
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            endClassBegin:!TkConstant.joinRoomInfo.hiddenClassBegin  && true , //下课权限
                            roomOver: true, //下课发送的web接口roomove权限
                            sendSignallingFromClassBegin: true, //上下课信令权限
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            forcedEndClassBegin: !TkConstant.joinRoomInfo.hiddenClassBegin  && true, //强制下课权限
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:false , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            whiteboardPagingPage:false , //白板翻页权限
                            newpptPagingPage:false , //动态ppt翻页权限
                            h5DocumentPagingPage:false , //h5课件ppt翻页权限
                            loadUserlist:true , //加载用户列表的权限
                            loadSystemSettings:false,//加载系统设置的权限
                            loadNoviceHelp:false,//加载新手帮助的权限
                            openFileIsClick:false,//是否能点击打开文档和媒体文件的权限
                            localStream:false,//本地视频流
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                        });
                    }
                    break;
                case TkConstant.role.roleStudent: //学生
                    if( !TkGlobal.classBegin ){ //没有上课时的权限
                        Object.assign(roleHasDefalutAppPermissions , {
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            whiteboardPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //白板翻页权限
                            newpptPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //动态ppt翻页权限
                            h5DocumentPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //h5课件翻页权限
                            jumpPage:TkConstant.joinRoomInfo.isSupportPageTrun ,//能否输入页数跳转到指定文档页权限
                            h5DocumentActionClick:TkConstant.joinRoomInfo.isSupportPageTrun,//h5课件点击动作的权限
                            dynamicPptActionClick:TkConstant.joinRoomInfo.isSupportPageTrun,//动态PPT点击动作的权限
                            raisehand: TkConstant.hasRoomtype.oneToOne ? false : true, //举手权限
                            raisehandDisable:true , //举手不可点击权限
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:true , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            loadMedialist:false , //加载媒体文件列表的权限
                            openFileIsClick:true,//是否能点击打开文档和媒体文件的权限
                            localStream:true,//本地视频流
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                        });
                    }else{
                        Object.assign(roleHasDefalutAppPermissions , { //学生采用默认权限,如有需要可以在后面动态更改权限
                            sendSignallingFromRemoteControl: true, //发送远程控制信令
                            userAudioOpenOrClose:true , //打开关闭音频权限
                            userVideoOpenOrClose:true , //打开关闭视频权限
                            sendSignallingFromSharpsChange:true , //发送白板数据相关的信令权限
                            whiteboardPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //白板翻页权限
                            newpptPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //动态ppt翻页权限
                            h5DocumentPagingPage:TkConstant.joinRoomInfo.isSupportPageTrun , //h5课件翻页权限
                            jumpPage:TkConstant.joinRoomInfo.isSupportPageTrun ,//能否输入页数跳转到指定文档页权限
                            autoPublishAV:true , //自动发布音视频权限
                            raisehand: TkConstant.hasRoomtype.oneToOne ? false : true, //举手权限
                            raisehandDisable:false , //举手不可点击权限
                            dblclickDeviceVideoFullScreenRight:true , //双击右侧设备流全屏
                            pubMsg:true , //pubMsg 信令权限
                            delMsg:true , //delMsg 信令权限
                            setProperty:true , //setProperty 信令权限
                            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:true , //发送聊天消息的权限
                            sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                            sendSignallingFromStreamFailure:true , //数据流失败后发送信令权限
                            loadCoursewarelist:false , //加载文档文件列表的权限
                            loadMedialist:false , //加载媒体文件列表的权限
                            openFileIsClick:false,//是否能点击打开文档和媒体文件的权限
                            studentVframeBtnIsHide:!TkConstant.joinRoomInfo.studentCloseMyseftAV,//学生关闭音视频的按钮是否隐藏
                            isChangeVideoSize:true,//是否可以拉伸视频框
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                            sendSignallingFromVideoDraghandle:TkConstant.joinRoomInfo.roomtype !== TkConstant.hasRoomtype.oneToOne,//拖拽的信令权限
                        });
                    }
                    break ;
                case TkConstant.role.rolePlayback: //回放者
                    if( !TkGlobal.classBegin ){ //没有上课时的权限
                        Object.assign(roleHasDefalutAppPermissions , {
                            pubMsg:false , //pubMsg 信令权限
                            delMsg:false , //delMsg 信令权限
                            setProperty:false , //setProperty 信令权限
                            setParticipantPropertyToAll:false , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:false , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:false , //发送聊天消息的权限
                            loadCoursewarelist:false , //加载文档文件列表的权限
                            loadMedialist:false , //加载媒体文件列表的权限
                            loadSystemSettings:false,//加载系统设置的权限
                            loadNoviceHelp:false,//加载新手帮助的权限
                            openFileIsClick:false,//是否能点击打开文档和媒体文件的权限
                            localStream:false,//本地视频流
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑,是一起作业并且是非自动开启音视频并且一对多
                        });
                    }else{
                        Object.assign(roleHasDefalutAppPermissions , { //回放者采用默认权限,如有需要可以在后面动态更改权限
                            pubMsg:false , //pubMsg 信令权限
                            delMsg:false , //delMsg 信令权限
                            setProperty:false , //setProperty 信令权限
                            setParticipantPropertyToAll:false , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                            sendSignallingDataToParticipant:false , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                            sendTextMessage:false , //发送聊天消息的权限
                            loadCoursewarelist:false , //加载文档文件列表的权限
                            loadMedialist:false , //加载媒体文件列表的权限
                            loadSystemSettings:false,//加载系统设置的权限
                            loadNoviceHelp:false,//加载新手帮助的权限
                            openFileIsClick:false,//是否能点击打开文档和媒体文件的权限
                            localStream:false,//本地视频流
                            pairOfManyIsShow:(TkConstant.joinRoomInfo.companyid ===  10059  && TkConstant.joinRoomInfo.roomtype !== TkConstant.ROOMTYPE.oneToOne),//是否显示一对三十的界面和逻辑
                        });
                    }
                    break ;
                case TkConstant.role.roleAudit: //直播 17-09-20
                    for(let key of  Object.keys(roleHasDefalutAppPermissions) ){
                        roleHasDefalutAppPermissions[key] = false ; //先设置所有权限都没有，后面再设置特殊权限
                    }
                    Object.assign(roleHasDefalutAppPermissions , { //学生采用默认权限,如有需要可以在后面动态更改权限
                        pubMsg:true , //pubMsg 信令权限
                        sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
                        setParticipantPropertyToAll:true,//setParticipantPropertyToAll 设置参与者属性发送给所有人权限
                        sendTextMessage:true , //发送聊天消息的权限
                        sendSignallingFromUpdateTime:true , //发送更新时间信令权限
                        sendSignallingFromLiveVoteCommit: true, // 提交投票信令的权限
                        dblclickDeviceVideoFullScreenRight: true,//双击右侧设备流全屏
                        loadUserlist:true , //加载用户列表的权限
                    });
            }
        }
        return roleHasDefalutAppPermissions ;
    }

    /*检测角色冲突
     * @method checkRoleConflict
     * @params[user:object ,isEvictUser:boolean ]*/
    checkRoleConflict(user , isEvictUser){
        let isConflict = false ; //角色是否冲突

        if(ServiceRoom.getTkRoom().getMySelf().id != user.id) {
            if(user.role === TkConstant.role.roleChairman && TkConstant.hasRole.roleChairman) {//参与者的角色是老师并且我的角色也是老师
                isConflict = true;

                if(TkGlobal.isDisconnected)
                    return false;
               if(TkGlobal.isBroadcast && TkGlobal.isClient){ //xgd 2018-01-11 直播老师不能互踢,只能自己离开,断网重连不能踢人
                  if(user.id !== ServiceRoom.getTkRoom().getMySelf().id)
                      if(isEvictUser) {
                        ServiceRoom.getTkRoom().evictUser(ServiceRoom.getTkRoom().getMySelf().id);
                      }
               } else{
                    if(isEvictUser) {
                        ServiceRoom.getTkRoom().evictUser(user.id);
                    }
                }
            } else if(TkConstant.joinRoomInfo.roomtype === TkConstant.ROOMTYPE.oneToOne && user.role === TkConstant.role.roleStudent && TkConstant.hasRole.roleStudent) {//会议类型为1:1并且是学生，而且我的角色也是学生
                isConflict = true;
                if(isEvictUser) {
                    ServiceRoom.getTkRoom().evictUser(user.id);
                }
            }
        }
        return isConflict ;
    } ;

    /*注册角色相关的事件*/
    addEventListenerToRoomHandler(){
        let that = this ;
    }
}
const  RoleHandlerInstance = new RoleHandler() ;
RoleHandlerInstance.addEventListenerToRoomHandler();
export default  RoleHandlerInstance;