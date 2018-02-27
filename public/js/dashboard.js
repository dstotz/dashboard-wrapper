var dashboardRunning = false;
var dashboardCycleInterval = 120000;
var refreshCycleInterval = 7200000;
var animationInterval = 500;
var autoResumeInterval = 900000;

var autoRefreshTimer = setInterval(refreshPage, refreshCycleInterval);
var dashboardTimer = null;
var autoResumeTimer = null;
var loadedDashboards = [];

function showDashboard(dashboardId) {
  buttonId = dashboardId.replace('dashboard', 'button');
  $(".dashboard-iframe").hide(animationInterval);
  $("#" + dashboardId).show(animationInterval);
  setPrimaryButton(buttonId);
  reloadIfNeeded(dashboardId);
  hideGeckoBoardBrandingBar();
}

function reloadIfNeeded(dashboardId) {
  if(!loadedDashboards.includes(dashboardId)) {
    var iframe = $('#' + dashboardId + ' iframe')[0]
    iframe.src = iframe.src
    loadedDashboards.push(dashboardId)
  }
}

function setPrimaryButton(buttonId) {
  $(".dashboard-button").removeClass('active-button').addClass('inactive-button');
  $(".dashboard-button span").removeClass('active-text').addClass('inactive-text');
  $("#" + buttonId).removeClass('inactive-button').addClass('active-button');
  $("#" + buttonId + " span").removeClass('inactive-text').addClass('active-text');
}

function handleDashboardButtonPress(buttonId) {
  var dashboardId = buttonId.replace("button", "dashboard");
  showDashboard(dashboardId);
}

$(function() {
  $(".dashboard-button").click(function() {
    handleDashboardButtonPress(this.id);
  });
});

function currentDashboardButtonElementIndex(currentActiveButtonId) {
  var currentIndex = null;
  $(".dashboard-button").each(function (index, value) {
    if (currentActiveButtonId == value.id) { currentIndex = index; }
  });
  return currentIndex;
}

function nextDashboardIdFromActiveButton(currentActiveButtonId) {
  var currentIndex = currentDashboardButtonElementIndex(currentActiveButtonId);
  var nextIndex = null;
  lastDashboardIndex = $('.dashboard-button').length - 1;
  if (currentIndex == lastDashboardIndex) {
    nextIndex = 0;
  } else {
    nextIndex = currentIndex + 1;
  }
  return $('.dashboard-button')[nextIndex].id;
}

function previousDashboardIdFromActiveButton(currentActiveButtonId) {
  var currentIndex = currentDashboardButtonElementIndex(currentActiveButtonId);
  var previousIndex = null;
  lastDashboardIndex = $('.dashboard-button').length - 1;
  if (currentIndex === 0) {
    previousIndex = lastDashboardIndex;
  } else {
    previousIndex = currentIndex - 1;
  }
  return $('.dashboard-button')[previousIndex].id;
}

function selectNextDashboard() {
  currentActiveButtonId = $('.dashboard-button.active-button')[0].id;
  nextDashboardButtonId = nextDashboardIdFromActiveButton(currentActiveButtonId);
  nextDashboardId = nextDashboardButtonId.replace('button', 'dashboard');
  showDashboard(nextDashboardId);
  restartDashboardCycle();
}

function selectPreviousDashboard() {
  currentActiveButtonId = $('.dashboard-button.active-button')[0].id;
  previousDashboardButtonId = previousDashboardIdFromActiveButton(currentActiveButtonId);
  previousDashboardId = previousDashboardButtonId.replace('button', 'dashboard');
  showDashboard(previousDashboardId);
  restartDashboardCycle();
}

function hideGeckoBoardBrandingBar() {
  $('#testFrame').load(function(){
    $('#testFrame').contents().find('.branding-bar').hide();
  });
  $('.branding-bar').hide();
}

function refreshPage() {
  location.reload();
}

function pauseButtonAnimations() {
  $('.dashboard-button').addClass('paused-button');
}

function resumeButtonAnimations() {
  $('.dashboard-button').removeClass('paused-button');
}

function startDashboardCycle() {
  dashboardRunning = true;
  hidePauseIcon();
  resumeButtonAnimations();
  dashboardTimer = setInterval(selectNextDashboard, dashboardCycleInterval);
  clearAutoResumeTimer();
}

function stopDashboardCycle() {
  dashboardRunning = false;
  showPauseIcon();
  pauseButtonAnimations();
  clearInterval(dashboardTimer);
  startAutoResumeTimer();
}

function hidePauseIcon() {
  $('#pause-icon:visible').hide(animationInterval);
}

function showPauseIcon() {
  $('#pause-icon:hidden').show(animationInterval);
}

function startAutoResumeTimer() {
  autoResumeTimer = setInterval(startDashboardCycle, autoResumeInterval);
}

function clearAutoResumeTimer() {
  clearInterval(autoResumeTimer);
}

function restartDashboardCycle() {
  clearInterval(dashboardTimer);
  dashboardTimer = setInterval(selectNextDashboard, dashboardCycleInterval);
}

function showFirstDashboard() {
  firstDashboardButtonID = $('.dashboard-button')[0].id;
  firstDashboardID = firstDashboardButtonID.replace('button', 'dashboard');
  showDashboard(firstDashboardID);
}

function startDashboard() {
  showFirstDashboard();
  startDashboardCycle();
}

function toggleCycleStatus() {
  if(dashboardRunning) {
    stopDashboardCycle();
  } else {
    startDashboardCycle();
  }
}

function shouldLoadDashboard(dashboard, dashboardSet) {
  if (dashboard.group == dashboardSet || dashboardSet == 'all') {
    return true
  } else if (dashboard.show_on_main == true && dashboardSet == 'main') {
    return true
  } else {
    return false
  }
}

function loadDashboardIframes() {
  for(var i in dashboardDetails) {
    var dashboardSet = document.location.pathname.replace('/', '')
    var dashboard = dashboardDetails[i];
    if (shouldLoadDashboard(dashboard, dashboardSet)) {
      var dashboardDivHTML = '<div id="' + dashboard.id + '-dashboard" class="dashboard-iframe hidden">';
      var iframeHTML = '<iframe width="1930px" height="1060px" src="' + dashboard.url + '"></iframe>';
      var html = dashboardDivHTML + iframeHTML + '</div>';
      $("#dashboards").append(html);
    };
  };
}

function loadDashboardButtons() {
  for(var i in dashboardDetails) {
    var dashboardSet = document.location.pathname.replace('/', '')
    var dashboard = dashboardDetails[i];
    if (shouldLoadDashboard(dashboard, dashboardSet)) {
      var buttonText = "<span class='inactive-text'>" + dashboard.name + "</span>";
      var html = "<button id='" + dashboard.id + "-button' class='dashboard-button inactive-button'>" + buttonText + "</button>";
      $("#dashboard-buttons").append(html);
    };
  };
}

function initDashboard() {
  loadDashboardIframes();
  loadDashboardButtons();
  startDashboard();
  handleKeydown();
}

function handleKeydown() {
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        selectPreviousDashboard();
        break;
        case 38: // up
        refreshPage();
        break;
        case 39: // right
        selectNextDashboard();
        break;
        case 40: // down
        toggleCycleStatus();
        break;
        case 177: // previous on remote app
        selectPreviousDashboard();
        break;
        case 176: // next on remote app
        selectNextDashboard();
        break;
        case 178: // stop on remote app
        stopDashboardCycle();
        break;
        case 179: // play/pause on remote app
        toggleCycleStatus();
        break;
        default: return; // exit this handler for other keys
      }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });
}

$(document).ready(initDashboard);
