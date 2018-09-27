 $(document).ready(function() {
   //
   // Setup
   //

   var round = 1;
   var points = 0;
   var roundScore = 0;
   var totalScore = 0;
   ranOut = false;
   var distance;

   //
   //  Init maps
   //
   //
   // svinitialize();
   // mminitialize();
   //
   // //
   // // Scoreboard & Guess button event
   // //
   //
   // // Init Timer
   // resetTimer();


   // End of round continue button click
   $('#roundEnd').on('click', '.closeBtn', function() {
     $('#roundEnd').fadeOut(500);

     $('body').trigger('round start');

   });


   // End of game 'play again' button click
   $('#endGame').on('click', '.playAgain', function() {
     window.location.reload();
   });

   //
   // Functions
   //

   function endRound(roundData) {

      var distance = roundData.distance;

     round++;
     if(ranOut === true) {
       roundScore = 0;
     } else {
       roundScore = points;
       totalScore = totalScore + points;
     }

     $('.round').html('Current Round: <b>' + round + '/5</b>');
     $('.roundScore').html('Last Round Score: <b>' + roundScore + '</b>');
     $('.totalScore').html('Total Score: <b>' + totalScore + '</b>');

     // If distance is undefined, that means they ran out of time and didn't click the guess button
     if(!distance) {
       $('#roundEnd').html('<p>Round lost</p>');
       $('#roundEnd').fadeIn();

     } else {
        $('#roundEnd').html('<p>Your guess was<br/><strong><h1>' + distance + '</strong>km</h1> away from the actual location.</p><div id="roundMap"></div>' + (roundData.winner ? '<p>You won this round</p>' : '<p>You lost this round</p>'));
        $('#roundEnd').fadeIn();
        rminitialize();
     }

     $('#points').html(roundData.points);

     // Reset Params
     window.guessLatLng = '';
     ranOut = false;

   }

     $(document).on('round.end', function(event, data){
         endRound(data);
     });


   function endGame() {

     roundScore = points;
     totalScore = totalScore + points;

     $('#miniMap, #pano, #guessButton, #scoreBoard').hide();
     $('#endGame').html('');
     $('#endGame').fadeIn(500);

     rminitialize();

     // We're done with the game
     window.finished = true;
   }
 });
