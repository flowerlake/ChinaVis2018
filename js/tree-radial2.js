var myCharttree = echarts.init(document.getElementById("main1"), "dark");

$.get('data/organization.json', function(data) {
	myCharttree.setOption(option = {
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

			label: {
				normal: {
					fontSize: 9,
					color: "#fff"
				}
			},
			//数据更新动画的时长
			//			expandAndCollapse: true,
			//
//						label: {
//							normal: {
//								position: 'top',
//								rotate: -90,
//								verticalAlign: 'middle',
//								align: 'right',
//								fontSize: 9
//							}
//						},
			//
						leaves: {
							label: {
								normal: {
									position: 'bottom',
									rotate: -90,
									verticalAlign: 'middle',
									align: 'left'
								}
							}
						},
			//
			animationDurationUpdate: 500

		}]
	});
	myCharttree.on('click', function(params) {
		if(params.name === '1007') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1007depart/parallel.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1013') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1013depart/parallel.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1059') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1059depart/parallel.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1068') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1068depart/parallel.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
		if(params.name === '1041') {
			var newscript = document.createElement('script');
			newscript.setAttribute('type', 'text/javascript');
			newscript.setAttribute('src', 'js/1041depart/parallel.js');
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(newscript);
		}
	});

	myCharttree.setOption(option);
});