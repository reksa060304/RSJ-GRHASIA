define(['kendo.menu'], function (kendoMenu) {
    'use strict';

    function HeaderCtrl($window, $scope, MenuService, GlobalToState, $rootScope, $state, LoginHelper, $location, socket, $mdDialog) {
        $scope.isOpen = true;
        $scope.listMenuHeader = {};
        $scope.messages = [];
        $scope.listNotification = []
        $scope.mapLogin = []
        console.clear()
     
        var kelomokUser = getKelUser()
        function getKelUser() {
            var arr = document.cookie.split(';')
            for (var i = 0; i < arr.length; i++) {
                var element = arr[i].split('=');
                if (element[0].indexOf('statusCode') >= 0) {
                    return element[1];
                }
            }
            return null;
        }
        
        var mapLogin = window.localStorage.getItem('mapLoginUserToRuangan')
        $scope.mapLogin = mapLogin ? JSON.parse(mapLogin) : [];
        function savDB(data) {
            data.method = 'save'
            // MenuService.postNonMessage('sysadmin/store-notif', data).then(function (e) { })
        }

        socket.on('set-server-socket', function (e) {
            var json = JSON.parse(e);
            if (json.name == "sendNotification") {
                var objectData = json.body
                if ($scope.mapLogin.length > 0) {
                    for (let x = 0; x < $scope.mapLogin.length; x++) {
                        const element = $scope.mapLogin[x];
                        if (element.id == objectData.idRuanganTujuan) {
                            if ($scope.listNotif.length == 0) {
                                $scope.listNotif.push(objectData)
                            } else {
                                if (!$scope.listNotif.some(x => x.norec_trans === objectData.norec_trans)) {
                                    $scope.listNotif.push(objectData);
                                }
                            }
                            toastr.warning(objectData.judul, 'Notif ' + objectData.jenis, {
                                "closeButton": true,
                                "positionClass": "toast-bottom-right",
                                "hideDuration": "15000",
                            });
                            $scope.listNotif.sort(function (a, b) {
                                if (a.tgl < b.tgl) {
                                    return -1;
                                }
                                if (a.tgl > b.tgl) {
                                    return 1;
                                }
                                return 0;
                            })
                            $scope.jmlNotif = $scope.listNotif.length
                            var audio = new Audio("../app/stylesheets/sound/discord-notification.mp3");//toastToneError//toastToneSuccess
                            audio.play();
                            // savDB(objectData)
                        }
                    }
                } 
                if (kelomokUser == objectData.kelompokUser) {
                    if ($scope.listNotif.length == 0) {
                        $scope.listNotif.push(objectData)
                    } else {
                        if (!$scope.listNotif.some(x => x.norec === objectData.norec)) {
                            $scope.listNotif.push(objectData);
                        }
                    }
                    toastr.warning(objectData.judul, 'Notif ' + objectData.jenis, {
                        "closeButton": true,
                        "positionClass": "toast-bottom-right",
                        "hideDuration": "3000",
                    });

                    $scope.listNotif.sort(function (a, b) {
                        if (a.tgl < b.tgl) {
                            return -1;
                        }
                        if (a.tgl > b.tgl) {
                            return 1;
                        }
                        return 0;
                    })
                    $scope.jmlNotif = $scope.listNotif.length
                    var audio = new Audio("../app/stylesheets/sound/discord-notification.mp3");//toastToneError//toastToneSuccess
                    audio.play();
                    // savDB(objectData)
                }


            }
        })
        loadNotif()
        function loadNotif() {
            $scope.listNotif = []
            $scope.jmlNotif = 0
            MenuService.postNonMessage('sysadmin/store-notif', { method: 'get', mapLogin: $scope.mapLogin  }).then(function (e) {
                if (e.data.data.length > 0) {
                    e.data.data =  group(e.data.data)
                    for (let x = 0; x < e.data.data.length; x++) {
                        const element = e.data.data[x];
                        if ($scope.mapLogin.length > 0) {
                            for (let z = 0; z < $scope.mapLogin.length; z++) {
                                const element2 = $scope.mapLogin[z];
                                if (element2.id == element.ruangantujuanfk) {
                                    $scope.listNotif.push({
                                        norec_trans: element.norec_trans,
                                        judul: element.judul,
                                        jenis: element.jenis,
                                        pesanNotifikasi: element.keterangan,
                                        idRuanganAsal: element.ruanganasalfk,
                                        idRuanganTujuan: element.ruangantujuanfk,
                                        ruanganAsal: element.ruanganasal,
                                        ruanganTujuan: element.ruangantujuan,
                                        kelompokUser: element.kelompokuser,
                                        idKelompokUser: element.kelompokuserfk,
                                        dataArray: null,
                                        urlForm: element.urlform,
                                        idPegawai: element.pegawaifk,
                                        namaFungsiFrontEnd: null,
                                        tgl: element.tgl,
                                        tgl_string: element.tgl_string,
                                        params: {
                                            noOrder: element.params
                                        }
                                    })
                                }
                            }
                        }
                    }
                    $scope.jmlNotif = $scope.listNotif.length
                }
            })
        }
        function group(result){
            let sama = false
            let arrGroup = [];
            for (let i = 0; i < result.length; i++) {
                sama = false
                for (let x = 0; x < arrGroup.length; x++) {
                    if (arrGroup[x].norec_trans == result[i].norec_trans) {
                        sama = true;
                    }
                }
                if (sama == false) {
                    arrGroup.push(result[i])
                }
            }
            return arrGroup;
        }
        $rootScope.$watch('addData', function (e) {
            $scope.messages.push(e);
        });

        $scope.open = function () {
            $scope.isOpen = !$scope.isOpen;
        };

        $scope.$watch('isOpen', function (e) { });


        $scope.getListMenuHeader = function () {
            MenuService.get("GetHeaderMenu" + "/" + LoginHelper.get())
                .then(function (result) {
                    var temp = [];
                    var valid = false;

                    for (var key in result) {
                        if (result.hasOwnProperty(key)) {
                            var element = result[key];
                            if (element.caption.toLowerCase().indexOf('logout') < 0)
                                temp.push(element);
                            else {
                                valid = true;
                                temp.push(element);
                            }
                        }
                    }

                    var pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
                    if (valid === false)
                        temp.push({
                            caption: "Logout (" + pegawai.namaLengkap + ")",
                            link: "/app/Logout",
                        });
                    $scope.listMenuHeader = temp;

                });
        };
        var profile = JSON.parse(window.localStorage.getItem('profile'));
        $scope.NamaRs = profile.namaexternal
        $scope.showMenu = function () {
            $rootScope.isOpenMenu = !$rootScope.isOpenMenu;
        }

        var cokie = document.cookie.split(';')[0].split('=')[1];
        $scope.userName = cokie;
        //jalanin fungsi kalo document ready
        angular.element(document).ready(function () {
            $scope.getListMenuHeader();
        });
        $rootScope.$watch('hideMenuUp', function (e) {
            $scope.hide = e;
        })
        $scope.first = function () {
            $rootScope.first();
        }
        $scope.last = function () {
            $rootScope.last();
        }
        $scope.next = function () {
            $rootScope.next();
        }
        $scope.back = function () {
            $rootScope.back();
        }
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                GlobalToState.set(toState);
            });

        // Start Syamsu

        $scope.goToLink = function (url) {
            if (url.toLowerCase().indexOf('logout') < 0) {
                debugger;
                if (url.toLowerCase().indexOf('bi-') > -1) {
                    window.open($window.location.origin + url, '_blank')
                } else {
                    $window.location.href = url;
                    if (!$rootScope.$$phase) $rootScope.$apply();
                }

            } else {
                $rootScope.doLogout();
            }
        };


        $rootScope.loadDariNotif = false;

        $scope.checkNotif = function (data) {

            var dataKirim = {
                ruanganId: $scope.rootRuanganUnitKerja.ruanganId,
                notif: data
            };

            $rootScope.listNotification = _.without($rootScope.listNotification, data);


            if ($rootScope.listNotification.length > 0) {
                window.localStorage.setItem('listNotification', JSON.stringify($rootScope.listNotification));
            } else {
                window.localStorage.removeItem('listNotification');
            }

            var msgNotif = JSON.stringify(dataKirim);

            socket.emit('deleteNotif', msgNotif);

            if (data.urlForm == undefined || data.urlForm == null) {
                return;
            }

            if ($location.absUrl().indexOf(data.urlForm) < 0) {
                $window.location.href = data.urlForm;
                if (!$rootScope.$$phase) $rootScope.$apply();
                $rootScope.loadDariNotif = true;
            }
        };

        $scope.datauserlogin = JSON.parse(window.localStorage.getItem("datauserlogin"));
        $scope.dataPegawai = JSON.parse(window.localStorage.getItem("pegawai"));
        $scope.showEditNohandphone = false;
        $scope.showEditEmail = false;
        $scope.showEditPassword = false;

        $scope.dataTemp = "";

        $scope.editDataProfile = function (strVarCurrData, varShow) {
            $scope.dataTemp = $scope.dataPegawai[strVarCurrData];
            $scope.showEditNohandphone = false;
            $scope.showEditEmail = false;
            $scope.showEditPassword = false;

            $scope[varShow] = true;
        };

        $scope.cancelEditProfile = function (varShow) {
            $scope[varShow] = false;
            $scope.dataTemp = "";
        };

        $scope.currentVarshow = "";
        $scope.currentType = "";

        $scope.confirmEditprofile = function (strVarCurrData, varShow) {
            $scope.dataPegawai[strVarCurrData] = $scope.dataTemp;
            $scope.currentVarshow = varShow;
            $scope.showRootAuthPassword = true;
            $scope.currentType = "EditDataProfile";
        };

        $scope.dataConfirmPassword = "";

        $scope.sendEditProfile = function () {
            var dataPost = {
                "pegawaiVO": $scope.dataPegawai,
                "password": $scope.dataConfirmPassword
            }

            MenuService.postProfilePegawai(dataPost)
                .then(function (result) {
                    window.localStorage.setItem('pegawai', JSON.stringify($scope.dataPegawai));
                    $scope.dataConfirmPassword = "";
                    $scope.cancelEditProfile($scope.currentVarshow);
                    $scope.showRootAuthPassword = false;

                }, function (error) {
                    $scope.dataPegawai = JSON.parse(window.localStorage.getItem("pegawai"));
                    $scope.dataConfirmPassword = "";
                    $scope.cancelEditProfile($scope.currentVarshow);
                    $scope.showRootAuthPassword = false;
                });


            $scope.dataTemp = "";
        };

        $scope.editDataPassword = function (varShow) {
            $scope.currentVarshow = varShow;
            $scope.showEditNohandphone = false;
            $scope.showEditEmail = false;
            $scope.showEditPassword = false;

            $scope[varShow] = true;
        };

        $scope.cancelEditDataPassword = function (varShow) {
            $scope[varShow] = false;
            $scope.dataTemp = "";
        };

        $scope.confirmDataPassword = function (varShow) {
            $scope.showRootAuthPassword = true;
            $scope.currentType = "EditKataSandi";
        };

        $scope.submitPassword = function () {
            switch ($scope.currentType) {
                case "EditDataProfile":
                    $scope.sendEditProfile();
                    break;

                case "EditKataSandi":
                    $scope.sendEditKataSandi();
                    break;
            }
        };

        $scope.sendEditKataSandi = function () {
            var dataPost = {
                "id": $scope.datauserlogin.id,
                "kataSandi": $scope.dataTemp,
                "password": $scope.dataConfirmPassword
            }

            MenuService.postKataSandi(dataPost)
                .then(function (result) {
                    $scope.cancelEditDataPassword($scope.currentVarshow);
                    $scope.showRootAuthPassword = false;

                }, function (error) {
                    $scope.cancelEditDataPassword($scope.currentVarshow);
                    $scope.showRootAuthPassword = false;
                });


            $scope.dataTemp = "";
        };

        $rootScope.hideHoverConfirmPassword = function () {
            $scope.showRootAuthPassword = false;
        };


        $rootScope.isShowBoxNotification = false;
        $rootScope.showBoxNotification = function () {
            if ($rootScope.isShowBoxNotification) {
                $rootScope.isShowBoxNotification = false;
            }
            else {
                $rootScope.isShowBoxNotification = true;
            }
        };

        $rootScope.isShowBoxProfile = false;
        $rootScope.showBoxProfile = function () {
            $rootScope.isShowBoxProfile = !$rootScope.isShowBoxProfile
            $rootScope.isBoxSetting = false;
            $rootScope.isShowTheme = false
            // if($rootScope.isShowBoxProfile){
            //     $rootScope.isBoxSetting = false;
            //     $rootScope.isShowBoxProfile = false;
            // }
            // else
            // {
            //     $rootScope.isBoxSetting = false;
            //     $rootScope.isShowBoxProfile = true;
            // }
        };

        $rootScope.isBoxSetting = false;
        $rootScope.showBoxSetting = function () {
            $rootScope.isBoxSetting = !$rootScope.isBoxSetting
            $rootScope.isShowBoxProfile = false
            $rootScope.isShowTheme = false
            // if($rootScope.isBoxSetting){
            //     $rootScope.isShowBoxProfile =false
            //     $rootScope.isBoxSetting = false;
            // }
            // else
            // {
            //     $rootScope.isShowBoxProfile =false
            //     $rootScope.isBoxSetting = true;
            // }
        };
        $rootScope.isShowTheme = false;
        $rootScope.showBoxTheme = function () {
            $rootScope.isShowTheme = !$rootScope.isShowTheme
            $rootScope.isShowBoxProfile = false
            $rootScope.isBoxSetting = false;
        }
        $scope.themes = [{ name: 'Default', color: '#10c4b2' }, { name: 'Red', color: 'red' },
        { name: 'Green', color: 'green' }, { name: 'Blue', color: 'blue' },
        { name: 'Yellow', color: 'yellow' }, { name: 'Pink', color: 'pink' },
        { name: 'Aqua', color: 'aqua' }, { name: 'Cyan', color: 'cyan' },
        { name: 'Grey', color: 'grey' }]
        $scope.changeColor = function (color) {
            // alert(e)
        }
        $scope.toMainMenu = function () {
            window.history.back();
        };

        // End Syamsu

        $scope.now = new Date;
        $scope.tglSkrg = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');

        $scope.goToNotif = function (data) {
            if (data.urlForm != null && data.urlForm != '') {
                if (data.params != null) {
                    $state.go(data.urlForm, data.params);
                } else {
                    $state.go(data.urlForm);

                }

            }
            MenuService.postNonMessage('sysadmin/store-notif', { method: 'delete', norec_trans: data.norec_trans }).then(function (e) {
                for (var i = $scope.listNotif.length - 1; i >= 0; i--) {
                    if ($scope.listNotif[i].norec_trans === data.norec_trans) {
                        $scope.listNotif.splice(i, 1);
                    }
                }
                $scope.jmlNotif = $scope.listNotif.length
            })

        };
    }
    function handleOnlineStatus() {
        if (navigator.onLine) {
            toastr.success("PERANGKAT TERHUBUNG KE JARINGAN");
        } else {
            var confirm = $mdDialog.confirm()
                .title('PERINGATAN')
                .textContent('KONEKSI TERPUTUS, KLIK YA UNTUK KONFIRMASI')
                .ariaLabel('Lucky day')
                .cancel('Tidak')
                .ok('Ya')
            $mdDialog.show(confirm).then(function () {})
        }
    }
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    HeaderCtrl.$inject = ['$window', '$scope', 'MenuService', 'GlobalToState', '$rootScope', '$state', 'LoginHelper', '$location', 'socket', '$mdDialog'];

    return HeaderCtrl;
});