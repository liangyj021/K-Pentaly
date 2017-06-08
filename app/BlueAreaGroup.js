//BlueAreaGroup.js
//蓝色区域的图形，历史数据，包含蓝色区域的坐标点和线、多边形蓝色块
module.exports = function (graphConfig, bussinessConfig, penaltyData, zrender) {
    var Group = require('./zrender/src/Group.js');
    var BlueAreaGroup = require('./zrender/src/Group.js');
    var Circle = require('./zrender/src/shape/Circle.js');
    var Polygon = require('./zrender/src/shape/Polygon.js');
    var Line = require('./zrender/src/shape/Line.js');
    var Rectangle = require('./zrender/src/shape/Rectangle.js');
    var DataManager = require('./DataManager.js');

    var dataManager = new DataManager(graphConfig, bussinessConfig, penaltyData);


    var xOffset = graphConfig.marginLeft;

    /**
     * 画一个蓝色的小点
     */
    BlueAreaGroup.prototype.addBluePoint = function (x, y, pointData) {
        //画圆点
        var point = new Circle({
            zlevel: 115,
            style: {
                x: x,
                y: y,
                r: 3,
                color: '#959FDA'          // rgba supported                
            },
            onmouseover: zrender.showHint,
            onmouseout: zrender.hideHint,
            pointData: pointData,
            getHintText: getHintText
        });
        this.addChild(point);
    };

    /**
     * 画一个蓝色的大点
     */
    BlueAreaGroup.prototype.addBlueBigPoint = function (x, y, pointData) {
        //众数圆心组
        var bigPointGroup = new Group({});
        bigPointGroup.pointData = pointData;
        bigPointGroup.addChild(new Circle({
            zlevel: 115,
            style: {
                x: x,
                y: y,
                r: 5,
                color: '#9B9CCF'
            },
            hoverable: false,
            clickable: false,
            pointData: pointData,
            onmouseover: zrender.showHint,
            onmouseout: zrender.hideHint,
            getHintText: getHintText
        }));
        //圆心
        bigPointGroup.addChild(new Circle({
            zlevel: 115,
            style: {
                x: x,
                y: y,
                r: 3,
                color: '#6C6FBB'
            },
            pointData: pointData,
            onmouseover: zrender.showHint,
            onmouseout: zrender.hideHint,
            getHintText: getHintText,
            draggable: false,
            clickable: false
        }));
        this.addChild(bigPointGroup);
    }

    var getHintText = function () {
        var ymText = dataManager.getYMShowText(this.pointData.count);
        return this.pointData.name + '\n' + this.pointData.label + ' : ' + ymText;
    }

    /**
     * 画蓝边
     */
    BlueAreaGroup.prototype.addBlueLine = function (startPoint, endPoint) {
        //画蓝边
        this.addChild(new Line({
            zlevel: 102,
            style: {
                xStart: startPoint[0],
                yStart: startPoint[1],
                xEnd: endPoint[0],
                yEnd: endPoint[1],
                strokeColor: '#D5D9F5',
                lineWidth: 1
            },
            hoverable: false
        }));
    };

    /**
     * 画四边形
     */
    BlueAreaGroup.prototype.addBluePolygon = function (pointList) {
        //画四边形
        this.addChild(new Polygon({
            zlevel: 102,
            style: {
                pointList: pointList,
                color: '#EBEDFF',
                opacity: 0.6
            },
            hoverable: false
        }));
    };


    var blueAreaGroup = new BlueAreaGroup({ 'id': 'blueAreaGroup' });

    //计算蓝色坐标点、线、区域
    for (var i = 0, lastPonitHigh, lastPointLow; i < penaltyData.factorArr.length; i++) {

        var lowY = dataManager.converPenalty2Y(penaltyData.factorArr[i].historyData.low);
        var highY = dataManager.converPenalty2Y(penaltyData.factorArr[i].historyData.high);
        var mostY = dataManager.converPenalty2Y(penaltyData.factorArr[i].historyData.most);
        var x = dataManager.converIndex2X(i);
        //第一列坐标点不画，从第二列开始


        var highPointData = {
            name: penaltyData.factorArr[i].name,
            label: '历史最大值',
            count: penaltyData.factorArr[i].historyData.high
        }
        blueAreaGroup.addBluePoint(x, highY, highPointData);
        var highPointData = {
            name: penaltyData.factorArr[i].name,
            label: '历史最小值',
            count: penaltyData.factorArr[i].historyData.low
        }
        blueAreaGroup.addBluePoint(x, lowY, highPointData);
        var mostPointData = {
            name: penaltyData.factorArr[i].name,
            label: '众数',
            count: penaltyData.factorArr[i].historyData.most
        }
        blueAreaGroup.addBlueBigPoint(x, mostY, mostPointData);
        if (0 != i) {
            blueAreaGroup.addBlueLine(lastPonitHigh, [x, highY]);
            blueAreaGroup.addBlueLine(lastPointLow, [x, lowY]);
            blueAreaGroup.addBluePolygon([[x, lowY], lastPointLow, lastPonitHigh, [x, highY]]);
        }
        lastPonitHigh = [x, highY];
        lastPointLow = [x, lowY];


    }

    return blueAreaGroup;
};