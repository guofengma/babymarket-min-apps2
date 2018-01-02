// pages/my/order-refund/apply/cell/menu-cell/menu-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        icon:String,
        title:String,
        des:String,
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
        menuClicked:function () {
            this.triggerEvent('menuClicked',{...this.data})
        }
    }
})





