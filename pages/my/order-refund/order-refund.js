// order-refund.js
let { Tool, RequestReadFactory, RequestWriteFactory,Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        items:[],
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
        this.requestData();
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
    requestData(){
        let r = RequestReadFactory.refundRecordRead(this.data.orderId);
        r.finishBlock = (req, firstData) => {
            let datas = req.responseObject.Datas;
            this.setData({
                items:datas,
            })
        };
        r.addToQueue();
    }

})