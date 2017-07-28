angular.module("consumerProductSection", ['deepBlue.services'])

.controller("ProductCtrl", function($scope, $state, $firebaseArray, CartService){


    $scope.cart = CartService.loadCart();

    
  $scope.addToCart = function(product){

    $scope.cart.products.push(product);
    console.log($scope.cart.products)
    console.log(product)
    
    
    CartService.saveCart($scope.cart);
    
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