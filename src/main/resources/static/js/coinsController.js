app.controller('coinsController', function($scope, $http) {
    $scope.coins = [];
    $scope.newCoin = {};
    $scope.matrix = {};
    $scope.total = 0;

    $scope.getCoins = function() {
	    $http.get('/coins')
	    .success(function(response){
	        $scope.coins = response;
	    }).error(function(error){
	        alert("error" + error);
	    });
    };

    $scope.updateCoin = function(coin) {
	    $http.put('/coins/' + coin.name, coin, {"headers": {'Content-Type' : 'application/json'}})
    	.success(function(data, status, headers, config){
    		$scope.getCoins();
    	})
    	.error(function(data, status, headers, config){
    		alert("Update failed!");
    	});
    };
    
    $scope.createCoin = function(coin) {
	    $http.post('/coins', coin, {"headers": {'Content-Type' : 'application/json'}})
    	.success(function(data, status, headers, config){
    		$scope.getCoins();
    		$scope.newCoin = {};
    	})
    	.error(function(data, status, headers, config){
    		alert("Create failed!");
    	});
    };
    
    $scope.deleteCoin = function(coin) {
	    $http.delete('/coins/'+coin.name)
    	.success(function(data, status, headers, config){
    		$scope.getCoins();
    	})
    	.error(function(data, status, headers, config){
    		alert("Delete failed!");
    	});
    };
    
    $scope.updatePrices = function() {
    	$http.get('https://poloniex.com/public?command=returnTicker')
	    .success(function(response){
	        $scope.prices = response;
	    	angular.forEach($scope.coins, function(coin){
	    		if($scope.prices['USDT_'+coin.name] != null)
	    		{
					coin.price = ((parseFloat($scope.prices['USDT_'+coin.name].highestBid) + parseFloat($scope.prices['USDT_'+coin.name].lowestAsk)) / 2).toFixed(6);
					coin.high24hr = parseFloat($scope.prices['USDT_'+coin.name].high24hr).toFixed(6);
					coin.low24hr = parseFloat($scope.prices['USDT_'+coin.name].low24hr).toFixed(6);
					coin.percent24hr = (((coin.price - coin.low24hr) / (coin.high24hr - coin.low24hr)) * 100).toFixed(0);
				}
    		});
    		$scope.updateCoinValues();
	    }).error(function(error){
	        alert("error" + error);
	    });
    };
    
    $scope.updateCoinValues = function() {
    	var max = 0.0;
    	$scope.total = 0;
    	angular.forEach($scope.coins, function(coin){
    		if(coin.price != null) {
				coin.value = (coin.price * coin.balance).toFixed(2);
				$scope.total = $scope.total + parseFloat(coin.value);
				if(coin.value > max) {
					max = coin.value;
				};
			}
		});
		$scope.total = $scope.total.toFixed(2);
		angular.forEach($scope.coins, function(coin){
			coin.size =  Math.round((coin.value * 30) / max);
		});
    };
    
    $scope.timeAnalysis = function() {
    	var matrix = [];
    	angular.forEach($scope.coins, function(coin){
			angular.forEach($scope.coins, function(coin2){
				if(coin.name != coin2.name) {
					matrix.push(coin.name+"/"+coin2.name);
					if($scope.prices[coin2.name+"_"+coin.name] != null) {
						$scope.matrix[coin.name+"/"+coin2.name] = {};
						$scope.matrix[coin.name+"/"+coin2.name].price = ((parseFloat($scope.prices[coin2.name+"_"+coin.name].highestBid) + parseFloat($scope.prices[coin2.name+"_"+coin.name].lowestAsk)) / 2).toFixed(6);
						
						$scope.time = $http.get('https://poloniex.com/public?command=returnChartData&currencyPair='+coin2.name+"_"+coin.name+"&period="+$scope.period+"&start="+$scope.start+"&end="+$scope.end)
				    	.success(function(response){
				    		var analysis = {"highMax":null, "lowMin":null};
				    		angular.forEach(response, function(r) {
				    			if(r.error == null) {
					    			if(analysis.highMax == null || r.high > analysis.highMax) {
					    				analysis.highMax = r.high;
					    			};
					    			if(analysis.lowMin == null || r.low < analysis.lowMin) {
					    				analysis.lowMin = r.low;
					    			};
			    				}
				    		});
							$scope.matrix[coin.name+"/"+coin2.name].highMax = parseFloat(analysis.highMax).toFixed(6);
				    		$scope.matrix[coin.name+"/"+coin2.name].lowMin = parseFloat(analysis.lowMin).toFixed(6);
				    		$scope.matrix[coin.name+"/"+coin2.name].percent = (($scope.matrix[coin.name+"/"+coin2.name].price - analysis.lowMin) / (analysis.highMax - analysis.lowMin) * 100).toFixed(0);
				    	}).error(function(error){
					        alert("error" + error);
				    	});
					}
				};
			});
		});

		angular.forEach(matrix, function(pair){
			
		});
    };

    $scope.daysChange = function() {
    	$scope.start = $scope.end - ($scope.days * 86400);
    };

    $scope.getCoins();
    $scope.start = Math.round(new Date() / 1000 - (86400 * 14));
    $scope.end = Math.round(new Date() / 1000);
    $scope.days = ($scope.end - $scope.start) / 86400;
    $scope.period = 14400;
});
