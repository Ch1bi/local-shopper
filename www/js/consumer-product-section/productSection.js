angular.module("consumerProductSection", ['deepBlue.services'])

.controller("ProductCtrl", function($scope, $state, $firebaseArray, CartService){

  $scope.quantity = {}
  var counter = 0
  

  $scope.cart = CartService.loadCart();

  $scope.addToCart = function(product){
    
    //counter to hold the place of the quantities in the quantity.num array in productSection.html
    
    //push our product object to the cart array
    $scope.cart.products.push(product)
    
    product.quantity = $scope.quantity.num[counter] 
    console.log(product.quantity) 
    console.log($scope.quantity.num[counter])   
    CartService.saveCart($scope.cart);
    counter++
    console.log("after increment " + counter)

    //toDo: Need to fix adding duplicate items. It currently come out as undefined
  }



  $scope.$on("$ionicView.enter", function(){

        $scope.getProducts();
    })

    $scope.getProducts = function(){

       
  var storeRef = firebase.database().ref("stores")  

  var theList = $firebaseArray(storeRef)

  theList.$loaded(function(list) {


  //gets the store info based on the index
var storeInfo =  theList[$state.params.store]

var storeName = storeInfo.$id

var productSections = storeInfo.sections

//get the keys of the sections
var keys = Object.keys(productSections)

//get the products based on section consumer tapped on
var selection = keys[$state.params.productIndex]

var productRef = firebase.database().ref("stores/" + storeName + "/sections/" +selection)

 // we load the store sections
  // $scope.products = $firebaseArray(productRef)
  var newList = []

  var theProducts = $firebaseArray(productRef)

  theProducts.$loaded(function(items){
    //we add a quantity property to each item
    items.forEach(function(val, idx){

      val.quantity = 0;
      newList.push(val)
 
    })

    $scope.products = newList



  })

});






    }

})