Page({
  data: {
    motto: '',
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      motto: 'https://www.babymarkt.com.cn/web/index.html?amount=' + options.amount + '&type=' + options.type + '&fromId=' + options.fromId + '&imgId=' + options.imgId
    })
  }
})