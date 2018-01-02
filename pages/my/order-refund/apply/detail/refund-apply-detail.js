// pages/my/order-refund/apply/detail/refund-apply-detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type:0,//1仅退款，0退款退货
        isRefundMoneyOnly:true,
        line:{},
        orderStatusArr:["已收到货","未收到货（请确保已与客服协商同意仅退款）"],
        refundReasons:[],
        selectReasonText:'',
        reasonTexts:[],
        innerCount:0,
        orderStatus:'',
        refundMoney:'',
        alipayAccount:'',
        refundDetail:'',
        images:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let type = options.type;
        let isRefundMoneyOnly = parseInt(type) == 1;
        let line = global.Storage.getterFor('SelectOrderLine');
        this.setData({
            type,
            isRefundMoneyOnly,
            line,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.requestData();
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

    requestData(){
        let r = global.RequestReadFactory.requestRefundReason();
        r.finishBlock = (req)=> {
            let datas = req.responseObject.Datas;
            let reasonTexts = req.responseObject.reasonTexts;
            this.setData({
                refundReasons:datas,
                reasonTexts
            })
        }
        r.addToQueue();
    },
    counterAddClicked(e){
        this.setData({
            innerCount:this.data.innerCount + 1
        })
        console.log('counterAddClicked clicked');
    },
    counterSubClicked(e){
        let count = this.data.innerCount - 1;
        if (count < 1 || count == undefined) {
            count = 1;
        }
        this.setData({
            innerCount: count,
        })
    },
    counterInputOnChange(e){
        let count = e.detail.e.detail.value;
        if (count == null || count == undefined) {
            count = 1;
        }
        count = parseInt(count);
        if (count <= 0) {
            count = 1;
        }
        console.log("counterInputOnChange:" + count);
        this.setData({
            innerCount:count,
        })
    },
    orderStatusOnChange(e){
        let value = e.detail.value;
        let status = this.data.orderStatusArr[parseInt(value)];
        this.setData({
            orderStatus:status,
        })
    },
    reasonOnChange(e){
        let value = e.detail.value;
        let text = this.data.reasonTexts[parseInt(value)];
        this.setData({
            selectReasonText:text,
        })
    },
    refundMoneyOnChange(e){
        let value = e.detail.value;
        console.log('refundMoneyOnChange:' + value);
        this.setData({
            refundMoney:parseFloat(value)
        });
    },
    alipayOnChange(e){
        let value = e.detail.value;
        console.log('alipayOnChange:' + value);
        this.setData({
            alipayAccount:value
        });
    },
    detailOnChange(e){
        let value = e.detail.value;
        console.log('detailOnChange:' + value);
        this.setData({
            refundDetail:value
        });
    },
    addPhotoClicked(e){
        console.log('addPhotoClicked');
        global.Tool.chooseAndUploadImgsFromWX(6 - this.data.images.length ,(results)=>{
            console.log('chooseAndUploadImgsFromWX:'  + JSON.stringify(results));
            this.setData({
                images:this.data.images.concat(results),
            })
        });
    },
    photoRemoveClicked(e){
        let index = parseInt(e.detail.index);
        console.log('photoRemoveClicked:' + index);
        this.data.images.splice(index,1);
        this.setData({
            images:this.data.images,
        })
    }
})