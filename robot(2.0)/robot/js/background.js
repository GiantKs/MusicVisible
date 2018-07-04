var POWERMATE_VENDOR_ID = 1155; //0x0ed1;
var POWERMATE_PRODUCT_ID = 24614 ; //0x7806;
var DEVICE_INFO = {
    "vendorId": POWERMATE_VENDOR_ID,
    "productId": POWERMATE_PRODUCT_ID
};

//var powerMateDevice;
var _connectionId = null;
var _deviceId=null;
var _sender = null;
var _isOpenedFalg = false;
var _crtDevicePid = 0;
var _crtDeviceVid = 0;

// 监听到USB设备插入
chrome.hid.onDeviceAdded.addListener(function(device) {
    if(device.productId==POWERMATE_PRODUCT_ID && device.vendorId==POWERMATE_VENDOR_ID && _isOpenedFalg){
        if(!_deviceId || !_connectionId){
            if(_sender){
                connectDevice(devicePoll);
            }else{
                connectDevice();
            }
        }
    }
});

// 监听到有USB设备拔出
chrome.hid.onDeviceRemoved.addListener(function(deviceId){
    if(deviceId == _deviceId) {
        if(_deviceId || _connectionId) {
			_connectionId = null;
			_deviceId=null;
        }
    }
});

// 权限请求成功回调
var gotPermission = function(result) {
    connectDevice(devicePoll)
};

// 连接设备
function connectDevice(devicePoll) {
    chrome.hid.getDevices(DEVICE_INFO, function(devices) {
        if (!devices || !devices.length) {
            if(_sender){
                _sender.postMessage({status:2});   // device not found
            }
            return;
        }
        _deviceId = devices[0].deviceId;
        chrome.hid.connect(_deviceId, function(connection) {
            if (!connection.connectionId) {
                if(_sender){
                    _sender.postMessage({status:3});   // device connect fail
                }
                return;
            }
            //console.log('Connected to the HID device!', connection);
            _connectionId = connection.connectionId;
            _isOpenedFalg = true;  // 表示该设备已经打开过
            // 设置插件当前操作设备的pid与vid
            _crtDevicePid = POWERMATE_PRODUCT_ID;
            _crtDeviceVid = POWERMATE_VENDOR_ID;

            if(_sender){
                _sender.postMessage({status:0});
            }
            if(devicePoll){
                devicePoll();
            }
        })
    });
}

// 轮询USB数据
var devicePoll = function() {
    if (_connectionId && _sender) {
        chrome.hid.receive(_connectionId, function(reportId, data) {
            if (data) {
                var xy = _arrayBufferToString(data);
                var x = xy['x'], y =xy['y'], s = xy['s'], p = xy['p'];
                _sender.postMessage({"status":1, "x":x,"y":y,"s":s,"p":p});
            }
            setTimeout(devicePoll, 0);
        });
    }
};

// 权限请求
var permissionObj = {
    permissions: [{
        'usbDevices': [DEVICE_INFO]
    }]
};

// USB传输数据转换为设备坐标点
function _arrayBufferToString(buffer) {
    var bytes = new Uint8Array(buffer);
	//console.log('buffer->', bytes, "length=", bytes.byteLength);
    var s = bytes[0];
    var x = (bytes[2] << 8 | bytes[1]);
    var y = (bytes[4] << 8 | bytes[3]);
    var p = (bytes[6] << 8 | bytes[5]);
    //返回点
    var myopen = new Array();
    myopen['x'] = x;
    myopen['y'] = y;
    myopen['s'] = s;
    myopen['p'] = p;
    return myopen;
}

// 添加页面请求回调地址
chrome.runtime.onConnectExternal.addListener(function(sender) {
//chrome.runtime.onConnect.addListener(function(sender) {
    sender.onMessage.addListener(function(msg) {
        //断开设备
        if(msg.cmd == 'close') {
            _connectionId = null;
            _sender = null;
            _isOpenedFalg = false;
            _deviceId=null;
			return;
        }else if (msg.cmd == 'open') {
            console.log("open device");
            if (_connectionId != null && 
                _deviceId != null) {
                // 设备已经打开过
                _sender.postMessage({status:5});
                return;
            }

            _sender = sender;
            chrome.permissions.request(permissionObj, function(result) {
                if (result) {
                    gotPermission();
                } else {
                    console.log('App was not granted the "usbDevices" permission.');
                    console.log(chrome.runtime.lastError);
                    _sender.postMessage({status:2});   // 权限请求失败
                }
            });
        }else if(msg.cmd == 'setDeviceID') {
            POWERMATE_PRODUCT_ID = msg.pid;
            POWERMATE_VENDOR_ID = msg.vid;
            DEVICE_INFO = {
                "vendorId": POWERMATE_VENDOR_ID,
                "productId": POWERMATE_PRODUCT_ID
            };
        }
    })
})

