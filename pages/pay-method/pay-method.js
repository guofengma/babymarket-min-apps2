// 支付方式
import RequestAddPay from '../../network/requests/request-add-pay';
let { Storage, Event, RequestWriteFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {},
        infos: [],
        door: 0, // 0为确认订单进入，1为我的订单列表或订单详情进入
    },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'order',
            success: function (res) {
                let order = res.data;
                let infos = self.setInfoData(order);
                self.setData({
                    order: order,
                    infos: infos,
                    door: options.door,
                })
            },
        })
    },

    /**
     * 设置支付明细
     */
    setInfoData: function (order) {
        let infos = this.data.infos;
        if (order.Discount != "0") {
            let child = {
                title: "优惠劵",
                value: order.Discount,
            }
            infos.splice(infos.length, 0, child);
        }
        if (order.Money1 != "0") {
            let child = {
                title: "授信支付",
                value: order.Money1,
            }
            infos.splice(infos.length, 0, child);
        }
        if (order.Money2 != "0") {
            let child = {
                title: "钱包支付",
                value: order.Money2,
            }
            infos.splice(infos.length, 0, child);
        }
        if (parseFloat(order.Due) > 0) {
            let child = {
                title: "微信支付",
                value: order.Due,
            }
            infos.splice(infos.length, 0, child);
        }

        return infos;
    },

    /**
     * 修改订单
     */
    modifyOrder: function (requestData, infos, no, money, id) {
        let self = this;
        let r = RequestWriteFactory.modifyOrder(requestData);
        let door = this.data.door;
        r.finishBlock = (req) => {
            wx.setStorage({
                key: 'infos',
                data: infos,
                success: function (res) {
                    wx.redirectTo({
                        url: '../pay-success/pay-success?no=' + no + '&price=' + money + '&id=' + id,
                    })
                    //如果从我的订单和订单详情进入，通知我的订单刷新数据
                    if (door === "1") {
                        Event.emit('deleteOrderFinish');//发出通知
                    }
                }
            })
        }
        r.addToQueue();
    },

    /**
     * 确认支付
     */
    toPay: function () {
        let order = this.data.order;
        let infos = this.data.infos;
        let no = order.OrderNo;
        let money = order.Total;
        let id = order.Id;

        if (parseFloat(order.Due) > 0) {
            // 微信支付 
            this.wxPay();
        } else {
            // 不需要微信支付的,修改订单装填为已支付
            order.StatusKey = "1";
            this.modifyOrder(order, infos, no, money, id);
        }
    },

    /**
     *  获取签名
     */
    getSign: function () {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = "appId=" + app.appId + "&nonceStr=" + res.data.nonceStr + "&package=prepay_id=" + res.data.prepayId + "&signType=MD5&timeStamp=" + res.data.timestamp;
        var signB = signA + "&key=" + app.key;
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 微信支付
     */
    wxPay: function () {
        let self = this;
        wx.login({
            success: function (res) {
                self.getOpenId(res.code);
                console.log("res.code=========" + res.code)
            }
        })
    },

    /**
     * 获取openId
     */
    getOpenId: function (code) {
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/node/wxapp/get_openid?appid=wxc86740902e452a5c&secret=4e17424894e68cf370d83abdfd9e435c&js_code=" + code + "&grant_type=authorization_code",
            data: {},
            method: 'GET',
            success: function (res) {
                console.log("res.data.openid=========" + res.data.data.openid)
                self.getSpbillCreateIp(res.data.data.openid);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    /**
     * 获取Ip
     */
    getSpbillCreateIp:function(openid){
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/wxapp/api/get_client_ip.php",
            data: {},
            method: 'GET',
            success: function (res) {
                console.log("res.data.client_ip=========" + res.data.data.client_ip)
                self.addOrder(openid, res.data.data.client_ip);
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },

    addOrder: function (openid,clientip) {
        let order = this.data.order;
        let self = this;
        let param = {
            out_trade_no: order.Id,
            openid: openid,
            
            device_info: '',
            detail: '',
            attach: '',
            fee_type: '',
            time_start: '',
            time_expire: '',
            goods_tag: '',
            trade_type: '',
            product_id: '',
            limit_pay: '',

            //appid: global.Storage.appId(),
            //mch_id: '1486151622',
            //nonce_str: Math.random().toString(36).substr(2, 15),
            //sign: '',
            spbill_create_ip: clientip,
            //trade_type: 'JSAPI',
        }
        let r = new RequestAddPay(param);
        r.finishBlock = (req) => {
            let pay = req.data;
            var timeStamp = pay[0].timeStamp;
            var packages = pay[0].package;
            var paySign = pay[0].paySign;
            var nonceStr = pay[0].nonceStr;
            var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
            console.log("timeStamp=========" + timeStamp);
            console.log("packages=========" + packages);
            console.log("paySign=========" + paySign);
            console.log("nonceStr=========" + nonceStr);
            self.pay(param)
        };
        r.addToQueue();
    },

    /**
     * 生成商户订单
     */
    /**generateOrder: function (openid) {
        var self = this;
        let order = this.data.order;
        //统一支付
        wx.request({
            url: Network.sharedInstance().payURL,
            method: 'GET',
            data: {
                device_info: '',
                body: '老友码头-商品购买',
                detail: '',
                attach: '',
                out_trade_no: order.Id,
                fee_type: '',
                total_fee: order.Due,
                spbill_create_ip: '',
                time_start: '',
                time_expire: '',
                goods_tag: '',
                trade_type: '',
                product_id: '',
                limit_pay: '',
                openid: openid,
            },
            success: function (res) {
                var pay = res.data
                //发起支付
                var timeStamp = pay[0].timeStamp;
                var packages = pay[0].package;
                var paySign = pay[0].paySign;
                var nonceStr = pay[0].nonceStr;
                var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
                console.log("timeStamp=========" + timeStamp);
                console.log("packages=========" + packages);
                console.log("paySign=========" + paySign);
                console.log("nonceStr=========" + nonceStr);
                self.pay(param)
            },
        })
    },*/

    /**
     * 支付
     */
    pay: function (param) {
        wx.requestPayment({
            timeStamp: param.timeStamp,
            nonceStr: param.nonceStr,
            package: param.package,
            signType: param.signType,
            paySign: param.paySign,
            success: function (res) {
                // 支付成功
                wx.navigateTo({
                    url: '../pay-success/pay-success?no=' + no + '&price=' + money + '&way=微信支付&id=' + id,
                })
            },
            fail: function () {
                // 支付失败
            }

        })
    }
})