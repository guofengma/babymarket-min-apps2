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
        },
        door: 0, //0为商品库进入，1为购物车进入
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
        let orders = this.data.orders;
        let r = RequestWriteFactory.orderAddRequest(id);
        r.finishBlock = (req) => {
            // 新增订单明细
            let requestData = new Array();
            let orderLineBean = undefined;
            for (let i = 0; i < orders.length; i++) {
                orderLineBean = new Object();
                orderLineBean.ProductName = orders[i].title;
                orderLineBean.cartId = orders[i].Id;
                orderLineBean.Price = orders[i].Price;
                orderLineBean.ImgId = orders[i].ProductPicThumb;
                orderLineBean.Sum = orders[i].Money;
                orderLineBean.Qnty = orders[i].count;
                orderLineBean.MaterialId = orders[i].ProductId;
                orderLineBean.PrimaryId = id;
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
        let door=this.data.door;
        let r = RequestWriteFactory.orderLineAddRequest(requestData);
        r.finishBlock = (req) => {
            // 查询订单详情
            self.requestOrderDetail();
            // 在购物车中删除该商品
            if(door===1){
                self.requestdeleteCart();
            }
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
            wx.setStorage({
                key: 'order',
                data: order,
                success: function (res) {
                    wx.navigateTo({
                        url: '../pay-method/pay-method',
                    })
                }
            })
        }
        r.addToQueue();

    },

    /**
      * 删除购物车
      */
    requestdeleteCart: function (e) {
        let orders = this.data.orders;
        let self = this;
        let r = RequestWriteFactory.deleteCart(orders);
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
     * 增加数量
     */
    onQuantityPlusListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let orders = this.data.orders;
        let num = parseInt(orders[index].count);
        num = num + 1;
        orders[index].count = String(num);
        this.setData({
            orders: orders,
        });
        this.getTotal();
    },
    /**
     * 减少数量
     */
    onQuantityMimusListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let orders = this.data.orders;
        let num = parseInt(orders[index].count);
        if (num <= 1) {
            return false;
        }
        num = num - 1;
        orders[index].count = String(num);
        this.setData({
            orders: orders,
        });
        this.getTotal();
    },

    /**
      * 数量改变监听
      */
    onQuantityChangeListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let orders = this.data.orders;
        let count = e.detail.value;
        if (count > 0) {
            orders[index].count = String(count);
            this.setData({
                orders: orders,
            });
            this.getTotal();
        }
    },

    /**
     * 新增订单按钮
     */
    addOrder: function () {
        let self = this;
        // 设置订单Id
        let id = global.Tool.guid();
        this.setData({
            orderId: id,
        });
        wx.showModal({
            title: '提示',
            content: '确认提交订单吗？',
            success: function (res) {
                if (res.confirm) {
                    self.requestAddOrder();
                }
            }
        })
    },

    /**
     * 删除订单商品
     */
    deleteProduct: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let orders = this.data.orders;
        let self = this;
        if (orders.length > 1) {
            wx.showModal({
                title: '提示',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        orders.splice(index, 1);
                        self.setData({
                            orders: orders,
                        });
                        self.getTotal();
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
})