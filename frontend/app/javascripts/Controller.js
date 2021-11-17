define(['Service', 'Configuration'], function (Service, conf) {
    'use strict';

    function Controller($http, $scope, $timeout, $ocLazyLoad, MenuService, $rootScope, socket, $state, LoginHelper, loginService, $mdSidenav, $mdDialog, $window, $location) {
        $window.kendoAlert = (function () {
            // create modal window on the fly
            var win = $("<div>").kendoWindow({
                modal: true,
                title: "Laporan Kerusakan Barang",
                width: "400px",
                visible: false,
                close: function (e) {
                    $state.go("RespondPerbaikan");
                }
            }).getKendoWindow();
            return function (msg) {
                // set the content

                win.content("Kerusakan pada " + msg);
                // center it and open it
                win.center().open();
            };
        });
        socket.on('PermintaanPerbaikan', function (data) {
            debugger;
            //var str = data.message;
            // $scope.tmp = angular.fromJson(data.message);
            kendoAlert(data.message.keluhan);
            //console.log(data.message);
        });

        $scope.Menu = 'Pasien';
        var status = document.cookie.split(';')[0].split('=')[1];
        if (status === 'operator')
            $scope.Menu = 'Pendaftaran';
        $scope.isRouteLoading = true;
        $rootScope.$watch('doneLoad', function (e) {
            if (e === undefined) return;
            $scope.isRouteLoading = e;
        });
        $scope.toggleRight = buildToggler('right');

        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () { });
            }
        }
        $rootScope.$watch('isOpenMenu', function (e) {
            if (e === undefined) return;
            $scope.toggleRight();
        })
        $scope.orientation = "horizontal";
        $rootScope.$watch('isOpen', function (e) {
            $scope.isOpen = e;
        });
        $scope.$watch('isOpen', function (e) {
            $rootScope.showSideMenu = e;
        });
        $scope.isOpen = true;
        $scope.width = 200;
        $scope.hasLoad = false;
        $timeout(function () {
            $scope.hasLoad = true;
        }, 100);

        $rootScope.$watch('doneLoad', function (e) {
            $scope.doneLoad = e;
        });
        // $(window).on('resize', function() {
        //     if (!$scope.isTablet)
        //         $scope.width = $(window).width() - 307;
        //     else {
        //         $scope.width = $(window).width() - 27;
        //     }
        // });
        // $scope.$watch('isOpen', function(e) {
        //     if (e) {
        //         $scope.width = $(window).width() - 27;
        //     } else {
        //         if (!$scope.isTablet)

        //             if ($(window).width() > 800)
        //                 $scope.width = $(window).width() - 307;
        //             else {
        //                 $scope.width = $(window).width() - 27;
        //                 $scope.isOpen = true;
        //             }
        //         else {
        //             $scope.width = $(window).width() - 27;
        //         }
        //     }
        // });

        if (!$scope.isTablet) {
            if ($(window).width() > 800)
                $scope.width = $(window).width() - 307;
            else
                $scope.width = $(window).width() - 27;
        } else {
            $scope.width = $(window).width() - 27;
        }
        $scope.isOpen = false;
        $scope.isTablet = false;
        $scope.menuOrientation = "horizontal";

        // cek login expired        
        var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));
        if (datauserlogin) {
            if (new Date() > new Date(datauserlogin.endWaktuLogin)) {
                // window.localStorage.clear();
                $rootScope.doLogout();
            }
        } else {
            socket.emit('logout', null);

            window.localStorage.clear();

            var delete_cookie = function (name) {
                var today = new Date();
                var expr = new Date(today.getTime() + (-1 * 24 * 60 * 60 * 1000));
                document.cookie = name + '=;expires=' + (expr.toGMTString());
            }
            delete_cookie('authorization');
            delete_cookie('statusCode');
            delete_cookie('io');

            $rootScope.logoutUlang = 0;

            $window.location.replace('Logout');
        }
        //ambil menu cara lama
        $rootScope.menu = [];

        if (loginService.getBaseProfileMenu() != undefined && loginService.getBaseProfileMenu() == 1) {
            MenuService.getMenu("sysadmin/menu/get-menu-dinamis?idUser=" + datauserlogin.id + "&Profile=" + datauserlogin.kdProfile)
                .then(function (res) {
                    if (res.statResponse) {
                   
                        localStorage.setItem('configMenu', JSON.stringify(res.data));
                        let menu = res.data
                        $rootScope.menu = spliceMenu(menu)
                        localStorage.setItem('isMenuDinamis', true);
                    }
                })
            MenuService.getMenu("sysadmin/menu/get-menu-all?Profile=" + datauserlogin.kdProfile)
                .then(function (res) {
                    if (res.statResponse) {
                        localStorage.setItem('configMenuAll', JSON.stringify(res.data));
                    }
                })

        } else {
            MenuService.get("GetSideMenu" + "/" + LoginHelper.get())
                .then(function (result) {
                    $rootScope.menu = result;
                });
        }


        function spliceMenu(menu) {
            for (let i = menu.length - 1; i >= 0; i--) {
                const element = menu[i];
                if (element.ishide == true) {
                    menu.splice(i, 1)
                }
                if (element.children) {
                    for (let ii = element.children.length - 1; ii >= 0; ii--) {
                        const element2 = element.children[ii];
                        if (element2.ishide == true) {
                            element.children.splice(ii, 1)
                        }
                        if (element2.children) {
                            for (let iii = element2.children.length - 1; iii >= 0; iii--) {
                                const element3 = element2.children[iii];
                                if (element3.ishide == true) {
                                    element2.children.splice(iii, 1)
                                }
                                if (element3.children) {
                                    for (let iv = element3.children.length - 1; iv >= 0; iv--) {
                                        const element4 = element3.children[iv];
                                        if (element4.ishide == true) {
                                            element3.children.splice(iv, 1)
                                        }
                                        if (element4.children) {
                                            for (let v = element4.children.length - 1; v >= 0; v--) {
                                                const element5 = element4.children[v];
                                                if (element5.ishide == true) {
                                                    element4.children.splice(v, 1)
                                                }
                                                if (element5.children) {

                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return menu;
        }
        // $scope.$watch('autoLogin', function (e) {
        //     if (e !== true) return;
        //     var userName = "sdm";
        //     var password = "admin";
        //     loginService.authentication({
        //         namaUser: userName,
        //         kataSandi: password
        //     }).then(function (data) {

        //         if (data.data.messages.message) {
        //             window.messageContainer.error(data.data.messages.message);
        //             $scope.isBusy = false;
        //             return;
        //         }
        //         var cookieStr = "statusCode=" + data.data.data.kelompokUser.kelompokUser + ';';
        //         document.cookie = cookieStr;
        //         document.cookie = 'authorization=' + data.data.messages['X-AUTH-TOKEN'] + ";";
        //         window.localStorage.setItem('pegawai', JSON.stringify(data.data.data.pegawai));
        //         var dataUrlRoute = [];
        //         // var dataUrlRouteAkuntansi = [];
        //         $.when(
        //             $.getJSON(conf.urlRoute, function (data) {
        //                 dataUrlRoute = data;
        //             }),
        //             // $.getJSON(conf.urlRoute_Akuntansi, function(data) {
        //             //     dataUrlRouteAkuntansi = data;
        //             // })
        //         ).then(function () {
        //             var msgError = "";
        //             var arrDataConfig = [dataUrlRoute];
        //             var dataConfig = [];
        //             dataConfig.push({
        //                 "nameDep": "jQuery",
        //                 "urlDep": "../jquery"
        //             });
        //             for (var i = 0; i < arrDataConfig.length; i++) {
        //                 for (var k = 0; k < arrDataConfig[i].length; k++) {
        //                     dataConfig.push(arrDataConfig[i][k]);
        //                 }
        //             }

        //             if (msgError == "") {
        //                 window.localStorage.setItem('urlBind', JSON.stringify(dataConfig));
        //                 window.location = "#" + $scope.url;
        //             }
        //         });

        //         $scope.isBusy = false;
        //     },
        //         function (error) {
        //             $scope.isBusy = false;
        //             window.messageContainer.error('Gagal masuk ke dalam system')
        //         });
        // })
    }
    Controller.$inject = ['$http', '$scope', '$timeout', '$ocLazyLoad', 'MenuService', '$rootScope', 'socket', '$state', 'LoginHelper', 'LoginService', '$mdSidenav', '$mdDialog', '$window', '$location'];
    return Controller;
});