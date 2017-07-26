// setting.js
import Login from '../../login/login';

let { Tool, Storage, Event } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listDatas: [
            {
                'title': '修改密码',
            },
            {
                'title': '关于老友码头',
            }],
        isLogin: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'didLogin',
            success: function (res) {
                self.setData({
                    isLogin: res.data
                });
            },
        }),

        Event.on("loginSuccess", this.updateLoginButtonDisplay, this);
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
        Event.off("loginSuccess", this.updateLoginButtonDisplay);
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

    updateLoginButtonDisplay:function(){
        this.setData({
            isLogin: true
        })
    },

    /**
     * 登录点击
     */
    loginTap: function () {
        let login = this.data.isLogin;
        
        if (login) {//退出登录
            Storage.setDidLogin(false);
            Storage.setCurrentSession('');
            Event.emit('LoginOutNotic');

            this.setData({
                isLogin: false
            })

        } else {//登录
            this.login = new Login(this);
            this.login.show();
        }
    },

    cellTap: function (e) {
        let index = e.currentTarget.dataset.index;
        console.log('-----index:' + index);

        if (index == 0) {//修改密码
            wx.navigateTo({
                url: '../setting/modify-password/modify-password',
            })

        } else if (index == 1) {//关于老友码头
            wx.navigateTo({
                url: '../about-me/about-me',
            })
        }
    }
})