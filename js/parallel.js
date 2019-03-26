var myChart1 = echarts.init(document.getElementById("serverpara"),"dark");

$.get("data/server/server_ip.json", function(legend_data) {
		$.get("data/parallel/tcpserver.json", function(data) {
			var schema = [{
					name: 'client_ip',
					index: 0,
					text: 'client_ip'
				},
				{
					name: 'proto',
					index: 1,
					text: 'proto'
				},
				{
					name: 'server_ip',
					index: 2,
					text: 'server_ip'
				}
			];

			var lineStyle = {
				normal: {
					width: 1,
					opacity: 1
				}
			};

			//每一个部门下面的小组人员id,
			var legroup = new Array();
			var alldata = new Array();
			var client_ip = new Array();

//			$.each(groups, function(k, v) {
//				legroup[k] = k;
//				client_ip.push(v);
//				//for(i = 0; i < v.length; i++) {
//				//legroup[v[i]] = k;
//				//client_ip.push(v[i]);
//				//}
//			});
			server_ip = [
				"10.50.50.49",
				"10.50.50.36",
				"10.50.50.48",
				"10.50.50.35",
				"10.63.120.70",
				"10.50.50.42",
				"10.7.133.22",
				"10.50.50.40",
				"10.5.71.60",
				"10.7.133.20",
				"10.50.50.28",
				"10.50.50.46",
				"10.7.133.16",
				"10.7.133.21",
				"10.50.50.33",
				"10.50.50.29",
				"10.50.50.26",
				"10.50.50.41",
				"10.50.50.43",
				"10.50.50.44",
				"10.50.50.47",
				"10.50.50.34",
				"10.50.50.31",
				"10.50.50.45",
				"10.50.50.30",
				"10.7.133.15",
				"10.50.50.38",
				"10.7.133.19",
				"10.50.50.37",
				"10.50.50.39",
				"10.7.133.18"
			];
			//				client_ip.push('10.64.106.89');
			//				legend_data.push('1041');
			console.log(client_ip);
			console.log(legend_data);
			option = {
				title: {
					text: "服务器间的通信关系分析"
				},
				backgroundColor: '#0d406c',
//				legend: {
//					bottom: 30,
//					data: legend_data,
//					itemGap: 8,
//					textStyle: {
//						color: '#fff',
//						fontSize: 12
//					},
//				},
				//					tooltip: {
				//						padding: 10,
				//						backgroundColor: '#222',
				//						borderColor: '#777',
				//						borderWidth: 1
				//						//      formatter: function (obj) {
				//						//          var value = obj[0].value;
				//						//          return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
				//						//              + obj[0].seriesName + ' ' + value[0] + '日期：'</div>'
				//						//              + schema[1].text + '：' + value[1] + '<br>'
				//						//              + schema[2].text + '：' + value[2] + '<br>'
				//						//              + schema[3].text + '：' + value[3] + '<br>'
				//						//              + schema[4].text + '：' + value[4] + '<br>'
				//						//              + schema[5].text + '：' + value[5] + '<br>'
				//						//              + schema[6].text + '：' + value[6] + '<br>';
				//						//      }
				//					},
				parallelAxis: [{
						dim: 0,
						name: 'server_ip',
						type: 'category',
						data: server_ip
					},
					{
						dim: 1,
						name: 'proto',
						type: 'category',
						data: ['ftp', 'ssh', 'mongodb', 'postgresql', 'tds', 'mysql', 'sftp', 'smtp', 'http']
					},
					{
						dim: 2,
						name: 'server_ip',
						type: 'category',
						data: server_ip
					}
				],
//				visualMap: {
//					show: true,
//					min: 0,
//					max: 150,
//					dimension: 3,
//					inRange: {
//						color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
//					}
//				},
				parallel: {
					left: '5%',
					right: '10%',
					bottom: 20,
					lineStyle: {
						width: 1,
						pacity: 0.3
					},
					//						realtime: false,
					parallelAxisDefault: {
						type: 'value',
						name: 'AQI指数',
						nameLocation: 'end',
						nameGap: 20,
						nameTextStyle: {
							color: '#fff',
							fontSize: 12
						},
						axisLine: {
							lineStyle: {
								color: '#aaa'
							}
						},
						axisTick: {
							lineStyle: {
								color: '#777'
							}
						},
						//							splitLine: {
						//								show: false
						//							},
						axisLabel: {
							textStyle: {
								color: '#fff'
							}
						}
					}
				},
				series: []
			};

			for(i = 0; i < legend_data.length; i++) {
				option.series.push({
					name: legend_data[i],
					type: 'parallel',
					lineStyle: lineStyle,
					data: data[legend_data[i]]

				})
			}
			console.log(option);
			myChart1.setOption(option);
		});
	});
//});