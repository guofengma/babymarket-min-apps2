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
                status: '我的订单',
                image: '/res/img/my/my-four-cell-order-icon.png',
            },
            {
                status: '我的收藏',
                image: '/res/img/my/my-four-cell-fav-icon.png',
            },
            {
                status: '地址管理',
                image: '/res/img/my/my-four-cell-address-icon.png'
            },
            {
                status: '邀请好友',
                image: '/res/img/my/my-four-cell-invite-icon.png'
            },
        ],
        myDatasItems0: [
            {
                image: '/res/img/my/my-cell-property-icon.png',
                name: '我的资产',
                detail:'余额2000元'
            },
            {
                image: '/res/img/my/my-cell-award-icon.png',
                name: '收到奖励',
                detail: '已收100元'
            },
            {
                image: '/res/img/my/my-cell-save-icon.png',
                name: '已省金额',
                detail: '已省150元'
            },
            {
                image: '/res/img/my/my-cell-hehuoren-icon.png',
                name: '城市合伙人',
                detail: '待领230元'
            },
        ],
        myDatasItems1: [
            {
                image: '/res/img/my/my-cell-frist-friends-icon.png',
                name: '我的好友',
                detail: '共3人'
            },
            {
                image: '/res/img/my/my-cell-employee-icon.png',
                name: '我的店员',
                detail: '共10人'
            },
            {
                image: '/res/img/my/my-cell-second-friends-icon.png',
                name: '好友的好友',
                detail: '共5人',
                arrowHidden:true
            },
        ],
        myDatasItems2: [
            {
                image: '/res/img/my/my-cell-feedback-icon.png',
                name: '意见和反馈'
            },
            // {
            //     image: '/res/img/my/my-cell-agreement-icon.png',
            //     name: '联系客服'
            // }
        ]
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
     * 消息
     */
    messageTap: function () {

    },

    /**
     * 设置
     */
    settingTap: function () {

    },

    /**
     * 编辑资料
     */
    editProfileTap: function () {

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
        // let r = RequestReadFactory.memberInfoRead();
        // r.finishBlock = (req) => {
        //     let datas = req.responseObject.Datas;
        //     datas.forEach((item, index) => {
        //         console.log('money1 :' + item.Money1);
        //         console.log('name :' + item.KHMC);

        //         wx.setStorage({
        //             key: 'memberInfo',
        //             data: item,
        //         })

        //         this.setData({
        //             addressData: {
        //                 name: item.KHMC,
        //                 mobile: item.LXFS,
        //                 detail: item.BGDZ,
        //                 leftIconShow: false,
        //             },
        //             'myDatasItems[0].detail': item.Balance,
        //         });

        //     });
        // };
        // r.addToQueue();
    },
})