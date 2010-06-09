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
	
	$("#controls").draggable();
	
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
	if(!paused) {
		r.update();
		var tmp;
		for(tmp in r.tracks) {
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
	if(paused) {
		paused = false;
		$("#pauseTasks").html("Pause Active Tasks");
	} else {
		paused = true
		$("#pauseTasks").html("Resume Active Tasks");
	}
  }
  
  function toggleTask(tid) {
	if(r.state(tid) == 'paused') {
		$("#"+tid+" .taskTmrToggle").html("R");
	} else {
		$("#"+tid+" .taskTmrToggle").html("P");
	}
	r.toggle(tid);
  }
  
  function removeTask(tid) {
	r.remove(tid);
	$("#"+tid).slideUp(500, function() { $(this).remove(); });
  }
  
  function saveTasks() {
	$("#taskDesc").val(r.save());
  }
  
  function loadTasks() {
	var i,obj,arrObj,tmp;
  
	obj = $("#taskDesc").val();
	
	if(undefined != obj && "string" == typeof(obj)) {
		try {
			arrObj = eval(obj);
			
			for(i in arrObj) {
				tmp = r.add(arrObj[i].title,arrObj[i].s,arrObj[i].state);
				$("#tasks").append("<div class=\"task\" id=\""+tmp+"\"><div class=\"tools\"><button class=\"taskTmrToggle\" onclick=\"toggleTask(\'"+tmp+"\');\">Pause</button><button class=\"taskRemove\" onclick=\"removeTask(\'"+tmp+"\');\">Remove</button></div><div class=\"desc\">"+unescape(arrObj[i].title)+"</div><div class=\"tm\">00:00:00</div><div class=\"cb\"></div></div>"); /* unescape when loading */
				$("#tasks").sortable();
				$("#taskDesc").val(rndTask[(Math.round(Math.random() * rndTask.length))]);	
				$("#"+tmp+" .taskTmrToggle").html((arrObj[i].state!="active")?"Resume":"Pause");
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