// retrieve data from custom reports tables
async function getData() {
    var pageTitleCollection = document.getElementsByClassName('pageTitle ng-scope span10');
    var pageTitle = pageTitleCollection[0].innerText;
    var tableCollection = document.getElementsByClassName("custom-reports-table");

    while (tableCollection.length < 1) {
        console.log("Loading table...");
        await new Promise(r => setTimeout(r, 5000));

        tableCollection = document.getElementsByClassName("custom-reports-table");
    }

    var hasUnitGrouping = tableCollection[0].parentNode.attributes['members'].value === 'unitGroup.members';

    const tableArray = Array.from(tableCollection);
    return tableArray.map( (table) => {
        var thead = table.children[0].innerText;
        var tbody = table.children[1].innerText;

        var content = (thead + tbody).replaceAll('\t',',');

        if (hasUnitGrouping) {
            var header = table.parentNode.parentNode.querySelector('h3').innerText;
            return { name: pageTitle + header, content: content };
        } else {
            return { name: pageTitle, content: content };
        }
    });
}

function saveCsvFiles(data) {
    for (const idx in data) {
        var blob = new Blob([data[idx]['content']], {type: "text/csv"});
        var url = URL.createObjectURL(blob);
        chrome.runtime.sendMessage({
            url: url
        }, function(response) {
            console.log(response);
        });
    }
}

async function createButton(func) {
    var newButton = document.createElement("button");
    newButton.class = "btn btn-default custom-reports-save-button";
    newButton.style = 'border-width: 1px;';
    newButton.innerText = "Save as CSV";
    newButton.onclick = async () => {
        func(await getData());
    }

    var controlCollection = document.getElementsByClassName('control-group pull-right');

    while (controlCollection.length < 1) {
        console.log("Loading button...");
        await new Promise(r => setTimeout(r, 2000));
        controlCollection = document.getElementsByClassName('control-group pull-right');
    }

    var label = document.createElement("span");
    label.innerHTML = "LCR CSV Downloader";
    label.style = 'padding: 5px;';

    var containerDiv = document.createElement("div");
    containerDiv.style = 'border-width: 1px; border: solid; align-items: center; padding: 5px; margin: 10px; display: flex; flex-direction: column; max-width: 200px;';
    containerDiv.appendChild(label);
    containerDiv.appendChild(newButton);

    controlCollection[0].appendChild(containerDiv);
}

const init = async function() {
    console.log("Initialized...");
    createButton(saveCsvFiles);
};

init();
