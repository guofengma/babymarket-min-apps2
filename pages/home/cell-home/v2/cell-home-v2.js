// pages/home/cell-home/v2/cell-home-v2.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        targetArray:Array,
        oneSortData:Array,
        bannerArray:Array,
        bulletinContent:Array,
        hotBannerArray:Array,
        selections:Array,
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        thumbClicked:function (e) {
            let index = e.detail.index;
            let section = e.detail.section;
            this.triggerEvent('thumbClicked',{index,section});
        }

    },


})
