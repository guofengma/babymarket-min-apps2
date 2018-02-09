// pages/home/cell-home/v2/subject/home-subject.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        subject:{
            type:Object,
            observer:function (newValue,oldValue){
            }
        },
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
            let index = e.detail.index;
            this.triggerEvent('allCellClicked',{index});
        },
        postClicked:function (e) {
            this.triggerEvent('allCellClicked',{index:this.data.index});
        },
        subjectProductCellClicked:function (e) {
            let product = e.detail.product;
            this.triggerEvent('subjectProductCellClicked',{product})
        }
    }
})
