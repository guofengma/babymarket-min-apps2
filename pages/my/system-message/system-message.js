// system-message.js
let { Tool, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas:[],
        nomoredata: false,
        index: 0,
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
        let r = RequestWriteFactory.allMessageRead('1');
        r.finishBlock = (req) => {
            
        };
        r.addToQueue();
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

    requestData: function () {
        let r = RequestReadFactory.messageRead(0, "1");
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }

            this.setData({
                listDatas: datas,
                noMoreData: nomoredata,
                index: datas.length
            });
        };
        r.addToQueue();
    },

    loadMore: function () {
        let r = RequestReadFactory.messageRead(this.data.index, "1");
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            let nomoredata = false;
            if (datas.length + this.data.index >= total) {
                nomoredata = true;
            }

            this.setData({
                listDatas: datas,
                noMoreData: nomoredata,
                index: datas.length + this.data.index
            });
        };
        r.addToQueue();
    },
})