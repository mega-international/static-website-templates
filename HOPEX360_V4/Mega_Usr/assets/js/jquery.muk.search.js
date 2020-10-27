var sSearchTerm = "";
var sSearchCategory = "";
var jsonResult = [];
var searchGUI = {
	searchTerm:"Search Term",
	name:"Name",
	objectType:"Object Type",
	comment:"Comment",
	noResultsMessage:"<div>There were no results found.<br>Make sure the spelling is correct or try another word.</div>",
	inputErrorMessage:"Please enter 2 or more characters to search"
}
function loadSearchResults(json){

	if (json) {
		$.each(json.data, function(index, item){
			if (sSearchCategory === "" || item.name.toLowerCase() === sSearchCategory){
				var jsonCat = getSearchJson("../search/" + item.id + ".js");
				if (jsonCat && jsonCat.data){
					$.each(jsonCat.data,function(index2, item2){
						if (item2.name.toLowerCase().indexOf(sSearchTerm.toLowerCase()) > -1){
							jsonResult.push({name:item2.name,id:item2.id,comment:item2.comment,classname:item.name,classid:item.id,type:item2.type,icon:item2.icon});
						}
					});
				}
			}

		});
		if (jsonResult.length > 0){
			var $resultsinfo = $("<div>" + searchGUI.searchTerm + ": \"" + sSearchTerm + "\"</div>");
			$("#body-content-searchcriteria").append($resultsinfo);
			var $table = $("<table class=\"propdatatable\">" +
			                "<thead>" +
								"<tr>" + 
									"<th class=\"propdatatable-cell col4\">" + searchGUI.name + "</th>" +
									"<th class=\"propdatatable-cell col2\">" + searchGUI.objectType + "</th>" + 
									"<th class=\"propdatatable-cell col6\">" + searchGUI.comment + "</th>" + 
								"</tr>" +
							"</thead>" +
						"</table>");

			$("#body-content-searchresults").append($table);
			var $tablebody = $("<tbody/>");
			$table.append($tablebody);

			$.each(jsonResult, function(index, item){
				$tablebody.append("<tr>" + 
									"<td class=\"propdatatable-cell\"><div class=\"propdatatable-value\"><div class=\"propdatatable-value-item tooltip-object\" data-tooltip-id=\""+item.id+"\"><img src=\"" + item.icon +"\">&nbsp;<a href = \"" + item.id + ".htm\">" + $('<span>').text(item.name).html() + "</a></div></div></td>" +
									"<td class=\"propdatatable-cell\"><span>" + $('<span>').text(item.type).html() + "</span></td>" +	
									"<td class=\"propdatatable-cell\"><span>" + $('<span>').text(item.comment).html() + "</span></td>" +	
								  "</tr>");
			});
			$table.dataTable({
				"paging": true,
				"bFilter": true,
				"sDom": '<"top"i>rt<"bottom"pl><"hidden"f>',
				aLengthMenu:[[10, 25, 50, -1],[10, 25, 50, "All"]],
				columnDefs: [ { orderable: false, targets: [1] }]
			})

			.columnFilter({
				sPlaceHolder: "head:before",
				aoColumns: 
					[
						null,
						{
							type: "select",
							bRegex:false
						},
						null
					]
			})
			.globalFilterReset().excelExport();
		}else{
			var $resultsinfo = $("<div>" + searchGUI.searchTerm + ": \"" + sSearchTerm + "\"</div>");
			          
			$("#body-content-searchcriteria").append($resultsinfo);
			$("#body-content-searchresults").append(searchGUI.noResultsMessage);
		}
	}
	else{
		sSearchTerm = getURLSearchParameter();
		sSearchCategory = getURLSearchParameter("searchcat");
		loadSearchJson("../search/index.js");
	}
}



function loadSearchJson(jsonLocation) {
    $.ajax({ 
        url: jsonLocation,
        type:"get",
        dataType: "json",
        async: true,
        success: function(j) { 
            loadSearchResults(j);
        },
        error: function (request, status, errorThrown) {
            alert(errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
}

function getSearchJson(jsonLocation) {
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
            alert("Error in: " + jsonLocation + "\n" + errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
	return json;
}


function requestSearch(sWebPage){
	var sText = $("#search-text").val();
	if (!sText || sText.length < 2){
		alert(searchGUI.inputErrorMessage);

	}
	else{
		window.location = sWebPage+"?searchterm=" + encodeURIComponent(sText);	
	}
	return false;
}

function requestCategorySearch(sWebPage, category){
	var sText = $("#information-search-text").val();
	if (!sText || sText.length < 2){
		alert(searchGUI.inputErrorMessage);

	}
	else{
		window.location = sWebPage+"?searchterm=" + encodeURIComponent(sText) + "&searchcat=" + encodeURIComponent(category);	
	}
	return false;
}


function getURLSearchParameter(searchParam){
    var url = decodeURI(window.location.href);
    
    if (url.indexOf("?") > -1){
        url = url.slice(url.indexOf("?") + 1);
        if (url.indexOf("&") > -1){
            var hashes = url.split("&");
            for (var i = 0; i < hashes.length; i++){
                if (hashes[i].indexOf("=") > -1){
						
                    data = hashes[i].split("=");
                    param = decodeURIComponent(data[0]);
                    value = decodeURIComponent(data[1]);
					if (!searchParam){
						if (param === "searchterm") {return value;}
					}else{
						if (param === searchParam) {return value;}
					}
                }
            }
        }else{
			if (url.indexOf("=") > -1){
					
				data = url.split("=");
				param = decodeURIComponent(data[0]);
				value = decodeURIComponent(data[1]);
				if (!searchParam){
					if (param === "searchterm") {return value;}
				}else{
					if (param === searchParam) {return value;}
				}
			}			
		}
    }

	return "";
}


function loadCategoryAsTable(containerID, categoryID, json, showDescription){

	if (json) {
		jsonResult = json.data;
		if (jsonResult.length > 0){

			var $table = $("<table class=\"propdatatable\">" +
			                "<thead>" +
							"<tr>" +
								"<th class=\"propdatatable-cell\" style=\"width:200px;\">"+searchGUI.name+"</th>" +
								((showDescription)?"<th class=\"propdatatable-cell\">"+searchGUI.comment+"</th>":"") + 
							"</tr>" +
							"</thead>" +
						"</table>");

			$("#" + containerID).append($table);
			var $tablebody = $("<tbody/>");
			$table.append($tablebody);

			$.each(jsonResult, function(index, item){
				$tablebody.append("<tr>" + 
				                  "<td class=\"propdatatable-cell\"><span><span class=\"object-color-swatch color-" + categoryID + "\"></span><img src=\""+item.icon+"\"><a href = \"" + item.id + ".htm\">" + item.name + "</a></span></td>" +
				                  ((showDescription)?"<td class=\"propdatatable-cell\"><span>" + item.comment + "</span></td>":"") +
								  "</tr>");
			});
			$table.dataTable({
				"paging": true,
				"bFilter": true,
				"sDom": '<"top"if>rt<"bottom"pl>',
				aLengthMenu:[[10, 25, 50, -1],[10, 25, 50, "All"]],
				columnDefs: ((showDescription)?[ { orderable: false, targets: [1] },{searchable: false, targets: [1]}]:[])
			})

			.columnFilter({
				sPlaceHolder: "head:before",
				aoColumns:((showDescription)?[null,null]:[null])
			});
		}
	}else{
		$.ajax({ 
        url: "../search/"+categoryID+".js",
        type:"get",
        dataType: "json",
        async: true,
        success: function(j) { 
            loadCategoryAsTable(containerID, categoryID, j);
        },
        error: function (request, status, errorThrown) {
            alert(errorThrown);
        },
        complete: function( xhr, status ){
            //alert(status);
        }
    });
	}
}
	