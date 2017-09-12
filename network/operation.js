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
        //首页-码头快报
        this.homeBulletinReadOperation = '48d1e8a7-43a8-0ddd-1f68-3f50003c646b';
        //首页-分类
        this.homeSortReadOperation = '4293f401-3425-4d6b-bf67-a618018b764a';
        //首页-标签
        this.homeTargetReadOperation = '9880c3ed-124e-4703-9c67-a6500127ed09';
        //首页-标签产品
        this.homeTargetProductReadOperation = '74bd6fa2-3de3-028e-197e-3f5201d5e08b';
        //搜索-热门搜索
        this.searchHotReadOperation = 'c8abee85-11ab-0bba-1bcd-3c4701ec76cb';

        //专题
        this.specialReadOperation = '9bd4ec02-186b-08df-31d8-3eea0041a1d7';

        //宝贝码头商品详情
        this.bmProductReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //规格读取
        this.productSpecificationRead = '3b61a23d-e130-00cd-320f-3c6800fbe982';

        //规格组 读取
        this.productSpecificationGroupRead = '41222433-4d44-089d-3ca0-3c6800f1d60a';

        //宝贝码头附件
        this.bmAttachmentsReadOperation = '7eba4898-2f70-05b4-0b17-009a002e71ad';

        //老友码头 商品的国家信息
        this.bmNationReadOperation = 'c5cb5117-b585-0160-2ab2-3c1f0016ec87';

        //老友码头 运费
        this.bmExpressRuleReadOperation = '91972a34-2e32-0928-156f-3c3501e55857';

        //产品查询
        this.productReadOperation = 'de9362a8-395e-09a4-087d-3c1701f9da63';

        //购物车新增
        this.cartAddWriteOperation = '';

        //用户信息
        this.memberInfoReadOperation = 'b83b9dc9-5568-0c67-1926-3c1701fb385b';
        this.memberInfoModifyOperation = 'a1c9541a-81d2-01d0-1e42-3c1a01ecdfce';
        this.memberAddOperation = '3678dc19-7dcb-020c-26ff-3c1900385fe2';

        //购物车
        this.cartReadOperation = '0a8ed48f-088f-0ca3-0c43-3c290052b69b';
        this.cartAddOperation = '84cd955f-202c-02c8-339a-3c270191d122';
        this.cartModifyOperation = '137c1d5c-dc35-0114-0b27-3c240045510e';
        this.cartDeleteOperation = 'cd0221ba-e321-0581-06f5-3c2401834522';

        //购物车视图
        this.cartViewReadOperation = '0a8ed48f-088f-0ca3-0c43-3c290052b69b';

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
        this.orderAddOperation = 'c65c46b6-b12e-0e57-28fe-3c1900223872';
        this.orderDeleteOperation = '';
        this.orderReadOperation = '481f0766-998d-003c-1727-3c1701e15fcb';
        this.allOrderReadOperation = 'd194441f-fb19-494e-bce3-a7d7009acd4d';//全部订单
        this.orderModifyOperation = '51edceb5-4d37-0d8b-1043-3c1a01f6b85e';

        //订单明细
        this.orderLineAddOperation = '6a5ba01b-d63c-0e45-230f-3c19005015b1';

        //提现
        this.withdrawAddOperation = '';
        this.withdrawReadOperation = '';

        //支付宝账号
        this.alipayAccountAddOperation = '89f9cea6-ffa1-47c5-afe0-a75f00fee459';
        this.alipayAccountReadOperation = '6b3453e1-4643-4a57-a4d9-a75f00ff120d';

        //收藏
        this.favReadOperation = 'ad5b7994-a09c-0aa9-35fe-3c3b0004d9af';

        //提现
        this.withdrawAddOperation = '22572f16-f23c-0907-11f1-3e570121be67';
        this.withdrawReadOperation = '2ec381c4-c12f-4938-8f9f-a75c009f612d';

        //验证码
        this.verifyCodeAddOperation = '47d7a940-ab9e-04dc-2029-3c2701c073ba';

        //支付密码
        this.payPasswordAddOperation = 'd398c8f4-195e-4135-bbf4-a75f00fcc241';

        //我的资产
        this.balanceLogMonthReadOperation = 'a0d1c6cb-0618-008d-3073-3e5e0059b80b';

        //我收到的奖励
        this.awardReadOperation = '82f1f24c-e796-4d4c-8afb-a75c009c282d';

        //已省金额
        this.saveReadOperation = 'def432e0-c6b8-4bef-8ed3-a75c009c3aed';

        //邀请的老友
        this.invitedFriendsReadOperation = '0a0980cc-4311-46a0-93c4-a77100aee37d';

        //支付
        this.addWeiXinPayOperation = '578e67c3-a1cb-05b8-1475-3e4c003313fa';
        this.readWeiXinPayOperation = 'd9cd2613-8968-0bd3-2bac-3e4201f07443';

        //登录密码验证码验证
        this.checkCodeOperation = 'c994e890-833d-0ab7-1ff0-3c2900031403';

        //修改登录密码
        this.loginPasswordModifyOperation = 'f22aaf89-0539-0bf4-3142-3c4a01a6748f';

        //退款
        this.refundReasonReadOperation = 'd8f2d996-53f4-0d49-2b4a-3e7601740c18';
        this.refundAddOperation = 'a6998041-52b6-0a29-30cf-3e7800b26949';
        this.refundModifyOperation = '88c79a35-f915-473d-b8c3-a77500185b8c';
        this.refundReadOperation = '18525e79-8689-4e57-9f1f-a77500182f04';

        //消息
        this.messageReadOperation = '2270a7a2-9649-47ec-a544-a75100babc4d';
        this.allMessageReadModifyOperation = '3543d6c8-fd9e-0e7b-326c-3e5c0044b919';//消息批量阅读

        //意见和反馈
        this.feedbackWriteOperation = 'e4295a73-e8eb-0877-0e3f-3c3501ceb312';
        
        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}