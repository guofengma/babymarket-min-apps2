let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    inviteCode: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      code: options.code,
      inviteCode: options.inviteCode
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
    let { inviteCode } = this.data;
    if (Tool.isEmpty(password)) {
      Tool.showAlert('请输入密码')
    } else {
      let r = RequestReadFactory.addMember(phone, code, password, inviteCode);
      r.finishBlock = (req) => {
        //注册成功,返回到登录界面
        Tool.showSuccessToast("注册成功，请登录...");
        wx.navigateBack({
          delta: getCurrentPages().length - 1
        })
      }
      r.addToQueue();
    }
  }
})