import Request from '../base-requests/request'
import Network from '../network'
import Operation from '../operation'
import Tool from '../../tools/tool'

export default class RequestAddPay extends Request {

    constructor(tableParams) {
        super({});
        this.baseUrl = Network.sharedInstance().payURL;
        this.status = Network.sharedInstance().statusNew;
        this.operation = Operation.sharedInstance().addWeiXinPayOperation;
        this.table = 'WeixinPayOrder';
        this.tableParams = tableParams;
        this.urlParam = {
            "account": '',
        };
    }

    setup(param) {
        //操作字段
        let op = param['Operation'];
        if (Tool.isValidStr(op)) {
            this.operation = op;
            delete param.Operation;
        }

        let operationKey = '';
        if (this.status === Network.sharedInstance().statusNew) {
            operationKey = 'AddOperationId';
        }

        let dict = {};

        let relevancyKey = '-Relevancy#' + this.table + '(Attachment)';

        dict = {
            Data:
            {
                EntityName: this.table,
                Status: this.status,
                Items: param,
                Relevancies: {
                }
            }
        };
        dict[operationKey] = this.operation;

        //没有附件
        if (Tool.isEmptyArr(this.relevancies)) {
            delete dict.Data.Relevancies;
        }
        //有附件
        else {
            dict.Data.Relevancies[relevancyKey] = this.relevancies;
        }

        return dict;
    }

    //拼接body
    body() {
        let items = [];
        if (this.tableParams instanceof Array) {
            this.tableParams.forEach((item) => {
                items.push(this.setup(item));
            });
        }
        else {
            items.push(this.setup(this.tableParams));
        }
        this._body = { Items: items };
        this.bodyParam = this._body;
        return this._body;
    }
}