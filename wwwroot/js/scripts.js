// Empty JS for your own code to be here
var app = angular.module('Procrastinator', [])
app.config(function ($httpProvider) {
  $httpProvider.defaults.transformRequest = function (data) {
    if (data === undefined) {
      return data
    }
    return $.param(data, true)
  }
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
})
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter)
        })

        event.preventDefault()
      }
    })
  }
})
app.controller('procrastinatorCtrl', function ($scope, $http) {
  var tasksDB = false
  $http.get('api/values').then(function (response) {
    tasksDB = response.data
    $scope.tasks = tasksDB || {'Pending': [], 'Done': []}
  })
  $scope.persistTasks = function () {
    $http.post('api/values', this.tasks)
  }
  $scope.newTask = function (task) {
    var flagIgual = false
    for (var t in this.tasks.Pending) {
      if (this.tasks.Pending[t] === task) {
        flagIgual = true
        window.alert('Tarefa já existe')
      }
    }
    for (var td in this.tasks.Done) {
      if (this.tasks.Done[td] === task) {
        flagIgual = true
        window.alert('Tarefa já foi concluída')
      }
    }
    if (flagIgual === false) {
      this.tasks.Pending.unshift(task)
      this.persistTasks()
      // $txtNew.val('')
      // $txtNew.blur()
    }
  }
  $scope.checkTask = function (item) {
    this.tasks.Done.unshift(this.tasks.Pending.splice(item, 1)[0])
    this.persistTasks()
  }
  $scope.uncheckTask = function (item) {
    this.tasks.Pending.unshift(this.tasks.Done.splice(item, 1)[0])
    this.persistTasks()
  }
  $scope.editPend = function (item) {
    angular.element('#textNewItem').val(this.tasks.Pending[item])
    this.tasks.Pending.splice(item, 1)
  }
  $scope.editDone = function (item) {
    angular.element('#textNewItem').val(this.tasks.Done[item])
    this.tasks.Done.splice(item, 1)
  }
  $scope.deletePend = function (item) {
    this.tasks.Pending.splice(item, 1)
    this.persistTasks()
  }
  $scope.deleteDone = function (item) {
    this.tasks.Done.splice(item, 1)
    this.persistTasks()
  }
})
/*
This directive allows us to pass a function in on an enter key to do what we want.
 */

$(document).ready(function () {
  var $groupDone = $('#group-done')
  $('#btn-show-done').click(function () {
    $groupDone.slideToggle()
  })
})

