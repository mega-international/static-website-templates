


function initialiseTabs(){
    
	$(".tab-item").addClass("disabled").removeClass("active");
	$(".tabcontent").addClass("hidden");
	$(".tabcontainer").each(function(){
		var $container = $(this);
		var $tabsoutercontainer = $("<div class=\"tabs-outer-container\"></div>");
		var $tabscontainer = $("<div class=\"tabs-container\"></div>");
		$tabsoutercontainer.append($tabscontainer);
		$container.prepend($tabsoutercontainer);
		var first = true;
		$container.find(".tabcontent").each(function(){
			var $tabcontent = $(this);
			var firstSection = true;
			$tabcontent.find(".tabsectioncontent").each(function(){
				var $tabsectioncontent = $(this);
				var id = $tabsectioncontent.data("id");
				var name = $tabsectioncontent.data("name");
				var $tabSection = $("<div class=\"tabsection\" data-id=\"" + id + "\"></div>");
				var $tabSectionBar = $("<div class=\"tabsectionbar\" data-id=\"" + id + "\">"+name+"</div>");
				var $tabSectionBarIndicator = $("<span class=\"tabsectionbarindicator\" data-id=\"" + id + "\">-</span>");
				$tabSectionBar.prepend($tabSectionBarIndicator);
				$tabSectionBar.click(function(){
					if ($tabsectioncontent.hasClass("hidden")){
						$tabsectioncontent.removeClass("hidden");
						$tabSectionBarIndicator.text("-");
					}else{
						$tabsectioncontent.addClass("hidden");
						$tabSectionBarIndicator.text("+");
					}
				});
				if (firstSection){
					firstSection = false;
				}else{
					$tabSectionBar.css("margin-top","20px");
					$tabsectioncontent.addClass("hidden");
					$tabSectionBarIndicator.text("+");
				}
				$tabSection.append($tabSectionBar);
				$tabSection.append($tabsectioncontent);
				$tabcontent.append($tabSection);
			});
			if	($tabcontent.children().length > 0){
				var id = $tabcontent.data("id");
				var name = $tabcontent.data("name");
				var $tab = $("<div class=\"tabitem\" data-id=\"" + id + "\">"+name+"</div>");
				$tabscontainer.append($tab);
				if (first){
					first = false;
					$tabcontent.removeClass("hidden");
					$tab.addClass("active").removeClass("disabled");
				}else{
					$tab.addClass("inactive").removeClass("disabled");
				}
				$tab.click(function(){
					if ($tab.hasClass("inactive")){
						$tabscontainer.find(".tabitem.active").removeClass("active").addClass("inactive");
						$tab.removeClass("inactive").addClass("active");
						$container.find(".tabcontent").addClass("hidden");
						$tabcontent.removeClass("hidden");
						checkTabContentHeight();
						checkDiagramHeight();
						addCacheData("activetab", id);
					}
				
				});
			}
		});

		if ($tabscontainer.width() < $tabscontainer[0].scrollWidth){
			var $tabScrollLeft = $("<div class=\"tabscrollleft hidden\"></div>");
			var $tabScrollRight = $("<div class=\"tabscrollright hidden\"></div>");
			$tabsoutercontainer.append($tabScrollLeft);
			$tabsoutercontainer.append($tabScrollRight);
			$tabsoutercontainer.mouseover(function(){
				$tabScrollLeft.removeClass("hidden");
				$tabScrollRight.removeClass("hidden");
			});
			$tabsoutercontainer.mouseleave(function(){
				$tabScrollLeft.addClass("hidden");
				$tabScrollRight.addClass("hidden");
			});
			
			$tabScrollLeft.click(function(){
				
				if ($tabscontainer[0].scrollLeft > 0){
					var iLeft = $tabscontainer[0].scrollLeft - 300;
					if(iLeft<0) iLeft = 0;
					$tabscontainer.animate({scrollLeft: iLeft},100);
				}
			});
			$tabScrollRight.click(function(){

				if ($tabscontainer[0].scrollLeft < ($tabscontainer[0].scrollWidth-$tabscontainer.width())){

					var iLeft = $tabscontainer[0].scrollLeft + 300;
					if(iLeft>($tabscontainer[0].scrollWidth-$tabscontainer.width())) iLeft = ($tabscontainer[0].scrollWidth-$tabscontainer.width());
					$tabscontainer.animate({scrollLeft: iLeft},100);
				}
			});
		}

	});	
	var activeTab = getCacheData("activetab");
	if(activeTab){
		var $tab = $(".tabitem[data-id="+activeTab+"]");
		if($tab.length > 0){
			$tab.click();
		}
	}
}

$(function(){
	$("#body-content-selector-container select").change(function(){
		if ($(this).val() != ""){
			window.location = $(this).val() + ".htm";
		}
	});
	$(window).resize(function(){
		checkTabContentHeight();
		checkDiagramHeight();
		checkReportHeight();
	});
	
	checkTabContentHeight();
});


function initialiseDiagrams(){
	var iDiagramsToLoad = 0;
	if($(".diagram-container").length <= 0) return;
	
	var $diagControlContainer = $("<div class=\".diagram-controls-container\"></div>");
	$(".diagram-container").parent().prepend($diagControlContainer)
	
	var $selectorContainer = $("<div class=\"diagram-selector-container\"></div>");
	$(".diagram-container").parent().prepend($selectorContainer);
	
	//var $selector = $("<select class=\"diagram-selector\"></select>");
	var bLoadSelector =false;
	if($(".diagram-container").length > 1){
		bLoadSelector = true;
		//$selectorContainer.append($selector);
		createDiagramSelector($selectorContainer);
	}
	var bFirst=true;
	$(".diagram-container").each(function(index){
		let $container = $(this);
		let id = $container.attr("data-id");
		let $diagName = $container.find(".diagram-name");
		let $diag = $container.find(".diagram-image");
		let $image = $diag.find("img");
		let img = new Image();
		let $diagControls = $("<div class=\"diagram-controls\" data-id=\""+id+"\"></div>");
		img.$image = $image;
		img.$container = $container;
		img.$diagControls = $diagControls;
		img.diagId = id;
		img.onload = function(){
			
			initDiagramDimensions(this.$container, this.$image, this);	
			$diagControlContainer.append(this.$diagControls);
			initDiagramControls(this.$diagControls, this.diagId);
			checkDiagramHeight();
			iDiagramsToLoad--;
			if(iDiagramsToLoad==0){
				if(bLoadSelector){
					var activeDiagram = getCacheData("activediagram");
					if(activeDiagram && activeDiagram !==""){
						var $selectItem = $(".diagram-select[data-id='" + activeDiagram + "']");
						if($selectItem.length > 0){
							$selectItem.click();
						}
						//$selector.val(activeDiagram).change();
					}else{
						let idFirst = (defaultDiagramId&&defaultDiagramId!=="")?defaultDiagramId:$($(".diagram-container")[0]).attr("data-id");
						var $selectItem = $(".diagram-select[data-id='" + idFirst + "']");
						if($selectItem.length > 0){
							$selectItem.click();
						}
						
					}
				}else{
					$selectorContainer.text($diagName.text());
				}
			}
		}
		/*
		if(bLoadSelector){
			$selector.append("<option value=\"" + id + "\">" + $diagName.text() + "</option>");
		}else{
			$selectorContainer.text($diagName.text());
		}
		*/
		if(!bFirst){
			$container.addClass("hidden");
			$diagControls.addClass("hidden");
		}else{
			
			bFirst=false;
		}
		iDiagramsToLoad++;
		img.src = $image.attr("src");
	});
	/*
	if(bLoadSelector){
		$selector.change(function(){
			$(".diagram-controls").addClass("hidden");
			$(".diagram-container").addClass("hidden");
			var val = $selector.val();
			$(".diagram-container[data-id='" + val + "']").removeClass("hidden");
			$(".diagram-controls[data-id='" + val + "']").removeClass("hidden");
			addCacheData("activediagram", val);
		});
		var activeItem = getCacheData("activediagram");
		if(activeItem){
			var $selectItem = $("option[value='" + activeItem + "']")
			if($selectItem.length > 0){
				//$selectItem.click();
			}
		}
	}
	*/

	
	$(".diagram-container").mouseover(function(){
		$(this).css("overflow","auto");
	}).mouseout(function(){
		$(this).css("overflow","hidden");
	});

}


function initDiagramDimensions($container, $image, img){
	$image.attr("data-current-zoom", 1);
	$image.attr("data-original-width", img.width);
	$image.attr("data-original-height", img.height);
	var $diag = $container.find(".diagram-image");
	
	var $area = $diag.find("area");
	$area.each(function(key, item){
		$areaItem = $(item);
		$areaItem.attr("data-original-coords", $areaItem.attr("coords"));
	});
	var ratio = $("#body-content-information").width() / (img.width);
	if (ratio < 1) setDiagramZoom($diag, ratio, 0); 
}

function initDiagramControls($diagControls, id){
	
	$diagControls.append("<div class=\"diagram-controls-legend\" data-id=\"" + id + "\" onclick=\"diagLegend(this);\"><img src=\"../standard/ws_Legend.png\" title=\"Legend\"></div>")
			 .append("<div class=\"diagram-controls-zin\" data-id=\"" + id + "\" onclick=\"diagZoomIn(this);\"><img src=\"../standard/ws_Increase.png\" title=\"Zoom In\"></div>")
			 .append("<div class=\"diagram-controls-zout\" data-id=\"" + id + "\" onclick=\"diagZoomOut(this);\"><img src=\"../standard/ws_Decrease.png\" title=\"Zoom Out\"></div>")
			 .append("<div class=\"diagram-controls-print\" data-id=\"" + id + "\" onclick=\"diagPrint(this);\"><img src=\"../standard/ws_Printer.png\" title=\"Print\"></div>")
			 .append("<div class=\"diagram-controls-max\" data-id=\"" + id + "\" onclick=\"diagMax(this);\"><img src=\"../standard/ws_Expand.png\" title=\"Maximise\"></div>")
			 .append("<div class=\"diagram-controls-min hidden\" data-id=\"" + id + "\" onclick=\"diagMin(this);\"><img src=\"../standard/ws_Contract.png\" title=\"Minimise\"></div>");
}


function diagZoomIn(el){
	var $el = $(el);
	var id = $el.attr("data-id");
	var $diag = $(".diagram-container[data-id=\"" + id + "\"]");
	var ratio = parseFloat($diag.find("img").attr("data-current-zoom"));
	ratio += 0.2;
	setDiagramZoom($diag, ratio, 200);
}

function diagZoomOut(el){
	var $el = $(el);
	var id = $el.attr("data-id");
	var $diag = $(".diagram-container[data-id=\"" + id + "\"]");
	var ratio = parseFloat($diag.find("img").attr("data-current-zoom"));
	ratio += -0.2;
	setDiagramZoom($diag, ratio, 200);
}

function diagMax(el){
	var $el = $(el);
	//$el.addClass("hidden");
	//$el.parent().find(".diagram-controls-min").removeClass("hidden");
	$(".diagram-controls-max").addClass("hidden");
	$(".diagram-controls-min").removeClass("hidden");
	var $container = $el.parent().parent().parent(); //$("#tab-item-content-diagram");
	//var $diag = $(".diagram-container[data-id=\"" + $el.attr("data-id") + "\"]");
	var $diag = $container.find(".diagram-container");
	$container.data("diag-parent",$container.parent());
	
	$container.css("position","fixed");
	$container.css("top","0px");
	$container.css("bottom","0px");
	$container.css("left","0px");
	$container.css("right","0px");
	$container.css("z-index","2000");
	$container.css("background-color","white");

	//$diag.css("position","absolute");
	//$diag.css("top","0px");
	//$diag.css("bottom","0px");
	//$diag.css("left","0px");
	//$diag.css("right","0px");	
	$diag.css("height","90%");		
	$("body").append($container);
	$("body").css("overflow","hidden");
}

function diagMin(el){
	var $el = $(el);
	//$el.addClass("hidden");
	//$el.parent().find(".diagram-controls-max").removeClass("hidden");
	$(".diagram-controls-max").removeClass("hidden");
	$(".diagram-controls-min").addClass("hidden");
	var $container = $el.parent().parent().parent();//$("#tab-item-content-diagram");
	//var $diag = $(".diagram-container[data-id=\"" + $el.attr("data-id") + "\"]");
	var $diag = $container.find(".diagram-container");	
	$container.css("position","");
	$container.css("top","");
	$container.css("bottom","");
	$container.css("left","");
	$container.css("right","");
	$container.css("z-index","");
	$container.css("background-color","");
	
	//$diag.css("position","");
	//$diag.css("top","");
	//$diag.css("bottom","");
	//$diag.css("left","");
	//$diag.css("right","");
	//$diag.css("height","");	
	$container.data("diag-parent").append($container);
	$("body").css("overflow","");
	checkDiagramHeight();
}

function diagLegend(el){
	var $el = $(el);
	var id = $el.attr("data-id");
	var $diagramContainer = $(".diagram-container[data-id=\"" + $el.attr("data-id") + "\"]");
	var $diagramType = $diagramContainer.find(".diagram-type");
	var typeId = $diagramType.text();
	var imageName = "../legend/" + typeId + ".png";
	
	$.get(imageName)
    .done(function() { 
        var $legendContainer = $("<div class=\"diagram-legend-container\"><img src=\""+imageName+"\"></div>");
		$("body").append($legendContainer);
		$legendContainer.css("top", $el.offset().top);
		$legendContainer.css("left", $el.offset().left + $el.width() - $legendContainer.width());
		$legendContainer.mouseleave(function(){$legendContainer.remove();});
    }).fail(function() { 
        alert("No legend currently exists for this diagram type.")
    })
	
}

function diagPrint(el){
	var $el = $(el);
	var id = $el.attr("data-id");
	var $img = $(".diagram-image[data-id='" + id + "'] img");
	var $name = $(".diagram-container[data-id='" + id + "'] .diagram-name");
	var title = $("#body-content-title").text().trim()+" - "+$name.text().trim();
	if (!$img || $img.length == 0) { 
		return;
	}
	var image = $img[0];
	var src = image.src; 
	var link = "about:blank"; 
	var pw = window.open(link, "_new"); 
	pw.document.open();
	pw.document.write(diagMakePage(title, src)); 
	pw.document.close(); 

}

function diagMakePage(title, src){ 
	return "<html>" + 
	"<head>" + 
	"<title>"+title+"</title>" + 
	"</head>" + 
	"<body>" + 
	"<img src='" + src + "'/>" + 
	"<script>window.addEventListener('load', function(){setTimeout(function(){window.print(); window.close();}, 200);},true);</script>" +
	"</body>" + 
	"</html>"; 
} 

function setDiagramZoom($diag, ratio, duration){
	//initDiagramDimensions($diag);

	var $img = $diag.find("img");
	if (ratio < 0.1) ratio = 0.1;
	if (ratio > 3) ratio = 3;
	$img.attr("data-current-zoom", ratio);
	
	var css = {
		width: $img.attr("data-original-width")*ratio,
		height: $img.attr("data-original-height")*ratio
	}
	$img.animate(css, duration);
	var $area = $diag.find("area");
	$area.each(function(key, item){
		var $areaItem = $(item);
		var pairs = $areaItem.attr("data-original-coords").split(',');
		for(var i=0; i<pairs.length; i++){
			pairs[i] = parseFloat(pairs[i]) * ratio;
		}
		$areaItem.attr("coords", pairs.join(','));
	});	
}


function initialiseMenu(){
	$(".menu-item").click(function(){
		var $item = $(this);
		var id = $item.data("catid");
		var $container = $("#header-content-submenu");
		var $cell = $("#header-cell-hidden");
		var h = 0;
		if($item.hasClass("active")){
			$item.removeClass("active");
			h = $container.height();
			$container.animate({"height":"0px"},100,function(){
				$cell.addClass("hidden");
				$container.empty();
			});
			
		}else{
			$(".menu-item").removeClass("active");
			$item.addClass("active");
			$container.empty();
			var $content = $(".menu-content[data-catid=\""+id+"\"]");
			$container.append($content.html());
			$cell.removeClass("hidden");
			$container.css({"height":"auto"});
			$container.children().each(function(){
				var $menuCell = $(this);
				var index = 0;
				$menuCell.find(".menu-button").each(function(){
					if (index > 0){
						if($(this).hasClass("col3")){
							if ((index % 4) == 0){
								$(this).css({"clear":"left"});
							}
						}else if($(this).hasClass("col4")){
							if ((index % 3) == 0){
								$(this).css({"clear":"left"});
							}
						}
					}
					
					index++;
				});
			});
			h = $container.height();
			$container.css({"height":"0px"});
			
			$container.animate({"height":h+"px"},100);
		}
	});
	
}

function checkDiagramHeight(){
	if ($(".diagram-container").length === 0)return;
	var wH = $(window).height();
	var dT = 0;
	$(".diagram-container").each(function(){
		var dTT = $(this).position().top;
		if(dTT > dT)dT = dTT;
	});
	var fH = $("#footer-section").height();
	$(".diagram-container").height(wH-dT-fH-50);	

}

function initialiseReports(){
	var iReportsToLoad = 0;
	if($(".report-container").length <= 0) return;
	
	var $reportControlContainer = $("<div class=\"report-controls-container\"></div>");
	$(".report-container").parent().prepend($reportControlContainer)
	
	var $selectorContainer = $("<div class=\"report-selector-container\"></div>");
	$(".report-container").parent().prepend($selectorContainer);
	
	var $selector = $("<select class=\"report-selector\"></select>");
	var bLoadSelector =false;
	if($(".report-container").length > 1){
		bLoadSelector = true;
		$selectorContainer.append($selector);
	}
	var bFirst=true;
	$(".report-container").each(function(index){
		let $container = $(this);
		let id = $container.attr("data-id");
		let $reportName = $container.find(".report-name");
		let $report = $container.find(".report-image");
		let $image = $report.find("iframe");

		let $reportControls = $("<div class=\"report-controls\" data-id=\""+id+"\"></div>");
		$reportControlContainer.append($reportControls);
		initReportControls($reportControls, id);
		
		
		if(bLoadSelector){
			$selector.append("<option value=\"" + id + "\">" + $reportName.text() + "</option>");
		}else{
			$selectorContainer.text($reportName.text());
		}
		if(!bFirst){
			$container.addClass("hidden");
			$reportControls.addClass("hidden");
		}else{
			bFirst=false;
		}
		iReportsToLoad++;

	});
	
	if(bLoadSelector){
		$selector.change(function(){
			$(".report-controls").addClass("hidden");
			$(".report-container").addClass("hidden");
			var val = $selector.val();
			$(".report-container[data-id='" + val + "']").removeClass("hidden");
			$(".report-controls[data-id='" + val + "']").removeClass("hidden");
			addCacheData("activereport", val);
		});

		var activeReport = getCacheData("activereport");
		if(activeReport && activeReport !==""){
			$selector.val(activeReport).change();
		}

	}
	
	$(".report-container iframe").load(function(){
		$(this).contents().find(".naetopbar").css("display","none");
		$(this).contents().find("body").css("overflow","hidden");
	});
	$(".report-container").mouseover(function(){
		$(this).find("iframe").contents().find("body").css("overflow","auto");
	}).mouseout(function(){
		$(this).find("iframe").contents().find("body").css("overflow","hidden");
	});
	checkReportHeight();
}

function initReportControls($reportControls, id){
	
	$reportControls /*.append("<div class=\"report-controls-zin\" data-id=\"" + id + "\" onclick=\"reportZoomIn(this);\"><img src=\"../standard/ws_Increase.png\" title=\"Zoom In\"></div>")
			 .append("<div class=\"report-controls-zout\" data-id=\"" + id + "\" onclick=\"reportZoomOut(this);\"><img src=\"../standard/ws_Decrease.png\" title=\"Zoom Out\"></div>") */
			 .append("<div class=\"report-controls-print\" data-id=\"" + id + "\" onclick=\"reportPrint(this);\"><img src=\"../standard/ws_Printer.png\" title=\"Print\"></div>")
			 .append("<div class=\"report-controls-max\" data-id=\"" + id + "\" onclick=\"reportMax(this);\"><img src=\"../standard/ws_Expand.png\" title=\"Maximise\"></div>")
			 .append("<div class=\"report-controls-min hidden\" data-id=\"" + id + "\" onclick=\"reportMin(this);\"><img src=\"../standard/ws_Contract.png\" title=\"Minimise\"></div>");
}

function reportMax(el){
	var $el = $(el);
	$(".report-controls-max").addClass("hidden");
	$(".report-controls-min").removeClass("hidden");
	var $container = $el.parent().parent().parent();
	var $report = $container.find(".report-container");
	$container.data("report-parent",$container.parent());
	
	$container.css("position","fixed");
	$container.css("top","0px");
	$container.css("bottom","0px");
	$container.css("left","0px");
	$container.css("right","0px");
	$container.css("z-index","2000");
	$container.css("background-color","white");
	$report.css("height","90%");
	checkReportHeight();
	$("body").append($container);
	$("body").css("overflow","hidden");
}

function reportMin(el){
	var $el = $(el);
	$(".report-controls-max").removeClass("hidden");
	$(".report-controls-min").addClass("hidden");
	var $container = $el.parent().parent().parent();
	var $report = $container.find(".report-container");	
	$container.css("position","");
	$container.css("top","");
	$container.css("bottom","");
	$container.css("left","");
	$container.css("right","");
	$container.css("z-index","");
	$container.css("background-color","");

	$container.data("report-parent").append($container);
	$("body").css("overflow","");
	checkReportHeight();
}

function reportPrint(el){
	var $el = $(el);
	var id = $el.attr("data-id");
	var $img = $(".report-image[data-id='" + id + "'] iframe");
	var $name = $(".report-container[data-id='" + id + "'] .report-name");
	console.log($name.text());
	if (!$img || $img.length == 0) { 
		return;
	} 
	var link = $img.attr("src"); 
	link = "about:blank"; 
	var $html = $img.contents().find("html").clone();
	var title = $("#body-content-title").text().trim()+" - "+$name.text().trim()
	
	
	if (msieversion()>0 && msieversion()<11){
		
		var pw = window.open(link, "_new");
		$html.find("link").attr("media","print");
		$html.find("title").remove();
		
		$html.find("head").prepend("<title>"+title+"</title>");
		
		$html.find("body").append("<script>window.addEventListener('load', function(){setTimeout(function(){window.print(); window.close();}, 200);},true);</script>");
		pw.document.open(); 
		pw.document.write("<html>"+$html.html()+"</html>"); 
		pw.document.close(); 
	}else{
		makeLoadingDialog();
		html2canvas($img.contents().find("body")[0]).then(function(canvas) {
				var pw = window.open(link, "_new");
				pw.document.open();
				pw.document.write(reportMakePage(title,canvas.toDataURL('image/png'))); 
				pw.document.close(); 
				destroyLoadingDialog();
				
		});
	}
	

}

function reportMakePage(title, src){ 
	return "<html>" + 
	"<head>" + 
	"<title>"+title+"</title>" + 
	"</head>" + 
	"<body>" + 
	"<img src='" + src + "'/>" + 
	"<script>window.addEventListener('load', function(){setTimeout(function(){window.print(); window.close();}, 200);},true);</script>" +
	"</body>" + 
	"</html>"; 
} 

function checkReportHeight(){
	if ($(".report-container").length === 0)return;
	var wH = $(window).height();
	var dT = 0;
	$(".report-container").each(function(){
		var dTT = $(this).position().top;
		if(dTT > dT)dT = dTT;
	});
	var fH = $("#footer-section").height();
	$(".report-container").height(wH-dT-fH-50);	
	$(".report-container iframe").height(wH-dT-fH-50);

}

function checkTabContentHeight(){
	if ($("#body-section-main").length === 0)return;
	var wH = $(window).height();
	var tT = $("#body-section-main").position().top;
	var fH = $("#footer-section").height();
	$("#body-section-main").css({"min-height":(wH-tT-fH) + "px"});
}

function addCacheData(sId, sValue){
	var $cache = $("#muk-pagecache");
	var data;
	if ($cache.length === 0) return;
	if ($cache.val() == 0){
		data = {}
	}else{
		data = JSON.parse($cache.val());
	}
	data[sId] = sValue;
	$cache.val(JSON.stringify(data));
}

function getCacheData(sId){
	var $cache = $("#muk-pagecache");
	if ($cache.length === 0) return null;
	var value = $cache.val();
	if (!value || value === "") return null;
	var data = JSON.parse(value);
	return data[sId];
}



var categoryGUI = []

function updateMarginInfo(item){
	if (item){
		$(".margin-identity").addClass("bg-" + item.id);
		var $link = $("<a href=\""+item.link+"\"></a>");
		var $icon = $("<div class=\"margin-identity-icon\"><img src=\""+item.icon+"\"></div>");
		var $text = $("<div class=\"margin-identity-text\">"+item.name+"</div>");
		$(".margin-identity").append($link);
		$link.append($icon);
		$link.append($text);
		
		$(".margin-description-content").text(item.description);
		updateTitleInfo(item);
		return;
	}
	
	
	var $category = $("#catid");
	if ($category.length === 0) return;
	var catId = $category.data("catid");
	if (!catId || catId === "") return;
	for (var i = 0; i <categoryGUI.length; i++){
		var catItem = categoryGUI[i];
		if (catId !== catItem.id){
			for (var j = 0; j < catItem.classes.length; j++){
				if(catId === catItem.classes[j]){
					updateMarginInfo(catItem);
					return;
				}
				
			}
			
		}else{
			updateMarginInfo(catItem);
			return;
		}
			

	}	
}

function updateTitleInfo(item){
	if (item){
		//alert(item);
		$(".title-identity").addClass("bg-" + item.id);
		var $link = $("<a href=\""+item.link+"\"></a>");
		var $icon = $("<div class=\"title-identity-icon\"><img src=\""+item.icon+"\"></div>");
		var $text = $("<div class=\"title-identity-text\">"+item.name+"</div>");
		$(".title-identity").append($link);
		$link.append($icon);
		$link.append($text);
		var bgCol = $(".title-identity").css("background-color")
		$(".title-identity").css({"background-color":"transparent !important"});
		$(".title-identity").css({"background-image":"linear-gradient(to right, transparent , "+bgCol+")"});
		$("#body-content-title").css({"background-image":"linear-gradient(to right, #ddd, transparent, transparent, transparent, transparent)"});
		$(".title-identity")[0].style.backgroundColor = "transparent !important";
		$(".title-identity")[0].style.backgroundImage = "linear-gradient(to right, transparent , "+bgCol+")";
		$("#body-content-title")[0].style.backgroundImage = "linear-gradient(to right, #ddd, transparent, transparent, transparent, transparent)";
		$(".title-identity").removeClass("bg-" + item.id);
		return;
	}
	
	/*
	var $category = $("#catid");
	if ($category.length === 0) return;
	var catId = $category.data("catid");
	if (!catId || catId === "") return;
	for (var i = 0; i <categoryGUI.length; i++){
		var catItem = categoryGUI[i];
		if (catId !== catItem.id){
			for (var j = 0; j < catItem.classes.length; j++){
				if(catId === catItem.classes[j]){
					updateTitleInfo(catItem);
					return;
				}
				
			}
			
		}else{
			updateTitleInfo(catItem);
			return;
		}
			

	}	
	*/
}



function makeLoadingDialog(){
	$loadingDialog = $("<div id=\"loading-dialog\" title=\"Please Wait\">" + 
		"<div class=\"progress-label\">Please Wait...</div>" + 
		"<div id=\"loading-progressbar\"></div>" + 
	"</div>");
	$("body").append($loadingDialog);
	$( "#loading-dialog" ).dialog({
        autoOpen: true,
        closeOnEscape: false,
        resizable: false,
		modal: true
      }),

 
    $("#loading-progressbar").progressbar({
      value: false
    });
}

function destroyLoadingDialog(){
	$("#loading-dialog").remove();
}

$(function(){
  document.addEventListener('mouseover', function (e) {
		let el = e.target;
		while ((el) && !$(el).hasClass("propdatatable-value")){
			el = el.parentNode;
		}
    if (el && !$(el).hasClass("propdatatable-value-mouseover-init")){
      $(el).addClass("propdatatable-value-mouseover-init");
      $(el).mouseover(propTableValueMouseOver);
    }
  });
	/*
	$(".propdatatable-value").mouseover(function(){
		var $value = $(this);

			
		if ($value[0].scrollWidth > $value.width()+1 || $value[0].scrollHeight > $value.height()+1 ){
			//alert("$value[0].scrollWidth:" + $value[0].scrollWidth + "  $value.width(): " + $value.width() + 
			//      "\n$value[0].scrollHeight:" + $value[0].scrollHeight + "   $value.height():" + $value.height()); 
			$(".popup").remove();
			var $popup;
			var html = $value.html();
			popup = $("<div class=\"popup\"/>");
			popup.append(html);
			$("body").append(popup);
			popup.css("top",$value.offset().top-10);
			popup.css("left",$value.offset().left-10);
			if (popup.width() < $value.width()){
				popup.css("max-width",($value.width()+10)+"px");
			}
			popup.mouseleave(function(){
				$(".popup").remove();
			});
		}

	});
	
	getMetaData();*/

});

function propTableValueMouseOver(){
  var $value = $(this);

			
  if ($value[0].scrollWidth > $value.width()+1 || $value[0].scrollHeight > $value.height()+1 ){
    //alert("$value[0].scrollWidth:" + $value[0].scrollWidth + "  $value.width(): " + $value.width() + 
    //      "\n$value[0].scrollHeight:" + $value[0].scrollHeight + "   $value.height():" + $value.height()); 
    $(".popup").remove();
    var $popup;
    var html = $value.html();
    popup = $("<div class=\"popup\"/>");
    popup.append(html);
    $("body").append(popup);
    popup.css("top",$value.offset().top-10);
    popup.css("left",$value.offset().left-10);
    if (popup.width() < $value.width()){
      popup.css("max-width",($value.width()+10)+"px");
    }
    popup.mouseleave(function(){
      $(".popup").remove();
    });
  }
}


var metadataGUI = null;

function getMetaData(){
	if(metadataGUI) return metadataGUI;
    $.ajax({ 
        url: "../metadata/metadata.json",
        type:"get",
        dataType: "json",
        async: true,
        success: function(j) { 
			metadataGUI = j;
            populateTooltips();
        },
        error: function (request, status, errorThrown) {
            //alert(errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
}


var $currentTooltip;
function populateTooltips(){
	$(document).tooltip({
		items: "[data-tooltip-text]",
		content: function() {
			let sText = $(this).data('tooltip-text');
			return (sText && sText.length >0)?sText.split("\r\n").join("<br/>"):null;
		}
	});
	document.addEventListener('mouseover', function (e) {
		let mainElement = e.target;
		let $mainElement = $(mainElement);
		let bTrigger = false;
		if ($mainElement.hasClass("tooltip-init"))return;
		$mainElement.addClass("tooltip-init");
		let currentElement = mainElement;
		while (currentElement && !($(currentElement).hasClass("tooltip") || $(currentElement).hasClass("tooltip-object")) ){
			currentElement = currentElement.parentNode;
			
		}
		
		if (currentElement){
			let $currentElement = $(currentElement);
			$currentTooltip = $mainElement;
			if (currentElement!=mainElement && $currentElement.hasClass("tooltip-init"))return;
			$currentElement.addClass("tooltip-init");
			if ($currentElement.hasClass("tooltip")){
				let id = $currentElement.data("tooltip-id");
				if (id && id.length > 0){
					let index = metadataGUI.index.indexOf(id);
					if (index > -1){
						var sText = metadataGUI.data[index].description;
						if (sText && sText.length > 0){
							$currentElement.attr("data-tooltip-text",sText);
							$currentElement.trigger('mouseout').trigger('mouseover')
						}
					}
				}
			}
			else if ($currentElement.hasClass("tooltip-object")){
				let id = $currentElement.data("tooltip-id");	
				let url = "../search/objects/"+id+".js";
				getJsonAync(url,function(j){
					if(j && j.data){
						let sText = j.data.comment;
						if (sText && sText.length > 0){
							$currentElement.attr("data-tooltip-text",sText);
							//console.log("$currentElement[0]:" + $currentElement[0] + "\r\n$currentTooltip[0]:" + $currentTooltip[0]);
							//if ($mainElement[0]==$currentTooltip[0]){
							//	$mainElement.trigger('mouseout').trigger('mouseover');
							//}
							
						}
					}
					
				});
				
			}
			
		}
		
	});
	/*
	$(".tooltip").each(function(){
		var $item = $(this);
		var id = $(this).data("tooltip-id");
		if (id && id.length > 0){
			var index = metadataGUI.index.indexOf(id);
			if (index > -1){
				var sText = metadataGUI.data[index].description;
				if (sText && sText.length > 0){
					$item.attr("title",sText);
					$item.tooltip();
				}
			}
		}
	});
	*/
}


function createDiagramSelector($selectorContainer){
	let $selectorButton = $("<div class=\"diagram-selector-button\"><img src=\"../standard/ws_select.png\"></div>");
	let $selectorPopupContainer = $("<div class=\"diagram-selector-popup-container hidden\"/>");
	$selectorContainer.append($selectorButton);
	let $selectorContainerText = $("<div class=\"diagram-selector-text-container\"/>");
	$selectorContainer.append($selectorContainerText);
	$selectorContainer.append($selectorPopupContainer);
	$selectorButton.click(function(){
		$selectorPopupContainer.css("top", $selectorButton.offset().top);
		$selectorPopupContainer.css("left", $selectorButton.offset().left);
		$selectorPopupContainer.removeClass("hidden");
	});
	$selectorPopupContainer.mouseleave(function(){
		$selectorPopupContainer.addClass("hidden");	
	});
	let diagrams = [];
	$(".diagram-container").each(function(){
		let $diagramContainer = $(this);
		let diagId = $diagramContainer.attr("data-id");
		let diagName = $diagramContainer.find(".diagram-name").text();
		let $diagramTypeId = $diagramContainer.find(".diagram-type");
		let $diagramTypeName = $diagramContainer.find(".diagram-type-name");
		let $diagramCatId = $diagramContainer.find(".diagram-category");
		let $diagramCatName = $diagramContainer.find(".diagram-category-name");
		let diagramTypeId = $diagramTypeId.text();
		let diagramTypeName = $diagramTypeName.text();
		let diagramCatId = $diagramCatId.text();
		let diagramCatName = $diagramCatName.text();
		
		if (!diagramCatName || diagramCatName.length === 0){
			diagramCatName = "Other Diagrams";
			diagramCatId = "0000000000000000";
		}
		
		let diagramCatEntry = null;
		for (let i = 0; i < diagrams.length; i++){
			if (diagrams[i].id === diagramCatId){
				diagramCatEntry = diagrams[i];
				break;
			}
		}
		if(!diagramCatEntry){
			diagramCatEntry = {}
			diagramCatEntry.id = diagramCatId;
			diagramCatEntry.name = diagramCatName;
			diagramCatEntry.types = [];
			diagrams.push(diagramCatEntry);
			diagrams.sort(function(a,b){
				return a.name < b.name;
			});
		}
		
		let diagramTypeEntry = null;
		for (let i = 0; i < diagramCatEntry.types.length; i++){
			if (diagramCatEntry.types[i].id === diagramTypeId){
				diagramTypeEntry = diagramCatEntry.types[i];
				break;
			}
		}
		if(!diagramTypeEntry){
			diagramTypeEntry = {};
			diagramTypeEntry.id = diagramTypeId;
			diagramTypeEntry.name = diagramTypeName;
			diagramTypeEntry.diagrams = [];
			diagramCatEntry.types.push(diagramTypeEntry);
			diagramCatEntry.types.sort(function(a,b){
				return a.name < b.name;
			});
		}
		
		let diagramEntry = {}
		diagramEntry.id = diagId;
		diagramEntry.name = diagName;
		diagramTypeEntry.diagrams.push(diagramEntry);
		diagramTypeEntry.diagrams.sort(function(a,b){
				return a.name < b.name;
		});
	});
	
	
	for (let i = 0; i < diagrams.length; i++){
		
		let category = diagrams[i];
		let $category = $("<div class=\"diagram-category-select\" data-id=\""+category.id+"\">"+category.name+"</div>");
		let $categoryIndicator = $("<span class=\"tabsectionbarindicator\">-</span>");
		$category.prepend($categoryIndicator);
		$selectorPopupContainer.append($category);
		let $typeContainerOuter = $("<div class=\"diagram-type-select-container\" data-id=\""+category.id+"\"/>");
		let $typeContainer = $("<div class=\"diagram-type-select-container-inner\" data-id=\""+category.id+"\"/>");
		$selectorPopupContainer.append($typeContainerOuter);
		$typeContainerOuter.append($typeContainer);
		$category.click(function(){
			if($typeContainer.hasClass("hidden")){
				$typeContainer.removeClass("hidden");
				$category.addClass("expanded");
				$categoryIndicator.text("-");
			}else{
				$typeContainer.addClass("hidden");
				$category.removeClass("expanded");
				$categoryIndicator.text("+");
			}
		});
		for(let j = 0; j < category.types.length; j++){
			
			let type = category.types[j];
			let $type = $("<div class=\"diagram-type-select\" data-id=\""+type.id+"\">"+type.name+"</div>");
			let $typeIndicator = $("<span class=\"tabsectionbarindicator\">-</span>");
			$type.prepend($typeIndicator);
			$typeContainer.append($type);
			let $diagramSelectContainerOuter = $("<div class=\"diagram-select-container\" data-id=\""+type.id+"\"/>");
			let $diagramSelectContainer = $("<div class=\"diagram-select-container-inner\" data-id=\""+type.id+"\"/>");
			$typeContainer.append($diagramSelectContainerOuter);
			$diagramSelectContainerOuter.append($diagramSelectContainer);
			$type.click(function(){
				if($diagramSelectContainer.hasClass("hidden")){
					$diagramSelectContainer.removeClass("hidden");
					$type.addClass("expanded");
					$typeIndicator.text("-");
				}else{
					$diagramSelectContainer.addClass("hidden");
					$type.removeClass("expanded");
					$typeIndicator.text("+");
				}
			});
		
			for(let k = 0; k < type.diagrams.length; k++){
				
				let diagram = type.diagrams[k];
				let $diagramSelect = $("<div class=\"diagram-select\" data-id=\""+diagram.id+"\">"+diagram.name+"</div>");
				$diagramSelectContainer.append($diagramSelect);
				
				$diagramSelect.click(function(){
					let thisId = diagram.id;
					$selectorPopupContainer.find(".diagram-select").removeClass("selected");
					$(this).addClass("selected");
					$(".diagram-controls").addClass("hidden");
					$(".diagram-container").addClass("hidden");
					$(".diagram-container[data-id='" + thisId + "']").removeClass("hidden");
					$(".diagram-controls[data-id='" + thisId + "']").removeClass("hidden");
					addCacheData("activediagram", thisId);
					$selectorPopupContainer.addClass("hidden");
					$selectorContainerText.text(diagram.name);
				});
			}
			
		}
		
	}

}
		
		
	