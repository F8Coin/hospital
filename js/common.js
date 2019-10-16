// var baseUrl= 'http://49.235.145.4';
var baseUrl= 'http://yy.zgbafy.com';
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
            url: baseUrl+'/api/common/smsCode',
            data: {"mobile":mobile},
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
// function uploadFile(inputEle,containerEle) {
//     fs= inputEle[0].files[0];
//     var reads= new FileReader();
//     reads.readAsDataURL(fs);
//     reads.onload=function (e) {
//         base64Img= e.target.result;
//         layer.load(2)      
//     };
//     reads.onloadend= function() {
//         $.ajax({
//             url: baseUrl+'/api/common/uploadImg',
//             type: 'POST',
//             cache: false, //上传文件不需要缓存
//             data: {'base64String':base64Img},
//             // processData: false, // 告诉jQuery不要去处理发送的数据
//             // contentType: false, // 告诉jQuery不要去设置Content-Type请求头
//             success: function (res) {
//                 if(res.code == 0) {
//                     layer.closeAll('loading')
//                     containerEle.find('.showImg').attr('src',res.pic);
//                 }else {
//                     layer.msg(res.msg);
//                 }
//             }
//         })
//     } 
// }


/* -------------- 类型选择 ----------------- */
$('.zoomList').on('click','li',function(e){
    $(this).addClass('checkedItem').siblings('li').removeClass('checkedItem');
})


/* -------------- 提交订单 ----------------- */
function createOrder(orderPar,orderNo) {
    if(orderNo == "" || orderNo == "undefined" || orderNo == null) {
        $.ajax({
            url: baseUrl+'/api/appointment/add',
            type: 'POST',
            data: orderPar,
            success: function(res){
                if(res.code == 0) {
                    // 拿到订单id进入支付
                    if(res.orderNo) {
                        window.location.href= 'http://yy.zgbafy.com/api/wxpay/toPay?orderNo='+res.orderNo;
                    }else {
                        layer.msg(res.msg);
                    }
                }else {
                    layer.msg(res.msg);
                }
            },
            error: function(res) {
                layer.msg(res.msg);
            }
        })
    }else {
        window.location.href= 'http://yy.zgbafy.com/api/wxpay/toPay?orderNo='+orderNo;
    }
    
} 


/* -------------- 预约详情 ----------------- */ 
function applicationInfo(id) {
    $.ajax({
        url: baseUrl+'/api/appointment/'+id,
        type: 'get',
        success: function(res) {
            // 渲染订单详情
            var deliveryType; // 获取病历方式
            if(res.deliveryType == "01") { //自提
                deliveryType= "自提"
                $('#page4>.receiveInfo').css('display','none');

            }else if(res.deliveryType == "02") { //邮寄
                deliveryType= "邮寄"
                $('#page4>.receiveInfo').css('display','block');
                $('#page4>.receiveInfo>.content>.orderItem>.receiverName').text(res.receiverName);
                $('#page4>.receiveInfo>.content>.orderItem>.receiverTel').text(res.receiverMobile);
                $('#page4>.receiveInfo>.content>.orderItem>.receiverAdd').text(res.areaCity+res.address);
            }

            var papersType; // 证件类型
            if(res.appointmentType == "01") {
                papersType= "身份证"
                $('#page4>.orderInfo>.content>.uploadFile').css('display','none')
                $('#page4>.orderInfo>.content>.fileBoxType1').css('display','block')
                $('#page4>.orderInfo>.content>.fileBoxType1>.labContent>.paitentsID_up').attr('src',res.filePaths[0]);
                $('#page4>.orderInfo>.content>.fileBoxType1>.labContent>.paitentsID_down').attr('src',res.filePaths[1]);
                $('#page4>.orderInfo>.content>.fileBoxType1>.labContent>.pay_invoice').attr('src',res.filePaths[2]);
            }else if(res.appointmentType == "02") {
                papersType= "身份证(代办)"
                $('#page4>.orderInfo>.content>.uploadFile').css('display','none')
                $('#page4>.orderInfo>.content>.fileBoxType2').css('display','block')
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.agentID_up').attr('src',res.filePaths[0]);
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.agentID_down').attr('src',res.filePaths[1]);
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.agentID_hand').attr('src',res.filePaths[2]);
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.paitentsID_up').attr('src',res.filePaths[3]);
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.paitentsID_down').attr('src',res.filePaths[4]);
                $('#page4>.orderInfo>.content>.fileBoxType2>.labContent>.permitText').attr('src',res.filePaths[5]);

            }else if(res.appointmentType == "03") {
                papersType= "未成年(代办)";
                $('#page4>.orderInfo>.content>.uploadFile').css('display','none')
                $('#page4>.orderInfo>.content>.fileBoxType3').css('display','block')
                $('#page4>.orderInfo>.content>.fileBoxType3>.labContent>.houseBook_home').attr('src',res.filePaths[0]);
                $('#page4>.orderInfo>.content>.fileBoxType3>.labContent>.guardianID_up').attr('src',res.filePaths[1]);
                $('#page4>.orderInfo>.content>.fileBoxType3>.labContent>.pay_invoice').attr('src',res.filePaths[2]);
            }else if(res.appointmentType == "04") {
                papersType= "死亡(代办)"
                $('#page4>.orderInfo>.content>.uploadFile').css('display','none')
                $('#page4>.orderInfo>.content>.fileBoxType4').css('display','block')
                $('#page4>.orderInfo>.content>.fileBoxType4>.labContent>.death_prove').attr('src',res.filePaths[0]);
                $('#page4>.orderInfo>.content>.fileBoxType4>.labContent>.relation_prove').attr('src',res.filePaths[1]);
                $('#page4>.orderInfo>.content>.fileBoxType4>.labContent>.agentID_hand').attr('src',res.filePaths[2]);
                $('#page4>.orderInfo>.content>.fileBoxType4>.labContent>.agentID_up').attr('src',res.filePaths[3]);
                $('#page4>.orderInfo>.content>.fileBoxType4>.labContent>.agentID_down').attr('src',res.filePaths[4]);
            }

            if(res.note == '' || res.note == "undefined" || res.note == null) {
                $('#page4>.orderInfo>.content>.addTextBox').css('display','none');                
            }else {
                $('#page4>.orderInfo>.content>.orderItem>.addText').text(res.note);
            }
            


            var startDate= new Date(res.ryDate)
            startDate= startDate.getFullYear()+'-'+(startDate.getMonth()>10?startDate.getMonth():"0"+startDate.getMonth())+'-'+(startDate.getDate()>10?startDate.getDate():"0"+startDate.getDate());
            var endDate= new Date(res.cyDate)
            endDate= endDate.getFullYear()+'-'+(endDate.getMonth()>10?endDate.getMonth():"0"+endDate.getMonth())+'-'+(endDate.getDate()>10?endDate.getDate():"0"+endDate.getDate());
            if(startDate == '' || startDate === undefined || startDate == null) {
                $('#page4>.orderInfo>.content>.startTimeBox').css('display','none');
            }else {
                $('#page4>.orderInfo>.content>.orderItem>.startTime').text(startDate);
            }
            var typeList= (res.printContents).split(',');
            
            for (let i = 0; i < typeList.length; i++) {
                // console.log(typeList);
                var type= typeList[i];
                var typeItem= '<tr class="useItem">'+
                                 '<td class="type">'+type+'</td>'+
                                 '<td class="amount">'+'×' +res.printNum+'</td>'+
                              '</tr>'
                $('#selectTypeBox').append(typeItem);
            }
            $('#page4>.orderInfo>.content>.orderItem>.hospitalName').text(res.hospitalName);
            $('#page4>.orderInfo>.content>.orderItem>.receiveType').text(deliveryType);
            $('#page4>.orderInfo>.content>.orderItem>.bookTel').text(res.yyMobile);
            $('#page4>.orderInfo>.content>.orderItem>.name').text(res.patientName);
            $('#page4>.orderInfo>.content>.orderItem>.papersType').text(papersType);
            $('#page4>.orderInfo>.content>.orderItem>.papersNum').text(res.patientCard);
            $('#page4>.orderInfo>.content>.orderItem>.endTime').text(endDate);
            $('#page4>.orderInfo>.content>.orderItem>.hospitalNum').text(res.fprn);
            if(res.payStatus == "01") { // 待支付
                $('.paymentBox>.submitPay').css('display','block'); 
            }else if(res.payStatus == "02") { // 已支付
                $('.paymentBox>.submitPay').css('display','block');
                $('#payBtn').attr('disabled',true);
                $('#payBtn').unbind('click');
                $('#payBtn').text('已支付');
            }else if(res.payStatus == "03") { // 已支付预付款
                $('.paymentBox>.submitPay').css('display','block'); 
            }
        }
    })
}

/* -------------- 物流查询 ----------------- */ 
function getExpressInfo(id) {
    $.ajax({
        url: baseUrl+'/api/common/searchwuliu?id='+id,
        type: 'post',
        success: function(res) {
            // var expressType
            // if(res.type ==  "01") { //EMS
            //     expressType= "EMS";
            // }else if(res.type ==  "02") { //顺丰
            //     expressType= "顺丰";
            // }
            res= JSON.parse(res);
            if(res.Success) {
                $('#page4>.orderInfo>.content>.orderItem>.labTitle>.expressType').text(res.ShipperCode);
                for (let i = 0; i < res.Traces.length; i++) {
                    var expressItem= ' <span class="labContent expressInfoText">'+res.Traces[i].AcceptStation+' ( '+res.Traces[i].AcceptTime+' ) '+'</span> </br></br>'
                    $('#expressTextList').append(expressItem);
                }
            }
        }
    })       
}

function uploadFile(inputEle,containerEle){
	var file=inputEle[0].files[0];
	if (file.size > 10 * 1024 * 1024) {
        alert("上传文件大小不能超过10M");
        return;
    }
    setBase64(file,containerEle,toSend);
}
function setBase64(file,containerEle,fn){//图片文件转换为base64编码
	if(!window.FileReader){
		layer.msg('浏览器对FileReader方法不兼容');
		return;
	}
	var reader = new FileReader();
	reader.readAsDataURL(file);//读出 base64
	reader.onloadend = function (){
		imgCompress(reader,function(base64){
			typeof fn=="function" && fn(base64 || reader.result,containerEle )//base64
		});
	};
}
function imgCompress(reader,callback){//图片超过尺寸压缩
	var img=new Image();
    img.src=reader.result;
    img.onload=function(){
        layer.load(2); 
		var w = this.naturalWidth, h = this.naturalHeight, resizeW = 0, resizeH = 0;  
	    var maxSize = {
	        width: 1000,
	        height: 1000,
	        level: 0.5
	    };
      	if(w > maxSize.width || h > maxSize.height){
        	var multiple = Math.max(w / maxSize.width, h / maxSize.height);
        	resizeW = w / multiple;
        	resizeH = h / multiple;
      	}else{// 如果图片尺寸小于最大限制，则不压缩直接上传
        	return callback()
      	}
      	var canvas = document.createElement('canvas'),
      	ctx = canvas.getContext('2d');
    	canvas.width = resizeW;
    	canvas.height = resizeH;
    	ctx.drawImage(img, 0, 0, resizeW, resizeH);
      	var base64 = canvas.toDataURL('image/jpeg', maxSize.level); 
      	callback(base64);
	}
}
function toSend(result,containerEle){//传给后端result为处理好后的base64的字符串。
	$.ajax({
        url: baseUrl+'/api/common/uploadImg',
        type: 'POST',
        cache: false, //上传文件不需要缓存
        data: {'base64String':result},
        success: function (res) {
            if(res.code == 0) {
                layer.closeAll('loading')
                containerEle.find('.showImg').attr('src',res.pic);
            }else {
                layer.msg(res.msg);
            }
        }
    })
}



