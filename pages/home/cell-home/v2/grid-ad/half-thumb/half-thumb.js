// pages/home/v2/grid-ad/half-thumb/half-thumb.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        imgsrc:String,
        index:Number,
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
            this.triggerEvent('thumbClicked',{...this.data});
        }
    }
})
