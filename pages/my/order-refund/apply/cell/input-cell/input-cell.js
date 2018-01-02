// pages/my/order-refund/apply/cell/input-cell/input-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder:String,
        selectable:Boolean,
        height:Number,
        selectable:{
            type:Boolean,
            value:false,
        },
        value:{
            type:String,
            value:''
        }
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
        bindinput:function (e) {
            this.triggerEvent('inputOnChange',{value:e.detail.value});
        }
    }
})
