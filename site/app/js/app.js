$(document).foundation();

$(window).on("load", function(e) {
    $('#intro').scrollnfade();
    $('#sporty').scrollnfade();
});

$(window).on("resize", function(e) {
    $('#intro').scrollnfadeReinit(); // do this only once

    $('#intro').scrollnfade();
    $('#sporty').scrollnfade();
});


(function($) {
    var elements = [];
    var elementsOverlay = [];

    $.fn.scrollnfadeReinit = function(options) {
        elements.splice(0, elements.length);
        elementsOverlay.splice(0, elements.length);
    };
    $.fn.scrollnfade = function(options) {

        var settings = $.extend({
            // TBD
        }, options);

        var update = function() {
            var scrollPos = window.scrollY;
            var top = 0;
            var height = 0;
            var opacity = 0;
            var element = null;
            var elementOverlay = null;

            for (var i = 0; i < elements.length; i++) {
                element = elements[i];
                elementOverlay = elementsOverlay[i];
                top = element.offset().top;
                height = element.height();

                if (scrollPos > (top + height) || (scrollPos < top)) {
                    continue;
                }
                else {
                    opacity = 1 - ((scrollPos - top) / (height));
                    element.css('opacity', opacity);
                    elementOverlay.css('opacity', 1 - opacity);
                }
            }
        };

        var onScroll = function() {
            requestAnimationFrame(update);
        };

        var init = function(element) {
            window.addEventListener('scroll', onScroll, false);

            elements.push(element);

            // position overlays over image sections
            $(element.selector + '-overlay').offset({
                top: $(element.selector).offset().top,
                left: $(element.selector).offset().left
            });

            elementsOverlay.push($(element.selector + '-overlay'));
        };

        init(this);
    };

}(jQuery));