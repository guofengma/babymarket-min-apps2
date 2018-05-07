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
    share(Id){
      //global.Tool.navigateTo('/pages/share/share');
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
      wx.showShareMenu({
        withShareTicket: true
      })
      //let memberInfo = global.Storage.currentMember()
      return {
        title: '妹子图片',
        path: '/pages/share/share',
        //imageUrl: "/images/1.jpg",
        success: (res) => {
          console.log("转发成功", res);
        },
        fail: (res) => {
          console.log("转发失败", res);
        }
      }  
      // return {
      //   title: '老友码头',
      //   desc: '老友码头，分享最好的',
      //   path: '/pages/share/share?amount=' + this.data.commissioin + '&type=5&fromId=' + memberInfo.InvitationCode + '&imgId=' + memberInfo.PictureId
      // }
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