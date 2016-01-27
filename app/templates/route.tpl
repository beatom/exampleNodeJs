.when('/<serviceName>/:id?', {
    templateUrl: 'views/<serviceSingularName>.html',
    controller: '<controllerName>Ctrl',
    <start-is-empty>
    resolve: {
        <serviceName>Data: function(<serviceName>Service, $q) {
            var dfd = $q.defer();

            <serviceName>Service.getAll().then(
                function(result) {
                    dfd.resolve(result.data.<plural>);
                }
            );

            return dfd.promise;
        },
        access: function(accessService) {
            return accessService.loggedIn();
        }
    }
    <end-is-empty>
})