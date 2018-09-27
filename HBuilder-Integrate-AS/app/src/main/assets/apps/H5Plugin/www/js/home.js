mui.init({
    swipeBack: true, //启用右滑关闭功能
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            callback: pulldownRefresh
        },
        up: {
            contentrefresh: '正在加载...',
            callback: pullupRefresh
        }
    }
});

//切换底部tab
var makeMoneySwiperObj;

mui.plusReady(function() {
    //红包左右晃动
    setInterval(function() {
        gaibian();
    }, 500);
    //系统参数接口
    initData();
    //用户信息接口
    loginByToken();
    //首页接口
    mainPageInit();
    
    $(".mui-bar-tab .mui-tab-item").on("touchstart", function() {
	    var index = $(this).index();
	    $(".mui-bar-tab .mui-tab-item").removeClass("mui-active");
	    $(this).addClass("mui-active");
	    $("#tabContent>.mui-control-content").removeClass("mui-active");
	    $("#tabContent>.mui-control-content").eq(index).addClass("mui-active");
	
	    if (index == 0) {
	        if (swiper) {
	            swiper.destroy();
	        }
	
	        swiper = new Swiper('.top-swiper-container', {
	            direction: 'vertical',
	            loop: true,
	            autoplay: true
	        });
	    } else if (index == 1) {
	    		//初始化
	    		moneyPageInit();
	        if (makeMoneySwiperObj) {
	            makeMoneySwiperObj.destroy();
	        }
	
	        makeMoneySwiperObj = new Swiper('.getMoney-swiper-container', {
	            direction: 'vertical',
	            loop: true,
	            autoplay: true
	        });
	
	        //赚钱的无限
	        mui("#slider1").slider({
	            interval: 5000
	        });
	
	    }else if(index == 2){
	    		var height = plus.display.resolutionHeight;
	    		//alert(height);
	    		$("#tabbar-with-contact").css("height",  height);
	    		//发现
	    		pulldownRefresh();
	    }else if(index == 3){
	    		//我的页面
	    		myTabInit();
	    		

	    }
	
	});

});

//我的页面 初始化
function myTabInit(){
	var headPic = myStorage.getItem("headPic");
	console.log(headPic);
	if(headPic){
		$(".my_head").attr("src", headPic);
	};
	//我的页面 绑定手机
	var user = myStorage.getItem("user");
	if(user){
		$(".my_phone").html(user.mobile);
		
		if(user.isPayFee){
			//已经付费
			$(".goCreditClass").html("￥"+wallet.balance);
			$(".goCreditClass").addClass("balance_css");
			$(".goCreditClass").removeClass("top-badge");
		}else{
			$(".goCreditClass").html("去评估");
			$(".goCreditClass").addClass("top-badge");
			$(".goCreditClass").removeClass("balance_css");
		}
	}
	//我的页面 绑定
	var wallet = myStorage.getItem("wallet");
	if(wallet){
		if(parseInt(wallet.balance) <= 0){
			$(".goMakeMoneyClass").html("去赚钱");
			$(".goMakeMoneyClass").addClass("top-badge");
			$(".goMakeMoneyClass").removeClass("balance_css");
			
			
		}else{
			$(".goMakeMoneyClass").html("￥"+wallet.balance);
			$(".goMakeMoneyClass").addClass("balance_css");
			$(".goMakeMoneyClass").removeClass("top-badge");
		}
		
	}
}

//设置页面返回的时候 更新
function updateMyTab(){
	myTabInit();
}

window.addEventListener('updateFunc',function(event){
	updateMyTab();
});

//我的页面 去评估
$(".goCreditClass").click(function(){
	if ($(".goCreditClass").html() == "去评估"){
		apply();
		return false;
	}else{
		return true;
	}
	
})

//申请借款
$(".applyMoneyBtn").click(function(){
	
	if(myStorage && myStorage.getItem("user")){
		var user = myStorage.getItem("user");
		
		if(user.isPayFee){
			//已经付费
			mui.openWindow({
		        url: "recommand.html",
		        id: "recommand.html",
		        waiting: {
		            autoShow: false
		        }
		    })
		}else{
			apply();
		}
	}
})

//去赚钱 跳转到 赚钱页面
$(".goMakeMoneyClass").click(function(){
	if ($(".goMakeMoneyClass").html() == "去赚钱"){
		goToMakeMoneyTab();
		return false;
	}else{
		return true;
	}
	
})
//通过token 登录
function loginByToken(){
	if(myStorage && myStorage.getItem("userToken")){
		
		var params = {
			token: myStorage.getItem("userToken")
		}
		Global.commonAjax(
			{
				url: "app/login/token",
				method: "POST",
				data: params
			},
			function (data){
				//广告
				if(data.toFindAd){
					//有新口子 
					myStorage.setItem("toFindAd", data.toFindAd);
					$('.selfModal .modal-dialog .modal-content .conten_bg')
									.attr("src", data.toFindAd.picUrl);
				}else{
					$('.selfModal').addClass('hideClass');
				}
                //用户个人信息
                myStorage.setItem("user", data.user);
                //用户属性信息
                myStorage.setItem("userInfo", data.userInfo);
                //钱包
                myStorage.setItem("wallet", data.wallet);
                //token
                myStorage.setItem("userToken", data.userToken);
			},
			function (error){
				
			}
		);
	}
}

//调用系统参数
function initData() {
    Global.commonAjax({
            url: "sys/latest/syscfg"
        },
        function(data) {
            myStorage.setItem("highestDegree", data.highestDegree);
            myStorage.setItem("maritalStatus", data.maritalStatus);
            myStorage.setItem("houseStatus", data.houseStatus);
            myStorage.setItem("loansStatus", data.loansStatus);
            //录入基本信息返现金额
			myStorage.setItem("inputBaseInfoReturn", data.inputBaseInfoReturn);
			//录入身份证返现金额
            myStorage.setItem("inputIdInfoReturn", data.inputIdInfoReturn);
            //被邀请人返现金额
            myStorage.setItem("inviteeFee", data.inviteeFee);
            //邀请人返现金额
            myStorage.setItem("inviterFee", data.inviterFee);
            //完成支付的返现金额
            myStorage.setItem("payReturn", data.payReturn);
        },
        function(err){
            console.log(err)
        }
    )
}

//首页初始化信息
function mainPageInit() {
    Global.commonAjax({ url: 'page/mainpage/init' },
        function(data) {
            setGetMoneyBanner(data.bannerList);
            $(".msg_cnt").html(data.unReadMsg);
        }
    )
}




//底部分享数据变量
var shareData = {};
//初始化 赚钱接口数据
var miniApplyAmount = 50;
//赚钱 初始化
function moneyPageInit() {
    Global.commonAjax({ url: "page/moneypage/init" },
        function(data) {
        		//邀请人数 任务奖励 余额
        		if(data && data.userInvite){
        			$(".invitationCount").html(data.userInvite.invitationCount);
            		$(".invitationBalance").html(data.userInvite.invitationBalance);
        		}else{
        			$(".invitationCount").html("0");
            		$(".invitationBalance").html("0");
        		}
        		//余额
        		if (data && data.miniApplyAmount){
        			miniApplyAmount = data.miniApplyAmount;
        			if(myStorage && myStorage.getItem("wallet")){
        				//可用余额
        				$(".balance").html(parseInt(myStorage.getItem("wallet").balance)+"");
        			}
        			
        		}else{
        			$(".balance").html("0");
        		}
            //底部无限滚动
            //如果付费了 隐藏
            if(myStorage && myStorage.getItem("user")){
            		var user = myStorage.getItem("user");
            		if(user.isPayFee){
            			//已经付费了
            			$("#slider1").addClass("hideClass");
            		}
            }
            if(data && data.newbieTaskBanner){
            		newbieTaskBanner(data.newbieTaskBanner);
            }
            //顶部 邀请好友 和 自己 所得奖励
            if(data && data.topAd){
            		$(".get_money_top_ad").attr("src", data.topAd.picUrl);
            }
            
        },
        function(err){
            console.log(err);
        }
    );
    
    //获取底部分享
    Global.commonAjax(
		{
			url: "user/sharelist?isShowPic=false"
		},
		function(data){
			//底部分享数据
			if(data){
				shareData = data;
			}
		},
		function(err){
		}
	)
}

//查询类型：HISTORY（查询历史浏览记录） TIME （根据期间） DEGREE: 高成功率 
var currentType = "DEGREE";
//当前查询  页数
var current = 1;
//根据期限查询是，是否倒序
var isDes = false;
//高成功率点击
$('.highType').click(function() {
    $('.highType').css('color', '#ff5445');
    $('.timeType').css('color', '#333333');
    $('.preType').css('color', '#333333');
    currentType = 'DEGREE';
    current = 1;
    isDes = false;
    pulldownRefresh();
})

//期限点击
$('.timeType').click(function() {
    $('.highType').css('color', '#333333');
    $('.timeType').css('color', '#ff5445');
    $('.preType').css('color', '#333333');
    if (currentType == 'TIME') {
        //当前期限
        isDes = !isDes;
    }
    
    currentType = 'TIME';
    current = 1;
    pulldownRefresh();
})

//上次浏览点击
$('.preType').click(function() {
    $('.highType').css('color', '#333333');
    $('.timeType').css('color', '#333333');
    $('.preType').css('color', '#ff5445');
    
    currentType = 'HISTORY';
    current = 1;
    isDes = false;
    pulldownRefresh();
});

//列表点击 埋点
$('body').on('click', '.mui-table-view-condensed li .mui-slider-cell', function() {
    var goodsCode = $(this).data("goodscode");
    //alert(goodsCode);
		var params = {
			goodsCode: goodsCode
		}
       Global.commonAjax(
           { 
               url: "goods/click",
               data: params,
               method: "POST"
            },
           function(data) {

           },
           function(err) {

           }
       )
});

//发现列表
function payedGoodslist(refreshType){
	var params = {
		queryType: currentType,
       size: 20,
       current: current,
       isDes: isDes
	}
	Global.commonAjax({
               url: "goods/findpage/goodslist",
               data: params,
               method: "POST"
           },
           function(data) {
           		if(data.current >= data.pages){
					if(data.current == 1){
						//空数据
						Global.errorNews();
					}else{
						//没有更多数据了
						setRefreshData(refreshType, data.records, true);
					}
				}else{
					setRefreshData(refreshType, data.records, false);
				}
           },
           function(err) {
                console.log(err);
           }
       )
}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
    current = 1;
    payedGoodslist(0);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	current++;
    payedGoodslist(1);
}

/**
 * 上拉加载具体业务实现 refreshType 0 下拉刷新
 */
function setRefreshData(refreshType, cells, isAll) {

    //当前点击的 数据下标
    var index = 0;
    var table = document.body.querySelector('.mui-table-view-condensed');

    if (refreshType == 0) {
        //下拉刷新
        table.innerHTML = "";
    } else {
        //加载更多
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(isAll); //参数为true代表没有更多数据了。
        var preList = document.body.querySelectorAll('.mui-table-view-cell-item');
        index = preList == null ? 0 : preList.length;
    }

    for (var i = 0, len = cells.length; i < len; i++) {
        var li = document.createElement('li');
        var item = cells[i];
        li.className = 'mui-table-view-cell mui-table-view-cell-item';
        li.innerHTML = '<div class="mui-slider-cell" data-goodscode="' + item.goodsCode + '">' +
            '<div class="oa-contact-cell mui-table">' +
            '<div class="oa-contact-avatar mui-table-cell">' +
            '<img src="' + item.goodsPic + '" />' +
            '</div>' +
            '<div class="oa-contact-content mui-table-cell">' +
            '<div class="mui-clearfix">' + item.goodsName +
            '</div>' +
            '<p>' +
            '<span>期限：' + item.loanDay + '</span>' +
            '<span>额度：' + item.loanAmount + '</span>' +
            '</p>' +
            '<span class="mui-icon mui-icon-arrowright"></span>' +
            '</div>' +
            '</div>' +
            '<div class="bottom">' + item.goodsTitle + '</div></div>';
        table.appendChild(li);
        index += 1;
    }

    if (refreshType == 0) {
        //下拉刷新
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    } else {
        //上拉加载

    }
}

//设置借款底部的 无限轮播
function setGetMoneyBanner(listData) {
    var html = "";
    var length = listData.length;
    if (listData && listData.length > 0) {
        //无限轮播要求  前面加一个节点
        html = '<div class="mui-slider-item mui-slider-item-duplicate">' +
            '<a href="#">' +
            '<img src="' + listData[length - 1].picUrl + '" class="bottom_slider"> ' +
            '</a>' +
            '</div>';
        for (var i = 0; i < length; i++) {
            html += '<div class="mui-slider-item">' +
                '<a href="#">' +
                '<img src="' + listData[i].picUrl + '" class="bottom_slider" data-url="' + listData[i].adValue + '">' +
                '</a></div>';
        }
        //无限轮播要求  最后加一个节点
        html += '<div class="mui-slider-item mui-slider-item-duplicate">' +
            '<a href="#">' +
            '<img src="' + listData[0].picUrl + '" class="bottom_slider"> ' +
            '</a>' +
            '</div>';

        $(".getMoneyLoop").append(html);

        $(".bottom_slider").click(function() {
            var that = $(this);
            mui.openWindow({
                url: 'webview.html',
                id: 'webview.html?url=' + that.data("url"),
                waiting: {
                    autoShow: false
                }
            })
        })
    }
}

//红包无限晃动
var hongbaoFlag = 0;

function gaibian() {
    if (hongbaoFlag == 0) {
        hongbaoFlag = 1;
        $(".hongbao_gif").removeClass("zhuan_left");
        $(".hongbao_gif").addClass("zhuan_right");
    } else {
        hongbaoFlag = 0;
        $(".hongbao_gif").addClass("zhuan_left");
        $(".hongbao_gif").removeClass("zhuan_right");
    }

}

//无限轮播
var slider = mui("#slider").slider({
    interval: 5000
});

//申请贷款			
function apply() {
       Global.commonAjax({ url: "user/input/status" },
           function(data) {
               var url = "";
               if(data){
               		if(data.isInputIdcard == "N"){
               			url = "identificateFirst.html";
               		}else if(data.isInputDetail == "N"){
               			url = "personInfo.html";
               		}else if(data.isPay == "N"){
               			url = "credit.html";
               		}else{
               			url = "recommand.html";
               		}
               }
               mui.openWindow({
			        url: url,
			        id: url,
			        waiting: {
			            autoShow: false
			        }
			    })
               
           },
           function(err) {
				mui.toast(err.msg);
           }
       );

}


$(".mui-input-range input").each(function() {
    range($(this));
});

//滑块
function range($obj) {
    var leftValue = $obj.val();
    var width = 100 * leftValue / $obj.attr("max") + "%";
    //mui.toast(leftValue)

    $obj.prev().css("width", width);
    setTimeout(function() {
        if (leftValue == "0") {
            $(".money_rate").html("0.5");
        }
    }, 10);

}

//申请额度
$("#edu").on("input", function() {
    range($(this));
    $(".money").html($(this).val());
});

//借款周期
$("#jiekuan").on("input", function() {
    range($(this));
    if ($(this).val() == "0") {
        $(".content_time").html("15天");
    } else {
        $(".content_time").html($(this).val() + "个月");
    }

});

//借款顶部 无限上下翻滚
var swiper;
getMoneySwiper();

function getMoneySwiper() {
    var html = '<div class="swiper-wrapper">';
    for (var i = 0; i < 5; i++) {
        html += '<div class="swiper-slide">尾号' + Math.floor(Math.random() * 1000 + 2000) + '的用户成功提现 ' + Math.floor(Math.random() * 1000 + 1000) + ' 元</div>';
    };
    html += '</div>';
    $(".top-swiper-container").append(html);


    swiper = new Swiper('.top-swiper-container', {
        direction: 'vertical',
        loop: true,
        autoplay: true
    });
}




//tab切换  赚钱无限上下滚动
makeMoneySwiper();

function makeMoneySwiper() {
    var html = '<div class="swiper-wrapper">';
    for (var i = 0; i < 5; i++) {
        html += '<div class="swiper-slide">136****' + Math.floor(Math.random() * 1000 + 2000) + '成功提现 ' + Math.floor(Math.random() * 1000 + 100) + ' 元</div>';
    };
    html += '</div>';
    $(".getMoney-swiper-container").append(html);

}


$(".invitationCount").html("789");
$(".invitationBalance").html("456");
$(".balance").html("123");


//赚钱无限轮播
function newbieTaskBanner(listData) {
    var html = "";
    var length = listData.length;
    if (listData && listData.length > 0) {
        //无限轮播要求  前面加一个节点
        html = '<div class="mui-slider-item mui-slider-item-duplicate">' +
            '<a href="#">' +
            '<img src="' + listData[length - 1].picUrl + '" class="make_money_bottom_slider"> ' +
            '</a>' +
            '</div>';
        for (var i = 0; i < length; i++) {
            html += '<div class="mui-slider-item">' +
                '<a href="#">' +
                '<img src="' + listData[i].picUrl + '" class="make_money_bottom_slider" data-url="' + listData[i].adValue + '">' +
                '</a></div>';
        }
        //无限轮播要求  最后加一个节点
        html += '<div class="mui-slider-item mui-slider-item-duplicate">' +
            '<a href="#">' +
            '<img src="' + listData[0].picUrl + '" class="make_money_bottom_slider"> ' +
            '</a>' +
            '</div>';

        $(".makeMoneyLoop").append(html);

        $(".make_money_bottom_slider").click(function() {
            var that = $(this);
            mui.openWindow({
                url: 'webview.html',
                id: 'webview.html?url=' + that.data("url"),
                waiting: {
                    autoShow: false
                }
            })
        })
    }
}

//分享底部弹窗
/**
 *  shareData {description   iconUrl  linkUrl  title}
 */
//分享到各个平台的点击事件
$(".wx_wrap").click(function() {
    if(shareData){
    		mui.toast(JSON.stringify(shareData.wx));
    }
})
$(".wx_friend_wrap").click(function() {
    if(shareData){
    		mui.toast(JSON.stringify(shareData.pyq));
    }
})
$(".qq_wrap").click(function() {
    if(shareData){
    		mui.toast(JSON.stringify(shareData.qq));
    }
})
$(".copy_wrap").click(function() {
    if(shareData){
    		if(mui.os.ios){			//ios			
    			var UIPasteboard = plus.ios.importClass("UIPasteboard");		    
    			var generalPasteboard = UIPasteboard.generalPasteboard();		    
    			//设置/获取文本内容:		    
    			generalPasteboard.plusCallMethod({		        
    				setValue:shareData.link,		        
    				forPasteboardType: "public.utf8-plain-text"		    
    			});		    
    			generalPasteboard.plusCallMethod({		        
    				valueForPasteboardType: "public.utf8-plain-text"		    
    			});		
    		}else{			
    			//安卓			
    			var context = plus.android.importClass("android.content.Context");		  	
    			var main = plus.android.runtimeMainActivity();		  	
    			var clip = main.getSystemService(context.CLIPBOARD_SERVICE);		  	
    			plus.android.invoke(clip,"setText",shareData.link);		
    		}

    		mui.toast(JSON.stringify(shareData.link));
    }
})



//设置中心
function goToSetting() {
    mui.openWindow({
        url: 'setting.html',
        id: 'setting.html',
        waiting: {
            autoShow: false
        }
    })
}

//关于我们
function goToAbout() {
    mui.openWindow({
        url: 'about.html',
        id: 'about.html',
        waiting: {
            autoShow: false
        }
    })
}

//消息中心
function goToMessage() {
    mui.openWindow({
        url: 'message.html',
        id: 'message.html',
        waiting: {
            autoShow: false
        }
    })
}

//钱包 goToWallet
function goToWallet() {

    mui.openWindow({
        url: 'wallet.html',
        id: 'wallet.html',
        waiting: {
            autoShow: false
        },
        extras:{
        		miniApplyAmount: miniApplyAmount
        }
    })
}

//分享页面
function sharePage() {
    mui.openWindow({
        url: 'share.html',
        id: 'share.html',
        waiting: {
            autoShow: false
        }
    })
}

//提现金额 openGetMoney
function openGetMoney() {
    mui.openWindow({
        url: 'wallet.html',
        id: 'wallet.html',
        waiting: {
            autoShow: false
        },
        extras:{
        		miniApplyAmount: miniApplyAmount
        }
    })
}


//关闭新口子	
function closeDialg() {
    $('.selfModal').addClass('hideClass');
}

//去发现tab
function goToFindTab() {
    console.log("00000")
        //$('.tabbar-with-contact').addClass('mui-active');
    closeDialg();
    // mui.toast("9999999")
    mui.trigger($('.mui-tab-item').eq(2)[0], 'touchstart');
    mui.trigger($('.mui-tab-item').eq(2)[0], 'tap')
}

//去赚钱tab
function goToMakeMoneyTab() {
    mui.trigger($('.mui-tab-item').eq(1)[0], 'touchstart');
    mui.trigger($('.mui-tab-item').eq(1)[0], 'tap')
}

//邀请好友 弹出浮层
function invaliteFriend() {
	Global.commonAjax(
		{
			url: "user/sharelist?isShowPic=true"
		},
		function(data){
			$('.inviteModal').removeClass('hideClass');
			if(data && data.adUrl){
				$(".invalite_bg").attr("src", data.adUrl);
				shareData = data;
			}
			
		},
		function(err){
		}
	)
    

}

//关闭邀请好友 弹出浮层
function closeInviteDialg() {
    $('.inviteModal').addClass('hideClass');
}

//借款 底部无限轮播 点击
function jumpWeb() {
    plus.webview.create("webview.html", "", {
        bottom: "0px"
    }); //新的页面地址 
}