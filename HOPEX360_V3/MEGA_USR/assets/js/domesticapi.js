Chart.pluginService.register({
	beforeDraw: function (chart) {
		if (chart.config.options.elements.center) {
			//Get ctx from string
			var ctx = chart.chart.ctx;

			//Get options from the center object in options
			var centerConfig = chart.config.options.elements.center;
			var fontStyle = centerConfig.fontStyle || 'Arial';
			var txt = centerConfig.text;
			var color = centerConfig.color || '#000';
			var sidePadding = centerConfig.sidePadding || 20;
			var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
			//Start with a base font of 30px
			ctx.font = "15px " + fontStyle;

			//Get the width of the string and also the width of the element minus 10 to give it 5px side padding
			var stringWidth = ctx.measureText('74%' + '\nAutomated').width;
			var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

			// Find out how much the font can grow in width.
			// stringWidth = ('74%' + '\nAutomated').length
			var widthRatio = elementWidth / stringWidth;
			var newFontSize = Math.floor(30 * widthRatio);
			var elementHeight = (chart.innerRadius * 2);

			// Pick a new font size so it will not be larger than the height of label.
			var fontSizeToUse = Math.min(newFontSize, elementHeight);

			//Set font settings to draw it correctly.
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
			var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
			ctx.font = fontSizeToUse + "px " + fontStyle;
			ctx.fillStyle = color;
			var linesArray = txt.split('\n');

			if (linesArray.length % 2 === 0) {
				var topLimit = centerY - Math.floor(linesArray.length / 2) * fontSizeToUse * 0.5;
			} else {
				if (linesArray.length === 1) {
					var topLimit = centerY;
				} else {
					var topLimit = centerY - Math.floor(linesArray.length / 2) * fontSizeToUse +
						0.5;
				}
			}

			var currentY = topLimit;

			//Draw text in center
			linesArray.forEach(function (eachLine, lineIndex) {
				var finalFontSize = lineIndex !== 0 ? 0.5 * fontSizeToUse : fontSizeToUse;
				ctx.font = finalFontSize + "px " + fontStyle;
				ctx.fillText(eachLine, centerX, currentY);
				currentY = lineIndex === 0 ? currentY + finalFontSize * 1.1 * (lineIndex + 1) : currentY + finalFontSize * (lineIndex + 1);

			});
		}
	}
});

function drawPieChart(chartId, pieData, colorsArray, chartLabels, innerText, showLabel, position, title, legendFunc) {
	var ctx = document.getElementById(chartId);
	var legendClickHandler = legendFunc == true ? newLegendClickHandler : oldLegendClickHandler;
	var myDoughnutChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			datasets: [{
				data: pieData,
				backgroundColor: colorsArray
			}],

			// These labels appear in the legend and in the tooltips when hovering different arcs
			labels: chartLabels,
		},
		options: {
			animation: {
				animateRotate: true,
				animateScale: true
			},
			plugins: {
				datalabels: {
					display: false
				}
			},
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				},
			},
			legend: {
				display: showLabel,
				position: position,
				labels: {
					usePointStyle: true
				},
				onClick: legendClickHandler
			},
			title: {
				display: false,
				text: title
			},
			onClick: function (evt, elements) {
				if (elements.length) {
                    var clickedItemIndex = elements[0]._index;
					var x = document.getElementsByClassName("popup_dash");
					var i;
					for (i = 0; i < x.length; i++) {
					  x[i].style.display = "none";
					} 
					var label = "";
					label = chartLabels[clickedItemIndex];
					var myNode = document.getElementById(chartId +  label);
					var popup = document.getElementById("popup");			
					if(!document.getElementById(chartId + label)){
						myNode.style.display = "block";
					} else { 
						myNode.style.display = "block";
						popup.style.display = "block";
					}
				}
				window.scrollTo(0,document.body.scrollHeight);
			},
			responsive: true,
			cutoutPercentage: 65,
			elements: {
				center: {
					text: innerText,
					color: '#000000', //Default black
					fontStyle: 'Helvetica', //Default Arial
					sidePadding: 0 //Default 20 (as a percentage)
				}
			}
		}
	});
}

var oldLegendClickHandler = function(e, legendItem) {
	var index = legendItem.index;
	var ci = this.chart;
	
	//var meta = ci.getDatasetMeta(index);
	var meta = ci.getDatasetMeta(0).data[index];

	// See controller.isDatasetVisible comment
	
	var nbTotal = 0;
	
    //meta.hidden = meta.hidden === null ? !meta.hidden : null;
	meta.hidden = meta.hidden === false ? true : false;
	
    // We hid a dataset ... rerender the chart
    ci.update();
}

var newLegendClickHandler = function(e, legendItem) {
	var index = legendItem.index;
	var ci = this.chart;
	
	//var meta = ci.getDatasetMeta(index);
	var meta = ci.getDatasetMeta(0).data[index];

	// See controller.isDatasetVisible comment
	
	var nbTotal = 0;
	
    //meta.hidden = meta.hidden === null ? !meta.hidden : null;
	meta.hidden = meta.hidden === false ? true : false;
	
	for (let i = 0; i < ci.getDatasetMeta(0).data.length; i++) {
		if (ci.getDatasetMeta(0).data[i].hidden === false) {
			nbTotal = nbTotal + ci.data.datasets[0].data[i];
		}
	}

	ci.options.elements.center.text = nbTotal + '\n' + ci.options.title.text;
	
    // We hid a dataset ... rerender the chart
    ci.update();
}

function getSum(total, num) {
	return total + num;
}

function enterCard(chartId, innerText, cardTextHead1, cardTextHead2, cardText1, cardText2) {
	document.write('<div class="ui feed">');
	document.write('<div class="event">');
	document.write('<div class="label" style="padding: 0 !important; width: 100 !important;">');
	document.write('<canvas id="' + chartId + '"/>');
	document.write('</div>');
	document.write('<div class="content" style="margin: auto;">');
	document.write('<div class="ui grid" style="width: 100%; display: table;">');
	document.write('<div style="padding: 2%; text-align: left; display: table-cell;">');
	document.write('<div class="summary" align="left">');
	document.write(cardTextHead1);
	document.write('</div>');
	document.write('</div>');
	document.write('<div style="padding: 2%; text-align: right; display: table-cell;">');
	document.write('<div class="summary">');
	document.write('<i>' + cardTextHead2 + '</i>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	document.write('<div class="ui grid" style="width: 100%; display: table;">');
	document.write('<div style="padding: 2%; text-align: left; display: table-cell;">');
	document.write('<div class="date">');
	document.write(cardText1);
	document.write('</div>');
	document.write('</div>');
	document.write('<div style="padding: 2%; text-align: right; display: table-cell;">');
	document.write('<div class="date">');
	document.write('<i>' + cardText2 + '</i>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');
	document.write('</div>');

	var possibleColors = ['#F72411', '#F0B303', '#F8F933', '#C7E128', '#60A72D'];
	var numberBrackets = [25, 50, 75, 100];
	if (innerText < 25) {
		var colorsArray = ['#F72411', '#BDC3C7'];
	} else if (innerText < 50) {
		var colorsArray = ['#F0B303', '#BDC3C7'];
	} else if (innerText < 75) {
		var colorsArray = ['#F8F933', '#BDC3C7'];
	} else if (innerText < 100) {
		var colorsArray = ['#C7E128', '#BDC3C7'];
	} else {
		var colorsArray = ['#60A72D', '#BDC3C7'];
	}
	drawPieChart(chartId, [innerText, (100 - innerText)], colorsArray, [], innerText + '%', false, 'top');
}

function processMaturityAssessment(newData) {
	var processModellingColors = ['#F5584B', '#FBC16E', '#FFE076', '#B5DA54', '#3AA946'];
	var tableData = [
		['Execution<img style="height: 1.5vh;" src="../standard/assets/img/right-arrow.svg"/><br/>Performance<img style="height: 1.5vh;" src="../standard/assets/img/down-arrow.svg"/>', 'Very low', 'Low', 'Medium', 'High', 'Very High'],
		['Very low'],
		['Low'],
		['Medium'],
		['High'],
		['Very High']
	];

	for (var a = 1; a < tableData.length; a++) {
		tableData[a] = tableData[a].concat(newData[a - 1]);
	}

	document.write('<table style="table-layout: fixed; width: 100%;">');
	for (var i = 0; i < tableData.length; i++) {
		document.write('<tr>');
		for (var j = 0; j < tableData[i].length; j++) {
			var backgroundColor = 'background-color: #FFFFFF';
			if ((i === 4 && j === 1) || (i === 5 && j === 1) || (i === 5 && j === 2)) {
				backgroundColor = 'background-color: ' + processModellingColors[0];
			} else if ((i === 2 && j === 1) || (i === 3 && j === 1) || (i === 3 && j === 2) || (i === 4 && j === 2) || (i === 5 && j === 4) || (i === 4 && j === 3) || (i === 5 && j === 3)) {
				backgroundColor = 'background-color: ' + processModellingColors[1];
			} else if ((i === 1 && j === 1) || (i === 1 && j === 2) || (i === 2 && j === 2) || (i === 2 && j === 3) || (i === 3 && j === 3) || (i === 3 && j === 4) || (i === 4 && j === 4) || (i === 4 && j === 5) || (i === 5 && j === 5)) {
				backgroundColor = 'background-color: ' + processModellingColors[2];
			} else if ((i === 1 && j === 3) || (i === 2 && j === 4) || (i === 3 && j === 5)) {
				backgroundColor = 'background-color: ' + processModellingColors[3];
			} else if ((i === 1 && j === 4) || (i === 1 && j === 5) || (i === 2 && j === 5)) {
				backgroundColor = 'background-color: ' + processModellingColors[4];
			}
			if (isNaN(tableData[i][j])) {
				document.write('<td style="text-align:center; font-size: 1.5vh; width: 16.67%;">');
				document.write(tableData[i][j]);
			} else {
				document.write('<td style="text-align:center; font-size: 2vh; width: 16.67%; ' + backgroundColor + ';">');
				if (tableData[i][j] === 0) {
					document.write('-');
				} else {
					document.write(tableData[i][j]);
				}
			}
			document.write('<td>');
		}
		document.write('</tr>');
	}
	document.write('</table>');
}


function giveMeGauge(elementName, gaugeValue, gaugeColors, gaugeBreaks) {
	var currentValue = 0;
	var gaugeLimits = [];
	var colorIndex = 0;
	var backgroundColors = [];
	while (currentValue <= gaugeBreaks.breaks[gaugeBreaks.breaks.length - 1]) {
		gaugeLimits.push(currentValue);
		if (gaugeBreaks.breaks[colorIndex] <= currentValue) {
			colorIndex++;
		}
		backgroundColors.push(gaugeColors[colorIndex]);
		currentValue += gaugeBreaks.intermediate;
	}
	var ctx = document.getElementById(elementName);
	var gaugeChart = new Chart(ctx, {
		type: "tsgauge",
		data: {
			datasets: [{
				backgroundColor: backgroundColors,
				borderWidth: 0,
				gaugeData: {
					value: gaugeValue,
					valueColor: "black",
					fontSize: 3
				},
				// showLabels: true,
				gaugeLimits: gaugeLimits
			}]
		},
		options: {
			events: [],
			showMarkers: true,
			plugins: {
				datalabels: {
					display: false
				}
			}
		}
	});
}

function drawBarChart(chartId, barData, colorsArray, chartLabels, innerText, showLabel, position, title, legendFunc) { 
	var ctx = document.getElementById(chartId);
	window.myBarChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: chartLabels,
			datasets: [{
				label: 'Number of Applications',
				data: barData,
				backgroundColor: '#5aa972',
				borderColor: '#5aa972',
				borderWidth: 1
			}]
		},
		options: {
			plugins: {
				datalabels: {
					display: true,
					anchor: 'end',
					align: 'right'
				}
			},
			onClick: function (evt, elements) {
				if (elements.length) {
					var clickedItemIndex = elements[0]._index;
					// console.log("elements[0]._index " + elements[0]._index);
					// console.log("elements " + elements[0]);
					var x = document.getElementsByClassName("popup_dash");
					var i;
					for (i = 0; i < x.length; i++) {
					  x[i].style.display = "none";
					} 
					var label = "";
					label = chartLabels[clickedItemIndex];
					var myNode = document.getElementById(chartId +  label);
					var popup = document.getElementById("popup");			
					if(!document.getElementById(chartId + label)){
						myNode.style.display = "block";
					} else { 
						myNode.style.display = "block";
						popup.style.display = "block";
					}
				}
				window.scrollTo(0,document.body.scrollHeight);
			},
			responsive: true,
			scales: {
				xAxes: [{
					ticks: {},
					gridLines: {
						display: false
					}
				}],
				yAxes: [{
					ticks: {
						suggestedMin: 0,
					},
				}]
			},
			legend: {
				display: false,
				position: 'bottom',
			},
		}
	});
}