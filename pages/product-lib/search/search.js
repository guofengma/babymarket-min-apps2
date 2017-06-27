let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //搜索到的数据
        searchData: null
    },
    /**
     * 搜索商品
     */
    requestProductForSearchData: function (keyword) {
        let task = RequestReadFactory.productBySearchRead(keyword);
        task.finishBlock = (req) => {
            let searchData = req.responseObject.Datas;
            //拼装图片URL
            searchData.forEach((item, index) => {
                let url = Tool.imageURLForId(item.TPId);
                item.imageUrl = url;
            });
            this.setData({
                searchData: searchData
            });
        };
        task.addToQueue();
    },
    /**
     * 搜索数据
     */
    onConfirmAction: function (e) {
        let keyword = e.detail.value;
        console.log("keyword:" + keyword);
        if (Tool.isValid(keyword)) {
            Tool.showLoading();
            this.requestProductForSearchData(keyword);
        } else {
            Tool.showAlert("请输入搜索关键字");
        }
    },
    /**
     * 列表子视图点击事件
     */
    onItemClickListener: function (e) {
        let position = e.currentTarget.dataset.position;
        //改变数据选择状态
        let product = this.data.productData[position];
        wx.navigateTo({
            url: '../product-detail/product-detail?productId=' + product.Id
        })
    }
})