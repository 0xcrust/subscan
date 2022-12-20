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
                }
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


/*
/// EVENT LISTENER FOR BUTTON
scanButton.addEventListener("click", function() {
    let inputField = document.getElementById("query-input");
    let domain = inputField.value;

    let url = `api/v1/scan/${domain}`;
    let call = apiCall(domain, url, "GET");
    call.send();
    document.getElementById("query-input").value = null;
})*/


function renderResults(query, results) {
    const body = document.querySelector('body');

    console.log("started rendering results")
    const mainContent = document.createElement('div');
    mainContent.setAttribute("id", "main-content");
    body.appendChild(mainContent);

    const heading = document.createElement('h3');
    heading.setAttribute("id", "show-results-heading");
    mainContent.appendChild(heading);
    heading.innerHTML = `Showing results for ${query}`;

    const resultsContainer = document.createElement('div');
    resultsContainer.setAttribute("id", "results-container");
    mainContent.appendChild(resultsContainer);

    console.log("Starting outer loop");
    console.log("results.length: ", results.length);
    console.log("results[0]: ", results[0]);
    console.log("results[1]: ", results[1]);
    console.log("results[2]: ", results[2]);
    console.log("results[3]: ", results[3]);

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
            console.log("Container being displayed: ", container);
            this.parentElement.nextElementSibling.classList.toggle("show-ports");
            console.log("container.classList: ", container.classList);
        });

        let portsContainer = document.createElement('div');
        portsContainer.classList.add("ports-container");
        newResult.appendChild(portsContainer);
        
        let openPorts = result["open_ports"];
        console.log("openPorts: ", openPorts);

        console.log("Starting inner loop");

        for(i = 0; i < openPorts.length; ++i) {
            console.log("Inner loop ", i);
            console.log("Handling: ", openPorts[i]);
            let port = document.createElement('div');
            port.classList.add("port");

            let portNumber = openPorts[i]["port"];
            console.log("portNumber: ", portNumber);
            let portNumberDiv = document.createElement('div');
            portNumberDiv.classList.add("port-number");
            portNumberDiv.innerText = portNumber;

            let openStatus = openPorts[i]["conn_open"];
            console.log("openStatus: ", openStatus);
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

    console.log("Outer loop completed");
    console.log("rendering done; document: ", document.documentElement);
}

scanButton.addEventListener("click", function() {
    console.log("scan results: ", scanResults["subdomains"]);
    console.log("Before render results");
    renderResults("kerkour.com", scanResults["subdomains"]);
    console.log("Results rendered?");
})


function apiCall(query, url, method) {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
        if (this.readyState === this.DONE) {
            console.log("subdomains: ", JSON.parse(this.responseText)["subdomains"]);

            console.log("before render results");
            renderResults(query, JSON.parse(this.responseText));
            console.log("results rendered?")
        }
    });
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('user-token', 'token');
    return xhr;
}


// Todo: write code to export contents into a csv file.
// Todo: make it work for blockchain domains?