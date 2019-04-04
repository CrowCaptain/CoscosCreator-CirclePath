import Global from './Global';

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        target: {
            default: null,
            type: cc.Node
        },
        bestScoreLabel:{
            default:null,
            type:cc.Label
        },
        levelLabel:{
            default:null,
            type:cc.Node
        }
    },

    onLoad() {

        this.changeColor();
        
        this.node.on('touchstart', this.playGame, this);
        this.node.on('ballOver',this.gameOver,this);

        let bestScore = cc.sys.localStorage.getItem('bestScore');
        if(bestScore === null){
            cc.sys.localStorage.setItem('bestScore',0);
        }
        this.bestScore = cc.sys.localStorage.getItem('bestScore');
        this.score = 0;
        this.bestScoreLabel.string += this.bestScore;

    },

    changeColor() {
        let randomColor1 = Global.bgColors[
            Math.floor(Math.random() * Global.bgColors.length)];
        let randomColor2 = null;
        do {
            randomColor2 = Global.bgColors[
                Math.floor(Math.random() * Global.bgColors.length)];
        } while (randomColor1 === randomColor2);

        this.bg.color = new cc.Color(
            randomColor1[0], randomColor1[1], randomColor1[2]);

        for (let i = 0; i < this.player.childrenCount; i++) {
            let children = this.player.children[i];
            children.color = new cc.Color(
                randomColor2[0], randomColor2[1], randomColor2[2]);
        }
    },

    playGame() {
        let playerJS = this.player.getComponent('Player');
        let targetJS = this.target.getComponent('Target');
        let balls = playerJS.balls;
        let rotatingBall = playerJS.rotatingBall;
        let target = targetJS.targets[1];
        let distance = cc.v2(balls[rotatingBall].x - target.x,
            balls[rotatingBall].y - target.y).mag();
        if (distance <= 20) {
            let distanceX = balls[1 - rotatingBall].x - balls[rotatingBall].x;
            let distanceY = balls[1 - rotatingBall].y - balls[rotatingBall].y;
            let moveAction = cc.moveBy(0.5, distanceX, distanceY).easing(cc.easeElasticOut(0.7));
            let moveAction1 = cc.moveBy(0.5, distanceX, distanceY).easing(cc.easeElasticOut(0.7));
            this.player.runAction(moveAction);
            this.target.runAction(moveAction1);
            playerJS.changeBall();
            targetJS.addTarget(1);
            this.score++;
            if(!(this.score%10)){
                playerJS.rotationSpeed += 10;
                this.levelLabel.runAction(cc.sequence(cc.fadeTo(1, 255),cc.fadeTo(1,0)));
            }
        }else{
            playerJS.stopRotation();
            this.node.off('touchstart', this.playGame, this);
        }
    },

    gameOver(){
        if(this.score > this.bestScore){
            cc.sys.localStorage.setItem('bestScore',this.score);
        }
        this.scheduleOnce(()=>{
            cc.director.loadScene('GameScene');
        },1);
    },

});
