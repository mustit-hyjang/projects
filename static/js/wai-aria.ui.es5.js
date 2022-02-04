"use strict";

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

docReady(function () {
	waiAriaTab();
	waiAriaBtns();
	waiAriaBtnPress();
	waiAriaBtnExpand();
	waiAriaCheckBox();
	waiAriaRadioBox();
	waiAriaListBox();
	waiAriaSlider();
	waiAriaHasPopupMenu();
	waiAriaMenuBar();
	waiAriaFormInvalid();
});

// document ready 
function docReady(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

function getClosestParent(el, query) {
	while (el.querySelector(query)) {
		el = el.parentNode
		if (!el) {
			return null
		}
	}
	return el
}

//expanded event
function expandedEvent(btn) {
	if (btn.expandEvent) {
		return false;
	}
	btn.expandEvent = true;

	btn.addEventListener("click", function () {
		var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
		if (!expandEl) return;

		if (btn.getAttribute("aria-expanded") === 'true') {
			expandedClose(btn, expandEl);
		} else {
			expandedOpen(btn, expandEl);
		}
	});
	btn.addEventListener("keydown", function (e) {
		if (e.keyCode === 32 || e.keyCode === 13) {
			// space, enter
			btn.click();
			e.preventDefault();
		}
	});
}

function expandedOpen(btn, expandEl) {
	btn.setAttribute("aria-expanded", true);
	if (expandEl) expandEl.style.display = "block";
}

function expandedClose(btn, expandEl) {
	btn.setAttribute("aria-expanded", false);
	if (expandEl) expandEl.style.display = "none";
}

// wai-aria tab ui
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

//wai-aria button
var waiAriaBtns = function waiAriaBtns() {
	var btns = document.querySelectorAll('[role="button"]');
	btns.forEach(function (btn) {
		btn.addEventListener("keydown", function (e) {
			if (e.keyCode === 32 || e.keyCode === 13) {
				btn.click();
				e.preventDefault();
			}
		});
	});
};

//wai-aria toggle button
var waiAriaBtnPress = function waiAriaBtnPress() {
	var pressButtons = document.querySelectorAll('[role="button"][aria-pressed], button[aria-pressed]');
	pressButtons.forEach(function (pressButton) {
		pressButton.addEventListener("click", function () {
			if (pressButton.getAttribute("aria-pressed") === 'true') {
				pressButton.setAttribute("aria-pressed", false);
			} else {
				pressButton.setAttribute("aria-pressed", true);
			}
		});

		pressButton.addEventListener("keydown", function (e) {
			if (e.keyCode === 32 || e.keyCode === 13) {
				// space, enter
				pressButton.click();
				e.preventDefault();
			}
		});
	});
};

//wai-aria expand button
var waiAriaBtnExpand = function waiAriaBtnExpand() {
	var expandButtons = document.querySelectorAll('[role="button"][aria-expanded], button[aria-expanded]');
	expandButtons.forEach(function (expandButton) {
		expandedEvent(expandButton);
	});
};

//wai-aria checkbox
var waiAriaCheckBox = function waiAriaCheckBox() {
	var checkBoxes = document.querySelectorAll('[role="checkbox"]');

	checkBoxes.forEach(function (checkBox) {
		checkBox.tabIndex = 0;

		//disabled -1 
		if (checkBox.getAttribute('aria-disabled') === 'true') {
			checkBox.tabIndex = -1;
			checkBox.setAttribute('aria-checked', false)
		}

		checkBox.addEventListener("click", function () {
			checkBoxEvent(checkBox);
		});


		checkBox.addEventListener("keydown", function (e) {
			if (e.keyCode === 32) {
				// space, enter
				checkBox.click();
				e.preventDefault();
			}
		});
	});

	function checkBoxEvent(target) {
		
		if (target.hasAttribute("aria-controls")) {
			var restBoxes = target.getAttribute("aria-controls").split(" ");
			var checkedBoxes = 0;
			var allChecked = false;
			
			for (var i = 0; i < restBoxes.length; i++) {
				var singleBox = document.getElementById(restBoxes[i]);
				checkedBoxes = singleBox.getAttribute("aria-checked") == "true" ? checkedBoxes = checkedBoxes + 1 : checkedBoxes;
				allChecked = checkedBoxes == restBoxes.length ? "true" : "false";	
			}
			if (allChecked === 'true') {
				for (var _i = 0; _i < restBoxes.length; _i++) {
					var _singleBox = document.getElementById(restBoxes[_i]);
					_singleBox.setAttribute("aria-checked", false);
				}
				target.setAttribute("aria-checked", false);
			} else {
				for (var _i2 = 0; _i2 < restBoxes.length; _i2++) {
					var _singleBox2 = document.getElementById(restBoxes[_i2]);
					_singleBox2.setAttribute("aria-checked", true);
				}
				target.setAttribute("aria-checked", true);
			}
		} else {
			if (target.getAttribute("aria-checked") === 'true') {
				target.setAttribute("aria-checked", false);
			} else {
				target.setAttribute("aria-checked", true);
			}
			if (target.getAttribute('aria-disabled') === 'true') {
				target.setAttribute('aria-checked', false)
			}
		}

	}
};

//wai-aria radiobox
var waiAriaRadioBox = function waiAriaRadioBox() {
	var radioGroups = document.querySelectorAll('[role="radiogroup"]');

	radioGroups.forEach(function (radioGroup) {
		var radioBox = radioGroup.querySelectorAll('[role="radio"]');
		var firstRadio = radioBox[0];
		var lastRadio = radioBox[radioBox.length - 1];
		var hasChecked = false;

		var _loop = function _loop(i) {
			if (radioBox[i].getAttribute("aria-checked") == "true") {
				radioBox[i].tabIndex = 0;
				hasChecked = true;
			} else {
				radioBox[i].tabIndex = -1;
			}

			radioBox[i].addEventListener("click", function (e) {
				var target = e.currentTarget;
				radioBox.forEach(function (radio) {
					if (radio !== target) {
						radio.setAttribute("aria-checked", false);
						radio.tabIndex = -1;
					}
				});
				target.setAttribute("aria-checked", true);
				target.tabIndex = 0;
			});

			radioBox[i].addEventListener("keydown", function (e) {
				var target = e.currentTarget;
				if (e.keyCode === 37 || e.keyCode === 38) {
					// previous : left,up
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;

					if (target == firstRadio) {
						lastRadio.setAttribute("aria-checked", true);
						lastRadio.tabIndex = 0;
						lastRadio.focus();
					} else {
						radioBox[i - 1].setAttribute("aria-checked", true);
						radioBox[i - 1].tabIndex = 0;
						radioBox[i - 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 39 || e.keyCode === 40) {
					// next : right,down
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if (target == lastRadio) {
						firstRadio.setAttribute("aria-checked", true);
						firstRadio.tabIndex = 0;
						firstRadio.focus();
					} else {
						radioBox[i + 1].setAttribute("aria-checked", true);
						radioBox[i + 1].tabIndex = 0;
						radioBox[i + 1].focus();
					}
					e.preventDefault();
				}

				if (e.keyCode === 13 || e.keyCode === 32) {
					// select: enter, space
					if (target.getAttribute("aria-checked") !== 'true') {
						target.setAttribute("aria-checked", true);
					}
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < radioBox.length; i++) {
			_loop(i);
		}
		if (!hasChecked) radioBox[0].tabIndex = 0;
	});
};

//wai-aria listbox
var waiAriaListBox = function waiAriaListBox() {
	var boxBtns = document.querySelectorAll('[aria-haspopup="listbox"]');
	boxBtns.forEach(function (boxBtn) {
		expandedEvent(boxBtn);
		var listBox = document.querySelector('#' + boxBtn.getAttribute("aria-controls"));
		var listOptions = listBox.querySelectorAll('[role="option"]');

		boxBtn.addEventListener("click", function (e) {
			const listSelected = listBox.querySelector('[role="option"][aria-selected="true"]');
			if (listSelected) {
				listSelected.focus();
			} else {
				listOptions[0].focus();
			}
		});

		boxBtn.addEventListener("keydown", function (e) {
			if (e.keyCode === 38) {
				// up
				boxBtn.click();
				const listSelected = listBox.querySelector('[role="option"][aria-selected="true"]');
				if (listSelected) {
					listSelected.focus();
				} else {
					listOptions[listOptions.length - 1].focus();
				}
				e.preventDefault();
			}
			if (e.keyCode === 40) {
				// down
				boxBtn.click();
				e.preventDefault();
			}
		});

		var _loop = function _loop(i) {
			listOptions[i].tabIndex = -1;
			listOptions[i].addEventListener("click", function (e) {
				listSelectEvent(listBox, boxBtn, listOptions[i]);
				boxBtn.click();
				boxBtn.focus();
				e.preventDefault();
			});

			listOptions[i].addEventListener("keydown", function (e) {
				if (e.keyCode === 13) {
					// enter
					listOptions[i].click();
					e.preventDefault();
					e.stopPropagation();
				}
				if (e.keyCode === 38) {
					// up
					if (i == 0) {
						listOptions[listOptions.length - 1].focus();
						listSelectEvent(listBox, boxBtn, listOptions[listOptions.length - 1]);
					} else {
						listOptions[i - 1].focus();
						listSelectEvent(listBox, boxBtn, listOptions[i - 1]);
					}
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (i == listOptions.length - 1) {
						listOptions[0].focus();
						listSelectEvent(listBox, boxBtn, listOptions[0]);
					} else {
						listOptions[i + 1].focus();
						listSelectEvent(listBox, boxBtn, listOptions[i + 1]);
					}
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) {
					// tab, esc
					boxBtn.click();
					boxBtn.focus();
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < listOptions.length; i++) {
			_loop(i);
		}
	});


	function listSelectEvent(listBox, boxBtn, listOption) {
		const selected = listBox.querySelector('[role="option"][aria-selected="true"]');
		const currentTxt = boxBtn.innerText;
		const newTxt = listOption.innerText;
		if (!selected) {
			listOption.setAttribute("aria-selected", true);
			boxBtn.innerHTML = boxBtn.innerHTML.replace(currentTxt, newTxt);
		}
		if (selected !== listOption) {
			selected.setAttribute("aria-selected", false);
			listOption.setAttribute("aria-selected", true);
			boxBtn.innerHTML = boxBtn.innerHTML.replace(currentTxt, newTxt);
		}
	}
};

//wai-aria slider
var waiAriaSlider = function waiAriaSlider() {
	var sliders = document.querySelectorAll('[role="slider"]');

	sliders.forEach(function (slider) {

		var maxVal = slider.getAttribute("aria-valuemax") ? slider.getAttribute("aria-valuemax") : 100;
		var sliderWrap = slider.parentNode;
		var slideTo = slider.getAttribute("aria-orientation") ? slider.getAttribute("aria-orientation") : null;

		if (window.getComputedStyle(sliderWrap).getPropertyValue('position') !== "relative") sliderWrap.style.position = "relative";
		sliders.tabIndex = 0;

		sliderWrap.addEventListener("drag", function (e) {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e, true);
		});

		sliderWrap.addEventListener("dragend", function (e) {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e);
		});

		sliderWrap.addEventListener("mouseup", function (e) {
			sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e);
		});

		slider.addEventListener("keydown", function (e) {
			if (e.keyCode === 37 || e.keyCode === 40) {
				// minus : left,up
				sliderKeyEvent(slideTo, slider, maxVal, false);
				e.preventDefault();
			}
			if (e.keyCode === 39 || e.keyCode === 38) {
				// add : right,down
				sliderKeyEvent(slideTo, slider, maxVal, true);
				e.preventDefault();
			}
		});
	});

	function sliderMouseEvent(slideTo, slider, sliderWrap, maxVal, e, mouseMove) {
		var sliderWidth = slideTo && slideTo == "vertical" ? slider.offsetHeight : slider.offsetWidth;
		var wrapWidth = slideTo && slideTo == "vertical" ? sliderWrap.offsetHeight : sliderWrap.offsetWidth;
		var wrapPos = slideTo && slideTo == "vertical" ? sliderWrap.getBoundingClientRect().top : sliderWrap.getBoundingClientRect().left;
		var mousePos = slideTo && slideTo == "vertical" ? e.pageY : e.pageX;
		var leftPos = mousePos - wrapPos < 0 ? 0 : mousePos - wrapPos > wrapWidth ? wrapWidth : mousePos - wrapPos;
		var nowVal = Math.round(leftPos * (maxVal / wrapWidth));
		if (mouseMove) {
			if (e.which == 1) {
				if (slideTo && slideTo == "vertical") {
					slider.style.top = leftPos + "px";
					slider.style.marginTop = -(sliderWidth / 2) + "px";
				} else {
					slider.style.left = leftPos + "px";
					slider.style.marginLeft = -(sliderWidth / 2) + "px";
				}
				slider.setAttribute("aria-valuenow", nowVal);
			}
		} else {
			if (slideTo && slideTo == "vertical") {
				slider.style.top = Math.round(nowVal / maxVal * 100) + "%";
				slider.style.marginTop = -(sliderWidth / 2) + "px";
			} else {
				slider.style.left = Math.round(nowVal / maxVal * 100) + "%";
				slider.style.marginLeft = -(sliderWidth / 2) + "px";
			}
			slider.setAttribute("aria-valuenow", nowVal);
		}
	}

	function sliderKeyEvent(slideTo, slider, maxVal, addition) {
		var nowVal = parseInt(slider.getAttribute("aria-valuenow")) ? Number(slider.getAttribute("aria-valuenow")) : 0;
		var changePos = 0;
		if (addition) {
			changePos = nowVal + 1 > maxVal ? maxVal : nowVal + 1;
		} else {
			changePos = Number(nowVal) - 1 < 0 ? 0 : nowVal - 1;
		}
		var stylePos = maxVal < changePos ? 100 : Math.round(changePos / maxVal * 100);
		var sliderWidth = slideTo && slideTo == "vertical" ? slider.offsetHeight : slider.offsetWidth;
		if (slideTo && slideTo == "vertical") {
			slider.style.top = stylePos + "%";
			slider.style.marginTop = -(sliderWidth / 2) + "px";
		} else {
			slider.style.left = stylePos + "%";
			slider.style.marginLeft = -(sliderWidth / 2) + "px";
		}
		slider.setAttribute("aria-valuenow", changePos);
	}
};


//wai aria menubar
var waiAriaMenuBar = function waiAriaMenuBar() {
	var menuBars = document.querySelectorAll('[role="menubar"]');
	menuBars.forEach(function (menuBar) {

		var menuItems = menuBar.querySelectorAll('[role="menuitem"]')
		if (menuItems.length < 1) return;
		var menus = [];
		for (var i = 0; i < menuItems.length; i++) {
			menus.push(menuItems[i]);
		}

		var hasSubs = menuBar.querySelectorAll('[aria-haspopup="true"]');
		var subPops = [];
		for (var i = 0; i < hasSubs.length; i++) {
			subPops.push(menuBar.querySelector('#' + hasSubs[i].getAttribute("aria-controls")));
		}

		var _loop = function _loop(_i) {
			menus = menus.filter(function (menu) {
				return !subPops[_i].contains(menu);
			});
		};

		for (var _i = 0; _i < subPops.length; _i++) {
			_loop(_i);
		}

		var _loop2 = function _loop2(_i2) {
			menus[_i2].addEventListener("keydown", function (e) {
				if (e.keyCode === 39) {
					// right
					if (menus[_i2] == menus[menus.length - 1]) {
						menus[0].focus();
					} else {
						menus[_i2 + 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 37) {
					// left
					if (menus[_i2] == menus[0]) {
						menus[menus.length - 1].focus();
					} else {
						menus[_i2 - 1].focus();
					}
					e.preventDefault();
				}
			});
		};

		for (var _i2 = 0; _i2 < menus.length; _i2++) {
			_loop2(_i2);
		}
	});
};

//wai-aria  menu haspopup
var waiAriaHasPopupMenu = function waiAriaHasPopupMenu() {
	var haspops = document.querySelectorAll('[aria-haspopup="true"]');
	var mainBtn = false;
	haspops.forEach(function (haspop, index) {

		var popup = document.querySelector('#' + haspop.getAttribute("aria-controls"));
		var isSub = !getClosestParent(haspop, '[role="menu"]') ? false : true;
		if (!popup) return;

		var menuItems = popup.querySelectorAll('[role="menuitem"]')
		if (menuItems.length < 1) return;

		expandedEvent(haspop);

		var menus = [];
		for (var i = 0; i < menuItems.length; i++) {
			menus.push(menuItems[i]);
		}

		var subPops = popup.querySelectorAll('[aria-haspopup="true"]');
		var hasSubs = [];
		for (var i = 0; i < subPops.length; i++) {
			hasSubs.push(subPops[i]);
		}

		var subPops = [];
		for (var i = 0; i < hasSubs.length; i++) {
			subPops.push(popup.querySelector('#' + hasSubs[i].getAttribute("aria-controls")));
		}

		var _loop = function _loop(_i) {
			menus = menus.filter(function (menu) {
				return !subPops[_i].contains(menu);
			});
		};

		for (var _i = 0; _i < subPops.length; _i++) {
			_loop(_i);
		}

		var _loop2 = function _loop2(_i2) {
			menus[_i2].isSub = true;
			menus[_i2].addEventListener("keydown", function (e) {
				if (e.keyCode === 38) {
					// up
					if (menus[_i2] == menus[0]) {
						menus[menus.length - 1].focus();
					} else {
						menus[_i2 - 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (menus[_i2] == menus[menus.length - 1]) {
						menus[0].focus();
					} else {
						menus[_i2 + 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 37) {
					// left
					haspop.click();
					haspop.focus();
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) {
					// tab
					if (mainBtn) {
						mainBtn.click();
						mainBtn.focus();
						e.preventDefault();
					}
				}
			});
		};

		for (var _i2 = 0; _i2 < menus.length; _i2++) {
			_loop2(_i2);
		}

		haspop.addEventListener("click", function (e) {
			if (!haspop.isSub) {
				mainBtn = haspop;
			}
			menus[0].focus();
			e.preventDefault();
			if (popup.style.display == "none") {
				hasSubs.forEach(function (hasSub) {
					var subpop = popup.querySelector('#' + hasSub.getAttribute("aria-controls"));
					if (!subpop) return;
					hasSub.setAttribute("aria-expanded", false);
					subpop.style.display = "none";
				});
				//haspop.focus();
			} else {}
		});

		haspop.addEventListener("keydown", function (e) {
			if (haspop.isSub) {
				if (e.keyCode === 39) {
					// right
					haspop.click();
					e.preventDefault();
				}
			} else {
				if (e.keyCode === 38) {
					// up
					haspop.click();
					menus[menus.length - 1].focus();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					haspop.click();
					e.preventDefault();
				}
			}
		});

		haspop.addEventListener("keypress", function (e) {
			if (e.keyCode === 32) {
				// space
				haspop.click();
				event.preventDefault();
			}
		});
	});
};

// wai aria menu haspopup
var waiAriaHasPopup = function waiAriaHasPopup() {
	var haspops = document.querySelectorAll('[aria-haspopup="true"]');
	var depth = 0;
	var mainBtn = new Object();
	haspops.forEach(function (haspop) {

		var menubar = getClosestParent(haspop, '[role="menubar"]')

		var popup = document.querySelector('#' + haspop.getAttribute("aria-controls"));
		if (!popup) return;
		var menus = popup.querySelectorAll('[role="menuitem"]');
		if (!menus) return;
		haspop.addEventListener("click", function (e) {
			if (menubar) {
				var menulists = menubar.querySelectorAll('[aria-haspopup="true"]');
				menulists.forEach(function (menulist) {
					if (haspop !== menulist) {
						menulist.setAttribute("aria-expanded", false);
						document.querySelector('#' + menulist.getAttribute("aria-controls")).style.display = "none";
					}
				});
			}

			var subpopups = [];
			menus.forEach(function (menu) {
				if (menu.getAttribute("aria-haspopup") && menu.getAttribute("aria-controls")) {
					subpopups.push(document.querySelector('#' + menu.getAttribute("aria-controls")));
					menu.setAttribute("aria-expanded", false);
				}
			});
			if (haspop.getAttribute("aria-expanded") == "true") {
				if (depth < 1) {
					mainBtn = haspop;
				}
				depth = depth + 1;
				menus[0].focus();
			}
			if (haspop.getAttribute("aria-expanded") == "false") {
				depth = depth - 1;
			}
			if (subpopups.length > 0) {
				subpopups.forEach(function (subpopup) {
					subpopup.style.display = "none";
				});
			}
			e.preventDefault();
		});

		haspop.addEventListener("keydown", function (e) {
			if (depth == 0 && e.keyCode === 38) {
				// up
				haspop.click();
				e.preventDefault();
			}
			if (depth == 0 && e.keyCode === 40) {
				// down
				haspop.click();
				menus[menus.length - 1].focus();
				e.preventDefault();
			}
			if (depth == 0 && e.keyCode === 32) {
				// space
				haspop.click();
				e.preventDefault();
			}
			if (menubar) {
				var menulists = menubar.querySelectorAll('[aria-haspopup="true"]');
				if (menulists.length > 1 && e.keyCode === 37) {
					//left menubar
					var menuIndex = 0;
					for (var i = 0; i < menulists.length; i++) {
						if (menulists[i] == haspop) {
							menuIndex = i;
						}
					}
					if (menuIndex == 0) menulists[menulists.length - 1].focus();
					else menulists[menuIndex - 1].focus();
				}
				if (menulists.length > 1 && e.keyCode === 39) {
					//right menubar
					var _menuIndex = 0;
					for (var _i3 = 0; _i3 < menulists.length; _i3++) {
						if (menulists[_i3] == haspop) {
							_menuIndex = _i3;
						}
					}
					if (_menuIndex == menulists.length - 1) menulists[0].focus();
					else menulists[_menuIndex + 1].focus();
				}
			}
		});

		var _loop2 = function _loop2(i) {
			menus[i].tabIndex = -1;
			menus[i].addEventListener("keydown", function (e) {
				if (e.keyCode === 38) {
					// up
					if (menus[i] == menus[0]) {
						menus[menus.length - 1].focus();
					} else {
						menus[i - 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (menus[i] == menus[menus.length - 1]) {
						menus[0].focus();
					} else {
						menus[i + 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 39) {
					// right
					if (menus[i].getAttribute("aria-haspopup") === 'true') {
						menus[i].click();
					}
				}
				if (e.keyCode === 37) {
					// left
					if (depth > 1) {
						haspop.focus();
						haspop.click();
						e.preventDefault();
					}
				}
				if (e.keyCode === 27) {
					// esc
					mainBtn.focus();
					mainBtn.click();
					depth = 0;
					e.preventDefault();
				}

				if (e.keyCode === 9) {
					// tab
					mainBtn.click();
					depth = 0;
				}

				if (e.keyCode === 32) {
					// space
					menus[i].click();
					e.preventDefault();
				}

				if (e.keyCode === 36) {
					// home
					menus[0].focus();
					e.preventDefault();
				}
				if (e.keyCode === 35) {
					// end
					menus[menus.length - 1].focus();
					e.preventDefault();
				}

				e.stopPropagation();
			});
		};

		for (var i = 0; i < menus.length; i++) {
			_loop2(i);
		}
	});
};

var waiAriaFormInvalid = function waiAriaFormInvalid() {
	var forms = document.querySelectorAll('[aria-invalid]');
	if (forms.length < 1) return;
	forms.forEach(function (form) {
		var alert = document.querySelector('#' + form.getAttribute("aria-describedby"));
		if (alert instanceof HTMLElement) {
			form.addEventListener("change", function () {
				if (form.getAttribute("aria-invalid") == "false") {
					alert.style.display = "none";
				} else {
					alert.style.display = "block";
				}
			});
		}
	});
};

var waiAriaCurrent = function waiAriaCurrent() {
	var menus = document.querySelectorAll('[role="menuitem"][aria-current]');

	menus.forEach(function (menu) {
		var menuGroup = getClosestParent(menu, '[role="menu"]');
		var menulists = menuGroup.querySelectorAll('[role="menuitem"]');

		menu.addEventListener("click", function (e) {
			for (var i = 0; i < menulists.length; i++) {
				if (menulists[i].getAttribute("aria-current") == "true") {
					menulists[i].setAttribute("aria-current", false);
				}
			}
			menu.setAttribute("aria-current", true);
		});

		menu.addEventListener("keydown", function (e) {
			if (e.keyCode === 13 || e.keyCode === 32) {
				// enter, space
				menu.click();
				e.preventDefault();
			}
			if (menulists.length > 1 && e.keyCode === 37) {
				// left
				var menuIndex = 0;
				for (var i = 0; i < menulists.length; i++) {
					if (menulists[i] == menu) {
						menuIndex = i;
					}
				}
				if (menuIndex == 0) menulists[menulists.length - 1].focus();
				else menulists[menuIndex - 1].focus();
			}
			if (menulists.length > 1 && e.keyCode === 39) {
				//right menubar
				var _menuIndex2 = 0;
				for (var _i4 = 0; _i4 < menulists.length; _i4++) {
					if (menulists[_i4] == menu) {
						_menuIndex2 = _i4;
					}
				}
				if (_menuIndex2 == menulists.length - 1) menulists[0].focus();
				else menulists[_menuIndex2 + 1].focus();
			}
		});
	});
};




function openModalLayer(layerID, origin) {
	var $this = $(layerID),
		focusable = [];
	$this.find('*').each(function (i, val) {
		if (val.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) && parseInt(val.getAttribute("tabIndex")) !== -1) {
			focusable.push(val);
		}
		if ((val.getAttribute("tabIndex") !== null) && (parseInt(val.getAttribute("tabIndex")) >= 0) && (val.getAttribute("tabIndex", 2) !== 32768)) {
			focusable.push(val);
		}
	});

	var el_firstFocus = focusable[0],
		el_lastFocus = focusable[focusable.length - 1];

	$(document).on({
		'keydown': function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 27) {
				$this.find('.close').click();
				$(document).off('keydown');
			}
		}
	})

	$(el_firstFocus).on({
		'keydown': function (e) {
			if (e.target == this) {
				var keyCode = e.keyCode || e.which;
				if (keyCode == 9) {
					if (e.shiftKey) {
						$(el_lastFocus).focus();
						e.preventDefault();
					}
				}
			}
		}
	});

	$(el_lastFocus).on({
		'keydown': function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == 9) {
				if (!e.shiftKey) {
					$(el_firstFocus).focus();
					e.preventDefault();
				}
			}
		}
	});
}


	
//MODAL 
let btns_modal = document.querySelectorAll('.open-modal');
btns_modal.forEach(function (target) {

    target.addEventListener('click', (e) => {
        let btnOpenModal = e.target;

        let modalID = btnOpenModal.getAttribute('aria-controls');
        let modalIDChar = document.getElementById(modalID);
        let modalClose = modalIDChar.getElementsByClassName('modal-close')[0];
        let tabAble = modalIDChar.querySelectorAll('button:not([tabindex="-1"], input:not([tabindex="-1"], textarea:not([tabindex="-1"]');
        let tabAbleFirst = tabAble && tabAble[0];
        let tabAbleLast = tabAble && tabAble[tabAble.length - 1];
        let tabDisable;

        //IOS 스크롤현상 수정 
        // var iosScrollFixPosition = window.pageYOffset;
        // document.body.offsetTop(iosScrollFixPosition); 

        //OPEN
        modalIDChar.setAttribute('aria-hidden', 'false');
        modalIDChar.classList.add('on');

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
                        console.log('esc');
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













