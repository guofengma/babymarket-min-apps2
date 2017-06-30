// 订单确认
let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: 0,  // 合计
        orderId: '', //订单id
        num: 0, // 0为无地址，1为有地址
        addressData: {
            Consignee: '请添加地址',
            Mobile: '',
            Address: '您还没有添加收货地址，赶紧加一个',
            addressId: '',
        },
        door: 0, //0为商品库进入，1为购物车进入
        coupon: '选择优惠劵',
        isSelect: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        wx.getStorage({
            key: 'selectCarts',
            success: function (res) {
                self.setData({
                    orders: res.data,
                    door: parseInt(options.door),
                })
                self.getTotal();
            },
        })
        // 设置订单Id
        let id = global.Tool.guid();
        this.setData({
            orderId: id,
        });
        this.requestData();
    },

    /**
     * 数据请求
     */
    requestData: function () {
        this.requestAddressDefaultInfo();
    },

    /**
      * 查询默认地址
      */
    requestAddressDefaultInfo: function () {
        let self = this;
        let r = RequestReadFactory.addressDefaultRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                let address = datas[0];
                self.setData({
                    addressData: {
                        Consignee: address.Consignee,
                        Mobile: address.Mobile,
                        Address: address.Address,
                        addressId: address.Id,
                    },
                    num: 1,
                });
                this.requestAddOrder();
            }
        }
        r.addToQueue();
    },

    /**
     * 新增订单请求
     */
    requestAddOrder: function () {
        let self = this;
        let id = this.data.orderId;
        let addressId = self.data.addressData.addressId;
        let orders = this.data.orders;
        let door = this.data.door;

        let r = RequestWriteFactory.orderAddRequest(id, addressId, String((new Date()).valueOf()));
        r.finishBlock = (req) => {
            // 新增订单明细
            let requestData = new Array();
            let orderLineBean = undefined;
            for (let i = 0; i < orders.length; i++) {
                orderLineBean = new Object();
                orderLineBean.Product_Name = orders[i].Product_Name;
                orderLineBean.Product_ShowName = orders[i].Product_ShowName;
                orderLineBean.S_Name = orders[i].S_Name;
                orderLineBean.ImgId = orders[i].ImgId;
                orderLineBean.Money = orders[i].Money;
                orderLineBean.Price = orders[i].Price;
                orderLineBean.Qnty = orders[i].Qnty;
                orderLineBean.ProductId = orders[i].ProductId;
                if (door === 1) {
                    orderLineBean.Shopping_CartId = orders[i].Id;
                }
                orderLineBean.OrderId = id;
                orderLineBean.MemberId = global.Storage.memberId();
                requestData[i] = orderLineBean;
            }
            this.requestAddOrderLine(requestData);
        }
        r.addToQueue();
    },

    /**
      * 新增订单明细请求
      */
    requestAddOrderLine: function (requestData) {
        let self = this;
        let door = this.data.door;
        let r = RequestWriteFactory.orderLineAddRequest(requestData);
        r.finishBlock = (req) => {
            // 查询订单详情
            self.requestOrderDetail();
        }
        r.addToQueue();
    },

    /**
     * 查询订单详情
     */
    requestOrderDetail: function () {
        let self = this;
        let id = this.data.orderId;
        let r = RequestReadFactory.orderDetailRead(id);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let order = datas[0];

        }
        r.addToQueue();

    },

    /**
     * 合计
     */
    getTotal: function () {
        let orders = this.data.orders;
        let totalNum = 0;
        for (let i = 0; i < orders.length; i++) {
            totalNum += orders[i].Qnty * orders[i].Price;
        }
        this.setData({
            orders: orders,
            total: totalNum.toFixed(2)
        });
    },


    /**
     * 新增订单按钮
     */
    addOrder: function () {
        let num = this.data.num;
        let self = this;
        // 判断有无地址
        if (num == 1) {
            // 有地址
            wx.showModal({
                title: '提示',
                content: '确认提交订单吗？',
                success: function (res) {
                    if (res.confirm) {
                        self.submitOrder();
                    }
                }
            })
        } else {
            //无地址
            wx.showModal({
                title: '提示',
                content: '还没有地址，请先添加地址！',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../address/add-address',
                        })
                    }
                }
            })
        }
    },


    /**
     * 选择地址
     */
    selectAddress: function () {
        // 判断有无地址，有地址则到选择地址，无地址则到添加地址
        let num = this.data.num;
        if (num == 1) {
            // 选择地址
            wx.navigateTo({
                url: '../address/select-address/select-address',
            })
        } else {
            //添加地址
            wx.navigateTo({
                url: '../address/add-address/add-address',
            })
        }
    },

    /**
     * 选择优惠劵
     */
    selectCoupon: function () {
        wx.navigateTo({
            url: '../coupon/select-coupon/select-coupon',
    
        })
    },
})