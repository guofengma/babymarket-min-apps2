// pages/my/views/menu-cell/menu-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        imgsrc:String,
        title:String,
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
        menuclicked:function (e) {
            this.triggerEvent('menuclicked',{...this.data})
        }
    }
})
