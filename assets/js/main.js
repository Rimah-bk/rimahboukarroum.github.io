/*
	Rimah Boukarroum — portfolio
	Plain vanilla JS. No framework, no build step. Everything here only
	ever writes `transform`/`opacity` (compositor-friendly) and bails
	early under prefers-reduced-motion or on touch devices where a
	hover-driven effect wouldn't make sense anyway.
*/

(function () {
	'use strict';

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

	// Scroll reveal — fade/slide each [data-reveal] section in once, the
	// first time it crosses into view. With reduced motion, everything is
	// already visible by default (see style.css), so there's nothing to do.
	(function () {
		if (reduceMotion) return;

		var targets = document.querySelectorAll('[data-reveal]');
		if (!targets.length) return;

		if (!('IntersectionObserver' in window)) {
			targets.forEach(function (el) { el.classList.add('is-visible'); });
			return;
		}

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });

		targets.forEach(function (el) { observer.observe(el); });
	})();

	// Cursor glow — a soft light that follows the pointer. Desktop/mouse
	// only: meaningless on touch, and skipped under reduced motion.
	(function () {
		if (reduceMotion || !hasFinePointer) return;

		var glow = document.querySelector('.cursor-glow');
		if (!glow) return;

		window.addEventListener('mousemove', function (e) {
			glow.style.transform = 'translate3d(' + (e.clientX - 200) + 'px,' + (e.clientY - 200) + 'px,0)';
			glow.classList.add('is-active');
		}, { passive: true });

		window.addEventListener('mouseleave', function () {
			glow.classList.remove('is-active');
		});
	})();

	// Magnetic buttons — nudges .magnetic elements toward the pointer while
	// it's within their bounds, and eases back out on leave.
	(function () {
		if (reduceMotion || !hasFinePointer) return;

		var buttons = document.querySelectorAll('.magnetic');

		buttons.forEach(function (btn) {
			btn.addEventListener('mousemove', function (e) {
				var rect = btn.getBoundingClientRect();
				var mx = (e.clientX - rect.left - rect.width / 2) * 0.28;
				var my = (e.clientY - rect.top - rect.height / 2) * 0.28;
				btn.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
			}, { passive: true });

			btn.addEventListener('mouseleave', function () {
				btn.style.transform = 'translate(0,0)';
			});
		});
	})();

	// Project card tilt — a subtle 3D rotation following the pointer.
	(function () {
		if (reduceMotion || !hasFinePointer) return;

		var cards = document.querySelectorAll('.project-card');

		cards.forEach(function (card) {
			card.addEventListener('mousemove', function (e) {
				var rect = card.getBoundingClientRect();
				var px = (e.clientX - rect.left) / rect.width;
				var py = (e.clientY - rect.top) / rect.height;
				var rx = (py - 0.5) * -12;
				var ry = (px - 0.5) * 12;
				card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
			}, { passive: true });

			card.addEventListener('mouseleave', function () {
				card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
			});
		});
	})();

})();
