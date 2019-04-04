import Global from './Global';

cc.Class({
    extends: cc.Component,

    properties: {
        arm:{
            default:null,
            type:cc.Node
        },
        ball0:{
            default:null,
            type:cc.Node
        },
        ball1:{
            default:null,
            type:cc.Node
        },
    },


    onLoad () {
        this.rotationSpeed = Global.rotationSpeed;
        //初始旋转球体为ball1
        this.rotatingBall = 1;
        this.balls = [this.ball0,this.ball1];
        //0,stop;1,start;球体旋转开关
        this.rotationState = 1;
    },

    update(dt){
        if(this.rotationState){
            this.startRotation(dt);
        }
        
    },

    startRotation(speedDT){
        this.arm.rotation += this.rotationSpeed * speedDT;
        let distanceX = Global.ballDistance * Math.cos(this.arm.rotation*Math.PI/180);
        let distanceY = Global.ballDistance * Math.sin(this.arm.rotation*Math.PI/180);
        this.balls[this.rotatingBall].x = this.arm.x + distanceX;
        this.balls[this.rotatingBall].y = this.arm.y - distanceY;
    },

    stopRotation(){
        this.rotationState = 0;
        this.node.removeChild(this.arm);
        let destroyFinished = cc.callFunc(function () {
            this.node.removeChild(this.balls[this.rotatingBall]);
            this.ballOver();
        }, this);
        let destroyAction = cc.sequence(
            cc.fadeTo(0.3, 0).easing(cc.easeCubicActionIn()), destroyFinished);
        this.balls[this.rotatingBall].runAction(destroyAction);
    },

    changeBall(){
        this.arm.position = this.balls[this.rotatingBall].position;
        this.arm.rotation += 180;
        this.rotatingBall = 1 - this.rotatingBall;
        this.rotationSpeed = -this.rotationSpeed;
    },

    ballOver(){
        this.node.dispatchEvent(new cc.Event.EventCustom('ballOver',true));
    },

});
