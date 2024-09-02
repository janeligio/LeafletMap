define(['qlik'], function (qlik) {
    return {
        type: 'items',
        component: 'accordion',
        items: {
            dimensions: {
                uses: 'dimensions',
                min: 1,
                max: 1,
            },
            measures: {
                uses: 'measures',
                min: 1,
                max: 1,
            },
            sorting: {
                uses: 'sorting',
            },
            settings: {
                uses: 'settings',
            },
            appearance: { uses: 'settings' },
        },
    };
});
