
( function () {
	'use strict';

 angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
function foundItems() {
	var ddo={
		templateUrl: 'listItem.html',
		scope: {
				foundItem: '<',
				onRemove: '&',
				search: '<'
				},
		controller: NarrowItDownDirectiveController,
    	controllerAs: 'cntrl',
    	bindToController: true
	};
	return ddo;
}
function NarrowItDownDirectiveController() {
	var cntrl=this;
	cntrl.nothing = function () {
    	if(cntrl.foundItem.length==0)
    		return true;
    	if(cntrl.search===""){
    		cntrl.foundItem=[];
    		return true;}
    return false;
  };
}
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
	var ctrl=this;
	ctrl.searchTerm="";
	ctrl.callFunc = function () {

	 var promise=MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
	 promise.then(function (result) {
	 	ctrl.found=result;
	 });
	};
	ctrl.removeItem = function (itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };
}
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService( $http , ApiBasePath) {

	var service=this;
	service.getMatchedMenuItems=function(searchTerm) {
		return $http({method: "GET",
                      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
                  	}).then(function (result) {

					service.foundItems=result.data.menu_items;
					for (var i = service.foundItems.length - 1; i >= 0; i--) {
						if((service.foundItems[i].description.toLowerCase()).search(searchTerm.toLowerCase())==-1)
							service.foundItems.splice(i,1);
					}
					return service.foundItems;
				});
	};
	service.removeItem = function (itemIndex) {
    service.foundItems.splice(itemIndex, 1);
  };

}

})();
