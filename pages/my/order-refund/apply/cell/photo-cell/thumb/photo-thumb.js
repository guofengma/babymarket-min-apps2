// pages/my/order-refund/apply/cell/photo-cell/thumb/photo-thumb.js



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
        removeclicked:function (e) {
            this.triggerEvent('removeclicked',{...this.data});
        }
    }
})