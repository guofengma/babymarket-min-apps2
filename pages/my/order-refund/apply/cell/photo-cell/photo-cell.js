// pages/my/order-refund/apply/cell/photo-cell/photo-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

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
        clicked:function () {
            this.triggerEvent('clicked',{...this.data});
        }

    }
})
