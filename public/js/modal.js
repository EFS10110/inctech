/**
 * Modal Window Plugin
 * Simple modal dialog for image viewing and forms
 */

(function($) {
    $.fn.modal = function(options) {
        var settings = $.extend({
            overlayClass: 'modal-overlay',
            contentClass: 'modal-content',
            closeClass: 'modal-close',
            speed: 300
        }, options);

        return this.each(function() {
            var $this = $(this);
            
            // Create modal elements if they don't exist
            if ($('.modal-overlay').length === 0) {
                $('body').append('<div class="' + settings.overlayClass + '"></div>');
                $('body').append('<div class="' + settings.contentClass + '"><span class="' + settings.closeClass + '">&times;</span></div>');
            }

            var $overlay = $('.' + settings.overlayClass);
            var $content = $('.' + settings.contentClass);
            var $close = $('.' + settings.closeClass);

            // Open modal on click
            $this.on('click', function(e) {
                e.preventDefault();
                var content = $(this).data('modal-content') || $(this).attr('href');
                
                if (content && content.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    $content.html('<span class="' + settings.closeClass + '">&times;</span><img src="' + content + '" style="max-width:100%;max-height:80vh;">');
                } else if (content) {
                    $content.load(content);
                }
                
                $overlay.fadeIn(settings.speed);
                $content.fadeIn(settings.speed);
            });

            // Close modal
            $close.on('click', function() {
                $overlay.fadeOut(settings.speed);
                $content.fadeOut(settings.speed);
            });

            $overlay.on('click', function() {
                $overlay.fadeOut(settings.speed);
                $content.fadeOut(settings.speed);
            });

            // Close on escape key
            $(document).on('keydown', function(e) {
                if (e.key === 'Escape') {
                    $overlay.fadeOut(settings.speed);
                    $content.fadeOut(settings.speed);
                }
            });
        });
    };

    // Auto-initialize modal links
    $(document).ready(function() {
        $('a[data-modal]').modal();
    });
})(jQuery);
