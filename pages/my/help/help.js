// help.js
let { Tool, Storage, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectDatas: [
            {
                'title': '商品咨询',
                'select': true
            },
            {
                'title': '订单问题',
                'select': false
            },
            {
                'title': '物流问题',
                'select': false
            },
            {
                'title': '售后服务',
                'select': false
            },
            {
                'title': '投诉与建议',
                'select': false
            },
            {
                'title': '红包／优惠券',
                'select': false
            },
        ],
        typeName:'',
        contactNum:'',
        inputText:'',
        mobile:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            contactNum: global.TCGlobal.CustomerServicesNumber
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 问题类型选择
     */
    helpButtonTap: function (e) {
        let index = e.currentTarget.dataset.index;

        let arry = this.data.selectDatas;
        //将所有item设为false
        for(let i = 0; i < arry.length; i++){
            let item = arry[i];
            item.select = false;
            arry.splice(i, 1, item);
        }

        //将选中item设为true
        let item = arry[index];
        item.select = !item.select;
        arry.splice(index, 1, item);
        this.setData({
            selectDatas: arry,
            typeName: item.title
        })
    },

    suggestValueChanged:function(e){
        this.setData({
            inputText: e.detail.value
        })
    },

    mobileValueChanged: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },

    /**
     * 提交
     */
    submitTap:function(){
        if (Tool.isEmptyStr(this.data.inputText)){
            Tool.showAlert("请填写您的建议");
            return;
        }

        let r = RequestWriteFactory.addFeedback(this.data.typeName, this.data.inputText, this.data.mobile);
        r.finishBlock = (req) => {
            wx.navigateBack({
                delta: 1
            })
        }
        r.addToQueue();
    }
})