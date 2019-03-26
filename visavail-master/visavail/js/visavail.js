function visavailChart() {
  // define chart layout
  var margin = {
    // top margin includes title and legend
    top: 70,

    // right margin should provide space for last horz. axis title
    right: 40,

    bottom: 20,

    // left margin should provide space for y axis titles
    left: 100,
  };

  // height of horizontal data bars
  var dataHeight = 18;

  // spacing between horizontal data bars
  var lineSpacing = 14;

  // vertical space for heading
  var paddingTopHeading = -50;

  // vertical overhang of vertical grid lines on bottom
  var paddingBottom = 10;

  // space for y axis titles
  var paddingLeft = -100;

  var width = 940 - margin.left - margin.right;

  // title of chart is drawn or not (default: yes)
  var drawTitle = 1;

  // year ticks to be emphasized or not (default: yes)
  var emphasizeYearTicks = 1;

  // define chart pagination
  // max. no. of datasets that is displayed, 0: all (default: all)
  var maxDisplayDatasets = 0;

  // dataset that is displayed first in the current
  // display, chart will show datasets "curDisplayFirstDataset" to
  // "curDisplayFirstDataset+maxDisplayDatasets"
  var curDisplayFirstDataset = 0;

  // range of dates that will be shown
  // if from-date (1st element) or to-date (2nd element) is zero,
  // it will be determined according to your data (default: automatically)
  var displayDateRange = [0, 0];

  // global div for tooltip
  var div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  var definedBlocks = null;
  var customCategories = null;
  var isDateOnlyFormat = null;

  function chart(selection) {
    selection.each(function drawGraph(dataset) {
      // check which subset of datasets have to be displayed
      var maxPages = 0;
      var startSet;
      var endSet;
      if (maxDisplayDatasets !== 0) {
        startSet = curDisplayFirstDataset;
        if (curDisplayFirstDataset + maxDisplayDatasets > dataset.length) {
          endSet = dataset.length;
        } else {
          endSet = curDisplayFirstDataset + maxDisplayDatasets;
        }
        maxPages = Math.ceil(dataset.length / maxDisplayDatasets);
      } else {
        startSet = 0;
        endSet = dataset.length;
      }

      // append data attribute in HTML for pagination interface
      selection.attr('data-max-pages', maxPages);

      var noOfDatasets = endSet - startSet;
      var height = dataHeight * noOfDatasets + lineSpacing * noOfDatasets - 1;

      // check how data is arranged
      if (definedBlocks === null) {
        definedBlocks = 0;
        for (var i = 0; i < dataset.length; i++) {
          if (dataset[i].data[0].length === 3) {
            definedBlocks = 1;
            break;
          } else {
            if (definedBlocks) {
              throw new Error('Detected different data formats in input data. Format can either be ' +
                  'continuous data format or time gap data format but not both.');
            }
          }
        }
      }

      // check if data has custom categories
      if (customCategories === null) {
        customCategories = 0;
        for (var i = 0; i < dataset.length; i++) {
          if (dataset[i].data[0][1] != 0 && dataset[i].data[0][1] != 1) {
            customCategories = 1;
            break;
          }
        }
      }

      // parse data text strings to JavaScript date stamps
      var parseDate = d3.time.format('%Y-%m-%d');
      var parseDateTime = d3.time.format('%Y-%m-%d %H:%M:%S');
      var parseDateRegEx = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
      var parseDateTimeRegEx = new RegExp(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      if (isDateOnlyFormat === null) {
        isDateOnlyFormat = true;
      }
      dataset.forEach(function (d) {
        d.data.forEach(function (d1) {
          if (!(d1[0] instanceof Date)) {
            if (parseDateRegEx.test(d1[0])) {
              // d1[0] is date without time data
              d1[0] = parseDate.parse(d1[0]);
            } else if (parseDateTimeRegEx.test(d1[0])) {
              // d1[0] is date with time data
              d1[0] = parseDateTime.parse(d1[0]);
              isDateOnlyFormat = false;
            } else {
              throw new Error('Date/time format not recognized. Pick between \'YYYY-MM-DD\' or ' +
                '\'YYYY-MM-DD HH:MM:SS\'.');
            }

            if (!definedBlocks) {
              d1[2] = d3.time.second.offset(d1[0], d.interval_s);
            } else {
              if (parseDateRegEx.test(d1[2])) {
                // d1[2] is date without time data
                d1[2] = parseDate.parse(d1[2]);
              } else if (parseDateTimeRegEx.test(d1[2])) {
                // d1[2] is date with time data
                d1[2] = parseDateTime.parse(d1[2]);
              } else {
                throw new Error('Date/time format not recognized. Pick between \'YYYY-MM-DD\' or ' +
                    '\'YYYY-MM-DD HH:MM:SS\'.');
              }
            }
          }
        });
      });

      // cluster data by dates to form time blocks
      dataset.forEach(function (series, seriesI) {
        var tmpData = [];
        var dataLength = series.data.length;
        series.data.forEach(function (d, i) {
          if (i !== 0 && i < dataLength) {
            if (d[1] === tmpData[tmpData.length - 1][1]) {
              // the value has not changed since the last date
              if (definedBlocks) {
                if (tmpData[tmpData.length - 1][2].getTime() === d[0].getTime()) {
                  // end of old and start of new block are the same
                  tmpData[tmpData.length - 1][2] = d[2];
                  tmpData[tmpData.length - 1][3] = 1;
                } else {
                  tmpData.push(d);
                }
              } else {
                tmpData[tmpData.length - 1][2] = d[2];
                tmpData[tmpData.length - 1][3] = 1;
              }
            } else {
              // the value has changed since the last date
              d[3] = 0;
              if (!definedBlocks) {
                // extend last block until new block starts
                tmpData[tmpData.length - 1][2] = d[0];
              }
              tmpData.push(d);
            }
          } else if (i === 0) {
            d[3] = 0;
            tmpData.push(d);
          }
        });
        dataset[seriesI].disp_data = tmpData;
      });

      // determine start and end dates among all nested datasets
      var startDate = displayDateRange[0];
      var endDate = displayDateRange[1];

      dataset.forEach(function (series, seriesI) {
        if (series.disp_data.length>0) {
          if (startDate === 0) {
            startDate = series.disp_data[0][0];
            endDate = series.disp_data[series.disp_data.length - 1][2];
          } else {
            if (displayDateRange[0] === 0 && series.disp_data[0][0] < startDate) {
              startDate = series.disp_data[0][0];
            }
            if (displayDateRange[1] === 0 && series.disp_data[series.disp_data.length - 1][2] > endDate) {
              endDate = series.disp_data[series.disp_data.length - 1][2];
            }
          }
        }
      });

      // define scales
      var xScale = d3.time.scale()
          .domain([startDate, endDate])
          .range([0, width])
          .clamp(1);

      // define axes
      var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('top');

      // create SVG element
      var svg = d3.select(this).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // create basic element groups
      svg.append('g').attr('id', 'g_title');
      svg.append('g').attr('id', 'g_axis');
      svg.append('g').attr('id', 'g_data');

      // create y axis labels
      var labels = svg.select('#g_axis').selectAll('text')
          .data(dataset.slice(startSet, endSet))
          .enter();

      // text labels
      labels.append('text')
          .attr('x', paddingLeft)
          .attr('y', lineSpacing + dataHeight / 2)
          .text(function (d) {
            if (!(d.measure_html != null)) {
              return d.measure;
            }
          })
          .attr('transform', function (d, i) {
            return 'translate(0,' + ((lineSpacing + dataHeight) * i) + ')';
          })
          .attr('class', function(d) {
            var returnCSSClass = 'ytitle';
            if (d.measure_url != null) {
              returnCSSClass = returnCSSClass + ' link';
            }
            return returnCSSClass;
          })
          .on('click', function(d) {
            if (d.measure_url != null) {
              return window.open(d.measure_url);
            }
            return null;
          });

      // HTML labels
      labels.append('foreignObject')
          .attr('x', paddingLeft)
          .attr('y', lineSpacing)
          .attr('transform', function (d, i) {
            return 'translate(0,' + ((lineSpacing + dataHeight) * i) + ')';
          })
          .attr('width', -1 * paddingLeft)
          .attr('height', dataHeight)
          .attr('class', 'ytitle')
          .html(function(d) {
            if (d.measure_html != null) {
              return d.measure_html;
            }
          });

      // create vertical grid
      if (noOfDatasets) {
        svg.select('#g_axis').selectAll('line.vert_grid').data(xScale.ticks())
            .enter()
            .append('line')
            .attr({
              'class': 'vert_grid',
              'x1': function (d) {
                return xScale(d);
              },
              'x2': function (d) {
                return xScale(d);
              },
              'y1': 0,
              'y2': dataHeight * noOfDatasets + lineSpacing * noOfDatasets - 1 + paddingBottom
            });
      }

      // create horizontal grid
      svg.select('#g_axis').selectAll('line.horz_grid').data(dataset)
          .enter()
          .append('line')
          .attr({
            'class': 'horz_grid',
            'x1': 0,
            'x2': width,
            'y1': function (d, i) {
              return ((lineSpacing + dataHeight) * i) + lineSpacing + dataHeight / 2;
            },
            'y2': function (d, i) {
              return ((lineSpacing + dataHeight) * i) + lineSpacing + dataHeight / 2;
            }
          });

      // create x axis
      if (noOfDatasets) {
        svg.select('#g_axis').append('g')
            .attr('class', 'axis')
            .call(xAxis);
      }

      // make y groups for different data series
      var g = svg.select('#g_data').selectAll('.g_data')
          .data(dataset.slice(startSet, endSet))
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
            return 'translate(0,' + ((lineSpacing + dataHeight) * i) + ')';
          })
          .attr('class', 'dataset');

      // add data series
      g.selectAll('rect')
          .data(function (d) {
            return d.disp_data;
          })
          .enter()
          .append('rect')
          .attr('x', function (d) {
            return xScale(d[0]);
          })
          .attr('y', lineSpacing)
          .attr('width', function (d) {
            return (xScale(d[2]) - xScale(d[0]));
          })
          .attr('height', dataHeight)
          .attr('class', function (d) {
            if (customCategories) {
              var series = dataset.filter(
                  function(series) {
                    return series.disp_data.indexOf(d) >= 0;
                  }
              )[0];
              if (series && series.categories) {
                d3.select(this).attr('fill', series.categories[d[1]].color);
                return '';
              }
            } else {
              if (d[1] === 1) {
                // data available
                return 'rect_has_data';
              } else {
                // no data available
                return 'rect_has_no_data';
              }
            }
          })
          .on('mouseover', function (d, i) {
            var matrix = this.getScreenCTM().translate(+this.getAttribute('x'), +this.getAttribute('y'));
            div.transition()
                .duration(200)
                .style('opacity', 0.9);
            div.html(function () {
              var output = '';
              if (customCategories) {
                // custom categories: display category name
                output = '&nbsp;' + d[1] + '&nbsp;';
              } else {
                if (d[1] === 1) {
                  // checkmark icon
                  output = '<i class="fa fa-fw fa-check tooltip_has_data"></i>';
                } else {
                  // cross icon
                  output = '<i class="fa fa-fw fa-times tooltip_has_no_data"></i>';
                }
              }
              if (isDateOnlyFormat) {
                if (d[2] > d3.time.second.offset(d[0], 86400)) {
                  return output + moment(parseDate(d[0])).format('l')
                      + ' - ' + moment(parseDate(d[2])).format('l');
                }
                return output + moment(parseDate(d[0])).format('l');
              } else {
                if (d[2] > d3.time.second.offset(d[0], 86400)) {
                  return output + moment(parseDateTime(d[0])).format('l') + ' '
                      + moment(parseDateTime(d[0])).format('LTS') + ' - '
                      + moment(parseDateTime(d[2])).format('l') + ' '
                      + moment(parseDateTime(d[2])).format('LTS');
                }
                return output + moment(parseDateTime(d[0])).format('LTS') + ' - '
                    + moment(parseDateTime(d[2])).format('LTS');
              }
            })
            .style('left', function () {
              return window.pageXOffset + matrix.e + 'px';
            })
            .style('top', function () {
              return window.pageYOffset + matrix.f - 11 + 'px';
            })
            .style('height', dataHeight + 11 + 'px');
          })
          .on('mouseout', function () {
            div.transition()
                .duration(500)
                .style('opacity', 0);
          });

      // rework ticks and grid for better visual structure
      function isYear(t) {
        return +t === +(new Date(t.getFullYear(), 0, 1, 0, 0, 0));
      }

      function isMonth(t) {
        return +t === +(new Date(t.getFullYear(), t.getMonth(), 1, 0, 0, 0));
      }

      var xTicks = xScale.ticks();
      var isYearTick = xTicks.map(isYear);
      var isMonthTick = xTicks.map(isMonth);
      // year emphasis
      // ensure year emphasis is only active if years are the biggest clustering unit
      if (emphasizeYearTicks
          && !(isYearTick.every(function (d) { return d === true; }))
          && isMonthTick.every(function (d) { return d === true; })) {
        d3.selectAll('g.tick').each(function (d, i) {
          if (isYearTick[i]) {
            d3.select(this)
                .attr({
                  'class': 'x_tick_emph',
                });
          }
        });
        d3.selectAll('.vert_grid').each(function (d, i) {
          if (isYearTick[i]) {
            d3.select(this)
                .attr({
                  'class': 'vert_grid_emph',
                });
          }
        });
      }

      // create title
      if (drawTitle) {
        svg.select('#g_title')
            .append('text')
            .attr('x', paddingLeft)
            .attr('y', paddingTopHeading)
            .text('Data Availability Plot')
            .attr('class', 'heading');
      }

      // create subtitle
      var subtitleText = '';
      if (noOfDatasets) {
        if (isDateOnlyFormat) {
          subtitleText = 'from ' + moment(parseDate(startDate)).format('MMMM Y') + ' to '
              + moment(parseDate(endDate)).format('MMMM Y');
        } else {
          subtitleText = 'from ' + moment(parseDateTime(startDate)).format('l') + ' '
              + moment(parseDateTime(startDate)).format('LTS') + ' to '
              + moment(parseDateTime(endDate)).format('l') + ' '
              + moment(parseDateTime(endDate)).format('LTS');
        }
      }

      svg.select('#g_title')
          .append('text')
          .attr('x', paddingLeft)
          .attr('y', paddingTopHeading + 17)
          .text(subtitleText)
          .attr('class', 'subheading');

      // create legend
      if (!customCategories) {
        var legend = svg.select('#g_title')
            .append('g')
            .attr('id', 'g_legend')
            .attr('transform', 'translate(0,-12)');

        legend.append('rect')
            .attr('x', width + margin.right - 150)
            .attr('y', paddingTopHeading)
            .attr('height', 15)
            .attr('width', 15)
            .attr('class', 'rect_has_data');

        legend.append('text')
            .attr('x', width + margin.right - 150 + 20)
            .attr('y', paddingTopHeading + 8.5)
            .text('Data available')
            .attr('class', 'legend');

        legend.append('rect')
            .attr('x', width + margin.right - 150)
            .attr('y', paddingTopHeading + 17)
            .attr('height', 15)
            .attr('width', 15)
            .attr('class', 'rect_has_no_data');

        legend.append('text')
            .attr('x', width + margin.right - 150 + 20)
            .attr('y', paddingTopHeading + 8.5 + 15 + 2)
            .text('No data available')
            .attr('class', 'legend');
      }
    });
  }

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.drawTitle = function (_) {
    if (!arguments.length) return drawTitle;
    drawTitle = _;
    return chart;
  };

  chart.maxDisplayDatasets = function (_) {
    if (!arguments.length) return maxDisplayDatasets;
    maxDisplayDatasets = _;
    return chart;
  };

  chart.curDisplayFirstDataset = function (_) {
    if (!arguments.length) return curDisplayFirstDataset;
    curDisplayFirstDataset = _;
    return chart;
  };

  chart.displayDateRange = function (_) {
    if (!arguments.length) return displayDateRange;
    displayDateRange = _;
    return chart;
  };

  chart.emphasizeYearTicks = function (_) {
    if (!arguments.length) return emphasizeYearTicks;
    emphasizeYearTicks = _;
    return chart;
  };

  return chart;
}

var dataset = [{
        "measure": "Balance Sheet",
        "interval_s": 3 * 30.5 * 24 * 60 * 60,
        "data": [
            ["2015-03-31", 0],
            ["2015-06-30", 1],
            ["2015-09-30", 1],
            ["2015-12-31", 1],
            ["2016-03-31", 1],
            ["2016-06-30", 1],
            ["2016-09-30", 1],
            ["2016-12-31", 1],
            ["2017-03-31", 0],
            ["2017-06-30", 1],
            ["2017-09-30", 1],
            ["2017-12-31", 1],
            ["2018-03-31", 1],
            ["2018-06-30", 1],
            ["2018-09-30", 1]
        ]
    }, {
        "measure": "Closing Price",
        "interval_s": 24 * 60 * 60,
        "data": [
            ["2016-01-01", 1],
            ["2016-01-02", 1],
            ["2016-01-03", 1],
            ["2016-01-04", 1],
            ["2016-01-05", 1],
            ["2016-01-06", 1],
            ["2016-01-07", 1],
            ["2016-01-08", 1],
            ["2016-01-09", 1],
            ["2016-01-10", 1],
            ["2016-01-11", 1],
            ["2016-01-12", 1],
            ["2016-01-13", 1],
            ["2016-01-14", 1],
            ["2016-01-15", 1],
            ["2016-01-16", 1],
            ["2016-01-17", 1],
            ["2016-01-18", 1],
            ["2016-01-19", 1],
            ["2016-01-20", 1],
            ["2016-01-21", 1],
            ["2016-01-22", 1],
            ["2016-01-23", 1],
            ["2016-01-24", 1],
            ["2016-01-25", 1],
            ["2016-01-26", 1],
            ["2016-01-27", 1],
            ["2016-01-28", 1],
            ["2016-01-29", 1],
            ["2016-01-30", 1],
            ["2016-01-31", 1],
            ["2016-02-01", 1],
            ["2016-02-02", 1],
            ["2016-02-03", 1],
            ["2016-02-04", 1],
            ["2016-02-05", 1],
            ["2016-02-06", 1],
            ["2016-02-07", 1],
            ["2016-02-08", 1],
            ["2016-02-09", 1],
            ["2016-02-10", 1],
            ["2016-02-11", 1],
            ["2016-02-12", 1],
            ["2016-02-13", 0],
            ["2016-02-14", 1],
            ["2016-02-15", 1],
            ["2016-02-16", 1],
            ["2016-02-17", 1],
            ["2016-02-18", 1],
            ["2016-02-19", 1],
            ["2016-02-20", 1],
            ["2016-02-21", 1],
            ["2016-02-22", 1],
            ["2016-02-23", 1],
            ["2016-02-24", 1],
            ["2016-02-25", 1],
            ["2016-02-26", 1],
            ["2016-02-27", 1],
            ["2016-02-28", 1],
            ["2016-02-29", 0],
            ["2016-03-01", 1],
            ["2016-03-02", 1],
            ["2016-03-03", 1],
            ["2016-03-04", 1],
            ["2016-03-05", 1],
            ["2016-03-06", 1],
            ["2016-03-07", 1],
            ["2016-03-08", 1],
            ["2016-03-09", 1],
            ["2016-03-10", 1],
            ["2016-03-11", 1],
            ["2016-03-12", 1],
            ["2016-03-13", 1],
            ["2016-03-14", 1],
            ["2016-03-15", 1],
            ["2016-03-16", 1],
            ["2016-03-17", 1],
            ["2016-03-18", 1],
            ["2016-03-19", 1],
            ["2016-03-20", 1],
            ["2016-03-21", 1],
            ["2016-03-22", 1],
            ["2016-03-23", 1],
            ["2016-03-24", 1],
            ["2016-03-25", 1],
            ["2016-03-26", 1],
            ["2016-03-27", 1],
            ["2016-03-28", 1],
            ["2016-03-29", 1],
            ["2016-03-30", 1],
            ["2016-03-31", 1],
            ["2016-04-01", 1],
            ["2016-04-02", 1],
            ["2016-04-03", 1],
            ["2016-04-04", 1],
            ["2016-04-05", 1],
            ["2016-04-06", 1],
            ["2016-04-07", 1],
            ["2016-04-08", 1],
            ["2016-04-09", 1],
            ["2016-04-10", 1],
            ["2016-04-11", 1],
            ["2016-04-12", 1],
            ["2016-04-13", 1],
            ["2016-04-14", 1],
            ["2016-04-15", 1],
            ["2016-04-16", 1],
            ["2016-04-17", 0],
            ["2016-04-18", 1],
            ["2016-04-19", 1],
            ["2016-04-20", 1],
            ["2016-04-21", 1],
            ["2016-04-22", 0],
            ["2016-04-23", 1],
            ["2016-04-24", 1],
            ["2016-04-25", 1],
            ["2016-04-26", 1],
            ["2016-04-27", 1],
            ["2016-04-28", 1],
            ["2016-04-29", 1],
            ["2016-04-30", 1],
            ["2016-05-01", 1],
            ["2016-05-02", 1],
            ["2016-05-03", 1],
            ["2016-05-04", 1],
            ["2016-05-05", 1],
            ["2016-05-06", 1],
            ["2016-05-07", 1],
            ["2016-05-08", 1],
            ["2016-05-09", 1],
            ["2016-05-10", 1],
            ["2016-05-11", 1],
            ["2016-05-12", 0],
            ["2016-05-13", 1],
            ["2016-05-14", 1],
            ["2016-05-15", 1],
            ["2016-05-16", 1],
            ["2016-05-17", 1],
            ["2016-05-18", 1],
            ["2016-05-19", 1],
            ["2016-05-20", 1],
            ["2016-05-21", 1],
            ["2016-05-22", 1],
            ["2016-05-23", 1],
            ["2016-05-24", 1],
            ["2016-05-25", 1],
            ["2016-05-26", 1],
            ["2016-05-27", 1],
            ["2016-05-28", 1],
            ["2016-05-29", 1],
            ["2016-05-30", 1],
            ["2016-05-31", 1],
            ["2016-06-01", 1],
            ["2016-06-02", 1],
            ["2016-06-03", 1],
            ["2016-06-04", 0],
            ["2016-06-05", 0],
            ["2016-06-06", 1],
            ["2016-06-07", 1],
            ["2016-06-08", 1],
            ["2016-06-09", 1],
            ["2016-06-10", 1],
            ["2016-06-11", 1],
            ["2016-06-12", 1],
            ["2016-06-13", 0],
            ["2016-06-14", 1],
            ["2016-06-15", 1],
            ["2016-06-16", 1],
            ["2016-06-17", 1],
            ["2016-06-18", 1],
            ["2016-06-19", 1],
            ["2016-06-20", 1],
            ["2016-06-21", 0],
            ["2016-06-22", 1],
            ["2016-06-23", 1],
            ["2016-06-24", 1],
            ["2016-06-25", 1],
            ["2016-06-26", 1],
            ["2016-06-27", 1],
            ["2016-06-28", 0],
            ["2016-06-29", 1],
            ["2016-06-30", 1],
            ["2016-07-01", 1],
            ["2016-07-02", 1],
            ["2016-07-03", 1],
            ["2016-07-04", 1],
            ["2016-07-05", 1],
            ["2016-07-06", 1],
            ["2016-07-07", 1],
            ["2016-07-08", 1],
            ["2016-07-09", 1],
            ["2016-07-10", 1],
            ["2016-07-11", 1],
            ["2016-07-12", 1],
            ["2016-07-13", 1],
            ["2016-07-14", 1],
            ["2016-07-15", 1],
            ["2016-07-16", 0],
            ["2016-07-17", 1],
            ["2016-07-18", 1],
            ["2016-07-19", 1],
            ["2016-07-20", 1],
            ["2016-07-21", 1],
            ["2016-07-22", 1],
            ["2016-07-23", 1],
            ["2016-07-24", 1],
            ["2016-07-25", 1],
            ["2016-07-26", 1],
            ["2016-07-27", 1],
            ["2016-07-28", 1],
            ["2016-07-29", 1],
            ["2016-07-30", 1],
            ["2016-07-31", 1],
            ["2016-08-01", 1],
            ["2016-08-02", 1],
            ["2016-08-03", 1],
            ["2016-08-04", 1],
            ["2016-08-05", 1],
            ["2016-08-06", 1],
            ["2016-08-07", 1],
            ["2016-08-08", 1],
            ["2016-08-09", 1],
            ["2016-08-10", 1],
            ["2016-08-11", 1],
            ["2016-08-12", 1],
            ["2016-08-13", 1],
            ["2016-08-14", 1],
            ["2016-08-15", 1],
            ["2016-08-16", 1],
            ["2016-08-17", 1],
            ["2016-08-18", 1],
            ["2016-08-19", 1],
            ["2016-08-20", 1],
            ["2016-08-21", 1],
            ["2016-08-22", 1],
            ["2016-08-23", 1],
            ["2016-08-24", 1],
            ["2016-08-25", 1],
            ["2016-08-26", 1],
            ["2016-08-27", 1],
            ["2016-08-28", 1],
            ["2016-08-29", 1],
            ["2016-08-30", 1],
            ["2016-08-31", 1],
            ["2016-09-01", 1],
            ["2016-09-02", 1],
            ["2016-09-03", 1],
            ["2016-09-04", 1],
            ["2016-09-05", 1],
            ["2016-09-06", 1],
            ["2016-09-07", 1],
            ["2016-09-08", 1],
            ["2016-09-09", 1],
            ["2016-09-10", 1],
            ["2016-09-11", 1],
            ["2016-09-12", 1],
            ["2016-09-13", 1],
            ["2016-09-14", 1],
            ["2016-09-15", 1],
            ["2016-09-16", 1],
            ["2016-09-17", 1],
            ["2016-09-18", 1],
            ["2016-09-19", 1],
            ["2016-09-20", 1],
            ["2016-09-21", 1],
            ["2016-09-22", 1],
            ["2016-09-23", 1],
            ["2016-09-24", 1],
            ["2016-09-25", 1],
            ["2016-09-26", 1],
            ["2016-09-27", 1],
            ["2016-09-28", 1],
            ["2016-09-29", 1],
            ["2016-09-30", 1],
            ["2016-10-01", 1],
            ["2016-10-02", 1],
            ["2016-10-03", 1],
            ["2016-10-04", 1],
            ["2016-10-05", 1],
            ["2016-10-06", 1],
            ["2016-10-07", 1],
            ["2016-10-08", 1],
            ["2016-10-09", 1],
            ["2016-10-10", 1],
            ["2016-10-11", 1],
            ["2016-10-12", 1],
            ["2016-10-13", 1],
            ["2016-10-14", 1],
            ["2016-10-15", 1],
            ["2016-10-16", 1],
            ["2016-10-17", 1],
            ["2016-10-18", 1],
            ["2016-10-19", 1],
            ["2016-10-20", 1],
            ["2016-10-21", 1],
            ["2016-10-22", 1],
            ["2016-10-23", 1],
            ["2016-10-24", 1],
            ["2016-10-25", 1],
            ["2016-10-26", 1],
            ["2016-10-27", 1],
            ["2016-10-28", 1],
            ["2016-10-29", 1],
            ["2016-10-30", 0],
            ["2016-10-31", 1],
            ["2016-11-01", 1],
            ["2016-11-02", 1],
            ["2016-11-03", 1],
            ["2016-11-04", 1],
            ["2016-11-05", 1],
            ["2016-11-06", 1],
            ["2016-11-07", 1],
            ["2016-11-08", 1],
            ["2016-11-09", 1],
            ["2016-11-10", 1],
            ["2016-11-11", 1],
            ["2016-11-12", 1],
            ["2016-11-13", 1],
            ["2016-11-14", 1],
            ["2016-11-15", 1],
            ["2016-11-16", 1],
            ["2016-11-17", 1],
            ["2016-11-18", 1],
            ["2016-11-19", 1],
            ["2016-11-20", 1],
            ["2016-11-21", 1],
            ["2016-11-22", 1],
            ["2016-11-23", 1],
            ["2016-11-24", 1],
            ["2016-11-25", 1],
            ["2016-11-26", 1],
            ["2016-11-27", 1],
            ["2016-11-28", 1],
            ["2016-11-29", 0],
            ["2016-11-30", 1],
            ["2016-12-01", 1],
            ["2016-12-02", 1],
            ["2016-12-03", 1],
            ["2016-12-04", 1],
            ["2016-12-05", 1],
            ["2016-12-06", 1],
            ["2016-12-07", 1],
            ["2016-12-08", 1],
            ["2016-12-09", 0],
            ["2016-12-10", 1],
            ["2016-12-11", 1],
            ["2016-12-12", 1],
            ["2016-12-13", 1],
            ["2016-12-14", 1],
            ["2016-12-15", 1],
            ["2016-12-16", 1],
            ["2016-12-17", 1],
            ["2016-12-18", 1],
            ["2016-12-19", 1],
            ["2016-12-20", 1],
            ["2016-12-21", 1],
            ["2016-12-22", 1],
            ["2016-12-23", 1],
            ["2016-12-24", 1],
            ["2016-12-25", 1],
            ["2016-12-26", 1],
            ["2016-12-27", 1],
            ["2016-12-28", 1],
            ["2016-12-29", 1],
            ["2016-12-30", 0],
            ["2016-12-31", 1],
            ["2017-01-01", 1],
            ["2017-01-02", 1],
            ["2017-01-03", 1],
            ["2017-01-04", 0],
            ["2017-01-05", 0],
            ["2017-01-06", 1],
            ["2017-01-07", 1],
            ["2017-01-08", 1],
            ["2017-01-09", 1],
            ["2017-01-10", 1],
            ["2017-01-11", 1],
            ["2017-01-12", 1],
            ["2017-01-13", 1],
            ["2017-01-14", 1],
            ["2017-01-15", 1],
            ["2017-01-16", 1],
            ["2017-01-17", 1],
            ["2017-01-18", 1],
            ["2017-01-19", 1],
            ["2017-01-20", 1],
            ["2017-01-21", 1],
            ["2017-01-22", 1],
            ["2017-01-23", 1],
            ["2017-01-24", 1],
            ["2017-01-25", 1],
            ["2017-01-26", 1],
            ["2017-01-27", 1],
            ["2017-01-28", 1],
            ["2017-01-29", 0],
            ["2017-01-30", 1],
            ["2017-01-31", 1],
            ["2017-02-01", 1],
            ["2017-02-02", 0],
            ["2017-02-03", 1],
            ["2017-02-04", 1],
            ["2017-02-05", 1],
            ["2017-02-06", 1],
            ["2017-02-07", 1],
            ["2017-02-08", 1],
            ["2017-02-09", 0],
            ["2017-02-10", 1],
            ["2017-02-11", 1],
            ["2017-02-12", 1],
            ["2017-02-13", 1],
            ["2017-02-14", 1],
            ["2017-02-15", 1],
            ["2017-02-16", 1],
            ["2017-02-17", 1],
            ["2017-02-18", 1],
            ["2017-02-19", 1],
            ["2017-02-20", 1],
            ["2017-02-21", 1],
            ["2017-02-22", 1],
            ["2017-02-23", 1],
            ["2017-02-24", 1],
            ["2017-02-25", 1],
            ["2017-02-26", 1],
            ["2017-02-27", 1],
            ["2017-02-28", 0],
            ["2017-03-01", 1],
            ["2017-03-02", 1],
            ["2017-03-03", 1],
            ["2017-03-04", 1],
            ["2017-03-05", 1],
            ["2017-03-06", 0],
            ["2017-03-07", 1],
            ["2017-03-08", 1],
            ["2017-03-09", 1],
            ["2017-03-10", 1],
            ["2017-03-11", 1],
            ["2017-03-12", 1],
            ["2017-03-13", 1],
            ["2017-03-14", 0],
            ["2017-03-15", 1],
            ["2017-03-16", 1],
            ["2017-03-17", 1],
            ["2017-03-18", 1],
            ["2017-03-19", 1],
            ["2017-03-20", 1],
            ["2017-03-21", 1],
            ["2017-03-22", 1],
            ["2017-03-23", 1],
            ["2017-03-24", 1],
            ["2017-03-25", 1],
            ["2017-03-26", 1],
            ["2017-03-27", 1],
            ["2017-03-28", 1],
            ["2017-03-29", 1],
            ["2017-03-30", 1],
            ["2017-03-31", 0],
            ["2017-04-01", 1],
            ["2017-04-02", 0],
            ["2017-04-03", 1],
            ["2017-04-04", 1],
            ["2017-04-05", 1],
            ["2017-04-06", 1],
            ["2017-04-07", 1],
            ["2017-04-08", 1],
            ["2017-04-09", 1],
            ["2017-04-10", 1],
            ["2017-04-11", 1],
            ["2017-04-12", 1],
            ["2017-04-13", 1],
            ["2017-04-14", 1],
            ["2017-04-15", 1],
            ["2017-04-16", 1],
            ["2017-04-17", 1],
            ["2017-04-18", 1],
            ["2017-04-19", 0],
            ["2017-04-20", 1],
            ["2017-04-21", 1],
            ["2017-04-22", 1],
            ["2017-04-23", 1],
            ["2017-04-24", 1],
            ["2017-04-25", 1],
            ["2017-04-26", 1],
            ["2017-04-27", 1],
            ["2017-04-28", 1],
            ["2017-04-29", 1],
            ["2017-04-30", 1],
            ["2017-05-01", 1],
            ["2017-05-02", 1],
            ["2017-05-03", 1],
            ["2017-05-04", 1],
            ["2017-05-05", 1],
            ["2017-05-06", 1],
            ["2017-05-07", 1],
            ["2017-05-08", 1],
            ["2017-05-09", 1],
            ["2017-05-10", 1],
            ["2017-05-11", 0],
            ["2017-05-12", 1],
            ["2017-05-13", 1],
            ["2017-05-14", 1],
            ["2017-05-15", 1],
            ["2017-05-16", 1],
            ["2017-05-17", 1],
            ["2017-05-18", 1],
            ["2017-05-19", 1],
            ["2017-05-20", 1],
            ["2017-05-21", 1],
            ["2017-05-22", 1],
            ["2017-05-23", 1],
            ["2017-05-24", 1],
            ["2017-05-25", 1],
            ["2017-05-26", 1],
            ["2017-05-27", 1],
            ["2017-05-28", 1],
            ["2017-05-29", 1],
            ["2017-05-30", 1],
            ["2017-05-31", 1],
            ["2017-06-01", 1],
            ["2017-06-02", 1],
            ["2017-06-03", 1],
            ["2017-06-04", 1],
            ["2017-06-05", 1],
            ["2017-06-06", 1],
            ["2017-06-07", 1],
            ["2017-06-08", 1],
            ["2017-06-09", 1],
            ["2017-06-10", 1],
            ["2017-06-11", 1],
            ["2017-06-12", 1],
            ["2017-06-13", 1],
            ["2017-06-14", 1],
            ["2017-06-15", 1],
            ["2017-06-16", 1],
            ["2017-06-17", 1],
            ["2017-06-18", 1],
            ["2017-06-19", 1],
            ["2017-06-20", 1],
            ["2017-06-21", 1],
            ["2017-06-22", 1],
            ["2017-06-23", 1],
            ["2017-06-24", 1],
            ["2017-06-25", 1],
            ["2017-06-26", 1],
            ["2017-06-27", 1],
            ["2017-06-28", 1],
            ["2017-06-29", 1],
            ["2017-06-30", 1],
            ["2017-07-01", 1],
            ["2017-07-02", 1],
            ["2017-07-03", 1],
            ["2017-07-04", 1],
            ["2017-07-05", 1],
            ["2017-07-06", 1],
            ["2017-07-07", 1],
            ["2017-07-08", 1],
            ["2017-07-09", 1],
            ["2017-07-10", 1],
            ["2017-07-11", 1],
            ["2017-07-12", 1],
            ["2017-07-13", 0],
            ["2017-07-14", 1],
            ["2017-07-15", 1],
            ["2017-07-16", 1],
            ["2017-07-17", 1],
            ["2017-07-18", 1],
            ["2017-07-19", 1],
            ["2017-07-20", 1],
            ["2017-07-21", 1],
            ["2017-07-22", 1],
            ["2017-07-23", 1],
            ["2017-07-24", 1],
            ["2017-07-25", 1],
            ["2017-07-26", 1],
            ["2017-07-27", 1],
            ["2017-07-28", 1],
            ["2017-07-29", 1],
            ["2017-07-30", 1],
            ["2017-07-31", 1],
            ["2017-08-01", 1],
            ["2017-08-02", 1],
            ["2017-08-03", 1],
            ["2017-08-04", 1],
            ["2017-08-05", 1],
            ["2017-08-06", 1],
            ["2017-08-07", 1],
            ["2017-08-08", 1],
            ["2017-08-09", 1],
            ["2017-08-10", 0],
            ["2017-08-11", 1],
            ["2017-08-12", 1],
            ["2017-08-13", 1],
            ["2017-08-14", 1],
            ["2017-08-15", 1],
            ["2017-08-16", 1],
            ["2017-08-17", 1],
            ["2017-08-18", 1],
            ["2017-08-19", 1],
            ["2017-08-20", 1],
            ["2017-08-21", 1],
            ["2017-08-22", 1],
            ["2017-08-23", 1],
            ["2017-08-24", 1],
            ["2017-08-25", 1],
            ["2017-08-26", 1],
            ["2017-08-27", 1],
            ["2017-08-28", 0],
            ["2017-08-29", 1],
            ["2017-08-30", 1],
            ["2017-08-31", 1],
            ["2017-09-01", 1],
            ["2017-09-02", 1],
            ["2017-09-03", 1],
            ["2017-09-04", 1],
            ["2017-09-05", 1],
            ["2017-09-06", 1],
            ["2017-09-07", 1],
            ["2017-09-08", 1],
            ["2017-09-09", 1],
            ["2017-09-10", 1],
            ["2017-09-11", 1],
            ["2017-09-12", 1],
            ["2017-09-13", 1],
            ["2017-09-14", 1],
            ["2017-09-15", 1],
            ["2017-09-16", 0],
            ["2017-09-17", 1],
            ["2017-09-18", 1],
            ["2017-09-19", 1],
            ["2017-09-20", 1],
            ["2017-09-21", 1],
            ["2017-09-22", 1]
        ]
    }, {
        "measure": "Weekly Report",
        "interval_s": 7 * 24 * 60 * 60,
        "data": [
            ["2014-07-07", 1],
            ["2014-07-14", 1],
            ["2014-07-21", 1],
            ["2014-07-28", 1],
            ["2014-08-04", 1],
            ["2014-08-11", 0],
            ["2014-08-18", 1],
            ["2014-08-25", 0],
            ["2014-09-01", 1],
            ["2014-09-08", 1],
            ["2014-09-15", 1],
            ["2014-09-22", 1],
            ["2014-09-29", 0],
            ["2014-10-06", 1],
            ["2014-10-13", 0],
            ["2014-10-20", 1],
            ["2014-10-27", 1],
            ["2014-11-03", 1],
            ["2014-11-10", 1],
            ["2014-11-17", 1],
            ["2014-11-24", 1],
            ["2014-12-01", 1],
            ["2014-12-08", 1],
            ["2014-12-15", 0],
            ["2014-12-22", 1],
            ["2014-12-29", 1],
            ["2015-01-05", 0],
            ["2015-01-12", 1],
            ["2015-01-19", 1],
            ["2015-01-26", 0],
            ["2015-02-02", 1],
            ["2015-02-09", 0],
            ["2015-02-16", 1],
            ["2015-02-23", 1],
            ["2015-03-02", 1],
            ["2015-03-09", 1],
            ["2015-03-16", 1],
            ["2015-03-23", 1],
            ["2015-03-30", 1],
            ["2015-04-06", 1],
            ["2015-04-13", 0],
            ["2015-04-20", 1],
            ["2015-04-27", 0],
            ["2015-05-04", 1],
            ["2015-05-11", 1],
            ["2015-05-18", 1],
            ["2015-05-25", 0],
            ["2015-06-01", 1],
            ["2015-06-08", 0],
            ["2015-06-15", 1],
            ["2015-06-22", 1],
            ["2015-06-29", 1],
            ["2015-07-06", 1],
            ["2015-07-13", 1],
            ["2015-07-20", 1],
            ["2015-07-27", 0],
            ["2015-08-03", 1],
            ["2015-08-10", 1],
            ["2015-08-17", 1],
            ["2015-08-24", 1],
            ["2015-08-31", 1],
            ["2015-09-07", 1],
            ["2015-09-14", 1],
            ["2015-09-21", 1],
            ["2015-09-28", 1],
            ["2015-10-05", 1],
            ["2015-10-12", 1],
            ["2015-10-19", 1],
            ["2015-10-26", 1],
            ["2015-11-02", 1],
            ["2015-11-09", 0],
            ["2015-11-16", 1],
            ["2015-11-23", 1],
            ["2015-11-30", 1],
            ["2015-12-07", 1],
            ["2015-12-14", 1],
            ["2015-12-21", 1],
            ["2015-12-28", 1],
            ["2016-01-04", 1],
            ["2016-01-11", 1],
            ["2016-01-18", 0],
            ["2016-01-25", 1],
            ["2016-02-01", 1],
            ["2016-02-08", 1],
            ["2016-02-15", 1],
            ["2016-02-22", 1],
            ["2016-02-29", 1],
            ["2016-03-07", 1],
            ["2016-03-14", 0],
            ["2016-03-21", 1],
            ["2016-03-28", 1],
            ["2016-04-04", 1],
            ["2016-04-11", 0],
            ["2016-04-18", 1],
            ["2016-04-25", 1],
            ["2016-05-02", 1],
            ["2016-05-09", 1],
            ["2016-05-16", 1],
            ["2016-05-23", 1],
            ["2016-05-30", 0],
            ["2016-06-06", 1],
            ["2016-06-13", 0],
            ["2016-06-20", 1],
            ["2016-06-27", 1],
            ["2016-07-04", 1],
            ["2016-07-11", 1],
            ["2016-07-18", 0],
            ["2016-07-25", 1],
            ["2016-08-01", 1],
            ["2016-08-08", 1],
            ["2016-08-15", 0],
            ["2016-08-22", 1],
            ["2016-08-29", 1],
            ["2016-09-05", 1],
            ["2016-09-12", 1],
            ["2016-09-19", 0],
            ["2016-09-26", 1],
            ["2016-10-03", 1],
            ["2016-10-10", 0],
            ["2016-10-17", 1],
            ["2016-10-24", 1],
            ["2016-10-31", 1],
            ["2016-11-07", 1],
            ["2016-11-14", 0],
            ["2016-11-21", 1],
            ["2016-11-28", 1],
            ["2016-12-05", 0],
            ["2016-12-12", 1],
            ["2016-12-19", 1],
            ["2016-12-26", 1],
            ["2017-01-02", 1],
            ["2017-01-09", 0],
            ["2017-01-16", 1],
            ["2017-01-23", 0],
            ["2017-01-30", 1],
            ["2017-02-06", 1],
            ["2017-02-13", 1],
            ["2017-02-20", 1],
            ["2017-02-27", 1],
            ["2017-03-06", 1],
            ["2017-03-13", 1],
            ["2017-03-20", 1],
            ["2017-03-27", 0],
            ["2017-04-03", 1],
            ["2017-04-10", 1],
            ["2017-04-17", 1],
            ["2017-04-24", 1],
            ["2017-05-01", 1],
            ["2017-05-08", 1],
            ["2017-05-15", 0],
            ["2017-05-22", 0],
            ["2017-05-29", 1],
            ["2017-06-05", 0],
            ["2017-06-12", 1],
            ["2017-06-19", 1],
            ["2017-06-26", 1],
            ["2017-07-03", 1],
            ["2017-07-10", 0],
            ["2017-07-17", 1],
            ["2017-07-24", 1],
            ["2017-07-31", 1],
            ["2017-08-07", 0],
            ["2017-08-14", 1],
            ["2017-08-21", 1],
            ["2017-08-28", 1],
            ["2017-09-04", 1],
            ["2017-09-11", 1],
            ["2017-09-18", 1],
            ["2017-09-25", 1],
            ["2017-10-02", 0],
            ["2017-10-09", 1],
            ["2017-10-16", 1],
            ["2017-10-23", 1],
            ["2017-10-30", 1],
            ["2017-11-06", 1],
            ["2017-11-13", 0],
            ["2017-11-20", 1],
            ["2017-11-27", 0],
            ["2017-12-04", 1],
            ["2017-12-11", 1],
            ["2017-12-18", 1],
            ["2017-12-25", 1],
            ["2018-01-01", 1],
            ["2018-01-08", 1],
            ["2018-01-15", 0],
            ["2018-01-22", 1],
            ["2018-01-29", 1],
            ["2018-02-05", 1],
            ["2018-02-12", 0],
            ["2018-02-19", 1],
            ["2018-02-26", 1],
            ["2018-03-05", 1],
            ["2018-03-12", 1],
            ["2018-03-19", 1],
            ["2018-03-26", 1],
            ["2018-04-02", 0],
            ["2018-04-09", 1],
            ["2018-04-16", 1],
            ["2018-04-23", 1],
            ["2018-04-30", 1],
            ["2018-05-07", 0],
            ["2018-05-14", 1],
            ["2018-05-21", 1],
            ["2018-05-28", 0],
            ["2018-06-04", 1],
            ["2018-06-11", 1],
            ["2018-06-18", 0],
            ["2018-06-25", 1],
            ["2018-07-02", 0],
            ["2018-07-09", 1],
            ["2018-07-16", 1],
            ["2018-07-23", 1],
            ["2018-07-30", 0],
            ["2018-08-06", 1],
            ["2018-08-13", 1],
            ["2018-08-20", 1],
            ["2018-08-27", 1],
            ["2018-09-03", 1],
            ["2018-09-10", 1],
            ["2018-09-17", 1],
            ["2018-09-24", 1],
            ["2018-10-01", 1],
            ["2018-10-08", 0],
            ["2018-10-15", 1],
            ["2018-10-22", 0]
        ]
    }, {
        "measure": "Analyst Data",
        "interval_s": 7 * 24 * 60 * 60,
        "data": [
            ["2014-06-28", 1],
            ["2014-07-05", 1],
            ["2014-07-12", 1],
            ["2014-07-19", 1],
            ["2014-07-26", 1],
            ["2014-08-02", 1],
            ["2014-08-09", 1],
            ["2014-08-16", 1],
            ["2014-08-23", 1],
            ["2014-08-30", 1],
            ["2014-09-06", 1],
            ["2014-09-13", 1],
            ["2014-09-20", 1],
            ["2014-09-27", 1],
            ["2014-10-04", 1],
            ["2014-10-11", 1],
            ["2014-10-18", 1],
            ["2014-10-25", 1],
            ["2014-11-01", 1],
            ["2014-11-08", 1],
            ["2014-11-15", 1],
            ["2014-11-22", 1],
            ["2014-11-29", 1],
            ["2014-12-06", 1],
            ["2014-12-13", 1],
            ["2014-12-20", 1],
            ["2014-12-27", 1],
            ["2015-01-03", 1],
            ["2015-01-10", 1],
            ["2015-01-17", 1],
            ["2015-01-24", 1],
            ["2015-01-31", 1],
            ["2015-02-07", 0],
            ["2015-02-14", 1],
            ["2015-02-21", 0],
            ["2015-02-28", 0],
            ["2015-03-07", 1],
            ["2015-03-14", 0],
            ["2015-03-21", 1],
            ["2015-03-28", 1],
            ["2015-04-04", 1],
            ["2015-04-11", 1],
            ["2015-04-18", 1],
            ["2015-04-25", 1],
            ["2015-05-02", 1],
            ["2015-05-09", 1],
            ["2015-05-16", 1],
            ["2015-05-23", 1],
            ["2015-05-30", 0],
            ["2015-06-06", 1],
            ["2015-06-13", 1],
            ["2015-06-20", 1],
            ["2015-06-27", 1],
            ["2015-07-04", 1],
            ["2015-07-11", 1],
            ["2015-07-18", 1],
            ["2015-07-25", 1],
            ["2015-08-01", 1],
            ["2015-08-08", 1],
            ["2015-08-15", 1],
            ["2015-08-22", 1],
            ["2015-08-29", 1],
            ["2015-09-05", 0],
            ["2015-09-12", 1],
            ["2015-09-19", 0],
            ["2015-09-26", 1],
            ["2015-10-03", 1],
            ["2015-10-10", 1],
            ["2015-10-17", 1],
            ["2015-10-24", 1],
            ["2015-10-31", 1],
            ["2015-11-07", 0],
            ["2015-11-14", 1],
            ["2015-11-21", 1],
            ["2015-11-28", 1],
            ["2015-12-05", 1],
            ["2015-12-12", 1],
            ["2015-12-19", 1],
            ["2015-12-26", 1],
            ["2016-01-02", 1],
            ["2016-01-09", 1],
            ["2016-01-16", 1],
            ["2016-01-23", 1],
            ["2016-01-30", 1],
            ["2016-02-06", 1],
            ["2016-02-13", 1],
            ["2016-02-20", 1],
            ["2016-02-27", 1],
            ["2016-03-05", 1],
            ["2016-03-12", 1],
            ["2016-03-19", 1],
            ["2016-03-26", 1],
            ["2016-04-02", 1],
            ["2016-04-09", 1],
            ["2016-04-16", 1],
            ["2016-04-23", 1],
            ["2016-04-30", 1],
            ["2016-05-07", 1],
            ["2016-05-14", 1],
            ["2016-05-21", 1],
            ["2016-05-28", 1],
            ["2016-06-04", 1],
            ["2016-06-11", 1],
            ["2016-06-18", 1],
            ["2016-06-25", 1],
            ["2016-07-02", 1],
            ["2016-07-09", 1],
            ["2016-07-16", 1],
            ["2016-07-23", 1],
            ["2016-07-30", 1],
            ["2016-08-06", 1],
            ["2016-08-13", 1],
            ["2016-08-20", 1],
            ["2016-08-27", 1],
            ["2016-09-03", 1],
            ["2016-09-10", 1],
            ["2016-09-17", 1],
            ["2016-09-24", 1],
            ["2016-10-01", 1],
            ["2016-10-08", 1],
            ["2016-10-15", 1],
            ["2016-10-22", 1],
            ["2016-10-29", 1],
            ["2016-11-05", 1],
            ["2016-11-12", 1],
            ["2016-11-19", 1],
            ["2016-11-26", 1],
            ["2016-12-03", 1],
            ["2016-12-10", 1],
            ["2016-12-17", 1],
            ["2016-12-24", 0],
            ["2016-12-31", 1],
            ["2017-01-07", 1],
            ["2017-01-14", 1],
            ["2017-01-21", 1],
            ["2017-01-28", 1],
            ["2017-02-04", 1],
            ["2017-02-11", 0],
            ["2017-02-18", 0],
            ["2017-02-25", 1],
            ["2017-03-04", 1],
            ["2017-03-11", 1],
            ["2017-03-18", 1],
            ["2017-03-25", 1],
            ["2017-04-01", 1],
            ["2017-04-08", 1],
            ["2017-04-15", 1],
            ["2017-04-22", 1],
            ["2017-04-29", 1],
            ["2017-05-06", 1],
            ["2017-05-13", 1],
            ["2017-05-20", 1],
            ["2017-05-27", 1],
            ["2017-06-03", 0],
            ["2017-06-10", 1],
            ["2017-06-17", 1],
            ["2017-06-24", 1],
            ["2017-07-01", 1],
            ["2017-07-08", 1],
            ["2017-07-15", 1],
            ["2017-07-22", 1],
            ["2017-07-29", 0],
            ["2017-08-05", 1],
            ["2017-08-12", 1],
            ["2017-08-19", 0],
            ["2017-08-26", 1],
            ["2017-09-02", 1],
            ["2017-09-09", 1],
            ["2017-09-16", 1],
            ["2017-09-23", 1],
            ["2017-09-30", 1],
            ["2017-10-07", 1],
            ["2017-10-14", 1],
            ["2017-10-21", 1],
            ["2017-10-28", 1],
            ["2017-11-04", 0],
            ["2017-11-11", 1],
            ["2017-11-18", 1],
            ["2017-11-25", 1],
            ["2017-12-02", 1],
            ["2017-12-09", 1],
            ["2017-12-16", 1],
            ["2017-12-23", 1],
            ["2017-12-30", 1],
            ["2018-01-06", 1],
            ["2018-01-13", 1],
            ["2018-01-20", 1],
            ["2018-01-27", 1],
            ["2018-02-03", 1],
            ["2018-02-10", 1],
            ["2018-02-17", 1],
            ["2018-02-24", 1],
            ["2018-03-03", 1],
            ["2018-03-10", 1],
            ["2018-03-17", 1],
            ["2018-03-24", 1],
            ["2018-03-31", 1],
            ["2018-04-07", 1],
            ["2018-04-14", 1],
            ["2018-04-21", 1],
            ["2018-04-28", 1],
            ["2018-05-05", 1],
            ["2018-05-12", 1],
            ["2018-05-19", 1],
            ["2018-05-26", 0],
            ["2018-06-02", 1],
            ["2018-06-09", 1],
            ["2018-06-16", 1],
            ["2018-06-23", 1],
            ["2018-06-30", 1],
            ["2018-07-07", 1],
            ["2018-07-14", 1],
            ["2018-07-21", 0],
            ["2018-07-28", 1],
            ["2018-08-04", 1],
            ["2018-08-11", 1],
            ["2018-08-18", 1],
            ["2018-08-25", 1],
            ["2018-09-01", 0],
            ["2018-09-08", 1],
            ["2018-09-15", 1],
            ["2018-09-22", 1],
            ["2018-09-29", 1],
            ["2018-10-06", 1],
            ["2018-10-13", 1],
            ["2018-10-20", 1],
            ["2018-10-27", 1],
            ["2018-11-03", 1]
        ]
    }, {
        "measure": "Annual Report",
        "interval_s": 365 * 24 * 60 * 60,
        "data": [
            ["2015-01-01", 0],
            ["2016-01-01", 1],
            ["2017-01-01", 1],
            ["2018-01-01", 1]
        ]
    }];

var chart = visavailChart().width(800);

d3.select("#example")
        .datum(dataset)
        .call(chart);