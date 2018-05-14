let { Tool, RequestReadFactory, Event } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryString:{},
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.typeImgSrc = global.Tool.imageURLForId(options.typeImgSrc);
    this.setData({
      queryString: options
    })
    if (options.key ==3 ){
      this.requestOrderLineWithOrderId(options.Id)
    } else if (options.key == 2){
      this.requestWithdrawReadOperation(options.Id)
    }
  },
  requestWithdrawReadOperation(Id){
    let r = global.RequestReadFactory.withdrawReadOperation(Id);
    r.finishBlock = (req) => {
      let data = req.responseObject.Datas[0];
      let arr = [
        { title: '当前状态', content: data.type},
        { title: '申请时间', content: data.CreateTime },
        { title: '到账时间', content: data.PostTime },
        { title: '提现方式', content: '支付宝' },
        { title: '提现帐号', content: data.Alipay },
      ]
      this.setData({
        datas: arr
      })
    }
    r.addToQueue();
  },
  requestOrderLineWithOrderId(Id){
    let r = global.RequestReadFactory.requestOrderLineWithOrderId(Id);
    r.finishBlock = (req) => {
      let datas = req.responseObject.Datas[0];
      let arr  = [
        { title: '当前状态', content: datas.stateKey},
        { title: '购买商品', content: datas.Product_Name },
        { title: '支付时间', content: datas.CreateTime },
        { title: '订单单号', content: datas.OrderNo }
      ]
      this.setData({
        datas: arr
      })
    }
    r.addToQueue();
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
  
  }
})