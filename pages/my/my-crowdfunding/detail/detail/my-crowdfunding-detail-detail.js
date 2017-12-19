// pages/my/my-crowdfunding/detail/detail/my-crowdfunding-detail-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        productName:null,
        productCount:null,
        items:null,
        orderId:null,
        date:null,
        commissioin:null,
        buyerName:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderId = options.orderId;
        let commissioin = options.commissioin;
        let buyerName = options.buyerName;
        this.setData({
            orderId,
            commissioin,
            buyerName,
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
        let r = global.RequestReadFactory.requestOrderLineWithOrderId(this.data.orderId);
        r.finishBlock = (req,data)=>{
            if (data) {
                this.setData({
                    productName:data.Product_Name,
                    productCount:data.Qnty,
                    date:data.Date,
                })
            }
        }
        r.addToQueue();

        let r2 = global.RequestReadFactory.requestMyRaiseAwardLineCondition(null);
        r2.finishBlock=(req)=>{
            this.setData({
                items:req.responseObject.Datas,
            })
        }
        r2.addToQueue();

    },

})