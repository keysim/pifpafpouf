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
            var loop = arguments[1];
            var sound = $("#" + arguments[0] + "")[0];
            sound.currentTime = 0;
            sound.play();
            if(loop) {
                sound.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
        },
        unpauseSound : function () {
            $("#"+ arguments[0])[0].play();
        },
        pauseSound : function () {
            $("#"+ arguments[0])[0].pause();
        },
        muteSound : function () {
            $("#" + arguments[0]).prop('muted', arguments[1]);
        },
        resetSound: function () {
            $("#"+ arguments[0])[0].currentTime = 0;
        },
        deleteSound: function () {
            $("#"+ arguments[0]).remove();
        }
    });
})(jQuery);
