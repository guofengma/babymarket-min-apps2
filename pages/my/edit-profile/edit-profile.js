// edit-profile.js

let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        imageUrl: '',
        listDatas: [
            {
                'title': '昵称',
                'desp': ''
            },
            {
                'title': '简介',
                'desp': ''
            }
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'currentMember',
            success: function (res) {
                self.setData({
                    mobile: res.data.Mobile,
                    imageUrl: Tool.imageURLForId(res.data.PictureId, '/res/img/common/common-avatar-default-icon.png'),
                    'listDatas[0].desp': res.data.Nickname,
                    'listDatas[1].desp': res.data.Sign,
                })
            },
        })
        Event.on('refreshMemberInfoNotice', this.requestMemberInfo, this)
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
        Event.off('refreshMemberInfoNotice', this.requestMemberInfo)
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

    cellTap: function (e) {
        let title = e.currentTarget.dataset.title;
        if (title == '昵称') { //修改昵称
            wx.navigateTo({
                url: '../edit-profile/modify-nickname/modify-nickname',
            })
        } else if (title == '简介') {
            wx.navigateTo({
                url: '../edit-profile/modify-sign/modify-sign',
            })
        }
    },

    // 修改头像
    modifyImageTap: function () {
        let self = this;
        wx.chooseImage({
            count: 1, // 默认9
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                self.setData({
                    imageUrl: tempFilePaths[0],
                });

                wx.uploadFile({
                    url: 'https://www.babymarkt.com.cn/Libra.Web.Api.ApiWriteBlob.aspx?_SESSION_=' + global.Storage.currentSession(), //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success: function (res) {
                        var fileInfo = JSON.parse(res.data);
                        console.log(fileInfo);

                        let temporaryId = fileInfo.TemporaryId;//临时Id
                        let r = RequestWriteFactory.modifyAcatar(temporaryId);
                        r.finishBlock = (req) => {
                            Event.emit('refreshMemberInfoNotice');//发出通知

                            wx.navigateBack({
                                delta: 1
                            })
                        };
                        r.addToQueue();
                    }
                })
            },
        })
    },

    // 获取文件二进制数据
    getFileBinary: function (file, cb) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            if (typeof cb === "function") {
                cb.call(this, this.result);
            }
        }
    },

    /**
     * 登录用户信息
     */
    requestMemberInfo: function () {
        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                this.setData({
                    mobile: item.Mobile,
                    imageUrl: Tool.imageURLForId(item.PictureId, '/res/img/common/common-avatar-default-icon.png'),
                    'listDatas[0].desp': item.Nickname,
                    'listDatas[1].desp': item.Sign,
                })
            })
        };

        r.addToQueue();
    },
})