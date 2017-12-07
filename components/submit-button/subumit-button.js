// components/submit-button/subumit-button.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

        title:String,
        tag:Number,
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
        submitBtnClicked: function(){
            this.triggerEvent('submitclicked', {...this.data})
        }
    }
})
