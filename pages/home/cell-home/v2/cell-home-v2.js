// pages/home/cell-home/v2/cell-home-v2.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        targetArray:Array,
        oneSortData:Array,
        bannerArray:Array,
        bulletinContent:String,
        bulletinDatas:Array,
        hotBannerArray:Array,
        selections:Array,
        subjects:Array,
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
        },
        allCellClicked:function (e) {
            let index = e.detail.index;
            this.triggerEvent('allCellClicked',{index});
        },
        allSubjectClicked:function (e) {
            this.triggerEvent('allSubjectClicked',{});
        },
        subjectProductCellClicked:function (e) {
            let product = e.detail.product;
            this.triggerEvent('subjectProductCellClicked',{product})
        },
        bulletinTap:function (e) {
            this.triggerEvent('bulletinTap',{});
        },
        homeADClicked:function (e) {
            let index = e.currentTarget.dataset.index;
            this.triggerEvent('homeADClicked',{index})
        }
    },
})
