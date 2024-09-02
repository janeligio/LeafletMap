define([
    'qlik',
    'jquery',
    './properties',
    './leaflet',
    'text!./template.html',
    'css!./styles.css',
    'css!./leaflet.css',
], function (qlik, $, properties, L, template) {
    'use strict';

    function render(layout) {
        // Get the user-defined default view coordinates
        const defaultLat = layout.defaultViewLat;
        const defaultLong = layout.defaultViewLong;

        // Initialize the map with user-defined coordinates
        const map = L.map('leaflet-map').setView([defaultLat, defaultLong], 13);

        // Add a tile layer to the map (using OpenStreetMap tiles)
        // 'https://maps.qlikcloud.com/ravegeo/map2/GetTile?name=osm_bg.24.4&tx={x}&ty={y}&zoomStep={z}&key=may21-K8DU2D3jU9PWhr',
        // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        L.tileLayer(
            'https://maps.qlikcloud.com/ravegeo/map2/GetTile?name=osm_bg.24.4&tx={x}&ty={y}&zoomStep={z}&key=may21-K8DU2D3jU9PWhr',
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(map);

        // Iterate over the user-defined layers
        // if (layout.layers) {
        //     layout.layers.forEach(function (layer) {
        //         // Determine the layer type
        //         var layerType = layer.layerType;
        //         var dimension =
        //             layout.qHyperCube.qDimensionInfo[layer.dimension]
        //                 .qFallbackTitle;

        //         // Example: Add different types of layers based on the user selection
        //         if (layerType === 'marker') {
        //             // Assuming the dimension provides coordinates
        //             var latLng = layout.qHyperCube.qDataPages[0].qMatrix.map(
        //                 function (d) {
        //                     return d[layer.dimension].qText
        //                         .split(',')
        //                         .map(Number);
        //                 }
        //             );

        //             latLng.forEach(function (coords) {
        //                 L.marker(coords)
        //                     .addTo(map)
        //                     .bindPopup(
        //                         '<b>' +
        //                             dimension +
        //                             '</b><br/>Lat: ' +
        //                             coords[0] +
        //                             ', Long: ' +
        //                             coords[1]
        //                     );
        //             });
        //         }
        //         // Additional layer types can be handled here
        //     });
        // }
    }

    return {
        template: template,
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [
                    {
                        qWidth: 0,
                        qHeight: 0,
                    },
                ],
            },
        },
        definition: properties,
        support: {
            snapshot: true,
            export: true,
            exportData: true,
        },
        paint: function ($element, layout) {
            console.log(layout);
            return qlik.Promise.resolve();
        },
        controller: [
            '$scope',
            function ($scope) {
                console.log($scope.layout);

                $(document).ready(() => {
                    render($scope.layout);
                });
            },
        ],
    };
});
