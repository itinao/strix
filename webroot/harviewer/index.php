<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HTTP Archive Viewer @VERSION@</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body class="harBody">
    <div id="content" version="@VERSION@"></div>
    <!--[if IE]><script type="text/javascript" src="scripts/excanvas/excanvas.js"></script><![endif]-->
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <link rel="stylesheet" href="css/harViewer.css" type="text/css"/>
    <?php include("ga.php") ?>

    <script>
      $("#content").bind("onViewerPreInit", function(event)
      {
          // Get application object
          var viewer = event.target.repObject;
      
          // Remove unnecessary tabs
          viewer.removeTab("Home");
          viewer.removeTab("DOM");
          viewer.removeTab("About");
          viewer.removeTab("Schema");
      
          // Hide the tab bar
          viewer.showTabBar(false);

          // Remove toolbar buttons
          var preview = viewer.getTab("Preview");
          preview.toolbar.removeButton("download");
          preview.toolbar.removeButton("clear");

          // Make sure stats and timeline is visible
          // to the user by default
          preview.showStats(true);
          preview.showTimeline(false);
      });
    </script>

</body>
</html>
