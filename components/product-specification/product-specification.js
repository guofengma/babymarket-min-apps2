// product-specification.js

/**
 * 商品规格选择
 */

export default class ProductSpecification {
    constructor(page,productId){
        this.page = page;

        this.productId = productId;
        this.specificationId = '';
        this.count = 1;

        this.page.data.showProductSpecification = false;
        // this.page.data.productSpecificationAction = 'Buy';
        this.page.data.productSpecificationAction = 'ShoppingCart';
        this.page.data.innerProduct = {};
        this.page.data.innerPrice = 0;

        let title = '加入购物车';
        this.page.data.innerTitle = title;

        let {Tool:t} = global;
        let {page:p} = this;

        //dismiss
        if (!t.isFunction(p.dismissProductSpecification)) {
            p.dismissProductSpecification = this._dismissProductSpecification.bind(this);
        }

        /**
         * 捕获点击，防止向下传递触发dismiss
         * @private
         */
        if (!t.isFunction(p.productSpecificationClicked)) {
            p.productSpecificationClicked = this._productSpecificationClicked.bind(this);
        }

        if (!t.isFunction(p.submitBtnClicked)) {
            p.submitBtnClicked = this._submitBtnClicked.bind(this);
        }

        this.requestData();
    }

    updateTitle(){
        let title = '加入购物车';
        if (this.page.data.productSpecificationAction === 'Buy') {
            title = '确认购买';
        }
        this.page.setData({
            innerTitle:title,
        })
    }

    requestData(){
        this.getProductInfo();
        this.getAllSpecificationRead();
    }

    getProductInfo(){
        let self = this;
        let r = global.RequestReadFactory.productDetailRead(this.productId);
        r.finishBlock = (req,firstData) =>{
            self.page.setData({
                innerProduct:firstData,
                innerPrice:firstData.SalePrice,
            });
        }
        r.addToQueue();
    }

    getAllSpecificationRead(){
        let self = this;
        let r = global.RequestReadFactory.allSpecificationRead(this.productId);
        r.finishBlock = (req,firstData) => {
            if (req.responseObject.Total == '1') {
                self.specificationId = firstData.Id;
            }
        }
        r.addToQueue();
    }

    showWithAction(action){
        this.page.setData({
            productSpecificationAction:action,
            showProductSpecification:true,
        })
        this.updateTitle();
    }

    dismiss(){
        this.page.setData({
            showProductSpecification:false,
        })
    }

    //dismiss
    _dismissProductSpecification(){
        this.dismiss();
    }

    /**
     * 捕获点击，防止向下传递触发dismiss
     * @private
     */
    _productSpecificationClicked(){

    }

    /**
     * 提交按钮点击事件
     * @private
     */
    _submitBtnClicked(){
        let {Tool:t} = global;
        if (t.isFunction(this.finishBlock)) {
            let {specificationId,count} = this;
            let {innerProduct:product,innerPrice:price} = this.page.data;

            if (t.isEmptyStr(specificationId)) {
                t.showAlert('无法获取规格数据，请稍后再试！');
                return;
            }
            if (t.isEmptyObject(product)) {
                t.showAlert('无法获取商品数据，请稍后再试！');
                return;
            }
            this.finishBlock(specificationId,product,count,price);
        }

        this.dismiss();
    }
}