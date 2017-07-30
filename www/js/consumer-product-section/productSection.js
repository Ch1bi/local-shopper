angular.module("consumerProductSection", ['deepBlue.services', 'firebase'])

.controller("ProductCtrl", function($scope, $state, $firebaseArray, CartService){

  //our signed in user
  var user = firebase.auth().currentUser
  //our database ref
  var database = firebase.database()

  //parent of the quantity model in productSection.html
  $scope.quantity = {}

 //counter to hold the place of the quantities in the quantity.num array in productSection.html
  var counter = 0
  

  $scope.cart = CartService.loadCart();

  $scope.addToCart = function(product){

    //create an empty object to be injected into our database
    var obj = {}

 
    //push our product object to the cart array
    $scope.cart.products.push(product)
    console.log(product)
    
    product.quantity = $scope.quantity.num[counter] 

    CartService.saveCart($scope.cart)

    console.log($scope.cart.products)
    
    //set the keys and values in our object
    obj[product.$id] = []
    obj[product.$id].push(parseInt(product.quantity))
    obj[product.$id].push(product.$value)
    
    

    //save to firebase database here
    database.ref('users/'+ user.uid + '/cart')
    .update(obj)

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

  var newList = []

  var theProducts = $firebaseArray(productRef)

  theProducts.$loaded(function(items){
    //we add a quantity property to each item
    items.forEach(function(val, idx){

      val.quantity = 0;
      parseInt(val.quantity)
      newList.push(val)
 
    })

    $scope.products = newList



  })

});






    }

})