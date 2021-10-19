# web monitor

using XPath/JsonPath

configuration example

监控知乎热榜, 并发送变更到pocket

```json
[
    [
        {
            "id": "zhihu-hot",
            "cron": "*/1 * * * *",
            "method": "GET",
            "url": "https://www.zhihu.com/hot",
            "responseType": "document",
            "valuePath": "//div[@class='HotItem-content']//h2[@class='HotItem-title']",
            "nodeAttribute": null,
            "webhook": {
                "url": "https://getpocket.com/v3/add",
                "body": {
                    "url": "https://www.zhihu.com/hot",
                    "tags": "monitor,zhihu-hot",
                    "consumer_key": "********",
                    "access_token": "********"
                }
            }
        }
    ]
]
```
