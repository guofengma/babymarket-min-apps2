// pages/my/order-refund/apply/cell/photo-cell/add-cell/add-cell.js
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
        clicked:function (e) {
            this.triggerEvent('clicked',{...this.data});
        }
    }
})
