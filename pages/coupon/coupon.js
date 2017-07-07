let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        currentIndex: 0,
        couponList: [],
        navItems: [
            {
                id: 0,
                name: '未使用',
            },
            {
                id: 1,
                name: '已使用',
            },
            {
                id: 2,
                name: '已过期',
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            currentIndex: options.currentIndex,
        })

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