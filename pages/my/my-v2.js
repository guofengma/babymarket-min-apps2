// pages/my/my-v2.js
import Login from '../login/login';
let { Tool, Storage, RequestReadFactory, Event } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        member:null,
        avatarUrl:null,
        isLogin: global.Storage.didLogin(),
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
        let member = global.Storage.currentMember();
        this.setData({
            member,
            avatarUrl:global.Tool.imageURLForId(member.PictureId),
        });

        this.requestData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let self = this;

        let value = global.Storage.didLogin();
        let didLogin = value && value == true ? true:false;

        if (!didLogin) {
            global.Event.emit('shouldPopLoginView');
            global.Tool.switchTab('/pages/home/home');
        }

        self.setData({
            isLogin: didLogin,
        });
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
     * 消息
     */
    messageTap: function () {
        console.log('----消息----');

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            this.loginRegisterTap();
            return;
        }

        global.Tool.navigateTo('/pages/my/system-message/system-message')
    },

    /**
     * 设置
     */
    settingTap: function () {
        console.log('----设置----');
        global.Tool.navigateTo('../my/setting/setting')
    },

    /**
     * 编辑资料
     */
    editProfileTap: function () {
        console.log('----编辑资料----');

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            this.loginRegisterTap();
            return;
        }

        global.Tool.navigateTo('../my/edit-profile/edit-profile')
    },

    /**
     * 登录／注册
     */
    loginRegisterTap: function () {
        // this.login = new Login(this);
        // this.login.show();
    },

    /**
     * 二维码
     */
    qrcodeTap: function () {
        console.log('----二维码----');
        global.Tool.navigateTo('../my/my-qrcode/my-qrcode')
    },

    /**
     * 请求统一入口
     */
    requestData: function () {
        this.requestMemberInfo();
    },

    loginOutDeal:function(){
        this.setData({
            isLogin:false,
        });
    },

    updateHeaderInfo: function () {
        if (!this.data.isLogin) {//未登录
            return;
        }

        let r = global.RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
        };
        r.addToQueue();
    },

    /**
     * cell点击
     */
    cellTap: function (title) {

        console.log('--------' + title);

        if (title == '我的资产') {
            global.Tool.navigateTo('/pages/my/my-property/my-property')
        } else if (title == '我的奖励') {
            global.Tool.navigateTo('/pages/my/my-award/my-award')
        } else if (title == '已省金额') {
            global.Tool.navigateTo('/pages/my/my-save/my-save')
        } else if (title == '意见反馈') {
            global.Tool.navigateTo('/pages/my/help/help')
        } else if (title == '优惠券') {
            global.Tool.navigateTo('/pages/coupon/coupon')
        } else if (title == '我的众筹') {
            global.Tool.navigateTo('/pages/my/my-crowdfunding/my-crowdfunding');
        }
    },

    /**
     * 登录用户信息
     */
    requestMemberInfo: function () {
        if (!this.data.isLogin) {//未登录
            return;
        }

        let r = global.RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
        };
        r.addToQueue();
    },

    /**
     * 未读消息条数查询
     */
    unreadMessageNum: function () {
        let r = global.RequestReadFactory.messageRead("1");
        r.finishBlock = (req) => {
            let total = req.responseObject.Total;
            let url = total > 0 ? '/res/img/my/my-message-red-icon.png' : '/res/img/my/my-message-icon.png';
            this.setData({
                messageUrl: url
            });
        }

        r.addToQueue();
    },

    /**
     * 获取二维码
     */
    getQrcode: function () {
        let url = '/pages/home/home?fromId=' + this.data.inviteCode;
        let r = global.RequestReadFactory.qrcodeRead(url, 100);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            let image = "https://app.xgrowing.com/node/imgs/wxqrcode/" + data.img_id;
            this.setData({
                qrImage: image
            });
        };
        r.addToQueue();
    },

    profileClicked(){
        this.editProfileTap()
    },
    customerServiceClicked(){

    },
    msgClicked(){
        this.messageTap();
    },
    inviteClicked(){
        this.qrcodeTap()
    },
    cellClicked(e){
        let title = e.detail.title;
        console.log('title: ' + title);
        if (title == "已省金额"){

        }
        else if (title == "我的授信"){

        }
        else if (title == "我的关注"){

        }
        else if (title == "老友俱乐部"){

        }
        else if (title == "设置"){
            this.settingTap()
        }
        else if (title == "意见反馈"){

        }
        this.cellTap(title);
    },
    menuClicked(e){
        let title = e.detail.title;
        console.log('title: ' + title);
        if (title == "待付款"){
            global.Tool.navigateTo('/pages/my/myOrder/myOrder?index=1');
        }
        if (title == "待发货"){
            global.Tool.navigateTo('/pages/my/myOrder/myOrder?index=2');
        }
        if (title == "已发货"){
            global.Tool.navigateTo('/pages/my/myOrder/myOrder?index=3');
        }
        if (title == "去分享"){
            global.Tool.navigateTo('/pages/my/myOrder/myOrder?index=4');
        }
        if (title == "退换货"){
            global.Tool.navigateTo("/pages/my/order-refund/order-refund")
        }
        if (title == "优惠券"){

        }
        if (title == "我的资产"){

        }
        if (title == "我的奖励"){

        }
        if (title == "我的众筹"){

        }

        this.cellTap(title);
    },

    myOrderClicked(){
        console.log('----我的订单----');
        global.Tool.navigateTo('/pages/my/myOrder/myOrder');
    },
})