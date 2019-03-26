var myChart2 = echarts.init(document.getElementById("main"));

var timeData = new Array();
var uplink_length = new Array();
var downlink_length = new Array();

$.get("data/tcp_length/downlink_length1059.json", function(downdata) {
	$.get("data/tcp_length/uplink_length1059.json", function(updata) {
		$.each(updata, function(k, v) {
			timeData.push(k);

		});
		timeData = timeData.sort();
		for(i = 0; i < timeData.length; i++) {
			uplink_length.push(Math.round(Number(updata[timeData[i]]) / 1024));
			downlink_length.push(Math.round(Number(downdata[timeData[i]] / 1024)));
		}
		timeData = timeData.map(function(str) {
			return str.replace('2017-11-', '');
		});

		option = {
			title: {
				text: 'tcp流量图',
				x: 'center'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false
				}
			},
			legend: {
				data: ['upload', 'download'],
				x: 'left'
			},
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					saveAsImage: {}
				}
			},
			axisPointer: {
				link: {
					xAxisIndex: 'all'
				}
			},
			dataZoom: [{
					show: true,
					realtime: true,
					start: 30,
					end: 70,
					//				xAxisIndex: [0, 1]
				},
				{
					type: 'inside',
					realtime: true,
					start: 30,
					end: 70,
					//				xAxisIndex: [0, 1]
				}
			],
			grid: [{
				left: 50,
				right: 50,
				height: '35%'
			}, {
				left: 50,
				right: 50,
				top: '55%',
				height: '35%'
			}],
			xAxis: [
				//{
				//				type: 'category',
				//				boundaryGap: false,
				//				axisLine: {
				//					onZero: true
				//				},
				//				data: timeData
				//			},
				{
					//				gridIndex: 1,
					type: 'category',
					boundaryGap: false,
					axisLine: {
						onZero: false
					},
					data: timeData,
					//				position: 'top'
				}
			],
			yAxis: [{
					name: 'upload(Mb/h)',
					type: 'value'
					//				max: 500
				},
				{
					//				gridIndex: 1,
					name: 'download(Mb/h)',
					type: 'value',
					inverse: true
				}
			],
			series: [{
					name: 'upload',
					type: 'line',
					//					areaStyle: {
					//						normal: {}
					//					},
					//				xAxisIndex: 1,
					//					yAxisIndex: 1,
					symbolSize: 8,
					animationDelay: function(idx) {
						return idx * 10;
					},
					hoverAnimation: false,
					data: uplink_length
				},
				{
					name: 'download',
					type: 'line',
					//				xAxisIndex: 1,
//									yAxisIndex: 1,
					areaStyle: {
						normal: {
							//							color: 'blue'
						}
					},
					symbolSize: 8,
//										yAxisIndex: 1,
					animationDelay: function(idx) {
						return idx * 10;
					},
					hoverAnimation: false,
					data: downlink_length
				}
			]
		};

		myChart2.setOption(option)

	});
});