let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      code: options.code
    })
  },

  /**
    * 邀请码文本绑定
    * @param e
    */
  textOnChange(e) {
    let text = e.detail.value;
    this.setData({
      password: text
    })
  },
  /**
     * 确定点击
     */
  submitBtnClicked() {
    let self = this;
    let { phone } = this.data;
    let { code } = this.data;
    let { password } = this.data;
    if (Tool.isEmpty(password)) {
      Tool.showAlert('请输入新密码')
    } else {
      let r = RequestWriteFactory.modifyLoginPassword(phone, code, password);
      r.finishBlock = (req) => {
        Tool.showSuccessToast("密码修改成功，请重新登录...");
        wx.navigateBack({
          delta: getCurrentPages().length - 1
        })
      };
      r.addToQueue();
    }
  }
})