document.getElementById('config-save').addEventListener('click', () => {
    let configContent = document.getElementById('config-content').value;
    let configItemList = JSON.parse(configContent);
    let configObj = {config: configItemList};
    chrome.storage.sync.set(configObj, function () {
        document.getElementById('status').textContent = '成功';
        console.log("saved new config: " + JSON.stringify(configObj));
        chrome.runtime.reload();
    });
});