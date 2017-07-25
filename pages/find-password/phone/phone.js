let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 电话文本绑定
   * @param e
   */
  textOnChange(e) {
    let text = e.detail.value;
    this.setData({
      phone: text
    })
  },

  /**
   * 确定点击
   */
  submitBtnClicked() {
    let self = this;
    let { phone } = this.data;
    if (Tool.isEmpty(phone)) {
      Tool.showAlert('请输入账号')
    } else {
      let r = RequestReadFactory.checkMemberByPhone(phone);
      r.finishBlock = (req) => {
        let { Datas } = req.responseObject;
        if (Tool.isValidArr(Datas)) {
          global.Tool.navigateTo('/pages/find-password/code/code?phone=' + phone);
        } else {
          Tool.showAlert('该账号未注册')
        }
      }
      r.addToQueue();
    }
  }

})