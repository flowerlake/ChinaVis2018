var myChart = echarts.init(document.getElementById("main"));

$.get("data/unusual/unusual.json",function(data){
	
	option = {
    color: ['#003366', '#006699', '#e5323e'],
    
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['打卡信息', 'tcp连接数', 'login次数']
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            data: data['day']
        }
    ],
    yAxis: [
        {
        	name: "打卡信息",
            type: 'value'
        },
        {
        	name: "tcp/login连接数量",
            type: 'value'
            
        }
    ],
    series: [
        {
            name: '打卡信息',
            type: 'bar',
            barGap: 0,
            areaStyle: {
						normal: {
							//							color: 'blue'
						}
					},
            data: data['check']
        },
        {
            name: 'tcp连接数',
            type: 'line',
            yAxisIndex: 1,
            data: data['tcplog']
        },
        {
            name: 'login次数',
            type: 'line',
            yAxisIndex: 1,
            data: data['login']
        }
    ]
};
	myChart.setOption(option);
	
	myChart.on('click', function(params){
    	console.log(params);
    	if(params.name==='2017/11/18'){
    		var newscript = document.createElement('script');  
newscript.setAttribute('type','text/javascript');  
newscript.setAttribute('src','js/circlepacking.js');  
var head = document.getElementsByTagName('head')[0];  
head.appendChild(newscript);
    	}
    });
	
})
