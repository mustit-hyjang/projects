/**

	front.js 
	writer :  sora jeong
	modified history 
	  ㄴ 2022.02.14 adding project list item (json)

*/
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

docReady(function () {
	waiAriaTab();

});
// document ready 
function docReady(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

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
	let status = false;
	btn_mode.addEventListener('click', () => {
		status = btn_mode.getAttribute('aria-pressed');
		document.body.classList.toggle('darkmode');
	});

	btn_mode.addEventListener('keydown', (e) => {
		if (e.keyCode === 32 || e.keyCode === 13) {
			// space, enter
			btn_mode.click();
			e.preventDefault();
		}
	});
}

//CUSTOM SCROLLBAR
$(".modal__inner").mCustomScrollbar({
	theme: "dark-thin",
	axis: "y"
});

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

const projectList = document.querySelector('.main-project-list');
const projectList2 = document.querySelector('.other-project-list');
async function getData() {
	const requestURL = 'https://publy-sora-jeong.github.io/projects/static/js/modalContent.json';
	const request = new Request(requestURL);
	const response = await fetch(request);
	const projectData = await response.json();

	dataLength = Object.keys(projectData).length;
	if(!response.ok) {
		console.log('error');
	} else {
		//$('.loading').hide();
		setTimeout(() => {
			$('.loading').stop().fadeOut(700);
		}, 1500);
	}
	
	
	renderElements(projectData);
}
getData();

async function getData2() {
	const requestURL = 'https://publy-sora-jeong.github.io/projects/static/js/modalContentOther.json';
	const request = new Request(requestURL);
	const response = await fetch(request);
	const projectData2 = await response.json();
	console.log(projectData2);
	renderElements2(projectData2);

}
getData2();

function renderElements(projectData) {
	for (let key in projectData) {
		if (projectData.hasOwnProperty(key)) {

			projectData[key].forEach(element => {
				let temp = element.skill.split(',');
				let test = '';
				for (let i = 0; i < temp.length; i++) {
					test += `<span class="${temp[i]}">${temp[i]}</span>`
				}

				projectList.innerHTML += `<div class="project-list__item" data-item ="${key}">
					<div class="project-list__item__thumb">
						<img src="${element.thumb}" alt="thumb">
						<a href="#" class="open-modal" aria-controls="modal01" data-content="${key}"></a>
					</div>
					<p class="project-list__item__title">${element.title}</p>
					<p class="project-list__item__detail">${element.desc}</p>
					<p class="project-list__item__client">${element.client}</p>
					<p class="project-list__item__contribute">${element.contritube}</p>
					<p class="project-list__item__skills">${test}</p>
				</div>`;

			});
		}
	}
	ariaModal(projectData);
}


function renderElements2(projectData2) {
	//console.log(projectData2);
	for (let key in projectData2) {
		if (projectData2.hasOwnProperty(key)) {
			projectData2[key].forEach(element => {

				projectList2.innerHTML += `<div class="project-list__item" data-item ="${key}">
					<div class="project-list__item__thumb">
						${element.client}
					</div>
					<p class="project-list__item__title">${element.title}</p>
					<p class="project-list__item__detail">${element.desc}</p>
				</div>`;
			});
		}
	}
}


const ariaModal = function ariaModal(projectData) {
	//MODAL 
	let btns_modal = document.querySelectorAll('.open-modal');
	btns_modal.forEach(function (target) {

		target.addEventListener('click', (e) => {
			let btnOpenModal = e.target;
			e.preventDefault();

			let modalID = btnOpenModal.getAttribute('aria-controls');
			let modalIDChar = document.getElementById(modalID);
			let modalClose = modalIDChar.getElementsByClassName('modal-close')[0];
			let tabAble = modalIDChar.querySelectorAll('button:not([tabindex="-1"], input:not([tabindex="-1"], textarea:not([tabindex="-1"]');
			let tabAbleFirst = tabAble && tabAble[0];
			let tabAbleLast = tabAble && tabAble[tabAble.length - 1];
			let tabDisable;
			//let modalContent = modalIDChar.querySelector('.modal__inner');

			//IOS 스크롤현상 수정 
			// var iosScrollFixPosition = window.pageYOffset;
			// document.body.offsetTop(iosScrollFixPosition); 


			//OPEN
			modalIDChar.setAttribute('aria-hidden', 'false');
			modalIDChar.classList.add('on');

			let modalContentID = btnOpenModal.getAttribute('data-content');

			projectData[modalContentID].forEach(element => {
				//console.log(element);
				modalIDChar.querySelector('.modal__inner__title').innerHTML = element.title;
				modalIDChar.querySelector('.modal__inner__desc-txt--client').innerHTML = element.client;
				modalIDChar.querySelector('.modal__inner__desc-txt--link').innerHTML = element.link;
				modalIDChar.querySelector('.modal__inner__description').innerHTML = element.desc;
				modalIDChar.querySelector('.modal__inner__content').innerHTML = `<img src="${element.img}" />`
			});


			if (tabAble) {
				tabAbleFirst.focus();

				tabAble.forEach((idx) => {
					idx.addEventListener('keydown', (event) => {
						if (event.shiftKey && (event.keyCode || event.which) == 9) {
							event.preventDefault();
							tabAbleLast.focus();
						}

						//ESCAPE 닫기
						if ((event.keyCode || event.which) == 27) {
							event.preventDefault();
							closeModal(modalIDChar, btnOpenModal);
						}

						//마지막요소에서 - 첫번째 요소로 포커스 이동 
						if (idx == tabAbleLast) {
							event.preventDefault();
							tabAbleFirst.focus();
						}
					})
				});

				//CLOSE ( SPACE & ENTER)
				modalClose.addEventListener('keydown', (event) => {
					event.preventDefault();
					if ((event.keyCode || event.which) === 13 || (event.keyCode || event.which) == 32) {
						closeModal(modalIDChar, btnOpenModal);
					}
				});
				//닫기버튼 클릭
				modalClose.addEventListener('click', (event) => {
					event.preventDefault();
					closeModal(modalIDChar, btnOpenModal);
				});
			}

			//모달 외부 배경(dimm) 클릭시 닫기
			modalIDChar.addEventListener('click', (e) => {
				if (e.target === e.currentTarget) {
					closeModal(modalIDChar, btnOpenModal);
				}
			})
		});

		//RESIZE (픽셀깨지는 현상 수정)
		window.addEventListener('resize', modalResize);

		function closeModal(modalID, focusOrigin) {
			modalID.setAttribute('tab-index', -1);
			modalID.setAttribute('aria-hidden', 'true');

			modalID.classList.remove('on');
			focusOrigin.focus();
		}

		function modalResize() {
			//~_~;; 
		}
	});
}

var waiAriaTab = function waiAriaTab() {
	var tabs = document.querySelectorAll('[role="tab"]');
	var tabLists = document.querySelectorAll('[role="tablist"]');

	tabs.forEach(function (tab) {
		if (tab.getAttribute("aria-selected") == "true") {
			tab.tabIndex = 0;
		} else {
			tab.tabIndex = -1;
		}

		tab.addEventListener("click", function (e) {
			var parent = tab.parentNode.tagName === "LI" ? tab.parentNode.parentNode : tab.parentNode;
			var panelWrap = document.querySelector('#' + tab.getAttribute("aria-controls")).parentNode;

			parent.querySelectorAll('[aria-selected="true"]').forEach(function (t) {
				t.setAttribute("aria-selected", false);
				t.tabIndex = -1;
			});

			tab.setAttribute("aria-selected", true);
			tab.tabIndex = 0;

			panelWrap.querySelectorAll('[role="tabpanel"]').forEach(function (p) {
				if (document.querySelector('[aria-controls="' + p.id + '"]').getAttribute("aria-selected") !== "true") {
					p.style.display = "none";
				}
			});

			panelWrap.querySelector('#' + tab.getAttribute("aria-controls")).style.display = "block";
			e.preventDefault();
		});
	});

	tabLists.forEach(function (tabList) {
		tabList.addEventListener("keydown", function (e) {
			// const target = e.target;
			var parent = tabList.parentNode.tagName === "LI" ? tabList.parentNode.parentNode : tabList.parentNode;
			var innerTabs = parent.querySelectorAll('[role="tab"]');

			var tabFocus = 0;
			for (let i = 0; i < innerTabs.length; i++) {
				if (innerTabs[i].getAttribute("aria-selected") == "true") {
					tabFocus = i;
				}
			}

			if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 36 || e.keyCode === 35) {
				innerTabs[tabFocus].tabIndex = -1;
				if (e.keyCode === 39) {
					// right
					tabFocus++;
					if (tabFocus >= innerTabs.length) {
						tabFocus = 0;
					}
				} else if (e.keyCode === 37) {
					// left
					tabFocus--;
					if (tabFocus < 0) {
						tabFocus = innerTabs.length - 1;
					}
				} else if (e.keyCode === 36) {
					// home
					tabFocus = 0;
				} else if (e.keyCode === 35) {
					// end
					tabFocus = innerTabs.length - 1;
				}
				innerTabs[tabFocus].tabIndex = 0;
				innerTabs[tabFocus].click();
				innerTabs[tabFocus].focus();
				e.preventDefault();
			}
		});
	});
};


