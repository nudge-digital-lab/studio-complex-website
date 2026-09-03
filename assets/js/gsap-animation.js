(function ($) {
	"use strict";

	/* ------------- GSAP Registration -------------*/

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

	if ($("#smooth-wrapper").length && $("#smooth-content").length) {
		gsap.config({
			nullTargetWarn: false,
		});

		let smoother = ScrollSmoother.create({
			smooth: 1,
			effects: true,
			smoothTouch: 0.1,
			normalizeScroll: false,
			ignoreMobileResize: true,
		});
	}
	window.gsapController = function () {
		/* ------------- Match media Js -------------*/
		let mediaMatch = gsap.matchMedia();

		/* --------------------------------------------
			Title Animation
		-------------------------------------------- */
		document.querySelectorAll(".tj-split-text-1").forEach(element => {
			const split = new SplitText(element, {
				type: "lines,words,chars",
				linesClass: "split-line",
			});

			gsap.set(split.chars, {
				opacity: 0.3,
				x: -7,
			});

			gsap.to(split.chars, {
				scrollTrigger: {
					trigger: element,
					start: "top 90%",
					end: "top 60%",
					markers: false,
					scrub: 1.2,
					toggleActions: "play none none none",
					once: true,
				},
				x: 0,
				y: 0,
				opacity: 1,
				duration: 0.7,
				stagger: 0.2,
			});
		});

		/* tj-split-text-2 */
		document.querySelectorAll(".tj-split-text-2").forEach(element => {
			const split = new SplitText(element, {
				type: "lines,words,chars",
				linesClass: "split-line",
			});

			gsap.set(element, { perspective: 400 });
			gsap.set(split.chars, {
				x: 100,
				opacity: 0,
			});

			gsap.to(split.chars, {
				scrollTrigger: {
					trigger: element,
					start: "top 90%",
					markers: false,
				},
				x: 0,
				y: 0,
				scaleX: 1,
				scaleY: 1,
				opacity: 1,
				duration: 0.5,
				stagger: 0.05,
				rotationX: 15,
				delay: 0.1,
				ease: "power3.inOut",
			});
		});

		/* tj-split-text-3 */
		document.querySelectorAll(".tj-split-text-3").forEach(title => {
			const split = new SplitText(title, {
				type: "words,chars",
				wordsClass: "word",
				charsClass: "char",
			});
			gsap.to(split.chars, {
				scrollTrigger: {
					trigger: title,
					start: "top 80%",
				},
				x: 0,
				opacity: 1,
				duration: 0.8,
				clipPath: "inset(0% 0% 0% 0%)",
				ease: "power4.out",
				stagger: 0.03,
			});
		});

		/* tj-split-text-4 */
		if ($(".tj-split-text-4").length) {
			let staggerAmount = 0.01,
				delayValue = 0.1,
				easeType = "power1.inout",
				animatedTitleElements = document.querySelectorAll(".tj-split-text-4");

			animatedTitleElements.forEach(element => {
				let animatedTitleElements = new SplitText(element, {
					types: "lines, words",
				});
				gsap.from(animatedTitleElements.chars, {
					y: "100%",
					duration: 0.5,
					delay: delayValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%" },
				});
			});
		}

		/* tj-split-text-5 */
		if ($(".tj-split-text-5").length) {
			let staggerAmount = 0.02,
				translateXValue = 20,
				delayValue = 0.3,
				easeType = "power2.out",
				animatedTextElements = document.querySelectorAll(".tj-split-text-5");

			animatedTextElements.forEach(element => {
				let animationSplitText = new SplitText(element, {
					type: "chars, words",
				});
				gsap.from(animationSplitText.chars, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%" },
				});
			});
		}

		/* Text Invert */
		if ($(".tj-text-invert").length) {
			const split = new SplitText(".tj-text-invert", { type: "lines" });
			split.lines.forEach(target => {
				gsap.to(target, {
					backgroundPositionX: 0,
					ease: "none",
					scrollTrigger: {
						trigger: target,
						scrub: 1,
						start: "top 80%",
						end: "bottom center",
					},
				});
			});
		}

		/* Text Highlight */
		if ($(".title-highlight").length) {
			const highlightText = new SplitText(".title-highlight", {
				type: "lines",
				linesClass: "line",
			});

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: ".title-highlight",
					scrub: 1,
					start: "top 80%",
					end: "bottom center",
				},
			});
			tl.to(".line", {
				"--highlight-offset": "100%",
				stagger: 0.4,
			});
		}

		/* --------------------------------------------
		 	Fade animation 
		-------------------------------------------- */
		if ($(".tj-fade-anim").length > 0) {
			gsap.utils.toArray(".tj-fade-anim").forEach(item => {
				let onscrollValue = item.getAttribute("data-on-scroll") || 1,
					fadeOffset = item.getAttribute("data-offset") || 50,
					delayValue = item.getAttribute("data-delay") || 0.15,
					durationValue = item.getAttribute("data-duration") || 1.15,
					fadeDirection = item.getAttribute("data-direction") || "bottom",
					easeValue = item.getAttribute("data-ease") || "power2.out",
					animationSetting = {
						opacity: 0,
						ease: easeValue,
						duration: durationValue,
						delay: delayValue,
						x:
							fadeDirection == "left"
								? -fadeOffset
								: fadeDirection == "right"
								? fadeOffset
								: 0,
						y:
							fadeDirection == "top"
								? -fadeOffset
								: fadeDirection == "bottom"
								? fadeOffset
								: 0,
					};
				if (onscrollValue == 1) {
					animationSetting.scrollTrigger = {
						trigger: item,
						start: "top 90%",
					};
				}
				gsap.from(item, animationSetting);
			});
		}

		/* --------------------------------------------
			Left slide Animation
		-------------------------------------------- */
		if (window.matchMedia("(min-width: 1200px)").matches) {
			gsap.utils.toArray(".tj-slide-wrap").forEach(item => {
				let items = item.querySelectorAll(".tj-slide-left");
				gsap
					.timeline({
						scrollTrigger: {
							trigger: item,
							start: "top 70%",
							markers: false,
						},
					})
					.from(items, {
						xPercent: -70,
						opacity: 0,
						ease: "back.out(2.5)",
						duration: 1,
						stagger: 0.2,
					});
			});
		}

		/* --------------------------------------------
			Right slide Animation
		-------------------------------------------- */
		if (window.matchMedia("(min-width: 1200px)").matches) {
			gsap.utils.toArray(".tj-slide-wrap").forEach(item => {
				let items = item.querySelectorAll(".tj-slide-right");
				gsap
					.timeline({
						scrollTrigger: {
							trigger: item,
							start: "top 70%",
							markers: false,
						},
					})
					.from(items, {
						xPercent: 70,
						opacity: 0,
						ease: "back.out(2.5)",
						duration: 1,
						stagger: -0.2,
					});
			});
		}

		/* --------------------------------------------
			Image Reveal Animation
		-------------------------------------------- */
		if (document.querySelectorAll(".img-reveal-1").length > 0) {
			let imgReveal = document.querySelectorAll(".img-reveal-1");
			imgReveal.forEach(element => {
				let image = element.querySelector("img");
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: element,
						start: "top 80%",
					},
				});

				tl.set(element, { autoAlpha: 1 });
				tl.from(element, 1.2, {
					xPercent: 100,
					ease: Power2.out,
				});
				tl.from(image, 1.2, {
					xPercent: -100,
					// scale: 1.3,
					delay: -1.2,
					ease: Power2.out,
				});
			});
		}

		/* --------------------------------------------
			Image Reveal Animation
		-------------------------------------------- */
		if (document.querySelectorAll(".img-reveal-2").length > 0) {
			let imgReveal = document.querySelectorAll(".img-reveal-2");
			imgReveal.forEach(element => {
				let image = element.querySelector("img");
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: element,
						start: "top 90%",
					},
				});

				tl.set(element, { autoAlpha: 1 });
				tl.from(element, 1.4, {
					opacity: 0,
					ease: Power2.out,
				});
				tl.from(image, 1.4, {
					scale: 1.4,
					delay: -1.4,
					ease: Power2.out,
				});
			});
		}

		/* --------------------------------------------
			Button move hover animation
		-------------------------------------------- */
		var hoverBtns = gsap.utils.toArray(".btn-hover-wrapper");

		const hoverBtnItem = gsap.utils.toArray(".btn-hover-inner");
		hoverBtns.forEach((btn, span) => {
			$(btn).on("mousemove", function (e) {
				callParallax(e);
			});

			function callParallax(e) {
				parallaxIt(e, hoverBtnItem[span], 50);
			}

			function parallaxIt(e, target, movement) {
				var $this = $(btn);
				var relX = e.pageX - $this.offset().left;
				var relY = e.pageY - $this.offset().top;

				gsap.to(target, 0.5, {
					x: ((relX - $this.width() / 2) / $this.width()) * movement,
					y: ((relY - $this.height() / 2) / $this.height()) * movement,
					ease: Power2.easeOut,
				});
			}
			$(btn).on("mouseleave", function (e) {
				gsap.to(hoverBtnItem[span], 0.5, {
					x: 0,
					y: 0,
					ease: Power2.easeOut,
				});
			});
		});

		/* --------------------------------------------
			Images parallax
		-------------------------------------------- */
		gsap.utils.toArray(".img-parallax").forEach(container => {
			const img = container.querySelector("img");

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: container,
					scrub: 1,
					pin: false,
				},
			});

			tl.fromTo(
				img,
				{
					yPercent: 0,
					ease: "none",
				},
				{
					yPercent: -30,
					ease: "none",
				}
			);
		});

		/* --------------------------------------------
			Footer logo skew
		-------------------------------------------- */
		let footerLogo = gsap.utils.toArray(".tj_footer_bottom_logo");
		footerLogo.forEach((item, i) => {
			gsap.set(item, {
				position: "relative",
			});
			gsap.to(item, {
				scrollTrigger: {
					trigger: item,
					scrub: -1,
					duration: 1.5,
					start: "top bottom+=100",
					end: "bottom center",
					markers: false,
				},
				scale: 1,
				opacity: 1,
				rotateX: 0,
			});
		});

		/* --------------------------------------------
			Sidebar sticky
		-------------------------------------------- */
		function sidebarStickyController() {
			const containers = document.querySelectorAll(".tj-sticky-container");
			if (containers.length) {
				containers.forEach(container => {
					const panels = container.querySelectorAll(".tj-sticky-item");
					if (panels.length) {
						mediaMatch.add("(min-width: 992px)", () => {
							const startOffset = 90;
							const lastIdx = panels.length - 1;
							const lastPanel = panels[lastIdx];
							const paddingBottom =
								parseInt(getComputedStyle(container).paddingBottom, 10) || 0;
							panels.forEach((panel, i) => {
								gsap.to(panel, {
									scrollTrigger: {
										trigger: panel,
										start: `top-=${startOffset} top`,
										endTrigger: container,
										end: () =>
											`bottom top+=${
												lastPanel.offsetHeight + startOffset + paddingBottom
											}`,
										pin: true,
										pinSpacing: false,
										scrub: true,
										markers: false,
										invalidateOnRefresh: true,
									},
									ease: "circ",
								});
							});
						});
					}
				});
			}
		}
		sidebarStickyController();
	};
})(jQuery);
