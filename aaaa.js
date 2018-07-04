/*
 let a = new Map([
    [
        "ques_1522759469841",
        {
            "id": "ques_1522759469841",
            "createtime": 1522759469,
            "type": 0,
            "status": 1,
            "options": [
                {
                    "isright": false
                },
                {
                    "isright": true
                },
                {
                    "isright": false
                },
                {
                    "isright": false
                }
            ],
            "result": {
                "stuanswers": [
                    {
                        "id": "324bbacf-e09e-8671-c64d-9ee3f84ea9e5",
                        "name": "123",
                        "targets": [
                            2
                        ],
                        "groups": [],
                        "committime": 1522759450
                    }
                ]
            }
        }
    ]
]);
let b=a.get('ques_1522759469841')
 console.log(JSON.stringify(b));

var str='sada'
 console.log(parseInt(str));
var arr=[1,2,3]




 console.log(arr.filter((item, index) => {
     if(item==1)return
     console.log(222);
     return item == 1
 }));

 console.log(Array.isArray(2));Array.isArray(2)

 console.log(arr.hasOwnProperty(sort));*/

/*
var str='100%';
console.log(parseFloat('100%'));

var s=[1,2,3]
console.log(s.toString());

console.log(false == undefined);*/

var obj=[{a:1},{b:1},{c:1},{d:1},{e:1},{f:1},{n:1}]

var a = 0.361212
obj[obj.length-1].n=100;
console.log(obj);
console.log(NaN.toString());
console.log(isNaN(NaN));
/*console.log(Number('s'));
console.log(Number((a.toFixed(2))).toFixed(2));*/
console.log(a.toFixed(2));
console.log(!undefined);


console.log(![]);

protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (getUseDeveloperSupport() && Build.VERSION.SDK_INT >= 23) {
        // Get permission to show redbox in dev builds.
        if (!Settings.canDrawOverlays(this)) {
            Intent serviceIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            startActivity(serviceIntent);
            FLog.w(ReactConstants.TAG, REDBOX_PERMISSION_MESSAGE);
            Toast.makeText(this, REDBOX_PERMISSION_MESSAGE, Toast.LENGTH_LONG).show();
        }
    }

    mReactRootView = createRootView();
    //这是最重要的一步
    mReactRootView.startReactApplication(
        getReactNativeHost().getReactInstanceManager(),
        getMainComponentName(),
        getLaunchOptions());
    setContentView(mReactRootView);
    mDoubleTapReloadRecognizer = new DoubleTapReloadRecognizer();
}



