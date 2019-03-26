var wordcloudchart;
if (wordcloudchart != null && wordcloudchart != "" && wordcloudchart != undefined) {  
        wordcloudchart.dispose();  
    }

var wordcloudchart = echarts.init(document.getElementById('wordcloud'),'dark');

$.get("data/email/subject1068.json",function(data){
	

var option = {
	tooltip: {},
	series: [{
		type: 'wordCloud',
		gridSize: 2,
		sizeRange: [12, 50],
		rotationRange: [-90, 90],
		shape: 'circle',
		width: 600,
		height: 400,
		drawOutOfBound: true,
		textStyle: {
			normal: {
				color: function() {
					return 'rgb(' + [
						Math.round(Math.random() * 250),
						Math.round(Math.random() * 200),
						Math.round(Math.random() * 200)
					].join(',') + ')';
				}
			},
			emphasis: {
				shadowBlur: 10,
				shadowColor: '#333'
			}
		},
		data: data
	}]
};
wordcloudchart.setOption(option);
});