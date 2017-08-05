angular.module("orderSection", ['deepBlue.services'])

.controller("OrderCtrl", function($scope, $state, $firebaseArray, CartService){

    $scope.orders = []


      $scope.$on("$ionicView.enter", function(){

         //get local storage
  var arrOrders = JSON.parse(window.localStorage.getItem("orders"))

    if(arrOrders != undefined)
      {
  $scope.orders = arrOrders
  console.log($scope.orders)
      }

  })

 
       
    })

