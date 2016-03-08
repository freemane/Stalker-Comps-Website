// global variables for displaying tabs
var tabLinks = new Array();
var contentDivs = new Array();

showTab();

function initializeTabs() {
    // Grab the tab links and content divs from the page
    window.firstRun = true;
    var tabListItems = document.getElementById('tabs').childNodes;
    for (var i = 0; i < tabListItems.length; i++) {
        if (tabListItems[i].nodeName == 'LI') {
            var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
            var id = getHash(tabLink.getAttribute('href'));
            tabLinks[id] = tabLink;
            contentDivs[id] = document.getElementById(id);
        }
    }

    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
    var selectedId = getHash(window.location.href);
    if (selectedId==='undefined' || selectedId.length<1) {
        //default opens about
        selectedId= 'about';
    }
    for (var id in tabLinks) {
        tabLinks[id].onclick = showTab;
        tabLinks[id].onfocus = function () {
            this.blur()
        };
        if (id == selectedId) {
            tabLinks[id].className = 'selected';
        } else {
            contentDivs[id].className = 'tabContent hide';
        }
        i++;
    }
}


/*
Shows the tab most recently clicked on
*/
function showTab() {
    var selectedId = getHash(this.getAttribute('href'));

    // Highlight the selected tab, and dim all others.
    // Also show the selected content div, and hide all others.
    for (var id in contentDivs) {
        if (id == selectedId) {
            tabLinks[id].className = 'selected';
            contentDivs[id].className = 'tabContent';
            if (window.firstRun && id == 'about') {
                window.firstRun = false;
            }
        } else {
            tabLinks[id].className = '';
            contentDivs[id].className = 'tabContent hide';
        }
    }

    // Stop the browser following the link
    return false;
}


function getFirstChildWithTagName(element, tagName) {
    for (var i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeName == tagName) return element.childNodes[i];
    }
}

function getHash(url) {
    var hashPos = url.lastIndexOf('#');
    if (hashPos<0) {
        return "";
    }
    return url.substring(hashPos + 1);
}

function shortDomain(dom) {
        var split = dom.split('.');
        var finalString;
        if (split.length < 3) {
            return dom;
        }
        finalString = split[split.length-2].concat('.');
        return finalString.concat(split[split.length-1]);
};
