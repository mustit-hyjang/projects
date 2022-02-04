"use strict";

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		return this.substr(position || 0, searchString.length) === searchString;
	};
}

var NuliComplete = function NuliComplete(obj) {

	var input = document.getElementById(obj);
	if (input.tagName && input.tagName.toLowerCase() !== "input") {
		console.error("Nuli autocomplete cannot be used! Element should be a single HTML input object");
		return false;
	}
	var listBox = document.getElementById(input.getAttribute("aria-owns"));
	if (!listBox) {
		console.error("Nuli autocomplete cannot be used! Keywords should be placed option role with aria-owns destined");
		return false;
	}
	var listOptions = listBox.querySelectorAll('[role="option"]');
	if (!listOptions) {
		console.error("Nuli autocomplete cannot be used! Keywords should be placed option role with aria-owns destined");
		return false;
	}
	var type = input.getAttribute("auto-complete") ? input.getAttribute("auto-complete") : "both";
	var completed = "";

	listOptions.forEach(function (listOption) {
		listOption.addEventListener("click", function (e) {
			input.value = listOption.textContent;
			input.setAttribute("aria-expanded", false);
			listBox.style.display = "none";
		});
	});

	input.addEventListener("keydown", function (e) {
		if (e.keyCode == "9" && type !== "inline") {
			// tab
			input.value = "";
			input.setAttribute("aria-expanded", false);
			listBox.style.display = "none";
		}
	});
	
	var matchLists = [];
	var currentVal = input.value;
	input.addEventListener("keyup", function (e) {
		if(!(e.keyCode == 38 || e.keyCode == 40)) {
			currentVal = input.value;
			matchLists = [];
			if (currentVal.length > 0) {
				for (var i = 0; i < listOptions.length; i++) {
					if (listOptions[i].textContent.startsWith(currentVal)) {
						listOptions[i].style.display = "block";
						listOptions[i].removeAttribute("hidden");
						matchLists.push(listOptions[i]);
					} else {
						listOptions[i].style.display = "none";
						listOptions[i].setAttribute("hidden", true);
						listOptions[i].setAttribute("aria-selected", false);
					}
				}
			}
		}
		if (type !== "list") {
			// inline, both
			inlineComplete(e, input, matchLists, currentVal);
		}

		if (type !== "inline") {
			// list, both
			if (matchLists.length > 0) {
				input.setAttribute("aria-expanded", true);
				listBox.style.display = "block";
				if (e.keyCode == "38") {
					// up
					for (var _i = 0; _i < matchLists.length; _i++) {
						if (matchLists[_i].getAttribute("aria-selected") == "true") {
							matchLists[_i].setAttribute("aria-selected", false);
							if (matchLists[_i] === matchLists[0]) {
								matchLists[matchLists.length - 1].setAttribute("aria-selected", true);
							} else {
								matchLists[_i - 1].setAttribute("aria-selected", true);
							}
							break;
						}
					}

					if (type !== "list") {
						input.value = listBox.querySelector('[role="option"][aria-selected="true"]').textContent;
						input.selectionStart = currentVal.length;
						input.selectionEnd = listBox.querySelector('[role="option"][aria-selected="true"]').textContent.length;
						completed = listBox.querySelector('[role="option"][aria-selected="true"]').textContent;
					}
					e.preventDefault();
				} else if (e.keyCode == "40") {
					// down
					for (var _i2 = 0; _i2 < matchLists.length; _i2++) {
						if (matchLists[_i2].getAttribute("aria-selected") == "true") {
							matchLists[_i2].setAttribute("aria-selected", false);
							if (matchLists[_i2] === matchLists[matchLists.length - 1]) {
								matchLists[0].setAttribute("aria-selected", true);
							} else {
								matchLists[_i2 + 1].setAttribute("aria-selected", true);
							}
							break;
						}
					}
					if (type !== "list") {
						input.value = listBox.querySelector('[role="option"][aria-selected="true"]').textContent;
						input.selectionStart = currentVal.length;
						input.selectionEnd = listBox.querySelector('[role="option"][aria-selected="true"]').textContent.length;
						completed = listBox.querySelector('[role="option"][aria-selected="true"]').textContent;
					}

					e.preventDefault();
				} else if (e.keyCode == "13") {
					// enter
					input.value = listBox.querySelector('[role="option"][aria-selected="true"]').textContent;
					input.setAttribute("aria-expanded", false);
					listBox.style.display = "none";
				} else {
					for (var _i3 = 0; _i3 < matchLists.length; _i3++) {
						matchLists[_i3].setAttribute("aria-selected", false);
					}
					matchLists[0].setAttribute("aria-selected", true);
				}

				if (e.keyCode == "27") {
					// esc
					input.value = "";
					input.setAttribute("aria-expanded", false);
					listBox.style.display = "none";
				}
			} else {
				input.setAttribute("aria-expanded", false);
				listBox.style.display = "none";
			}
		}
	});

	function inlineComplete(e, input, matchLists, currentVal) {
		if (e.keyCode >= "65" && e.keyCode <= "90") {
			// a~z
			if (matchLists.length > 0) {
				input.value = matchLists[0].textContent;
				input.selectionStart = currentVal.length;
				input.selectionEnd = matchLists[0].textContent.length;
				completed = matchLists[0].textContent;
			}
		} else if (e.keyCode == "39" && completed.length > 0) {
			// right
			input.value = completed;
		} else {
			completed = "";
		}
		if (e.keyCode == "27") {
			// esc
			input.value = "";
		}
	}
};