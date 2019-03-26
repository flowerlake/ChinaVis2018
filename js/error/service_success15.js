var myChart = echarts.init(document.getElementById("bart"),"dark");

//app.title = '柱状图框选';

var xAxisData = [];
var timeline = [];
var server_ip = [];

$.get("data/percent.json",function(result){
	$.get("data/server/server_ip.json",function(server_ip){
		
	proto = ['mysql', 'tds', 'postgresql', 'ssh', 'sftp', 'ftp', 'mongodb'];
	
	$.each(result,function(k,v){
		timeline.push(k);
		
	});
	
//	$.each(result['2017/11/1'], function(k,v) {
//		server_ip.push(k);
//	});
	
	
var itemStyle = {
    normal: {
    },
    emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
    }
};

option = {
//	baseOption: {
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
//				data: []
//			},
//			},
    backgroundColor: '#0d406c',
    legend: {
        data: proto,
        align: 'left',
        left: 10
    },
//  brush: {
//      toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
//      xAxisIndex: 0
//  },
//  toolbox: {
//      feature: {
//          magicType: {
//              type: ['stack', 'tiled']
//          },
//          dataView: {}
//      }
//  },
  tooltip: {},
    xAxis: {
        data: server_ip,
        name: 'server_ip',
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
    },
    yAxis: {
        inverse: false,
        splitArea: {show: false}
    },
    grid: {
        left: 100
    },
    visualMap: {
        type: 'continuous',
        dimension: 1,
        text: ['High', 'Low'],
        inverse: true,
        itemHeight: 200,
        calculable: true,
        min: 0,
        max: 1,
        top: 60,
        left: 10,
        inRange: {
            colorLightness: [0.4, 0.8]
        },
        outOfRange: {
            color: '#bbb'
        },
        controller: {
            inRange: {
                color: '#2f4554'
            }
        }
    },

    series: []
};

//myChart.on('brushSelected', renderBrushed);
//
//function renderBrushed(params) {
//  var brushed = [];
//  var brushComponent = params.batch[0];
//
//  for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
//      var rawIndices = brushComponent.selected[sIdx].dataIndex;
//      brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
//  }
//
//  myChart.setOption({
//      title: {
//          backgroundColor: '#333',
//          text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
//          bottom: 0,
//          right: 0,
//          width: 100,
//          textStyle: {
//              fontSize: 12,
//              color: '#fff'
//          }
//      }
//  });
//}


//for(var n = 0; n < timeline.length; n++) {
//		option.baseOption.timeline.data.push(timeline[n]);
//		option.baseOption.timeline.data.push('2017/11/1');
		for(j=0;j<proto.length;j++){
		option.series.push({
			name: proto[j],
			type: 'bar',
			stack: 'one',
			itemstyle: itemStyle,
			data: result['2017/11/15'][proto[j]]
		});
		
	}
		console.log(option);
//	}

myChart.setOption(option);
});
});