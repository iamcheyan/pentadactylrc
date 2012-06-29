(function() {
    Object.defineProperty(statusline, "status", { 
            get: function() { return this._uri;},
            set: 
    function(uri) {
        let modified = "";
        let url = uri;
        if (isinstance(uri, Ci.nsIURI)) {
            // when session information is available, add [+] when we can go
            // backwards, [-] when we can go forwards
            if (uri.equals(buffer.uri) && window.getWebNavigation) {
                let sh = window.getWebNavigation().sessionHistory;
                if (sh && sh.index > 0)
                    modified += "+";
                if (sh && sh.index < sh.count - 1)
                    modified += "-";
                if (this.bookmarked)
                    modified += UTF8("\u2764");
            }

            if (modules.quickmarks)
                modified += quickmarks.find(uri.spec.replace(/#.*/, "")).join("");

            url = this.losslessDecodeURI(uri.spec);
        }

        if (url == "about:blank") {
            if (!buffer.title)
                url = _("buffer.noName");
        }
        else {
            url = url.replace(RegExp("^dactyl://help/(\\S+)#(.*)"), function (m, n1, n2) n1 + " " + decodeURIComponent(n2) + " " + _("buffer.help"))
                     .replace(RegExp("^dactyl://help/(\\S+)"), "$1 " + _("buffer.help"));
        }

        if (modified)
            url = "[" + modified + "] " + url;

        this.widgets.url.value = url;
        this._status = uri;
    },
    enumerable: true,
    configurable: true});
})();
