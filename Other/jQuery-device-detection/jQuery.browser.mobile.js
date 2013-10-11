// JavaScript Document

function isMobile() {
	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/Blackberry/i) || navigator.userAgent.match(/Nokia/i) || navigator.userAgent.match(/Windows Phone/i)) {
		return true;
	}
	else {
		return false;
	}
}