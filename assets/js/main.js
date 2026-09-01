/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Fibonacci sequence drives the pace of the background animation: each
	// orb/phase cycles on a period taken from the sequence (in seconds), so
	// the whole scene drifts in and out of phase with itself rather than
	// pulsing on a single fixed beat.
	function fibonacciSequence(limit) {
		var values = [1, 1];
		while (values[values.length - 1] < limit) {
			var next = values[values.length - 1] + values[values.length - 2];
			values.push(next);
		}
		return values;
	}

	var fibValues = fibonacciSequence(89); // [1,1,2,3,5,8,13,21,34,55,89]
	var maxFib = fibValues[fibValues.length - 1];
	var scrollProgress = 0;

	function readScrollProgress() {
		var scrollTop = window.scrollY || window.pageYOffset;
		var maxScroll = Math.max(window.innerHeight * 1.8, 2400);
		scrollProgress = Math.min(scrollTop / maxScroll, 1);
		document.documentElement.style.setProperty('--scroll-progress', scrollProgress.toFixed(4));
	}

	function animateLiquidBackground(timestamp) {
		var t = timestamp / 1000;

		// Sum a sine wave per Fibonacci number, each with its own period
		// (in seconds) and amplitude weighted by its place in the
		// sequence, so slow, medium and quick drifts overlap organically.
		var wave = 0;
		var weightTotal = 0;
		for (var i = 0; i < fibValues.length; i++) {
			var fib = fibValues[i];
			var period = fib * 1.6; // seconds
			var weight = fib / maxFib;
			wave += Math.sin((t / period) * Math.PI * 2 + i) * weight;
			weightTotal += weight;
		}
		var idle = (wave / weightTotal + 1) / 2; // normalized 0..1
		var normalized = Math.min(1, idle * 0.6 + scrollProgress * 0.4);

		var hue = Math.round(210 + normalized * 42);
		var glow = 0.2 + normalized * 0.5;

		document.documentElement.style.setProperty('--fibo-scale', (0.75 + normalized * 0.5).toFixed(4));
		document.documentElement.style.setProperty('--fibo-amp', (0.35 + idle * 1.2).toFixed(4));
		document.documentElement.style.setProperty('--glow-alpha', glow.toFixed(3));
		document.documentElement.style.setProperty('--bg-base', 'hsl(' + hue + ', 30%, 3%)');
		document.documentElement.style.setProperty('--bg-mid', 'hsl(' + (hue + 12) + ', 28%, 5%)');
		document.documentElement.style.setProperty('--bg-deep', 'hsl(' + (hue + 20) + ', 30%, 2%)');

		$('.orb').each(function(orbIndex) {
			var fib = fibValues[(orbIndex * 2) % fibValues.length];
			var period = fib * 2.2;
			var driftX = Math.sin((t / period) * Math.PI * 2 + orbIndex) * 90 * (0.4 + idle * 0.6);
			var driftY = Math.cos((t / (period * 1.3)) * Math.PI * 2 + orbIndex) * 70 * (0.4 + idle * 0.6);
			var scale = 1 + normalized * (0.25 + orbIndex * 0.08);
			$(this).css({
				transform: 'translate3d(' + driftX.toFixed(2) + 'px, ' + driftY.toFixed(2) + 'px, 0) scale(' + scale.toFixed(3) + ')',
				opacity: (0.22 + normalized * 0.35).toFixed(3)
			});
		});

		requestAnimationFrame(animateLiquidBackground);
	}

	$window.on('scroll', readScrollProgress);
	$window.on('resize', readScrollProgress);
	readScrollProgress();
	requestAnimationFrame(animateLiquidBackground);

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

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

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