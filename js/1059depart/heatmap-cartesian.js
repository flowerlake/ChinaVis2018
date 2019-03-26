var myChartheatmap;

if (myChartheatmap != null && myChartheatmap != "" && myChartheatmap != undefined) {  
        myChartheatmap.dispose();  
    }

var myChartheatmap = echarts.init(document.getElementById("heatmap"),'dark');
	
var days = [1, 2, 3, "4-周六", "5-周日", 6, 7,8,9,10,"11-周六","12-周日",13,14,15,16,17,"18-周六","19-周日",20,21,
	22,23,24,"25-周六","26-周日",27,28,29,30];

var hours = ['6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];

var data = new Array();

$.get('data/rili/checkinginout/select1059.json', function(datax) {
	$.each(datax, function(k,v) {
		$.each(v, function(z,item) {
			for(i=0;i<30;i++){
				for(j=0;j<24;j++){
					var day = new Array();
					if(Number(z)===j){
						day[0]=Number(z)-6;day[1]=Number(k);day[2]=item;
					}
					else{
						day[0]=j-6;day[1]=i;day[2]='-';
					}
					data.push(day);
				}
			}
			
		});
	});
	option = {
		
		title: {
			text: "研发2部打卡信息",
			x: 'center'
		},
		
		tooltip: {
			position: 'top'
		},
		animation: false,
		grid: {
			height: '85%',
//			width: '30%',
			y: '10%'
		},
		xAxis: {
			type: 'category',
			data: hours,
			splitArea: {
				show: true
			}
		},
		yAxis: {
			type: 'category',
			data: days,
			splitArea: {
				show: true
			}
		},
		visualMap: {
			min: 0,
			max: 10,
			calculable: true,
			orient: 'horizontal',
			left: 'center',
			bottom: '15%',
			show: false
		},
		series: [{
			name: 'Punch Card',
			type: 'heatmap',
			data: data,
			label: {
				normal: {
					show: true
				}
			},
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 255)'
				}
			}
		}]
	};

	myChartheatmap.setOption(option);
});