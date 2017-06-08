/**
 * 盗窃罪-各个法定刑和主刑组合情况的配置集合
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
        RANGE_10000000008_1: {
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
                    mainPenaltyCode : 1
                };
                if (middle > 6 && min < 6) {
                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
                    result.recText = createCommonRecText("有期徒刑", 6, max > middle + 0.5 ? middle + 0.5 : max);
                    result.mainPenaltyCode = 3;
                }
                if (middle <= 6 && max > 6) {
                    result.recText = createCommonRecText("拘役", middle - 0.5, 6);
                    result.mainPenaltyCode = 1;
                }
                if (min >= 6) {
                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
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
        *  0-3年法定刑刻度范围,管制
        */
        RANGE_10000000008_2: {
            title: "管制",
            unitText: "月",
            unitLabel: "三个月柱体",
            rangeStart: 0,
            rangeEnd: 40,
            caliber: 3,
            defaultStartPoint: 13.5,
            rangeConfigArr: [{
                start: 0,
                end: 40,
                unitHeight: 10
            }],
            blueRangeDash: [36],
            legalPenaltyHigh: 24,
            legalPenaltyLow: 3,
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
                    recText: createCommonRecText(this.title, min,  max)
                };
                result.mainPenaltyCode = 2;
                //管制开始
                if (middle > 24 && min < 24) {
                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
                    result.recText = createCommonRecText("有期徒刑", 24, max > middle + 1.5 ? middle + 1.5 : max);
                    result.mainPenaltyCode = 3;
                }
                if (min >= 24) {
                    result.recText = createCommonRecText("有期徒刑", min, max);
                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
                    result.mainPenaltyCode = 3;
                }
                if (middle <= 24 && max > 24) {
                    result.recText = createCommonRecText("管制", middle - 1.5, 24);
                    result.mainPenaltyCode = 2;
                }
                if (middle < 3) {
                    result.hint = "计算结果已低于管制最小范围，建议更换刑种为拘役";
                    result.recText = createCommonRecText("拘役", min < 1 ? 1 : min, max);
                    result.mainPenaltyCode = 1;
                }
                if (middle >= 3 && min < 3) {
                    result.recText = createCommonRecText("管制", 3,  max > middle + 1.5 ? middle + 1.5 : max);
                    result.mainPenaltyCode = 2;
                }
                if (min >= 3 && max <= 24) {
                    result.recText = createCommonRecText("管制", min, max);
                    result.mainPenaltyCode = 2;
                }
                if (middle < 1) {
                    result.hint = "建议单处罚金或定罪免罚";
                    result.recText = "定罪免罚或单处罚金";
                    result.mainPenaltyCode = 0;
                }
                return result;
            }

        },
        /**
        *  0-3年法定刑刻度范围,有期徒刑
        */
        RANGE_10000000008_3: {
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
                    recText: createCommonRecText(this.title, min,  max)
                };
                result.mainPenaltyCode = 3;
                if (middle <= 6 && middle >= 1 ) {
                    result.hint = "计算结果已低于有期徒刑最小范围，建议更换刑种为拘役或管制";
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
        *  3-10年的法定刑刻度范围
        */
        RANGE_10000000009_3: {
            title: "有期徒刑",
            unitText: "年",
            unitLabel: "两年柱体",
            rangeStart: 0,
            rangeEnd: 132,
            caliber: 24,
            defaultStartPoint: 78,
            rangeConfigArr: [{
                start: 0,
                end: 132,
                unitHeight: 3.02
            }],
            blueRangeDash: [36, 120],
            legalPenaltyHigh: 120,
            legalPenaltyLow: 36,
            rangeMax: 120,
            rangeMin: 6,
            markCreateFuntion: function (i) {
                if (i > 120 || i % 12 != 0) {
                    return 'display';
                } else {
                    return i / 12;
                }
            },
            createRecText: function (penaltyData, dataResult) {
                var max = dataResult.finalResult.max;
                var min = dataResult.finalResult.min;
                max = parseFloat(max.toFixed(3));
                min = parseFloat(min.toFixed(3));

                var result = {
                    hint: "",
                    recText: createCommonRecText(this.title, min, max )
                };
                result.mainPenaltyCode = 3;
                result.recText = createCommonRecText("有期徒刑", min, max);
                return result;
            }
        },

        /**
        *  10年以上的法定刑刻度范围
        */
        RANGE_10000000010_3: {
            title: "有期徒刑",
            unitText: "年",
            unitLabel: "两年柱体",
            rangeStart: 0,
            rangeEnd: 242,
            caliber: 24,
            defaultStartPoint: 150,
            rangeConfigArr: [{
                start: 0,
                end: 242,
                unitHeight: 1.65
            }],
            blueRangeDash: [120, 180],
            legalPenaltyHigh: 180,
            legalPenaltyLow: 120,
            rangeMax: 240,
            rangeMin: 36,
            markCreateFuntion: function (i) {
                if (i % 12 != 0 || i > 240) {
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
                    recText: createCommonRecText(this.title, min,  max)
                };
                result.mainPenaltyCode = 3;
                if (middle > 15 * 12) {
                    result.hint = "建议更换主刑为无期徒刑";
                    result.recText = "无期徒刑";
                    result.mainPenaltyCode = 4;
                }
                if (middle <= 15 * 12 && max > 15 * 12) {
                    result.recText = createCommonRecText(this.title, middle - 12,
                        15 * 12);
                    result.mainPenaltyCode = 3;
                }
                return result;
            }
        },

        /**
        *  15年以上的法定刑刻度范围-无期
        */
        RANGE_10000000010_4: {
            title: "无期徒刑",
            unitText: "年",
            unitLabel: "-",
            rangeStart: 0,
            rangeEnd: 242,
            caliber: 24,
            defaultStartPoint: 0,
            rangeConfigArr: [{
                start: 0,
                end: 242,
                unitHeight: 1.65
            }],
            blueRangeDash: [120, 180],
            legalPenaltyHigh: 180,
            legalPenaltyLow: 120,
            rangeMax: 240,
            rangeMin: 36,
            markCreateFuntion: function (i) {
                if (i % 12 != 0 || i > 240) {
                    return 'display';
                } else {
                    return i / 12;
                }
            },
            createRecText: function (penaltyData, dataResult) {
                var result = {
                    hint: "",
                    recText: '无期徒刑',
                    mainPenaltyCode : 4
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