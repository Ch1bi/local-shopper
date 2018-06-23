angular.module('consumerShop', ['deepBlue.services'])

// Shop controller.
.controller('ShopCtrl', function($scope,$state, $ionicActionSheet, BackendService, CartService, $firebaseArray) {



	//get reference to the stores in our database
  var storeRef = firebase.database().ref("stores")

  // In this example feeds are loaded from a json file.
  // (using "getProducts" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // products from a web service.
  
  //using the CartService to load cart from localStorage

   $scope.$on("$ionicView.enter", function(){


        $scope.getStores();
    })

	
$scope.getStores = function(){

$scope.stores = $firebaseArray(storeRef)

}

    //loads the sections of the store

    $scope.goToStoreDetail = function(index){
  
      $state.go("app.sectionDetail", {storeIndex: index})

    }


  $scope.cart = CartService.loadCart();

  $scope.doRefresh = function(){
      BackendService.getProducts()
      .success(function(newItems) {
        $scope.products = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning (not needed in this view)
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // private method to add a product to cart
  var addProductToCart = function(product){
    $scope.cart.products.push(product);
    CartService.saveCart($scope.cart);
  };

  // method to add a product to cart via $ionicActionSheet
  $scope.addProduct = function(product){
    $ionicActionSheet.show({
       buttons: [
         { text: '<b>Add to cart</b>' }
       ],
       titleText: 'Buy ' + product.title,
       cancelText: 'Cancel',
       cancel: function() {
          // add cancel code if needed ..
       },
       buttonClicked: function(index) {
         if(index == 0){
           addProductToCart(product);
           return true;
         }
         return true;
       }
     });
  };

  //trigger initial refresh of products
  $scope.doRefresh();

})