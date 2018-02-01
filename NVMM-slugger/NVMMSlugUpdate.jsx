﻿#target InDesign


try{
    // These are declared here so they can be used by dialogSetup()
    var myWindow; var batchEditText; var reviewEditText; var dateEditText;
    var batchReviewCheck; var dateCheck;

    dialogSetup();
    
    // Make sure at least one checkbox is true
    if(myWindow.show() && (batchReviewCheck.value || dateCheck.value)) {
        main();

    } else {
        alert("No updates made!\r Select something to update.");
        app.dialogs.everyItem().destroy()
    }
    
} catch(error) {
    alert(error);
}


function dialogSetup() {
    var today = getTodaysDate();

    myWindow = new Window("dialog", "Panels are CHILL");
    
    // Row 1
    var inputRow1 = myWindow.add("group {alignment: 'left'}");
    
    // Batch & Review
    batchReviewCheck = inputRow1.add("checkbox {size: [60, 15], text: '\u00A0Batch:'}");
    batchReviewCheck.onClick = function() {
        if(batchReviewCheck.value) {
            batchEditText.enabled = true;
            reviewEditText.enabled = true;
        
        } else {
            batchEditText.enabled = false;
            reviewEditText.enabled = false;
        }
    };

    batchEditText = inputRow1.add('edittext {text: "1", size: [40, 27], enabled: false}');
    
    var reviewStaticText = inputRow1.add('statictext {text: "Review:", size: [55, 25], alignment: "bottom", justify: "right"}');
    reviewEditText = inputRow1.add('edittext {text: "1", size: [40, 27], enabled: false}');

    // Row 2
    var inputRow2 = myWindow.add('group {alignment: "left"}');

    // Date
    dateCheck = inputRow2.add("checkbox {size: [60, 15], text: '\u00A0Date:'}");
    dateCheck.onClick = function() {
        if(dateCheck.value) {
            dateEditText.enabled = true;
        
        } else {
            dateEditText.enabled = false;
        }
    }

    dateEditText = inputRow2.add("edittext {size: [155, 27], enabled: false}");
    dateEditText.text = today;
    
    // Buttons
    var buttonGroup = myWindow.add("group {alignment: 'right'}");
    buttonGroup.add ("button", undefined, "OK");
    buttonGroup.add ("button", undefined, "Cancel");


    function getTodaysDate() {
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
        var timeStamp = new Date();
    
        return monthNames[timeStamp.getMonth()] + " " + timeStamp.getDate() + ", " + timeStamp.getFullYear();
    }
}


function main() {
    // var badFilesList = [];
    

        var myDocument = app.activeDocument;
        var codeInfoLayer = myDocument.layers.item("Code and info");

        // Log files that have missing "Code and info" layer
        // and continue to next file in the loop
        // (Better than breaking and losing progress)
        if(!codeInfoLayer.isValid) {
            MISSINGLAYER = true;
            // BADFILESLIST.push(myDocument.name.split(".")[0]);
            // myDocument.close();
            
        } else {
            codeInfoLayer.locked = false;
            codeInfoLayer.move(LocationOptions.BEFORE, myDocument.layers[0]);
            
            var codeInfoFrames = codeInfoLayer.textFrames;
    
            if(batchReviewCheck.value && dateCheck.value) {
                for(var i = 0; i < codeInfoFrames.length; i++) {
                    updateBatchReview();
                    updateDate();
                }
            } else if(batchReviewCheck.value) {
                for(var i = 0; i < codeInfoFrames.length; i++) {
                    updateBatchReview();
                }
            } else if(dateCheck.value) {
                for(var i = 0; i < codeInfoFrames.length; i++) {
                    updateDate();
                }
            }
    
            //Re-lock Code and info layer
            myDocument.layers.item("Code and info").locked = true;

        }
        

    
    
    // if(missingLayer) {
    //     // alert('"Code and info" layer missing from files\r See slugUpdateLog.txt on Desktop.');
    //     writeLogFile(BADFILESLIST);
        
    // }


    function updateBatchReview(){
        if(codeInfoFrames[i].label === "batchReviewInput") {
            codeInfoFrames[i].contents = "Batch " + batchEditText.text + " - " + "Review " + reviewEditText.text;
        }
    }

    function updateDate(){
        if(codeInfoFrames[i].label === "dateInput") {
            codeInfoFrames[i].contents = dateEditText.text;
        }
    }

    // function writeLogFile(filesList){
    //     var logFile = new File("~/Desktop/slugUpdateLog.txt");
    //     logFile.encoding = "UTF-8";
        
    //     logFile.open("w");
    //     logFile.write(filesList.join("\n"));
    //     logFile.close();
    // }
}