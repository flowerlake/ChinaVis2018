var myChartthemeriver;
if (myChartthemeriver != null && myChartthemeriver != "" && myChartthemeriver != undefined) {  
        myChartthemeriver.dispose();  
    }

var myChartthemeriver = echarts.init(document.getElementById("themeriver"),'dark');

var dataseries = new Array();
var timeline = new Array();

$.get("data/webcat/webcat21013.json", function(data) {
	$.each(data, function(k, v) {
		var tmp = new Array();
		var index = $.inArray(k, timeline)
		if(index < 0) {
			timeline.push(k);
		}
		dataseries.push(v);
	});
	timeline = timeline.sort();
	
	var itemStyle = {
		normal: {
			opacity: 0.8,
			shadowBlur: 10,
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			shadowColor: 'rgba(0, 0, 0, 0.5)'
		}
	};

	option = {
		baseOption: {
			timeline: {
				axisType: 'category',
				orient: 'vertical',
				autoPlay: true,
				inverse: true,
				playInterval: 1000,
				left: null,
				right: 0,
				top: 20,
				bottom: 20,
				width: 65,
				height: null,
				label: {
					normal: {
						textStyle: {
							color: '#999'
						}
					},
					emphasis: {
						textStyle: {
							color: '#fff'
						}
					}
				},
				symbol: 'none',
				lineStyle: {
					color: '#555'
				},
				checkpointStyle: {
					color: '#bbb',
					borderColor: '#777',
					borderWidth: 2
				},
				controlStyle: {
					showNextBtn: false,
					showPrevBtn: false,
					normal: {
						color: '#666',
						borderColor: '#666'
					},
					emphasis: {
						color: '#aaa',
						borderColor: '#aaa'
					}
				},
				data: []
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line',
					lineStyle: {
						color: 'rgba(0,0,0,0.2)',
						width: 1,
						type: 'solid'
					}
				}
			},

			//		dataZoom: [{
			//				show: true,
			//				realtime: true,
			//				start: 30,
			//				end: 60,
			//				//				xAxisIndex: [0, 1]
			//			},
			//			{
			//				type: 'inside',
			//				realtime: true,
			//				start: 30,
			//				end: 60,
			//				//				xAxisIndex: [0, 1]
			//			}
			//		],

			//		xAxis: {
			//			position: top,
			//		},

			legend: {
				data: ['购物网站', '休闲娱乐', '视频网站', '内部网站', '娱乐休闲', '资讯信息', '社交网站', '综合网站', '搜索引擎', '咨询信息', '程序员社区', 'other']
			},

			singleAxis: {
				//			top: 50,
				//			bottom: 50,
				axisTick: {},
				axisLabel: {},
				type: 'time',
				axisPointer: {
					//				animation: true,
					label: {
						show: true
					}
				},
				splitLine: {
					show: true,
					lineStyle: {
						type: 'solid',
						opacity: 0.2
					}
				},
				axisTick: {
					alignWithLabel: true
				}
			},

			series: [{
				type: 'themeRiver',
				itemStyle: {
					emphasis: {
						shadowBlur: 20,
						shadowColor: 'rgba(0, 0, 0, 0.8)'
					}
				},
				label: {
					distance: 10,
					fontWeight: 'bold',
					fontSize: 16,
					show:false
				}
				//			data: dataseries
			}]
		},
		options: []
	};
	for(var n = 0; n < timeline.length; n++) {
		option.baseOption.timeline.data.push(timeline[n]);
		option.options.push({
			title: {
				show: true,
				'text': timeline[n] + ''
			},
			series: {
				name: timeline[n],
				type: 'themeRiver',
				itemStyle: itemStyle,
				data: dataseries[n],
				symbolSize: function(val) {
					return sizeFunction(val[2]);
				}
			}
		});
	}

	myChartthemeriver.setOption(option);
});