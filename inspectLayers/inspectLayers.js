#target "InDesign-8.0";

var SPEEDFACTORTOGGLE = 1;
var SPEEDFACTORSWITCH = 1;

function setView(zoomFit, viewMode) {
  app.layoutWindows[0].zoom(zoomFit);
  app.layoutWindows[0].screenMode = viewMode;
}

function toggleLayerVisibility(layerCollection, visibility) {
  for(var i = 0; i < layerCollection.length; i++) {
    if(layerCollection[i].name === "Code and info") continue;
    layerCollection[i].visible = visibility;
  }
}

function switchLayers(layerCollection) {
  // This goes backwards
  for(var i = layerCollection.length - 1; i >= 0; i--) {
    if(layerCollection[i].visible) continue;

    layerCollection[i].visible = true;
    $.sleep(1000 * SPEEDFACTORSWITCH);
    layerCollection[i].visible = false;
    $.sleep(250 * SPEEDFACTORSWITCH);
  }
}

try {
  var panelFolder = Folder.selectDialog("Pick panel folder");
  var panelFiles = panelFolder.getFiles("*.indd");

  for(var fileIndex = 0; fileIndex < panelFiles.length; fileIndex++) {
    var doc = app.open(panelFiles[fileIndex]);
    var layers = doc.layers;

    setView(ZoomOptions.FIT_PAGE, ScreenModeOptions.PREVIEW_TO_BLEED);
    $.sleep(2000 * SPEEDFACTORTOGGLE);
    toggleLayerVisibility(layers, false);
    $.sleep(500 * SPEEDFACTORTOGGLE);
    switchLayers(layers);
    $.sleep(250 * SPEEDFACTORTOGGLE);
    toggleLayerVisibility(layers, true);
    
    setView(ZoomOptions.FIT_PAGE, ScreenModeOptions.PREVIEW_TO_PAGE);
    $.sleep(2000 * SPEEDFACTORTOGGLE);
    doc.close(SaveOptions.NO);
  }  
} catch (e) {
}
