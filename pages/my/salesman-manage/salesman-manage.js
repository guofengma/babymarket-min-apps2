// salesman-manage.js
let { Tool, RequestReadFactory, RequestWriteFactory, Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [],
        nomoredata: false,
        index: 0,
        keyword: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData('');
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
        this.loadmore(this.data.keyword);
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

    /**
     * 搜索框搜索
     */
    onConfirmAction: function (e) {
        let keyword = e.detail.value;
        this.setData({
            keyword: keyword,
        })
        this.requestData(this.data.keyword);
    },

    /**
     * 取消认证／认证店员
     */
    authTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let datas = this.data.listDatas[index];
        let isshopperson = datas.IsShopPerson;
        let memberId = datas.Id;

        console.log('--------isshopperson: ' + isshopperson);
        console.log('--------index: ' + index);
        console.log('--------memberId: ' + memberId);

        let r = RequestWriteFactory.modifySalesmanAuth(Tool.isTrue(isshopperson) ? 'False' : 'True', memberId);
        r.finishBlock = (req) => {

            Event.emit('refreshMemberInfoNotice');//发出通知

            if (Tool.isTrue(isshopperson)) {
                wx.showToast({
                    title: '取消认证',
                    icon: 'success',
                    duration:3000
                })
            }else{
                wx.showToast({
                    title: '认证店员',
                    icon: 'success',
                    duration: 3000
                })
            }

            let arry = this.data.listDatas;
            let datas = arry[index];
            if (Tool.isTrue(isshopperson)){
                datas.IsShopPerson = 'False';
                datas.authUrl = '/res/img/my/my-salesman-manage-add-auth-icon.png';
            }else{
                datas.IsShopPerson = 'True';
                datas.authUrl = '/res/img/my/my-salesman-manage-cancel-auth-icon.png';
            }
            
            arry.splice(index, 1, datas);
            this.setData({
                listDatas: arry
            });
        };
        r.addToQueue();
    },

    /**
    * 我的店员查询
    */
    requestData: function (keyword) {
        let r = RequestReadFactory.mysalesmanManageRead(0, keyword);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            datas.forEach((item, index) => {
                item.imgUrl = Tool.imageURLForId(item.PictureId, "/res/img/common/common-avatar-default-icon.png");

                if (Tool.isTrue(item.IsShopPerson)) {
                    item.authUrl = '/res/img/my/my-salesman-manage-cancel-auth-icon.png';
                } else {
                    item.authUrl = '/res/img/my/my-salesman-manage-add-auth-icon.png';
                }

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
    loadMore: function (keyword) {
        let r = RequestReadFactory.mysalesmanManageRead(this.data.index, keyword);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;

            datas.forEach((item, index) => {
                item.imgUrl = Tool.imageURLForId(item.PictureId, "/res/img/common/common-avatar-default-icon.png");
                if (Tool.isTrue(item.IsShopPerson)) {
                    item.authUrl = '/res/img/my/my-salesman-manage-add-auth-icon.png';
                } else {
                    item.authUrl = '/res/img/my/my-salesman-manage-cancel-auth-icon.png';
                }

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