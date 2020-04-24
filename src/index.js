import React from 'react';
import ReactDOM from 'react-dom';
import "bootstrap";
import './index.scss';
import QueryBooks from './QueryBooks';
import * as serviceWorker from './serviceWorker';


// change navBar to opaque when heroBox is scrolled up above its bottom edge
let navBar = document.querySelector("nav");
let heroBox = document.querySelector("#hero-box");
if (navBar && heroBox) {
	document.addEventListener(
		"scroll",
		throttle(() => {
			if (
				heroBox.getBoundingClientRect().top < navBar.getBoundingClientRect().bottom
			) {
				navBar.classList.add("nav-opaque");
			} else {
				navBar.classList.remove("nav-opaque");
			}
		}, 300)
	);
}

function throttle(func, limit) {
	let lastFunc;
	let lastRan;
	return function () {
		const context = this;
		const args = arguments;
		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function () {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}


ReactDOM.render(
  <React.StrictMode>
    <QueryBooks />
  </React.StrictMode>,
  document.getElementById('results-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();