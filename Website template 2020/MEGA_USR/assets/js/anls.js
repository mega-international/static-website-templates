/***************************Report Studio V2*****************************/

function studioreport_updateViewFilterData(strReportDataViewHexaIdAbs, strReportFilterHexaIdAbs, strPrefix, strNewValue) {
  var sCurrentFilterValues = "";
  eval("sCurrentFilterValues  = view" + strReportDataViewHexaIdAbs + ";");

  var tFilters = sCurrentFilterValues.split("&_&");
  var bFoundFilter = false;
  for (var i = 0; (i < tFilters.length) && (bFoundFilter == false); i++) {
    var tFilter = tFilters[i].split("%_%");
    if (tFilter[0] == strReportFilterHexaIdAbs) {
      bFoundFilter = true;
      var bFoundPrefix = false;
      for (var j = 1; (j < tFilter.length) && (bFoundPrefix == false); j++) {
        var sFilterValues = tFilter[j];
        if (sFilterValues.substring(0, 3) == strPrefix) {
          bFoundPrefix = true;
          //We replace the value
          var newFilter = tFilters[i].replace(sFilterValues, strPrefix + strNewValue);
          sCurrentFilterValues = sCurrentFilterValues.replace(tFilters[i], newFilter);
        }
      }
      if (bFoundPrefix == false) {
        var newFilter = tFilters[i] + strPrefix + strNewValue + "%_%";
        sCurrentFilterValues = sCurrentFilterValues.replace(tFilters[i], newFilter);
      }
    }
  }
  if (bFoundFilter == false) {
    //We add the filter with it's value
    sCurrentFilterValues = sCurrentFilterValues + strReportFilterHexaIdAbs + "%_%" + strPrefix + strNewValue + "%_%" + "&_&";
  }

  eval("view" + strReportDataViewHexaIdAbs + " = sCurrentFilterValues;");
  return sCurrentFilterValues;
}

function studioreport_ComputeFilter_RefreshView(strReportDataViewHexaIdAbs, strRefreshData) {

  var sReportXML = "";
  eval("sReportXML = reportxml;");
  var sIsReportXML = "";
  eval("sIsReportXML = xmlreport;");

  parent.mega_global_runMacro('HWQTi8vZMrCX', "getReportDataViewCode" + "$|$" + strRefreshData + "$|$" + sReportXML + "$|$" + sIsReportXML, function (strViewCode, app) {
    var strDivID = "Immediate_Refresh_" + strReportDataViewHexaIdAbs;
    document.getElementById(strDivID).innerHTML = strViewCode;

    var oMyComponent = document.getElementById(strDivID);
    var containedScripts = oMyComponent.getElementsByTagName("script");
    for (var i = 0; i < containedScripts.length; i++) {
      eval(containedScripts[i].innerHTML);
    }

    if (typeof window.__attCtl != 'undefined') {
      window.__attCtl.setData(strRefreshData);
      window.__attCtl.notify('CLICK');
    }
  });
}

function studioreport_ComputeFilter_NonImmediateRefresh(strReportFilterId, strFilterData, strContentAndDataSet) {

  var sReportXML = "";
  eval("sReportXML = reportxml;");
  var sIsReportXML = "";
  eval("sIsReportXML = xmlreport;");

  var sFilterDataResult;
  eval("sFilterDataResult  = " + "filterdata" + strReportFilterId + ";");
  var aFilterData = sFilterDataResult.split(",");
  var tFilters = aFilterData[1].split("%%_%%");

  //BEFORE VIEW AND FILTER UPDATE
  var rendererSpans = [];
  var parentNodes = [];

  var sAllFilterValues = "";
  var strAllRefreshData = "";

  for (var i = 0; (i < tFilters.length - 1); i = i + 3) {
    var sCurrentFilterValues = "";
    eval("sCurrentFilterValues  = view" + tFilters[i] + ";");

    var strThisRefreshData = tFilters[i] + "##" + aFilterData[2] + "##" + sCurrentFilterValues;

    if (i != 0) {
      strAllRefreshData = strAllRefreshData + "||";
    }
    strAllRefreshData = strAllRefreshData + strThisRefreshData;

    if (typeof window.__attCtl != 'undefined') {
      window.__attCtl.setData(strThisRefreshData);
      window.__attCtl.notify('CLICK');
    }

    if (i != 0) {
      sAllFilterValues = sAllFilterValues + "||";
    }
    sAllFilterValues = sAllFilterValues + strThisRefreshData + "||" + tFilters[i] + "||" + tFilters[i + 1] + "||" + tFilters[i + 2];
  }

  parent.mega_global_runMacro('HWQTi8vZMrCX', "getReportDataViewCode" + "$|$" + strAllRefreshData + "$|$" + sReportXML + "$|$" + sIsReportXML, function (strViewCode, app) {
    var aViewCode = strViewCode.split("|#VIEWS_SEPARATOR#|");

    var offset = 0;
    for (var m = 0; m < aViewCode.length; m++) {

      var strDivID = "Immediate_Refresh_" + tFilters[offset];
      offset = offset + 3;

      var refreshDIV = document.getElementById(strDivID);

      var allSpans = refreshDIV.getElementsByTagName("span");
      for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].id.indexOf('RendererID_') == 0) {
          rendererSpans.push(allSpans[i]);
          parentNodes.push(refreshDIV.id);
        }
      }

      refreshDIV = document.getElementById(strDivID).innerHTML = aViewCode[m];

      var oMyComponent = document.getElementById(strDivID);
      var containedScripts = oMyComponent.getElementsByTagName("script");
      for (var j = 0; j < containedScripts.length; j++) {
        eval(containedScripts[j].innerHTML);
      }
    }

    //AFTER VIEW AND FILTER UPDATE : we have to recreate the edit button, which was erased during the view refresh
    for (var k = 0; k < parentNodes.length; k++) {
      var rendererSpan = document.getElementById(rendererSpans[k].id);
      var parentNode = document.getElementById(parentNodes[k]);

      if (rendererSpan == null) {
        if (parentNode != null) {
          var theFirstChild = parentNode.firstChild;
          if (theFirstChild != null) {
            parentNode.insertBefore(rendererSpans[k], theFirstChild);
          }
          else {
            parentNode.appendChild(rendererSpans[k]);
          }
        }
      }
    }
  });

  if (sIsReportXML == "0") {
    parent.mega_global_runMacro('HWQTi8vZMrCX', "getReportFilterCode" + "$|$" + sReportXML + "$|$" + sAllFilterValues, function (strFilterCode, app) {
      eval(strFilterCode);
    });
  }

}

/*********************************************************************************************************************/
/*REACT JS*/

function studioreport_getResult(id, result) {
  //operators : inferior, superior, equal, greater, less, contains, singleChoice, multipleChoice, emptyValues.
  var sFilterDataResult;
  eval("sFilterDataResult  = " + id + ";");
  var aFilterData = sFilterDataResult.split(",");
  var bImmediate = aFilterData[0];
  var sTypeOfItem = aFilterData[3];

  var tFilters = aFilterData[1].split("%%_%%");

  var strPrefix = "";
  var strNewValue = "";
  var strRefreshData = "";

  var bValuesChanged = false;

  var iResultSize = result.length;
  for (var j = 0; j < iResultSize; j++) {
    switch (result[j].operator) {
      case "emptyValues":
        strPrefix = "EV_";
        switch (result[j].value.id) {
          case "default":
            strNewValue = "Default";
            break;
          case "empty":
            strNewValue = "All";
            break;
          case "nonEmpty":
            strNewValue = "NonEmpty";
            break;
          case "onlyEmpty": 
            strNewValue = "OnlyEmpty";
            break;
        }
        break;
      case "inferior":
      case "less":
      case "begin":
        strPrefix = "IT_";
        if (sTypeOfItem == "DATE") {
          strNewValue = result[j].value.internal;
        }
        else {
          strNewValue = result[j].value.external;
        }
        break;
      case "superior":
      case "greater":
      case "ends":
        strPrefix = "ST_";
        if (sTypeOfItem == "DATE") {
          strNewValue = result[j].value.internal;
        }
        else {
          strNewValue = result[j].value.external;
        }
        break;
      case "equal":
        strPrefix = "VA_";
        if (sTypeOfItem == "DATE") {
          strNewValue = result[j].value.internal;
        }
        else {
          strNewValue = result[j].value.external;
        }
        break;
      case "contains":
        strPrefix = "VA_";

        strNewValue = result[j].value.external;

        break;
      case "singleChoice":
        strNewValue = result[j].value.id;
        if (sTypeOfItem == "COLLECTION") {
          strPrefix = "OB_";
        }
        else {
          strPrefix = "VA_";
        }
        break;
      case "multipleChoice":
        if (sTypeOfItem == "COLLECTION") {
          strPrefix = "CO_";
        }
        else {
          strPrefix = "VA_";
        }
        var iSize = result[j].value.length;

        for (var i = 0; i < iSize; i++) {
          strNewValue = strNewValue + result[j].value[i].id;
          if (i != iSize - 1) {
            strNewValue = strNewValue + ",";
          }
        }
        break;
    }

    if (strNewValue != undefined) {
      for (var i = 0; (i < tFilters.length - 1); i = i + 3) {

        var sCurrentFilterValues = "";
        eval("sCurrentFilterValues  = view" + tFilters[i] + ";");

        var sNewFilterValues = studioreport_updateViewFilterData(tFilters[i], tFilters[i + 2], strPrefix, strNewValue);

        if (sCurrentFilterValues != sNewFilterValues) {
          bValuesChanged = true;
        }
      }
    }
  }

  var sReportXML = "";
  eval("sReportXML = reportxml;");
  var sIsReportXML = "";
  eval("sIsReportXML = xmlreport;");

  if ((bImmediate == "true") && (bValuesChanged == true)) {
    //BEFORE VIEW AND FILTER UPDATE
    var rendererSpans = [];
    var parentNodes = [];

    var sAllFilterValues = "";
    var strAllRefreshData = "";

    for (var i = 0; (i < tFilters.length - 1); i = i + 3) {
      var sCurrentFilterValues = "";
      eval("sCurrentFilterValues  = view" + tFilters[i] + ";");

      var strThisRefreshData = tFilters[i] + "##" + aFilterData[2] + "##" + sCurrentFilterValues;

      if (i != 0) {
        strAllRefreshData = strAllRefreshData + "||";
      }
      strAllRefreshData = strAllRefreshData + strThisRefreshData;

      if (typeof window.__attCtl != 'undefined') {
        window.__attCtl.setData(strThisRefreshData);
        window.__attCtl.notify('CLICK');
      }

      if (i != 0) {
        sAllFilterValues = sAllFilterValues + "||";
      }
      sAllFilterValues = sAllFilterValues + strThisRefreshData + "||" + tFilters[i] + "||" + tFilters[i + 1] + "||" + tFilters[i + 2];
    }

    parent.mega_global_runMacro('HWQTi8vZMrCX', "getReportDataViewCode" + "$|$" + strAllRefreshData + "$|$" + sReportXML + "$|$" + sIsReportXML, function (strViewCode, app) {
      var aViewCode = strViewCode.split("|#VIEWS_SEPARATOR#|");

      var offset = 0;
      for (var m = 0; m < aViewCode.length; m++) {

        var strDivID = "Immediate_Refresh_" + tFilters[offset];
        offset = offset + 3;

        var refreshDIV = document.getElementById(strDivID);

        var allSpans = refreshDIV.getElementsByTagName("span");
        for (var i = 0; i < allSpans.length; i++) {
          if (allSpans[i].id.indexOf('RendererID_') == 0) {
            rendererSpans.push(allSpans[i]);
            parentNodes.push(refreshDIV.id);
          }
        }

        refreshDIV.innerHTML = aViewCode[m];

        var oMyComponent = document.getElementById(strDivID);
        var containedScripts = oMyComponent.getElementsByTagName("script");
        for (var j = 0; j < containedScripts.length; j++) {
          eval(containedScripts[j].innerHTML);
        }
      }

      //AFTER VIEW AND FILTER UPDATE : we have to recreate the edit button, which was erased during the view refresh
      for (var k = 0; k < parentNodes.length; k++) {
        var rendererSpan = document.getElementById(rendererSpans[k].id);
        var parentNode = document.getElementById(parentNodes[k]);

        if (rendererSpan == null) {
          if (parentNode != null) {
            var theFirstChild = parentNode.firstChild;
            if (theFirstChild != null) {
              parentNode.insertBefore(rendererSpans[k], theFirstChild);
            }
            else {
              parentNode.appendChild(rendererSpans[k]);
            }
          }
        }
      }
    });

    if (sIsReportXML == "0") {
      parent.mega_global_runMacro('HWQTi8vZMrCX', "getReportFilterCode" + "$|$" + sReportXML + "$|$" + sAllFilterValues, function (strFilterCode, app) {
        eval(strFilterCode);
      });
    }
  }

}

/*********************************************************************************************************************/

function NAEprintEdit(sReportId) {
  parent.mega_global_runMacro('yRmh8Gh7LHAT', sReportId);
}

function NAEdisplayEditMode(sParam) {
  window.__attCtl.setData(sParam);
  window.__attCtl.notify('CLICK');
}

function NAEdestroyEditButtons(strDivIdentifier) {
  if (strDivIdentifier != '') {
    var editionElem = document.getElementById("EditButtons_" + strDivIdentifier);
    if (editionElem != null) {
      editionElem.parentElement.removeChild(editionElem);
    }
  }
  else {
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].id.indexOf('EditButtons_') == 0) {
        divs[i].parentElement.removeChild(divs[i]);
      }
    }
  }
}

function getContextualSeriesMenu(element, sResult, sAreButtonsDisplayed, sSeriesNames, strSeriesTitle, strDivIdentifier, strItemTitle) {
  var x = document.getElementById("tableformenu_" + strDivIdentifier);
  if (x != null) {
    x.parentNode.removeChild(x);
  }
  else {
    var table = document.createElement('table');
    table.setAttribute('id', "tableformenu_" + strDivIdentifier);
    table.onmouseover = function (e) {
      this.style.cursor = 'pointer';
    }
    table.onclick = function (e) {
      var y = document.getElementById("tableformenu_" + strDivIdentifier);
      if (y) {
        y.parentNode.removeChild(y);
      }
    }
    table.style.border = "1px solid gray";
    var tr = document.createElement('tr');
    table.appendChild(tr);

    if (sAreButtonsDisplayed.indexOf("V") != -1) {
      var td = document.createElement('td');
      td.style.color = 'black';
      tr.appendChild(td);
      td.onmouseover = function (e) {
        this.style.color = 'skyblue';
        this.style.backgroundColor = 'steelblue';
      }
      td.onmouseout = function (e) {
        this.style.color = 'black';
        this.style.backgroundColor = '';
      }
      td.onclick = function () {
        NAEdisplayEditMode(strDivIdentifier + "$|$" + "S")
      };
      td.innerHTML = strSeriesTitle;
    }

    if (sAreButtonsDisplayed.indexOf("I") != -1) {
      var aItems = sResult.split("$|$");
      var aSeriesNames = sSeriesNames.split("$|$");

      var bStill = false;
      var iCount = 0;
      while (bStill == false) {
        bStill = true;
        for (iCount = 0; iCount < (aSeriesNames.length - 2); iCount++) {
          var bChange = false;
          if ((aSeriesNames[iCount].indexOf(strItemTitle) == 0) && (aSeriesNames[iCount + 1].indexOf(strItemTitle) == 0)) {
            var a = aSeriesNames[iCount].substring(strItemTitle.length);
            var b = aSeriesNames[iCount + 1].substring(strItemTitle.length);
            var aint = parseInt(a);
            var bint = parseInt(b);

            if ((aint != NaN) && (bint != NaN)) {
              if (aint > bint) {
                bChange = true;
              }
            }
            else if ((aSeriesNames[iCount] > aSeriesNames[iCount + 1])) {
              bChange = true;
            }
          }
          else if ((aSeriesNames[iCount] > aSeriesNames[iCount + 1])) {
            bChange = true;
          }

          if (bChange == true) {
            var sTempoName = aSeriesNames[iCount];
            aSeriesNames[iCount] = aSeriesNames[iCount + 1];
            aSeriesNames[iCount + 1] = sTempoName;

            var sTempoID = aItems[iCount];
            aItems[iCount] = aItems[iCount + 1];
            aItems[iCount + 1] = sTempoID;

            bStill = false;
          }
        }
      }

      for (var iSeriesName in aSeriesNames) {
        var sSeriesName = aSeriesNames[iSeriesName];
        var sItemId = aItems[iSeriesName];
        if (sSeriesName != "null") {
          if ((sSeriesName != "") && (sItemId != "")) {
            tr = document.createElement('tr');
            table.appendChild(tr);
            td = document.createElement('td');
            td.style.color = 'black';
            td.setAttribute('id', sItemId);
            tr.appendChild(td);
            td.onmouseover = function (e) {
              this.style.color = 'skyblue';
              this.style.backgroundColor = 'steelblue';
            }
            td.onmouseout = function (e) {
              this.style.color = 'black';
              this.style.backgroundColor = '';
            }
            td.onclick = function () {
              NAEdisplayEditMode(this.getAttribute('id') + "$|$" + "I")
            };
            td.innerHTML = sSeriesName;
          }
        }
      }
    }

    var cell = document.getElementById("cellformenu_" + strDivIdentifier);
    cell.appendChild(table);
  }
}

function NAEbuildEditButtons(strDivIdentifier, sReportId, strContentPic, strStylePic, strContentTitle, strStyleTitle, strSeriesTitle, strItemTitle) {
  var editionElem = document.getElementById(strDivIdentifier);

  parent.mega_global_runMacro('oNxq0pUxKL3I', "areButtonsDisplayed" + "$|$" + strDivIdentifier, function (sAreButtonsDisplayed, app) {
    if (sAreButtonsDisplayed != "0") {

      var tempo = document.getElementById("EditButtons_" + strDivIdentifier);
      if (tempo == null) {

        var MenuButtonsElem = document.createElement("div");
        MenuButtonsElem.setAttribute("id", "EditButtons_" + strDivIdentifier);
        var strPictures = "";
        strPictures = strPictures + "<table align=\"right\"><tr>"

        parent.mega_global_runMacro('oNxq0pUxKL3I', "getComboListItems" + "$|$" + sReportId + "$|$" + strDivIdentifier, function (sResult, app) {
          parent.mega_global_runMacro('hoNAKBe9LXVF', "getSeriesName" + "%|%" + sReportId + "%|%" + sResult, function (sSeriesNames, app) {

            strPictures = strPictures + "<td align=\"left\">"
            strPictures = strPictures + "<img onclick=\"getContextualSeriesMenu(this," + "'" + sResult + "','" + sAreButtonsDisplayed + "','" + sSeriesNames + "','" + strSeriesTitle + "','" + strDivIdentifier + "','" + strItemTitle + "')\" src=\"" + strStylePic + "\" title=\"" + strStyleTitle + "\"" + " />";
            strPictures = strPictures + "</td>"

            var strCellformenu = "cellformenu_" + strDivIdentifier;
            strPictures = strPictures + "</tr><tr><td align=\"right\"></td><td align=\"right\" id='" + strCellformenu + "'></td></tr></table>"
            strPictures = strPictures + "<br>"

            MenuButtonsElem.innerHTML = strPictures;

            var theFirstChild = editionElem.firstChild;

            if (theFirstChild != null) {
              editionElem.insertBefore(MenuButtonsElem, theFirstChild);
            }
            else {
              editionElem.appendChild(MenuButtonsElem);
            }
          })
        })
      }
    }
  })

}

function NAEForceReportEditionButtons(sRepEdObjId, sTemplateObjectID) {
  // We get bEdit current value
  parent.mega_global_runMacro('oNxq0pUxKL3I', "isReportEditable" + "$|$" + sRepEdObjId + "$|$" + sTemplateObjectID, function (sIsReportEditable, app) {
    if (sIsReportEditable == "0") {
      window.bEdit = false;
    }
    else if (sIsReportEditable == "1") {
      window.bEdit = true;
    }

    if (window.bEdit == true) {
      var strContentTitle, strStyleTitle, strItemTitle;
      parent.mega_global_runMacro('oNxq0pUxKL3I', "getButtons", function (sButtons, app) {
        var tButtons = sButtons.split("$|$");
        strContentTitle = tButtons[0];
        strStyleTitle = tButtons[1];
        strSeriesTitle = tButtons[2];
        strItemTitle = tButtons[3];

        var spans = document.getElementsByTagName("span");
        for (var i = 0; i < spans.length; i++) {
          if ((spans[i].id.indexOf('RendererID_') == 0) && ((window.strBuiltButtonsID == null) || (window.strBuiltButtonsID.indexOf(spans[i].id) == -1))) {
            NAEbuildEditButtons(spans[i].id, sRepEdObjId, window.editContentImgSrc, window.editStyleImgSrc, strContentTitle, strStyleTitle, strSeriesTitle, strItemTitle);
            window.strBuiltButtonsID = window.strBuiltButtonsID + "#_#" + spans[i].id;
          }

        }
      })
    }
  });
}

function NAEEditReportChapterName(sUID, sID, event) {
  var x = (!event.clientX) ? event.pageX - window.pageXOffset : event.clientX;
  var y = (!event.clientY) ? event.pageY - window.pageYOffset : event.clientY;
  var el = window.frameElement.parentNode;
  while (el) {
    if (el.offsetLeft != NaN) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    if (el.scrollLeft != NaN) {
      x -= el.scrollLeft;
      y -= el.scrollTop;
    }
    el = el.offsetParent;
  }
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sID + "|false|~hXFYOdOKsC00[Name]|false|" + (x + 2) + "|" + (y + 2), function (sResult, app) {
    var tDatas = sResult.split("$|$");
    if (tDatas[1].length > 0) {
      var targs = getElementsById("SH_SIEZ_" + sUID);
      for (i = 0; i < targs.length; i++) {
        targs[i].innerHTML = tDatas[1];
      }
    }
  });
}

function NAEswitchEditMode(sReportId, sChapterIds, sTemplateObjectID) {
  // We get bEdit current value
  parent.mega_global_runMacro('oNxq0pUxKL3I', "isReportEditable" + "$|$" + sReportId + "$|$" + sTemplateObjectID, function (sIsReportEditable, app) {
    
    var bSet = true;
    
    if (sIsReportEditable == "0") {
      window.bEdit = false;
    }
    else if (sIsReportEditable == "1") {
      window.bEdit = true;
    }
    else if (sIsReportEditable == "2") {
      window.bEdit = false;
      bSet = false;
      
      parent.mega_global_runMacro('oNxq0pUxKL3I', "displayReportEditionWarning" + "$|$", function (sTempo, app) {});
    }

    if(bSet)
    {
    if (window.bEdit) {
      parent.mega_global_runMacro('oNxq0pUxKL3I', "setReportEditable" + "$|$" + sReportId + "$|$0$|$" + sTemplateObjectID, function (sResult, app) {

        window.bEdit = false;

        NAEdestroyEditButtons('');

        NAEdisplayEditMode('0$|$Refresh');
      })

    } else {
      parent.mega_global_runMacro('oNxq0pUxKL3I', "setReportEditable" + "$|$" + sReportId + "$|$1$|$" + sTemplateObjectID, function (sResult, app) {

        window.bEdit = true;

        var strContentTitle, strStyleTitle, strItemTitle;
        parent.mega_global_runMacro('oNxq0pUxKL3I', "getButtons", function (sButtons, app) {
          var tButtons = sButtons.split("$|$");
          strContentTitle = tButtons[0];
          strStyleTitle = tButtons[1];
          strSeriesTitle = tButtons[2];
          strItemTitle = tButtons[3];
          var spans = document.getElementsByTagName("span");
          for (var i = 0; i < spans.length; i++) {
            if (spans[i].id.indexOf('RendererID_') == 0) {
              NAEbuildEditButtons(spans[i].id, sReportId, window.editContentImgSrc, window.editStyleImgSrc, strContentTitle, strStyleTitle, strSeriesTitle, strItemTitle);
            }
          }
        })

        NAEdisplayEditMode('1$|$')
      })
    }
    }
  })
}

//WEB
function onContainerCmd(prm, attctl) {
  if (prm === 'initialize') {
    window.__attCtl = attctl;
  }
  if (prm === 'refresh') {
    var tReportId = attctl.getData().split("$|$");

    if (tReportId[1] == "undo") {
      parent.mega_global_runMacro('oNxq0pUxKL3I', "setReportEditable" + "$|$" + tReportId[0] + "$|$0$|$" + tReportId[2], function (sResult, app) {

        window.bEdit = false;

        NAEdestroyEditButtons('');

        NAEdisplayEditMode('0$|$Refresh');
      })
    }
    else if (tReportId[1] == "refresh") {
      window.__attCtl.refresh();
    }
  }
  if (prm === 'apply') {

  }
  return "";
}

function resizeReport() {
  var hash = window.location.hash;
  parent.mega_global_fireevent(hash + '_rendered');
}

function NAEDrillDown(sIdAbsList, sWizardId, sSpecificBehavior) {
  NAEDrillDownMenuHide();
  if (sIdAbsList && (sIdAbsList.length > 0)) {
    var sContainerId = window.location.hash;
    if ("nhiNHBc8H1(G;dgiNVDc8HP0H;veiN1Fc8HP3H;4giNbFc8Hr5H".indexOf(sWizardId) > -1) {
      var sChoice = "~" + sWizardId;
      parent.mega_global_runMacro('KdMrSiDDHbTG', sChoice + "$|$" + sSpecificBehavior + "$|$" + sIdAbsList);
    } else {
      var sAffinity = "fDH2td00G5BJ";
      var oJson = {
        "megaPath": "6k(3dXHpEHfN",
        "objectFactory": "mega.model.comp.proppage.DockedWizardPanel",
        "affinities": [sAffinity],
        "parameters": [{"parameterName": "wizardId", "parameterValue": sWizardId},
          {"parameterId": "CuyCQgJTGv2H", "parameterName": "HIDESTATUSBAR", "parameterValue": "1"},
          {"parameterId": "KmLzodl)FPLD", "parameterValue": sIdAbsList},
          {"parameterId": "7fiNxHc8Hb8H", "parameterValue": sSpecificBehavior}]
      };
      if (sContainerId.length > 2) {
        var sId = sContainerId.substr(1);
        parent.mega_global_launchParameterizedTool(oJson, sId);
      }
      else {
        parent.mega_global_launchParameterizedTool(oJson);
      }
    }
  }
}

function NAEDrillDownMenuHide() {
  var divContext = document.getElementById("ReportDDDiv");
  if (divContext) {
    divContext.style.display = 'none';
  }
}

function NAEDrillDownMenu(sIdAbsList, sSpecificBehavior, event) {
  if (sIdAbsList && (sIdAbsList.length > 0)) {
    var scrollTop = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
    var scrollLeft = document.body.scrollLeft ? document.body.scrollLeft : document.documentElement.scrollLeft;
    var posx = event.clientX + scrollLeft;
    var posy = event.clientY + scrollTop;
    parent.mega_global_runMacro('E3lZQ7v8HjXL', sIdAbsList, function (sMenu, app) {
      var aMenuItems = sMenu.split(",");
      var divContext = document.getElementById("ReportDDDiv");
      if (divContext) {
        if (divContext.hasChildNodes()) {
          while (divContext.childNodes.length >= 1) {
            divContext.removeChild(divContext.firstChild);
          }
        }
      } else {
        divContext = document.createElement("div");
        divContext.id = "ReportDDDiv";
        divContext.setAttribute("style", "border: 1px solid gray; display: none; position: absolute; background-color: white;");
        document.body.appendChild(divContext);
      }
      var ul = document.createElement("ul");
      ul.setAttribute("style", "padding: 1px; margin: 1px;");
      divContext.appendChild(ul);
      for (var i in aMenuItems) {
        var aMenuItem = aMenuItems[i].split(":");
        var li = document.createElement("li");
        ul.appendChild(li);
        var a = document.createElement("a");
        li.appendChild(a);
        li.setAttribute("style", "list-style:none; padding: 1px; margin: 1px; cursor: pointer;");
        a.setAttribute("onclick", "NAEDrillDown('" + sIdAbsList + "','" + aMenuItem[0] + "','" + sSpecificBehavior + "');");
        a.innerHTML = aMenuItem[1];
      }
      divContext.style.display = 'none';
      divContext.style.left = posx + 'px';
      divContext.style.top = posy + 'px';
      divContext.style.display = 'block';
    });
  }
}

function NAEReportSave(sFile, sContentsUID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  parent.mega_global_runMacro('putpt)SAIb87', sFile + "$|$" + sContents);
}

function NAEWidgetSave(sFile, sContentsUID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  parent.mega_global_runMacro('putpt)SAIb87', sFile + "$|$" + sContents + "$|$widget");
}

function NAEReportV2SaveAs(sType, sContentsUID) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  parent.mega_global_runMacro('nLEgwnRmM1u5', sType + "$|$" + sContents);
}

function NAEReportExport(sAnalysis, sReport, sFile, sContentsUID, sFormat) {
  var sContents = "";
  if (sContentsUID.length > 1) {
    sContents = escape(document.getElementById(sContentsUID).innerHTML);
  }
  if (parent.mega_global_runMacro) {
    parent.mega_global_runMacro('jQHj3NBfCf70', sFormat + "$|$" + sAnalysis + "$|$" + sReport + "$|$" + sFile + "$|$" + sContents);
  } else if (window.mega_global_runMacro) {
    mega_global_runMacro('jQHj3NBfCf70', sFormat + "$|$" + sAnalysis + "$|$" + sReport + "$|$" + sFile + "$|$" + sContents);
  } else {
    alert('Suspension service unavailable');
  }
}

function NAEExportToXLS(sReport, sAnalysis) {
  NAEReportExport(sAnalysis, sReport, '', '', 'XLS');
}

function NAEOpenParametrization(sAnalysis, sReport) {
  parent.mega_global_runMacro('aYOY6euIE5GQ', sAnalysis + "|" + sReport);
}

function OpenAnalysisDiagramTab(sDataProcessingInformationXmlFileName) {
  parent.mega_global_runMacro('qFlvzS(oDzC4', sDataProcessingInformationXmlFileName);
}

function NAECreateLinkedObjectAndUpdate(sSourceObjectId, sMAEId, sPropId) {
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sSourceObjectId + "|" + sMAEId + "|" + sPropId, function (sResult, app) {
    var tDatas = sResult.split("$|$");
    if (tDatas[1].length > 0) {
      var sNewVal = "<li><div id=\"MO_" + tDatas[0] + "_" + sPropId + "\" onmouseover=\"style.color='skyblue'; style.backgroundColor='steelblue';\" onmouseout=\"style.color=''; style.backgroundColor='';\" style='cursor:hand' onclick='PropertyPageWithActivePageAndRefresh(\"" + tDatas[0] + "\", \"\",\"" + sPropId + "\",\"\")'>" + tDatas[1] + "</div></li>";
      var targs = getElementsById("MONEW_" + sSourceObjectId + "_" + sMAEId);
      for (i = 0; i < targs.length; i++) {
        targs[i].innerHTML = sNewVal + targs[i].innerHTML;
      }
    }
  });
}

function CreateDeliverableInstance(sUserData) {
  parent.mega_global_runMacro('QhB1kdHtDLfL', sUserData, function (sResult, app) {
    //refreshPropertyPage();
    window.location.reload();
    //var el = document.getElementById(sDelivType + sDeliverableId + sTemplateId);
    //if(el != null) el.scrollIntoView(true);
  });
}

function NAEOpenXmlAnalysis(sXmlAnalysisId, sObjectId) {
  parent.mega_global_runMacro('M2(8bxIxCT40', sXmlAnalysisId + "|" + sObjectId);
}

// tabs on renderers
function NAEmanageTabs(sViewId, iNumOfTabs, sDivNames) {
  var oTabsDiv = document.getElementById(sViewId + "_M");
  var tDivNames = sDivNames.split('|');
  var sTabs = "<ul>";
  var sClass = "NAEshownRenderTT";
  for (var i = 1; i <= iNumOfTabs; i++) {
    sTabs = sTabs + "<li id=\"" + sViewId + "_M_T" + i + "\" class=\"" + sClass + "\" onClick=\"NAEShowHideTab('" + sViewId + "'," + iNumOfTabs + "," + i + ")\">" + tDivNames[i - 1] + "</li>";
    sClass = "NAEhiddenRenderTT";
  }
  sTabs += "</ul>";
  oTabsDiv.innerHTML = sTabs;
  NAEShowHideTab(sViewId, iNumOfTabs, 1);
}

// tab click
function NAEShowHideTab(sViewId, iNumOfTabs, iTabId) {
  var oDiv;
  var oTitle;
  for (var i = 1; i <= iNumOfTabs; i++) {
    oDiv = document.getElementById(sViewId + "_" + i);
    oTitle = document.getElementById(sViewId + "_M_T" + i);
    if (i == iTabId) {
      oDiv.className = "NAEshownRenderTab";
      oTitle.className = "NAEshownRenderTT";
    } else {
      oDiv.className = "NAEhiddenRenderTab";
      oTitle.className = "NAEhiddenRenderTT";
    }
  }
}

function openAnywhereContextualMenu(e, sId) {
  var x = (!e.clientX) ? e.pageX - window.pageXOffset : e.clientX;
  var y = (!e.clientY) ? e.pageY - window.pageYOffset : e.clientY;
  var el = window.frameElement.parentNode;
  while (el) {
    if (el.offsetLeft != NaN) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    if (el.scrollLeft != NaN) {
      x -= el.scrollLeft;
      y -= el.scrollTop;
    }
    el = el.offsetParent;
  }
  parent.mega_global_trackPopup(x + 2, y + 2, sId);
  e.returnValue = false;
  try {
    e.stopPropagation();
    e.preventDefault()
  } catch (ex) {
  }
  return false;
}

function PropertyPage(sId) {
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sId);
}

function PropertyPageWithActivePage(sId, sClsid) {
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sId + "|" + sClsid);
}

function NAEInPlaceEditAndRefresh(e, sId, sPropId, sHasFont, sHasIcon) {
  var x = (!e.clientX) ? e.pageX - window.pageXOffset : e.clientX;
  var y = (!e.clientY) ? e.pageY - window.pageYOffset : e.clientY;
  var el = window.frameElement.parentNode;
  while (el) {
    if (el.offsetLeft != NaN) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    if (el.scrollLeft != NaN) {
      x -= el.scrollLeft;
      y -= el.scrollTop;
    }
    el = el.offsetParent;
  }
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sId + "|" + sHasIcon + "|" + sPropId + "|" + sHasFont + "|" + (x + 2) + "|" + (y + 2), function (sResult, app) {
    var tDatas = sResult.split("$|$");
    if (tDatas[1].length > 0) {
      var targs = getElementsById("MO_" + tDatas[0]);
      for (i = 0; i < targs.length; i++) {
        targs[i].innerHTML = tDatas[1];
      }
    }
  });
}

function PropertyPageWithActivePageAndRefresh(sId, sClsid, sPropId, sReplaceText, sHasFont) {
  parent.mega_global_runMacro('oNTsLVG)Cn)8', sId + "|" + sClsid + "|" + sPropId + "|" + sReplaceText + "|" + sHasFont, function (sResult, app) {
    var tDatas = sResult.split("$|$");
    if (tDatas[1].length > 0) {
      var targs = getElementsById("MO_" + tDatas[0]);
      for (i = 0; i < targs.length; i++) {
        targs[i].innerHTML = tDatas[1];
      }
    }
  });
}

function getElementsById(id) {
  var nodes = [];
  var tmpNode = document.getElementById(id);
  while (tmpNode) {
    nodes.push(tmpNode);
    tmpNode.id = "";
    tmpNode = document.getElementById(id);
  }
  for (var x = 0; x < nodes.length; x++) {
    nodes[x].id = id;
  }
  return nodes;
}

function NAEDisplayReportFromXML(sRXMLid, sRepEdObjId, sTemplateObjectID, bIsRefreshForced) {
  var sFormat = "HTML";
  if (bIsRefreshForced == "true") {
    sFormat = "HTMLRE";
  }
  var oXML = escape(document.getElementById(sRXMLid).innerHTML);
  var oMyComponent = document.body;
  var myMask = new Ext.LoadMask(Ext.getBody(), {});
  myMask.show();
  parent.mega_global_runMacro('jQHj3NBfCf70', sFormat + "$|$$|$$|$$|$" + oXML, function (sResult, app) {
    oMyComponent.innerHTML = unescape(sResult);
    if (bIsRefreshForced == "true") {
      var oGenDateDur = document.getElementById("GDD_" + sRXMLid);
      if (oGenDateDur) {
        oGenDateDur.innerHTML = "&nbsp;";
      }
    }
    var containedScripts = oMyComponent.getElementsByTagName("script");
    for (var i = 0; i < containedScripts.length; i++) {
      eval(containedScripts[i].innerHTML);
    }
    myMask.hide();

    if (sRepEdObjId != "") {

      if (window.strBuiltButtonsID != null) {
        window.strBuiltButtonsID = "";
      }

      NAEForceReportEditionButtons(sRepEdObjId, sTemplateObjectID);
    }

    resizeReport();
  });
}

// Generates a report asynchronously and shows it - Step 1
function NAEDisplayReport(sReportId, sAnalysisId, sURL) {
  parent.mega_global_runMacro('HWQTi8vZMrCX', "refreshReportDataSets" + "$|$" + sAnalysisId + "$|$", function (strEmptyString, app) {
    // We get bEdit current value
    parent.mega_global_runMacro('oNxq0pUxKL3I', "isReportEditable" + "$|$" + sAnalysisId + "$|$", function (sIsReportEditable, app) {
      if (sIsReportEditable == "0") {
        window.bEdit = false;
      }
      else if (sIsReportEditable == "1") {
        window.bEdit = true;
      }
      var sFormat = "HTML";
      if (sURL == "true") {
        sFormat = "HTMLRE";
      }
      var oMyComponent = document.getElementById("RC_" + sReportId + "_" + sAnalysisId);
      oMyComponent.style.visibility = 'visible';
      oMyComponent.style.display = 'block';
      oMyComponent.innerHTML = "<img src=\"binaryimage.aspx?data=generationtype-resource|object-loading.gif|2731\"/>";
      document.body.style.cursor = "wait";
      if (parent.mega_global_runMacro) {
        parent.mega_global_runMacro('jQHj3NBfCf70', sFormat + "$|$" + sAnalysisId + "$|$" + sReportId + "$|$" + "$|$", function (sResult, app) {
          NAEDisplayReport3(oMyComponent, unescape(sResult), sReportId, sAnalysisId, sURL);
        });
      } else if (window.mega_global_runMacro) {
        mega_global_runMacro('jQHj3NBfCf70', sFormat + "$|$" + sAnalysisId + "$|$" + sReportId + "$|$" + "$|$", function (sResult, app) {
          NAEDisplayReport3(oMyComponent, unescape(sResult), sReportId, sAnalysisId, sURL);
        });
      } else {
        setTimeout("NAEDisplayReport2('" + sReportId + "','" + sAnalysisId + "','" + sURL + "')", 1);
      }
    })
  })
}


// Generates a report asynchronously and shows it - Historic Step 2
function NAEDisplayReport2(sReportId, sAnalysisId, sURL) {
  var oMyComponent = document.getElementById("RC_" + sReportId + "_" + sAnalysisId);

  // Advisor
  var xhr = getXhr();
  var sResponse;

  xhr.onreadystatechange = function () {
    if ((xhr.readyState == 4) && (xhr.status == 200)) {
      sResponse = xhr.responseText;
      if (oMyComponent != null) {
        NAEDisplayReport3(oMyComponent, sResponse, sReportId, sAnalysisId, sURL);
      }
    }
  };

  xhr.open("POST", sURL, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send("userdata=" + "reportid__--__" + sReportId + "__;;__analysisid__--__" + sAnalysisId + "__;;__xmlanalysisfilename__--__" + "" + "__;;__xmlanalysiscontent__--__" + "" + "__;;__displayreportcontent__--__" + "");
}

function NAEDisplayReport3(oMyComponent, sResponse, sReportId, sAnalysisId, sRefresh) {
  oMyComponent.innerHTML = sResponse;
  var oShowHide = document.getElementById("SH_" + sReportId + "_" + sAnalysisId);
  if (oShowHide) {
    oShowHide.innerHTML = oShowHide.innerHTML.replace(/openreport/g, "closereport");
    oShowHide.onclick = function () {
      NAEHide(sReportId + "_" + sAnalysisId)
    };
  }
  if (sRefresh == "true") {
    var oGenDateDur = document.getElementById("GDD_" + sReportId + "_" + sAnalysisId);
    if (oGenDateDur) {
      oGenDateDur.innerHTML = "&nbsp;";
    }
  }
  document.body.style.cursor = "default";
  var containedScripts = oMyComponent.getElementsByTagName("script");
  var myWatcher = 0;
  for (var i = 0; i < containedScripts.length; i++) {
    eval(containedScripts[i].innerHTML);
  }

  var myImg = oMyComponent.getElementsByTagName("img");

  // Check if each img is loaded. Second img might be loaded before first.
  for (i = 0; i < myImg.length; i++) {

    myImg[i].onload = function () {
      myWatcher++;

      if (myWatcher == myImg.length) {
        resizeReport();
        // Might want to call a function for anything you might want to do.
      }
    };
  }

  if (window.bEdit) {
    var strContentTitle, strStyleTitle, strItemTitle;
    parent.mega_global_runMacro('oNxq0pUxKL3I', "getButtons", function (sButtons, app) {
      var tButtons = sButtons.split("$|$");
      strContentTitle = tButtons[0];
      strStyleTitle = tButtons[1];
      strSeriesTitle = tButtons[2];
      strItemTitle = tButtons[3];
      var spans = document.getElementsByTagName("span");
      for (var i = 0; i < spans.length; i++) {
        if (spans[i].id.indexOf('RendererID_') == 0) {
          NAEbuildEditButtons(spans[i].id, sAnalysisId, window.editContentImgSrc, window.editStyleImgSrc, strContentTitle, strStyleTitle, strSeriesTitle, strItemTitle);
        }
      }
    })
  }

  if (myImg.length === 0) {
    resizeReport();
  }


}


// Hides a report
function NAEHide(sReportId) {
  var oShowHide = document.getElementById("SH_" + sReportId);
  oShowHide.innerHTML = oShowHide.innerHTML.replace(/closereport/g, "openreport");
  oShowHide.onclick = function () {
    NAEShow(sReportId)
  };
  document.getElementById("RC_" + sReportId).style.visibility = 'hidden';
  document.getElementById("RC_" + sReportId).style.display = 'none';

  //Redim report window when closing a diagram in a report
  resizeReport();
}

// Shows an already generated report
function NAEShow(sReportId) {
  var oShowHide = document.getElementById("SH_" + sReportId);
  oShowHide.innerHTML = oShowHide.innerHTML.replace(/openreport/g, "closereport");
  oShowHide.onclick = function () {
    NAEHide(sReportId)
  };
  document.getElementById("RC_" + sReportId).style.visibility = 'visible';
  document.getElementById("RC_" + sReportId).style.display = 'block';

  //Redim report window when opening a report or a diagram in a report
  resizeReport();
}

//Show a bubble
function NAEShowBubble(sBubbleId) {
  document.getElementById(sBubbleId).style.visibility = 'visible';
  document.getElementById(sBubbleId).style.display = 'block';
}
//Hide a bubble
function NAEHideBubble(sBubbleId) {
  document.getElementById(sBubbleId).style.visibility = 'hidden';
  document.getElementById(sBubbleId).style.display = 'none';
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
  var oMyComponent = document.getElementById("SH_" + sElementId);
  oMyComponent.innerHTML = oMyComponent.innerHTML.replace(/openreport/g, "closereport");
  oMyComponent.onclick = function () {
    NAEHideSubTree(sElementId)
  };
  var iIndex = 1;
  while (oMyComponent = document.getElementById("ST_" + sElementId + "_" + iIndex)) {
    oMyComponent.style.visibility = "visible";
    oMyComponent.style.display = "";
    iIndex++;
  }
  ;

  resizeReport();
}

// Hide a subtree
function NAEHideSubTree(sElementId) {
  var oMyComponent;
  while (oMyComponent = document.getElementById("SH_" + sElementId)) {
    oMyComponent.innerHTML = oMyComponent.innerHTML.replace(/closereport/g, "openreport");
    oMyComponent.onclick = function () {
      NAEShowSubTree(sElementId)
    };
    break;
  }
  ;
  var iIndex = 1;
  while (oMyComponent = document.getElementById("ST_" + sElementId + "_" + iIndex)) {
    oMyComponent.style.visibility = "hidden";
    oMyComponent.style.display = "none";
    NAEHideSubTree(sElementId + "_" + iIndex);
    iIndex++;
  }
  ;

  resizeReport();
}

// Callback management
function NAECallback(sCallbackId, sCellId, sColumnObjectsIds, sRowObjectsIds, oUserData) {
  var oMyCell = document.getElementById(sCellId);
  var sCellContent = oMyCell.innerHTML;
  parent.mega_global_runMacro('SuvJlILKDzoN', escape(sCallbackId + "$|$" + sCellId + "$|$" + sCellContent + "$|$" + sColumnObjectsIds + "$|$" + sRowObjectsIds + "$|$" + oUserData), function (sResult, app) {
    var tDatas = sResult.split("$|$");
    var oMyCell = getElementsById(tDatas[0]);
    for (i = 0; i < oMyCell.length; i++) {
      oMyCell[i].innerHTML = tDatas[1];
    }
  });
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
      if (idI.substr(0, 8) === "endline_") {
        {
          bCmpI = false;
        }
      }
    if (bCmpI == true) {
      // Assume the current row has the minimum value.
      minIdx = i;
      minVal = NAEgetTextValue(tblEl.tBodies[0].rows[i].cells[col]);

      // Search the rows that follow the current one for a smaller value.
      for (j = i + 1; j < tblEl.tBodies[0].rows.length; j++) {
        var bCmpJ = true;
        var idJ = tblEl.tBodies[0].rows[j].cells.item(col).id;
        if ((idJ !== null) && (idJ !== "")) {
          if (idJ.substr(0, 8) === "endline_") {
            bCmpJ = false;
          }
        }
        if (bCmpJ == true) {
          testVal = NAEgetTextValue(tblEl.tBodies[0].rows[j].cells[col]);
          cmp = NAEcompareValues(minVal, testVal, isCurrency);
          // Negate the comparison result if the reverse sort flag is set.
          if (tblEl.reverseSort[col]) {
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
    document.getElementById(id + "_C_" + col).innerHTML = document.getElementById(id + "_C_" + col).innerHTML.replace(/desc/g, "asc");
    //document.getElementById(id+"_C_"+col).innerHTML = "^";
  } else {
    document.getElementById(id + "_C_" + col).innerHTML = document.getElementById(id + "_C_" + col).innerHTML.replace(/asc/g, "desc");
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
  if (el != null) {
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
        } else if (el.childNodes[i].tagName.toLowerCase() != "script" && el.childNodes[i].tagName.toLowerCase() != "input" && el.childNodes[i].className.toLowerCase() != "commenttab") {
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
  if (isCurrency) {
    v1 = v1.replace(/[^0-9\.]+/g, "");
    v2 = v2.replace(/[^0-9\.]+/g, "");
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
//Launch Mapping Wizard.
function createMappingWizard(sIAnalysis, sLeftObjectIds, sRightObjectIds, oMapType) {
  var objectList = getObjectsIdList();
  parent.mega_global_runMacro('WAh7aGoRLzOD', "createMappingWizardAnywhere" + "$|$" + sLeftObjectIds + "$|$" + sRightObjectIds + "$|$" + oMapType, function (sResult, app) {
  });
}
function createMapping(oDeployedItem, oDeploymentItem, oMapType) {
  parent.mega_global_runMacro('WAh7aGoRLzOD', "createMappingWizardAnywhere" + "$|$" + oDeployedItem + "$|$" + oDeploymentItem + "$|$" + oMapType, function (sResult, app) {
  });
}
function showmapping(omoMapping) {
  parent.mega_global_runMacro('A9DwlOFdLf64', "showMapping" + "$|$" + omoMapping, function (sResult, app) {
  });
}

function launchWizard(missionKind) {
  var objectList = getObjectsIdList();
  parent.mega_global_runMacro('UV3qv3DEH1N5', "launchWizardAnywhere" + "$|$" + missionKind + "$|$" + objectList, function (sResult, app) {
  });
}

function getObjectsIdList() {
  var tables = document.getElementsByName("select");
  var string = "";

  for (i = 0; i < tables.length; i++) {
    if (document.getElementsByName("select")[i].checked)
      string = string + document.getElementsByName("select")[i].id + " "
  }
  return string;
}

function validateTimesheetWizard(beginDate, endDate) {
  parent.mega_global_runMacro('WPzFtEMPIP59', "validateTimesheetWizardAnyWhere" + "$|$" + beginDate + "$|$" + endDate, function (sResult, app) {
  });
}

