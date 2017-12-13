// my-award.js
let {Tool, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        award:'',
        months:null,
        selectMonth:null,
        isFilterVisiable:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
        let self = this;
        wx.getStorage({
            key: 'currentMember',
            success: function (res) {
                self.setData({
                    award: res.data.Commission
                })
            },
        })
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
        if (!this.data.noMoreData) {
            this.loadMore();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 收到奖励查询
     */
    requestData: function () {
        // let r = RequestReadFactory.awardRead(0);
        // r.finishBlock = (req) => {
        //     let datas = req.responseObject.Datas;
        //     let total = req.responseObject.Total;
        //
        //     let nomoredata = false;
        //     if (datas.length >= total) {
        //         nomoredata = true;
        //     }
        //     this.setData({
        //         'listDatas': datas,
        //         noMoreData: nomoredata,
        //         index: datas.length
        //     });
        // };
        // r.addToQueue();

        let self = this;
        let r = RequestReadFactory.requestMyAwardWithCondition(this.data.selectMonth);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            self.setData({
                months:datas,
            })

            let i = 0;
            for (let data of self.data.months) {
                let r2 = RequestReadFactory.requestMyAwardDetailListWithCondition(data.Month);
                r2.finishBlock = (req2) => {
                    let datas2 = req2.responseObject.Datas;
                    let item = self.data.months[req2.tag];
                    item.detailArray = datas2;
                    self.setData({
                        months:self.data.months,
                    })
                }
                r2.addToQueue();
                r2.tag = i;
                i++;
            }
        }
        r.addToQueue();
    },

    loadMore: function () {
        // let r = RequestReadFactory.awardRead(this.data.index);
        // r.finishBlock = (req) => {
        //     let datas = req.responseObject.Datas;
        //     let total = req.responseObject.Total;
        //
        //     let nomoredata = false;
        //     if (datas.length + this.data.index >= total) {
        //         nomoredata = true;
        //     }
        //
        //     this.setData({
        //         'listDatas': this.data.listDatas.concat(datas),
        //         noMoreData: nomoredata,
        //         index: datas.length + this.data.index
        //     });
        // };
        // r.addToQueue();
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
        global.Tool.navigateTo('/pages/my/my-award/detail/my-award-detail?Id=' + item.Id);
    },

    dismissFilterClicked(e){
        this.setData({
            isFilterVisiable:false,
        })
    },

    thumbClicked(e){
        let index = e.detail.index;
        let thumb = e.detail.thumb;
        console.log('thumbClicked:' + index);

        global.Tool.navigateTo('/pages/my/my-award/filter-result-view/filter-result-view?key=' + thumb.Value);
        this.dismissFilterClicked();
    },

    filterClicked(){
        this.setData({
            isFilterVisiable:true,
        })
    }
})



