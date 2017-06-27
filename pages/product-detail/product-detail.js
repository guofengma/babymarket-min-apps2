// 商品详情
let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        productInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        Tool.showLoading();
        this.requestProductData(options.productId);
    },
    /**
     * 获取商品详细数据
     */
    requestProductData: function (productId) {
        let task = RequestReadFactory.productByIdRead(productId);
        task.finishBlock = (req) => {
            if (req.responseObject.Count > 0) {
                let responseData = req.responseObject.Datas[0];
                let imageUrl = Tool.imageURLForId(responseData.TPId);
                responseData.imageUrl = imageUrl;
                this.setData({
                    productInfo: responseData
                });
            }
        };
        task.addToQueue();
    },
    /**
     * 进入购物车
     */
    onGoCartListener: function (e) {
        console.log("进入购物车")
    },
    /**
     * 添加购物车
     */
    onAddCartListener: function (e) {
        console.log("添加购物车")
    },
    /**
     * 确认下单
     */
    onSubmitListener: function (e) {
        console.log("确认下单")
    }
})