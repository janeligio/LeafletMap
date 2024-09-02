define(['qlik'], function (qlik) {
    const layers = {
        type: 'array',
        label: 'Layers',
        ref: 'layers',
        itemTitleRef: 'layerType',
        allowAdd: true,
        allowRemove: true,
        addTranslation: 'Add Layer',
        itemTitleRef: 'layerTitle',
        items: {
            layerTitle: {
                ref: 'layerTitle',
                label: 'Layer Name',
                type: 'string',
                expression: 'optional',
            },
            layerType: {
                ref: 'layerType',
                type: 'string',
                component: 'dropdown',
                label: 'Layer Type',
                options: [
                    { value: 'marker', label: 'Marker' },
                    // Add more layer types as needed
                ],
                defaultValue: 'marker',
            },
            fieldName: {
                ref: 'fieldName',
                label: 'Field',
                type: 'string',
                expression: 'optional',
            },
            latitude: {
                ref: 'latitudeField',
                label: 'Latitude Field',
                type: 'string',
                expression: 'optional',
            },
            longitude: {
                ref: 'longitudeField',
                label: 'Longitude Field',
                type: 'string',
                expression: 'optional',
            },
        },
    };

    const defaultView = {
        label: 'Default View',
        type: 'items',
        items: {
            defaultViewLat: {
                ref: 'defaultViewLat',
                label: 'Latitude',
                type: 'number',
                defaultValue: 21.4333197,
            },
            defaultViewLong: {
                ref: 'defaultViewLong',
                label: 'Longitude',
                type: 'number',
                defaultValue: -157.98148605,
            },
        },
    };

    return {
        type: 'items',
        component: 'accordion',
        items: {
            layers,
            defaultView,
            // dimensions: {
            //     uses: 'dimensions',
            //     min: 1,
            //     max: 1,
            // },
            // measures: {
            //     uses: 'measures',
            //     min: 1,
            //     max: 1,
            // },
            sorting: {
                uses: 'sorting',
            },
            settings: {
                uses: 'settings',
            },
        },
    };
});
