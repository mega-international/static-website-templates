function newGanttChart (container, data) {
	am4core.ready(function() {

	// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		var chart = am4core.create(container, am4charts.XYChart);
		chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

		chart.paddingRight = 30;
		chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

		var colorSet = new am4core.ColorSet();
		colorSet.saturation = 0.4;

		chart.data = data;

		chart.dateFormatter.dateFormat = "yyyy-MM-dd";
		chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

		var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "category";
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.inversed = true;

		var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
		dateAxis.renderer.minGridDistance = 70;
		dateAxis.baseInterval = { count: 1, timeUnit: "month" };
		// dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
		//dateAxis.strictMinMax = true;
		dateAxis.renderer.tooltipLocation = 0;

		var series1 = chart.series.push(new am4charts.ColumnSeries());
		series1.columns.template.height = am4core.percent(70);
		series1.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

		series1.dataFields.openDateX = "start";
		series1.dataFields.dateX = "end";
		series1.dataFields.categoryY = "category";
		series1.columns.template.propertyFields.fill = "color"; // get color from data
		series1.columns.template.propertyFields.stroke = "color";
		series1.columns.template.strokeOpacity = 1;

		chart.scrollbarX = new am4core.Scrollbar();
	});
}

function updateGanttChart (container, data) {
	
	var parent = document.getElementById(container).parentElement;
	var child = document.getElementById(container);
	parent.removeChild(child);
	parent.innerHTML = '<div id="' + container + '"></div>'; 
	var nbAppli = data.map(function(a) {return a.category;}).filter(onlyUnique).length;
	if (nbAppli < 2) { parent.style.height = "100px"; }
	else { parent.style.height = (nbAppli*50) + "px"; }
	
	data.sort(compareValues('category'));
	newGanttChart(container, data);
}