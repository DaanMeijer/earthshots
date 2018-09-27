      //
      // Streetview Map
      //

      function svinitialize(randCoord) {

        console.log('No peaking!');

        //
        // Get Coords
        //
        // Yeah this is a bit gross, right? Why not do it randomly? Because in geoguessr while it was great having random coords, some of the randomized points it picked sucked. I didn't
        // want that at all, thus the manual lat/longs. It's fairly easy to build the random lat long coords based if the selected coords have a street view available
        // however detection for that is a bit CPU intensive. In the mean time, just throw more coords into this array - it ain't that bad!
        //





        window.currentCoord = randCoord;

        // Do streetview
        var googleCoord = new google.maps.LatLng(randCoord.lat, randCoord.lng);

        
        var streetViewService = new google.maps.StreetViewService();
        var STREETVIEW_MAX_DISTANCE = 1000;

        streetViewService.getPanoramaByLocation(googleCoord, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
            if (status === google.maps.StreetViewStatus.OK) {

              // We have a streetview pano for this location, so let's roll
              var panoramaOptions = {
                position: googleCoord,
                addressControl: false,
                linksControl: false,
                pov: {
                  heading: 270,
                  zoom: 1,
                  pitch: -10
                },
                visible: true,
                showRoadLabels: false

              };
              var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);

            } else {
                // no street view available in this range, or some error occurred
                alert('Streetview is not available for this location :( Mind telling us that you saw this?');
            }
        });

      };