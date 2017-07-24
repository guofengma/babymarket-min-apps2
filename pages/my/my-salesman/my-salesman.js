// my-salesman.js
let { Tool, RequestReadFactory, Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        nomoredata:false,
        index:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
        Event.on("refreshMemberInfoNotice", this.requestData, this);
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
        Event.off("refreshMemberInfoNotice", this.requestData);
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
        if(!this.data.nomoredata){
            this.loadmore();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        let memberId = datas.Id;
        console.log('----index:' + index);
        console.log('----memberId:' + memberId);
        wx.navigateTo({
            url: '../../my/my-friends/my-friends?memberId=' + memberId + '',
        })
    },

    /**
     * 管理店员
     */
    manageSalesman: function () {
        wx.navigateTo({
            url: '../../my/salesman-manage/salesman-manage',
        })
    },

    /**
      * 我的店员查询
      */
    requestData: function () {
        let r = RequestReadFactory.mysalesmanRead(0);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            datas.forEach((item, index) => {
                item.imgUrl = Tool.imageURLForId(item.PictureId, "/res/img/common/common-avatar-default-icon.png");
            })

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }

            this.setData({
                listDatas: datas,
                noMoreData: nomoredata,
                index: datas.length
            });
        };
        r.addToQueue();
    },

    /**
      * 我的店员查询
      */
    loadMore: function () {
        let r = RequestReadFactory.mysalesmanRead(this.data.index);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            datas.forEach((item, index) => {
                item.imgUrl = Tool.imageURLForId(item.PictureId, "/res/img/common/common-avatar-default-icon.png");
            })

            let nomoredata = false;
            if (datas.length + this.data.index >= total) {
                nomoredata = true;
            }

            this.setData({
                listDatas: datas,
                noMoreData: nomoredata,
                index: datas.length + this.data.index
            });
        };
        r.addToQueue();
    },
})