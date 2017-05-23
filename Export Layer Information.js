/*
Export Layer Information
Author: Dax Soft
Version: 0.1
Website: www.dax-soft.weebly.com
Just WORKS on WINDOW!
===============================================================================
Installation Guide:
  1. Place this script in /filename: Export Layer Information.js
    Mac: '~/Applications/Adobe Photoshop CS#/Presets/Scripts/'
    Win: 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
  2. Restart your Photoshop
  3. Choose File > Scripts > Export Photoshop Information
===============================================================================
*/
'use strict';
// Imported Session
var Imported = Imported || {};
var Dax = Dax || {};
Dax.exportLayerInformation = {};
// That Function
(function($) {
  // Enables lauchin'
  #target photoshop
  // Bring application forward
  app.bringToFront();
  // Set active Document variable and decode name for output
  var docRef = app.activeDocument;
  var docName = decodeURI(activeDocument.name);
  // Define PIXELS as measurement
  var defaultRulerUnits = preferences.rulerUnits;
  preferences.rulerUnits = Units.PIXELS;
  // Number of layers
  var layerNum = app.activeDocument.artLayers.length;
  // Active Layers
  var layer = app.activeDocument.activeLayer;
  // Getting the position
  var arrayInfo = new Array();
  arrayInfo["x"] = layer.bounds[0].value;
  arrayInfo["y"] = layer.bounds[1].value;
  arrayInfo["Opacity"] = layer.opacity;
  var stringInformation = "";
  // All layer each
  //   current : current layer
  function eachLayer(current) {
    for ( var i = 0; i < current.layers.length; i++ ) { // each layer display on this
      layer = current.layers[i];
      // Getting Information
      arrayInfo["x"] = layer.bounds[0].value;
      arrayInfo["y"] = layer.bounds[1].value;
      arrayInfo["Opacity"] = layer.opacity;
      stringInformation += layer.name + ", position: " + arrayInfo["x"] + "x; " + arrayInfo["y"] + "y;\n";
      stringInformation += layer.name + ", opacity: " + arrayInfo["Opacity"] + "\n\n";
      // testing
      if (isLayerSetup(current.layers[i])) { // testing if is set
        eachLayer(currLayers.layers[i]); // run this loop
      }
    }
  }

  // test for a layer set
  function isLayerSetup(current) {
    try {
      if (current.layer.length > 0) {
        return true;
      }
    }
    catch(error) {
      return false
    }
  }

  // Asking for a Folder to Save it
  var FPath = Folder.selectDialog("Save exported information to");
  fileLineFeed = "Windows";

  // Exporting all information
  function exportInformation(info) {
    try {
      var file = new File(FPath + "/" + docName + ".txt");
      file.remove();
      file.open("a");
      file.lineFeed = fileLineFeed;
      file.write(info);
      file.close();
    }
    // don't
    catch(error) {}
  }

  // Running the script
  eachLayer(docRef);
  preferences.rulerUnits = defaultRulerUnits; // Set preferences back to user 's defaults
  exportInformation(stringInformation);

  // Results to feedback
  if (FPath == null) {
    alert("Exported aborted", "Cancel")
  } else {
    alert("Exported as txt file: " + layerNum + "layer's info to " + FPath + "/" + docName + "~ using (" + fileLineFeed + ") line feeds!", "Congratulations!");
  }
})(Dax.exportLayerInformation);
Imported["exportLayerInformation"] = true;
