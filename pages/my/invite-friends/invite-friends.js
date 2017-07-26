// invite-friends.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
      console.log('---onShareAppMessage---');
      let self = this;
      wx.getStorage({
          key: 'currentMember',
          success: function (res) {
              self.setData({
                  inviteCode: res.data.InvitationCode
              })
          },
      })

      return {
          title: '这是一个有温度，有情怀的品质家庭购物平台',
          path: '/pages/my/invite-friends/invite-friends?fromId=' + this.data.inviteCode,
          success: function (res) {
              // 转发成功
              console.log('转发成功')
          },
          fail: function (res) {
              // 转发失败
              console.log('转发失败')
          }
      }
  },
})