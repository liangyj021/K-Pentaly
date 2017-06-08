/**
 * 各个法定刑和主刑组合情况的配置集合
 */
module.exports = function () {

    var RANGE_CONFIG = {};

    var DataManager = require('./DataManager.js');
    // 注册案由配置
    //故意伤害罪
    var CONFIG_9903104030000 = require('./RangeInfoConfig/9903104030000.js');
    RANGE_CONFIG.CONFIG_9903104030000 = CONFIG_9903104030000();
    
    //危险驾驶罪
    var CONFIG_9903102470000 = require('./RangeInfoConfig/9903102470000.js');
    RANGE_CONFIG.CONFIG_9903102470000 = CONFIG_9903102470000();

    //交通肇事
    var CONFIG_9903102370000 = require('./RangeInfoConfig/9903102370000.js');
    RANGE_CONFIG.CONFIG_9903102370000 = CONFIG_9903102370000();

    //盗窃罪
    var CONFIG_9903105020000 = require('./RangeInfoConfig/9903105020000.js');
    RANGE_CONFIG.CONFIG_9903105020000 = CONFIG_9903105020000();



    


    return RANGE_CONFIG;
}