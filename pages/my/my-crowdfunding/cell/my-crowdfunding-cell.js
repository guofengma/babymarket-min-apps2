// pages/my/my-crowdfunding/cell/my-crowdfunding-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      item:Object,
      index:Number,
      inList:Boolean,
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

      cellclicked:function () {
          this.triggerEvent('cellclicked',{...this.data});
      }
  }
})
