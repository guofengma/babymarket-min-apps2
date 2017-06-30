import RequestGetSystemTime from '../../network/requests/request-get-system-time';
let {Storage,RequestReadFactory} = global;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasList: false,
        couponList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
        console.log("==========aa=======");
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    /**
     * 数据请求
     */
    requestData: function () {
        this.requestCoupon();
    },

    /**
     * 获取系统时间
     */
    requestGetTime: function () {
        let r = new RequestGetSystemTime();
        r.finishBlock = (req) => {
            let model = req.responseObject;

        };
        r.addToQueue();
    },

    /**
     * 查询优惠劵
     */
    requestCoupon: function () {
        let self = this;
        let con = "${MemberId} == '"+global.Storage.memberId()+"' && ${Used} == 'False' && ${Useful_Line} >= '2017-06-30 11:32:13' && ${Min_Money} <= '0'";
        let r = RequestReadFactory.couponRead(con);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                self.setData({
                    hasList: true,
                    couponList: datas,
                });
            }
        }
        r.addToQueue();
    },

})