angular.module('ionic.ghost.blog.controllers', ['ionic' ])
    .controller('post-controller', function($rootScope, $scope, $location, $timeout, $stateParams, $ionicScrollDelegate) {
       // $rootScope.$on('$viewContentLoaded',function(){

            /*    setTimeout(function(){
             $scope.scrollView.options.scrollingY = false;
             }, 100);*/
            var go_left_nav = {
                type: '',
                content: '<i class="icon  ion-chevron-left"></i>',
                tap: function(e) {
                    clearTimeout($scope.loop_timer);
                    $scope.$broadcast('slideBox.prevSlide');
                }
            }
            var go_right_nav = {
                type: '',
                content: '<i class="icon ion-chevron-right"></i>',
                tap: function(e) {
                    clearTimeout($scope.loop_timer);
                    $scope.$broadcast('slideBox.nextSlide');

                    clearTimeout($scope.loop_timer);
                }
            }
            var leftMenuEl = document.getElementById('menu-left');
            var leftMenu = new ionic.views.SideMenu({
                el: leftMenuEl,
                width: 270,
                isEnabled:false
            });
            leftMenu.isEnabled = false;//HACKY BUG FIX
        leftMenu.pushDown();
        var contentEl = document.getElementById('content');
        var content = new ionic.views.SideMenuContent({
            el: contentEl
        });
        $scope.sideMenuController = new ionic.controllers.SideMenuController({
            content: content,
            left: leftMenu//,
            //right: rightMenu
        });
        $(leftMenuEl).css('z-index', -200);
            var menu_nav = {
                type: '',
                content: '<i class="icon ion-navicon"></i>',
                tap: function(e) {

                    $scope.sideMenuController.toggleLeft();
                    leftMenu.pushDown();
                    $scope.menu_is_out = !$scope.menu_is_out;
                    if($scope.menu_is_out){
                        $(leftMenuEl).css('z-index', -1);
                    }else{
                        setTimeout(function(){
                            $(leftMenuEl).css('z-index', -200);
                        }, 10);
                    }
                }
            }
            $scope.menu_is_out = false;
            $scope.leftButtons = [
                menu_nav
            ];
            //
            $scope.rightButtons = [
                go_right_nav
            ];



            /*$scope.on_scroll = on_scroll = function(e){
             e = e || window.event;

             if(!$scope.scroll){
             $ionicScrollDelegate.scrollTo(0,0, false);
             }


             return false;
             }*/
            $scope.loop_timer = setInterval(function(){

                $scope.$broadcast('slideBox.nextSlide');
            }, 5000);
            $scope.slideChanged =  function(slide) {
                $scope.slide_ct = $('#div-slide-content').find('article[data-url]').length;
                $scope.slide_index = slide;
                $ionicScrollDelegate.scrollTo(0,0);
                if($scope.ignore_slide_change_once){
                    $scope.scrollView.options.scrollingY = false;
                    $scope.scrollView.options.scrollingX = true;
                    $('.post-content').css('display','none');
                    $('.post-excerpt').css('display','block');

                }
                $scope.ignore_slide_change_once = false;
                //$scope.$parent.slideBox.slide(i);
                console.log( $scope.$parent.slideBox);
                $scope.leftButtons = [
                    menu_nav
                ];
                $scope.rightButtons = [ ];
                if(slide < $scope.slide_ct -1){
                    $scope.rightButtons.push(go_right_nav);

                }
                if(slide > 0){
                    $scope.leftButtons.push(go_left_nav);
                }

            };
        $timeout(function(){
            $ionicScrollDelegate.scrollTo(0,0);
            $('.bg-holder').css('height', window.screen.height);
            $('.post-content').css('display','none');
            $('.post-excerpt').css('display','block');
            var jColl = $('#div-slide-content').find('article[data-url]');

            for(var i = 0; i < jColl.length; i++){
                var jPost =  $(jColl[i]);
                var data_url = jPost.attr('data-url');

                while(data_url.indexOf('/') != -1){
                    data_url = data_url.replace('/', '');
                }

                if(data_url == $stateParams.post){


                    jPost.find('.post-content').css('display','block');
                    jPost.find('.post-excerpt').css('display','none');
                    //$scope.scrollView.__enableScrollY = true;true
                    clearTimeout($scope.loop_timer);


                    if($scope && $scope.$parent && $scope.$parent.slideBox){
                        $scope.$parent.slideBox.slide(i);
                        $scope.slide_index = i;

                    }
                    $scope.scrollView.options.scrollingY = true;
                    $scope.scrollView.options.scrollingX = false;
                    $scope.ignore_slide_change_once = true;
                    $scope.$broadcast('scroll.resize');
                    $scope.$broadcast('slideBox.setSlide', [i]);




                    return;
                }
            }

        }, 100);
       // });
})