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

        // //如果二级分类数据为空，那么去请求二级分类数据
        // let oneSort = this.data.oneSortData[currentIndex];
        // if (oneSort.twoSortData == undefined && currentIndex > 0) {
        //     Tool.showLoading();
        //     this.requestTwoSortData(currentIndex, oneSort.Id);
        // }
    }
})