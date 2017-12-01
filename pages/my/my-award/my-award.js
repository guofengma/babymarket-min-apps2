// my-award.js
let {Tool, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas:['','',''],
        award:'',
        items:[
            {
                title:'1',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'2',
                child:['one','two'],
            },
            {
                title:'3',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'4',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'5',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'6',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'7',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'8',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
            {
                title:'9',
                child:['one','two','3','4','5','6','7','8','9','10','11','12','13','14'],
            },
        ]
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
        let r = RequestReadFactory.awardRead(0);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                'listDatas': datas,
                noMoreData: nomoredata,
                index: datas.length
            });
        };
        r.addToQueue();
    },

    loadMore: function () {
        let r = RequestReadFactory.awardRead(this.data.index);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            let nomoredata = false;
            if (datas.length + this.data.index >= total) {
                nomoredata = true;
            }

            this.setData({
                'listDatas': this.data.listDatas.concat(datas),
                noMoreData: nomoredata,
                index: datas.length + this.data.index
            });
        };
        r.addToQueue();
    },

    datePickerChange(e){
        console.log('datePickerChange:', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
})



