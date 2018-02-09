// pages/special/detail/special-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subject:{},
        mainId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let mainId = options.mainId;
        this.setData({
            mainId,
        })
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
    requestData:function () {
        this.requestSubjects();
    },
    requestSubjects:function () {
        let r = global.RequestReadFactory.requestSubjects(this.data.mainId);
        r.finishBlock = (res,firstData)=>{
            this.setData({
                subject:firstData,
            })
        }
        r.addToQueue();
    },
    onChildClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;
        this.navigateToProductDetail(productId);
    },

    /**
     * 跳转到商品详情
     */
    navigateToProductDetail: function (productId) {
        wx.navigateTo({
            url: '/pages/product-detail/product-detail?productId=' + productId
        })
    },
})