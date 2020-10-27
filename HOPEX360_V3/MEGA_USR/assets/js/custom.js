
function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("scrollToTopBtn").style.display = "block";
	} else {
		document.getElementById("scrollToTopBtn").style.display = "none";
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function zoomOutUntilFitToWindow(num) {
	//var img=document.getElementById("Diag1").getElementByName("img");
	var div=document.getElementById("Diag"+num);
	var img=div.getElementsByTagName("img");
	var width=img[5].clientWidth;
	var height=img[5].clientHeight;
	var widthD=div.offsetWidth;
	var heightD=div.offsetHeight;
	if (width > widthD || height > heightD) {
		return true;
	}
	return false;
}

function showDiagOnClick(elem){ //show the right diagram
	
	var x = document.getElementsByClassName('diag'); // we get all Diags
	var e = elem.getAttribute("value"); // we take the value of the diag we clicked on
	for (var i=0; i < x.length ;i++){
		x[i].style.display="none"; //hide if it's not the good diag
		if (x[i].id == e){
			x[i].style.display="block";
			x[i].style.textAlign="left";
		}
	}
}


function getExportOptions() {
	var buttonOptions = {
		exportOptions: {
			stripHtml: false,
			format: {
				body: function ( data, column, row ) {
					if (data.indexOf('<script>') !== -1) {
						while (data.indexOf('<script>') !== -1) {
							var scriptStartPosition = data.indexOf('<script>');
							var scriptEndPosition = data.indexOf('</script>');
							var dataFirstHalf = data.substring(0, scriptStartPosition);
							var dataSecondHalf = data.substring(scriptEndPosition + 9);
							data = dataFirstHalf + dataSecondHalf;
						}
					}
					if (data.indexOf('+ (') !== -1) {
						while (data.indexOf('+ (') !== -1) {
							var scriptStartPosition = data.indexOf('+ (');
							var scriptEndPosition = data.indexOf(')');
							var dataFirstHalf = data.substring(0, scriptStartPosition);
							var dataSecondHalf = data.substring(scriptEndPosition + 1);
							data = dataFirstHalf + dataSecondHalf;
						}
					}
					data = data.replace( /\n/g, '' );
					//data = data.replace( /^\s+/g, '' ); // TO REMOVE LEADING WHITESPACE (NOT WORKING)
					data = data.replace( '&amp;', '&' );
					data = data.replace( /<br>/g, '\n' );
					data = data.replace(/(&nbsp;|<([^>]+)>)/ig, "");
					return data;
				}
			}
		}
	}
	return buttonOptions;
}

function setHref() {
	var els=document.querySelectorAll("area");
	for (var i=0;i<els.length;i++) {
		var org=els[i].getAttribute("href");
		if (org.indexOf("htm") >= 0) {
			els[i].setAttribute("href","pages/"+els[i].getAttribute("href"));
		}
	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

function sortArrayIndices (data) {
	var test = data;
	var len = test.length;
	var indices = new Array(len);
	for (let i = 0; i < len; ++i) indices[i] = i;
	indices.sort(function (a, b) { return test[a] < test[b] ? -1 : test[a] > test[b] ? 1 : 0; });

	return indices;
}

function onlyUnique(value, index, self) { 
	return self.indexOf(value) === index;
}

function clearChart (canvasId, width, height) {
	var parent = document.getElementById(canvasId).parentElement;
	var child = document.getElementById(canvasId);
	parent.removeChild(child);
	if ((width != '') && (height =! '')) {
		parent.innerHTML = '<canvas id="' + canvasId + '" width="' + width + '" height="' + height + '"></canvas>'; 
	} else {
		parent.innerHTML = '<canvas id="' + canvasId + '" aria-label="' + canvasId + '" role="img"></canvas>'; 
	}
	return;
}
