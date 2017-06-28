/**
 * Created by coin on 1/13/17.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//操作常量定义
export default class Operation {

    constructor() {
        if (__instance()) return __instance();

        //宝贝码头商品详情
        this.bmProductReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //宝贝码头附件
        this.bmAttachmentsReadOperation = '7eba4898-2f70-05b4-0b17-009a002e71ad';

        //老友码头 商品的国家信息
        this.bmNationReadOperation = 'c5cb5117-b585-0160-2ab2-3c1f0016ec87';

        //老友码头 运费
        this.bmExpressRuleReadOperation = '91972a34-2e32-0928-156f-3c3501e55857';


        //首页广告位
        this.homeAdReadOperation = '';

        //产品查询
        this.productReadOperation = '';

        //购物车新增
        this.cartAddWriteOperation = '';

        //用户信息
        this.memberInfoReadOperation = 'b83b9dc9-5568-0c67-1926-3c1701fb385b';

        //购物车
        this.cartReadOperation = '0a8ed48f-088f-0ca3-0c43-3c290052b69b';
        this.cartAddOperation = '';
        this.cartModifyOperation = '137c1d5c-dc35-0114-0b27-3c240045510e';
        this.cartDeleteOperation = 'cd0221ba-e321-0581-06f5-3c2401834522';

        //购物车视图
        this.cartViewReadOperation ='0a8ed48f-088f-0ca3-0c43-3c290052b69b';

        //地址
        this.addressReadOperation = '';
        this.addressAddOperation = '';
        this.addressModifyOperation = '';

        //地区
        this.areaReadOperation = '';

        //订单
        this.orderAddOperation ='';
        this.orderDeleteOperation = '';
        this.orderReadOperation = '';
        this.orderModifyOperation = '';

        //订单明细
        this.orderLineAddOperation = '';

        //完善信息
        this.informationCompleteReadOperation = '';
        this.informationCompleteWriteOperation = '';

        //提现
        this.withdrawAddOperation = '';
        this.withdrawReadOperation = '';

        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}