Vue.component('pic-list', {
	props: ['herf','name','price1','price2'],
  template: ' \
		<div id="pullrefresh" class="mui-content own-content-padding"> \
			<ul id="productsList" class="mui-table-view" style="margin-top: 0px;"> \
				<li class="mui-table-view-cell mui-media mui-col-xs-12"> \
					<a href=" {{ herf }} "> \
						<img class="mui-media-object mui-pull-left" src="../img/bg.jpeg" /> \
						<div class="mui-media-body"> \
							<p class="mui-ellipsis-2"> {{ name }}</p> \
							<p class="price-one">¥ {{ price1 }}</p> \
							<p class="price-two">¥ {{ price2 }}</p> \
						</div> \
					</a> \
				</li> \
			</ul> \
		</div>'
})