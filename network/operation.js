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

        //首页-广告位
        this.homeAdReadOperation = 'b412ff1c-c19b-4250-b479-a61e0085a868';
        //首页-一级分类
        this.homeOneSortReadOperation = '4293f401-3425-4d6b-bf67-a618018b764a';

        //宝贝码头商品详情
        this.bmProductReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //宝贝码头附件
        this.bmAttachmentsReadOperation = '7eba4898-2f70-05b4-0b17-009a002e71ad';

        //老友码头 商品的国家信息
        this.bmNationReadOperation = 'c5cb5117-b585-0160-2ab2-3c1f0016ec87';

        //老友码头 运费
        this.bmExpressRuleReadOperation = '91972a34-2e32-0928-156f-3c3501e55857';

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
        this.addressReadOperation = '881d520d-bb5d-04e2-29a8-3c29005a359b';
        this.addressAddOperation = '065e13dd-93fe-0a89-1671-3c2701995222';
        this.addressModifyOperation = '91ef9bde-6fe7-0955-2ecc-3c24004dd20e';
        this.addressDeleteOperation = '4f91a738-50f3-0dc0-231e-3c24018bc622';

        //地区
        this.areaReadOperation = '7e179d1c-ab1c-0352-0a44-393c01c0abf4';

        //优惠劵
        this.couponReadOperation = 'ac4b38e9-45ce-0626-2fc2-3c3b000e731f';

        //订单
        this.orderAddOperation ='c65c46b6-b12e-0e57-28fe-3c1900223872';
        this.orderDeleteOperation = '';
        this.orderReadOperation = '481f0766-998d-003c-1727-3c1701e15fcb';
        this.orderModifyOperation = '51edceb5-4d37-0d8b-1043-3c1a01f6b85e';

        //订单明细
        this.orderLineAddOperation = '6a5ba01b-d63c-0e45-230f-3c19005015b1';

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