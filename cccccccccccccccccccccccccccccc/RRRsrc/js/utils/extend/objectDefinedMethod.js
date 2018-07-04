Object.customAssign = function(source){
    try{
        return Object.assign.apply(Object.assign ,arguments );
    }catch (err){
        let copySource = L.Utils.toJsonParse( L.Utils.toJsonStringify(source) );
        for(let i=1 ; i<arguments.length;i++){
            let assignObj = arguments[i];
            if(assignObj && typeof assignObj === 'object'){
                for(let key in assignObj){
                    copySource[key] = assignObj[key] ;
                }
            }
        }
        source = copySource || {};
        return source ;
    }
};