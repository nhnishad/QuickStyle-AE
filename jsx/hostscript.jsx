// Smart apply color
function smartApplyColor(r, g, b) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "no_layer";
        }
        
        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            return "no_layer";
        }
        
        var applied = false;
        
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            
            // Text Layer
            if (layer instanceof TextLayer) {
                var textProp = layer.property("Source Text");
                var textDocument = textProp.value;
                textDocument.fillColor = [r, g, b];
                textProp.setValue(textDocument);
                applied = true;
            }
            // Solid Layer
            else if (layer instanceof AVLayer && layer.source instanceof FootageItem) {
                if (layer.source.mainSource instanceof SolidSource) {
                    layer.source.mainSource.color = [r, g, b];
                    applied = true;
                }
            }
            // Shape Layer
            else if (layer instanceof ShapeLayer) {
                var contents = layer.property("Contents");
                for (var j = 1; j <= contents.numProperties; j++) {
                    var group = contents.property(j);
                    
                    // Handle groups
                    if (group.matchName === "ADBE Vector Group") {
                        var groupContents = group.property("Contents");
                        for (var k = 1; k <= groupContents.numProperties; k++) {
                            var prop = groupContents.property(k);
                            if (prop.matchName === "ADBE Vector Graphic - Fill") {
                                prop.property("Color").setValue([r, g, b, 1]);
                                applied = true;
                            }
                        }
                    }
                    // Direct fill
                    else if (group.matchName === "ADBE Vector Graphic - Fill") {
                        group.property("Color").setValue([r, g, b, 1]);
                        applied = true;
                    }
                }
            }
        }
        
        return applied ? "success" : "ignored";
        
    } catch (e) {
        return "error";
    }
}

// Apply font to text
function applyFontToText(fontPostscript) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "no_text";
        }
        
        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            return "no_text";
        }
        
        var textLayerFound = false;
        var applied = false;
        
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            
            if (layer instanceof TextLayer) {
                textLayerFound = true;
                
                try {
                    var textProp = layer.property("Source Text");
                    var textDocument = textProp.value;
                    textDocument.font = fontPostscript;
                    textProp.setValue(textDocument);
                    applied = true;
                } catch (e) {
                    continue;
                }
            }
        }
        
        if (!textLayerFound) {
            return "no_text";
        }
        
        return applied ? "success" : "error";
        
    } catch (e) {
        return "error";
    }
}

// Apply effect to selected layers
function applyEffectToLayer(effectMatchName) {
    try {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return "no_layer";
        }
        
        var layers = comp.selectedLayers;
        if (layers.length === 0) {
            return "no_layer";
        }
        
        var applied = false;
        
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            
            try {
                // Add effect to layer
                var effects = layer.property("ADBE Effect Parade");
                
                // Check if effect already exists
                var effectExists = false;
                for (var j = 1; j <= effects.numProperties; j++) {
                    if (effects.property(j).matchName === effectMatchName) {
                        effectExists = true;
                        break;
                    }
                }
                
                if (!effectExists) {
                    effects.addProperty(effectMatchName);
                    applied = true;
                } else {
                    // Effect already exists, still count as success
                    applied = true;
                }
                
            } catch (e) {
                // Some layers might not support effects
                continue;
            }
        }
        
        return applied ? "success" : "error";
        
    } catch (e) {
        return "error";
    }
}