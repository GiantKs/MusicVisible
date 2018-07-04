class Barrage{
    constructor(canvas, data, option){

        this.defaultOption = {
            step: 2,
            flyTime: 7,
            baseLineHeight: 30,
            baseVerticalInterval: 30,   // 垂直间隔
            baseHorizontalInterval: 10, // 水平间隔
            maxLineNumber: 3,
            maxShowNumber: 10,
            font: '30px sans-serif',
        }

        this.canvas  = document.getElementById(canvas);
        this.ctx     = this.canvas.getContext('2d'); 
        this.data    = data || [];
        this.option  = option || this.defaultOption;

        this.looped  = null;
        this.current = 0;
        this.isPause = false;

        // 暴露发送和暂停方法
        this.send    = this.send;
        this.toggle  = this.toggle;

        this.init();
    }

    init(){
        // if(this.data.length === 0)return;
        this.looping();
    }

    looping(){
        this.looped = window.requestAnimationFrame(this.looping.bind(this));
        this.current += 1;
        this.draw();
    }

    toggle(){
        if(this.isPause){
            this.looping();
        }else {
            window.cancelAnimationFrame(this.looped);
            this.looped = null;
        }

        this.isPause = !this.isPause;
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.data.forEach((item, i) => {
            if(/\[em\_.*?\]/g.test(item.content) || /\/upload1\//g.test(item.content))return

            this.data[i].speed = this.data[i].speed === undefined ? (this.canvas.width+this.ctx.measureText(item.content).width)/(this.option.flyTime*1e3/15) : this.data[i].speed;
            this.data[i].start = this.data[i].start === undefined ? this.current : this.data[i].start;
            this.data[i].y = this.data[i].y === undefined ? (i%this.option.maxLineNumber)*this.option.baseLineHeight+this.option.baseVerticalInterval : this.data[i].y;
            
            let x = this.canvas.width-(this.current-this.data[i].start)*item.speed;
            this.ctx.font=this.option.font;
            this.ctx.strokeText(item.content, x, item.y);
            this.ctx.closePath();
            this.ctx.font=this.option.font;
            this.ctx.fillStyle = "#fff";
            this.ctx.fillText(item.content, x, item.y);
            
            if(x+this.ctx.measureText(item.content).width < 0){
                this.data.splice(i, 1);
            }
                
        });
    }

    send(data){
        if(this.data.length > this.option.maxShowNumber)return;
        this.data.push(data);
    }
}

export default Barrage;