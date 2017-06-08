/**
 * 交通肇事罪-各个法定刑和主刑组合情况的配置集合
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
        RANGE_10000000005_1: {
            title: "拘役",
            unitText: "月",
            unitLabel: "一个月柱体",
            rangeStart: 0,
            rangeEnd: 45,
            caliber: 1,
            defaultStartPoint: 3.5,
            rangeConfigArr: [{
                start: 0,
                end: 12,
                unitHeight: 25
            }, {
                start: 12,
                end: 45,
                unitHeight: 3
            }],
            blueRangeDash: [36],
            legalPenaltyHigh: 6,
            legalPenaltyLow: 1,
            rangeMax: 36,
            rangeMin: 0.0001,
            markCreateFuntion: function (i) {
                if (i <= 12 || i == 18 || i == 24 || i == 30 || i == 36) {
                    return i;
                } else {
                    return 'display';
                }
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
                    mainPenaltyCode: 1
                };
                if (middle > 6 && min < 6) {
                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为有期徒刑";
                    result.recText = createCommonRecText("有期徒刑", 6, max > middle + 0.5 ? middle + 0.5 : max);
                    result.mainPenaltyCode = 3;
                }
                if (middle <= 6 && max > 6) {
                    result.recText = createCommonRecText("拘役", middle - 0.5, 6);
                    result.mainPenaltyCode = 1;
                }
                if (min >= 6) {
                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为有期徒刑";
                    result.recText = createCommonRecText("有期徒刑", min, max);
                    result.mainPenaltyCode = 3;
                }
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
            }
        },

   
        /**
        *  0-3年法定刑刻度范围,有期徒刑
        */
        RANGE_10000000005_3: {
            title: "有期徒刑",
            unitText: "月",
            unitLabel: "一年柱体",
            rangeStart: 0,
            rangeEnd: 40,
            caliber: 12,
            defaultStartPoint: 18,
            rangeConfigArr: [{
                start: 0,
                end: 40,
                unitHeight: 10
            }],
            blueRangeDash: [36],
            legalPenaltyHigh: 36,
            legalPenaltyLow: 0.0001,
            rangeMax: 36,
            rangeMin: 0.0001,
            markCreateFuntion: function (i) {
                if (i % 6 == 0) {
                    return i;
                } else {
                    return ''
                }
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
                    mainPenaltyCode: 3
                };
                if (middle <= 6 && middle >= 1 ) {
                    result.hint = "计算结果已低于有期徒刑最小范围，建议更换刑种为拘役";
                    max = max > 6 ? 6 : max;
                    min = min < 1 ? 1: min;
                    result.recText = createCommonRecText("拘役", min, max);
                    result.mainPenaltyCode = 1;
                }
                if (middle < 1) {
                    result.hint = "建议单处罚金或定罪免罚";
                    result.recText = "定罪免罚或单处罚金";
                    result.mainPenaltyCode = 0;
                }
                if (middle > 6 && min < 6) {
                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 6 ? middle + 6 : max);
                    result.mainPenaltyCode = 3;
                }
                if (min >= 6) {
                    result.recText = createCommonRecText("有期徒刑", min, max);
                    result.mainPenaltyCode = 3;
                }
                return result;
            }
        },

        /**
        *  3-7年的法定刑刻度范围
        */
        RANGE_10000000006_3: {
            title: "有期徒刑",
            unitText: "年",
            unitLabel: "两年柱体",
            rangeStart: 0,
            rangeEnd: 96,
            caliber: 24,
            defaultStartPoint: 60,
            rangeConfigArr: [{
                start: 0,
                end: 96,
                unitHeight: 4.16
            }],
            blueRangeDash: [36, 84],
            legalPenaltyHigh: 84,
            legalPenaltyLow: 36,
            rangeMax: 84,
            rangeMin: 6,
            markCreateFuntion: function (i) {
                if (i > 84 || i % 12 != 0) {
                    return 'display';
                } else {
                    return i / 12;
                }
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
                    recText: createCommonRecText(this.title, min, max ),
                    mainPenaltyCode : 3
                };
                result.recText = createCommonRecText("有期徒刑", min, max);
                if (middle < 1) {
                    result.hint = "建议单处罚金或定罪免罚";
                    result.recText = "定罪免罚或单处罚金";
                    result.mainPenaltyCode = 0;
                }
                if (middle > 6 && min < 6) {
                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 12 ? middle + 12 : max);
                    result.mainPenaltyCode = 3;
                }
                if (min >= 6) {
                    result.recText = createCommonRecText("有期徒刑", min, max);
                    result.mainPenaltyCode = 3;
                }
                return result;
            }
        },

        /**
        *  7年以上的法定刑刻度范围
        */
        RANGE_10000000007_3: {
            title: "有期徒刑",
            unitText: "年",
            unitLabel: "三年柱体",
            rangeStart: 0,
            rangeEnd: 192,
            caliber: 36,
            defaultStartPoint: 132,
            rangeConfigArr: [{
                start: 0,
                end: 192,
                unitHeight: 2.08
            }],
            blueRangeDash: [84, 180],
            legalPenaltyHigh: 180,
            legalPenaltyLow: 84,
            rangeMax: 180,
            rangeMin: 36,
            markCreateFuntion: function (i) {
                if (i % 12 != 0 || i > 180) {
                    return 'display';
                } else {
                    return i / 12;
                }
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
                    mainPenaltyCode : 3
                };
                return result;
            }
        }
    }
    

    return COA_PENALTY_CONFIG;

    function createCommonRecText(mainPenaltyText, min, max) {
        var minText = getYMShowText(min);
        var maxText = getYMShowText(max);
        return mainPenaltyText + " " + minText + " <span class='dao'>到</span> "
            + maxText;
    }

    function getYMShowText(penaltyCount) {
        var text = '';
        var intYear = parseInt(penaltyCount / 12);
        var month = Math.round(penaltyCount % 12);
        if (month == 12) {
            intYear++;
            month = 0;
        }
        text += (0 == intYear ? '' : intYear + '年');
        text += (0 == month ? '' : month + '个月');
        return text;
    }


}