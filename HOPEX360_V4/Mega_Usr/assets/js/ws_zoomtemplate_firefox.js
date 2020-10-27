///////////////////////////////////////////////
////                              Variables                                ////
///////////////////////////////////////////////

// This define the zoom factor, in %
var zoomFactor = 0.1;

//Global variables
var originalImageSize = new Object;
var originalCoord = new Array();
var cpt=0;

///////////////////////////////////////////////
////                       Get Image Size                             ////
///////////////////////////////////////////////

function GetImageSize(diagNumber)
{
	cpt=cpt+1;
	imgTable=document.getElementById("Diag"+diagNumber).getElementsByTagName('IMG');

	if(cpt==1)
	{
		GetOriginalSize(diagNumber);
		GetOriginalMap(diagNumber);
	}

	var oSize = new Object;
	oSize.width = imgTable[5].width;
	oSize.height = imgTable[5].height;
	return(oSize);
}

function GetOriginalSize(diagNumber)
{
	originalImageSize.width = imgTable[5].width;
	originalImageSize.height = imgTable[5].height;
}


///////////////////////////////////////////////
////                       Image Resize                                ////
///////////////////////////////////////////////

function SetImageSize(width,height,diagNumber)
{
	imgTable=document.getElementById("Diag"+diagNumber).getElementsByTagName('IMG');
	imgTable[5].width=width;
	imgTable[5].height=height;
}

///////////////////////////////////////////////
////                       Zoom In Function                         ////
///////////////////////////////////////////////


function ZoomIn(diagNumber)
{

	// Modify image size
	var oSize;
	oSize = GetImageSize(diagNumber);
	oSize.height = oSize.height + oSize.height * zoomFactor;
	oSize.width = oSize.width + oSize.width * zoomFactor;
	SetImageSize(oSize.width,oSize.height,diagNumber);
	var areaLength = document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length;

// Modify image map
	for ( k = 0; k < areaLength; k++)
	{
		var eltArea;
		eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
		strCoord = eltArea[k].getAttribute("coords");

		var collCoord = strCoord.split(",");
		var coordLength = collCoord.length;
		var strNewCoord = String("");
		var bFirst = true;
		for(var l = 0; l<coordLength; l++){
			if(!bFirst){
				strNewCoord = strNewCoord.concat(", ");
			}
			else bFirst = false;		
			strNewCoord = strNewCoord.concat(String(parseInt(collCoord[l])+parseInt(collCoord[l])*zoomFactor));
		}
		eltArea[k].setAttribute("coords", strNewCoord);
	}
}


///////////////////////////////////////////////
////                       Zoom Out Function                       ////
///////////////////////////////////////////////

function ZoomOut(diagNumber)
{
// Modify image size
	var oSize;
	oSize = GetImageSize(diagNumber);
	oSize.height = oSize.height - oSize.height * zoomFactor;
	oSize.width = oSize.width - oSize.width * zoomFactor;
	SetImageSize(oSize.width,oSize.height,diagNumber);
	var areaLength = document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length;

// Modify image map
	for ( k = 0; k < areaLength; k++)
	{
		var eltArea;
		eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
		strCoord = eltArea[k].getAttribute("coords");

		var collCoord = strCoord.split(",");
		var coordLength = collCoord.length;
		var strNewCoord = String("");
		var bFirst = true;
		for(var l = 0; l<coordLength; l++){
			if(!bFirst){
				strNewCoord = strNewCoord.concat(", ");
			}
			else bFirst = false;		
			strNewCoord = strNewCoord.concat(String(parseInt(collCoord[l])-parseInt(collCoord[l])*zoomFactor));
		}
		eltArea[k].setAttribute("coords", strNewCoord);
	}
}

///////////////////////////////////////////////
////                            Original Size                           ////
///////////////////////////////////////////////

function OriginalSize(diagNumber)
{
	if(imgTable)
	{
		imgTable[5].width = originalImageSize.width;
		imgTable[5].height = originalImageSize.height;
		SetMap(diagNumber, originalCoord);
	}
}

///////////////////////////////////////////////
////                          Size to Width                            ////
///////////////////////////////////////////////

function SizeToWidth(diagNumber)
{
	GetImageSize(diagNumber);
	// Get frame size
	var h = "";
	var w = "";
	var factor = "";
	if (document.all)
	{
		h=document.body.clientHeight;
		w=document.body.clientWidth;
	}
	else
	{
		w=window.innerWidth;
		h=window.innerHeight;
	}

	// new sizes
	w=w-35;
	factor = w/originalImageSize.width;
	h = factor * originalImageSize.height;

	SetImageSize(w,h,diagNumber);
	SetMap(diagNumber, originalCoord);
	
	var areaLength = document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length;
	for ( k = 0; k < areaLength; k++)
	{
		var eltArea;
		eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
		strCoord = eltArea[k].getAttribute("coords");

		var collCoord = strCoord.split(",");
		var coordLength = collCoord.length;
		var strNewCoord = String("");
		var bFirst = true;
		for(var l = 0; l<coordLength; l++){
			if(!bFirst){
				strNewCoord = strNewCoord.concat(", ");
			}
			else bFirst = false;		
			strNewCoord = strNewCoord.concat(String(parseInt(collCoord[l])*factor));
		}
		eltArea[k].setAttribute("coords", strNewCoord);
	}	
}

///////////////////////////////////////////////
////                          Size to Height                           ////
///////////////////////////////////////////////

function SizeToHeight(diagNumber)
{
	GetImageSize(diagNumber);
	// Get frame size
	var h = "";
	var w = "";
	var factor = "";
	if (document.all)
	{
		h=document.body.clientHeight;
		w=document.body.clientWidth;
	}
	else
	{
		w=window.innerWidth;
		h=window.innerHeight;
	}

	// new sizes
	h = h - 170;
	factor = h/originalImageSize.height;
	w = originalImageSize.width * factor;


	SetImageSize(w,h,diagNumber);
	SetMap(diagNumber, originalCoord);
	
	var areaLength = document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length;
	for ( k = 0; k < areaLength; k++)
	{
		var eltArea;
		eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
		strCoord = eltArea[k].getAttribute("coords");

		var collCoord = strCoord.split(",");
		var coordLength = collCoord.length;
		var strNewCoord = String("");
		var bFirst = true;
		for(var l = 0; l<coordLength; l++){
			if(!bFirst){
				strNewCoord = strNewCoord.concat(", ");
			}
			else bFirst = false;		
			strNewCoord = strNewCoord.concat(String(parseInt(collCoord[l])*factor));
		}
		eltArea[k].setAttribute("coords", strNewCoord);
	}		
}



///////////////////////////////////////////////
////                                     Map                                  ////
///////////////////////////////////////////////


function GetOriginalMap(diagNumber)
{
	for ( k = 0; k < document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length; k++)
	{
		var eltArea;
		eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
		originalCoord[k] = eltArea[k].getAttribute("coords");
	}
}

function SetMap(diagNumber, strNewCoord)
{
	var eltArea;
	eltArea=document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA");
	for ( k = 0; k < document.getElementById("Diag"+diagNumber).getElementsByTagName("AREA").length; k++)
	{
		eltArea[k].setAttribute("coords", strNewCoord[k]);
	}
}

