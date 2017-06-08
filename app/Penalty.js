module.exports = function (objid, graphConfig, bussinessConfig, baseData) {


    var CoordinateBaseGroup = require('./CoordinateBaseGroup.js');
    var BlueAreaGroup = require('./BlueAreaGroup.js');
    var RedAreaGroup = require('./RedAreaGroup.js');
    var Zrender = require('./zrender/src/zrender.js');
    var Rectangle = require('./zrender/src/shape/Rectangle.js');
    var DataManager = require('./DataManager.js');

    var zr = Zrender.init(document.getElementById(objid));
    var dataManager = new DataManager(graphConfig, bussinessConfig, baseData);

    zr.dataManager = dataManager;

    //横轴间距计算, 按照130
    graphConfig.hspace = graphConfig.hspace || 130;
    if ((penaltyData.factorArr.length) * graphConfig.hspace < graphConfig.width) {
        graphConfig.hspace = graphConfig.width / (penaltyData.factorArr.length);
    }
    //宽度计算，固定间距，按照坐标点个数计算
    if (!graphConfig.width) {
        graphConfig.width = Math.ceil(zr.getWidth());
        graphConfig.width = (graphConfig.marginLeft) ? (graphConfig.width - graphConfig.marginLeft) : graphConfig.width;
        graphConfig.width = (graphConfig.marginRight) ? (graphConfig.width - graphConfig.marginRight) : graphConfig.width;
        if ((penaltyData.factorArr.length - 1) * graphConfig.hspace > graphConfig.width) {
            graphConfig.width = (penaltyData.factorArr.length - 1) * graphConfig.hspace + graphConfig.marginLeft + graphConfig.marginRight;
        }
    }


    initHintArea(zr);

    var coordinateBaseGroup = new CoordinateBaseGroup(graphConfig, bussinessConfig,
        penaltyData);

    if (penaltyData.hasHistoryData) {
        var blueAreaGroup = new BlueAreaGroup(graphConfig, bussinessConfig,
            penaltyData, zr);
        coordinateBaseGroup.addChild(blueAreaGroup);
    }
    if (penaltyData.startPenalty && penaltyData.basePenalty) {
        var redAreaGroup = new RedAreaGroup(graphConfig, bussinessConfig,
            penaltyData, zr);
        coordinateBaseGroup.addChild(redAreaGroup);
    }

    zr.addGroup(coordinateBaseGroup);

    zr.getDataResult = function () {
        if (this.redGroupArea) {
            return this.redGroupArea.getDataResult();
        }
        var dataResult = {
            startPenalty: {
                count: 0,
                min: 0,
                max: 0
            },
            basePenalty: {
                count: 0,
                min: 0,
                max: 0
            },
            finalResult: {
                count: 0,
                min: 0,
                max: 0
            },
            factorResult: []
        };
        return dataResult;
    }


    function initHintArea(zr) {

        //悬浮提示-公共
        zr.showHint = function () {
            var point = this;
            var text = this.getHintText();
            if (!text) {
                return;
            }
            if (zr.hint && zr.hint.belong != this.id) {
                zr.hideHint();
            }
            if (zr.hint && zr.hint.belong == this.id) {
                return;
            }


            function countMaxTextLen(text) {
                var enterArr = text.split('\n');
                for (var i = 0, maxLen = 0, currLen = 0; i < enterArr.length; i++) {
                    currLen = 0
                    for (var j = 0; j < enterArr[i].length; j++) {
                        if (enterArr[i].charAt(j).match(/[0-9]/g)) {
                            currLen += 4;
                        } else {
                            currLen += 13;
                        }
                    }
                    if (currLen > maxLen) {
                        maxLen = currLen;
                    }
                }
                return maxLen + 5;
            }

            var textLen = countMaxTextLen(text);
            var x = point.style.x | point.style.xEnd;
            var y = point.style.y | point.style.yEnd;
            if (x + textLen / 2 + 60 > graphConfig.width) {
                x = graphConfig.width - textLen / 2 - 80;
            }
            if (y - 80 < 0) {
                y = 80;
            }

            zr.hint = new Rectangle({
                zlevel: 150,
                style: {
                    x: x,
                    y: y - 55,
                    text: text,
                    strokeColor: '#ABD1F5',
                    textFont: " 12px 微软雅黑",
                    width: countMaxTextLen(text),
                    height: 80,
                    textPosition: 'inside',
                    textAlign: 'center',
                    textColor: '#206FC9',
                    radius: [20, 20],
                    brushType: 'both',
                    color: '#F0F8FF',
                    lineWidth: 1,
                    lineJoin: 'round'
                },
                hoverable: false
            })
            zr.addShape(zr.hint);
            zr.refreshNextFrame();
        }

        zr.hideHint = function () {
            if (!zr.hint) {
                return;
            }
            zr.delShape(zr.hint.id);
            zr.hint = false;
            zr.refreshNextFrame();
        }
    }

    zr.render();
    return zr;

};