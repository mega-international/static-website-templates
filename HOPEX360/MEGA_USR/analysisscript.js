
/* ------------------------------- */
function closeReport (sindex) {
  var oMyComponent;		
	/* Closes the <DIV> tag that contains the report. */
  oMyComponent = document.getElementById ("idReportContent" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Hides the close button. */
  oMyComponent = document.getElementById ("idCloseReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Shows the open button. */
  oMyComponent = document.getElementById ("idOpenReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
	/* Hide the refresh button. */
  oMyComponent = document.getElementById ("idRefreshReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Hide the title of the analysis that would recreate it. */
  oMyComponent = document.getElementById ("idAnalysisTitle" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Shows the title of the analysis that would reopen it. */
  oMyComponent = document.getElementById ("idAnalysisTitleOpen" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
	/* Hides the title of the analysis that can close the report. */
  oMyComponent = document.getElementById ("idAnalysisTitleClose" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
}

/* ------------------------------- */
/* The report is supposed to be already computed. */
function openReport(sindex) {
  var oMyComponent;
	/* Closes the <DIV> tag that contains the report. */
  oMyComponent = document.getElementById ("idReportContent" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
	/* Hides the close button. */
  oMyComponent = document.getElementById ("idCloseReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
	/* Shows the open button. */
  oMyComponent = document.getElementById ("idOpenReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Shows the refresh button. */
  oMyComponent = document.getElementById ("idRefreshReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
	/* Hides the title of the analysis that should be contained in the report. */
  oMyComponent = document.getElementById ("idAnalysisTitle" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Hides the title of the analysis that would reopen it. */
  oMyComponent = document.getElementById ("idAnalysisTitleOpen" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
	/* Shows the title of the analysis that can close the report. */
  oMyComponent = document.getElementById ("idAnalysisTitleClose" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "inline" };
  oMyComponent = document.getElementById ("idComputeReport" + sindex);
  if (oMyComponent != null) {	oMyComponent.style.display = "none" };
}





/* Temporary : For Solman */

  var G_classobjHide        = "solman_objHide";
  var G_classobjDisplay     = "solman_objDisplay";
  var oPictureExpandid;
  var oPictureCollapseid;
  oPictureExpandid = "";
  oPictureCollapseid = "";

  function init()
  {
    if (oPictureExpandid=="")
    {
      var objSrc = document.getElementById("PICTURE_EXPAND");
      if (objSrc)
      {
        oPictureExpandid = objSrc.rows.item(0).id;
      }			
      objSrc = document.getElementById("PICTURE_COLLAPSE");
      if (objSrc)
      {
	oPictureCollapseid = objSrc.rows.item(0).id;
      }
    }
  }				


  function GetPicture(theId, childPicture)  
  {
    if (theId=='')    
    {
      return;		
    }
    var oPictureCollection = document.all;
    for (var iPicture=0; iPicture < oPictureCollection.length; iPicture++)    
    {
      var oPicture = oPictureCollection.item(iPicture);
      if (childPicture == 1)		 
      {
	if (oPicture.id.length > theId.length && oPicture.id.substring(0,theId.length) == theId)			 
	{
	  return oPicture;
	}
      }
      else
      {
      	if( oPicture.id == theId )			
	{
	  return oPicture;
	}
      }		
    }
  }


  function HideChild( theId)  
  {
    if (theId=='')    
    {
      return;
    }
    var objTree = document.getElementById("ROOT");
    var oObjChildCollection = objTree.rows;
    for (var j=0; j < oObjChildCollection.length; j++)    
    {
      var oItemChild = oObjChildCollection.item(j);
      if (oItemChild.id == theId || oItemChild.id.substring(0,theId.length) == theId)      
      {
        oItemChild.className = G_classobjHide;
      }
    }
  }


  function ShowChildValue(theId)
  {
    if (theId=='')
    {
    	return;
    }
    var objTree = document.getElementById(theId);
    if (objTree) 
    {
      var oChildCollection = objTree.rows;
      for ( i=0; i < oChildCollection.length; i++ )
      {
      	oItem = oChildCollection.item(i);
      	if( oItem.id == theId )
      	{
	  var oPicture = GetPicture("P-" + theId, 0);
	  if ( oItem.className == G_classobjHide )
          {
	    oItem.className = G_classobjDisplay;
	    oPicture.src = oPictureCollapseid;
	  } else
          {
	    oItem.className = G_classobjHide;
	    oPicture.src = oPictureExpandid;
	  }
	} 
      }
    }
  }


  function ShowChild(theId)
  {
    if (theId=='')
    {
      return;
    }
    init();
    var objTree = document.getElementById("ROOT");
    var oChildCollection = objTree.rows;
    mode = 1;
    for ( i=0; i < oChildCollection.length; i++ )
    {
      oItem = oChildCollection.item(i);
      if( oItem.id == theId )
      {
        if ( oItem.className == G_classobjHide )
        {
          oItem.className = G_classobjDisplay;
	  oPicture = GetPicture("P-" + oItem.id, 1);
	  if (oPicture)
	  {
	    oPicture.src = oPictureExpandid;
	  }
        }
        else if ( oItem.className == G_classobjDisplay )
        {
          mode = 0;
        }
      }
    }
    oPicture = GetPicture("P-" + theId, 0);
    if (mode == 0)    
    {
      HideChild(theId);
      if (oPicture)
      {
        oPicture.src = oPictureExpandid;
      }
    }
    else
    {
      if (oPicture)
      {
        oPicture.src = oPictureCollapseid;
      }
    }
  }
  
  
  function click_me(element)
 {
   var oMyElement = document.getElementById(element);
   if (oMyElement)
   {
     oMyElement.fireEvent("onclick");
   }
 }

//
//  DoDAF
//

function createUseCaseFromSystemProcess(sActivityOrOperationId, sSystemProcessId, sAnalysisId, bIsSV5a, bIs2007)
{
  if(bIsSV5a == true)
  {
    createUseCaseFromSystemProcessSV5a(sActivityOrOperationId, sSystemProcessId, sAnalysisId, bIs2007)
  }
  else
  {
    createUseCaseFromSystemProcessSV5b(sActivityOrOperationId, sSystemProcessId, sAnalysisId, bIs2007)
  }
}

function createUseCaseFromSystemFunction(sActivityId, sSystemProcessId, sAnalysisId)
{
}

var affiche = true;
function toggleList(title, list, sList, sclick){
  affiche=!affiche;
  document.getElementById(title).innerHTML=(affiche)? sList : sclick;
  document.getElementById(list).style.display=(affiche)?'block':'none';
}
