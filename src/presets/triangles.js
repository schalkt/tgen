module.exports = function (tgen) {
  tgen.preset("triangles", {
    width: 256,
    height: 256,
    items: [
      [0, "fill"],
      [
        0,
        "triangles",
        {         
          count: [2, 80],
          size: [
            [6, 22],
            [12, 36],
          ],
        },
      ],
      [
        0,
        "triangles",
        {          
          count: [8, 20],
          size: [
            [20, 40],
            [24, 52],
          ],
        },
      ]      
    ],
  });
};
