// pages/my/my-crowdfunding/detail/my-crowdfunding-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        months:null,
        selectMonth:null,
        item:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let item = global.Storage.getterFor('crowdfunding-item');
        this.setData({
            item,
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
    requestData: function () {
        let self = this;
        let r = global.RequestReadFactory.requestMyRaiseAwardMonthWithCondition(this.data.selectMonth);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            self.setData({
                months:datas,
            })

            let i = 0;
            for (let data of self.data.months) {
                let r2 = global.RequestReadFactory.requestMyRaiseAwardDetailWithCondition(data.Month);
                r2.finishBlock = (req2) => {
                    let datas2 = req2.responseObject.Datas;
                    let item = self.data.months[req2.tag];
                    item.detailArray = datas2;
                    self.setData({
                        months:self.data.months,
                    });
                }
                r2.addToQueue();
                r2.tag = i;
                i++;
            }
        }
        r.addToQueue();
    },

    datePickerChange(e){
        console.log('datePickerChange:', e.detail.value)
        this.setData({
            selectMonth: e.detail.value
        })
        this.requestData();
    },

    cellClicked(e){
        let index = parseInt(e.currentTarget.dataset.index);
        let section = parseInt(e.currentTarget.dataset.section);
        let item = this.data.months[section].detailArray[index];
        global.Tool.navigateTo('/pages/my/my-crowdfunding/detail/detail/my-crowdfunding-detail-detail?orderId=' + item.OrderId + '&commissioin=' + item.Commissioin + '&buyerName=' + item.BuyerName);
    },
})




