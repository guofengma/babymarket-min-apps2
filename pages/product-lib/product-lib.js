/**
 * 商品库
 */
let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({
    data: {
        //商品数据
        productData: null
    },
    onLoad: function () {
        Tool.showLoading();
        this.requestProductData();
    },
    /**
    * 查询新品
    */
    requestProductData: function () {
        let task = RequestReadFactory.productRead();
        task.finishBlock = (req) => {
            let productData = req.responseObject.Datas;
            //拼装图片URL
            productData.forEach((item, index) => {
                let url = Tool.imageURLForId(item.SLTId);
                item.imageUrl = url;
            });
            this.setData({
                productData: productData
            });
            console.log(this.data.productData);
        };
        task.addToQueue();
    },
    /**
     * 列表视图点击事件
     */
    onItemClickListener: function (e) {
        let position = e.currentTarget.dataset.position;
        //改变数据选择状态
        let product = this.data.productData[position];
        wx.navigateTo({
            url: '../product-detail/product-detail?productId=' + product.Id
        })
    },
    /**
     * 搜索监听
     */
    searchClicked: function (e) {
        wx.navigateTo({
            url: '../product-lib/search/search'
        })
    }
});