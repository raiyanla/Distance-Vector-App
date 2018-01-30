<html>
<head>
  <!--<script type="text/javascript" src="../js/underscore.js"></script>-->
  <script type="text/javascript" src="../vendor/jquery-1.8.2.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

  <!--  The Raphael JavaScript library for vector graphics display  -->
  <script type="text/javascript" src="../vendor/raphael.js"></script>
  <!--  Dracula  -->
  <!--  An extension of Raphael for connecting shapes -->
  <script type="text/javascript" src="../lib/dracula_graffle.js"></script>
  <!--  Graphs  -->
  <script type="text/javascript" src="../lib/dracula_graph.js"></script>
  <script type="text/javascript" src="../lib/dracula_algorithms.js"></script>
  <script type="text/javascript" src="algorithms.js"></script>
</head>

<style type="text/css">
.tx td{padding: 2px 2px;}

.tg  {border-radius: 10px; border-collapse:collapse;border-spacing:0;border-color:#aabcfe;table-layout:fixed; width:245px;}
.tg td{text-align:center; font-family:Verdana, sans-serif;font-size:11px;padding:7px 5px; border-style:solid;border-width:2px;overflow:hidden;word-break:normal;border-color:#C14955;color:#fff;background-color:#A03741}
.tg th{text-align:center; font-family:Verdana, sans-serif;font-size:13px;font-weight:bold;padding:7px 5px;border-style:solid;border-width:2px;overflow:hidden;word-break:normal;border-color:#C14955;color:#FFF;background-color:#A03741;}
.tgh {font-weight:bold;}
.tg .tf{color:#DB0A5B; font-weight: heavy;}



html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  font-size: 1rem;
  font-family: "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  background-color: #FFFAE1;
}

.content {
  margin: 64px auto;
  width: 94%;
  max-width: 640px;
  text-align: center;
}

.button {
  display: inline-block;
  margin: 0;
  padding: 0.75rem 1rem;
  border: 0;
  width: 88px;
  border-radius: 0.317rem;
  background-color: #aaa;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  font-family: "Helvetica Neue", Arial, sans-serif;
  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;
}

.button:hover {
  opacity: 0.85;
}

.button_primary {
  background-color: #A03741;
}
.button_secondary {
  background-color: #e98724;
}

.button-icon {
  display: inline-block;
  position: relative;
  top: -0.1em;
  vertical-align: middle;
  margin-right: 0.317rem;
}
</style>

<style type="text/css">
.table { border:2px solid #C14854; padding:10px; width:100%; overflow:hidden; background-color: #A03741}
.left { float:left; width:46%; padding-top: 7px; padding-left: 8px; background-color: #C14955; border:3px solid #A03741}
.right { float:right; width:54%; padding-top: 2px; padding-left: 5px; background-color: #C14955; border:3px solid #A03741}
.title {  background-color: #C14854; font-size: 26px; text-align: left; color: #F9F9F9;   font-family: 'Verdana', sans-serif;}
.seqbox { text-align:left; background-color: #A03741; color:#fff; padding-left: 10px}
.infobox { background-color: #A03741; color:#fff;}
.infotable { padding-right: 10px}

.nav ul {
  list-style: none;
  background-color: #C14854;
  text-align: right;
  padding-right: 10px;
  margin: 0;
}
.nav li {
  font-family: 'Lato', sans-serif;
  font-size: 8px;
  line-height: 30px;
  height: 30px;
  border: 2px solid #C14854;
}

.nav a {
  text-decoration: none;
  color: #F9F9F9;
  display: block;
  transition: .3s background-color;
}

.nav a:hover {
  background-color: #A03741;
}



@media screen and (min-width: 600px) {
  .nav li {
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: none;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    font-weight: heavy;
  }

  /* Option 1 - Display Inline */
  .nav li {
    display: inline-block;
  }

}


</style>

<body style="margin:0;padding:0;">

  <header>
    <table class="title" width=100% border="0">
      <tr>
        <td>
          <th> Distance Vector </th>
        </td>
        <td>
    <div class="nav">
      <ul>
        <li class="home"><a href="#">Home</a></li>
        <li class="tutorials"><a class="active" href="#">Tutorials</a></li>
        <li class="about"><a href="#">About</a></li>
        <li class="contact"><a href="#">Contact</a></li>
      </ul>
    </div>
  </td>
  </tr>
  </table>
  </header>



  <div class="table">
    <div class="left">
      <div id="canvas" style="height: 462px; width: 628px; border:2px solid #A03741; background-color:#FFFAEF;"></div>
      <p> </p>
      <table class="infotable" align=left>
        <tr>
          <td align=left>
            <button id="autobutton" class="button button_primary" onclick="autoMode();">Auto &#8635;</button>
          </td>
          <td align=left>
            <button class="button button_primary" onclick="updateTable();">Step &#10174;</button>
          </td>
          <td class="infobox" width="150px" align=center>
            <div id="nodeinfo"></div>
          </td>
          <td class="seqbox" width="325px" padding-right="10px">
            <div id="sequences"></div>
          </td>
        </tr>
      </table>
      <p> </p>

    </div>
    <div class="right">
      <div id="tablearea"> </div>
    </div>
  </div>

</body>
</html>
