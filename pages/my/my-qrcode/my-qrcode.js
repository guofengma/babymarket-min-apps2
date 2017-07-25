// my-qrcode.js
let { Tool, Storage, RequestReadFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrImage:'',
        inviteCode:'',
        name:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'currentMember',
            success: function (res) {
                self.setData({
                    inviteCode: res.data.InvitationCode,
                    name: res.data.Name
                });
                self.getQrcode();
            },
        })
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
     * 获取二维码
     */
    getQrcode: function () {
        let url = '/pages/home/home?fromId=' + this.data.inviteCode;
        let r = RequestReadFactory.qrcodeRead(url, 320);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            let image = "https://app.xgrowing.com/node/imgs/wxqrcode/" + data.img_name;
            this.setData({
                qrImage: image
            });
        };
        r.addToQueue();
    },
})