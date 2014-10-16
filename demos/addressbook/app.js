///<reference path="libs/angular.js" />

angular.module("addressbook", ["ngRoute"]).config(function ($routeProvider) {
    "use strict";

    $routeProvider.when("/", {
        controller: "AddressBookCtrl",
        templateUrl: "addressbook-index.html"
    }).otherwise({
        redirectTo: '/'
    });

});