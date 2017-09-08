let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        code: '',
        inviteCode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            phone: options.phone,
            code: options.code
        })

        let self = this;
        wx.getStorage({
            key: 'fromId',
            success: function(res) {
                self.setData({
                    inviteCode:res.data
                })
                console.log('register---fromId:' + res.data);
            },
        })
    },
    /**
      * 邀请码文本绑定
      * @param e
      */
    textOnChange(e) {
        let text = e.detail.value;
        this.setData({
            inviteCode: text
        })
    },
    /**
       * 确定点击
       */
    submitBtnClicked() {
        let self = this;
        let { phone } = this.data;
        let { code } = this.data;
        let { inviteCode } = this.data;
        if (Tool.isEmpty(code)) {
            Tool.showAlert('请输入邀请码')
        } else {
            let r = RequestReadFactory.checkInvite(inviteCode);
            r.finishBlock = (req) => {
                let { Datas } = req.responseObject;
                if (Tool.isValidArr(Datas)) {
                    global.Tool.navigateTo('/pages/register/password/register-password?phone=' + phone + "&code=" + code + "&inviteCode=" + inviteCode);
                } else {
                    Tool.showAlert('邀请码不正确')
                }
            }
            r.addToQueue();
        }
    }
})