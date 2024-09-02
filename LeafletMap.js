define([
    'qlik',
    'text!./template.html',
    './properties',
    './leaflet',
    'css!./styles.css',
    'css!./leaflet.css',
], function (qlik, template, properties, L) {
    return {
        definition: properties,
        template,
        support: {
            snapshot: true,
            export: true,
            exportData: true,
        },
        paint: function () {
            return qlik.Promise.resolve();
        },
        controller: ['$scope', function ($scope) {}],
    };
});
