// pages/home/cell-home/v2/subject/product/product.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        product:Object,
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

        subjectProductCellClicked:function (e) {
            this.triggerEvent('subjectProductCellClicked',{...this.data});
        }
    }
})
