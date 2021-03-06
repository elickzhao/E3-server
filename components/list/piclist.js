Vue.component('pic-list', {
  props: ['items', 'urlpic'],
  data: function(){
  	return {
  		src: this.urlpic
  	}
  },
  methods:{
  	picsrc: function(val){
  		return this.src+val;
  	}
  },
  template: ' \
		<div id="pullrefresh" class="mui-content own-content-padding"> \
			<ul id="productsList" class="mui-table-view" style="margin-top: 0px;"> \
				<li v-for="item in items" :id="item.goods_id" class="mui-table-view-cell mui-media mui-col-xs-12"> \
					<div class="mui-slider-right mui-disabled"> \
						<a class="mui-btn mui-btn-red">删除</a> \
					</div> \
					<div class="mui-slider-handle mui-table"> \
					<a href="#"> \
						<img class="mui-media-object mui-pull-left" :src="picsrc(item.goods_thumb)"/> \
						<div class="mui-media-body"> \
							<p class="mui-ellipsis-2"> {{ item.goods_name }} </p> \
							<p class="price-one">¥ {{ item.shop_price }}</p> \
							<p class="price-two">¥ {{ item.market_price}}</p> \
						</div> \
					</a> \
					</div> \
				</li> \
			</ul> \
		</div>'
});