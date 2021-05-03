/* global jQuery:false */
/* global BOOKLOVERS_STORAGE:false */

// Theme-specific GoogleMap styles
//=====================================================
function booklovers_theme_googlemap_styles($styles) {
	"use strict";
	// Put here your theme-specific code to add GoogleMap styles
	// It will be called before GoogleMap init when page is loaded
	$styles['greyscale'] = [
    	{ "stylers": [
        	{ "saturation": -100 }
            ]
        }
	];
	$styles['inverse'] = [
		{ "stylers": [
			{ "invert_lightness": true },
			{ "visibility": "on" }
			]
		}
	];
	$styles['dark'] = [
		{ "featureType": "landscape",
		  "stylers": [
		  	{ "invert_lightness": true },
		  	{ "saturation":-100},
		  	{ "lightness":65},
		  	{ "visibility":"on"}
		  	]
		},
		{ "featureType": "poi",
		  "stylers": [
		  	{ "saturation":-100},
		  	{ "lightness":51},
		  	{ "visibility":"simplified"}
		  	]
		},
		{ "featureType": "road.highway",
		  "stylers": [
		  	{ "saturation":-100},
		  	{ "visibility":"simplified"}
		  	]
		},
		{ "featureType": "road.arterial",
		  "stylers": [
		  	{ "saturation":-100},
		  	{ "lightness":30},
		  	{ "visibility":"on"}
		  	]
		},
		{ "featureType": "road.local",
		  "stylers": [
		  	{ "saturation":-100},
		  	{ "lightness":40},
		  	{ "visibility":"on"}
		  	]
		},
		{ "featureType": "transit",
		  "stylers": [
		  	{ "saturation":-100},
		  	{ "visibility":"simplified"}
		  	]
		},
		{ "featureType":"administrative.province",
		  "stylers": [
		  	{ "visibility":"off"}
		  	]
		},
		{ "featureType":"water",
		  "elementType": "labels",
		  "stylers": [
		  	{ "visibility":"on"},
		  	{ "lightness":-25},
		  	{ "saturation":-100}
		  	]
		},
		{ "featureType":"water",
		  "elementType":"geometry",
		  "stylers": [
		  	{ "hue":"#ffff00"},
		  	{ "lightness":-25},
		  	{ "saturation":-97}
		  	]
		}
	];
	$styles['simple'] = [
    	{ stylers: [
        	{ hue: "#00ffe6" },
            { saturation: -20 }
			]
		},
		{ featureType: "road",
          elementType: "geometry",
          stylers: [
			{ lightness: 100 },
           	{ visibility: "simplified" }
            ]
		},
		{ featureType: "road",
          elementType: "labels",
          stylers: [
          	{ visibility: "off" }
            ]
		}
	];
	return $styles;
}
