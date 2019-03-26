var myChartcalendar;

if(myChartcalendar != null && myChartcalendar != "" && myChartcalendar != undefined) {
	myChartcalendar.dispose();
}
var myChartcalendar = echarts.init(document.getElementById("calendar"));

var dateList = [
	['2017-1-1', '初四'],
	['2017-1-2', '初五'],
	['2017-1-3', '初六'],
	['2017-1-4', '初七'],
	['2017-1-5', '初八', '小寒'],
	['2017-1-6', '初九'],
	['2017-1-7', '初十'],
	['2017-1-8', '十一'],
	['2017-1-9', '十二'],
	['2017-1-10', '十三'],
	['2017-1-11', '十四'],
	['2017-1-12', '十五'],
	['2017-1-13', '十六'],
	['2017-1-14', '十七'],
	['2017-1-15', '十八'],
	['2017-1-16', '十九'],
	['2017-1-17', '二十'],
	['2017-1-18', '廿一'],
	['2017-1-19', '廿二'],
	['2017-1-20', '廿三', '大寒'],
	['2017-1-21', '廿四'],
	['2017-1-22', '廿五'],
	['2017-1-23', '廿六'],
	['2017-1-24', '廿七'],
	['2017-1-25', '廿八'],
	['2017-1-26', '廿九'],
	['2017-1-27', '三十'],
	['2017-1-28', '正月'],
	['2017-1-29', '初二'],
	['2017-1-30', '初三'],
	['2017-1-31', '初四'],
	['2017-2-1', '初五'],
	['2017-2-2', '初六'],
	['2017-2-3', '初七', '立春'],
	['2017-2-4', '初八'],
	['2017-2-5', '初九'],
	['2017-2-6', '初十'],
	['2017-2-7', '十一'],
	['2017-2-8', '十二'],
	['2017-2-9', '十三'],
	['2017-2-10', '十四'],
	['2017-2-11', '十五'],
	['2017-2-12', '十六'],
	['2017-2-13', '十七'],
	['2017-2-14', '十八'],
	['2017-2-15', '十九'],
	['2017-2-16', '二十'],
	['2017-2-17', '廿一'],
	['2017-2-18', '廿二', '雨水'],
	['2017-2-19', '廿三'],
	['2017-2-20', '廿四'],
	['2017-2-21', '廿五'],
	['2017-2-22', '廿六'],
	['2017-2-23', '廿七'],
	['2017-2-24', '廿八'],
	['2017-2-25', '廿九'],
	['2017-2-26', '二月'],
	['2017-2-27', '初二'],
	['2017-2-28', '初三'],
	['2017-3-1', '初四'],
	['2017-3-2', '初五'],
	['2017-3-3', '初六'],
	['2017-3-4', '初七'],
	['2017-3-5', '初八', '驚蟄'],
	['2017-3-6', '初九'],
	['2017-3-7', '初十'],
	['2017-3-8', '十一'],
	['2017-3-9', '十二'],
	['2017-3-10', '十三'],
	['2017-3-11', '十四'],
	['2017-3-12', '十五'],
	['2017-3-13', '十六'],
	['2017-3-14', '十七'],
	['2017-3-15', '十八'],
	['2017-3-16', '十九'],
	['2017-3-17', '二十'],
	['2017-3-18', '廿一'],
	['2017-3-19', '廿二'],
	['2017-3-20', '廿三', '春分'],
	['2017-3-21', '廿四'],
	['2017-3-22', '廿五'],
	['2017-3-23', '廿六'],
	['2017-3-24', '廿七'],
	['2017-3-25', '廿八'],
	['2017-3-26', '廿九'],
	['2017-3-27', '三十'],
	['2017-3-28', '三月'],
	['2017-3-29', '初二'],
	['2017-3-30', '初三'],
	['2017-3-31', '初四'],
	['2017-4-1', '初五'],
	['2017-4-2', '初六'],
	['2017-4-3', '初七'],
	['2017-4-4', '初八', '清明'],
	['2017-4-5', '初九'],
	['2017-4-6', '初十'],
	['2017-4-7', '十一'],
	['2017-4-8', '十二'],
	['2017-4-9', '十三'],
	['2017-4-10', '十四'],
	['2017-4-11', '十五'],
	['2017-4-12', '十六'],
	['2017-4-13', '十七'],
	['2017-4-14', '十八'],
	['2017-4-15', '十九'],
	['2017-4-16', '二十'],
	['2017-4-17', '廿一'],
	['2017-4-18', '廿二'],
	['2017-4-19', '廿三'],
	['2017-4-20', '廿四', '穀雨'],
	['2017-4-21', '廿五'],
	['2017-4-22', '廿六'],
	['2017-4-23', '廿七'],
	['2017-4-24', '廿八'],
	['2017-4-25', '廿九'],
	['2017-4-26', '四月'],
	['2017-4-27', '初二'],
	['2017-4-28', '初三'],
	['2017-4-29', '初四'],
	['2017-4-30', '初五'],
	['2017-5-1', '初六'],
	['2017-5-2', '初七'],
	['2017-5-3', '初八'],
	['2017-5-4', '初九'],
	['2017-5-5', '初十', '立夏'],
	['2017-5-6', '十一'],
	['2017-5-7', '十二'],
	['2017-5-8', '十三'],
	['2017-5-9', '十四'],
	['2017-5-10', '十五'],
	['2017-5-11', '十六'],
	['2017-5-12', '十七'],
	['2017-5-13', '十八'],
	['2017-5-14', '十九'],
	['2017-5-15', '二十'],
	['2017-5-16', '廿一'],
	['2017-5-17', '廿二'],
	['2017-5-18', '廿三'],
	['2017-5-19', '廿四'],
	['2017-5-20', '廿五'],
	['2017-5-21', '廿六', '小滿'],
	['2017-5-22', '廿七'],
	['2017-5-23', '廿八'],
	['2017-5-24', '廿九'],
	['2017-5-25', '三十'],
	['2017-5-26', '五月'],
	['2017-5-27', '初二'],
	['2017-5-28', '初三'],
	['2017-5-29', '初四'],
	['2017-5-30', '初五'],
	['2017-5-31', '初六'],
	['2017-6-1', '初七'],
	['2017-6-2', '初八'],
	['2017-6-3', '初九'],
	['2017-6-4', '初十'],
	['2017-6-5', '十一', '芒種'],
	['2017-6-6', '十二'],
	['2017-6-7', '十三'],
	['2017-6-8', '十四'],
	['2017-6-9', '十五'],
	['2017-6-10', '十六'],
	['2017-6-11', '十七'],
	['2017-6-12', '十八'],
	['2017-6-13', '十九'],
	['2017-6-14', '二十'],
	['2017-6-15', '廿一'],
	['2017-6-16', '廿二'],
	['2017-6-17', '廿三'],
	['2017-6-18', '廿四'],
	['2017-6-19', '廿五'],
	['2017-6-20', '廿六'],
	['2017-6-21', '廿七', '夏至'],
	['2017-6-22', '廿八'],
	['2017-6-23', '廿九'],
	['2017-6-24', '六月'],
	['2017-6-25', '初二'],
	['2017-6-26', '初三'],
	['2017-6-27', '初四'],
	['2017-6-28', '初五'],
	['2017-6-29', '初六'],
	['2017-6-30', '初七'],
	['2017-7-1', '初八'],
	['2017-7-2', '初九'],
	['2017-7-3', '初十'],
	['2017-7-4', '十一'],
	['2017-7-5', '十二'],
	['2017-7-6', '十三'],
	['2017-7-7', '十四', '小暑'],
	['2017-7-8', '十五'],
	['2017-7-9', '十六'],
	['2017-7-10', '十七'],
	['2017-7-11', '十八'],
	['2017-7-12', '十九'],
	['2017-7-13', '二十'],
	['2017-7-14', '廿一'],
	['2017-7-15', '廿二'],
	['2017-7-16', '廿三'],
	['2017-7-17', '廿四'],
	['2017-7-18', '廿五'],
	['2017-7-19', '廿六'],
	['2017-7-20', '廿七'],
	['2017-7-21', '廿八'],
	['2017-7-22', '廿九', '大暑'],
	['2017-7-23', '閏六', ],
	['2017-7-24', '初二'],
	['2017-7-25', '初三'],
	['2017-7-26', '初四'],
	['2017-7-27', '初五'],
	['2017-7-28', '初六'],
	['2017-7-29', '初七'],
	['2017-7-30', '初八'],
	['2017-7-31', '初九'],
	['2017-8-1', '初十'],
	['2017-8-2', '十一'],
	['2017-8-3', '十二'],
	['2017-8-4', '十三'],
	['2017-8-5', '十四'],
	['2017-8-6', '十五'],
	['2017-8-7', '十六', '立秋'],
	['2017-8-8', '十七'],
	['2017-8-9', '十八'],
	['2017-8-10', '十九'],
	['2017-8-11', '二十'],
	['2017-8-12', '廿一'],
	['2017-8-13', '廿二'],
	['2017-8-14', '廿三'],
	['2017-8-15', '廿四'],
	['2017-8-16', '廿五'],
	['2017-8-17', '廿六'],
	['2017-8-18', '廿七'],
	['2017-8-19', '廿八'],
	['2017-8-20', '廿九'],
	['2017-8-21', '三十'],
	['2017-8-22', '七月'],
	['2017-8-23', '初二', '處暑'],
	['2017-8-24', '初三'],
	['2017-8-25', '初四'],
	['2017-8-26', '初五'],
	['2017-8-27', '初六'],
	['2017-8-28', '初七'],
	['2017-8-29', '初八'],
	['2017-8-30', '初九'],
	['2017-8-31', '初十'],
	['2017-9-1', '十一'],
	['2017-9-2', '十二'],
	['2017-9-3', '十三'],
	['2017-9-4', '十四'],
	['2017-9-5', '十五'],
	['2017-9-6', '十六'],
	['2017-9-7', '十七', '白露'],
	['2017-9-8', '十八'],
	['2017-9-9', '十九'],
	['2017-9-10', '二十'],
	['2017-9-11', '廿一'],
	['2017-9-12', '廿二'],
	['2017-9-13', '廿三'],
	['2017-9-14', '廿四'],
	['2017-9-15', '廿五'],
	['2017-9-16', '廿六'],
	['2017-9-17', '廿七'],
	['2017-9-18', '廿八'],
	['2017-9-19', '廿九'],
	['2017-9-20', '八月'],
	['2017-9-21', '初二'],
	['2017-9-22', '初三'],
	['2017-9-23', '初四', '秋分'],
	['2017-9-24', '初五'],
	['2017-9-25', '初六'],
	['2017-9-26', '初七'],
	['2017-9-27', '初八'],
	['2017-9-28', '初九'],
	['2017-9-29', '初十'],
	['2017-9-30', '十一'],
	['2017-10-1', '十二'],
	['2017-10-2', '十三'],
	['2017-10-3', '十四'],
	['2017-10-4', '十五'],
	['2017-10-5', '十六'],
	['2017-10-6', '十七'],
	['2017-10-7', '十八'],
	['2017-10-8', '十九', '寒露'],
	['2017-10-9', '二十'],
	['2017-10-10', '廿一'],
	['2017-10-11', '廿二'],
	['2017-10-12', '廿三'],
	['2017-10-13', '廿四'],
	['2017-10-14', '廿五'],
	['2017-10-15', '廿六'],
	['2017-10-16', '廿七'],
	['2017-10-17', '廿八'],
	['2017-10-18', '廿九'],
	['2017-10-19', '三十'],
	['2017-10-20', '九月'],
	['2017-10-21', '初二'],
	['2017-10-22', '初三'],
	['2017-10-23', '初四', '霜降'],
	['2017-10-24', '初五'],
	['2017-10-25', '初六'],
	['2017-10-26', '初七'],
	['2017-10-27', '初八'],
	['2017-10-28', '初九'],
	['2017-10-29', '初十'],
	['2017-10-30', '十一'],
	['2017-10-31', '十二'],
	['2017-11-01', '十三'],
	['2017-11-02', '十四'],
	['2017-11-03', '十五'],
	['2017-11-04', '十六'],
	['2017-11-05', '十七'],
	['2017-11-06', '十八'],
	['2017-11-07', '十九', '立冬'],
	['2017-11-08', '二十'],
	['2017-11-09', '廿一'],
	['2017-11-10', '廿二'],
	['2017-11-11', '廿三'],
	['2017-11-12', '廿四'],
	['2017-11-13', '廿五'],
	['2017-11-14', '廿六'],
	['2017-11-15', '廿七'],
	['2017-11-16', '廿八'],
	['2017-11-17', '廿九'],
	['2017-11-18', '十月'],
	['2017-11-19', '初二'],
	['2017-11-20', '初三'],
	['2017-11-21', '初四'],
	['2017-11-22', '初五', '小雪'],
	['2017-11-23', '初六'],
	['2017-11-24', '初七'],
	['2017-11-25', '初八'],
	['2017-11-26', '初九'],
	['2017-11-27', '初十'],
	['2017-11-28', '十一'],
	['2017-11-29', '十二'],
	['2017-11-30', '十三'],
	['2017-12-1', '十四'],
	['2017-12-2', '十五'],
	['2017-12-3', '十六'],
	['2017-12-4', '十七'],
	['2017-12-5', '十八'],
	['2017-12-6', '十九'],
	['2017-12-7', '二十', '大雪'],
	['2017-12-8', '廿一'],
	['2017-12-9', '廿二'],
	['2017-12-10', '廿三'],
	['2017-12-11', '廿四'],
	['2017-12-12', '廿五'],
	['2017-12-13', '廿六'],
	['2017-12-14', '廿七'],
	['2017-12-15', '廿八'],
	['2017-12-16', '廿九'],
	['2017-12-17', '三十'],
	['2017-12-18', '十一月', ],
	['2017-12-19', '初二'],
	['2017-12-20', '初三'],
	['2017-12-21', '初四'],
	['2017-12-22', '初五', '冬至'],
	['2017-12-23', '初六'],
	['2017-12-24', '初七'],
	['2017-12-25', '初八'],
	['2017-12-26', '初九'],
	['2017-12-27', '初十'],
	['2017-12-28', '十一'],
	['2017-12-29', '十二'],
	['2017-12-30', '十三'],
	['2017-12-31', '十四']
];

var heatmapData = [];
var lunarData = [];
for(var i = 0; i < dateList.length; i++) {
	heatmapData.push([
		dateList[i][0],
		Math.random() * 300
	]);
	lunarData.push([
		dateList[i][0],
		1,
		dateList[i][1],
		dateList[i][2]
	]);
}

option = {
	tooltip: {
		formatter: function(params) {
			return
			//          return '降雨量: ' + params.value[1].toFixed(2);
		}
	},

	visualMap: {
		show: false,
		min: 0,
		max: 300,
		calculable: true,
		seriesIndex: [2],
		orient: 'horizontal',
		left: 'center',
		bottom: 20,
		inRange: {
			color: ['#e0ffff', '#006edd'],
			opacity: 0.3
		},
		controller: {
			inRange: {
				opacity: 0.5
			}
		}
	},

	calendar: [{
		left: 'center',
		top: 'middle',
		cellSize: [70, 70],
		yearLabel: {
			show: false
		},
		orient: 'vertical',
		dayLabel: {
			firstDay: 0,
			nameMap: 'cn'
		},
		monthLabel: {
			show: false
		},
		height: "80%",
		width: "80%",
		y: "10%",
		range: '2017-11'
	}],

	series: [{
		type: 'scatter',
		coordinateSystem: 'calendar',
		symbolSize: 1,
		label: {
			normal: {
				show: true,
				formatter: function(params) {
					var d = echarts.number.parseDate(params.value[0]);
					return d.getDate() + '\n\n' + params.value[2] + '\n\n';
				},
				textStyle: {
					color: '#000'
				}
			}
		},
		data: lunarData
	}, 
	{
		type: 'scatter',
		coordinateSystem: 'calendar',
		symbolSize: 1,
		label: {
			normal: {
				show: false,
				formatter: function(params) {
					return '\n\n\n' + (params.value[3] || '');
				},
				textStyle: {
					fontSize: 14,
					fontWeight: 700,
					color: '#a00'
				}
			}
		},
		data: lunarData
	}, {
		name: '降雨量',
		type: 'heatmap',
		coordinateSystem: 'calendar',
		data: heatmapData
	}]
};
myChartcalendar.setOption(option);


	myChartcalendar.on('click',function(param){
		d = param.data[0].replace('2017-11-','');
		var newscript = document.createElement('script');  
		newscript.setAttribute('type','text/javascript');  
		newscript.setAttribute('src','js/error/service_success'+d+'.js');
		var head = document.getElementsByTagName('body')[0];
		head.appendChild(newscript);
	});

	var width = 800,height = 800,
		outerRadius = Math.min(width, height) / 2 - 10,
		innerRadius = outerRadius - 24;

	var formatPercent = d3.format(".1%");

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);

	var layout = d3.layout.chord()
		.padding(.04)
		.sortSubgroups(d3.descending)
		.sortChords(d3.ascending);

	var path = d3.svg.chord()
		.radius(innerRadius);

	var svg = d3.select("div#chord").append("svg")
		.attr("width", width)
		.attr("height", height);

	myChartcalendar.on('click', function(param) {

		day = param.data[0];
//		console.log(day);
		// 读取文件
		function read(i) {
			queue()
				.defer(d3.csv, "data/cs/nodes.csv")
				.defer(d3.json, "data/cs/day/day_" + String(i) + ".json")
				.await(ready);
		}

		function ready(error, cities, matrix) {

			// 先将svg移除，再生成新的svg
			//	console.log(svg);
			d3.select("svg#fuck").remove();
			//	console.log(d3.selectAll("svg"));
			var svg = d3.select("div#chord").append("svg")
				.attr("id", "fuck")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("id", "circle")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			svg.append("circle")
				.attr("r", outerRadius);

			if(error) throw error;

			// Compute the chord layout.
			layout.matrix(matrix);

			// Add a group per neighborhood.
			var group = svg.selectAll(".group")
				.data(layout.groups)
				.enter().append("g")
				.attr("class", "group")
				.on("mouseover", mouseover);

			// Add a mouseover title.
			group.append("title").text(function(d, i) {
				return cities[i].name + ": " + (d.value);
			});

			// Add the group arc.
			var groupPath = group.append("path")
				.attr("id", function(d, i) {
					return "group" + i;
				})
				.attr("d", arc)
				.style("fill", function(d, i) {
					return cities[i].color;
				});

			// Add a text label.
			var groupText = group.append("text")
				.attr("x", 6)
				.attr("dy", 15);

			groupText.append("textPath")
				.attr("xlink:href", function(d, i) {
					return "#group" + i;
				})
				.text(function(d, i) {
					return cities[i].name;
				});

			// Remove the labels that don't fit. :(
			groupText.filter(function(d, i) {
					return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
				})
				.remove();

			// Add the chords.
			var chord = svg.selectAll(".chord")
				.data(layout.chords)
				.enter().append("path")
				.attr("class", "chord")
				.style("fill", function(d) {
					return cities[d.source.index].color;
				})
				.attr("d", path);

			// Add an elaborate mouseover title for each chord.
			chord.append("title").text(function(d) {
				return cities[d.source.index].name +
					" → " + cities[d.target.index].name +
					": " + d.source.value +
					"\n" + cities[d.target.index].name +
					" → " + cities[d.source.index].name +
					": " + d.target.value;
			});

			function mouseover(d, i) {
				chord.classed("fade", function(p) {
					return p.source.index != i &&
						p.target.index != i;
				});
			}
		}

		//var day = new Array();
		//for(i = 1; i < 10; i++) day.push('2017-11-0' + String(i));
		//for(i = 10; i < 31; i++) day.push('2017-11-' + String(i));
		//
		////生成选项卡
		//var countrySel = d3.select("#daySelector");
		//function generateCountryList(day) {
		//	for(var i in day) {
		//		var option = countrySel.append("option");
		//		option.text(day[i])
		//			.attr("value", day[i]);
		//
		//		//set starting country
		//		if(i === "2017-11-01") option.attr("selected", true);
		//	}
		//}
		//generateCountryList(day);
		//
		//// 进行选择操作，每选一项就刷新
		//$("select").change(function() {
		//	day = $("select option:selected").val();
		//	console.log(day);
		//	read(day);
		//});

		// 执行一次默认显示
		read(day);

	});