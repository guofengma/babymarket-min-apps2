// home.js

/**
 * 首页
 */

let {Tool, Storage, RequestReadFactory} = global;

Page({
    data: {
        //海报数据
        adArray: null,
        // 当前选中的tab
        currentTab: 0,
        //一级分类数据
        oneSortData: null,
    },
    onLoad: function () {
        Tool.showLoading();
        this.requestOneSortData();
        this.requestHomeAdData();
    },
    /**
     * 获取一级分类数据
     */
    requestOneSortData: function () {
        let task = RequestReadFactory.homeOneSortRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            //循环请求二级分类
            responseData.forEach((item, index) => {
                let url = Tool.imageURLForId(item.ImgId);
                item.imageUrl = url;
            });
            let home = new Object();
            home.Name = "首页";
            responseData.unshift(home);
            //循环请求二级分类
            // for (let i = 0; i < responseData.length; i++) {
            //     this.requestTwoSortData(i, responseData[i].Id);
            // }
            this.setData({
                oneSortData: responseData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类广告位数据
     */
    requestSortAdData: function (categoryId) {
        let task = RequestReadFactory.sortAdRead(categoryId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                let url = Tool.imageURLForId(item.ImgId);
                item.imageUrl = url;
            });
            let oneSortData = this.data.oneSortData;
            let bodyData = new Object();
            bodyData.adData = responseData;
            let oneSort = oneSortData[this.data.currentTab];
            oneSort.bodyData = bodyData;
            this.setData({
                oneSortData: oneSortData
            });
            //请求商品分类
            this.requestSortCategoryData(oneSort.Id);
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品的分类数据
     */
    requestSortCategoryData: function (parentId) {
        let task = RequestReadFactory.homeTwoSortRead(parentId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                //查询每个分类对应的商品
                this.requestTwoSortProductData(item.Id, index);
            });
            let oneSortData = this.data.oneSortData;
            let bodyData = oneSortData[this.data.currentTab].bodyData;
            bodyData.sortData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品数据
     */
    requestTwoSortProductData: function (categoryId, index) {
        let task = RequestReadFactory.homeTwoSortProductRead(categoryId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                let url = Tool.imageURLForId(item.ImgId);
                item.imageUrl = url;
            });
            let oneSortData = this.data.oneSortData;
            oneSortData[this.data.currentTab].bodyData.sortData[index].productData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
            console.log(this.data.oneSortData);
        };
        task.addToQueue();
    },
    /**
    * 查询首页海报数据
    */
    requestHomeAdData: function () {
        let task = RequestReadFactory.homeAdRead();
        task.finishBlock = (req) => {
            let adArray = req.responseObject.Datas;
            //拼装图片URL
            adArray.forEach((item, index) => {
                let url = Tool.imageURLForId(item.ImgId);
                item.imageUrl = url;
            });
            this.setData({
                adArray: adArray
            });
        };
        task.addToQueue();
    },
    /**
     * swiper切换事件
     */
    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        this.setData({
            currentTab: currentIndex
        });

        //如果分类的主体数据为空，那么去请求主体数据
        let oneSort = this.data.oneSortData[currentIndex];
        if (oneSort.bodyData == undefined && currentIndex > 0) {
            Tool.showLoading();
            this.requestSortAdData(oneSort.Id);
        }
    }
})