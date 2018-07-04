/**
 * 导出公用模块 by R37
 * 每次都引那么多公用模块不累么？？？？？？？
 */

import ServiceTools from 'ServiceTools';
import ServiceRoom from 'ServiceRoom';
import ServiceTooltip from 'ServiceTooltip';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import TkUtils from 'TkUtils';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import RoleHandler from 'RoleHandler';
import RoomHandler from 'RoomHandler';
import StreamHandler from 'StreamHandler';
import TkAppPermissions from 'TkAppPermissions';
import WebAjaxInterface from 'WebAjaxInterface';
import SignallingInterface from 'SignallingInterface';
import ButtonDumb from 'ButtonDumb';

let handler = {
    get: (target, name) => {
        switch (name) {
            case 'stool':
                    return ServiceTools;
                break;
            case 'sroom':
                    return ServiceRoom;
                break;
            case 'stip':
                    return ServiceTooltip;
                break;
            case 'ss':
                    return ServiceSignalling;
                break;
            case 'cc':
                    return CoreController;
                break;
            case 'utils':
                    return TkUtils;
                break;
            case 'c':
                    return TkConstant;
                break;
            case 'g':
                    return TkGlobal;
                break;
            case 'role':
                    return RoleHandler;
                break;
            case 'room':
                    return RoomHandler;
                break;
            case 'stream':
                    return StreamHandler;
                break;
            case 'pms':
                    return TkAppPermissions;
                break;
            case 'ajax':
                    return WebAjaxInterface;
                break;
            case 'sl':
                    return SignallingInterface;
                break;
            case 'btn':
                    return ButtonDumb;
                break;
        
            default:
                    return console.log('%cPlease define this param in common.js:)', 'color:red;')
                break;
        }
    }
}

let cm = new Proxy({}, handler);  // cm means common

export default cm;