export let Array = {
    fnc: function () {

        firebase.auth().onAuthStateChanged(function (user) {

            if (user) {
                // User is signed in.
                var user = firebase.auth().currentUser;
                var sedes;

                database.ref('/sa_sedes/' + user.uid).once('value').then(function (snapshot) {
                    sedes = snapshot.val();
                    //console.log(contactos);

                    var array = $.map(sedes, function (value, index) {
                        return [value];
                    });
                    //console.log(array);

                    $scope.sedes = array;
                    $scope.$apply();

                }).catch(function (error) {
                    console.log(error);
                });

            }
        })
    }
}