var infoWindow, map, vm;

var storesMarkers = [];
var stores = [{
        title: 'Tudy\'s Taqueria',
        location: {
            lat: 33.877217,
            lng: -117.581081
        },
        venueID: '4c6709bc7abde21e525b6568'
    },
    {
        title: 'La Mazorca',
        location: {
            lat: 33.876637,
            lng: -117.522898
        },
        venueID: '4bd06b70462cb713c045d807'
    },
    {
        title: 'Sombrero\'s Mexican Food',
        location: {
            lat: 33.84312,
            lng: -117.533418
        },
        venueID: '4b1ed0bef964a520f11f24e3'
    },
    {
        title: 'Burger Basket',
        location: {
            lat: 33.876894,
            lng: -117.582397
        },
        venueID: '4b833fe2f964a52023ff30e3'
    },
    {
        title: 'Super Taco',
        location: {
            lat: 33.876841,
            lng: -117.567868
        },
        venueID: '4c055a89f423a593d7dfd216'

    },
    {
        title: 'Santana\'s Mexican Food',
        location: {
            lat: 33.867562,
            lng: -117.544551
        },
        venueID: '5019e0b6e4b02d5a4aede9c3'
    }
];

var requestToFourSquare = function(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 2100)
    //Foursquare IDs
    var clientID = 'PRWKLHKQ0KYRZ2W34ACVYLSEO3RW2RORPECMNDHQJABFSSEU';
    var clientSecret = 'D5Q0URJ4JXUJAMTNBBYIW0IUY2ARC352DWNNNWO1OCMQOWO5';
    var apiURL = 'https://api.foursquare.com/v2/venues/';
    var foursquareVersion = '20170603';
    var foursquareVenueID = marker.id;

    var foursquareURL = apiURL + foursquareVenueID + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=' + foursquareVersion;

    $.ajax({
        type: "GET",
        url: foursquareURL,
        async: false,
        dataType: "jsonp",
        success: function(data) {

            var foursquareLikes = data.response.venue.likes.count;
            var foursquareName = data.response.venue.name;
            var foursquareRating = data.response.venue.rating;
            if (foursquareRating = "undefined") {
                foursquareRating = "Foursquare Rating Not Available";
            }
            console.log(data);

            infoWindow.setContent(foursquareName + "</br>" + "Rating: " + foursquareRating + "</br>" + "Likes: " + foursquareLikes);
            infoWindow.open(map, marker);
        }
    });
}


function initMap() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.875119,
            lng: -117.566671
        },
        zoom: 14
    });

    //stores length
    var storesLength = stores.length;
    infoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < storesLength; i++) {

        var position = stores[i].location;
        var name = stores[i].title;
        var storeID = stores[i].venueID;

        //marker creation for each store
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            id: storeID,
            name: name,
            animation: google.maps.Animation.DROP
        })

        //push each marker to 
        storesMarkers.push(marker);

        //Attach event listener to each marker 
        marker.addListener('click', (function(marker) {
            return function() {
                requestToFourSquare(marker);
            }
        })(marker));
    }
    //will instantiate view model
    vm = new ViewModel();
    ko.applyBindings(vm);
}

//Need to understand how this filter code works
var ViewModel = function() {
    var self = this;
    self.filter = ko.observable("");
    self.searchBar = ko.computed(function() {
        infoWindow.close();
        var locations = ko.observableArray();
        storesMarkers.forEach(function(marker) {
            console.log(marker.name);
            console.log(self.filter());
            if (marker.name.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0) {
                locations.push(marker);
                marker.setVisible(true);
            } else marker.setVisible(false);
        });
        return locations;
    });
    this.select = function(marker) {
        requestToFourSquare(marker);
    }
}