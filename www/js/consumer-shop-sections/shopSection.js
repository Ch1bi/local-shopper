angular.module("consumerStoreSections", [])

.controller('ShopSectionsCtrl', function($scope, $state, $firebaseArray){

    // $scope.categories = []

  var storeNum = $state.params.storeIndex

  $scope.goToProducts = function(index){


      $state.go('app.productSection',{productIndex: index, store:storeNum})
  }

  $scope.$on("$ionicView.enter", function(){


         $scope.getStoreDetail();
        //  var arrCats = JSON.parse(window.localStorage.getItem("categories"))

//             if(arrCats != undefined)
//       {
//   $scope.categories = arrCats
  
//       }
        
    })

    
    

    $scope.getStoreDetail = function(){

  var storeRef = firebase.database().ref("stores")  

  var theList = $firebaseArray(storeRef)

theList.$loaded(function (list) {

//gets the store info based on the index
var storeInfo =  theList[$state.params.storeIndex]

var storeName = storeInfo.$id


var sectionRef = firebase.database().ref("stores/"+storeName+"/sections")

 // we load the store sections
  $scope.sections = $firebaseArray(sectionRef)

});

    }

})