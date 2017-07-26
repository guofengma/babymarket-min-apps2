// order-refund.js
let { Tool, RequestReadFactory, RequestWriteFactory,Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '普艳芳',
        mobile: '13646837967',
        datas:[],
        reasonArry: [],
        index: 0,
        orderId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.refundReasonRequest();
        this.setData({
            orderId:options.orderId
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

    /**
     * 监听普通picker选择器
     */
    bindPickerChange: function (e) {
        //改变index值，通过setData()方法重绘界面
        this.setData({
            index: e.detail.value
        });
    },

    submitTap: function (e) {
        let remark = e.detail.value.refunddesp;
        let data = this.data.datas[this.data.index];
        let r = RequestWriteFactory.orderRefundAdd(data.Id, data.Name, remark, this.data.orderId);
        r.finishBlock = (req) => {
            wx.redirectTo({
                url: '../order-refund-success/order-refund-success?orderId=' + this.data.orderId,
            })

            Event.emit("refundSuccessNotic");
        };
        r.addToQueue();
    },

    refundReasonRequest:function(){
        let r = RequestReadFactory.refundReasonRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let arry = new Array();
            datas.forEach((item, index) => {
                arry.push(item.Name);
            })

            this.setData({
                datas:datas,
                reasonArry: arry,
            });
        };
        r.addToQueue();
    }

})