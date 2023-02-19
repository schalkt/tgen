module.exports = function (tgen) {

    tgen.function(
        "rot90",
        {
            seed: null,
            times: [1, 3],
            blend: tgen.blendSafe,
        },
        function ($g, params) {
            params.type = 1;
            params.angle = 90;

            tgen.effects["rotate"]($g, params);

            return params;
        }
    );

};