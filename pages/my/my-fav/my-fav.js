// my-fav.js
let {Tool, Storage, RequestReadFactory, Event} = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    nomoredata: false,
    index: 0,
    qtyHidden:true,
    emptyTitle: '您还没有收藏...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.requestData();
      Event.on('LocalNotification_ShouldRefreshMyfavorite', this.requestData, this);
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
      Event.off('LocalNotification_ShouldRefreshMyfavorite', this.requestData);
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
      if (!this.data.nomoredata) {
          this.loadmore();
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  requestData: function () {
      let r = RequestReadFactory.productFavListRead(0);
      r.finishBlock = (req) => {
          let datas = req.responseObject.Datas;
          let total = req.responseObject.Total;
          datas.forEach((item, index) => {
            let imageUrl = Tool.imageURLForId(item.ImgId, "/res/img/my/my-defualt_square_icon.png");
            item.imageUrl = imageUrl;
          });

          let nomoredata = false;
          if (datas.length >= total) {
              nomoredata = true;
          }
          this.setData({
              datas: datas,
              index: datas.length,
              nomoredata: nomoredata,
          });
      };
      r.addToQueue();
  },

  loadmore: function () {
      let r = RequestReadFactory.productFavListRead( this.data.index);
      r.finishBlock = (req) => {
          let datas = req.responseObject.Datas;
          let total = req.responseObject.Total;
          datas.forEach((item, index) => {
              let imageUrl = Tool.imageURLForId(item.ImgId, "/res/img/my/my-defualt_square_icon.png");
              item.imageUrl = imageUrl;
          });

          let nomoredata = false;
          if (this.data.index + datas.length >= total) {
              nomoredata = true;
          }
          this.setData({
              datas: this.data.datas.concat(datas),
              index: this.data.index + datas.length,
              nomoredata: nomoredata,
          });
      };
      r.addToQueue();
  },

  //cell点击
  cellTap:function(e){
      let index = e.currentTarget.dataset.index;
      let datas = this.data.datas[index];
      let productId = datas.ProductId;

      wx.navigateTo({
          url: '/pages/product-detail/product-detail?productId=' + productId,
      })
  }
})