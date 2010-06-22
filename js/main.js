/*!
 * gnu-trex [http://code.google.com/p/gnu-trex/]
 *
 * Copyright 2010, gnu-trex team [as listed on the people page of the google code project site]
 * Source Code licensed under the GPL Version 3 [http://www.gnu.org/licenses/gpl.html]
 * Project Content & Documentation licensed under Creative Commons 3.0 BY-SA [http://creativecommons.org/licenses/by-sa/3.0/]
 *
 * Includes jQuery.js [http://jquery.com/]
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Includes jQuery UI 1.8.1 [http://docs.jquery.com/UI]
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 */

var r;
var paused = true;

var rndTask = [
	'wasting time!',
	'still wasting time',
	'xkcd!',
	'random miscellaneous task time!',
	'20min lunch + 10min ciggy break',
	'making tasks',
	'cheezburgur tiem',
	'luncheon :D'
];

  function init() {  
	r = new rex("cb()");
	paused = false;
	
	/* $("#gnutrex").draggable(); */
	
	$("#about").hover(
		function(){
			$(this).animate({top:0},500);
		},
		function(){
			$(this).animate({top:-100},500);
		}
	);
	
	$("#about_1").hover(
		function(){
			$(this).animate({top:0},500);
		},
		function(){
			$(this).animate({top:-100},500);
		}
	);
	
	$("#about_2").hover(
		function(){
			$(this).animate({top:0},500);
		},
		function(){
			$(this).animate({top:-100},500);
		}
	);
	
	$("#todo").hover(
		function(){
			$(this).animate({left:0},500);
		},
		function(){
			$(this).animate({left:-200},500);
		}
	);
	
	window.onbeforeunload = function(event) {
		return "All tasks you have created will be lost, are you sure you want to quit t-racks?";
	};
	
	window.onunload = function() {
		// clean up
	}
  }
  
  function cb() {
	r.update();
	var tmp;
	for(tmp in r.tracks) {
		if(r.tracks[tmp].state == 'active') {
		
			var t = r.tracks[tmp].s;
			
			var hr = Math.floor(t / 3600);
			var min = String(Math.floor((t / 60) - (hr * 60)));
			var sec = String(Math.floor(t % 60));				
			
			sec = (sec.length > 1)?sec:"0"+sec;
			min = (min.length > 1)?min:"0"+min;
			hr = (hr.length > 1)?hr:"0"+hr;
			
			$("#"+tmp+" div.tm").html(hr+":"+min+":"+sec);
		}
	}
  }

  $(document).ready(function() {

	init();

  }); 
  
  function addTask() {
	var tmp = r.add(escape($("#taskDesc").val())); /* escape when saving */
	$("#tasks").append("<div class=\"task\" id=\""+tmp+"\"><div class=\"tools\"><button class=\"taskTmrToggle\" onclick=\"toggleTask(\'"+tmp+"\');\" title=\"Pause\"><span>P</span></button><button class=\"taskRemove\" onclick=\"removeTask(\'"+tmp+"\');\" title=\"Delete\"><span>D</span></button></div><div class=\"desc\">"+$("#taskDesc").val()+"</div><div class=\"tm\">00:00:00</div><div class=\"cb\"></div></div>");
	$("#tasks").sortable();
	$("#taskDesc").val(rndTask[(Math.round(Math.random() * rndTask.length))]);	
	$("#"+tmp).slideDown(500);
  }
  
  function pauseTasks() {
  
  if(!r.size) return;
  
  var tmp;
  
	if(paused) {
		paused = false;
		$("#pauseTasks").html("Pause All Tasks");
		for(tmp in r.tracks) {
			r.tracks[tmp].state = 'active';
			$("#"+tmp+" .taskTmrToggle").html("P");
		}
	} else {
		paused = true
		$("#pauseTasks").html("Resume All Tasks");
		for(tmp in r.tracks) {
			r.tracks[tmp].state = 'paused';
			$("#"+tmp+" .taskTmrToggle").html("R");
		}
	}
  }
  
  function toggleTask(tid) {
	if(r.state(tid) == 'paused') {
		$("#"+tid+" .taskTmrToggle").html("P");
	} else {
		$("#"+tid+" .taskTmrToggle").html("R");
	}
	r.toggle(tid);
	
  }
  
  function removeTask(tid) {
	if(r.size == 1 && paused) {
		pauseTasks();
	}
	r.remove(tid);
	$("#"+tid).slideUp(500, function() { $(this).remove(); });
  }
  
  function saveTasks() {
	if(r.size > 0) { /* should the size variable be a function that calculates the number of items in the associative array r.tracks? */
		$("#taskDesc").val(r.save());
	}
  }
  
  function loadTasks() {  
	loadTask($("#taskDesc").val());
  }
  
  function loadTask(task) {
	var i,arrObj,tmp;
	
	if(undefined != task && "string" == typeof(task)) {
		try {
			arrObj = eval(task);
			
			for(i in arrObj) {
				tmp = r.add(arrObj[i].title,arrObj[i].s,arrObj[i].state);
				$("#tasks").append("<div class=\"task\" id=\""+tmp+"\"><div class=\"tools\"><button class=\"taskTmrToggle\" onclick=\"toggleTask(\'"+tmp+"\');\" title=\"Pause\"><span>P</span></button><button class=\"taskRemove\" onclick=\"removeTask(\'"+tmp+"\');\" title=\"Delete\"><span>D</span></button></div><div class=\"desc\">"+unescape(arrObj[i].title)+"</div><div class=\"tm\">00:00:00</div><div class=\"cb\"></div></div>");
				$("#tasks").sortable();
				$("#taskDesc").val(rndTask[(Math.round(Math.random() * rndTask.length))]);	
				$("#"+tmp+" .taskTmrToggle").html((arrObj[i].state!="active")?"R":"P");
				$("#"+tmp).slideDown(500);
			}
			return true;
			
		} catch(err) {
			// console.log(err);
			return false;
		} 
	}
  return false;
  }