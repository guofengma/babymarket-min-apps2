import Request from '../base-requests/request'
import Network from '../network'
import RequestStatus from "../base-requests/request-status";
import RequestQueue from "../base-requests/request-queue";


export default class RequestUploadTempFile extends Request {

    constructor(filePath) {
        super({});
        this.baseUrl = Network.sharedInstance().attatchmentWriteURL;
        this.filePath = filePath;
        this.name = '附件上传，获取临时Id';
    }

    start(){

        let that = this;
        this.body();
        this.url();
        this.requestStatus = RequestStatus.requesting;

        wx.uploadFile({
            url: this._url,
            filePath: this.filePath,
            name: 'file',
            success: function (res) {

                if (that.managerLoadingPrompt) {
                    global.Tool.hideLoading();
                }

                console.debug('<============================== 请求结束：' + that.name);
                console.debug('result:');
                console.debug(JSON.stringify(res.data));
                console.debug(res.data);
                console.debug('==============================\n\n\n');
                that.responseObject = res.data;

                if (res.statusCode == 200) {
                    var fileInfo = JSON.parse(res.data);
                    console.log(fileInfo);
                    let temporaryId = fileInfo.TemporaryId;//临时Id

                    //预处理，可以重新组织请求结果
                    that.preprocessCallback(that,temporaryId)
                    that.finishBlock(that,temporaryId)
                }
                else{
                    that.exception = '上传失败';

                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    global.Tool.showAlert('上传失败');
                    console.debug('请求出错');
                }
            },
            fail:function (res) {
                that.tryCount ++;

                console.debug('<============================== 请求结束：' + that.name + '第' + that.tryCount + '次请求');
                console.debug('==============================\n\n\n');
                //请求失败重试
                if (that.tryCount < that.maxTryCount) {
                    if (that.isManagedByQueue) {
                        that.addToQueue();
                    }
                    else{
                        that.start();
                    }
                }

                //达到重试上限，提示错误
                else
                {
                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    global.Tool.showAlert('请求失败，请稍后重试')
                }
            },
            complete:function () {
                that.requestStatus = RequestStatus.finish;
                that.completeBlock(that);

                if (that.isManagedByQueue) {
                    RequestQueue.removeRequest(that);
                }

                if (that.manageLoadingPrompt) {
                    global.Tool.hideLoading();
                }
            }
        });


        console.debug('------------------------------> 请求发起：' + that.name);

        console.debug('url: ' + this._url);
        console.debug('body:');
        console.debug(JSON.stringify(this._body));
        console.debug(this._body);
        console.debug('------------------------------\n\n\n');

        if (this.manageLoadingPrompt) {
            global.Tool.showLoading();
        }

        return this;
    }

}