///<reference path="../libs/angular.js" />

angular.module("addressbook").controller("AddressBookCtrl", function AddressBookCtrl($scope, $routeParams, $filter) {
    "use strict";

    var addressbooks = $scope.addressbooks = [{
        id: 501,
        name: "Khali Zhang",
        location: "Shanghai",
        office: "C-103",
        checked: false,
        phone: {
            office: "x55778",
            cell: "650-353-1239",
            origincell: "650-353-1239"
        }
    }, {
        id: 502,
        name: "Glen Zhang",
        location: "Shanghai",
        office: "C-104",
        checked: false,
        phone: {
            office: "x55779",
            cell: "550-353-1239",
            origincell: "550-353-1239"
        }
    }, {
        id: 500,
        name: "Henry Chen",
        location: "Shanghai",
        office: "C-105",
        checked: false,
        phone: {
            office: "x55780",
            cell: "450-353-1239",
            origincell: "450-353-1239"
        }
    }];

    var deletedArr = [];

    $scope.editCellphone = function (addressbook) {
        $scope.editedAddressBook = addressbook;
    };

    $scope.doneEditing = function (addressbook) {
        $scope.editedAddressBook = null;
    }

    $scope.remove = function () {
        var del = addressbooks.filter(function (ab) {
            return ab.checked;
        });

        if (del.length == 0) {
            alert("please select the row first!");
        } else {
            deletedArr = deletedArr.concat(del);
        }

        $scope.addressbooks = addressbooks = addressbooks.filter(function (ab) {
            return !ab.checked;
        });
    };

    $scope.add = function () {
        $scope.addressbooks.push({
            id: "",
            name: "Khali Zhang",
            location: "Shanghai",
            office: "C-103",
            checked: false,
            phone: {
                office: "x55778",
                cell: "650-353-1239",
                origincell: "650-353-1239"
            },
            isNew: true
        });
    };

    $scope.update = function () {
        alert("please open console to observer updated/added data");

        // updated items
        console.log("updated", addressbooks.filter(function (ab) {
            return ab.phone.cell != ab.phone.origincell;
        }));

        // added items
        console.log("added", addressbooks.filter(function (ab) {
            return ab.isNew;
        }));

        // deleted items
        console.log("deleted", deletedArr.filter(function (ab) {
            return ab.id > 0;
        }));
    };

    $scope.soryColumn = "id";

    $scope.toggleSort = function (sc) {
        if ($scope.sortColumn === sc) {
            $scope.reverse = !$scope.reverse;
        }
        $scope.sortColumn = sc;
    };
});