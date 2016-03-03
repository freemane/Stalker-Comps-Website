

/*
As opposed to createTable, this function incorporates DataTables functionality
to finalize the creation of the table. It adds the ability to select and
delete any number of rows where each row represents a cookie.
Allows for shift clicking to select multiple rows at once
*/

//TODO - Modularize the shiftClick and show functionality into different functions
function initializeDataTable(tableName, lengthOption) {
    if(tableName === "cookieTableWebapp") {
      cookieTable = $('#' + tableName).DataTable();
    }
    else {
      cookieTable = $('#' + tableName).DataTable({
        paging: false,
        scrollY:        "300px",
        scrollCollapse: true
      });
    }

    $('#'+tableName).css({"overflow":"scroll !important","height":"450px !important"});

    // allows a single row to be selected
    $('#' + tableName + ' tbody').on('click', 'tr', function(e) {
        if(e.target.childNodes.length > 0) {
            if(e.target.firstChild.nodeType == 3) {
                var rows = $('#'+tableName+' > tbody > tr');
                // If the shift key is down on the click event...
                if(e.shiftKey) {
                    shiftClickSelect($(this),rows);
                }
                // Otherwise...
                else {
                    regularSelect($(this),rows,cookieTable,tableName);
                }
            }
        }
    });

    // button removes selected rows
    $('#buttonRemoveRow').click(function() {

        // convert html into an array. adapted from http://stackoverflow.com/a/9579792
        var selectedCookies = [];
        cookieTable.$('tr.selected').each(function() {
            var arrayOfThisRow = [];
            var tableData = $(this).find('td');
            if (tableData.length > 0) {
                tableData.each(function() {
                    arrayOfThisRow.push($(this).text());
                });
                selectedCookies.push(arrayOfThisRow);
            }
            // removes all selected rows from table
            cookieTable.row('tr.selected').remove().draw(false);
        });

        $(cookieTable.$('tr.selected')).remove();
        removeSelectedCookies(selectedCookies);
    });
    $('#' + tableName).dataTable();

    return cookieTable;
}

function openWebapp() {
    var newURL = '/webapp.html';
    chrome.tabs.create({
        url: newURL
    });
};

/*
Matches LI items in the list to the corresponding div with the same ID
*/
openWebapp();
initializeTabs();
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
        //default opens graph
        selectedId= 'graph';
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
            if (window.firstRun && id == 'graph') {
                document.getElementById("reset").click();
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
