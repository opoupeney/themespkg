/*
 * DOCUMENT LOADED EVENT
 * Description: Fire when DOM is ready
 */

$.navAsAjax = false;
$.enableJarvisWidgets = true;

angular.element(document).ready(function() {

    /*
     * APP DOM REFERENCES
     * Description: Obj DOM reference, please try to avoid changing these
     */
    $.root_ = $('body');
    $.left_panel = $('#left-panel');

    // Top menu on/off
    var $topmenu = false;
    if ($('body').hasClass("menu-on-top") || localStorage.getItem('sm-setmenu')=='top' ) {
        $topmenu = true;
        $('body').addClass("menu-on-top");
    }

    /*
     * LOAD MAIN MENU
     */
    if ($('#main_menu').size()>0) {
        DreamFace.getMenu('main', function(json_menu) {
            for (var i=0; i<json_menu.definition.length; i++) {
                addMenuItem(json_menu.definition[i], 'main_menu');
            }
            // INITIALIZE LEFT NAV
            if (!$topmenu) {
                if (!null) {
                    $('nav ul').jarvismenu({
                        accordion : true,
                        speed : $.menu_speed,
                        closedSign : '<em class="fa fa-plus-square-o"></em>',
                        openedSign : '<em class="fa fa-minus-square-o"></em>'
                    });
                } else {
                    alert("Error - menu anchor does not exist");
                }
            }
        });
    }

    var addMenuItem = function(menuitem, parent) {
        var id = Math.floor(Math.random() * 100000);
        var item_fragment = '<li id="'+id+'">';

        if (menuitem.children.length>0) {
            item_fragment += '<a href="#">'
                + '<i class="' + menuitem.icon_class + '"></i>'
                + ' <span class="menu-item-parent">' + menuitem.label + '</span></a>'
                + '<ul id="'+id+'_submenu"></ul></li>';
            $('#'+parent).append( item_fragment );
            for (var i=0; i<menuitem.children.length; i++) {
                addMenuItem(menuitem.children[i], id+'_submenu');
            }
        } else {
            item_fragment += '<a href="'+menuitem.action+'" title="'+menuitem.label+'">'
                + '<i class="' + menuitem.icon_class + '"></i>'
                + ' <span'+((parent=='main_menu') ? ' class="menu-item-parent"' : '')+'>' + menuitem.label + '</span></a></li>';
            $('#'+parent).append( item_fragment );
        }

    };


    /*
     * SMART ACTIONS
     */
    var smartActions = {

        // LOGOUT MSG
        userLogout: function($this){

            // ask verification
            $.SmartMessageBox({
                title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                content : $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
                buttons : '[No][Yes]'

            }, function(ButtonPressed) {
                if (ButtonPressed == "Yes") {
                    $.root_.addClass('animated fadeOutUp');
                    setTimeout(logout, 1000);
                }
            });
            function logout() {
                window.location = $this.attr('href');
            }

        },

        // RESET WIDGETS
        resetWidgets: function($this){
            $.widresetMSG = $this.data('reset-msg');

            $.SmartMessageBox({
                title : "<i class='fa fa-refresh' style='color:green'></i> Clear Local Storage",
                content : $.widresetMSG || "Would you like to RESET all your saved widgets and clear LocalStorage?",
                buttons : '[No][Yes]'
            }, function(ButtonPressed) {
                if (ButtonPressed == "Yes" && localStorage) {
                    localStorage.clear();
                    location.reload();
                }

            });
        },

        // LAUNCH FULLSCREEN
        launchFullscreen: function(element){

            if (!$.root_.hasClass("full-screen")) {

                $.root_.addClass("full-screen");

                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }

            } else {

                $.root_.removeClass("full-screen");

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }

            }

        },

        // MINIFY MENU
        minifyMenu: function ($this) {
            if (!$.root_.hasClass("menu-on-top")) {
                $.root_.toggleClass("minified");
                $.root_.removeClass("hidden-menu");
                $('html').removeClass("hidden-menu-mobile-lock");
                $this.effect("highlight", {}, 500);
            }
        },

        // TOGGLE MENU
        toggleMenu: function () {
            if (!$.root_.hasClass("menu-on-top")) {
                $('html').toggleClass("hidden-menu-mobile-lock");
                $.root_.toggleClass("hidden-menu");
                $.root_.removeClass("minified");
            } else if ($.root_.hasClass("menu-on-top") && $.root_.hasClass("mobile-view-activated")) {
                $('html').toggleClass("hidden-menu-mobile-lock");
                $.root_.toggleClass("hidden-menu");
                $.root_.removeClass("minified");
            }
        }
    }

    $.root_.on('click', '[data-action="userLogout"]', function(e) {
        var $this = $(this);
        smartActions.userLogout($this);
        e.preventDefault();
    });

    $.root_.on('click', '[data-action="resetWidgets"]', function(e) {
        var $this = $(this);
        smartActions.resetWidgets($this);
        e.preventDefault();
    });

    $.root_.on('click', '[data-action="minifyMenu"]', function(e) {
        var $this = $(this);
        smartActions.minifyMenu($this);
        e.preventDefault();
    });

    $.root_.on('click', '[data-action="toggleMenu"]', function(e) {
        smartActions.toggleMenu();
        e.preventDefault();
    });

    $.root_.on('click', '[data-action="launchFullscreen"]', function(e) {
        smartActions.launchFullscreen(document.documentElement);
        e.preventDefault();
    });

    /*
     * APP CUSTOM ELEMENTS
     * Description: Add custom elements to the DOM
     */

    // Contextual menu
    $('#ribbon')
        .append('<div class="demo"><span id="demo-setting"><i class="fa fa-cog txt-color-blueDark"></i></span> <form><legend class="no-padding margin-bottom-10">Layout Options</legend><section><label><input name="subscription" id="smart-fixed-header" type="checkbox" class="checkbox style-0"><span>Fixed Header</span></label><label><input type="checkbox" name="terms" id="smart-fixed-navigation" class="checkbox style-0"><span>Fixed Navigation</span></label><label><input type="checkbox" name="terms" id="smart-fixed-ribbon" class="checkbox style-0"><span>Fixed Ribbon</span></label><label><input type="checkbox" name="terms" id="smart-fixed-footer" class="checkbox style-0"><span>Fixed Footer</span></label><label><input type="checkbox" name="terms" id="smart-fixed-container" class="checkbox style-0"><span>Inside <b>.container</b> <div class="font-xs text-right">(non-responsive)</div></span></label><label style="display:block;"><input type="checkbox" id="smart-topmenu" class="checkbox style-0"><span>Menu on <b>top</b></span></label> <span id="smart-bgimages"></span></section><section><h6 class="margin-top-10 semi-bold margin-bottom-5">Clear Localstorage</h6><a href="javascript:void(0);" class="btn btn-xs btn-block btn-primary" id="reset-smart-widget"><i class="fa fa-refresh"></i> Factory Reset</a></section> <h6 class="margin-top-10 semi-bold margin-bottom-5">SmartAdmin Skins</h6><section id="smart-styles"><a href="javascript:void(0);" id="smart-style-0" data-skinlogo="std/img/logo.png" class="btn btn-block btn-xs txt-color-white margin-right-5" style="background-color:#4E463F;"><i class="fa fa-check fa-fw" id="skin-checked"></i>Smart Default</a><a href="javascript:void(0);" id="smart-style-1" data-skinlogo="std/img/logo.png" class="btn btn-block btn-xs txt-color-white" style="background:#3A4558;">Dark Elegance</a><a href="javascript:void(0);" id="smart-style-2" data-skinlogo="std/img/logo.png" class="btn btn-xs btn-block txt-color-darken margin-top-5" style="background:#fff;">Ultra Light</a></section></form> </div>');

    $('#demo-setting')
    .click(function () {
        //console.log('setting');
        $('#ribbon .demo')
            .toggleClass('activate');
    })

    /*
     * FIXED HEADER
     */
    $('input[type="checkbox"]#smart-fixed-header')
        .click(function () {
            if ($(this)
                .is(':checked')) {
                //checked
                $.root_.addClass("fixed-header");
            } else {
                //unchecked
                $('input[type="checkbox"]#smart-fixed-ribbon')
                    .prop('checked', false);
                $('input[type="checkbox"]#smart-fixed-navigation')
                    .prop('checked', false);

                $.root_.removeClass("fixed-header");
                $.root_.removeClass("fixed-navigation");
                $.root_.removeClass("fixed-ribbon");

            }
        });

    /*
     * FIXED NAV
     */
    $('input[type="checkbox"]#smart-fixed-navigation')
        .click(function () {
            if ($(this)
                .is(':checked')) {
                //checked
                $('input[type="checkbox"]#smart-fixed-header')
                    .prop('checked', true);

                $.root_.addClass("fixed-header");
                $.root_.addClass("fixed-navigation");

                $('input[type="checkbox"]#smart-fixed-container')
                    .prop('checked', false);
                $.root_.removeClass("container");

            } else {
                //unchecked
                $('input[type="checkbox"]#smart-fixed-ribbon')
                    .prop('checked', false);
                $.root_.removeClass("fixed-navigation");
                $.root_.removeClass("fixed-ribbon");
            }
        });

    /*
     * FIXED RIBBON
     */
    $('input[type="checkbox"]#smart-fixed-ribbon')
        .click(function () {
            if ($(this)
                .is(':checked')) {

                //checked
                $('input[type="checkbox"]#smart-fixed-header')
                    .prop('checked', true);
                $('input[type="checkbox"]#smart-fixed-navigation')
                    .prop('checked', true);
                $('input[type="checkbox"]#smart-fixed-ribbon')
                    .prop('checked', true);

                //apply
                $.root_.addClass("fixed-header");
                $.root_.addClass("fixed-navigation");
                $.root_.addClass("fixed-ribbon");

                $('input[type="checkbox"]#smart-fixed-container')
                    .prop('checked', false);
                $.root_.removeClass("container");

            } else {
                //unchecked
                $.root_.removeClass("fixed-ribbon");
            }
        });

    /*
     * FIXED FOOTER
     */
    $('input[type="checkbox"]#smart-fixed-footer')
        .click(function () {
            if ($(this)
                .is(':checked')) {

                //checked
                $.root_.addClass("fixed-page-footer");

            } else {
                //unchecked
                $.root_.removeClass("fixed-page-footer");
            }
        });


    /*
     * RTL SUPPORT
     */
    $('input[type="checkbox"]#smart-rtl')
        .click(function () {
            if ($(this)
                .is(':checked')) {

                //checked
                $.root_.addClass("smart-rtl");

            } else {
                //unchecked
                $.root_.removeClass("smart-rtl");
            }
        });

    /*
     * MENU ON TOP
     */

    $('#smart-topmenu')
        .on('change', function (e) {
            if ($(this)
                .prop('checked')) {
                //window.location.href = '?menu=top';
                localStorage.setItem('sm-setmenu', 'top');
                location.reload();
            } else {
                //window.location.href = '?';
                localStorage.setItem('sm-setmenu', 'left');
                location.reload();
            }
        });

    if (localStorage.getItem('sm-setmenu') == 'top') {
        $('#smart-topmenu')
            .prop('checked', true);
    } else {
        $('#smart-topmenu')
            .prop('checked', false);
    }

    /*
     * INSIDE CONTAINER
     */
    $('input[type="checkbox"]#smart-fixed-container')
        .click(function () {
            if ($(this)
                .is(':checked')) {
                //checked
                $.root_.addClass("container");

                $('input[type="checkbox"]#smart-fixed-ribbon')
                    .prop('checked', false);
                $.root_.removeClass("fixed-ribbon");

                $('input[type="checkbox"]#smart-fixed-navigation')
                    .prop('checked', false);
                $.root_.removeClass("fixed-navigation");

                if (smartbgimage) {
                    $("#smart-bgimages")
                        .append(smartbgimage)
                        .fadeIn(1000);
                    $("#smart-bgimages img")
                        .bind("click", function () {
                            var $this = $(this);
                            var $html = $('html')
                            bgurl = ($this.data("htmlbg-url"));
                            $html.css("background-image", "url(" + bgurl + ")");
                        })
                    smartbgimage = null;
                } else {
                    $("#smart-bgimages")
                        .fadeIn(1000);
                }

            } else {
                //unchecked
                $.root_.removeClass("container");
                $("#smart-bgimages")
                    .fadeOut();
            }
        });

    /*
     * REFRESH WIDGET
     */
    $("#reset-smart-widget")
        .bind("click", function () {
            $('#refresh')
                .click();
            return false;
        });


    /*
     * STYLES
     */
    $("#smart-styles > a")
        .on('click', function() {
            var $this = $(this);
            var $logo = $("#logo img");
            $.root_.removeClassPrefix('smart-style')
                .addClass($this.attr("id"));
            $logo.attr('src', $this.data("skinlogo"));
            $("#smart-styles > a #skin-checked")
                .remove();
            $this.prepend("<i class='fa fa-check fa-fw' id='skin-checked'></i>");
        });

    /* DATAGRID INITIALIZATION ;*/

    //angular.element('[data-gcontrol=datagrid]').dataTable();

    /* COLUMN FILTER  */
    var otable = $('#datatable_fixed_column').DataTable({
        //"bFilter": false,
        //"bInfo": false,
        //"bLengthChange": false
        //"bAutoWidth": false,
        //"bPaginate": false,
        //"bStateSave": true // saves sort state using localStorage
        "sDom": "<'dt-toolbar'<'col-xs-6'f><'col-xs-6'<'toolbar'>>r>"+
            "t"+
            "<'dt-toolbar-footer'<'col-xs-6'i><'col-xs-6'p>>"

    });

    // Apply the filter
    $("#datatable_fixed_column thead th input[type=text]").on( 'keyup change', function () {

        otable
            .column( $(this).parent().index()+':visible' )
            .search( this.value )
            .draw();

    } );
    /* END COLUMN FILTER */

    /* COLUMN SHOW - HIDE */
    $('#datatable_col_reorder').dataTable({
        "sDom": "<'dt-toolbar'<'col-xs-6'f><'col-xs-6'C>r>"+
            "t"+
            "<'dt-toolbar-footer'<'col-xs-6'i><'col-xs-6'p>>"
    });

    /* END COLUMN SHOW - HIDE */

    /* TABLETOOLS */
    $('#datatable_tabletools').dataTable({

        // Tabletools options:
        //   https://datatables.net/extensions/tabletools/button_options
        "sDom": "<'dt-toolbar'<'col-xs-6'f><'col-xs-6'T>r>"+
            "t"+
            "<'dt-toolbar-footer'<'col-xs-6'i><'col-xs-6'p>>",
        "oTableTools": {
            "aButtons": [
                "copy",
                "csv",
                "xls",
                {
                    "sExtends": "pdf",
                    "sTitle": "SmartAdmin_PDF",
                    "sPdfMessage": "SmartAdmin PDF Export",
                    "sPdfSize": "letter"
                },
                {
                    "sExtends": "print",
                    "sMessage": "Generated by SmartAdmin <i>(press Esc to close)</i>"
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        }
    });

    /* END TABLETOOLS */

});

/*
 * CUSTOM MENU PLUGIN
 */

$.fn.extend({

    //pass the options variable to the function
    jarvismenu : function(options) {

        var defaults = {
            accordion : 'true',
            speed : 200,
            closedSign : '[+]',
            openedSign : '[-]'
        };

        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);
        //Assign current element to variable, in this case is UL element
        var $this = $(this);

        //add a mark [+] to a multilevel menu
        $this.find("li").each(function() {
            if ($(this).find("ul").size() !== 0) {
                //add the multilevel sign next to the link
                $(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

                //avoid jumping to the top of the page when the href is an #
                if ($(this).find("a:first").attr('href') == "#") {
                    $(this).find("a:first").click(function() {
                        return false;
                    });
                }
            }
        });

        //open active level
        $this.find("li.active").each(function() {
            $(this).parents("ul").slideDown(opts.speed);
            $(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
            $(this).parents("ul").parent("li").addClass("open");
        });

        $this.find("li a").click(function() {

            if ($(this).parent().find("ul").size() !== 0) {

                if (opts.accordion) {
                    //Do nothing when the list is open
                    if (!$(this).parent().find("ul").is(':visible')) {
                        parents = $(this).parent().parents("ul");
                        visible = $this.find("ul:visible");
                        visible.each(function(visibleIndex) {
                            var close = true;
                            parents.each(function(parentIndex) {
                                if (parents[parentIndex] == visible[visibleIndex]) {
                                    close = false;
                                    return false;
                                }
                            });
                            if (close) {
                                if ($(this).parent().find("ul") != visible[visibleIndex]) {
                                    $(visible[visibleIndex]).slideUp(opts.speed, function() {
                                        $(this).parent("li").find("b:first").html(opts.closedSign);
                                        $(this).parent("li").removeClass("open");
                                    });

                                }
                            }
                        });
                    }
                }// end if
                if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
                    $(this).parent().find("ul:first").slideUp(opts.speed, function() {
                        $(this).parent("li").removeClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
                    });

                } else {
                    $(this).parent().find("ul:first").slideDown(opts.speed, function() {
                        /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
                        $(this).parent("li").addClass("open");
                        $(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
                    });
                } // end else
            } // end if
        });
    } // end function
});


/* ~ END: CUSTOM MENU PLUGIN */