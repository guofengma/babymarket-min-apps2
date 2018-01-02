// pages/my/order-refund/apply/refund-apply.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        line:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let line = global.Storage.getterFor('SelectOrderLine');
        this.setData({
            line,
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

    menuClicked(e){
        let index = e.detail.index;
        let type = parseInt(index);//1仅退款，0退款退货

        global.Tool.navigateTo('/pages/my/order-refund/apply/detail/refund-apply-detail?type=' + type);
    }
})