var app = angular.module('app', ['ngRoute','ngResource']);
app.config(function($routeProvider){
    $routeProvider
        .when('/coins',{
            templateUrl: '/views/coins.html',
            controller: 'coinsController'
        })
		.when('/analysis',{
            templateUrl: '/views/analysis.html',
            controller: 'analysisController'
        })
        .otherwise(
            { redirectTo: '/'}
        );
});

