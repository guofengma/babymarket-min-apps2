// components/adder-subtractor/component/adder.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        count: Number,
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
        subClicked: function (e) {
            this.triggerEvent('subClicked', { ...this.data ,e});
        },
        inputOnChange: function (e) {
            this.triggerEvent('inputOnChange', { ...this.data ,e});
        },
        addClicked: function (e) {
            this.triggerEvent('addClicked', { ...this.data ,e});
        }
    }
})
