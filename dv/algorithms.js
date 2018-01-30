var redraw;
var NODE_COUNT = 0;
var g = new Dracula();
var neighbours;
var node_active;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return -1;
}

function launchNode(nodeid) {
  id = Number(nodeid);
  if (node_active[id]) {
      return;
  }
  node_active[id] = true;
  new PNotify("Bringing Node " + id + " back up.");
  document.getElementById("tab" + id).style.opacity = "1.0";
  g.addNode(id.toString());
  g.removeNode(g.nodes[id]);
  neighbours[id].forEach(function(e) {
    g.addEdge(id.toString(), e.dest.toString(), e.cost);
    old_cost = tables[id][e.dest].cost;
    tables[id][e.dest].cost = e.cost;
    tables[e.dest][id].cost = e.cost;
    updateEntryHTML(id, e.dest);
    updateEntryHTML(e.dest, id);
  });
  NODE_COUNT++;
  document.getElementById("nodeinfo").innerHTML = "Nodes Alive: [ " + NODE_COUNT + " ]";
  redraw();
}

function killNode(nodeid) {
  id = Number(nodeid);
  if (!node_active[id]) {
      return;
  }
  node_active[id] = false;
  new PNotify("Killing Node " + id);
  document.getElementById("tab" + id).style.opacity = "0.3";
  g.removeNode(g.nodes[id]);
  neighbours[id].forEach(function(e) {
    g.addEdge(id.toString(), e.dest.toString(), Infinity);
    old_cost = tables[id][e.dest].cost;
    tables[id][e.dest].cost = Infinity;
    tables[e.dest][id].cost = Infinity;
    updateEntryHTML(id, e.dest);
    updateEntryHTML(e.dest, id);
  });
  NODE_COUNT--;
  document.getElementById("nodeinfo").innerHTML = "Nodes Alive: [ " + NODE_COUNT + " ]";
  redraw();
}

window.onload = function() {

  var node_param = Number(getQueryVariable("nodes"));
  if (node_param < 3 || node_param > 8) {
    node_param = 6;
  } else {
    console.log(node_param);
  }

  NODE_COUNT = node_param;
  neighbours = new Array(NODE_COUNT);
  node_active = new Array(NODE_COUNT);

  $(document).ready(function() {
    $('.tooltip').tooltipster();
  });

  document.getElementById("autobutton").style.color = "#BFBFBF";
  var width  = 628;
  var height = 462;

  var render = function(r, n) {
    var frame = r.rect(n.point[0] - 30, n.point[1] - 13, 60, 44);
    frame.attr({
      fill: '#C14955', r: 20,
      'stroke-width': (n.distance === 0 ? '2px' : '2px'),
      'fill-opacity': 1
    });
    var set = r.set().push(frame,
        r.text(n.point[0], n.point[1] + 10, "N" + n.id)
    );
    return set;
  };


  function addNode(name) {
    g.addNode(name, { render: render });
  }

  g.addEdge2 = g.addEdge;
  g.addEdge = function(from, to, weight, style) {
    var edge_exists = false;
    !style && (style = {});
    style.weight = weight;
    style.label = style.weight;
    var edge = g.addEdge2(from, to, style);
    edge.weight = style.weight;
    var n_info = {cost: edge.weight, dest:Number(to)}
    var n_info_opp = {cost: edge.weight, dest:Number(from)}
    neighbours[Number(from)].forEach(function(e) {
      if (e.dest == Number(to)) {
        edge_exists = true;
      }
    });

    if (n_info.cost < Infinity && edge_exists == false) {
      neighbours[Number(from)].push(n_info);
      neighbours[Number(to)].push(n_info_opp);
      total_costs += edge.weight;
      console.log("Total Cost " + total_costs);
    }
  };

  for (var i = 0; i < NODE_COUNT; i++) {
    addNode(i.toString());
    neighbours[i] = [];
    node_active[i] = true;
  }

  parseTopology(1,NODE_COUNT);

  var layouter = new Dracula.Layout.Spring(g);

  distanceVector(g, NODE_COUNT);

  for (var iter = 0; iter < NODE_COUNT; iter++) {
    $("#tab" + iter).live('click',function(e){
      var str = e.target.id.toString();
      if (str.startsWith("exit")) {
        var id = str.charAt(4);
        killNode(id);
      }
    });
  }

  document.getElementById("nodeinfo").innerHTML = "Nodes Alive: [ " + NODE_COUNT + " ]";
  document.getElementById("sequences").innerHTML = "Current Message: [Send: -, Recv: -]";

  var renderer = new Dracula.Renderer.Raphael('canvas', g, width, height);

  window.redraw = function() {
    renderer.draw();
  };
};
