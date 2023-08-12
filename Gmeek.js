
document.getElementById("themeSwitch").setAttribute("d",value=IconList["sun"]);
if(localStorage.getItem("meek_theme")==null){localStorage.setItem("meek_theme","light")}
else if(localStorage.getItem("meek_theme")=="dark"){changeDark();}
else if(localStorage.getItem("meek_theme")=="light"){changeLight();}

var utterancesLoad=0
if(localStorage.getItem("meek_theme")==null){localStorage.setItem("meek_theme","light")}
else if(localStorage.getItem("meek_theme")=="dark"){changeDark();}
else if(localStorage.getItem("meek_theme")=="light"){changeLight();}

function changeDark(){
    document.getElementsByTagName("html")[0].attributes.getNamedItem("data-color-mode").value="dark";
    document.getElementById("themeSwitch").attributes.getNamedItem("d").value=IconList["moon"];
    if(utterancesLoad==1){utterancesTheme("dark-blue");}
}
function changeLight(){
    document.getElementsByTagName("html")[0].attributes.getNamedItem("data-color-mode").value="light";
    document.getElementById("themeSwitch").attributes.getNamedItem("d").value=IconList["sun"];
    if(utterancesLoad==1){utterancesTheme("github-light");}
}
function modeSwitch(){
    if(document.getElementsByTagName("html")[0].attributes[0].value=="light"){changeDark();localStorage.setItem("meek_theme","dark");}
    else{changeLight();localStorage.setItem("meek_theme","light");}
}
function utterancesTheme(theme){
    const message = {type: 'set-theme',theme: theme};
    const iframe = document.getElementsByClassName('utterances-frame')[0];
    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
}

iconTOP=document.getElementsByClassName("svgTop1");
iconPost=document.getElementsByClassName("svgTop0");
for(var i=0;i<iconTOP.length;i++){
    iconTOP[i].setAttribute("d",IconList["upload"]);
    iconTOP[i].parentNode.style.color="red";
}
for(var i=0;i<iconPost.length;i++){
    iconPost[i].setAttribute("d",IconList["post"]);
}

function openComments(){
    cm=document.getElementById("comments");
    cmButton=document.getElementById("cmButton");
    cmButton.innerHTML="loading";
    span=document.createElement("span");
    span.setAttribute("class","AnimatedEllipsis");
    cmButton.appendChild(span);

    script=document.createElement("script");
    script.setAttribute("src","https://utteranc.es/client.js");
    script.setAttribute("repo",cmButton.value);
    script.setAttribute("issue-term","title");
    if(localStorage.getItem("meek_theme")=="dark"){script.setAttribute("theme","dark-blue");}
    else{script.setAttribute("theme","github-light");}
    script.setAttribute("crossorigin","anonymous");
    script.setAttribute("async","");
    cm.appendChild(script);

    int=self.setInterval("iFrameLoading()",200);
}

function iFrameLoading(){
    var utterances=document.getElementsByClassName('utterances');
    if(utterances.length==1){
        if(utterances[0].style.height!=""){
            utterancesLoad=1;
            int=window.clearInterval(int);
            document.getElementById("cmButton").style.display="none";
            console.log("utterances Load OK");
        }
    }
}
