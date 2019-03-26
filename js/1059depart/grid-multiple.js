var myChartmultiple;

if (myChartmultiple != null && myChartmultiple != "" && myChartmultiple != undefined) {  
        myChartmultiple.dispose();  
    }

var myChartmultiple = echarts.init(document.getElementById("multiple"),'dark');

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
				text: '研发2部tcp流量图',
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
//				show:false,
				x: 'left'
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
				left: 70,
				right: 50,
				height: '80%'
			}, {
				left: 65,
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
					name: 'speed(Mb/h)',
					type: 'value'
					//				max: 500
				}
//				{
//					//				gridIndex: 1,
//					name: 'download(Mb/h)',
//					type: 'value',
//					inverse: true
//				}
			],
			series: [{
					name: 'upload',
					type: 'line',
//					color: '#000000',
//										areaStyle: {
//											normal: {
////												color: "#000000"
//											}
//										},
					//				xAxisIndex: 1,
					//					yAxisIndex: 1,
					symbolSize: 8,
					animationDelay: function(idx) {
						return idx * 1;
					},
					hoverAnimation: false,
					data: uplink_length
			},
				{
					name: 'download',
					type: 'line',
//					color: '#000000',
					//				xAxisIndex: 1,
					//				yAxisIndex: 1,
					areaStyle: {
						normal: {
//							color: '#fff'
							//							color: 'blue'
						}
					},
					symbolSize: 8,
//										yAxisIndex: 1,
					animationDelay: function(idx) {
						return idx * 1;
					},
					hoverAnimation: false,
					data: downlink_length
				}
			]
		};

		myChartmultiple.setOption(option)

	});
});