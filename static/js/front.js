let vh; //viewport height 
//Browser
let browser = (function (agent) {
	switch (true) {
		case agent.indexOf("edge") > -1:
			return "edge";
		case agent.indexOf("edg") > -1:
			return "chromium based edge (dev or canary)";
		case agent.indexOf("chrome") > -1 && !!window.chrome:
			return "chrome";
		case agent.indexOf("trident") > -1:
			return "ie";
		case agent.indexOf("firefox") > -1:
			return "firefox";
		case agent.indexOf("safari") > -1:
			return "safari";
		default:
			return "other";
	}
})(window.navigator.userAgent.toLowerCase());
const el = document.querySelector('body');
if (browser === 'chrome') el.classList.add('chrome');
else if (browser === 'edge') el.classList.add('edge');
else if (browser === 'edg') el.classList.add('edg-chrome');
else if (browser === 'trident') el.classList.add('ie');
else if (browser === 'firefox') el.classList.add('firefox');
else if (browser === 'safari') el.classList.add('safari');
else el.classList.add('other');


//Change Theme
function changeMode() {
	let btn_mode = document.querySelector('.btn-change-theme');
	let status = false ; 
	btn_mode.addEventListener('click', () =>{
		status = btn_mode.getAttribute('aria-pressed'); 
		document.body.classList.toggle('darkmode'); 
	});

	btn_mode.addEventListener('keydown', (e) =>{
	if (e.keyCode === 32 || e.keyCode === 13) {
		// space, enter
		btn_mode.click();
		e.preventDefault();
	}
	})

}



jQuery.exists = function (selector) {
	return ($(selector).length > 0);
}

window.addEventListener('load', () => {
	vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('resize', () => {
	vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
});
window.addEventListener('scroll', (e) => {
	yOffset = window.pageYOffset;

});