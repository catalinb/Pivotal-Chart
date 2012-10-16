var viewerPort = null;

chrome.browserAction.onClicked.addListener(ButtonClicked);

function ButtonClicked (tab)
{
	chrome.tabs.create({url:"content.html"});
}
