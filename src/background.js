var sha1 = require('sha1');
var jp = require('jsonpath');
const schedule = require('node-schedule');


chrome.storage.sync.get("config", (configObj) => {
    console.log(new Date().toLocaleString(), "config loaded: " + JSON.stringify(configObj));
    let configItemList = configObj["config"];
    if (!configItemList) {
        return;
    }
    configItemList.forEach(monitor);

    function monitor(item) {
        schedule.scheduleJob(item.cron, () => {

            const monitor_id = item.id;
            const method = item.method;
            const url = item.url;
            const responseType = item.responseType;
            const valuePath = item.valuePath;
            const nodeAttribute = item["nodeAttribute"];
            const webhookUrl = item.webhook.url;
            const webhookBody = item.webhook.body;

            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.responseType = responseType;
            xhr.addEventListener('loadend', function (e) {
                if (xhr.status < 200 || xhr.status >= 300){
                    return;
                }
                let valueList = [];
                if (responseType === "document") {
                    let responseXML = xhr.responseXML
                    const nodeList = responseXML.evaluate(valuePath, responseXML, null, XPathResult.ANY_TYPE, null);
                    let head = nodeList.iterateNext();
                    while (head) {
                        let part = null;
                        if (nodeAttribute) {
                            part = head.getAttribute(nodeAttribute);
                        } else {
                            part = head.textContent;
                        }
                        valueList.push(part);
                        head = nodeList.iterateNext();
                    }
                } else if (responseType === "json") {
                    let responseJson = xhr.response;
                    valueList = jp.query(responseJson, valuePath);
                }

                const hash = sha1(valueList.join(""));

                const monitor_id_gen = "monitor#" + monitor_id;
                chrome.storage.sync.get(monitor_id_gen, (saved) => {
                    console.log(new Date().toLocaleString(), monitor_id_gen + " loaded data: " + JSON.stringify(saved));
                    saved = saved[monitor_id_gen];
                    if (saved != null && saved["hash"] != null && saved.hash === hash) {
                        console.log(new Date().toLocaleString(), monitor_id_gen + " matched exist hash: " + hash);
                    } else {
                        const hook = new XMLHttpRequest();
                        hook.open("POST", webhookUrl, true);
                        hook.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        hook.send(JSON.stringify(webhookBody));

                        var saved = {};
                        saved[monitor_id_gen] = {hash: hash};
                        chrome.storage.sync.set(saved, function () {
                            console.log(new Date().toLocaleString(), monitor_id_gen + " saved new hash: " + hash + ", " + valueList);
                        });

                    }
                });
            });
            xhr.send();
        });
    }
});




