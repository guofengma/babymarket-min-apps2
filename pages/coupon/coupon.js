import RequestGetSystemTime from '../../network/requests/request-get-system-time';
let {Tool, Storage, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 0,
        couponList: [],
        hasData: false,
        noData: '',
        oneSortData: [
            {
                Name: '未使用',
            },
            {
                Name: '已使用',
            },
            {
                Name: '已过期',
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
    * 数据请求
    */
    requestData: function () {
        this.requestGetTime();
        let noData = this.data.noData;
        noData = "您还没有可使用的优惠卷哦～";
        this.setData({
            noData: noData,
        });
    },

    /**
     * 获取系统时间
     */
    requestGetTime: function () {
        let money = this.data.money;
        let r = new RequestGetSystemTime();
        r.finishBlock = (req) => {
            let model = req.responseObject;
            this.requestCoupon("False", model.Now, ">=");
        };
        r.addToQueue();
    },

    /**
     * 不同状态的条件
     */
    getRequest: function (i, Now) {
        if (i == 0) {
            this.requestCoupon("False", Now, ">=");
        } else if (i == 1) {
            this.requestCoupon("True", "", ">=");
        } else if (i == 2) {
            this.requestCoupon("False", Now, "<=");
        }
    },

    /**
     * 查询优惠劵
     */
    requestCoupon: function (use, time, Symbol) {
        let self = this;
        let con = ""
        if (global.Tool.isValidStr(time)) {
            con = "${MemberId} == '" + global.Storage.memberId() + "' && ${Used} == '" + use + "' && ${Useful_Line}" + Symbol + "'" + time + "'";
        } else {
            con = "${MemberId} == '" + global.Storage.memberId() + "' && ${Used} == '" + use + "'";
        }

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
                    if (datas[i].Overdue === "True" && datas[i].Used === "False") {
                        datas[i].expired = true;
                    }
                }
                self.setData({
                    hasData: true,
                    couponList: datas,
                });
            }
        }
        r.addToQueue();
    },

    /**
     * swiper切换事件
     */
    onTabChangeListener: function (e) {
        let noData = this.data.noData;
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        if (currentIndex == 0) {
            noData = "您还没有可使用的优惠卷哦～";
        } else if (currentIndex == 1) {
            noData = "您没有使用过的优惠卷哦～";
        } else if (currentIndex == 2) {
            noData = "您没有已过期的优惠卷哦～";
        }
        this.setData({
            noData: noData,
            currentTab: currentIndex,
        });

        let r = new RequestGetSystemTime();
        r.finishBlock = (req) => {
            let model = req.responseObject;
            this.getRequest(currentIndex, model.Now);
        };
        r.addToQueue();
    },
})