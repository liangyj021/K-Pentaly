// RedAreaGroup.js
module.exports = function (graphConfig, bussinessConfig, penaltyData, zrender) {
    var RedAreaGroup = require('./zrender/src/Group.js');
    var Group = require('./zrender/src/Group.js');
    var Circle = require('./zrender/src/shape/Circle.js');
    var Polygon = require('./zrender/src/shape/Polygon.js');
    var Line = require('./zrender/src/shape/Line.js');
    var Rectangle = require('./zrender/src/shape/Rectangle.js');
    var DataManager = require('./DataManager.js');

    var dataManager = new DataManager(graphConfig, bussinessConfig, penaltyData);

    /**
     * 绘制红色（多边形/三角形）区域
     * @param index 下标
     * @param leftPoint 多边形区域左侧的滚动条
     * @param rightPoint 多边形区域右侧的滚动条
     */
    RedAreaGroup.prototype.addRedPolygonGroup = function (index, leftPoint, rightPoint) {
        var redPolygonGroup = new Group({
            'id': 'redPolygonGroup_' + index
        });

        var pointList = getPointList(leftPoint, rightPoint);
        //上下红虚线
        var startPoint = pointList[0];
        var endPoint = pointList[1];
        redPolygonGroup.redHighDashLine = new Line({
            'id': 'redHighDashLine_' + index,
            zlevel: 104,
            style: {
                xStart: startPoint[0],
                yStart: startPoint[1],
                xEnd: endPoint[0],
                yEnd: endPoint[1],
                strokeColor: '#EDB3C1',
                lineWidth: 1,
                lineType: 'dashed'
            },
            hoverable: false
        })
        redPolygonGroup.addChild(redPolygonGroup.redHighDashLine);

        //下红虚线
        startPoint = pointList[0];
        endPoint = pointList[2];
        redPolygonGroup.redLowDashLine = new Line({
            'id': 'redLowDashLine_' + index,
            zlevel: 104,
            style: {
                xStart: startPoint[0],
                yStart: startPoint[1],
                xEnd: endPoint[0],
                yEnd: endPoint[1],
                strokeColor: '#EDB3C1',
                lineWidth: 1,
                lineType: 'dashed'
            },
            hoverable: false
        })
        redPolygonGroup.addChild(redPolygonGroup.redLowDashLine);

        //右边的竖细红线
        startPoint = pointList[1];
        endPoint = pointList[2];
        redPolygonGroup.redRightSolidLine = new Line({
            'id': 'redRightSolidLine_' + index,
            zlevel: 104,
            style: {
                xStart: startPoint[0],
                yStart: startPoint[1],
                xEnd: endPoint[0],
                yEnd: endPoint[1],
                strokeColor: '#EB6877',
                lineWidth: 1
            },
            hoverable: false
        })
        redPolygonGroup.addChild(redPolygonGroup.redRightSolidLine);

        //多边形/三角形
        redPolygonGroup.redPolygon = new Polygon({
            'id': 'redPolygon_' + index,
            zlevel: 104,
            style: {
                pointList: pointList,
                color: '#FADBE0',
                opacity: 0.7
            },
            hoverable: false
        })
        redPolygonGroup.addChild(redPolygonGroup.redPolygon);
        this.addChild(redPolygonGroup);
        return redPolygonGroup;
    };

    /**
     * 根据左侧的点和右侧的点的范围数据获取多边形的三个点
     * 左侧点：左侧的计算点
     * 右侧点：右侧点的最大最小移动范围
     */
    function getPointList(leftPoint, rightPoint) {
        var leftX = dataManager.converIndex2X(leftPoint.pointData.index);
        var rightX = dataManager.converIndex2X(rightPoint.pointData.index);

        var leftY = dataManager.converPenalty2Y(leftPoint.pointData.count);

        var rightHY = dataManager.converPenalty2Y(rightPoint.pointData.count);
        if (rightPoint.pointData.rangeHigh != null) {
            rightHY = dataManager.converPenalty2Y(rightPoint.pointData.rangeHigh);
        }
        var rightLY = dataManager.converPenalty2Y(rightPoint.pointData.count);
        if (rightPoint.pointData.rangeLow != null) {
            rightLY = dataManager.converPenalty2Y(rightPoint.pointData.rangeLow);
        }
        return [
            [leftX, leftY],
            [rightX, rightLY],
            [rightX, rightHY]
        ];
    }


    /**
     * 更新红色（多边形）区域的数据和图形位置
     * @param index 下标
     * @param leftPoint 多边形区域左侧的滚动条
     * @param rightPoint 多边形区域右侧的滚动条
     */
    RedAreaGroup.prototype.updateRedPolygonGroup = function (index, leftPoint, rightPoint) {

        var redPolygonGroup;
        for (var i = 0; i < this.redPolygonGroupArr.length; i++) {
            if ('redPolygonGroup_' + index == this.redPolygonGroupArr[i].id) {
                redPolygonGroup = this.redPolygonGroupArr[i];
                break;
            }
        }
        if (!redPolygonGroup) {
            return;
        }
        var pointList = getPointList(leftPoint, rightPoint);

        //上下红虚线
        var startPoint = pointList[0];
        var endPoint = pointList[1];
        redPolygonGroup.redHighDashLine.style = {
            xStart: startPoint[0],
            yStart: startPoint[1],
            xEnd: endPoint[0],
            yEnd: endPoint[1],
            strokeColor: '#EDB3C1',
            lineWidth: 1,
            lineType: 'dashed'
        }
        startPoint = pointList[0];
        endPoint = pointList[2];
        redPolygonGroup.redLowDashLine.style = {
            xStart: startPoint[0],
            yStart: startPoint[1],
            xEnd: endPoint[0],
            yEnd: endPoint[1],
            strokeColor: '#EDB3C1',
            lineWidth: 1,
            lineType: 'dashed'
        }
        //右细竖红线
        startPoint = pointList[1];
        endPoint = pointList[2];
        redPolygonGroup.redRightSolidLine.style = {
            xStart: startPoint[0],
            yStart: startPoint[1],
            xEnd: endPoint[0],
            yEnd: endPoint[1],
            strokeColor: '#EB6877',
            lineWidth: 1
        }

        //四边形
        redPolygonGroup.redPolygon.style = {
            pointList: pointList,
            color: '#FADBE0',
            opacity: 0.6
        }
        zrender.modGroup(redPolygonGroup.id);
        return redPolygonGroup;
    };


    /**
     * 绘制滑块区域
     * @param redPointArr 计算点对应的数据
     */
    RedAreaGroup.prototype.addRedPoint = function (pointData, monthOffset) {
        var pointGroup = new Group({
            'id': 'redPoint_' + pointData.index
        });
        //记录当前图形位置对应的数据域,滚动条的高低位置
        pointGroup.pointData = pointData;
        var countY = dataManager.converPenalty2Y(pointData.count);
        var x = dataManager.converIndex2X(pointData.index);
        if (pointData.isLast && monthOffset != 0) {
            //红色柱体
            var lowCount = pointData.count - monthOffset;
            var highCount = pointData.count + monthOffset;
            if (pointData.rangeHigh - pointData.rangeLow < monthOffset * 2) {
                highCount = pointData.rangeHigh;
                lowCount = pointData.rangeLow;
                pointData.count = ( pointData.rangeHigh + pointData.rangeLow ) / 2
            } else if (lowCount < pointData.rangeLow) {
                lowCount = pointData.rangeLow;
                pointData.count = lowCount + monthOffset;
                highCount = pointData.count + monthOffset;
            } else if (highCount > pointData.rangeHigh) {
                highCount = pointData.rangeHigh;
                pointData.count = highCount - monthOffset;
                lowCount = pointData.count - monthOffset;
            }
            var barTopY = dataManager.converPenalty2Y(highCount);
            var barBottomY = dataManager.converPenalty2Y(lowCount);
            if( barBottomY - barTopY < 6 ) {
                barTopY = barBottomY - 3;
                barBottomY += 3;
            }
            pointGroup.redMarkIcon = new Line({
                'id': 'redMarkIcon_' + pointData.index,
                zlevel: 115,
                style: {
                    xStart: x,
                    yStart: barBottomY,
                    xEnd: x,
                    yEnd: barTopY,
                    strokeColor: '#EE8490',
                    lineWidth: 6,
                    opacity: 0.7
                },
                hoverable: false,
                draggable: graphConfig.display ? false : true,
                clickable: true,
                ondrift: lastBarDrift,
                onmouseover: zrender.showHint,
                onmouseout: zrender.hideHint,
                getHintText: function () {
                    return getShowPenaltyText(this.parent);
                }
            });
        } else {
            //红色圆环
            pointGroup.redMarkIcon = new Circle({
                'id': 'redMarkIcon_' + pointData.index,
                zlevel: 115,
                style: {
                    x: x,
                    y: countY,
                    r: 5,
                    color: '#EE8490'
                },
                hoverable: false,
                draggable: graphConfig.display ? false : true,
                clickable: true,
                ondrift: pointDrift,
                onmouseover: zrender.showHint,
                onmouseout: zrender.hideHint,
                getHintText: function () {
                    return getShowPenaltyText(this.parent);
                }
            });
        }
        pointGroup.addChild(pointGroup.redMarkIcon);
        this.addChild(pointGroup);
        return pointGroup;
    };

    /**
     * 更新滑块区域的数据并修改图形位置
     * 只更新最大和最小变化范围，滚动条的位置根据之前百分比计算
     * @param pointData 新数据
     */
    RedAreaGroup.prototype.updateRedPoint = function (pointData, monthOffset) {
        var pointGroup;
        for (var i = 0; i < this.redPointArr.length; i++) {
            if ('redPoint_' + pointData.index == this.redPointArr[i].id) {
                pointGroup = this.redPointArr[i];
                break;
            }
        }
        if (!pointGroup) {
            return;
        }
        pointGroup.pointData = pointData;
        var x = dataManager.converIndex2X(pointData.index);
        //根据新数据绘制图像位置
        if (pointData.isLast && monthOffset != 0 ) {
            //红色柱体
            var lowCount = pointData.count - monthOffset;
            var highCount = pointData.count + monthOffset;
            if (lowCount < pointData.rangeLow) {
                lowCount = pointData.rangeLow;
            } 
            if (highCount > pointData.rangeHigh) {
                highCount = pointData.rangeHigh;
            }
            var barTopY = dataManager.converPenalty2Y(highCount);
            var barBottomY = dataManager.converPenalty2Y(lowCount);
            if( barBottomY - barTopY < 6 ) {
                barTopY = barBottomY - 3
                barBottomY += 3
            }
            pointGroup.redMarkIcon.style = {
                xStart: x,
                yStart: barBottomY,
                xEnd: x,
                yEnd: barTopY,
                strokeColor: '#EE8490',
                lineWidth: 6,
                opacity: 0.7
            }
        } else {
            var countY = dataManager.converPenalty2Y(pointData.count);
            pointGroup.redMarkIcon.style = {
                x: x,
                y: countY,
                r: 5,
                color: '#EE8490'
            }
        }
        zrender.modGroup(pointGroup.id);
        return pointGroup;
    };

    /**
     * 拖动滚动条的事件处理: 限制拖动范围和图形联动
     * @param dx
     * @param dy
     */
    function pointDrift(dx, dy) {
        zrender.hideHint(this);
        var pointGroup = this.parent;
        var pointData = pointGroup.pointData;
        var redAreaGroup = pointGroup.parent;

        //当点位置
        var pointY = dataManager.converPenalty2Y(pointData.count);

        //原点在Y轴上的最大位移（向上向下）
        var moveUpperY;
        var moveLowerY;
        if (pointData.index == 0) {
            //量刑起点的变动范围，与需求确认后：不能低于或高于法定刑，如果高于基准刑，那么基准刑跟着往上走
            var currentY = dataManager.converPenalty2Y(pointData.count);
            var legalPHighY = dataManager.converPenalty2Y(bussinessConfig.legalPenaltyHigh);
            moveUpperY = legalPHighY - currentY;

            var legalPLowY = dataManager.converPenalty2Y(bussinessConfig.legalPenaltyLow);
            moveLowerY = legalPLowY - currentY;
        } else if (pointData.index == 1) {
            //基准刑变动范围，与需求确认后：不能高于法定刑，不能低于量刑起点
            var currentY = dataManager.converPenalty2Y(pointData.count);
            var legalPHighY = dataManager.converPenalty2Y(bussinessConfig.legalPenaltyHigh);
            moveUpperY = legalPHighY - currentY;

            var startPointData = redAreaGroup.redPointArr[0].pointData;
            var startPointY = dataManager.converPenalty2Y(startPointData.count);
            moveLowerY = startPointY - dataManager.converPenalty2Y((pointData.count));
        } else {
            //要素区的移动范围为当前计算结果的浮动范围
            var moveUpperY = dataManager.converPenalty2Y(pointData.rangeHigh) - dataManager.converPenalty2Y((pointData.count));
            if (pointData.rangeHigh < pointData.count) {
                moveUpperY = 0;
            }
            var moveLowerY = dataManager.converPenalty2Y(pointData.rangeLow) - dataManager.converPenalty2Y((pointData.count));
            if (pointData.rangeLow > pointData.count) {
                moveLowerY = 0;
            }
        }

        if (dy < 0 && dy < moveUpperY) {
            //向上移动,相对画布坐标系Y坐标变小
            dy = moveUpperY;
        } else if (dy > 0 && dy > moveLowerY) {
            //向下移动,相对画布坐标系Y坐标变大
            dy = moveLowerY;
        }
        pointY += dy;

        //计算移动后的数据
        var currPenalty = dataManager.converY2Penalty(pointY);
        currPenalty = pointData.rangeHigh < currPenalty ? pointData.rangeHigh : currPenalty;

        pointGroup.redMarkIcon.style.y = pointY;
        zrender.modGroup(pointGroup.id);

        pointData.count = currPenalty;
        if (pointData.index > 1) {
            dataManager.recountRate(pointData);
        }

        //要素区域联动，只联动右边的红色多边形区域: 左侧红细线,上下红虚线，多边形
        if (0 == pointData.index) {
            //基准刑柱体
            var basePPointGroup = redAreaGroup.redPointArr[1];
            if (pointData.count <= basePPointGroup.pointData.count) {
                //如果小于基准刑，那么只有右侧红色多边形区域变动
                moveFirstRedPolygonGroup(redAreaGroup);
            } else {
                //如果大于基准刑，基准刑随量刑起点平行向上移动
                basePPointGroup.pointData.count = pointData.count;
                redAreaGroup.updateRedPoint(basePPointGroup.pointData);

                //重绘量刑起点和基准刑中间的多边形区域
                moveFirstRedPolygonGroup(redAreaGroup);
                //重新计算、然后重绘基准刑之后的区域
                redAreaGroup.reloadRedAreaGroupByBasePenalty(graphConfig, penaltyData, zrender, 1)
            }
        } else if (1 == pointData.index) {
            //重绘量刑起点和基准刑中间的多边形区域
            moveFirstRedPolygonGroup(redAreaGroup);
            //重新计算、然后重绘基准刑之后的区域
            redAreaGroup.reloadRedAreaGroupByBasePenalty(graphConfig, penaltyData, zrender, pointData.index)
        } else {
            redAreaGroup.reloadRedAreaGroupByBasePenalty(graphConfig, penaltyData, zrender, pointData.index)
        }

        if (penaltyData.onPointDriftCallBack) {
            penaltyData.onPointDriftCallBack(pointData);
        }

        zrender.refreshNextFrame();
        if (penaltyData.onPointDriftCallBack) {
            penaltyData.onPointDriftCallBack(redAreaGroup.getDataResult());
        }
        return true;
    }

    function lastBarDrift(dx, dy) {
        zrender.hideHint(this);
        var pointGroup = this.parent;
        var pointData = pointGroup.pointData;
        var redAreaGroup = pointGroup.parent;

        //当前位置
        var pointY = dataManager.converPenalty2Y(pointData.count);
        var monthOffset = bussinessConfig.caliber / 2;

        //移动范围为当前计算结果的浮动范围
        var moveUpperY = dataManager.converPenalty2Y(pointData.rangeHigh) - dataManager.converPenalty2Y((pointData.count + monthOffset));
        if (pointData.rangeHigh < pointData.count + monthOffset) {
            moveUpperY = 0;
        }
        var moveLowerY = dataManager.converPenalty2Y(pointData.rangeLow) - dataManager.converPenalty2Y((pointData.count - monthOffset));
        if (pointData.rangeLow > pointData.count - monthOffset) {
            moveLowerY = 0;
        }
        if (dy < 0 && dy < moveUpperY) {
            //向上移动,相对画布坐标系Y坐标变小
            dy = moveUpperY;
        } else if (dy > 0 && dy > moveLowerY) {
            //向下移动,相对画布坐标系Y坐标变大
            dy = moveLowerY;
        }
        pointY += dy;

        
        //计算移动后的数据
        var currPenalty = dataManager.converY2Penalty(pointY);
        currPenalty = pointData.rangeHigh < currPenalty ? pointData.rangeHigh : currPenalty;

        var currHighCount = currPenalty + monthOffset;
        currHighCount = pointData.rangeHigh < currHighCount ? pointData.rangeHigh : currHighCount;
        var currLowCount = currPenalty - monthOffset;
        currLowCount = pointData.rangeLow > currLowCount ? pointData.rangeLow : currLowCount;

        var currBarTopY = dataManager.converPenalty2Y(currHighCount);
        var currBarBottomY = dataManager.converPenalty2Y(currLowCount);


        if( currBarBottomY - currBarTopY < 6 ) {
            currBarTopY = currBarBottomY - 3;
            currBarBottomY += 3;
        }
        pointGroup.redMarkIcon.style.yStart = currBarBottomY;
        pointGroup.redMarkIcon.style.yEnd = currBarTopY;
        zrender.modGroup(pointGroup.id);

        pointData.count = currPenalty;
        dataManager.recountRate(pointData);

        pointData.lowCount = pointData.count - monthOffset;
        pointData.highCount = pointData.count + monthOffset;
        if (pointData.rangeHigh - pointData.rangeLow < monthOffset * 2) {
            pointData.count = (pointData.rangeHigh + pointData.rangeLow) / 2;
            pointData.lowCount = pointData.rangeLow;
            pointData.highCount = pointData.rangeHigh;
        } else if (pointData.count - monthOffset < pointData.rangeLow) {
            pointData.count = pointData.rangeLow + monthOffset;
            pointData.lowCount = pointData.rangeLow;
        } else if (pointData.count + monthOffset > pointData.rangeHigh) {
            pointData.count = pointData.rangeHigh - monthOffset;
            pointData.highCount = countData.rangeHigh;
        }

        if (penaltyData.onPointDriftCallBack) {
            penaltyData.onPointDriftCallBack(pointData);
        }
        zrender.refreshNextFrame();
        if (penaltyData.onPointDriftCallBack) {
            penaltyData.onPointDriftCallBack(redAreaGroup.getDataResult());
        }
        return true;
    }

    /**
     * 重绘量刑起点和基准刑之间的多边形
     */
    function moveFirstRedPolygonGroup(redAreaGroup) {
        var polygonGroup = redAreaGroup.redPointArr[0].rightRedPolygonGroup;
        var leftPointGroup = redAreaGroup.redPointArr[0];
        var rightPointGroup = redAreaGroup.redPointArr[1];
        if (!polygonGroup) {
            return;
        }
        polygonGroup.redHighDashLine.style.yStart = leftPointGroup.redMarkIcon.style.y;
        polygonGroup.redHighDashLine.style.yEnd = rightPointGroup.redMarkIcon.style.y;

        polygonGroup.redLowDashLine.style.yStart = leftPointGroup.redMarkIcon.style.y;
        polygonGroup.redLowDashLine.style.yEnd = rightPointGroup.redMarkIcon.style.y;

        polygonGroup.redPolygon.style.pointList[0][1] = leftPointGroup.redMarkIcon.style.y;
        polygonGroup.redPolygon.style.pointList[1][1] = rightPointGroup.redMarkIcon.style.y;
        polygonGroup.redPolygon.style.pointList[2][1] = rightPointGroup.redMarkIcon.style.y;
        zrender.modGroup(polygonGroup.id);
    }


    /**
     * 根据滚动条数据生成悬浮提示的文字
     */
    function getShowPenaltyText(pointGroup) {
        var text = "";
        var pointData = pointGroup.pointData;
        var debug = false;
        if (pointData.index > 1) {
            if( debug ) {
                text =  text + "范围上端: "+parseFloat(pointData.rangeHigh.toFixed(3))+",范围下端："+parseFloat(pointData.rangeLow.toFixed(3))+"\n";
                text = text + "中点值: "+ parseFloat(pointData.count.toFixed(3))+"\n";
            }
            if(pointGroup.pointData.countWay == 1 ||  pointGroup.pointData.countWay == 2) {
               text = text +"调节比例："+parseFloat(pointData.rate.toFixed(1))+"%" + "\n"
            } else {
                text = text +"调节幅度："+parseFloat(pointData.rate.toFixed(1)) + "个月\n"
            }
            // text = text + dataManager.getYMShowText(pointData.count) + "\n";
            text = text + '当前值：';
        } else {
            text = text + pointData.name + ": ";
        }
        if( pointData.index == penaltyData.factorArr.length -1 
            && bussinessConfig.caliber != 0) {
            text +=  dataManager.getYMShowText(pointData.lowCount) 
            text += " 到 ";
            text += dataManager.getYMShowText(pointData.highCount);
        } else {
            text += dataManager.getYMShowText(pointData.count);
        }
        return text;
    }


    /**
     * 移动基准刑或其后的红柱，后方的所有区域重新计算
     */
    RedAreaGroup.prototype.reloadRedAreaGroupByBasePenalty = function (graphConfig, penaltyData, zrender, index) {
        //当前点不变，后续的图形重绘
        //移动最后
        if (0 == i || index == this.redPointArr.length - 1) {
            return;
        }
        var startPenalty = this.redPointArr[0].pointData.count;
        var basePenalty = this.redPointArr[1].pointData.count;
        var monthOffset = bussinessConfig.caliber / 2;
        //计算红色坐标点、线、区域
        var countDataArr = dataManager.getCountDataArr(startPenalty, basePenalty, penaltyData.factorArr, this.redPointArr);
        for (var i = index + 1, lastRedPoint; i < countDataArr.length; i++) {
            //根据上个点重新计算当前的最高和最低范围坐标
            var updatePointGroup;
            lastRedPoint = this.redPointArr[i - 1];
            if (penaltyData.factorArr.length - 1 == i) {
                updatePointGroup = this.updateRedPoint(countDataArr[i], monthOffset);
            } else {
                updatePointGroup = this.updateRedPoint(countDataArr[i]);
            }
            //更新红色多边形区域
            this.updateRedPolygonGroup(i - 1, lastRedPoint, updatePointGroup);
        }
    }

    /**
     * 红色区域图形初始化
     */
    RedAreaGroup.prototype.initRedAreaGroup = function (graphConfig, bussinessConfig, penaltyData, zrender) {
        this.redPointArr = [];
        this.redPolygonGroupArr = [];
        var startPenalty = penaltyData.startPenalty;
        var basePenalty = penaltyData.basePenalty;
        var monthOffset = bussinessConfig.caliber / 2;

        //计算红色坐标点、线、区域
        var countDataArr = dataManager.getCountDataArr(startPenalty, basePenalty, penaltyData.factorArr);
        for (var i = 0, currentRedPoint, lastRedPoint; i < countDataArr.length; i++) {
            var currentRedPoint;
            if (i == penaltyData.factorArr.length - 1) {
                currentRedPoint = this.addRedPoint(countDataArr[i], monthOffset);
            } else {
                currentRedPoint = this.addRedPoint(countDataArr[i], 0);
            }
            this.redPointArr.push(currentRedPoint);
            //多边形区域，从第二列开始
            if (0 != i) {
                var currentRedPolygonGroup = this.addRedPolygonGroup(i - 1, lastRedPoint, currentRedPoint);
                //滚动条关联它左右的多边形,滚动时联动
                lastRedPoint.rightRedPolygonGroup = currentRedPolygonGroup;
                currentRedPoint.leftRedPolygonGroup = currentRedPolygonGroup;
                this.redPolygonGroupArr.push(currentRedPolygonGroup);
            }
            lastRedPoint = currentRedPoint;
        }
        zrender.redGroupArea = this;
    }




    RedAreaGroup.prototype.getDataResult = function () {
        var monthOffset = bussinessConfig.caliber / 2;
        var startPenaltyResult = {
            count: this.redPointArr[0].pointData.count
        }
        startPenaltyResult.text = dataManager.getYMShowText(startPenaltyResult.count);


        var basePenaltyResult = {
            count: this.redPointArr[1].pointData.count
        }
        basePenaltyResult.text = dataManager.getYMShowText(basePenaltyResult.count);

        var finalResult = {
            count: this.redPointArr[this.redPointArr.length - 1].pointData.count,
            min: this.redPointArr[this.redPointArr.length - 1].pointData.count - monthOffset,
            max: this.redPointArr[this.redPointArr.length - 1].pointData.count + monthOffset
        }
        if (finalResult.min < this.redPointArr[this.redPointArr.length - 1].pointData.rangeLow) {
            finalResult.min = this.redPointArr[this.redPointArr.length - 1].pointData.rangeLow;
        }
        if (finalResult.max > this.redPointArr[this.redPointArr.length - 1].pointData.rangeHigh) {
            finalResult.max = this.redPointArr[this.redPointArr.length - 1].pointData.rangeHigh;
        }
        finalResult.text = dataManager.getYMShowText(finalResult.count);
        finalResult.minText = dataManager.getYMShowText(finalResult.min);
        finalResult.maxText = dataManager.getYMShowText(finalResult.max);

        var dataResult = {
            startPenalty: startPenaltyResult,
            basePenalty: basePenaltyResult,
            finalResult: finalResult,
            factorResult: []
        };
        for (var i = 2; i < this.redPointArr.length; i++) {
            var dataElemnt = {
                factorId : this.redPointArr[i].pointData.id,
                name : this.redPointArr[i].pointData.name,
                result : this.redPointArr[i].pointData.count,
                rate : this.redPointArr[i].pointData.rate,
                countWay: this.redPointArr[i].pointData.countWay
            }
            dataResult.factorResult.push(dataElemnt);
        }
        return dataResult;
    }

    var redAreaGroup = new RedAreaGroup({
        'id': 'redAreaGroup'
    });
    redAreaGroup.initRedAreaGroup(graphConfig, bussinessConfig, penaltyData, zrender);

    return redAreaGroup;
};