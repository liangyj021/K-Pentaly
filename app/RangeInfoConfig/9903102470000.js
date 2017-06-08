/**
 * 危险驾驶罪-各个法定刑和主刑组合情况的配置集合
 */
module.exports = function () {


    var DataManager = require('../DataManager.js');


    /**
     * 
     */
    var COA_PENALTY_CONFIG = {
        /**
        *  0-3年法定刑主刑拘役刻度范围
        */
        RANGE_10000000004_1: {
            title: "拘役",
            unitText: "月",
            unitLabel: "一个月柱体",
            rangeStart: 0,
            rangeEnd: 6,
            caliber: 1,
            defaultStartPoint: 3.5,
            rangeConfigArr: [{
                start: 0,
                end: 6,
                unitHeight: 63.5
            }],
            blueRangeDash: [6],
            legalPenaltyHigh: 6,
            legalPenaltyLow: 0.0001,
            rangeMax: 6,
            rangeMin: 0.0001,
            markCreateFuntion: function (i) {
                return i;
            }, 
            createRecText: function (penaltyData, dataResult) {
                var max = dataResult.finalResult.max;
                var min = dataResult.finalResult.min;
                var middle = (max + min) / 2;
                max = parseFloat(max.toFixed(3));
                min = parseFloat(min.toFixed(3));
                middle = parseFloat(middle.toFixed(3));

                var result = {
                    hint: "",
                    recText: createCommonRecText(this.title, min,  max),
                    mainPenaltyCode : 1
                };
                if (middle < 1) {
                    result.hint = "建议单处罚金或定罪免罚";
                    result.recText = "定罪免罚或单处罚金";
                    result.mainPenaltyCode = 0;
                }
                if (middle >= 1 && min < 1) {
                    result.recText = createCommonRecText("拘役", 1, max > middle + 0.5 ? middle + 0.5 : max);
                    result.mainPenaltyCode = 1;
                }
                return result;
            },
            getYMShowText : getYMShowText
        }
        
    }
    

    return COA_PENALTY_CONFIG;

    function createCommonRecText(mainPenaltyText, min, max) {
        var minText = getYMShowText(min);
        var maxText = getYMShowText(max);
        if( minText != maxText) {
            return mainPenaltyText + " " + minText + " <span class='dao'>到</span> "
                + maxText;
        } else {
            return mainPenaltyText + " " + minText;
        }

    }

    function getYMShowText(penaltyCount, scjsts) {
        var text = ""
        var year = Math.floor(penaltyCount / 12);
        var month = Math.round(penaltyCount % 12);
        if (year != 0) {
            text = year + "年";
        }
        if (month != 0) {
            if(scjsts && scjsts != null && scjsts != 0) {
                if( scjsts % 30 == 0 ) {
                    month = month - scjsts / 30;
                    text = text + month + "个月";
                } else {
                    month = month - Math.floor(scjsts / 30) - 1;
                    var day = (30- scjsts % 30);
                    text = text + month + "个月" + (30- scjsts % 30) +"天";
                }
            } else {
                text = text + month + "个月";
            }

        }
        if( year == 0 && month == 0 ) {
            text = "0个月";
        }
        return text;
    }

}