/**
 * Created by coin on 1/13/17.
 */

'use strict';

//工具类


let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

export default class Tool {

    constructor() {
        if (__instance()) return __instance();

        //init
        this.requestCount = 0;//判断加载动画是否需要隐藏

        __instance(this);
    }

    static sharedInstance() {
        return new Tool();
    }

    static formatTime(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        return [year, month, day].map(Tool.formatNumber).join('-') + ' ' + [hour, minute, second].map(Tool.formatNumber).join(':');
    }

    static formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    }

    static timeIntervalFromString(string) {
        let date = Tool.dateFromString(string);
        let timeInterval = date.getTime() / 1000;
        return timeInterval;
    }

    static dateFromString(string) {
        let date = new Date(string.replace(/-/g, '/'));
        return date;
    }

    static timeStringForDateString(string, formate) {
        if ('1900-01-01 00:00:00' === string) {
            return '空';
        }
        let date = Tool.dateFromString(string);
        let timeString = Tool.timeStringForDate(date, formate);
        return timeString;
    }

    static timeStringForDate(date, formate) {
        let timeString = Date.format(date,formate);
        return timeString;
    }

    static timeDurationStringForDateString(string) {
        if (Tool.isEmptyStr(string)) {
            return;
        }
        let duration = new Date().getTime() / 1000 - Tool.timeIntervalFromString(string);
        let time = '';
        let count = 1;
        if (duration < 60 * 60) {
            count = parseInt(duration / 60.0);
            time = count + "分钟前";
        }
        else if (duration < (24 * 60 * 60)) {
            count = parseInt(duration / 60 / 60);
            time = count + "小时前";
        } else {
            time = Tool.timeStringForDateString(string, "MM-DD HH:mm");
        }

        return (time);
    }

    //生成UUID
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    //拼接网址
    static generateURL(baseURL, params) {
        if (undefined !== params) {
            let pairs = [];
            for (let key in params) {
                let value = params[key];
                let pair = key + "=" + value;
                pairs.push(pair);
            }

            let query = pairs.join('&');
            let url = baseURL + '?' + query;
            url = encodeURI(url);
            return url;
        }
        else {
            return baseURL;
        }
    }

    //Object 空值判断
    static isEmpty(object) {
        if (object === null || object === undefined) {
            return true;
        }
        for (let i in object) {
            return false;
        }
        return true;
    }

    static isValid(object) {
        return !Tool.isEmpty(object);
    }

    static isEmptyId(theId) {
        if (Tool.isEmptyStr(theId)) {
            return true;
        }
        if ('00000000-0000-0000-0000-000000000000' === theId) {
            return true;
        }
        return false;
    }

    static isValidId(theId) {
        return !Tool.isEmptyId(theId);
    }

    static isEmptyObject(obj) {
        if (Tool.isEmpty(obj)) {
            return true;
        }
        for (var name in obj) {
            return false;
        }
        return true;
    }

    static isValidObject(obj) {
        return !Tool.isEmptyObject(obj);
    }

    //String 空值判断
    static isEmptyStr(str) {
        if (Tool.isEmpty(str)) {
            return true;
        }
        else if (str instanceof String && str.length === 0) {
            return true;
        }
        return false;
    }

    static isValidStr(str) {
        return !Tool.isEmptyStr(str);
    }

    //Array 空值判断
    static isEmptyArr(arr) {
        if (Tool.isEmpty(arr)) {
            return true;
        }
        else if (arr instanceof Array && arr.length === 0) {
            return true;
        }
        return false;
    }

    static isValidArr(arr) {
        return !Tool.isEmptyArr(arr);
    }

    /**
     * 数组是否越界判断
     */
    static isArrValidForIndex(arr, index) {
        if (Tool.isValidArr(arr) && arr.length > index) {
            return true;
        }
        return false;
    }

    static isTrue(str) {
        if (Tool.isEmptyStr(str)) {
            return false;
        }
        return 'true' === str.toLowerCase();
    }

    static isFalse(str) {
        return !Tool.isTrue(str);
    }

    static isFunction(fun) {
        return typeof fun === 'function';
    }

    //弹窗提示
    static showAlert(msg, okCB = () => { }) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    okCB();
                }
            }
        });
    }

    //显示加载动画 rCount 为请求的次数
    static showLoading(rCount = 1) {
        Tool.sharedInstance().requestCount = rCount;
        wx.showToast({
            title: '加载...',
            icon: 'loading',
            duration: 95000
        });
    }

    //隐藏加载动画
    static hideLoading() {
        Tool.sharedInstance().requestCount--;
        if (Tool.sharedInstance().requestCount <= 0) {
            wx.hideToast();
        }
    }

    //返回上一个界面
    static navigationPop() {
        wx.navigateBack({
            delta: 1
        });
    }

    /**
     * 选择图片
     * @param imgCount
     * @param successCallback
     */
    static chooseImgsFromWX(imgCount, successCallback) {
        wx.chooseImage({
            count: imgCount, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: successCallback
        }
        );
    }

    /**
     * 图片地址
     * @param theID
     * @param placeholder
     * @returns {*}
     */
    static imageURLForId(theID, placeholder = '') {
        if (global.TCGlobal.EmptyId === theID || Tool.isEmptyStr(theID)) {
            return placeholder;
        }
        if (global.Storage.didLogin()) {
            return global.Network.sharedInstance().attatchmentURL + '?Id=' + theID + '&_SESSION_=' + global.Storage.currentSession();
        }
        return global.Network.sharedInstance().attatchmentURL + '?Id=' + theID;
    }

    static idFromDataKey(key) {
        let com = key.split('.');
        if (Tool.isValidArr(com)) {
            for (let i = 0; i < com.length; i++) {
                let userId = com[i];
                if (Tool.isValidStr(userId)) {
                    if (userId.length > 30 && userId.match("-") != null) {
                        return userId;
                    }
                }
            }
        }
    }

    /**
     * 日期筛选条件
     * @param start
     * @param endDate
     * @param dataKey
     * @returns {string}
     */
    static conditionWithStartDate(start, endDate, dataKey) {
        let con = '';
        if (Tool.isValidStr(start)) {
            con = "${" + dataKey + "} >= '" + start + "'";
        }

        if (Tool.isValidStr(endDate)) {
            if (Tool.isValidStr(con)) {
                con = con + " && ${" + dataKey + "} <= '" + endDate + "'";
            }
            else {
                con = "${" + dataKey + "} <= '" + endDate + "' ";
            }
        }

        let shopId = global.Storage.memberId()
        if (Tool.isValidStr(con)) {
            con = con + " && ${ShopId} == '" + shopId + "'";
        }
        else {
            con = "${ShopId} == '" + shopId + "' ";
        }

        return con;
    }

    /**
     * 搜索条件拼接
     * @param keyword
     * @param theKey
     * @returns {string}
     */
    static conditionForKeyword(keyword, theKey) {
        let con = '';
        if (Tool.isValidStr(keyword) && Tool.isValidStr(theKey)) {
            con = "StringIndexOf(${" + theKey + "},'" + keyword + "') > 0";
            let keywords = keyword.split(' ');
            if (Tool.isValidArr(keywords)) {
                let key = keyword[0];
                if (Tool.isValidStr(key)) {
                    con = "StringIndexOf(${" + theKey + "},'" + key + "') > 0"
                }

                if (keywords.length >= 2) {
                    keywords.forEach((item, index) => {
                        key = item;
                        if (Tool.isValidStr(key)) {
                            con = con + " && StringIndexOf(${" + theKey + "},'" + key + "') > 0";
                        }
                    })
                }
            }
        }

        return con;
    }


    /**
     * 从数组中移除一个对象
     * @param obj
     * @param arr
     * @returns {*}
     */
    static removeObjectFromArray(obj, arr) {
        var index = arr.indexOf(obj);
        console.log('removeObjectFromArray index:' + index);

        if (index > -1) {
            arr.splice(index, 1);
        }

        return arr;
    }

    /**
     *  获取Appendixes  id
     */
    static getAppendixesKeyMap(str) {
        let id = '';
        let key = '';
        if (Tool.isValidStr(str)) {
            let arr = str.split('.');
            if (Tool.isValidArr(arr) && arr.length == 2) {
                key = arr[0];
                id = arr[1];
            }
        }
        return {key:key,id:id};
    }

    /**
     * str是否已needle开头
     *
     * @param str
     * @param needle
     * @returns {boolean}
     */
    static isStringStartsWith(str,needle){
        return str.lastIndexOf(needle, 0) === 0
    }
}

