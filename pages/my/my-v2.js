// pages/my/my-v2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        member:null,
        avatarUrl:null,
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

        wx.navigateTo({
            url: '/pages/my/system-message/system-message',
        })
    },

    /**
     * 设置
     */
    settingTap: function () {
        console.log('----设置----');
        wx.navigateTo({
            url: '../my/setting/setting',
        })
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

        wx.navigateTo({
            url: '../my/edit-profile/edit-profile',
        })
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
        wx.navigateTo({
            url: '../my/my-qrcode/my-qrcode',
        })
    },

    /**
     * 请求统一入口
     */
    requestData: function () {
        this.requestMemberInfo();
    },

    loginOutDeal:function(){
        let arry0 = [
            this.data.dict00,
            this.data.dict01,
            this.data.dict02,
            this.data.dict03,
            this.data.dict04,
            this.data.dict05
        ];
        let arry1 = [
            this.data.dict10,
            this.data.dict11,
            this.data.dict12
        ];

        this.setData({
            isLogin:false,

            'dict01.detail.amount': '0',
            'dict02.detail.amount': '0',
            'dict03.detail.amount': '0',
            'dict04.detail.amount': '0',
            'dict05.detail.amount': '0',
            'dict10.detail.amount': '0',
            'dict11.detail.amount': '0',
            'dict12.detail.amount': '0',

            myDatasItems0: arry0,
            myDatasItems1: arry1
        });
    },

    updateHeaderInfo: function () {
        if (!this.data.isLogin) {//未登录
            return;
        }

        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                //头像url
                let url = Tool.imageURLForId(item.PictureId);
                if (Tool.isEmptyId(item.PictureId)){
                    url = '/res/img/common/common-avatar-default-icon.png';
                }
                console.log('------imgUrl:' + url);

                this.setData({
                    nickName: item.Nickname,
                    sign: item.Sign,
                    avatarUrl: url
                });

            });
        };
        r.addToQueue();
    },

    /**
     * cell点击
     */
    cellTap: function (title) {

        console.log('--------' + title);

        if (title == '我的资产') {
            wx.navigateTo({
                url: '/pages/my/my-property/my-property',
            })
        } else if (title == '我的奖励') {
            wx.navigateTo({
                url: '/pages/my/my-award/my-award',
            })
        } else if (title == '已省金额') {
            wx.navigateTo({
                url: '/pages/my/my-save/my-save',
            })
        } else if (title == '意见反馈') {
            wx.navigateTo({
                url: '/pages/my/help/help',
            })
        } else if (title == '优惠券') {
            wx.navigateTo({
                url: '/pages/coupon/coupon',
            })
        }
    },

    /**
     * 登录用户信息
     */
    requestMemberInfo: function () {
        if (!this.data.isLogin) {//未登录
            return;
        }

        let r = RequestReadFactory.memberInfoRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            datas.forEach((item, index) => {

                //是否为内部员工
                Storage.setInsideMember(item.Inside);

                //登陆类型
                let name = '';
                let desp = '';

                if (item.MemberTypeKey == '0') {//普通会员（等同于普通会员）
                    name = item.Nickname;
                    Storage.setLoginType('0');
                    arry0.splice(3, 1);
                    arry0.splice(arry0.length - 1, 1);
                    arry1.splice(1, 1);

                } else if (item.MemberTypeKey == '1') {//内部员工
                    name = item.ShopName;
                    desp = '(零售合伙人)';
                    Storage.setLoginType('1');
                    arry0.splice(arry0.length - 1, 1);
                    arry1.splice(1, 1);

                } else if (item.MemberTypeKey == '2') {//经销商（只有城市合伙人）
                    name = item.ShopName;
                    desp = '(城市合伙人)';
                    Storage.setLoginType('2');
                    arry0.splice(3, 1);
                    arry1.splice(1, 1);

                } else if (item.MemberTypeKey == '3') {//内部员工（等同于普通会员，但是暂时服务器返回的内部员工的memberTypeKey也为3，所以使用inside再次进行身份判断）
                    name = item.ShopName;
                    desp = '(零售合伙人)';

                    if (item.Inside == 'True') {//内部员工
                        Storage.setLoginType('1');
                        arry0.splice(arry0.length - 1, 1);
                        arry1.splice(1, 1);

                    } else {//门店
                        Storage.setLoginType('3');
                        arry0.splice(3, 1);
                        arry0.splice(arry0.length - 1, 1);
                    }
                }

                //头像url
                let url = Tool.imageURLForId(item.PictureId);
                if (Tool.isEmptyId(item.PictureId)) {
                    url = '/res/img/common/common-avatar-default-icon.png';
                }

                this.setData({
                    'dict01.detail.amount': item.Balance,
                    'dict02.detail.amount': item.Credit,
                    'dict03.detail.amount': item.Commission,
                    'dict04.detail.amount': item.BuyerCommission,
                    'dict05.detail.amount': item.PartnerCommission,
                    'dict10.detail.amount': item.FirstFriend,
                    'dict11.detail.amount': item.ShopPersonCount,
                    'dict12.detail.amount': item.SecondFriends,
                    nickName: item.Nickname,
                    sign: item.Sign,
                    avatarUrl: url,
                    shopName: name,
                    idDesp: desp,
                    inviteCode: item.InvitationCode,
                    myDatasItems0: arry0,
                    myDatasItems1: arry1
                });

                this.getQrcode();
            });
        };
        r.addToQueue();
    },

    /**
     * 未读消息条数查询
     */
    unreadMessageNum: function () {
        let r = RequestReadFactory.messageRead("1");
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
        let r = RequestReadFactory.qrcodeRead(url, 100);
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
        if ("已省金额"){

        }
        else if ("我的授信"){

        }
        else if ("我的关注"){

        }
        else if ("老友俱乐部"){

        }
        else if ("设置"){
            this.settingTap()
        }
        else if ("意见反馈"){

        }
        this.cellTap(title);
    },
    menuClicked(e){
        let title = e.detail.title;
        console.log('title: ' + title);
        if ("待付款"){

        }
        if ("待发货"){

        }
        if ("已发货"){

        }
        if ("去分享"){

        }
        if ("退换货"){

        }
        if ("优惠券"){

        }
        if ("我的资产"){

        }
        if ("我的奖励"){

        }
        if ("我的众筹"){

        }

        this.cellTap(title);
    }
})