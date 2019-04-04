import Global from './Global';

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Prefab
        }
    },


    onLoad() {
        this.targets = [this.node.children[0]];
        for (let i = 1; i < Global.visibleTargets; i++) {
            this.addTarget(0);
        }
    },

    /**
     * state=0，游戏初始化targets；state=1，游戏过程中添加1个target。
     * @param {number} state 
     */
    addTarget(state) {
        if (state) {
            let firstTarget = this.targets[0];
            this.targets.shift();
            for (let i = 0; i < this.targets.length; i++) {
                this.targets[i].opacity = 255 - 30 * i;
            }
            let destroyFinished = cc.callFunc(function () {
                this.node.removeChild(firstTarget);
            }, this);
            let destroyAction = cc.sequence(
                cc.fadeTo(0.5, 0).easing(cc.easeCubicActionIn()), destroyFinished);
            firstTarget.runAction(destroyAction);
        }

        let lastTarget = this.targets[this.targets.length - 1];
        let target = cc.instantiate(this.target);
        this.node.addChild(target);
        let randomAngle = 25 + Math.floor(
            Math.random() * (Global.angleRange[1] - Global.angleRange[0]));
        let distanceX = Global.ballDistance * Math.cos(randomAngle * Math.PI / 180);
        let distanceY = Global.ballDistance * Math.sin(randomAngle * Math.PI / 180);
        target.setPosition(lastTarget.x + distanceX, lastTarget.y + distanceY);
        target.opacity = lastTarget.opacity - 30;
        let targetNumber = target.getChildByName('TargetNumber').getComponent(cc.Label);
        let lastTargetNumber = lastTarget.getChildByName('TargetNumber');
        if(!lastTargetNumber){
            targetNumber.string = '1';
        }else{
            lastTargetNumber = lastTargetNumber.getComponent(cc.Label);
            targetNumber.string = '' + (parseInt(lastTargetNumber.string)+1);
        }
        this.targets.push(target);

    },

});
