var interval = 60000;


function pumpUp() {
	$(bt).css("-webkit-transform", "scale(1.1)");
	setTimeout(pumpDown, interval);
}

function pumpDown() {
	$(bt).css("-webkit-transform", "scale(1.0)");
	setTimeout(pumpUp, interval);
}

$(document).ready(function() {
	setTimeout(pumpUp, interval);
});