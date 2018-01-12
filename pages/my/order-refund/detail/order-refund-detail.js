// pages/my/order-refund/detail/order-refund-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        refundId:'',
        refund:{},
        line:{},
        isBalance:false,
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
        let r = global.RequestReadFactory.requestRefundList(this.data.refundId);
        r.finishBlock = (req,data)=>{
            this.setData({
                refund:data,
                line:{
                    Product_Name:data.product.ProductName,
                    imageUrl:data.product.imgsrc,
                    S_Name:data.product.ProductSize,
                    Qnty:data.product.Qnty,
                    Price:data.product.Price,
                },
                isBalance:parseFloat(data.Balance) > 0
            })
        }
        r.addToQueue();
    },
})





