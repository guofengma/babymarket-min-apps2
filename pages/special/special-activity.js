// special-activity.js
//专题
let {Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //专题数据
        specialData: null
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestSpecialData();
    },
    /**
     * 请求专题数据
     */
    requestSpecialData: function () {
        let task = RequestReadFactory.specialRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            this.setData({
                specialData: responseData
            });
        };
        task.addToQueue();
    }
})