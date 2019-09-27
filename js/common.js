var baseUrl= 'http://49.235.145.4:81';
// 获取url中传递的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function getCode() {
    var codeNum= false;
    var time= 60;
    var clearId; 
    var mobile= $('.formItem .mobile').val();
    if(mobile == ''){ //验证手机号码
        layer.msg('请输入手机号码');
        return;
    }else if(!(/^(13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9])\d{8}$/.test(mobile))) {
        layer.msg('请填写正确的手机号码');
        return;
    }else {
        $('.formItem .getCodeBtn').attr('disabled',"true");
        clearId= setInterval(timeDown,1000);
        $.ajax({
            type: 'post',
            url: baseUrl+'/api/sms/getCode',
            data: {"phone":mobile},
            success: function(res) {
                if(res.code == '500') {
                    layer.msg(res.msg);
                    codeNum= true;
                }else if(res.code == '200') {
                    $('.formItem .getCodeBtn').text(time+'s再获取');
                }
            }
        })
        // 倒计时函数
        function timeDown() {
            if(codeNum == false) {
                if(time == 0) {
                    $('.formItem>.getCodeBtn').removeAttr('disabled');
                    $('.formItem>.getCodeBtn').text('获取验证码');
                    clearInterval(clearId);
                    time= 60
               }else {
                    time--
                    $('.formItem>.getCodeBtn').text(time+'s再获取');
               }
            }else {
                $('.formItem>.getCodeBtn').removeAttr('disabled');
                $('.formItem>.getCodeBtn').text('获取验证码');
                clearInterval(clearId);
            }
        }
    }
    
}


/* --------------文件上传----------------- */
function uploadFile(inputEle,containerEle) {
    fs= inputEle[0].files[0];
    var reads= new FileReader();
    var base64Img;
    reads.readAsDataURL(fs);
    reads.onload=function (e) {
        base64Img= e.target.result;
        base64Img= base64Img.replace(/data:image\/jpeg;base64,/,'');
        console.log(base64Img)
        // var targetSrc = this.result;
        // containerEle.find('.showImg').attr('src',targetSrc);  
        // containerEle.removeClass('uploadIcon');
        layer.load(2)      
    };
    var formData= new FormData();
    formData.append('file',fs);
    $.ajax({
        url: baseUrl+'/api/common/uploadImg',
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: {'base64String':base64Img},
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (res) {
            if(res.code == 0) {
                layer.closeAll('loading')
                containerEle.find('.showImg').attr('src',res.data);
            }else {
                layer.msg(res.msg);
            }
        }
    })
}


/* --------------办理区域----------------- */
$('.zoomList').on('click','li',function(e){
    $(this).addClass('checkedItem').siblings('li').removeClass('checkedItem');
})


