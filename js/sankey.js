var myChart = echarts.init(document.getElementById("main"));

myChart.showLoading();
$.get('data/cs/cs1059.json', function(result) {
	$.get('data/cs/nodes.json',function(nodes){
		
	myChart.hideLoading();

	option = {
//		baseOption: {
//			timeline: {
//				axisType: 'category',
//				orient: 'vertical',
//				autoPlay: true,
//				inverse: true,
//				playInterval: 1000,
//				left: null,
//				right: 0,
//				top: 20,
//				bottom: 20,
//				width: 65,
//				height: null,
//				
//				label: {
//					normal: {
//						textStyle: {
//							color: '#999'
//						}
//					},
//					emphasis: {
//						textStyle: {
//							color: '#fff'
//						}
//					}
//				},
//				symbol: 'none',
//				lineStyle: {
//					color: '#555'
//				},
//				checkpointStyle: {
//					color: '#bbb',
//					borderColor: '#777',
//					borderWidth: 2
//				},
//				controlStyle: {
//					showNextBtn: false,
//					showPrevBtn: false,
//					normal: {
//						color: '#666',
//						borderColor: '#666'
//					},
//					emphasis: {
//						color: '#aaa',
//						borderColor: '#aaa'
//					}
//				},
//				data:[]
//			}
			
//		},
//		legend:[],
		tooltip: {
					trigger: 'item',
					triggerOn: 'mousemove'
			},
		series: [{
			type: 'sankey',
			layout: 'none',
			data: nodes,
			links: result,
			itemStyle: {
				normal: {
					borderWidth: 1,
					borderColor: '#aaa'
				}
			},
			lineStyle: {
				normal: {
					color: 'source',
					curveness: 0.5
				}
			}
		}]
//		options:[]
	},
	

//legend = new Array();
//
//$.each(result.children, function(k,v) {
//	legend.push(k);
//});
//$.each(result, function(k,v) {
//	option.options.push({
//			title: {
//				show: true,
//				'text': k
//			},
//			legend: legend,
//			series: {
//				name: result,
//				type: 'themeRiver',
//				data: nodes,
//				links: v,
//				symbolSize: function(val) {
//					return sizeFunction(val[2]);
//				}
//			}
//		});
//});

myChart.setOption(option);

});
});