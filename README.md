# web monitor

a chrome extension

using XPath/JsonPath

## example

监控网站变化, 并发送通知到pocket

```json
[
    {
        "id": "coolshell",
        "cron": "* */12 * * *",
        "method": "GET",
        "url": "https://coolshell.cn",
        "responseType": "document",
        "valuePath": "/html[1]/body[1]/div[1]/div[2]/div[1]/div[1]/div[1]/main[1]/article[1]/header[1]/h2[1]/a[1]",
        "nodeAttribute": null,
        "webhook": {
            "url": "https://getpocket.com/v3/add",
            "body": {
                "url": "https://coolshell.cn",
                "tags": "monitor,酷壳",
                "consumer_key": "********",
                "access_token": "********"
            }
        }
    },
    {
        "id": "shaoshupai",
        "cron": "* */12 * * *",
        "method": "GET",
        "url": "https://sspai.com/api/v1/article/tag/page/get?limit=10&offset=0&tag=%E5%BA%94%E7%94%A8%E6%8E%A8%E8%8D%90",
        "responseType": "json",
        "valuePath": "$.data[*].id",
        "nodeAttribute": null,
        "webhook": {
            "url": "https://getpocket.com/v3/add",
            "body": {
                "url": "https://sspai.com",
                "tags": "monitor,少数派",
                "consumer_key": "********",
                "access_token": "********"
            }
        }
    }
]
```
