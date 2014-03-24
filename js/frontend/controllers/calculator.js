/**
 * @fileOverview CalculatorCtrl angular controller
 */

define(['./module', 'darkwallet', 'frontend/services', 'util/fiat'], function (controllers, DarkWallet, Services, FiatCurrencies) {
  'use strict';
  controllers.controller('CalculatorCtrl', ['$scope', function($scope) {
  var firstTime = true;
  var walletService = DarkWallet.service().getWalletService();
  $scope.calculator = {
     amount: 1,
     converted: 0,
     amountFocused: false,
     convertedFocused: false
  };

  // Set the currency icon
  var initCurrencyIcon = function() {
    var identity = DarkWallet.getIdentity();
    var fiat = identity.settings.fiatCurrency;
    var supportedFiat = ['EUR', 'JPY', 'TRY', 'KRW', 'RUB', 'GBP', 'USD', 'INR'];
    var isSupported = supportedFiat.join(' ').indexOf(fiat) >= 0;
    $scope.currencyClass = isSupported ? 'fa-' + fiat.toLowerCase() : 'fa-money';
  }

  // Wallet service, connect to get notified about identity getting loaded.
  Services.connectNg('wallet', $scope, function(data) {
    if (data.type == 'ready') {
      initCurrencyIcon();
    }
  });

  // Convert CRYPTO to FIAT
  $scope.$watch('calculator.amount', function() {
    var identity = DarkWallet.getIdentity();
    if (!firstTime && !$scope.calculator.amountFocused) {
        return;
    }
    firstTime = false;
    if (!walletService.rates.hasOwnProperty(identity.settings.fiatCurrency)) {
        $scope.calculator.converted = 'no rates';
        return;
    }
    var result = $scope.calculator.amount*walletService.rates[identity.settings.fiatCurrency];
    if (isNaN(result)) {
        $scope.calculator.converted = '';
    } else {
        $scope.calculator.converted = result.toFixed(2);
    }
  });

  // Convert FIAT to CRYPTO
  $scope.$watch('calculator.converted', function() {
    var identity = DarkWallet.getIdentity();
    if (!$scope.calculator.convertedFocused) {
        return;
    }
    if (!walletService.rates.hasOwnProperty(identity.settings.fiatCurrency)) {
        return;
    }
    var result = $scope.calculator.converted/walletService.rates[identity.settings.fiatCurrency];
    if (isNaN(result)) {
        $scope.calculator.amount = '';
    } else {
        $scope.calculator.amount = result.toFixed(8);
    }
  });

}]);
});