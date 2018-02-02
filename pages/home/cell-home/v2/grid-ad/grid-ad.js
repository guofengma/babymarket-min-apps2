// pages/home/v2/grid-ad/grid-ad.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        items:Array,
        section:Number,
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
            this.triggerEvent('thumbClicked',{...this.data,index});
        }
    }
})
