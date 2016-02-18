angular.module('termApp', [
  'ngAnimate',
  'ui.bootstrap'
  ])
    .controller('appController', function($scope, $http, fiveThousandFactory, $uibModal) {

    //RANDOM SAT WORD DIV -- this div will have a random SAT word and definition upon every new tab (or upon user click of "Generate new Random SAT word" button)

      //randomSATword is an object with 3 properties (word, type--aka part of speech--and definition). It is used for the Random SAT Word Div in the top left of the screen
      $scope.randomSATword = {
        word: "",
        type: "",
        definition: ""
      };

      //setRandomSATword sets randomSATword by getting a random word (and corresponding part of speech and definition) from fiveThousandFactory.topFiveThousandSATwords list of SAT words
      $scope.setRandomSATword = function(){
        console.log("setRandomSATword!");
        var randomNum = Math.floor(Math.random() * fiveThousandFactory.topFiveThousandSATwords.length);
        console.log("randomNum", randomNum);
        $scope.randomSATword = fiveThousandFactory.topFiveThousandSATwords[randomNum];
        console.log("$scope.randomSATword", $scope.randomSATword);
      }

      //addSATword adds the current displayed SAT word to the user's termList
      $scope.addSATword = function(){
        $scope.termList.push({term: $scope.randomSATword.word, definition: $scope.randomSATword.definition});
        $scope.saveLocal();
      };

    //RANDOM WORD FROM MY TERM LIST -- this div will have a random term and definition from the user's wordbank
      
      //termList is an array stored on the user's localStorage;
      $scope.termList = window.localStorage.terms ? JSON.parse(window.localStorage.terms) : [{term: "JavaScript", definition :"an object-oriented computer programming language commonly used to create interactive effects within web browsers."}];

      //random gets a random number based on the user's termList length -- this is used on the HTML file ({{termList[random]}}) -- this is set on page load and changed by currenTerm
      $scope.random = Math.floor(Math.random() * $scope.termList.length);

      //currenTerm changes random (to a different number)--this changes the random termList word & definition that is displayed in the top right div
      $scope.currentTerm = function(){
        $scope.random = Math.floor(Math.random() * $scope.termList.length);
      };
    
      //delete deletes the current random word form termlist that is displayed
      $scope.delete = function(){
          $scope.termList.splice($scope.random, 1);
          console.log("current term", $scope.termList[$scope.random]);
          $scope.saveLocal();
          $scope.currentTerm();
      };
    

    //USER ADDS USER-INPUTTED WORDS AND DEFINITIONS TO USER TERMLIST

      //This is the value in the input tag with ng-model = "termModel"
      $scope.termModel = '';

      //This is the value in the input tag with ng-model = "definitionModel"
      $scope.definitionModel = '';

      //This adds the values from the above input tags (if both aren't empty strings)
      $scope.submit = function() {
        if ($scope.termModel && $scope.definitionModel) {
          $scope.termList.push({term: $scope.termModel, definition: $scope.definitionModel});
          $scope.termModel = '';
          $scope.definitionModel = '';
          console.log($scope.termList);
          $scope.saveLocal();
        }
      };
    

    //DICTIONARY LOOKUP AND ADD DICITIONARY TERM

      //wordToLookup corresponds to the input tag with ng-model = "wordToLookup"; This is the word the user is searching for
      $scope.wordToLookup = "";

      //wordLookedup is an object of the word that the user has looked up; This is set by getDefinition
      $scope.wordLookedup = {
        word: "",
        definition: ""
      };

      //getDefinition is a function that pings the wornik API with the word in wordToLookup and sets the wordLookedup variable 
      $scope.getDefinition = function(){
        $http({
          method: 'GET',
          url: 'http://api.wordnik.com:80/v4/word.json/' + $scope.wordToLookup + '/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
        }).then(function(success){
          console.log("newtab.js|||line 49|||success[0].word", success.data[0].word);
          console.log("success", success);
          $scope.wordLookedup = {word: success.data[0].word, definition: success.data[0].text}
          $scope.wordToLookup = "";
          console.log("wordLookedup", $scope.wordLookedup);
        }, function(err){
          console.log(err);
        }) 
      }

      //addWordLookedup is a function that adds wordLookedup to the user's termlist; it is executed on a button click
      $scope.addWordLookedup = function(){
        $scope.termList.push({term: $scope.wordLookedup.word, definition: $scope.wordLookedup.definition});
        $scope.saveLocal();
        $scope.wordLookedup = {
          word: "",
          definition: ""
        };
      }

      //boolean that determines whether to show the button that adds wordLookedup to the user's term list
      //create later

    //HELPER FUNCTIONS

      //saveLocal saves the $scope.termList to the user's local storage; this is called in delete, addSATword and maybe other places;
      $scope.saveLocal = function(){
          localStorage.setItem("terms", angular.toJson($scope.termList));
      }

      //clearStorage clears the termList from the localStorage; It is for debugging purposes; the user will not have a way to call this function; 
      $scope.clearStorage = function(){
        localStorage.removeItem("terms");
        $scope.termList = [{term: "JavaScript", definition :"an object-oriented computer programming language commonly used to create interactive effects within web browsers."}];
      }

      //init runs all of the functions that we want to run upon a new tab opening
      $scope.init = function(){
        $scope.setRandomSATword();
      }

      //bullshit remove
      $scope.pleasework = function(){
        return true;
      }

    //MODALS -- FUNCTIONS AND VARIABLES THAT PERTAIN TO MODALS

      $scope.open = function (size) {

        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modalTemplate.html',
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

      };

    //RUN INIT
      $scope.init();
      

    });