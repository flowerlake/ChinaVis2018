var myChart1 = echarts.init(document.getElementById("main1"),"dark")

myChart1.showLoading();
$.get('data/organization.json', function(data) {
	myChart1.hideLoading();

	myChart1.setOption(option = {
		tooltip: {
			trigger: 'xx',
			triggerOn: 'mousemove'
		},
		series: [{
			type: 'tree',

			data: [data],

			top: '7%',
			bottom: '7%',

			//			orient: 'vertical',
			layout: 'radial',

			symbol: 'emptycircle',

			symbolSize: 20,

			initialTreeDepth: 3,

			//数据更新动画的时长
			//			expandAndCollapse: true,
			//
						label: {
							normal: {
								fontSize: 9,
								color: "#fff"
							}
						},
			//
			//			leaves: {
			//				label: {
			//					normal: {
			//						position: 'bottom',
			//						rotate: -90,
			//						verticalAlign: 'middle',
			//						align: 'left'
			//					}
			//				}
			//			},
			//
			animationDurationUpdate: 750

		}]
	});
	myChart1.on('click', function(params) {
		if(params.name === '1007') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1007depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1007depart/themeRiver.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1007depart/heatmap-cartesian.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1007depart/grid-multiple.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1013') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1013depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1013depart/themeRiver.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1013depart/heatmap-cartesian.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1013depart/grid-multiple.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1059') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1059depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1059depart/themeRiver.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1059depart/heatmap-cartesian.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1059depart/grid-multiple.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1068') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1068depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1068depart/themeRiver.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1068depart/heatmap-cartesian.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1068depart/grid-multiple.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1041') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1041depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1041depart/wordcloud.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1041depart/heatmap-cartesian.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1041depart/grid-multiple.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
	});
});