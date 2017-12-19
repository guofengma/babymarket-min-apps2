// pages/my/my-crowdfunding/my-crowdfunding.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    requestData:function () {
        let r = global.RequestReadFactory.requestMyRaiseWithCondition();
        r.finishBlock = (req)=>{
            let datas = req.responseObject.Datas;
            this.setData({
                items:datas,
            })
        }
        r.addToQueue();
    },
    cellClicked:function (e) {
        let index = e.detail.index;
        console.log('cellClicked:'+index);
        let item = this.data.items[parseInt(index)];

        global.Storage.setterFor('crowdfunding-item',item);
        global.Tool.navigateTo('/pages/my/my-crowdfunding/detail/my-crowdfunding-detail?json='+JSON.stringify(item));
    }
})



