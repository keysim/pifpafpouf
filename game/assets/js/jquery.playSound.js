(function ($) {
    $.extend({
        createSound: function () {
            return $(
                '<audio class="sound-player" id="' + arguments[0] + '" style="display:none;">'
                + '<source src="' + arguments[1] + '" />'
                + '<embed src="' + arguments[1] + '" hidden="true" autostart="true" loop="false"/>'
                + '</audio>'
            ).appendTo('body');
        },
        playSound: function () {
            $("#" + arguments[0] + "")[0].play();
        },
        stopSound: function () {
            $(".sound-player").remove();
        }
    });
})(jQuery);
