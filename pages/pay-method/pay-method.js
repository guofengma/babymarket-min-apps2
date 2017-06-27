// 支付方式
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ways: [{
            image: "/res/img/pay-method/pay-method-weixin-icon.png",
            value: "微信支付",
            selected: true,
        }],  // 选择支付方式

        money: "",// 支付金额
        order:{},
    },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'order',
            success: function (res) {
                self.setData({
                    order: res.data,
                    money: res.data.Total,
                })
            },
        })
    },

    /**
     * 确认支付
     */
    pay: function () {
        let no = this.data.order.SerialNumber;
        let money = this.data.order.Total;
        let id = this.data.order.Id;
        let self = this;
        /**
         *   wx.requestPayment({
            timeStamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            package: "prepay_id=" + res.data.prepayId,
            signType: 'MD5',
            paySign: self.getSign(),
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
         */
        wx.navigateTo({
            url: '../pay-success/pay-success?no=' + no + '&price=' + money + '&way=微信支付&id=' + id,
        })
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
    }
})