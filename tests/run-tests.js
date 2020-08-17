(function() {
    // add ?hidepass query param to hide results of successful test cases
    if (window.location.href.indexOf('hidepass') >= 0) {
        $('#qunit-tests').addClass('hidepass');
    }

    var mixpanelLoading = $.Deferred();
    var mixpanelCELoading = $.Deferred();
    window.mixpanel.init("MIXPANEL_TOKEN",
    {
        autotrack: false,
        cookie_name: "test",
        reset_cookie: true,
        debug: true,
        loaded: function(mixpanel) {
            mixpanel.init("MIXPANEL_NONBATCHING_TOKEN", {
                autotrack: false,
                batch_requests: false,
                debug: true,
            }, "nonbatching");
            mixpanelLoading.resolve(mixpanel);
            testMixpanel(mixpanel);
        }
    });

    window.mixpanel.init("854983da12a1c2e164b2bca4488604d2",
    {
        autotrack: true,
        cookie_name: "test_ce",
        reset_cookie: true,
        debug: true,
        loaded: function(mixpanel) {
            mixpanelCELoading.resolve(mixpanel);
        }
    }, "ce");

    testAsync(window.mixpanel, window.mixpanel.ce);
    testCEAsync(window.mixpanel.ce);

    $.when(mixpanelLoading, mixpanelCELoading).done(function(mixpanel, mixpanelCE) {
        if (mixpanel.ce.get_config('autotrack') === true) { // could be set to false as a part of the initialization process
            testMixpanelCE(mixpanel, mixpanelCE);
        }
    });
})(window);
