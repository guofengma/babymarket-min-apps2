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
        this.cartReadOperation = '';
        this.cartAddOperation = '';
        this.cartModifyOperation = '';
        this.cartDeleteOperation = '';

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