// pages/home/crowdfunding/cell/crowdfunding-list-cell.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item:Object,
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
        cellClicked:function (e) {
            this.triggerEvent('cellClicked',{...this.data});
        }

    }
})
