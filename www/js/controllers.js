

//controllers are packed into a module
angular.module('deepBlue.controllers', ["firebase"])


.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) { 
    return $firebaseAuth();
  }
])

//top view controller
.controller('AppCtrl', function($scope, $state, $rootScope, $state, Auth,$ionicPopup,$ionicModal) {
  
  // #SIMPLIFIED-IMPLEMENTATION:
  // Simplified handling and logout function.
  // A real app would delegate a service for organizing session data
  // and auth stuff in a better way.
  // $rootScope.user = {};

  
$scope.createUser = function(data){

  $scope.data = {

    user: data.type,
    name: data.name,
    email: data.email,
    password:data.password
  }

  console.log($scope.data.user)
    //get reference to our database
    var database = firebase.database();

         // Create a new user
      Auth.$createUserWithEmailAndPassword($scope.data.email, $scope.data.password)

        .then(function(user) {
        //save user info here
         database.ref('users/'+ user.uid).set({

          email:$scope.data.email,
          "firstName" :$scope.data.name,
          "type": $scope.data.user
    })

          
     $ionicPopup.alert({
     title: 'Success!',
     template: "User Created!"
   })

   .then(function(){

     $state.go("app.login")
   })
           

      })
  
      .catch(function(error) {
        
        console.log(error)
        
         $ionicPopup.alert({
     title: 'Error',
     template: error.message
   });
        
          
        });

}

  $scope.logout = function(){
    $rootScope.user = {};
    $state.go('app.start')
  };

})

// This controller is bound to the "app.account" view
.controller('AccountCtrl', function($scope, $rootScope) {
  
  //readonly property is used to control editability of account form
  $scope.readonly = true;

  // #SIMPLIFIED-IMPLEMENTATION:
  // We act on a copy of the root user
  $scope.accountUser = angular.copy($rootScope.user);
  var userCopy = {};

  $scope.startEdit = function(){
    $scope.readonly = false;
    userCopy = angular.copy($scope.user);
  };

  $scope.cancelEdit = function(){
    $scope.readonly = true;
    $scope.user = userCopy;
  };
  
  // #SIMPLIFIED-IMPLEMENTATION:
  // this function should call a service to update and save 
  // the data of current user.
  // In this case we'll just set form to readonly and copy data back to $rootScope.
  $scope.saveEdit = function(){
    $scope.readonly = true;
    $rootScope.user = $scope.accountUser;
  };

})


.controller('LoginCtrl', function ($scope, $state, $ionicPopup,$rootScope) {

  $scope.doLogin = function() {
    
    //current signed in user
     var userId = firebase.auth().currentUser

    firebase.auth().signInWithEmailAndPassword(this.loginData.email, this.loginData.password)

    .then(function(){

      //Read the type of user, then send to correct UI

    var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
    console.log(snapshot.val())

    if(snapshot.val().type === "consumer"){

      $state.go("app.feed") 
    }

    // else if(snapshot.val().type === "business"){

    //     $state.go("owner.home") 
    // }
 
})


      console.log(user)
   

    })
    
    
    .catch(function(error) {

      console.log(error)

          $ionicPopup.alert({
     title: 'Error',
     template: error.message
   });
 
});

  };
  
})

.controller('LoginCtrl2', function ($scope, $state, $rootScope) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // This login function is just an example.
  // A real one should call a service that checks the auth against some
  // web service

  $scope.login = function(){
    //in this case we just set the user in $rootScope
    $rootScope.user = {
      email : "mary@ubiqtspaces.com",
      name : "Mary Ubiquitous",
      address : "Rue de Galvignac",
      city : "RonnieLand",
      zip  : "00007",
      avatar : 'sampledata/images/avatar.jpg'
    };
    //finally, we route our app to the 'app.shop' view
    $state.go('app.feed');
  };
  
})


// Feeds controller.
.controller('FeedsCtrl', function($scope, BackendService) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // In this example feeds are loaded from a json file.
  // (using "getFeeds" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // feeds from a web service.
  
  $scope.doRefresh = function(){
      BackendService.getFeeds()
      .success(function(newItems) {
        $scope.feeds = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // Triggering the first refresh
  $scope.doRefresh();

})

.controller('FeedsCtrl', function($scope, BackendService) {

  // #SIMPLIFIED-IMPLEMENTATION:
  // In this example feeds are loaded from a json file.
  // (using "getFeeds" method in BackendService, see services.js)
  // In your application you can use the same approach or load 
  // feeds from a web service.
  
  $scope.doRefresh = function(){
      BackendService.getFeeds()
      .success(function(newItems) {
        $scope.feeds = newItems;
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // Triggering the first refresh
  $scope.doRefresh();

})

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

.controller('ShopDetailCtrl', function($scope, $state, $firebaseArray){

  var storeNum = $state.params.storeIndex

  $scope.goToProducts = function(index){


      $state.go('app.productSection',{productIndex: index, store:storeNum})
  }

  $scope.$on("$ionicView.enter", function(){


        $scope.getStoreDetail();
    })

    $scope.getStoreDetail = function(){

  var storeRef = firebase.database().ref("stores")  

  var theList = $firebaseArray(storeRef)

theList.$loaded(function (list) {

//gets the store info based on the index
var storeInfo =  theList[$state.params.storeIndex]

var storeName = storeInfo.$id

// var storeSections = Object.keys(storeInfo.sections)
// console.log(storeSections.toString())

var sectionRef = firebase.database().ref("stores/"+storeName+"/sections")

 // we load the store sections
  $scope.sections = $firebaseArray(sectionRef)

});

    }

})

.controller("ProductCtrl", function($scope, $state, $firebaseArray){


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

var productRef = firebase.database().ref("stores/" + storeName + "/sections/" +selection )

 // we load the store sections
  $scope.products = $firebaseArray(productRef)

});



    }

})

// controller for "app.cart" view 
.controller('CartCtrl', function($scope, CartService, $ionicListDelegate) {
  
  // using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();
  
  // we assign getTotal method of CartService to $scope to have it available
  // in our template
  $scope.getTotal = CartService.getTotal;

  // removes product from cart (making in persistent)
  $scope.dropProduct = function($index){
    $scope.cart.products.splice($index, 1);
    CartService.saveCart($scope.cart);
    // as this method is triggered in an <ion-option-button> 
    // we close the list after that (not strictly needed)
    $ionicListDelegate.closeOptionButtons();

  }
})

.controller('CheckoutCtrl', function($scope, CartService, $state) {
  
  //using the CartService to load cart from localStorage
  $scope.cart = CartService.loadCart();
  $scope.getTotal = CartService.getTotal;

  $scope.getTotal = CartService.getTotal;

  // #NOT-IMPLEMENTED: This method is just calling alert()
  // you should implement this method to connect an ecommerce
  // after that the cart is reset and user is redirected to shop
  $scope.checkout = function(){
    alert("this implementation is up to you!");
    $scope.cart = CartService.resetCart();
    $state.go('app.shop')
  }

})