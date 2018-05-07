let { Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      door:undefined,
      award:'',
      orderInfo:'',
      datas:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // if (options.door == '1'){
        this.requestAwardRead(null, options.Id)
      //} 
      this.setData({
        award: options.award,
        door: options.door
      })
      this.requestOrderLineWithOrderId(options.Id)
    },
    requestOrderLineWithOrderId(Id){
      let r = RequestReadFactory.requestOrderLineWithOrderId(Id);
      r.finishBlock = (req) => {
        let datas = req.responseObject.Datas[0];
        this.setData({
          orderInfo:datas
        })
      }
      r.addToQueue();
    },
    requestAwardRead(month, Id){
      let r = RequestReadFactory.awardRead(month, Id);
      r.finishBlock = (req) => {
        let datas = req.responseObject.Datas;
        this.setData({
          datas: datas
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

    },
    share:(e)=>{
        console.log('share clicked : ' + e.detail.title);
    }
})