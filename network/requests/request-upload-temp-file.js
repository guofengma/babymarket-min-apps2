import Request from '../base-requests/request'
import Network from '../network'
import Tool from '../../tools/tool'

export default class RequestUploadTempFile extends Request {

    constructor(imageUrl) {
        super({});
        this.baseUrl = Network.sharedInstance().writeURL;
        this.imageUrl = imageUrl;
    }

    //拼接body
    body() {
        let base64 = Tool.convertImgToBase64(this.imageUrl);
        this._body = base64;
        this.bodyParam = base64;
        return this._body;
    }
}