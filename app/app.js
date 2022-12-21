const scanResults = {
    "subdomains":[
        {
            "domain_name":"social.kerkour.com",
            "open_ports":[
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":22,
                    "conn_open":true
                },
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":22,
                    "conn_open":true
                },
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":22,
                    "conn_open":true
                },
            ]
        },
        {
            "domain_name":"academy.kerkour.com",
            "open_ports":[
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":8443,
                    "conn_open":true
                },
                {
                    "port":8080,
                    "conn_open":true
                }
            ]
        },
        {
            "domain_name":"kerkour.com",
            "open_ports":[
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":8443,
                    "conn_open":true
                },
                {
                    "port":8080,
                    "conn_open":true
                }
            ]
        },
        {
            "domain_name":"www.kerkour.com",
            "open_ports":[
                {
                    "port":80,
                    "conn_open":true
                },
                {
                    "port":8443,
                    "conn_open":true
                },
                {
                    "port":443,
                    "conn_open":true
                },
                {
                    "port":8080,
                    "conn_open":true
                }
            ]
        }
    ]
};

const scanButton = document.getElementById('scan-button');

/// EVENT LISTENER FOR BUTTON

/*
scanButton.addEventListener("click", function() {
    console.log("Scan begun!");

    let inputField = document.getElementById("query-input");
    let domain = inputField.value;

    const resultsSection = document.getElementById('results-section');

    // Create a header to display a 'scanning' message
    const heading = document.createElement('h3');
    heading.setAttribute('id', 'fetch-results-heading');
    resultsSection.appendChild(heading);
    heading.innerText = `Scanning ${domain}`;

    let url = `api/v1/scan/${domain}`;
    let call = apiCall(domain, url, "GET");
    call.send();
    document.getElementById("query-input").value = null;
});*/


function renderResults(query, results) {
    console.log("started rendering results");
    const resultsSection = document.getElementById('results-section');

    const previousHeading = document.getElementById('fetch-results-heading');
    if (previousHeading) previousHeading.remove();

    const heading = document.createElement('h3');
    heading.setAttribute('id', 'show-results-heading');
    resultsSection.appendChild(heading);
    heading.innerText = `Showing results for ${query}`;

    const resultsContainer = document.createElement('div');
    resultsContainer.setAttribute("id", "results-container");
    resultsSection.appendChild(resultsContainer);

    const exportButton = document.createElement('button');
    exportButton.setAttribute('id', 'export-results');
    exportButton.innerHTML = '<span>Export Results</span><span class="fa-solid fa-download"></span>'
    resultsContainer.appendChild(exportButton);

    for(const result of results) {
        console.log("scanning ", result["domain_name"]);
        let newResult = document.createElement('div');
        newResult.classList.add("result");
        resultsContainer.appendChild(newResult);

        let subdomainRow = document.createElement('div');
        subdomainRow.classList.add("subdomain-row");
        newResult.appendChild(subdomainRow);

        let subdomain = document.createElement('div');
        subdomain.classList.add("subdomain");
        subdomainRow.appendChild(subdomain);
        subdomain.innerText = `${result["domain_name"]}`;

        let showButton = document.createElement('button');
        showButton.classList.add("show-ports-btn");
        subdomainRow.appendChild(showButton);
        showButton.innerText = `Ports`;

        showButton.addEventListener("click", function() {
            console.log("show button clicked!");
            let container = this.parentElement.nextElementSibling;
            this.parentElement.nextElementSibling.classList.toggle("show-ports");
        });

        let portsContainer = document.createElement('div');
        portsContainer.classList.add("ports-container");
        newResult.appendChild(portsContainer);
        
        let openPorts = result["open_ports"];
        console.log("openPorts: ", openPorts);

        for(i = 0; i < openPorts.length; ++i) {
            console.log("Handling: ", openPorts[i]);
            let port = document.createElement('div');
            port.classList.add("port");

            let portNumber = openPorts[i]["port"];
            let portNumberDiv = document.createElement('div');
            portNumberDiv.classList.add("port-number");
            portNumberDiv.innerText = portNumber;

            let openStatus = openPorts[i]["conn_open"];
            let openStatusDiv = document.createElement('div');
            openStatusDiv.classList.add("open-status");
            if(openStatus === true) {
                openStatusDiv.innerHTML = `<i class="fa-solid fa-circle open-port"></i>`;
            } else {
                openStatusDiv.innerHTML = `<i class="fa-solid fa-circle closed-port"></i>`;
            }        

            port.appendChild(portNumberDiv);
            port.appendChild(openStatusDiv);

            portsContainer.appendChild(port);
        }
    }
    console.log("rendering done; document: ", document.documentElement);
}

scanButton.addEventListener("click", function() {
    console.log("scan results: ", scanResults["subdomains"]);
    console.log("Before render results");
    renderResults("kerkour.com", scanResults["subdomains"]);
    console.log("Results rendered?");
}, {once: true})

function apiCall(query, url, method) {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
        if (this.readyState === this.DONE) {
            console.log("subdomains: ", JSON.parse(this.responseText)["subdomains"]);
            renderResults(query, JSON.parse(this.responseText)["subdomains"]);
        }
    });
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('user-token', 'token');
    return xhr;
}

function jsonToCsv(items) {
    const header = Object.keys(items[0]);
    const headerString = header.join(',');
  
    // handle null or undefined values here
    const replacer = (key, value) => value ?? '';
  
    const rowItems = items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
  
    // join header and body, and break into separate lines
    const csv = [headerString, ...rowItems].join('\r\n');
    return csv;
}

// Todo: write code to export contents into a csv file.
// Todo: make it work for blockchain domains?

// need a refresh button
// need an export button