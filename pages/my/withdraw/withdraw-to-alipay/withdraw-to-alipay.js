// withdraw-to-alipay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas: [
            {
                'inputName': 'name',
                'title': '提现金额:',
                'placeholder': '暂不收取手续费',
                'value': ''
            },
            {
                'inputName': 'account',
                'title': '支付密码:',
                'placeholder': '请输入支付密码',
                'value': ''
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
     * 设置支付密码
     */
    setPayPasswordTap: function () {
        wx.navigateTo({
            url: '../pay-password-set/pay-password-set'
        })
    },

    /**
     * 提交
     */
    formSubmit: function (e) {
        // let value = e.detail.value;
        // let name = value.name;
        // let account = value.account;

        // console.log('-----name: ' + name);
        // console.log('-----account: ' + account);

        wx.navigateTo({
            url: '../withdraw-success/withdraw-success',
        })
    }

})