// 支付成功
Page({

    /**
     * 页面的初始数据
     */
    data: {
        no: "",//订单号
        price: "",// 支付金额
        way: "",// 支付方式
        id: "", //订单id
    },

    /**
      * 生命周期函数--监听页面加载
      */
    onLoad: function (options) {
        this.setData({
            no: options.no,
            price: options.price,
            way: options.way,
            id: options.id,
        })
    },

    // 查看订单
    lookOrder: function () {
        let id = this.data.id;
        wx.navigateTo({
            url: '../my/orderDetail/orderDetail?orderId=' + id,
        })
    },

    // 去逛逛
    goBuy: function () {
        let pages = getCurrentPages();
        let pageBTwo = pages[pages.length - 3];// 前两页
        if (pageBTwo.route == 'pages/shopping-cart/shopping-cart') {
            // 返回前两页面
            pageBTwo.setData({
                num: 1
            })
            wx.navigateBack({
                delta: 2,
            })
        }
        if (pages.length - 4 >= 0) {
            let pageBThree = pages[pages.length - 4];// 前三页
            if (pageBThree.route == 'pages/shopping-cart/shopping-cart') {
                pageBThree.setData({
                    num: 1
                })
                // 返回前三页面
                wx.navigateBack({
                    delta: 3,
                })
            }
        }
    },
})