var count = 0;
var NTries = 0;
var workingTabId = -1000;  // ramdom tab ID
var done = false;

chrome.tabs.onUpdated.addListener(function(tabId , info) {
  // TODO: timeout request will not be 'complete', thus causing stallling
  if (workingTabId == tabId && info.status == "complete" && NTries != 0) {
    if (count < NTries) {
      chrome.tabs.reload(workingTabId, null, null);
      count++;
    }
    else if (!done) {
      alert("Search string NOT found after " + count + " tries! Giving up :(");
      done = true;
      count = 0;
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.foundStr == "yes") {
    alert("Search string found after " + (count+1) + " tries! Stopping refresh!");
    count = NTries;
    done = true;
  }
  if (request.NTries && request.tabId) {
    NTries = request.NTries;
    workingTabId = request.tabId;
    count = 0;
    done = false;
  }
});
