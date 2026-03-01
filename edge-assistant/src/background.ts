// background.ts handles secure fetch requests to the local AMD Edge API

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "simplify") {
        fetch("http://localhost:8000/simplify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text })
        })
            .then(res => res.json())
            .then(data => {
                try {
                    sendResponse(data);
                } catch (e) {
                    console.warn("Could not send response:", e);
                }
            })
            .catch(err => {
                try {
                    sendResponse({ error: err.toString() });
                } catch (e) {
                    console.warn("Could not send error response:", e);
                }
            });

        // Return true to indicate we wish to send a response asynchronously
        return true
    }
})
