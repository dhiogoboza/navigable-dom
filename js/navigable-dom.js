let allFocusableElements = [];
let currentFocus = undefined;
let container;
let content;

function selectItem(newFocus, e) {
    if (currentFocus != undefined) {
        allFocusableElements[currentFocus].el.classList.remove("navigable-dom-selected");
    }

    if (newFocus != undefined) {
        let element = allFocusableElements[newFocus].el;
        element.classList.add("navigable-dom-selected");

        const y = element.getBoundingClientRect().top + window.scrollY;
        window.scroll({
          top: y,
          behavior: 'smooth'
        });

        currentFocus = newFocus;
    }
    
    if (e != undefined) {
        e.preventDefault();
    }
}

function onKeyPressed(e) {
    if (!e) {
        e = window.event;
    }

    (e.keyCode) ? key = e.keyCode : key = e.which;
    try {
        if (currentFocus == undefined) {
            return;
        }
        
        switch (key) {
            case 37: // left  
                break;
            case 39: // right  
                break;
            case 38: // up
                if (currentFocus > 0) {
                    selectItem(allFocusableElements[currentFocus].focusUp, e);
                }
                break;
            case 40: //down
                if (currentFocus < allFocusableElements.length - 1) {
                    selectItem(allFocusableElements[currentFocus].focusDown, e);
                }
                break;
            case 13: //enter
                allFocusableElements[currentFocus].el.click();
                break;
            default:
                return;
        }
    } catch(Exception) {}
}

function findFocusableElements() {
    let focusableElements = document.querySelectorAll("a");
    for (let i = 0; i < focusableElements.length; i++) {
        allFocusableElements.push({el: focusableElements[i]});
    }

    if (allFocusableElements.length < 2) {
        return;
    }

    for (let i = 0; i < allFocusableElements.length; i++) {
        let nextFocusDown = i;
        let currentItem = allFocusableElements[i].el;
        let first = true;

        for (let j = 0; j < allFocusableElements.length; j++) {
            if (j === i) {
                skipped = true;
                continue;
            }
            if (allFocusableElements[j].el.offsetTop > currentItem.offsetTop) {
                if (allFocusableElements[j].el.offsetTop < allFocusableElements[nextFocusDown].el.offsetTop || first) {
                    nextFocusDown = j;
                    first = false;
                }
            }
        }

        if (nextFocusDown !== i) {
            allFocusableElements[i].focusDown = nextFocusDown;
        }
    }

    // set focusUp and href property    
    for (let i = 0; i < allFocusableElements.length; i++) {
        if (allFocusableElements[i].focusDown != undefined) {
            allFocusableElements[allFocusableElements[i].focusDown].focusUp = i;
        }

        let href = allFocusableElements[i].el.getAttribute("href");
        console.log("antes: " + href);
        if (!href.startsWith("http:") && !href.startsWith("https:")) {
            // relative path
            let url = getParam("url");
            let sep = href[0] === "/" || url[url.length - 1] === "/" ? "" : "/";
            href = window.location.protocol  + "//" + window.location.host + "/navigate?url=" + url + sep + href;
            allFocusableElements[i].el.href = href;
        }
    }
}

function getParam(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

document.addEventListener("DOMContentLoaded", function() {
    container = document.getElementById("container");
    content = document.getElementById("navigatable-dom-content");
    document.onkeydown = onKeyPressed;
    findFocusableElements();
    if (allFocusableElements.length > 0) {
        selectItem(0);
    }
});

