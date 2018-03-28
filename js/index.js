function browserRedirect() {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
	    return 'phone';
	} else {
	    return 'pc';
	}
};

/*loading begin*/
var py_loading = {
	setting : {
		oldPage : '.wrapbg',
		newPage : '.newPage',
		loadBar : '.loadingBar',
		cell_mgr : 5,
		cell_n : 10
	},
	imgArry : [
		'http://image5.tuku.cn/pic/wallpaper/fengjing/chaodachicungaoqingmeitubizhi/034.jpg',
		'http://attach.bbs.miui.com/forum/201409/08/073311h67p66sccym6liy1.jpg',
		'http://img15.3lian.com/2015/f2/50/d/71.jpg',
		'images/bg.png',
		'images/music_disc.png',
		'images/music_pointer.png',
		'images/p1_bg.jpg',
		'images/p1_imooc.png',
		'images/p1_lantern.png',
		'images/p2_2016.png',
		'images/p2_bg.jpg',
		'images/p2_circle_inner.png',
		'images/p2_circle_middle.png',
		'images/p2_circle_outer.png',
		'images/p3_bg.jpg',
		'images/p3_blessing.png',
		'images/p3_couplet_first.png',
		'images/p3_couplet_second.png',
		'images/p3_logo.png',
		'images/p3_title.png',
		'images/pic.png'
	],
	init : function(){
		var me = this;
		me.oldPage =document.querySelector(me.setting.oldPage);
		me.newPage =document.querySelector(me.setting.newPage);
		me.bar =me.oldPage.querySelector(me.setting.loadBar);
		me.bar_son = me.bar.children[0];
		//me.bar_son.children[0].style.width = me.cell_w() + 'px';
		me.cellImg_n = me.finish_pic = 0;
		me.putCell();
	},
	cell_w : function(){
		var me = this;
		return (me.bar_son.clientWidth - (me.setting.cell_n - 1)*me.setting.cell_mgr)/me.setting.cell_n;
	},
	loadFinish : function(){
		var me = this;
		setTimeout(function(){
			var startBtn = me.oldPage.querySelector('.startBtn');
			var loadingWrap = me.oldPage.querySelector('.loadingWrap');
			startBtn.style.display = 'flex';
			loadingWrap.style.display = 'none';
			startBtn.addEventListener('touchend',function(){
				me.oldPage.style.display = 'none';
				me.newPage.style.width = '100%';
				me.newPage.style.height = '100%';
				pageScroll.init();
				audioPlay();
			},false);
			//me.oldPage.style.display = 'none';
			//me.newPage.style.display = 'block';
			//me.newPage.style.width = '100%';
			//me.newPage.style.height = '100%';

			var aPlayer = document.getElementById('audioPlayer');
			var audio = aPlayer.querySelector('audio');

			//pageScroll.init();

			//audioPlay();
			aPlayer.addEventListener('click',function(){
				audioPlay();
			},false);
			
			function audioPlay(){
				if(audio.paused){
					console.log('play');
					audio.play();
					aPlayer.querySelector('img').classList.remove('paused');
				}else{
					console.log('pause');
					aPlayer.querySelector('img').classList.add('paused');
					audio.pause();
				};
			};
			
			//aPlayer.onclick();
		},2000);
		
	},
	putCell : function(){
		var me = this;
		for(var i in me.imgArry){
			var img = new Image();
			img.src = me.imgArry[i];

			img.onload = function(){
				me.createI();
				console.log(me.finish_pic);
				if(me.finish_pic == me.imgArry.length){
					me.loadFinish();	
				};
				
			};
		};
	},
	createI : function(){
		var me = this;
		var last_i_n = me.i_n? me.i_n:0;
		me.cellImg_n += me.setting.cell_n/me.imgArry.length;
		me.i_n = Math.floor(me.cellImg_n);
		if(me.i_n - last_i_n > 0){
			for(var n=0;n<me.i_n - last_i_n;n++){
				var i = document.createElement('i');
				i.style.width = me.cell_w() + 'px';
				me.bar_son.appendChild(i);
			};	
		};
		me.finish_pic++;
	}
};
/*loading end*/

/*pageMove begin*/
var pageSlide = function(opts){
	this.settings = $.extend(true,pageSlide.prototype.d,opts||{});
	this.init();
};
pageSlide.prototype = {
	d : {
		selectors : {
			pageWrap : '[name="pageWrap"]',
			page : '.page'
		},
		index : 0,
		duration : 500,
		pageCrossLine : function(){
			console.log('开始动画');
		},
		pageTurned : function(){
			console.log('已翻页');
		}
	},
	init : function(){
		var me = this;
		me.index = me.settings.index;
		me.wrap = $(me.settings.selectors.pageWrap);
		me.page = me.wrap.find(me.settings.selectors.page);
		me.slidding = false;

		me.layout();
		me.touchFn();
	},
	layout : function(){
		var me = this;
		me.i = me.index = isNaN(me.index)||me.index<0||me.index>=me.page.length? 0:me.index;
		me.curPage();
		me.css3AnimateStart();
	},
	curPage : function(){
		var me = this;
		me.page.eq(me.index).addClass('cur').siblings().removeClass('cur');
	},
	sildeEnd : function(){
		var me = this;
		if(!me.slidding){
			me.slidding = true;
			setTimeout(function(){
				me.curPage();
				me.page.eq(me.i).removeClass('act');
				me.css3AnimateEnd();
				me.slidding = false;
				if(typeof me.settings.pageTurned === 'function'){
					me.settings.pageTurned();
				};
			},me.settings.duration)
			
		};
	},
	css3AnimateStart : function(){
		var me = this;
		me.page.eq(me.i).find('[animate="animate"]').addClass('animate');
		if(typeof me.settings.pageTurned === 'function'){
			me.settings.pageCrossLine();
		};
	},
	css3AnimateEnd : function(){
		var me = this;
		if(me.index != me.i){
			me.page.eq(me.i).find('[animate="animate"]').removeClass('animate');
		}else{
			me.page.eq(me.i).siblings().find('[animate="animate"]').removeClass('animate');
		};
	},
	indexLimit : function(i){
		var me = this;
		if(i < 0){
			i = me.page.length - 1;
		}else if(i > me.page.length - 1){
			i = 0;
		};
		return i;
	},
	dir_upDown : function(s){//判断滑动方向
		if(s > 0){//方向0
			return 0;
		}else{//方向1
			return 1;
		};
	},
	page_h : function(){
		return this.page.height();
	},
	move : function(obj,dis){
		obj.css({'transform':'translate3d(0,' + dis + 'px,0)'});
		obj.css({'-webkit-transform':'translate3d(0,' + dis + 'px,0)'});
	},
	touchFn : function(){
		var me = this;
		var init = {sx:0,sy:0,ex:0,ey:0,cx:0,cy:0};
		me.page_h = me.page_h();
		me.wrap.on('touchstart',function(e){
			if(me.slidding) return;
			//init.ex = init.sx = e.targetTouches[0].pageX;
			init.ey = init.sy = e.targetTouches[0].pageY;
		});
		me.wrap.on('touchmove',function(e){
			e.preventDefault();
			if(me.slidding){
				//init.ex = e.targetTouches[0].pageX;
				init.ey = init.sy = e.targetTouches[0].pageY;
				return;
			};
			init.ey = e.targetTouches[0].pageY;
			var cy = init.ey - init.sy;
			var distance = null;
			if(me.dir_upDown(cy) == 0){
				me.i = me.indexLimit(me.index - 1);
				distance = cy - me.page_h;
			}else{
				me.i = me.indexLimit(me.index + 1);
				distance = cy + me.page_h;
			};
			me.page.eq(me.i).addClass('act noTran').siblings().removeClass('act');

			if(Math.abs(cy) >= me.page_h/2){//滑动距离超过屏幕高一半执行动画
				me.css3AnimateStart();
			};

			me.move(me.page.eq(me.i),distance);
		});
		me.wrap.on('touchend',function(e){
			if(me.slidding) return;
			var cy = init.ey - init.sy;
			if(cy != 0){
				var distance = null;
				if(Math.abs(cy) > me.page_h/20){
					me.page.eq(me.index).addClass('lastOne').siblings().removeClass('lastOne');
					me.index = me.i;
					distance = 0;
					me.css3AnimateStart();
				}else if(Math.abs(cy) != 0){
					if(me.dir_upDown(cy) == 0){
						distance = - me.page_h;
					}else{
						distance = me.page_h;
					};
				};
				me.page.eq(me.i).removeClass('noTran');
				me.move(me.page.eq(me.i),distance);					
				me.sildeEnd();
			};
			
		});

	}
};

$.fn.pageSlide = function(opts){
	return this.each(function(){
		var me = $(this),
			instance = me.data('pageSlide');
		if(!instance){
			instance = new pageSlide(opts);
			me.data('pageSlide',instance);
		};
	});
};
/*pageMove end*/