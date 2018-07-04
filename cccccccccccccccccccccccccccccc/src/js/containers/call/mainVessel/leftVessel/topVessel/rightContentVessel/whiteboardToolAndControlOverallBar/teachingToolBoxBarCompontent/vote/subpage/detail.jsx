import React from 'react';
import TkGlobal from 'TkGlobal' ;
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';

class VoteDetail extends React.Component{

    constructor(props){
        super(props);

        this.data = props.data;
        this.pagination = 1;
        this.optionMin = 2;
        this.optionMax = 8;
        this.firstOptionNumber = 'A'.charCodeAt();
        this.dataTempList = Object.keys({
            id:      undefined,
            desc:    undefined,
            type:    undefined,
            maxOp:   undefined,
            status:  undefined,
            subject: undefined,
            options: [{}, {}, {}, {}],
        })

        this.state = {
            optionList: props.data.options,
            optionType: props.data.id ? props.data.type : 'radio',
        }
    }

    handleChange(self, data, e){
        if(typeof data !== "object")return;
        
        let value = e.target.value,
            checked = e.target.checked,
            type = data.type;

        switch(type){
            case 'subject':
                self.data[type] = value;
                break;
            case 'desc':
                self.data[type] = value;
                break;
            case 'type':
                self.data.maxOp = value === 'radio' ? 1 : self.state.optionList.length;
                self.updateOptionList('tc', false);
                self.setState({
                    optionType: value,
                });
                break;
            case 'maxOp':
                if(parseInt(e.target.value)>8){
                    e.target.value = 8;
                }else if(parseInt(e.target.value)>this.state.optionList.length){
                    e.target.value = this.state.optionList.length;
                }
                self.data[type] = (parseInt(value) !== 'NaN' && 
                                   parseInt(value) > 0 && 
                                   parseInt(value)<this.state.optionList.length) ?
                                   parseInt(value) : this.state.optionList.length;
                break;
            case 'options':
                data.key = e.target.name;

                // if(self.state.optionType === 'radio' && data.key === 'isRight'){
                //     if(self.state.optionList.filter(item=>item.isRight === true || item.isRight === 'true').length >= 1)return;
                // }else if(data.key === 'isRight'){
                //     if(self.state.optionList.filter(item=>item.isRight === true || item.isRight === 'true').length >= self.data.maxOp)return;
                // }

                if(this.state.optionType === 'radio' && data.isoption){
                    let list = this.state.optionList.map((item,i)=>{
                        if(i === data.index){
                            item.isRight = true;
                        }else{
                            item.isRight = false;
                        }
                    })
                    this.setState({
                        optionList: list,
                    })
                }else  if(this.state.optionType === 'checkbox' && data.isoption){
                    let trueNum = this.mapOptionListFlg()
                    let maxVal = this.refs.isMaxNum.value || this.state.optionList.length;
                    let arr = this.state.optionList;
                    if(arr[data.index].isRight){
                        arr[data.index].isRight = !arr[data.index].isRight;
                    }else if(isNaN(parseInt(maxVal))){
                        arr[data.index].isRight = !arr[data.index].isRight;
                    }else{
                        let num = parseInt(maxVal);
                        if(trueNum >= num){
                            return ;
                        }else{
                            arr[data.index].isRight = !arr[data.index].isRight;
                        }
                    }
                    self.setState({
                        optionList: arr,
                    })
                }
                
                self.updateOptionList(data, data.key === 'isRight' ? checked : value);
                break;
            default:
            break;
        }
        
    }

    mapOptionListFlg(){
        let that = this;
        let num = 0;
        that.state.optionList.forEach((item,index)=>{
            if(item.isRight === true){
                num++
            }
        })
        return num;
    }


    handleSave(pageNum, data, handle){
        if(!data.target){
            let msg = '请填写投票';

            data.id = this.props.data.id ? this.props.data.id : this.__getVoteID();
            data.type = this.state.optionType;
            data.options = this.state.optionList;
            data.owner = ServiceRoom.getTkRoom().getMySelf().nickname;
            data.cTime = TkUtils.getGUID().getFormatDate(); // Vote create time
            data.createTime = Date.parse(new Date())/1e3;

            switch(handle){
                case 'updateList':
                    data.status = 'UNPUB';
                    break;
                case 'cpublish':
                    data.status = this.props.hasVoting ? 'UNPUB' : 'PUB';
                    break;
            }

            if(this.compareObj(data, this.dataTempList).udfKey === 'subject'){
                this.refs.subject.placeholder = TkGlobal.language.languageData.vote.textPlaceholder1;
                this.refs.subject.classList.add('error');
                return;
            }else if(this.compareObj(data, this.dataTempList).udfKey === 'desc'){
                this.refs.desc.placeholder = TkGlobal.language.languageData.vote.textPlaceholder;
                this.refs.desc.classList.add('error');
                return;
            }else if(data.options.some((item, index) => {
                return !this.compareObj(item, ['content']).flag
            })){
                data.options.some((item, index) => {
                    if(!this.compareObj(item, ['content']).flag){
                        this.refs['opt'+index].classList.add('error');
                        return this.refs['opt'+index].placeholder = '请输入'+TkGlobal.language.languageData.vote.options+String.fromCharCode(this.firstOptionNumber + index);
                    }
                })
                return;
            }

            if(this.com(data.options.map(item=>item.content)))return this.props.toast({msg: '选项不可以重复', time: 1500});
        }
        
        this.props.toListPage(pageNum, data, handle)
    }

    com(arr){
        let tmp = Array.from(arr).sort(),
            flag = false;
        for(let i = 0; i < tmp.length-1; i++){
            if(tmp[i] === tmp[i+1]){
                flag = true
            }
        }
        return flag;
    }

    getTips(type){
        let msg = undefined;
        switch (type) {
            case 'subject':
                msg = '主题';
                break;
            case 'desc':
                msg = '详情';
                break;
        
            default:
                break;
        }

        return msg === undefined ? '选项' : msg;
    }

    handleUpdateOptionList(isAdd, index){
        if((isAdd && this.state.optionList.length === this.optionMax) || (!isAdd && this.state.optionList.length === this.optionMin))return;
        let tempList = this.state.optionList;
        isAdd ? tempList.push({isRight: false}) : tempList.splice(index, 1);

        this.setState({
            optionList: tempList,
        });
    }

    updateOptionList(data, value){
        let tempList = [];

        // if(value === true && 
        //    this.state.optionType === 'checkbox' &&
        //    this.getKeyNum(this.state.optionList, 'isRight', true) >= this.data.maxOp)return;

        this.state.optionList.map((item, index) => {
            item = typeof item === 'object' ? item : {};
            if(data === 'tc'){   // tc means type-change
                item.isRight = value;
            }else if(index === data.index){
                item[data.key] = value;
            }
            tempList.push(item);
        });

        this.setState({
            optionList: tempList,
        });
    }

    // 同步获取数组中某key === 某value的个数
    getKeyNum(array, key, value){
        let count = 0;

        for(let i = 0; i < array.length; i ++){
            count += (array[i][key] === value ? 1 : 0)
        }

        return count;
    }

    // 比较两个数组是否含有相同项
    compareObj(checkedObj, arrTmp){
        let flag   = true,
            udfKey = undefined,
            index  = undefined;

        if(typeof checkedObj === 'object' && !Array.isArray(checkedObj) && Array.isArray(arrTmp)){
            arrTmp.forEach((key, index) => {
                if(!checkedObj[key]){
                    flag   = false;
                    udfKey = key;
                    index  = index;
                }
            });
        }
        return {flag, udfKey, index};
    }

    __getVoteID(){
        return TkUtils.getUniqueId(); // vote_userid_timestamp
    }

    __getOptionList(){
        let optionList = [];
        this.state.optionList.map((item, index) => {
            optionList.push(
                <div key={index} className='vote-input-wrap flex-box'>
                    {/* {String.fromCharCode(this.firstOptionNumber + index)} */}
                    <input name='isRight' type="checkbox" 
                           onChange={this.handleChange.bind(this, this, {type: 'options', index,isoption:true})}
                           checked={typeof this.state.optionList[index].isRight === 'boolean' ? 
                                           this.state.optionList[index].isRight : 
                                           ( (this.state.optionList[index].isRight === true || this.state.optionList[index].isRight === 'true' ) ? true :false)}/>
                    <input name='content' type="text" ref={'opt'+index}
                           placeholder={TkGlobal.language.languageData.vote.options+String.fromCharCode(this.firstOptionNumber + index)}
                           onChange = {this.handleChange.bind(this, this, {type: 'options', index})}
                           value={this.state.optionList[index].content || ''}/>
                    <button className="icon icon-delete" onClick={this.handleUpdateOptionList.bind(this, false, index)} title={TkGlobal.language.languageData.vote.delete}></button>
                </div>
            )
        });

        return optionList;
    }

    render(){
        let inputStyle = {
            display: "inline-block",
            width: "0.2rem",
            height: "0.2rem",
            padding: "0",
            margin: "0 .1rem",
            verticalAlign: "text-bottom",
        }
        return(
            <div className="vote-detail pure-form">
                <div className="section">
                    <label className="tip">
                        <span className="icon icon-subject"></span>{TkGlobal.language.languageData.vote.subject}<br/>
                        <input type="text" ref='subject'
                        onChange={this.handleChange.bind(this, this, {type: 'subject'})}
                        placeholder={TkGlobal.language.languageData.vote.textPlaceholder1}
                        defaultValue={this.props.data.id ? this.props.data.subject : ''}/>
                    </label><br/>
                </div>
                <div className="section">
                    <label className="tip">
                    <span className="icon icon-detail"></span>{TkGlobal.language.languageData.vote.desc}<br/>
                        <textarea type="text" ref='desc'
                        onChange={this.handleChange.bind(this, this, {type: 'desc'})}
                        defaultValue={this.props.data.id ? this.props.data.desc : ''}
                        placeholder={TkGlobal.language.languageData.vote.textPlaceholder}
                        style={{'height':'.8rem'}}
                        />
                    </label><br/>
                </div>
                <div className="section">
                    <label className="tip">
                    <span className="icon icon-mode"></span>{TkGlobal.language.languageData.vote.type}<br/>
                        {TkGlobal.language.languageData.vote.radio}<input name='optionType' type='radio' 
                        onChange={this.handleChange.bind(this, this, {type: 'type'})}
                        defaultChecked={this.props.data.id ? this.props.data.type === 'radio' : true}
                        value='radio'
                        style={{marginLeft:'.1rem',marginRight:'.2rem'}} />
                        {TkGlobal.language.languageData.vote.checkbox}<input name='optionType' type='radio' 
                        onChange={this.handleChange.bind(this, this, {type: 'type'})}
                        defaultChecked={this.props.data.id ? this.props.data.type === 'checkbox' : false}
                        value='checkbox'
                        style={{marginLeft:'.1rem',marginRight:'.2rem'}} />
                        <span style={{display: this.state.optionType === 'checkbox' ? '' : 'none'}}>
                        {TkGlobal.language.languageData.vote.maxOpTit.text1}
                            <input type="text" maxLength='1'
                                   onChange = {this.handleChange.bind(this, this, {type: 'maxOp'})}
                                   style={inputStyle}
                                   ref="isMaxNum"
                                   />
                            {TkGlobal.language.languageData.vote.maxOpTit.text2}
                        </span>
                    </label><br/>
                </div>
                <div className="section">
                    
                    <span className="icon icon-option"></span>{TkGlobal.language.languageData.vote.options}<br/>
                        {this.__getOptionList()}
                    <br/>
                
                    <div className="flex-box">
                        <span className="icon-plus-titText" >{TkGlobal.language.languageData.vote.titText}</span>
                        <span className="icon icon-plus" onClick={this.handleUpdateOptionList.bind(this, true)}></span>
                        <button className='vote-button plus' onClick={this.handleUpdateOptionList.bind(this, true , undefined)}>{TkGlobal.language.languageData.vote.addOption}</button>
                        <br/>
                    </div>
                    <div className="flex-box vote-btn-box">
                        <button className='vote-button' onClick={this.handleSave.bind(this, 0)}>{TkGlobal.language.languageData.vote.cancel}</button>
                        <button className='vote-button' onClick={this.handleSave.bind(this, 0, this.data, 'updateList')}>{TkGlobal.language.languageData.vote.save}</button>
                        <button className='vote-button pub' onClick={this.handleSave.bind(this, 2, this.data, 'cpublish')}>{TkGlobal.language.languageData.vote.publish}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default VoteDetail;