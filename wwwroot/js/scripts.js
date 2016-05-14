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
    // tasksDB = JSON.stringify(tasks)
    $http.post('api/values', this.tasks)
  /* $.ajax('api/values', {
    method: 'POST',
    datatype: 'json',
    data: $.param(tasks, true),
    success: function () {}
    })*/
  // window.localStorage.setItem('tasks', tasksDB)
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
  /*
  var $formNew = $('#formNewTask')
  var $txtNew = $('#textNewItem')
  var $groupPend = $('#group-pending')
  // var tasksDB = window.localStorage.getItem('tasks')
  var tasksDB = false
  $.ajax('api/values', {
    dataType: 'json',
    async: false,
    success: function (data) { tasksDB = data }
  })
  for (var loadedTask in tasks.Pending) {
    $groupPend.append($newTask(tasks.Pending[loadedTask]))
  }
  for (loadedTask in tasks.Done) {
    var taskD = $newDoneTask(tasks.Done[loadedTask])
    $groupDone.append(taskD)
  }

  function $newTask (taskDesc) {
    var linha =
    '<div class="list-group-item">'
    linha += '  <input type="checkbox">'
    linha += '  <span id="taskDesc">'
    linha += taskDesc
    linha += '</span>'
    linha += '  <div class="btn-group pull-right" role="group" aria-label="...">'
    linha += '    <button type="submit" class="btn btn-default">'
    linha += '      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'
    linha += 'Editar'
    linha += '    </button>'
    linha += '    <button type="submit" class="btn btn-danger">'
    linha += '      <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
    linha += '      Apagar'
    linha += '    </button>'
    linha += '  </div>'
    linha += '</div>'
    var $linhaNoDom = $(linha)
    $linhaNoDom.find('.btn:contains("Editar")').click(function () {
      $txtNew.val(taskDesc)
      $linhaNoDom.find('.btn-danger:contains("Apagar")').click()
    })
    $linhaNoDom.find('.btn-danger').click(function () {
      if ($(this).closest('.list-group')[0] === $groupPend[0]) {
        tasks.Pending.splice(tasks.Pending.indexOf(taskDesc), 1)
      } else {
        tasks.Done.splice(tasks.Done.indexOf(taskDesc), 1)
      }
      $linhaNoDom.remove()
      persistTasks()
    })
    $linhaNoDom.find('input').click(function () { // checkbox
      $(this).parent().toggleClass('disabled')
      if ($(this).closest('.list-group')[0] === $groupPend[0]) {
        $groupDone.prepend($linhaNoDom)
        $(this).parent().find('#taskDesc').css('text-decoration', 'line-through')
      } else {
        $groupPend.prepend($linhaNoDom)
        $(this).parent().find('#taskDesc').css('text-decoration', '')
        tasks.Done.splice(tasks.Done.indexOf(taskDesc), 1)
        tasks.Pending.unshift(taskDesc)
      }
      persistTasks()
    })
    return $linhaNoDom
  }

  function $newDoneTask (taskDesc) {
    var linha =
    '<div class="list-group-item disabled">'
    linha += '  <input type="checkbox" checked="true">'
    linha += '  <span id="taskDesc" style="text-decoration: line-through;" >'
    linha += taskDesc
    linha += '</span>'
    linha += '  <div class="btn-group pull-right" role="group" aria-label="...">'
    linha += '    <button type="submit" class="btn btn-default">'
    linha += '      <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'
    linha += 'Editar'
    linha += '    </button>'
    linha += '    <button type="submit" class="btn btn-danger">'
    linha += '      <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
    linha += '      Apagar'
    linha += '    </button>'
    linha += '  </div>'
    linha += '</div>'
    var $linhaNoDom = $(linha)
    $linhaNoDom.find('.btn:contains("Editar")').click(function () {
    })
    $linhaNoDom.find('.btn-danger').click(function () {
      if ($(this).closest('.list-group')[0] === $groupPend[0]) {
        tasks.Pending.splice(tasks.Pending.indexOf(taskDesc), 1)
      } else {
        tasks.Done.splice(tasks.Done.indexOf(taskDesc), 1)
      }
      $linhaNoDom.remove()
      persistTasks()
    })
    $linhaNoDom.find('input').click(function () { // checkbox
      $(this).parent().toggleClass('disabled')
      if ($(this).closest('.list-group')[0] === $groupPend[0]) {
        $groupDone.prepend($linhaNoDom)
        $(this).parent().find('#taskDesc').css('text-decoration', 'line-through')
        tasks.Pending.splice(tasks.Pending.indexOf(taskDesc), 1)
        tasks.Done.unshift(taskDesc)
      } else {
        $groupPend.prepend($linhaNoDom)
        $(this).parent().find('#taskDesc').css('text-decoration', '')
        tasks.Done.splice(tasks.Done.indexOf(taskDesc), 1)
        tasks.Pending.unshift(taskDesc)
      }
      persistTasks()
    })
    return $linhaNoDom
  }

  function addTask (taskDesc) {
    $groupPend.prepend($newTask(taskDesc))
    tasks.Pending.unshift(taskDesc)
    persistTasks()
  }
  $txtNew.keypress(function (e) {
    if (e.which === 13) {
      $formNew.submit()
      return false
    }
  })

  $formNew.submit(function (evento) {
    console.log('submit')
    evento.preventDefault()
    var flagIgual = false
    for (var t in tasks.Pending) {
      if (tasks.Pending[t] === $txtNew.val()) {
        flagIgual = true
        window.alert('Tarefa já existe')
      }
    }
    for (var td in tasks.Done) {
      if (tasks.Done[td] === $txtNew.val()) {
        flagIgual = true
        window.alert('Tarefa já foi concluída')
      }
    }
    if (flagIgual === false) {
      addTask($txtNew.val())
      $txtNew.val('')
      $txtNew.blur()
    }
  })

})

*/
