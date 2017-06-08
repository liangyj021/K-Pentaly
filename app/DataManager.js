/**
 * 数据处理工具组件, 计算Y轴的坐标像素位置和年份值的对应关系
 */
define(
    function () {


        var DataManager = function (graphConfig, bussinessConfig, initData) {
            graphConfig.height = 0;
            for (var i = 0, rangeConfig; i < bussinessConfig.rangeConfigArr.length; i++) {

                rangeConfig = bussinessConfig.rangeConfigArr[i];
                if (i == 0 && rangeConfig.start != bussinessConfig.rangeStart) {
                    throw new Error("rangeInfo配置不合理，起始刻度和刻度配置不一致");
                }
                if (i > 0 && rangeConfig.start != bussinessConfig.rangeConfigArr[i - 1].end) {
                    throw new Error("rangeInfo配置不合理，刻度配置不连续");
                }
                if (i == bussinessConfig.rangeConfigArr.length - 1 &&
                    rangeConfig.end != bussinessConfig.rangeEnd) {
                    throw new Error("rangeInfo配置不合理，终止刻度和刻度配置不一致");
                }
                for (var j = rangeConfig.start; j < rangeConfig.end; j++) {
                    graphConfig.height += rangeConfig.unitHeight;
                }
            }
            this.graphConfig = graphConfig;
            this.bussinessConfig = bussinessConfig;
            this.penaltyData = {};
            this.penaltyData.startPenalty = initData.startPenalty;
            this.penaltyData.basePenalty = initData.basePenalty;

            this.penaltyData.factorArr = [];
            var startPenaltyFactor = {
                id: "0",
                name: "量刑起点",
                level: 0,
                order: 0,
                count: this.penaltyData.startPenalty * 1.0,
                countWay: 0
            }
            var basePenaltyFactor = {
                id: "1",
                name: "基准刑",
                level: 0,
                order: 1,
                count: this.penaltyData.basePenalty * 1.0,
                countWay: 0
            }
            this.penaltyData.factorArr.push(startPenaltyFactor);
            this.penaltyData.factorArr.push(basePenaltyFactor);

            //进行参数类型修正
            for (var i = 0, facotorItem; i < initData.factorArr.length; i++) {
                facotorItem = initData.factorArr[i];
                if (!facotorItem.countWay || facotorItem.countWay <= 0) {
                    continue;
                }
                var copyItem = {};
                for (var key in facotorItem) {
                    if (copyItem[key] != facotorItem[key]) {
                        copyItem[key] = facotorItem[key];
                    }
                }
                if (copyItem.changeMax) {
                    copyItem.changeMax = copyItem.changeMax * 1.0;
                    copyItem.changeMin = copyItem.changeMin * 1.0;
                }
                if (copyItem.rate) {
                    copyItem.rate = copyItem.rate * 1.0;
                }
                this.penaltyData.factorArr.push(copyItem)
            }
        };


        DataManager.prototype.getYMShowText = function (penaltyCount) {
            if (this.bussinessConfig.getYMShowText) {
                return this.bussinessConfig.getYMShowText(penaltyCount);
            }
            var text = '';
            var intYear = parseInt(penaltyCount / 12);
            var month = Math.round(penaltyCount % 12);
            if (month == 12) {
                intYear++;
                month = 0;
            }
            text += (0 == intYear ? '' : intYear + '年');
            text += (0 == month ? '' : month + '个月');
            if (text == '') {
                return '0';
            }
            return text;
        }


        /**
         * 根据年数字、坐标系配置，获取当前年对应坐标系上的Y坐标
         * @param 年计数
         */
        DataManager.prototype.converPenalty2Y = function (penaltyCount) {
            //刻度起始
            penaltyCount = parseFloat(penaltyCount.toFixed(5));

            var penaltyStart = this.bussinessConfig.rangeStart;
            //计算当前值到量刑原点的距离
            var distanceFromStart = 0;
            outter: for (var i = 0, rangeConfig, latestUnitHeight; i < this.bussinessConfig.rangeConfigArr.length; i++) {
                rangeConfig = this.bussinessConfig.rangeConfigArr[i];
                for (var j = rangeConfig.start; j < rangeConfig.end; j++) {
                    //根据刻度配置从起始刻度开始一直加
                    if (penaltyCount == j) {
                        break outter;
                    }
                    if (penaltyCount - j >= 1) {
                        distanceFromStart += rangeConfig.unitHeight;
                    } else if (penaltyCount - j < 1 && penaltyCount <= rangeConfig.end) {
                        //不满一个单位刻度且在当前循环的刻度范围
                        distanceFromStart += ((penaltyCount - j) * rangeConfig.unitHeight);
                        break outter;
                    } else {
                        //不满一个刻度但在当前循环刻度范围外，以下个刻度计算
                        var nextRangeConfig = this.bussinessConfig.rangeConfigArr[i + 1];
                        distanceFromStart += ((penaltyCount - rangeConfig.end) * nextRangeConfig.unitHeight);
                        break outter;
                    }
                }
            }
            //起点坐标(像素坐标Y是反的), 实际的Y坐标= （坐标轴高度- 当前值到坐标原点的距离）
            return this.graphConfig.height - distanceFromStart;
        };

        /**
         * 根据Y坐标和坐标系配置，获取Y坐标对应的年数字
         * @param 图形坐标Y
         */
        DataManager.prototype.converY2Penalty = function (y) {
            if (y == 0) {
                return this.bussinessConfig.rangeConfigArr[this.bussinessConfig.rangeConfigArr.length - 1].end;
            }
            //当前实际Y到量刑原点的像素距离
            var distanceFromStart = this.graphConfig.height - y;

            var penaltyCount = this.bussinessConfig.rangeStart;

            //初始值为刻度起始值，往上累加,找到最接近的整数后进行计算
            var countHeight = 0;
            outter: for (var i = 0, rangeConfig; i < this.bussinessConfig.rangeConfigArr.length; i++) {
                rangeConfig = this.bussinessConfig.rangeConfigArr[i];
                for (var j = rangeConfig.start; j < rangeConfig.end; j++) {
                    if (countHeight == distanceFromStart) {
                        penaltyCount = j;
                        break outter;
                    } else if (countHeight + rangeConfig.unitHeight <= distanceFromStart) {
                        countHeight += rangeConfig.unitHeight;
                    } else if (j + 1 <= rangeConfig.end) {
                        //下个值刚好大于Y点值，且还在当前刻度配置内
                        var nearCount = j;
                        penaltyCount = j + (distanceFromStart - countHeight) / rangeConfig.unitHeight;
                        break outter;
                    } else {
                        //下个值刚好大于Y点值，但已进入下个刻度配置
                        var nearCount = j;
                        var nextConfig = this.bussinessConfig.rangeConfigArr[i + 1];
                        penaltyCount = j + (distanceFromStart - countHeight) / nextConfig.unitHeight;
                        break outter;
                    }
                }
            }
            if (penaltyCount > this.bussinessConfig.rangeEnd) {
                return this.bussinessConfig.rangeEnd;
            } else {
                return parseFloat(penaltyCount.toFixed(5));
            }
        };

        /**
         * 根据X-INDEX 获取X坐标位置
         * @param 图形坐标X
         */
        DataManager.prototype.converIndex2X = function (xIndex) {
            //起点坐标
            var xStart = 0;
            //刻度起点
            var xIndexStart = 0;
            //每个XIndex间隔
            var xSpace = this.graphConfig.hspace;
            return (xIndex * xSpace) + xStart
        };


        /**
         * 计算第一层面要素的值，需要根据上个点的值、当前百分比或者变化值
         * 如果是乘法计算  preData.count * （1 +/- currRate ）
         */
        DataManager.prototype.getLevel1CountData = function (preData, currRate, factorConfig, isLast) {
            var countData = {
                level: 1,
                preData: preData,
                countWay: factorConfig.countWay,
                changeMax: factorConfig.changeMax,
                changeMin: factorConfig.changeMin
            };
            if (isLast) {
                countData.isLast = true;
            }
            //根据上个点计算出下个中点
            if (countData.countWay == 1) {
                countData.rangeHigh = preData.count * (1 + factorConfig.changeMax / 100);
                countData.rangeLow = preData.count * (1 + factorConfig.changeMin / 100);
                countData.count = preData.count * (1 + currRate / 100);
            } else if (countData.countWay == 2) {
                countData.rangeHigh = preData.count * (1 - factorConfig.changeMin / 100);
                countData.rangeLow = preData.count * (1 - factorConfig.changeMax / 100);
                countData.count = preData.count * (1 - currRate / 100);
            } else if (countData.countWay == 3) {
                countData.rangeHigh = preData.count + factorConfig.changeMax;
                countData.rangeLow = preData.count + factorConfig.changeMin;
                countData.count = preData.count + currRate * 1.0;
            } else {
                countData.rangeHigh = preData.count - factorConfig.changeMin;
                countData.rangeLow = preData.count - factorConfig.changeMax;
                countData.count = preData.count - currRate * 1.0;
            }
            this.fixCountData(countData);
            if (countData.countWay == 1) {
                countData.rate = (countData.count / preData.count - 1) * 100;
            } else if (countData.countWay == 2) {
                countData.rate = (1 - countData.count / preData.count) * 100;
            } else if (countData.countWay == 3) {
                countData.rate = countData.count - preData.count;
            } else if (countData.countWay == 4) {
                countData.rate = preData.count - countData.count;
            }
            countData.rate = parseFloat(countData.rate.toFixed(5));
            return countData;
        }

        /**
         * 计算第二层面要素的值，需要根据上个点的值、基数的值、当前百分比
         * 计算  preData.count +/- lastLevel1Data.count * currRate;
         */
        DataManager.prototype.getLevel2CountData = function (lastLevel1Data, preData, currRate, factorConfig, isLast) {
            var countData = {
                level: 2,
                lastLevel1Data: lastLevel1Data,
                preData: preData,
                countWay: factorConfig.countWay,
                changeMax: factorConfig.changeMax,
                changeMin: factorConfig.changeMin
            };
            if (isLast) {
                countData.isLast = true;
            }

            //如果上次计算时，被迫设置为最大最小值，比例可能不在配置范围内，先尝试恢复比例到最近的正常范围进行计算
            if (countData.countWay == 1) {
                countData.count = preData.count + lastLevel1Data.count * currRate / 100;
                countData.rangeHigh = preData.count + lastLevel1Data.count * factorConfig.changeMax / 100;
                countData.rangeLow = preData.count + lastLevel1Data.count * factorConfig.changeMin / 100;
            } else if (countData.countWay == 2) {
                countData.count = preData.count - lastLevel1Data.count * currRate / 100;
                countData.rangeHigh = preData.count - lastLevel1Data.count * factorConfig.changeMin / 100;
                countData.rangeLow = preData.count - lastLevel1Data.count * factorConfig.changeMax / 100;
            } else if (countData.countWay == 3) {
                countData.rangeHigh = preData.count + factorConfig.changeMax;
                countData.rangeLow = preData.count + factorConfig.changeMin;
                countData.count = preData.count + currRate * 1.0;
            } else {
                countData.rangeHigh = preData.count - factorConfig.changeMin;
                countData.rangeLow = preData.count - factorConfig.changeMax;
                countData.count = preData.count - currRate * 1.0;
            }
            //如果按照正常范围算出来的值越界了，重置为最大最小值
            this.fixCountData(countData);

            //第二层面要素的中点并不能代表柱体所有的比例（非线性），因此给3个百分比,上，中，下，上下的计算方式为先计算柱体的上下端，再算上下端比例
            if (countData.countWay == 1) {
                countData.rate = (countData.count - countData.preData.count) / countData.lastLevel1Data.count * 100;
            } else if (countData.countWay == 2) {
                countData.rate = (countData.preData.count - countData.count) / countData.lastLevel1Data.count * 100;
            } else if (countData.countWay == 3) {
                countData.rate = countData.count - preData.count;
            } else if (countData.countWay == 4) {
                countData.rate = preData.count - countData.count;
            }
            countData.rate = parseFloat(countData.rate.toFixed(5));
            return countData;
        }


        DataManager.prototype.fixCountData = function (countData) {
            //最小移动范围超过底部限制
            var caliber = this.bussinessConfig.caliber;
            if (this.bussinessConfig.rangeMin != null) {
                var min = this.bussinessConfig.rangeMin;
                if (!hasLightenFactor(this.penaltyData)) {
                    var min = this.bussinessConfig.legalPenaltyLow;
                }
                if (countData.rangeLow < min) {
                    countData.rangeLow = min;
                }
                if (countData.count < min) {
                    countData.count = min;
                }
                if (countData.rangeHigh < min) {
                    countData.rangeHigh = min;
                }
            }
            //最大移动范围超过顶部限制
            if (this.bussinessConfig.rangeMax != null) {
                var max = this.bussinessConfig.rangeMax;
                if (countData.rangeHigh > max) {
                    countData.rangeHigh = max;
                }
                if (countData.count > max) {
                    countData.count = max;
                }
                if (countData.rangeLow > max) {
                    countData.rangeLow = max;
                }
            }
            if (countData.count > countData.rangeHigh) {
                countData.count = countData.rangeHigh;
            } else if (countData.count < countData.rangeLow) {
                countData.count = countData.rangeLow;
            }
            if (countData.isLast) {
                //红色柱体
                if (countData.rangeHigh - countData.rangeLow < caliber) {
                    countData.count = (countData.rangeHigh + countData.rangeLow) / 2;
                    countData.lowCount = countData.rangeLow;
                    countData.highCount = countData.rangeHigh;
                } else if (countData.count - caliber / 2 < countData.rangeLow) {
                    countData.lowCount = countData.rangeLow;
                    countData.count = countData.rangeLow + caliber / 2;
                    countData.highCount = countData.count + caliber / 2;
                } else if (countData.count + caliber / 2 > countData.rangeHigh) {
                    countData.highCount = countData.rangeHigh;
                    countData.count = countData.rangeHigh - caliber / 2;
                    countData.lowCount = countData.count - caliber / 2;
                } else {
                    countData.lowCount = countData.count - caliber / 2;
                    countData.highCount = countData.count + caliber / 2;
                }
            }
            countData.rangeHigh = parseFloat(countData.rangeHigh.toFixed(5));
            countData.rangeLow = parseFloat(countData.rangeLow.toFixed(5));
            countData.count = parseFloat(countData.count.toFixed(5));
        }

        DataManager.prototype.recountRate = function (countData) {
            if (countData.level == 2) {
                //第二层面要素的中点并不能代表柱体所有的比例（非线性），因此给3个百分比,上，中，下，上下的计算方式为先计算柱体的上下端，再算上下端比例
                if (countData.countWay == 1) {
                    countData.rate = (countData.count - countData.preData.count) / countData.lastLevel1Data.count * 100;
                } else if (countData.countWay == 2) {
                    countData.rate = (countData.preData.count - countData.count) / countData.lastLevel1Data.count * 100;
                } else if (countData.countWay == 3) {
                    countData.rate = countData.count - countData.preData.count;
                } else if (countData.countWay == 4) {
                    countData.rate = countData.preData.count - countData.count;
                }
                countData.rate = parseFloat(countData.rate.toFixed(5));
            } else if (countData.level == 1) {
                var offset = this.bussinessConfig.caliber / 2;
                if (countData.countWay == 1) {
                    countData.rate = (countData.count / countData.preData.count - 1) * 100;
                } else if (countData.countWay == 2) {
                    countData.rate = (1 - countData.count / countData.preData.count) * 100;
                } else if (countData.countWay == 3) {
                    countData.rate = countData.count - countData.preData.count;
                } else if (countData.countWay == 4) {
                    countData.rate = countData.preData.count - countData.count;
                }
                countData.rate = parseFloat(countData.rate.toFixed(5));
            }

        }


        DataManager.prototype.getCountDataArr = function (startPenalty, basePenalty, factorArr, redScrollBarArr) {
            var countDataArr = [];
            //计算红色坐标点、线、区域
            var offset = this.bussinessConfig.caliber / 2;
            for (var i = 0, preData; i < factorArr.length; i++) {
                //初始化当前坐标轴红色滚动条及其范围的数据
                var scrollBarData;
                if (i == 0) {
                    scrollBarData = {
                        id: 0,
                        name: "量刑起点",
                        count: startPenalty
                    }
                } else if (i == 1) {
                    scrollBarData = {
                        id: 0,
                        name: "基准刑",
                        count: basePenalty
                    }
                    lastLevel1Data = scrollBarData;
                    preData = scrollBarData;
                } else {
                    var isLast = false;
                    if (i == factorArr.length - 1) {
                        isLast = true;
                    }
                    var currRate = (factorArr[i].changeMax + factorArr[i].changeMin) / 2;
                    if (factorArr[i].rate != null) {
                        currRate = factorArr[i].rate;
                    }
                    if (redScrollBarArr) {
                        currRate = redScrollBarArr[i].pointData.rate;
                    }
                    if (1 == factorArr[i].level) {
                        scrollBarData = this.getLevel1CountData(preData, currRate, factorArr[i], isLast);
                        lastLevel1Data = scrollBarData;
                    } else {
                        scrollBarData = this.getLevel2CountData(lastLevel1Data, preData, currRate, factorArr[i], isLast);
                    }
                    preData = scrollBarData;
                    if( factorArr[i].id ) {
                        scrollBarData.id = factorArr[i].id;
                    }
                    if( factorArr[i].factorId ) {
                        scrollBarData.id = factorArr[i].factorId;
                    }
                    scrollBarData.name = factorArr[i].name;
                }
                scrollBarData.index = i;

                countDataArr.push(scrollBarData);
            }

            return countDataArr
        }

        function hasLightenFactor(penaltyData) {
            for (var i = 0; i < penaltyData.factorArr.length; i++) {
                if (penaltyData.factorArr[i].type == 2 &&
                    (penaltyData.factorArr[i].countWay == 2 || penaltyData.factorArr[i].countWay == 4)) {
                    return true;
                }
            }
            return false;
        }

        return DataManager;

    });