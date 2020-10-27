
function getJsonSync(jsonLocation) {
	var json;
    $.ajax({ 
        url: jsonLocation,
        type:"get",
        dataType: "json",
        async: false,
        success: function(j) { 
            json = j
        },
        error: function (request, status, errorThrown) {
            console.log("Error in: " + jsonLocation + "\n" + errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
	return json;
}


function getJsonAync(jsonLocation, callback) {
	var json;
    $.ajax({ 
        url: jsonLocation,
        type:"get",
        dataType: "json",
        async: true,
        success: callback,
        error: function (request, status, errorThrown) {
            console.log("Error in: " + jsonLocation + "\n" + errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
	return json;
}


function getDiagramHtml(url, diagramId){
	var html;
	var diagramHtml;
    $.ajax({ 
        url: url,
        type:"get",
        dataType: "html",
        async: false,
		beforeSend: function(xhr){xhr.setRequestHeader('Content-type', 'text/html; charset=utf-8');},
        success: function(data) { 
            html = data
        },
        error: function (request, status, errorThrown) {
            console.log("Error in: " + url + "\n" + errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
	try{
		var $html = $(html);
		var $diagramName = $html.find(".diagram-name[data-id=\""+diagramId+"\"]");
		var $diagramControls = $html.find(".diagram-controls[data-id=\""+diagramId+"\"]");
		var $diagramContainer = $html.find(".diagram-container[data-id=\""+diagramId+"\"]");
		diagramHtml = $diagramName[0].outerHTML + $diagramControls[0].outerHTML + $diagramContainer[0].outerHTML;
	}catch(e){
		
	}
	return diagramHtml;
}

var diag_mapping = [];

function reMapDiagram(elementID,mapping){
    if (!elementID||!mapping) return;
    var areas = $(".diagram-container[data-id=" + elementID + "]").find("area");
    var bFound;
    for (var i = 0; i < areas.length; i++){
        var area = $(areas[i])
        if (area.attr("href")!= ""){    
            for (var j = 0; j < mapping.length; j++){
                var areaHref = area.attr("href").toLowerCase();
                if (areaHref.indexOf(mapping[j].id.toLowerCase()) > -1){
                    if (mapping[j].id == mapping[j].value){
                        area.attr("href", "javascript:void(0);");
                        break;
                    }else{
						if (areaHref.indexOf("#obmk") == 0){
							areaHref = mapping[j].value.toLowerCase() + ".htm";
						}else{
							areaHref = areaHref.replace(mapping[j].id.toLowerCase() + ".htm", mapping[j].value.toLowerCase() + ".htm");
						}
                        area.attr("href", areaHref);
                        bFound = true;
                        break;
                    }
                }
            }
        } 
    }
}

function getHtml(url, sourceId, targetId){
    $.ajax({ 
        url: url,
        type:"get",
        dataType: "html",
        async: false,
		beforeSend: function(xhr){xhr.setRequestHeader('Content-type', 'text/html; charset=utf-8');},
        success: function(data) { 
            html = data
        },
        error: function (request, status, errorThrown) {
            console.log("Error in: " + url + "\n" + errorThrown);
        },
        complete: function( xhr, status ){

        }
    });
	try{
		var $html = $(html);
		var $sourceElement = $html.find(sourceId);
		var $targetElement = $(targetId);
		$targetElement.append($sourceElement);
	}catch(e){

	}
}

function fixHomeLinks(){
	$("a").each(function(){
		var href = $(this).attr("href");
		if (href.indexOf("../") === 0){
			$(this).attr("href", href.replace("../",""));
		}else if(href.indexOf("mailto") === 0){
			// no action
		}else if(href.indexOf("/") < 0){
			$(this).attr("href", "pages/" + href);
		}
		
	});
	
}


function msieversion() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    }

    return 0;
}


var tableToExcel = function (table, name, filename) {
	var $table = $("#"+table);
	if (!$.fn.DataTable.isDataTable($table)) return
	var excel = $JExcel.new("Calibri 10 #000000");
	excel.set( {sheet:0,value:name} );
	
	var formatHeader = excel.addStyle ({
					fill: "#FFFFFF" ,
					border: "none,none,none,thin #333333", 
					font: "Calibri 12 #000000 B"});
	var evenRow = excel.addStyle ( {
					fill: "#FFFFFF" ,
					border: "none,none,none,thin #333333",
					font: "Calibri 12 #000000"});

	var oddRow = excel.addStyle ( { 
					fill: "#ECECEC" ,
					border: "none,none,none,thin #333333",
					font: "Calibri 12 #000000"});
	
	var iRow = 1, iCol = 0;


	var $trs = $table.dataTable().$("tr", {"filter":"applied"});
	$trs.each(function(){
		var $tr = $(this);
		var $tds = $tr.children();
		iCol = 0;
		$tds.each(function(){
			var $td = $(this);
			//console.log("iCol: " + iCol + " iRow: " + iRow + " Value: " + $td.text());
			var sText = $td.text().replace(/^\s+|\s+$/g, '');
			excel.set(0,iCol,iRow,sText,((iRow%2==0)?evenRow:oddRow));
			iCol++
		});
		iRow++;
	});
	
	var $trHead = $table.find("thead tr");
	if ($trHead.length > 1) $trHead = $($trHead[1]);
	var $tdsHead = $trHead.children();
	iRow = 0, iCol = 0;
	$tdsHead.each(function(){
		var $tdHead = $(this);
		//console.log("iCol: " + iCol + " iRow: " + iRow + " Value: " + $tdHead.text());
		if($tdHead.find("option").length > 0){
			excel.set(0,iCol,iRow,$($tdHead.find("option")[0]).text(),formatHeader);
		}else{

			excel.set(0,iCol,iRow,$tdHead.text(),formatHeader);
		}
		excel.set(0,iCol,undefined,$tdHead.width()/5.5);
		iCol++;
	});
	iRow++;
	
	excel.generate(filename);

}


function setDiagramCategory(sSelector, sID, sName){
	var $diag = $(sSelector);
	$diag.append("<div class=\"diagram-category hidden\">"+sID+"</div>");
	$diag.append("<div class=\"diagram-category-name hidden\">"+sName+"</div>");
}

function loadHomeLinks(){
	$(".home-nav-item").each(function(){
		let $item = $(this);
		let $links = $item.find(".home-nav-item-link");
		if($links.length > 0){
			let $itemClickZone = $item.children().first();
			$itemClickZone.click(function(){
				
				createHomeNavMenu($item, $itemClickZone, $links);
				
			});
			
		}
	});	
	
	$(".home-nav-item.home-nav-uc").mouseenter(function(){
		let $navImage = $(this).find(".home-nav-item-icon img");
		//console.log($navImage);
		$navImage.data("original-image", $navImage.attr("src"));
		$navImage.attr("src", "standard/cb_ico_underconstruction.png");
		
		
	}).mouseleave(function(){
		let $navImage = $(this).find(".home-nav-item-icon img");
		$navImage.attr("src", $navImage.data("original-image"));
		
	});
}

function createHomeNavMenu($item, $itemClickZone, $links){
	let $nav = $("#home-nav");
	let $homeNavMenu = $("<div class=\"home-nav-item-menu\"/>");
	$nav.append($homeNavMenu);

	$homeNavRow = $(".home-nav-row");
	$homeNavMenu.css("background-color",$item.css("background-color"));
	let $homeNavMenuHeader = $("<div class=\"home-nav-item-menu-header\"/>");
	let $homeNavMenuItems = $("<div class=\"home-nav-item-menu-items\"/>");
	$homeNavMenuHeader.css({"opacity":0});
	$homeNavMenuItems.css({"opacity":0});
	$homeNavMenuItems.append($links.clone());
	$homeNavMenu.append($homeNavMenuHeader);
	$homeNavMenu.append($homeNavMenuItems);
	let top = $item.offset().top;
	let height = $item.height();
	let left = $item.offset().left;
	let width = $item.width();
	$homeNavMenu.css({"left":left,"top":top,"width":width,"height":height,"opacity":0});
	
	let $homeNavMenuHeaderImage = $("<div class=\"home-nav-item-menu-header-image\">"+$item.find(".home-nav-item-icon").html()+"</div>");
	let $homeNavMenuheaderText = $("<div class=\"home-nav-item-menu-header-text\">"+$item.find(".home-nav-item-text").html()+"</div>");
	$homeNavMenuHeader.append($homeNavMenuHeaderImage);
	$homeNavMenuHeader.append($homeNavMenuheaderText);
	$homeNavMenu.animate({"opacity":1},100);
	top = $homeNavRow.first().offset().top;
	height = $homeNavRow.last().offset().top+$homeNavRow.last().height()-top;
	left = $homeNavRow.first().offset().left;
	width = $homeNavRow.first().width();
	
	$homeNavMenu.animate({"left":left,"top":top,"width":width,"height":height},100);

	$homeNavMenuHeader.animate({"opacity":1},1000);
	$homeNavMenuItems.animate({"opacity":1},1500);
	
	$homeNavMenu.mouseleave(function(){
		let top = $item.offset().top;
		let height = $item.height();
		let left = $item.offset().left;
		let width = $item.width();
		$homeNavMenuHeader.animate({"opacity":0},100);
		$homeNavMenuItems.animate({"opacity":0},100);
		$homeNavMenu.animate({"left":left,"top":top,"width":width,"height":height,"opacity":0},200,function(){
			$homeNavMenu.remove();
		});
		
	});

}

var impactDataSource = {};
function getIntegrationData(sJson, sMetaClassID, sTableID){
	if (!impactDataSource[sJson]){
		impactDataSource[sJson] = getJsonSync(sJson);
	}
	var impactData = impactDataSource[sJson];
	var aData = [];

	for (let itemId in impactData.targets){
		let oItem = impactData.targets[itemId];
    if (oItem.type_id.toLowerCase()===sMetaClassID.toLowerCase()){
      let oItemNature = {};
      oItemNature.nature = "Target";
      oItemNature.source = impactData.root.name;
      oItemNature.target = oItem.name;
      let contexts = oItem.contexts;
      
      if (!contexts || contexts.length === 0) contexts = [{}];
      for (let i = 0; i < contexts.length; i++){
        let context = contexts[i];
        let aDataItem = [];
        aDataItem.push(oItemNature);
        aDataItem.push(oItem);
        if (!context.path) context.path = [];
        let path = context.path.slice().reverse();
        for (let j = 0; j < path.length; j++){
          aDataItem.push(path[j]);
          
        }

        if(sMetaClassID.toUpperCase()==="B4BAB68B596F05A2"){ //Micro-Service
          while(aDataItem.length < 4){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }else if(sMetaClassID.toUpperCase()==="B1EDB25D2C1401AF"){ //IT Service
          while(aDataItem.length < 3){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }else if(sMetaClassID.toUpperCase()==="B1EDB2562C14016F"){ //Application
          while(aDataItem.length < 2){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }
        
        if (!context.roots) context.roots = {};
        let rootArray = [];
        for (let rootId in context.roots){
          rootArray.push(context.roots[rootId]);
         
        }
        aDataItem.push({roots:rootArray});
        aData.push(aDataItem);
      }
    }
	}

	for (let itemId in impactData.sources){
		let oItem = impactData.sources[itemId];
    if (oItem.type_id.toLowerCase()===sMetaClassID.toLowerCase()){
      let oItemNature = {};
      oItemNature.nature = "Source";
      oItemNature.target = impactData.root.name;
      oItemNature.source = oItem.name;
      let contexts = oItem.contexts;
      
      if (!contexts || contexts.length === 0) contexts = [{}];
      for (let i = 0; i < contexts.length; i++){
        let context = contexts[i];
        let aDataItem = [];
        aDataItem.push(oItemNature);
        aDataItem.push(oItem);
        if (!context.path) context.path = [];
        let path = context.path.slice().reverse();
        for (let j = 0; j < path.length; j++){
          aDataItem.push(path[j]);
          
        }

        if(sMetaClassID.toUpperCase()==="B4BAB68B596F05A2"){ //Micro-Service
          while(aDataItem.length < 4){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }else if(sMetaClassID.toUpperCase()==="B1EDB25D2C1401AF"){ //IT Service
          while(aDataItem.length < 3){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }else if(sMetaClassID.toUpperCase()==="B1EDB2562C14016F"){ //Application
          while(aDataItem.length < 2){
            let emptyObject = {}
            aDataItem.push(emptyObject);
          }
        }
        if (!context.roots) context.roots = {};
        let rootArray = [];
        for (let rootId in context.roots){
          rootArray.push(context.roots[rootId]);
         
        }
        aDataItem.push({roots:rootArray});
        aData.push(aDataItem);
      }
    }
	}
	
	if(sMetaClassID.toUpperCase()==="B1EDB2562C14016F"){
		$("#"+sTableID).dataTable( {
			"paging": true,
			"bFilter": true,
			"sDom": '<"top"i>rt<"bottom"pl>',
			"aLengthMenu":[[10, 25, 50, -1],[10, 25, 50, "All"]],
			"iDisplayLength":25,
			"columnDefs": [
				{
					"render": function ( data, type, row ) {
						if (data){
							if (data.name){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+data.id+"\"><img src=\""+data.image+"\">&nbsp;</div>");
									pValue.append(pValueItem);
									let pValueItemLink = $("<a href=\""+data.href+"\"></a>");
									pValueItemLink.text(data.name);
									pValueItem.append(pValueItemLink);
									return pValue[0].outerHTML;
								}else{
									return data.name;
								}
							}else if (data.nature){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item\"></div>");
									if (data.nature=="Target"){
										pValueItem.text(data.source + " \uD83E\uDC62 ");// + data.target);
									}else{
										pValueItem.text(data.target + " \uD83E\uDC60 ");// + data.source);
									}
									pValue.append(pValueItem);
									return pValue[0].outerHTML;
								}else{
									return data.nature;
								}
							}else if (data.roots){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+root.id+"\"><img src=\""+root.image+"\">&nbsp;</div>");
                    pValue.append(pValueItem);
                    let pValueItemLink = $("<a href=\""+root.href+"\"></a>");
                    pValueItemLink.text(root.name);
                    pValueItem.append(pValueItemLink);
                  }
									return pValue[0].outerHTML;
								}else{
                  let rootName = "";
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    rootName+=root.name+" ";
                  }
									return rootName;
								}
							}
						}
						return "";
					},
					"targets": [0,1,2]
				}
			],
			"data":aData
		}).columnFilter({
			"sPlaceHolder": "head:before",
			"aoColumns": 
				[
					{"type":"select","bRegex":false},
					"text",
          "text"
				]
		});
		
	}else if(sMetaClassID.toUpperCase()==="B1EDB25D2C1401AF"){
		$("#"+sTableID).dataTable({
			"paging": true,
			"bFilter": true,
			"sDom": '<"top"i>rt<"bottom"pl>',
			"aLengthMenu":[[10, 25, 50, -1],[10, 25, 50, "All"]],
			"iDisplayLength":25,
			"columnDefs": [
				{
					"render": function ( data, type, row ) {
						if (data){
							if (data.name){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+data.id+"\"><img src=\""+data.image+"\">&nbsp;</div>");
									pValue.append(pValueItem);
									let pValueItemLink = $("<a href=\""+data.href+"\"></a>");
									pValueItemLink.text(data.name);
									pValueItem.append(pValueItemLink);
									return pValue[0].outerHTML;
								}else{
									return data.name;
								}
							}else if (data.nature){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item\"></div>");
									if (data.nature=="Target"){
										pValueItem.text(data.source + " \uD83E\uDC62 ");// + data.target);
									}else{
										pValueItem.text(data.target + " \uD83E\uDC60 ");// + data.source);
									}
									pValue.append(pValueItem);
									return pValue[0].outerHTML;
								}else{
									return data.nature;
								}
							}else if (data.roots){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+root.id+"\"><img src=\""+root.image+"\">&nbsp;</div>");
                    pValue.append(pValueItem);
                    let pValueItemLink = $("<a href=\""+root.href+"\"></a>");
                    pValueItemLink.text(root.name);
                    pValueItem.append(pValueItemLink);
                  }
									return pValue[0].outerHTML;
								}else{
									let rootName = "";
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    rootName+=root.name+" ";
                  }
									return rootName;
                }
              }
						}
						return "";
					},
					"targets": [0,1,2,3]
				}
			],
			"data":aData
		}).columnFilter({
			"sPlaceHolder": "head:before",
			"aoColumns": 
				[
					{"type":"select","bRegex":false},
					"text",
					"text",
          "text"
				]
		});
		
	}else if(sMetaClassID.toUpperCase()==="B4BAB68B596F05A2"){
		$("#"+sTableID).dataTable( {
			"paging": true,
			"bFilter": true,
			"sDom": '<"top"i>rt<"bottom"pl>',
			"aLengthMenu":[[10, 25, 50, -1],[10, 25, 50, "All"]],
			"iDisplayLength":25,
			"columnDefs": [
				{
					"render": function ( data, type, row ) {
						if (data){
							if (data.name){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+data.id+"\"><img src=\""+data.image+"\">&nbsp;</div>");
									pValue.append(pValueItem);
									let pValueItemLink = $("<a href=\""+data.href+"\"></a>");
									pValueItemLink.text(data.name);
									pValueItem.append(pValueItemLink);
									return pValue[0].outerHTML;
								}else{
									return data.name;
								}
							}else if (data.nature){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
									let pValueItem=$("<div class=\"propdatatable-value-item\"></div>");
									if (data.nature=="Target"){
										pValueItem.text(data.source + " \uD83E\uDC62 ");// + data.target);
									}else{
										pValueItem.text(data.target + " \uD83E\uDC60 ");// + data.source);
									}
									pValue.append(pValueItem);
									return pValue[0].outerHTML;
								}else{
									return data.nature;
								}
							}else if (data.roots){
								if (type==="display"){
									let pValue = $("<div class=\"propdatatable-value\"></div>");
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    let pValueItem=$("<div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+root.id+"\"><img src=\""+root.image+"\">&nbsp;</div>");
                    pValue.append(pValueItem);
                    let pValueItemLink = $("<a href=\""+root.href+"\"></a>");
                    pValueItemLink.text(root.name);
                    pValueItem.append(pValueItemLink);
                  }
									return pValue[0].outerHTML;
								}else{
									let rootName = "";
                  for (let i = 0; i < data.roots.length; i++){
                    let root = data.roots[i];
                    rootName+=root.name+" ";
                  }
									return rootName;
                }
              }
						}
						return "";
					},
					"targets": [0,1,2,3,4]
				}
			],
			"data":aData
		}).columnFilter({
			"sPlaceHolder": "head:before",
			"aoColumns": 
				[
					{"type":"select","bRegex":false},
					"text",
					"text",
					"text",
          "text"
				]
		});
		
	}
}



var d3ImpactDataSource = {}
function getD3ImpactData(sJson, bRootData) {
	if (d3ImpactDataSource[sJson])
		return d3ImpactDataSource[sJson];
	var d3ImpactData = {};
	d3ImpactData.nodes = [];
	d3ImpactData.links = [];

	if (!impactDataSource[sJson])
		impactDataSource[sJson] = getJsonSync(sJson);
	var impactData = impactDataSource[sJson];
	d3ImpactData.root = {
				name: impactData.root.name,
				id: impactData.root.id,
				type_id: impactData.root.type_id,
				type_name: impactData.root.type_name,
				href: impactData.root.href,
				image: impactData.root.image,
				noExpand: impactData.root.noExpand,
				rootData: bRootData,
				dataSource: impactData.root.id,
				contexts: {},
        states: impactData.root.states
	}
	d3ImpactData.root.contexts[impactData.root.id] = [];
	d3ImpactData.nodes.push(d3ImpactData.root);

	//Process Targets
	for (let targetId in impactData.targets) {
		let oItem = impactData.targets[targetId];
		if (!oItem.contexts) oItem.contexts = [];
		let node = {}
		let link = {}

		let bFound = false;
		for (let x = 0, xMax = d3ImpactData.nodes.length; x < xMax; x++) {
			node = d3ImpactData.nodes[x];
			if (node.id === oItem.id) {
				bFound = true;
				break;
			}

		}
		if (!bFound) {
			node = {
				name: oItem.name,
				id: oItem.id,
				type_id: oItem.type_id,
				type_name: oItem.type_name,
				href: oItem.href,
				image: oItem.image,
				noExpand: oItem.noExpand,
				rootData: bRootData,
				dataSource: d3ImpactData.root.id,
				contexts: {},
        states: oItem.states
			}
      node.contexts[d3ImpactData.root.id] = JSON.parse(JSON.stringify(oItem.contexts));
			d3ImpactData.nodes.push(node);
		} else {
			mergeContexts(oItem.contexts, node.contexts[d3ImpactData.root.id]);
		}

		bFound = false;
		for (let x = 0, xMax = d3ImpactData.links.length; x < xMax; x++) {
			link = d3ImpactData.links[x];
			if (link.source.id === d3ImpactData.root.id && link.target.id === node.id) {
				bFound = true;
				break;
			}

		}
		if (!bFound) {
			link = {
				source: d3ImpactData.root,
				target: node,
				rootData: bRootData,
				dataSource: d3ImpactData.root.id,
				contexts: {}
			}
      link.contexts[d3ImpactData.root.id] = JSON.parse(JSON.stringify(oItem.contexts));
			d3ImpactData.links.push(link);
		}else{
      mergeContexts(oItem.contexts, link.contexts[d3ImpactData.root.id]); 
    }
	}

	//Process Sources
	for (let sourceId in impactData.sources) {
		let oItem = impactData.sources[sourceId];
		if (!oItem.contexts) oItem.contexts = [];
		let node = {}
		let link = {}

		let bFound = false;
		for (let x = 0, xMax = d3ImpactData.nodes.length; x < xMax; x++) {
			node = d3ImpactData.nodes[x];
			if (node.id === oItem.id) {
				bFound = true;
				break;
			}

		}
		if (!bFound) {
			node = {
				name: oItem.name,
				id: oItem.id,
				type_id: oItem.type_id,
				type_name: oItem.type_name,
				href: oItem.href,
				image: oItem.image,
				noExpand: oItem.noExpand,
				rootData: bRootData,
				dataSource: d3ImpactData.root.id,
				contexts: {},
        states: oItem.states
			}
      node.contexts[d3ImpactData.root.id] = JSON.parse(JSON.stringify(oItem.contexts));
			d3ImpactData.nodes.push(node);
		} else {
			mergeContexts(oItem.contexts, node.contexts[d3ImpactData.root.id]);
		}

		bFound = false;
		for (let x = 0, xMax = d3ImpactData.links.length; x < xMax; x++) {
			link = d3ImpactData.links[x];
			if (link.target.id === d3ImpactData.root.id && link.source.id === node.id) {
				bFound = true;
				break;
			}

		}
		if (!bFound) {
			link = {
				target: d3ImpactData.root,
				source: node,
				rootData: bRootData,
				dataSource: d3ImpactData.root.id,
				contexts: {}
			}
      link.contexts[d3ImpactData.root.id] = JSON.parse(JSON.stringify(oItem.contexts));
			d3ImpactData.links.push(link);
		}else{
      mergeContexts(oItem.contexts, link.contexts[d3ImpactData.root.id]); 
    }
	}

	d3ImpactDataSource[sJson] = d3ImpactData;
	return d3ImpactData;
}

function getItemContextRoots(item){
  if (!item.contexts) return {};
  let ret = {};
  for (let contextId in item.contexts){
    let contexts = item.contexts[contextId];
    if (contexts){
      for (let i = 0; i < contexts.length; i++){
        let context = contexts[i];
        for (let rootId in context.roots){
          ret[rootId] = context.roots[rootId];
        }
      }
    }else{
      //console.log(item);
    }
  }
  return ret;
}

function getGraphContextRoots(graph){
  let allRoots = {};
  let ret = [];
  for (let i = 0; i < graph.nodes.length; i++){
    let node = graph.nodes[i];
    let roots = getItemContextRoots(node);
    for (let rootId in roots){
      allRoots[rootId] = roots[rootId];
    }
  }
  for (let rootId in allRoots){
    ret.push(allRoots[rootId]);
  }
  ret.sort(function(a,b){
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    return 0;
  });
  return ret;
}

function mergeContexts(sourceContexts, targetContexts){
  for (let i = 0; i < sourceContexts.length; i++){
    let sourceContext = sourceContexts[i];
    let bFound = false;
    if (!targetContexts) targetContexts = [];
    for (let j = 0; j < targetContexts.length; j++){
      let targetContext = targetContexts[j];
      let bIsSamePath = (sourceContext.path.length === targetContext.path.length);
      if (bIsSamePath){
        for (let k =0; k < sourceContext.path.length; k++){
          let sourcePathItem = sourceContext.path[k];
          let targetPathItem = targetContext.path[k]
          if (sourcePathItem.id !== targetPathItem.id){
            bIsSamePath = false;
            break;
          }
        }
      }
      if (bIsSamePath){
        for (let rootId in sourceContext.roots){
          targetContext.roots[rootId] = sourceContext.roots[rootId];
        }
        bFound = true;
        break;
      }
    }
    if (!bFound) targetContexts.push(sourceContext);
  }
  
}

function createForceGraph(sGraphID, sImpactDataLocation) {
	var d3ImpactData = getD3ImpactData(sImpactDataLocation, true);
	var store;
	var graph;
	var graphContainer = $("#" + sGraphID);
	var width, height;
	var chartWidth, chartHeight;
	var margin;
	var svg = d3.select("#" + sGraphID).append("svg");
  var chartLayer = svg.append("g").attr("class", "chartLayer");

  svg.append('defs').append('marker')
		.attr('id', 'arrowhead')
		.attr('viewBox', '-0 -5 10 10')
		.attr('refX', 11)
		.attr('refY', 0)
		.attr('orient', 'auto')
		.attr('markerWidth', 8)
		.attr('markerHeight', 8)
		.attr('xoverflow', 'visible')
		.append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#399')
      .style('stroke', 'none');

	main();

	function main() {
		var range = 100
			var data = {
			root: d3ImpactData.root,
			nodes: d3ImpactData.nodes,
			links: d3ImpactData.links
		}
		setSize(data)
		drawChart(data)
	}

	function setSize(data) {
		width = document.querySelector("#" + sGraphID).clientWidth;
		height = 700;
		margin = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		}
		chartWidth = width - (margin.left + margin.right);
    chartHeight = height - (margin.top + margin.bottom);
    svg.attr("width", width).attr("height", height);
	}

	var zoom_handler = d3.zoom().on("zoom", zoom_actions);

	zoom_handler(svg);

	//Zoom functions
	function zoom_actions() {
		chartLayer.attr("transform", d3.event.transform)
	}

	function drawChart(gData) {

		var currentMousePos = {
			x: -1,
			y: -1
		};
		graphContainer.mousemove(function (event) {
			currentMousePos.x = event.pageX;
			currentMousePos.y = event.pageY;
		});

		store = gData;
		graph = gData;
		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function (d) {
					return d.index
				}).strength(.5))
			///.force("collide",d3.forceCollide(40).iterations(16) )
			.force("collide", d3.forceCollide().radius(40).strength(.8))
			.force("charge", d3.forceManyBody().strength(0.5))
			//.force("center", d3.forceCenter(chartWidth / 2, chartHeight / 2))
			.force("y", d3.forceY(chartHeight / 2).strength(.25))
			.force("x", d3.forceX(chartWidth / 2).strength(.25))
			var links,
		link,
		nodes,
		nodeEnter,
		nodeCircle,
		nodeImage,
    nodeText
    var buttonContainer = $("#" + sGraphID).parent().find(".integration-graph-buttons");
  
		var sliderContainer = $("<div style=\"float:right;width:160px;\"/>");
		var sliderLabel = $("<div style=\"text-align:center;font-size:10px;padding-bottom:5px;\">Node Spacing</div>");
		var slider = $("<div/>");
		sliderContainer.append(sliderLabel);
		sliderContainer.append(slider);
		
		//console.log(buttonContainer);
    
		buttonContainer.append(sliderContainer);
		slider.slider({
			slide: function (event, ui) {
				//console.log(event);
				let v = ui.value + 40;
				simulation.force("collide", d3.forceCollide().radius(v)).restart();
				if (!isSlidingTimeOut) {
					simulation.alphaTarget(0.3).restart();
					isSlidingTimeOut = setTimeout(function () {
							simulation.alphaTarget(0).restart();
							isSlidingTimeOut = null;
						}, 100);

				}
				if (isSlidingTimeOut) {
					clearTimeout(isSlidingTimeOut);
					isSlidingTimeOut = setTimeout(function () {
							simulation.alphaTarget(0).restart();
							isSlidingTimeOut = null;
						}, 100);
				}
			}
		});
		var isSlidingTimeOut;
    
    
/*    var contextControlContainer = $("<div style=\"float:left;width:100%;padding-top:5px;\"><span>Context:&nbsp;</span></div>"); */
	var contextControlContainer = $("<div style=\"float:left;width:100%;padding-top:5px;\"><span></span></div>");
/*	var contextControl = $("<select style=\"border:1px solid #ccc;\"><option value=\"\">All Contexts</option></select>"); */
	var contextControl = $("");
    contextControlContainer.append(contextControl);
    let graphContextRoots = getGraphContextRoots(graph);
    for (let i = 0; i < graphContextRoots.length; i++){
      let graphContextRoot = graphContextRoots[i];
      let contextControlValue = $("<option value=\""+ graphContextRoot.id+"\"/>");
      contextControlValue.text(graphContextRoot.name);
      contextControl.append(contextControlValue);
    }
    buttonContainer.append(contextControlContainer); 
    
    contextControl.change(function(){
      contextFilterValue = $(this).val();
      console.log("contextFilterValue: " + contextFilterValue);
      filter();
			update();
			graphSearch();
    });

    
    var dateControl = $("<input style=\"border:1px solid #ccc;\" type=\"text\" size=\"15\">");
    
    contextControlContainer.append("<span style=\"margin-left:20px;\">Date:&nbsp;</span>");
    contextControlContainer.append(dateControl);
    dateControl.datepicker();
    dateControl.datepicker("option", "dateFormat", "yy/mm/dd");
    dateControl.datepicker('setDate', new Date());
    dateControl.change(function(){
      currentDateValue = $(this).val();
      console.log("currentDateValue: " + currentDateValue);
      update(true);
	  graphSearch();
    });
    
    var dateEnabledControl = $("<input style=\"border:1px solid #ccc;\" type=\"checkbox\">");
    contextControlContainer.append("<span style=\"margin-left:20px;\">Colorize by State:&nbsp;</span>");
    contextControlContainer.append(dateEnabledControl);
    dateEnabledControl.click(function(){
      currentDateEnabledValue = $(this).prop("checked");
      update(true);
	  graphSearch();
    });
	
	var searchControl = $("<input style=\"float:right;border:1px solid #ccc;\" type=\"text\" size=\"15\">");
	contextControlContainer.append(searchControl);
    contextControlContainer.append("<span style=\"float:right;margin-left:20px;\">Search:&nbsp;</span>");
    
    searchControl.change(function(){
      graphSearchValue = $(this).val();
      graphSearch();
    }).keyup(function(){
		graphSearchValue = $(this).val();
      graphSearch();
	});
	
/*	var expandControl = $("<button style=\"margin-left:20px;\" type=\"button\" class=\"expand-btn\">Show All Links</button>"); */
	var expandControl = $("");
	contextControlContainer.append(expandControl);
    
    expandControl.click(function(){
		let bUpdate = false;
		for (let i = 0; i < graph.nodes.length; i++){
			if ( !(graph.nodes[i].expanded || graph.nodes[i].expandedAll) ){
				graph.nodes[i].expanded = true;
				addD3Data(graph.nodes[i], false, true);
				bUpdate = true;
			}
		}
		if (bUpdate){
			filter();
			update();
			expandControl.addClass("hidden");
		}else{
			alert("All links are already in view");
		}
    });
    
    
		function filter() {
			//	add and remove nodes from data based on type filters
			graph = {}
			graph.root = store.root;
			graph.links = [];
			graph.nodes = [];
			store.nodes.forEach(function (n) {
				if (typeFilterList.includes(n.type_id) || n.id === graph.root.id || (n.fixed)) {
          if (contextFilterValue !== ""){
            let contextRoots = getItemContextRoots(n);
            if (contextRoots[contextFilterValue] || n.id === graph.root.id){
              n.depends = {};
              graph.nodes.push(n);
            }
            
          }else{
            n.depends = {};
            graph.nodes.push(n);
          }
				}
			});

			//	add and remove links from data based on availability of nodes
			store.links.forEach(function (l) {
				/*
				if ((l.source.id===graph.root.id && typeFilterList.includes(l.target.type_id)) ||
				(typeFilterList.includes(l.source.type_id) && l.target.id===graph.root.id)) {
				graph.links.push(l);
				}
				 */
				if ((typeFilterList.includes(l.source.type_id) && typeFilterList.includes(l.target.type_id)) ||
					(((l.source.id === graph.root.id || (l.source.fixed)) && (typeFilterList.includes(l.target.type_id) || (l.target.fixed))) ||
						((typeFilterList.includes(l.source.type_id) || (l.source.fixed)) && (l.target.id === graph.root.id || (l.target.fixed))))) {
					if (l.source.id !== l.target.id) {
            if (contextFilterValue !== ""){
              let contextSourceRoots = getItemContextRoots(l.source);
              let contextTargetRoots = getItemContextRoots(l.target);
			  let contextRoots = getItemContextRoots(l);
              if ( ((contextRoots[contextFilterValue] && contextSourceRoots[contextFilterValue])|| l.source.id === graph.root.id) &&
                   ((contextRoots[contextFilterValue] && contextTargetRoots[contextFilterValue])|| l.target.id === graph.root.id) ){
                if (!l.source.depends[l.target.id])
                  l.source.depends[l.target.id] = l.target;
                if (!l.target.depends[l.source.id])
                  l.target.depends[l.source.id] = l.source;
                
                graph.links.push(l);
              }
              
            }else{
              if (!l.source.depends[l.target.id])
                l.source.depends[l.target.id] = l.target;
              if (!l.target.depends[l.source.id])
                l.target.depends[l.source.id] = l.source;
              graph.links.push(l);
            }
            /*
            if (!l.source.depends[l.target.id])
                l.source.depends[l.target.id] = l.target;
              if (!l.target.depends[l.source.id])
                l.target.depends[l.source.id] = l.source;
              graph.links.push(l);
						*/
					}
				}
			});
			//console.log(store.nodes);
			
			let bCandidateForExpand = false
			for (let i = 0; i < graph.nodes.length; i++){
				if ( !(graph.nodes[i].expanded || graph.nodes[i].expandedAll || graph.root.id === graph.nodes[i].id) ){
					bCandidateForExpand = true;
					break;
				}
			}
			if (bCandidateForExpand){
				expandControl.removeClass("hidden");
			}else{
				expandControl.addClass("hidden");
			}
		}
    
    function getLifeCycleColor(dC, defColor){
      if (!currentDateEnabledValue) return defColor;
      selectedDate = new Date(currentDateValue);
      if (dC.states && dC.states.length > 0){
        let earliestDate, latestDate;
        for (let i = 0; i < dC.states.length; i++){
          
          let state = dC.states[i];
          let startDate = new Date(state.startDate);
          if (i === 0) earliestDate = startDate;
          
          let endDate = new Date(state.endDate);
          if (i === dC.states.length-1) latestDate = endDate;
          
          if (selectedDate >= startDate && selectedDate < endDate){
            return state.color;
          }
        }
        if (selectedDate < earliestDate){
          return defColor;
        }else{
          return "#cc0000";
        }
        
        
      }
      return defColor;
    }

		function update(bNoAlpha) {
			svg.selectAll("g.links").remove();
			if (links)
				links.remove();
			links = chartLayer.append("g")
				.attr("class", "links")
				.selectAll("line")
				.data(graph.links)

				if (link)
					link.remove();
				link = links.enter()
				.append("path")
				.attr("stroke", "#399")
				.attr('marker-end', 'url(#arrowhead)')
				.attr("fill", "none")

				svg.selectAll("g.nodes").remove();
			if (nodes)
				nodes.remove();
			nodes = chartLayer.append("g")
				.attr("class", "nodes")
				.selectAll("g")
				.data(graph.nodes)

				if (nodeEnter)
					nodeEnter.remove();
				nodeEnter = nodes.enter()
				.append("g")
				.attr("class", "node")
				.attr("width", 20)
				.attr("height", 20)

				if (nodeText)
					nodeText.remove();
				nodeText = nodeEnter.append("text")
				.text(function (d) {
					return d.name;
				})
				.attr("style", "font-size:8pt;font-family:sans-serif;")

				if (nodeCircle)
					nodeCircle.remove();
				nodeCircle = nodeEnter.append("circle")
				.attr("r", 17)
				.style("fill", function (dC) {
					if (dC.fixed) {
						return "#ccc";
					} else {
						return getLifeCycleColor(dC, "ccc"); //"#cbb";
					}
				}).style("stroke", function (dC) {
					if (dC.fixed) {
						return getLifeCycleColor(dC, "aaa"); //"#595";
					} else {
						return "#aaa";
					}
				}).style("stroke-width",function(dC) {
          if (dC.fixed) {
						return 3;
					} else {
						return 1;
					}
        })          
				.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended))
				//.on("mouseenter", handleMouseOver)
				//.on("mouseleave", handleMouseOut)


				if (nodeImage)
					nodeImage.remove();
				nodeImage = nodeEnter.append("image")
				.attr("xlink:href", function (d) {
					return d.image;
				})
				.attr("height", 20)
				.attr("width", 20)
				.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended))
				.on("mouseover", handleMouseOver)
				.on("click", handleMouseCick)
				.on("mouseout", handleMouseOut)

				simulation
				.nodes(graph.nodes)
				.on("tick", ticked);

			simulation.force("link")
			.links(graph.links);
      if (bNoAlpha){
        simulation.alphaTarget(0).restart();
      }else{
        simulation.alphaTarget(1).restart();
        setTimeout(function () {
          simulation.alphaTarget(0).restart();

        }, 500);
      }
		
		}

		function positionLink(d) {
			let p1 = {
				"x": d.source.x,
				"y": d.source.y
			},
			p2 = {
				"x": d.target.x,
				"y": d.target.y
			};

			var p1New = getPoint(p1, p2, 16);
			var p2New = getPoint(p2, p1, 16);
			p1 = p1New;
			p2 = p2New;

			//console.log({"p1":p1,"p2":p2});

			// mid-point of line:
			let mp = {
				"x": (p2.x + p1.x) * 0.5,
				"y": (p2.y + p1.y) * 0.5
			}

			// angle of perpendicular to line:
			let theta = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2;

			let dist = getDistance(p1, p2);
			//console.log("distance:" +dist);
			let offset = getDistance(p1, p2) / 5;

			// location of control point:
			let c1 = {
				"x": mp.x + offset * Math.cos(theta),
				"y": mp.y + offset * Math.sin(theta)
			}

			// construct the command to draw a quadratic curve
			let curve = "M" + parseInt(p1.x) + " " + parseInt(p1.y) + " Q " + parseInt(c1.x) + " " + parseInt(c1.y) + " " + parseInt(p2.x) + " " + parseInt(p2.y);
			//console.log(curve);
			return curve;
		}

		function getDistance(p1, p2) {
			var xs = p2.x - p1.x,
			ys = p2.y - p1.y;
			xs *= xs;
			ys *= ys;
			return Math.sqrt(xs + ys);
		}

		function getPoint(p1, p2, dist) {
			let ratio = dist / getDistance(p1, p2);
			let pNew = {
				"x": p1.x + (ratio * (p2.x - p1.x)),
				"y": p1.y + (ratio * (p2.y - p1.y))
			}
			//if (pNew.x - p1.x > 10 || pNew.y - p1.y > 10)
			//	console.log({"p1":p1,"p2":p2,"pNew":pNew,"dist":getDistance(p1,p2),"distNew":getDistance(p1,pNew)});
			return pNew;
		}

		var ticked = function () {

			link
			/*
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; })
			 */
			.attr("d", positionLink);

			nodeEnter
			.attr("x", function (d) {
				return d.x - 10;
			})
			.attr("y", function (d) {
				return d.y - 10;
			});
			nodeCircle
			.attr("cx", function (d) {
				return d.x;
			})
			.attr("cy", function (d) {
				return d.y;
			});
			nodeImage
			.attr("x", function (d) {
				return d.x - 10;
			})
			.attr("y", function (d) {
				return d.y - 10;
			});
			nodeText
			.attr("x", function (d) {
				return d.x + 20;
			})
			.attr("y", function (d) {
				return d.y + 10;
			});
		}
		update();
		var typeFilterList = [];
		typeFilterList.push("B1EDB2562C14016F");
    var contextFilterValue = "";
    var currentDateValue = new Date();
    var currentDateEnabledValue = false;
	var graphSearchValue = "";
		filter();
		update();

		function dragstarted(d) {
			/*
			if (!d3.event.active) simulation.alphaTarget(0.1).restart();
			d.fx = d.x;
			d.fy = d.y;
			isDragging = true;
			 */
			simulation.stop();
		}

		function dragged(d) {

			d.fx = d3.event.x;
			d.fy = d3.event.y;
			d.x = d3.event.x;
			d.y = d3.event.y;
			ticked();
		}

		function dragended(d) {
			/*
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
			isDragging = false;
			 */
			if (!d.fixed) {
				d.fx = null;
				d.fy = null;
			}
			ticked();
			simulation.alphaTarget(0.1).restart();
			setTimeout(function () {
				simulation.alphaTarget(0).restart();

			}, 100);
		}

		function fix_nodes(this_node) {
			nodeEnter.each(function (d) {
				if (this_node != d) {
					//console.log(d);
					d.fx = d.x;
					d.fy = d.y;
				}
			});
		}

		let handleMouseOutTimeOut;
		let handleMouseOverTimeOut;
		let isDragging;
		let graphMenuContainer = $("<div class=\"graph-menu-container hidden\"/>");
		$("#" + sGraphID).append(graphMenuContainer);
		graphMenuContainer.mouseenter(function () {
			//console.log("graphMenuContainer.mouseover");
			//if (handleMouseOutTimeOut){
			//	clearTimeout(handleMouseOutTimeOut);

			//}

		}).mouseleave(function () {
			//console.log("graphMenuContainer.mouseout");
			graphMenuContainer.addClass("hidden");
			graphMenuContainer.empty();
			//handleMouseOverTimeOut = null;
			//handleMouseOutTimeOut = null;

		});

		function handleMouseCick(d) {
			highlightObject(d);
			bHighlighted = true;

			if (d.id !== graph.root.id) {
				graphMenuContainer.append("<a href=\"" + d.href + "\" target=\"_blank\">Open</a>");
				if (!d.noExpand) {
					if (!d.expanded) {
						let graphMenuItemExpand = $("<a href=\"javascript:void(0);\">Expand Links</a>");
						graphMenuContainer.append(graphMenuItemExpand);
						graphMenuItemExpand.click(function () {
							graphMenuContainer.addClass("hidden");
							addD3Data(d, false);
						});

					}
					if (!d.expandedAll) {
						let graphMenuItemExpandAll = $("<a href=\"javascript:void(0);\">Expand All</a>");
						graphMenuContainer.append(graphMenuItemExpandAll);
						graphMenuItemExpandAll.click(function () {
							graphMenuContainer.addClass("hidden");
							addD3Data(d, true);
						});

					}
          if (d.expanded || d.expandedAll) {
						let graphMenuItemCollapse = $("<a href=\"javascript:void(0);\">Collapse</a>");
						graphMenuContainer.append(graphMenuItemCollapse);
						graphMenuItemCollapse.click(function () {
							graphMenuContainer.addClass("hidden");
							removeD3Data(d);
						});

					}
				}
			}
			if (!d.fixed) {
				let graphMenuItemFixed = $("<a href=\"javascript:void(0);\">Fix Node</a>");
				graphMenuContainer.append(graphMenuItemFixed);
				graphMenuItemFixed.click(function () {
					d.fixed = true;
					d.fx = d.x;
					d.fy = d.y;
          update(true);
         /*
					nodeCircle.style("fill", function (dC) {
						if (dC.fixed) {
							return "#bcb";
						} else {
							return "#cbb";
						}
					}).style("stroke", function (dC) {
						if (dC.fixed) {
							return "#595";
						} else {
							return "#955";
						}
					});
           */
					graphMenuContainer.addClass("hidden");
				});
			} else {
				let graphMenuItemFixed = $("<a href=\"javascript:void(0);\">Unfix Node</a>");
				graphMenuContainer.append(graphMenuItemFixed);
				graphMenuItemFixed.click(function () {
					d.fixed = false;
					d.fx = null;
					d.fy = null
          update(true);
          /*
						nodeCircle.style("fill", function (dC) {
							if (dC.fixed) {
								return "#bcb";
							} else {
								return "#cbb";
							}
						}).style("stroke", function (dC) {
							if (dC.fixed) {
								return "#595";
							} else {
								return "#955";
							}
						});
          */
					graphMenuContainer.addClass("hidden");
				});

			}
			graphMenuContainer.removeClass("hidden");

			graphMenuContainer.css({
				"left": (currentMousePos.x - 50) + "px",
				"top": (currentMousePos.y - 160 ) + "px"
			})

		}

		function handleMouseOver(d) {
			if (isDragging)
				return;
			if (handleMouseOutTimeOut) {
				clearTimeout(handleMouseOutTimeOut);
				handleMouseOutTimeOut = null;
			}
			if (!handleMouseOverTimeOut) {
				handleMouseOverTimeOut = setTimeout(function () {
						highlightObject(d);
					}, 100);
			}
		}

		function handleMouseOut(d) {

			if (handleMouseOverTimeOut) {
				handleMouseOutTimeOut = setTimeout(function () {
						clearTimeout(handleMouseOverTimeOut);
						handleMouseOverTimeOut = null;
						if (!bHighlighted)
							highlightObject(null);
					}, 10)
			}
		}

		graphContainer.on("click", function (e) {
			if (!$(e.target).closest('.node').length) {
				highlightObject(null);
				bHighlighted = false;
			}
		});

		var highlighted;
		var bHighlighted;
		function highlightObject(obj) {
			//console.log(obj);
			if (obj) {
				if (obj !== highlighted) {
					nodeEnter.classed('graph-inactive', function (d) {
						//console.log(d);
						return (obj.id !== d.id && !d.depends[obj.id]);
					});
					nodeEnter.classed('graph-active', function (d) {
						//console.log(d);
						return (obj.id === d.id || d.depends[obj.id]);
					});
					link.classed('graph-inactive', function (d) {
						return (obj.id !== d.source.id && obj.id !== d.target.id);
					});
					link.classed('graph-active', function (d) {
						return (obj.id === d.source.id || obj.id === d.target.id);
					});
				}
				highlighted = obj;
			} else {
				if (highlighted) {
					nodeEnter.classed('graph-inactive', false);
					link.classed('graph-inactive', false);
					nodeEnter.classed('graph-active', false);
					link.classed('graph-active', false);
				}
				highlighted = null;
			}
		}
		
		function graphSearch() {
			//console.log(obj);
			
			if (graphSearchValue !== "") {
				nodeEnter.classed('graph-filtered', function (d) {
					return (d.name.toLowerCase().indexOf(graphSearchValue.toLowerCase()) === -1);
				});
				link.classed('graph-filtered', true);

			} else {
				nodeEnter.classed('graph-filtered', false);
				link.classed('graph-filtered', false);
			}
		}

		function addD3Data(d, bExpandAll, bSkipUpdate) {
			//console.log(d);
			if (bExpandAll) {
				d.expandedAll = true;
				d.expanded = true;
			} else {
				d.expanded = true;
			}
			let sJsonPath = "../json/" + d.id + "_integration.json";
			let d3ImpactDataTemp = getD3ImpactData(sJsonPath);
			let targetNodes = store.nodes;
			let targetLinks = store.links;
			let sourceNodes = d3ImpactDataTemp.nodes;
			let sourceLinks = d3ImpactDataTemp.links;

			
				for (let i = 0; i < sourceNodes.length; i++) {
					
					let bNodeFound = false;
					for (let j = 0; j < targetNodes.length; j++) {
						if (targetNodes[j].id === sourceNodes[i].id) {
							bNodeFound = true;
							mergeNode(sourceNodes[i],targetNodes[j], d.id);
							break;
						}

					}
					if (!bNodeFound && bExpandAll) {
						targetNodes.push(JSON.parse(JSON.stringify(sourceNodes[i])));
					}else{
            
          
				}
			}
			for (let i = 0; i < sourceLinks.length; i++) {
				let bLinkFound = false;
				for (let j = 0; j < targetLinks.length; j++) {
					if (targetLinks[j].source.id === sourceLinks[i].source.id && targetLinks[j].target.id === sourceLinks[i].target.id) {
						bLinkFound = true;
						mergeLink(sourceLinks[i], targetLinks[j], d.id);
						break;
					}

				}
				if (!bLinkFound) {
          
					let addLink = {};
					let contexts = sourceLinks[i].contexts;
					addLink.contexts = {}
					for (let contextId in contexts){
							addLink.contexts[contextId] = JSON.parse(JSON.stringify(contexts[contextId]));
						}
					//addLink.contexts = sourceLinks[i].contexts;
					for (let k = 0; k < targetNodes.length; k++) {
						if (targetNodes[k].id === sourceLinks[i].source.id) {
							addLink.source = targetNodes[k];
						}
						if (targetNodes[k].id === sourceLinks[i].target.id) {
							addLink.target = targetNodes[k];
						}

						if (addLink.target && addLink.source)
							break;
					}
					//console.log(addLink);
					if (addLink.source && addLink.target)
						targetLinks.push(addLink);
          
          //targetLinks.push(sourceLinks[i]);
				}else{
          
        }
			}
			if (!bSkipUpdate){
				filter();
				update();
			}
		}
    
		function removeD3Data(d) {
			//console.log(d);
      d.expandedAll = false;
      d.expanded = false;

      let sourceNodes = store.nodes;
      let sourceLinks = store.links;
			let targetNodes = [];
			let targetLinks = [];



      for (let i = 0; i < sourceNodes.length; i++) {
        let sourceNode = sourceNodes[i];
        if (sourceNode.rootData){
          targetNodes.push(sourceNode);
        }else{
          if (sourceNode.contexts[d.id]){
            delete sourceNode.contexts[d.id];
            if (Object.keys(sourceNode.contexts).length > 0){
              targetNodes.push(sourceNode);
            }
          }else{
			 targetNodes.push(sourceNode);
		  }
        }
      }
      
      for (let i = 0; i < sourceLinks.length; i++) {
        let sourceLink = sourceLinks[i];
        if (sourceLink.rootData){
          targetLinks.push(sourceLink);
        }else{
          if (sourceLink.contexts){
            if (sourceLink.contexts[d.id]){
              delete sourceLink.contexts[d.id];
              if (Object.keys(sourceLink.contexts).length > 0){
                targetLinks.push(sourceLink);
              }
            }else{
				targetLinks.push(sourceLink);
			}
          }else{
            //console.log(sourceLink);
          }
        }
      }
      
      store.nodes = targetNodes;
      store.links = targetLinks;
			filter();
			update();
		}
    
    function mergeLink(sourceLink, targetLink, datasourceId){
      //if (targetLink.rootData) return;
      targetLink.contexts[datasourceId] = JSON.parse(JSON.stringify(sourceLink.contexts[datasourceId]));
    }
    
    function mergeNode(sourceNode, targetNode, datasourceId){
      //if (targetNode.rootData) return;
      targetNode.contexts[datasourceId] = JSON.parse(JSON.stringify(sourceNode.contexts[datasourceId]));
    }

		//	filter button event handlers
		$(".filter-btn").on("click", function () {
			var button = $(this);
			var id = button.attr("value");
			if (typeFilterList.includes(id)) {
				typeFilterList.splice(typeFilterList.indexOf(id), 1);
				button.removeClass("active");
			} else {
				typeFilterList.push(id);
				button.addClass("active");
			}
			filter();
			update();
		});

	}
}
