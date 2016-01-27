<!-- View template for controller <controllerName> Ctrl -->
<lister conf="listerConf" ng-hide="item"></lister>

<md-content ng-show="item">
         <md-input-container flex="20" ng-repeat="(key, value) in item"  ng-if="value && getTypeOf(value) != 'object' && key != 'id'">
             <label>{{key}}</label>
             <input type="text" ng-model="value" ng-disabled="!canChange()"></input>
         </md-input-container>
     <md-button ng-if="canChange()" ng-click="change(item)" class="md-raised md-primary" value="Save">Save</md-button>
</md-content>