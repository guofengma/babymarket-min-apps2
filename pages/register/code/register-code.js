// register-code.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        code:'',
        queryTime:null,
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

    queryCode(){
        let time = global.Tool.timeIntervalFromNow(0);
        this.setData({
            queryTime:time,
        });

        // let r = RequestReadFactory.
    },

    /**
     * 验证码绑定
     * @param e
     */
    codeOnChange(e){
        let text = e.detail.value;
        console.log('codeOnChange:' + text);
        this.setData({
            code:text,
        })
    },

    /**
     * 确定点击
     */
    submitBtnClicked(){
        let self = this;
        let {phone} = this.data;
        let r = RequestReadFactory.checkMemberByPhone(phone);
        r.finishBlock = (req) =>{
            let {Datas} = req.responseObject;
            if (Tool.isValidArr(Datas)) {
                // Tool.showAlert('您输入手机号码已经被注册')
            }
            else{
                // global.Tool.navigateTo('/pages/register/code/register-code?phone=' + phone);
            }
        }
        r.addToQueue();
    }
})