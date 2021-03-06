
var new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","../js/md5.js");// 在这里引入了a.js
document.body.appendChild(new_element);

var load_element=document.createElement("script");
load_element.setAttribute("type","text/javascript");
load_element.setAttribute("src","../js/load.js");//XXX 这个在首页会报错 因为是同级的 但是其他二级页面也需要这个 所以还是写个绝对路径为好
document.body.appendChild(load_element);


	//XXX 服务器地址
	//var httpUrl = "http://api.huanqiujishi.com/";
	var httpUrl = "http://114.254.179.134/ujwt/public/api/";
	var urlPic = 'http://www.huanqiujishi.com/server/content/uploads/';
	var app_key = "9e304d4e8df1b74cfa009913198428ab";
	var v = "v1.0";
	var sign_method = "md5";
	var signConstant = "4f4f8dd219bbdde0ae6bbe02be217c3a";
	session_key = localStorage.getItem('session_key');
	
	//获取当前时间戳
	function getTimestamp(){
		return (Date.parse(new Date())/1000).toString();
	}
	//获取sign签名 
	function getSign(keyOptions){
		var sign = signConstant;
		var isFirst = false;
		for (var  key in keyOptions) {
			if (!isFirst) {
				sign = sign +key+'='+keyOptions[key];
				isFirst = true;
			}else {
				sign = sign + '&';
				sign = sign +key+'='+ keyOptions[key];
			}
		}
		sign = sign + signConstant;
		return sign;
	}
	//获取发送数据的
	 function getdata(options,apiName){
		var timestamp = getTimestamp();
		var sign = hex_md5(getSign(options));
		var data = {
			app_key:app_key,
			method:apiName,
			timestamp:timestamp,
			v:'v1.0',
			sign_method:'md5',
			session_key:session_key,
			sign:sign,
		};
		
		for (var key in options) {
			data[key] = options[key];
		}
		return data;
	}
	 
	function logData(data){
		console.log(JSON.stringify(data));
	}

	function getMessage(type,xhr){
		if(type == 'timeout'){
			return type;
		}
		var r = JSON.parse(xhr.response);
		//这样就能返回错误信息了
		//console.log(r.message);
		return JSON.stringify(r.message);
	}


(function(w){
	//获取sessionKey
	w.ajax_get_SessionKey = function(){
		mui.ajax('http://182.140.244.73:91/sessionkey',{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				localStorage.setItem('session_key',data.session_key);
				//关闭启动页面
				closeStartScreent();
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	};
	
	//XXX 刷新token  --> todo 还没做
	w.ajax_get_refreshToken = function(token){
		var url = httpUrl+'auth/token/new?token='+token;
		console.log(url);
		mui.ajax(url,{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:5000,//超时时间设置为10秒；
			success:function(data){
//				logData(data);
//				console.log(data);
				localStorage.setItem('token',data.token);
			},
			error:function(xhr,type,errorThrown){
				//错误信息
				//Token has expired and can no longer be refreshed
				//The token has been blacklisted
				//这两种错误 都需要重新登录,服务器无法连接 time out 还没想好怎么处理 
				//在首页会判断连接服务器 但是有可能请求时过多造成断网之类的.

				var m = getMessage(type,xhr);
				console.log(m);
				
				//清空信息 重新登录
				localStorage.setItem('token','');
				localStorage.setItem('user','');
				

				
			}
		});
	};
	
	
	//用户注册
	w.ajax_register = function(options){
		var data = getdata(options,'com.huihoo.user.register');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				//localStorage.setItem('token',data);
			},
			error:function(xhr,type,errorThrown){

			}
		});
	}
	
	
	//用户登陆
	w.ajax_login = function(options,callback){
		//var data = getdata(options,'com.huihoo.user.login');
		mui.ajax(httpUrl+'authorization?user_name='+options.user_name+'&password='+options.pwd,{
			//data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				//XXX 返回用户信息及token
				//logData(data);
				localStorage.setItem('account',options.user_name);
				localStorage.setItem('token',data.token);
				localStorage.setItem('user',JSON.stringify(data));
				return callback();
			},
			error:function(xhr,type,errorThrown){
				logData(type);
				var errorInfo;
				if(type == 'timeout'){
					errorInfo = '连接服务器超时!';
				}else{
					errorInfo = '用户名或密码错误!';
				}
				//console.log(xhr,type,errorThrown);
				//return false;
				return callback(errorInfo);
			}
		});
	}
	
	
	//修改密码
	w.ajax_change_pwd = function(options){
		var data = getdata(options,'com.huihoo.user.change_pwd');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				changePwdSuccess(data);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//退出登录
	w.ajax_logout = function(options){
		var data = getdata(options,'com.huihoo.user.loginout');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				logoutSuccess(data);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//获取分类第一级
	w.ajax_get_first_category = function(options) {
		startLoad();
		//var data = getdata(options,'com.huihoo.category.first_category');
		mui.ajax(httpUrl+'categories',{
			//data:data,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){				
				setTimeout(function(){
					endLoad();	// 关闭加载动画
					categoryStairSuccess(data);
				},50);
			},
			error:function(xhr,type,errorThrown){
				logData(xhr);
			}
		});
	}
	
	//获取分类第二级
	w.ajax_get_sub_category = function(options){
		categoryMoversHtml.innerHTML = '';
		startLoad();
		//var data = getdata(options,'com.huihoo.category.sub_category');
		mui.ajax(httpUrl+'categories/'+options.parent_category_id,{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				setTimeout(function(){
					endLoad();
					categoryMoversSuccess(options.parent_category_id,data);
				},50);
				
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	//获取分类产品
	w.ajax_get_product_list = function(options,callback){
		startLoad();
		//var data = getdata(options,'com.huihoo.product.product_list');
		var cont = 0;
		mui.ajax(httpUrl+'goods/'+options.category_id+'/'+options.page_size+'?page='+options.page_num,{
			//data:data,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				setTimeout(function(){
					endLoad();
					return callback(data);
					//productlistSuccess(data);
				},50);
				
				
			},
			error:function(xhr,type,errorThrown){
				logData(errorThrown);
			}
		});
	}
	
	//商品详情
	w.ajax_get_product_detail = function(options){
		startLoad();
		mui.ajax(httpUrl+'good/'+options.product_id,{
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				//console.log(data);
				data.id = options.product_id;
				setTimeout(function(){
					endLoad();
					productDetailSuccess(data);
				},50);
				
				
			},
			error:function(xhr,type,errorThrown){
				console.log(errorThrown);
			}
		});
	}
	
	
	
	//查询用户喜欢的商品
	w.ajax_get_likelist = function(options){
		startLoad();
		var data = getdata(options,'com.huihoo.user.collect_list');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				setTimeout(function(){
					endLoad();
					likelistSuccess(data);
				},500);
				
				
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	

	
	//删除喜欢的商品
	w.ajax_delete_likeItem = function(options){
		startLoad();
		var data = getdata(options,'com.huihoo.user.delete_collect');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				logData(data);
				data.id = options.product_id;
				setTimeout(function(){
					endLoad();
					deleteItemSuccess(data);
				},500);
				
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
		
	}
	
	//获取首页跑马灯
	w.ajax_get_Marquee = function(options){
		var data = getdata(options,'com.huihoo.content.paomadeng');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',
			type:'get',
			timeout:10000,
			success:function(data){
				logData(data);
				setTimeout(function(){
					endLoad();
					getMarqueeSuccess(data);
				},500);
				
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	//获取推荐商品
	w.ajax_get_Recommend = function(options){
		startLoad();
		var data = getdata(options,'com.huihoo.product.get_hot_products');
		mui.ajax(httpUrl,{
			data:data,
			dataType:'json',
			type:'get',
			timeout:10000,
			success:function(data){
				logData(data);
				setTimeout(function(){
					endLoad();
					getRecommendSuccess(data);
				},500);
				
				
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
	w.ajax_get_wallet = function(userInfo,token,callback){	
		startLoad();
		var url = httpUrl+'user/wallet/'+userInfo.user_id+'?token='+token;
		mui.ajax(url,{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
//				logData(data);
//				console.log(data);
				endLoad();
				return callback(data);

			},
			error:function(xhr,type,errorThrown){
				console.log(type);
				console.log(getMessage(type,xhr));
				
			}
		});
	}
	
	w.ajax_get_collect = function(userInfo,token,page,callback){	
		startLoad();
		var url = httpUrl+'user/collect/'+userInfo.user_id+'?page='+page+'&token='+token;
		//console.log(url);
		mui.ajax(url,{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
//				logData(data);
//				console.log(data);
				endLoad();
				return callback(data);

			},
			error:function(xhr,type,errorThrown){
				console.log(type);
				console.log(getMessage(type,xhr));
				
			}
		});
	}
	w.ajax_delete_collect = function(userInfo,goodId,token){	
		var url = httpUrl+'user/collect/delete/'+userInfo.user_id+'/'+goodId+'?token='+token;
		console.log(url);
		mui.ajax(url,{
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
//				logData(data);
//				console.log(data);

			},
			error:function(xhr,type,errorThrown){
				console.log(type);
				console.log(getMessage(type,xhr));
				
			}
		});
	}
})(window);
