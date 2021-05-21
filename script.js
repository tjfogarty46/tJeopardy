var scoreMod = 0;
var scoreIndex = -1;
var scoreBtns;
var selectedFile;
var fileInput;
var categories = [];
var dailyDoubles = [];

//TODO implement daily doubles

window.onload = function(){
    //alert("this is a test lmfao");

    scoreBtns = Array.from(document.getElementsByClassName("scoreBtn"));
    setScoreBtnsFunction();


    //"right buttons for correct answers"
    document.getElementById("rightCont1").onclick = function(){
        modScore(1, false);
    }

    document.getElementById("rightCont2").onclick = function(){
        modScore(2, false);
    }

    document.getElementById("rightCont3").onclick = function(){
        modScore(3, false);
    }

    //"wrong buttons for incorrect answers"
    document.getElementById("wrongCont1").onclick = function(){
        modScore(1, true);
    }

    document.getElementById("wrongCont2").onclick = function(){
        modScore(2, true);
    }

    document.getElementById("wrongCont3").onclick = function(){
        modScore(3, true);
    }

    //"wrong buttons for incorrect answers"
    document.getElementById("editCont1").onclick = function(){
        editScore(1);
    }

    document.getElementById("editCont2").onclick = function(){
        editScore(2);
    }

    document.getElementById("editCont3").onclick = function(){
        editScore(3);
    }


    fileInput = document.getElementById("fileUpload");
    fileInput.addEventListener("change", handleFiles);

    document.getElementById("fjreveal").onclick = function(){
        fjRev();
    }
}

//contestant 1's buttons

var editBtn1 = document.getElementById("editCont2");
var rightBtn1 = document.getElementById("rightCont2");
var wrongBtn1 = document.getElementById("wrongCont2");

//contestant 2's buttons

var editBtn2 = document.getElementById("editCont2");
var rightBtn2 = document.getElementById("rightCont2");
var wrongBtn2 = document.getElementById("wrongCont2");

//contestant 3's buttons

var editBtn3 = document.getElementById("editCont3");
var rightBtn3 = document.getElementById("rightCont3");
var wrongBtn3 = document.getElementById("wrongCont3");

scoreBtns = document.getElementsByClassName("scoreBtn");


async function loadFileBtnFunction(){
    var url = document.getElementById("fileUrl").value;
    console.log(url);
    var fileJson = getJsonFromUrl(url);
    console.log(fileJson);
}

function setScoreBtnsFunction(){
    let i;
    for(i=0; i<scoreBtns.length; i++){
        console.log(i);
        scoreBtnFcnSetter(scoreBtns[i]);
    }
}

function scoreBtnFcnSetter(scoreBtn){
    scoreBtn.onclick = function(){
        //price point     - console.log(scoreBtn.value);
        // index          - console.log(scoreBtns.indexOf(scoreBtn));
        var price = scoreBtn.value;
        var index = scoreBtns.indexOf(scoreBtn);
        console.log(price)
        console.log(index)
        if(dailyDoubles.indexOf(index)>-1){
            scoreMod = prompt("Daily Double! how much would you like to wager?", "0");
        }
        else{
            scoreMod = price;
        }
        scoreIndex = index;

        //scoreBtn.style.opacity = 0;

    }
}

//index is player in question
function modScore(index, isWrong){ 
    if(isWrong){
        scoreMod *= -1;
    }
    
    if(scoreIndex!=-1){
        modifyScore(index, scoreMod);
        scoreBtns[scoreIndex].style.opacity = 0;
        scoreMod = 0;
        scoreIndex = -1;
    }
}

function modifyScore(index, mod){
    var scorePara;
    if(index === 1){
        scorePara = document.getElementById("score1");
    }
    if(index === 2){
        scorePara = document.getElementById("score2");
    }
    if(index === 3){
        scorePara = document.getElementById("score3");
    }

    var playerScore = parseInt(scorePara.innerHTML);

    scorePara.innerHTML = playerScore + parseInt(mod);
}

function editScore(index){
    var scorePara;
    if(index === 1){
        scorePara = document.getElementById("score1");
    }
    if(index === 2){
        scorePara = document.getElementById("score2");
    }
    if(index === 3){
        scorePara = document.getElementById("score3");
    }

    var newScore = prompt("what is the new score of the player (no $, don't hit cancel!)", scorePara.innerHTML);
    scorePara.innerHTML = newScore;
}

async function getJsonFromUrl(fileUrl){
    const Http = new XMLHttpRequest();
    Http.open("GET", fileUrl);
    Http.send();
    Http.onreadystatechange=(e)=>{
        console.log(Http.responseText);
    }
}

async function handleFiles(){
    selectedFile=[...fileInput.files][0];
    console.log(selectedFile);
    var text = await selectedFile.text();
    //var catsArr = text.split("category_name\">");
    //console.log(catsArr);
    genCatsArray(text);
    popCats();
    getDD(text);
}

function genCatsArray(txt){
    var catsArr = txt.split("category_name\">");
    var n;
    for(n=1; n<catsArr.length;n++){
        categories.push(catsArr[n].split("</td>")[0]);
    }
    console.log(categories);
}
function popCats(){
    document.getElementById("cat1").innerHTML=categories[0];
    document.getElementById("cat2").innerHTML=categories[1];
    document.getElementById("cat3").innerHTML=categories[2];
    document.getElementById("cat4").innerHTML=categories[3];
    document.getElementById("cat5").innerHTML=categories[4];
    document.getElementById("cat6").innerHTML=categories[5];
    document.getElementById("cat7").innerHTML=categories[6];
    document.getElementById("cat8").innerHTML=categories[7];
    document.getElementById("cat9").innerHTML=categories[8];
    document.getElementById("cat10").innerHTML=categories[9];
    document.getElementById("cat11").innerHTML=categories[10];
    document.getElementById("cat12").innerHTML=categories[11];
}

function getDD(txt){
    var cluesArr = txt.split("clue_header");
    //console.log(cluesArr);
    console.log(cluesArr.length);
    var n;
    //console.log(cluesArr[1])
    //for(n=1;n<cluesArr.length;n++)
    if(cluesArr.length<61){
        getEmptyClues(cluesArr);
    }
}

function getEmptyClues(cluesArr){
    var n;
    for(n=1; n<cluesArr.length;n++){
        var clue_id = cluesArr[n].split("<td id=\"clue_")[1].split("_stuck")[0];
        console.log(clue_id);
        var indx = getBtnIndex(clue_id);
        console.log(indx);
        scoreBtns[indx].style.opacity=100;
        if(cluesArr[n].indexOf("daily_double")>0){
            dailyDoubles.push(indx);
        }
    }
    console.log(dailyDoubles.length)
    console.log(dailyDoubles);
}

function getBtnIndex(clue_id){
    var rndColRow = clue_id.split("_");
    //console.log(rndColRow);
    var toReturn = 0;
    if(rndColRow[0] == "DJ"){
        toReturn+=30;
    }
    toReturn += (parseInt(rndColRow[2])-1)*6 + parseInt(rndColRow[1])-1;
    return toReturn;
}

function fjRev(){
    if(categories.length > 12){
        document.getElementById("fjcat").innerText=categories[12];
        document.getElementById("fjreveal").style.opacity = 0;
    }
}