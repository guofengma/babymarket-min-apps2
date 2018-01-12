// pages/my/order-refund/cell/refund-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        line:Object,

        item:{
            type:Object,
            observer:function (newValue,oldValue) {
                if (newValue && newValue.product) {
                    let line = this.data.line;
                    this.setData({
                        line:{
                            Product_Name:newValue.product.ProductName,
                            imageUrl:newValue.product.imgsrc,
                            S_Name:newValue.product.ProductSize,
                            Qnty:newValue.product.Qnty,
                            Price:newValue.product.Price,
                        }
                    })
                }
            }
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

    }
})
