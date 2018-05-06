var sign = 1;

function openORclose() {
    if (sign%2 == 1){
        sign++;
        document.getElementById("dialog").style.height="8%";
        document.getElementById("dialog").style.backgroundColor="rgba(0,0,0, .6)";
        document.getElementById("opencloseButton").innerText="↑";
        document.getElementById("guideText").style.display="block";
        var clientHeight = document.getElementById('dialog').clientHeight;
        document.getElementById("guideText").style.lineHeight=clientHeight + "px";
    } else {
        sign++;
        document.getElementById("dialog").style.height="";
        document.getElementById("dialog").style.backgroundColor="rgba(225,225,225, .8)";
        document.getElementById("opencloseButton").innerText="↓";
        document.getElementById("guideText").style.display="none";
    }
}