// CoordinateBaseGroup.js
// 坐标系组件，包括坐标轴、刻度和量刑的起刑点虚线
module.exports = function (graphConfig, bussinessConfig, penaltyData) {

    var penaltyUnit = bussinessConfig.penaltyUnit;

    var Group = require('./zrender/src/Group.js');
    var LineShape = require('./zrender/src/shape/Line.js');
    var Polygon = require('./zrender/src/shape/Polygon.js');
    var Text = require('./zrender/src/shape/Text.js');

    var DataManager = require('./DataManager.js');
    var dataManager = new DataManager(graphConfig, bussinessConfig, penaltyData);

    //图形位置计算
    var group = new Group({
        id: 'bline',
        'position': [graphConfig.marginLeft || 0, graphConfig.marginTop || 0] || null
    });

    //画坐标轴
    _drawCoordinateLine(group, graphConfig);
    //画Y轴刻度
    _drawYLineMark(group, penaltyData, dataManager);
    //画X轴刻度
    _drawXLineMark(group, penaltyData, dataManager);
    //法定刑虚线及区域
    _drawBaseDashLine(group, penaltyData, dataManager);
    //画要素的纵虚线
    _drawFactorYDashLine(group, penaltyData, graphConfig, dataManager);

    return group;


    /**
     * 画坐标轴
     */
    function _drawCoordinateLine(group, graphConfig) {
        group.addChild(new LineShape({
            hoverable: false,
            zlevel: 110,
            style: {
                xStart: 0,
                yStart: 0 - graphConfig.marginTop / 2,
                xEnd: 0,
                yEnd: graphConfig.height,
                strokeColor: '#3894EF',
                lineWidth: 3,
                lineCap: 'square'
            }
        }));
        group.addChild(new LineShape({
            hoverable: false,
            zlevel: 110,
            style: {
                xStart: 0,
                yStart: graphConfig.height,
                xEnd: graphConfig.width,
                yEnd: graphConfig.height,
                strokeColor: '#3894EF',
                lineWidth: 3,
                lineCap: 'square'
            }
        }));
        //纵轴和横轴箭头
        var penaltyUnitName = bussinessConfig.unitText;
        group.addChild(new Polygon({
            style: {
                pointList: [
                    [0, 0 - graphConfig.marginTop / 3 - 13],
                    [-8, 0 - graphConfig.marginTop / 3],
                    [8, 0 - graphConfig.marginTop / 3]],
                color: '#3894EF',
                text: '刑期（' + penaltyUnitName + '）',
                textColor: '#666666',
                textFont: "bold 12px 微软雅黑",
                textPosition: 'right',
                textAlign: 'left',
                textX: -16,
                textY: 0
            },
            hoverable: false
        }));
        group.addChild(new Polygon({
            style: {
                pointList: [
                    [graphConfig.width, graphConfig.height - 10],
                    [graphConfig.width, graphConfig.height + 10],
                    [graphConfig.width + 13, graphConfig.height]],
                color: '#3894EF'
            },
            hoverable: false
        }));
    }

    /**
     * 画纵轴的刻度线
     */
    function _drawYLineMark(group, penaltyData, dataManager) {
        for (var i = bussinessConfig.rangeStart; i < bussinessConfig.rangeEnd + 1; i++) {
            var y = dataManager.converPenalty2Y(i);
            var text = i;
            if (bussinessConfig.markCreateFuntion) {
                var markText = bussinessConfig.markCreateFuntion(i);
                if (markText == 'display') {
                    continue;
                } else {
                    text = markText;
                }
            }
            group.addChild(new LineShape({
                hoverable: false,
                zlevel: 110,
                style: {
                    xStart: -10,
                    yStart: y,
                    xEnd: 0,
                    yEnd: y,
                    strokeColor: '#7E7E7E', // == color
                    lineWidth: 1,
                    lineCap: 'round',
                    text: text,
                    textColor: '#666666',
                    textFont: "bold 12px 微软雅黑",
                    textPosition: 'specific',
                    textAlign: 'right',
                    textX: -12,
                    textY: y
                }
            }));
        }
    }

    /**
     * 画横轴的刻度线
     */
    function _drawXLineMark(group, penaltyData, dataManager) {
        for (var i = 0, changeWay, rangeMark; i < penaltyData.factorArr.length; i++) {
            var x = dataManager.converIndex2X(i);

            var textArr = []
            for (var j = 0; j < penaltyData.factorArr[i].name.length; j += 8) {
                textArr.push(penaltyData.factorArr[i].name.substr(j,  8));
            }
            group.addChild(new Text({
                hoverable: false,
                zlevel: 110,
                style: {
                    text: textArr[0],
                    color: '#666666',
                    textFont: "bold 14px 微软雅黑",
                    textAlign: 'center',
                    textPosition: 'center',
                    textWidth: 10,
                    x: x,
                    y: graphConfig.height + 12
                }
            }));
            if (textArr.length > 1) {
                for (var j = 1; j < textArr.length; j++) {
                    group.addChild(new Text({
                        hoverable: false,
                        zlevel: 110,
                        style: {
                            text: textArr[j],
                            color: '#666666',
                            textFont: "bold 14px 微软雅黑",
                            textAlign: 'center',
                            textPosition: 'center',
                            x: x,
                            y: graphConfig.height + 14 * (j + 1)
                        }
                    }));
                }
            }

            if (penaltyData.factorArr[i].changeMax == 0 && penaltyData.factorArr[i].changeMin == 0) {
                continue;
            }
            if( penaltyData.factorArr[i].changeMax ==  penaltyData.factorArr[i].changeMin ) {
                rangeMark = penaltyData.factorArr[i].changeMax + "%";
            } else {
                rangeMark = penaltyData.factorArr[i].changeMin+"% - "+penaltyData.factorArr[i].changeMax+"%";
            }
            if( penaltyData.factorArr[i].countWay > 2) {
                rangeMark = rangeMark.replace(/%/g,"个月");
            }
            
            countWay = penaltyData.factorArr[i].countWay;
            if (1 == countWay || 3 == countWay ) {
                rangeColor = '#EB6877';
            } else {
                rangeColor = '#60A5F1';
            }
            group.addChild(new Text({
                hoverable: false,
                zlevel: 110,
                style: {
                    text: '(' + rangeMark + ')',
                    color: rangeColor,
                    textFont: "bold 14px 幼圆",
                    textAlign: 'center',
                    textPosition: 'center',
                    x: x,
                    y: graphConfig.height + 14 * (textArr.length) + 13
                }
            }));
        }
    }


    /**
     * 画法定刑虚线 
     */
    function _drawBaseDashLine(group, penaltyData, dataManager) {
        if (!bussinessConfig.blueRangeDash) {
            return;
        }
        //像素坐标系是反的，计算时需要倒着算
        for (var i = 0; i < bussinessConfig.blueRangeDash.length; i++) {
            var lineY = dataManager.converPenalty2Y(bussinessConfig.blueRangeDash[i]);
            group.addChild(new LineShape({
                hoverable: false,
                zlevel: 110,
                style: {
                    xStart: 0,
                    yStart: lineY,
                    xEnd: graphConfig.width,
                    yEnd: lineY,
                    strokeColor: '#3894EF',
                    lineWidth: 2,
                    lineCap: 'round',
                    lineType: 'dashed'
                }
            }));
        }
        // 法定刑区域
        // group.addChild(new Polygon({
        //     style: {
        //         pointList: [
        //             [0, highBaseLineY], [graphConfig.width, highBaseLineY],
        //             [graphConfig.width, lowBaseLineY], [0, lowBaseLineY]],
        //         color: '#F9F9F9',
        //         opacity: 0.6
        //     },
        //     hoverable: false
        // }));
    }

    /**
     * 画要素对应的纵虚线
     */
    function _drawFactorYDashLine(group, penaltyData, graphConfig, dataManager) {
        for (var i = 0; i < penaltyData.factorArr.length; i++) {
            // 第0列不画纵虚线，从第1列开始
            if (0 == i) {
                continue;
            }
            var x = dataManager.converIndex2X(i);
            group.addChild(new LineShape({
                hoverable: false,
                style: {
                    xStart: x,
                    yStart: 0,
                    xEnd: x,
                    yEnd: graphConfig.height,
                    strokeColor: '#A8A9B2', // == color
                    lineWidth: 1,
                    lineCap: 'round',
                    lineType: 'dashed'
                }
            }));
        }
    }
};