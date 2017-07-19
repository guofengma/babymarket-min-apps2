// password-reset.js
let { Tool, RequestWriteFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        passwordHide: true,
        code:'',
        mobile:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            code:options.code,
            mobile:options.mobile
        });
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

    passwordHideOrShowTap: function () {
        let temp = this.data.passwordHide;
        this.setData({
            passwordHide: !temp
        });
    },

    submitTap: function (e) {
        let password = e.detail.value.password;
        console.log('---password:' + password);

        if (Tool.isEmptyStr(password)) {
            Tool.showAlert("请输入新密码");
            return;
        }

        let r = RequestWriteFactory.modifyLoginPassword(this.data.mobile, this.data.code, password);
        r.finishBlock = (req) => {
            wx.showToast({
                title: '修改密码成功',
            })

            wx.navigateBack({
                'delta': 1
            })

        };
        r.addToQueue();

    },

})