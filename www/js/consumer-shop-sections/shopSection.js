angular.module("consumerStoreSections", [])

.controller('ShopSectionsCtrl', function($scope, $state, $firebaseArray){

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