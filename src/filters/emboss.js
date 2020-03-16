(function(tgen) {

    // emboss
    tgen.filter('emboss', {
        type: 2
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'emboss' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);