
$(function() {
    "use strict";

    /*-----------------------------------
     * FIXED  MENU - HEADER
     *-----------------------------------*/
    function menuscroll() {
        var $navmenu = $('.nav-menu');
        if ($(window).scrollTop() > 50) {
            $navmenu.addClass('is-scrolling');
        } else {
            $navmenu.removeClass("is-scrolling");
        }
    }
    menuscroll();
    $(window).on('scroll', function() {
        menuscroll();
    });
    /*-----------------------------------
     * NAVBAR CLOSE ON CLICK
     *-----------------------------------*/

    $('.navbar-nav > li:not(.dropdown) > a').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });
    /* 
     * NAVBAR TOGGLE BG
     *-----------------*/
    var siteNav = $('#navbar');
    siteNav.on('show.bs.collapse', function(e) {
        $(this).parents('.nav-menu').addClass('menu-is-open');
    })
    siteNav.on('hide.bs.collapse', function(e) {
        $(this).parents('.nav-menu').removeClass('menu-is-open');
    })

    /*-----------------------------------
     * ONE PAGE SCROLLING
     *-----------------------------------*/
    // Select all links with hashes
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').not('[data-toggle="tab"]').on('click', function(event) {
        // On-page links
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });
    /*-----------------------------------
     * OWL CAROUSEL
     *-----------------------------------*/

    var $galleryDiv = $('.img-gallery');
    if ($galleryDiv.length && $.fn.owlCarousel) {
        $galleryDiv.owlCarousel({
            nav: false,
            center: true,
            loop: true,
            autoplay: true,
            dots: true,
            navText: ['<span class="ti-arrow-left"></span>', '<span class="ti-arrow-right"></span>'],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 3
                }
            }
        });
    }


    // Contact Form Validate
    // --------------------------
    $(".form-field.req").each(function (i, e) {
        $(e).change(function () {
            if ($(e).val() == '') {
                $(e).removeClass("field-success").addClass('field-error');
            }
            else {
                $(e).removeClass("field-error").addClass('field-success');
            }
        });
    });


    // Submit Contact Form
    // --------------------
    $(".contact-form form").submit(function () {
     
        if ($(this).find('.req').length == $(this).find('.field-success').length) {

	$('input[type="submit"]').attr('disabled','disabled');	
	$(this).find('[type="submit"]').val("Sending...");
	
	var sname = $("#sname").val();
	var subject = $("#subject").val();
	var msg = $("#msg").val() + "  phone:" + subject;

	$.post( "http://www.joboxapp.com/contact/", { sname: sname, subject: subject, msg: msg })
	.always(function( data ) {
		 $("#sname").val('');
		 $("#subject").val('');
		 $("#msg").val('');
		 $('input[type="submit"]').attr('disabled','');	
		$(".contact-form form").addClass('send-ok');
		$(".contact-form form").find('[type="submit"]').val("Thank you!").removeClass('btn-success').addClass('btn-primary');
	});
	
           
        }
        else {
            $(this).find('.req').each(function (i, e) {
                if (!$(e).hasClass('field-success')) {
                    $(e).addClass('field-error')
                }
            });
            $(this).find('[type="submit"]').val("send").removeClass('btn-primary').addClass('btn-success');
        }
        return false;
    });

 


}); /* End Fn */


