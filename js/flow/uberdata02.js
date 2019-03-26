var width = 720,
	height = 720,
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

// 读取文件
function read(i = '2017-11-02') {
	queue()
		.defer(d3.csv, "data/cs/nodes.csv")
		.defer(d3.json, "data/cs/day/day_" + String(i) + ".json")
		.await(ready);
}

function ready(error, cities, matrix) {

	// 先将svg移除，再生成新的svg
	d3.selectAll("svg").remove();
	var svg = d3.select("body").append("svg")
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
read();