var Global = {};

(function() {

    Global = {
        showLoading: function() {
            if ($("#ShowLoading").length == 0) {
                $("body").append("<div id='ShowLoading' style='width:100%;height:100%;background:rgba(0,0,0,0.5);display:table;position: absolute;left:0;top:0;z-index:1000000;'><div style='width:100%;text-align:center;vertical-align:middle;display: table-cell;'><img src='../images/loading.gif'/></div></div>");
            }
        },
        hideLoading: function() {
            $("#ShowLoading").remove();
        },
        error500: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/500.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'error500.html',
                id: 'error500.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        error404: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/404.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'error404.html',
                id: 'error404.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        errorNet: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/wangluo.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'errornet.html',
                id: 'errornet.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        errorDetail: function() {
            $(".mui-content").html('<div class="error-col"><img src="../images/error/tixian.png"/></div>');
        },
        errorNews: function() {
            $(".mui-content").html('<div class="error-col"><img src="../images/error/xiaoxi.png"/></div>');

        },
        showModal: function(title, reload, callback) {
            if ($('.global-modal').length == 0 || reload) {


                // var html = '<div class="global-modal modal-mask row"><div class="modal-dialog"><img src="../images/close_icon.png" class="closeDialg" /><div class="modal-content"><div class="dialog_title">'
                // 			+title+'</div><div class="dialog_content">'+msg+
                // 			'</div></div></div></div>';

                var html = '<div class="global-modal modal-mask row"><div class="modal-dialog"><img src="../images/close_icon.png" class="closeDialg" /><div class="modal-content">' +
                    title + '</div></div></div>';
                $(document.body).append(html);
            } else {
                $('.global-modal').removeClass("hideClass");
            }

            $('.closeDialg').click(function() {
                if (callback) {
                    callback();
                } else {
                    $('.global-modal').addClass("hideClass");
                }

            });


        },
        hideModal: function() {
            $('.global-modal').addClass("hideClass");
        },
        isShowModal: function() {
            var isClose = ($('.global-modal').length == 0) || $('.global-modal').hasClass("hideClass");
            console.log($('.global-modal').length)
            return !isClose;
        },
        //网络请求
        commonAjax: function(params, callback, errorback) {
            var baseUrl = "http://app.dev.xianghq.cn/api/";
            //应用版本号
//          var appVersion = plus.runtime.version;
//          //设备唯一标识
//          var deviceId = plus.device.uuid;
//          //系统的版本信息
//          var osVersion = plus.os.version;
//
//          var appType = plus.os.name;
            var appName = "xhq";

            appVersion = "1.0.0";
            //设备唯一标识
            var deviceId = "129404038389203";
            //系统的版本信息
            var osVersion = "android 5.1";

            var appType = "ANDROID";

            //默认 get请求
            if (!params.method) {
                params.method = "GET";
            } else {
                params.method = "POST";
            }
			
            mui.ajax(baseUrl + params.url, {
                dataType: "json",
                type: params.method,
                data: params.data,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
                beforeSend: function(xhr) {
                    Global.showLoading();
                    xhr.setRequestHeader("deviceId", deviceId);
                    xhr.setRequestHeader("osVersion", osVersion);
                    xhr.setRequestHeader("appVersion", appVersion);
                    xhr.setRequestHeader("appType", appType);
                    xhr.setRequestHeader("appName", appName);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    var token = myStorage.getItem("userToken");
                    if (token) {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    };
                    Global.showLoading();
                },
                success: function(data) {
                		console.log(data);
                		if(data.code == "token.overdue"){
                			//token 过期
                			var curr = plus.webview.currentWebview();
                			var wvs=plus.webview.all();
					    for(var i=0;i<wvs.length;i++){
					    		if(wvs[i].getURL() == curr.getURL()){
					    			continue;
					    		}
					        plus.webview.close(wvs[i]); 
					    }
					    plus.webview.open('login.html');
					    if(myStorage){
					    		myStorage.clear();
					    }
					    curr.close();
					    
					    return;
                		}
                    if (data.code == "SUCCESS" || data.code == "OK" 
                    			|| data.code == "success" || data.code == "ok" ) {
                        callback(data.data);
                    } else {
                        errorback(data.msg);
                    }

                },
                error: function(data) {
                    console.log(data);
                    if(errorback){
                        errorback(data);
                    }
                      
                },
                complete: function(xhr, status) {
                		console.log(xhr);
                		console.log(status);
                    Global.hideLoading();
                   if (status == 'error') {
                       Global.error404();
                   } else if (status == 'timeout') {
                       Global.error500();
                   } else if(status != 'success'){
                       Global.errorNet();
                   }
                }
            });


        },
        GetQueryString: function(url, name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = url.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
	    getBase64Image: function(img, width, height) {
	      var canvas = document.createElement("canvas");
	      canvas.width = width ? width : img.width;
	      canvas.height = height ? height : img.height;
	      mui.toast("canvas.width"+canvas.width+"---canvas.height:--"+canvas.height)
	      var ctx = canvas.getContext("2d");
	      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	      var dataURL = canvas.toDataURL();
	      return dataURL;
	    },
	    
	    getCanvasBase64: function(img) {
	      var image = new Image();
	      //至关重要
	      image.crossOrigin = '';
	      image.src = img;
	      //至关重要
	      var deferred = $.Deferred();
	      if (img) {
	        image.onload = function () {
	          deferred.resolve(Global.getBase64Image(image));//将base64传给done上传处理
	        }
	        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
	      }
	    }

    }

    $(".mui-content").on("click", ".go-home", function() {
        console.log("跳转");
        mui.openWindow({
            url: 'home.html',
            id: 'home.html.html',
            waiting: {
                autoShow: false
            }
        })

    });

    //家里
    // $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://192.168.199.203:1337/vorlon.js'></script>");

    //公司
    $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://10.8.66.150:1337/vorlon.js'></script>");


}());