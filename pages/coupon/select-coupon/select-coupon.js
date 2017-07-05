import RequestGetSystemTime from '../../../network/requests/request-get-system-time';
let {Storage, RequestReadFactory} = global;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasList: false,
        couponList: [],
        money: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            money: options.Due,
        })
        this.requestData();
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
        this.requestGetTime();
    },

    /**
     * 获取系统时间
     */
    requestGetTime: function () {
        let money = this.data.money;
        let r = new RequestGetSystemTime();
        r.finishBlock = (req) => {
            let model = req.responseObject;
            this.requestCoupon(model.Now, money);
        };
        r.addToQueue();
    },

    /**
     * 查询优惠劵
     */
    requestCoupon: function (time, money) {
        let self = this;
        let con = "${MemberId} == '" + global.Storage.memberId() + "' && ${Used} == 'False' && ${Useful_Line} >= '" + time + "' && ${Min_Money} <= '" + money + "'";
        let r = RequestReadFactory.couponRead(con);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                for (let i = 0; i < datas.length; i++) {
                    if (parseInt(datas[i].Min_Money) === 0) {
                        datas[i].condition = "无条件使用";
                    } else {
                        datas[i].condition = "满" + datas[i].Min_Money + "元可用";
                    }
                }
                self.setData({
                    hasList: true,
                    couponList: datas,
                });
            }
        }
        r.addToQueue();
    },

    /**
     * 选中优惠劵
     */
    selectCoupon: function (e) {
        let couponList = this.data.couponList;
        let index = e.currentTarget.dataset.index;

        let pages = getCurrentPages();
        let pageBOne = pages[pages.length - 2];// 前一页
        if (pageBOne.route == 'pages/order-confirm/order-confirm') {
            let coupon = couponList[index];
            pageBOne.setData({
                couponData: {
                    CouponId: coupon.Id,
                    Discount: coupon.Money,
                    money: "-￥" + coupon.Money,
                },
                status:1,
            })
            wx.navigateBack({
                delta: 1,
            })
        }
    }

})