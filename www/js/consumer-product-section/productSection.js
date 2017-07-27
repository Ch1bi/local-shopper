angular.module("consumerProductSection", [])

.controller("ProductCtrl", function($scope, $state, $firebaseArray){

  $scope.quantity = 0;

  $scope.increaseAmount = function(){

    $scope.quantity ++
  }

  $scope.decreaseAmount = function(){

    $scope.quantity --
  }


  $scope.$on("$ionicView.enter", function(){

    // console.log("first", $state.params.productIndex)
    // console.log("second", $state.params.store)
    
        $scope.getProducts();
    })

    $scope.getProducts = function(){

       
  var storeRef = firebase.database().ref("stores")  

  var theList = $firebaseArray(storeRef)

  theList.$loaded(function(list) {


  //gets the store info based on the index
var storeInfo =  theList[$state.params.store]
console.log(storeInfo)

var storeName = storeInfo.$id

var productSections = storeInfo.sections

//get the keys of the sections
var keys = Object.keys(productSections)

//get the products based on section consumer tapped on
var selection = keys[$state.params.productIndex]

var productRef = firebase.database().ref("stores/" + storeName + "/sections/" +selection)

 // we load the store sections
  $scope.products = $firebaseArray(productRef)

});



    }

})