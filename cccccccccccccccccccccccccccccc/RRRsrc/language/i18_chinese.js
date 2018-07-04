/**
 * 拓课中文语言包
 * @module chineseLanguage
 * @description   提供 拓课中文语言包
 * @author QiuShao
 * @date 2017/09/01
 */

const chineseLanguage =  {
    "login":{
        "language":{
            "joinRoomHint":{
                "text":"正在进入课堂"
            }  ,
            "detection":{
                "company":{
                    "text":"拓课" ,
                    "normal":"拓课" ,
                    "icoachu":"英练帮"
                },
                "selectOption":{
                    "noCam":"没有检测到摄像头" ,
                    "noMicrophone":"没有检测到麦克风" ,
                    "noEarphones":"没有检测到耳机、扬声器"
                },
                "welAll":{
                    "one":"欢迎使用" ,
                    "two":"在线课堂" ,
                    "three":"为了保证更好的授课效果 , 请先完成设备检测" ,
                    "four":"开始检测"
                } ,
                "deviceTestHeader":{
                    "device":{
                        "text":"设备检测"
                    } ,
                    "areaSwitch":{
                        "text":"地区切换"
                    },
                    "deviceSwitch":{
                        "text":"设备切换"
                    },
                    "optimalServer":{
                        "text":"优选网络"
                    },
                    "areaSelection":{
                        "text":"地区选择"
                    },
                    "videoinput":{
                        "text":"视频检测"
                    }  ,
                    "audioouput":{
                        "text":"扬声器检测"
                    }  ,
                    "audioinput":{
                        "text":"麦克风检测"
                    },
                    "detectionResult":{
                        "text":"检测结果"
                    },
                    "systemInfo":{
                        "text":"系统信息"
                    },
                },
                "networkExtend":{
                    "title":{
                        "select":"选择",
                        "area":"地区",
                        "delay":"延迟",
                        "text":"请选择离您所在位置最近的服务器",
                    },
                    "testBtn":"服务器延迟测试"
                },
                "videoinputExtend":{
                    "cameraOptionAll":{
                        "cameraOption":{
                            "text":"摄像头选项"
                        },
                        "noticeRed":{
                            "text":"注意：选择禁用会导致摄像头不可用"
                        }
                    } ,
                    "noticeCarmera":{
                        "one":"温馨提示:如果您无法看到视频，请按以下方式排查问题" ,
                        "two":"1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；" ,
                        "three":"2.确认摄像头已连接并开启；" ,
                        "four":"3.如果摄像头仍然没有画面，换一个插口重新插入摄像头；" ,
                        "five":"4.请选择正确摄像头选项，选择禁用会导致摄像头不可用；" ,
                        "six":"5.确认摄像头没有被其他程序占用；" ,
                        "seven":"6.重启电脑。"
                    }
                },
                "audioouputExtend":{
                    "cameraOptionAll":{
                        "cameraOption":{
                            "text":"耳机选项"
                        },
                        "earphoneVolume":{
                            "text":"耳机音量"
                        },
                        "clickmusic":{
                            "one":"点击" ,
                            "two":"按钮，您能听到音乐吗？"
                        },
                        "playMusic":"播放音乐"
                    } ,
                    "noticeCarmera":{
                        "one":"温馨提示:如果您无法听见声音，请按以下方式排查" ,
                        "two":"1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；" ,
                        "three":"2.确认手机、扬声器已连接并开启；" ,
                        "four":"3.如果耳机、扬声器音量已经调整到最大；" ,
                        "five":"4.请选择正确的耳机选项，选择禁用会导致耳机、扬声器不可用；" ,
                        "six":"5.如果耳机、扬声器仍然没有声音，换一个插口重新插入耳机、扬声器；" ,
                        "seven":"6.重启电脑。"
                    }
                },
                "audioinputExtend":{
                    "cameraOptionAll":{
                        "cameraOption":{
                            "text":"选择麦克风"
                        },
                        "noticeRed":{
                            "text":"请选择正确的麦克风选项，选择禁用会导致麦克风不可用"
                        },
                        "speakSound":{
                            "text":"对着麦克风从1数到10，您能听到自己的声音并且看到绿条滚动吗？"
                        }
                    } ,
                    "noticeCarmera":{
                        "one":"温馨提示:如果您无法看到绿色滚动条，请按以下方式排查" ,
                        "two":"1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；",
                        "three":"2.确认麦克风已连接并开启；" ,
                        "four":"3.确认麦克风已插入电脑的麦克风插孔中，并且麦克风声音已调整到最大；" ,
                        "five":"4.请选择正确的麦克风选项，选择禁用会导致麦克风不可用；" ,
                        "six":"5.如果麦克风仍然没有声音，换一个插口重新插入麦克风；" ,
                        "seven":"6.重启电脑。"
                    },
                },
                "systemInfo":{
                    "currentUser":"当前用户：",
                    "operatingSystem":"操作系统",
                    "processor":"处理器：",
                    "RAM":"内存：",
                    "serverName":"服务器名称：",
                    "IPAddress":"IP地址：",
                    "LoginDevice":"登入设备",
                    "networkDelay":"网络延时：",
                    "packetLoss":"丢包率：",
                    "browser":"浏览器：",
                    "uploadSpeed":"上传速度：",
                    "downloadSpeed":"下载速度：",
                    "roomNumber":"房间号",
                    "versionNumber":"版本号",
                },
                "resultExtend":{
                    "head":{
                        "text":"检测完成"
                    },
                    "item1":{
                        "text":"检测项目"
                    },
                    "item2":{
                        "text":"检测结果",
                        "content":{
                            "abnormal":"异常",
                            "normal":"正常",
                        }
                    },
                    "item3":{
                        "text":"检测详情",
                        "content":{
                            "video":"没有检测到摄像头设备",
                            "listen":"您选择了“听不到声音”",
                            "speak":"您选择了“不可以看到波动”",
                        }
                    },
                },
                "button":{
                    "next":{
                        "text":"下一步"
                    } ,
                    "join":{
                        "text":"加入"
                    },
                    "ok":{
                        "text":"确定"
                    },
                    "startNetworkTest":{
                        "text":"开始网络检测"
                    },
                    "canSee":{
                        "text":"可以看到"
                    },
                    "notSee":{
                        "text":"不可以看到"
                    },
                    "canListen":{
                        "text":"可以听到"
                    },
                    "notListen":{
                        "text":"不可以听到"
                    },
                    "canSpeak":{
                        "text":"可以看到波动"
                    },
                    "notSpeak":{
                        "text":"不可以看到波动"
                    },
                    "checkBack":{
                        "text":"重新检测"
                    },
                    "joinRoom":{
                        "text":"进入房间"
                    }
                }
            }
        }
    },
    "header":{
        "tool":{
            "allStepDown":{
                "title":{
                    "yes":"全体上台" ,
                    "no":"全体下台"
                }
            } ,
            "allMute":{
                "title":{
                    "yes":"全体发言" ,
                    "no":"全体静音"
                }
            } ,
            "capture":{
                "title":{
                    "all":"截屏" ,
                    "small":"截屏时隐藏教室窗口"
                }
            } ,
            "allGift":{
                "title":{
                    "yes":"给全员发奖杯"
                }
            } ,
            "blackBoard":{
                "title":{
                    "open":"小白板" ,
                    "close":"关闭" ,
                    "prev":"上一位" ,
                    "next":"下一位" ,
                    "shrink":"缩小" ,
                },
                "content":{
                    "blackboardHeadTitle":"小白板" ,
                },
                "toolBtn":{
                    "dispenseed":"分发" ,
                    "recycle":"回收" ,
                    "againDispenseed":"再次分发" ,
                    "commonTeacher":'老师' ,
                },
                "tip":{
                    "saveImage":"是否保存白板"
                },
                'boardTool':{
                    "pen":"笔" ,
                    "text":"文字" ,
                    "eraser":"橡皮" ,
                    "color":"颜色及粗细" ,
                }
            } ,
            "sharing":{
                "title":"屏幕共享"
            } ,
            "mouse":{
                "title":"鼠标"
            } ,
            "pencil":{
                "title":"笔" ,
                "pen":{
                    "text":"铅笔工具"
                },
                "Highlighter":{
                    "text":"荧光笔工具"
                },
                "linellae":{
                    "text":"线条工具"
                },
                "arrow":{
                    "text":"箭头工具"
                },
                "laser":{
                    "title":"激光笔" ,
                    "text":"激光笔工具"
                }
            } ,
            "text":{
                "title":"文字" ,
                "Msyh":{
                    "text":"微软雅黑"
                } ,
                "Ming":{
                    "text":"宋体"
                } ,
                "Arial":{
                    "text":"Arial"
                }
            },
            "shape":{
                "title":"形状" ,
                "outlinedRectangle":{
                    "text":"空心矩形"
                } ,
                "filledRectangle":{
                    "text":"矩形"
                } ,
                "outlinedCircle":{
                    "text":"空心椭圆"
                } ,
                "filledCircle":{
                    "text":"椭圆"
                }
            },
            "eraser":{
                "title":"橡皮擦"
            } ,
            "undo":{
                "title":"撤销"
            },
            "redo":{
                "title":"恢复"
            } ,
            "clear":{
                "title":"清屏"
            } ,
            "tool_zoom_big":{
                "title":"放大"
            },
            "tool_zoom_small":{
                "title":"缩小"
            },
            "tool_rotate_left":{
                "title":"逆时针旋转"
            },
            "tool_rotate_right":{
                "title":"顺时针旋转"
            },
            "colorAndMeasure":{
                "title":"颜色及粗细" ,
                "selectColorText":"选择颜色" ,
                "selectMeasure":"选择粗细"
            }
        },
        "page":{
            "prev":{
                "text":"上一页"
            } ,
            "next":{
                "text":"下一页"
            } ,
            "add":{
                "text":"加页"
            } ,
            "lcFullBtn":{
                "title":"绘制区域全屏"
            },
            "pptFullBtn":{
                "title":"PPT全屏"
            },
            "h5FileFullBtn":{
                "title":"h5课件全屏"
            },
            "skipPage":{
                "text_one":"至第" ,
                "text_two":"页"
            } ,
            "ok":{
                "text":"确定"
            },
            "coursewareRemarks":{
                "title":"课件备注"
            },
        },
        "system":{
            "attend":{
                "text":"上课"
            } ,
            "oneToOneFinsh":{
                "text":"下课"
            } ,
            "Raise":{
                "text":"举手" ,
                "noText":"取消举手" ,
                "yesText":"举手" ,
                "raisingHand":"举手中"
            },
            "finish":{
                "text":"下课"
            },
            "gift":{
                "text":"给全员发奖杯"
            },
            "muteAll":{
                "text":"全员静音"
            },
            "help":{
                "title":"帮助"
            },
            "network":{
                "title":"优选网络" ,
                "extend":{
                    "ChinaTelecom":"中国电信（China Telecom）" ,
                    "ChinaUnicom":"中国联通（China Unicom）" ,
                    "ChinaMobile":"中国移动（China Mobile）" ,
                    "InternationalNetwork":"国际网络（International Network）" ,
                    "ChinaSouthernTelecom":"中国南方电信（China Southern Telecom）"
                }
            } ,
            "setting":{
                "title":"设置"
            }
        },
        "volume":{
        	"title":"音量"
        }
    } ,
    "toolContainer":{
        "toolIcon":{
            "whiteBoard":{
                "title":"白板"
            },
            "courseList":{
                "title":"课件列表"
            },
            "classFolder":{
                "title":"课堂文件"
            },
            "adminFolders":{
                "title":"公用文件"
            },
            "documentList":{
                "title":"课件库" ,
                "titleTop":"课件列表" ,
                "titleSort":"排序" ,
                "button":{
                    "addCourse":{
                        "text":"添加课件"
                    },
                    "fileName":{
                        "text":"名称"
                    },
                    "fileType":{
                        "text":"类型"
                    },
                    "uploadTime":{
                        "text":"时间"
                    }
                }
            },
            "H5DocumentList":{
                "title":"课件库" ,
                "titleTop":"课件列表" ,
                "button":{
                    "addCourse":{
                        "text":"添加H5课件"
                    }
                }
            },
            "mediaDocumentList":{
                "title":"媒体库" ,
                "titleTop":"媒体列表" ,
                "button":{
                    "addCourse":{
                        "text":"添加媒体"
                    }
                }
            },
            "screenSharing":{
                "title":"屏幕共享"
            },
            "messageList":{
                "title":"消息列表"
            },
            "addDocument":{
                "title":"添加文档"
            },
            "userList":{
                "title":"花名册" ,
                "button":{
                    "Scrawl":{
                        "on":{
                            "title":"已授权涂鸦"
                        },
                        "off":{
                            "title":"已取消涂鸦"
                        }
                    },
                    "answered":{
                        "on":{
                            "title":"已点名",
                        },
                        "off":{
                            "title":"未点名"
                        },
                    },
                    "video":{
                        "on":{
                            "title":"视频已打开"
                        },
                        "off":{
                            "title":"视频已关闭"
                        },
                        "disabled":{
                            "title":"视频已禁用"
                        }
                    },
                    "update":{
                        "up":{
                            "title":"已上发言席"
                        },
                        "down":{
                            "title":"已下发言席"
                        }
                    },
                    "audio":{
                        "on":{
                            "title":"音频已打开"
                        },
                        "off":{
                            "title":"音频已关闭"
                        },
                        "disabled":{
                            "title":"音频已禁用"
                        }
                    }
                },
                "input":{
                    "text":"查看网络"
                },
            	"userStatus":{
					"assistant":{
						"text":"助教"
					},
					"student":{
						"text":"学生"
					}
				},
            },
            "disableVideo":{
                "yes":"打开视频" ,
                "no":"禁用视频"
            },
            "disableAudio":{
                "yes":"打开音频" ,
                "no":"禁用音频"
            },
            "setting":{
                "title":"设置"
            },
            "help":{
                "title":"帮助"
            },
            "seekHelp":{
                "title":"求助"
            },
            "FileConversion":{
                "text":"文件转换中"
            }
        }
    } ,
    "videoContainer":{
        "videoIcon":{
            "camera":{
                "title":"摄像头"
            } ,
            "microphone":{
                "title":"麦克风"
            }
        },
        "sendMsg":{
            "inputText":{
                "placeholder":"按回车键发送您的消息"
            } ,
            "sendBtn":{
                "text":"发送" ,
                "title":"发送消息"
            },
            "tap":{
                "chat":"聊天",
                "question":"提问",
                "users":"用户列表",
                "doc":"文档",
                "refresh":"刷新"
            },
            "tips":{
                "online":"在线",
                "goback":"返回",
                "pics":"人",
                "private":"和TA私聊",
                "teacher":"老师",
                "assistant":"助教",
                "student":"学生",
                "patrol":"巡课",
                "me":"我",
                "join":"加入了课堂！",
                "leave":"离开了课堂！",
                "beforeClass":"课程未开始",
                "afterClass":"课程已结束",
                "whiteBoard":"还没上课，暂无显示内容"
            },
            "filter":{
                "quizobj":"只向老师提问",
                "seeQuiz":"只看我的提问",
                "seeChat":"只看老师的聊天",
                "seeAnswer":"只看我的回答"
            }
        }
    },
    "otherVideoContainer":{
        "videoIcon":{
            "microphone":{
                "title":"麦克风"
            } ,
            "userUpdate":{
                "title":"视频发布"
            },
            "userPen":{
                "title":"涂鸦"
            }
        },
        "button":{
            "scrawl":{
                "yes":"授权" ,
                "no":"取消授权"
            } ,
            "platform":{
                "yes":"上发言席" ,
                "no":"下发言席"
            } ,
            "audio":{
                "yes":"打开音频" ,
                "no":"关闭音频"
            } ,
            "video":{
                "yes":"打开视频" ,
                "no":"关闭视频"
            } ,
            "gift":{
                "yes":"发送奖杯"
            } ,
            "restoreDrag":{
                "text":"恢复位置"
            },
            "allPlatformDown":{
                "yes":"全体下台"
            } ,
            "allMute":{
                "yes":"全员静音"
            } ,
            "videoStatusChairman":{
                "yes":"打开视频" ,
                "no":"关闭视频"  ,
                "text":"关闭视频"
            } ,
            "audioStatusChairman":{
                "yes":"打开音频"  ,
                "no":"关闭音频"  ,
                "text":"关闭音频"
            },
            'areaExchange': {
                'text': '区域交换',
            } ,
            "oneKeyReset":{
            	'text': '全部恢复',  // tkpc2.0.8
            },
        },
        "prompt":{
            "text":"该学生按home键啦",
            "userText":"该用户按home键啦"
        },
    },
    "alertWin":{
        "login":{
            "register":{
                "roomEmpty":{
                    "text":"用户名和房间号是必需的！"
                },
                "eventListener":{
                    "accessDenied":{
                        "text":"访问没有授予摄像头和麦克风！"
                    },
                    "errorRoom":{
                        "text":"加入课堂失败！"
                    } ,
                    "errorMedia":{
                        "text":{
                            "one":"媒体服务器连接失败," ,
                            "two":"，请重新连接。"
                        }
                    },
                    "roomClosed":{
                        "text":{
                            "one":"课堂 '" ,
                            "two":"' 被服务器强行关闭。"
                        }
                    },
                    "roomDelClassBegin":{
                        "text":"本次课程已经结束！"
                    },
                    "lostConnection":{
                        "text":{
                            "one":"课堂失去连接，课堂号：" ,
                            "two":"，请重新连接！"
                        },
                        "ok":{
                            "text":"重新连接"
                        } ,
                        "title":{
                            "text":"失去连接"
                        }
                    },
                    "participantEvicted":{
                        "roleConflict":{
                            "text":"有相同身份的用户进入，您已经离开房间！"
                        }
                    },
                    "broadcastClass":{
                        "roleChairman":{
                            "text":"该教室为直播教室，请您选择客户端进入教室！"
                        }
                    }
                }
            },
            "func":{
                "checkMeetingBeyond":{
                    "chairmanBeyond":{
                        "text":"有别的老师进入课堂，您已经被踢出！"
                    } ,
                    "studentBeyond":{
                        "text":"有别的学生进入课堂，您已经被踢出！"
                    }
                } ,
                "checkMeeting":{
                    "status_minus_1":{
                        "text":"获取课堂信息失败！"
                    } ,
                    "status_3001":{
                        "text":"服务器过期！"
                    } ,
                    "status_3002":{
                        "text":"公司被冻结！"
                    } ,
                    "status_3003":{
                        "text":"课堂被删除或过期！"
                    } ,
                    "status_4007":{
                        "text":"课堂不存在！"
                    } ,
                    "status_4008":{
                        "text":"课堂密码错误！"
                    } ,
                    "status_4110":{
                        "text":"该课堂需要密码，请输入密码！"
                    } ,
                    "status_4109":{
                        "text":"认证错误！"
                    } ,
                    "status_4103":{
                        "text":"课堂人数超限！"
                    } ,
                    "status_4112":{
                        "text":"企业点数超限！"
                    } ,
                    "status_defalut":{
                        "text":"获取课堂信息失败！"
                    }
                }

            }
        },
        "call":{
            "prompt":{
                "noLogin":{
                    "text":"您没有登陆，不能进入课堂，请登录之后再进入课堂！"
                } ,
                "noAudioFacility":{
                    "text":"当前没有音频设备，无法上课"
                },
                "chat":{
                    "literally":{
                        "yes":{
                            "text":"您已获得涂鸦权限"
                        } ,
                        "no":{
                            "text":"您的涂鸦权限已取消"
                        }
                    }
                },
                "publishStatus":{
                    "stream":{
                        "yes_status_3":{
                            "text":"您被请上了发言席"
                        } ,
                        "no_status_0":{
                            "text":"您已离开发言席"
                        },
                        "yes_status_0_to_2":{
                            "text":"您被请上了发言席,未获得语言权限"
                        } ,
                        "yes_status_3_to_2":{
                            "text":"音频权限已取消，如果您需要获取音频权限请点击举手按钮"
                        },
                        "videooff":{
                            "text":"您的视频权限已被取消"
                        },
                        "audiooff":{
                            "text":"您的语音权限已被取消"
                        },
                        "audioon":{
                            "text":"您的音频权限已开启"
                        },
                        "videoon":{
                            "text":"您的视频权限已开启"
                        },
                        "allon":{
                            "text":"您已获得音频和视频权限"
                        },
                        "alloff":{
                            "text":"您的音频和视频权限已被取消"
                        },
                    },
                    "allMute":{
                        "yes":{
                            "text":"课堂处于全体静音状态"
                        },
                        "no":{
                            "text":"课堂处于全体发言状态"
                        }
                    }
                },
                "joinRoom":{
                    "stream":{
                        "join":{
                            "text":"加入课堂"
                        },
                        "leave":{
                            "text":"离开课堂"
                        }
                    }
                },
                "homeBtnRemind":{
                    "join":{
                        "text":"回到了正常模式"
                    },
                    "leave":{
                        "text":"进入了后台模式"
                    },
                    "userBackgroundMode":{
                        "text":"该学生的应用程序在后台，无法上台"
                    }
                },
                "streamConnectFailed":{
                    "onceSuccessed":{
                        "text":"网络出现异常，请检查网络环境，重新进入"
                    },
                    "notSuccess":{
                        "text":"系统检测到到您的网络不支持udp，请联系网管理人员关闭udp防火墙"
                    },
                },
                "remoteStreamFailure":{
                    "udpNotOnceSuccess": {
                        "one":"由于防火墙原因，用户（" ,
                        "two":"）与服务器之间的UDP通讯无法建立，无法上台" ,
                    },
                    "udpMidwayDisconnected": {
                        "one":"用户（" ,
                        "two":"）与服务器之间的UDP通讯异常，无法上台" ,
                    },
                    "publishvideoFailure_notOverrun": {
                        "one":"用户（" ,
                        "two":"）与服务器之间的通讯异常，无法上台" ,
                    },
                    "publishvideoFailure_overrun":{
                        "one": "课堂发言席人数超过限制"
                    },
                    "mobileHome":{
                        "one":"学生" ,
                        "two":"的应用程序在后台运行，无法上台" ,
                    }
                },
                "releaseFailed": {
                    "text": "视频发布失败"
                }
            } ,
            "fun":{
                "uploadCourseFile":{
                    "fileTypeError":{
                        "text":{
                            "one": "文件类型错误，不支持文件类型为'.",
                            "two":"'的文件！"
                        }
                    },
                    "fileSizeError":{
                        "text":{
                            "one": "文件大小超过限制，文件大小不能超过"
                        }
                    },
                    "fileUpload":{
                        "success":{
                            "text":"文件上传成功，上传的文件名字是'"
                        },
                        "failure":{
                            "text":"文件上传失败！"
                        }
                    }
                },
                "deleteCourseFile":{
                    "fileDelete":{
                        "failure":{
                            "text":"文件删除失败！"
                        }
                    },
                    "isDel":"您确定要删除吗？"
                },
                "page":{
                    "pageInteger":{
                        "text":"输入的页数必须是整数！"
                    } ,
                    "pageMax":{
                        "text":"输入的页数不能超过最大页数！" ,
                    },
                    "pageMin":{
                        "text":"输入的页数不能小于1"
                    }
                },
                "file":{
                    "mediaFile":{
                        "text":"该媒体文件播放失败！"
                    },
                    "pptFile":{
                        "text":"该动态PPT文件播放失败！"
                    }
                } ,
                "video":{
                    "max":{
                        "text":"超出最大视频路数，请老师先确定上课人数！"
                    }
                },
                "audit":{
                    "title":{
                        "text":"溫馨提示：直播尚未开始，请耐心等候。"
                    },
                    "ended":{
                        "text":"溫馨提示：直播已结束，感谢您的参与。"
                    }
                },
                "UnreadMessage":{
                        "text":"条未读消息！"
                },
            }
        },
        "ok":{
            "showError":{
                "text":"确定"
            },
            "showPrompt":{
                "text":"确定"
            },
            "showConfirm":{
                "cancel":"取消" ,
                "ok":"确定"
            }
        },
        "title":{
            "showError":{
                "text":"错误信息"
            },
            "showPrompt":{
                "text":"提示信息"
            } ,
            "showConfirm":{
                "text":"确认消息"
            }
        },
        "settingWin":{
            "settingTitle":{
                "text":"系统设置"
            },
            "default":{
                "text":"默认"
            },
            "communications":{
                "text":"通讯"
            },
            "settingOk":{
                "text":"应用"
            },
            "settingClose":{
                "text":"取消"
            },
            "videoInput":{
                "text":"视频设备"
            },
            "audioInput":{
                "text":"音频输入设备"
            },
            "audioOutput":{
                "text":"音频输出设备"
            }
        },
        "messageWin":{
            "title":{
                "closeWindow":{
                    "text": "消息确认框"
                },
                "classBeginEnd":{
                    "text":"下课提示"
                },
                "allGift":{
                    "text":"发送提示"
                }
            },
            "winMessageText":{
                "closeWindow":{
                    "ok":{
                        "text":"是否关闭系统！"
                    }
                },
                "classBeginEnd":{
                    "text":"您确定要下课吗？"
                },
                "classBeginEndLocalRecord":{
                    "text":"正在本地录制中，下课后会自动停止本地录制，录制文件的存放地址为："
                },
                classBeginStartNotSelectRecord:{
                    text:'不自动开始本地录制，直接开始上课'
                },
                "aloneGift":{
                    "before":"是否要给" ,
                    "after":"同学发送奖励？"
                },
                "allGift":{
                    "one":"确定给" ,
                    "two":"所有人" ,
                    "three":"奖励？"
                }
            },
            "messageOk":{
                "text":"确认"
            },
            "messageClose":{
                "text":"取消"
            }
        }
    } ,
    "remind":{
        "time":{
            "readyStart":{
                "one":"距离上课时间还有" ,
                "two":"分钟，请做好准备"
            } ,
            "timeoutStart":{
                "one":"已逾时" ,
                "two":"分钟，请抓紧时间开始上课"
            },
            "endNotBegin":{
                "one":"课堂已结束，您没有上课哦！"
            } ,
            "readyEnd":{
                "one":"距离下课还有" ,
                "two":"分钟，请合理安排时间哦~"
            } ,
            "timeoutReadyEnd":{
                "one":"您已超时" ,
                "two":"分钟，课堂将于" ,
                "three":"分钟之后自动关闭！"
            },
            "timeoutEnd":{
                "one":"课堂即将关闭 (" ,
                "two":"’)"
            },
            "endBegin":{
                "one":"课堂已结束！"
            }
        },
        "button":{
            "remindKnow":{
                "text":"我知道了"
            } ,
            "raise":{
                "yes":"同意" ,
                "no":"不同意"
            }
        },
        "raise":{
            "content":{
                "text":"该同学举手"
            }
        }
    },
    "publish":{
        "beyondMaxVideo":{
            "text":"发言席人数超过限制!"
        }
    },
    "networkStatus":{
        rtt:{
            title:{
                "text":"网络延时"
            }
        },
        packetsLost:{
            title:{
                "text":"丢包率"
            }
        },
        network:{
            title:{
                "text":"网络状态"
            },
            value:{
                excellent:'优' ,
                well:'良好' ,
                general:'一般' ,
                suck:'差' ,
            }
        },
    },
    "toolCase":{
    	"toolBox":{
    		"text":"工具箱"
    	}
    },
	"timers":{
        "timerSetInterval":{
            "text":"计时器"
        },
        "timerBegin":{
            "text":"开始"
        },
        "timerStop":{
            "text":"暂停"
        },
        "again":{
            "text":"重新开始"
        },
    },
    "dial":{
        "turntable":{
            "text":"转盘"
        }
    },
    "answers":{
        "headerTopLeft":{
            "text":"答题器"
        },
        "headerMiddel":{
            "text":"点击字母预设正确答案"
        },
        "beginAnswer":{
            "text":"开始答题"
        },
        "tureAccuracy":{
            "text":"正确率"
        },
        "trueAnswer":{
            "text":"正确答案"
        },
        "endAnswer":{
            "text":"结束答题"
        },
        "restarting":{
            "text":"重新开始"
        },
        "myAnswer":{
            "text":"我的答案"
        },
        "changeAnswer":{
            "text":"修改答案"
        },
        "selectAnswer":{
            "text":"请至少选择一个答案"
        },
        "submitAnswer":{
            "text":"提交答案"
        },
        "numberOfAnswer":{
        	"text":"答题人数"
        },
        "PublishTheAnswer":{
        	"text":"公布答案"
        },
         "published":{
        	"text":"已公布"
        },
        "details":{
        	"text":"详情"
        },
        "statistics":{
        	"text":"统计"
        },
        "student":{
        	"text":"学生"
        },
        "TheSelectedTheAnswer":{
        	"text":"所选答案"
        },
        "AnswerTime":{
        	"text":"答题用时"
        },
        "end":{
        	"text":"请先结束答题"
        }
    },
    "responder":{
    	"responder":{
    		"text":"抢答器"
    	},
    	"begin":{
            "text":"开始抢答"
        },
        "restart":{
            "text":"重新开始"
        },
        "close":{
            "text":"关闭"
        },
        "update":{
        	"text":"当前浏览器不支持canvas组件请升级！"
        },
        "inAnswer":{
        	"text":"抢答中"
        },
        "answer":{
        	"text":"抢答"
        },
        "noContest":{
        	"text":"无人抢答"
        }
    },
    "shares": {
        "shareSceen": {
            "text": "桌面共享"
        },
        "stopShare": {
            "text": "停止共享"
        },
        "shareing": {
            "text0": "正在进行程序共享......",
            "text1": "正在进行区域共享......",
            "text2": "正在进行桌面共享......",
        },
        "sharingMode":{
            "text":"请选择共享模式"
        },
        "programmShare":{
            "text":"程序共享"
        },
        "shareArea": {
            "text": "区域共享"
        },
        "startSharing":{
            "text":"开始共享"
        },
        "selectProgramm":{
            "text":"请选择想要共享的程序"
        },
        "programmShareArea":{
            "text":"* 红框内为共享区域"
        }
    },
    "phoneBroadcast":{   /*手机直播端语言*/
        "chat":{
            "notClassBegin":{
                "text":"还没上课,暂无演示内容"
            },
            "face":{
                "naughty":'调皮' ,
                "happy":'开心' ,
                "complacent":'得意',
                "curlOnesLips":'撇嘴' ,
                "grieved":'难过' ,
                "shedTears":'流泪' ,
                "kiss":'亲亲' ,
                "love":'么么哒' ,
            }
        }
    } ,
    "getUserMedia":{
        "accessAccepted":{
            "getUserMediaFailure_reGetAudio":"系统检测到您的视频无法获取成功，请检查摄像头设备是否松动或被其它程序占用" , //备注:音视频设备都有，但是视频获取失败，音频获取成功——视频获取失败可能是因为设备占用等
            "getUserMediaFailure_reGetVideo":"系统检测到您的音频无法获取成功，请检查麦克风设备是否松动或被其它程序占用" //备注:音视频设备都有，但是音频获取失败，视频获取成功
        },
        "accessDenied":{
            "streamFail":"获取音视频失败，请检查系统摄像头/麦克风设备的设置或者退出杀毒软件" , //备注:音视频设备至少有一个，但是都获取失败 ， 原因可能性无法确定
            "notAudioAndVideo":"系统检测不到您的摄像头/麦克风设备，请检查设备是否松动或被其它程序占用" //备注:音视频设备都没有
        }
    },
    "broadcast":{
        "errorHintInfo":"主播正在休息，请换个主播看看吧~"
    },
    "version":{
       "clientDeviceVersionInfo": {
           "key":"当前使用的客户端设备：" ,
           "client":"客户端" ,
           "pc":"网页PC端" ,
           "mobile":"网页移动端" ,
       } ,
        "browserVersionInfo":{
            "webpageApp":"浏览器：" ,
            "mobileApp":"操作系统版本：" ,
        },
        "appVersionInfo":{
            "key":"版本号：" ,
        }
    },
    "quiz": { //提问区语言包
        "ask": "提问",
        "answer": "回复",
        "pass": "通过",
        "delete": "删除",
        "studentAskRemind" : {
            "part1": "您的问题“",
            "part2": "”已经提交，请耐心等待审核",
        },
        'onlyTeacher': '只看老师',
        'onlySelf': '只看自己',
        'intervalTips': {
            'part1': '您发送消息过于频繁，请',
            'part2': '秒后再试',
        }
    },
    'notice': { // 广播、通知、公告语言包
        'notice': '公告',
        'broadcast': '广播',
        'inform': '通知',
        'content': '内容',
        'href': '超链接',
        'publishNotice': '发布公告',
        'publishBroadcast': '发布广播',
        'publishInform': '发布通知',
        'publish': '发布',
        'cancel': '取消',
    },
    "welcomeClassroom":{
        "text":"欢迎来到互动课堂",
        "roomId":"房间号："
    },
    "vote":{
        "vote": "投票",
        "back": "后退",
        "close": "关闭",
        "modification": "修改",
        "publish": "发布",
        "check": "查看投票详情",
        "unpub": "未发布",
        "voting": "投票中",
        "finished": "已结束",
        "voteRes": "投票结果",
        "finishVote": "结束投票",
        "voteTips": "用于出题作答、互动活动、选择决策，提交后以弹窗形式展现在观众面前。",
        "startVote": "发起投票",
        "subject": "主题",
        "desc": "描述",
        "type": "类型",
        "radio": "单选",
        "checkbox": "多选",
        "options": "选项",
        "addOption": "增加选项",
        "cancel": "取消",
        "save": "保存",
        "delete": "删除",
        "voteCommit": "提交投票",
        "commit": "提交",
    },
    "callroll":{
        "callroll": "点名",
        "signIn": "签到",
        "close": "关闭",
        "tips": "用于课堂点名，会议签到。发布点名后以弹窗的形式出现在观众屏幕中央。",
        "setType": "设置点名时间",
        "timerType0": "1分钟",
        "timerType1": "3分钟",
        "timerType2": "5分钟",
        "timerType3": "10分钟",
        "timerType4": "30分钟",
        "state0": "点名中",
        "state1": "已结束",
        "crTime": "点名时间",
        "totalNum": "点名人数：999+",
        "signInNum": "签到人数",
    },
    "loadSupernatantPrompt":{
        "reconnecting":"网络抖动，正在为您恢复中" ,
        "loadRooming":"正在连接课堂" ,
        "loadRoomingPlayback":"正在获取回放资源" ,
        "refreshing":"请稍后，助教正帮您重新登陆" ,
    },
    "remoteControl":{
       "remoteTitle": "远程管理" ,
        "refresh":"强制刷新" ,
        "deviceManagement":"设备管理" ,
        "optimalServer":"优选网络",
    } ,
    localRecord:{
        recordState:{
            notStart:'本地录制' ,
            recording:'录制中' ,
            recordPaused:'已暂停' ,
        },
        title:{
            startRecord:'开始录制' ,
            stopRecord:'停止录制' ,
            pauseRecord:'暂停录制' ,
            playRecord:'恢复录制' ,
        }
    },
	"coursewareRemarks":{
        "remarks":"备注",
        "close":"关闭",
    },
};
export default chineseLanguage ;