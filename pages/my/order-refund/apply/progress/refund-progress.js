// pages/my/order-refund/apply/progress/refund-progress.js

export default class RefundStatus {}

RefundStatus.Processing = 1;//提交申请，等待卖家处理
RefundStatus.Success = 2;//已退款
RefundStatus.Reject = 3;//不同意
RefundStatus.Waiting_Dispatch = 4;//卖家同意，等待买家寄回货物
RefundStatus.Waiting_Refund = 5;//买家寄回货物，等待卖家处理
RefundStatus.Revocate = 6;//买家已撤销
Object.freeze(RefundStatus);// 冻结对象，防止修改

Page({
    /**
     * 页面的初始数据
     */
    data: {
        refundStatus:1,
        refundId:'',
        items:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let refundId = options.refundId;
        this.setData({
            refundId,
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

    requestData(){
        let r = global.RequestReadFactory.requestRefundProgress(this.data.refundId);
        r.finishBlock = (res)=>{
            let datas = res.responseObject.Datas;
            this.setData({
                items:datas,
            })
        }
        r.addToQueue();
    }
})