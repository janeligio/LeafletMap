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

    function createHypercube({
        dimensions = [],
        measures = [],
        initialDataFetch: {
            top = 0,
            left = 0,
            height = 1000,
            width = dimensions.length + measures.length,
        } = {},
        callback,
    }) {
        if (dimensions.length === 0 && measures.length === 0) {
            throw new Error('Please define dimensions or measures.');
        }

        const hypercubeDefinition = {
            qDimensions: dimensions.map((dim) => ({
                qDef: {
                    qFieldDefs: [dim],
                },
            })),
            qInitialDataFetch: [
                {
                    qTop: top,
                    qLeft: left,
                    qHeight: height,
                    qWidth: width,
                },
            ],
        };

        qlik.currApp().createCube(hypercubeDefinition, callback);
    }

    function render(layout) {
        // Get the user-defined default view coordinates
        const defaultLat = layout.defaultViewLat;
        const defaultLong = layout.defaultViewLong;

        // Initialize the map with user-defined coordinates
        // const map = L.map('leaflet-map').setView([defaultLat, defaultLong], 13);
        const map = L.map('leaflet-map', {
            center: [defaultLat, defaultLong],
            zoom: 13,
        });

        // Add a tile layer to the map (using OpenStreetMap tiles)
        // 'https://maps.qlikcloud.com/ravegeo/map2/GetTile?name=osm_bg.24.4&tx={x}&ty={y}&zoomStep={z}&key=may21-K8DU2D3jU9PWhr',
        // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        // https://geo.advana.data.mil/ravegeo/map2/GetTile?name=osm_bg.23.9&tx=6&ty=5&zoomStep=15&key=eS3V5l49cUOiPro (Advana)
        L.tileLayer(
            // 'https://geo.advana.data.mil/ravegeo/map2/GetTile?name=osm_bg.23.9&tx={x}&ty={y}&zoomStep={z}&key=eS3V5l49cUOiPro',
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        ).addTo(map);

        console.log('layout: ', layout);
        console.log('qlik: ', qlik.currApp().createCube);

        for (const layer of layout.layers) {
            // Rendering point layer
            if (layer.layerType === 'marker') {
                const { fieldName, latitudeField, longitudeField } = layer;

                createHypercube({
                    dimensions: [fieldName, latitudeField, longitudeField],
                    callback: function (reply) {
                        console.log('reply: ', reply);
                        for (const row of reply.qHyperCube.qDataPages[0]
                            .qMatrix) {
                            const [fieldRaw, latRaw, longRaw] = row;

                            const field = fieldRaw.qText;
                            const latitude = latRaw.qNum;
                            const longitude = longRaw.qNum;

                            const popupContent = L.popup({
                                content: `<p>Location: ${field} ${latitude}, ${longitude}</p>`,
                                // keepInView: true,
                            }).setContent(
                                `<p>Location: ${field} ${latitude}, ${longitude}</p>`
                            );

                            L.circle([latitude, longitude], {
                                radius: 50,
                            })
                                .addTo(map)
                                .bindPopup(popupContent)
                                .openPopup();

                            // L.popup([latitude, longitude], {
                            //     content: `<p>Location: ${latitude}, ${longitude}</p>`,
                            // }).openOn(map);
                        }

                        map.fitBounds(map.getBounds()); // Zoom the map to those bounds
                    },
                });
            }
        }

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
            render($scope.layout);
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
