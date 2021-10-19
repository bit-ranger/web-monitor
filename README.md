# web monitor

using XPath/JsonPath

configuration example
```json
[
    {
        "id": "zhihu-hot",
        "cron": "/1 * * * *",
        "method": "GET",
        "url": "https://www.zhihu.com/hot",
        "responseType": "document",
        "valuePath": "//div[@class='HotItem-content']//h2[@class='HotItem-title']",
        "nodeAttribute": null
    },
    {
        "id": "zhihu-huaxiabeilai",
        "cron": "/1 * * * *",
        "method": "GET",
        "url": "https://www.zhihu.com/api/v4/columns/dsliu/items",
        "responseType": "json",
        "valuePath": "$.data[*].title"
    }
]
```
