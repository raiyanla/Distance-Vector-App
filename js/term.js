var auto_en = false;
jQuery(function($, undefined) {
  $('#terminal').terminal(function(command, term) {
    //term.resize(740, 50);
    console.log(command);
    var res = command.split(" ");
    if (command !== '') {
      if (res[0] == "killnode"){
        if (res.length != 2) {
          term.echo("Usage: killnode <nodeid>");
        } else {
          term.echo("Killing Node " + res[1]);
          killNode(res[1]);
        }
      } else if (res[0] == "help"){
          term.echo("killnode <nodeid>");
          term.echo("launchnode <nodeid>");
          term.echo("sendmsg <src-nodeid> <dest-nodeid>");
          term.echo("step");
          term.echo("automate");
          term.echo("highlight <nodeid>");
          term.echo("decolorize <nodeid>");
      } else if (res[0] == "launchnode"){
        if (res.length != 2) {
          term.echo("Usage: launchnode <nodeid>");
        } else {
          term.echo("Launching Node " + res[1]);
          launchNode(res[1]);
        }
      } else if (res[0] == "highlight"){
        if (res.length != 2) {
          term.echo("Usage: highlight <nodeid>");
        } else {
          term.echo("Highlighting Node " + res[1] + "'s rows");
          highlightNode(res[1]);
        }
      } else if (res[0] == "decolorize"){
        if (res.length != 2) {
          term.echo("Usage: decolorize <nodeid>");
        } else {
          term.echo("decolorizing Node " + res[1] + "'s rows");
          decolorizeNode(res[1]);
        }
      } else if (res[0] == "sendmsg"){
        if (res.length != 3) {
          term.echo("Usage: sendmsg <src-nodeid> <dest-nodeid>");
        } else {
          term.echo("Sending message: [Src: " + res[1] + ", Dest: " + res[2] + "]");
          new PNotify("Msg Sent: [Src: " + res[1] + ", Dest: " + res[2] + "]");
          priorityMsg(Number(res[1]), Number(res[2]));
          updateTable();
        }
      } else if (res[0] == "step") {
        term.echo("Stepping through sequence message queue.");
        updateTable();
      } else if (res[0] == "automate") {
        auto_en = autoMode();
        if (auto_en) {
          term.echo("Messages will automatically be sent among active nodes.");
        } else {
          term.echo("Disabling automatic message updates.");
        }
      } else {
        term.echo("Undefined command. Type 'help' for list of available commands.");
      }
    } else {
      term.echo('');
    }
  }, {
    greetings: '////////////////////////////////////////////////\n// Distance Vector Command Line               //\n// Type \'help\' for list of available commands // \n////////////////////////////////////////////////\n',
    name: 'js_demo',
    height: 200,
    prompt: 'dv> '});
  });
