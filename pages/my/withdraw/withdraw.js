// withdraw.js

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: '',
        havePassword:false,
        showInputAlert:false,
        placeholder:'请输入支付密码',
        password:'',
        amount:'',

        datas: [
            {
                'inputName': 'name',
                'title': '支付宝用户名:',
                'placeholder': '姓名',
                'value': ''
            },
            {
                'inputName': 'account',
                'title': '对方账户:',
                'placeholder': '支付宝账号／手机号码',
                'value': ''
            }
        ],
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
     * 绑定支付宝 
     */
    bindAlipayTap: function () {
        wx.navigateTo({
            url: '../withdraw/bind-alipay/bind-alipay',
        })
    },

    /**
     * 下一步
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        let name = value.name;
        let account = value.account;

        console.log('-----name: ' + name);
        console.log('-----account: ' + account);

        wx.navigateTo({
            url: '../withdraw/withdraw-to-alipay/withdraw-to-alipay',
        })
    }
})