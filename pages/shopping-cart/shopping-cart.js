// shopping-cart.js
let {Tool, RequestReadFactory, RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        carts: [], // 购物车列表
        hasList: false, // 是否有购物车数据
        totalPrice: 0,  // 合计
        selectAllStatus: false, //是否全选
        cartIndex: 0, //  列表的下标

        num: 0, // 0为初始进入，1为支付成功进入
        touchStart: 0,
        touchEnd: 0,
        totalNum: 0, //数据总数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 由支付成功后下拉刷新
        let num = this.data.num;
        if (num == 1) {
            this.onPullDownRefresh();
        }
        this.setData({
            num: 0
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestData();
        // 下拉刷新时全选取消
        this.setData({
            selectAllStatus: false, //是否全选 
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let length = this.data.carts.length;
        let totalNum = this.data.totalNum;
        if (length != totalNum) {
            this.requestCartMoreInfo();
        }
    },

    /**
     * 数据请求
     */
    requestData: function () {
        // 清空数据
        this.setData({
            carts: [],
        });
        this.requestCartInfo();
    },

    /**
     * 查询购物车
     */
    requestCartInfo: function () {
        let self = this;
        let r = RequestReadFactory.cartRead();
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let totalNum = req.responseObject.Total;
            if (datas.length > 0) {
                for (let j = 0; j < datas.length; j++) {
                    datas[j].image = global.Tool.imageURLForId(datas[j].productPicThumb);
                    datas[j].count = datas[j].Qnty;
                }
                this.setData({
                    hasList: true,
                    carts: datas,
                    cartIndex: datas.length,
                    totalNum: totalNum,
                });
            }
            this.getTotalPrice();
        }
        r.addToQueue();
    },

    /**
    * 查询购物车(上拉加载)
    */
    requestCartMoreInfo: function () {
        let self = this;
        let r = RequestReadFactory.cartRead(this.data.cartIndex);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                for (let j = 0; j < datas.length; j++) {
                    datas[j].image = global.Tool.imageURLForId(datas[j].productPicThumb);
                    datas[j].count = datas[j].Qnty;
                }
                let totalDatas = self.data.carts.concat(datas);
                this.setData({
                    hasList: true,
                    carts: totalDatas,
                    cartIndex: this.data.cartIndex + datas.length,
                });
            }
            this.getTotalPrice();
        }
        r.addToQueue();
    },

    /**
     * 合计
     */
    getTotalPrice: function () {
        let carts = this.data.carts;
        let total = 0;
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                total += carts[i].count * carts[i].Price;
            }
        }
        this.setData({
            carts: carts,
            totalPrice: total.toFixed(2)
        });
    },

    /**
     * 选择商品
     */
    selectList: function (e) {
        let index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let selected = carts[index].selected;
        carts[index].selected = !selected;
        this.getTotalPrice();
        // 判断是否为全选
        let quantity = 0
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                quantity++;
            }
        }
        let selectAllStatus = false;
        if (quantity == carts.length) {
            selectAllStatus = true;
        } else {
            selectAllStatus = false;
        }
        this.setData({
            selectAllStatus: selectAllStatus,
            carts: carts,
        });
    },

    /**
     * 全选
     */
    selectAll: function (e) {
        let selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let carts = this.data.carts;
        for (let i = 0; i < carts.length; i++) {
            carts[i].selected = selectAllStatus;
        }
        this.setData({
            selectAllStatus: selectAllStatus,
            carts: carts,
        });
        this.getTotalPrice();
    },

    /**
     * 增加数量
     */
    onQuantityPlusListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let carts = this.data.carts;
        let num = parseInt(carts[index].count);
        num = num + 1;
        carts[index].count = String(num);
        let self = this;
        let r = RequestWriteFactory.modifyCartQnty(carts[index].Id, carts[index].count);
        r.finishBlock = (req) => {
            self.setData({
                carts: carts,
            });
            self.getTotalPrice();
        }
        r.addToQueue();
    },
    /**
     * 减少数量
     */
    onQuantityMimusListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let carts = this.data.carts;
        let num = parseInt(carts[index].count);
        if (num <= 1) {
            return false;
        }
        num = num - 1;
        carts[index].count = String(num);
        let self = this;
        let r = RequestWriteFactory.modifyCartQnty(carts[index].Id, carts[index].count);
        r.finishBlock = (req) => {
            self.setData({
                carts: carts,
            });
            self.getTotalPrice();
        }
        r.addToQueue();
    },

    /**
      * 数量改变监听
      */
    onQuantityChangeListener: function (e) {
        let index = e.currentTarget.dataset.childPosition;
        let carts = this.data.carts;
        let count = e.detail.value;
        if (count > 0) {
            carts[index].count = String(count);
            let self = this;
            let r = RequestWriteFactory.modifyCartQnty(carts[index].Id, carts[index].count);
            r.finishBlock = (req) => {
                self.setData({
                    carts: carts,
                });
                self.getTotalPrice();
            }
            r.addToQueue();
        }
    },

    /**
     * 新增订单
     */
    addOrder: function () {
        // 判断是否选择购物车
        let selectNum = 0;
        let carts = this.data.carts;
        let selectCarts = [];
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                // 选中数量
                selectCarts[selectNum] = carts[i];
                selectNum++;
            }
        }

        if (selectNum > 0) {
            wx.setStorage({
                key: 'selectCarts',
                data: selectCarts,
                success: function (res) {
                    wx.navigateTo({
                        url: '../order-confirm/order-confirm?door=1',
                    })
                }
            })

        } else {
            global.Tool.showAlert("请选择购物车商品");
        }

    },

    /**
     * 进入商品详情
     */
    goDetail: function (e) {
        let index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let touchTime = this.data.touchEnd - this.data.touchStart;
        if (touchTime > 350) {
            let requestData = {
                "Id": carts[index].Id,
            }
            wx.showModal({
                title: '提示',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        let r = RequestWriteFactory.deleteCart(requestData);
                        r.finishBlock = (req) => {
                            carts.splice(index, 1);
                            self.setData({
                                carts: carts
                            });
                            if (!carts.length) {
                                self.setData({
                                    hasList: false
                                });
                            } else {
                                self.getTotalPrice();
                            }
                        }
                        r.addToQueue();
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '../product-detail/product-detail?productId=' + carts[index].ProductId
            })
        }
    },
    //按下事件开始  
    mytouchstart: function (e) {
        this.setData({
            touchStart: e.timeStamp
        })
    },

    //按下事件结束  
    mytouchend: function (e) {
        this.setData({
            touchEnd: e.timeStamp
        })
    },

})