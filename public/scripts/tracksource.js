/*
 * TrackSource
 *
 * * MUST pass an audio context
 *
 */
function TrackSource (context, opts) {
    if (!context) {
        throw new Error('You must pass an audio context to use this module');
    }

    this.context = context;
    this.url = opts.url ? opts.url : undefined;
}

TrackSource.prototype = {
    needBuffer: function() {
        return this.buffer === undefined;
    },

    loadSound: function(url, cb) {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        var self = this;
        req.onloadend = function() {
            self.decode.call(self, req.response, cb);
        };
        req.send();
    },
    onLoaded: function(source, silent) {
        this.buffer = source;
        this.disconnect();
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        if (!silent) this.playSound();
    },
    disconnect: function() {
        if (this.source) {
            this.source.disconnect(this.context.destination);
        }
    },
    playSound: function() {
        this.source.start(this.context.currentTime);
    },
    loadSilent: function() {
        if (!this.needBuffer()) return;
        var self = this;
        this.loadSound(this.url, function(data) {
            self.onLoaded.call(self, data, true);
        });
    },
    play: function() {
        if (this.needBuffer()) {
            var self = this;
            this.loadSound(this.url, function(data) {
                self.onLoaded.call(self, data);
            });
        } else {
            this.onLoaded(this.buffer);
        }       
    },
    stop: function() {
        this.source.stop(this.context.currentTime);
    },
    decode: function(data, success, error) {
        this.context.decodeAudioData(data, success, error);
    }  
};

module.exports = TrackSource;
