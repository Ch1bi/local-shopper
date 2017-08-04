

angular.module('deepBlue', ['ionic', 'ionic-material', 'loginMod', 'consumerShop', 'consumerStoreSections','deepBlue.controllers', 'consumerProductSection', 'businessAddStores', 'deepBlue.services'])

.run(function($ionicPlatform, $rootScope, $timeout, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})

.config(function($stateProvider, $urlRouterProvider) {

  /*

    Here we setup the views of our app.
    In this case:
    - feed, account, shop, checkout, cart will require login
    - app will go to the "start view" when launched.

    #IMPLEMENTATION-DETAIL: views that require authorizations have an
    "auth" key with value = "true".

  */
  
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  // .state('app.start', {
  //   url: '/start',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/shared/start.html'
  //     }
  //   }
  // })

  .state('app.login', {
    url: '/login',
    cached : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/shared/login.html',
        controller : 'LoginCtrl'
      }
    }
  })

  .state('app.login2', {
    url: '/login',
    cached : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/login2.html',
        controller : 'LoginCtrl2'
      }
    }
  })

  .state('app.forgot', {
    url: '/forgot',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgot.html'
      }
    }
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller : 'AppCtrl'
      }
    }
  })

  .state('app.account', {
      url: '/account',
      data : { auth : true },
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html',
          controller : 'AccountCtrl'
        }
      }
  })

  .state('app.feed', {
    url: '/feed',
    data : { auth : true },
    views: {
      'menuContent': {
        templateUrl: 'templates/feed.html',
        controller : 'FeedsCtrl'
      }
    }
  })

  .state('app.storehome', {
    url: '/storehome',
    data : { auth : true },
    views: {
      'menuContent': {
        templateUrl: 'templates/storehome.html',
        controller : 'FeedsCtrl'
      }
    }
  })

  .state('app.shop', {
    url: '/shop',

    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/consumer/shop.html',
        controller : 'ShopCtrl'
      }
    }
  })

   .state('app.sectionDetail', {
    url: '/sections/:storeIndex',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/consumer/storeSections.html',
        controller : 'ShopSectionsCtrl'
      }
    }
  })


     .state('app.productSection', {
    url: '/productSection',
    params:{'productIndex':null, 'store': null},
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/consumer/productSection.html',
        controller : 'ProductCtrl'
      }
    }
  })


  .state('app.cart', {
    url: '/cart',
    data : { auth : true },
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/cart.html',
        controller : 'CartCtrl'
      }
    }
  })

  .state('app.checkout', {
    url: '/checkout',
    data : { auth : true },
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/checkout.html',
        controller : 'CheckoutCtrl'
      }
    }
  })

  .state('business', {
    url: '/business',
    abstract: true,
    templateUrl: 'templates/business/home.html',
    controller: 'AppCtrl'
  })


   .state('business.account', {
    url: '/account',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/business/account.html',
        controller : 'AccountCtrl'
      }
    }
  })

    .state('business.stores', {
    url: '/stores',
    views: {
      'menuContent': {
        templateUrl: 'templates/business/add-store.html',
        controller : 'AddStoresCtrl'
      }
    }
  })

  .state('business.inventory', {
    url: '/inventory',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/business/inventory.html',
        controller : 'inventoryCtrl'
      }
    }
  })

  .state('business.orders', {
    url: '/orders',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/business/orders.html',
        controller : 'ShopDetailCtrl'
      }
    }
  })
  
  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');

});
