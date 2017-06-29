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
        this.addressReadOperation = '881d520d-bb5d-04e2-29a8-3c29005a359b';
        this.addressAddOperation = '065e13dd-93fe-0a89-1671-3c2701995222';
        this.addressModifyOperation = '91ef9bde-6fe7-0955-2ecc-3c24004dd20e';
        this.addressDeleteOperation = '4f91a738-50f3-0dc0-231e-3c24018bc622';

        //地区
        this.areaReadOperation = '7e179d1c-ab1c-0352-0a44-393c01c0abf4';

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