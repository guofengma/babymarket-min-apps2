// my.js
import Login from '../login/login';
let { Tool, Storage, RequestReadFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        avatarUrl: '/res/img/common/common-avatar-default-icon.png',
        messageUrl: '/res/img/my/my-message-icon.png',
        qrImage:'',
        sign: '',
        shopName: '',
        idDesp: '',
        inviteCode: '',
        isLogin: Storage.didLogin(),

        orderStatusItems: [
            {
                status: '我的订单',
                image: '/res/img/my/my-four-cell-order-icon.png',
            },
            {
                status: '我的收藏',
                image: '/res/img/my/my-four-cell-fav-icon.png',
            },
            {
                status: '地址管理',
                image: '/res/img/my/my-four-cell-address-icon.png'
            },
            {
                status: '邀请老友',
                image: '/res/img/my/my-four-cell-invite-icon.png'
            },
        ],
        dict00: {
            image: '/res/img/my/my-cell-coupon-icon.png',
            name: '我的优惠券',
            detail: {
                leftText: '',
                amount: '',
                rightText: ''
            }
        },
        dict01: {
            image: '/res/img/my/my-cell-property-icon.png',
            name: '我的资产',
            detail: {
                leftText: '余额',
                amount: '0',
                rightText: '元'
            }
        },
        dict02: {
            image: '/res/img/my/my-cell-credit-icon.png',
            name: '我的授信',
            detail: {
                leftText: '余额',
                amount: '0',
                rightText: '元',
            },
            arrowHidden: true
        },
        dict03: {
            image: '/res/img/my/my-cell-award-icon.png',
            name: '收到奖励',
            detail: {
                leftText: '已收',
                amount: '0',
                rightText: '元'
            }
        },
        dict04: {
            image: '/res/img/my/my-cell-save-icon.png',
            name: '已省金额',
            detail: {
                leftText: '已省',
                amount: '0',
                rightText: '元'
            }
        },
        dict05: {
            image: '/res/img/my/my-cell-hehuoren-icon.png',
            name: '城市合伙人',
            detail: {
                leftText: '待领',
                amount: '0',
                rightText: '元'
            }
        },
        dict10: {
            image: '/res/img/my/my-cell-frist-friends-icon.png',
            name: '我的老友',
            detail: {
                leftText: '共',
                amount: '0',
                rightText: '人'
            }
        },
        dict11: {
            image: '/res/img/my/my-cell-employee-icon.png',
            name: '我的店员',
            detail: {
                leftText: '共',
                amount: '0',
                rightText: '人'
            }
        },
        dict12: {
            image: '/res/img/my/my-cell-second-friends-icon.png',
            name: '老友的好友',
            detail: {
                leftText: '共',
                amount: '0',
                rightText: '人'
            },
            arrowHidden: true
        },

        myDatasItems0: [],
        myDatasItems1: [],
        myDatasItems2: [{
            image: '/res/img/my/my-cell-feedback-icon.png',
            name: '意见和反馈'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Event.on('refreshMemberInfoNotice', this.updateHeaderInfo, this);
        Event.on('LoginOutNotic', this.updateHeaderInfo, this);
        Event.on('loginSuccess', this.onShow, this);
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
        let self = this;
        self.setData({
          isLogin: Storage.didLogin()
        });

        if(self.data.isLogin){
          self.requestData();
          self.unreadMessageNum();
        }
    },

    onloginSuccess:function(){
      let self = this;
      self.setData({
        isLogin: Storage.didLogin()
      });

      if (self.data.isLogin) {
        self.requestData();
        self.unreadMessageNum();
      }
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
        Event.off('refreshMemberInfoNotice', this.updateHeaderInfo);
        Event.off('LoginOutNotic', this.updateHeaderInfo)
        Event.off('loginSuccess', this.updateHeaderInfo)
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
     * four cells
     */
    orderStatusTap: function (e) {
        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            wx.reLaunch({
                url: '/pages/login/login',
            })
            return;
        }

        let status = e.currentTarget.dataset.index;
        if (status == 0) {//我的订单
            console.log('----我的订单----');
            wx.navigateTo({
                url: '../my/myOrder/myOrder',
            })

        } else if (status == 1) {//我的收藏
            console.log('----我的收藏----');
            wx.navigateTo({
                url: '../my/my-fav/my-fav',
            })

        } else if (status == 2) {//地址管理
            console.log('----地址管理----');
            wx.navigateTo({
                url: '../address/address'
            })

        } else if (status == 3) {//邀请好友
            console.log('----邀请好友----');
            wx.navigateTo({
                url: '../my/invite-friends/invite-friends',
            })
        }
    },

    /**
     * 退出登录
     */
    loginoutTap: function () {
        Storage.setDidLogin(false);
        Storage.setCurrentSession('');

        wx.redirectTo({
            url: '/pages/login/login',
        })
    },

    /**
     * cell点击
     */
    cellTap: function (e) {

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            wx.reLaunch({
                url: '/pages/login/login',
            })
            return;
        }

        let title = e.currentTarget.dataset.title;
        if (title == '我的资产') {
            console.log('----我的资产----');
            wx.navigateTo({
                url: '../my/my-property/my-property',
            })
        } else if (title == '收到奖励') {
            console.log('----收到奖励----');
            wx.navigateTo({
                url: '../my/my-award/my-award',
            })

        } else if (title == '已省金额') {
            console.log('----已省金额----');
            wx.navigateTo({
                url: '../my/my-save/my-save',
            })

        } else if (title == '城市合伙人') {
            console.log('----城市合伙人----');

        } else if (title == '我的老友') {
            console.log('----我的老友----');
            wx.navigateTo({
                url: '../my/my-friends/my-friends',
            })

        } else if (title == '我的店员') {
            console.log('----我的店员----');
            wx.navigateTo({
                url: '../my/my-salesman/my-salesman',
            })

        } else if (title == '老友的好友') {
            console.log('----老友的好友----');

        } else if (title == '意见和反馈') {
            console.log('----意见和反馈----');

        } else if (title == '我的优惠券') {
            console.log('----我的优惠券----');
            wx.navigateTo({
                url: '../coupon/coupon',
            })
        }
    },

    /**
     * 消息
     */
    messageTap: function () {
        console.log('----消息----');
        wx.navigateTo({
            url: '../my/system-message/system-message',
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
            wx.reLaunch({
                url: '/pages/login/login',
            })
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
        this.login = new Login(this);
        this.login.show();
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
                let arry0 = [this.data.dict00,
                this.data.dict01,
                this.data.dict02,
                this.data.dict03,
                this.data.dict04,
                this.data.dict05];
                let arry1 = [this.data.dict10,
                this.data.dict11,
                this.data.dict12,];

                if (item.MemberTypeKey == '0') {//普通会员（等同于普通会员）
                    name = item.Nickname;
                    Storage.setLoginType('0');
                    arry0.push(2, 1);
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
                    arry0.splice(2, 1);
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
                        arry0.splice(2, 1);
                        arry0.splice(arry0.length - 1, 1);
                    }
                }

                //头像url
                let url = Tool.imageURLForId(item.PictureId);

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
            let image = "https://app.xgrowing.com/node/imgs/wxqrcode/" + data.img_name;
            this.setData({
                qrImage: image
            });
        };
        r.addToQueue();
    },
})