// 商品详情
import ProductSpecification from '../../components/product-specification/product-specification';
import WxParse from '../../libs/wxParse/wxParse.js';
import Login from '../login/login';

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:{},
        images:[],
        nation:'',
        province:'浙江',
        express:'6',

        pricePrefix:'',
        oldPrice:'',
        price:'',
        rateText:'',
        expressText:'',
        supplyText:'',
        isImport:'',

        isLogin: Storage.didLogin(),
    },
    productId:'',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.productId = options.productId;

        let self = this;
        this.productSpecification = new ProductSpecification(this,this.productId);
        this.productSpecification.finishBlock = (specificationId,product,count,price) => {
        };

        this.requestData();

        wx.request({
            url: 'https://www.babymarkt.com.cn/productwebdetail.aspx?Id=' + self.productId,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                // var article = `<div class="Div-6">
                //         <div id="ctl04_ctl02" class="libra-html" >
                //             <p><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=67f3f97c-0a03-4057-afc9-a6ce00f062ad" title= "帮宝适_01.jpg" alt= "帮宝适_01.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=81c4096c-61fb-4cf9-ba5a-a6ce00f06631" title= "帮宝适_02.jpg" alt= "帮宝适_02.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=752063c6-fdbc-4b89-8843-a6ce00f06ae1" title= "帮宝适_03.jpg" alt= "帮宝适_03.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=47872495-2131-41be-a1cb-a6ce00f071e9" title= "帮宝适_04.jpg" alt= "帮宝适_04.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=17eb85eb-c557-437e-b94b-a6ce00f077c5" title= "帮宝适_05.jpg" alt= "帮宝适_05.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=3e437298-35e4-4efb-8bea-a6ce00f07b49" title= "帮宝适_06.jpg" alt= "帮宝适_06.jpg" /><img src="https://www.babymarkt.com.cn/Libra.Web.Businesses.Attachments.GetFile.aspx?Id=6c808c4d-31e6-4464-9fdc-a6ce00f07da1" title= "帮宝适_07.jpg" alt= "帮宝适_07.jpg" /></p>
                //                 < /div>
                //                 < /div><div class="detail HtmlDiv-WorkaroundBody">
                //                 < img src= "https://www.babymarkt.com.cn/sf-1brl19mjot396b08ctes09s5ef-1pcd479ksfk1298lt7k40hidbl.aspx?t=8u8ipLtszP5HWXQs7RvS1f0i5Gx" border= "0" /><img src="https://www.babymarkt.com.cn/sf-1brl19mjot396b08ctes09s5ef-4umqr8397kt14a9gl7k40hin11.aspx?t=B7EbvTaCKiyJt4sr7YkpI_q588I" border= "0" />
                //                     </div>
                //              product-detail       < /div>`
                /**
                * WxParse.wxParse(bindName , type, data, target,imagePadding)
                * 1.bindName绑定的数据名(必填)
                * 2.type可以为html或者md(必填)
                * 3.data为传入的具体数据(必填)
                * 4.target为Page对象,一般为this(必填)
                * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                */
                let response = res.data;
                let arry = response.split('<div class="Div-6">');
                let html = arry[1];
                WxParse.wxParse('article', 'html', html, self, 5);
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let self = this;
        self.setData({
            isLogin: Storage.didLogin()
        });
    },

    requestData() {
        if (Tool.isEmptyStr(this.productId)) {
            Tool.showAlert('Id不能为空');
        }

        this.requestProductInfo();
        this.requestAttatchments();
    },

    //商品详情
    requestProductInfo(){
        let r = RequestReadFactory.productDetailRead(this.productId);
        let self = this;
        r.finishBlock = (req,firstData) => {
            if (Tool.isValidObject(firstData)) {
                let images = this.data.images;
                images.unshift(Tool.imageURLForId(firstData.ImgId));

                // if (Storage.didLogin()) {
                //     let tempPrice = firstData.SalePrice;
                //     firstData.SalePrice = firstData.LYPrice;
                //     firstData.LYPrice = tempPrice;
                // }
                // else{
                //     firstData.LYPrice = "0";
                // }

                self.setData({
                    product:firstData,
                    images:images
                })
                self.updatePrice();
                self.requestNation(firstData.NationalKey);
                self.requestExpressInfo();
                self.requestLocation();
            }
            else
            {
                Tool.showAlert('商品不存在或已下架');
            }
        };
        r.completeBlock = () => {
        };
        r.addToQueue();
    },

    updatePrice(){
        this.setData({
            price:this.price(),
            pricePrefix:this.pricePrefix(),
            oldPrice:this.oldPrice(),
            rateText:this.rateText(),
            isImport:Tool.isTrue(this.data.product.Import)
        })
    },

    //附件
    requestAttatchments(){
        let r2 = RequestReadFactory.attachmentsRead(this.productId);
        let self = this;
        r2.finishBlock = (req) => {
            let imageUrls = req.responseObject.imageUrls;
            let images = this.data.images.concat(imageUrls);
            self.setData({
                images:images
            });
        };
        r2.completeBlock = () => {
        };
        r2.addToQueue();
    },

    //国家信息
    requestNation(theKey){
        let r = RequestReadFactory.productNationRead(theKey);
        let self = this;
        r.finishBlock = (req,data) => {
            if (Tool.isValidObject(data)) {
                self.setData({
                    nation:data.Name
                });
                self.setData({
                    supplyText:self.supplyText()
                })
            }
        };
        r.addToQueue();
    },

    //运费
    requestExpressInfo(){
        let r = RequestReadFactory.expressRuleRead(this.data.product.StoreId,this.data.province);
        let self = this;

        r.finishBlock = (req,data) => {
            if (Tool.isValidObject(data)) {
                self.setData({
                    express:data.Express_Fee
                })
                self.setData({
                    expressText:self.expressText(),
                })
            }
        };
        r.addToQueue();
    },

    /**
     * 获取位置信息，计算运费
     */
    requestLocation(){
        let self = this;
        Tool.getLocation((res)=>{
            let province = res.originalData.result.addressComponent.province;
            self.setData({
                province:province
            })
            self.requestExpressInfo();
        })
    },

    pricePrefix(){
        return Storage.didLogin() ? "（老友专享）": "";
    },

    price(){
        return this.data.product.SalePrice;
    },

    oldPrice(){
        if (this.data.product.LYPrice === this.price() || this.data.product.LYPrice == 0) {
            return "";
        }
        return Storage.didLogin() ? '￥' + this.data.product.LYPrice : "";
    },

    rateText(){
        return  ((this.data.product.TaxRate === '0' || this.data.product.TaxRate === undefined) ? '' : '税率：'+parseFloat(this.data.product.TaxRate).toFixed(2) * 100 + '%');
    },

    expressText(){
        let {express} = this.data;
        if (express === '0' || express === undefined) {
            return '包邮';
        }
        else
            return ''+this.data.express+'元';
    },

    supplyText(){
        if (global.Tool.isEmptyStr(this.data.product.Warehouse)) {
            return '供货';
        }
        if (this.data.nation === '中国' || global.Tool.isEmptyStr(this.data.nation)) {
            return this.data.product.Warehouse + '供货';
        }
        else {
            return this.data.nation + '直供' + this.data.product.Warehouse + '供货';
        }
    },

    /**
     * 进入购物车
     */
    onGoCartListener: function (e) {
        console.log("进入购物车");

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            this.loginRegisterTap();
            return;
        }

        global.Tool.switchTab('/pages/shopping-cart/shopping-cart');
    },

    /**
     * 添加购物车
     */
    onAddCartListener: function (e) {
        console.log("添加购物车")

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            this.loginRegisterTap();
            return;
        }

        this.productSpecification.showWithAction('ShoppingCart');
    },

    /**
     * 确认下单
     */
    onSubmitListener: function (e) {
        console.log("确认下单")

        if (!this.data.isLogin) {//未登录，跳转到登陆界面
            this.loginRegisterTap();
            return;
        }

        this.productSpecification.showWithAction('Buy');
    },

    homeADClicked(){

    },

    /**
     * 登录／注册
     */
    loginRegisterTap: function () {
        this.login = new Login(this);
        this.login.show();
    },

})