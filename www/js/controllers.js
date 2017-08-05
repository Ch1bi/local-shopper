

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
          "type": $scope.data.user,
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

  $scope.saveEdit = function(accountUser){
   
    $scope.accountUser = {

      email: accountUser.email,
      store: accountUser.store,
      zip: accountUser.zip
    }

    console.log($scope.accountUser)
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

.controller('CheckoutCtrl', function($scope, $ionicPopup, CartService, $state) {

  
  
  //using the CartService to load cart from localStorage
  var orders = {}
   var createdOrders = []
  $scope.cart = CartService.loadCart();
  $scope.getTotal = CartService.getTotal;

  $scope.getTotal = CartService.getTotal;

  orders["cart"] = $scope.cart
  orders["total"] = $scope.getTotal
  createdOrders.push(orders)
  
  localStorage.setItem("orders",JSON.stringify(createdOrders));

  // #NOT-IMPLEMENTED: This method is just calling alert()
  // you should implement this method to connect an ecommerce
  // after that the cart is reset and user is redirected to shop
  $scope.checkout = function(){
    // alert("Order successful!");
    showPopup();
    $scope.cart = CartService.resetCart();
    //delete cart in database and send to business side
    $state.go('app.feed')
  }

  function showPopup(){

       $ionicPopup.alert({
     title: 'Checkout',
     template: 'Order Placed!'

   });


  }

})

.controller('inventoryCtrl', function($scope, $state, $ionicPopup, $ionicModal, $firebaseArray) {

  function showAlert(){

    $ionicPopup.alert({
     title: 'Add Inventory',
     template: 'Inventory Created!'

   });
       $scope.modal.hide()
   $state.go("business.inventory")

  }

    $scope.removeInv = function(index){
    
    
 $scope.categories = JSON.parse(localStorage.getItem("categories"))

 $scope.categories.splice(index, 1);

 localStorage.setItem("categories",JSON.stringify($scope.categories));

  }

  $scope.categories = []
  // $scope.itemName = []
  // $scope.products = []
  //get references to our database
  // var user = firebase.auth().currentUser.uid
  // var database = firebase.database().ref("users/" + user)
  // var storeRef = firebase.database().ref("stores")
  
  // var signedInUser = ""

    //javascript for modal
    $ionicModal.fromTemplateUrl("templates/business/modal.html", {
    scope: $scope,
    animation: "slide-in-up"
  })
  
  .then(function(modal){
    $scope.modal = modal;

  });

    $scope.openModal = function() {
    $scope.modal.show();
  };
  //end javascript for modal

  //when we enter the inventory page this is lauched
     $scope.$on("$ionicView.enter", function(){

          //get signed in user 
        //   var userList = $firebaseArray(database)

        // userList.$loaded(function(list){

        //   signedInUser = list[1].$value
   
          
        // })

  //       var cats = JSON.parse(window.localStorage.getItem("categories"))

  //         if(cats != undefined)
  //     {
  // $scope.categories = cats
  // console.log(cats)
  //     }


        

    })

    //end scope.on code

  //when add item button is clicked, items are added to owner store
  $scope.addItem = function(add) {
    
    var obj = {}

    $scope.add = {
      category: add.category,
      thing: add.name,
      price: add.price
    }

    obj.category = $scope.add.category
    obj.item = $scope.add.thing
    obj.price = $scope.add.price
    
    $scope.categories.push(obj)
     
  
     
    window.localStorage.setItem("categories", JSON.stringify($scope.categories))

    

    console.log(window.localStorage.getItem("categories", JSON.stringify($scope.categories)))

      showAlert()
  
    
      // var store;
    //  var theList = $firebaseArray(storeRef)

        // theList.$loaded(function(list){

        //   console.log(list)
        //   list.forEach(function(val){

        //     //if value[0] == our user then get the store name and append data!
        //     if(val[0] == signedInUser){

        //       store = val.$id
        //     var userStore = firebase.database().ref("stores/"+store)

        //     var category = "$scope.add.category"
        //     var item = $scope.add.item
        //     var price = $scope.add.price
        //     //save data to store here
        //     var obj = {}
        //     var data = {

        //       cat:{
              
        //         item: price

        //       }

        //     }

        //     obj["sections"] = data

        //     userStore.update(obj)


        //     }
       
        //   })

      
        // })

      

  }

  $scope.goToProducts = function(){


  }
 })