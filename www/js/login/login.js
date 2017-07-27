angular.module('loginMod', [])

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

    else if(snapshot.val().type === "business"){

        $state.go("business.home") 
    }
 
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
