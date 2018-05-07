// pages/my/my-award/filter-result-view/filter-result-view.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key:null,
        items:null,
        value:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let key = options.key;
        this.setData({
            key:key,
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
        let r = global.RequestReadFactory.requestMyAwardDetailWithCommissionTypeKey(this.data.key);
        let self = this;
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let value = 0
            for(let i=0;i<datas.length;i++){
              value += Number(datas[i].Commission)
            }
            self.setData({
                items:datas,
                value:value
            })
        }
        r.addToQueue();
    }

})