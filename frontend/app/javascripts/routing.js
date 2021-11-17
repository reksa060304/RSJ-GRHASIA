define([],
    function () {
        var current;
        'use strict';
        return {
            loadModule: ['$ocLazyLoad', '$q', '$route', '$state', function ($ocLazyLoad, $q, $route, $state) {
                // if (window.currentState !== this.url.source) {

                let hash = window.location.hash;
                let getException = ''
                let urlna = hash
                if (window.globalToState != undefined) {
                    urlna = window.globalToState.url
                }
                // if(window.location.hash !='#/ErrorPage'){
                checkMenu(urlna);
                // }
                let currentURL = window.currentState
                if (currentURL == '/ErrorPage') {
                    window.location.reload()
                }
                window.currentState = this.url.source;

                var globalToState = window.globalToState;
                //if (globalToState != null && globalToState != "") 
                {
                    var deferred = $q.defer();
                    var data = [];
                    var deps = this.self.deps;
                    for (var i in deps) {
                        data.push(deps[i].define);
                    }
                    data.push(this.self.controller);
                    window.deps = this.self.deps;;

                    require(data, function () {
                        var module = angular.module;
                        var temp = module('myApp');
                        if (window.deps !== undefined)
                            for (var i = 0; i < window.deps.length; i++) {
                                temp.requires.push(window.deps[i].module);
                            }
                        $ocLazyLoad.inject('myApp');
                        window.globalToState = "";
                        deferred.resolve();

                    });

                }
                // }
                /*
                var deferred = $q.defer();
                var arr = $route.current.$$route.controller;
                var data = [];
                
                var deps = $route.current.$$route.deps;
                for (var i in deps) {
                    data.push(deps[i].define);
                }
                data.push(arr);                
                window.deps = $route.current.$$route.deps;
                require(data, function () {
                    var module = angular.module;
                    var temp = module('myApp');
                    if (window.deps !== undefined)
                        for (var i = 0; i < window.deps.length; i++) {
                            temp.requires.push(window.deps[i].module);
                        }
                    $ocLazyLoad.inject('myApp');
                    deferred.resolve();
                });*/


                function checkMenu(hash) {

                    let urlAda = false
                    let link = ''
                    let menu = JSON.parse(localStorage.getItem('configMenu'));
                    let menuAll = JSON.parse(localStorage.getItem('configMenuAll'));
                    let ayaDiMenu = false
                    if (hash == "#/home") return
                    if (hash == "#/ErrorPage") return
                    if (menuAll == null) return

                    let urlHref = hash.split('/')
                    if (urlHref.length > 0) {
                        hash = urlHref[1]
                    }

                    for (let x = 0; x < menuAll.length; x++) {
                        const element = menuAll[x];
                        var url = element.alamaturlform.split('/')
                        if (url.length > 0) {
                            url = url[1]
                        }
                        if (url == hash) {
                            ayaDiMenu = true
                            break
                        }
                    }
                    if (ayaDiMenu == false) return

                    for (let i = 0; i < menu.length; i++) {
                        const element = menu[i];
                        if (element.children) {
                            for (let ii = 0; ii < element.children.length; ii++) {
                                const element2 = element.children[ii];
                                if (element2.children) {
                                    for (let iii = 0; iii < element2.children.length; iii++) {
                                        const element3 = element2.children[iii];
                                        if (element3.children) {
                                            for (let iv = 0; iv < element3.children.length; iv++) {
                                                const element4 = element3.children[iv];
                                                if (element4.children) {
                                                    for (let v = 0; v < element4.children.length; v++) {
                                                        const element5 = element4.children[v];
                                                        if (element5.children) {
                                                            for (let vi = 0; vi < element5.children.length; vi++) {
                                                                const element6 = element5.children[vi];
                                                                if (element6.children) {

                                                                } else {
                                                                    if (element6.link != undefined && element6.link.indexOf(hash) > -1) {
                                                                        urlAda = true
                                                                        link = element6
                                                                        break
                                                                    }
                                                                }
                                                            }

                                                        } else {
                                                            if (element5.link != undefined && element5.link.indexOf(hash) > -1) {
                                                                urlAda = true
                                                                link = element5
                                                                break
                                                            }
                                                        }
                                                    }

                                                } else {
                                                    if (element4.link != undefined && element4.link.indexOf(hash) > -1) {
                                                        urlAda = true
                                                        link = element4
                                                        break
                                                    }
                                                }
                                            }
                                        } else {
                                            if (element3.link != undefined && element3.link.indexOf(hash) > -1) {
                                                urlAda = true
                                                link = element3
                                                break
                                            }
                                        }
                                    }
                                } else {
                                    if (element2.link != undefined && element2.link.indexOf(hash) > -1) {
                                        urlAda = true
                                        link = element2
                                        break
                                    }
                                }
                            }
                        } else {
                            if (element.link != undefined && element.link.indexOf(hash) > -1) {
                                urlAda = true
                                link = element
                                break
                            }
                        }
                    }
                    // console.log('Izin akses url :' + urlAda)
                    // console.log(link)
                    if (urlAda == false) {
                        // checkMenu(currentURL)
                        window.location.href = window.location.origin + window.location.pathname + '#/ErrorPage'
                    }
                }


                return deferred.promise;
            }]
        }
    });