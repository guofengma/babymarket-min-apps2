// my-friends.js
let {Tool, RequestReadFactory} = global;
var wxSortPickerView = require('/wxSortPickerView/wxSortPickerView.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [
            // {
            //     "Id": "d11d57ec-5875-4b3a-b831-a77100f09aed",
            //     "Name": "普2",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "普2"
            // },
            // {
            //     "Id": "b3dd9ad4-7674-4506-bf20-a77100f0d201",
            //     "Name": "普3",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "普3",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "17751651943",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "马六",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "马六",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "张三",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "李四",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "王五",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "爱宝",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "扬子",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "欧来",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "陈三",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // },
            // {
            //     "Id": "ae4e652a-6d9a-4459-892e-a77600a2795d",
            //     "Name": "第四",
            //     "PictureId": "00000000-0000-0000-0000-000000000000",
            //     "Nickname": "",
            // }
        ]
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
        this.requestData(keyword);
    },

    /**
      * 我邀请的好友查询
      */
    requestData: function (keyword) {
        let r = RequestReadFactory.myInviteFriendsRead(0, keyword);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            let nameArry = [];

            datas.forEach((item, index) => {
                item.imgUrl = Tool.imageURLForId(item.PictureId, "/res/img/common/common-avatar-default-icon.png");
                nameArry.push(item);
            })

            wxSortPickerView.init(nameArry, this);

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }
            
            this.setData({
                listDatas: nameArry,
                noMoreData: nomoredata,
                index: datas.length
            });
        };
        r.addToQueue();
    },
})