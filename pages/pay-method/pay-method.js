// 支付方式
let { Tool, Storage, Event, RequestWriteFactory, Network } = global;
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
            this.getCode();
        } else {
            // 不需要微信支付的,修改订单装填为已支付
            order.StatusKey = "1";
            this.modifyOrder(order, infos, no, money, id);
        }
    },

    /**
     * 登录获取code
     */
    getCode: function () {
        let self = this;
        wx.login({
            success: function (res) {
                self.getOpenId(res.code);
            }
        })
    },

    /**
     * 根据code获取openId
     */
    getOpenId: function (code) {
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/node/wxapp/get_openid?appid=wxc86740902e452a5c&secret=4e17424894e68cf370d83abdfd9e435c&js_code=" + code + "&grant_type=authorization_code",
            data: {},
            method: 'GET',
            success: function (res) {
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
     * 根据openid获取Ip
     */
    getSpbillCreateIp: function (openid) {
        let self = this;
        wx.request({
            url: "https://app.xgrowing.com/wxapp/api/get_client_ip.php",
            data: {},
            method: 'GET',
            success: function (res) {
                self.generateOrder(openid, res.data.data.client_ip);
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
     * 一次签名
     */
    getSign: function (json) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = '';
        for (var i in json) {
            if (global.Tool.isValidStr(json[i])) {
                signA = signA + i + '=' + json[i];
                if (i != "trade_type") {
                    signA += '&';
                }
            }
        }
        var signB = signA + "&key=b1Sfq9hBI822iR2BJbY1BxTDZ1v2noCh";
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 根据openid和ip生成商户订单
     */
    generateOrder: function (openid, clientip) {
        var self = this;
        let order = this.data.order;
        let nonce_str = Math.random().toString(36).substr(2, 15);
        let money = parseInt(parseFloat(order.Due) * 100);
        let json = {
            appid: global.Storage.appId(),
            body: '老友码头-商品购买',
            device_info: 'WEB',
            mch_id: '1486151622',
            nonce_str: nonce_str,
            notify_url: 'https://www.babymarkt.com.cn/ReceiveNotify.aspx',
            openid: openid,
            out_trade_no: order.OrderNo,
            spbill_create_ip: clientip,
            total_fee: String(money),
            trade_type: 'JSAPI',
            detail: '',
            attach: '',
            fee_type: '',
            time_start: global.Tool.timeStringFromInterval(global.Tool.timeIntervalFromNow(), 'YYYYMMDDHHmmss'),
            time_expire: global.Tool.timeStringFromInterval(global.Tool.timeIntervalFromNow(30 * 3600), 'YYYYMMDDHHmmss'),
            goods_tag: '',
            product_id: '',
            limit_pay: '',
        };
        var bodyData = '<xml>';
        for (var i in json) {
            bodyData += '<' + i + '>';
            bodyData += json[i]
            bodyData += '</' + i + '>';
        }
        bodyData += '<sign>' + self.getSign(json) + '</sign>';
        bodyData += '</xml>'
        console.log("bodyData======" + bodyData);
        //统一支付

        global.Tool.showLoading();
        wx.request({
            url: 'https://www.babymarkt.com.cn/Libra.Weixin.Pay.Web.UnifiedOrder.aspx?account=a7a04727-7bdd-491b-8eb7-a7c200b49421',
            //url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            method: 'POST',
            data: bodyData,
            success: function (res) {
                var pay = res.data;
                //发起支付
                var timeStamp = Math.round(new Date().getTime() / 1000).toString();
                var packages = 'prepay_id=' + self.getXMLNodeValue("prepay_id", pay);
                var nonceStr = self.getXMLNodeValue("nonce_str", pay);;
                console.log("res======" + JSON.stringify(res));
                self.pay(timeStamp, nonceStr, packages)
            },
            complete:()=>{
                global.Tool.hideLoading();
            }
        })
    },

    /**
     * 获取返回xml的值
     */
    getXMLNodeValue: function (node_name, xml) {
        var tmp = xml.split("<" + node_name + ">");
        var _tmp = tmp[1].split("</" + node_name + ">");
        var temp = _tmp[0].split("[");
        var temp1 = temp[2].split("]");
        return temp1[0];
    },

    /**
     *  获取二次签名
     */
    getSign2: function (timeStamp, nonceStr, packages) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = "appId=" + global.Storage.appId() + "&nonceStr=" + nonceStr
            + "&package=" + packages + "&signType=MD5&timeStamp=" + timeStamp;;
        var signB = signA + "&key=b1Sfq9hBI822iR2BJbY1BxTDZ1v2noCh";
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 支付
     */
    pay: function (timeStamp, nonceStr, packages) {
        let self = this;
        let order = this.data.order;
        let no = order.OrderNo;
        let money = order.Total;
        let id = order.Id;
        let door = this.data.door;
        let infos = this.data.infos;
        global.Tool.showLoading();
        wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: packages,
            signType: "MD5",
            paySign: self.getSign2(timeStamp, nonceStr, packages),
            success: function (res) {
                console.log("success=========" + JSON.stringify(res));
                // 支付成功
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
            },
            fail: function (res) {
                // 支付失败
                console.log("fail=========" + JSON.stringify(res));
                self.closeOrder(nonceStr);
            },
            complete:()=>{
                global.Tool.hideLoading();
            }
        })
    },

    /**
    * 关闭订单签名
    */
    getSign3: function (json) {
        let MD5Util = require('../../tools/md5.js');
        let sign = '';
        var signA = '';
        for (var i in json) {
            if (global.Tool.isValidStr(json[i])) {
                signA = signA + i + '=' + json[i];
                if (i != "out_trade_no") {
                    signA += '&';
                }
            }
        }
        var signB = signA + "&key=b1Sfq9hBI822iR2BJbY1BxTDZ1v2noCh";
        sign = MD5Util.MD5(signB).toUpperCase();
        return sign;
    },

    /**
     * 关闭订单
     */
    closeOrder: function (nonce_str) {
        var self = this;
        let order = this.data.order;
        let json = {
            appid: global.Storage.appId(),
            mch_id: '1486151622',
            nonce_str: nonce_str,
            out_trade_no: order.OrderNo,
        };
        var bodyData = '<xml>';
        for (var i in json) {
            bodyData += '<' + i + '>';
            bodyData += json[i]
            bodyData += '</' + i + '>';
        }
        bodyData += '<sign>' + self.getSign3(json) + '</sign>';
        bodyData += '</xml>'
        console.log("bodyData======" + bodyData);
        //统一支付
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/closeorder',
            method: 'POST',
            data: bodyData,
            success: function (res) {
                var result = res.data;
                console.log("res1======" + JSON.stringify(res));

            },
            fail: function (res) {
                // 支付失败
                console.log("fail1=========" + JSON.stringify(res));
            }
        })
    },
})