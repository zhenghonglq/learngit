(function(w){
    w.wrapDrag =function(wrap,callBack){
//		var wrap=document.getElementById('wrap');
//		var content=document. getElementById('content');
//		var content=wrap.children[1];
        var startY=0;
        var eleY=0;
        // 防抖动
        var startX=0;
        var isFirst=true;
        var isY=true;
        var disY=0;

        // 实现加速效果，定义6个变量
        var startValue=0;  // 初始位置
        var startTime=0;   // 初始时间
        var endValue=0;    // 结束位置
        var endTime=0;     // 结束时间
        var disValue=0;     // 距离差
        var disTime=1;      // 时间差
        var timer=0;
        //
        var Tween = {
            //中间状态 --- 匀速
            Linear: function(t,b,c,d){ return c*t/d + b; },

            //回弹
            easeOut: function(t,b,c,d,s){
                if (s == undefined) s = 5;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            }
        };

        wrap.addEventListener('touchstart',function(event){
            var touch=event.changedTouches[0];
            //即点即停;
            clearInterval(wrap.timer);
            // 清除过渡
            content.style.transition='0s';
            //
            disY=0;

            eleY=transformCss(content,'translateY');
            startY=touch.clientY;
            startX=touch.clientX;


//			startValue=eleY;
            startTime=new Date().getTime();
            if(callBack&&callBack['start']){
                callBack['start']()
            };

            isFirst=true;
            isY=true;
        });
        wrap.addEventListener('touchmove',function(){
            if(!isY){
                return
            };
            var touch=event.changedTouches[0];
            var nowY=touch.clientY;
            var nowX=touch.clientX;
            disY=nowY-startY;
            var disX=nowX-startX;
            var translateY=disY+eleY;

            if(isFirst){
                isFirst=false;
                if(Math.abs(disX)>Math.abs(disY)){
                    isY=false;
                    disY=0;
                }
            }


            var minY=wrap.clientHeight-content.offsetHeight;
            if(translateY>0){
                //					translateY=0;
                // 橡皮筋效果，利用页面中存在的变量虚拟一个比例系数；并且比例系数逐渐变小；
                var scale=1-translateY/document.documentElement.clientHeight;
                translateY=translateY*scale;
                transformCss(content,'translateY',translateY);

            }else if(translateY<minY){
                //					translateY=minY;
                // 右边的留白区域
                var over=minY-translateY;
                var scale=1-over/document.documentElement.clientHeight;
                translateY=minY-over*scale;
//				transformCss(content,'translateY',translateY);
            }


            transformCss(content,'translateY',translateY);

//			endValue=translateY;
            endTime=new Date().getTime();

            disTime=endTime-startTime;
//			disY=endValue-startValue;

            if(callBack&&callBack['move']){
                callBack['move']()
            };

        });

        wrap.addEventListener('touchend',function(){

            var speed=disY/disTime;
            var target=transformCss(content,'translateY')+speed*100;
            var minY=wrap.clientHeight-content.offsetHeight;
            // 范围限定，回弹效果；
//			var bezier = '';
            var type='Linear';
            if(target>0){
                target=0;
//				bezier = 'cubic-bezier(.08,1.65,.87,1.61)';
                type='easeOut';
            }else if(target<minY){
                target=minY;
                type='easeOut';
//				bezier = 'cubic-bezier(.08,1.65,.87,1.61)';
            }

//			content.style.transition='0.5s ' + bezier;
//			transformCss(content,'translateY',target);
            var time='1';
            moveTween(target,type,time)
            if(callBack&&callBack['over']){
                callBack['over']()
            };
            if(callBack&&callBack['end']){
                callBack['end']()
            };
        });

        function moveTween(target,type,time){
            //t  当前次数
            //b  初始位置
            //c  初始位置与目标位置的距离差
            //d  总次数
            //s  回弹效果（s越大回弹越远）
            //返回值     元素每一步的位置
            var t=0;
            var b= transformCss(content,'translateY');
            var c= target-b;
            var d= time/0.02;
            wrap.timer = setInterval (function(){
                t++
                if(t>d){
                    clearInterval(wrap.timer)
                    if(callBack&&callBack['end']){
                        callBack['end']()
                    };
                }else{
                    // 正常走
                    var point=Tween[type](t,b,c,d);
//					console.log(point)
                    transformCss(content,'translateY',point);
                    if(callBack&&callBack['move']){
                        callBack['move']()
                    };
                }
            },20);
        }
    };
})(window)
