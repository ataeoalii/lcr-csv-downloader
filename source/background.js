chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.downloads.download({
            url: request.url // The object URL can be used as download URL
        //...
        });
        sendResponse({url: request.url, successCode: "downloaded"});
});