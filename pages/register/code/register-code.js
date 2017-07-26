let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
    this.getCodeTap();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(this.data.time);
  },
  getCodeTap: function () {
    let tempEnable = this.data.getCodeBtEnable;
    if (!tempEnable) {
      return;
    }

    this.setData({
      getCodeBtEnable: !tempEnable,
      showSecond: true
    });

    this.countdown(this);
    let r = RequestWriteFactory.verifyCodeGet(this.data.phone, '0');
    r.finishBlock = (req) => {
      wx.showToast({
        title: '验证码已发送',
      })
    };
    r.addToQueue();
  },

  submitTap: function (e) {
    let code = e.detail.value.input;
    if (Tool.isEmptyStr(code)) {
      Tool.showAlert("请输入短信验证码");
      return;
    }
    let { phone } = this.data;

    let r = RequestReadFactory.checkCode(phone, code);
    r.finishBlock = (req) => {
      let datas = req.responseObject.Datas;
      if (datas.length >= 1) {
        wx.navigateTo({
          url: '/pages/register/invite/register-invite?phone=' + phone + "&code=" + code
        })
      } else {
        Tool.showAlert("验证码错误");
        return;
      }
    };
    r.addToQueue();
  },


  /**
   * 倒计时
   */
  countdown: function (that) {
    var second = that.data.second;
    clearTimeout(this.data.time);

    if (second == 0) {
      that.setData({
        second: '59',
        getCodeBtEnable: true,
        showSecond: false
      });
      return;
    }

    var time = setTimeout(function () {
      that.setData({
        second: second - 1,
        getCodeBtEnable: false,
        showSecond: true,
      });
      that.countdown(that);
    }, 1000)
    that.setData({
      time: time
    });
  }
})