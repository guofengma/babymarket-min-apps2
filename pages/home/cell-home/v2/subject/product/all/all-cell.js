// pages/home/cell-home/v2/subject/product/all/all-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
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

        allCellClicked:function (e) {
            this.triggerEvent('allCellClicked',{...this.data});
        }
    }
})
