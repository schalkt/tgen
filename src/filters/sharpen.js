(function(tgen) {

    // sharpen
    tgen.filter('sharpen', {
        type: 2
    }, function($g, params) {

        $g.do('convolute', {
            store: false,
            transparent: false,
            weights: 'sharpen' + params.type
        });

        return params;

    });

})(SeamlessTextureGenerator);