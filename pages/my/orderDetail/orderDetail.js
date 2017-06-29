// orderDetail.js
let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressData: {
            name: '',
            mobile: '',
            detail: '',
            arrowShow: false,
            leftIconShow: true,
        },
        orderLineList: ['','',''],
        orderId: '',
        orderDatas:'',
        deliveryInfo:'',
        settlementList:['','','']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
        }),

        this.requestData();
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
     * 物流
     */
    deliveryTap: function () {
        let trackNo = this.data.orderDatas.LogisticsNumber;
        let companyNo = this.data.orderDatas.LogisticsCode;
        
        let productList = this.data.orderDatas.Scan_Line;
        let count = productList.length;
        let imgUrl = productList[count-1].imageUrl;

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
            url: '../../my/delivery-info/delivery-info'
        })
    },

    /**
     * 确认收货
     */
    confirmButtonTap:function(){

    },

    /**
     * 查询订单详情
     */
    requestData:function(){
        // let r = RequestReadFactory.orderDetailRead(this.data.orderId);
        // r.finishBlock = (req, firstData) => {
        //     let productList = firstData.Scan_Line;
        //     for(let i = 0; i < productList.length; i++){
        //         let product = productList[i];
        //         product.imageUrl = Tool.imageURLForId(product.ImgId, "/res/img/my/my-defualt_square_icon.png");
        //     }

        //     this.setData({
        //         orderDatas: firstData,
        //         addressData:{
        //             name: firstData.LXR,
        //             mobile: firstData.Tel,
        //             detail: firstData.Address,
        //             arrowShow: false,
        //             leftIconShow: true,
        //         },
        //         orderLineList: productList,
        //     });

        //     if (firstData.StatusKey === '2'){//待收货，查询物流信息
        //         this.requestDeliveryInfo(this.data.orderDatas.LogisticsNumber, this.data.orderDatas.LogisticsCode);
        //     }
        // };
        // r.addToQueue();
    },

    /**
     * 查询物流详情
     */
    requestDeliveryInfo: function (trackNo, companyNo) {
        // if (Tool.isEmptyStr(trackNo) || Tool.isEmptyStr(companyNo)){
        //     return;
        // }

        let r = RequestReadFactory.orderDeliveryInfoRead('3972400229281', 'yd');
        r.finishBlock = (req, firstData) => {
            let result = req.responseObject.result;
            if (Tool.isEmpty(result)){
                this.setData({
                    deliveryInfo: {
                        remark:'暂无物流流转信息'
                    },
                });
            }else{
                let firstInfo = result.list[result.list.length - 1];
                this.setData({
                    deliveryInfo: firstInfo,
                });
            }
        };
        r.addToQueue();
    },

    leftButtonTap:function(e){
        var index = e.currentTarget.dataset.statuskey;
        if (index == 0) {//删除订单
            let self = this;

            wx.showModal({
                title: '提示',
                content: '确认删除订单？',
                confirmText: '删除',
                success: function (res) {
                    if (res.confirm) {
                        //提交请求
                        let r = RequestWriteFactory.deleteOrder(self.data.orderId);
                        r.finishBlock = (req) => {
                            //返回上一个界面
                            wx.navigateBack({
                                delta: 1,
                            })
                        };
                        r.addToQueue();

                    }
                }
            })
        }
        else if (index == 2){//确认收货
            let r = RequestWriteFactory.modifyOrderStatus(this.data.orderId, '3');
            r.finishBlock = (req) => {
                this.requestData();
            };
            r.addToQueue();
        }
    },

    rightButtonTap: function (e) {
        var index = e.currentTarget.dataset.statuskey;
        if (index == 0) {//付款
              wx.setStorage({
                key: 'order',
                data: this.data.orderDatas,
            })
            wx.navigateTo({
                url: '../../pay-method/pay-method',
            })
        }
        else if (index == 2) {//查看物流
            let trackNo = this.data.orderDatas.LogisticsNumber;
            let companyNo = this.data.orderDatas.LogisticsCode;

            let productList = this.data.orderDatas.Scan_Line;
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
                url: '../../my/delivery-info/delivery-info'
            })
        }
    }

})