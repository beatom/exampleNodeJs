<!DOCTYPE html>
<html ng-app="app" class="no-js">
  <head>
    <meta charset="utf-8">
    <title></title>
    <base href="/">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- cg-style-start -->
    <!-- cg-style-end -->
  </head>
  <body class="ng-cloak">
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <md-content layout="column" >
         <md-card flex='98' class='normal-content' >
             <md-card-content ng-view></md-card-content>
         </md-card>
    </md-content>

    <!-- cg-lib-start -->
    <!-- cg-lib-end -->

    <script src="scripts/app.js"></script>

    <!-- cg-services-start -->
    <!-- cg-services-end -->

    <!-- cg-controllers-start -->
    <!-- cg-controllers-end -->

    <!-- cg-additional-start -->
    <!-- cg-additional-end -->




</body>
</html>