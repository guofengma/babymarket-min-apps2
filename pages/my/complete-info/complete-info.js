// complete-info.js

let {Tool, Storage, RequestWriteFactory, RequestReadFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datas:[
            {
                'inputName':'customName',
                'title':'客户名称',
                'placeholder':'请输入',
                'value':''
            },
            {
                'inputName': 'area',
                'title': '客户区域',
                'placeholder': '请选择',
                'value': ''
            },
            {
                'inputName': 'receiptAddress',
                'title': '收货地址',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'receiptName',
                'title': '收货联系人',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'receiptTel',
                'title': '收货人手机号码',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'companyName',
                'title': '法人姓名',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'companyTel',
                'title': '法人手机号码',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'alipayAccount',
                'title': '法人支付宝账号',
                'placeholder': '请输入',
                'value': ''
            },
            {
                'inputName': 'withdrawPassword',
                'title': '提现密码',
                'placeholder': '请输入',
                'value': '',
                'password':true
            },
            {
                'inputName': 'confirmPassword',
                'title': '确认提现密码',
                'placeholder': '请输入',
                'value': '',
                'password': true
            },
        ],
        area: {
            'FullName':'请选择'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData();
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
    onShareAppMessage: function () {

    },

    /**
     * 地区选择
     */
    areaTap:function(){
        wx.navigateTo({
            url: '../../select-provinces/select-provinces',
        })
    },

    /**
     * 确定
     */
    formSubmit: function (e) {
        let value = e.detail.value;
        console.log('====form=====' + value);
        
        let customName = value.customName;
        let area = this.data.area.FullName;
        let areaId = this.data.area.SQId;
        let receiptAddress = value.receiptAddress;
        let receiptName = value.receiptName;
        let receiptTel = value.receiptTel;
        let companyName = value.companyName;
        let companyTel = value.companyTel;
        let alipayAccount = value.alipayAccount;
        let withdrawPassword = value.withdrawPassword;
        let confirmPassword = value.confirmPassword;
        
        if (Tool.isEmptyStr(customName)){
            Tool.showAlert("请填写客户名称");
            return;
        }

        if (area == '请选择') {
            Tool.showAlert("请选择客户区域");
            return;
        }

        if (Tool.isEmptyStr(receiptAddress)) {
            Tool.showAlert("请填写收货地址");
            return;
        }

        if (Tool.isEmptyStr(receiptName)) {
            Tool.showAlert("请填写收货联系人");
            return;
        }

        if (Tool.isEmptyStr(receiptTel)) {
            Tool.showAlert("请填写收货人手机号码");
            return;
        }

        if (Tool.isEmptyStr(companyName)) {
            Tool.showAlert("请填写法人姓名");
            return;
        }

        if (Tool.isEmptyStr(companyTel)) {
            Tool.showAlert("请填写法人手机号码");
            return;
        }

        if (Tool.isEmptyStr(alipayAccount)) {
            Tool.showAlert("请填写法人支付宝账号");
            return;
        }

        if (Tool.isEmptyStr(withdrawPassword)) {
            Tool.showAlert("请填写提现密码");
            return;
        }

        if (Tool.isEmptyStr(confirmPassword)) {
            Tool.showAlert("请填写确认提现密码");
            return;
        }

        let r = RequestWriteFactory.completeInfomationRequest(customName, areaId, receiptAddress, receiptName, receiptTel, companyName, companyTel, alipayAccount, withdrawPassword, confirmPassword);
        r.finishBlock = (req) => {
            wx.showToast({
                title: '操作成功！',
            })
            wx.navigateBack({
                delta:1
            })
        };
        r.addToQueue();
    },

    requestData:function(){
        let r = RequestReadFactory.completeInfoRead();
        r.finishBlock = (req, firstData) => {
            if (Tool.isValidStr(firstData.CityId)){
                let condition = "${Id} = '" + firstData.CityId + "'";
                let r = RequestReadFactory.areaRead(condition);
                r.finishBlock = (req, firstData) => {
                    this.setData({
                        area: {
                            'FullName': firstData.FullName,
                            'SQId': firstData.SQId
                        }
                    });
                };
                r.addToQueue();
            }

            this.setData({
                'datas[0].value': firstData.Name,
                'datas[1].value': firstData.CityId,
                'datas[2].value': firstData.ConsigneeAddress,
                'datas[3].value': firstData.Consignee,
                'datas[4].value': firstData.ConsigneeMobile,
                'datas[5].value': firstData.LegalRepresentative,
                'datas[6].value': firstData.LegalMobile,
                'datas[7].value': firstData.AlipayAccount,
            });
        };
        
        r.addToQueue();
    }
})