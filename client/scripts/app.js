var taskData;

var app = angular.module('formApp', []);
app.controller('formController', ['$scope', '$http', function($scope, $http){

    // places a get call to the api and sends over taskData for DOM updating.
    // () makes it execute on page load.
    $scope.getInfo = function(){
        $http.get('/api/todos').then(function(res){
            $scope.taskData = res.data;
        });
    }();

    // posts a new task to the api with the text as the only thing being sent over.
    // (how does the complete value get in?) Updates dom on response.
    $scope.createTask = function(){
        $http.post('/api/todos', {'text': $scope.item}).then(function(res){
            $scope.taskData = res.data;
        });
    };

    // deletes using taskId to find the row and the updates dom.
    $scope.deleteTask = function(taskId){
        $http.delete('/api/todos/' + taskId).then(function(res){
            $scope.taskData = res.data;
        });
    };

    // changes the boolean of complete and updates dom. apparently all 3 columns' data are needed to change one.
    $scope.completeTask = function(taskId, text, completeStatus){
        var done = !completeStatus;
        $http.put('/api/todos/' + taskId, {id: taskId, text: text, complete: done}).then(function(res){
            $scope.taskData = res.data;
        });
    };

}]);