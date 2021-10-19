var sha1 = require('sha1');
var jp = require('jsonpath');

var configList = [
    {
        id: "zhihu-hot",
        interval: 10000,
        method: "GET",
        url: "https://www.zhihu.com/hot",
        responseType: "document",
        valuePath: "//div[@class='HotItem-content']//h2[@class='HotItem-title']",
        nodeAttribute: null
    },
    {
        id: "zhihu-huaxiabeilai",
        interval: 10000,
        method: "GET",
        url: "https://www.zhihu.com/api/v4/columns/dsliu/items",
        responseType: "json",
        valuePath: "$.data[*].title",
    }
]

configList.forEach(monitor);


function monitor(config) {
    setInterval(() => {

        const monitor_id = config.id;
        const method = config.method;
        const url = config.url;
        const responseType = config.responseType;
        const valuePath = config.valuePath;
        const nodeAttribute = config["nodeAttribute"];

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = responseType;
        xhr.addEventListener('loadend', function (e) {
            let valueList = [];
            if (responseType === "document") {
                let responseXML = xhr.responseXML
                const nodeList = responseXML.evaluate(valuePath, responseXML, null, XPathResult.ANY_TYPE, null);
                let head = nodeList.iterateNext();
                while (head) {
                    let part = null;
                    if (nodeAttribute) {
                        part = head.getAttribute(nodeAttribute)
                    } else {
                        part = head.textContent
                    }
                    valueList.push(part)
                    head = nodeList.iterateNext();
                }
            } else if (responseType === "json") {
                let responseJson = xhr.response;
                valueList = jp.query(responseJson, valuePath);
            }

            const hash = sha1(valueList.join(""));

            const monitor_id_gen = "monitor#" + monitor_id;
            chrome.storage.sync.get(monitor_id_gen, (saved) => {
                console.log(monitor_id_gen + " loaded data: " + JSON.stringify(saved));
                saved = saved[monitor_id_gen];
                if (saved != null && saved["hash"] != null && saved.hash === hash) {
                    console.log(monitor_id_gen + " matched exist hash: " + hash);
                } else {
                    var saved = {};
                    saved[monitor_id_gen] = {hash: hash}
                    chrome.storage.sync.set(saved, function () {
                        console.log(monitor_id_gen + " saved new hash: " + hash + ", " + valueList);
                    });

                }
            });
        });
        xhr.send();
    }, config.interval)
}

