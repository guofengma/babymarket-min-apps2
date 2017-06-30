let {RequestReadFactory} = global;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasList:false,
        couponList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    requestData: function () {

    },
})