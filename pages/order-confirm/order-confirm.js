// 订单确认
let { Tool, Storage, Event, RequestReadFactory, RequestWriteFactory } = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        total: 0,  // 合计
        orderId: '', //订单id
        num: 0, // 0为无地址，1为有地址
        door: 0, //0为商品库进入，1为购物车进入
        order: {}, //订单
        orders: [],//传来的选中的购物车商品
        isInsideMember: false,// 是否是内部会员

        creditChecked: false, // 授信开关 默认关闭
        balanceChecked: false, // 钱包开关 默认关闭
        thirdBalanceChecked: false, // 饭卡余额开关 默认关闭
        isAirProduct: false, //是否是跨境商品
        thirdPay: 0,//饭卡支付输入金额
        isThirPay: false,//是否显示饭卡余额
        loadingHidden: false,
        hasCoupon:false,

        status: 0, // 0为未选择 1为优惠劵返回 2为地址返回
        couponData: {
            CouponId: '',
            Discount: '',
            money: '选择优惠劵',
        },
        addressData: {
            Consignee: '请添加地址',
            Mobile: '',
            Address: '您还没有添加收货地址，赶紧加一个',
            addressId: '',
            Card: '',
        },
        settlementList: [
            {
                title: '商品合计',
                value: '',
            },
            {
                title: '优惠券',
                value: '',
            },
            {
                title: '运费',
                value: '',
            },
            {
                title: '关税',
                value: '',
            },
            {
                title: '已省金额',
                value: '',
            },
            {
                title: '应付总额',
                value: '',
            }
        ],
        isCrowdfunding:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        let isCrowdfunding = options.isCrowdfunding == 'true';
        this.setData({
            isCrowdfunding,
        })
        let isInsideMember = global.Storage.isInsideMember();
        let memberInfo = global.Storage.currentMember();
        let id = global.Tool.guid();
        wx.getStorage({
            key: 'selectCarts',
            success: function (res) {
                self.setData({
                    orders: res.data,
                    door: parseInt(options.door),
                    isInsideMember: isInsideMember,
                    orderId: id,
                })

                self.requestData();
            },
        }),

            this.setData({
                thirdBalanceChecked: Tool.isTrue(memberInfo.IsThirdBalance),
                isThirPay: Tool.isTrue(memberInfo.IsThirdBalance)
            });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let status = this.data.status;
        let door = this.data.door;
        let order = this.data.order;
        let CouponId = this.data.couponData.CouponId;
        let addressId = this.data.addressData.addressId;
        let orderId = this.data.orderId;
        if (status == 1) {
            // 选择优惠劵
            let requestData = {
                Id: orderId,
                CouponId: CouponId,
            };
            this.modifyOrder(requestData, order, door);
        } else if (status == 2) {
            // 选择地址
            let requestData = {
                Id: orderId,
                Delivery_AddressId: addressId,
            };
            this.modifyOrder(requestData, order, door);
        }
        this.setData({
            status: 0
        })
    },

    /**
     * 数据请求
     */
    requestData: function () {
        //this.requestAddressDefaultInfo();
        // 先新增订单，后查询地址
        this.requestAddOrder();
    },

    /**
     * 查询默认地址
     */
    requestAddressDefaultInfo: function () {
        let self = this;
        let order = this.data.order;
        let isAirProduct = this.data.isAirProduct;
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
                        Card: address.Card,
                    },
                    num: 1,
                    loadingHidden: true,
                });
                // 如果订单为跨境订单且地址未认证则去修改地址 
                if (global.Tool.isEmptyStr(address.Card) && isAirProduct) {
                    wx.showModal({
                        title: '提示',
                        content: '跨境商品请使用实名认证地址',
                        success: function (res) {
                            if (res.confirm) {
                                self.selectAddress();
                            }
                        }
                    })
                } else {
                    //修改订单地址
                    let orderId = this.data.orderId;
                    let requestData = {
                        Id: orderId,
                        'Delivery_AddressId': address.Id,
                        'Address_Refresh': String((new Date()).valueOf())
                    };
                    this.modifyOrder(requestData, this.data.order, this.data.door);
                }
            } else {//无地址
                self.setData({
                    loadingHidden: true,
                });
            }
        }
        r.failBlock = (req) => {
            self.setData({
                loadingHidden: true,
            });
        }
        r.manageLoadingPrompt = false;
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
                orderLineBean.Product_SId = orders[i].Product_SId;
                if (door === 1) {
                    orderLineBean.Shopping_CartId = orders[i].Id;
                }
                orderLineBean.OrderId = id;
                orderLineBean.MemberId = global.Storage.memberId();
                requestData[i] = orderLineBean;
            }
            this.requestAddOrderLine(requestData);
        }
        // 自定义加载关闭
        r.failBlock = (req) => {
            self.setData({
                loadingHidden: true,
            });
        }
        // 网络请求加载关闭
        r.manageLoadingPrompt = false;
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
            if (self.data.isThirPay) {//华信员工
                self.readThirdBalance();
            } else {
                // 查询订单详情
                self.requestOrderDetail();
            }
        }
        r.failBlock = (req) => {
            self.setData({
                loadingHidden: true,
            });
        }
        r.manageLoadingPrompt = false;
        r.addToQueue();
    },

    /**
     * 查询订单详情
     */
    requestOrderDetail: function () {
        let self = this;
        let id = this.data.orderId;
        let isAirProduct = this.data.isAirProduct;
        let creditChecked = this.data.creditChecked;
        let balanceChecked = this.data.balanceChecked;
        let addressId = this.data.addressData.addressId;
        let r = RequestReadFactory.orderDetailRead(id);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            if (datas.length > 0) {
                let order = datas[0];
                // 判断是否使用授信
                creditChecked = this.isUseCredit(order.UseCredit);
                // 判断是否使用钱包
                balanceChecked = this.isUseBalance(order.UseBalance);

                // 跨境订单，授信和余额为false，不能点
                let arry = [{
                    title: '商品合计',
                    value: '¥' + order.Money,
                },
                {
                    title: '优惠券',
                    value: '¥-' + order.Discount,
                },
                {
                    title: '运费',
                    value: '¥' + order.ExpressSum,
                },
                {
                    title: '关税',
                    value: '¥' + order.Tax,
                },
                {
                    title: '已省金额',
                    value: '¥-' + order.BuyerCommission,
                },
                {
                    title: '应付总额',
                    value: '¥' + order.Total,
                }]
                if (order.Cross_Order === "True") {//跨境商品
                    isAirProduct = true;
                    creditChecked = false;
                    balanceChecked = false;

                    self.setData({
                        settlementList:arry
                    })
                } else {// 非跨境商品不显示关税cell
                    arry.splice(3,1)
                    self.setData({
                        settlementList: arry
                    })
                }
                creditChecked = self.setCredit(order, order.Credit, order.Money1, this.isUseCredit(order.UseCredit));
                balanceChecked = self.setBalance(order, order.Balance, order.Money2, this.isUseBalance(order.UseBalance));
                
                self.setData({
                    order: order,
                    isAirProduct: isAirProduct,
                    creditChecked: creditChecked,
                    balanceChecked: balanceChecked,
                })

                this.getMoney3Value();//设置饭卡默认使用金额
                self.setData({
                    total: self.getTrueMoney()
                })

                // 如果地址为空则查询地址
                if (global.Tool.isEmptyStr(addressId)) {
                    self.requestAddressDefaultInfo();
                }

                //读取是否有可用优惠券
                self.requestCoupon(order.Money);
            }
        }
        r.failBlock = (req) => {
            self.setData({
                loadingHidden: true,
            });
        }
        r.manageLoadingPrompt = false;
        r.addToQueue();

    },

    /**
     * 修改订单
     */
    modifyOrder: function (requestData, order, door) {
        let self = this;
        let r = RequestWriteFactory.modifyOrder(requestData);
        r.finishBlock = (req) => {
            if (order.Formal === "True") {
                // 订单新增成功，跳转到支付界面
                self.goConfirmPay(order);
                //如果从购物车进来，通知购物车刷新数据
                if (door === 1) {
                    Event.emit('deleteCart');//发出通知
                }
            } else {
                self.requestOrderDetail();
            }
        }
        r.addToQueue();
    },

    /**
     * 进入确认支付
     */
    goConfirmPay: function (order) {
        // wx.setStorage({
        //     key: 'order',
        //     data: order,
        //     success: function (res) {
        wx.redirectTo({
            url: '../pay-method/pay-method?door=0&orderId=' + this.data.orderId,
        })
        // }
        // })
    },

    /**
     *设置授信
     */
    setCredit: function (order, credit, usedCredit, isEnabled) {
        if (isEnabled) {
            order.credit = "使用授信：￥-" + usedCredit + "（余额：￥" + credit + "）";
        } else {
            order.credit = "使用授信（余额：￥" + credit + "）";
        }
        if (parseFloat(credit) <= 0) {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     *设置钱包
     */
    setBalance: function (order, balance, usedBalance, isEnabled) {
        if (isEnabled) {
            order.balance = "使用钱包：￥-" + usedBalance + "（余额：￥" + balance + "）";
        } else {
            order.balance = "使用钱包（余额：￥" + balance + "）";
        }
        if (parseFloat(balance) <= 0) {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 新增订单按钮
     */
    addOrder: function () {
        let num = this.data.num;
        let order = this.data.order;
        let isAirProduct = this.data.isAirProduct;
        let Card = this.data.addressData.Card;
        let self = this;
        // 判断有无地址
        if (num == 1 || this.data.isCrowdfunding) {
            // 有地址
            if (isAirProduct && global.Tool.isEmptyStr(Card)) {
                wx.showModal({
                    title: '提示',
                    content: '跨境商品请使用实名认证地址',
                    success: function (res) {
                        if (res.confirm) {
                            self.selectAddress();
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '确认提交订单吗？',
                    success: function (res) {
                        if (res.confirm) {
                            self.submitOrder();
                        }
                    }
                })
            }
        } else {
            //无地址
            self.goAddAddress();
        }
    },

    /**
     * 无地址 进入添加地址
     */
    goAddAddress: function () {
        wx.showModal({
            title: '提示',
            content: '还没有地址，请先添加地址！',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../address/add-address/add-address',
                    })
                }
            }
        })
    },

    /**
     * 更新为正式订单
     */
    submitOrder: function () {
        let door = this.data.door;
        let order = this.data.order;
        let addressId = this.data.addressData.addressId;
        order.Formal = "True";
        order.Delivery_AddressId = addressId;
        if (this.data.isCrowdfunding) {
            addressId = global.Tool.guid();//随便生成一个id，防止服务器报错
        }

        let requestData = {
            Id: order.Id,
            ThirdDue: this.data.thirdPay.toString(),
            IsUseThirdBalance: this.data.thirdBalanceChecked.toString(),
            UseBalance: order.UseBalance,
            UseCredit: order.UseCredit,
            Delivery_AddressId: addressId,
            addressId: this.data.addressData.addressId,
            Formal: "True",

        };
        this.modifyOrder(requestData, order, door);
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
        if(!hasCoupon){
            return;
        }

        let order = this.data.order;
        wx.navigateTo({
            url: '../coupon/select-coupon/select-coupon?Due=' + order.Due,

        })
    },

    /**
     * 授信开关的操作
     */
    creditSwitch: function (e) {
        let isAirProduct = this.data.isAirProduct;
        let creditChecked = this.data.creditChecked;
        let order = this.data.order;
        let door = this.data.door;
        let self = this;
        creditChecked = !creditChecked;
        // 跨境商品不能使用授信
        if (isAirProduct) {
            creditChecked = false;
        }
        // 余额小于0不能使用授信
        if (parseFloat(order.Credit) <= 0) {
            creditChecked = false;
        }
        order.UseCredit = this.getBooleanValue(creditChecked);
        // 设置状态
        this.setData({
            creditChecked: creditChecked,
            order: order,
        })
        // 设置授信和钱包的数据
        this.setCredit(order, order.Credit, self.getMoney1Value(), creditChecked);
        this.setBalance(order, order.Balance, self.getMoney2Value(), self.isUseBalance(order.UseBalance));

        //设置钱包支付的数据
        let money = this.getMoney3Value();
        screen.setData({
            thirdPay: money
        });

        // 设置支付金额
        this.getTrueMoney();
    },

    /**
     * 钱包开关的操作
     */
    balanceSwitch: function () {
        let isAirProduct = this.data.isAirProduct;
        let balanceChecked = this.data.balanceChecked;
        let order = this.data.order;
        let door = this.data.door;
        let self = this;
        balanceChecked = !balanceChecked;
        // 跨境商品不能使用钱包
        if (isAirProduct) {
            balanceChecked = false;
        }
        // 余额小于0不能使用钱包
        if (parseFloat(order.Balance) <= 0) {
            balanceChecked = false;
        }
        order.UseBalance = this.getBooleanValue(balanceChecked);
        // 设置状态
        this.setData({
            balanceChecked: balanceChecked,
            order: order,
        })
        // 设置授信和钱包的数据
        this.setCredit(order, order.Credit, self.getMoney1Value(), self.isUseCredit(order.UseCredit));
        this.setBalance(order, order.Balance, self.getMoney2Value(), balanceChecked);
        // 设置支付金额
        this.getTrueMoney();
    },

    /**
     * 饭卡余额开关的操作
     */
    thirdBalanceSwitch: function (e) {
        let thirdBalanceChecked = this.data.thirdBalanceChecked;
        let order = this.data.order;

        // 余额小于0不能使用钱包
        thirdBalanceChecked = !thirdBalanceChecked;
        if (parseFloat(order.ThirdBalance) <= 0) {
            thirdBalanceChecked = false;
        }

        // 设置状态和实付
        this.setData({
            thirdBalanceChecked: thirdBalanceChecked,
        })

        //设置默认值
        if (thirdBalanceChecked) {
            let defaultData = this.data.thirdPay
            this.setData({
                thirdPay: defaultData,
            })
        }

        // 设置支付金额
        this.getTrueMoney();
    },

    /**
     * 判断是否使用授信
     */
    isUseCredit: function (UseCredit) {
        let isEnabled = false;
        if (UseCredit === "True") {
            isEnabled = true;
        } else {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 判断是否使用钱包
     */
    isUseBalance: function (UseBalance) {
        let isEnabled = false;
        if (UseBalance === "True") {
            isEnabled = true;
        } else {
            isEnabled = false;
        }
        return isEnabled;
    },

    /**
     * 将布尔值转成字符串
     */
    getBooleanValue: function (creditChecked) {
        let isCredit = "";
        if (creditChecked) {
            isCredit = "True";
        } else {
            isCredit = "False";
        }
        return isCredit;
    },

    /**
     * 获取授信使用的金额
     */
    getMoney1Value: function () {
        let order = this.data.order;
        let credit = parseFloat(order.Credit);
        let total = parseFloat(order.Due);
        return credit >= total ? total : credit;
    },

    /**
     * 获取钱包使用的金额
     */
    getMoney2Value: function () {
        let order = this.data.order;
        let total = parseFloat(order.Due);
        let self = this;
        if (this.isUseCredit(order.UseCredit)) {
            let credit = this.getMoney1Value();
            let balance = total - credit;
            return balance > 0 ? balance : 0;
        } else {
            let balance = parseFloat(order.Balance);
            return balance >= total ? total : balance;
        }
    },

    /**
     * 获取饭卡使用的金额
     */
    getMoney3Value: function () {
        let order = this.data.order;

        let total = parseFloat(order.Due);
        let balance = parseFloat(order.ThirdBalance);

        let thirdPay = balance >= total ? total : balance;
        this.setData({
            thirdPay: thirdPay
        })

        return thirdPay;
    },

    /**
     * 获取实付金额，本地先计算
     */
    getTrueMoney: function () {
        let order = this.data.order;
        let total = parseFloat(order.Due);
        if (this.data.creditChecked) {
            let credit = parseFloat(order.Credit);
            if (credit >= total) {
                total = 0;
            } else {
                total = total - credit;
            }
        }
        if (this.data.balanceChecked) {
            let balance = parseFloat(order.Balance);
            if (balance >= total) {
                total = 0;
            } else {
                total = total - balance;
            }
        }

        if (this.data.thirdBalanceChecked) {
            let balance = parseFloat(this.data.thirdPay);
            if (balance >= total) {
                total = 0;
            } else {
                total = total - balance;
            }
        }

        this.setData({
            total: total,
        })
    },

    /**
     * 输入饭卡金额 变化时
     */
    textOnChange(e) {
        if (this.data.thirdBalanceChecked) {//开关打开
            let text = e.detail.value;
            let order = this.data.order;
            let total = parseFloat(order.Due);
            let balance = parseFloat(order.ThirdBalance);
            let thirdPay = balance >= total ? total : balance;

            if (Tool.isEmptyStr(text)) {
                text = '0';
            }

            if (parseFloat(text) > thirdPay) {
                text = thirdPay;
            }

            //计算实付
            let actualPay = total - text;
            this.setData({
                thirdPay: parseFloat(text),
                total: actualPay
            })
        }

    },

    /**
     * 读取饭卡余额
     */
    readThirdBalance: function () {
        this.setData({
            loadingHidden: false,
        });

        let memberInfo = global.Storage.currentMember();
        let idCard = memberInfo.IDCard;
        let self = this;
        wx.request({
            url: 'https://app.xgrowing.com/hx/member/search?id_card=' + idCard + '&order_id=' + self.data.orderId,
            success: function (res) {
                if (res.data.success === 0) {
                    self.setData({
                        loadingHidden: true,
                    });

                    wx.showModal({
                        title: '提示',
                        content: '请求失败，重新加载?',
                        success: function (res) {
                            if (res.confirm) {
                                self.readThirdBalance();
                            } else if (res.cancel) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })

                    return;
                }

                let arry = res.data.data.Datas;
                let money = arry[0].Money;
                let order = self.data.order;
                order.ThirdBalance = money;
                self.setData({
                    order: order
                })

                //更新饭卡输入框值
                self.getMoney3Value();

                // 查询订单详情
                self.requestOrderDetail();
            }
        })
    },

    /**
     * 查询优惠劵
     */
    requestCoupon: function (money) {
        let con = "${Overdue} == 'False' && ${Used} == 'False' && ${Min_Money} <= '" + money + "' && ${MemberId} =='" + global.Storage.memberId() + "'"; 

        let r = RequestReadFactory.couponRead(con);
        r.finishBlock = (req) => {
            let datas = req.responseObject.Datas;
            let self = this;
            if (datas.length > 0) {
                self.setData({
                    'couponData.money':'选择优惠券',
                    hasCoupon:true
                });
            }else{
                self.setData({
                    'couponData.money': '你没有可用的优惠券',
                    hasCoupon: false
                });
            }
        }
        r.addToQueue();
    },
})