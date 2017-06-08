/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	var penalty = __webpack_require__(1);
	window['Penalty'] = penalty;
	var rangeInfoConfig = __webpack_require__(40);
	window['RANGE_CONFIG'] = rangeInfoConfig;

	//webpack app\main.js ..\lxxt\web\repository\eformjs\lxKxt\build.js



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (objid, graphConfig, penaltyData) {


	    var CoordinateBaseGroup = __webpack_require__(2);
	    var BlueAreaGroup = __webpack_require__(24);
	    var RedAreaGroup = __webpack_require__(27);
	    var Zrender = __webpack_require__(28);
	    var Rectangle = __webpack_require__(26);
	    var DataManager = __webpack_require__(23);

	    var zr = Zrender.init(document.getElementById(objid));
	    var dataManager = new DataManager(graphConfig, penaltyData);

	    zr.dataManager = dataManager;
	    
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
	        if( y - 80 < 0 ) {
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


	    var coordinateBaseGroup = new CoordinateBaseGroup(graphConfig,
	        penaltyData);

	    if (penaltyData.hasHistoryData) {
	        var blueAreaGroup = new BlueAreaGroup(graphConfig,
	            penaltyData, zr);
	        coordinateBaseGroup.addChild(blueAreaGroup);
	    }
	    if (penaltyData.startPenalty && penaltyData.basePenalty) {
	        var redAreaGroup = new RedAreaGroup(graphConfig,
	            penaltyData, zr);
	        coordinateBaseGroup.addChild(redAreaGroup);
	    }

	    zr.addGroup(coordinateBaseGroup);

	    zr.getDataResult = function () {
	        if( this.redGroupArea ) {
	            return this.redGroupArea.getDataResult();
	        }
	        var dataResult = {
	            startPenalty: {
	                count : 0,
	                min : 0,
	                max : 0
	            },
	            basePenalty: {
	                count : 0,
	                min : 0,
	                max : 0
	            },
	            finalResult: {
	                count : 0,
	                min : 0,
	                max : 0
	            },
	            factorResult: []
	        };
	        return dataResult;
	    }

	    zr.render();
	    return zr;

	};




/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// CoordinateBaseGroup.js
	// 坐标系组件，包括坐标轴、刻度和量刑的起刑点虚线
	module.exports = function (graphConfig, penaltyData) {

	    var penaltyUnit = penaltyData.rangeInfo.penaltyUnit;

	    var Group = __webpack_require__(3);
	    var LineShape = __webpack_require__(11);
	    var Polygon = __webpack_require__(19);
	    var Text = __webpack_require__(22);

	    var DataManager = __webpack_require__(23);
	    var dataManager = new DataManager(graphConfig, penaltyData);

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
	        var penaltyUnitName = penaltyData.rangeInfo.unitText;
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
	        for (var i = penaltyData.rangeInfo.rangeStart; i < penaltyData.rangeInfo.rangeEnd + 1; i++) {
	            var y = dataManager.converPenalty2Y(i);
	            var text = i;
	            if (penaltyData.rangeInfo.markCreateFuntion) {
	                var markText = penaltyData.rangeInfo.markCreateFuntion(i);
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

	            if (penaltyData.factorArr[i].changeMax == null || penaltyData.factorArr[i].changeMin == null) {
	                continue;
	            }
	            rangeMark = (penaltyData.factorArr[i].changeMin) + "%-" + (penaltyData.factorArr[i].changeMax) + '%';
	            countWay = penaltyData.factorArr[i].countWay;
	            if (1 == countWay || 'add' == countWay || 'ADD' == countWay) {
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
	        if (!penaltyData.rangeInfo.blueRangeDash) {
	            return;
	        }
	        //像素坐标系是反的，计算时需要倒着算
	        for (var i = 0; i < penaltyData.rangeInfo.blueRangeDash.length; i++) {
	            var lineY = dataManager.converPenalty2Y(penaltyData.rangeInfo.blueRangeDash[i]);
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Group是一个容器，可以插入子节点，Group的变换也会被应用到子节点上
	 * @module zrender/Group
	 * @example
	 *     var Group = require('zrender/Group');
	 *     var Circle = require('zrender/shape/Circle');
	 *     var g = new Group();
	 *     g.position[0] = 100;
	 *     g.position[1] = 100;
	 *     g.addChild(new Circle({
	 *         style: {
	 *             x: 100,
	 *             y: 100,
	 *             r: 20,
	 *             brushType: 'fill'
	 *         }
	 *     }));
	 *     zr.addGroup(g);
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	    var guid = __webpack_require__(4);
	    var util = __webpack_require__(5);

	    var Transformable = __webpack_require__(7);
	    var Eventful = __webpack_require__(10);

	    /**
	     * @alias module:zrender/Group
	     * @constructor
	     * @extends module:zrender/mixin/Transformable
	     * @extends module:zrender/mixin/Eventful
	     */
	    var Group = function(options) {

	        options = options || {};

	        /**
	         * Group id
	         * @type {string}
	         */
	        this.id = options.id || guid();

	        for (var key in options) {
	            this[key] = options[key];
	        }

	        /**
	         * @type {string}
	         */
	        this.type = 'group';

	        /**
	         * 用于裁剪的图形(shape)，所有 Group 内的图形在绘制时都会被这个图形裁剪
	         * 该图形会继承Group的变换
	         * @type {module:zrender/shape/Base}
	         * @see http://www.w3.org/TR/2dcontext/#clipping-region
	         */
	        this.clipShape = null;

	        this._children = [];

	        this._storage = null;

	        this.__dirty = true;

	        // Mixin
	        Transformable.call(this);
	        Eventful.call(this);
	    };

	    /**
	     * 是否忽略该 Group 及其所有子节点
	     * @type {boolean}
	     * @default false
	     */
	    Group.prototype.ignore = false;

	    /**
	     * 复制并返回一份新的包含所有儿子节点的数组
	     * @return {Array.<module:zrender/Group|module:zrender/shape/Base>}
	     */
	    Group.prototype.children = function() {
	        return this._children.slice();
	    };

	    /**
	     * 获取指定 index 的儿子节点
	     * @param  {number} idx
	     * @return {module:zrender/Group|module:zrender/shape/Base}
	     */
	    Group.prototype.childAt = function(idx) {
	        return this._children[idx];
	    };

	    /**
	     * 添加子节点，可以是Shape或者Group
	     * @param {module:zrender/Group|module:zrender/shape/Base} child
	     */
	    // TODO Type Check
	    Group.prototype.addChild = function(child) {
	        if (child == this) {
	            return;
	        }
	        
	        if (child.parent == this) {
	            return;
	        }
	        if (child.parent) {
	            child.parent.removeChild(child);
	        }

	        this._children.push(child);
	        child.parent = this;

	        if (this._storage && this._storage !== child._storage) {
	            
	            this._storage.addToMap(child);

	            if (child instanceof Group) {
	                child.addChildrenToStorage(this._storage);
	            }
	        }
	    };

	    /**
	     * 移除子节点
	     * @param {module:zrender/Group|module:zrender/shape/Base} child
	     */
	    // TODO Type Check
	    Group.prototype.removeChild = function(child) {
	        var idx = util.indexOf(this._children, child);

	        if (idx >= 0) {
	            this._children.splice(idx, 1);
	        }
	        child.parent = null;

	        if (this._storage) {
	            
	            this._storage.delFromMap(child.id);

	            if (child instanceof Group) {
	                child.delChildrenFromStorage(this._storage);
	            }
	        }
	    };

	    /**
	     * 移除所有子节点
	     */
	    Group.prototype.clearChildren = function () {
	        for (var i = 0; i < this._children.length; i++) {
	            var child = this._children[i];
	            if (this._storage) {
	                this._storage.delFromMap(child.id);
	                if (child instanceof Group) {
	                    child.delChildrenFromStorage(this._storage);
	                }
	            }
	        }
	        this._children.length = 0;
	    };

	    /**
	     * 遍历所有子节点
	     * @param  {Function} cb
	     * @param  {}   context
	     */
	    Group.prototype.eachChild = function(cb, context) {
	        var haveContext = !!context;
	        for (var i = 0; i < this._children.length; i++) {
	            var child = this._children[i];
	            if (haveContext) {
	                cb.call(context, child);
	            } else {
	                cb(child);
	            }
	        }
	    };

	    /**
	     * 深度优先遍历所有子孙节点
	     * @param  {Function} cb
	     * @param  {}   context
	     */
	    Group.prototype.traverse = function(cb, context) {
	        var haveContext = !!context;
	        for (var i = 0; i < this._children.length; i++) {
	            var child = this._children[i];
	            if (haveContext) {
	                cb.call(context, child);
	            } else {
	                cb(child);
	            }

	            if (child.type === 'group') {
	                child.traverse(cb, context);
	            }
	        }
	    };

	    Group.prototype.addChildrenToStorage = function(storage) {
	        for (var i = 0; i < this._children.length; i++) {
	            var child = this._children[i];
	            storage.addToMap(child);
	            if (child instanceof Group) {
	                child.addChildrenToStorage(storage);
	            }
	        }
	    };

	    Group.prototype.delChildrenFromStorage = function(storage) {
	        for (var i = 0; i < this._children.length; i++) {
	            var child = this._children[i];
	            storage.delFromMap(child.id);
	            if (child instanceof Group) {
	                child.delChildrenFromStorage(storage);
	            }
	        }
	    };

	    Group.prototype.modSelf = function() {
	        this.__dirty = true;
	    };

	    util.merge(Group.prototype, Transformable.prototype, true);
	    util.merge(Group.prototype, Eventful.prototype, true);

	    return Group;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * zrender: 生成唯一id
	 *
	 * @author errorrik (errorrik@gmail.com)
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        var idStart = 0x0907;

	        return function () {
	            return 'zrender__' + (idStart++);
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @module zrender/tool/util
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         Yi Shen(https://github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	        var ArrayProto = Array.prototype;
	        var nativeForEach = ArrayProto.forEach;
	        var nativeMap = ArrayProto.map;
	        var nativeFilter = ArrayProto.filter;

	        // 用于处理merge时无法遍历Date等对象的问题
	        var BUILTIN_OBJECT = {
	            '[object Function]': 1,
	            '[object RegExp]': 1,
	            '[object Date]': 1,
	            '[object Error]': 1,
	            '[object CanvasGradient]': 1
	        };

	        var objToString = Object.prototype.toString;

	        function isDom(obj) {
	            return obj && obj.nodeType === 1
	                   && typeof(obj.nodeName) == 'string';
	        }

	        /**
	         * 对一个object进行深度拷贝
	         * @memberOf module:zrender/tool/util
	         * @param {*} source 需要进行拷贝的对象
	         * @return {*} 拷贝后的新对象
	         */
	        function clone(source) {
	            if (typeof source == 'object' && source !== null) {
	                var result = source;
	                if (source instanceof Array) {
	                    result = [];
	                    for (var i = 0, len = source.length; i < len; i++) {
	                        result[i] = clone(source[i]);
	                    }
	                }
	                else if (
	                    !BUILTIN_OBJECT[objToString.call(source)]
	                    // 是否为 dom 对象
	                    && !isDom(source)
	                ) {
	                    result = {};
	                    for (var key in source) {
	                        if (source.hasOwnProperty(key)) {
	                            result[key] = clone(source[key]);
	                        }
	                    }
	                }

	                return result;
	            }

	            return source;
	        }

	        function mergeItem(target, source, key, overwrite) {
	            if (source.hasOwnProperty(key)) {
	                var targetProp = target[key];
	                if (typeof targetProp == 'object'
	                    && !BUILTIN_OBJECT[objToString.call(targetProp)]
	                    // 是否为 dom 对象
	                    && !isDom(targetProp)
	                ) {
	                    // 如果需要递归覆盖，就递归调用merge
	                    merge(
	                        target[key],
	                        source[key],
	                        overwrite
	                    );
	                }
	                else if (overwrite || !(key in target)) {
	                    // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
	                    target[key] = source[key];
	                }
	            }
	        }

	        /**
	         * 合并源对象的属性到目标对象
	         * @memberOf module:zrender/tool/util
	         * @param {*} target 目标对象
	         * @param {*} source 源对象
	         * @param {boolean} overwrite 是否覆盖
	         */
	        function merge(target, source, overwrite) {
	            for (var i in source) {
	                mergeItem(target, source, i, overwrite);
	            }
	            
	            return target;
	        }

	        var _ctx;

	        function getContext() {
	            if (!_ctx) {
	                __webpack_require__(6);
	                /* jshint ignore:start */
	                if (window['G_vmlCanvasManager']) {
	                    var _div = document.createElement('div');
	                    _div.style.position = 'absolute';
	                    _div.style.top = '-1000px';
	                    document.body.appendChild(_div);

	                    _ctx = G_vmlCanvasManager.initElement(_div)
	                               .getContext('2d');
	                }
	                else {
	                    _ctx = document.createElement('canvas').getContext('2d');
	                }
	                /* jshint ignore:end */
	            }
	            return _ctx;
	        }

	        /**
	         * @memberOf module:zrender/tool/util
	         * @param {Array} array
	         * @param {*} value
	         */
	        function indexOf(array, value) {
	            if (array.indexOf) {
	                return array.indexOf(value);
	            }
	            for (var i = 0, len = array.length; i < len; i++) {
	                if (array[i] === value) {
	                    return i;
	                }
	            }
	            return -1;
	        }

	        /**
	         * 构造类继承关系
	         * @memberOf module:zrender/tool/util
	         * @param {Function} clazz 源类
	         * @param {Function} baseClazz 基类
	         */
	        function inherits(clazz, baseClazz) {
	            var clazzPrototype = clazz.prototype;
	            function F() {}
	            F.prototype = baseClazz.prototype;
	            clazz.prototype = new F();

	            for (var prop in clazzPrototype) {
	                clazz.prototype[prop] = clazzPrototype[prop];
	            }
	            clazz.constructor = clazz;
	        }

	        /**
	         * 数组或对象遍历
	         * @memberOf module:zrender/tool/util
	         * @param {Object|Array} obj
	         * @param {Function} cb
	         * @param {*} [context]
	         */
	        function each(obj, cb, context) {
	            if (!(obj && cb)) {
	                return;
	            }
	            if (obj.forEach && obj.forEach === nativeForEach) {
	                obj.forEach(cb, context);
	            }
	            else if (obj.length === +obj.length) {
	                for (var i = 0, len = obj.length; i < len; i++) {
	                    cb.call(context, obj[i], i, obj);
	                }
	            }
	            else {
	                for (var key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        cb.call(context, obj[key], key, obj);
	                    }
	                }
	            }
	        }

	        /**
	         * 数组映射
	         * @memberOf module:zrender/tool/util
	         * @param {Array} obj
	         * @param {Function} cb
	         * @param {*} [context]
	         * @return {Array}
	         */
	        function map(obj, cb, context) {
	            if (!(obj && cb)) {
	                return;
	            }
	            if (obj.map && obj.map === nativeMap) {
	                return obj.map(cb, context);
	            }
	            else {
	                var result = [];
	                for (var i = 0, len = obj.length; i < len; i++) {
	                    result.push(cb.call(context, obj[i], i, obj));
	                }
	                return result;
	            }
	        }

	        /**
	         * 数组过滤
	         * @memberOf module:zrender/tool/util
	         * @param {Array} obj
	         * @param {Function} cb
	         * @param {*} [context]
	         * @return {Array}
	         */
	        function filter(obj, cb, context) {
	            if (!(obj && cb)) {
	                return;
	            }
	            if (obj.filter && obj.filter === nativeFilter) {
	                return obj.filter(cb, context);
	            }
	            else {
	                var result = [];
	                for (var i = 0, len = obj.length; i < len; i++) {
	                    if (cb.call(context, obj[i], i, obj)) {
	                        result.push(obj[i]);
	                    }
	                }
	                return result;
	            }
	        }

	        function bind(func, context) {
	            
	            return function () {
	                func.apply(context, arguments);
	            }
	        }

	        return {
	            inherits: inherits,
	            clone: clone,
	            merge: merge,
	            getContext: getContext,
	            indexOf: indexOf,
	            each: each,
	            map: map,
	            filter: filter,
	            bind: bind
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright 2006 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	//   http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.


	// Known Issues:
	//
	// * Patterns only support repeat.
	// * Radial gradient are not implemented. The VML version of these look very
	//   different from the canvas one.
	// * Clipping paths are not implemented.
	// * Coordsize. The width and height attribute have higher priority than the
	//   width and height style values which isn't correct.
	// * Painting mode isn't implemented.
	// * Canvas width/height should is using content-box by default. IE in
	//   Quirks mode will draw the canvas using border-box. Either change your
	//   doctype to HTML5
	//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
	//   or use Box Sizing Behavior from WebFX
	//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
	// * Non uniform scaling does not correctly scale strokes.
	// * Optimize. There is always room for speed improvements.

	// AMD by kener.linfeng@gmail.com
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	    
	// Only add this code if we do not already have a canvas implementation
	if (!document.createElement('canvas').getContext) {

	(function() {

	  // alias some functions to make (compiled) code shorter
	  var m = Math;
	  var mr = m.round;
	  var ms = m.sin;
	  var mc = m.cos;
	  var abs = m.abs;
	  var sqrt = m.sqrt;

	  // this is used for sub pixel precision
	  var Z = 10;
	  var Z2 = Z / 2;

	  var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];

	  /**
	   * This funtion is assigned to the <canvas> elements as element.getContext().
	   * @this {HTMLElement}
	   * @return {CanvasRenderingContext2D_}
	   */
	  function getContext() {
	    return this.context_ ||
	        (this.context_ = new CanvasRenderingContext2D_(this));
	  }

	  var slice = Array.prototype.slice;

	  /**
	   * Binds a function to an object. The returned function will always use the
	   * passed in {@code obj} as {@code this}.
	   *
	   * Example:
	   *
	   *   g = bind(f, obj, a, b)
	   *   g(c, d) // will do f.call(obj, a, b, c, d)
	   *
	   * @param {Function} f The function to bind the object to
	   * @param {Object} obj The object that should act as this when the function
	   *     is called
	   * @param {*} var_args Rest arguments that will be used as the initial
	   *     arguments when the function is called
	   * @return {Function} A new function that has bound this
	   */
	  function bind(f, obj, var_args) {
	    var a = slice.call(arguments, 2);
	    return function() {
	      return f.apply(obj, a.concat(slice.call(arguments)));
	    };
	  }

	  function encodeHtmlAttribute(s) {
	    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
	  }

	  function addNamespace(doc, prefix, urn) {
	    if (!doc.namespaces[prefix]) {
	      doc.namespaces.add(prefix, urn, '#default#VML');
	    }
	  }

	  function addNamespacesAndStylesheet(doc) {
	    addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
	    addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');

	    // Setup default CSS.  Only add one style sheet per document
	    if (!doc.styleSheets['ex_canvas_']) {
	      var ss = doc.createStyleSheet();
	      ss.owningElement.id = 'ex_canvas_';
	      ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
	          // default size is 300x150 in Gecko and Opera
	          'text-align:left;width:300px;height:150px}';
	    }
	  }

	  // Add namespaces and stylesheet at startup.
	  addNamespacesAndStylesheet(document);

	  var G_vmlCanvasManager_ = {
	    init: function(opt_doc) {
	      var doc = opt_doc || document;
	      // Create a dummy element so that IE will allow canvas elements to be
	      // recognized.
	      doc.createElement('canvas');
	      doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
	    },

	    init_: function(doc) {
	      // find all canvas elements
	      var els = doc.getElementsByTagName('canvas');
	      for (var i = 0; i < els.length; i++) {
	        this.initElement(els[i]);
	      }
	    },

	    /**
	     * Public initializes a canvas element so that it can be used as canvas
	     * element from now on. This is called automatically before the page is
	     * loaded but if you are creating elements using createElement you need to
	     * make sure this is called on the element.
	     * @param {HTMLElement} el The canvas element to initialize.
	     * @return {HTMLElement} the element that was created.
	     */
	    initElement: function(el) {
	      if (!el.getContext) {
	        el.getContext = getContext;

	        // Add namespaces and stylesheet to document of the element.
	        addNamespacesAndStylesheet(el.ownerDocument);

	        // Remove fallback content. There is no way to hide text nodes so we
	        // just remove all childNodes. We could hide all elements and remove
	        // text nodes but who really cares about the fallback content.
	        el.innerHTML = '';

	        // do not use inline function because that will leak memory
	        el.attachEvent('onpropertychange', onPropertyChange);
	        el.attachEvent('onresize', onResize);

	        var attrs = el.attributes;
	        if (attrs.width && attrs.width.specified) {
	          // TODO: use runtimeStyle and coordsize
	          // el.getContext().setWidth_(attrs.width.nodeValue);
	          el.style.width = attrs.width.nodeValue + 'px';
	        } else {
	          el.width = el.clientWidth;
	        }
	        if (attrs.height && attrs.height.specified) {
	          // TODO: use runtimeStyle and coordsize
	          // el.getContext().setHeight_(attrs.height.nodeValue);
	          el.style.height = attrs.height.nodeValue + 'px';
	        } else {
	          el.height = el.clientHeight;
	        }
	        //el.getContext().setCoordsize_()
	      }
	      return el;
	    }
	  };

	  function onPropertyChange(e) {
	    var el = e.srcElement;

	    switch (e.propertyName) {
	      case 'width':
	        el.getContext().clearRect();
	        el.style.width = el.attributes.width.nodeValue + 'px';
	        // In IE8 this does not trigger onresize.
	        el.firstChild.style.width =  el.clientWidth + 'px';
	        break;
	      case 'height':
	        el.getContext().clearRect();
	        el.style.height = el.attributes.height.nodeValue + 'px';
	        el.firstChild.style.height = el.clientHeight + 'px';
	        break;
	    }
	  }

	  function onResize(e) {
	    var el = e.srcElement;
	    if (el.firstChild) {
	      el.firstChild.style.width =  el.clientWidth + 'px';
	      el.firstChild.style.height = el.clientHeight + 'px';
	    }
	  }

	  G_vmlCanvasManager_.init();

	  // precompute "00" to "FF"
	  var decToHex = [];
	  for (var i = 0; i < 16; i++) {
	    for (var j = 0; j < 16; j++) {
	      decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
	    }
	  }

	  function createMatrixIdentity() {
	    return [
	      [1, 0, 0],
	      [0, 1, 0],
	      [0, 0, 1]
	    ];
	  }

	  function matrixMultiply(m1, m2) {
	    var result = createMatrixIdentity();

	    for (var x = 0; x < 3; x++) {
	      for (var y = 0; y < 3; y++) {
	        var sum = 0;

	        for (var z = 0; z < 3; z++) {
	          sum += m1[x][z] * m2[z][y];
	        }

	        result[x][y] = sum;
	      }
	    }
	    return result;
	  }

	  function copyState(o1, o2) {
	    o2.fillStyle     = o1.fillStyle;
	    o2.lineCap       = o1.lineCap;
	    o2.lineJoin      = o1.lineJoin;
	    o2.lineWidth     = o1.lineWidth;
	    o2.miterLimit    = o1.miterLimit;
	    o2.shadowBlur    = o1.shadowBlur;
	    o2.shadowColor   = o1.shadowColor;
	    o2.shadowOffsetX = o1.shadowOffsetX;
	    o2.shadowOffsetY = o1.shadowOffsetY;
	    o2.strokeStyle   = o1.strokeStyle;
	    o2.globalAlpha   = o1.globalAlpha;
	    o2.font          = o1.font;
	    o2.textAlign     = o1.textAlign;
	    o2.textBaseline  = o1.textBaseline;
	    o2.scaleX_    = o1.scaleX_;
	    o2.scaleY_    = o1.scaleY_;
	    o2.lineScale_    = o1.lineScale_;
	  }

	  var colorData = {
	    aliceblue: '#F0F8FF',
	    antiquewhite: '#FAEBD7',
	    aquamarine: '#7FFFD4',
	    azure: '#F0FFFF',
	    beige: '#F5F5DC',
	    bisque: '#FFE4C4',
	    black: '#000000',
	    blanchedalmond: '#FFEBCD',
	    blueviolet: '#8A2BE2',
	    brown: '#A52A2A',
	    burlywood: '#DEB887',
	    cadetblue: '#5F9EA0',
	    chartreuse: '#7FFF00',
	    chocolate: '#D2691E',
	    coral: '#FF7F50',
	    cornflowerblue: '#6495ED',
	    cornsilk: '#FFF8DC',
	    crimson: '#DC143C',
	    cyan: '#00FFFF',
	    darkblue: '#00008B',
	    darkcyan: '#008B8B',
	    darkgoldenrod: '#B8860B',
	    darkgray: '#A9A9A9',
	    darkgreen: '#006400',
	    darkgrey: '#A9A9A9',
	    darkkhaki: '#BDB76B',
	    darkmagenta: '#8B008B',
	    darkolivegreen: '#556B2F',
	    darkorange: '#FF8C00',
	    darkorchid: '#9932CC',
	    darkred: '#8B0000',
	    darksalmon: '#E9967A',
	    darkseagreen: '#8FBC8F',
	    darkslateblue: '#483D8B',
	    darkslategray: '#2F4F4F',
	    darkslategrey: '#2F4F4F',
	    darkturquoise: '#00CED1',
	    darkviolet: '#9400D3',
	    deeppink: '#FF1493',
	    deepskyblue: '#00BFFF',
	    dimgray: '#696969',
	    dimgrey: '#696969',
	    dodgerblue: '#1E90FF',
	    firebrick: '#B22222',
	    floralwhite: '#FFFAF0',
	    forestgreen: '#228B22',
	    gainsboro: '#DCDCDC',
	    ghostwhite: '#F8F8FF',
	    gold: '#FFD700',
	    goldenrod: '#DAA520',
	    grey: '#808080',
	    greenyellow: '#ADFF2F',
	    honeydew: '#F0FFF0',
	    hotpink: '#FF69B4',
	    indianred: '#CD5C5C',
	    indigo: '#4B0082',
	    ivory: '#FFFFF0',
	    khaki: '#F0E68C',
	    lavender: '#E6E6FA',
	    lavenderblush: '#FFF0F5',
	    lawngreen: '#7CFC00',
	    lemonchiffon: '#FFFACD',
	    lightblue: '#ADD8E6',
	    lightcoral: '#F08080',
	    lightcyan: '#E0FFFF',
	    lightgoldenrodyellow: '#FAFAD2',
	    lightgreen: '#90EE90',
	    lightgrey: '#D3D3D3',
	    lightpink: '#FFB6C1',
	    lightsalmon: '#FFA07A',
	    lightseagreen: '#20B2AA',
	    lightskyblue: '#87CEFA',
	    lightslategray: '#778899',
	    lightslategrey: '#778899',
	    lightsteelblue: '#B0C4DE',
	    lightyellow: '#FFFFE0',
	    limegreen: '#32CD32',
	    linen: '#FAF0E6',
	    magenta: '#FF00FF',
	    mediumaquamarine: '#66CDAA',
	    mediumblue: '#0000CD',
	    mediumorchid: '#BA55D3',
	    mediumpurple: '#9370DB',
	    mediumseagreen: '#3CB371',
	    mediumslateblue: '#7B68EE',
	    mediumspringgreen: '#00FA9A',
	    mediumturquoise: '#48D1CC',
	    mediumvioletred: '#C71585',
	    midnightblue: '#191970',
	    mintcream: '#F5FFFA',
	    mistyrose: '#FFE4E1',
	    moccasin: '#FFE4B5',
	    navajowhite: '#FFDEAD',
	    oldlace: '#FDF5E6',
	    olivedrab: '#6B8E23',
	    orange: '#FFA500',
	    orangered: '#FF4500',
	    orchid: '#DA70D6',
	    palegoldenrod: '#EEE8AA',
	    palegreen: '#98FB98',
	    paleturquoise: '#AFEEEE',
	    palevioletred: '#DB7093',
	    papayawhip: '#FFEFD5',
	    peachpuff: '#FFDAB9',
	    peru: '#CD853F',
	    pink: '#FFC0CB',
	    plum: '#DDA0DD',
	    powderblue: '#B0E0E6',
	    rosybrown: '#BC8F8F',
	    royalblue: '#4169E1',
	    saddlebrown: '#8B4513',
	    salmon: '#FA8072',
	    sandybrown: '#F4A460',
	    seagreen: '#2E8B57',
	    seashell: '#FFF5EE',
	    sienna: '#A0522D',
	    skyblue: '#87CEEB',
	    slateblue: '#6A5ACD',
	    slategray: '#708090',
	    slategrey: '#708090',
	    snow: '#FFFAFA',
	    springgreen: '#00FF7F',
	    steelblue: '#4682B4',
	    tan: '#D2B48C',
	    thistle: '#D8BFD8',
	    tomato: '#FF6347',
	    turquoise: '#40E0D0',
	    violet: '#EE82EE',
	    wheat: '#F5DEB3',
	    whitesmoke: '#F5F5F5',
	    yellowgreen: '#9ACD32'
	  };


	  function getRgbHslContent(styleString) {
	    var start = styleString.indexOf('(', 3);
	    var end = styleString.indexOf(')', start + 1);
	    var parts = styleString.substring(start + 1, end).split(',');
	    // add alpha if needed
	    if (parts.length != 4 || styleString.charAt(3) != 'a') {
	      parts[3] = 1;
	    }
	    return parts;
	  }

	  function percent(s) {
	    return parseFloat(s) / 100;
	  }

	  function clamp(v, min, max) {
	    return Math.min(max, Math.max(min, v));
	  }

	  function hslToRgb(parts){
	    var r, g, b, h, s, l;
	    h = parseFloat(parts[0]) / 360 % 360;
	    if (h < 0)
	      h++;
	    s = clamp(percent(parts[1]), 0, 1);
	    l = clamp(percent(parts[2]), 0, 1);
	    if (s == 0) {
	      r = g = b = l; // achromatic
	    } else {
	      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	      var p = 2 * l - q;
	      r = hueToRgb(p, q, h + 1 / 3);
	      g = hueToRgb(p, q, h);
	      b = hueToRgb(p, q, h - 1 / 3);
	    }

	    return '#' + decToHex[Math.floor(r * 255)] +
	        decToHex[Math.floor(g * 255)] +
	        decToHex[Math.floor(b * 255)];
	  }

	  function hueToRgb(m1, m2, h) {
	    if (h < 0)
	      h++;
	    if (h > 1)
	      h--;

	    if (6 * h < 1)
	      return m1 + (m2 - m1) * 6 * h;
	    else if (2 * h < 1)
	      return m2;
	    else if (3 * h < 2)
	      return m1 + (m2 - m1) * (2 / 3 - h) * 6;
	    else
	      return m1;
	  }

	  var processStyleCache = {};

	  function processStyle(styleString) {
	    if (styleString in processStyleCache) {
	      return processStyleCache[styleString];
	    }

	    var str, alpha = 1;

	    styleString = String(styleString);
	    if (styleString.charAt(0) == '#') {
	      str = styleString;
	    } else if (/^rgb/.test(styleString)) {
	      var parts = getRgbHslContent(styleString);
	      var str = '#', n;
	      for (var i = 0; i < 3; i++) {
	        if (parts[i].indexOf('%') != -1) {
	          n = Math.floor(percent(parts[i]) * 255);
	        } else {
	          n = +parts[i];
	        }
	        str += decToHex[clamp(n, 0, 255)];
	      }
	      alpha = +parts[3];
	    } else if (/^hsl/.test(styleString)) {
	      var parts = getRgbHslContent(styleString);
	      str = hslToRgb(parts);
	      alpha = parts[3];
	    } else {
	      str = colorData[styleString] || styleString;
	    }
	    return processStyleCache[styleString] = {color: str, alpha: alpha};
	  }

	  var DEFAULT_STYLE = {
	    style: 'normal',
	    variant: 'normal',
	    weight: 'normal',
	    size: 12,           //10
	    family: '微软雅黑'     //'sans-serif'
	  };

	  // Internal text style cache
	  var fontStyleCache = {};

	  function processFontStyle(styleString) {
	    if (fontStyleCache[styleString]) {
	      return fontStyleCache[styleString];
	    }

	    var el = document.createElement('div');
	    var style = el.style;
	    var fontFamily;
	    try {
	      style.font = styleString;
	      fontFamily = style.fontFamily.split(',')[0];
	    } catch (ex) {
	      // Ignore failures to set to invalid font.
	    }

	    return fontStyleCache[styleString] = {
	      style: style.fontStyle || DEFAULT_STYLE.style,
	      variant: style.fontVariant || DEFAULT_STYLE.variant,
	      weight: style.fontWeight || DEFAULT_STYLE.weight,
	      size: style.fontSize || DEFAULT_STYLE.size,
	      family: fontFamily || DEFAULT_STYLE.family
	    };
	  }

	  function getComputedStyle(style, element) {
	    var computedStyle = {};

	    for (var p in style) {
	      computedStyle[p] = style[p];
	    }

	    // Compute the size
	    var canvasFontSize = parseFloat(element.currentStyle.fontSize),
	        fontSize = parseFloat(style.size);

	    if (typeof style.size == 'number') {
	      computedStyle.size = style.size;
	    } else if (style.size.indexOf('px') != -1) {
	      computedStyle.size = fontSize;
	    } else if (style.size.indexOf('em') != -1) {
	      computedStyle.size = canvasFontSize * fontSize;
	    } else if(style.size.indexOf('%') != -1) {
	      computedStyle.size = (canvasFontSize / 100) * fontSize;
	    } else if (style.size.indexOf('pt') != -1) {
	      computedStyle.size = fontSize / .75;
	    } else {
	      computedStyle.size = canvasFontSize;
	    }

	    // Different scaling between normal text and VML text. This was found using
	    // trial and error to get the same size as non VML text.
	    //computedStyle.size *= 0.981;

	    return computedStyle;
	  }

	  function buildStyle(style) {
	    return style.style + ' ' + style.variant + ' ' + style.weight + ' ' +
	        style.size + "px '" + style.family + "'";
	  }

	  var lineCapMap = {
	    'butt': 'flat',
	    'round': 'round'
	  };

	  function processLineCap(lineCap) {
	    return lineCapMap[lineCap] || 'square';
	  }

	  /**
	   * This class implements CanvasRenderingContext2D interface as described by
	   * the WHATWG.
	   * @param {HTMLElement} canvasElement The element that the 2D context should
	   * be associated with
	   */
	  function CanvasRenderingContext2D_(canvasElement) {
	    this.m_ = createMatrixIdentity();

	    this.mStack_ = [];
	    this.aStack_ = [];
	    this.currentPath_ = [];

	    // Canvas context properties
	    this.strokeStyle = '#000';
	    this.fillStyle = '#000';

	    this.lineWidth = 1;
	    this.lineJoin = 'miter';
	    this.lineCap = 'butt';
	    this.miterLimit = Z * 1;
	    this.globalAlpha = 1;
	    // this.font = '10px sans-serif';
	    this.font = '12px 微软雅黑';        // 决定还是改这吧，影响代价最小
	    this.textAlign = 'left';
	    this.textBaseline = 'alphabetic';
	    this.canvas = canvasElement;

	    var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' +
	        canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
	    var el = canvasElement.ownerDocument.createElement('div');
	    el.style.cssText = cssText;
	    canvasElement.appendChild(el);

	    var overlayEl = el.cloneNode(false);
	    // Use a non transparent background.
	    overlayEl.style.backgroundColor = '#fff'; //red, I don't know why, it work! 
	    overlayEl.style.filter = 'alpha(opacity=0)';
	    canvasElement.appendChild(overlayEl);

	    this.element_ = el;
	    this.scaleX_ = 1;
	    this.scaleY_ = 1;
	    this.lineScale_ = 1;
	  }

	  var contextPrototype = CanvasRenderingContext2D_.prototype;
	  contextPrototype.clearRect = function() {
	    if (this.textMeasureEl_) {
	      this.textMeasureEl_.removeNode(true);
	      this.textMeasureEl_ = null;
	    }
	    this.element_.innerHTML = '';
	  };

	  contextPrototype.beginPath = function() {
	    // TODO: Branch current matrix so that save/restore has no effect
	    //       as per safari docs.
	    this.currentPath_ = [];
	  };

	  contextPrototype.moveTo = function(aX, aY) {
	    var p = getCoords(this, aX, aY);
	    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
	    this.currentX_ = p.x;
	    this.currentY_ = p.y;
	  };

	  contextPrototype.lineTo = function(aX, aY) {
	    var p = getCoords(this, aX, aY);
	    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

	    this.currentX_ = p.x;
	    this.currentY_ = p.y;
	  };

	  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
	                                            aCP2x, aCP2y,
	                                            aX, aY) {
	    var p = getCoords(this, aX, aY);
	    var cp1 = getCoords(this, aCP1x, aCP1y);
	    var cp2 = getCoords(this, aCP2x, aCP2y);
	    bezierCurveTo(this, cp1, cp2, p);
	  };

	  // Helper function that takes the already fixed cordinates.
	  function bezierCurveTo(self, cp1, cp2, p) {
	    self.currentPath_.push({
	      type: 'bezierCurveTo',
	      cp1x: cp1.x,
	      cp1y: cp1.y,
	      cp2x: cp2.x,
	      cp2y: cp2.y,
	      x: p.x,
	      y: p.y
	    });
	    self.currentX_ = p.x;
	    self.currentY_ = p.y;
	  }

	  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
	    // the following is lifted almost directly from
	    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

	    var cp = getCoords(this, aCPx, aCPy);
	    var p = getCoords(this, aX, aY);

	    var cp1 = {
	      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
	      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
	    };
	    var cp2 = {
	      x: cp1.x + (p.x - this.currentX_) / 3.0,
	      y: cp1.y + (p.y - this.currentY_) / 3.0
	    };

	    bezierCurveTo(this, cp1, cp2, p);
	  };

	  contextPrototype.arc = function(aX, aY, aRadius,
	                                  aStartAngle, aEndAngle, aClockwise) {
	    aRadius *= Z;
	    var arcType = aClockwise ? 'at' : 'wa';

	    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
	    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

	    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
	    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

	    // IE won't render arches drawn counter clockwise if xStart == xEnd.
	    if (xStart == xEnd && !aClockwise) {
	      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
	                       // that can be represented in binary
	    }

	    var p = getCoords(this, aX, aY);
	    var pStart = getCoords(this, xStart, yStart);
	    var pEnd = getCoords(this, xEnd, yEnd);

	    this.currentPath_.push({type: arcType,
	                           x: p.x,
	                           y: p.y,
	                           radius: aRadius,
	                           xStart: pStart.x,
	                           yStart: pStart.y,
	                           xEnd: pEnd.x,
	                           yEnd: pEnd.y});

	  };

	  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
	    this.moveTo(aX, aY);
	    this.lineTo(aX + aWidth, aY);
	    this.lineTo(aX + aWidth, aY + aHeight);
	    this.lineTo(aX, aY + aHeight);
	    this.closePath();
	  };

	  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
	    var oldPath = this.currentPath_;
	    this.beginPath();

	    this.moveTo(aX, aY);
	    this.lineTo(aX + aWidth, aY);
	    this.lineTo(aX + aWidth, aY + aHeight);
	    this.lineTo(aX, aY + aHeight);
	    this.closePath();
	    this.stroke();

	    this.currentPath_ = oldPath;
	  };

	  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
	    var oldPath = this.currentPath_;
	    this.beginPath();

	    this.moveTo(aX, aY);
	    this.lineTo(aX + aWidth, aY);
	    this.lineTo(aX + aWidth, aY + aHeight);
	    this.lineTo(aX, aY + aHeight);
	    this.closePath();
	    this.fill();

	    this.currentPath_ = oldPath;
	  };

	  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
	    var gradient = new CanvasGradient_('gradient');
	    gradient.x0_ = aX0;
	    gradient.y0_ = aY0;
	    gradient.x1_ = aX1;
	    gradient.y1_ = aY1;
	    return gradient;
	  };

	  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
	                                                   aX1, aY1, aR1) {
	    var gradient = new CanvasGradient_('gradientradial');
	    gradient.x0_ = aX0;
	    gradient.y0_ = aY0;
	    gradient.r0_ = aR0;
	    gradient.x1_ = aX1;
	    gradient.y1_ = aY1;
	    gradient.r1_ = aR1;
	    return gradient;
	  };

	  contextPrototype.drawImage = function(image, var_args) {
	    var dx, dy, dw, dh, sx, sy, sw, sh;

	    // to find the original width we overide the width and height
	    var oldRuntimeWidth = image.runtimeStyle.width;
	    var oldRuntimeHeight = image.runtimeStyle.height;
	    image.runtimeStyle.width = 'auto';
	    image.runtimeStyle.height = 'auto';

	    // get the original size
	    var w = image.width;
	    var h = image.height;

	    // and remove overides
	    image.runtimeStyle.width = oldRuntimeWidth;
	    image.runtimeStyle.height = oldRuntimeHeight;

	    if (arguments.length == 3) {
	      dx = arguments[1];
	      dy = arguments[2];
	      sx = sy = 0;
	      sw = dw = w;
	      sh = dh = h;
	    } else if (arguments.length == 5) {
	      dx = arguments[1];
	      dy = arguments[2];
	      dw = arguments[3];
	      dh = arguments[4];
	      sx = sy = 0;
	      sw = w;
	      sh = h;
	    } else if (arguments.length == 9) {
	      sx = arguments[1];
	      sy = arguments[2];
	      sw = arguments[3];
	      sh = arguments[4];
	      dx = arguments[5];
	      dy = arguments[6];
	      dw = arguments[7];
	      dh = arguments[8];
	    } else {
	      throw Error('Invalid number of arguments');
	    }

	    var d = getCoords(this, dx, dy);

	    var w2 = sw / 2;
	    var h2 = sh / 2;

	    var vmlStr = [];

	    var W = 10;
	    var H = 10;

	    var scaleX = scaleY = 1;
	    
	    // For some reason that I've now forgotten, using divs didn't work
	    vmlStr.push(' <g_vml_:group',
	                ' coordsize="', Z * W, ',', Z * H, '"',
	                ' coordorigin="0,0"' ,
	                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

	    // If filters are necessary (rotation exists), create them
	    // filters are bog-slow, so only create them if abbsolutely necessary
	    // The following check doesn't account for skews (which don't exist
	    // in the canvas spec (yet) anyway.

	    if (this.m_[0][0] != 1 || this.m_[0][1] ||
	        this.m_[1][1] != 1 || this.m_[1][0]) {
	      var filter = [];

	     var scaleX = this.scaleX_;
	     var scaleY = this.scaleY_;
	      // Note the 12/21 reversal
	      filter.push('M11=', this.m_[0][0] / scaleX, ',',
	                  'M12=', this.m_[1][0] / scaleY, ',',
	                  'M21=', this.m_[0][1] / scaleX, ',',
	                  'M22=', this.m_[1][1] / scaleY, ',',
	                  'Dx=', mr(d.x / Z), ',',
	                  'Dy=', mr(d.y / Z), '');

	      // Bounding box calculation (need to minimize displayed area so that
	      // filters don't waste time on unused pixels.
	      var max = d;
	      var c2 = getCoords(this, dx + dw, dy);
	      var c3 = getCoords(this, dx, dy + dh);
	      var c4 = getCoords(this, dx + dw, dy + dh);

	      max.x = m.max(max.x, c2.x, c3.x, c4.x);
	      max.y = m.max(max.y, c2.y, c3.y, c4.y);

	      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
	                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
	                  filter.join(''), ", SizingMethod='clip');");

	    } else {
	      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
	    }

	    vmlStr.push(' ">');

	    // Draw a special cropping div if needed
	    if (sx || sy) {
	      // Apply scales to width and height
	      vmlStr.push('<div style="overflow: hidden; width:', Math.ceil((dw + sx * dw / sw) * scaleX), 'px;',
	                  ' height:', Math.ceil((dh + sy * dh / sh) * scaleY), 'px;',
	                  ' filter:progid:DxImageTransform.Microsoft.Matrix(Dx=',
	                  -sx * dw / sw * scaleX, ',Dy=', -sy * dh / sh * scaleY, ');">');
	    }
	    
	      
	    // Apply scales to width and height
	    vmlStr.push('<div style="width:', Math.round(scaleX * w * dw / sw), 'px;',
	                ' height:', Math.round(scaleY * h * dh / sh), 'px;',
	                ' filter:');
	   
	    // If there is a globalAlpha, apply it to image
	    if(this.globalAlpha < 1) {
	      vmlStr.push(' progid:DXImageTransform.Microsoft.Alpha(opacity=' + (this.globalAlpha * 100) + ')');
	    }
	    
	    vmlStr.push(' progid:DXImageTransform.Microsoft.AlphaImageLoader(src=', image.src, ',sizingMethod=scale)">');
	    
	    // Close the crop div if necessary            
	    if (sx || sy) vmlStr.push('</div>');
	    
	    vmlStr.push('</div></div>');
	    
	    this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
	  };

	  contextPrototype.stroke = function(aFill) {
	    var lineStr = [];
	    var lineOpen = false;

	    var W = 10;
	    var H = 10;

	    lineStr.push('<g_vml_:shape',
	                 ' filled="', !!aFill, '"',
	                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
	                 ' coordorigin="0,0"',
	                 ' coordsize="', Z * W, ',', Z * H, '"',
	                 ' stroked="', !aFill, '"',
	                 ' path="');

	    var newSeq = false;
	    var min = {x: null, y: null};
	    var max = {x: null, y: null};

	    for (var i = 0; i < this.currentPath_.length; i++) {
	      var p = this.currentPath_[i];
	      var c;

	      switch (p.type) {
	        case 'moveTo':
	          c = p;
	          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
	          break;
	        case 'lineTo':
	          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
	          break;
	        case 'close':
	          lineStr.push(' x ');
	          p = null;
	          break;
	        case 'bezierCurveTo':
	          lineStr.push(' c ',
	                       mr(p.cp1x), ',', mr(p.cp1y), ',',
	                       mr(p.cp2x), ',', mr(p.cp2y), ',',
	                       mr(p.x), ',', mr(p.y));
	          break;
	        case 'at':
	        case 'wa':
	          lineStr.push(' ', p.type, ' ',
	                       mr(p.x - this.scaleX_ * p.radius), ',',
	                       mr(p.y - this.scaleY_ * p.radius), ' ',
	                       mr(p.x + this.scaleX_ * p.radius), ',',
	                       mr(p.y + this.scaleY_ * p.radius), ' ',
	                       mr(p.xStart), ',', mr(p.yStart), ' ',
	                       mr(p.xEnd), ',', mr(p.yEnd));
	          break;
	      }


	      // TODO: Following is broken for curves due to
	      //       move to proper paths.

	      // Figure out dimensions so we can do gradient fills
	      // properly
	      if (p) {
	        if (min.x == null || p.x < min.x) {
	          min.x = p.x;
	        }
	        if (max.x == null || p.x > max.x) {
	          max.x = p.x;
	        }
	        if (min.y == null || p.y < min.y) {
	          min.y = p.y;
	        }
	        if (max.y == null || p.y > max.y) {
	          max.y = p.y;
	        }
	      }
	    }
	    lineStr.push(' ">');

	    if (!aFill) {
	      appendStroke(this, lineStr);
	    } else {
	      appendFill(this, lineStr, min, max);
	    }

	    lineStr.push('</g_vml_:shape>');

	    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
	  };

	  function appendStroke(ctx, lineStr) {
	    var a = processStyle(ctx.strokeStyle);
	    var color = a.color;
	    var opacity = a.alpha * ctx.globalAlpha;
	    var lineWidth = ctx.lineScale_ * ctx.lineWidth;

	    // VML cannot correctly render a line if the width is less than 1px.
	    // In that case, we dilute the color to make the line look thinner.
	    if (lineWidth < 1) {
	      opacity *= lineWidth;
	    }

	    lineStr.push(
	      '<g_vml_:stroke',
	      ' opacity="', opacity, '"',
	      ' joinstyle="', ctx.lineJoin, '"',
	      ' miterlimit="', ctx.miterLimit, '"',
	      ' endcap="', processLineCap(ctx.lineCap), '"',
	      ' weight="', lineWidth, 'px"',
	      ' color="', color, '" />'
	    );
	  }

	  function appendFill(ctx, lineStr, min, max) {
	    var fillStyle = ctx.fillStyle;
	    var arcScaleX = ctx.scaleX_;
	    var arcScaleY = ctx.scaleY_;
	    var width = max.x - min.x;
	    var height = max.y - min.y;
	    if (fillStyle instanceof CanvasGradient_) {
	      // TODO: Gradients transformed with the transformation matrix.
	      var angle = 0;
	      var focus = {x: 0, y: 0};

	      // additional offset
	      var shift = 0;
	      // scale factor for offset
	      var expansion = 1;

	      if (fillStyle.type_ == 'gradient') {
	        var x0 = fillStyle.x0_ / arcScaleX;
	        var y0 = fillStyle.y0_ / arcScaleY;
	        var x1 = fillStyle.x1_ / arcScaleX;
	        var y1 = fillStyle.y1_ / arcScaleY;
	        var p0 = getCoords(ctx, x0, y0);
	        var p1 = getCoords(ctx, x1, y1);
	        var dx = p1.x - p0.x;
	        var dy = p1.y - p0.y;
	        angle = Math.atan2(dx, dy) * 180 / Math.PI;

	        // The angle should be a non-negative number.
	        if (angle < 0) {
	          angle += 360;
	        }

	        // Very small angles produce an unexpected result because they are
	        // converted to a scientific notation string.
	        if (angle < 1e-6) {
	          angle = 0;
	        }
	      } else {
	        var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
	        focus = {
	          x: (p0.x - min.x) / width,
	          y: (p0.y - min.y) / height
	        };

	        width  /= arcScaleX * Z;
	        height /= arcScaleY * Z;
	        var dimension = m.max(width, height);
	        shift = 2 * fillStyle.r0_ / dimension;
	        expansion = 2 * fillStyle.r1_ / dimension - shift;
	      }

	      // We need to sort the color stops in ascending order by offset,
	      // otherwise IE won't interpret it correctly.
	      var stops = fillStyle.colors_;
	      stops.sort(function(cs1, cs2) {
	        return cs1.offset - cs2.offset;
	      });

	      var length = stops.length;
	      var color1 = stops[0].color;
	      var color2 = stops[length - 1].color;
	      var opacity1 = stops[0].alpha * ctx.globalAlpha;
	      var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;

	      var colors = [];
	      for (var i = 0; i < length; i++) {
	        var stop = stops[i];
	        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
	      }

	      // When colors attribute is used, the meanings of opacity and o:opacity2
	      // are reversed.
	      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
	                   ' method="none" focus="100%"',
	                   ' color="', color1, '"',
	                   ' color2="', color2, '"',
	                   ' colors="', colors.join(','), '"',
	                   ' opacity="', opacity2, '"',
	                   ' g_o_:opacity2="', opacity1, '"',
	                   ' angle="', angle, '"',
	                   ' focusposition="', focus.x, ',', focus.y, '" />');
	    } else if (fillStyle instanceof CanvasPattern_) {
	      if (width && height) {
	        var deltaLeft = -min.x;
	        var deltaTop = -min.y;
	        lineStr.push('<g_vml_:fill',
	                     ' position="',
	                     deltaLeft / width * arcScaleX * arcScaleX, ',',
	                     deltaTop / height * arcScaleY * arcScaleY, '"',
	                     ' type="tile"',
	                     // TODO: Figure out the correct size to fit the scale.
	                     //' size="', w, 'px ', h, 'px"',
	                     ' src="', fillStyle.src_, '" />');
	       }
	    } else {
	      var a = processStyle(ctx.fillStyle);
	      var color = a.color;
	      var opacity = a.alpha * ctx.globalAlpha;
	      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
	                   '" />');
	    }
	  }

	  contextPrototype.fill = function() {
	    this.stroke(true);
	  };

	  contextPrototype.closePath = function() {
	    this.currentPath_.push({type: 'close'});
	  };

	  function getCoords(ctx, aX, aY) {
	    var m = ctx.m_;
	    return {
	      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
	      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
	    };
	  };

	  contextPrototype.save = function() {
	    var o = {};
	    copyState(this, o);
	    this.aStack_.push(o);
	    this.mStack_.push(this.m_);
	    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
	  };

	  contextPrototype.restore = function() {
	    if (this.aStack_.length) {
	      copyState(this.aStack_.pop(), this);
	      this.m_ = this.mStack_.pop();
	    }
	  };

	  function matrixIsFinite(m) {
	    return isFinite(m[0][0]) && isFinite(m[0][1]) &&
	        isFinite(m[1][0]) && isFinite(m[1][1]) &&
	        isFinite(m[2][0]) && isFinite(m[2][1]);
	  }

	  function setM(ctx, m, updateLineScale) {
	    if (!matrixIsFinite(m)) {
	      return;
	    }
	    ctx.m_ = m;

	    ctx.scaleX_ = Math.sqrt(m[0][0] * m[0][0] + m[0][1] * m[0][1]);
	    ctx.scaleY_ = Math.sqrt(m[1][0] * m[1][0] + m[1][1] * m[1][1]);

	    if (updateLineScale) {
	      // Get the line scale.
	      // Determinant of this.m_ means how much the area is enlarged by the
	      // transformation. So its square root can be used as a scale factor
	      // for width.
	      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
	      ctx.lineScale_ = sqrt(abs(det));
	    }
	  }

	  contextPrototype.translate = function(aX, aY) {
	    var m1 = [
	      [1,  0,  0],
	      [0,  1,  0],
	      [aX, aY, 1]
	    ];

	    setM(this, matrixMultiply(m1, this.m_), false);
	  };

	  contextPrototype.rotate = function(aRot) {
	    var c = mc(aRot);
	    var s = ms(aRot);

	    var m1 = [
	      [c,  s, 0],
	      [-s, c, 0],
	      [0,  0, 1]
	    ];

	    setM(this, matrixMultiply(m1, this.m_), false);
	  };

	  contextPrototype.scale = function(aX, aY) {
	    var m1 = [
	      [aX, 0,  0],
	      [0,  aY, 0],
	      [0,  0,  1]
	    ];

	    setM(this, matrixMultiply(m1, this.m_), true);
	  };

	  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
	    var m1 = [
	      [m11, m12, 0],
	      [m21, m22, 0],
	      [dx,  dy,  1]
	    ];

	    setM(this, matrixMultiply(m1, this.m_), true);

	  };

	  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
	    var m = [
	      [m11, m12, 0],
	      [m21, m22, 0],
	      [dx,  dy,  1]
	    ];

	    setM(this, m, true);
	  };

	  /**
	   * The text drawing function.
	   * The maxWidth argument isn't taken in account, since no browser supports
	   * it yet.
	   */
	  contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
	    var m = this.m_,
	        delta = 1000,
	        left = 0,
	        right = delta,
	        offset = {x: 0, y: 0},
	        lineStr = [];

	    var fontStyle = getComputedStyle(processFontStyle(this.font),
	                                     this.element_);

	    var fontStyleString = buildStyle(fontStyle);

	    var elementStyle = this.element_.currentStyle;
	    var textAlign = this.textAlign.toLowerCase();
	    switch (textAlign) {
	      case 'left':
	      case 'center':
	      case 'right':
	        break;
	      case 'end':
	        textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
	        break;
	      case 'start':
	        textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
	        break;
	      default:
	        textAlign = 'left';
	    }

	    // 1.75 is an arbitrary number, as there is no info about the text baseline
	    switch (this.textBaseline) {
	      case 'hanging':
	      case 'top':
	        offset.y = fontStyle.size / 1.75;
	        break;
	      case 'middle':
	        break;
	      default:
	      case null:
	      case 'alphabetic':
	      case 'ideographic':
	      case 'bottom':
	        offset.y = -fontStyle.size / 2.25;
	        break;
	    }

	    switch(textAlign) {
	      case 'right':
	        left = delta;
	        right = 0.05;
	        break;
	      case 'center':
	        left = right = delta / 2;
	        break;
	    }

	    var d = getCoords(this, x + offset.x, y + offset.y);

	    lineStr.push('<g_vml_:line from="', -left ,' 0" to="', right ,' 0.05" ',
	                 ' coordsize="100 100" coordorigin="0 0"',
	                 ' filled="', !stroke, '" stroked="', !!stroke,
	                 '" style="position:absolute;width:1px;height:1px;">');

	    if (stroke) {
	      appendStroke(this, lineStr);
	    } else {
	      // TODO: Fix the min and max params.
	      appendFill(this, lineStr, {x: -left, y: 0},
	                 {x: right, y: fontStyle.size});
	    }

	    var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' +
	                m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';

	    var skewOffset = mr(d.x / Z) + ',' + mr(d.y / Z);

	    lineStr.push('<g_vml_:skew on="t" matrix="', skewM ,'" ',
	                 ' offset="', skewOffset, '" origin="', left ,' 0" />',
	                 '<g_vml_:path textpathok="true" />',
	                 '<g_vml_:textpath on="true" string="',
	                 encodeHtmlAttribute(text),
	                 '" style="v-text-align:', textAlign,
	                 ';font:', encodeHtmlAttribute(fontStyleString),
	                 '" /></g_vml_:line>');

	    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
	  };

	  contextPrototype.fillText = function(text, x, y, maxWidth) {
	    this.drawText_(text, x, y, maxWidth, false);
	  };

	  contextPrototype.strokeText = function(text, x, y, maxWidth) {
	    this.drawText_(text, x, y, maxWidth, true);
	  };

	  contextPrototype.measureText = function(text) {
	    if (!this.textMeasureEl_) {
	      var s = '<span style="position:absolute;' +
	          'top:-20000px;left:0;padding:0;margin:0;border:none;' +
	          'white-space:pre;"></span>';
	      this.element_.insertAdjacentHTML('beforeEnd', s);
	      this.textMeasureEl_ = this.element_.lastChild;
	    }
	    var doc = this.element_.ownerDocument;
	    this.textMeasureEl_.innerHTML = '';
	    try {
	        this.textMeasureEl_.style.font = this.font;
	    } catch (ex) {
	        // Ignore failures to set to invalid font.
	    }
	    
	    // Don't use innerHTML or innerText because they allow markup/whitespace.
	    this.textMeasureEl_.appendChild(doc.createTextNode(text));
	    return {width: this.textMeasureEl_.offsetWidth};
	  };

	  /******** STUBS ********/
	  contextPrototype.clip = function() {
	    // TODO: Implement
	  };

	  contextPrototype.arcTo = function() {
	    // TODO: Implement
	  };

	  contextPrototype.createPattern = function(image, repetition) {
	    return new CanvasPattern_(image, repetition);
	  };

	  // Gradient / Pattern Stubs
	  function CanvasGradient_(aType) {
	    this.type_ = aType;
	    this.x0_ = 0;
	    this.y0_ = 0;
	    this.r0_ = 0;
	    this.x1_ = 0;
	    this.y1_ = 0;
	    this.r1_ = 0;
	    this.colors_ = [];
	  }

	  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
	    aColor = processStyle(aColor);
	    this.colors_.push({offset: aOffset,
	                       color: aColor.color,
	                       alpha: aColor.alpha});
	  };

	  function CanvasPattern_(image, repetition) {
	    assertImageIsValid(image);
	    switch (repetition) {
	      case 'repeat':
	      case null:
	      case '':
	        this.repetition_ = 'repeat';
	        break
	      case 'repeat-x':
	      case 'repeat-y':
	      case 'no-repeat':
	        this.repetition_ = repetition;
	        break;
	      default:
	        throwException('SYNTAX_ERR');
	    }

	    this.src_ = image.src;
	    this.width_ = image.width;
	    this.height_ = image.height;
	  }

	  function throwException(s) {
	    throw new DOMException_(s);
	  }

	  function assertImageIsValid(img) {
	    if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
	      throwException('TYPE_MISMATCH_ERR');
	    }
	    if (img.readyState != 'complete') {
	      throwException('INVALID_STATE_ERR');
	    }
	  }

	  function DOMException_(s) {
	    this.code = this[s];
	    this.message = s +': DOM Exception ' + this.code;
	  }
	  var p = DOMException_.prototype = new Error;
	  p.INDEX_SIZE_ERR = 1;
	  p.DOMSTRING_SIZE_ERR = 2;
	  p.HIERARCHY_REQUEST_ERR = 3;
	  p.WRONG_DOCUMENT_ERR = 4;
	  p.INVALID_CHARACTER_ERR = 5;
	  p.NO_DATA_ALLOWED_ERR = 6;
	  p.NO_MODIFICATION_ALLOWED_ERR = 7;
	  p.NOT_FOUND_ERR = 8;
	  p.NOT_SUPPORTED_ERR = 9;
	  p.INUSE_ATTRIBUTE_ERR = 10;
	  p.INVALID_STATE_ERR = 11;
	  p.SYNTAX_ERR = 12;
	  p.INVALID_MODIFICATION_ERR = 13;
	  p.NAMESPACE_ERR = 14;
	  p.INVALID_ACCESS_ERR = 15;
	  p.VALIDATION_ERR = 16;
	  p.TYPE_MISMATCH_ERR = 17;

	  // set up externs
	  G_vmlCanvasManager = G_vmlCanvasManager_;
	  CanvasRenderingContext2D = CanvasRenderingContext2D_;
	  CanvasGradient = CanvasGradient_;
	  CanvasPattern = CanvasPattern_;
	  DOMException = DOMException_;
	})();

	} // if
	else { // make the canvas test simple by kener.linfeng@gmail.com
	    G_vmlCanvasManager = false;
	}
	return G_vmlCanvasManager;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); // define


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 提供变换扩展
	 * @module zrender/mixin/Transformable
	 * @author pissang (https://www.github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    'use strict';

	    var matrix = __webpack_require__(8);
	    var vector = __webpack_require__(9);
	    var origin = [0, 0];

	    var mTranslate = matrix.translate;

	    var EPSILON = 5e-5;

	    function isAroundZero(val) {
	        return val > -EPSILON && val < EPSILON;
	    }
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }

	    /**
	     * @alias module:zrender/mixin/Transformable
	     * @constructor
	     */
	    var Transformable = function () {

	        if (!this.position) {
	            /**
	             * 平移
	             * @type {Array.<number>}
	             * @default [0, 0]
	             */
	            this.position = [ 0, 0 ];
	        }
	        if (typeof(this.rotation) == 'undefined') {
	            /**
	             * 旋转，可以通过数组二三项指定旋转的原点
	             * @type {Array.<number>}
	             * @default [0, 0, 0]
	             */
	            this.rotation = [ 0, 0, 0 ];
	        }
	        if (!this.scale) {
	            /**
	             * 缩放，可以通过数组三四项指定缩放的原点
	             * @type {Array.<number>}
	             * @default [1, 1, 0, 0]
	             */
	            this.scale = [ 1, 1, 0, 0 ];
	        }

	        this.needLocalTransform = false;

	        /**
	         * 是否有坐标变换
	         * @type {boolean}
	         * @readOnly
	         */
	        this.needTransform = false;
	    };

	    Transformable.prototype = {
	        
	        constructor: Transformable,

	        updateNeedTransform: function () {
	            this.needLocalTransform = isNotAroundZero(this.rotation[0])
	                || isNotAroundZero(this.position[0])
	                || isNotAroundZero(this.position[1])
	                || isNotAroundZero(this.scale[0] - 1)
	                || isNotAroundZero(this.scale[1] - 1);
	        },

	        /**
	         * 判断是否需要有坐标变换，更新needTransform属性。
	         * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
	         */
	        updateTransform: function () {
	            
	            this.updateNeedTransform();

	            var parentHasTransform = this.parent && this.parent.needTransform;
	            this.needTransform = this.needLocalTransform || parentHasTransform;
	            
	            if (!this.needTransform) {
	                return;
	            }

	            var m = this.transform || matrix.create();
	            matrix.identity(m);

	            if (this.needLocalTransform) {
	                var scale = this.scale;
	                if (
	                    isNotAroundZero(scale[0])
	                 || isNotAroundZero(scale[1])
	                ) {
	                    origin[0] = -scale[2] || 0;
	                    origin[1] = -scale[3] || 0;
	                    var haveOrigin = isNotAroundZero(origin[0])
	                                  || isNotAroundZero(origin[1]);
	                    if (haveOrigin) {
	                        mTranslate(m, m, origin);
	                    }
	                    matrix.scale(m, m, scale);
	                    if (haveOrigin) {
	                        origin[0] = -origin[0];
	                        origin[1] = -origin[1];
	                        mTranslate(m, m, origin);
	                    }
	                }

	                if (this.rotation instanceof Array) {
	                    if (this.rotation[0] !== 0) {
	                        origin[0] = -this.rotation[1] || 0;
	                        origin[1] = -this.rotation[2] || 0;
	                        var haveOrigin = isNotAroundZero(origin[0])
	                                      || isNotAroundZero(origin[1]);
	                        if (haveOrigin) {
	                            mTranslate(m, m, origin);
	                        }
	                        matrix.rotate(m, m, this.rotation[0]);
	                        if (haveOrigin) {
	                            origin[0] = -origin[0];
	                            origin[1] = -origin[1];
	                            mTranslate(m, m, origin);
	                        }
	                    }
	                }
	                else {
	                    if (this.rotation !== 0) {
	                        matrix.rotate(m, m, this.rotation);
	                    }
	                }

	                if (
	                    isNotAroundZero(this.position[0]) || isNotAroundZero(this.position[1])
	                ) {
	                    mTranslate(m, m, this.position);
	                }
	            }

	            // 应用父节点变换
	            if (parentHasTransform) {
	                if (this.needLocalTransform) {
	                    matrix.mul(m, this.parent.transform, m);
	                }
	                else {
	                    matrix.copy(m, this.parent.transform);
	                }
	            }
	            // 保存这个变换矩阵
	            this.transform = m;

	            this.invTransform = this.invTransform || matrix.create();
	            matrix.invert(this.invTransform, m);
	        },
	        /**
	         * 将自己的transform应用到context上
	         * @param {Context2D} ctx
	         */
	        setTransform: function (ctx) {
	            if (this.needTransform) {
	                var m = this.transform;
	                ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
	            }
	        },
	        /**
	         * 设置图形的朝向
	         * @param  {Array.<number>|Float32Array} target
	         * @method
	         */
	        lookAt: (function () {
	            var v = vector.create();
	            return function(target) {
	                if (!this.transform) {
	                    this.transform = matrix.create();
	                }
	                var m = this.transform;
	                vector.sub(v, target, this.position);
	                if (isAroundZero(v[0]) && isAroundZero(v[1])) {
	                    return;
	                }
	                vector.normalize(v, v);
	                var scale = this.scale;
	                // Y Axis
	                // TODO Scale origin ?
	                m[2] = v[0] * scale[1];
	                m[3] = v[1] * scale[1];
	                // X Axis
	                m[0] = v[1] * scale[0];
	                m[1] = -v[0] * scale[0];
	                // Position
	                m[4] = this.position[0];
	                m[5] = this.position[1];

	                this.decomposeTransform();
	            };
	        })(),
	        /**
	         * 分解`transform`矩阵到`position`, `rotation`, `scale`
	         */
	        decomposeTransform: function () {
	            if (!this.transform) {
	                return;
	            }
	            var m = this.transform;
	            var sx = m[0] * m[0] + m[1] * m[1];
	            var position = this.position;
	            var scale = this.scale;
	            var rotation = this.rotation;
	            if (isNotAroundZero(sx - 1)) {
	                sx = Math.sqrt(sx);
	            }
	            var sy = m[2] * m[2] + m[3] * m[3];
	            if (isNotAroundZero(sy - 1)) {
	                sy = Math.sqrt(sy);
	            }
	            position[0] = m[4];
	            position[1] = m[5];
	            scale[0] = sx;
	            scale[1] = sy;
	            scale[2] = scale[3] = 0;
	            rotation[0] = Math.atan2(-m[1] / sy, m[0] / sx);
	            rotation[1] = rotation[2] = 0;
	        },

	        /**
	         * 变换坐标位置到 shape 的局部坐标空间
	         * @method
	         * @param {number} x
	         * @param {number} y
	         * @return {Array.<number>}
	         */
	        transformCoordToLocal: function (x, y) {
	            var v2 = [x, y];
	            if (this.needTransform && this.invTransform) {
	                vector.applyTransform(v2, v2, this.invTransform);
	            }
	            return v2;
	        }
	    };

	    return Transformable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {

	        var ArrayCtor = typeof Float32Array === 'undefined'
	            ? Array
	            : Float32Array;
	        /**
	         * 3x2矩阵操作类
	         * @exports zrender/tool/matrix
	         */
	        var matrix = {
	            /**
	             * 创建一个单位矩阵
	             * @return {Float32Array|Array.<number>}
	             */
	            create : function() {
	                var out = new ArrayCtor(6);
	                matrix.identity(out);
	                
	                return out;
	            },
	            /**
	             * 设置矩阵为单位矩阵
	             * @param {Float32Array|Array.<number>} out
	             */
	            identity : function(out) {
	                out[0] = 1;
	                out[1] = 0;
	                out[2] = 0;
	                out[3] = 1;
	                out[4] = 0;
	                out[5] = 0;
	                return out;
	            },
	            /**
	             * 复制矩阵
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} m
	             */
	            copy: function(out, m) {
	                out[0] = m[0];
	                out[1] = m[1];
	                out[2] = m[2];
	                out[3] = m[3];
	                out[4] = m[4];
	                out[5] = m[5];
	                return out;
	            },
	            /**
	             * 矩阵相乘
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} m1
	             * @param {Float32Array|Array.<number>} m2
	             */
	            mul : function (out, m1, m2) {
	                out[0] = m1[0] * m2[0] + m1[2] * m2[1];
	                out[1] = m1[1] * m2[0] + m1[3] * m2[1];
	                out[2] = m1[0] * m2[2] + m1[2] * m2[3];
	                out[3] = m1[1] * m2[2] + m1[3] * m2[3];
	                out[4] = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
	                out[5] = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
	                return out;
	            },
	            /**
	             * 平移变换
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} a
	             * @param {Float32Array|Array.<number>} v
	             */
	            translate : function(out, a, v) {
	                out[0] = a[0];
	                out[1] = a[1];
	                out[2] = a[2];
	                out[3] = a[3];
	                out[4] = a[4] + v[0];
	                out[5] = a[5] + v[1];
	                return out;
	            },
	            /**
	             * 旋转变换
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} a
	             * @param {number} rad
	             */
	            rotate : function(out, a, rad) {
	                var aa = a[0];
	                var ac = a[2];
	                var atx = a[4];
	                var ab = a[1];
	                var ad = a[3];
	                var aty = a[5];
	                var st = Math.sin(rad);
	                var ct = Math.cos(rad);

	                out[0] = aa * ct + ab * st;
	                out[1] = -aa * st + ab * ct;
	                out[2] = ac * ct + ad * st;
	                out[3] = -ac * st + ct * ad;
	                out[4] = ct * atx + st * aty;
	                out[5] = ct * aty - st * atx;
	                return out;
	            },
	            /**
	             * 缩放变换
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} a
	             * @param {Float32Array|Array.<number>} v
	             */
	            scale : function(out, a, v) {
	                var vx = v[0];
	                var vy = v[1];
	                out[0] = a[0] * vx;
	                out[1] = a[1] * vy;
	                out[2] = a[2] * vx;
	                out[3] = a[3] * vy;
	                out[4] = a[4] * vx;
	                out[5] = a[5] * vy;
	                return out;
	            },
	            /**
	             * 求逆矩阵
	             * @param {Float32Array|Array.<number>} out
	             * @param {Float32Array|Array.<number>} a
	             */
	            invert : function(out, a) {
	            
	                var aa = a[0];
	                var ac = a[2];
	                var atx = a[4];
	                var ab = a[1];
	                var ad = a[3];
	                var aty = a[5];

	                var det = aa * ad - ab * ac;
	                if (!det) {
	                    return null;
	                }
	                det = 1.0 / det;

	                out[0] = ad * det;
	                out[1] = -ab * det;
	                out[2] = -ac * det;
	                out[3] = aa * det;
	                out[4] = (ac * aty - ad * atx) * det;
	                out[5] = (ab * atx - aa * aty) * det;
	                return out;
	            }
	        };

	        return matrix;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        var ArrayCtor = typeof Float32Array === 'undefined'
	            ? Array
	            : Float32Array;

	        /**
	         * @typedef {Float32Array|Array.<number>} Vector2
	         */
	        /**
	         * 二维向量类
	         * @exports zrender/tool/vector
	         */
	        var vector = {
	            /**
	             * 创建一个向量
	             * @param {number} [x=0]
	             * @param {number} [y=0]
	             * @return {Vector2}
	             */
	            create: function (x, y) {
	                var out = new ArrayCtor(2);
	                out[0] = x || 0;
	                out[1] = y || 0;
	                return out;
	            },

	            /**
	             * 复制向量数据
	             * @param {Vector2} out
	             * @param {Vector2} v
	             * @return {Vector2}
	             */
	            copy: function (out, v) {
	                out[0] = v[0];
	                out[1] = v[1];
	                return out;
	            },

	            /**
	             * 克隆一个向量
	             * @param {Vector2} v
	             * @return {Vector2}
	             */
	            clone: function (v) {
	                var out = new ArrayCtor(2);
	                out[0] = v[0];
	                out[1] = v[1];
	                return out;
	            },

	            /**
	             * 设置向量的两个项
	             * @param {Vector2} out
	             * @param {number} a
	             * @param {number} b
	             * @return {Vector2} 结果
	             */
	            set: function (out, a, b) {
	                out[0] = a;
	                out[1] = b;
	                return out;
	            },

	            /**
	             * 向量相加
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             */
	            add: function (out, v1, v2) {
	                out[0] = v1[0] + v2[0];
	                out[1] = v1[1] + v2[1];
	                return out;
	            },

	            /**
	             * 向量缩放后相加
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             * @param {number} a
	             */
	            scaleAndAdd: function (out, v1, v2, a) {
	                out[0] = v1[0] + v2[0] * a;
	                out[1] = v1[1] + v2[1] * a;
	                return out;
	            },

	            /**
	             * 向量相减
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             */
	            sub: function (out, v1, v2) {
	                out[0] = v1[0] - v2[0];
	                out[1] = v1[1] - v2[1];
	                return out;
	            },

	            /**
	             * 向量长度
	             * @param {Vector2} v
	             * @return {number}
	             */
	            len: function (v) {
	                return Math.sqrt(this.lenSquare(v));
	            },

	            /**
	             * 向量长度平方
	             * @param {Vector2} v
	             * @return {number}
	             */
	            lenSquare: function (v) {
	                return v[0] * v[0] + v[1] * v[1];
	            },

	            /**
	             * 向量乘法
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             */
	            mul: function (out, v1, v2) {
	                out[0] = v1[0] * v2[0];
	                out[1] = v1[1] * v2[1];
	                return out;
	            },

	            /**
	             * 向量除法
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             */
	            div: function (out, v1, v2) {
	                out[0] = v1[0] / v2[0];
	                out[1] = v1[1] / v2[1];
	                return out;
	            },

	            /**
	             * 向量点乘
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             * @return {number}
	             */
	            dot: function (v1, v2) {
	                return v1[0] * v2[0] + v1[1] * v2[1];
	            },

	            /**
	             * 向量缩放
	             * @param {Vector2} out
	             * @param {Vector2} v
	             * @param {number} s
	             */
	            scale: function (out, v, s) {
	                out[0] = v[0] * s;
	                out[1] = v[1] * s;
	                return out;
	            },

	            /**
	             * 向量归一化
	             * @param {Vector2} out
	             * @param {Vector2} v
	             */
	            normalize: function (out, v) {
	                var d = vector.len(v);
	                if (d === 0) {
	                    out[0] = 0;
	                    out[1] = 0;
	                }
	                else {
	                    out[0] = v[0] / d;
	                    out[1] = v[1] / d;
	                }
	                return out;
	            },

	            /**
	             * 计算向量间距离
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             * @return {number}
	             */
	            distance: function (v1, v2) {
	                return Math.sqrt(
	                    (v1[0] - v2[0]) * (v1[0] - v2[0])
	                    + (v1[1] - v2[1]) * (v1[1] - v2[1])
	                );
	            },

	            /**
	             * 向量距离平方
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             * @return {number}
	             */
	            distanceSquare: function (v1, v2) {
	                return (v1[0] - v2[0]) * (v1[0] - v2[0])
	                    + (v1[1] - v2[1]) * (v1[1] - v2[1]);
	            },

	            /**
	             * 求负向量
	             * @param {Vector2} out
	             * @param {Vector2} v
	             */
	            negate: function (out, v) {
	                out[0] = -v[0];
	                out[1] = -v[1];
	                return out;
	            },

	            /**
	             * 插值两个点
	             * @param {Vector2} out
	             * @param {Vector2} v1
	             * @param {Vector2} v2
	             * @param {number} t
	             */
	            lerp: function (out, v1, v2, t) {
	                // var ax = v1[0];
	                // var ay = v1[1];
	                out[0] = v1[0] + t * (v2[0] - v1[0]);
	                out[1] = v1[1] + t * (v2[1] - v1[1]);
	                return out;
	            },
	            
	            /**
	             * 矩阵左乘向量
	             * @param {Vector2} out
	             * @param {Vector2} v
	             * @param {Vector2} m
	             */
	            applyTransform: function (out, v, m) {
	                var x = v[0];
	                var y = v[1];
	                out[0] = m[0] * x + m[2] * y + m[4];
	                out[1] = m[1] * x + m[3] * y + m[5];
	                return out;
	            },
	            /**
	             * 求两个向量最小值
	             * @param  {Vector2} out
	             * @param  {Vector2} v1
	             * @param  {Vector2} v2
	             */
	            min: function (out, v1, v2) {
	                out[0] = Math.min(v1[0], v2[0]);
	                out[1] = Math.min(v1[1], v2[1]);
	                return out;
	            },
	            /**
	             * 求两个向量最大值
	             * @param  {Vector2} out
	             * @param  {Vector2} v1
	             * @param  {Vector2} v2
	             */
	            max: function (out, v1, v2) {
	                out[0] = Math.max(v1[0], v2[0]);
	                out[1] = Math.max(v1[1], v2[1]);
	                return out;
	            }
	        };

	        vector.length = vector.len;
	        vector.lengthSquare = vector.lenSquare;
	        vector.dist = vector.distance;
	        vector.distSquare = vector.distanceSquare;
	        
	        return vector;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 事件扩展
	 * @module zrender/mixin/Eventful
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    /**
	     * 事件分发器
	     * @alias module:zrender/mixin/Eventful
	     * @constructor
	     */
	    var Eventful = function () {
	        this._handlers = {};
	    };
	    /**
	     * 单次触发绑定，dispatch后销毁
	     * 
	     * @param {string} event 事件名
	     * @param {Function} handler 响应函数
	     * @param {Object} context
	     */
	    Eventful.prototype.one = function (event, handler, context) {
	        var _h = this._handlers;

	        if (!handler || !event) {
	            return this;
	        }

	        if (!_h[event]) {
	            _h[event] = [];
	        }

	        _h[event].push({
	            h : handler,
	            one : true,
	            ctx: context || this
	        });

	        return this;
	    };

	    /**
	     * 绑定事件
	     * @param {string} event 事件名
	     * @param {Function} handler 事件处理函数
	     * @param {Object} [context]
	     */
	    Eventful.prototype.bind = function (event, handler, context) {
	        var _h = this._handlers;

	        if (!handler || !event) {
	            return this;
	        }

	        if (!_h[event]) {
	            _h[event] = [];
	        }

	        _h[event].push({
	            h : handler,
	            one : false,
	            ctx: context || this
	        });

	        return this;
	    };

	    /**
	     * 解绑事件
	     * @param {string} event 事件名
	     * @param {Function} [handler] 事件处理函数
	     */
	    Eventful.prototype.unbind = function (event, handler) {
	        var _h = this._handlers;

	        if (!event) {
	            this._handlers = {};
	            return this;
	        }

	        if (handler) {
	            if (_h[event]) {
	                var newList = [];
	                for (var i = 0, l = _h[event].length; i < l; i++) {
	                    if (_h[event][i]['h'] != handler) {
	                        newList.push(_h[event][i]);
	                    }
	                }
	                _h[event] = newList;
	            }

	            if (_h[event] && _h[event].length === 0) {
	                delete _h[event];
	            }
	        }
	        else {
	            delete _h[event];
	        }

	        return this;
	    };

	    /**
	     * 事件分发
	     * 
	     * @param {string} type 事件类型
	     */
	    Eventful.prototype.dispatch = function (type) {
	        if (this._handlers[type]) {
	            var args = arguments;
	            var argLen = args.length;

	            if (argLen > 3) {
	                args = Array.prototype.slice.call(args, 1);
	            }
	            
	            var _h = this._handlers[type];
	            var len = _h.length;
	            for (var i = 0; i < len;) {
	                // Optimize advise from backbone
	                switch (argLen) {
	                    case 1:
	                        _h[i]['h'].call(_h[i]['ctx']);
	                        break;
	                    case 2:
	                        _h[i]['h'].call(_h[i]['ctx'], args[1]);
	                        break;
	                    case 3:
	                        _h[i]['h'].call(_h[i]['ctx'], args[1], args[2]);
	                        break;
	                    default:
	                        // have more than 2 given arguments
	                        _h[i]['h'].apply(_h[i]['ctx'], args);
	                        break;
	                }
	                
	                if (_h[i]['one']) {
	                    _h.splice(i, 1);
	                    len--;
	                }
	                else {
	                    i++;
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * 带有context的事件分发, 最后一个参数是事件回调的context
	     * @param {string} type 事件类型
	     */
	    Eventful.prototype.dispatchWithContext = function (type) {
	        if (this._handlers[type]) {
	            var args = arguments;
	            var argLen = args.length;

	            if (argLen > 4) {
	                args = Array.prototype.slice.call(args, 1, args.length - 1);
	            }
	            var ctx = args[args.length - 1];

	            var _h = this._handlers[type];
	            var len = _h.length;
	            for (var i = 0; i < len;) {
	                // Optimize advise from backbone
	                switch (argLen) {
	                    case 1:
	                        _h[i]['h'].call(ctx);
	                        break;
	                    case 2:
	                        _h[i]['h'].call(ctx, args[1]);
	                        break;
	                    case 3:
	                        _h[i]['h'].call(ctx, args[1], args[2]);
	                        break;
	                    default:
	                        // have more than 2 given arguments
	                        _h[i]['h'].apply(ctx, args);
	                        break;
	                }
	                
	                if (_h[i]['one']) {
	                    _h.splice(i, 1);
	                    len--;
	                }
	                else {
	                    i++;
	                }
	            }
	        }

	        return this;
	    };

	    // 对象可以通过 onxxxx 绑定事件
	    /**
	     * @event module:zrender/mixin/Eventful#onclick
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseout
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousemove
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousewheel
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmousedown
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#onmouseup
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragstart
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragend
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragenter
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragleave
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondragover
	     * @type {Function}
	     * @default null
	     */
	    /**
	     * @event module:zrender/mixin/Eventful#ondrop
	     * @type {Function}
	     * @default null
	     */
	    
	    return Eventful;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 直线
	 * @module zrender/shape/Line
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @example
	 *   var Line = require('zrender/shape/Line');
	 *   var shape = new Line({
	 *       style: {
	 *           xStart: 0,
	 *           yStart: 0,
	 *           xEnd: 100,
	 *           yEnd: 100,
	 *           strokeColor: '#000',
	 *           lineWidth: 10
	 *       }
	 *   });
	 *   zr.addShape(line);
	 */
	/**
	 * @typedef {Object} ILineStyle
	 * @property {number} xStart 起点x坐标
	 * @property {number} yStart 起点y坐标
	 * @property {number} xEnd 终止点x坐标
	 * @property {number} yEnd 终止点y坐标
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var Base = __webpack_require__(12);
	        var dashedLineTo = __webpack_require__(18);
	        
	        /**
	         * @alias module:zrender/shape/Line
	         * @param {Object} options
	         * @constructor
	         * @extends module:zrender/shape/Base
	         */
	        var Line = function (options) {
	            this.brushTypeOnly = 'stroke';  // 线条只能描边，填充后果自负
	            this.textPosition = 'end';
	            Base.call(this, options);

	            /**
	             * 直线绘制样式
	             * @name module:zrender/shape/Line#style
	             * @type {module:zrender/shape/Line~ILineStyle}
	             */
	            /**
	             * 直线高亮绘制样式
	             * @name module:zrender/shape/Line#highlightStyle
	             * @type {module:zrender/shape/Line~ILineStyle}
	             */
	        };

	        Line.prototype =  {
	            type: 'line',

	            /**
	             * 创建线条路径
	             * @param {CanvasRenderingContext2D} ctx
	             * @param {module:zrender/shape/Line~ILineStyle} style
	             */
	            buildPath : function (ctx, style) {
	                if (!style.lineType || style.lineType == 'solid') {
	                    // 默认为实线
	                    ctx.moveTo(style.xStart, style.yStart);
	                    ctx.lineTo(style.xEnd, style.yEnd);
	                }
	                else if (style.lineType == 'dashed'
	                        || style.lineType == 'dotted'
	                ) {
	                    var dashLength = (style.lineWidth || 1)  
	                                     * (style.lineType == 'dashed' ? 3 : 1);
	                    dashedLineTo(
	                        ctx,
	                        style.xStart, style.yStart,
	                        style.xEnd, style.yEnd,
	                        dashLength
	                    );
	                }
	            },

	            /**
	             * 计算返回线条的包围盒矩形
	             * @param {module:zrender/shape/Line~ILineStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect : function (style) {
	                if (style.__rect) {
	                    return style.__rect;
	                }
	                
	                var lineWidth = style.lineWidth || 1;
	                style.__rect = {
	                    x : Math.min(style.xStart, style.xEnd) - lineWidth,
	                    y : Math.min(style.yStart, style.yEnd) - lineWidth,
	                    width : Math.abs(style.xStart - style.xEnd)
	                            + lineWidth,
	                    height : Math.abs(style.yStart - style.yEnd)
	                             + lineWidth
	                };
	                
	                return style.__rect;
	            }
	        };

	        __webpack_require__(5).inherits(Line, Base);
	        return Line;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * shape基类
	 * @module zrender/shape/Base
	 * @author  Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *          errorrik (errorrik@gmail.com)
	 */

	/**
	 * @typedef {Object} IBaseShapeStyle
	 * @property {string} [brushType='fill']
	 * @property {string} [color='#000000'] 填充颜色
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */

	/**
	 * @typedef {Object} module:zrender/shape/Base~IBoundingRect
	 * @property {number} x 左上角顶点x轴坐标 
	 * @property {number} y 左上角顶点y轴坐标
	 * @property {number} width 包围盒矩形宽度
	 * @property {number} height 包围盒矩形高度
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	        var vmlCanvasManager = window['G_vmlCanvasManager'];

	        var matrix = __webpack_require__(8);
	        var guid = __webpack_require__(4);
	        var util = __webpack_require__(5);
	        var log = __webpack_require__(13);

	        var Transformable = __webpack_require__(7);
	        var Eventful = __webpack_require__(10);

	        function _fillText(ctx, text, x, y, textFont, textAlign, textBaseline) {
	            if (textFont) {
	                ctx.font = textFont;
	            }
	            ctx.textAlign = textAlign;
	            ctx.textBaseline = textBaseline;
	            var rect = _getTextRect(
	                text, x, y, textFont, textAlign, textBaseline
	            );
	            
	            text = (text + '').split('\n');
	            var lineHeight = __webpack_require__(15).getTextHeight('国', textFont);
	            
	            switch (textBaseline) {
	                case 'top':
	                    y = rect.y;
	                    break;
	                case 'bottom':
	                    y = rect.y + lineHeight;
	                    break;
	                default:
	                    y = rect.y + lineHeight / 2;
	            }
	            
	            for (var i = 0, l = text.length; i < l; i++) {
	                ctx.fillText(text[i], x, y);
	                y += lineHeight;
	            }
	        }

	        /**
	         * 返回矩形区域，用于局部刷新和文字定位
	         * @inner
	         * @param {string} text
	         * @param {number} x
	         * @param {number} y
	         * @param {string} textFont
	         * @param {string} textAlign
	         * @param {string} textBaseline
	         */
	        function _getTextRect(text, x, y, textFont, textAlign, textBaseline) {
	            var area = __webpack_require__(15);
	            var width = area.getTextWidth(text, textFont);
	            var lineHeight = area.getTextHeight('国', textFont);
	            
	            text = (text + '').split('\n');
	            
	            switch (textAlign) {
	                case 'end':
	                case 'right':
	                    x -= width;
	                    break;
	                case 'center':
	                    x -= (width / 2);
	                    break;
	            }

	            switch (textBaseline) {
	                case 'top':
	                    break;
	                case 'bottom':
	                    y -= lineHeight * text.length;
	                    break;
	                default:
	                    y -= lineHeight * text.length / 2;
	            }

	            return {
	                x : x,
	                y : y,
	                width : width,
	                height : lineHeight * text.length
	            };
	        }

	        /**
	         * @alias module:zrender/shape/Base
	         * @constructor
	         * @extends module:zrender/mixin/Transformable
	         * @extends module:zrender/mixin/Eventful
	         * @param {Object} options 关于shape的配置项，可以是shape的自有属性，也可以是自定义的属性。
	         */
	        var Base = function(options) {
	            
	            options = options || {};
	            
	            /**
	             * Shape id, 全局唯一
	             * @type {string}
	             */
	            this.id = options.id || guid();

	            for (var key in options) {
	                this[key] = options[key];
	            }

	            /**
	             * 基础绘制样式
	             * @type {module:zrender/shape/Base~IBaseShapeStyle}
	             */
	            this.style = this.style || {};

	            /**
	             * 高亮样式
	             * @type {module:zrender/shape/Base~IBaseShapeStyle}
	             */
	            this.highlightStyle = this.highlightStyle || null;

	            /**
	             * 父节点
	             * @readonly
	             * @type {module:zrender/Group}
	             * @default null
	             */
	            this.parent = null;

	            this.__dirty = true;

	            this.__clipShapes = [];

	            Transformable.call(this);
	            Eventful.call(this);
	        };
	        /**
	         * 图形是否可见，为true时不绘制图形，但是仍能触发鼠标事件
	         * @name module:zrender/shape/Base#invisible
	         * @type {boolean}
	         * @default false
	         */
	        Base.prototype.invisible = false;

	        /**
	         * 图形是否忽略，为true时忽略图形的绘制以及事件触发
	         * @name module:zrender/shape/Base#ignore
	         * @type {boolean}
	         * @default false
	         */
	        Base.prototype.ignore = false;

	        /**
	         * z层level，决定绘画在哪层canvas中
	         * @name module:zrender/shape/Base#zlevel
	         * @type {number}
	         * @default 0
	         */
	        Base.prototype.zlevel = 0;

	        /**
	         * 是否可拖拽
	         * @name module:zrender/shape/Base#draggable
	         * @type {boolean}
	         * @default false
	         */
	        Base.prototype.draggable = false;

	        /**
	         * 是否可点击
	         * @name module:zrender/shape/Base#clickable
	         * @type {boolean}
	         * @default false
	         */
	        Base.prototype.clickable = false;

	        /**
	         * 是否可以hover
	         * @name module:zrender/shape/Base#hoverable
	         * @type {boolean}
	         * @default true
	         */
	        Base.prototype.hoverable = true;
	        
	        /**
	         * z值，跟zlevel一样影响shape绘制的前后顺序，z值大的shape会覆盖在z值小的上面，
	         * 但是并不会创建新的canvas，所以优先级低于zlevel，而且频繁改动的开销比zlevel小很多。
	         * 
	         * @name module:zrender/shape/Base#z
	         * @type {number}
	         * @default 0
	         */
	        Base.prototype.z = 0;

	        /**
	         * 绘制图形
	         * 
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {boolean} [isHighlight=false] 是否使用高亮属性
	         * @param {Function} [updateCallback]
	         *        需要异步加载资源的shape可以通过这个callback(e), 
	         *        让painter更新视图，base.brush没用，需要的话重载brush
	         */
	        Base.prototype.brush = function (ctx, isHighlight) {

	            var style = this.beforeBrush(ctx, isHighlight);

	            ctx.beginPath();
	            this.buildPath(ctx, style);

	            switch (style.brushType) {
	                /* jshint ignore:start */
	                case 'both':
	                    ctx.fill();
	                case 'stroke':
	                    style.lineWidth > 0 && ctx.stroke();
	                    break;
	                /* jshint ignore:end */
	                default:
	                    ctx.fill();
	            }
	            
	            this.drawText(ctx, style, this.style);

	            this.afterBrush(ctx);
	        };

	        /**
	         * 具体绘制操作前的一些公共操作
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {boolean} [isHighlight=false] 是否使用高亮属性
	         * @return {Object} 处理后的样式
	         */
	        Base.prototype.beforeBrush = function (ctx, isHighlight) {
	            var style = this.style;
	            
	            if (this.brushTypeOnly) {
	                style.brushType = this.brushTypeOnly;
	            }

	            if (isHighlight) {
	                // 根据style扩展默认高亮样式
	                style = this.getHighlightStyle(
	                    style,
	                    this.highlightStyle || {},
	                    this.brushTypeOnly
	                );
	            }

	            if (this.brushTypeOnly == 'stroke') {
	                style.strokeColor = style.strokeColor || style.color;
	            }

	            ctx.save();

	            this.doClip(ctx);

	            this.setContext(ctx, style);

	            // 设置transform
	            this.setTransform(ctx);

	            return style;
	        };

	        /**
	         * 绘制后的处理
	         * @param {CanvasRenderingContext2D} ctx
	         */
	        Base.prototype.afterBrush = function (ctx) {
	            ctx.restore();
	        };

	        var STYLE_CTX_MAP = [
	            [ 'color', 'fillStyle' ],
	            [ 'strokeColor', 'strokeStyle' ],
	            [ 'opacity', 'globalAlpha' ],
	            [ 'lineCap', 'lineCap' ],
	            [ 'lineJoin', 'lineJoin' ],
	            [ 'miterLimit', 'miterLimit' ],
	            [ 'lineWidth', 'lineWidth' ],
	            [ 'shadowBlur', 'shadowBlur' ],
	            [ 'shadowColor', 'shadowColor' ],
	            [ 'shadowOffsetX', 'shadowOffsetX' ],
	            [ 'shadowOffsetY', 'shadowOffsetY' ]
	        ];

	        /**
	         * 设置 fillStyle, strokeStyle, shadow 等通用绘制样式
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} style
	         */
	        Base.prototype.setContext = function (ctx, style) {
	            for (var i = 0, len = STYLE_CTX_MAP.length; i < len; i++) {
	                var styleProp = STYLE_CTX_MAP[i][0];
	                var styleValue = style[styleProp];
	                var ctxProp = STYLE_CTX_MAP[i][1];

	                if (typeof styleValue != 'undefined') {
	                    ctx[ctxProp] = styleValue;
	                }
	            }
	        };

	        var clipShapeInvTransform = matrix.create();
	        Base.prototype.doClip = function (ctx) {
	            if (this.__clipShapes && !vmlCanvasManager) {
	                for (var i = 0; i < this.__clipShapes.length; i++) {
	                    var clipShape = this.__clipShapes[i];
	                    if (clipShape.needTransform) {
	                        var m = clipShape.transform;
	                        matrix.invert(clipShapeInvTransform, m);
	                        ctx.transform(
	                            m[0], m[1],
	                            m[2], m[3],
	                            m[4], m[5]
	                        );
	                    }
	                    ctx.beginPath();
	                    clipShape.buildPath(ctx, clipShape.style);
	                    ctx.clip();
	                    // Transform back
	                    if (clipShape.needTransform) {
	                        var m = clipShapeInvTransform;
	                        ctx.transform(
	                            m[0], m[1],
	                            m[2], m[3],
	                            m[4], m[5]
	                        );
	                    }
	                }
	            }
	        };
	    
	        /**
	         * 根据默认样式扩展高亮样式
	         * 
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} style 默认样式
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} highlightStyle 高亮样式
	         * @param {string} brushTypeOnly
	         */
	        Base.prototype.getHighlightStyle = function (style, highlightStyle, brushTypeOnly) {
	            var newStyle = {};
	            for (var k in style) {
	                newStyle[k] = style[k];
	            }

	            var color = __webpack_require__(17);
	            var highlightColor = color.getHighlightColor();
	            // 根据highlightStyle扩展
	            if (style.brushType != 'stroke') {
	                // 带填充则用高亮色加粗边线
	                newStyle.strokeColor = highlightColor;
	                newStyle.lineWidth = (style.lineWidth || 1)
	                                      + this.getHighlightZoom();
	                newStyle.brushType = 'both';
	            }
	            else {
	                if (brushTypeOnly != 'stroke') {
	                    // 描边型的则用原色加工高亮
	                    newStyle.strokeColor = highlightColor;
	                    newStyle.lineWidth = (style.lineWidth || 1)
	                                          + this.getHighlightZoom();
	                } 
	                else {
	                    // 线型的则用原色加工高亮
	                    newStyle.strokeColor = highlightStyle.strokeColor
	                                           || color.mix(
	                                                 style.strokeColor,
	                                                 color.toRGB(highlightColor)
	                                              );
	                }
	            }

	            // 可自定义覆盖默认值
	            for (var k in highlightStyle) {
	                if (typeof highlightStyle[k] != 'undefined') {
	                    newStyle[k] = highlightStyle[k];
	                }
	            }

	            return newStyle;
	        };

	        // 高亮放大效果参数
	        // 当前统一设置为6，如有需要差异设置，通过this.type判断实例类型
	        Base.prototype.getHighlightZoom = function () {
	            return this.type != 'text' ? 6 : 2;
	        };

	        /**
	         * 移动位置
	         * @param {number} dx 横坐标变化
	         * @param {number} dy 纵坐标变化
	         */
	        Base.prototype.drift = function (dx, dy) {
	            this.position[0] += dx;
	            this.position[1] += dy;
	        };

	        /**
	         * 构建绘制的Path
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} style
	         */
	        Base.prototype.buildPath = function (ctx, style) {
	            log('buildPath not implemented in ' + this.type);
	        };

	        /**
	         * 计算返回包围盒矩形
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} style
	         * @return {module:zrender/shape/Base~IBoundingRect}
	         */
	        Base.prototype.getRect = function (style) {
	            log('getRect not implemented in ' + this.type);   
	        };
	        
	        /**
	         * 判断鼠标位置是否在图形内
	         * @param {number} x
	         * @param {number} y
	         * @return {boolean}
	         */
	        Base.prototype.isCover = function (x, y) {
	            var originPos = this.transformCoordToLocal(x, y);
	            x = originPos[0];
	            y = originPos[1];

	            // 快速预判并保留判断矩形
	            if (this.isCoverRect(x, y)) {
	                // 矩形内
	                return __webpack_require__(15).isInside(this, this.style, x, y);
	            }
	            
	            return false;
	        };

	        Base.prototype.isCoverRect = function (x, y) {
	            // 快速预判并保留判断矩形
	            var rect = this.style.__rect;
	            if (!rect) {
	                rect = this.style.__rect = this.getRect(this.style);
	            }
	            return x >= rect.x
	                && x <= (rect.x + rect.width)
	                && y >= rect.y
	                && y <= (rect.y + rect.height);
	        };

	        /**
	         * 绘制附加文本
	         * @param {CanvasRenderingContext2D} ctx
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} style 样式
	         * @param {module:zrender/shape/Base~IBaseShapeStyle} normalStyle 默认样式，用于定位文字显示
	         */
	        Base.prototype.drawText = function (ctx, style, normalStyle) {
	            if (typeof(style.text) == 'undefined' || style.text === false) {
	                return;
	            }
	            // 字体颜色策略
	            var textColor = style.textColor || style.color || style.strokeColor;
	            ctx.fillStyle = textColor;

	            // 文本与图形间空白间隙
	            var dd = 10;
	            var al;         // 文本水平对齐
	            var bl;         // 文本垂直对齐
	            var tx;         // 文本横坐标
	            var ty;         // 文本纵坐标

	            var textPosition = style.textPosition       // 用户定义
	                               || this.textPosition     // shape默认
	                               || 'top';                // 全局默认

	            switch (textPosition) {
	                case 'inside': 
	                case 'top': 
	                case 'bottom': 
	                case 'left': 
	                case 'right': 
	                    if (this.getRect) {
	                        var rect = (normalStyle || style).__rect
	                                   || this.getRect(normalStyle || style);

	                        switch (textPosition) {
	                            case 'inside':
	                                tx = rect.x + rect.width / 2;
	                                ty = rect.y + rect.height / 2;
	                                al = 'center';
	                                bl = 'middle';
	                                if (style.brushType != 'stroke'
	                                    && textColor == style.color
	                                ) {
	                                    ctx.fillStyle = '#fff';
	                                }
	                                break;
	                            case 'left':
	                                tx = rect.x - dd;
	                                ty = rect.y + rect.height / 2;
	                                al = 'end';
	                                bl = 'middle';
	                                break;
	                            case 'right':
	                                tx = rect.x + rect.width + dd;
	                                ty = rect.y + rect.height / 2;
	                                al = 'start';
	                                bl = 'middle';
	                                break;
	                            case 'top':
	                                tx = rect.x + rect.width / 2;
	                                ty = rect.y - dd;
	                                al = 'center';
	                                bl = 'bottom';
	                                break;
	                            case 'bottom':
	                                tx = rect.x + rect.width / 2;
	                                ty = rect.y + rect.height + dd;
	                                al = 'center';
	                                bl = 'top';
	                                break;
	                        }
	                    }
	                    break;
	                case 'start':
	                case 'end':
	                    var pointList = style.pointList
	                                    || [
	                                        [style.xStart || 0, style.yStart || 0],
	                                        [style.xEnd || 0, style.yEnd || 0]
	                                    ];
	                    var length = pointList.length;
	                    if (length < 2) {
	                        // 少于2个点就不画了~
	                        return;
	                    }
	                    var xStart;
	                    var xEnd;
	                    var yStart;
	                    var yEnd;
	                    switch (textPosition) {
	                        case 'start':
	                            xStart = pointList[1][0];
	                            xEnd = pointList[0][0];
	                            yStart = pointList[1][1];
	                            yEnd = pointList[0][1];
	                            break;
	                        case 'end':
	                            xStart = pointList[length - 2][0];
	                            xEnd = pointList[length - 1][0];
	                            yStart = pointList[length - 2][1];
	                            yEnd = pointList[length - 1][1];
	                            break;
	                    }
	                    tx = xEnd;
	                    ty = yEnd;
	                    
	                    var angle = Math.atan((yStart - yEnd) / (xEnd - xStart)) / Math.PI * 180;
	                    if ((xEnd - xStart) < 0) {
	                        angle += 180;
	                    }
	                    else if ((yStart - yEnd) < 0) {
	                        angle += 360;
	                    }
	                    
	                    dd = 5;
	                    if (angle >= 30 && angle <= 150) {
	                        al = 'center';
	                        bl = 'bottom';
	                        ty -= dd;
	                    }
	                    else if (angle > 150 && angle < 210) {
	                        al = 'right';
	                        bl = 'middle';
	                        tx -= dd;
	                    }
	                    else if (angle >= 210 && angle <= 330) {
	                        al = 'center';
	                        bl = 'top';
	                        ty += dd;
	                    }
	                    else {
	                        al = 'left';
	                        bl = 'middle';
	                        tx += dd;
	                    }
	                    break;
	                case 'specific':
	                    tx = style.textX || 0;
	                    ty = style.textY || 0;
	                    al = 'start';
	                    bl = 'middle';
	                    break;
	            }

	            if (tx != null && ty != null) {
	                _fillText(
	                    ctx,
	                    style.text, 
	                    tx, ty, 
	                    style.textFont,
	                    style.textAlign || al,
	                    style.textBaseline || bl
	                );
	            }
	        };

	        Base.prototype.modSelf = function() {
	            this.__dirty = true;
	            if (this.style) {
	                this.style.__rect = null;
	            }
	            if (this.highlightStyle) {
	                this.highlightStyle.__rect = null;
	            }
	        };

	        /**
	         * 图形是否会触发事件
	         * @return {boolean}
	         */
	        // TODO, 通过 bind 绑定的事件
	        Base.prototype.isSilent = function () {
	            return !(
	                this.hoverable || this.draggable || this.clickable
	                || this.onmousemove || this.onmouseover || this.onmouseout
	                || this.onmousedown || this.onmouseup || this.onclick
	                || this.ondragenter || this.ondragover || this.ondragleave
	                || this.ondrop
	            );
	        };

	        util.merge(Base.prototype, Transformable.prototype, true);
	        util.merge(Base.prototype, Eventful.prototype, true);

	        return Base;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var config = __webpack_require__(14);

	        /**
	         * @exports zrender/tool/log
	         * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	         */
	        return function() {
	            if (config.debugMode === 0) {
	                return;
	            }
	            else if (config.debugMode == 1) {
	                for (var k in arguments) {
	                    throw new Error(arguments[k]);
	                }
	            }
	            else if (config.debugMode > 1) {
	                for (var k in arguments) {
	                    console.log(arguments[k]);
	                }
	            }
	        };

	        /* for debug
	        return function(mes) {
	            document.getElementById('wrong-message').innerHTML =
	                mes + ' ' + (new Date() - 0)
	                + '<br/>' 
	                + document.getElementById('wrong-message').innerHTML;
	        };
	        */
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    /**
	     * config默认配置项
	     * @exports zrender/config
	     * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	     */
	    var config = {
	        /**
	         * @namespace module:zrender/config.EVENT
	         */
	        EVENT : {
	            /**
	             * 窗口大小变化
	             * @type {string}
	             */
	            RESIZE : 'resize',
	            /**
	             * 鼠标按钮被（手指）按下，事件对象是：目标图形元素或空
	             * @type {string}
	             */
	            CLICK : 'click',
	            /**
	             * 双击事件
	             * @type {string}
	             */
	            DBLCLICK : 'dblclick',
	            /**
	             * 鼠标滚轮变化，事件对象是：目标图形元素或空
	             * @type {string}
	             */
	            MOUSEWHEEL : 'mousewheel',
	            /**
	             * 鼠标（手指）被移动，事件对象是：目标图形元素或空
	             * @type {string}
	             */
	            MOUSEMOVE : 'mousemove',
	            /**
	             * 鼠标移到某图形元素之上，事件对象是：目标图形元素
	             * @type {string}
	             */
	            MOUSEOVER : 'mouseover',
	            /**
	             * 鼠标从某图形元素移开，事件对象是：目标图形元素
	             * @type {string}
	             */
	            MOUSEOUT : 'mouseout',
	            /**
	             * 鼠标按钮（手指）被按下，事件对象是：目标图形元素或空
	             * @type {string}
	             */
	            MOUSEDOWN : 'mousedown',
	            /**
	             * 鼠标按键（手指）被松开，事件对象是：目标图形元素或空
	             * @type {string}
	             */
	            MOUSEUP : 'mouseup',
	            /**
	             * 全局离开，MOUSEOUT触发比较频繁，一次离开优化绑定
	             * @type {string}
	             */
	            GLOBALOUT : 'globalout',    // 

	            // 一次成功元素拖拽的行为事件过程是：
	            // dragstart > dragenter > dragover [> dragleave] > drop > dragend
	            /**
	             * 开始拖拽时触发，事件对象是：被拖拽图形元素
	             * @type {string}
	             */
	            DRAGSTART : 'dragstart',
	            /**
	             * 拖拽完毕时触发（在drop之后触发），事件对象是：被拖拽图形元素
	             * @type {string}
	             */
	            DRAGEND : 'dragend',
	            /**
	             * 拖拽图形元素进入目标图形元素时触发，事件对象是：目标图形元素
	             * @type {string}
	             */
	            DRAGENTER : 'dragenter',
	            /**
	             * 拖拽图形元素在目标图形元素上移动时触发，事件对象是：目标图形元素
	             * @type {string}
	             */
	            DRAGOVER : 'dragover',
	            /**
	             * 拖拽图形元素离开目标图形元素时触发，事件对象是：目标图形元素
	             * @type {string}
	             */
	            DRAGLEAVE : 'dragleave',
	            /**
	             * 拖拽图形元素放在目标图形元素内时触发，事件对象是：目标图形元素
	             * @type {string}
	             */
	            DROP : 'drop',
	            /**
	             * touch end - start < delay is click
	             * @type {number}
	             */
	            touchClickDelay : 300
	        },

	        elementClassName: 'zr-element',

	        // 是否异常捕获
	        catchBrushException: false,

	        /**
	         * debug日志选项：catchBrushException为true下有效
	         * 0 : 不生成debug数据，发布用
	         * 1 : 异常抛出，调试用
	         * 2 : 控制台输出，调试用
	         */
	        debugMode: 0,

	        // retina 屏幕优化
	        devicePixelRatio: Math.max(window.devicePixelRatio || 1, 1)
	    };
	    return config;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * zrender: 图形空间辅助类
	 *
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 *
	 * isInside：是否在区域内部
	 * isOutside：是否在区域外部
	 * getTextWidth：测算单行文本宽度
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	        'use strict';

	        var util = __webpack_require__(5);
	        var curve = __webpack_require__(16);

	        var _ctx;
	        
	        var _textWidthCache = {};
	        var _textHeightCache = {};
	        var _textWidthCacheCounter = 0;
	        var _textHeightCacheCounter = 0;
	        var TEXT_CACHE_MAX = 5000;
	            
	        var PI2 = Math.PI * 2;

	        function normalizeRadian(angle) {
	            angle %= PI2;
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return angle;
	        }
	        /**
	         * 包含判断
	         *
	         * @param {Object} shape : 图形
	         * @param {Object} area ： 目标区域
	         * @param {number} x ： 横坐标
	         * @param {number} y ： 纵坐标
	         */
	        function isInside(shape, area, x, y) {
	            if (!area || !shape) {
	                // 无参数或不支持类型
	                return false;
	            }
	            var zoneType = shape.type;

	            _ctx = _ctx || util.getContext();

	            // 未实现或不可用时(excanvas不支持)则数学运算，主要是line，polyline，ring
	            var _mathReturn = _mathMethod(shape, area, x, y);
	            if (typeof _mathReturn != 'undefined') {
	                return _mathReturn;
	            }

	            if (shape.buildPath && _ctx.isPointInPath) {
	                return _buildPathMethod(shape, _ctx, area, x, y);
	            }

	            // 上面的方法都行不通时
	            switch (zoneType) {
	                case 'ellipse': // Todo，不精确
	                    return true;
	                // 旋轮曲线  不准确
	                case 'trochoid':
	                    var _r = area.location == 'out'
	                            ? area.r1 + area.r2 + area.d
	                            : area.r1 - area.r2 + area.d;
	                    return isInsideCircle(area, x, y, _r);
	                // 玫瑰线 不准确
	                case 'rose' :
	                    return isInsideCircle(area, x, y, area.maxr);
	                // 路径，椭圆，曲线等-----------------13
	                default:
	                    return false;   // Todo，暂不支持
	            }
	        }

	        /**
	         * @param {Object} shape : 图形
	         * @param {Object} area ：目标区域
	         * @param {number} x ： 横坐标
	         * @param {number} y ： 纵坐标
	         * @return {boolean=} true表示坐标处在图形中
	         */
	        function _mathMethod(shape, area, x, y) {
	            var zoneType = shape.type;
	            // 在矩形内则部分图形需要进一步判断
	            switch (zoneType) {
	                // 贝塞尔曲线
	                case 'bezier-curve':
	                    if (typeof(area.cpX2) === 'undefined') {
	                        return isInsideQuadraticStroke(
	                            area.xStart, area.yStart,
	                            area.cpX1, area.cpY1, 
	                            area.xEnd, area.yEnd,
	                            area.lineWidth, x, y
	                        );
	                    }
	                    return isInsideCubicStroke(
	                        area.xStart, area.yStart,
	                        area.cpX1, area.cpY1, 
	                        area.cpX2, area.cpY2, 
	                        area.xEnd, area.yEnd,
	                        area.lineWidth, x, y
	                    );
	                // 线
	                case 'line':
	                    return isInsideLine(
	                        area.xStart, area.yStart,
	                        area.xEnd, area.yEnd,
	                        area.lineWidth, x, y
	                    );
	                // 折线
	                case 'polyline':
	                    return isInsidePolyline(
	                        area.pointList, area.lineWidth, x, y
	                    );
	                // 圆环
	                case 'ring':
	                    return isInsideRing(
	                        area.x, area.y, area.r0, area.r, x, y
	                    );
	                // 圆形
	                case 'circle':
	                    return isInsideCircle(
	                        area.x, area.y, area.r, x, y
	                    );
	                // 扇形
	                case 'sector':
	                    var startAngle = area.startAngle * Math.PI / 180;
	                    var endAngle = area.endAngle * Math.PI / 180;
	                    if (!area.clockWise) {
	                        startAngle = -startAngle;
	                        endAngle = -endAngle;
	                    }
	                    return isInsideSector(
	                        area.x, area.y, area.r0, area.r,
	                        startAngle, endAngle,
	                        !area.clockWise,
	                        x, y
	                    );
	                // 多边形
	                case 'path':
	                    return area.pathArray && isInsidePath(
	                        area.pathArray, Math.max(area.lineWidth, 5),
	                        area.brushType, x, y
	                    );
	                case 'polygon':
	                case 'star':
	                case 'isogon':
	                    return isInsidePolygon(area.pointList, x, y);
	                // 文本
	                case 'text':
	                    var rect =  area.__rect || shape.getRect(area);
	                    return isInsideRect(
	                        rect.x, rect.y, rect.width, rect.height, x, y
	                    );
	                // 矩形
	                case 'rectangle':
	                // 图片
	                case 'image':
	                    return isInsideRect(
	                        area.x, area.y, area.width, area.height, x, y
	                    );
	            }
	        }

	        /**
	         * 通过buildPath方法来判断，三个方法中较快，但是不支持线条类型的shape，
	         * 而且excanvas不支持isPointInPath方法
	         *
	         * @param {Object} shape ： shape
	         * @param {Object} context : 上下文
	         * @param {Object} area ：目标区域
	         * @param {number} x ： 横坐标
	         * @param {number} y ： 纵坐标
	         * @return {boolean} true表示坐标处在图形中
	         */
	        function _buildPathMethod(shape, context, area, x, y) {
	            // 图形类实现路径创建了则用类的path
	            context.beginPath();
	            shape.buildPath(context, area);
	            context.closePath();
	            return context.isPointInPath(x, y);
	        }

	        /**
	         * !isInside
	         */
	        function isOutside(shape, area, x, y) {
	            return !isInside(shape, area, x, y);
	        }

	        /**
	         * 线段包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        function isInsideLine(x0, y0, x1, y1, lineWidth, x, y) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = Math.max(lineWidth, 5);
	            var _a = 0;
	            var _b = x0;
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l)
	                || (y < y0 - _l && y < y1 - _l)
	                || (x > x0 + _l && x > x1 + _l)
	                || (x < x0 - _l && x < x1 - _l)
	            ) {
	                return false;
	            }

	            if (x0 !== x1) {
	                _a = (y0 - y1) / (x0 - x1);
	                _b = (x0 * y1 - x1 * y0) / (x0 - x1) ;
	            }
	            else {
	                return Math.abs(x - x0) <= _l / 2;
	            }
	            var tmp = _a * x - y + _b;
	            var _s = tmp * tmp / (_a * _a + 1);
	            return _s <= _l / 2 * _l / 2;
	        }

	        /**
	         * 三次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  x3
	         * @param  {number}  y3
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        function isInsideCubicStroke(
	            x0, y0, x1, y1, x2, y2, x3, y3,
	            lineWidth, x, y
	        ) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = Math.max(lineWidth, 5);
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l)
	            ) {
	                return false;
	            }
	            var d =  curve.cubicProjectPoint(
	                x0, y0, x1, y1, x2, y2, x3, y3,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }

	        /**
	         * 二次贝塞尔曲线描边包含判断
	         * @param  {number}  x0
	         * @param  {number}  y0
	         * @param  {number}  x1
	         * @param  {number}  y1
	         * @param  {number}  x2
	         * @param  {number}  y2
	         * @param  {number}  lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {boolean}
	         */
	        function isInsideQuadraticStroke(
	            x0, y0, x1, y1, x2, y2,
	            lineWidth, x, y
	        ) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = Math.max(lineWidth, 5);
	            // Quick reject
	            if (
	                (y > y0 + _l && y > y1 + _l && y > y2 + _l)
	                || (y < y0 - _l && y < y1 - _l && y < y2 - _l)
	                || (x > x0 + _l && x > x1 + _l && x > x2 + _l)
	                || (x < x0 - _l && x < x1 - _l && x < x2 - _l)
	            ) {
	                return false;
	            }
	            var d =  curve.quadraticProjectPoint(
	                x0, y0, x1, y1, x2, y2,
	                x, y, null
	            );
	            return d <= _l / 2;
	        }

	        /**
	         * 圆弧描边包含判断
	         * @param  {number}  cx
	         * @param  {number}  cy
	         * @param  {number}  r
	         * @param  {number}  startAngle
	         * @param  {number}  endAngle
	         * @param  {boolean}  anticlockwise
	         * @param  {number} lineWidth
	         * @param  {number}  x
	         * @param  {number}  y
	         * @return {Boolean}
	         */
	        function isInsideArcStroke(
	            cx, cy, r, startAngle, endAngle, anticlockwise,
	            lineWidth, x, y
	        ) {
	            if (lineWidth === 0) {
	                return false;
	            }
	            var _l = Math.max(lineWidth, 5);

	            x -= cx;
	            y -= cy;
	            var d = Math.sqrt(x * x + y * y);
	            if ((d - _l > r) || (d + _l < r)) {
	                return false;
	            }
	            if (Math.abs(startAngle - endAngle) >= PI2) {
	                // Is a circle
	                return true;
	            }
	            if (anticlockwise) {
	                var tmp = startAngle;
	                startAngle = normalizeRadian(endAngle);
	                endAngle = normalizeRadian(tmp);
	            } else {
	                startAngle = normalizeRadian(startAngle);
	                endAngle = normalizeRadian(endAngle);
	            }
	            if (startAngle > endAngle) {
	                endAngle += PI2;
	            }
	            
	            var angle = Math.atan2(y, x);
	            if (angle < 0) {
	                angle += PI2;
	            }
	            return (angle >= startAngle && angle <= endAngle)
	                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle);
	        }

	        function isInsidePolyline(points, lineWidth, x, y) {
	            var lineWidth = Math.max(lineWidth, 10);
	            for (var i = 0, l = points.length - 1; i < l; i++) {
	                var x0 = points[i][0];
	                var y0 = points[i][1];
	                var x1 = points[i + 1][0];
	                var y1 = points[i + 1][1];

	                if (isInsideLine(x0, y0, x1, y1, lineWidth, x, y)) {
	                    return true;
	                }
	            }

	            return false;
	        }

	        function isInsideRing(cx, cy, r0, r, x, y) {
	            var d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
	            return (d < r * r) && (d > r0 * r0);
	        }

	        /**
	         * 矩形包含判断
	         */
	        function isInsideRect(x0, y0, width, height, x, y) {
	            return x >= x0 && x <= (x0 + width)
	                && y >= y0 && y <= (y0 + height);
	        }

	        /**
	         * 圆形包含判断
	         */
	        function isInsideCircle(x0, y0, r, x, y) {
	            return (x - x0) * (x - x0) + (y - y0) * (y - y0)
	                   < r * r;
	        }

	        /**
	         * 扇形包含判断
	         */
	        function isInsideSector(
	            cx, cy, r0, r, startAngle, endAngle, anticlockwise, x, y
	        ) {
	            return isInsideArcStroke(
	                cx, cy, (r0 + r) / 2, startAngle, endAngle, anticlockwise,
	                r - r0, x, y
	            );
	        }

	        /**
	         * 多边形包含判断
	         * 与 canvas 一样采用 non-zero winding rule
	         */
	        function isInsidePolygon(points, x, y) {
	            var N = points.length;
	            var w = 0;

	            for (var i = 0, j = N - 1; i < N; i++) {
	                var x0 = points[j][0];
	                var y0 = points[j][1];
	                var x1 = points[i][0];
	                var y1 = points[i][1];
	                w += windingLine(x0, y0, x1, y1, x, y);
	                j = i;
	            }
	            return w !== 0;
	        }

	        function windingLine(x0, y0, x1, y1, x, y) {
	            if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
	                return 0;
	            }
	            if (y1 == y0) {
	                return 0;
	            }
	            var dir = y1 < y0 ? 1 : -1;
	            var t = (y - y0) / (y1 - y0);
	            var x_ = t * (x1 - x0) + x0;

	            return x_ > x ? dir : 0;
	        }

	        // 临时数组
	        var roots = [-1, -1, -1];
	        var extrema = [-1, -1];

	        function swapExtrema() {
	            var tmp = extrema[0];
	            extrema[0] = extrema[1];
	            extrema[1] = tmp;
	        }
	        function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
	            // Quick reject
	            if (
	                (y > y0 && y > y1 && y > y2 && y > y3)
	                || (y < y0 && y < y1 && y < y2 && y < y3)
	            ) {
	                return 0;
	            }
	            var nRoots = curve.cubicRootAt(y0, y1, y2, y3, y, roots);
	            if (nRoots === 0) {
	                return 0;
	            }
	            else {
	                var w = 0;
	                var nExtrema = -1;
	                var y0_, y1_;
	                for (var i = 0; i < nRoots; i++) {
	                    var t = roots[i];
	                    var x_ = curve.cubicAt(x0, x1, x2, x3, t);
	                    if (x_ < x) { // Quick reject
	                        continue;
	                    }
	                    if (nExtrema < 0) {
	                        nExtrema = curve.cubicExtrema(y0, y1, y2, y3, extrema);
	                        if (extrema[1] < extrema[0] && nExtrema > 1) {
	                            swapExtrema();
	                        }
	                        y0_ = curve.cubicAt(y0, y1, y2, y3, extrema[0]);
	                        if (nExtrema > 1) {
	                            y1_ = curve.cubicAt(y0, y1, y2, y3, extrema[1]);
	                        }
	                    }
	                    if (nExtrema == 2) {
	                        // 分成三段单调函数
	                        if (t < extrema[0]) {
	                            w += y0_ < y0 ? 1 : -1;
	                        } 
	                        else if (t < extrema[1]) {
	                            w += y1_ < y0_ ? 1 : -1;
	                        } 
	                        else {
	                            w += y3 < y1_ ? 1 : -1;
	                        }
	                    } 
	                    else {
	                        // 分成两段单调函数
	                        if (t < extrema[0]) {
	                            w += y0_ < y0 ? 1 : -1;
	                        } 
	                        else {
	                            w += y3 < y0_ ? 1 : -1;
	                        }
	                    }
	                }
	                return w;
	            }
	        }

	        function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
	            // Quick reject
	            if (
	                (y > y0 && y > y1 && y > y2)
	                || (y < y0 && y < y1 && y < y2)
	            ) {
	                return 0;
	            }
	            var nRoots = curve.quadraticRootAt(y0, y1, y2, y, roots);
	            if (nRoots === 0) {
	                return 0;
	            } 
	            else {
	                var t = curve.quadraticExtremum(y0, y1, y2);
	                if (t >=0 && t <= 1) {
	                    var w = 0;
	                    var y_ = curve.quadraticAt(y0, y1, y2, t);
	                    for (var i = 0; i < nRoots; i++) {
	                        var x_ = curve.quadraticAt(x0, x1, x2, roots[i]);
	                        if (x_ < x) {
	                            continue;
	                        }
	                        if (roots[i] < t) {
	                            w += y_ < y0 ? 1 : -1;
	                        } 
	                        else {
	                            w += y2 < y_ ? 1 : -1;
	                        }
	                    }
	                    return w;
	                } 
	                else {
	                    var x_ = curve.quadraticAt(x0, x1, x2, roots[0]);
	                    if (x_ < x) {
	                        return 0;
	                    }
	                    return y2 < y0 ? 1 : -1;
	                }
	            }
	        }
	        
	        // TODO
	        // Arc 旋转
	        function windingArc(
	            cx, cy, r, startAngle, endAngle, anticlockwise, x, y
	        ) {
	            y -= cy;
	            if (y > r || y < -r) {
	                return 0;
	            }
	            var tmp = Math.sqrt(r * r - y * y);
	            roots[0] = -tmp;
	            roots[1] = tmp;

	            if (Math.abs(startAngle - endAngle) >= PI2) {
	                // Is a circle
	                startAngle = 0;
	                endAngle = PI2;
	                var dir = anticlockwise ? 1 : -1;
	                if (x >= roots[0] + cx && x <= roots[1] + cx) {
	                    return dir;
	                } else {
	                    return 0;
	                }
	            }

	            if (anticlockwise) {
	                var tmp = startAngle;
	                startAngle = normalizeRadian(endAngle);
	                endAngle = normalizeRadian(tmp);   
	            } else {
	                startAngle = normalizeRadian(startAngle);
	                endAngle = normalizeRadian(endAngle);   
	            }
	            if (startAngle > endAngle) {
	                endAngle += PI2;
	            }

	            var w = 0;
	            for (var i = 0; i < 2; i++) {
	                var x_ = roots[i];
	                if (x_ + cx > x) {
	                    var angle = Math.atan2(y, x_);
	                    var dir = anticlockwise ? 1 : -1;
	                    if (angle < 0) {
	                        angle = PI2 + angle;
	                    }
	                    if (
	                        (angle >= startAngle && angle <= endAngle)
	                        || (angle + PI2 >= startAngle && angle + PI2 <= endAngle)
	                    ) {
	                        if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
	                            dir = -dir;
	                        }
	                        w += dir;
	                    }
	                }
	            }
	            return w;
	        }

	        /**
	         * 路径包含判断
	         * 与 canvas 一样采用 non-zero winding rule
	         */
	        function isInsidePath(pathArray, lineWidth, brushType, x, y) {
	            var w = 0;
	            var xi = 0;
	            var yi = 0;
	            var x0 = 0;
	            var y0 = 0;
	            var beginSubpath = true;
	            var firstCmd = true;

	            brushType = brushType || 'fill';

	            var hasStroke = brushType === 'stroke' || brushType === 'both';
	            var hasFill = brushType === 'fill' || brushType === 'both';

	            // var roots = [-1, -1, -1];
	            for (var i = 0; i < pathArray.length; i++) {
	                var seg = pathArray[i];
	                var p = seg.points;
	                // Begin a new subpath
	                if (beginSubpath || seg.command === 'M') {
	                    if (i > 0) {
	                        // Close previous subpath
	                        if (hasFill) {
	                            w += windingLine(xi, yi, x0, y0, x, y);
	                        }
	                        if (w !== 0) {
	                            return true;
	                        }
	                    }
	                    x0 = p[p.length - 2];
	                    y0 = p[p.length - 1];
	                    beginSubpath = false;
	                    if (firstCmd && seg.command !== 'A') {
	                        // 如果第一个命令不是M, 是lineTo, bezierCurveTo
	                        // 等绘制命令的话，是会从该绘制的起点开始算的
	                        // Arc 会在之后做单独处理所以这里忽略
	                        firstCmd = false;
	                        xi = x0;
	                        yi = y0;
	                    }
	                }
	                switch (seg.command) {
	                    case 'M':
	                        xi = p[0];
	                        yi = p[1];
	                        break;
	                    case 'L':
	                        if (hasStroke) {
	                            if (isInsideLine(
	                                xi, yi, p[0], p[1], lineWidth, x, y
	                            )) {
	                                return true;
	                            }
	                        }
	                        if (hasFill) {
	                            w += windingLine(xi, yi, p[0], p[1], x, y);
	                        }
	                        xi = p[0];
	                        yi = p[1];
	                        break;
	                    case 'C':
	                        if (hasStroke) {
	                            if (isInsideCubicStroke(
	                                xi, yi, p[0], p[1], p[2], p[3], p[4], p[5],
	                                lineWidth, x, y
	                            )) {
	                                return true;
	                            }
	                        }
	                        if (hasFill) {
	                            w += windingCubic(
	                                xi, yi, p[0], p[1], p[2], p[3], p[4], p[5], x, y
	                            );
	                        }
	                        xi = p[4];
	                        yi = p[5];
	                        break;
	                    case 'Q':
	                        if (hasStroke) {
	                            if (isInsideQuadraticStroke(
	                                xi, yi, p[0], p[1], p[2], p[3],
	                                lineWidth, x, y
	                            )) {
	                                return true;
	                            }
	                        }
	                        if (hasFill) {
	                            w += windingQuadratic(
	                                xi, yi, p[0], p[1], p[2], p[3], x, y
	                            );
	                        }
	                        xi = p[2];
	                        yi = p[3];
	                        break;
	                    case 'A':
	                        // TODO Arc 旋转
	                        // TODO Arc 判断的开销比较大
	                        var cx = p[0];
	                        var cy = p[1];
	                        var rx = p[2];
	                        var ry = p[3];
	                        var theta = p[4];
	                        var dTheta = p[5];
	                        var x1 = Math.cos(theta) * rx + cx;
	                        var y1 = Math.sin(theta) * ry + cy;
	                        // 不是直接使用 arc 命令
	                        if (!firstCmd) {
	                            w += windingLine(xi, yi, x1, y1);
	                        } else {
	                            firstCmd = false;
	                            // 第一个命令起点还未定义
	                            x0 = x1;
	                            y0 = y1;
	                        }
	                        // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
	                        var _x = (x - cx) * ry / rx + cx;
	                        if (hasStroke) {
	                            if (isInsideArcStroke(
	                                cx, cy, ry, theta, theta + dTheta, 1 - p[7],
	                                lineWidth, _x, y
	                            )) {
	                                return true;
	                            }
	                        }
	                        if (hasFill) {
	                            w += windingArc(
	                                cx, cy, ry, theta, theta + dTheta, 1 - p[7],
	                                _x, y
	                            );
	                        }
	                        xi = Math.cos(theta + dTheta) * rx + cx;
	                        yi = Math.sin(theta + dTheta) * ry + cy;
	                        break;
	                    case 'z':
	                        if (hasStroke) {
	                            if (isInsideLine(
	                                xi, yi, x0, y0, lineWidth, x, y
	                            )) {
	                                return true;
	                            }
	                        }
	                        beginSubpath = true;
	                        break;
	                }
	            }
	            if (hasFill) {
	                w += windingLine(xi, yi, x0, y0, x, y);
	            }
	            return w !== 0;
	        }

	        /**
	         * 测算多行文本宽度
	         * @param {Object} text
	         * @param {Object} textFont
	         */
	        function getTextWidth(text, textFont) {
	            var key = text + ':' + textFont;
	            if (_textWidthCache[key]) {
	                return _textWidthCache[key];
	            }
	            _ctx = _ctx || util.getContext();
	            _ctx.save();

	            if (textFont) {
	                _ctx.font = textFont;
	            }
	            
	            text = (text + '').split('\n');
	            var width = 0;
	            for (var i = 0, l = text.length; i < l; i++) {
	                width =  Math.max(
	                    _ctx.measureText(text[i]).width,
	                    width
	                );
	            }
	            _ctx.restore();

	            _textWidthCache[key] = width;
	            if (++_textWidthCacheCounter > TEXT_CACHE_MAX) {
	                // 内存释放
	                _textWidthCacheCounter = 0;
	                _textWidthCache = {};
	            }
	            
	            return width;
	        }
	        
	        /**
	         * 测算多行文本高度
	         * @param {Object} text
	         * @param {Object} textFont
	         */
	        function getTextHeight(text, textFont) {
	            var key = text + ':' + textFont;
	            if (_textHeightCache[key]) {
	                return _textHeightCache[key];
	            }
	            
	            _ctx = _ctx || util.getContext();

	            _ctx.save();
	            if (textFont) {
	                _ctx.font = textFont;
	            }
	            
	            text = (text + '').split('\n');
	            // 比较粗暴
	            var height = (_ctx.measureText('国').width + 2) * text.length;

	            _ctx.restore();

	            _textHeightCache[key] = height;
	            if (++_textHeightCacheCounter > TEXT_CACHE_MAX) {
	                // 内存释放
	                _textHeightCacheCounter = 0;
	                _textHeightCache = {};
	            }
	            return height;
	        }

	        return {
	            isInside : isInside,
	            isOutside : isOutside,
	            getTextWidth : getTextWidth,
	            getTextHeight : getTextHeight,

	            isInsidePath: isInsidePath,
	            isInsidePolygon: isInsidePolygon,
	            isInsideSector: isInsideSector,
	            isInsideCircle: isInsideCircle,
	            isInsideLine: isInsideLine,
	            isInsideRect: isInsideRect,
	            isInsidePolyline: isInsidePolyline,

	            isInsideCubicStroke: isInsideCubicStroke,
	            isInsideQuadraticStroke: isInsideQuadraticStroke
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 曲线辅助模块
	 * @module zrender/tool/curve
	 * @author pissang(https://www.github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	    var vector = __webpack_require__(9);

	    'use strict';

	    var EPSILON = 1e-4;

	    var THREE_SQRT = Math.sqrt(3);
	    var ONE_THIRD = 1 / 3;

	    // 临时变量
	    var _v0 = vector.create();
	    var _v1 = vector.create();
	    var _v2 = vector.create();
	    // var _v3 = vector.create();

	    function isAroundZero(val) {
	        return val > -EPSILON && val < EPSILON;
	    }
	    function isNotAroundZero(val) {
	        return val > EPSILON || val < -EPSILON;
	    }
	    /*
	    function evalCubicCoeff(a, b, c, d, t) {
	        return ((a * t + b) * t + c) * t + d;
	    }
	    */

	    /** 
	     * 计算三次贝塞尔值
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return onet * onet * (onet * p0 + 3 * t * p1)
	             + t * t * (t * p3 + 3 * onet * p2);
	    }

	    /** 
	     * 计算三次贝塞尔导数值
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @return {number}
	     */
	    function cubicDerivativeAt(p0, p1, p2, p3, t) {
	        var onet = 1 - t;
	        return 3 * (
	            ((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet
	            + (p3 - p2) * t * t
	        );
	    }

	    /**
	     * 计算三次贝塞尔方程根，使用盛金公式
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} val
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function cubicRootAt(p0, p1, p2, p3, val, roots) {
	        // Evaluate roots of cubic functions
	        var a = p3 + 3 * (p1 - p2) - p0;
	        var b = 3 * (p2 - p1 * 2 + p0);
	        var c = 3 * (p1  - p0);
	        var d = p0 - val;

	        var A = b * b - 3 * a * c;
	        var B = b * c - 9 * a * d;
	        var C = c * c - 3 * b * d;

	        var n = 0;

	        if (isAroundZero(A) && isAroundZero(B)) {
	            if (isAroundZero(b)) {
	                roots[0] = 0;
	            }
	            else {
	                var t1 = -c / b;  //t1, t2, t3, b is not zero
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = B * B - 4 * A * C;

	            if (isAroundZero(disc)) {
	                var K = B / A;
	                var t1 = -b / a + K;  // t1, a is not zero
	                var t2 = -K / 2;  // t2, t3
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = Math.sqrt(disc);
	                var Y1 = A * b + 1.5 * a * (-B + discSqrt);
	                var Y2 = A * b + 1.5 * a * (-B - discSqrt);
	                if (Y1 < 0) {
	                    Y1 = -Math.pow(-Y1, ONE_THIRD);
	                }
	                else {
	                    Y1 = Math.pow(Y1, ONE_THIRD);
	                }
	                if (Y2 < 0) {
	                    Y2 = -Math.pow(-Y2, ONE_THIRD);
	                }
	                else {
	                    Y2 = Math.pow(Y2, ONE_THIRD);
	                }
	                var t1 = (-b - (Y1 + Y2)) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else {
	                var T = (2 * A * b - 3 * a * B) / (2 * Math.sqrt(A * A * A));
	                var theta = Math.acos(T) / 3;
	                var ASqrt = Math.sqrt(A);
	                var tmp = Math.cos(theta);
	                
	                var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
	                var t2 = (-b + ASqrt * (tmp + THREE_SQRT * Math.sin(theta))) / (3 * a);
	                var t3 = (-b + ASqrt * (tmp - THREE_SQRT * Math.sin(theta))) / (3 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	                if (t3 >= 0 && t3 <= 1) {
	                    roots[n++] = t3;
	                }
	            }
	        }
	        return n;
	    }

	    /**
	     * 计算三次贝塞尔方程极限值的位置
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {Array.<number>} extrema
	     * @return {number} 有效数目
	     */
	    function cubicExtrema(p0, p1, p2, p3, extrema) {
	        var b = 6 * p2 - 12 * p1 + 6 * p0;
	        var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
	        var c = 3 * p1 - 3 * p0;

	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <=1) {
	                    extrema[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                extrema[0] = -b / (2 * a);
	            }
	            else if (disc > 0) {
	                var discSqrt = Math.sqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    extrema[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    extrema[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }

	    /**
	     * 细分三次贝塞尔曲线
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} p3
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function cubicSubdivide(p0, p1, p2, p3, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p23 = (p3 - p2) * t + p2;

	        var p012 = (p12 - p01) * t + p01;
	        var p123 = (p23 - p12) * t + p12;

	        var p0123 = (p123 - p012) * t + p012;
	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;
	        out[3] = p0123;
	        // Seg1
	        out[4] = p0123;
	        out[5] = p123;
	        out[6] = p23;
	        out[7] = p3;
	    }

	    /**
	     * 投射点到三次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x3
	     * @param {number} y3
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} [out] 投射点
	     * @return {number}
	     */
	    function cubicProjectPoint(
	        x0, y0, x1, y1, x2, y2, x3, y3,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;

	        _v0[0] = x;
	        _v0[1] = y;

	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = cubicAt(x0, x1, x2, x3, _t);
	            _v1[1] = cubicAt(y0, y1, y2, y3, _t);
	            var d1 = vector.distSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;

	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON) {
	                break;
	            }
	            var prev = t - interval;
	            var next = t + interval;
	            // t - interval
	            _v1[0] = cubicAt(x0, x1, x2, x3, prev);
	            _v1[1] = cubicAt(y0, y1, y2, y3, prev);

	            var d1 = vector.distSquare(_v1, _v0);

	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = cubicAt(x0, x1, x2, x3, next);
	                _v2[1] = cubicAt(y0, y1, y2, y3, next);
	                var d2 = vector.distSquare(_v2, _v0);

	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = cubicAt(x0, x1, x2, x3, t);
	            out[1] = cubicAt(y0, y1, y2, y3, t);   
	        }
	        // console.log(interval, i);
	        return Math.sqrt(d);
	    }

	    /**
	     * 计算二次方贝塞尔值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticAt(p0, p1, p2, t) {
	        var onet = 1 - t;
	        return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
	    }

	    /**
	     * 计算二次方贝塞尔导数值
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @return {number}
	     */
	    function quadraticDerivativeAt(p0, p1, p2, t) {
	        return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
	    }

	    /**
	     * 计算二次方贝塞尔方程根
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} roots
	     * @return {number} 有效根数目
	     */
	    function quadraticRootAt(p0, p1, p2, val, roots) {
	        var a = p0 - 2 * p1 + p2;
	        var b = 2 * (p1 - p0);
	        var c = p0 - val;

	        var n = 0;
	        if (isAroundZero(a)) {
	            if (isNotAroundZero(b)) {
	                var t1 = -c / b;
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	        }
	        else {
	            var disc = b * b - 4 * a * c;
	            if (isAroundZero(disc)) {
	                var t1 = -b / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	            }
	            else if (disc > 0) {
	                var discSqrt = Math.sqrt(disc);
	                var t1 = (-b + discSqrt) / (2 * a);
	                var t2 = (-b - discSqrt) / (2 * a);
	                if (t1 >= 0 && t1 <= 1) {
	                    roots[n++] = t1;
	                }
	                if (t2 >= 0 && t2 <= 1) {
	                    roots[n++] = t2;
	                }
	            }
	        }
	        return n;
	    }

	    /**
	     * 计算二次贝塞尔方程极限值
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @return {number}
	     */
	    function quadraticExtremum(p0, p1, p2) {
	        var divider = p0 + p2 - 2 * p1;
	        if (divider === 0) {
	            // p1 is center of p0 and p2 
	            return 0.5;
	        }
	        else {
	            return (p0 - p1) / divider;
	        }
	    }

	    /**
	     * 细分二次贝塞尔曲线
	     * @memberOf module:zrender/tool/curve
	     * @param  {number} p0
	     * @param  {number} p1
	     * @param  {number} p2
	     * @param  {number} t
	     * @param  {Array.<number>} out
	     */
	    function quadraticSubdivide(p0, p1, p2, t, out) {
	        var p01 = (p1 - p0) * t + p0;
	        var p12 = (p2 - p1) * t + p1;
	        var p012 = (p12 - p01) * t + p01;

	        // Seg0
	        out[0] = p0;
	        out[1] = p01;
	        out[2] = p012;

	        // Seg1
	        out[3] = p012;
	        out[4] = p12;
	        out[5] = p2;
	    }

	    /**
	     * 投射点到二次贝塞尔曲线上，返回投射距离。
	     * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
	     * @param {number} x0
	     * @param {number} y0
	     * @param {number} x1
	     * @param {number} y1
	     * @param {number} x2
	     * @param {number} y2
	     * @param {number} x
	     * @param {number} y
	     * @param {Array.<number>} out 投射点
	     * @return {number}
	     */
	    function quadraticProjectPoint(
	        x0, y0, x1, y1, x2, y2,
	        x, y, out
	    ) {
	        // http://pomax.github.io/bezierinfo/#projections
	        var t;
	        var interval = 0.005;
	        var d = Infinity;

	        _v0[0] = x;
	        _v0[1] = y;

	        // 先粗略估计一下可能的最小距离的 t 值
	        // PENDING
	        for (var _t = 0; _t < 1; _t += 0.05) {
	            _v1[0] = quadraticAt(x0, x1, x2, _t);
	            _v1[1] = quadraticAt(y0, y1, y2, _t);
	            var d1 = vector.distSquare(_v0, _v1);
	            if (d1 < d) {
	                t = _t;
	                d = d1;
	            }
	        }
	        d = Infinity;

	        // At most 32 iteration
	        for (var i = 0; i < 32; i++) {
	            if (interval < EPSILON) {
	                break;
	            }
	            var prev = t - interval;
	            var next = t + interval;
	            // t - interval
	            _v1[0] = quadraticAt(x0, x1, x2, prev);
	            _v1[1] = quadraticAt(y0, y1, y2, prev);

	            var d1 = vector.distSquare(_v1, _v0);

	            if (prev >= 0 && d1 < d) {
	                t = prev;
	                d = d1;
	            }
	            else {
	                // t + interval
	                _v2[0] = quadraticAt(x0, x1, x2, next);
	                _v2[1] = quadraticAt(y0, y1, y2, next);
	                var d2 = vector.distSquare(_v2, _v0);
	                if (next <= 1 && d2 < d) {
	                    t = next;
	                    d = d2;
	                }
	                else {
	                    interval *= 0.5;
	                }
	            }
	        }
	        // t
	        if (out) {
	            out[0] = quadraticAt(x0, x1, x2, t);
	            out[1] = quadraticAt(y0, y1, y2, t);   
	        }
	        // console.log(interval, i);
	        return Math.sqrt(d);
	    }

	    return {

	        cubicAt: cubicAt,

	        cubicDerivativeAt: cubicDerivativeAt,

	        cubicRootAt: cubicRootAt,

	        cubicExtrema: cubicExtrema,

	        cubicSubdivide: cubicSubdivide,

	        cubicProjectPoint: cubicProjectPoint,

	        quadraticAt: quadraticAt,

	        quadraticDerivativeAt: quadraticDerivativeAt,

	        quadraticRootAt: quadraticRootAt,

	        quadraticExtremum: quadraticExtremum,

	        quadraticSubdivide: quadraticSubdivide,

	        quadraticProjectPoint: quadraticProjectPoint
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 颜色辅助模块
	 * @module zrender/tool/color
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	    var util = __webpack_require__(5);

	    var _ctx;

	    // Color palette is an array containing the default colors for the chart's
	    // series.
	    // When all colors are used, new colors are selected from the start again.
	    // Defaults to:
	    // 默认色板
	    var palette = [
	        '#ff9277', ' #dddd00', ' #ffc877', ' #bbe3ff', ' #d5ffbb',
	        '#bbbbff', ' #ddb000', ' #b0dd00', ' #e2bbff', ' #ffbbe3',
	        '#ff7777', ' #ff9900', ' #83dd00', ' #77e3ff', ' #778fff',
	        '#c877ff', ' #ff77ab', ' #ff6600', ' #aa8800', ' #77c7ff',
	        '#ad77ff', ' #ff77ff', ' #dd0083', ' #777700', ' #00aa00',
	        '#0088aa', ' #8400dd', ' #aa0088', ' #dd0000', ' #772e00'
	    ];
	    var _palette = palette;

	    var highlightColor = 'rgba(255,255,0,0.5)';
	    var _highlightColor = highlightColor;

	    // 颜色格式
	    /*jshint maxlen: 330 */
	    var colorRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i;

	    var _nameColors = {
	        aliceblue : '#f0f8ff',
	        antiquewhite : '#faebd7',
	        aqua : '#0ff',
	        aquamarine : '#7fffd4',
	        azure : '#f0ffff',
	        beige : '#f5f5dc',
	        bisque : '#ffe4c4',
	        black : '#000',
	        blanchedalmond : '#ffebcd',
	        blue : '#00f',
	        blueviolet : '#8a2be2',
	        brown : '#a52a2a',
	        burlywood : '#deb887',
	        cadetblue : '#5f9ea0',
	        chartreuse : '#7fff00',
	        chocolate : '#d2691e',
	        coral : '#ff7f50',
	        cornflowerblue : '#6495ed',
	        cornsilk : '#fff8dc',
	        crimson : '#dc143c',
	        cyan : '#0ff',
	        darkblue : '#00008b',
	        darkcyan : '#008b8b',
	        darkgoldenrod : '#b8860b',
	        darkgray : '#a9a9a9',
	        darkgrey : '#a9a9a9',
	        darkgreen : '#006400',
	        darkkhaki : '#bdb76b',
	        darkmagenta : '#8b008b',
	        darkolivegreen : '#556b2f',
	        darkorange : '#ff8c00',
	        darkorchid : '#9932cc',
	        darkred : '#8b0000',
	        darksalmon : '#e9967a',
	        darkseagreen : '#8fbc8f',
	        darkslateblue : '#483d8b',
	        darkslategray : '#2f4f4f',
	        darkslategrey : '#2f4f4f',
	        darkturquoise : '#00ced1',
	        darkviolet : '#9400d3',
	        deeppink : '#ff1493',
	        deepskyblue : '#00bfff',
	        dimgray : '#696969',
	        dimgrey : '#696969',
	        dodgerblue : '#1e90ff',
	        firebrick : '#b22222',
	        floralwhite : '#fffaf0',
	        forestgreen : '#228b22',
	        fuchsia : '#f0f',
	        gainsboro : '#dcdcdc',
	        ghostwhite : '#f8f8ff',
	        gold : '#ffd700',
	        goldenrod : '#daa520',
	        gray : '#808080',
	        grey : '#808080',
	        green : '#008000',
	        greenyellow : '#adff2f',
	        honeydew : '#f0fff0',
	        hotpink : '#ff69b4',
	        indianred : '#cd5c5c',
	        indigo : '#4b0082',
	        ivory : '#fffff0',
	        khaki : '#f0e68c',
	        lavender : '#e6e6fa',
	        lavenderblush : '#fff0f5',
	        lawngreen : '#7cfc00',
	        lemonchiffon : '#fffacd',
	        lightblue : '#add8e6',
	        lightcoral : '#f08080',
	        lightcyan : '#e0ffff',
	        lightgoldenrodyellow : '#fafad2',
	        lightgray : '#d3d3d3',
	        lightgrey : '#d3d3d3',
	        lightgreen : '#90ee90',
	        lightpink : '#ffb6c1',
	        lightsalmon : '#ffa07a',
	        lightseagreen : '#20b2aa',
	        lightskyblue : '#87cefa',
	        lightslategray : '#789',
	        lightslategrey : '#789',
	        lightsteelblue : '#b0c4de',
	        lightyellow : '#ffffe0',
	        lime : '#0f0',
	        limegreen : '#32cd32',
	        linen : '#faf0e6',
	        magenta : '#f0f',
	        maroon : '#800000',
	        mediumaquamarine : '#66cdaa',
	        mediumblue : '#0000cd',
	        mediumorchid : '#ba55d3',
	        mediumpurple : '#9370d8',
	        mediumseagreen : '#3cb371',
	        mediumslateblue : '#7b68ee',
	        mediumspringgreen : '#00fa9a',
	        mediumturquoise : '#48d1cc',
	        mediumvioletred : '#c71585',
	        midnightblue : '#191970',
	        mintcream : '#f5fffa',
	        mistyrose : '#ffe4e1',
	        moccasin : '#ffe4b5',
	        navajowhite : '#ffdead',
	        navy : '#000080',
	        oldlace : '#fdf5e6',
	        olive : '#808000',
	        olivedrab : '#6b8e23',
	        orange : '#ffa500',
	        orangered : '#ff4500',
	        orchid : '#da70d6',
	        palegoldenrod : '#eee8aa',
	        palegreen : '#98fb98',
	        paleturquoise : '#afeeee',
	        palevioletred : '#d87093',
	        papayawhip : '#ffefd5',
	        peachpuff : '#ffdab9',
	        peru : '#cd853f',
	        pink : '#ffc0cb',
	        plum : '#dda0dd',
	        powderblue : '#b0e0e6',
	        purple : '#800080',
	        red : '#f00',
	        rosybrown : '#bc8f8f',
	        royalblue : '#4169e1',
	        saddlebrown : '#8b4513',
	        salmon : '#fa8072',
	        sandybrown : '#f4a460',
	        seagreen : '#2e8b57',
	        seashell : '#fff5ee',
	        sienna : '#a0522d',
	        silver : '#c0c0c0',
	        skyblue : '#87ceeb',
	        slateblue : '#6a5acd',
	        slategray : '#708090',
	        slategrey : '#708090',
	        snow : '#fffafa',
	        springgreen : '#00ff7f',
	        steelblue : '#4682b4',
	        tan : '#d2b48c',
	        teal : '#008080',
	        thistle : '#d8bfd8',
	        tomato : '#ff6347',
	        turquoise : '#40e0d0',
	        violet : '#ee82ee',
	        wheat : '#f5deb3',
	        white : '#fff',
	        whitesmoke : '#f5f5f5',
	        yellow : '#ff0',
	        yellowgreen : '#9acd32'
	    };

	    /**
	     * 自定义调色板
	     */
	    function customPalette(userPalete) {
	        palette = userPalete;
	    }

	    /**
	     * 复位默认色板
	     */
	    function resetPalette() {
	        palette = _palette;
	    }

	    /**
	     * 获取色板颜色
	     * @memberOf module:zrender/tool/color
	     * @param {number} idx 色板位置
	     * @param {Array.<string>} [userPalete] 自定义色板
	     * @return {string} 颜色
	     */
	    function getColor(idx, userPalete) {
	        idx = idx | 0;
	        userPalete = userPalete || palette;
	        return userPalete[idx % userPalete.length];
	    }

	    /**
	     * 自定义默认高亮颜色
	     */
	    function customHighlight(userHighlightColor) {
	        highlightColor = userHighlightColor;
	    }

	    /**
	     * 重置默认高亮颜色
	     */
	    function resetHighlight() {
	        _highlightColor = highlightColor;
	    }

	    /**
	     * 获取默认高亮颜色
	     */
	    function getHighlightColor() {
	        return highlightColor;
	    }

	    /**
	     * 径向渐变
	     * @memberOf module:zrender/tool/color
	     * @param {number} x0 渐变起点
	     * @param {number} y0
	     * @param {number} r0
	     * @param {number} x1 渐变终点
	     * @param {number} y1
	     * @param {number} r1
	     * @param {Array} colorList 颜色列表
	     * @return {CanvasGradient}
	     */
	    function getRadialGradient(x0, y0, r0, x1, y1, r1, colorList) {
	        if (!_ctx) {
	            _ctx = util.getContext();
	        }
	        var gradient = _ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
	        for (var i = 0, l = colorList.length; i < l; i++) {
	            gradient.addColorStop(colorList[i][0], colorList[i][1]);
	        }
	        gradient.__nonRecursion = true;
	        return gradient;
	    }

	    /**
	     * 线性渐变
	     * @param {Object} x0 渐变起点
	     * @param {Object} y0
	     * @param {Object} x1 渐变终点
	     * @param {Object} y1
	     * @param {Array} colorList 颜色列表
	     */
	    function getLinearGradient(x0, y0, x1, y1, colorList) {
	        if (!_ctx) {
	            _ctx = util.getContext();
	        }
	        var gradient = _ctx.createLinearGradient(x0, y0, x1, y1);
	        for (var i = 0, l = colorList.length; i < l; i++) {
	            gradient.addColorStop(colorList[i][0], colorList[i][1]);
	        }
	        gradient.__nonRecursion = true;
	        return gradient;
	    }

	    /**
	     * 获取两种颜色之间渐变颜色数组
	     * @param {color} start 起始颜色
	     * @param {color} end 结束颜色
	     * @param {number} step 渐变级数
	     * @return {Array}  颜色数组
	     */
	    function getStepColors(start, end, step) {
	        start = toRGBA(start);
	        end = toRGBA(end);
	        start = getData(start);
	        end = getData(end);

	        var colors = [];
	        var stepR = (end[0] - start[0]) / step;
	        var stepG = (end[1] - start[1]) / step;
	        var stepB = (end[2] - start[2]) / step;
	        var stepA = (end[3] - start[3]) / step;
	        // 生成颜色集合
	        // fix by linfeng 颜色堆积
	        for (var i = 0, r = start[0], g = start[1], b = start[2], a = start[3]; i < step; i++) {
	            colors[i] = toColor([
	                adjust(Math.floor(r), [ 0, 255 ]),
	                adjust(Math.floor(g), [ 0, 255 ]), 
	                adjust(Math.floor(b), [ 0, 255 ]),
	                a.toFixed(4) - 0
	            ],'rgba');
	            r += stepR;
	            g += stepG;
	            b += stepB;
	            a += stepA;
	        }
	        r = end[0];
	        g = end[1];
	        b = end[2];
	        a = end[3];
	        colors[i] = toColor([r, g, b, a], 'rgba');
	        return colors;
	    }

	    /**
	     * 获取指定级数的渐变颜色数组
	     * @memberOf module:zrender/tool/color
	     * @param {Array.<string>} colors 颜色组
	     * @param {number} [step=20] 渐变级数
	     * @return {Array.<string>}  颜色数组
	     */
	    function getGradientColors(colors, step) {
	        var ret = [];
	        var len = colors.length;
	        if (step === undefined) {
	            step = 20;
	        }
	        if (len === 1) {
	            ret = getStepColors(colors[0], colors[0], step);
	        }
	        else if (len > 1) {
	            for (var i = 0, n = len - 1; i < n; i++) {
	                var steps = getStepColors(colors[i], colors[i + 1], step);
	                if (i < n - 1) {
	                    steps.pop();
	                }
	                ret = ret.concat(steps);
	            }
	        }
	        return ret;
	    }

	    /**
	     * 颜色值数组转为指定格式颜色,例如:<br/>
	     * data = [60,20,20,0.1] format = 'rgba'
	     * 返回：rgba(60,20,20,0.1)
	     * @param {Array} data 颜色值数组
	     * @param {string} format 格式,默认rgb
	     * @return {string} 颜色
	     */
	    function toColor(data, format) {
	        format = format || 'rgb';
	        if (data && (data.length === 3 || data.length === 4)) {
	            data = map(data,
	                function(c) {
	                    return c > 1 ? Math.ceil(c) : c;
	                }
	            );

	            if (format.indexOf('hex') > -1) {
	                return '#' + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + (+data[2])).toString(16).slice(1);
	            }
	            else if (format.indexOf('hs') > -1) {
	                var sx = map(data.slice(1, 3),
	                    function(c) {
	                        return c + '%';
	                    }
	                );
	                data[1] = sx[0];
	                data[2] = sx[1];
	            }

	            if (format.indexOf('a') > -1) {
	                if (data.length === 3) {
	                    data.push(1);
	                }
	                data[3] = adjust(data[3], [ 0, 1 ]);
	                return format + '(' + data.slice(0, 4).join(',') + ')';
	            }

	            return format + '(' + data.slice(0, 3).join(',') + ')';
	        }
	    }

	    /**
	     * 颜色字符串转换为rgba数组
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {Array.<number>} 颜色值数组
	     */
	    function toArray(color) {
	        color = trim(color);
	        if (color.indexOf('rgba') < 0) {
	            color = toRGBA(color);
	        }

	        var data = [];
	        var i = 0;
	        color.replace(/[\d.]+/g, function (n) {
	            if (i < 3) {
	                n = n | 0;
	            }
	            else {
	                // Alpha
	                n = +n;
	            }
	            data[i++] = n;
	        });
	        return data;
	    }

	    /**
	     * 颜色格式转化
	     *
	     * @param {string} color 颜色值数组
	     * @param {string} format 格式,默认rgb
	     * @return {string} 颜色
	     */
	    function convert(color, format) {
	        if (!isCalculableColor(color)) {
	            return color;
	        }
	        var data = getData(color);
	        var alpha = data[3];
	        if (typeof alpha === 'undefined') {
	            alpha = 1;
	        }

	        if (color.indexOf('hsb') > -1) {
	            data = _HSV_2_RGB(data);
	        }
	        else if (color.indexOf('hsl') > -1) {
	            data = _HSL_2_RGB(data);
	        }

	        if (format.indexOf('hsb') > -1 || format.indexOf('hsv') > -1) {
	            data = _RGB_2_HSB(data);
	        }
	        else if (format.indexOf('hsl') > -1) {
	            data = _RGB_2_HSL(data);
	        }

	        data[3] = alpha;

	        return toColor(data, format);
	    }

	    /**
	     * 转换为rgba格式的颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} rgba颜色，rgba(r,g,b,a)
	     */
	    function toRGBA(color) {
	        return convert(color, 'rgba');
	    }

	    /**
	     * 转换为rgb数字格式的颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} rgb颜色，rgb(0,0,0)格式
	     */
	    function toRGB(color) {
	        return convert(color, 'rgb');
	    }

	    /**
	     * 转换为16进制颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} 16进制颜色，#rrggbb格式
	     */
	    function toHex(color) {
	        return convert(color, 'hex');
	    }

	    /**
	     * 转换为HSV颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSVA颜色，hsva(h,s,v,a)
	     */
	    function toHSVA(color) {
	        return convert(color, 'hsva');
	    }

	    /**
	     * 转换为HSV颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSV颜色，hsv(h,s,v)
	     */
	    function toHSV(color) {
	        return convert(color, 'hsv');
	    }

	    /**
	     * 转换为HSBA颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSBA颜色，hsba(h,s,b,a)
	     */
	    function toHSBA(color) {
	        return convert(color, 'hsba');
	    }

	    /**
	     * 转换为HSB颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSB颜色，hsb(h,s,b)
	     */
	    function toHSB(color) {
	        return convert(color, 'hsb');
	    }

	    /**
	     * 转换为HSLA颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSLA颜色，hsla(h,s,l,a)
	     */
	    function toHSLA(color) {
	        return convert(color, 'hsla');
	    }

	    /**
	     * 转换为HSL颜色
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} HSL颜色，hsl(h,s,l)
	     */
	    function toHSL(color) {
	        return convert(color, 'hsl');
	    }

	    /**
	     * 转换颜色名
	     * 
	     * @param {string} color 颜色
	     * @return {string} 颜色名
	     */
	    function toName(color) {
	        for (var key in _nameColors) {
	            if (toHex(_nameColors[key]) === toHex(color)) {
	                return key;
	            }
	        }
	        return null;
	    }

	    /**
	     * 移除颜色中多余空格
	     * 
	     * @param {string} color 颜色
	     * @return {string} 无空格颜色
	     */
	    function trim(color) {
	        return String(color).replace(/\s+/g, '');
	    }

	    /**
	     * 颜色规范化
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} 规范化后的颜色
	     */
	    function normalize(color) {
	        // 颜色名
	        if (_nameColors[color]) {
	            color = _nameColors[color];
	        }
	        // 去掉空格
	        color = trim(color);
	        // hsv与hsb等价
	        color = color.replace(/hsv/i, 'hsb');
	        // rgb转为rrggbb
	        if (/^#[\da-f]{3}$/i.test(color)) {
	            color = parseInt(color.slice(1), 16);
	            var r = (color & 0xf00) << 8;
	            var g = (color & 0xf0) << 4;
	            var b = color & 0xf;

	            color = '#' + ((1 << 24) + (r << 4) + r + (g << 4) + g + (b << 4) + b).toString(16).slice(1);
	        }
	        // 或者使用以下正则替换，不过 chrome 下性能相对差点
	        // color = color.replace(/^#([\da-f])([\da-f])([\da-f])$/i, '#$1$1$2$2$3$3');
	        return color;
	    }

	    /**
	     * 颜色加深或减淡，当level>0加深，当level<0减淡
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @param {number} level 升降程度,取值区间[-1,1]
	     * @return {string} 加深或减淡后颜色值
	     */
	    function lift(color, level) {
	        if (!isCalculableColor(color)) {
	            return color;
	        }
	        var direct = level > 0 ? 1 : -1;
	        if (typeof level === 'undefined') {
	            level = 0;
	        }
	        level = Math.abs(level) > 1 ? 1 : Math.abs(level);
	        color = toRGB(color);
	        var data = getData(color);
	        for (var i = 0; i < 3; i++) {
	            if (direct === 1) {
	                data[i] = data[i] * (1 - level) | 0;
	            }
	            else {
	                data[i] = ((255 - data[i]) * level + data[i]) | 0;
	            }
	        }
	        return 'rgb(' + data.join(',') + ')';
	    }

	    /**
	     * 颜色翻转,[255-r,255-g,255-b,1-a]
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @return {string} 翻转颜色
	     */
	    function reverse(color) {
	        if (!isCalculableColor(color)) {
	            return color;
	        }
	        var data = getData(toRGBA(color));
	        data = map(data,
	            function(c) {
	                return 255 - c;
	            }
	        );
	        return toColor(data, 'rgb');
	    }

	    /**
	     * 简单两种颜色混合
	     * @memberOf module:zrender/tool/color
	     * @param {string} color1 第一种颜色
	     * @param {string} color2 第二种颜色
	     * @param {number} weight 混合权重[0-1]
	     * @return {string} 结果色,rgb(r,g,b)或rgba(r,g,b,a)
	     */
	    function mix(color1, color2, weight) {
	        if (!isCalculableColor(color1) || !isCalculableColor(color2)) {
	            return color1;
	        }
	        
	        if (typeof weight === 'undefined') {
	            weight = 0.5;
	        }
	        weight = 1 - adjust(weight, [ 0, 1 ]);

	        var w = weight * 2 - 1;
	        var data1 = getData(toRGBA(color1));
	        var data2 = getData(toRGBA(color2));

	        var d = data1[3] - data2[3];

	        var weight1 = (((w * d === -1) ? w : (w + d) / (1 + w * d)) + 1) / 2;
	        var weight2 = 1 - weight1;

	        var data = [];

	        for (var i = 0; i < 3; i++) {
	            data[i] = data1[i] * weight1 + data2[i] * weight2;
	        }

	        var alpha = data1[3] * weight + data2[3] * (1 - weight);
	        alpha = Math.max(0, Math.min(1, alpha));

	        if (data1[3] === 1 && data2[3] === 1) {// 不考虑透明度
	            return toColor(data, 'rgb');
	        }
	        data[3] = alpha;
	        return toColor(data, 'rgba');
	    }

	    /**
	     * 随机颜色
	     * 
	     * @return {string} 颜色值，#rrggbb格式
	     */
	    function random() {
	        return '#' + (Math.random().toString(16) + '0000').slice(2, 8);
	    }

	    /**
	     * 获取颜色值数组,返回值范围： <br/>
	     * RGB 范围[0-255] <br/>
	     * HSL/HSV/HSB 范围[0-1]<br/>
	     * A透明度范围[0-1]
	     * 支持格式：
	     * #rgb
	     * #rrggbb
	     * rgb(r,g,b)
	     * rgb(r%,g%,b%)
	     * rgba(r,g,b,a)
	     * hsb(h,s,b) // hsv与hsb等价
	     * hsb(h%,s%,b%)
	     * hsba(h,s,b,a)
	     * hsl(h,s,l)
	     * hsl(h%,s%,l%)
	     * hsla(h,s,l,a)
	     *
	     * @param {string} color 颜色
	     * @return {Array.<number>} 颜色值数组或null
	     */
	    function getData(color) {
	        color = normalize(color);
	        var r = color.match(colorRegExp);
	        if (r === null) {
	            throw new Error('The color format error'); // 颜色格式错误
	        }
	        var d;
	        var a;
	        var data = [];
	        var rgb;

	        if (r[2]) {
	            // #rrggbb
	            d = r[2].replace('#', '').split('');
	            rgb = [ d[0] + d[1], d[2] + d[3], d[4] + d[5] ];
	            data = map(rgb,
	                function(c) {
	                    return adjust(parseInt(c, 16), [ 0, 255 ]);
	                }
	            );

	        }
	        else if (r[4]) {
	            // rgb rgba
	            var rgba = (r[4]).split(',');
	            a = rgba[3];
	            rgb = rgba.slice(0, 3);
	            data = map(
	                rgb,
	                function(c) {
	                    c = Math.floor(
	                        c.indexOf('%') > 0 ? parseInt(c, 0) * 2.55 : c
	                    );
	                    return adjust(c, [ 0, 255 ]);
	                }
	            );

	            if (typeof a !== 'undefined') {
	                data.push(adjust(parseFloat(a), [ 0, 1 ]));
	            }
	        }
	        else if (r[5] || r[6]) {
	            // hsb hsba hsl hsla
	            var hsxa = (r[5] || r[6]).split(',');
	            var h = parseInt(hsxa[0], 0) / 360;
	            var s = hsxa[1];
	            var x = hsxa[2];
	            a = hsxa[3];
	            data = map([ s, x ],
	                function(c) {
	                    return adjust(parseFloat(c) / 100, [ 0, 1 ]);
	                }
	            );
	            data.unshift(h);
	            if (typeof a !== 'undefined') {
	                data.push(adjust(parseFloat(a), [ 0, 1 ]));
	            }
	        }
	        return data;
	    }

	    /**
	     * 设置颜色透明度
	     * @memberOf module:zrender/tool/color
	     * @param {string} color 颜色
	     * @param {number} a 透明度,区间[0,1]
	     * @return {string} rgba颜色值
	     */
	    function alpha(color, a) {
	        if (!isCalculableColor(color)) {
	            return color;
	        }
	        if (a === null) {
	            a = 1;
	        }
	        var data = getData(toRGBA(color));
	        data[3] = adjust(Number(a).toFixed(4), [ 0, 1 ]);

	        return toColor(data, 'rgba');
	    }

	    // 数组映射
	    function map(array, fun) {
	        if (typeof fun !== 'function') {
	            throw new TypeError();
	        }
	        var len = array ? array.length : 0;
	        for (var i = 0; i < len; i++) {
	            array[i] = fun(array[i]);
	        }
	        return array;
	    }

	    // 调整值区间
	    function adjust(value, region) {
	        // < to <= & > to >=
	        // modify by linzhifeng 2014-05-25 because -0 == 0
	        if (value <= region[0]) {
	            value = region[0];
	        }
	        else if (value >= region[1]) {
	            value = region[1];
	        }
	        return value;
	    }
	    
	    function isCalculableColor(color) {
	        return color instanceof Array || typeof color === 'string';
	    }

	    // 参见 http:// www.easyrgb.com/index.php?X=MATH
	    function _HSV_2_RGB(data) {
	        var H = data[0];
	        var S = data[1];
	        var V = data[2];
	        // HSV from 0 to 1
	        var R; 
	        var G;
	        var B;
	        if (S === 0) {
	            R = V * 255;
	            G = V * 255;
	            B = V * 255;
	        }
	        else {
	            var h = H * 6;
	            if (h === 6) {
	                h = 0;
	            }
	            var i = h | 0;
	            var v1 = V * (1 - S);
	            var v2 = V * (1 - S * (h - i));
	            var v3 = V * (1 - S * (1 - (h - i)));
	            var r = 0;
	            var g = 0;
	            var b = 0;

	            if (i === 0) {
	                r = V;
	                g = v3;
	                b = v1;
	            }
	            else if (i === 1) {
	                r = v2;
	                g = V;
	                b = v1;
	            }
	            else if (i === 2) {
	                r = v1;
	                g = V;
	                b = v3;
	            }
	            else if (i === 3) {
	                r = v1;
	                g = v2;
	                b = V;
	            }
	            else if (i === 4) {
	                r = v3;
	                g = v1;
	                b = V;
	            }
	            else {
	                r = V;
	                g = v1;
	                b = v2;
	            }

	            // RGB results from 0 to 255
	            R = r * 255;
	            G = g * 255;
	            B = b * 255;
	        }
	        return [ R, G, B ];
	    }

	    function _HSL_2_RGB(data) {
	        var H = data[0];
	        var S = data[1];
	        var L = data[2];
	        // HSL from 0 to 1
	        var R;
	        var G;
	        var B;
	        if (S === 0) {
	            R = L * 255;
	            G = L * 255;
	            B = L * 255;
	        }
	        else {
	            var v2;
	            if (L < 0.5) {
	                v2 = L * (1 + S);
	            }
	            else {
	                v2 = (L + S) - (S * L);
	            }

	            var v1 = 2 * L - v2;

	            R = 255 * _HUE_2_RGB(v1, v2, H + (1 / 3));
	            G = 255 * _HUE_2_RGB(v1, v2, H);
	            B = 255 * _HUE_2_RGB(v1, v2, H - (1 / 3));
	        }
	        return [ R, G, B ];
	    }

	    function _HUE_2_RGB(v1, v2, vH) {
	        if (vH < 0) {
	            vH += 1;
	        }
	        if (vH > 1) {
	            vH -= 1;
	        }
	        if ((6 * vH) < 1) {
	            return (v1 + (v2 - v1) * 6 * vH);
	        }
	        if ((2 * vH) < 1) {
	            return (v2);
	        }
	        if ((3 * vH) < 2) {
	            return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
	        }
	        return v1;
	    }

	    function _RGB_2_HSB(data) {
	        // RGB from 0 to 255
	        var R = (data[0] / 255);
	        var G = (data[1] / 255);
	        var B = (data[2] / 255);

	        var vMin = Math.min(R, G, B); // Min. value of RGB
	        var vMax = Math.max(R, G, B); // Max. value of RGB
	        var delta = vMax - vMin; // Delta RGB value
	        var V = vMax;
	        var H;
	        var S;

	        // HSV results from 0 to 1
	        if (delta === 0) {
	            H = 0;
	            S = 0;
	        }
	        else {
	            S = delta / vMax;

	            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
	            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
	            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

	            if (R === vMax) {
	                H = deltaB - deltaG;
	            }
	            else if (G === vMax) {
	                H = (1 / 3) + deltaR - deltaB;
	            }
	            else if (B === vMax) {
	                H = (2 / 3) + deltaG - deltaR;
	            }

	            if (H < 0) {
	                H += 1;
	            }
	            if (H > 1) {
	                H -= 1;
	            }
	        }
	        H = H * 360;
	        S = S * 100;
	        V = V * 100;
	        return [ H, S, V ];
	    }

	    function _RGB_2_HSL(data) {
	        // RGB from 0 to 255
	        var R = (data[0] / 255);
	        var G = (data[1] / 255);
	        var B = (data[2] / 255);

	        var vMin = Math.min(R, G, B); // Min. value of RGB
	        var vMax = Math.max(R, G, B); // Max. value of RGB
	        var delta = vMax - vMin; // Delta RGB value

	        var L = (vMax + vMin) / 2;
	        var H;
	        var S;
	        // HSL results from 0 to 1
	        if (delta === 0) {
	            H = 0;
	            S = 0;
	        }
	        else {
	            if (L < 0.5) {
	                S = delta / (vMax + vMin);
	            }
	            else {
	                S = delta / (2 - vMax - vMin);
	            }

	            var deltaR = (((vMax - R) / 6) + (delta / 2)) / delta;
	            var deltaG = (((vMax - G) / 6) + (delta / 2)) / delta;
	            var deltaB = (((vMax - B) / 6) + (delta / 2)) / delta;

	            if (R === vMax) {
	                H = deltaB - deltaG;
	            }
	            else if (G === vMax) {
	                H = (1 / 3) + deltaR - deltaB;
	            }
	            else if (B === vMax) {
	                H = (2 / 3) + deltaG - deltaR;
	            }

	            if (H < 0) {
	                H += 1;
	            }

	            if (H > 1) {
	                H -= 1;
	            }
	        }

	        H = H * 360;
	        S = S * 100;
	        L = L * 100;

	        return [ H, S, L ];
	    }

	    return {
	        customPalette : customPalette,
	        resetPalette : resetPalette,
	        getColor : getColor,
	        getHighlightColor : getHighlightColor,
	        customHighlight : customHighlight,
	        resetHighlight : resetHighlight,
	        getRadialGradient : getRadialGradient,
	        getLinearGradient : getLinearGradient,
	        getGradientColors : getGradientColors,
	        getStepColors : getStepColors,
	        reverse : reverse,
	        mix : mix,
	        lift : lift,
	        trim : trim,
	        random : random,
	        toRGB : toRGB,
	        toRGBA : toRGBA,
	        toHex : toHex,
	        toHSL : toHSL,
	        toHSLA : toHSLA,
	        toHSB : toHSB,
	        toHSBA : toHSBA,
	        toHSV : toHSV,
	        toHSVA : toHSVA,
	        toName : toName,
	        toColor : toColor,
	        toArray : toArray,
	        alpha : alpha,
	        getData : getData
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 虚线lineTo 
	 *
	 * author:  Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *          errorrik (errorrik@gmail.com)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (/* require */) {

	        var dashPattern = [ 5, 5 ];
	        /**
	         * 虚线lineTo 
	         */
	        return function (ctx, x1, y1, x2, y2, dashLength) {
	            // http://msdn.microsoft.com/en-us/library/ie/dn265063(v=vs.85).aspx
	            if (ctx.setLineDash) {
	                dashPattern[0] = dashPattern[1] = dashLength;
	                ctx.setLineDash(dashPattern);
	                ctx.moveTo(x1, y1);
	                ctx.lineTo(x2, y2);
	                return;
	            }

	            dashLength = typeof dashLength != 'number'
	                            ? 5 
	                            : dashLength;

	            var dx = x2 - x1;
	            var dy = y2 - y1;
	            var numDashes = Math.floor(
	                Math.sqrt(dx * dx + dy * dy) / dashLength
	            );
	            dx = dx / numDashes;
	            dy = dy / numDashes;
	            var flag = true;
	            for (var i = 0; i < numDashes; ++i) {
	                if (flag) {
	                    ctx.moveTo(x1, y1);
	                }
	                else {
	                    ctx.lineTo(x1, y1);
	                }
	                flag = !flag;
	                x1 += dx;
	                y1 += dy;
	            }
	            ctx.lineTo(x2, y2);
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 多边形
	 * @module zrender/shape/Polygon
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @example
	 *     var Polygon = require('zrender/shape/Polygon');
	 *     var shape = new Polygon({
	 *         style: {
	 *             // 100x100的正方形
	 *             pointList: [[0, 0], [100, 0], [100, 100], [0, 100]],
	 *             color: 'blue'
	 *         }
	 *     });
	 *     zr.addShape(shape);
	 */

	/**
	 * @typedef {Object} IPolygonStyle
	 * @property {string} pointList 多边形顶点数组
	 * @property {string} [smooth=''] 是否做平滑插值, 平滑算法可以选择 bezier, spline
	 * @property {number} [smoothConstraint] 平滑约束
	 * @property {string} [brushType='fill']
	 * @property {string} [color='#000000'] 填充颜色
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var Base = __webpack_require__(12);
	        var smoothSpline = __webpack_require__(20);
	        var smoothBezier = __webpack_require__(21);
	        var dashedLineTo = __webpack_require__(18);

	        /**
	         * @alias module:zrender/shape/Polygon
	         * @param {Object} options
	         * @constructor
	         * @extends module:zrender/shape/Base
	         */
	        var Polygon = function (options) {
	            Base.call(this, options);
	            /**
	             * 多边形绘制样式
	             * @name module:zrender/shape/Polygon#style
	             * @type {module:zrender/shape/Polygon~IPolygonStyle}
	             */
	            /**
	             * 多边形高亮绘制样式
	             * @name module:zrender/shape/Polygon#highlightStyle
	             * @type {module:zrender/shape/Polygon~IPolygonStyle}
	             */
	        };

	        Polygon.prototype = {
	            type: 'polygon',

	            /**
	             * 创建多边形路径
	             * @param {CanvasRenderingContext2D} ctx
	             * @param {module:zrender/shape/Polygon~IPolygonStyle} style
	             */
	            buildPath : function (ctx, style) {
	                // 虽然能重用brokenLine，但底层图形基于性能考虑，重复代码减少调用吧
	                var pointList = style.pointList;
	                // 开始点和结束点重复
	                /*
	                var start = pointList[0];
	                var end = pointList[pointList.length-1];

	                if (start && end) {
	                    if (start[0] == end[0] &&
	                        start[1] == end[1]) {
	                        // 移除最后一个点
	                        pointList.pop();
	                    }
	                }
	                */

	                if (pointList.length < 2) {
	                    // 少于2个点就不画了~
	                    return;
	                }

	                if (style.smooth && style.smooth !== 'spline') {
	                    var controlPoints = smoothBezier(
	                        pointList, style.smooth, true, style.smoothConstraint
	                    );

	                    ctx.moveTo(pointList[0][0], pointList[0][1]);
	                    var cp1;
	                    var cp2;
	                    var p;
	                    var len = pointList.length;
	                    for (var i = 0; i < len; i++) {
	                        cp1 = controlPoints[i * 2];
	                        cp2 = controlPoints[i * 2 + 1];
	                        p = pointList[(i + 1) % len];
	                        ctx.bezierCurveTo(
	                            cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
	                        );
	                    }
	                } 
	                else {
	                    if (style.smooth === 'spline') {
	                        pointList = smoothSpline(pointList, true);
	                    }

	                    if (!style.lineType || style.lineType == 'solid') {
	                        // 默认为实线
	                        ctx.moveTo(pointList[0][0], pointList[0][1]);
	                        for (var i = 1, l = pointList.length; i < l; i++) {
	                            ctx.lineTo(pointList[i][0], pointList[i][1]);
	                        }
	                        ctx.lineTo(pointList[0][0], pointList[0][1]);
	                    }
	                    else if (style.lineType == 'dashed'
	                            || style.lineType == 'dotted'
	                    ) {
	                        var dashLength = 
	                            style._dashLength
	                            || (style.lineWidth || 1) 
	                               * (style.lineType == 'dashed' ? 5 : 1);
	                        style._dashLength = dashLength;
	                        ctx.moveTo(pointList[0][0], pointList[0][1]);
	                        for (var i = 1, l = pointList.length; i < l; i++) {
	                            dashedLineTo(
	                                ctx,
	                                pointList[i - 1][0], pointList[i - 1][1],
	                                pointList[i][0], pointList[i][1],
	                                dashLength
	                            );
	                        }
	                        dashedLineTo(
	                            ctx,
	                            pointList[pointList.length - 1][0], 
	                            pointList[pointList.length - 1][1],
	                            pointList[0][0],
	                            pointList[0][1],
	                            dashLength
	                        );
	                    }
	                }

	                ctx.closePath();
	                return;
	            },

	            /**
	             * 计算返回多边形包围盒矩阵
	             * @param {module:zrender/shape/Polygon~IPolygonStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect : function (style) {
	                if (style.__rect) {
	                    return style.__rect;
	                }
	                
	                var minX =  Number.MAX_VALUE;
	                var maxX =  Number.MIN_VALUE;
	                var minY = Number.MAX_VALUE;
	                var maxY = Number.MIN_VALUE;

	                var pointList = style.pointList;
	                for (var i = 0, l = pointList.length; i < l; i++) {
	                    if (pointList[i][0] < minX) {
	                        minX = pointList[i][0];
	                    }
	                    if (pointList[i][0] > maxX) {
	                        maxX = pointList[i][0];
	                    }
	                    if (pointList[i][1] < minY) {
	                        minY = pointList[i][1];
	                    }
	                    if (pointList[i][1] > maxY) {
	                        maxY = pointList[i][1];
	                    }
	                }

	                var lineWidth;
	                if (style.brushType == 'stroke' || style.brushType == 'fill') {
	                    lineWidth = style.lineWidth || 1;
	                }
	                else {
	                    lineWidth = 0;
	                }
	                
	                style.__rect = {
	                    x : Math.round(minX - lineWidth / 2),
	                    y : Math.round(minY - lineWidth / 2),
	                    width : maxX - minX + lineWidth,
	                    height : maxY - minY + lineWidth
	                };
	                return style.__rect;
	            }
	        };

	        __webpack_require__(5).inherits(Polygon, Base);
	        return Polygon;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Catmull-Rom spline 插值折线
	 * @module zrender/shape/util/smoothSpline
	 * @author pissang (https://www.github.com/pissang) 
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var vector = __webpack_require__(9);

	        /**
	         * @inner
	         */
	        function interpolate(p0, p1, p2, p3, t, t2, t3) {
	            var v0 = (p2 - p0) * 0.5;
	            var v1 = (p3 - p1) * 0.5;
	            return (2 * (p1 - p2) + v0 + v1) * t3 
	                    + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                    + v0 * t + p1;
	        }

	        /**
	         * @alias module:zrender/shape/util/smoothSpline
	         * @param {Array} points 线段顶点数组
	         * @param {boolean} isLoop
	         * @param {Array} constraint 
	         * @return {Array}
	         */
	        return function (points, isLoop, constraint) {
	            var len = points.length;
	            var ret = [];

	            var distance = 0;
	            for (var i = 1; i < len; i++) {
	                distance += vector.distance(points[i - 1], points[i]);
	            }
	            
	            var segs = distance / 5;
	            segs = segs < len ? len : segs;
	            for (var i = 0; i < segs; i++) {
	                var pos = i / (segs - 1) * (isLoop ? len : len - 1);
	                var idx = Math.floor(pos);

	                var w = pos - idx;

	                var p0;
	                var p1 = points[idx % len];
	                var p2;
	                var p3;
	                if (!isLoop) {
	                    p0 = points[idx === 0 ? idx : idx - 1];
	                    p2 = points[idx > len - 2 ? len - 1 : idx + 1];
	                    p3 = points[idx > len - 3 ? len - 1 : idx + 2];
	                }
	                else {
	                    p0 = points[(idx - 1 + len) % len];
	                    p2 = points[(idx + 1) % len];
	                    p3 = points[(idx + 2) % len];
	                }

	                var w2 = w * w;
	                var w3 = w * w2;

	                ret.push([
	                    interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
	                    interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)
	                ]);
	            }
	            return ret;
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 贝塞尔平滑曲线 
	 * @module zrender/shape/util/smoothBezier
	 * @author pissang (https://www.github.com/pissang) 
	 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var vector = __webpack_require__(9);

	        /**
	         * 贝塞尔平滑曲线
	         * @alias module:zrender/shape/util/smoothBezier
	         * @param {Array} points 线段顶点数组
	         * @param {number} smooth 平滑等级, 0-1
	         * @param {boolean} isLoop
	         * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
	         *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
	         *                           整个折线的包围盒做一个并集用来约束控制点。
	         * @param {Array} 计算出来的控制点数组
	         */
	        return function (points, smooth, isLoop, constraint) {
	            var cps = [];

	            var v = [];
	            var v1 = [];
	            var v2 = [];
	            var prevPoint;
	            var nextPoint;

	            var hasConstraint = !!constraint;
	            var min, max;
	            if (hasConstraint) {
	                min = [Infinity, Infinity];
	                max = [-Infinity, -Infinity];
	                for (var i = 0, len = points.length; i < len; i++) {
	                    vector.min(min, min, points[i]);
	                    vector.max(max, max, points[i]);
	                }
	                // 与指定的包围盒做并集
	                vector.min(min, min, constraint[0]);
	                vector.max(max, max, constraint[1]);
	            }

	            for (var i = 0, len = points.length; i < len; i++) {
	                var point = points[i];
	                var prevPoint;
	                var nextPoint;

	                if (isLoop) {
	                    prevPoint = points[i ? i - 1 : len - 1];
	                    nextPoint = points[(i + 1) % len];
	                } 
	                else {
	                    if (i === 0 || i === len - 1) {
	                        cps.push(vector.clone(points[i]));
	                        continue;
	                    } 
	                    else {
	                        prevPoint = points[i - 1];
	                        nextPoint = points[i + 1];
	                    }
	                }

	                vector.sub(v, nextPoint, prevPoint);

	                // use degree to scale the handle length
	                vector.scale(v, v, smooth);

	                var d0 = vector.distance(point, prevPoint);
	                var d1 = vector.distance(point, nextPoint);
	                var sum = d0 + d1;
	                if (sum !== 0) {
	                    d0 /= sum;
	                    d1 /= sum;
	                }

	                vector.scale(v1, v, -d0);
	                vector.scale(v2, v, d1);
	                var cp0 = vector.add([], point, v1);
	                var cp1 = vector.add([], point, v2);
	                if (hasConstraint) {
	                    vector.max(cp0, cp0, min);
	                    vector.min(cp0, cp0, max);
	                    vector.max(cp1, cp1, min);
	                    vector.min(cp1, cp1, max);
	                }
	                cps.push(cp0);
	                cps.push(cp1);
	            }
	            
	            if (isLoop) {
	                cps.push(vector.clone(cps.shift()));
	            }

	            return cps;
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @module zrender/shape/Text
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @example
	 *     var Text = require('zrender/shape/Text');
	 *     var shape = new Text({
	 *         style: {
	 *             text: 'Label',
	 *             x: 100,
	 *             y: 100,
	 *             textFont: '14px Arial'
	 *         }
	 *     });
	 *     zr.addShape(shape);
	 */

	/**
	 * @typedef {Object} ITextStyle
	 * @property {number} x 横坐标
	 * @property {number} y 纵坐标
	 * @property {string} text 文本内容
	 * @property {number} [maxWidth=null] 最大宽度限制
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textAlign] 可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 * @property {string} [brushType='fill']
	 * @property {string} [color='#000000'] 填充颜色
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var area = __webpack_require__(15);
	        var Base = __webpack_require__(12);
	        
	        /**
	         * @alias module:zrender/shape/Text
	         * @constructor
	         * @extends module:zrender/shape/Base
	         * @param {Object} options
	         */
	        var Text = function (options) {
	            Base.call(this, options);
	            /**
	             * 文字绘制样式
	             * @name module:zrender/shape/Text#style
	             * @type {module:zrender/shape/Text~ITextStyle}
	             */
	            /**
	             * 文字高亮绘制样式
	             * @name module:zrender/shape/Text#highlightStyle
	             * @type {module:zrender/shape/Text~ITextStyle}
	             */
	        };

	        Text.prototype =  {
	            type: 'text',

	            brush : function (ctx, isHighlight) {
	                var style = this.style;
	                if (isHighlight) {
	                    // 根据style扩展默认高亮样式
	                    style = this.getHighlightStyle(
	                        style, this.highlightStyle || {}
	                    );
	                }
	                
	                if (typeof(style.text) == 'undefined' || style.text === false) {
	                    return;
	                }

	                ctx.save();
	                this.doClip(ctx);

	                this.setContext(ctx, style);

	                // 设置transform
	                this.setTransform(ctx);

	                if (style.textFont) {
	                    ctx.font = style.textFont;
	                }
	                ctx.textAlign = style.textAlign || 'start';
	                ctx.textBaseline = style.textBaseline || 'middle';

	                var text = (style.text + '').split('\n');
	                var lineHeight = area.getTextHeight('国', style.textFont);
	                var rect = this.getRect(style);
	                var x = style.x;
	                var y;
	                if (style.textBaseline == 'top') {
	                    y = rect.y;
	                }
	                else if (style.textBaseline == 'bottom') {
	                    y = rect.y + lineHeight;
	                }
	                else {
	                    y = rect.y + lineHeight / 2;
	                }
	                
	                for (var i = 0, l = text.length; i < l; i++) {
	                    if (style.maxWidth) {
	                        switch (style.brushType) {
	                            case 'fill':
	                                ctx.fillText(
	                                    text[i],
	                                    x, y, style.maxWidth
	                                );
	                                break;
	                            case 'stroke':
	                                ctx.strokeText(
	                                    text[i],
	                                    x, y, style.maxWidth
	                                );
	                                break;
	                            case 'both':
	                                ctx.fillText(
	                                    text[i],
	                                    x, y, style.maxWidth
	                                );
	                                ctx.strokeText(
	                                    text[i],
	                                    x, y, style.maxWidth
	                                );
	                                break;
	                            default:
	                                ctx.fillText(
	                                    text[i],
	                                    x, y, style.maxWidth
	                                );
	                        }
	                    }
	                    else {
	                        switch (style.brushType) {
	                            case 'fill':
	                                ctx.fillText(text[i], x, y);
	                                break;
	                            case 'stroke':
	                                ctx.strokeText(text[i], x, y);
	                                break;
	                            case 'both':
	                                ctx.fillText(text[i], x, y);
	                                ctx.strokeText(text[i], x, y);
	                                break;
	                            default:
	                                ctx.fillText(text[i], x, y);
	                        }
	                    }
	                    y += lineHeight;
	                }

	                ctx.restore();
	                return;
	            },

	            /**
	             * 返回文字包围盒矩形
	             * @param {module:zrender/shape/Text~ITextStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect : function (style) {
	                if (style.__rect) {
	                    return style.__rect;
	                }
	                
	                var width = area.getTextWidth(style.text, style.textFont);
	                var height = area.getTextHeight(style.text, style.textFont);
	                
	                var textX = style.x;                 // 默认start == left
	                if (style.textAlign == 'end' || style.textAlign == 'right') {
	                    textX -= width;
	                }
	                else if (style.textAlign == 'center') {
	                    textX -= (width / 2);
	                }

	                var textY;
	                if (style.textBaseline == 'top') {
	                    textY = style.y;
	                }
	                else if (style.textBaseline == 'bottom') {
	                    textY = style.y - height;
	                }
	                else {
	                    // middle
	                    textY = style.y - height / 2;
	                }

	                style.__rect = {
	                    x : textX,
	                    y : textY,
	                    width : width,
	                    height : height
	                };
	                
	                return style.__rect;
	            }
	        };

	        __webpack_require__(5).inherits(Text, Base);
	        return Text;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 数据处理工具组件, 计算Y轴的坐标像素位置和年份值的对应关系
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {


	        var DataManager = function (graphConfig, penaltyData) {
	            graphConfig.height = 0;
	            for (var i = 0, rangeConfig; i < penaltyData.rangeInfo.rangeConfigArr.length; i++) {

	                rangeConfig = penaltyData.rangeInfo.rangeConfigArr[i];
	                if (i == 0 && rangeConfig.start != penaltyData.rangeInfo.rangeStart) {
	                    throw new Error("rangeInfo配置不合理，起始刻度和刻度配置不一致");
	                }
	                if (i > 0 && rangeConfig.start != penaltyData.rangeInfo.rangeConfigArr[i - 1].end) {
	                    throw new Error("rangeInfo配置不合理，刻度配置不连续");
	                }
	                if (i == penaltyData.rangeInfo.rangeConfigArr.length - 1 &&
	                    rangeConfig.end != penaltyData.rangeInfo.rangeEnd) {
	                    throw new Error("rangeInfo配置不合理，终止刻度和刻度配置不一致");
	                }
	                for (var j = rangeConfig.start; j < rangeConfig.end; j++) {
	                    graphConfig.height += rangeConfig.unitHeight;
	                }
	            }
	            this.graphConfig = graphConfig;
	            this.penaltyData = penaltyData;
	        };


	        DataManager.prototype.getYMShowText = function (penaltyCount) {
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

	            var penaltyStart = this.penaltyData.rangeInfo.rangeStart;
	            //计算当前值到量刑原点的距离
	            var distanceFromStart = 0;
	            outter: for (var i = 0, rangeConfig, latestUnitHeight; i < this.penaltyData.rangeInfo.rangeConfigArr.length; i++) {
	                rangeConfig = this.penaltyData.rangeInfo.rangeConfigArr[i];
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
	                        var nextRangeConfig = this.penaltyData.rangeInfo.rangeConfigArr[i + 1];
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
	            //当前实际Y到量刑原点的像素距离
	            var distanceFromStart = this.graphConfig.height - y;

	            var penaltyCount = this.penaltyData.rangeInfo.rangeStart;

	            //初始值为刻度起始值，往上累加,找到最接近的整数后进行计算
	            var countHeight = 0;
	            outter: for (var i = 0, rangeConfig; i < this.penaltyData.rangeInfo.rangeConfigArr.length; i++) {
	                rangeConfig = this.penaltyData.rangeInfo.rangeConfigArr[i];
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
	                        var nextConfig = this.penaltyData.rangeInfo.rangeConfigArr[i + 1];
	                        penaltyCount = j + (distanceFromStart - countHeight) / nextConfig.unitHeight;
	                        break outter;
	                    }
	                }
	            }
	            if (penaltyCount > this.penaltyData.rangeInfo.rangeEnd) {
	                return this.penaltyData.rangeInfo.rangeEnd;
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
	         * 计算第一层面要素的值，需要根据上个点的值、当前百分比
	         * 计算  preData.count * （1 +/- currPercent ）
	         */
	        function getLevel1CountData(penaltyData, preData, currPercent, factorConfig) {
	            var countData = {
	                level: 1,
	                preData: preData,
	                countWay: factorConfig.countWay,
	                changeMax: factorConfig.changeMax,
	                changeMin: factorConfig.changeMin
	            };
	            var offset = penaltyData.rangeInfo.caliber / 2;
	            var isAdd = 1 == factorConfig.countWay || 'add' == factorConfig.countWay || 'ADD' == factorConfig.countWay;
	            //根据上个中点计算出下个中点
	            if (isAdd) {
	                countData.rangeHigh = preData.highCount * (1 + factorConfig.changeMax / 100);
	                countData.rangeLow = preData.lowCount * (1 + factorConfig.changeMin / 100);
	                countData.count = preData.count * (1 + currPercent / 100);
	            } else {
	                countData.rangeHigh = preData.highCount * (1 - factorConfig.changeMin / 100);
	                countData.rangeLow = preData.lowCount * (1 - factorConfig.changeMax / 100);
	                countData.count = preData.count * (1 - currPercent / 100);
	            }
	            fixCountData(penaltyData, countData);

	            countData.highCount = countData.count + offset;
	            countData.highCount = countData.rangeHigh < countData.highCount ? countData.rangeHigh : countData.highCount;
	            countData.lowCount = countData.count - offset;
	            countData.lowCount = countData.rangeLow > countData.lowCount ? countData.rangeLow : countData.lowCount;

	            if (isAdd) {
	                countData.percent = (countData.count / preData.count - 1) * 100;
	            } else {
	                countData.percent = (1 - countData.count / preData.count) * 100;
	            }
	            return countData;
	        }

	        /**
	         * 计算第二层面要素的值，需要根据上个点的值、基数的值、当前百分比
	         * 计算  preData.count +/- lastLevel1Data.count * currPercent;
	         */
	        function getLevel2CountData(penaltyData, lastLevel1Data, preData, currPercent, factorConfig) {
	            var countData = {
	                level: 2,
	                lastLevel1Data: lastLevel1Data,
	                preData: preData,
	                countWay: factorConfig.countWay,
	                changeMax: factorConfig.changeMax,
	                changeMin: factorConfig.changeMin
	            };
	            var offset = penaltyData.rangeInfo.caliber / 2;
	            var isAdd = 1 == factorConfig.countWay || 'add' == factorConfig.countWay || 'ADD' == factorConfig.countWay;
	            //如果上次计算时，被迫设置为最大最小值，比例可能不在配置范围内，先尝试恢复比例到最近的正常范围进行计算
	            if (isAdd) {
	                countData.count = preData.count + lastLevel1Data.count * currPercent / 100;
	                countData.rangeHigh = preData.highCount + lastLevel1Data.highCount * factorConfig.changeMax / 100;
	                countData.rangeLow = preData.lowCount + lastLevel1Data.lowCount * factorConfig.changeMin / 100;
	            } else {
	                countData.count = preData.count - lastLevel1Data.count * currPercent / 100;
	                countData.rangeHigh = preData.highCount - lastLevel1Data.highCount * factorConfig.changeMin / 100;
	                countData.rangeLow = preData.lowCount - lastLevel1Data.lowCount * factorConfig.changeMax / 100;
	            }
	            //如果按照正常范围算出来的值越界了，值为最大最小值，并计算当前比例（此时当前比例可能不在范围内）
	            fixCountData(penaltyData, countData);

	            //第二层面要素的中点并不能代表柱体所有的比例（非线性），因此给3个百分比,上，中，下，上下的计算方式为先计算柱体的上下端，再算上下端比例
	            countData.highCount = countData.count + offset;
	            countData.highCount = countData.rangeHigh < countData.highCount ? countData.rangeHigh : countData.highCount;
	            countData.lowCount = countData.count - offset;
	            countData.lowCount = countData.rangeLow > countData.lowCount ? countData.rangeLow : countData.lowCount;

	            if (isAdd) {
	                countData.percent = (countData.count - countData.preData.count) / countData.lastLevel1Data.count * 100;
	            } else {
	                countData.percent = (countData.preData.count - countData.count) / countData.lastLevel1Data.count * 100;
	            }
	            countData.percent = parseFloat(countData.percent.toFixed(5));
	            return countData;
	        }


	        function fixCountData(penaltyData, countData) {
	            //最小移动范围超过底部限制
	            var caliber = penaltyData.rangeInfo.caliber;
	            if (penaltyData.rangeInfo.rangeMin != null) {
	                var min = penaltyData.rangeInfo.rangeMin;
	                if (!hasLightenFactor(penaltyData)) {
	                    var min = penaltyData.rangeInfo.legalPenaltyLow;
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
	            if (penaltyData.rangeInfo.rangeMax != null) {
	                var max = penaltyData.rangeInfo.rangeMax;
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
	            if (countData.rangeHigh - countData.rangeLow < caliber) {
	                countData.count = (countData.rangeHigh + countData.rangeLow) / 2;
	            } else if (countData.count + caliber / 2 > countData.rangeHigh) {
	                countData.count = countData.rangeHigh - caliber / 2;
	            } else if (countData.count - caliber / 2 < countData.rangeLow) {
	                countData.count = countData.rangeLow + caliber / 2;
	            }

	            countData.rangeHigh = parseFloat(countData.rangeHigh.toFixed(5));
	            countData.rangeLow = parseFloat(countData.rangeLow.toFixed(5));
	            countData.count = parseFloat(countData.count.toFixed(5));
	        }

	        DataManager.prototype.recountPercent = function (countData) {
	            var isAdd = 1 == countData.countWay || 'add' == countData.countWay || 'ADD' == countData.countWay;
	            if (countData.level == 2) {
	                //第二层面要素的中点并不能代表柱体所有的比例（非线性），因此给3个百分比,上，中，下，上下的计算方式为先计算柱体的上下端，再算上下端比例
	                if (isAdd) {
	                    countData.percent = (countData.count - countData.preData.count) / countData.lastLevel1Data.count * 100;
	                } else {
	                    countData.percent = (countData.preData.count - countData.count) / countData.lastLevel1Data.count * 100;
	                }
	                countData.percent = parseFloat(countData.percent.toFixed(5));
	            }
	            if (countData.level == 1) {
	                var offset = penaltyData.rangeInfo.caliber / 2;
	                if (isAdd) {
	                    countData.percent = (countData.count / countData.preData.count - 1) * 100;
	                } else {
	                    countData.percent = (1 - countData.count / countData.preData.count) * 100;
	                }
	                countData.percent = parseFloat(countData.percent.toFixed(5));
	            }

	        }


	        DataManager.prototype.getCountDataArr = function (startPenalty, basePenalty, factorArr, redScrollBarArr) {
	            var countDataArr = [];
	            //计算红色坐标点、线、区域
	            var offset = penaltyData.rangeInfo.caliber / 2;
	            for (var i = 0, preData; i < factorArr.length; i++) {
	                //初始化当前坐标轴红色滚动条及其范围的数据
	                var scrollBarData;
	                if (i == 0) {
	                    scrollBarData = {
	                        id: 0,
	                        name: "量刑起点",
	                        count: startPenalty,
	                        lowCount : startPenalty - offset,
	                        highCount: startPenalty + offset
	                    }
	                } else if (i == 1) {
	                    scrollBarData = {
	                        id: 0,
	                        name: "基准刑",
	                        count: basePenalty,
	                        lowCount : basePenalty - offset,
	                        highCount: basePenalty + offset
	                    }
	                    lastLevel1Data = scrollBarData;
	                    preData = scrollBarData;
	                } else {
	                    var currPercent = (factorArr[i].changeMax + factorArr[i].changeMin) / 2;
	                    if (factorArr[i].percent != null) {
	                        currPercent = factorArr[i].percent;
	                    }
	                    if (redScrollBarArr) {
	                        currPercent = redScrollBarArr[i].scrollBarData.percent;
	                    }
	                    if (1 == factorArr[i].level) {
	                        scrollBarData = getLevel1CountData(this.penaltyData, preData, currPercent, factorArr[i]);
	                        lastLevel1Data = scrollBarData;
	                    } else {
	                        scrollBarData = getLevel2CountData(this.penaltyData, lastLevel1Data, preData, currPercent, factorArr[i]);
	                    }
	                    preData = scrollBarData;
	                    scrollBarData.id = factorArr[i].id;
	                    scrollBarData.name = factorArr[i].name;
	                }
	                scrollBarData.index = i;

	                countDataArr.push(scrollBarData);
	            }

	            return countDataArr
	        }

	        function hasLightenFactor(penaltyData) {
	            for (var i = 0; i < penaltyData.factorArr.length; i++) {
	                if (penaltyData.factorArr[i].type == 2 && penaltyData.factorArr[i].countWay == 2) {
	                    return true;
	                }
	            }
	            return false;
	        }

	        return DataManager;

	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	//BlueAreaGroup.js
	//蓝色区域的图形，历史数据，包含蓝色区域的坐标点和线、多边形蓝色块
	module.exports = function (graphConfig, penaltyData, zrender) {
	    var Group = __webpack_require__(3);
	    var BlueAreaGroup = __webpack_require__(3);
	    var Circle = __webpack_require__(25);
	    var Polygon = __webpack_require__(19);
	    var Line = __webpack_require__(11);
	    var Rectangle = __webpack_require__(26);
	    var DataManager = __webpack_require__(23);

	    var dataManager = new DataManager(graphConfig, penaltyData);


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

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 圆形
	 * @module zrender/shape/Circle
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @example
	 *   var Circle = require('zrender/shape/Circle');
	 *   var shape = new Circle({
	 *       style: {
	 *           x: 100,
	 *           y: 100,
	 *           r: 40,
	 *           brushType: 'both',
	 *           color: 'blue',
	 *           strokeColor: 'red',
	 *           lineWidth: 3,
	 *           text: 'Circle'
	 *       }    
	 *   });
	 *   zr.addShape(shape);
	 */

	/**
	 * @typedef {Object} ICircleStyle
	 * @property {number} x 圆心x坐标
	 * @property {number} y 圆心y坐标
	 * @property {number} r 半径
	 * @property {string} [brushType='fill']
	 * @property {string} [color='#000000'] 填充颜色
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        'use strict';

	        var Base = __webpack_require__(12);

	        /**
	         * @alias module:zrender/shape/Circle
	         * @constructor
	         * @extends module:zrender/shape/Base
	         * @param {Object} options
	         */
	        var Circle = function(options) {
	            Base.call(this, options);
	            /**
	             * 圆形绘制样式
	             * @name module:zrender/shape/Circle#style
	             * @type {module:zrender/shape/Circle~ICircleStyle}
	             */
	            /**
	             * 圆形高亮绘制样式
	             * @name module:zrender/shape/Circle#highlightStyle
	             * @type {module:zrender/shape/Circle~ICircleStyle}
	             */
	        };

	        Circle.prototype = {
	            type: 'circle',
	            /**
	             * 创建圆形路径
	             * @param {CanvasRenderingContext2D} ctx
	             * @param {module:zrender/shape/Circle~ICircleStyle} style
	             */
	            buildPath : function (ctx, style) {
	                // Better stroking in ShapeBundle
	                ctx.moveTo(style.x + style.r, style.y);
	                ctx.arc(style.x, style.y, style.r, 0, Math.PI * 2, true);
	                return;
	            },

	            /**
	             * 计算返回圆形的包围盒矩形
	             * @param {module:zrender/shape/Circle~ICircleStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect : function (style) {
	                if (style.__rect) {
	                    return style.__rect;
	                }
	                
	                var lineWidth;
	                if (style.brushType == 'stroke' || style.brushType == 'fill') {
	                    lineWidth = style.lineWidth || 1;
	                }
	                else {
	                    lineWidth = 0;
	                }
	                style.__rect = {
	                    x : Math.round(style.x - style.r - lineWidth / 2),
	                    y : Math.round(style.y - style.r - lineWidth / 2),
	                    width : style.r * 2 + lineWidth,
	                    height : style.r * 2 + lineWidth
	                };
	                
	                return style.__rect;
	            }
	        };

	        __webpack_require__(5).inherits(Circle, Base);
	        return Circle;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 矩形
	 * @module zrender/shape/Rectangle
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com) , 
	 *         strwind (@劲风FEI)
	 * @example
	 *     var Rectangle = require('zrender/shape/Rectangle');
	 *     var shape = new Rectangle({
	 *         style: {
	 *             x: 0,
	 *             y: 0,
	 *             width: 100,
	 *             height: 100,
	 *             radius: 20
	 *         }
	 *     });
	 *     zr.addShape(shape);
	 */

	/**
	 * @typedef {Object} IRectangleStyle
	 * @property {number} x 左上角x坐标
	 * @property {number} y 左上角y坐标
	 * @property {number} width 宽度
	 * @property {number} height 高度
	 * @property {number|Array.<number>} radius 矩形圆角，可以用数组分别指定四个角的圆角
	 * @property {string} [brushType='fill']
	 * @property {string} [color='#000000'] 填充颜色
	 * @property {string} [strokeColor='#000000'] 描边颜色
	 * @property {string} [lineCape='butt'] 线帽样式，可以是 butt, round, square
	 * @property {number} [lineWidth=1] 描边宽度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        var Base = __webpack_require__(12);
	        
	        /**
	         * @alias module:zrender/shape/Rectangle
	         * @constructor
	         * @extends module:zrender/shape/Base
	         * @param {Object} options
	         */
	        var Rectangle = function (options) {
	            Base.call(this, options);
	            /**
	             * 矩形绘制样式
	             * @name module:zrender/shape/Rectangle#style
	             * @type {module:zrender/shape/Rectangle~IRectangleStyle}
	             */
	            /**
	             * 矩形高亮绘制样式
	             * @name module:zrender/shape/Rectangle#highlightStyle
	             * @type {module:zrender/shape/Rectangle~IRectangleStyle}
	             */
	        };

	        Rectangle.prototype =  {
	            type: 'rectangle',

	            _buildRadiusPath: function (ctx, style) {
	                // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
	                // r缩写为1         相当于 [1, 1, 1, 1]
	                // r缩写为[1]       相当于 [1, 1, 1, 1]
	                // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
	                // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
	                var x = style.x;
	                var y = style.y;
	                var width = style.width;
	                var height = style.height;
	                var r = style.radius;
	                var r1; 
	                var r2; 
	                var r3; 
	                var r4;
	                  
	                if (typeof r === 'number') {
	                    r1 = r2 = r3 = r4 = r;
	                }
	                else if (r instanceof Array) {
	                    if (r.length === 1) {
	                        r1 = r2 = r3 = r4 = r[0];
	                    }
	                    else if (r.length === 2) {
	                        r1 = r3 = r[0];
	                        r2 = r4 = r[1];
	                    }
	                    else if (r.length === 3) {
	                        r1 = r[0];
	                        r2 = r4 = r[1];
	                        r3 = r[2];
	                    }
	                    else {
	                        r1 = r[0];
	                        r2 = r[1];
	                        r3 = r[2];
	                        r4 = r[3];
	                    }
	                }
	                else {
	                    r1 = r2 = r3 = r4 = 0;
	                }
	                
	                var total;
	                if (r1 + r2 > width) {
	                    total = r1 + r2;
	                    r1 *= width / total;
	                    r2 *= width / total;
	                }
	                if (r3 + r4 > width) {
	                    total = r3 + r4;
	                    r3 *= width / total;
	                    r4 *= width / total;
	                }
	                if (r2 + r3 > height) {
	                    total = r2 + r3;
	                    r2 *= height / total;
	                    r3 *= height / total;
	                }
	                if (r1 + r4 > height) {
	                    total = r1 + r4;
	                    r1 *= height / total;
	                    r4 *= height / total;
	                }
	                ctx.moveTo(x + r1, y);
	                ctx.lineTo(x + width - r2, y);
	                r2 !== 0 && ctx.quadraticCurveTo(
	                    x + width, y, x + width, y + r2
	                );
	                ctx.lineTo(x + width, y + height - r3);
	                r3 !== 0 && ctx.quadraticCurveTo(
	                    x + width, y + height, x + width - r3, y + height
	                );
	                ctx.lineTo(x + r4, y + height);
	                r4 !== 0 && ctx.quadraticCurveTo(
	                    x, y + height, x, y + height - r4
	                );
	                ctx.lineTo(x, y + r1);
	                r1 !== 0 && ctx.quadraticCurveTo(x, y, x + r1, y);
	            },
	            
	            /**
	             * 创建矩形路径
	             * @param {CanvasRenderingContext2D} ctx
	             * @param {Object} style
	             */
	            buildPath : function (ctx, style) {
	                if (!style.radius) {
	                    ctx.moveTo(style.x, style.y);
	                    ctx.lineTo(style.x + style.width, style.y);
	                    ctx.lineTo(style.x + style.width, style.y + style.height);
	                    ctx.lineTo(style.x, style.y + style.height);
	                    ctx.lineTo(style.x, style.y);
	                    // ctx.rect(style.x, style.y, style.width, style.height);
	                }
	                else {
	                    this._buildRadiusPath(ctx, style);
	                }
	                ctx.closePath();
	                return;
	            },

	            /**
	             * 计算返回矩形包围盒矩阵
	             * @param {module:zrender/shape/Rectangle~IRectangleStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect : function(style) {
	                if (style.__rect) {
	                    return style.__rect;
	                }
	                
	                var lineWidth;
	                if (style.brushType == 'stroke' || style.brushType == 'fill') {
	                    lineWidth = style.lineWidth || 1;
	                }
	                else {
	                    lineWidth = 0;
	                }
	                style.__rect = {
	                    x : Math.round(style.x - lineWidth / 2),
	                    y : Math.round(style.y - lineWidth / 2),
	                    width : style.width + lineWidth,
	                    height : style.height + lineWidth
	                };
	                
	                return style.__rect;
	            }
	        };

	        __webpack_require__(5).inherits(Rectangle, Base);
	        return Rectangle;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// RedAreaGroup.js
	module.exports = function (graphConfig, penaltyData, zrender) {
	    var RedAreaGroup = __webpack_require__(3);
	    var Group = __webpack_require__(3);
	    var Circle = __webpack_require__(25);
	    var Polygon = __webpack_require__(19);
	    var Line = __webpack_require__(11);
	    var Rectangle = __webpack_require__(26);
	    var DataManager = __webpack_require__(23);

	    var dataManager = new DataManager(graphConfig, penaltyData);

	    /**
	     * 绘制红色（多边形）区域
	     * @param index 下标
	     * @param leftBar 多边形区域左侧的滚动条
	     * @param rightBar 多边形区域右侧的滚动条
	     */
	    RedAreaGroup.prototype.addRedPolygonGroup = function (index, leftBar, rightBar) {
	        var redPolygonGroup = new Group({
	            'id': 'redPolygonGroup_' + index
	        });

	        var pointList = getPointList(leftBar, rightBar);
	        //上下红虚线
	        var startPoint = pointList[0];
	        var endPoint = pointList[3];
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

	        startPoint = pointList[1];
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

	        //细红线
	        startPoint = pointList[0];
	        endPoint = pointList[1];
	        redPolygonGroup.redLeftSolidLine = new Line({
	            'id': 'redLeftSolidLine_' + index,
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
	        redPolygonGroup.addChild(redPolygonGroup.redLeftSolidLine);

	        startPoint = pointList[2];
	        endPoint = pointList[3];
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

	        //四边形
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
	     * 根据左侧的滚动条和右侧的滚动条数据获取多边形的四个点
	     * 左侧点：左侧滚动条的上下顶点
	     * 右侧点：右侧滚动条的上下最大移动范围定点
	     */
	    function getPointList(leftBar, rightBar) {
	        var leftX = dataManager.converIndex2X(leftBar.scrollBarData.index);
	        var rightX = dataManager.converIndex2X(rightBar.scrollBarData.index);

	        var leftHY = dataManager.converPenalty2Y(leftBar.scrollBarData.highCount);
	        var leftLY = dataManager.converPenalty2Y(leftBar.scrollBarData.lowCount);

	        var rightHY = dataManager.converPenalty2Y(rightBar.scrollBarData.highCount);
	        if (rightBar.scrollBarData.rangeHigh != null) {
	            rightHY = dataManager.converPenalty2Y(rightBar.scrollBarData.rangeHigh);
	        }
	        var rightLY = dataManager.converPenalty2Y(rightBar.scrollBarData.lowCount);
	        if (rightBar.scrollBarData.rangeLow != null) {
	            rightLY = dataManager.converPenalty2Y(rightBar.scrollBarData.rangeLow);
	        }
	        return [
	            [leftX, leftHY],
	            [leftX, leftLY],
	            [rightX, rightLY],
	            [rightX, rightHY]
	        ];
	    }


	    /**
	     * 更新红色（多边形）区域的数据和图形位置
	     * @param index 下标
	     * @param leftBar 多边形区域左侧的滚动条
	     * @param rightBar 多边形区域右侧的滚动条
	     */
	    RedAreaGroup.prototype.updateRedPolygonGroup = function (index, leftBar, rightBar) {

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
	        var pointList = getPointList(leftBar, rightBar);

	        //上下红虚线
	        var startPoint = pointList[0];
	        var endPoint = pointList[3];
	        redPolygonGroup.redHighDashLine.style = {
	            xStart: startPoint[0],
	            yStart: startPoint[1],
	            xEnd: endPoint[0],
	            yEnd: endPoint[1],
	            strokeColor: '#EDB3C1',
	            lineWidth: 1,
	            lineType: 'dashed'
	        }
	        startPoint = pointList[1];
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
	        //细红线
	        startPoint = pointList[0];
	        endPoint = pointList[1];
	        redPolygonGroup.redLeftSolidLine.style = {
	            xStart: startPoint[0],
	            yStart: startPoint[1],
	            xEnd: endPoint[0],
	            yEnd: endPoint[1],
	            strokeColor: '#EB6877',
	            lineWidth: 1
	        }
	        startPoint = pointList[2];
	        endPoint = pointList[3];
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
	     * @param scrollBarData 滚动条对应的数据
	     */
	    RedAreaGroup.prototype.addRedScrollBar = function (scrollBarData) {
	        var scrollBarGroup = new Group({
	            'id': 'redScrollBar_' + scrollBarData.index
	        });
	        //记录当前图形位置对应的数据域,滚动条的高低位置
	        scrollBarGroup.scrollBarData = scrollBarData;

	        var barTopY = dataManager.converPenalty2Y(scrollBarData.highCount);
	        var barBottomY = dataManager.converPenalty2Y(scrollBarData.lowCount);
	        var x = dataManager.converIndex2X(scrollBarData.index);

	        //粗红柱子
	        scrollBarGroup.redMarkLine = new Line({
	            'id': 'redMarkLine_' + scrollBarData.index,
	            zlevel: 113,
	            style: {
	                xStart: x,
	                yStart: barBottomY,
	                xEnd: x,
	                yEnd: barTopY,
	                strokeColor: '#EE8490',
	                lineWidth: 6,
	                opacity: 0.7
	            },
	            highlightStyle: {
	                opacity: 0.7
	            },
	            hoverable: false,
	            draggable: graphConfig.display ? false : true,
	            clickable: true,
	            ondrift: scrollBarDrift,
	            onmouseover: zrender.showHint,
	            onmouseout: zrender.hideHint,
	            getHintText: function () {
	                return getShowPenaltyText(this.parent);
	            }
	        })
	        scrollBarGroup.addChild(scrollBarGroup.redMarkLine);

	        this.addChild(scrollBarGroup);
	        return scrollBarGroup;
	    };


	    /**
	     * 更新滑块区域的数据并修改图形位置
	     * 只更新最大和最小变化范围，滚动条的位置根据之前百分比计算
	     * @param scrollBarData 新数据
	     */
	    RedAreaGroup.prototype.updateRedScrollBar = function (scrollBarData) {
	        var scrollBarGroup;
	        for (var i = 0; i < this.redScrollBarArr.length; i++) {
	            if ('redScrollBar_' + scrollBarData.index == this.redScrollBarArr[i].id) {
	                scrollBarGroup = this.redScrollBarArr[i];
	                break;
	            }
	        }
	        if (!scrollBarGroup) {
	            return;
	        }
	        scrollBarGroup.scrollBarData = scrollBarData;

	        //根据新数据绘制图像位置
	        var barTopY = dataManager.converPenalty2Y(scrollBarData.highCount);
	        var barBottomY = dataManager.converPenalty2Y(scrollBarData.lowCount);
	        var x = dataManager.converIndex2X(scrollBarData.index);
	        scrollBarGroup.redMarkLine.style = {
	            xStart: x,
	            yStart: barBottomY,
	            xEnd: x,
	            yEnd: barTopY,
	            strokeColor: '#EE8490',
	            lineWidth: 5
	        }

	        zrender.modGroup(scrollBarGroup.id);
	        return scrollBarGroup;
	    };

	    /**
	     * 拖动滚动条的事件处理: 限制拖动范围和图形联动
	     * @param dx
	     * @param dy
	     */
	    function scrollBarDrift(dx, dy) {
	        zrender.hideHint(this);
	        var scrollBarGroup = this.parent;
	        var scrollBarData = scrollBarGroup.scrollBarData;
	        var redAreaGroup = scrollBarGroup.parent;

	        //当前中点位置
	        var middlePointY = dataManager.converPenalty2Y(scrollBarData.count);

	        //原点在Y轴上的最大位移（向上向下）
	        var yearOffset = penaltyData.rangeInfo.caliber / 2;

	        if (scrollBarData.index == 0) {
	            //量刑起点的变动范围，与需求确认后：不能高于当前基准刑，不能低于法定刑
	            var currentBarBottomY = dataManager.converPenalty2Y((scrollBarData.count - yearOffset));
	            var legalPLowY = dataManager.converPenalty2Y(penaltyData.rangeInfo.legalPenaltyLow);
	            moveLowerY = legalPLowY - currentBarBottomY;
	            var basePScrollBarData = redAreaGroup.redScrollBarArr[1].scrollBarData;
	            var basePBarTopY = dataManager.converPenalty2Y(basePScrollBarData.count + yearOffset);
	            moveUpperY = basePBarTopY - dataManager.converPenalty2Y((scrollBarData.count + yearOffset));
	        } else if (scrollBarData.index == 1) {
	            //基准刑变动范围，与需求确认后：不能高于法定刑，不能低于量刑起点
	            var currentBarTopY = dataManager.converPenalty2Y(scrollBarData.count + yearOffset);
	            var legalPHighY = dataManager.converPenalty2Y(penaltyData.rangeInfo.legalPenaltyHigh);
	            moveUpperY = legalPHighY - currentBarTopY;
	            var startPScrollBarData = redAreaGroup.redScrollBarArr[0].scrollBarData;
	            var startPBarBottomY = dataManager.converPenalty2Y(startPScrollBarData.count - yearOffset);
	            moveLowerY = startPBarBottomY - dataManager.converPenalty2Y((scrollBarData.count - yearOffset));
	        } else {
	            //要素区的移动范围为当前计算结果的浮动范围
	            var moveUpperY = dataManager.converPenalty2Y(scrollBarData.rangeHigh) - dataManager.converPenalty2Y((scrollBarData.count + yearOffset));
	            if (scrollBarData.rangeHigh < scrollBarData.count + yearOffset) {
	                moveUpperY = 0;
	            }

	            var moveLowerY = dataManager.converPenalty2Y(scrollBarData.rangeLow) - dataManager.converPenalty2Y((scrollBarData.count - yearOffset));
	            if (scrollBarData.rangeLow > scrollBarData.count - yearOffset) {
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
	        middlePointY += dy;
	        //计算移动后的数据


	        var currPenalty = dataManager.converY2Penalty(middlePointY);
	        var currHighCount = currPenalty + yearOffset;
	        currHighCount = scrollBarData.rangeHigh < currHighCount ? scrollBarData.rangeHigh : currHighCount;
	        var currLowCount = currPenalty - yearOffset;
	        currLowCount = scrollBarData.rangeLow > currLowCount ? scrollBarData.rangeLow : currLowCount;

	        var currBarTopY = dataManager.converPenalty2Y(currHighCount);
	        var currBarBottomY = dataManager.converPenalty2Y(currLowCount);

	        scrollBarGroup.redMarkLine.style.yStart = currBarBottomY;
	        scrollBarGroup.redMarkLine.style.yEnd = currBarTopY;
	        zrender.modGroup(scrollBarGroup.id);


	        scrollBarData.count = currPenalty;
	        scrollBarData.highCount = currHighCount;
	        scrollBarData.lowCount = currLowCount;
	        if (scrollBarData.index > 1) {
	            dataManager.recountPercent(scrollBarData);
	        }

	        //要素区域联动，只联动右边的红色多边形区域: 左侧红细线,上下红虚线，多边形
	        if (0 == scrollBarData.index) {
	            moveRedPolygonGroup(scrollBarGroup.rightRedPolygonGroup, currBarBottomY, currBarTopY, true);
	        } else if (1 == scrollBarData.index) {
	            moveRedPolygonGroup(scrollBarGroup.leftRedPolygonGroup, currBarBottomY, currBarTopY, false)
	            redAreaGroup.reloadRedAreaGroupByBasePenalty(graphConfig, penaltyData, zrender, scrollBarData.index)
	        } else {
	            redAreaGroup.reloadRedAreaGroupByBasePenalty(graphConfig, penaltyData, zrender, scrollBarData.index)
	        }

	        if (penaltyData.onscrollCallBack) {
	            penaltyData.onscrollCallBack(scrollBarData);
	        }

	        zrender.refreshNextFrame();
	        if (penaltyData.onScrollCallBack) {
	            penaltyData.onScrollCallBack(redAreaGroup.getDataResult());
	        }
	        return true;
	    }

	    /**
	     * 移动红色多边形区域
	     * @param polygonGroup 红色多边形group
	     * @param isLeft 移动多边形的左边，否则移动右边
	     */
	    function moveRedPolygonGroup(polygonGroup, currBarBottomY, currBarTopY, isLeft) {
	        if (!polygonGroup) {
	            return;
	        }
	        if (isLeft) {
	            polygonGroup.redHighDashLine.style.yStart = currBarTopY;
	            polygonGroup.redLowDashLine.style.yStart = currBarBottomY;
	            polygonGroup.redLeftSolidLine.style.yStart = currBarBottomY;
	            polygonGroup.redLeftSolidLine.style.yEnd = currBarTopY;
	            polygonGroup.redPolygon.style.pointList[0][1] = currBarTopY;
	            polygonGroup.redPolygon.style.pointList[1][1] = currBarBottomY;
	        } else {
	            polygonGroup.redHighDashLine.style.yEnd = currBarTopY;
	            polygonGroup.redLowDashLine.style.yEnd = currBarBottomY;
	            polygonGroup.redRightSolidLine.style.yStart = currBarBottomY;
	            polygonGroup.redRightSolidLine.style.yEnd = currBarTopY;
	            polygonGroup.redPolygon.style.pointList[2][1] = currBarBottomY;
	            polygonGroup.redPolygon.style.pointList[3][1] = currBarTopY;
	        }
	        zrender.modGroup(polygonGroup.id);
	    }


	    /**
	     * 根据滚动条数据生成悬浮提示的文字
	     */
	    function getShowPenaltyText(scrollBarGroup) {
	        var text = "";
	        // text = '柱体中点：' + dataManager.getYMShowText(scrollBarData.count);
	        var scrollBarData = scrollBarGroup.scrollBarData;

	        
	        var text =  "柱体上端: "+parseFloat(scrollBarData.highCount.toFixed(3))+",柱体下端："+parseFloat(scrollBarData.lowCount.toFixed(3))+"\n";
	        if (scrollBarData.index > 1) {
	            text =  text + "范围上端: "+parseFloat(scrollBarData.rangeHigh.toFixed(3))+",范围下端："+parseFloat(scrollBarData.rangeLow.toFixed(3))+"\n";
	            text = text + "中点值: "+ parseFloat(scrollBarData.count.toFixed(3))+",百分比："+parseFloat(scrollBarData.percent.toFixed(3))+"%" + "\n";
	            text = text + "柱体中点: "+ dataManager.getYMShowText(scrollBarData.count)+ "\n";
	            text = text + '量刑建议区间：';
	        } else {
	            text = text + scrollBarData.name + ": ";
	        }

	        text += dataManager.getYMShowText(scrollBarData.lowCount);
	        text += ' 到 ';
	        text += dataManager.getYMShowText(scrollBarData.highCount);

	        return text;
	    }


	    /**
	     * 移动基准刑或其后的红柱，后方的所有区域重新计算
	     */
	    RedAreaGroup.prototype.reloadRedAreaGroupByBasePenalty = function (graphConfig, penaltyData, zrender, index) {
	        //当前点不变，后续的图形重绘
	        //移动最后
	        if (0 == i || index == this.redScrollBarArr.length - 1) {
	            return;
	        }
	        var startPenalty = this.redScrollBarArr[0].scrollBarData.count;
	        var basePenalty = this.redScrollBarArr[1].scrollBarData.count;
	        //计算红色坐标点、线、区域
	        var countDataArr = dataManager.getCountDataArr(startPenalty, basePenalty, penaltyData.factorArr, this.redScrollBarArr);
	        for (var i = index + 1, lastRedScrollBar; i < countDataArr.length; i++) {
	            //根据上个点重新计算当前的最高和最低范围坐标
	            lastRedScrollBar = this.redScrollBarArr[i - 1];
	            var updateScrollBarGroup = this.updateRedScrollBar(countDataArr[i]);
	            //更新红色多边形区域
	            this.updateRedPolygonGroup(i - 1, lastRedScrollBar, updateScrollBarGroup);
	        }
	    }

	    /**
	     * 红色区域图形初始化
	     */
	    RedAreaGroup.prototype.initRedAreaGroup = function (graphConfig, penaltyData, zrender) {
	        this.redScrollBarArr = [];
	        this.redPolygonGroupArr = [];
	        var startPenalty = penaltyData.startPenalty;
	        var basePenalty = penaltyData.basePenalty;
	        //计算红色坐标点、线、区域
	        var countDataArr = dataManager.getCountDataArr(startPenalty, basePenalty, penaltyData.factorArr);
	        for (var i = 0, currentRedScrollBar, lastRedScrollBar; i < countDataArr.length; i++) {
	            var currentRedScrollBar = this.addRedScrollBar(countDataArr[i]);
	            this.redScrollBarArr.push(currentRedScrollBar);
	            //多边形区域，从第二列开始
	            if (0 != i) {
	                var currentRedPolygonGroup = this.addRedPolygonGroup(i - 1, lastRedScrollBar, currentRedScrollBar);
	                //滚动条关联它左右的多边形,滚动时联动
	                lastRedScrollBar.rightRedPolygonGroup = currentRedPolygonGroup;
	                currentRedScrollBar.leftRedPolygonGroup = currentRedPolygonGroup;
	                this.redPolygonGroupArr.push(currentRedPolygonGroup);
	            }
	            lastRedScrollBar = currentRedScrollBar;
	        }
	        zrender.redGroupArea = this;
	    }




	    RedAreaGroup.prototype.getDataResult = function () {
	        var yearOffset = penaltyData.rangeInfo.caliber / 2;
	        var startPenaltyResult = {
	            count: this.redScrollBarArr[0].scrollBarData.count,
	            min: this.redScrollBarArr[0].scrollBarData.count - yearOffset,
	            max: this.redScrollBarArr[0].scrollBarData.count + yearOffset
	        }
	        startPenaltyResult.minText = dataManager.getYMShowText(startPenaltyResult.min);
	        startPenaltyResult.maxText = dataManager.getYMShowText(startPenaltyResult.max);


	        var basePenaltyResult = {
	            count: this.redScrollBarArr[1].scrollBarData.count,
	            min: this.redScrollBarArr[1].scrollBarData.count - yearOffset,
	            max: this.redScrollBarArr[1].scrollBarData.count + yearOffset
	        }
	        basePenaltyResult.minText = dataManager.getYMShowText(basePenaltyResult.min);
	        basePenaltyResult.maxText = dataManager.getYMShowText(basePenaltyResult.max)

	        var finalResult = {
	            count: this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.count,
	            min: this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.count - yearOffset,
	            max: this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.count + yearOffset
	        }
	        if (finalResult.min < this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.rangeLow) {
	            finalResult.min = this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.rangeLow;
	        }
	        if (finalResult.max > this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.rangeHigh) {
	            finalResult.max = this.redScrollBarArr[this.redScrollBarArr.length - 1].scrollBarData.rangeHigh;
	        }

	        finalResult.minText = dataManager.getYMShowText(finalResult.min);
	        finalResult.maxText = dataManager.getYMShowText(finalResult.max);


	        var dataResult = {
	            startPenalty: startPenaltyResult,
	            basePenalty: basePenaltyResult,
	            finalResult: finalResult,
	            factorResult: []
	        };
	        for (var i = 2; i < this.redScrollBarArr.length; i++) {
	            var dataElemnt = {
	                factorId: this.redScrollBarArr[i].scrollBarData.id,
	                factorName: this.redScrollBarArr[i].scrollBarData.name,
	                result: this.redScrollBarArr[i].scrollBarData.count,
	                actualPercent: this.redScrollBarArr[i].scrollBarData.percent
	            }
	            dataResult.factorResult.push(dataElemnt);
	        }
	        return dataResult;
	    }

	    var redAreaGroup = new RedAreaGroup({
	        'id': 'redAreaGroup'
	    });
	    redAreaGroup.initRedAreaGroup(graphConfig, penaltyData, zrender);

	    return redAreaGroup;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * ZRender, a high performance canvas library.
	 *  
	 * Copyright (c) 2013, Baidu Inc.
	 * All rights reserved.
	 * 
	 * LICENSE
	 * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	        /*
	         * HTML5 Canvas for Internet Explorer!
	         * Modern browsers like Firefox, Safari, Chrome and Opera support
	         * the HTML5 canvas tag to allow 2D command-based drawing.
	         * ExplorerCanvas brings the same functionality to Internet Explorer.
	         * To use, web developers only need to include a single script tag
	         * in their existing web pages.
	         *
	         * https://code.google.com/p/explorercanvas/
	         * http://explorercanvas.googlecode.com/svn/trunk/excanvas.js
	         */
	        // 核心代码会生成一个全局变量 G_vmlCanvasManager，模块改造后借用于快速判断canvas支持
	        __webpack_require__(6);

	        var util = __webpack_require__(5);
	        var log = __webpack_require__(13);
	        var guid = __webpack_require__(4);

	        var Handler = __webpack_require__(29);
	        var Painter = __webpack_require__(32);
	        var Storage = __webpack_require__(36);
	        var Animation = __webpack_require__(37);

	        var _instances = {};    // ZRender实例map索引

	        /**
	         * @exports zrender
	         * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	         *         pissang (https://www.github.com/pissang)
	         */
	        var zrender = {};
	        /**
	         * @type {string}
	         */
	        zrender.version = '2.1.0';

	        /**
	         * 创建zrender实例
	         *
	         * @param {HTMLElement} dom 绘图容器
	         * @return {module:zrender/ZRender} ZRender实例
	         */
	        // 不让外部直接new ZRender实例，为啥？
	        // 不为啥，提供全局可控同时减少全局污染和降低命名冲突的风险！
	        zrender.init = function(dom) {
	            var zr = new ZRender(guid(), dom);
	            _instances[zr.id] = zr;
	            return zr;
	        };

	        /**
	         * zrender实例销毁
	         * @param {module:zrender/ZRender} zr ZRender对象，不传则销毁全部
	         */
	        // 在_instances里的索引也会删除了
	        // 管生就得管死，可以通过zrender.dispose(zr)销毁指定ZRender实例
	        // 当然也可以直接zr.dispose()自己销毁
	        zrender.dispose = function (zr) {
	            if (zr) {
	                zr.dispose();
	            }
	            else {
	                for (var key in _instances) {
	                    _instances[key].dispose();
	                }
	                _instances = {};
	            }

	            return zrender;
	        };

	        /**
	         * 获取zrender实例
	         * @param {string} id ZRender对象索引
	         * @return {module:zrender/ZRender}
	         */
	        zrender.getInstance = function (id) {
	            return _instances[id];
	        };

	        /**
	         * 删除zrender实例，ZRender实例dispose时会调用，
	         * 删除后getInstance则返回undefined
	         * ps: 仅是删除，删除的实例不代表已经dispose了~~
	         *     这是一个摆脱全局zrender.dispose()自动销毁的后门，
	         *     take care of yourself~
	         *
	         * @param {string} id ZRender对象索引
	         */
	        zrender.delInstance = function (id) {
	            delete _instances[id];
	            return zrender;
	        };

	        function getFrameCallback(zrInstance) {
	            return function () {
	                if (zrInstance._needsRefreshNextFrame) {
	                    zrInstance.refresh();
	                }
	            };
	        }

	        /**
	         * @module zrender/ZRender
	         */
	        /**
	         * ZRender接口类，对外可用的所有接口都在这里
	         * 非get接口统一返回支持链式调用
	         *
	         * @constructor
	         * @alias module:zrender/ZRender
	         * @param {string} id 唯一标识
	         * @param {HTMLElement} dom dom对象，不帮你做document.getElementById
	         * @return {ZRender} ZRender实例
	         */
	        var ZRender = function(id, dom) {
	            /**
	             * 实例 id
	             * @type {string}
	             */
	            this.id = id;
	            this.env = __webpack_require__(30);

	            this.storage = new Storage();
	            this.painter = new Painter(dom, this.storage);
	            this.handler = new Handler(dom, this.storage, this.painter);

	            /**
	             * @type {module:zrender/animation/Animation}
	             */
	            this.animation = new Animation({
	                stage: {
	                    update: getFrameCallback(this)
	                }
	            });
	            this.animation.start();

	            var self = this;
	            this.painter.refreshNextFrame = function () {
	                self.refreshNextFrame();
	            };

	            this._needsRefreshNextFrame = false;

	            // 修改 storage.delFromMap, 每次删除元素之前删除动画
	            // FIXME 有点ugly
	            var self = this;
	            var storage = this.storage;
	            var oldDelFromMap = storage.delFromMap;
	            storage.delFromMap = function (elId) {
	                var el = storage.get(elId);
	                self.stopAnimation(el);
	                oldDelFromMap.call(storage, elId);
	            };
	        };

	        /**
	         * 获取实例唯一标识
	         * @return {string}
	         */
	        ZRender.prototype.getId = function () {
	            return this.id;
	        };

	        /**
	         * 添加图形形状到根节点
	         * @deprecated Use {@link module:zrender/ZRender.prototype.addElement} instead
	         * @param {module:zrender/shape/Base} shape 形状对象，可用属性全集，详见各shape
	         */
	        ZRender.prototype.addShape = function (shape) {
	            this.addElement(shape);
	            return this;
	        };

	        /**
	         * 添加组到根节点
	         * @deprecated Use {@link module:zrender/ZRender.prototype.addElement} instead
	         * @param {module:zrender/Group} group
	         */
	        ZRender.prototype.addGroup = function(group) {
	            this.addElement(group);
	            return this;
	        };

	        /**
	         * 从根节点删除图形形状
	         * @deprecated Use {@link module:zrender/ZRender.prototype.delElement} instead
	         * @param {string} shapeId 形状对象唯一标识
	         */
	        ZRender.prototype.delShape = function (shapeId) {
	            this.delElement(shapeId);
	            return this;
	        };

	        /**
	         * 从根节点删除组
	         * @deprecated Use {@link module:zrender/ZRender.prototype.delElement} instead
	         * @param {string} groupId
	         */
	        ZRender.prototype.delGroup = function (groupId) {
	            this.delElement(groupId);
	            return this;
	        };

	        /**
	         * 修改图形形状
	         * @deprecated Use {@link module:zrender/ZRender.prototype.modElement} instead
	         * @param {string} shapeId 形状对象唯一标识
	         * @param {Object} shape 形状对象
	         */
	        ZRender.prototype.modShape = function (shapeId, shape) {
	            this.modElement(shapeId, shape);
	            return this;
	        };

	        /**
	         * 修改组
	         * @deprecated Use {@link module:zrender/ZRender.prototype.modElement} instead
	         * @param {string} groupId
	         * @param {Object} group
	         */
	        ZRender.prototype.modGroup = function (groupId, group) {
	            this.modElement(groupId, group);
	            return this;
	        };

	        /**
	         * 添加元素
	         * @param  {string|module:zrender/Group|module:zrender/shape/Base} el
	         */
	        ZRender.prototype.addElement = function (el) {
	            this.storage.addRoot(el);
	            this._needsRefreshNextFrame = true;
	            return this;
	        };

	        /**
	         * 删除元素
	         * @param  {string|module:zrender/Group|module:zrender/shape/Base} el
	         */
	        ZRender.prototype.delElement = function (el) {
	            this.storage.delRoot(el);
	            this._needsRefreshNextFrame = true;
	            return this;
	        };

	        /**
	         * 修改元素, 主要标记图形或者组需要在下一帧刷新。
	         * 第二个参数为需要覆盖到元素上的参数，不建议使用。
	         *
	         * @example
	         *     el.style.color = 'red';
	         *     el.position = [10, 10];
	         *     zr.modElement(el);
	         * @param  {string|module:zrender/Group|module:zrender/shape/Base} el
	         * @param {Object} [params]
	         */
	        ZRender.prototype.modElement = function (el, params) {
	            this.storage.mod(el, params);
	            this._needsRefreshNextFrame = true;
	            return this;
	        };

	        /**
	         * 修改指定zlevel的绘制配置项
	         * 
	         * @param {string} zLevel
	         * @param {Object} config 配置对象
	         * @param {string} [config.clearColor=0] 每次清空画布的颜色
	         * @param {string} [config.motionBlur=false] 是否开启动态模糊
	         * @param {number} [config.lastFrameAlpha=0.7]
	         *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         * @param {Array.<number>} [config.position] 层的平移
	         * @param {Array.<number>} [config.rotation] 层的旋转
	         * @param {Array.<number>} [config.scale] 层的缩放
	         * @param {boolean} [config.zoomable=false] 层是否支持鼠标缩放操作
	         * @param {boolean} [config.panable=false] 层是否支持鼠标平移操作
	         */
	        ZRender.prototype.modLayer = function (zLevel, config) {
	            this.painter.modLayer(zLevel, config);
	            this._needsRefreshNextFrame = true;
	            return this;
	        };

	        /**
	         * 添加额外高亮层显示，仅提供添加方法，每次刷新后高亮层图形均被清空
	         * 
	         * @param {Object} shape 形状对象
	         */
	        ZRender.prototype.addHoverShape = function (shape) {
	            this.storage.addHover(shape);
	            return this;
	        };

	        /**
	         * 渲染
	         * 
	         * @param {Function} callback  渲染结束后回调函数
	         */
	        ZRender.prototype.render = function (callback) {
	            this.painter.render(callback);
	            this._needsRefreshNextFrame = false;
	            return this;
	        };

	        /**
	         * 视图更新
	         * 
	         * @param {Function} callback  视图更新后回调函数
	         */
	        ZRender.prototype.refresh = function (callback) {
	            this.painter.refresh(callback);
	            this._needsRefreshNextFrame = false;
	            return this;
	        };

	        /**
	         * 标记视图在浏览器下一帧需要绘制
	         */
	        ZRender.prototype.refreshNextFrame = function() {
	            this._needsRefreshNextFrame = true;
	            return this;
	        };
	        
	        /**
	         * 绘制高亮层
	         * @param {Function} callback  视图更新后回调函数
	         */
	        ZRender.prototype.refreshHover = function (callback) {
	            this.painter.refreshHover(callback);
	            return this;
	        };

	        /**
	         * 视图更新
	         * 
	         * @param {Array.<module:zrender/shape/Base>} shapeList 需要更新的图形列表
	         * @param {Function} callback  视图更新后回调函数
	         */
	        ZRender.prototype.refreshShapes = function (shapeList, callback) {
	            this.painter.refreshShapes(shapeList, callback);
	            return this;
	        };

	        /**
	         * 调整视图大小
	         */
	        ZRender.prototype.resize = function() {
	            this.painter.resize();
	            return this;
	        };

	        /**
	         * 动画
	         * 
	         * @param {string|module:zrender/Group|module:zrender/shape/Base} el 动画对象
	         * @param {string} path 需要添加动画的属性获取路径，可以通过a.b.c来获取深层的属性
	         * @param {boolean} [loop] 动画是否循环
	         * @return {module:zrender/animation/Animation~Animator}
	         * @example:
	         *     zr.animate(circle.id, 'style', false)
	         *         .when(1000, {x: 10} )
	         *         .done(function(){ // Animation done })
	         *         .start()
	         */
	        ZRender.prototype.animate = function (el, path, loop) {
	            var self = this;

	            if (typeof(el) === 'string') {
	                el = this.storage.get(el);
	            }
	            if (el) {
	                var target;
	                if (path) {
	                    var pathSplitted = path.split('.');
	                    var prop = el;
	                    for (var i = 0, l = pathSplitted.length; i < l; i++) {
	                        if (!prop) {
	                            continue;
	                        }
	                        prop = prop[pathSplitted[i]];
	                    }
	                    if (prop) {
	                        target = prop;
	                    }
	                }
	                else {
	                    target = el;
	                }

	                if (!target) {
	                    log(
	                        'Property "'
	                        + path
	                        + '" is not existed in element '
	                        + el.id
	                    );
	                    return;
	                }

	                if (el.__animators == null) {
	                    // 正在进行的动画记数
	                    el.__animators = [];
	                }
	                var animators = el.__animators;

	                var animator = this.animation.animate(target, { loop: loop })
	                    .during(function () {
	                        self.modShape(el);
	                    })
	                    .done(function () {
	                        var idx = util.indexOf(el.__animators, animator);
	                        if (idx >= 0) {
	                            animators.splice(idx, 1);
	                        }
	                    });
	                animators.push(animator);

	                return animator;
	            }
	            else {
	                log('Element not existed');
	            }
	        };

	        /**
	         * 停止动画对象的动画
	         * @param  {string|module:zrender/Group|module:zrender/shape/Base} el
	         */
	        ZRender.prototype.stopAnimation = function (el) {
	            if (el.__animators) {
	                var animators = el.__animators;
	                var len = animators.length;
	                for (var i = 0; i < len; i++) {
	                    animators[i].stop();
	                }
	                animators.length = 0;
	            }
	            return this;
	        };

	        /**
	         * 停止所有动画
	         */
	        ZRender.prototype.clearAnimation = function () {
	            this.animation.clear();
	            return this;
	        };

	        /**
	         * loading显示
	         * 
	         * @param {Object=} loadingEffect loading效果对象
	         */
	        ZRender.prototype.showLoading = function (loadingEffect) {
	            this.painter.showLoading(loadingEffect);
	            return this;
	        };

	        /**
	         * loading结束
	         */
	        ZRender.prototype.hideLoading = function () {
	            this.painter.hideLoading();
	            return this;
	        };

	        /**
	         * 获取视图宽度
	         */
	        ZRender.prototype.getWidth = function() {
	            return this.painter.getWidth();
	        };

	        /**
	         * 获取视图高度
	         */
	        ZRender.prototype.getHeight = function() {
	            return this.painter.getHeight();
	        };

	        /**
	         * 图像导出
	         * @param {string} type
	         * @param {string} [backgroundColor='#fff'] 背景色
	         * @return {string} 图片的Base64 url
	         */
	        ZRender.prototype.toDataURL = function(type, backgroundColor, args) {
	            return this.painter.toDataURL(type, backgroundColor, args);
	        };

	        /**
	         * 将常规shape转成image shape
	         * @param {module:zrender/shape/Base} e
	         * @param {number} width
	         * @param {number} height
	         */
	        ZRender.prototype.shapeToImage = function(e, width, height) {
	            var id = guid();
	            return this.painter.shapeToImage(id, e, width, height);
	        };

	        /**
	         * 事件绑定
	         * 
	         * @param {string} eventName 事件名称
	         * @param {Function} eventHandler 响应函数
	         * @param {Object} [context] 响应函数
	         */
	        ZRender.prototype.on = function(eventName, eventHandler, context) {
	            this.handler.on(eventName, eventHandler, context);
	            return this;
	        };

	        /**
	         * 事件解绑定，参数为空则解绑所有自定义事件
	         * 
	         * @param {string} eventName 事件名称
	         * @param {Function} eventHandler 响应函数
	         */
	        ZRender.prototype.un = function(eventName, eventHandler) {
	            this.handler.un(eventName, eventHandler);
	            return this;
	        };
	        
	        /**
	         * 事件触发
	         * 
	         * @param {string} eventName 事件名称，resize，hover，drag，etc
	         * @param {event=} event event dom事件对象
	         */
	        ZRender.prototype.trigger = function (eventName, event) {
	            this.handler.trigger(eventName, event);
	            return this;
	        };
	        

	        /**
	         * 清除当前ZRender下所有类图的数据和显示，clear后MVC和已绑定事件均还存在在，ZRender可用
	         */
	        ZRender.prototype.clear = function () {
	            this.storage.delRoot();
	            this.painter.clear();
	            return this;
	        };

	        /**
	         * 释放当前ZR实例（删除包括dom，数据、显示和事件绑定），dispose后ZR不可用
	         */
	        ZRender.prototype.dispose = function () {
	            this.animation.stop();
	            
	            this.clear();
	            this.storage.dispose();
	            this.painter.dispose();
	            this.handler.dispose();

	            this.animation = 
	            this.storage = 
	            this.painter = 
	            this.handler = null;

	            // 释放后告诉全局删除对自己的索引，没想到啥好方法
	            zrender.delInstance(this.id);
	        };

	        return zrender;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Handler控制模块
	 * @module zrender/Handler
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 *
	 */
	// TODO mouseover 只触发一次
	// 目前的高亮因为每次都需要 addHover 所以不能只是开始的时候触发一次
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	        'use strict';

	        var config = __webpack_require__(14);
	        var env = __webpack_require__(30);
	        var eventTool = __webpack_require__(31);
	        var util = __webpack_require__(5);
	        var vec2 = __webpack_require__(9);
	        var mat2d = __webpack_require__(8);
	        var EVENT = config.EVENT;

	        var Eventful = __webpack_require__(10);

	        var domHandlerNames = [
	            'resize', 'click', 'dblclick',
	            'mousewheel', 'mousemove', 'mouseout', 'mouseup', 'mousedown',
	            'touchstart', 'touchend', 'touchmove'
	        ];

	        var isZRenderElement = function (event) {
	            // 暂时忽略 IE8-
	            if (window.G_vmlCanvasManager) {
	                return true;
	            }

	            event = event || window.event;
	            // 进入对象优先~
	            var target = event.toElement
	                          || event.relatedTarget
	                          || event.srcElement
	                          || event.target;

	            return target && target.className.match(config.elementClassName)
	        };

	        var domHandlers = {
	            /**
	             * 窗口大小改变响应函数
	             * @inner
	             * @param {Event} event
	             */
	            resize: function (event) {
	                event = event || window.event;
	                this._lastHover = null;
	                this._isMouseDown = 0;
	                
	                // 分发config.EVENT.RESIZE事件，global
	                this.dispatch(EVENT.RESIZE, event);
	            },

	            /**
	             * 点击响应函数
	             * @inner
	             * @param {Event} event
	             */
	            click: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event);

	                // 分发config.EVENT.CLICK事件
	                var _lastHover = this._lastHover;
	                if ((_lastHover && _lastHover.clickable)
	                    || !_lastHover
	                ) {

	                    // 判断没有发生拖拽才触发click事件
	                    if (this._clickThreshold < 5) {
	                        this._dispatchAgency(_lastHover, EVENT.CLICK, event);
	                    }
	                }

	                this._mousemoveHandler(event);
	            },
	            
	            /**
	             * 双击响应函数
	             * @inner
	             * @param {Event} event
	             */
	            dblclick: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = event || window.event;
	                event = this._zrenderEventFixed(event);

	                // 分发config.EVENT.DBLCLICK事件
	                var _lastHover = this._lastHover;
	                if ((_lastHover && _lastHover.clickable)
	                    || !_lastHover
	                ) {

	                    // 判断没有发生拖拽才触发dblclick事件
	                    if (this._clickThreshold < 5) {
	                        this._dispatchAgency(_lastHover, EVENT.DBLCLICK, event);
	                    }
	                }

	                this._mousemoveHandler(event);
	            },
	            

	            /**
	             * 鼠标滚轮响应函数
	             * @inner
	             * @param {Event} event
	             */
	            mousewheel: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event);

	                // http://www.sitepoint.com/html5-javascript-mouse-wheel/
	                // https://developer.mozilla.org/en-US/docs/DOM/DOM_event_reference/mousewheel
	                var delta = event.wheelDelta // Webkit
	                            || -event.detail; // Firefox
	                var scale = delta > 0 ? 1.1 : 1 / 1.1;

	                var needsRefresh = false;

	                var mouseX = this._mouseX;
	                var mouseY = this._mouseY;
	                this.painter.eachBuildinLayer(function (layer) {
	                    var pos = layer.position;
	                    if (layer.zoomable) {
	                        layer.__zoom = layer.__zoom || 1;
	                        var newZoom = layer.__zoom;
	                        newZoom *= scale;
	                        newZoom = Math.max(
	                            Math.min(layer.maxZoom, newZoom),
	                            layer.minZoom
	                        );
	                        scale = newZoom / layer.__zoom;
	                        layer.__zoom = newZoom;
	                        // Keep the mouse center when scaling
	                        pos[0] -= (mouseX - pos[0]) * (scale - 1);
	                        pos[1] -= (mouseY - pos[1]) * (scale - 1);
	                        layer.scale[0] *= scale;
	                        layer.scale[1] *= scale;
	                        layer.dirty = true;
	                        needsRefresh = true;

	                        // Prevent browser default scroll action 
	                        eventTool.stop(event);
	                    }
	                });
	                if (needsRefresh) {
	                    this.painter.refresh();
	                }

	                // 分发config.EVENT.MOUSEWHEEL事件
	                this._dispatchAgency(this._lastHover, EVENT.MOUSEWHEEL, event);
	                this._mousemoveHandler(event);
	            },

	            /**
	             * 鼠标（手指）移动响应函数
	             * @inner
	             * @param {Event} event
	             */
	            mousemove: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                if (this.painter.isLoading()) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event);
	                this._lastX = this._mouseX;
	                this._lastY = this._mouseY;
	                this._mouseX = eventTool.getX(event);
	                this._mouseY = eventTool.getY(event);
	                var dx = this._mouseX - this._lastX;
	                var dy = this._mouseY - this._lastY;

	                // 可能出现config.EVENT.DRAGSTART事件
	                // 避免手抖点击误认为拖拽
	                // if (this._mouseX - this._lastX > 1 || this._mouseY - this._lastY > 1) {
	                this._processDragStart(event);
	                // }
	                this._hasfound = 0;
	                this._event = event;

	                this._iterateAndFindHover();

	                // 找到的在迭代函数里做了处理，没找到得在迭代完后处理
	                if (!this._hasfound) {
	                    // 过滤首次拖拽产生的mouseout和dragLeave
	                    if (!this._draggingTarget
	                        || (this._lastHover && this._lastHover != this._draggingTarget)
	                    ) {
	                        // 可能出现config.EVENT.MOUSEOUT事件
	                        this._processOutShape(event);

	                        // 可能出现config.EVENT.DRAGLEAVE事件
	                        this._processDragLeave(event);
	                    }

	                    this._lastHover = null;
	                    this.storage.delHover();
	                    this.painter.clearHover();
	                }

	                // set cursor for root element
	                var cursor = 'default';

	                // 如果存在拖拽中元素，被拖拽的图形元素最后addHover
	                if (this._draggingTarget) {
	                    this.storage.drift(this._draggingTarget.id, dx, dy);
	                    this._draggingTarget.modSelf();
	                    this.storage.addHover(this._draggingTarget);

	                    // 拖拽不触发click事件
	                    this._clickThreshold++;
	                }
	                else if (this._isMouseDown) {
	                    var needsRefresh = false;
	                    // Layer dragging
	                    this.painter.eachBuildinLayer(function (layer) {
	                        if (layer.panable) {
	                            // PENDING
	                            cursor = 'move';
	                            // Keep the mouse center when scaling
	                            layer.position[0] += dx;
	                            layer.position[1] += dy;
	                            needsRefresh = true;
	                            layer.dirty = true;
	                        }
	                    });
	                    if (needsRefresh) {
	                        this.painter.refresh();
	                    }
	                }

	                if (this._draggingTarget || (this._hasfound && this._lastHover.draggable)) {
	                    cursor = 'move';
	                }
	                else if (this._hasfound && this._lastHover.clickable) {
	                    cursor = 'pointer';
	                }
	                this.root.style.cursor = cursor;

	                // 分发config.EVENT.MOUSEMOVE事件
	                this._dispatchAgency(this._lastHover, EVENT.MOUSEMOVE, event);

	                if (this._draggingTarget || this._hasfound || this.storage.hasHoverShape()) {
	                    this.painter.refreshHover();
	                }
	            },

	            /**
	             * 鼠标（手指）离开响应函数
	             * @inner
	             * @param {Event} event
	             */
	            mouseout: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event);

	                var element = event.toElement || event.relatedTarget;
	                if (element != this.root) {
	                    while (element && element.nodeType != 9) {
	                        // 忽略包含在root中的dom引起的mouseOut
	                        if (element == this.root) {
	                            this._mousemoveHandler(event);
	                            return;
	                        }

	                        element = element.parentNode;
	                    }
	                }

	                event.zrenderX = this._lastX;
	                event.zrenderY = this._lastY;
	                this.root.style.cursor = 'default';
	                this._isMouseDown = 0;

	                this._processOutShape(event);
	                this._processDrop(event);
	                this._processDragEnd(event);
	                if (!this.painter.isLoading()) {
	                    this.painter.refreshHover();
	                }
	                
	                this.dispatch(EVENT.GLOBALOUT, event);
	            },

	            /**
	             * 鼠标（手指）按下响应函数
	             * @inner
	             * @param {Event} event
	             */
	            mousedown: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                // 重置 clickThreshold
	                this._clickThreshold = 0;

	                if (this._lastDownButton == 2) {
	                    this._lastDownButton = event.button;
	                    this._mouseDownTarget = null;
	                    // 仅作为关闭右键菜单使用
	                    return;
	                }

	                this._lastMouseDownMoment = new Date();
	                event = this._zrenderEventFixed(event);
	                this._isMouseDown = 1;

	                // 分发config.EVENT.MOUSEDOWN事件
	                this._mouseDownTarget = this._lastHover;
	                this._dispatchAgency(this._lastHover, EVENT.MOUSEDOWN, event);
	                this._lastDownButton = event.button;
	            },

	            /**
	             * 鼠标（手指）抬起响应函数
	             * @inner
	             * @param {Event} event
	             */
	            mouseup: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event);
	                this.root.style.cursor = 'default';
	                this._isMouseDown = 0;
	                this._mouseDownTarget = null;

	                // 分发config.EVENT.MOUSEUP事件
	                this._dispatchAgency(this._lastHover, EVENT.MOUSEUP, event);
	                this._processDrop(event);
	                this._processDragEnd(event);
	            },

	            /**
	             * Touch开始响应函数
	             * @inner
	             * @param {Event} event
	             */
	            touchstart: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                // eventTool.stop(event);// 阻止浏览器默认事件，重要
	                event = this._zrenderEventFixed(event, true);
	                this._lastTouchMoment = new Date();

	                // 平板补充一次findHover
	                this._mobileFindFixed(event);
	                this._mousedownHandler(event);
	            },

	            /**
	             * Touch移动响应函数
	             * @inner
	             * @param {Event} event
	             */
	            touchmove: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                event = this._zrenderEventFixed(event, true);
	                this._mousemoveHandler(event);
	                if (this._isDragging) {
	                    eventTool.stop(event);// 阻止浏览器默认事件，重要
	                }
	            },

	            /**
	             * Touch结束响应函数
	             * @inner
	             * @param {Event} event
	             */
	            touchend: function (event) {
	                if (! isZRenderElement(event)) {
	                    return;
	                }

	                // eventTool.stop(event);// 阻止浏览器默认事件，重要
	                event = this._zrenderEventFixed(event, true);
	                this._mouseupHandler(event);
	                
	                var now = new Date();
	                if (now - this._lastTouchMoment < EVENT.touchClickDelay) {
	                    this._mobileFindFixed(event);
	                    this._clickHandler(event);
	                    if (now - this._lastClickMoment < EVENT.touchClickDelay / 2) {
	                        this._dblclickHandler(event);
	                        if (this._lastHover && this._lastHover.clickable) {
	                            eventTool.stop(event);// 阻止浏览器默认事件，重要
	                        }
	                    }
	                    this._lastClickMoment = now;
	                }
	                this.painter.clearHover();
	            }
	        };

	        /**
	         * bind一个参数的function
	         * 
	         * @inner
	         * @param {Function} handler 要bind的function
	         * @param {Object} context 运行时this环境
	         * @return {Function}
	         */
	        function bind1Arg(handler, context) {
	            return function (e) {
	                return handler.call(context, e);
	            };
	        }
	        /**function bind2Arg(handler, context) {
	            return function (arg1, arg2) {
	                return handler.call(context, arg1, arg2);
	            };
	        }*/

	        function bind3Arg(handler, context) {
	            return function (arg1, arg2, arg3) {
	                return handler.call(context, arg1, arg2, arg3);
	            };
	        }
	        /**
	         * 为控制类实例初始化dom 事件处理函数
	         * 
	         * @inner
	         * @param {module:zrender/Handler} instance 控制类实例
	         */
	        function initDomHandler(instance) {
	            var len = domHandlerNames.length;
	            while (len--) {
	                var name = domHandlerNames[len];
	                instance['_' + name + 'Handler'] = bind1Arg(domHandlers[name], instance);
	            }
	        }

	        /**
	         * @alias module:zrender/Handler
	         * @constructor
	         * @extends module:zrender/mixin/Eventful
	         * @param {HTMLElement} root 绘图区域
	         * @param {module:zrender/Storage} storage Storage实例
	         * @param {module:zrender/Painter} painter Painter实例
	         */
	        var Handler = function(root, storage, painter) {
	            // 添加事件分发器特性
	            Eventful.call(this);

	            this.root = root;
	            this.storage = storage;
	            this.painter = painter;

	            // 各种事件标识的私有变量
	            // this._hasfound = false;              //是否找到hover图形元素
	            // this._lastHover = null;              //最后一个hover图形元素
	            // this._mouseDownTarget = null;
	            // this._draggingTarget = null;         //当前被拖拽的图形元素
	            // this._isMouseDown = false;
	            // this._isDragging = false;
	            // this._lastMouseDownMoment;
	            // this._lastTouchMoment;
	            // this._lastDownButton;

	            this._lastX = 
	            this._lastY = 
	            this._mouseX = 
	            this._mouseY = 0;

	            this._findHover = bind3Arg(findHover, this);
	            this._domHover = painter.getDomHover();
	            initDomHandler(this);

	            // 初始化，事件绑定，支持的所有事件都由如下原生事件计算得来
	            if (window.addEventListener) {
	                window.addEventListener('resize', this._resizeHandler);
	                
	                if (env.os.tablet || env.os.phone) {
	                    // mobile支持
	                    root.addEventListener('touchstart', this._touchstartHandler);
	                    root.addEventListener('touchmove', this._touchmoveHandler);
	                    root.addEventListener('touchend', this._touchendHandler);
	                }
	                else {
	                    // mobile的click/move/up/down自己模拟
	                    root.addEventListener('click', this._clickHandler);
	                    root.addEventListener('dblclick', this._dblclickHandler);
	                    root.addEventListener('mousewheel', this._mousewheelHandler);
	                    root.addEventListener('mousemove', this._mousemoveHandler);
	                    root.addEventListener('mousedown', this._mousedownHandler);
	                    root.addEventListener('mouseup', this._mouseupHandler);
	                } 
	                root.addEventListener('DOMMouseScroll', this._mousewheelHandler);
	                root.addEventListener('mouseout', this._mouseoutHandler);
	            }
	            else {
	                window.attachEvent('onresize', this._resizeHandler);

	                root.attachEvent('onclick', this._clickHandler);
	                //root.attachEvent('ondblclick ', this._dblclickHandler);
	                root.ondblclick = this._dblclickHandler;
	                root.attachEvent('onmousewheel', this._mousewheelHandler);
	                root.attachEvent('onmousemove', this._mousemoveHandler);
	                root.attachEvent('onmouseout', this._mouseoutHandler);
	                root.attachEvent('onmousedown', this._mousedownHandler);
	                root.attachEvent('onmouseup', this._mouseupHandler);
	            }
	        };

	        /**
	         * 自定义事件绑定
	         * @param {string} eventName 事件名称，resize，hover，drag，etc~
	         * @param {Function} handler 响应函数
	         * @param {Object} [context] 响应函数
	         */
	        Handler.prototype.on = function (eventName, handler, context) {
	            this.bind(eventName, handler, context);
	            return this;
	        };

	        /**
	         * 自定义事件解绑
	         * @param {string} eventName 事件名称，resize，hover，drag，etc~
	         * @param {Function} handler 响应函数
	         */
	        Handler.prototype.un = function (eventName, handler) {
	            this.unbind(eventName, handler);
	            return this;
	        };

	        /**
	         * 事件触发
	         * @param {string} eventName 事件名称，resize，hover，drag，etc~
	         * @param {event=} eventArgs event dom事件对象
	         */
	        Handler.prototype.trigger = function (eventName, eventArgs) {
	            switch (eventName) {
	                case EVENT.RESIZE:
	                case EVENT.CLICK:
	                case EVENT.DBLCLICK:
	                case EVENT.MOUSEWHEEL:
	                case EVENT.MOUSEMOVE:
	                case EVENT.MOUSEDOWN:
	                case EVENT.MOUSEUP:
	                case EVENT.MOUSEOUT:
	                    this['_' + eventName + 'Handler'](eventArgs);
	                    break;
	            }
	        };

	        /**
	         * 释放，解绑所有事件
	         */
	        Handler.prototype.dispose = function () {
	            var root = this.root;

	            if (window.removeEventListener) {
	                window.removeEventListener('resize', this._resizeHandler);

	                if (env.os.tablet || env.os.phone) {
	                    // mobile支持
	                    root.removeEventListener('touchstart', this._touchstartHandler);
	                    root.removeEventListener('touchmove', this._touchmoveHandler);
	                    root.removeEventListener('touchend', this._touchendHandler);
	                }
	                else {
	                    // mobile的click自己模拟
	                    root.removeEventListener('click', this._clickHandler);
	                    root.removeEventListener('dblclick', this._dblclickHandler);
	                    root.removeEventListener('mousewheel', this._mousewheelHandler);
	                    root.removeEventListener('mousemove', this._mousemoveHandler);
	                    root.removeEventListener('mousedown', this._mousedownHandler);
	                    root.removeEventListener('mouseup', this._mouseupHandler);
	                }
	                root.removeEventListener('DOMMouseScroll', this._mousewheelHandler);
	                root.removeEventListener('mouseout', this._mouseoutHandler);
	            }
	            else {
	                window.detachEvent('onresize', this._resizeHandler);

	                root.detachEvent('onclick', this._clickHandler);
	                root.detachEvent('dblclick', this._dblclickHandler);
	                root.detachEvent('onmousewheel', this._mousewheelHandler);
	                root.detachEvent('onmousemove', this._mousemoveHandler);
	                root.detachEvent('onmouseout', this._mouseoutHandler);
	                root.detachEvent('onmousedown', this._mousedownHandler);
	                root.detachEvent('onmouseup', this._mouseupHandler);
	            }

	            this.root =
	            this._domHover =
	            this.storage =
	            this.painter = null;
	            
	            this.un();
	        };

	        /**
	         * 拖拽开始
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDragStart = function (event) {
	            var _lastHover = this._lastHover;

	            if (this._isMouseDown
	                && _lastHover
	                && _lastHover.draggable
	                && !this._draggingTarget
	                && this._mouseDownTarget == _lastHover
	            ) {
	                // 拖拽点击生效时长阀门，某些场景需要降低拖拽敏感度
	                if (_lastHover.dragEnableTime && 
	                    new Date() - this._lastMouseDownMoment < _lastHover.dragEnableTime
	                ) {
	                    return;
	                }

	                var _draggingTarget = _lastHover;
	                this._draggingTarget = _draggingTarget;
	                this._isDragging = 1;

	                _draggingTarget.invisible = true;
	                this.storage.mod(_draggingTarget.id);

	                // 分发config.EVENT.DRAGSTART事件
	                this._dispatchAgency(
	                    _draggingTarget,
	                    EVENT.DRAGSTART,
	                    event
	                );
	                this.painter.refresh();
	            }
	        };

	        /**
	         * 拖拽进入目标元素
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDragEnter = function (event) {
	            if (this._draggingTarget) {
	                // 分发config.EVENT.DRAGENTER事件
	                this._dispatchAgency(
	                    this._lastHover,
	                    EVENT.DRAGENTER,
	                    event,
	                    this._draggingTarget
	                );
	            }
	        };

	        /**
	         * 拖拽在目标元素上移动
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDragOver = function (event) {
	            if (this._draggingTarget) {
	                // 分发config.EVENT.DRAGOVER事件
	                this._dispatchAgency(
	                    this._lastHover,
	                    EVENT.DRAGOVER,
	                    event,
	                    this._draggingTarget
	                );
	            }
	        };

	        /**
	         * 拖拽离开目标元素
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDragLeave = function (event) {
	            if (this._draggingTarget) {
	                // 分发config.EVENT.DRAGLEAVE事件
	                this._dispatchAgency(
	                    this._lastHover,
	                    EVENT.DRAGLEAVE,
	                    event,
	                    this._draggingTarget
	                );
	            }
	        };

	        /**
	         * 拖拽在目标元素上完成
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDrop = function (event) {
	            if (this._draggingTarget) {
	                this._draggingTarget.invisible = false;
	                this.storage.mod(this._draggingTarget.id);
	                this.painter.refresh();

	                // 分发config.EVENT.DROP事件
	                this._dispatchAgency(
	                    this._lastHover,
	                    EVENT.DROP,
	                    event,
	                    this._draggingTarget
	                );
	            }
	        };

	        /**
	         * 拖拽结束
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processDragEnd = function (event) {
	            if (this._draggingTarget) {
	                // 分发config.EVENT.DRAGEND事件
	                this._dispatchAgency(
	                    this._draggingTarget,
	                    EVENT.DRAGEND,
	                    event
	                );

	                this._lastHover = null;
	            }

	            this._isDragging = 0;
	            this._draggingTarget = null;
	        };

	        /**
	         * 鼠标在某个图形元素上移动
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processOverShape = function (event) {
	            // 分发config.EVENT.MOUSEOVER事件
	            this._dispatchAgency(this._lastHover, EVENT.MOUSEOVER, event);
	        };

	        /**
	         * 鼠标离开某个图形元素
	         * 
	         * @private
	         * @param {Object} event 事件对象
	         */
	        Handler.prototype._processOutShape = function (event) {
	            // 分发config.EVENT.MOUSEOUT事件
	            this._dispatchAgency(this._lastHover, EVENT.MOUSEOUT, event);
	        };

	        /**
	         * 事件分发代理
	         * 
	         * @private
	         * @param {Object} targetShape 目标图形元素
	         * @param {string} eventName 事件名称
	         * @param {Object} event 事件对象
	         * @param {Object=} draggedShape 拖拽事件特有，当前被拖拽图形元素
	         */
	        Handler.prototype._dispatchAgency = function (targetShape, eventName, event, draggedShape) {
	            var eventHandler = 'on' + eventName;
	            var eventPacket = {
	                type : eventName,
	                event : event,
	                target : targetShape,
	                cancelBubble: false
	            };

	            var el = targetShape;

	            if (draggedShape) {
	                eventPacket.dragged = draggedShape;
	            }

	            while (el) {
	                el[eventHandler] 
	                && (eventPacket.cancelBubble = el[eventHandler](eventPacket));
	                el.dispatch(eventName, eventPacket);

	                el = el.parent;
	                
	                if (eventPacket.cancelBubble) {
	                    break;
	                }
	            }

	            if (targetShape) {
	                // 冒泡到顶级 zrender 对象
	                if (!eventPacket.cancelBubble) {
	                    this.dispatch(eventName, eventPacket);
	                }
	            }
	            else if (!draggedShape) {
	                // 无hover目标，无拖拽对象，原生事件分发
	                var eveObj = {
	                    type: eventName,
	                    event: event
	                };
	                this.dispatch(eventName, eveObj);
	                // 分发事件到用户自定义层
	                this.painter.eachOtherLayer(function (layer) {
	                    if (typeof(layer[eventHandler]) == 'function') {
	                        layer[eventHandler](eveObj);
	                    }
	                    if (layer.dispatch) {
	                        layer.dispatch(eventName, eveObj);
	                    }
	                });
	            }
	        };

	        /**
	         * 迭代寻找hover shape
	         * @private
	         * @method
	         */
	        Handler.prototype._iterateAndFindHover = (function() {
	            var invTransform = mat2d.create();
	            return function() {
	                var list = this.storage.getShapeList();
	                var currentZLevel;
	                var currentLayer;
	                var tmp = [ 0, 0 ];
	                for (var i = list.length - 1; i >= 0 ; i--) {
	                    var shape = list[i];

	                    if (currentZLevel !== shape.zlevel) {
	                        currentLayer = this.painter.getLayer(shape.zlevel, currentLayer);
	                        tmp[0] = this._mouseX;
	                        tmp[1] = this._mouseY;

	                        if (currentLayer.needTransform) {
	                            mat2d.invert(invTransform, currentLayer.transform);
	                            vec2.applyTransform(tmp, tmp, invTransform);
	                        }
	                    }

	                    if (this._findHover(shape, tmp[0], tmp[1])) {
	                        break;
	                    }
	                }
	            };
	        })();
	        
	        // touch指尖错觉的尝试偏移量配置
	        var MOBILE_TOUCH_OFFSETS = [
	            { x: 10 },
	            { x: -20 },
	            { x: 10, y: 10 },
	            { y: -20 }
	        ];

	        // touch有指尖错觉，四向尝试，让touch上的点击更好触发事件
	        Handler.prototype._mobileFindFixed = function (event) {
	            this._lastHover = null;
	            this._mouseX = event.zrenderX;
	            this._mouseY = event.zrenderY;

	            this._event = event;

	            this._iterateAndFindHover();
	            for (var i = 0; !this._lastHover && i < MOBILE_TOUCH_OFFSETS.length ; i++) {
	                var offset = MOBILE_TOUCH_OFFSETS[ i ];
	                offset.x && (this._mouseX += offset.x);
	                offset.y && (this._mouseY += offset.y);

	                this._iterateAndFindHover();
	            }

	            if (this._lastHover) {
	                event.zrenderX = this._mouseX;
	                event.zrenderY = this._mouseY;
	            }
	        };

	        /**
	         * 迭代函数，查找hover到的图形元素并即时做些事件分发
	         * 
	         * @inner
	         * @param {Object} shape 图形元素
	         * @param {number} x
	         * @param {number} y
	         */
	        function findHover(shape, x, y) {
	            if (
	                (this._draggingTarget && this._draggingTarget.id == shape.id) // 迭代到当前拖拽的图形上
	                || shape.isSilent() // 打酱油的路过，啥都不响应的shape~
	            ) {
	                return false;
	            }

	            var event = this._event;
	            if (shape.isCover(x, y)) {
	                if (shape.hoverable) {
	                    this.storage.addHover(shape);
	                }
	                // 查找是否在 clipShape 中
	                var p = shape.parent;
	                while (p) {
	                    if (p.clipShape && !p.clipShape.isCover(this._mouseX, this._mouseY))  {
	                        // 已经被祖先 clip 掉了
	                        return false;
	                    }
	                    p = p.parent;
	                }

	                if (this._lastHover != shape) {
	                    this._processOutShape(event);

	                    // 可能出现config.EVENT.DRAGLEAVE事件
	                    this._processDragLeave(event);

	                    this._lastHover = shape;

	                    // 可能出现config.EVENT.DRAGENTER事件
	                    this._processDragEnter(event);
	                }

	                this._processOverShape(event);

	                // 可能出现config.EVENT.DRAGOVER
	                this._processDragOver(event);

	                this._hasfound = 1;

	                return true;    // 找到则中断迭代查找
	            }

	            return false;
	        }

	        /**
	         * 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标
	         * 
	         * @private
	         */
	        Handler.prototype._zrenderEventFixed = function (event, isTouch) {
	            if (event.zrenderFixed) {
	                return event;
	            }

	            if (!isTouch) {
	                event = event || window.event;
	                // 进入对象优先~
	                var target = event.toElement
	                              || event.relatedTarget
	                              || event.srcElement
	                              || event.target;

	                if (target && target != this._domHover) {
	                    event.zrenderX = (typeof event.offsetX != 'undefined'
	                                        ? event.offsetX
	                                        : event.layerX)
	                                      + target.offsetLeft;
	                    event.zrenderY = (typeof event.offsetY != 'undefined'
	                                        ? event.offsetY
	                                        : event.layerY)
	                                      + target.offsetTop;
	                }
	            }
	            else {
	                var touch = event.type != 'touchend'
	                                ? event.targetTouches[0]
	                                : event.changedTouches[0];
	                if (touch) {
	                    var rBounding = this.painter._domRoot.getBoundingClientRect();
	                    // touch事件坐标是全屏的~
	                    event.zrenderX = touch.clientX - rBounding.left;
	                    event.zrenderY = touch.clientY - rBounding.top;
	                }
	            }

	            event.zrenderFixed = 1;
	            return event;
	        };

	        util.merge(Handler.prototype, Eventful.prototype, true);

	        return Handler;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * echarts设备环境识别
	 *
	 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
	 * @author firede[firede@firede.us]
	 * @desc thanks zepto.
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    // Zepto.js
	    // (c) 2010-2013 Thomas Fuchs
	    // Zepto.js may be freely distributed under the MIT license.

	    function detect(ua) {
	        var os = this.os = {};
	        var browser = this.browser = {};
	        var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
	        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
	        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
	        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
	        var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
	        var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
	        var touchpad = webos && ua.match(/TouchPad/);
	        var kindle = ua.match(/Kindle\/([\d.]+)/);
	        var silk = ua.match(/Silk\/([\d._]+)/);
	        var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
	        var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
	        var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
	        var playbook = ua.match(/PlayBook/);
	        var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
	        var firefox = ua.match(/Firefox\/([\d.]+)/);
	        var ie = ua.match(/MSIE ([\d.]+)/);
	        var safari = webkit && ua.match(/Mobile\//) && !chrome;
	        var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;
	        var ie = ua.match(/MSIE\s([\d.]+)/);

	        // Todo: clean this up with a better OS/browser seperation:
	        // - discern (more) between multiple browsers on android
	        // - decide if kindle fire in silk mode is android or not
	        // - Firefox on Android doesn't specify the Android version
	        // - possibly devide in os, device and browser hashes

	        if (browser.webkit = !!webkit) browser.version = webkit[1];

	        if (android) os.android = true, os.version = android[2];
	        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
	        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
	        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	        if (webos) os.webos = true, os.version = webos[2];
	        if (touchpad) os.touchpad = true;
	        if (blackberry) os.blackberry = true, os.version = blackberry[2];
	        if (bb10) os.bb10 = true, os.version = bb10[2];
	        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
	        if (playbook) browser.playbook = true;
	        if (kindle) os.kindle = true, os.version = kindle[1];
	        if (silk) browser.silk = true, browser.version = silk[1];
	        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
	        if (chrome) browser.chrome = true, browser.version = chrome[1];
	        if (firefox) browser.firefox = true, browser.version = firefox[1];
	        if (ie) browser.ie = true, browser.version = ie[1];
	        if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
	        if (webview) browser.webview = true;
	        if (ie) browser.ie = true, browser.version = ie[1];

	        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
	            (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
	        os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
	            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
	            (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

	        return {
	            browser: browser,
	            os: os,
	            // 原生canvas支持，改极端点了
	            // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
	            canvasSupported : document.createElement('canvas').getContext ? true : false
	        };
	    }

	    return detect(navigator.userAgent);
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 事件辅助类
	 * @module zrender/tool/event
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	        'use strict';

	        var Eventful = __webpack_require__(10);

	        /**
	        * 提取鼠标（手指）x坐标
	        * @memberOf module:zrender/tool/event
	        * @param  {Event} e 事件.
	        * @return {number} 鼠标（手指）x坐标.
	        */
	        function getX(e) {
	            return typeof e.zrenderX != 'undefined' && e.zrenderX
	                   || typeof e.offsetX != 'undefined' && e.offsetX
	                   || typeof e.layerX != 'undefined' && e.layerX
	                   || typeof e.clientX != 'undefined' && e.clientX;
	        }

	        /**
	        * 提取鼠标y坐标
	        * @memberOf module:zrender/tool/event
	        * @param  {Event} e 事件.
	        * @return {number} 鼠标（手指）y坐标.
	        */
	        function getY(e) {
	            return typeof e.zrenderY != 'undefined' && e.zrenderY
	                   || typeof e.offsetY != 'undefined' && e.offsetY
	                   || typeof e.layerY != 'undefined' && e.layerY
	                   || typeof e.clientY != 'undefined' && e.clientY;
	        }

	        /**
	        * 提取鼠标滚轮变化
	        * @memberOf module:zrender/tool/event
	        * @param  {Event} e 事件.
	        * @return {number} 滚轮变化，正值说明滚轮是向上滚动，如果是负值说明滚轮是向下滚动
	        */
	        function getDelta(e) {
	            return typeof e.zrenderDelta != 'undefined' && e.zrenderDelta
	                   || typeof e.wheelDelta != 'undefined' && e.wheelDelta
	                   || typeof e.detail != 'undefined' && -e.detail;
	        }

	        /**
	         * 停止冒泡和阻止默认行为
	         * @memberOf module:zrender/tool/event
	         * @method
	         * @param {Event} e : event对象
	         */
	        var stop = typeof window.addEventListener === 'function'
	            ? function (e) {
	                e.preventDefault();
	                e.stopPropagation();
	                e.cancelBubble = true;
	            }
	            : function (e) {
	                e.returnValue = false;
	                e.cancelBubble = true;
	            };
	        
	        return {
	            getX : getX,
	            getY : getY,
	            getDelta : getDelta,
	            stop : stop,
	            // 做向上兼容
	            Dispatcher : Eventful
	        };
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Painter绘图模块
	 * @module zrender/Painter
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 *         pissang (https://www.github.com/pissang)
	 */
	 !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
	        'use strict';

	        var config = __webpack_require__(14);
	        var util = __webpack_require__(5);
	        // var vec2 = require('./tool/vector');
	        var log = __webpack_require__(13);
	        // var matrix = require('./tool/matrix');
	        var BaseLoadingEffect = __webpack_require__(33);

	        var Layer = __webpack_require__(34);

	        // 返回false的方法，用于避免页面被选中
	        function returnFalse() {
	            return false;
	        }

	        // 什么都不干的空方法
	        function doNothing() {}

	        function isLayerValid(layer) {
	            if (!layer) {
	                return false;
	            }
	            
	            if (layer.isBuildin) {
	                return true;
	            }

	            if (typeof(layer.resize) !== 'function'
	                || typeof(layer.refresh) !== 'function'
	            ) {
	                return false;
	            }

	            return true;
	        }

	        /**
	         * @alias module:zrender/Painter
	         * @constructor
	         * @param {HTMLElement} root 绘图容器
	         * @param {module:zrender/Storage} storage
	         */
	        var Painter = function (root, storage) {
	            /**
	             * 绘图容器
	             * @type {HTMLElement}
	             */
	            this.root = root;
	            root.style['-webkit-tap-highlight-color'] = 'transparent';
	            root.style['-webkit-user-select'] = 'none';
	            root.style['user-select'] = 'none';
	            root.style['-webkit-touch-callout'] = 'none';

	            /**
	             * @type {module:zrender/Storage}
	             */
	            this.storage = storage;

	            root.innerHTML = '';
	            this._width = this._getWidth(); // 宽，缓存记录
	            this._height = this._getHeight(); // 高，缓存记录

	            var domRoot = document.createElement('div');
	            this._domRoot = domRoot;

	            // domRoot.onselectstart = returnFalse; // 避免页面选中的尴尬
	            domRoot.style.position = 'relative';
	            domRoot.style.overflow = 'hidden';
	            domRoot.style.width = this._width + 'px';
	            domRoot.style.height = this._height + 'px';
	            root.appendChild(domRoot);

	            this._layers = {};

	            this._zlevelList = [];

	            this._layerConfig = {};

	            this._loadingEffect = new BaseLoadingEffect({});
	            this.shapeToImage = this._createShapeToImageProcessor();

	            // 创建各层canvas
	            // 背景
	            this._bgDom = document.createElement('div');
	            this._bgDom.style.cssText = [
	                'position:absolute;left:0px;top:0px;width:',
	                this._width, 'px;height:', this._height + 'px;', 
	                '-webkit-user-select:none;user-select;none;',
	                '-webkit-touch-callout:none;'
	            ].join('');
	            this._bgDom.setAttribute('data-zr-dom-id', 'bg');
	            this._bgDom.className = config.elementClassName;

	            domRoot.appendChild(this._bgDom);
	            this._bgDom.onselectstart = returnFalse;

	            // 高亮
	            var hoverLayer = new Layer('_zrender_hover_', this);
	            this._layers['hover'] = hoverLayer;
	            domRoot.appendChild(hoverLayer.dom);
	            hoverLayer.initContext();

	            hoverLayer.dom.onselectstart = returnFalse;
	            hoverLayer.dom.style['-webkit-user-select'] = 'none';
	            hoverLayer.dom.style['user-select'] = 'none';
	            hoverLayer.dom.style['-webkit-touch-callout'] = 'none';

	            // Will be injected by zrender instance
	            this.refreshNextFrame = null;
	        };

	        /**
	         * 首次绘图，创建各种dom和context
	         * 
	         * @param {Function} callback 绘画结束后的回调函数
	         */
	        Painter.prototype.render = function (callback) {
	            if (this.isLoading()) {
	                this.hideLoading();
	            }
	            // TODO
	            this.refresh(callback, true);

	            return this;
	        };

	        /**
	         * 刷新
	         * @param {Function} callback 刷新结束后的回调函数
	         * @param {boolean} paintAll 强制绘制所有shape
	         */
	        Painter.prototype.refresh = function (callback, paintAll) {
	            var list = this.storage.getShapeList(true);
	            this._paintList(list, paintAll);

	            // Paint custum layers
	            for (var i = 0; i < this._zlevelList.length; i++) {
	                var z = this._zlevelList[i];
	                var layer = this._layers[z];
	                if (! layer.isBuildin && layer.refresh) {
	                    layer.refresh();
	                }
	            }

	            if (typeof callback == 'function') {
	                callback();
	            }

	            return this;
	        };

	        Painter.prototype._preProcessLayer = function (layer) {
	            layer.unusedCount++;
	            layer.updateTransform();
	        };

	        Painter.prototype._postProcessLayer = function (layer) {
	            layer.dirty = false;
	            // 删除过期的层
	            // PENDING
	            // if (layer.unusedCount >= 500) {
	            //     this.delLayer(z);
	            // }
	            if (layer.unusedCount == 1) {
	                layer.clear();
	            }
	        };
	 
	        Painter.prototype._paintList = function (list, paintAll) {

	            if (typeof(paintAll) == 'undefined') {
	                paintAll = false;
	            }

	            this._updateLayerStatus(list);

	            var currentLayer;
	            var currentZLevel;
	            var ctx;

	            this.eachBuildinLayer(this._preProcessLayer);

	            // var invTransform = [];

	            for (var i = 0, l = list.length; i < l; i++) {
	                var shape = list[i];

	                // Change draw layer
	                if (currentZLevel !== shape.zlevel) {
	                    if (currentLayer) {
	                        if (currentLayer.needTransform) {
	                            ctx.restore();
	                        }
	                        ctx.flush && ctx.flush();
	                    }

	                    currentZLevel = shape.zlevel;
	                    currentLayer = this.getLayer(currentZLevel);

	                    if (!currentLayer.isBuildin) {
	                        log(
	                            'ZLevel ' + currentZLevel
	                            + ' has been used by unkown layer ' + currentLayer.id
	                        );
	                    }

	                    ctx = currentLayer.ctx;

	                    // Reset the count
	                    currentLayer.unusedCount = 0;

	                    if (currentLayer.dirty || paintAll) {
	                        currentLayer.clear();
	                    }

	                    if (currentLayer.needTransform) {
	                        ctx.save();
	                        currentLayer.setTransform(ctx);
	                    }
	                }

	                if ((currentLayer.dirty || paintAll) && !shape.invisible) {
	                    if (
	                        !shape.onbrush
	                        || (shape.onbrush && !shape.onbrush(ctx, false))
	                    ) {
	                        if (config.catchBrushException) {
	                            try {
	                                shape.brush(ctx, false, this.refreshNextFrame);
	                            }
	                            catch (error) {
	                                log(
	                                    error,
	                                    'brush error of ' + shape.type,
	                                    shape
	                                );
	                            }
	                        }
	                        else {
	                            shape.brush(ctx, false, this.refreshNextFrame);
	                        }
	                    }
	                }

	                shape.__dirty = false;
	            }

	            if (currentLayer) {
	                if (currentLayer.needTransform) {
	                    ctx.restore();
	                }
	                ctx.flush && ctx.flush();
	            }

	            this.eachBuildinLayer(this._postProcessLayer);
	        };

	        /**
	         * 获取 zlevel 所在层，如果不存在则会创建一个新的层
	         * @param {number} zlevel
	         * @return {module:zrender/Layer}
	         */
	        Painter.prototype.getLayer = function (zlevel) {
	            var layer = this._layers[zlevel];
	            if (!layer) {
	                // Create a new layer
	                layer = new Layer(zlevel, this);
	                layer.isBuildin = true;

	                if (this._layerConfig[zlevel]) {
	                    util.merge(layer, this._layerConfig[zlevel], true);
	                }

	                layer.updateTransform();

	                this.insertLayer(zlevel, layer);

	                // Context is created after dom inserted to document
	                // Or excanvas will get 0px clientWidth and clientHeight
	                layer.initContext();
	            }

	            return layer;
	        };

	        Painter.prototype.insertLayer = function (zlevel, layer) {
	            if (this._layers[zlevel]) {
	                log('ZLevel ' + zlevel + ' has been used already');
	                return;
	            }
	            // Check if is a valid layer
	            if (!isLayerValid(layer)) {
	                log('Layer of zlevel ' + zlevel + ' is not valid');
	                return;
	            }

	            var len = this._zlevelList.length;
	            var prevLayer = null;
	            var i = -1;
	            if (len > 0 && zlevel > this._zlevelList[0]) {
	                for (i = 0; i < len - 1; i++) {
	                    if (
	                        this._zlevelList[i] < zlevel
	                        && this._zlevelList[i + 1] > zlevel
	                    ) {
	                        break;
	                    }
	                }
	                prevLayer = this._layers[this._zlevelList[i]];
	            }
	            this._zlevelList.splice(i + 1, 0, zlevel);

	            var prevDom = prevLayer ? prevLayer.dom : this._bgDom;
	            if (prevDom.nextSibling) {
	                prevDom.parentNode.insertBefore(
	                    layer.dom,
	                    prevDom.nextSibling
	                );
	            }
	            else {
	                prevDom.parentNode.appendChild(layer.dom);
	            }

	            this._layers[zlevel] = layer;
	        };

	        // Iterate each layer
	        Painter.prototype.eachLayer = function (cb, context) {
	            for (var i = 0; i < this._zlevelList.length; i++) {
	                var z = this._zlevelList[i];
	                cb.call(context, this._layers[z], z);
	            }
	        };

	        // Iterate each buildin layer
	        Painter.prototype.eachBuildinLayer = function (cb, context) {
	            for (var i = 0; i < this._zlevelList.length; i++) {
	                var z = this._zlevelList[i];
	                var layer = this._layers[z];
	                if (layer.isBuildin) {
	                    cb.call(context, layer, z);
	                }
	            }
	        };

	        // Iterate each other layer except buildin layer
	        Painter.prototype.eachOtherLayer = function (cb, context) {
	            for (var i = 0; i < this._zlevelList.length; i++) {
	                var z = this._zlevelList[i];
	                var layer = this._layers[z];
	                if (! layer.isBuildin) {
	                    cb.call(context, layer, z);
	                }
	            }
	        };

	        /**
	         * 获取所有已创建的层
	         * @param {Array.<module:zrender/Layer>} [prevLayer]
	         */
	        Painter.prototype.getLayers = function () {
	            return this._layers;
	        };

	        Painter.prototype._updateLayerStatus = function (list) {
	            
	            var layers = this._layers;

	            var elCounts = {};

	            this.eachBuildinLayer(function (layer, z) {
	                elCounts[z] = layer.elCount;
	                layer.elCount = 0;
	            });

	            for (var i = 0, l = list.length; i < l; i++) {
	                var shape = list[i];
	                var zlevel = shape.zlevel;
	                var layer = layers[zlevel];
	                if (layer) {
	                    layer.elCount++;
	                    // 已经被标记为需要刷新
	                    if (layer.dirty) {
	                        continue;
	                    }
	                    layer.dirty = shape.__dirty;
	                }
	            }

	            // 层中的元素数量有发生变化
	            this.eachBuildinLayer(function (layer, z) {
	                if (elCounts[z] !== layer.elCount) {
	                    layer.dirty = true;
	                }
	            });
	        };

	        /**
	         * 指定的图形列表
	         * @param {Array.<module:zrender/shape/Base>} shapeList 需要更新的图形元素列表
	         * @param {Function} [callback] 视图更新后回调函数
	         */
	        Painter.prototype.refreshShapes = function (shapeList, callback) {
	            for (var i = 0, l = shapeList.length; i < l; i++) {
	                var shape = shapeList[i];
	                shape.modSelf();
	            }

	            this.refresh(callback);
	            return this;
	        };

	        /**
	         * 设置loading特效
	         * 
	         * @param {Object} loadingEffect loading特效
	         * @return {Painter}
	         */
	        Painter.prototype.setLoadingEffect = function (loadingEffect) {
	            this._loadingEffect = loadingEffect;
	            return this;
	        };

	        /**
	         * 清除hover层外所有内容
	         */
	        Painter.prototype.clear = function () {
	            this.eachBuildinLayer(this._clearLayer);
	            return this;
	        };

	        Painter.prototype._clearLayer = function (layer) {
	            layer.clear();
	        };

	        /**
	         * 修改指定zlevel的绘制参数
	         * 
	         * @param {string} zlevel
	         * @param {Object} config 配置对象
	         * @param {string} [config.clearColor=0] 每次清空画布的颜色
	         * @param {string} [config.motionBlur=false] 是否开启动态模糊
	         * @param {number} [config.lastFrameAlpha=0.7]
	         *                 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         * @param {Array.<number>} [position] 层的平移
	         * @param {Array.<number>} [rotation] 层的旋转
	         * @param {Array.<number>} [scale] 层的缩放
	         * @param {boolean} [zoomable=false] 层是否支持鼠标缩放操作
	         * @param {boolean} [panable=false] 层是否支持鼠标平移操作
	         */
	        Painter.prototype.modLayer = function (zlevel, config) {
	            if (config) {
	                if (!this._layerConfig[zlevel]) {
	                    this._layerConfig[zlevel] = config;
	                }
	                else {
	                    util.merge(this._layerConfig[zlevel], config, true);
	                }

	                var layer = this._layers[zlevel];

	                if (layer) {
	                    util.merge(layer, this._layerConfig[zlevel], true);
	                }
	            }
	        };

	        /**
	         * 删除指定层
	         * @param {number} zlevel 层所在的zlevel
	         */
	        Painter.prototype.delLayer = function (zlevel) {
	            var layer = this._layers[zlevel];
	            if (!layer) {
	                return;
	            }
	            // Save config
	            this.modLayer(zlevel, {
	                position: layer.position,
	                rotation: layer.rotation,
	                scale: layer.scale
	            });
	            layer.dom.parentNode.removeChild(layer.dom);
	            delete this._layers[zlevel];

	            this._zlevelList.splice(util.indexOf(this._zlevelList, zlevel), 1);
	        };

	        /**
	         * 刷新hover层
	         */
	        Painter.prototype.refreshHover = function () {
	            this.clearHover();
	            var list = this.storage.getHoverShapes(true);
	            for (var i = 0, l = list.length; i < l; i++) {
	                this._brushHover(list[i]);
	            }
	            var ctx = this._layers.hover.ctx;
	            ctx.flush && ctx.flush();

	            this.storage.delHover();

	            return this;
	        };

	        /**
	         * 清除hover层所有内容
	         */
	        Painter.prototype.clearHover = function () {
	            var hover = this._layers.hover;
	            hover && hover.clear();

	            return this;
	        };

	        /**
	         * 显示loading
	         * 
	         * @param {Object=} loadingEffect loading效果对象
	         */
	        Painter.prototype.showLoading = function (loadingEffect) {
	            this._loadingEffect && this._loadingEffect.stop();
	            loadingEffect && this.setLoadingEffect(loadingEffect);
	            this._loadingEffect.start(this);
	            this.loading = true;

	            return this;
	        };

	        /**
	         * loading结束
	         */
	        Painter.prototype.hideLoading = function () {
	            this._loadingEffect.stop();

	            this.clearHover();
	            this.loading = false;
	            return this;
	        };

	        /**
	         * loading结束判断
	         */
	        Painter.prototype.isLoading = function () {
	            return this.loading;
	        };

	        /**
	         * 区域大小变化后重绘
	         */
	        Painter.prototype.resize = function () {
	            var domRoot = this._domRoot;
	            domRoot.style.display = 'none';

	            var width = this._getWidth();
	            var height = this._getHeight();

	            domRoot.style.display = '';

	            // 优化没有实际改变的resize
	            if (this._width != width || height != this._height) {
	                this._width = width;
	                this._height = height;

	                domRoot.style.width = width + 'px';
	                domRoot.style.height = height + 'px';

	                for (var id in this._layers) {

	                    this._layers[id].resize(width, height);
	                }

	                this.refresh(null, true);
	            }

	            return this;
	        };

	        /**
	         * 清除单独的一个层
	         * @param {number} zLevel
	         */
	        Painter.prototype.clearLayer = function (zLevel) {
	            var layer = this._layers[zLevel];
	            if (layer) {
	                layer.clear();
	            }
	        };

	        /**
	         * 释放
	         */
	        Painter.prototype.dispose = function () {
	            if (this.isLoading()) {
	                this.hideLoading();
	            }

	            this.root.innerHTML = '';

	            this.root =
	            this.storage =

	            this._domRoot = 
	            this._layers = null;
	        };

	        Painter.prototype.getDomHover = function () {
	            return this._layers.hover.dom;
	        };

	        /**
	         * 图像导出
	         * @param {string} type
	         * @param {string} [backgroundColor='#fff'] 背景色
	         * @return {string} 图片的Base64 url
	         */
	        Painter.prototype.toDataURL = function (type, backgroundColor, args) {
	            if (window['G_vmlCanvasManager']) {
	                return null;
	            }

	            var imageLayer = new Layer('image', this);
	            this._bgDom.appendChild(imageLayer.dom);
	            imageLayer.initContext();
	            
	            var ctx = imageLayer.ctx;
	            imageLayer.clearColor = backgroundColor || '#fff';
	            imageLayer.clear();
	            
	            var self = this;
	            // 升序遍历，shape上的zlevel指定绘画图层的z轴层叠

	            this.storage.iterShape(
	                function (shape) {
	                    if (!shape.invisible) {
	                        if (!shape.onbrush // 没有onbrush
	                            // 有onbrush并且调用执行返回false或undefined则继续粉刷
	                            || (shape.onbrush && !shape.onbrush(ctx, false))
	                        ) {
	                            if (config.catchBrushException) {
	                                try {
	                                    shape.brush(ctx, false, self.refreshNextFrame);
	                                }
	                                catch (error) {
	                                    log(
	                                        error,
	                                        'brush error of ' + shape.type,
	                                        shape
	                                    );
	                                }
	                            }
	                            else {
	                                shape.brush(ctx, false, self.refreshNextFrame);
	                            }
	                        }
	                    }
	                },
	                { normal: 'up', update: true }
	            );
	            var image = imageLayer.dom.toDataURL(type, args); 
	            ctx = null;
	            this._bgDom.removeChild(imageLayer.dom);
	            return image;
	        };

	        /**
	         * 获取绘图区域宽度
	         */
	        Painter.prototype.getWidth = function () {
	            return this._width;
	        };

	        /**
	         * 获取绘图区域高度
	         */
	        Painter.prototype.getHeight = function () {
	            return this._height;
	        };

	        Painter.prototype._getWidth = function () {
	            var root = this.root;
	            var stl = root.currentStyle
	                      || document.defaultView.getComputedStyle(root);

	            return ((root.clientWidth || parseInt(stl.width, 10))
	                    - parseInt(stl.paddingLeft, 10) // 请原谅我这比较粗暴
	                    - parseInt(stl.paddingRight, 10)).toFixed(0) - 0;
	        };

	        Painter.prototype._getHeight = function () {
	            var root = this.root;
	            var stl = root.currentStyle
	                      || document.defaultView.getComputedStyle(root);

	            return ((root.clientHeight || parseInt(stl.height, 10))
	                    - parseInt(stl.paddingTop, 10) // 请原谅我这比较粗暴
	                    - parseInt(stl.paddingBottom, 10)).toFixed(0) - 0;
	        };

	        Painter.prototype._brushHover = function (shape) {
	            var ctx = this._layers.hover.ctx;

	            if (!shape.onbrush // 没有onbrush
	                // 有onbrush并且调用执行返回false或undefined则继续粉刷
	                || (shape.onbrush && !shape.onbrush(ctx, true))
	            ) {
	                var layer = this.getLayer(shape.zlevel);
	                if (layer.needTransform) {
	                    ctx.save();
	                    layer.setTransform(ctx);
	                }
	                // Retina 优化
	                if (config.catchBrushException) {
	                    try {
	                        shape.brush(ctx, true, this.refreshNextFrame);
	                    }
	                    catch (error) {
	                        log(
	                            error, 'hoverBrush error of ' + shape.type, shape
	                        );
	                    }
	                }
	                else {
	                    shape.brush(ctx, true, this.refreshNextFrame);
	                }
	                if (layer.needTransform) {
	                    ctx.restore();
	                }
	            }
	        };

	        Painter.prototype._shapeToImage = function (
	            id, shape, width, height, devicePixelRatio
	        ) {
	            var canvas = document.createElement('canvas');
	            var ctx = canvas.getContext('2d');
	            
	            canvas.style.width = width + 'px';
	            canvas.style.height = height + 'px';
	            canvas.setAttribute('width', width * devicePixelRatio);
	            canvas.setAttribute('height', height * devicePixelRatio);

	            ctx.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);

	            var shapeTransform = {
	                position : shape.position,
	                rotation : shape.rotation,
	                scale : shape.scale
	            };
	            shape.position = [ 0, 0, 0 ];
	            shape.rotation = 0;
	            shape.scale = [ 1, 1 ];
	            if (shape) {
	                shape.brush(ctx, false);
	            }

	            var ImageShape = __webpack_require__(35);
	            var imgShape = new ImageShape({
	                id : id,
	                style : {
	                    x : 0,
	                    y : 0,
	                    image : canvas
	                }
	            });

	            if (shapeTransform.position != null) {
	                imgShape.position = shape.position = shapeTransform.position;
	            }

	            if (shapeTransform.rotation != null) {
	                imgShape.rotation = shape.rotation = shapeTransform.rotation;
	            }

	            if (shapeTransform.scale != null) {
	                imgShape.scale = shape.scale = shapeTransform.scale;
	            }

	            return imgShape;
	        };

	        Painter.prototype._createShapeToImageProcessor = function () {
	            if (window['G_vmlCanvasManager']) {
	                return doNothing;
	            }

	            var me = this;

	            return function (id, e, width, height) {
	                return me._shapeToImage(
	                    id, e, width, height, config.devicePixelRatio
	                );
	            };
	        };

	        return Painter;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * zrender: loading特效类
	 *
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 *         errorrik (errorrik@gmail.com)
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	        var util = __webpack_require__(5);
	        var TextShape = __webpack_require__(22);
	        var RectangleShape = __webpack_require__(26);


	        var DEFAULT_TEXT = 'Loading...';
	        var DEFAULT_TEXT_FONT = 'normal 16px Arial';

	        /**
	         * @constructor
	         * 
	         * @param {Object} options 选项
	         * @param {color} options.backgroundColor 背景颜色
	         * @param {Object} options.textStyle 文字样式，同shape/text.style
	         * @param {number=} options.progress 进度参数，部分特效有用
	         * @param {Object=} options.effect 特效参数，部分特效有用
	         * 
	         * {
	         *     effect,
	         *     //loading话术
	         *     text:'',
	         *     // 水平安放位置，默认为 'center'，可指定x坐标
	         *     x:'center' || 'left' || 'right' || {number},
	         *     // 垂直安放位置，默认为'top'，可指定y坐标
	         *     y:'top' || 'bottom' || {number},
	         *
	         *     textStyle:{
	         *         textFont: 'normal 20px Arial' || {textFont}, //文本字体
	         *         color: {color}
	         *     }
	         * }
	         */
	        function Base(options) {
	            this.setOptions(options);
	        }

	        /**
	         * 创建loading文字图形
	         * 
	         * @param {Object} textStyle 文字style，同shape/text.style
	         */
	        Base.prototype.createTextShape = function (textStyle) {
	            return new TextShape({
	                highlightStyle : util.merge(
	                    {
	                        x : this.canvasWidth / 2,
	                        y : this.canvasHeight / 2,
	                        text : DEFAULT_TEXT,
	                        textAlign : 'center',
	                        textBaseline : 'middle',
	                        textFont : DEFAULT_TEXT_FONT,
	                        color: '#333',
	                        brushType : 'fill'
	                    },
	                    textStyle,
	                    true
	                )
	            });
	        };
	        
	        /**
	         * 获取loading背景图形
	         * 
	         * @param {color} color 背景颜色
	         */
	        Base.prototype.createBackgroundShape = function (color) {
	            return new RectangleShape({
	                highlightStyle : {
	                    x : 0,
	                    y : 0,
	                    width : this.canvasWidth,
	                    height : this.canvasHeight,
	                    brushType : 'fill',
	                    color : color
	                }
	            });
	        };

	        Base.prototype.start = function (painter) {
	            this.canvasWidth = painter._width;
	            this.canvasHeight = painter._height;

	            function addShapeHandle(param) {
	                painter.storage.addHover(param);
	            }
	            function refreshHandle() {
	                painter.refreshHover();
	            }
	            this.loadingTimer = this._start(addShapeHandle, refreshHandle);
	        };

	        Base.prototype._start = function (/*addShapeHandle, refreshHandle*/) {
	            return setInterval(function () {
	            }, 10000);
	        };

	        Base.prototype.stop = function () {
	            clearInterval(this.loadingTimer);
	        };

	        Base.prototype.setOptions = function (options) {
	            this.options = options || {};
	        };
	        
	        Base.prototype.adjust = function (value, region) {
	            if (value <= region[0]) {
	                value = region[0];
	            }
	            else if (value >= region[1]) {
	                value = region[1];
	            }
	            return value;
	        };
	        
	        Base.prototype.getLocation = function(loc, totalWidth, totalHeight) {
	            var x = loc.x != null ? loc.x : 'center';
	            switch (x) {
	                case 'center' :
	                    x = Math.floor((this.canvasWidth - totalWidth) / 2);
	                    break;
	                case 'left' :
	                    x = 0;
	                    break;
	                case 'right' :
	                    x = this.canvasWidth - totalWidth;
	                    break;
	            }
	            var y = loc.y != null ? loc.y : 'center';
	            switch (y) {
	                case 'center' :
	                    y = Math.floor((this.canvasHeight - totalHeight) / 2);
	                    break;
	                case 'top' :
	                    y = 0;
	                    break;
	                case 'bottom' :
	                    y = this.canvasHeight - totalHeight;
	                    break;
	            }
	            return {
	                x : x,
	                y : y,
	                width : totalWidth,
	                height : totalHeight
	            };
	        };

	        return Base;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @module zrender/Layer
	 * @author pissang(https://www.github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	    var Transformable = __webpack_require__(7);
	    var util = __webpack_require__(5);
	    var vmlCanvasManager = window['G_vmlCanvasManager'];
	    var config = __webpack_require__(14);

	    function returnFalse() {
	        return false;
	    }

	    /**
	     * 创建dom
	     * 
	     * @inner
	     * @param {string} id dom id 待用
	     * @param {string} type dom type，such as canvas, div etc.
	     * @param {Painter} painter painter instance
	     */
	    function createDom(id, type, painter) {
	        var newDom = document.createElement(type);
	        var width = painter.getWidth();
	        var height = painter.getHeight();

	        // 没append呢，请原谅我这样写，清晰~
	        newDom.style.position = 'absolute';
	        newDom.style.left = 0;
	        newDom.style.top = 0;
	        newDom.style.width = width + 'px';
	        newDom.style.height = height + 'px';
	        newDom.width = width * config.devicePixelRatio;
	        newDom.height = height * config.devicePixelRatio;

	        // id不作为索引用，避免可能造成的重名，定义为私有属性
	        newDom.setAttribute('data-zr-dom-id', id);
	        return newDom;
	    }

	    /**
	     * @alias module:zrender/Layer
	     * @constructor
	     * @extends module:zrender/mixin/Transformable
	     * @param {string} id
	     * @param {module:zrender/Painter} painter
	     */
	    var Layer = function(id, painter) {

	        this.id = id;

	        this.dom = createDom(id, 'canvas', painter);
	        this.dom.onselectstart = returnFalse; // 避免页面选中的尴尬
	        this.dom.style['-webkit-user-select'] = 'none';
	        this.dom.style['user-select'] = 'none';
	        this.dom.style['-webkit-touch-callout'] = 'none';
	        this.dom.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';

	        this.dom.className = config.elementClassName;

	        vmlCanvasManager && vmlCanvasManager.initElement(this.dom);

	        this.domBack = null;
	        this.ctxBack = null;

	        this.painter = painter;

	        this.unusedCount = 0;

	        this.config = null;

	        this.dirty = true;

	        this.elCount = 0;

	        // Configs
	        /**
	         * 每次清空画布的颜色
	         * @type {string}
	         * @default 0
	         */
	        this.clearColor = 0;
	        /**
	         * 是否开启动态模糊
	         * @type {boolean}
	         * @default false
	         */
	        this.motionBlur = false;
	        /**
	         * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
	         * @type {number}
	         * @default 0.7
	         */
	        this.lastFrameAlpha = 0.7;
	        /**
	         * 层是否支持鼠标平移操作
	         * @type {boolean}
	         * @default false
	         */
	        this.zoomable = false;
	        /**
	         * 层是否支持鼠标缩放操作
	         * @type {boolean}
	         * @default false
	         */
	        this.panable = false;

	        this.maxZoom = Infinity;
	        this.minZoom = 0;

	        Transformable.call(this);
	    };

	    Layer.prototype.initContext = function () {
	        this.ctx = this.dom.getContext('2d');

	        var dpr = config.devicePixelRatio;
	        if (dpr != 1) { 
	            this.ctx.scale(dpr, dpr);
	        }
	    };

	    Layer.prototype.createBackBuffer = function () {
	        if (vmlCanvasManager) { // IE 8- should not support back buffer
	            return;
	        }
	        this.domBack = createDom('back-' + this.id, 'canvas', this.painter);
	        this.ctxBack = this.domBack.getContext('2d');

	        var dpr = config.devicePixelRatio;

	        if (dpr != 1) { 
	            this.ctxBack.scale(dpr, dpr);
	        }
	    };

	    /**
	     * @param  {number} width
	     * @param  {number} height
	     */
	    Layer.prototype.resize = function (width, height) {
	        var dpr = config.devicePixelRatio;

	        this.dom.style.width = width + 'px';
	        this.dom.style.height = height + 'px';

	        this.dom.setAttribute('width', width * dpr);
	        this.dom.setAttribute('height', height * dpr);

	        if (dpr != 1) { 
	            this.ctx.scale(dpr, dpr);
	        }

	        if (this.domBack) {
	            this.domBack.setAttribute('width', width * dpr);
	            this.domBack.setAttribute('height', height * dpr);

	            if (dpr != 1) { 
	                this.ctxBack.scale(dpr, dpr);
	            }
	        }
	    };

	    /**
	     * 清空该层画布
	     */
	    Layer.prototype.clear = function () {
	        var dom = this.dom;
	        var ctx = this.ctx;
	        var width = dom.width;
	        var height = dom.height;

	        var haveClearColor = this.clearColor && !vmlCanvasManager;
	        var haveMotionBLur = this.motionBlur && !vmlCanvasManager;
	        var lastFrameAlpha = this.lastFrameAlpha;
	        
	        var dpr = config.devicePixelRatio;

	        if (haveMotionBLur) {
	            if (!this.domBack) {
	                this.createBackBuffer();
	            } 

	            this.ctxBack.globalCompositeOperation = 'copy';
	            this.ctxBack.drawImage(
	                dom, 0, 0,
	                width / dpr,
	                height / dpr
	            );
	        }

	        ctx.clearRect(0, 0, width / dpr, height / dpr);
	        if (haveClearColor) {
	            ctx.save();
	            ctx.fillStyle = this.clearColor;
	            ctx.fillRect(0, 0, width / dpr, height / dpr);
	            ctx.restore();
	        }

	        if (haveMotionBLur) {
	            var domBack = this.domBack;
	            ctx.save();
	            ctx.globalAlpha = lastFrameAlpha;
	            ctx.drawImage(domBack, 0, 0, width / dpr, height / dpr);
	            ctx.restore();
	        }
	    };

	    util.merge(Layer.prototype, Transformable.prototype);

	    return Layer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 图片绘制
	 * @module zrender/shape/Image
	 * @author pissang(https://www.github.com/pissang)
	 * @example
	 *     var ImageShape = require('zrender/shape/Image');
	 *     var image = new ImageShape({
	 *         style: {
	 *             image: 'test.jpg',
	 *             x: 100,
	 *             y: 100
	 *         }
	 *     });
	 *     zr.addShape(image);
	 */

	/**
	 * @typedef {Object} IImageStyle
	 * @property {string|HTMLImageElement|HTMLCanvasElement} image 图片url或者图片对象
	 * @property {number} x 左上角横坐标
	 * @property {number} y 左上角纵坐标
	 * @property {number} [width] 绘制到画布上的宽度，默认为图片宽度
	 * @property {number} [height] 绘制到画布上的高度，默认为图片高度
	 * @property {number} [sx=0] 从图片中裁剪的左上角横坐标
	 * @property {number} [sy=0] 从图片中裁剪的左上角纵坐标
	 * @property {number} [sWidth] 从图片中裁剪的宽度，默认为图片高度
	 * @property {number} [sHeight] 从图片中裁剪的高度，默认为图片高度
	 * @property {number} [opacity=1] 绘制透明度
	 * @property {number} [shadowBlur=0] 阴影模糊度，大于0有效
	 * @property {string} [shadowColor='#000000'] 阴影颜色
	 * @property {number} [shadowOffsetX=0] 阴影横向偏移
	 * @property {number} [shadowOffsetY=0] 阴影纵向偏移
	 * @property {string} [text] 图形中的附加文本
	 * @property {string} [textColor='#000000'] 文本颜色
	 * @property {string} [textFont] 附加文本样式，eg:'bold 18px verdana'
	 * @property {string} [textPosition='end'] 附加文本位置, 可以是 inside, left, right, top, bottom
	 * @property {string} [textAlign] 默认根据textPosition自动设置，附加文本水平对齐。
	 *                                可以是start, end, left, right, center
	 * @property {string} [textBaseline] 默认根据textPosition自动设置，附加文本垂直对齐。
	 *                                可以是top, bottom, middle, alphabetic, hanging, ideographic
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	        var Base = __webpack_require__(12);

	        /**
	         * @alias zrender/shape/Image
	         * @constructor
	         * @extends module:zrender/shape/Base
	         * @param {Object} options
	         */
	        var ZImage = function(options) {
	            Base.call(this, options);
	            /**
	             * 图片绘制样式
	             * @name module:zrender/shape/Image#style
	             * @type {module:zrender/shape/Image~IImageStyle}
	             */
	            /**
	             * 图片高亮绘制样式
	             * @name module:zrender/shape/Image#highlightStyle
	             * @type {module:zrender/shape/Image~IImageStyle}
	             */
	        };

	        ZImage.prototype = {
	            
	            type: 'image',

	            brush : function(ctx, isHighlight, refreshNextFrame) {
	                var style = this.style || {};

	                if (isHighlight) {
	                    // 根据style扩展默认高亮样式
	                    style = this.getHighlightStyle(
	                        style, this.highlightStyle || {}
	                    );
	                }

	                var image = style.image;
	                var self = this;

	                if (!this._imageCache) {
	                    this._imageCache = {};
	                }
	                if (typeof(image) === 'string') {
	                    var src = image;
	                    if (this._imageCache[src]) {
	                        image = this._imageCache[src];
	                    } else {
	                        image = new Image();
	                        image.onload = function () {
	                            image.onload = null;
	                            self.modSelf();
	                            refreshNextFrame();
	                        };

	                        image.src = src;
	                        this._imageCache[src] = image;
	                    }
	                }
	                if (image) {
	                    // 图片已经加载完成
	                    if (image.nodeName.toUpperCase() == 'IMG') {
	                        if (window.ActiveXObject) {
	                            if (image.readyState != 'complete') {
	                                return;
	                            }
	                        }
	                        else {
	                            if (!image.complete) {
	                                return;
	                            }
	                        }
	                    }
	                    // Else is canvas
	                    var width = style.width || image.width;
	                    var height = style.height || image.height;
	                    var x = style.x;
	                    var y = style.y;
	                    // 图片加载失败
	                    if (!image.width || !image.height) {
	                        return;
	                    }

	                    ctx.save();

	                    this.doClip(ctx);

	                    this.setContext(ctx, style);

	                    // 设置transform
	                    this.setTransform(ctx);

	                    if (style.sWidth && style.sHeight) {
	                        var sx = style.sx || 0;
	                        var sy = style.sy || 0;
	                        ctx.drawImage(
	                            image,
	                            sx, sy, style.sWidth, style.sHeight,
	                            x, y, width, height
	                        );
	                    }
	                    else if (style.sx && style.sy) {
	                        var sx = style.sx;
	                        var sy = style.sy;
	                        var sWidth = width - sx;
	                        var sHeight = height - sy;
	                        ctx.drawImage(
	                            image,
	                            sx, sy, sWidth, sHeight,
	                            x, y, width, height
	                        );
	                    }
	                    else {
	                        ctx.drawImage(image, x, y, width, height);
	                    }
	                    // 如果没设置宽和高的话自动根据图片宽高设置
	                    if (!style.width) {
	                        style.width = width;
	                    }
	                    if (!style.height) {
	                        style.height = height;
	                    }
	                    if (!this.style.width) {
	                        this.style.width = width;
	                    }
	                    if (!this.style.height) {
	                        this.style.height = height;
	                    }

	                    this.drawText(ctx, style, this.style);

	                    ctx.restore();
	                }
	            },

	            /**
	             * 计算返回图片的包围盒矩形
	             * @param {module:zrender/shape/Image~IImageStyle} style
	             * @return {module:zrender/shape/Base~IBoundingRect}
	             */
	            getRect: function(style) {
	                return {
	                    x : style.x,
	                    y : style.y,
	                    width : style.width,
	                    height : style.height
	                };
	            },

	            clearCache: function() {
	                this._imageCache = {};
	            }
	        };

	        __webpack_require__(5).inherits(ZImage, Base);
	        return ZImage;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Storage内容仓库模块
	 * @module zrender/Storage
	 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
	 * @author errorrik (errorrik@gmail.com)
	 * @author pissang (https://github.com/pissang/)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	        'use strict';

	        var util = __webpack_require__(5);

	        var Group = __webpack_require__(3);

	        var defaultIterateOption = {
	            hover: false,
	            normal: 'down',
	            update: false
	        };

	        function shapeCompareFunc(a, b) {
	            if (a.zlevel == b.zlevel) {
	                if (a.z == b.z) {
	                    return a.__renderidx - b.__renderidx;
	                }
	                return a.z - b.z;
	            }
	            return a.zlevel - b.zlevel;
	        }
	        /**
	         * 内容仓库 (M)
	         * @alias module:zrender/Storage
	         * @constructor
	         */
	        var Storage = function () {
	            // 所有常规形状，id索引的map
	            this._elements = {};

	            // 高亮层形状，不稳定，动态增删，数组位置也是z轴方向，靠前显示在下方
	            this._hoverElements = [];

	            this._roots = [];

	            this._shapeList = [];

	            this._shapeListOffset = 0;
	        };

	        /**
	         * 遍历迭代器
	         * 
	         * @param {Function} fun 迭代回调函数，return true终止迭代
	         * @param {Object} [option] 迭代参数，缺省为仅降序遍历普通层图形
	         * @param {boolean} [option.hover=true] 是否是高亮层图形
	         * @param {string} [option.normal='up'] 是否是普通层图形，迭代时是否指定及z轴顺序
	         * @param {boolean} [option.update=false] 是否在迭代前更新形状列表
	         * 
	         */
	        Storage.prototype.iterShape = function (fun, option) {
	            if (!option) {
	                option = defaultIterateOption;
	            }

	            if (option.hover) {
	                // 高亮层数据遍历
	                for (var i = 0, l = this._hoverElements.length; i < l; i++) {
	                    var el = this._hoverElements[i];
	                    el.updateTransform();
	                    if (fun(el)) {
	                        return this;
	                    }
	                }
	            }

	            if (option.update) {
	                this.updateShapeList();
	            }

	            // 遍历: 'down' | 'up'
	            switch (option.normal) {
	                case 'down':
	                    // 降序遍历，高层优先
	                    var l = this._shapeList.length;
	                    while (l--) {
	                        if (fun(this._shapeList[l])) {
	                            return this;
	                        }
	                    }
	                    break;
	                // case 'up':
	                default:
	                    // 升序遍历，底层优先
	                    for (var i = 0, l = this._shapeList.length; i < l; i++) {
	                        if (fun(this._shapeList[i])) {
	                            return this;
	                        }
	                    }
	                    break;
	            }

	            return this;
	        };

	        /**
	         * 返回hover层的形状数组
	         * @param  {boolean} [update=false] 是否在返回前更新图形的变换
	         * @return {Array.<module:zrender/shape/Base>}
	         */
	        Storage.prototype.getHoverShapes = function (update) {
	            // hoverConnect
	            var hoverElements = [];
	            for (var i = 0, l = this._hoverElements.length; i < l; i++) {
	                hoverElements.push(this._hoverElements[i]);
	                var target = this._hoverElements[i].hoverConnect;
	                if (target) {
	                    var shape;
	                    target = target instanceof Array ? target : [target];
	                    for (var j = 0, k = target.length; j < k; j++) {
	                        shape = target[j].id ? target[j] : this.get(target[j]);
	                        if (shape) {
	                            hoverElements.push(shape);
	                        }
	                    }
	                }
	            }
	            hoverElements.sort(shapeCompareFunc);
	            if (update) {
	                for (var i = 0, l = hoverElements.length; i < l; i++) {
	                    hoverElements[i].updateTransform();
	                }
	            }
	            return hoverElements;
	        };

	        /**
	         * 返回所有图形的绘制队列
	         * @param  {boolean} [update=false] 是否在返回前更新该数组
	         * 详见{@link module:zrender/shape/Base.prototype.updateShapeList}
	         * @return {Array.<module:zrender/shape/Base>}
	         */
	        Storage.prototype.getShapeList = function (update) {
	            if (update) {
	                this.updateShapeList();
	            }
	            return this._shapeList;
	        };

	        /**
	         * 更新图形的绘制队列。
	         * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
	         * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
	         */
	        Storage.prototype.updateShapeList = function () {
	            this._shapeListOffset = 0;
	            for (var i = 0, len = this._roots.length; i < len; i++) {
	                var root = this._roots[i];
	                this._updateAndAddShape(root);
	            }
	            this._shapeList.length = this._shapeListOffset;

	            for (var i = 0, len = this._shapeList.length; i < len; i++) {
	                this._shapeList[i].__renderidx = i;
	            }

	            this._shapeList.sort(shapeCompareFunc);
	        };

	        Storage.prototype._updateAndAddShape = function (el, clipShapes) {
	            
	            if (el.ignore) {
	                return;
	            }

	            el.updateTransform();

	            if (el.clipShape) {
	                // clipShape 的变换是基于 group 的变换
	                el.clipShape.parent = el;
	                el.clipShape.updateTransform();

	                // PENDING 效率影响
	                if (clipShapes) {
	                    clipShapes = clipShapes.slice();
	                    clipShapes.push(el.clipShape);
	                } else {
	                    clipShapes = [el.clipShape];
	                }
	            }

	            if (el.type == 'group') {
	                
	                for (var i = 0; i < el._children.length; i++) {
	                    var child = el._children[i];

	                    // Force to mark as dirty if group is dirty
	                    child.__dirty = el.__dirty || child.__dirty;

	                    this._updateAndAddShape(child, clipShapes);
	                }

	                // Mark group clean here
	                el.__dirty = false;
	                
	            }
	            else {
	                el.__clipShapes = clipShapes;

	                this._shapeList[this._shapeListOffset++] = el;
	            }
	        };

	        /**
	         * 修改图形(Shape)或者组(Group)
	         * 
	         * @param {string|module:zrender/shape/Base|module:zrender/Group} el
	         * @param {Object} [params] 参数
	         */
	        Storage.prototype.mod = function (el, params) {
	            if (typeof (el) === 'string') {
	                el = this._elements[el];
	            }
	            if (el) {

	                el.modSelf();

	                if (params) {
	                    // 如果第二个参数直接使用 shape
	                    // parent, _storage, __clipShapes 三个属性会有循环引用
	                    // 主要为了向 1.x 版本兼容，2.x 版本不建议使用第二个参数
	                    if (params.parent || params._storage || params.__clipShapes) {
	                        var target = {};
	                        for (var name in params) {
	                            if (
	                                name === 'parent'
	                                || name === '_storage'
	                                || name === '__clipShapes'
	                            ) {
	                                continue;
	                            }
	                            if (params.hasOwnProperty(name)) {
	                                target[name] = params[name];
	                            }
	                        }
	                        util.merge(el, target, true);
	                    }
	                    else {
	                        util.merge(el, params, true);
	                    }
	                }
	            }

	            return this;
	        };

	        /**
	         * 移动指定的图形(Shape)或者组(Group)的位置
	         * @param {string} shapeId 形状唯一标识
	         * @param {number} dx
	         * @param {number} dy
	         */
	        Storage.prototype.drift = function (shapeId, dx, dy) {
	            var shape = this._elements[shapeId];
	            if (shape) {
	                shape.needTransform = true;
	                if (shape.draggable === 'horizontal') {
	                    dy = 0;
	                }
	                else if (shape.draggable === 'vertical') {
	                    dx = 0;
	                }
	                if (!shape.ondrift // ondrift
	                    // 有onbrush并且调用执行返回false或undefined则继续
	                    || (shape.ondrift && !shape.ondrift(dx, dy))
	                ) {
	                    shape.drift(dx, dy);
	                }
	            }

	            return this;
	        };

	        /**
	         * 添加高亮层数据
	         * 
	         * @param {module:zrender/shape/Base} shape
	         */
	        Storage.prototype.addHover = function (shape) {
	            shape.updateNeedTransform();
	            this._hoverElements.push(shape);
	            return this;
	        };

	        /**
	         * 清空高亮层数据
	         */
	        Storage.prototype.delHover = function () {
	            this._hoverElements = [];
	            return this;
	        };

	        /**
	         * 是否有图形在高亮层里
	         * @return {boolean}
	         */
	        Storage.prototype.hasHoverShape = function () {
	            return this._hoverElements.length > 0;
	        };

	        /**
	         * 添加图形(Shape)或者组(Group)到根节点
	         * @param {module:zrender/shape/Shape|module:zrender/Group} el
	         */
	        Storage.prototype.addRoot = function (el) {
	            // Element has been added
	            if (this._elements[el.id]) {
	                return;
	            }

	            if (el instanceof Group) {
	                el.addChildrenToStorage(this);
	            }

	            this.addToMap(el);
	            this._roots.push(el);
	        };

	        /**
	         * 删除指定的图形(Shape)或者组(Group)
	         * @param {string|Array.<string>} [elId] 如果为空清空整个Storage
	         */
	        Storage.prototype.delRoot = function (elId) {
	            if (typeof(elId) == 'undefined') {
	                // 不指定elId清空
	                for (var i = 0; i < this._roots.length; i++) {
	                    var root = this._roots[i];
	                    if (root instanceof Group) {
	                        root.delChildrenFromStorage(this);
	                    }
	                }

	                this._elements = {};
	                this._hoverElements = [];
	                this._roots = [];
	                this._shapeList = [];
	                this._shapeListOffset = 0;

	                return;
	            }

	            if (elId instanceof Array) {
	                for (var i = 0, l = elId.length; i < l; i++) {
	                    this.delRoot(elId[i]);
	                }
	                return;
	            }

	            var el;
	            if (typeof(elId) == 'string') {
	                el = this._elements[elId];
	            }
	            else {
	                el = elId;
	            }

	            var idx = util.indexOf(this._roots, el);
	            if (idx >= 0) {
	                this.delFromMap(el.id);
	                this._roots.splice(idx, 1);
	                if (el instanceof Group) {
	                    el.delChildrenFromStorage(this);
	                }
	            }
	        };

	        Storage.prototype.addToMap = function (el) {
	            if (el instanceof Group) {
	                el._storage = this;
	            }
	            el.modSelf();

	            this._elements[el.id] = el;

	            return this;
	        };

	        Storage.prototype.get = function (elId) {
	            return this._elements[elId];
	        };

	        Storage.prototype.delFromMap = function (elId) {
	            var el = this._elements[elId];
	            if (el) {
	                delete this._elements[elId];

	                if (el instanceof Group) {
	                    el._storage = null;
	                }
	            }

	            return this;
	        };

	        /**
	         * 清空并且释放Storage
	         */
	        Storage.prototype.dispose = function () {
	            this._elements = 
	            this._renderList = 
	            this._roots =
	            this._hoverElements = null;
	        };

	        return Storage;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 动画主类, 调度和管理所有动画控制器
	 * 
	 * @module zrender/animation/Animation
	 * @author pissang(https://github.com/pissang)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	        
	        'use strict';

	        var Clip = __webpack_require__(38);
	        var color = __webpack_require__(17);
	        var util = __webpack_require__(5);
	        var Dispatcher = __webpack_require__(31).Dispatcher;

	        var requestAnimationFrame = window.requestAnimationFrame
	                                    || window.msRequestAnimationFrame
	                                    || window.mozRequestAnimationFrame
	                                    || window.webkitRequestAnimationFrame
	                                    || function (func) {
	                                        setTimeout(func, 16);
	                                    };

	        var arraySlice = Array.prototype.slice;

	        /**
	         * @typedef {Object} IZRenderStage
	         * @property {Function} update
	         */
	        
	        /** 
	         * @alias module:zrender/animation/Animation
	         * @constructor
	         * @param {Object} [options]
	         * @param {Function} [options.onframe]
	         * @param {IZRenderStage} [options.stage]
	         * @example
	         *     var animation = new Animation();
	         *     var obj = {
	         *         x: 100,
	         *         y: 100
	         *     };
	         *     animation.animate(node.position)
	         *         .when(1000, {
	         *             x: 500,
	         *             y: 500
	         *         })
	         *         .when(2000, {
	         *             x: 100,
	         *             y: 100
	         *         })
	         *         .start('spline');
	         */
	        var Animation = function (options) {

	            options = options || {};

	            this.stage = options.stage || {};

	            this.onframe = options.onframe || function() {};

	            // private properties
	            this._clips = [];

	            this._running = false;

	            this._time = 0;

	            Dispatcher.call(this);
	        };

	        Animation.prototype = {
	            /**
	             * 添加动画片段
	             * @param {module:zrender/animation/Clip} clip
	             */
	            add: function(clip) {
	                this._clips.push(clip);
	            },
	            /**
	             * 删除动画片段
	             * @param {module:zrender/animation/Clip} clip
	             */
	            remove: function(clip) {
	                var idx = util.indexOf(this._clips, clip);
	                if (idx >= 0) {
	                    this._clips.splice(idx, 1);
	                }
	            },
	            _update: function() {

	                var time = new Date().getTime();
	                var delta = time - this._time;
	                var clips = this._clips;
	                var len = clips.length;

	                var deferredEvents = [];
	                var deferredClips = [];
	                for (var i = 0; i < len; i++) {
	                    var clip = clips[i];
	                    var e = clip.step(time);
	                    // Throw out the events need to be called after
	                    // stage.update, like destroy
	                    if (e) {
	                        deferredEvents.push(e);
	                        deferredClips.push(clip);
	                    }
	                }

	                // Remove the finished clip
	                for (var i = 0; i < len;) {
	                    if (clips[i]._needsRemove) {
	                        clips[i] = clips[len - 1];
	                        clips.pop();
	                        len--;
	                    }
	                    else {
	                        i++;
	                    }
	                }

	                len = deferredEvents.length;
	                for (var i = 0; i < len; i++) {
	                    deferredClips[i].fire(deferredEvents[i]);
	                }

	                this._time = time;

	                this.onframe(delta);

	                this.dispatch('frame', delta);

	                if (this.stage.update) {
	                    this.stage.update();
	                }
	            },
	            /**
	             * 开始运行动画
	             */
	            start: function () {
	                var self = this;

	                this._running = true;

	                function step() {
	                    if (self._running) {
	                        
	                        requestAnimationFrame(step);

	                        self._update();
	                    }
	                }

	                this._time = new Date().getTime();
	                requestAnimationFrame(step);
	            },
	            /**
	             * 停止运行动画
	             */
	            stop: function () {
	                this._running = false;
	            },
	            /**
	             * 清除所有动画片段
	             */
	            clear : function () {
	                this._clips = [];
	            },
	            /**
	             * 对一个目标创建一个animator对象，可以指定目标中的属性使用动画
	             * @param  {Object} target
	             * @param  {Object} options
	             * @param  {boolean} [options.loop=false] 是否循环播放动画
	             * @param  {Function} [options.getter=null]
	             *         如果指定getter函数，会通过getter函数取属性值
	             * @param  {Function} [options.setter=null]
	             *         如果指定setter函数，会通过setter函数设置属性值
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            animate : function (target, options) {
	                options = options || {};
	                var deferred = new Animator(
	                    target,
	                    options.loop,
	                    options.getter, 
	                    options.setter
	                );
	                deferred.animation = this;
	                return deferred;
	            },
	            constructor: Animation
	        };

	        util.merge(Animation.prototype, Dispatcher.prototype, true);

	        function _defaultGetter(target, key) {
	            return target[key];
	        }

	        function _defaultSetter(target, key, value) {
	            target[key] = value;
	        }

	        function _interpolateNumber(p0, p1, percent) {
	            return (p1 - p0) * percent + p0;
	        }

	        function _interpolateArray(p0, p1, percent, out, arrDim) {
	            var len = p0.length;
	            if (arrDim == 1) {
	                for (var i = 0; i < len; i++) {
	                    out[i] = _interpolateNumber(p0[i], p1[i], percent); 
	                }
	            }
	            else {
	                var len2 = p0[0].length;
	                for (var i = 0; i < len; i++) {
	                    for (var j = 0; j < len2; j++) {
	                        out[i][j] = _interpolateNumber(
	                            p0[i][j], p1[i][j], percent
	                        );
	                    }
	                }
	            }
	        }

	        function _isArrayLike(data) {
	            switch (typeof data) {
	                case 'undefined':
	                case 'string':
	                    return false;
	            }
	            
	            return typeof data.length !== 'undefined';
	        }

	        function _catmullRomInterpolateArray(
	            p0, p1, p2, p3, t, t2, t3, out, arrDim
	        ) {
	            var len = p0.length;
	            if (arrDim == 1) {
	                for (var i = 0; i < len; i++) {
	                    out[i] = _catmullRomInterpolate(
	                        p0[i], p1[i], p2[i], p3[i], t, t2, t3
	                    );
	                }
	            }
	            else {
	                var len2 = p0[0].length;
	                for (var i = 0; i < len; i++) {
	                    for (var j = 0; j < len2; j++) {
	                        out[i][j] = _catmullRomInterpolate(
	                            p0[i][j], p1[i][j], p2[i][j], p3[i][j],
	                            t, t2, t3
	                        );
	                    }
	                }
	            }
	        }

	        function _catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
	            var v0 = (p2 - p0) * 0.5;
	            var v1 = (p3 - p1) * 0.5;
	            return (2 * (p1 - p2) + v0 + v1) * t3 
	                    + (-3 * (p1 - p2) - 2 * v0 - v1) * t2
	                    + v0 * t + p1;
	        }

	        function _cloneValue(value) {
	            if (_isArrayLike(value)) {
	                var len = value.length;
	                if (_isArrayLike(value[0])) {
	                    var ret = [];
	                    for (var i = 0; i < len; i++) {
	                        ret.push(arraySlice.call(value[i]));
	                    }
	                    return ret;
	                }
	                else {
	                    return arraySlice.call(value);
	                }
	            }
	            else {
	                return value;
	            }
	        }

	        function rgba2String(rgba) {
	            rgba[0] = Math.floor(rgba[0]);
	            rgba[1] = Math.floor(rgba[1]);
	            rgba[2] = Math.floor(rgba[2]);

	            return 'rgba(' + rgba.join(',') + ')';
	        }

	        /**
	         * @alias module:zrender/animation/Animation~Animator
	         * @constructor
	         * @param {Object} target
	         * @param {boolean} loop
	         * @param {Function} getter
	         * @param {Function} setter
	         */
	        var Animator = function(target, loop, getter, setter) {
	            this._tracks = {};
	            this._target = target;

	            this._loop = loop || false;

	            this._getter = getter || _defaultGetter;
	            this._setter = setter || _defaultSetter;

	            this._clipCount = 0;

	            this._delay = 0;

	            this._doneList = [];

	            this._onframeList = [];

	            this._clipList = [];
	        };

	        Animator.prototype = {
	            /**
	             * 设置动画关键帧
	             * @param  {number} time 关键帧时间，单位是ms
	             * @param  {Object} props 关键帧的属性值，key-value表示
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            when : function(time /* ms */, props) {
	                for (var propName in props) {
	                    if (!this._tracks[propName]) {
	                        this._tracks[propName] = [];
	                        // If time is 0 
	                        //  Then props is given initialize value
	                        // Else
	                        //  Initialize value from current prop value
	                        if (time !== 0) {
	                            this._tracks[propName].push({
	                                time : 0,
	                                value : _cloneValue(
	                                    this._getter(this._target, propName)
	                                )
	                            });
	                        }
	                    }
	                    this._tracks[propName].push({
	                        time : parseInt(time, 10),
	                        value : props[propName]
	                    });
	                }
	                return this;
	            },
	            /**
	             * 添加动画每一帧的回调函数
	             * @param  {Function} callback
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            during: function (callback) {
	                this._onframeList.push(callback);
	                return this;
	            },
	            /**
	             * 开始执行动画
	             * @param  {string|Function} easing 
	             *         动画缓动函数，详见{@link module:zrender/animation/easing}
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            start: function (easing) {

	                var self = this;
	                var setter = this._setter;
	                var getter = this._getter;
	                var useSpline = easing === 'spline';

	                var ondestroy = function() {
	                    self._clipCount--;
	                    if (self._clipCount === 0) {
	                        // Clear all tracks
	                        self._tracks = {};

	                        var len = self._doneList.length;
	                        for (var i = 0; i < len; i++) {
	                            self._doneList[i].call(self);
	                        }
	                    }
	                };

	                var createTrackClip = function (keyframes, propName) {
	                    var trackLen = keyframes.length;
	                    if (!trackLen) {
	                        return;
	                    }
	                    // Guess data type
	                    var firstVal = keyframes[0].value;
	                    var isValueArray = _isArrayLike(firstVal);
	                    var isValueColor = false;

	                    // For vertices morphing
	                    var arrDim = (
	                            isValueArray 
	                            && _isArrayLike(firstVal[0])
	                        )
	                        ? 2 : 1;
	                    // Sort keyframe as ascending
	                    keyframes.sort(function(a, b) {
	                        return a.time - b.time;
	                    });
	                    var trackMaxTime;
	                    if (trackLen) {
	                        trackMaxTime = keyframes[trackLen - 1].time;
	                    }
	                    else {
	                        return;
	                    }
	                    // Percents of each keyframe
	                    var kfPercents = [];
	                    // Value of each keyframe
	                    var kfValues = [];
	                    for (var i = 0; i < trackLen; i++) {
	                        kfPercents.push(keyframes[i].time / trackMaxTime);
	                        // Assume value is a color when it is a string
	                        var value = keyframes[i].value;
	                        if (typeof(value) == 'string') {
	                            value = color.toArray(value);
	                            if (value.length === 0) {    // Invalid color
	                                value[0] = value[1] = value[2] = 0;
	                                value[3] = 1;
	                            }
	                            isValueColor = true;
	                        }
	                        kfValues.push(value);
	                    }

	                    // Cache the key of last frame to speed up when 
	                    // animation playback is sequency
	                    var cacheKey = 0;
	                    var cachePercent = 0;
	                    var start;
	                    var i;
	                    var w;
	                    var p0;
	                    var p1;
	                    var p2;
	                    var p3;


	                    if (isValueColor) {
	                        var rgba = [ 0, 0, 0, 0 ];
	                    }

	                    var onframe = function (target, percent) {
	                        // Find the range keyframes
	                        // kf1-----kf2---------current--------kf3
	                        // find kf2 and kf3 and do interpolation
	                        if (percent < cachePercent) {
	                            // Start from next key
	                            start = Math.min(cacheKey + 1, trackLen - 1);
	                            for (i = start; i >= 0; i--) {
	                                if (kfPercents[i] <= percent) {
	                                    break;
	                                }
	                            }
	                            i = Math.min(i, trackLen - 2);
	                        }
	                        else {
	                            for (i = cacheKey; i < trackLen; i++) {
	                                if (kfPercents[i] > percent) {
	                                    break;
	                                }
	                            }
	                            i = Math.min(i - 1, trackLen - 2);
	                        }
	                        cacheKey = i;
	                        cachePercent = percent;

	                        var range = (kfPercents[i + 1] - kfPercents[i]);
	                        if (range === 0) {
	                            return;
	                        }
	                        else {
	                            w = (percent - kfPercents[i]) / range;
	                        }
	                        if (useSpline) {
	                            p1 = kfValues[i];
	                            p0 = kfValues[i === 0 ? i : i - 1];
	                            p2 = kfValues[i > trackLen - 2 ? trackLen - 1 : i + 1];
	                            p3 = kfValues[i > trackLen - 3 ? trackLen - 1 : i + 2];
	                            if (isValueArray) {
	                                _catmullRomInterpolateArray(
	                                    p0, p1, p2, p3, w, w * w, w * w * w,
	                                    getter(target, propName),
	                                    arrDim
	                                );
	                            }
	                            else {
	                                var value;
	                                if (isValueColor) {
	                                    value = _catmullRomInterpolateArray(
	                                        p0, p1, p2, p3, w, w * w, w * w * w,
	                                        rgba, 1
	                                    );
	                                    value = rgba2String(rgba);
	                                }
	                                else {
	                                    value = _catmullRomInterpolate(
	                                        p0, p1, p2, p3, w, w * w, w * w * w
	                                    );
	                                }
	                                setter(
	                                    target,
	                                    propName,
	                                    value
	                                );
	                            }
	                        }
	                        else {
	                            if (isValueArray) {
	                                _interpolateArray(
	                                    kfValues[i], kfValues[i + 1], w,
	                                    getter(target, propName),
	                                    arrDim
	                                );
	                            }
	                            else {
	                                var value;
	                                if (isValueColor) {
	                                    _interpolateArray(
	                                        kfValues[i], kfValues[i + 1], w,
	                                        rgba, 1
	                                    );
	                                    value = rgba2String(rgba);
	                                }
	                                else {
	                                    value = _interpolateNumber(kfValues[i], kfValues[i + 1], w);
	                                }
	                                setter(
	                                    target,
	                                    propName,
	                                    value
	                                );
	                            }
	                        }

	                        for (i = 0; i < self._onframeList.length; i++) {
	                            self._onframeList[i](target, percent);
	                        }
	                    };

	                    var clip = new Clip({
	                        target : self._target,
	                        life : trackMaxTime,
	                        loop : self._loop,
	                        delay : self._delay,
	                        onframe : onframe,
	                        ondestroy : ondestroy
	                    });

	                    if (easing && easing !== 'spline') {
	                        clip.easing = easing;
	                    }
	                    self._clipList.push(clip);
	                    self._clipCount++;
	                    self.animation.add(clip);
	                };

	                for (var propName in this._tracks) {
	                    createTrackClip(this._tracks[propName], propName);
	                }
	                return this;
	            },
	            /**
	             * 停止动画
	             */
	            stop : function() {
	                for (var i = 0; i < this._clipList.length; i++) {
	                    var clip = this._clipList[i];
	                    this.animation.remove(clip);
	                }
	                this._clipList = [];
	            },
	            /**
	             * 设置动画延迟开始的时间
	             * @param  {number} time 单位ms
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            delay : function (time) {
	                this._delay = time;
	                return this;
	            },
	            /**
	             * 添加动画结束的回调
	             * @param  {Function} cb
	             * @return {module:zrender/animation/Animation~Animator}
	             */
	            done : function(cb) {
	                if (cb) {
	                    this._doneList.push(cb);
	                }
	                return this;
	            }
	        };

	        return Animation;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 动画主控制器
	 * @config target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
	 * @config life(1000) 动画时长
	 * @config delay(0) 动画延迟时间
	 * @config loop(true)
	 * @config gap(0) 循环的间隔时间
	 * @config onframe
	 * @config easing(optional)
	 * @config ondestroy(optional)
	 * @config onrestart(optional)
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {

	        var Easing = __webpack_require__(39);

	        function Clip(options) {

	            this._targetPool = options.target || {};
	            if (!(this._targetPool instanceof Array)) {
	                this._targetPool = [ this._targetPool ];
	            }

	            // 生命周期
	            this._life = options.life || 1000;
	            // 延时
	            this._delay = options.delay || 0;
	            // 开始时间
	            this._startTime = new Date().getTime() + this._delay;// 单位毫秒

	            // 结束时间
	            this._endTime = this._startTime + this._life * 1000;

	            // 是否循环
	            this.loop = typeof options.loop == 'undefined'
	                        ? false : options.loop;

	            this.gap = options.gap || 0;

	            this.easing = options.easing || 'Linear';

	            this.onframe = options.onframe;
	            this.ondestroy = options.ondestroy;
	            this.onrestart = options.onrestart;
	        }

	        Clip.prototype = {
	            step : function (time) {
	                var percent = (time - this._startTime) / this._life;

	                // 还没开始
	                if (percent < 0) {
	                    return;
	                }

	                percent = Math.min(percent, 1);

	                var easingFunc = typeof this.easing == 'string'
	                                 ? Easing[this.easing]
	                                 : this.easing;
	                var schedule = typeof easingFunc === 'function'
	                    ? easingFunc(percent)
	                    : percent;

	                this.fire('frame', schedule);

	                // 结束
	                if (percent == 1) {
	                    if (this.loop) {
	                        this.restart();
	                        // 重新开始周期
	                        // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件
	                        return 'restart';
	                    }
	                    
	                    // 动画完成将这个控制器标识为待删除
	                    // 在Animation.update中进行批量删除
	                    this._needsRemove = true;
	                    return 'destroy';
	                }
	                
	                return null;
	            },
	            restart : function() {
	                var time = new Date().getTime();
	                var remainder = (time - this._startTime) % this._life;
	                this._startTime = new Date().getTime() - remainder + this.gap;

	                this._needsRemove = false;
	            },
	            fire : function(eventType, arg) {
	                for (var i = 0, len = this._targetPool.length; i < len; i++) {
	                    if (this['on' + eventType]) {
	                        this['on' + eventType](this._targetPool[i], arg);
	                    }
	                }
	            },
	            constructor: Clip
	        };

	        return Clip;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        /**
	         * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
	         * @see http://sole.github.io/tween.js/examples/03_graphs.html
	         * @exports zrender/animation/easing
	         */
	        var easing = {
	            // 线性
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            Linear: function (k) {
	                return k;
	            },

	            // 二次方的缓动（t^2）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuadraticIn: function (k) {
	                return k * k;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuadraticOut: function (k) {
	                return k * (2 - k);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuadraticInOut: function (k) {
	                if ((k *= 2) < 1) {
	                    return 0.5 * k * k;
	                }
	                return -0.5 * (--k * (k - 2) - 1);
	            },

	            // 三次方的缓动（t^3）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CubicIn: function (k) {
	                return k * k * k;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CubicOut: function (k) {
	                return --k * k * k + 1;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CubicInOut: function (k) {
	                if ((k *= 2) < 1) {
	                    return 0.5 * k * k * k;
	                }
	                return 0.5 * ((k -= 2) * k * k + 2);
	            },

	            // 四次方的缓动（t^4）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuarticIn: function (k) {
	                return k * k * k * k;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuarticOut: function (k) {
	                return 1 - (--k * k * k * k);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuarticInOut: function (k) {
	                if ((k *= 2) < 1) {
	                    return 0.5 * k * k * k * k;
	                }
	                return -0.5 * ((k -= 2) * k * k * k - 2);
	            },

	            // 五次方的缓动（t^5）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuinticIn: function (k) {
	                return k * k * k * k * k;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuinticOut: function (k) {
	                return --k * k * k * k * k + 1;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            QuinticInOut: function (k) {
	                if ((k *= 2) < 1) {
	                    return 0.5 * k * k * k * k * k;
	                }
	                return 0.5 * ((k -= 2) * k * k * k * k + 2);
	            },

	            // 正弦曲线的缓动（sin(t)）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            SinusoidalIn: function (k) {
	                return 1 - Math.cos(k * Math.PI / 2);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            SinusoidalOut: function (k) {
	                return Math.sin(k * Math.PI / 2);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            SinusoidalInOut: function (k) {
	                return 0.5 * (1 - Math.cos(Math.PI * k));
	            },

	            // 指数曲线的缓动（2^t）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ExponentialIn: function (k) {
	                return k === 0 ? 0 : Math.pow(1024, k - 1);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ExponentialOut: function (k) {
	                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ExponentialInOut: function (k) {
	                if (k === 0) {
	                    return 0;
	                }
	                if (k === 1) {
	                    return 1;
	                }
	                if ((k *= 2) < 1) {
	                    return 0.5 * Math.pow(1024, k - 1);
	                }
	                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
	            },

	            // 圆形曲线的缓动（sqrt(1-t^2)）
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CircularIn: function (k) {
	                return 1 - Math.sqrt(1 - k * k);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CircularOut: function (k) {
	                return Math.sqrt(1 - (--k * k));
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            CircularInOut: function (k) {
	                if ((k *= 2) < 1) {
	                    return -0.5 * (Math.sqrt(1 - k * k) - 1);
	                }
	                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
	            },

	            // 创建类似于弹簧在停止前来回振荡的动画
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ElasticIn: function (k) {
	                var s; 
	                var a = 0.1;
	                var p = 0.4;
	                if (k === 0) {
	                    return 0;
	                }
	                if (k === 1) {
	                    return 1;
	                }
	                if (!a || a < 1) {
	                    a = 1; s = p / 4;
	                }
	                else {
	                    s = p * Math.asin(1 / a) / (2 * Math.PI);
	                }
	                return -(a * Math.pow(2, 10 * (k -= 1)) *
	                            Math.sin((k - s) * (2 * Math.PI) / p));
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ElasticOut: function (k) {
	                var s;
	                var a = 0.1;
	                var p = 0.4;
	                if (k === 0) {
	                    return 0;
	                }
	                if (k === 1) {
	                    return 1;
	                }
	                if (!a || a < 1) {
	                    a = 1; s = p / 4;
	                }
	                else {
	                    s = p * Math.asin(1 / a) / (2 * Math.PI);
	                }
	                return (a * Math.pow(2, -10 * k) *
	                        Math.sin((k - s) * (2 * Math.PI) / p) + 1);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            ElasticInOut: function (k) {
	                var s;
	                var a = 0.1;
	                var p = 0.4;
	                if (k === 0) {
	                    return 0;
	                }
	                if (k === 1) {
	                    return 1;
	                }
	                if (!a || a < 1) {
	                    a = 1; s = p / 4;
	                }
	                else {
	                    s = p * Math.asin(1 / a) / (2 * Math.PI);
	                }
	                if ((k *= 2) < 1) {
	                    return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
	                        * Math.sin((k - s) * (2 * Math.PI) / p));
	                }
	                return a * Math.pow(2, -10 * (k -= 1))
	                        * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

	            },

	            // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BackIn: function (k) {
	                var s = 1.70158;
	                return k * k * ((s + 1) * k - s);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BackOut: function (k) {
	                var s = 1.70158;
	                return --k * k * ((s + 1) * k + s) + 1;
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BackInOut: function (k) {
	                var s = 1.70158 * 1.525;
	                if ((k *= 2) < 1) {
	                    return 0.5 * (k * k * ((s + 1) * k - s));
	                }
	                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
	            },

	            // 创建弹跳效果
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BounceIn: function (k) {
	                return 1 - easing.BounceOut(1 - k);
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BounceOut: function (k) {
	                if (k < (1 / 2.75)) {
	                    return 7.5625 * k * k;
	                }
	                else if (k < (2 / 2.75)) {
	                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
	                }
	                else if (k < (2.5 / 2.75)) {
	                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
	                }
	                else {
	                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
	                }
	            },
	            /**
	             * @param {number} k
	             * @return {number}
	             */
	            BounceInOut: function (k) {
	                if (k < 0.5) {
	                    return easing.BounceIn(k * 2) * 0.5;
	                }
	                return easing.BounceOut(k * 2 - 1) * 0.5 + 0.5;
	            }
	        };

	        return easing;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 各个法定刑和主刑组合情况的配置集合
	 */
	module.exports = function () {

	    var RANGE_CONFIG = {};

	    var DataManager = __webpack_require__(23);
	    // 注册案由配置
	    //故意伤害罪
	    var CONFIG_9903104030000 = __webpack_require__(41);
	    RANGE_CONFIG.CONFIG_9903104030000 = CONFIG_9903104030000();
	    
	    //危险驾驶罪
	    var CONFIG_9903102470000 = __webpack_require__(42);
	    RANGE_CONFIG.CONFIG_9903102470000 = CONFIG_9903102470000();

	    //交通肇事
	    var CONFIG_9903102370000 = __webpack_require__(43);
	    RANGE_CONFIG.CONFIG_9903102370000 = CONFIG_9903102370000();

	    //盗窃罪
	    var CONFIG_9903105020000 = __webpack_require__(44);
	    RANGE_CONFIG.CONFIG_9903105020000 = CONFIG_9903105020000();



	    


	    return RANGE_CONFIG;
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 故意伤害罪-各个法定刑和主刑组合情况的配置集合
	 */
	module.exports = function () {


	    var DataManager = __webpack_require__(23);


	    /**
	     * 
	     */
	    var COA_PENALTY_CONFIG = {
	        /**
	        *  0-3年法定刑主刑拘役刻度范围
	        */
	        RANGE_10000000002_1: {
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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle > 6 && min < 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", 6, max > middle + 0.5 ? middle + 0.5 : max);
	                }
	                if (middle <= 6 && max > 6) {
	                    result.recText = createCommonRecText("拘役", middle - 0.5, 6);
	                }
	                if (min >= 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle >= 1 && min < 1) {
	                    result.recText = createCommonRecText("拘役", 1, max > middle + 0.5 ? middle + 0.5 : max);
	                }
	                return result;
	            }
	        },

	        /**
	        *  0-3年法定刑刻度范围,管制
	        */
	        RANGE_10000000002_2: {
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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                //管制开始
	                if (middle > 24 && min < 24) {
	                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", 24, max > middle + 1.5 ? middle + 1.5 : max);
	                }
	                if (min >= 24) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
	                }
	                if (middle <= 24 && max > 24) {
	                    result.recText = createCommonRecText("管制", middle - 1.5, 24);
	                }
	                if (middle < 3) {
	                    result.hint = "计算结果已低于管制最小范围，建议更换刑种为拘役";
	                    result.recText = createCommonRecText("拘役", 1, max);
	                }
	                if (middle >= 3 && min < 3) {
	                    result.recText = createCommonRecText("管制", 3,  max > middle + 1.5 ? middle + 1.5 : max);
	                }
	                if (min >= 3 && max <= 24) {
	                    result.recText = createCommonRecText("管制", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                return result;
	            }

	        },
	        /**
	        *  0-3年法定刑刻度范围,有期徒刑
	        */
	        RANGE_10000000002_3: {
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
	            legalPenaltyLow: 0,
	            rangeMax: 36,
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle <= 6 && middle >= 1 ) {
	                    result.hint = "计算结果已低于有期徒刑最小范围，建议更换刑种为拘役或管制";
	                    max = max > 6 ? 6 : max;
	                    min = min < 1 ? 1: min;
	                    result.recText = createCommonRecText("拘役", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle > 6 && min < 6) {
	                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 6 ? middle + 6 : max);
	                }
	                if (min >= 6) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                }
	                return result;
	            }
	        },

	        /**
	        *  3-10年的法定刑刻度范围
	        */
	        RANGE_10000000003_3: {
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
	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min, max )
	                };
	                result.recText = createCommonRecText("有期徒刑", min, max);
	                return result;
	            }
	        },

	        /**
	        *  10年以上的法定刑刻度范围
	        */
	        RANGE_10000000001_3: {
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle > 15 * 12) {
	                    result.hint = "建议更换主刑为无期徒刑或死刑";
	                    result.recText = "无期徒刑或死刑";
	                }
	                if (middle <= 15 * 12 && max > 15 * 12) {
	                    result.recText = createCommonRecText(this.title, middle - 12,
	                        15 * 12);
	                }
	                return result;
	            }
	        },

	        /**
	        *  15年以上的法定刑刻度范围-无期
	        */
	        RANGE_10000000001_4: {
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
	                return '无期徒刑';
	            }
	        },

	        /**
	        *  15年以上的法定刑刻度范围-死刑
	        */
	        RANGE_10000000001_5: {
	            title: "死刑",
	            unitLabel: "-",
	            unitText: "年",
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
	                return '死刑';
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

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 危险驾驶罪-各个法定刑和主刑组合情况的配置集合
	 */
	module.exports = function () {


	    var DataManager = __webpack_require__(23);


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
	            legalPenaltyLow: 1,
	            rangeMax: 6,
	            rangeMin: 0,
	            markCreateFuntion: function (i) {
	                return i;
	            }, 
	            createRecText: function (penaltyData, dataResult) {
	                var max = dataResult.finalResult.max;
	                var min = dataResult.finalResult.min;
	                var middle = (max + min) / 2;
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle >= 1 && min < 1) {
	                    result.recText = createCommonRecText("拘役", 1, max > middle + 0.5 ? middle + 0.5 : max);
	                }
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

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 交通肇事罪-各个法定刑和主刑组合情况的配置集合
	 */
	module.exports = function () {


	    var DataManager = __webpack_require__(23);



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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle > 6 && min < 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", 6, max > middle + 0.5 ? middle + 0.5 : max);
	                }
	                if (middle <= 6 && max > 6) {
	                    result.recText = createCommonRecText("拘役", middle - 0.5, 6);
	                }
	                if (min >= 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle >= 1 && min < 1) {
	                    result.recText = createCommonRecText("拘役", 1, max > middle + 0.5 ? middle + 0.5 : max);
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
	            legalPenaltyLow: 0,
	            rangeMax: 36,
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle <= 6 && middle >= 1 ) {
	                    result.hint = "计算结果已低于有期徒刑最小范围，建议更换刑种为拘役";
	                    max = max > 6 ? 6 : max;
	                    min = min < 1 ? 1: min;
	                    result.recText = createCommonRecText("拘役", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle > 6 && min < 6) {
	                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 6 ? middle + 6 : max);
	                }
	                if (min >= 6) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min, max )
	                };
	                result.recText = createCommonRecText("有期徒刑", min, max);
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle > 6 && min < 6) {
	                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 12 ? middle + 12 : max);
	                }
	                if (min >= 6) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
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

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * 盗窃罪-各个法定刑和主刑组合情况的配置集合
	 */
	module.exports = function () {


	    var DataManager = __webpack_require__(23);


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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle > 6 && min < 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", 6, max > middle + 0.5 ? middle + 0.5 : max);
	                }
	                if (middle <= 6 && max > 6) {
	                    result.recText = createCommonRecText("拘役", middle - 0.5, 6);
	                }
	                if (min >= 6) {
	                    result.hint = "计算结果已超过拘役最大范围，建议更换刑种为管制或有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle >= 1 && min < 1) {
	                    result.recText = createCommonRecText("拘役", 1, max > middle + 0.5 ? middle + 0.5 : max);
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
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                //管制开始
	                if (middle > 24 && min < 24) {
	                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
	                    result.recText = createCommonRecText("有期徒刑", 24, max > middle + 1.5 ? middle + 1.5 : max);
	                }
	                if (min >= 24) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
	                    result.hint = "计算结果已超过管制最大范围，建议更换刑种为有期徒刑";
	                }
	                if (middle <= 24 && max > 24) {
	                    result.recText = createCommonRecText("管制", middle - 1.5, 24);
	                }
	                if (middle < 3) {
	                    result.hint = "计算结果已低于管制最小范围，建议更换刑种为拘役";
	                    result.recText = createCommonRecText("拘役", 1, max);
	                }
	                if (middle >= 3 && min < 3) {
	                    result.recText = createCommonRecText("管制", 3,  max > middle + 1.5 ? middle + 1.5 : max);
	                }
	                if (min >= 3 && max <= 24) {
	                    result.recText = createCommonRecText("管制", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
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
	            legalPenaltyLow: 0,
	            rangeMax: 36,
	            rangeMin: 0,
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle <= 6 && middle >= 1 ) {
	                    result.hint = "计算结果已低于有期徒刑最小范围，建议更换刑种为拘役或管制";
	                    max = max > 6 ? 6 : max;
	                    min = min < 1 ? 1: min;
	                    result.recText = createCommonRecText("拘役", min, max);
	                }
	                if (middle < 1) {
	                    result.hint = "建议单处罚金或定罪免罚";
	                    result.recText = "定罪免罚或单处罚金";
	                }
	                if (middle > 6 && min < 6) {
	                    result.recText = createCommonRecText("有期徒刑", 6,  max > middle + 6 ? middle + 6 : max);
	                }
	                if (min >= 6) {
	                    result.recText = createCommonRecText("有期徒刑", min, max);
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
	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min, max )
	                };
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
	                max = parseFloat(max.toFixed(2));
	                min = parseFloat(min.toFixed(2));
	                middle = parseFloat(middle.toFixed(2));

	                var result = {
	                    hint: "",
	                    recText: createCommonRecText(this.title, min,  max)
	                };
	                if (middle > 15 * 12) {
	                    result.hint = "建议更换主刑为无期徒刑";
	                    result.recText = "无期徒刑";
	                }
	                if (middle <= 15 * 12 && max > 15 * 12) {
	                    result.recText = createCommonRecText(this.title, middle - 12,
	                        15 * 12);
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
	                return '无期徒刑';
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

/***/ }
/******/ ]);