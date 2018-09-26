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

//查询类型：HISTORY（查询历史浏览记录） TIME （根据期间） DEGREE: 高成功率 
var currentType = "";
//当前查询  页数
var current = 1;
//根据期限查询是，是否倒序
var isDes = false;
//高成功率点击
$('.highType').click(function() {
    $('.highType').css('color', '#ff5445');
    $('.timeType').css('color', '#333333');
    $('.preType').css('color', '#333333');
    pulldownRefresh();
    currentType = 'DEGREE';
    current = 1;
    isDes = false;
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
    pulldownRefresh();
    currentType = 'TIME';
    current = 1;
})

//上次浏览点击
$('.preType').click(function() {
    $('.highType').css('color', '#333333');
    $('.timeType').css('color', '#333333');
    $('.preType').css('color', '#ff5445');
    pulldownRefresh();
    currentType = 'HISTORY';
    current = 1;
    isDes = false;
});

//列表点击 埋点
$('body').on('click', '.mui-table-view-condensed li .mui-slider-cell', function() {
    var goodsCode = $(this).data("goodscode");
    alert(goodsCode);

    // Global.commonAjax(
    //     { 
    //         url: "goods/click",
    //         goodsCode: goodsCode
    //      },
    //     function(data) {

    //     },
    //     function(err) {

    //     }
    // )
});

pulldownRefresh();

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
    setTimeout(function() {
        var cells = [
            { goodsName: "借花花-借钱马上花", goodsTitle: "最快3分钟，可获10000借款~", goodsPic: "../images/faxian.png", loanAmount: "999", loanDay: '1~3月', goodsCode: "123" },
            { goodsName: "借花花-借钱马上花", goodsTitle: "最快3分钟，可获10000借款~", goodsPic: "../images/faxian.png", loanAmount: "999", loanDay: '1~3月', goodsCode: "123" },
            { goodsName: "借花花-借钱马上花", goodsTitle: "最快3分钟，可获10000借款~", goodsPic: "../images/faxian.png", loanAmount: "999", loanDay: '1~3月', goodsCode: "123" },
            { goodsName: "借花花-借钱马上花", goodsTitle: "最快3分钟，可获10000借款~", goodsPic: "../images/faxian.png", loanAmount: "999", loanDay: '1~3月', goodsCode: "123" }
        ];
        setRefreshData(0, cells, false);
        //refresh completed
    }, 1500);
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
    // Global.commonAjax({
    //         url: "goods/findpage/goodslist",
    //         queryType: currentType,
    //         size: 20,
    //         current: current,
    //         isDes: isDes
    //     },
    //     function(data) {
    //         var cells = data.records;
    //         setRefreshData(1, cells, data.current == data.pages);
    //     },
    //     function(err) {

    //     }
    // )
    setTimeout(function() {
        var cells = [{
                goodsName: "借花花-借钱马上花",
                goodsTitle: "最快3分钟，可获10000借款~",
                goodsPic: "../images/faxian.png",
                loanAmount: "999",
                loanDay: '1~3月',
                goodsCode: "123"
            },
            {
                goodsName: "借花花-借钱马上花",
                goodsTitle: "最快3分钟，可获10000借款~",
                goodsPic: "../images/faxian.png",
                loanAmount: "999",
                loanDay: '1~3月',
                goodsCode: "123"
            },
            {
                goodsName: "借花花-借钱马上花",
                goodsTitle: "最快3分钟，可获10000借款~",
                goodsPic: "../images/faxian.png",
                loanAmount: "999",
                loanDay: '1~3月',
                goodsCode: "123"
            },
            {
                goodsName: "借花花-借钱马上花",
                goodsTitle: "最快3分钟，可获10000借款~",
                goodsPic: "../images/faxian.png",
                loanAmount: "999",
                loanDay: '1~3月',
                goodsCode: "123"
            }
        ];
        setRefreshData(1, cells, false);

    }, 1500);
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



//首页初始化信息
function mainPageInit() {
    Global.commonAjax({ url: 'page/mainpage/init' },
        function(data) {
            setGetMoneyBanner(data.bannerList);
            $(".msg_cnt").html(data.unReadMsg);
        }
    )
}

//测试
$(".msg_cnt").html("12");
setGetMoneyBanner([
    { picUrl: '../images/banner1.jpg', adValue: "http://www.baidu.com" },
    { picUrl: '../images/86565.png', adValue: "http://www.taobao.com" },
    { picUrl: '../images/976.png', adValue: "http://www.jingdong.com" }
]);
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

//token登录
function loginUseToken() {
    var token = myStorage.getItem("token");
    if (token) {
        Global.commonAjax({
                url: 'login/' + token
            },
            function(data) {
                //广告
                myStorage.setItem("toFindAd", data.toFindAd);
                //用户个人信息
                myStorage.setItem("user", data.user);
                //用户属性信息
                myStorage.setItem("userInfo", data.userInfo);
                //钱包
                myStorage.setItem("wallet", data.wallet);
                //token
                myStorage.setItem("token", data.userToken);
            },
            function(err) {

            }
        )
    }
}


mui.plusReady(function() {
    //红包左右晃动
    setInterval(function() {
        gaibian();
    }, 500);
});

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
    // Global.commonAjax({ url: "user/input/status" },
    //     function(data) {
    //         var url = "";
    //         if (data && !data.isInputIdcard) {
    //             url = "identificateFirst.html";
    //         } else if (data && !data.isInputDetail) {
    //             url = "personInfo.html";
    //         } else if (data && !data.isPay) {
    //             url = "credit.html";
    //         } else {
    //             //智能推荐
    //             url = "credit.html";
    //         }
    //     },
    //     function(err) {

    //     }
    // );

    mui.openWindow({
        url: 'identificateFirst.html',
        id: 'identificateFirst.html',
        waiting: {
            autoShow: false
        }
    })

    //GET请求
    // Global.commonAjax({
    // 	url: "https://lhjz.2donghua.com/test.php"
    // }, function(data){
    // 	mui.toast(data);
    // }, function(err){
    // 	mui.toast(err);
    // })

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

//赚钱 初始化
function initMakeMoney() {
    Global.commonAjax({ url: "page/moneypage/init" },
        function(data) {
            $(".invitationCount").html(data.userInvite.invitationCount);
            $(".invitationBalance").html(data.userInvite.invitationBalance);
            var user = myStorage.getItem("user");
            if (user && user.wallet) {
                $(".balance").html(user.wallet.balance);
            }
        }
    )
}

//赚钱无限轮播
newbieTaskBanner([
    { picUrl: '../images/banner1.jpg', adValue: "http://www.baidu.com" },
    { picUrl: '../images/86565.png', adValue: "http://www.taobao.com" },
    { picUrl: '../images/976.png', adValue: "http://www.jingdong.com" }
]);

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


var makeMoneySwiperObj;
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

    }

});

//分享到各个平台的点击事件
$(".wx_wrap").click(function() {
    mui.toast("wx_wrap");
})
$(".wx_friend_wrap").click(function() {
    mui.toast("wx_friend_wrap");
})
$(".qq_wrap").click(function() {
    mui.toast("wx_qq_wrap");
})
$(".copy_wrap").click(function() {
    mui.toast("wx_copy_wrap");
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

//邀请好友 弹出浮层
function invaliteFriend() {
    $('.inviteModal').removeClass('hideClass');

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