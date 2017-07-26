/**
 * 登陆页面
 */
import RequestLogin from '../../network/requests/request-login';
let { Tool, Storage, RequestReadFactory, RequestWriteFactory, Event } = global;

export default class Login {
  constructor(page) {
    this.page = page;

    this.page.data.visiable = false;//是否显示

    let { Tool: t } = global;
    let { page: p } = this;

    if (!t.isFunction(p.loginAction)) {
      p.loginAction = this.loginAction.bind(this);
    }

    //提交按钮点击事件
    if (!t.isFunction(p.onFindPasswordListener)) {
      p.onFindPasswordListener = this.onFindPasswordListener.bind(this);
    }

    //提交按钮点击事件
    if (!t.isFunction(p.onRegisterListener)) {
      p.onRegisterListener = this.onRegisterListener.bind(this);
    }

    //提交按钮点击事件
    if (!t.isFunction(p.dismiss)) {
      p.dismiss = this.dismiss.bind(this);
    }
  }

  /**
   * 显示界面
   */
  show() {
    this.page.setData({
      visiable: true
    })
  }

  //隐藏页面
  dismiss() {
    this.page.setData({
      visiable: false
    })
  }

  /**
   * 登录按钮
   */
  loginAction(e) {
    let userInfo = e.detail.value
    let username = userInfo.username
    let password = userInfo.password

    let self = this;
    let r = new RequestLogin(username, password);
    r.finishBlock = (req) => {
      let model = req.responseObject;
      let session = model.Session;
      let key = model.Person.Key;
      let id = Tool.idFromDataKey(key);
      let type = self.loginTypeWithKey(key);

      Storage.setCurrentSession(session);
      Storage.setDidLogin(true);
      Storage.setMemberId(id);
      Storage.setLoginType(type);

      //发送登录成功通知
      Event.emit("loginSuccess");

      this.dismiss();
    };
    r.addToQueue();
  }

  loginTypeWithKey(key) {
    let type = '';
    if (Tool.isStringStartsWith(key, 'Employee')) {
      type = 'Employee';//员工
    }
    else if (Tool.isStringStartsWith(key, 'KH')) {
      type = 'DealersBoss';//经销商老板
    }
    else if (Tool.isStringStartsWith(key, 'ZDSD')) {
      type = 'StoreBoss';//门店老板
    }
    else if (Tool.isStringStartsWith(key, 'CustomerPerson')) {
      type = 'DealersEmployee';//经销商员工
    }
    else if (Tool.isStringStartsWith(key, 'StorePerson')) {
      type = 'StoreEmployee';//门店员工
    }
    return type
  }

  /**
   * 找回密码
   */
  onFindPasswordListener() {
    wx.navigateTo({
      url: '/pages/find-password/phone/phone'
    })
  }

  /**
   * 我要注册
   */
  onRegisterListener() {
    wx.navigateTo({
      url: '/pages/register/phone/register-phone'
    })
  }

}