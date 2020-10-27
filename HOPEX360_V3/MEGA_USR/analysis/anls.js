/***************************Report Studio V2*****************************/

function studioreport_updateViewFilterData(strReportDataViewHexaIdAbs, strReportFilterHexaIdAbs, strPrefix, strNewValue)
{
  var sCurrentFilterValues = "";
  eval("sCurrentFilterValues  = view" + strReportDataViewHexaIdAbs + ";");

  var tFilters = sCurrentFilterValues.split("&_&");
  var bFoundFilter = false;
  for (var i=0; (i<tFilters.length) && (bFoundFilter == false); i++) {
    var tFilter = tFilters[i].split("%_%");
    if (tFilter[0] == strReportFilterHexaIdAbs)
    {
      bFoundFilter = true;
      var bFoundPrefix = false;
	  for (var j=1; (j<tFilter.length) && (bFoundPrefix == false); j++) {
        var sFilterValues = tFilter[j];
        if (sFilterValues.substring(0, 3) == strPrefix) 
        {
          bFoundPrefix = true;
          //We replace the value        
          var newFilter = tFilters[i].replace(sFilterValues, strPrefix + strNewValue); 
          sCurrentFilterValues = sCurrentFilterValues.replace(tFilters[i], newFilter); 
        } 
      }
      if (bFoundPrefix == false)
      {
        var newFilter = tFilters[i] + strPrefix + strNewValue + "%_%";
        sCurrentFilterValues = sCurrentFilterValues.replace(tFilters[i], newFilter); 
      }
    }
  }
  if (bFoundFilter == false)
  {
    //We add the filter with it's value
    sCurrentFilterValues = sCurrentFilterValues + strReportFilterHexaIdAbs + "%_%" + strPrefix + strNewValue + "%_%" + "&_&";
  }
  
  eval("view" + strReportDataViewHexaIdAbs + " = sCurrentFilterValues;");
  return sCurrentFilterValues;
}

function studioreport_ComputeFilter_RefreshView(strReportDataViewHexaIdAbs, strRefreshData){
  var mgRoot = external.MegaRoot;

  var oReportStudioV2 = mgRoot.CurrentEnvironment.GetMacro("~U)raQOvYMHmL[]");
    
  var strViewCode = "";
  var sReportXML = "";
  eval("sReportXML = reportxml;");
  var sIsReportXML = "";
  eval("sIsReportXML = xmlreport;");
  if (sIsReportXML == "0")
  {
    strViewCode = oReportStudioV2.getReportDataViewCode(mgRoot, mgRoot, sReportXML, strRefreshData);
  }
  else
  {
    strViewCode = oReportStudioV2.getReportDataViewCodeXML(mgRoot, mgRoot, sReportXML, strRefreshData);
  }
  
  var strDivID = "Immediate_Refresh_" + strReportDataViewHexaIdAbs;
  document.getElementById(strDivID).innerHTML = strViewCode;

  //Script for tab creation is not executed in innerHTML !
  var oMyComponent = document.getElementById(strDivID);
  var containedScripts = oMyComponent.getElementsByTagName("script");
  for (var i = 0; i < containedScripts.length; i++) {
    eval(containedScripts[i].innerHTML);
  }
  
  var strJSON
  strJSON = "{\"data\":" + "\"" + strRefreshData + "\"}";
  external.ContextObject("PageContext").setData(strJSON);
  external.ContextObject("PageContext").notify('CLICK'); 
  
  mgRoot.release;
  oReportStudioV2.release;
}

function studioreport_ComputeFilter_RefreshFilter(strReportDataViewHexaIdAbs, strReportDataSetHexaIdAbs, strReportFilterHexaIdAbs, strRefreshData){
  var mgRoot = external.MegaRoot;
  var oReportStudioV2 = mgRoot.CurrentEnvironment.GetMacro("~U)raQOvYMHmL[]");
  
  var strFilterCode = "";
  var sReportXML = "";
  eval("sReportXML = reportxml;");
  var sIsReportXML = "";
  eval("sIsReportXML = xmlreport;");
  if (sIsReportXML == "0")
  {
    strFilterCode = oReportStudioV2.getReportFilterCode(mgRoot, mgRoot, sReportXML, strRefreshData, strReportDataViewHexaIdAbs, strReportDataSetHexaIdAbs, strReportFilterHexaIdAbs);
    var strFilterDivID = "Refresh_Filter_" + strReportFilterHexaIdAbs;
    
    var filterDiv = document.getElementById(strFilterDivID);
    if (filterDiv != null)
    {
      filterDiv.innerHTML = strFilterCode;
    }

  }
  
  mgRoot.release;
  oReportStudioV2.release;
}

function studioreport_ComputeFilter_NonImmediateRefresh(strReportFilterId, strFilterData, strContentAndDataSet){ 
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
  
    var sCurrentFilterValues;
    eval("sCurrentFilterValues = " + "view" + tFilters[i] + ";");
      
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + sCurrentFilterValues;
    studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
    studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
  }
}

function studioreport_ComputeFilter_InferiorTo(bImmediate, strFilterData, strContentAndDataSet, strNewValue){
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "IT_", strNewValue);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

function studioreport_ComputeFilter_SuperiorTo(bImmediate, strFilterData, strContentAndDataSet, strNewValue){
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "ST_", strNewValue);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

function studioreport_ComputeFilter_EqualTo(bImmediate, strFilterData, strContentAndDataSet, strNewValue){
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "VA_", strNewValue);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

function studioreport_ComputeFilter_CheckBox(bImmediate, strFilterData, strContentAndDataSet, strNewValue){
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "VA_", strNewValue);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

function studioreport_ComputeFilter_EmptyValues(bImmediate, strFilterData, strContentAndDataSet, select){
  //Return an array of the selected option values
  // select is an HTML select element
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value);
    }
  }
  
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "EV_", result);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}
  
function studioreport_ComputeFilter_Enum(bImmediate, strFilterData, strContentAndDataSet, select){
  //Return an array of the selected option values
  // select is an HTML select element
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value);
    }
  }
  
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "VA_", result);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData); 
    }
  }
}

function studioreport_ComputeFilter_Collection(bImmediate, strFilterData, strContentAndDataSet, select){
  //Return an array of the selected option values
  // select is an HTML select element
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value);
    }
  }
  
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "CO_", result);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

function studioreport_ComputeFilter_Object(bImmediate, strFilterData, strContentAndDataSet, select){
  //Return an array of the selected option values
  // select is an HTML select element
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value);
    }
  }
  
  var tFilters = strFilterData.split("%%_%%");
  for (var i=0; (i<tFilters.length-1); i=i+3) {
    var strRefreshData = tFilters[i] + "##" + strContentAndDataSet + "##" + studioreport_updateViewFilterData(tFilters[i], tFilters[i+2], "OB_", result);
    if (bImmediate == true)
    {
      studioreport_ComputeFilter_RefreshView(tFilters[i], strRefreshData);
      studioreport_ComputeFilter_RefreshFilter(tFilters[i], tFilters[i+1], tFilters[i+2], strRefreshData);
    }
  }
}

/*********************************************************************************************************************/


function NAEprintEdit(sReportId) {
  var oRoot = external.MegaRoot;
  var oPlugin = oRoot.CurrentEnvironment.GetMacro("~yRmh8Gh7LHAT");
  oPlugin.InvokeOnRoot(oRoot,sReportId);
}

function onContainerCmd(prm,attctl) {
  //Report Edition is not available in windows mode
  var result = ""; 
  if (prm === "initialize")
  { 
  }
  if (prm === "apply")
  { 
  }
  if (prm === "refresh")
  {  
    attctl.Refresh();
  }
  return result;
}

function NAEInPlaceEditAndRefresh(e, sId, sPropId, sHasFont, sHasIcon) {
	var x=(!e.clientX) ? e.pageX-window.pageXOffset : e.clientX;
	var y=(!e.clientY) ? e.pageY-window.pageYOffset : e.clientY;
	var oRoot = external.MegaRoot;
	var oPlugin = oRoot.CurrentEnvironment.GetMacro("~oNTsLVG)Cn)8");
	var sResult = oPlugin.InvokeOnRoot(oRoot,sId+"|"+sHasIcon+"|"+sPropId+"|"+sHasFont+"|"+(x+2)+"|"+(y+2));
	var tDatas = sResult.split("$|$");
	if (tDatas[1].length>0) {
		var targs = getElementsById("MO_"+tDatas[0]);
		for(i=0;i<targs.length;i++){
			targs[i].innerHTML = tDatas[1];
		}
	}
}

function NAEReportSave(sFile, sContentsUID, strObjID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  var oRoot = external.MegaRoot;
  var oPlugin = oRoot.CurrentEnvironment.GetMacro("~putpt)SAIb87");
  oPlugin.InvokeOnRoot(oRoot,sFile + "$|$" + sContents + "$|$" + "$|$" + strObjID);
}

function NAEReportV2SaveAs(sType, sContentsUID, strObjID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  var oRoot = external.MegaRoot;
  var oPlugin = oRoot.CurrentEnvironment.GetMacro("~nLEgwnRmM1u5");
  oPlugin.InvokeOnRoot(oRoot,sType + "$|$" + sContents + "$|$" + strObjID);
}

function NAEWidgetSave(sFile, sContentsUID, strObjID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  var oRoot = external.MegaRoot;
  var oPlugin = oRoot.CurrentEnvironment.GetMacro("~putpt)SAIb87");
  oPlugin.InvokeOnRoot(oRoot,sFile + "$|$" + sContents + "$|$widget" + "$|$" + strObjID);
}

function NAEReportExport(sAnalysis, sReport, sFile, sContentsUID, sFormat)  {
	var oRoot = external.MegaRoot;
	var oPlugin = oRoot.CurrentEnvironment.GetMacro("~jQHj3NBfCf70[Analysis.OpenAs.Macro]");
	var sContents = "";
	if (sContentsUID.length>1) {
		sContents = escape(document.getElementById(sContentsUID).innerHTML);
	}
	oPlugin.InvokeOnRoot(oRoot,sFormat+"$|$"+sAnalysis+"$|$"+sReport+"$|$"+sFile+"$|$"+sContents+ "$|$" + "0");
}

function NAEExportToXLS(sReport, sAnalysis) {
	NAEReportExport(sAnalysis,sReport,'','','XLS');
}

function NAEOpenParametrization(sAnalysis, sReport) {
	var oRoot = external.MegaRoot;
	var oPlugin = oRoot.CurrentEnvironment.GetMacro("~aYOY6euIE5GQ[Analysis Chapter Parametrization]");
	oPlugin.InvokeOnRoot(oRoot,sAnalysis+"|"+sReport);
	NAEDisplayReport(sReport, sAnalysis, "0");
}

function OpenAnalysisDiagramTab(sDataProcessingInformationXmlFileName) {
	var oRoot = external.MegaRoot;
	var oPlugin = oRoot.CurrentEnvironment.GetMacro("~qFlvzS(oDzC4[Anywhere Analysis Diagram Tab] ");
	oPlugin.InvokeOnRoot(oRoot,sDataProcessingInformationXmlFileName);
}

function NAECreateLinkedObjectAndUpdate(sSourceObjectId, sMAEId, sPropId) {
	var oRoot = external.MegaRoot;
	var oSource = oRoot.getObjectFromId(sSourceObjectId);
	var oColl = oSource.getCollection(sMAEId);
	var oIC = oColl.InstanceCreator();
	oIC.mode = 1;
	oIC.property("~f10000000b20[Comment]","Visible")=true;
	oIC.property("~f10000000b20[Comment]","Updatable")=true;
	oIC.property("~f10000000b20[Comment]","Mandatory")=true;
	var oNew = oRoot.getObjectFromId(oIC.create());
	if (oNew.Exists()) {
		var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
		var sNewVal = oAnalysisPlugin.getFormatedProperty(oNew, sPropId, "", "","");
		if (sNewVal.length>0) {
			sNewVal = "<li><div id=\"MO_" + oNew.getPath + "_" + sPropId + "\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" style='cursor:hand' onclick='PropertyPageWithActivePageAndRefresh(\"" + oNew.getPath + "\", \"\",\"" + sPropId + "\",\"\",\"\")'>"+sNewVal+"</div></li>";
			var targs = getElementsById("MONEW_"+sSourceObjectId+"_"+sMAEId);
			for(i=0;i<targs.length;i++){
				targs[i].innerHTML = sNewVal + targs[i].innerHTML;
			}
		}
	}
}
function NAEOpenXmlAnalysis(sXmlAnalysisId,sObjectId) {
	var oRoot = external.MegaRoot;
	var sXmlAnalysis = "xmlanalysis-"+sXmlAnalysisId;
	var oObject = oRoot.getObjectFromId(sObjectId);
	var clientName = oObject.getProp("~210000000900[Name]");
	oObject.CallMethod("~2pGyZ5)wCf30[AddPanel]", "~w0(8(wIxC910[Analysis Generic Formatter]", clientName, sXmlAnalysisId, sXmlAnalysis);
}

// tabs on renderers
function NAEmanageTabs(sViewId, iNumOfTabs, sDivNames) {
	var oTabsDiv = document.getElementById(sViewId+"_M");
	var tDivNames = sDivNames.split('|');
	var sTabs = "<ul>";
	var sClass = "NAEshownRenderTT";
	for (var i=1;i<=iNumOfTabs;i++) {
	  sTabs = sTabs + "<li id=\"" + sViewId + "_M_T" + i + "\" class=\"" + sClass + "\" onClick=\"NAEShowHideTab('" + sViewId + "'," + iNumOfTabs + "," + i + ")\">" + tDivNames[i - 1] + "</li>";
	  sClass = "NAEhiddenRenderTT";
	}
	sTabs += "</ul>"; 
	oTabsDiv.innerHTML = sTabs;
	NAEShowHideTab(sViewId, iNumOfTabs,1);
}

// tab click
function NAEShowHideTab(sViewId, iNumOfTabs, iTabId) {
  var oDiv;
  var oTitle;
	for (var i=1;i<=iNumOfTabs;i++) {
	  oDiv = document.getElementById(sViewId + "_" + i);
	  oTitle = document.getElementById(sViewId + "_M_T" + i);
		if(i==iTabId) {
		  oDiv.className = "NAEshownRenderTab";
		  oTitle.className = "NAEshownRenderTT";
		} else {
		  oDiv.className = "NAEhiddenRenderTab";
		  oTitle.className = "NAEhiddenRenderTT";
		}
	}
}

// Cleanup images
function NAECleanup() {
	try {
		var oRoot = external.MegaRoot;
		var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
		oAnalysisPlugin.cleanupFromHTML(document.body.innerHTML);
	} catch(err) {	}
}
// Reload the full analysis
function NAEAnalysisReload(sAnalysisId) {
	var oRoot = external.MegaRoot;
	var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
	var oAnalysis = oAnalysisPlugin.newAnalysisFromMegaInstance(oRoot.getObjectFromID(sAnalysisId),true);
	oAnalysisPlugin.cleanupFromHTML(document.body.innerHTML);
	document.body.innerHTML = oAnalysis.DesktopGenerate();
}

function NAEDisplayReportFromXML(sRXMLid, sChapterHexaIdAbs, sRepEdObjId, sTemplateObjectID, bIsRefreshForced, sWidth, sWait) {
    var sFormat = "HTML";
    if (bIsRefreshForced == "true") {
        sFormat = "HTMLRE";
    }
    var oXML = escape(document.getElementById(sRXMLid).innerHTML);
    
    var oMyComponent = document.getElementById("RC_" + sChapterHexaIdAbs);
 
	var oRoot = external.MegaRoot;
	var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
    oMyComponent.innerHTML = "<img src=\""+oAnalysisPlugin.getResourceURL("loading.gif",oRoot,oRoot)+"\"/>";
	var oMacro = oRoot.CurrentEnvironment.GetMacro("~jQHj3NBfCf70");
    
    var sResult = oMacro.invokeOnRoot(oRoot, sFormat + "$|$$|$" + sChapterHexaIdAbs + "$|$$|$" + oXML + "$|$" + sWidth);
    
	oMyComponent.innerHTML = unescape(sResult);
        
	if (bIsRefreshForced == "true") {
      var oMyGG = document.getElementById("SCR_" + sChapterHexaIdAbs);
      if (oMyGG) {
        var allGDDSpans = oMyGG.getElementsByTagName("span");
        for (var i = 0; i < allGDDSpans.length; i++) {
          if (allGDDSpans[i].id.indexOf('GDD_') == 0) {
            allGDDSpans[i].innerHTML = "&nbsp;";
		}
	}
      }
	}
    
	var containedScripts = oMyComponent.getElementsByTagName("script");
	for (var i = 0; i < containedScripts.length; i++) {
		eval(containedScripts[i].innerHTML);
	}
}

// Generates a report asynchronously and shows it - Step 1
function NAEDisplayReport(sReportId, sAnalysisId, sForced, sWidth) {
  var oMyComponent = document.getElementById("RC_"+sReportId+"_"+sAnalysisId);
  oMyComponent.style.visibility='visible';
  oMyComponent.style.display='block';
  var oRoot = external.MegaRoot;
    
  var oAnalysis = oRoot.getObjectFromID(sAnalysisId);
  var oRefreshDataSetsMacro = oRoot.CurrentEnvironment.GetMacro("~HWQTi8vZMrCX[]");
  oRefreshDataSetsMacro.refreshReportDataSets(oAnalysis);
         
  var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
  oAnalysisPlugin.cleanupFromHTML(oMyComponent.innerHTML);
  oMyComponent.innerHTML = "<img src=\""+oAnalysisPlugin.getResourceURL("loading.gif",oRoot,oRoot)+"\"/>";
  setTimeout("NAEDisplayReport2('"+sReportId+"','"+sAnalysisId+"','"+sForced+"')",100);
}

// Generates a report asynchronously and shows it - Step 2
function NAEDisplayReport2(sReportId, sAnalysisId, sForced) {
	var oMyComponent = document.getElementById("RC_"+sReportId+"_"+sAnalysisId);
	var oRoot = external.MegaRoot;
	var oAnalysisPlugin = oRoot.CurrentEnvironment.GetMacro("~9MuFp4qmBD40[Analysis Plugin]");
	var oAnalysis = oAnalysisPlugin.newAnalysisReportFromMegaInstance(oRoot.getObjectFromID(sAnalysisId),oRoot.getObjectFromID(sReportId));
	if (sForced) {
		if(sForced=="true") {
			oAnalysis.setForceRefresh(true);
		}
	}
	oMyComponent.innerHTML = oAnalysis.DesktopGenerate();
	var oShowHide = document.getElementById("SH_"+sReportId+"_"+sAnalysisId);
	oShowHide.innerHTML = oShowHide.innerHTML.replace(/openreport/g,"closereport");
	oShowHide.onclick = function() { NAEHide(sReportId+"_"+sAnalysisId) };
	if (sForced) {
		if(sForced=="true") {
			oAnalysis.setForceRefresh(false);
			var oGenDateDur = document.getElementById("GDD_" + sReportId + "_" + sAnalysisId);
			if (oGenDateDur) {
				oGenDateDur.innerHTML = "&nbsp;";
			}
		}
	}
	var containedScripts = oMyComponent.getElementsByTagName("script");
	for (var i=0; i<containedScripts.length; i++) {
		eval(containedScripts[i].innerHTML);
	}
}
// Hides a report
function NAEHide(sReportId) {
	var oShowHide = document.getElementById("SH_"+sReportId);
	oShowHide.innerHTML = oShowHide.innerHTML.replace(/closereport/g,"openreport");
	oShowHide.onclick = function() { NAEShow(sReportId) };
	document.getElementById("RC_"+sReportId).style.visibility='hidden';
	document.getElementById("RC_"+sReportId).style.display='none';
}
// Shows an already generated report
function NAEShow(sReportId) {
	var oShowHide = document.getElementById("SH_"+sReportId);
	oShowHide.innerHTML = oShowHide.innerHTML.replace(/openreport/g,"closereport");
	oShowHide.onclick = function() { NAEHide(sReportId) };
	document.getElementById("RC_"+sReportId).style.visibility='visible';
	document.getElementById("RC_"+sReportId).style.display='block';
}

function TogafProjDiagShow(sReportId) {
	var oShowHide = document.getElementById("SH_"+sReportId);
	if(document.getElementById("RC_"+sReportId).style.visibility == "visible")
	{
	  document.getElementById("RC_"+sReportId).style.visibility = "hidden";
	  oShowHide.innerHTML = oShowHide.innerHTML.replace(/closereport/g,"openreport");
	}
	else
	{
     document.getElementById("RC_"+sReportId).style.visibility = "visible";
	 oShowHide.innerHTML = oShowHide.innerHTML.replace(/openreport/g,"closereport");	   
	}
	if(document.getElementById("RC_"+sReportId).style.display == "block")
	{
	  document.getElementById("RC_"+sReportId).style.display  = "none";
	}
	else
	{
	  document.getElementById("RC_"+sReportId).style.display  = "block";
	}
}

//Show a bubble
function NAEShowBubble(sBubbleId) {
	document.getElementById(sBubbleId).style.visibility='visible';
	document.getElementById(sBubbleId).style.display='block';
}
//Hide a bubble
function NAEHideBubble(sBubbleId) {
	document.getElementById(sBubbleId).style.visibility='hidden';
	document.getElementById(sBubbleId).style.display='none';
}
// Opens the contextual menu on a mega object in the Mega Desktop
function NAEopenMegaObjectMenu(oRoot, idMegaObject) {
  var oMegaObject = oRoot.GetObjectFromId(idMegaObject);
  if (oMegaObject.getid != 0) {
	oMegaObject.CommandManager.TrackPopup;
  }
  window.event.returnValue = false;
}
// Show a subtree
function NAEShowSubTree(sElementId) {
	var oMyComponent = document.getElementById("SH_"+sElementId);
	oMyComponent.innerHTML = oMyComponent.innerHTML.replace(/openreport/g,"closereport");
	oMyComponent.onclick = function() { NAEHideSubTree(sElementId) };
	var iIndex = 1;
	while (oMyComponent = document.getElementById("ST_"+sElementId + "_" + iIndex)) {
		oMyComponent.style.visibility="visible";
		oMyComponent.style.display="";	
		iIndex++;
	};
}
// Hide a subtree
function NAEHideSubTree(sElementId) {
	var oMyComponent;
	while (oMyComponent = document.getElementById("SH_"+sElementId)) {
		oMyComponent.innerHTML = oMyComponent.innerHTML.replace(/closereport/g,"openreport");
		oMyComponent.onclick = function() { NAEShowSubTree(sElementId) };
		break;
	};
	var iIndex = 1;
	while (oMyComponent = document.getElementById("ST_"+sElementId + "_" + iIndex)) {
		oMyComponent.style.visibility="hidden";
		oMyComponent.style.display="none";	
		NAEHideSubTree(sElementId + "_" + iIndex);
		iIndex++;
	};
}
// Callback management
function NAECallback(sCallbackId, sCellId, sColumnObjectsIds, sRowObjectsIds, oUserData) {
	var oRoot = external.MegaRoot;
	var oCallbackPlugin = oRoot.CurrentEnvironment.GetMacro(sCallbackId);
	var oMyCell = document.getElementById(sCellId);
	var sCellContent = oMyCell.innerHTML;
	var ocColumnMegaObjects = oRoot.GetSelection("");
	var ocRowMegaObjects = oRoot.GetSelection("");
	if (sColumnObjectsIds != "") {
		var aColumnObjectsIds = sColumnObjectsIds.split(';');
		for (var i=0; i < aColumnObjectsIds.length - 1; i++) {
			var oColumnObject = oRoot.GetObjectFromId(aColumnObjectsIds[i]);
			if (oColumnObject.GetId != 0) {
				ocColumnMegaObjects.insert(oColumnObject);
			}
		}
	}
	if (sRowObjectsIds != "") {
		var aRowObjectsIds = sRowObjectsIds.split(';');
		for (var i=0; i < aRowObjectsIds.length - 1; i++) {
			var oRowObject = oRoot.GetObjectFromId(aRowObjectsIds[i]);
			if (oRowObject.GetId != 0) {
				ocRowMegaObjects.insert(oRowObject);
			}
		}
	}
	oMyCell.innerHTML = oCallbackPlugin.Callback(oRoot, sCellContent, ocColumnMegaObjects, ocRowMegaObjects, oUserData);
}
// Sort a table by a given column
//  id  - ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
//  col - Index of the column to sort, 0 = first column, 1 = second column,
//        etc.
//  rev - If true, the column is sorted in reverse (descending) order
//        initially.
//  row - where the sort begins
function NAEsortTable(id, col, row, rev, isCurrency) {
  // Get the table or table section to sort.
  var tblEl = document.getElementById(id);
  // The first time this function is called for a given table, set up an
  // array of reverse sort flags.
  if (tblEl.reverseSort == null) {
    tblEl.reverseSort = new Array();
  }
  // If this column has not been sorted before, set the initial sort direction.
  if (tblEl.reverseSort[col] == null)
    tblEl.reverseSort[col] = rev;
  // If this column was the last one sorted, reverse its sort direction.
  if (col == tblEl.lastColumn)
    tblEl.reverseSort[col] = !tblEl.reverseSort[col];
  // Remember this column as the last one sorted.
  tblEl.lastColumn = col;
  // Set the table display style to "none" - necessary for Netscape 6 
  // browsers.
  var oldDsply = tblEl.style.display;
  tblEl.style.display = "none";

  // Sort the rows based on the content of the specified column using a
  // selection sort.
  var tmpEl;
  var i, j;
  var minVal, minIdx;
  var testVal;
  var cmp;

  for (i = row; i < tblEl.tBodies[0].rows.length - 1; i++) {
    var bCmpI = true;
    var idI = tblEl.tBodies[0].rows[i].cells.item(col).id; 
    if ((idI !== null) && (idI !== ""))
    if (idI.substr(0,8) === "endline_")
    {
      {
        bCmpI = false;
      }
    }
    if (bCmpI == true)
    {
    // Assume the current row has the minimum value.
    minIdx = i;
    minVal = NAEgetTextValue(tblEl.tBodies[0].rows[i].cells[col]);

    // Search the rows that follow the current one for a smaller value.
    for (j = i + 1; j < tblEl.tBodies[0].rows.length; j++) {
        var bCmpJ = true;
        var idJ = tblEl.tBodies[0].rows[j].cells.item(col).id;        
        if ((idJ !== null) && (idJ !== ""))
        {
          if (idJ.substr(0,8) === "endline_")
          {
            bCmpJ = false;
          }
        }
        if (bCmpJ == true)
        {
      testVal = NAEgetTextValue(tblEl.tBodies[0].rows[j].cells[col]);
      cmp = NAEcompareValues(minVal, testVal, isCurrency);
      // Negate the comparison result if the reverse sort flag is set.
      if (tblEl.reverseSort[col])
          {
        cmp = -cmp;
          }
      // If this row has a smaller value than the current minimum, remember its
      // position and update the current minimum value.
      if (cmp > 0) {
        minIdx = j;
        minVal = testVal;
      }
    }
      }   

    // By now, we have the row with the smallest value. Remove it from the
    // table and insert it before the current row.
    if (minIdx > i) {
      tmpEl = tblEl.tBodies[0].removeChild(tblEl.tBodies[0].rows[minIdx]);
      tblEl.tBodies[0].insertBefore(tmpEl, tblEl.tBodies[0].rows[i]);
    }
  }
    
  }
  // Make it look pretty.
	if (tblEl.reverseSort[col]) {
		document.getElementById(id+"_C_"+col).innerHTML = document.getElementById(id+"_C_"+col).innerHTML.replace(/desc/g,"asc");
		//document.getElementById(id+"_C_"+col).innerHTML = "^";
	} else {
		document.getElementById(id+"_C_"+col).innerHTML = document.getElementById(id+"_C_"+col).innerHTML.replace(/asc/g,"desc");
		//document.getElementById(id+"_C_"+col).innerHTML = "&#x002C7;";
	}
  // Restore the table's display style.
  tblEl.style.display = oldDsply;

  return false;
}

// This code is necessary for browsers that don't reflect the DOM constants
// (like IE).
if (document.ELEMENT_NODE == null) {
  document.ELEMENT_NODE = 1;
  document.TEXT_NODE = 3;
}
function NAEgetTextValue(el) {
	if (el !=null){
		var i;
		var s;
		// Find and concatenate the values of all text nodes contained within the
		// element.
		s = "";
		if (el.TextValue != null) {
			s = el.TextValue;
		} else {
			for (i = 0; i < el.childNodes.length; i++) {
				if (el.childNodes[i].nodeType == document.TEXT_NODE) {
					if (el.childNodes[i].nodeValue != " ") { 
						s += el.childNodes[i].nodeValue;
					}
					if (s.length > 50) {
						break; 
					}
				} else if (el.childNodes[i].nodeType == document.ELEMENT_NODE && el.childNodes[i].tagName == "BR") {
					s += " "; 
				} else if (el.childNodes[i].tagName.toLowerCase() != "script" && el.childNodes[i].tagName.toLowerCase() != "input" && el.childNodes[i].className.toLowerCase() != "commenttab"){
					// Use recursion to get text within sub-elements.
					s += NAEgetTextValue(el.childNodes[i]);
				}
			}
			s = NAEnormalizeString(s);
			el.TextValue = s;
		}
		return s.toLowerCase();
	}
	return false;
}

function NAEcompareValues(v1, v2, isCurrency) {

// remove currency symbol and ","
	if(isCurrency){
		v1 = v1.replace(/[^0-9\.]+/g,"");
		v2 = v2.replace(/[^0-9\.]+/g,"");
	}
	var f1, f2;
  // If the values are numeric, convert them to floats.
  f1 = parseFloat(v1);
  f2 = parseFloat(v2);
  if (!isNaN(f1) && !isNaN(f2)) {
    v1 = f1;
    v2 = f2;
  }
  // Compare the two values.
	if (v1 == v2) {
		return 0;
	}
	if (v1 > v2) {
		return 1;
	}
	return -1;
}

// Regular expressions for normalizing white space.
var whtSpEnds = new RegExp("^\\s*|\\s*$", "g");
var whtSpMult = new RegExp("\\s\\s+", "g");
function NAEnormalizeString(s) {

  s = s.replace(whtSpMult, " ");  // Collapse any multiple whites space.
  s = s.replace(whtSpEnds, "");   // Remove leading or trailing white space.

  return s;
}

/**********************************************************Audit Anygantt functions*****************************************************/
 function add_AUD_AnyGantt (sAuditPlanId, sChartGlobalId, sIAnalysis) {
  var oHtmlAuditPlan;
  var oAuditPlan;
  var ocolTimePeriod;

  var oRoot    = external.GetRoot;
  var oMacroAuditGanttChartHtmlRenderer = oRoot.CurrentEnvironment.GetMacro("~WViI1db8G5XC[auditganttchartHTMLRenderer]");

  var oInstanceCreator, sNewAudit, oNewAudit;

  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oHtmlAuditPlan = document.getElementById ("AuditPlan" + sAuditPlanId);
  };

  if (oAuditPlan != null)
  {
    oInstanceCreator = oAuditPlan.GetCollection("~SqZlj4CqFX03[Audit]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
	oInstanceCreator.Mode = 1;
	sNewAudit = oInstanceCreator.Create;
	if (sNewAudit !== "" && sNewAudit!==undefined)
	{
		oNewAudit = oRoot.GetObjectFromId(sNewAudit);
		/* We add the new planned element */
		var sChartName = "chart"+sChartGlobalId;
		var sDataName = "data" + sChartGlobalId;
		var dIncompleteAuditStart,dIncompleteAuditEnd;
		if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") ==""){
			dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]");
		}else{
			dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]");
		}

		if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") ==""){
			dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]");
		}else{
			dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]");
		}
		eval(sDataName+" = oMacroAuditGanttChartHtmlRenderer.addAuditWrapper("+sDataName+",oNewAudit,dIncompleteAuditStart,dIncompleteAuditEnd);");
		eval(sChartName+".setData("+sDataName+");");
	}
  }
}


 function add_Test_AnyGantt (sAuditPlanId, sChartGlobalId, sIAnalysis) {
  var oHtmlAuditPlan;
  var oAuditPlan;
  var ocolTimePeriod;

  var oRoot    = external.GetRoot;
  var oMacroAuditGanttChartHtmlRenderer = oRoot.CurrentEnvironment.GetMacro("~WViI1db8G5XC[auditganttchartHTMLRenderer]");

  var oInstanceCreator, sNewAudit, oNewAudit;

  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oHtmlAuditPlan = document.getElementById ("AuditPlan" + sAuditPlanId);
  };

  if (oAuditPlan != null)
  {
    oInstanceCreator = oAuditPlan.GetCollection("~wF(SDig4Hr67[Test]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
	oInstanceCreator.Mode = 3;
	sNewAudit = oInstanceCreator.Create;
	if (sNewAudit !== "" && sNewAudit!==undefined)
	{
		oNewAudit = oRoot.GetObjectFromId(sNewAudit);
		/* We add the new planned element */
		var sChartName = "chart"+sChartGlobalId;
		var sDataName = "data" + sChartGlobalId;
		var dIncompleteAuditStart,dIncompleteAuditEnd;
		if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") ==""){
			dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]");
		}else{
			dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]");
		}

		if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") ==""){
			dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]");
		}else{
			dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]");
		}
		eval(sDataName+" = oMacroAuditGanttChartHtmlRenderer.addAuditWrapper("+sDataName+",oNewAudit,dIncompleteAuditStart,dIncompleteAuditEnd);");
		eval(sChartName+".setData("+sDataName+");");
	}
  }
}

 function add_Compliance_AnyGantt (sAuditPlanId, sChartGlobalId, sIAnalysis) {
  var oHtmlAuditPlan;
  var oAuditPlan;
  var ocolTimePeriod;

  var oRoot    = external.GetRoot;
  var oMacroAuditGanttChartHtmlRenderer = oRoot.CurrentEnvironment.GetMacro("~WViI1db8G5XC[auditganttchartHTMLRenderer]");

  var oInstanceCreator, sNewAudit, oNewAudit;

  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oHtmlAuditPlan = document.getElementById ("AuditPlan" + sAuditPlanId);
  };

  if (oAuditPlan != null)
  {
    oInstanceCreator = oAuditPlan.GetCollection("~ssbIVAgvHPIS[Compliance Test]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
	oInstanceCreator.Mode = 3;
	sNewAudit = oInstanceCreator.Create;
	if (sNewAudit !== "" && sNewAudit!==undefined)
	{
		oNewAudit = oRoot.GetObjectFromId(sNewAudit);
		/* We add the new planned element */
		var sChartName = "chart"+sChartGlobalId;
		var sDataName = "data" + sChartGlobalId;
		var dIncompleteAuditStart,dIncompleteAuditEnd;
		if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") ==""){
			dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]");
		}else{
			dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]");
		}

		if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") ==""){
			dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]");
		}else{
			dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]");
		}
		eval(sDataName+" = oMacroAuditGanttChartHtmlRenderer.addAuditWrapper("+sDataName+",oNewAudit,dIncompleteAuditStart,dIncompleteAuditEnd);");
		eval(sChartName+".setData("+sDataName+");");
	}
  }
}

 var sOriginStartDate = '';
 var sOriginEndDate = '';
 function setBeginInformation(id, curChart, target){
   var oRoot    = external.GetRoot;
   var sChartName = "chart" + curChart;
   var audit;
   eval("audit = "+sChartName+".getTaskInfo(id);");
   var sauditId = audit.id;
   var sObjectId = sauditId.substring(2, sauditId.length);
   var oObject = oRoot.GetObjectFromId(sObjectId);
   var oMetaClass = oObject.gettype.GetClassObject;
   var bAudit = oMetaClass.sameId("~BZm3mymxErmA[Audit]");
   var bTest = oMetaClass.sameId("~(utMDzb0HD)S[Test]");
   var bCompliance = oMetaClass.sameId("~CqbIOqavHXNK[Compliance Test]");
   if (bAudit || bTest || bCompliance)
   {
	if(target==="targetStart") {
     sOriginStartDate = audit.startDate;
	 }else if(target==="targetEnd"){
     sOriginEndDate = audit.endDate;
	 }else if(target==="targetMove"){
	 sOriginStartDate = audit.startDate;
     sOriginEndDate = audit.endDate;}
   }
  }

  function showPeriodInfo(id, curChart, target) {
   var sChartName = "chart" + curChart;
   var sDataName = "data" + curChart;
   var oRoot    = external.GetRoot;
   var sChartName = "chart" + curChart;
   var audit;
   eval("audit = "+sChartName+".getTaskInfo(id);");
   var sauditId = audit.id;
   var sObjectId = sauditId.substring(2, sauditId.length);
   var oObject = oRoot.GetObjectFromId(sObjectId);
   var oPlan = oObject.getcollection("~dwtMszb0H93T[Plan]").item(1)
   var oPlanBeginDate= dateToYMD(new Date(oPlan.getprop("~9p2YE2TyFHoK[Plan Begin Date]","internal")))
   var oPlanEndDate= dateToYMD(new Date(oPlan.getprop("~Fm2YT2TyFjrK[Plan End Date]","internal")))
   var oMetaClass = oObject.gettype.GetClassObject;
   var bAudit = oMetaClass.sameId("~BZm3mymxErmA[Audit]");
   var bTest = oMetaClass.sameId("~(utMDzb0HD)S[Test]");
   var bCompliance = oMetaClass.sameId("~CqbIOqavHXNK[Compliance Test]");
   var oMacroAuditGanttChartHtmlRenderer = oRoot.CurrentEnvironment.GetMacro("~WViI1db8G5XC[auditganttchartHTMLRenderer]");
    var uDate = oRoot.CurrentEnvironment.GetMacro("~2ElMMg7V9160[Date.Utilities]");

   var Y;
   var M;
   var D;
   var dDate;


   if (bAudit || bTest || bCompliance)
   {
		if (target==="targetStart" || (target==="targetMove" && sOriginStartDate != '')) {			
			if(dateToYMD(audit.startDate)< oPlanBeginDate){
				dDate= oPlanBeginDate;			
			}
			else{
				dDate = audit.startDate;
			}
			Y = dDate.getYear();
			M = dDate.getMonth() + 1;
			D = dDate.getDate();
			oObject.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") = uDate.setDate(Y, M, D);
	   }
	 	if (target==="targetEnd" || (target==="targetMove" && sOriginEndDate != '')) {
			if(dateToYMD(audit.endDate)> oPlanEndDate){
				dDate= oPlanEndDate;			
			}
			else{
				dDate = audit.endDate;
			}
			Y = dDate.getYear();
			M = dDate.getMonth() + 1;
			D = dDate.getDate();
			oObject.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") = uDate.setDate(Y, M, D);
		}
     eval(sDataName+" = oMacroAuditGanttChartHtmlRenderer.updateAudit("+sDataName+", oObject);");
     eval(sChartName+".setData("+sDataName+");");
   }

    sOriginStartDate = '';
	sOriginEndDate = '';
 }
 
 function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return new Date('' + y + '/' + (m<=9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d));
}

 function onTaskSelectJS(e, curChart, context) {
	getTaskInfoJS(e.id, curChart, context);
}

 function getTaskInfoJS(taskID, curChart, context) {
    var oRoot = external.MegaRoot;
    var task;
    var sChartName = "chart" + curChart;
    eval("task= "+sChartName+".getTaskInfo(taskID);");
    var sTaskId = task.id;
    var sTask = sTaskId.substring(2, sTaskId.length);
    var oObject = oRoot.GetObjectFromId(sTask).getType;
    var oProperty = oRoot.GetObjectFromId("~210000000900[Name]");
    var sId = "id" + curChart;
	var sprId = "priority" + curChart;
	var sewlId = "workload" + curChart;
	var sraudId = "reqaud" + curChart;
	var scuraudId = "curaud" + curChart;
	var sbdateId = "bdate" + curChart;
	var sedateId = "edate" + curChart;
    sEdit = wrapWithMenu(oObject.GetProp("~Z20000000D60[Short Name]", "Display"), context, oObject);
    document.getElementById(sId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~stQLtQ9yEnGN[Audit Priority]", "Display");
	document.getElementById(sprId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~XsQLDZ9yEzPN[Estimated Workload (M-D)]", "Display");
	document.getElementById(sewlId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~KrQLTY9yE9ON[Estimated Number of Auditors]", "Display");
	document.getElementById(sraudId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~HD1hdGjwFrHG[Number of Staffed Auditors]", "Display");
	document.getElementById(scuraudId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Display");
	document.getElementById(sbdateId).innerHTML = sEdit;
	sEdit = oObject.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Display");
	document.getElementById(sedateId).innerHTML = sEdit;
  }

   function wrapWithMenu(sText, context, mObject) {
   var sResult = "";

   var sObjectTransformedId = mObject.getProp("~310000000D00[Absolute Identifier]");
   var sObjectTransformedClassId = mObject.getRoot().currentEnvironment().toolkit().getString64FromID(mObject.getClassID());

   if (context == 4) {
     sResult = "<span style=\"cursor:hand\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" onContextMenu=\"openAnywhereContextualMenu(event, ['" + sObjectTransformedId + "." + sObjectTransformedClassId + "']);\">" + sText + "</span>";
   } else {
     sResult = "<SPAN LANGUAGE=\"javascript\" STYLE=\"cursor:hand\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" oncontextMenu=\"NAEopenMegaObjectMenu(external.getroot, '" + mObject.getProp("~H20000000550[_HexaIdAbs]") + "');\">" + sText + "</SPAN>";
   }
   return sResult;
  }
  
/**********************************************************AUDIT HTML5 FUNCTIONS*****************************************************/

/********************************************************** BA HTML5 FUNCTIONS *********************************************************/
function BA_GanttChartReport_onTaskClick(id, e, sChartGlobalId, sContext)
{
	var oRoot    = external.GetRoot;   
	var oObject = oRoot.GetObjectFromId(id);
	var oMetaClass = oObject.gettype.GetClassObject;
	var b_business_enterprise_stage = oMetaClass.sameId("~(zOOXMMBE9wQ[Strategic Model]");
	if (b_business_enterprise_stage)
	{
		
	}
}
	
function BA_GanttChartReport_onBeforeTaskUpdate(id, e, sChartGlobalId, sContext)
{	
	// To be added
}
  
function BA_GanttChartReport_onAfterTaskUpdate(id, e, sChartGlobalId, sContext)
{
	// To be added
}
/********************************************************** End BA HTML5 FUNCTIONS *****************************************************/

 function AuditGanttChartReport_add_AUD (sAuditPlanId, sChartGlobalId, sContext) {
  var oAuditPlan;
  var oRoot    = external.GetRoot;

  var oInstanceCreator, sNewAudit, oNewAudit;
  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oInstanceCreator = oAuditPlan.GetCollection("~SqZlj4CqFX03[Audit]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
    oInstanceCreator.Mode = 1;
    sNewAudit = oInstanceCreator.Create;
    if (sNewAudit !== "" && sNewAudit !== undefined)
    {
      oNewAudit = oRoot.GetObjectFromId(sNewAudit);
      /* We add the new planned element */
      var dIncompleteAuditStart, dIncompleteAuditEnd;
      
      if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") == ""){
        dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]", "internal");
      }else{
        dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "internal");
      }

      if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") == ""){
        dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]", "internal");
      }else{
        dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]", "internal");
      }
      
      if ((oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "display") == "") || (oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "display") == "")) {
        addAudit(oRoot, oNewAudit, false, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      } else {
        addAudit(oRoot, oNewAudit, true, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      }
    }
  }
 }

 function AuditGanttChartReport_add_Test (sAuditPlanId, sChartGlobalId, sContext) {
  var oAuditPlan;
  var oRoot    = external.GetRoot;

  var oInstanceCreator, sNewAudit, oNewAudit;
  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oInstanceCreator = oAuditPlan.GetCollection("~wF(SDig4Hr67[Test]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
    oInstanceCreator.Mode = 3;
    sNewAudit = oInstanceCreator.Create;
    if (sNewAudit !== "" && sNewAudit !== undefined)
    {
      oNewAudit = oRoot.GetObjectFromId(sNewAudit);
      /* We add the new planned element */
      var dIncompleteAuditStart, dIncompleteAuditEnd;
      
      if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") == ""){
        dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]", "internal");
      }else{
        dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "internal");
      }

      if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") == ""){
        dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]", "internal");
      }else{
        dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]", "internal");
      }
      
      if ((oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "display") == "") || (oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "display") == "")) {
        addAudit(oRoot, oNewAudit, false, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      } else {
        addAudit(oRoot, oNewAudit, true, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      }
    }
  }
 }

 function AuditGanttChartReport_add_Compliance (sAuditPlanId, sChartGlobalId, sContext) {
  var oAuditPlan;
  var oRoot    = external.GetRoot;

  var oInstanceCreator, sNewAudit, oNewAudit;
  if ( sAuditPlanId != "" )
  {
    oAuditPlan     = oRoot.getObjectFromId(sAuditPlanId);
    oInstanceCreator = oAuditPlan.GetCollection("~ssbIVAgvHPIS[Compliance Test]").CallFunction("~GuX91iYt3z70[InstanceCreator]") ;
    oInstanceCreator.Mode = 3;
    sNewAudit = oInstanceCreator.Create;
    if (sNewAudit !== "" && sNewAudit !== undefined)
    {
      oNewAudit = oRoot.GetObjectFromId(sNewAudit);
      /* We add the new planned element */
      var dIncompleteAuditStart, dIncompleteAuditEnd;
      
      if (oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") == ""){
        dIncompleteAuditStart = oAuditPlan.GetProp("~9p2YE2TyFHoK[Audit Plan Begin Date]", "internal");
      }else{
        dIncompleteAuditStart = oNewAudit.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "internal");
      }

      if (oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") == ""){
        dIncompleteAuditEnd = oAuditPlan.GetProp("~Fm2YT2TyFjrK[Audit Plan End Date]", "internal");
      }else{
        dIncompleteAuditEnd = oNewAudit.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]", "internal");
      }
      
      if ((oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "display") == "") || (oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "display") == "")) {
        addAudit(oRoot, oNewAudit, false, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      } else {
        addAudit(oRoot, oNewAudit, true, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId);
      }
    }
  }
 }

 function wrapWithMenuAndEscape(sText, context, mObject) {
   var sResult = "";
    
   var sObjectTransformedId = mObject.getProp("~310000000D00[Absolute Identifier]");
   var sObjectTransformedClassId = mObject.getRoot().currentEnvironment().toolkit().getString64FromID(mObject.getClassID());

   if (context == 4) {
     sResult = "<span style=\"cursor:hand\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" onContextMenu=\"openAnywhereContextualMenu(event, ['" + sObjectTransformedId + "." + sObjectTransformedClassId + "']);\">" + sText + "</span>";
   } else {
     sResult = "<SPAN LANGUAGE=\"javascript\" STYLE=\"cursor:hand\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" oncontextMenu=\"NAEopenMegaObjectMenu(external.getroot, '" + mObject.getProp("~H20000000550[_HexaIdAbs]") + "');\">" + sText + "</SPAN>";
   }
   
   sResult = sResult.toString().replace(/"/g, '\\"')
   sResult = sResult.toString().replace(/'/g, "\\'");
   return sResult;
 }
 
 function addAudit (oRoot, oNewAudit, bIsComplete, dIncompleteAuditStart, dIncompleteAuditEnd, sContext, sChartGlobalId) {
   var oMacroGanttChartReport = oRoot.CurrentEnvironment.GetMacro("~MCm60lXfLHhR[GanttChartReportMacro]");
   var oMacroAuditGanttChart = oRoot.CurrentEnvironment.GetMacro("~DRARZGQvLzqQ[]");
   
   if  (bIsComplete)
   {
     var strStartDate = oMacroGanttChartReport.getDateFormatedFromMacro(oRoot, oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Internal"));
     var strEndDate = oMacroGanttChartReport.getDateFormatedFromMacro(oRoot, oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Internal"));

     var strStyle = oMacroAuditGanttChart.getAuditStyle(oNewAudit);
     var strName = oNewAudit.getProp("~Z20000000D60[Short Name]");
     var strTooltip =  "{%Name}<br/>" + oRoot.CurrentEnvironment.Resources.CodeTemplate("~G2jfXagKDXKQ[Start Date:]") + " {%StartDate}<br/>" + oRoot.CurrentEnvironment.Resources.CodeTemplate("~D3jflagKDTNQ[Finish date:]") + " {%EndDate}";
     var textWrap = wrapWithMenuAndEscape(strName, sContext, oNewAudit);
          
     eval(sChartGlobalId + ".addTask({id:'" + oNewAudit.getProp("~H20000000550[_HexaIdAbs]") + "',text:\"" + textWrap + "\"" + ",tooltipformat:\"" + strTooltip + "\"" + ",style:'" + strStyle + "'" + ",start_date:'" + strStartDate + "',end_date:'" + strEndDate + "',leftside_text:" + "'{%PeriodStart}'" + ",rightside_text:" + "'{%PeriodEnd}'" + ",type:" + sChartGlobalId + ".config.types.task" + "}," + "''" + ");");
   }
   else
   {
     var dStartDate = oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Internal");
     var dEndDate = oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Internal");

     var sStartDate = oNewAudit.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Display");
     var sEndDate = oNewAudit.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Display");

     if ((sStartDate == "") || (sEndDate == "")) {
       if ((sStartDate == "")) {
         dStartDate = dIncompleteAuditStart;
       }
       if ((sEndDate == "")) {
         dEndDate = dIncompleteAuditEnd;
       }
     }
    
     var strStartDate = oMacroGanttChartReport.getDateFormatedFromMacro(oRoot, dStartDate);
     var strEndDate = oMacroGanttChartReport.getDateFormatedFromMacro(oRoot, dEndDate);

     var strStyle = "audit_incomplete";
     var strName = oNewAudit.getProp("~Z20000000D60[Short Name]");
     var strTooltip =  "{%Name}<br/>" + oRoot.CurrentEnvironment.Resources.CodeTemplate("~G2jfXagKDXKQ[Start Date:]") + " {%StartDate}<br/>" + oRoot.CurrentEnvironment.Resources.CodeTemplate("~D3jflagKDTNQ[Finish date:]") + " {%EndDate}";
     var textWrap = wrapWithMenuAndEscape(strName, sContext, oNewAudit);
        
     eval(sChartGlobalId + ".addTask({id:'" + oNewAudit.getProp("~H20000000550[_HexaIdAbs]") + "',text:\"" + textWrap + "\"" + ",style:'" + strStyle + "'" + ",tooltipformat:'" + strTooltip + "'" + ",start_date:'" + strStartDate + "',end_date:'" + strEndDate + "',type:" + sChartGlobalId + ".config.types.task" + "}," + "''" + ");");
   }
   
   var start_date;
   var end_date;
   eval(sChartGlobalId + ".eachTask(function(task){if(!end_date){end_date=task.end_date;}else if(task.end_date > end_date){end_date=task.end_date;}if(!start_date){start_date=task.start_date;}else if(task.start_date < start_date){start_date=task.start_date;}})");
   start_date.setFullYear(start_date.getFullYear() - 1);
   end_date.setFullYear(end_date.getFullYear() + 2);
   eval(sChartGlobalId + ".config.start_date = start_date;");
   eval(sChartGlobalId + ".config.end_date = end_date;");
    
   eval(sChartGlobalId + ".render();");
   eval(sChartGlobalId + ".setSizes();");
   
   oMacroGanttChartReport.release;
   oMacroAuditGanttChart.release;
 }
  
 function AuditGanttChartReport_onBeforeTaskUpdate(id, e, sChartGlobalId)
 {
   var oRoot    = external.GetRoot;   
   var oObject = oRoot.GetObjectFromId(id);
   var oMetaClass = oObject.gettype.GetClassObject;
   var bAudit = oMetaClass.sameId("~BZm3mymxErmA[Audit]");
   var bTest = oMetaClass.sameId("~(utMDzb0HD)S[Test]");
   var bCompliance = oMetaClass.sameId("~CqbIOqavHXNK[Compliance Test]");
   if (bAudit || bTest || bCompliance)
   {
     var audittask;
     eval("audittask = " + sChartGlobalId + ".getTask(id);");
     sOriginStartDate = audittask.start_date;
     sOriginEndDate = audittask.end_date;
   }
  }

  function AuditGanttChartReport_onAfterTaskUpdate(id, e, sChartGlobalId)
  {
   var oRoot    = external.GetRoot;
   
   var audittask;
   eval("audittask = " + sChartGlobalId + ".getTask(id);");
   
   var oObject = oRoot.GetObjectFromId(id);
   var oPlan = oObject.getcollection("~dwtMszb0H93T[Plan]").item(1)
   
   var oMetaClass = oObject.gettype.GetClassObject;
   var bAudit = oMetaClass.sameId("~BZm3mymxErmA[Audit]");
   var bTest = oMetaClass.sameId("~(utMDzb0HD)S[Test]");
   var bCompliance = oMetaClass.sameId("~CqbIOqavHXNK[Compliance Test]");
   
   var oPlanBeginDate= dateToYMD(new Date(oPlan.getprop("~9p2YE2TyFHoK[Plan Begin Date]","internal")))
   var oPlanEndDate= dateToYMD(new Date(oPlan.getprop("~Fm2YT2TyFjrK[Plan End Date]","internal")))
   
   var uDate = oRoot.CurrentEnvironment.GetMacro("~2ElMMg7V9160[Date.Utilities]");

   var Y;
   var M;
   var D;
   var dDate;

   if (bAudit || bTest || bCompliance)
   {
     if(dateToYMD(audittask.start_date)< oPlanBeginDate){
       dDate= oPlanBeginDate;
     }
     else {
       dDate = audittask.start_date;
     }
     Y = dDate.getFullYear();
     M = dDate.getMonth() + 1;
     D = dDate.getDate();
     oObject.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]") = setDateMegaInternalFormat(Y, M, D);

     if(dateToYMD(audittask.end_date)> oPlanEndDate){
       dDate = oPlanEndDate;
     }
     else {
       dDate = audittask.end_date;
     }
     Y = dDate.getFullYear();
     M = dDate.getMonth() + 1;
     D = dDate.getDate();
     oObject.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]") = setDateMegaInternalFormat(Y, M, D);
            
     if (!oObject.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "display") == "") {
       audittask.start_date = new Date(oObject.getProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Internal"));
     }
     if (!oObject.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "display") == "") {
       audittask.end_date = new Date(oObject.getProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Internal"));
     }
   }

   sOriginStartDate = '';
   sOriginEndDate = '';
    
   var start_date;
   var end_date;
   eval(sChartGlobalId + ".eachTask(function(task){if(!end_date){end_date=task.end_date;}else if(task.end_date > end_date){end_date=task.end_date;}if(!start_date){start_date=task.start_date;}else if(task.start_date < start_date){start_date=task.start_date;}})");
   start_date.setFullYear(start_date.getFullYear() - 1);
   end_date.setFullYear(end_date.getFullYear() + 2);
   eval(sChartGlobalId + ".config.start_date = start_date;");
   eval(sChartGlobalId + ".config.end_date = end_date;");
    
   eval(sChartGlobalId + ".render();");
   eval(sChartGlobalId + ".setSizes();");
 }
 
 function setDateMegaInternalFormat(Y, M, D)
{
  //YYYY/MM/DD HH:MM:SS
  if (parseInt(D) < 10)
  {
    D = "0" + D;
  } 
  if (parseInt(M) < 10)
  {
    M = "0" + M;
  } 
  return Y + "/" + M + "/" + D + " " + "12:00:00";
}
 
 function AuditGanttChartReport_onTaskClick(id, e, sChartGlobalId, sContext)
 {
    var oRoot = external.MegaRoot;    
    var audittask;
    eval("audittask = " + sChartGlobalId + ".getTask(id);");
    var oObject = oRoot.GetObjectFromId(id).getType;
    var oProperty = oRoot.GetObjectFromId("~210000000900[Name]");
    var sId = "id" + sChartGlobalId;
    var sprId = "priority" + sChartGlobalId;
    var sewlId = "workload" + sChartGlobalId;
    var sraudId = "reqaud" + sChartGlobalId;
    var scuraudId = "curaud" + sChartGlobalId;
    var sbdateId = "bdate" + sChartGlobalId;
    var sedateId = "edate" + sChartGlobalId;
    var sEdit = ""; 
    sEdit = wrapWithMenuAndEscape(oObject.GetProp("~Z20000000D60[Short Name]", "Display"), sContext, oObject);
    document.getElementById(sId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~stQLtQ9yEnGN[Audit Priority]", "Display");
    document.getElementById(sprId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~XsQLDZ9yEzPN[Estimated Workload (M-D)]", "Display");
    document.getElementById(sewlId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~KrQLTY9yE9ON[Estimated Number of Auditors]", "Display");
    document.getElementById(sraudId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~HD1hdGjwFrHG[Number of Staffed Auditors]", "Display");
    document.getElementById(scuraudId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~KrQLvNAyEP1O[Audit Planned Begin Date]", "Display");
    document.getElementById(sbdateId).innerHTML = sEdit;
    sEdit = oObject.GetProp("~8rQLcSAyEjDO[Audit Planned End Date]", "Display");
    document.getElementById(sedateId).innerHTML = sEdit;
  }

  /***************************END OF AUDIT HTML GANTT****************************************************************/

/***************************DoDAF2 HTML5 FUNCTIONS******************************************************************/

 function AssetCatalogGanttChartReport_onBeforeTaskUpdate(id, e, sChartGlobalId)
 {
 }

 function AssetCatalogGanttChartReport_onAfterTaskUpdate(id, e, sChartGlobalId)
 {
   var oRoot    = external.GetRoot;
   var oUtilities = oRoot.CurrentEnvironment.GetMacro("~mkAevEg4QDZQ[]");
   
   var timeperiod;
   eval("timeperiod = " + sChartGlobalId + ".getTask(id);");
   
   var start_date_task = timeperiod.start_date
   var end_date_task = timeperiod.end_date
   
   var dstart_date = start_date_task.getDate();
   var mstart_date = start_date_task.getMonth() + 1;
   var ystart_date = start_date_task.getFullYear(); 
   
   var dend_date = end_date_task.getDate();
   var mend_date = end_date_task.getMonth() + 1;
   var yend_date = end_date_task.getFullYear(); 
    
   oUtilities.invokeOnRoot(oRoot, "onPeriodMove"+"$|$"+id+"$|$"+dstart_date+"$|$"+mstart_date+"$|$"+ystart_date+"$|$"+dend_date+"$|$"+mend_date+"$|$"+yend_date);

   var start_date;
   var end_date;
   var config_start_date;
   var config_end_date;
   eval("config_start_date = " + sChartGlobalId + ".config.start_date;");
   eval("config_end_date = " + sChartGlobalId + ".config.end_date;");
   eval(sChartGlobalId + ".eachTask(function(task){if(!end_date){end_date=task.end_date;}else if(task.end_date > end_date){end_date=task.end_date;}if(!start_date){start_date=task.start_date;}else if(task.start_date < start_date){start_date=task.start_date;}})");
   var update_start_date = new Date(start_date);
   var update_end_date = new Date(end_date);
     
   update_start_date.setFullYear(update_start_date.getFullYear() - 2);
   update_end_date.setFullYear(update_end_date.getFullYear() + 2);
   if((!config_start_date) && (config_start_date < update_start_date))
   {
     update_start_date = config_start_date;
   }
   if((!config_end_date) && (config_end_date > update_end_date))
   {
     update_end_date = config_end_date;
   }
   eval(sChartGlobalId + ".config.start_date = update_start_date;");
   eval(sChartGlobalId + ".config.end_date = update_end_date;");
   
   eval(sChartGlobalId + ".render();");
   eval(sChartGlobalId + ".setSizes();");
 }
 
/***************************End of DoDAF2 HTML5 FUNCTIONS******************************************************************/


function launchWizard(missionKind) {
  var oRoot  = external.GetRoot;
  var wizard = oRoot.callMethod("~AfLYxbu47b00[WizardRun]", "~7ZLsnoFBHH1M[Generate Audits]");
  var objectList = getObjectsIdList();
  var oMacroSetWizardParameters = oRoot.CurrentEnvironment.GetMacro("~mzpV99uDH5kV[Internal Control - Set Generate Audits Wizard Parameters]");
  oMacroSetWizardParameters.SetWizardParameters(oRoot,missionKind,objectList)    
}

function getObjectsIdList() { 
   var tables=document.getElementsByName("select");
   var string ="";
   
   for(i=0;i<tables.length;i++){
   if(document.getElementsByName("select")[i].checked)
   string = string + document.getElementsByName("select")[i].id + " "
   }
    return string;
}

//Set Active metaAttribute of a solMan Object
function setIsActive() { 
   var oRoot  = external.GetRoot;
   var tables=document.getElementsByName("isActive");
   for(i=0;i<tables.length;i++){
		var strForSetActive = document.getElementsByName("isActive")[i].id;
		var elem = strForSetActive.split('/##/');
		var active = elem[0];
		var megaField = elem[1];
		var oObject = oRoot.GetObjectFromId(megaField);
		
		if(document.getElementsByName("isActive")[i].checked)
			oObject.setProp(active) = "A";
		else
			oObject.setProp(active) = "U";
   }
}

//Set RealSAP metaAttribute of a business Object
function setRealSAP() { 
   var oRoot  = external.GetRoot;
   var tables=document.getElementsByName("RealSAP");
   for(i=0;i<tables.length;i++){
	var oObject = oRoot.GetObjectFromId(document.getElementsByName("RealSAP")[i].id);
	if(document.getElementsByName("RealSAP")[i].checked){
		oObject.setProp("~6y443E2QH5mH[SolMan Real SAP]") = "SAP";}
	else{
		oObject.setProp("~6y443E2QH5mH[SolMan Real SAP]") = "NSAP"; }
   }
}

function validateTimesheetWizard(beginDate,endDate) {
  var oRoot  = external.GetRoot;
  var oMacroSetWizardParameters = oRoot.CurrentEnvironment.GetMacro("~LRzFu1KPI538[Audit v3- Launch validation wizard]");
  oMacroSetWizardParameters.SetWizardParameters(oRoot,beginDate,endDate)  
}
