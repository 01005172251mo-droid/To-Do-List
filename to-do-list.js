
var btns = document.querySelectorAll(".Sidebar-button div, .addtask");
var allC = document.getElementById("All-Tasks");
var myC = document.getElementById("Myday");
var impC = document.getElementById("Important");
var planC = document.getElementById("Planned");
var addPg = document.getElementById("Addtask-page");

var addSub = document.getElementById("Addtask-submit");
var cancelB = document.getElementById("Cancel-btn");
var clearB = document.getElementById("clear-tasks");

var storeKey = "my_tasks_1"; 
var xTasks = []; 

function loadStuff() {
  var s = localStorage.getItem(storeKey);
  if (s) {
    try {
      xTasks = JSON.parse(s);
    } catch(e) {
      xTasks = [];
    }
  } else {
    xTasks = [];
  }
}


function saveStuff() {

    localStorage.setItem(storeKey, JSON.stringify(xTasks));
  
}

function mkId() {
  return "id" + Math.floor(Math.random()*99999) + "_" + (new Date()).getTime().toString().slice(-3);
}

function renderTaskHTML(t) {
  var doneAttr = t.done ? "checked" : "";
  var star = t.imp ? "★" : "☆"; 
  var d = t.date ? (" 📅 " + t.date) : "";
  var tag = t.tag ? (" #"+t.tag) : "";
   if (t.date) {
    var today = new Date().toISOString().slice(0,10);
    d = (t.date === today) ? (" 📅 Today") : (" 📅 " + t.date);
  }
  return '<div class="task-item" data-id="'+t.id+'">' +
           '<input class="cb" type="checkbox" '+doneAttr+' /> ' +
           '<b class="ttl">'+escapeHtml(t.title)+'</b>' +
           '<span class="meta">'+tag+d+'</span> ' +
           '<button class="starBtn">'+star+'</button>' +
         '</div>';
}

function escapeHtml(s) {
  if (!s) return "";
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
}

function showPage(name) {
  var p = document.querySelectorAll("#main-content .page div, #Addtask-page");
  for (var i=0;i<p.length;i++){ p[i].style.display = "none"; }
  var el = document.getElementById(name) || document.getElementById(name.replace("-",""));
  if (el) el.style.display = "block";
}

function renderAll() {
  if (allC) allC.innerHTML = '<h2>All Tasks</h2>';
  if (myC) myC.innerHTML = '<h2>My Day</h2>';
  if (impC) impC.innerHTML = '<h2>Impotant</h2>';
  if (planC) planC.innerHTML = '<h2>Planned</h2>';

  var today = new Date().toISOString().slice(0,10);

  for (var i=0;i<xTasks.length;i++) {
    var t = xTasks[i];
    if (allC) allC.innerHTML += renderTaskHTML(t);

    if (t.date && t.date === today && !t.done) {
      if (myC) myC.innerHTML += renderTaskHTML(t);
    }

    if (t.imp && !t.done) {
      if (impC) impC.innerHTML += renderTaskHTML(t);
    }

    if (t.date && !t.done) {
      if (planC) planC.innerHTML += renderTaskHTML(t);
    }
  }

  var main = document.getElementById("main-content");
  if (main) {
    main.onclick = function(ev) {
      var tg = ev.target;

      if (tg.classList && tg.classList.contains("cb")) {
        var par = tg.parentNode;
        var id = par.getAttribute("data-id");
        for (var j=0;j<xTasks.length;j++){
          if (xTasks[j].id === id) {
            xTasks[j].done = tg.checked;
            saveStuff();
            renderAll();
            break;
          }
        }
      }

      if (tg.classList && tg.classList.contains("starBtn")) {
        var par2 = tg.parentNode;
        var id2 = par2.getAttribute("data-id");
        for (var k=0;k<xTasks.length;k++){
          if (xTasks[k].id === id2) {
            xTasks[k].imp = !xTasks[k].imp;
            saveStuff();
            renderAll();
            break;
          }
        }
      }
    };
  }
}

function addOne(e) {
  if (e) e.preventDefault();
  var title = (document.getElementById("Title")||{value:""}).value;
  var date = (document.getElementById("Due-Date")||{value:""}).value;
  var tag = (document.getElementById("tags")||{value:""}).value;



  var t = {
    id: mkId(),
    title: title.trim(),
    date: date || null,
    tag: tag? tag.trim() : "",
    done: false,
    imp: false
  };

  xTasks.push(t);
  saveStuff();

  if (document.getElementById("Title")) document.getElementById("Title").value = "";
  if (document.getElementById("Due-Date")) document.getElementById("Due-Date").value = "";
  if (document.getElementById("tags")) document.getElementById("tags").value = "";

  showPage("Myday");
  renderAll();
}

for (var b=0;b<btns.length;b++){
  (function(bb){
    bb.onclick = function(){
      var page = bb.getAttribute("targetpage");
      if (!page) page = bb.getAttribute("targetPage") || bb.getAttribute("targetpage");
      if (page) showPage(page);
      renderAll();
    };
  })(btns[b]);
}

if (addSub) addSub.addEventListener ? addSub.addEventListener("click", addOne) : addSub.onclick = addOne;
if (cancelB) cancelB.onclick = function(ev){ if (ev) ev.preventDefault(); showPage("Myday"); };

if (clearB) {
  clearB.onclick = function() {
    if (confirm("Clear all tasks?")) {
      try { localStorage.removeItem(storeKey); } catch(e){}
      xTasks = [];
      renderAll();
    }
  };
}

loadStuff();
showPage("Myday");
renderAll();
