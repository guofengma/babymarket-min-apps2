// myOrder.js

let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        currentIndex: 0,
        orderList: [],
        dataArry: ['', '', '', '', ''],
        navItems: [
            {
                id: 0,
                name: '全部',
            },
            {
                id: 1,
                name: '待付款',
            },
            {
                id: 2,
                name: '待发货',
            },
            {
                id: 3,
                name: '待收货',
            },
            {
                id: 4,
                name: '去分享',
            }
        ],
        nomoredata: false,
        secondArry: [],
        time: Object,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let currentIndex = parseInt(options.index);
        if (currentIndex) {
            this.setData({
                currentIndex,
            })
        }
        this.requestData();
        Event.on('deleteOrderFinish', this.requestData, this)
        Event.on('refundSuccessNotic', this.requestData,this)
        Event.on('cancelRefundSuccessNotic', this.requestData, this)
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
        Event.off('deleteOrderFinish', this.requestData);
        Event.off('refundSuccessNotic', this.requestData);
        Event.off('cancelRefundSuccessNotic', this.requestData);
        clearTimeout(this.data.time);
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
        if (!this.data.nomoredata) {
            this.loadmore();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    requestData: function () {
        this.setData({
            orderList: [],
            secondArry: []
        });

        let index = 0;
        if (this.data.currentIndex == 0) {
            index = "undefined";
        } else {
            index = this.data.currentIndex - 1;
        }

        let r = RequestReadFactory.myOrderRead(index, 0);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            let secondMap = new Map();
            datas.forEach((item, index) => {
                let productList = item.Line;
                for (let i = 0; i < productList.length; i++) {
                    let product = productList[i];
                    let imageUrl = Tool.imageURLForId(product.ImgId, "/res/img/my/my-defualt_square_icon.png");
                    product.imageUrl = imageUrl;
                }

                //底部按钮 订单状态显示
                let desp = this.dealOrderStatus(item.StatusKey);
                item.status = desp.status;
                item.rightButtonName = desp.rightButtonName;
                item.leftButtonName = desp.leftButtonName;
                item.midButtonName = desp.midButtonName;

                //待付款订单 倒计时处理
                if (item.StatusKey == '0') {
                    let orderTime = item.CreateTime;
                    let timeInterval = Tool.timeIntervalFromString(orderTime);
                    let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
                    let nowTimeInterval = Tool.timeIntervalFromString(now);
                    let duration = 30 * 60 - (nowTimeInterval - timeInterval);

                    secondMap.set(index, duration);
                }
            });

            let arry = this.data.dataArry;
            arry.splice(this.data.currentIndex, 1, datas);

            let nomoredata = false;
            if (datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                orderList: datas,
                index: datas.length,
                dataArry: arry,
                nomoredata: nomoredata,
                secondArry: secondMap
            });

            if (secondMap.size > 0) {
                this.countdown(this);
            }

        };
        r.addToQueue();
    },

    loadmore: function () {

        let index = 0;
        if (this.data.currentIndex == 0) {
            index = "undefined";
        } else {
            index = this.data.currentIndex - 1;
        }

        let r = RequestReadFactory.myOrderRead(index, this.data.orderList.length);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let total = req.responseObject.Total;
            let secondMap = this.data.secondArry;

            if (datas.length == 0) {
                let nomoredata = true;
                this.setData({
                    nomoredata: nomoredata,
                });
                return;
            }
            datas.forEach((item, index) => {
                let productList = item.Line;
                for (let i = 0; i < productList.length; i++) {
                    let product = productList[i];
                    let imageUrl = Tool.imageURLForId(product.ImgId);
                    product.imageUrl = imageUrl;
                }

                let desp = this.dealOrderStatus(item.StatusKey);
                item.status = desp.status;
                item.rightButtonName = desp.rightButtonName;
                item.leftButtonName = desp.leftButtonName;
                item.midButtonName = desp.midButtonName;

                //待付款订单 倒计时处理
                if (item.StatusKey == '0') {
                    let orderTime = item.CreateTime;
                    let timeInterval = Tool.timeIntervalFromString(orderTime);
                    let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
                    let nowTimeInterval = Tool.timeIntervalFromString(now);
                    let duration = 30 * 60 - (nowTimeInterval - timeInterval);

                    secondMap.set(this.data.index + index, duration);
                }
            });

            let arry = this.data.dataArry;
            arry.splice(this.data.currentIndex, 1, this.data.orderList.concat(datas));
            let nomoredata = false;
            if (this.data.index + datas.length >= total) {
                nomoredata = true;
            }
            this.setData({
                orderList: this.data.orderList.concat(datas),
                index: this.data.index + datas.length,
                dataArry: arry,
                nomoredata: nomoredata,
                secondArry: secondMap
            });
            if (secondMap.size > 0) {
                this.countdown(this);
            }
        };
        r.addToQueue();
    },

    /**
     * segmentView tap
     */
    segmentIndexChangedTap: function (e) {
        var index = e.currentTarget.dataset.index;
        let datas = this.data.dataArry[index];
        this.setData({
            currentIndex: index,
            orderList: datas,
            nomoredata: false,
        })

        if (Tool.isEmptyArr(datas)) {
            this.requestData();
        }
    },

    orderCellTap: function (e) {
        var index = e.currentTarget.dataset.index;
        let order = this.data.orderList[index];

        wx.navigateTo({
            url: '../orderDetail/orderDetail?orderId=' + order.Id,
        })
    },

    bottomButtonTap: function (e) {
        var title = e.currentTarget.dataset.title;
        var index = e.currentTarget.dataset.index;
        let order = this.data.orderList[index];

        if (title == '查看物流') {//查看物流

            let trackNo = order.Express_No;
            let companyNo = order.Express_Code;

            let productList = order.Line;
            let count = productList.length;
            let imgUrl = productList[count - 1].imageUrl;

            let deliveryInfo = {
                "trackNo": trackNo,
                "companyNo": companyNo,
                "count": count,
                "imgUrl": imgUrl
            }

            wx.setStorage({
                key: 'deliveryInfoKey',
                data: deliveryInfo,
            }),

            wx.navigateTo({
                url: '../../my/delivery-info/delivery-info?trackNo=' + trackNo + '&companyNo=' + companyNo
            })

        } else if (title == '删除订单') {//删除订单
            let order = this.data.orderList[index];
            let self = this;

            wx.showModal({
                title: '提示',
                content: '确认删除订单？',
                confirmText: '删除',
                success: function (res) {
                    if (res.confirm) {
                        //提交请求
                        let r = RequestWriteFactory.deleteOrder(order.Id);
                        r.finishBlock = (req) => {
                            //刷新界面
                            let datas = self.data.orderList;
                            datas.splice(index, 1);

                            let arry = self.data.dataArry;
                            arry.splice(self.data.currentIndex, 1, datas);

                            self.setData({
                                orderList: datas,
                                dataArry: arry
                            })
                        };
                        r.addToQueue();

                    }
                }
            })
        } else if (title == '联系客服') {//联系客服
            wx.makePhoneCall({
                phoneNumber: global.TCGlobal.CustomerServicesNumber,
                // success: function () {
                //     console.log("拨打电话成功！")
                // },
                // fail: function () {
                //     console.log("拨打电话失败！")
                // }
            })
        } else if (title == '确认收货') {//确认收货
            let r = RequestWriteFactory.modifyOrderStatus(order.Id, '3');
            r.finishBlock = (req) => {
                this.requestData();
            };
            r.addToQueue();

        } else if (title.match('抢先支付') != null) {//付款
            wx.setStorage({
                key: 'order',
                data: order,
            })
            wx.navigateTo({
                url: '../../pay-method/pay-method?door=1&orderId=' + order.Id,
            })
        } else if (title == '立即分享') {//立即分享
            console.log('----- 立即分享 -----');

        } else if (title == '取消退款') {//取消退款
            wx.navigateTo({
                url: '../order-refund-success/order-refund-success?orderId=' + order.Id,
            })
        } else if (title == '申请退款') {//申请退款
            wx.navigateTo({
                url: '/pages/my/order-refund/order-refund?orderId=' + order.Id,
            })
        } else if (title == '取消订单') {//取消订单
            let self = this;

            wx.showModal({
                title: '提示',
                content: '确认取消订单？',
                confirmText: '确认',
                success: function (res) {
                    if (res.confirm) {
                        let r = RequestWriteFactory.modifyOrderStatus(order.Id, '6');
                        r.finishBlock = (req) => {
                            self.requestData();
                        };
                        r.addToQueue();
                    }
                }
            })
        }
    },

    //随便逛逛
    okButtonTap: function () {
        wx.switchTab({
            url: '/pages/home/home'
        })
    },

    /**
     * 订单状态处理
     */
    dealOrderStatus: function (statusKey) {

        let item = Object;
        item.status = '';
        item.leftButtonName = '';
        item.midButtonName = '';
        item.rightButtonName = '';

        if (statusKey == '0') {
            item.status = '待付款';
            item.rightButtonName = '抢先支付 ';
            item.midButtonName = '取消订单';

        } else if (statusKey == '1') {
            item.status = '待发货';
            item.rightButtonName = '联系客服';
            item.midButtonName = '申请退款';

        } else if (statusKey == '2') {
            item.status = '待收货';
            item.rightButtonName = '确认收货';
            item.midButtonName = '查看物流';
            item.leftButtonName = '申请退款';

        } else if (statusKey == '3') {
            item.status = '已收货';
            item.rightButtonName = '联系客服';
            item.midButtonName = '查看物流';

        } else if (statusKey == '4') {
            item.status = '已分享';
        } else if (statusKey == '5') {
            item.status = '交易成功';
            item.rightButtonName = '查看物流';
            item.midButtonName = '删除订单';

        } else if (statusKey == '6') {
            item.status = '交易关闭';
            item.rightButtonName = '删除订单';

        } else if (statusKey == '7') {
            item.status = '退款中';
            item.rightButtonName = '取消退款';

        } else if (statusKey == '8') {
            item.status = '退款成功';
            item.rightButtonName = '删除订单';

        } else if (statusKey == '9') {
            item.status = '退款失败';
            item.rightButtonName = '联系客服';

        }

        return item;
    },

    /**
     * 倒计时
     */
    countdown: function (that) {
        clearTimeout(this.data.time);

        let mapArry = that.data.secondArry;

        let orderArry = that.data.orderList;
        for (let i = 0; i < orderArry.length; i++) {
            let order = orderArry[i];
            if (order.StatusKey == '0') {
                let second = mapArry.get(i);
                if (second > 0) {//秒数>0

                    let countDownTime = Tool.timeStringForTimeCount(second);
                    order.rightButtonName = '抢先支付 ' + countDownTime;
                    mapArry.set(i, second - 1);

                } else {
                    order.rightButtonName = '删除订单';
                    order.midButtonName = '';
                    order.leftButtonName = '';

                    order.status = '交易关闭';
                    order.StatusKey = '6';
                }
            }
        }

        var time = setTimeout(function () {
            that.countdown(that);
        }, 1000)

        let arry = this.data.dataArry;
        arry.splice(this.data.currentIndex, 1, orderArry);

        that.setData({
            orderList: orderArry,
            dataArry: arry,
            time: time
        });
    },

    contactTap:function(e){
        console.log('---------contactTap');
    }
})