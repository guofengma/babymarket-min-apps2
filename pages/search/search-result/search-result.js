import ProductSpecification from '../../../components/product-specification/product-specification';
let {Tool, Storage, RequestReadFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //搜索关键字
        keyword: null,
        //产品列表
        productArray: null,
        subjectId:null,
        subject:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let subjectId = options.subjectId;
        if (subjectId) {
            this.setData({
                subjectId,
            })
            this.requestSubject();
        }
        else{
            Tool.showLoading();
            this.setData({
                keyword: options.keyword
            });
            this.requestSearchProductData(options.keyword);
        }
    },

    /**
    * 搜索产品数据
    */
    requestSearchProductData: function (keyword) {
        let task = RequestReadFactory.searchProductRead(keyword);
        // let task = RequestReadFactory.searchProductRead(keyword,this.data.subjectId);
        if (this.data.subjectId) {
            task = RequestReadFactory.searchSubjectProductRead(keyword,this.data.subjectId);
        }
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let datas = []
            responseData.forEach((item, index) => {
              if (item.ShowName.indexOf('保健') == -1) {
                datas.push(item)
              }
            })
            responseData = datas
            this.setData({
                productArray: responseData
            });
        };
        task.addToQueue();
    },

    /**
     * 搜索框搜索
     */
    onConfirmAction: function (e) {
        let keyword = e.detail.value;
        Tool.showLoading();
        this.requestSearchProductData(keyword);
    },

    /**
     * 列表子视图点击事件
     */
    onChildClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/product-detail/product-detail?productId=' + productId
        })
    },

     /**
     * 添加到购物车
     */
    onAddCartClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;

        let self = this;
        this.productSpecification = new ProductSpecification(this, productId);
        this.productSpecification.finishBlock = (specificationId, product, count, price) => {
            global.Tool.showAlert(specificationId);
        };

        this.productSpecification.showWithAction('ShoppingCart');
    },

    requestSubject:function (e) {
        let r = global.RequestReadFactory.requestSubjects(this.data.subjectId);
        r.finishBlock = (res,firstData)=>{
            this.setData({
                subject:firstData,
                productArray:firstData.ProductDetail,
            })
        }
        r.addToQueue();
    },
})