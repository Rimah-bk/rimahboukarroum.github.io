/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Liquid background.
	//
	// A handful of cached orb nodes drift on overlapping sine waves. Only
	// the compositor-friendly `transform` is written per frame — nothing
	// else on the page is touched — so the loop stays cheap. It also parks
	// itself whenever the tab is hidden, and does nothing at all when the
	// user prefers reduced motion.
	(function() {

		var root = document.documentElement,
			orbs = Array.prototype.slice.call(document.querySelectorAll('.orb')),
			reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Scroll progress: drives a couple of small CSS translations. Read
		// is throttled to one rAF and only written when it actually moves.
		var scrollProgress = -1,
			scrollQueued = false;

		function updateScrollProgress() {
			scrollQueued = false;
			var maxScroll = Math.max(window.innerHeight * 1.8, 2400),
				next = Math.min((window.pageYOffset || 0) / maxScroll, 1);
			if (Math.abs(next - scrollProgress) < 0.002)
				return;
			scrollProgress = next;
			root.style.setProperty('--scroll-progress', next.toFixed(3));
		}

		function queueScrollProgress() {
			if (scrollQueued) return;
			scrollQueued = true;
			requestAnimationFrame(updateScrollProgress);
		}

		window.addEventListener('scroll', queueScrollProgress, { passive: true });
		window.addEventListener('resize', queueScrollProgress, { passive: true });
		updateScrollProgress();

		if (!orbs.length || reduceMotion)
			return;

		// Fibonacci-flavoured periods (seconds) so the orbs never quite sync.
		var motion = orbs.map(function(orb, i) {
			return {
				el: orb,
				px: [17, 27, 41][i % 3],
				py: [17, 27, 41][i % 3] * 1.4,
				ax: 64 + i * 12,
				ay: 46 + i * 9,
				phase: i * 1.7
			};
		});

		var rafId = 0,
			running = false;

		function frame(now) {
			var t = now / 1000;
			for (var i = 0; i < motion.length; i++) {
				var m = motion[i],
					x = Math.sin(t / m.px * 6.2831853 + m.phase) * m.ax,
					y = Math.cos(t / m.py * 6.2831853 + m.phase) * m.ay;
				m.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
			}
			rafId = requestAnimationFrame(frame);
		}

		function start() {
			if (running) return;
			running = true;
			rafId = requestAnimationFrame(frame);
		}

		function stop() {
			running = false;
			if (rafId) cancelAnimationFrame(rafId);
		}

		document.addEventListener('visibilitychange', function() {
			if (document.hidden) stop();
			else start();
		});

		if (!document.hidden)
			start();

	})();

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Drop the preload state as soon as the DOM is ready, so entrance
	// animations don't wait on every image to finish downloading. Nudge
	// Scrollex afterwards so any section already on screen activates right
	// away instead of waiting for the window 'load' event.
		(function() {
			function reveal() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
					$window.trigger('scroll');
				}, 50);
			}
			if (document.readyState !== 'loading')
				reveal();
			else
				document.addEventListener('DOMContentLoaded', reveal);
		})();

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

})(jQuery);