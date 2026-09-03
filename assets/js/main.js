/***************************************************
==================== JS INDEX ======================
****************************************************
Preloader js
Data js
Sticky Nav Js
Mobile Menu Js
Search Bar Js
Rating Js
Nice Select Js
Client-slider Js
Testimonial Slider Js
Testimonial Slider 2 Js
Testimonial Slider 3 Js
Project Slider Js
Hero slider Js
Blog post slider Js
Service Slider Js
CounterUp js
VenoBox Js
Backtotop Js
Progressbar Js
Pricing Toggle
Accordion Js
Services Tab Background
Service 3 Js
Hover active
Contact map Js

****************************************************/

(function ($) {
	"use strict";

	/* --------------------------------------------
		Preloader js
	-------------------------------------------- */
	$(window).on("load", function () {
		const tjPreloader = $(".preloader");
		if (tjPreloader?.length) {
			setTimeout(function () {
				tjPreloader.removeClass("is-loading").addClass("is-loaded");
				setTimeout(function () {
					tjPreloader.fadeOut(600);
					gsapController();
					counterController();
				});
			}, 1000);
		} else {
			gsapController();
			counterController();
		}
	});

	/* --------------------------------------------
		Data js
	-------------------------------------------- */
	$("[data-bg-image]").each(function () {
		var $this = $(this),
			$image = $this.data("bg-image");
		$this.css("background-image", "url(" + $image + ")");
	});

	/* --------------------------------------------
		Sticky Nav Js
	-------------------------------------------- */
	var lastScrollTop = "";
	function stickyMenu($targetMenu, $toggleClass) {
		var st = $(window).scrollTop();
		if ($(window).scrollTop() > 500) {
			if (st > lastScrollTop) {
				$targetMenu.removeClass($toggleClass);
			} else {
				$targetMenu.addClass($toggleClass);
			}
		} else {
			$targetMenu.removeClass($toggleClass);
		}

		lastScrollTop = st;
	}

	$(window).on("scroll", function () {
		if ($(".header-area").length) {
			stickyMenu($(".header-sticky"), "sticky");
		}
	});

	/* --------------------------------------------
		Mobile Menu Js
	-------------------------------------------- */
	$(".mobile_menu_bar").on("click", function () {
		$(this).toggleClass("on");
	});

	// Mobile Menu Js
	$("#mobile-menu").meanmenu({
		meanMenuContainer: ".mobile_menu",
		meanScreenWidth: "991",
		meanExpand: ['<i class="tji-arrow-down"></i>'],
	});

	// Hamburger Menu Js
	$(".mobile_menu_bar").on("click", function () {
		$(".hamburger-area").addClass("opened");
		$(".body-overlay").addClass("opened");
		$("body").toggleClass("overflow-hidden");
	});

	// Offcanvas js
	$(".menu_offcanvas").on("click", function () {
		$(".tj-offcanvas-area").toggleClass("opened");
		$(".body-overlay").addClass("opened");
		$("body").toggleClass("overflow-hidden");
	});
	$(".hamburger_close_btn").on("click", function () {
		$(".tj-offcanvas-area").removeClass("opened");
		$(".hamburger-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
		$("body").toggleClass("overflow-hidden");
	});
	$(".body-overlay").on("click", function () {
		$(".tj-offcanvas-area").removeClass("opened");
		$(".hamburger-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
		$("body").toggleClass("overflow-hidden");
	});

	/* --------------------------------------------
		Search Bar Js
	-------------------------------------------- */
	$(".header-search").on("click", function () {
		$(".search_popup").addClass("search-opened");
		$(".search-popup-overlay").addClass("opened");
	});
	$(".search_close_btn").on("click", function () {
		$(".search_popup").removeClass("search-opened");
		$(".search-popup-overlay").removeClass("opened");
	});
	$(".search-popup-overlay").on("click", function () {
		$(".search_popup").removeClass("search-opened");
		$(this).removeClass("opened");
	});

	/* --------------------------------------------
		Rating  Js
	-------------------------------------------- */
	if ($(".star-ratings").length > 0) {
		$(".star-ratings").each(function () {
			var width = $(this).find(".empty-ratings span").width();
			$(this).css("width", width);
		});
	}

	/* --------------------------------------------
		Nice Select Js
	-------------------------------------------- */
	if ($(".tj-select select").length > 0) {
		$(".tj-select select").niceSelect();
	}

	/* --------------------------------------------
		Client-slider Js
	-------------------------------------------- */
	if ($(".client-slider").length > 0) {
		var client = new Swiper(".client-slider", {
			slidesPerView: "auto",
			spaceBetween: 0,
			freemode: true,
			centeredSlides: true,
			loop: true,
			speed: 5000,
			allowTouchMove: false,
			autoplay: {
				delay: 1,
				disableOnInteraction: true,
			},
		});
	}

	/* --------------------------------------------
		Testimonial Slider Js
	-------------------------------------------- */
	if ($(".client-thumb").length > 0 && $(".testimonial-slider").length > 0) {
		let thumbSlider = new Swiper(".client-thumb", {
			slidesPerView: 3,
			spaceBetween: 12,
			loop: true,
			speed: 1500,
			centeredSlides: true,
			freeMode: true,
			watchSlidesProgress: true,
			slideToClickedSlide: true,
		});

		let testimonialSlider = new Swiper(".testimonial-slider", {
			slidesPerView: "2.08",
			spaceBetween: 30,
			centeredSlides: true,
			loop: true,
			speed: 1500,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
			breakpoints: {
				0: {
					slidesPerView: 1.01,
					spaceBetween: 15,
				},
				576: {
					slidesPerView: 1.5,
					spaceBetween: 15,
				},
				992: {
					slidesPerView: 1.5,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 1.8,
					spaceBetween: 25,
				},
				1400: {
					slidesPerView: 2.08,
					spaceBetween: 30,
				},
			},
		});

		// Connect the sliders
		testimonialSlider.controller.control = thumbSlider;
		thumbSlider.controller.control = testimonialSlider;
	}

	/* --------------------------------------------
		Testimonial Slider 2
	-------------------------------------------- */
	if ($(".testimonial_slider_2").length > 0) {
		var testimonial2 = new Swiper(".testimonial_slider_2", {
			slidesPerView: 1,
			spaceBetween: 15,
			loop: true,
			speed: 1500,
			arrow: false,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 30,
				},

				1024: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				1200: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},
		});
	}

	/* --------------------------------------------
		Testimonial Slider 3
	-------------------------------------------- */
	if ($(".h3_testimonial_slider").length > 0) {
		var h3_testimonial = new Swiper(".h3_testimonial_slider", {
			slidesPerView: "auto",
			centeredSlides: true,
			spaceBetween: 30,
			loop: true,
			speed: 1500,
			arrow: false,
			autoplay: {
				delay: 3000,
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
			breakpoints: {
				320: {
					spaceBetween: 20,
				},
				992: {
					spaceBetween: 30,
				},
			},
		});
	}

	/* --------------------------------------------
		Project Slider Js
	-------------------------------------------- */
	if ($(".project-slider").length > 0) {
		var project = new Swiper(".project-slider", {
			slidesPerView: 1,
			spaceBetween: 15,
			loop: true,
			speed: 1500,
			arrow: false,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
			pagination: {
				el: ".swiper-pagination-area",
				clickable: true,
			},
			breakpoints: {
				600: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1540: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
		});
	}

	/* --------------------------------------------
		Hero slider
	-------------------------------------------- */
	if ($(".tj-hero-slider").length > 0) {
		var hero = new Swiper(".tj-hero-slider", {
			slidesPerView: 1,
			spaceBetween: 0,
			effect: "fade",
			loop: true,
			speed: 1400,
			autoplay: {
				delay: 5000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
		});
	}

	/* --------------------------------------------
		Blog post slider
	-------------------------------------------- */
	if ($(".tj-post-slider").length > 0) {
		var hero = new Swiper(".tj-post-slider", {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: true,
			speed: 1400,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: ".slider-next",
				prevEl: ".slider-prev",
			},
		});
	}

	/* --------------------------------------------
		CounterUp js
	-------------------------------------------- */
	function counterController() {
		if (jQuery(".counter").length > 0) {
			$(".counter").counterUp({
				delay: 10,
				time: 1000,
			});
		}
	}

	/* --------------------------------------------
		VenoBox Js
	-------------------------------------------- */
	if ($(".gallery").length > 0) {
		new VenoBox({
			selector: ".gallery",
			numeration: true,
			// infinigall: true,
			spinner: "pulse",
		});
	}

	if ($(".video-popup").length > 0) {
		new VenoBox({
			selector: ".video-popup",
			numeration: true,
			// infinigall: true,
			spinner: "pulse",
		});
	}

	/* --------------------------------------------
		Back to Top Js
	-------------------------------------------- */
	function back_to_top() {
		var btn = $("#back_to_top");
		var btn_wrapper = $(".back-to-top-wrapper");

		$(window).on("scroll", function () {
			if ($(window).scrollTop() > 1200) {
				btn_wrapper.addClass("back-to-top-btn-show");
			} else {
				btn_wrapper.removeClass("back-to-top-btn-show");
			}
		});

		btn.on("click", function (e) {
			e.preventDefault();
			$("html, body").animate({ scrollTop: 0 }, "300");
		});
	}
	back_to_top();

	/* --------------------------------------------
		Progress bar
	-------------------------------------------- */
	const progressBarController = () => {
		const progressContainers = document.querySelectorAll(".tj-progress");

		if (progressContainers?.length) {
			progressContainers.forEach(progressContainer => {
				const targetedProgressBar =
					progressContainer.querySelector(".tj-progress-bar");
				const completedPercent =
					parseInt(targetedProgressBar.getAttribute("data-percent", 10)) || 0;

				const observer = new IntersectionObserver(
					entries => {
						entries.forEach(entry => {
							if (entry.isIntersecting) {
								// Animate the progress bar
								targetedProgressBar.style.transition = "width 2s ease-out";
								targetedProgressBar.style.width = `${completedPercent}%`;

								// Animate the percentage text
								const percentageText = progressContainer.querySelector(
									".tj-progress-percent"
								);
								if (percentageText) {
									let currentPercent = 0;

									const interval = setInterval(() => {
										currentPercent++;
										percentageText.textContent = `${currentPercent}%`;

										if (currentPercent >= completedPercent) {
											clearInterval(interval);
										}
									}, 15);
								}
							}
						});
					},
					{
						root: null,
						threshold: [0.3, 0.9],
					}
				);
				observer.observe(progressContainer);
			});
		}
	};

	progressBarController();

	/* --------------------------------------------
		Pricing Toggle
	-------------------------------------------- */
	if ($(".toggle-checkbox").length > 0) {
		var toggle = $(".toggle-checkbox");
		var price = $(".price");
		var period = $(".period");

		toggle.on("change", function () {
			if ($(this).is(":checked")) {
				// Yearly active
				price.each(function () {
					$(this).text($(this).data("year-price"));
				});
				period.each(function () {
					$(this).text($(this).data("year-period"));
				});
			} else {
				// Monthly active
				price.each(function () {
					$(this).text($(this).data("month-price"));
				});
				period.each(function () {
					$(this).text($(this).data("month-period"));
				});
			}
		});
	}

	/* --------------------------------------------
		Accordion Js
	-------------------------------------------- */
	if ($(".accordion_item").length > 0) {
		$(".accordion_item .accordion_title").on("click", function () {
			if ($(this).parent().hasClass("active")) {
				$(this).parent().removeClass("active");
			} else {
				$(this).parent().siblings().removeClass("active");
				$(this).parent().addClass("active");
			}
		});
	}

	/* --------------------------------------------
		Services Tab Background
	-------------------------------------------- */
	if ($(".toggle-checkbox").length > 0) {
		function filter_animation() {
			var active_bg = $(".services_tabs .active-bg");
			var element = $(".services_tabs .active");

			$(".services_tabs button").on("click", function () {
				var e = $(this);
				activeFilterBtn(active_bg, e);
			});

			activeFilterBtn(active_bg, element);
		}
		function activeFilterBtn(active_bg, e) {
			if (!e.length) {
				return false;
			}

			var leftOff = e.offset().left;
			var width = e.outerWidth();
			var height = e.outerHeight();
			var topOff = e.offset().top;
			var menuTop = $(".services_tabs").offset().top;
			var menuLeft = $(".services_tabs").offset().left;

			e.siblings().removeClass("active");
			e.addClass("active");

			active_bg.css({
				left: leftOff - menuLeft + "px",
				width: width + "px",
				height: height + "px",
				top: topOff - menuTop + "px", // Adjust the top of active-bg to align with the active button
			});
		}

		filter_animation();
	}

	/* --------------------------------------------
		Service 3 Js
	-------------------------------------------- */
	if ($(".h3_services_wrap").length > 0) {
		$(".h3_services_wrap .service_list_item")
			.on("mouseenter", function () {
				$(this).addClass("is-active").siblings().removeClass("is-active");
			})
			.on("mouseleave", function () {
				$(this).siblings().addClass("is-active");
			});
	}

	/* --------------------------------------------
		Hover active
	-------------------------------------------- */
	function getHoverActive() {
		const parentItems = document.querySelectorAll(".active-wrapper");
		if (parentItems?.length) {
			parentItems.forEach(parent => {
				parent.addEventListener(
					"mouseenter",
					e => {
						if (e.target.classList.contains("active-item")) {
							parent
								.querySelectorAll(".active-item")
								.forEach(i => i.classList.remove("active"));
							e.target.classList.add("active");
						}
					},
					true
				);
			});
		}
	}

	getHoverActive();

	/* --------------------------------------------
		Contact map Js
	-------------------------------------------- */
	const maps = document.querySelectorAll("#map");
	if (maps?.length) {
		// Initialize map
		const map = L.map("map", {
			center: [42.361145, -71.062133], // Boston example
			zoom: 20,
			zoomControl: false,
		});

		// Dark basemap
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
		).addTo(map);

		// Custom red marker
		const customMarker = L.divIcon({
			className: "custom-marker tji-location",
			iconSize: [45, 45],
		});

		L.marker([42.361145, -71.062233], {
			icon: customMarker,
		}).addTo(map);
	}
})(jQuery);
