// my.js

let {Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressData: {},
        orderStatusItems: [
            {
                status: '待付款',
                image: '/res/img/my/my-order-waitpay-icon.png',
            },
            {
                status: '待发货',
                image: '/res/img/my/my-order-waitdispach-icon.png',
            },
            {
                status: '待收货',
                image: '/res/img/my/my-order-waitreceive-icon.png'
            }
        ],
        myDatasItems: [
            {
                image: '/res/img/my/my-cell-amount-icon.png',
                name: '可提现金额'
            },
            {
                image: '/res/img/my/my-cell-agreement-icon.png',
                name: '条款'
            }
        ],
        settingDatasItems: [
            {
                image: '/res/img/my/my-cell-completeinfo-icon.png',
                name: '信息完善'
            },
            {
                image: '/res/img/my/my-cell-aboutme-icon.png',
                name: '关于我们'
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 地址点击
     */
    addressViewTap: function () {
        // wx.navigateTo({
        //     url: '../address/address',
        // })
    },

    /**
     * 全部订单
     */
    allOrderTap: function () {
        wx.navigateTo({
            url: '../my/myOrder/myOrder?currentIndex=0',
        })
    },

    orderStatusTap: function (e) {
        let status = e.currentTarget.dataset.status;
        if (status === "待付款") {
            wx.navigateTo({
                url: '../my/myOrder/myOrder?currentIndex=1',
            })
        } else if (status === "待发货") {
            wx.navigateTo({
                url: '../my/myOrder/myOrder?currentIndex=2',
            })
        } else if (status === "待收货") {
            wx.navigateTo({
                url: '../my/myOrder/myOrder?currentIndex=3',
            })
        }
    },

    /**
     * 退出登录
     */
    loginoutTap: function () {
        Storage.setDidLogin(false);
        Storage.setCurrentSession('');

        wx.redirectTo({
            url: '/pages/login/login',
        })
    },

    /**
     * cell点击
     */
    cellSectionOneTap: function (e) {
        let index = e.currentTarget.dataset.index;
        switch (index) {
            case 0://提现
                {
                    wx.navigateTo({
                        url: '../my/withdraw/withdraw',
                    })
                }
                break;
            case 1://条款
                {
                    wx.navigateTo({
                        url: '../my/agreement/agreement',
                    })
                }
                break;
        }
    },

    cellSectionTwoTap: function (e) {
        let index = e.currentTarget.dataset.index;
        switch (index) {
            case 0://完善信息
                {
                    wx.navigateTo({
                        url: '../my/complete-info/complete-info',
                    })
                }
                break;
            case 1://关于我们
                {
                    wx.navigateTo({
                        url: '../my/about-me/about-me',
                    })
                }
                break;
        }
    },

    /**
       * 请求统一入口
       */
    requestData: function () {
        this.requestMemberInfo();
    },

    /**
     * 登录用户信息 
     */
    requestMemberInfo: function () {
        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {
                console.log('money1 :' + item.Money1);
                console.log('name :' + item.KHMC);

                wx.setStorage({
                    key: 'memberInfo',
                    data: item,
                })

                this.setData({
                    addressData: {
                        name: item.KHMC,
                        mobile: item.LXFS,
                        detail: item.BGDZ,
                        leftIconShow: false,
                    },
                    'myDatasItems[0].detail': item.Balance,
                });

            });
        };
        r.addToQueue();
    },
})