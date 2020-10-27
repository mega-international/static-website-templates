var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
		 function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }
    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

function populateTable(dynaRecords, tableId, columnsName){
    var len = dynaRecords.length;
    var i;
    var tbody = ""; var imgFile = "";
    tbody += "<table id='sortabletable' class='table table-sm  table-bordered table-cell-resizable table-index-set-col-width-4 table-custom-style table-scrollX' width='100%' cellspacing='0'><thead><tr><th class='thead_select'>Type</th><th class='thead_search'>Name</th><th class='thead_search'>Comment</th><th class='thead_search'>Last Update</th></tr></thead><tbody>";
	
    for (i = 0; i < len; i++) {
		tbody += "<tr><td>" + dynaRecords[i]["Type"] + "</td><td>" + dynaRecords[i]["Title"] +"</td><td>" + dynaRecords[i]["Comment"] +"</td><td>" + dynaRecords[i]["Date"] +"</td></tr>";
    }
    tbody += "</tbody></table>";
	$("div#" + tableId).html(tbody);
}

function all_items_present(str, items) {
	var i;
	var len = items.length;
	var found = true;
	for (i = 0; i < len; i++) {
		if (str.search(items[i]) == -1) {
			found = false;
			break;
		}
	}
	return found;
}

function recherche() {
    var searchField = $_GET["search"];
    if ( typeof searchField == "undefined" || searchField == "search...")
        //searchField = "";
		return;
    var output = [];
    var count = 0;
    var keywords = searchField.split(" ");
    var len = searchTable.length;
    var i;
    for (i = 0; i < len; i++) {
        var val = searchTable[i]["Title"].replace(/<[^>]*>/g, '').toLowerCase();
		//typeof val.Comment != "undefined" && all_items_present(val.Comment.replace(/<[^>]*>/g, '').toLowerCase(), keywords)
        if (all_items_present(val, keywords) || searchField ==  "") {
            output[count]= searchTable[i];
            count++;
        }
    }
    $("Searchtable").css("display", "block");
    populateTable(output, "home_page");
	$.fn.dataTable.moment( 'DD/MM/YYYY' );
	var table = $('#sortabletable').DataTable({
		dom: 'lBrtip',
		orderCellsTop: true,
		fixedHeader: false,
		buttons: [
			$.extend( true, {}, getExportOptions(), {
				extend: 'excelHtml5',
				customize: function( xlsx ) {
					var sheet = xlsx.xl.worksheets['sheet1.xml'];
					$('row c', sheet).attr( 's', '55' );
				},
				title: ''
			} )
		],
		scrollX:true
	});
}