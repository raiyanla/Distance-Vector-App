/* Distance Vector Algorithm */

var NUM_NODES = 0;
var queue_msg = [];
var preset_topology = {};
var tables = new Array(NUM_NODES);
var AUTO_MODE = 0;
var autoid = 0;
var total_costs = 0;
var count_to_infinity = false;
var old_cost = 0;
var highlighting = -10;

// Sets topology by parsing the string. Source - Destination - Weight, Source - Destination.......
function parseTopology(type, topology){
  var offset = 0;

  // TODO: Improve this section. This method cannot be scaled to handle double digits 
  preset_topology['3'] = {edge_count: 2, edges: "0-1-4,0-2-2"}
  preset_topology['4'] = {edge_count: 5, edges: "0-1-4,0-2-2,1-2-1,0-3-1,2-3-2"}
  preset_topology['5'] = {edge_count: 6, edges: "0-1-4,0-2-2,1-2-1,0-3-1,1-4-2,0-4-3"}
  preset_topology['6'] = {edge_count: 6, edges: "0-1-4,0-2-2,1-2-1,0-3-1,1-4-2,0-5-3"}
  preset_topology['7'] = {edge_count: 7, edges: "0-1-4,0-2-2,1-2-1,0-3-1,1-4-2,0-5-3,1-6-3"}
  preset_topology['8'] = {edge_count: 8, edges: "0-1-4,0-2-2,1-2-1,0-3-1,1-4-2,0-5-3,1-6-3,2-7-4"}

  if (type) {
    for (var i = 0; i < preset_topology[String(topology)].edge_count; i++) {
      console.log("outer");
        var nodeA = preset_topology[String(topology)].edges.charAt(i+offset);
        var nodeB = preset_topology[String(topology)].edges.charAt(i+2+offset);
        var weight = Number(preset_topology[String(topology)].edges.charAt(i+4+offset));
        offset += 5;
        g.addEdge(nodeA, nodeB, weight);
    }
  }
}

function autoMode(){
  if (AUTO_MODE == 0) {
    AUTO_MODE = 1;
    autoid = setInterval(function() {updateTable(); }, 2000);
    document.getElementById("autobutton").style.color = "#F4D03F";
    new PNotify('Auto-Update Enabled');
  } else {
    AUTO_MODE = 0;
    clearInterval(autoid);
    document.getElementById("autobutton").style.color = "#BFBFBF";
    new PNotify('Auto-Update Disabled');
  }
  return AUTO_MODE;
}

function pushMsg(src, dest) {
  queue_msg.push(src);
  queue_msg.push(dest);
}

function priorityMsg(src, dest) {
  queue_msg.unshift(dest);
  queue_msg.unshift(src);
}

function getMsg() {
   return queue_msg.shift();
}

function createTable() {
  var tablearea = document.getElementById('tablearea');
  var lg_table = document.createElement('table');
  lg_table.className = "tx";

  for (var i = 0; i < NUM_NODES; i++) {
    var lg_tr;
    var lg_td;

    if (i % 3 == 0) {
      lg_tr = document.createElement('tr');
    }
    var table = document.createElement('table');
    table.id = "tab" + i;
    table.className = "tg";

    var trh = document.createElement('tr');
    var th = document.createElement('th');
    var thx = document.createElement('th');
    var thx_div = document.createElement('div');

    thx_div.setAttribute("class", "tooltip" );
    thx_div.title = "Kill Node";

    var text = document.createTextNode("<Node " + i + ">");
    var exit_text = document.createTextNode(" X");
    th.setAttribute("colSpan", "2");
    thx.id = "exit" + i;
    thx.className = "tf";
    thx.title = "Kill Node"

    th.appendChild(text);
    thx.appendChild(exit_text);
    trh.appendChild(th);
    trh.appendChild(thx);
    table.appendChild(trh);


    var tr = document.createElement('tr');
    var td0 = document.createElement('td');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var b0 = document.createElement('b');
    var b1 = document.createElement('b');
    var b2 = document.createElement('b');

    var text0 = document.createTextNode("Destination");
    var text1 = document.createTextNode("Cost");
    var text2 = document.createTextNode("Next Hop");

    b0.appendChild(text0);
    b1.appendChild(text1);
    b2.appendChild(text2);
    td0.appendChild(b0);
    td1.appendChild(b1);
    td2.appendChild(b2);

    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);

    table.appendChild(tr);


    for (var j = 0; j < NUM_NODES; j++){
      var tr = document.createElement('tr');

      var td0 = document.createElement('td');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');

      var text0 = document.createTextNode("Node " + j);

      td0.appendChild(text0);

      td1.id = "c" + i + j;
      td2.id = "t" + i + j;

      tr.appendChild(td0);
      tr.appendChild(td1);
      tr.appendChild(td2);

      table.appendChild(tr);
    }

    lg_td = document.createElement('td');
    lg_td.appendChild(table);
    lg_tr.appendChild(lg_td);

    if (i % 3 == 0) {
      var br = document.createElement('br');
      lg_tr.appendChild(br);
      lg_table.appendChild(lg_tr);
    }
  }
    tablearea.appendChild(lg_table);

}

function distanceVector(g, node_count){
  NUM_NODES = Number(node_count);
  createTable();
  var i, j;
  for (i = 0; i < NUM_NODES; i++){
    tables[i] = new Array(NUM_NODES);

    // Init all costs to destinations as Infinity
    for (j = 0; j < NUM_NODES; j++) {
      tables[i][j] = {cost:Infinity, nhop:"-"};
    }
    // Cost to itself is always zero.
    tables[i][i].nhop = i;
    tables[i][i].cost = 0;
  }

  for(e in g.edges) {
    src = g.edges[e].source.id;
    dest = g.edges[e].target.id;
    cost = g.edges[e].weight;

    tables[src][dest] = {cost:cost, nhop:dest};
    tables[dest][src] = {cost:cost, nhop:src};
  }

  for (i = 0; i < NUM_NODES; i++) {
    for (j = 0; j < NUM_NODES; j++) {
      // TODO: Allow userinput specified sequence updates to be used. Hardcoded for now.
      if (i != j && tables[i][j].nhop != "-") {
        pushMsg(i, j);
      }

      if (tables[i][j].nhop === "-") {
        document.getElementById("t" + i.toString() + j.toString()).innerHTML = tables[i][j].nhop;
      } else {
        document.getElementById("t" + i.toString() + j.toString()).innerHTML = "Node " + tables[i][j].nhop;
      }
      document.getElementById("c" + i.toString() + j.toString()).innerHTML = tables[i][j].cost;
    }
  }

}

function broadcastMsg(node) {

}

function updateEntryHTML(tableid, i) {
  if (!count_to_infinity && tables[tableid][i].cost != Infinity && (tables[tableid][i].cost > total_costs)) {
    new PNotify({title: "Warning", text: "Detected Count to Infinity Pattern for Node " + i, type: 'error'});
    count_to_infinity = true;
  }
  if (tables[tableid][i].nhop === "-") {
    document.getElementById("t" + tableid.toString() + i.toString()).innerHTML = tables[tableid][i].nhop;
  } else if (tables[tableid][i].cost == Infinity) {
    document.getElementById("t" + tableid.toString() + i.toString()).innerHTML = "-";
  } else {
    document.getElementById("t" + tableid.toString() + i.toString()).innerHTML = "Node " + tables[tableid][i].nhop;
  }
  document.getElementById("c" + tableid.toString() + i.toString()).innerHTML = tables[tableid][i].cost + " " + "(" + old_cost + ")";
  $("#t" + tableid.toString() + i.toString()).animate({backgroundColor: '#e74c3c'}, 'slow');
  $("#c" + tableid.toString() + i.toString()).animate({backgroundColor: '#e74c3c'}, 'slow');
  $("#t" + tableid.toString() + i.toString()).animate({backgroundColor: '#A03741'}, 'slow');
  $("#c" + tableid.toString() + i.toString()).animate({backgroundColor: '#A03741'}, 'slow');

  if (highlighting > -1){
    highlightNode(highlighting);
  }

}

function highlightNode(i){
  var counter = 0;
  highlighting = i;

  for (counter = 0; counter < NUM_NODES; counter++){
    $("#t" + counter.toString() + i.toString()).animate({backgroundColor: '#0090FF'}, 'slow');
    $("#c" + counter.toString() + i.toString()).animate({backgroundColor: '#0090FF'}, 'slow');
  }
}

function decolorizeNode(i){
  var counter = 0;
  highlighting = -10;

  for (counter = 0; counter < NUM_NODES; counter++){
    $("#t" + counter.toString() + i.toString()).animate({backgroundColor: '#A03741'}, 'slow');
    $("#c" + counter.toString() + i.toString()).animate({backgroundColor: '#A03741'}, 'slow');
  }
}


function updateTable() {
  var z = getMsg();
  var x = getMsg();
  var y;

  pushMsg(z, x);
  document.getElementById("sequences").innerHTML = "Current Message: [Send: N" + z + ", Recv: N" + x + "]";

  for (y = 0; y < NUM_NODES; y++) {
    if (y != x) {
      updateEntry(x, y, z);
    }
  }
}

function updateEntry(x, y, z) {
  var d = tables[x][z].cost + tables[z][y].cost
  if (tables[x][y].nhop == z || (d < tables[x][y].cost && x != tables[z][y].nhop)) {
    old_cost = tables[x][y].cost;
    tables[x][y].cost = d;
    tables[x][y].nhop = z;
    updateEntryHTML(x, y);
  }
  console.log("Src: " + x, "Dest: " + y, "Nhop: " + tables[x][y].nhop, "Cost: " + tables[x][y].cost);
}
