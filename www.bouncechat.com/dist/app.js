function getPrettyDurationStr(a, b) {
    var c = getDurationObject(a, b);
    return c.y >= 1 ? 1 !== c.y ? c.y + " years" : c.y + " year" : c.m >= 1 ? 1 !== c.m ? c.m + " months" : c.m + " month" : c.w >= 1 ? 1 !== c.w ? c.w + " weeks" : c.w + " week" : c.d >= 1 ? 1 !== c.d ? c.d + " days" : c.d + " day" : c.h >= 1 ? 1 !== c.h ? c.h + " hours" : c.h + " hour" : c.min >= 1 ? 1 !== c.min ? c.min + " minutes" : c.min + " minute" : c.s >= 1 ? 1 !== c.s ? c.s + " seconds" : c.s + " second" : void 0
}

function getDurationObject(a, b) {
    var c = 1e3,
    d = 60 * c,
    e = 60 * d,
    f = 24 * e,
    g = 7 * f,
    h = 4.348 * g,
    i = 12 * h,
    j = Math.abs(a.getTime() - b.getTime());
    return {
        y: Math.floor(j / i),
        m: Math.floor(j / h),
        w: Math.floor(j / g),
        d: Math.floor(j / f),
        h: Math.floor(j / e),
        min: Math.floor(j / d),
        s: Math.floor(j / c)
    }
}
angular.module("bouncefilters", []), angular.module("BounceApp", ["ngRoute", "ngSanitize", "bouncefilters", "ui.bootstrap", "ui.bootstrap-slider", "ks.ngScrollRepeat", "LocalStorageModule", "ngHello", "ngFileUpload", "angular-click-outside", "ui.select", "ahdin"]).config(["helloProvider", function(a) {
    a.init({
	//////////////////MODIFIED TO LOOKUP MAIN KEY////////////////////
        twitter: appContext['configuration']['TWITTER_API_KEY'],
	facebook: appContext['configuration']['FACEBOOK_API_KEY']
	//////////////////MODIFIED TO LOOKUP MAIN KEY////////////////////
    }, {
        redirect_uri: "dist/redirect.html"
    })
}]).config(["localStorageServiceProvider", function(a) {
    a.setPrefix("ls").setStorageType("localStorage")
}]).config(["$httpProvider", function(a) {
    a.defaults.useXDomain = !0, delete a.defaults.headers.common["X-Requested-With"], a.defaults.headers.common.Accept = "application/json", a.defaults.headers.common["Content-Type"] = "application/json"
}]).factory("Globals", function() {
    return {
	//////////////////MODIFIED TO LOOKUP MAIN KEY////////////////////
	API_BASE_URL: appContext['configuration']['API_BASE_URL'],
	//////////////////MODIFIED TO LOOKUP MAIN KEY////////////////////
        API_KEY: "api_key",
        FB_ID: "fb_id",
        FB_TOKEN: "fb_token",
        TWIT_ID: "twitter_id",
        TWIT_TOKEN: "twitter_token",
        USER_NAME: "username",
        USER_PICTURE: "user_picture",
        VERBOSE: 3,
        ERROR_PREFIX: "BOUNCEAPP_ERROR",
        LOG_PREFIX: "BOUNCEAPP",
        LATITUDE: null,
        LONGITUDE: null,
        SCROLL_TOP_COLLAPSED: 400,
        SCROLL_TOP_EXPANDED: 600,
        refreshWhenScrollTop: this.SCROLL_TOP_COLLAPSED
    }
}), angular.module("BounceApp").controller("CommentsController", ["$scope", "bounces", function(a, b) {
    var c = 2;
    a.init = function(b) {
        a.bounceCopy = b, a.comments = b.hasOwnProperty("comments") ? b.comments.slice(0, c) : []
    }, a.loadAllComments = function() {
        a.comments = a.bounceCopy.comments, a.hideButton = !0
    }
}]), angular.module("BounceApp").controller("CreateBounceController", ["$scope", "$http", "$q", "Globals", "localStorageService", "hello", "Upload", "Ahdin", function(a, b, c, d, e, f, g, h) {
    function i() {
        return null !== e.get(d.API_KEY) ? !0 : !1
    }

    function j() {
        return null !== e.get(d.FB_ID) && null !== e.get(d.FB_TOKEN) ? !0 : !1
    }

    function k() {
        return null !== e.get(d.TWIT_ID) && null !== e.get(d.TWIT_TOKEN) ? !0 : !1
    }

    function l() {
        var a = e.get(d.USER_NAME);
        return null !== a ? a : ""
    }

    function m() {
        var a = e.get(d.USER_PICTURE);
        return null !== a ? a : ""
    }

    function n() {
        return {
	    text: "",
	    location: null,
	    shareFacebook: null,
	    shareTwitter: null
        }
    }

    function o(c) {
        d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | loginWithSocialNetwork..."), d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | login with " + c.name + "..."), f(c.name).login().then(function(g) {
	    c.loggedIn = !0, d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | hello login response: "), d.VERBOSE >= 3 && console.log(g);
	    var h = "twitter" == c.name ? g.authResponse.access_token.substring(11) : g.authResponse.access_token;
	    f(c.name).api("me").then(function(g) {
                d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | logged in with " + c.name), d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | and with response: " + JSON.stringify(g, null, 1)), a.userName = g.name;
                var i = g.id.toString();
                f("facebook").api("me/picture?redirect=false", {
		    width: 100,
		    height: 100
                }).then(function(f) {
		    var g = f.data[0].url;
		    b({
                        url: g,
                        method: "GET",
                        responseType: "blob"
		    }).then(function(b) {
                        a.userPictureFile = b.data, a.userPictureFile.name = "picture.jpg", e.set(d.USER_NAME, a.userName), e.set(d.USER_PICTURE, g), e.set(c.idName, i), e.set(c.tokenName, h), p({
			    network: c.name,
			    id: i,
			    token: h
                        })
		    }, function(a) {
                        console.error(d.ERROR_PREFIX + " | ".JSON.stringify(a, null, 1))
		    })
                }, function(a) {
		    console.error(d.ERROR_PREFIX + " | ".JSON.stringify(a, null, 1))
                })
	    }, function(b) {
                console.error(d.ERROR_PREFIX + " | with the error: " + JSON.stringify(b, null, 1)), d.VERBOSE >= 1 && console.log(d.ERROR_PREFIX + " | logout from " + c.name + "..."), a.logoutFromSocialNetwork(c)
	    })
        }, function(a) {
	    console.error(d.ERROR_PREFIX + " | " + c.name + " login error: " + a.error.message)
        })
    }

    function p(c) {
        if (!i()) {
	    if (d.VERBOSE >= 3 && console.log(JSON.stringify(c, null, 1)), "facebook" == c.network) var f = {
                fb_id: c.id,
                fb_token: c.token
	    };
	    else {
                if ("twitter" != c.network) return void console.error(d.ERROR_PREFIX + " | " + c.network + " login with Bounce API error: an if block needs to be implemented in CreateBounceController@loginWithBounceAPI");
                var g = c.token.split(":"),
                f = {
                    tw_id: c.id,
                    tw_token: g[0],
                    tw_secret: g[1].split("@")[0]
                };
                console.log(f)
	    }
	    var h = {
                url: d.API_BASE_URL + "/login",
                method: "POST",
                data: f
	    };
	    b(h).then(function(b) {
                d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | logged in with bounce"), d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | Bounce API login response JSON: " + JSON.stringify(b, null, 1)), e.set("userId",b.data.user.userId),e.set(d.API_KEY, b.data.token), a.userLoggedIn = !0, a.hamburgerMenuActive = !1, a.visibleBounceControls = !1, console.log(b.data.user.picture.indexOf("default") > -1), b.data.user.picture.indexOf("default") > -1 && u(a.userPictureFile, d.API_BASE_URL + "/users/" + b.data.user.userId + "/picture", "PUT")
	    }, function(a) {
                console.error(d.ERROR_PREFIX + " | fail callback running!"), console.error(a)
	    })
        }
    }

    function q(a) {
        var b = c.defer();
        return d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | logoutFromSocialNetwork"), f(a.name).logout().then(function(c) {
	    d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | logged out from " + a.name), a.loggedIn = !1, null !== e.get(a.idName) && e.remove(a.idName), null !== e.get(a.tokenName) && e.remove(a.tokenName), b.resolve(c)
        }, function(c) {
	    d.VERBOSE >= 2 && console.log(d.ERROR_PREFIX + " | " + a.name + " logout: " + c.error.message), d.VERBOSE >= 3 && console.log(c), r(a), b.resolve(c)
        }), b.promise
    }

    function r(a) {
        a.loggedIn = !1, null !== e.get(a.idName) && e.remove(a.idName), null !== e.get(a.tokenName) && e.remove(a.tokenName)
    }

    function s() {
        return "" === a.bounce.text && null === a.pictureUploadedId ? (a.bounceTextOrPictureRequiredError = !0, !1) : (a.bounceTextOrPictureRequiredError = !1, a.bounceExpirationRadiusRequiredError = !1, !0)
    }

    function t(b) {
        var c = {
	    message: a.bounce.text
        };
        a.pictureUrl && (c.picture = "facebook" === b ? a.pictureUrl.facebook : a.pictureUrl.twitter), f(b).api("me/share", "post", c).then(function(a) {
	    d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | Bounce has been shared with " + b)
        }, function(a) {
	    console.error(d.ERROR_PREFIX + " | with the error: " + JSON.stringify(a, null, 1))
        })
    }

    function u(b, c, f) {
        return console.log(b), console.log(c), b.size > 1e6 ? void(a.bouncePictureStillUploadingError = !0) : void g.upload({
	    url: c,
	    file: {
                picture: b
	    },
	    method: f,
	    headers: {
                Authorization: "Bearer " + e.get(d.API_KEY),
                "Content-Type": "multipart/form-data"
	    },
	    fileName: b.name,
	    fileFormDataName: "picture"
        }).progress(function(b) {
	    a.progressbar = parseInt(100 * b.loaded / b.total), d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | file uploaded progress: " + a.progressbar + "% " + b.config.file.name)
        }).success(function(b) {
	    d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | file uploaded id: " + b.fileId), a.pictureUploadedId = b.fileId, v = 0
        }).error(function(a) {
	    console.log(a)
        })
    }
    var v = 0;
    a.bounce = n(), a.visibleBounceControls = !1, a.fullHeightTextarea = !1, a.textareaExpanded = !1, a.hamburgerMenuActive = !1, a.validImageFormats = {
        jpeg: !0,
        jpg: !0,
        png: !0
    }, a.expirations = [{
        text: "10 min",
        value: "10m"
    }, {
        text: "1 hr",
        value: "1h"
    }, {
        text: "1 day",
        value: "24h"
    }, {
        text: "1 wk",
        value: "168h"
    }, {
        text: "1 mo",
        value: "720h"
    }, {
        text: "Eternity",
        value: "eternity"
    }], a.expiration = {}, a.distances = [{
        text: "100 yards",
        value: "91.44"
    }, {
        text: "1 mile",
        value: "1609.34"
    }, {
        text: "10 miles",
        value: "16093.4"
    }, {
        text: "100 miles",
        value: "160934"
    }, {
        text: "Galactic",
        value: "infin"
    }], a.distance = {}, a.userPictureFile = null, a.textareaPlaceholder = "Share photos, pics and events!", a.bounceTextOrPictureRequiredError = !1, a.bounceExpirationRadiusRequiredError = !1, a.bouncePictureFormatError = !1, a.bouncePictureTooLargeError = !1, a.bouncePictureStillUploadingError = !1, a.pictureToUpload = null, a.pictureUploadedId = null, a.pictureUrl = null, a.userName = l(), a.userPicture = m(), a.userLoggedIn = i();
    var w = {
        name: "facebook",
        loggedIn: j(),
        idName: d.FB_ID,
        tokenName: d.FB_TOKEN
    },
    x = {
        name: "twitter",
        loggedIn: k(),
        idName: d.TWIT_ID,
        tokenName: d.TWIT_TOKEN
    };
    a.expandTextarea = function(b) {
        b = "undefined" != typeof b ? b : !0, b ? (a.textareaExpanded = !0, a.visibleBounceControls = !0) : (a.textareaExpanded = !1, a.visibleBounceControls = !1)
    }, a.loginToBounceWithFacebook = function() {
        o(w)
    }, a.loginToBounceWithTwitter = function() {
        o(x)
    }, a.loginForSharingWithFacebook = function() {
        a.bounce.shareFacebook && w.loggedIn === !1 && a.loginToBounceWithFacebook()
    }, a.loginForSharingWithTwitter = function() {
        a.bounce.shareTwitter && x.loggedIn === !1 && a.loginToBounceWithTwitter()
    }, a.logout = function() {
        d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | logout"), d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | logout from bounce..."), d.VERBOSE >= 2 && w.loggedIn && console.log(d.LOG_PREFIX + " | logout from facebook..."), d.VERBOSE >= 2 && x.loggedIn && console.log(d.LOG_PREFIX + " | logout from twitter...");
        var b = [];
        w.loggedIn && b.push(q(w)), x.loggedIn && b.push(q(x)), c.all(b).then(function(b) {
	    null !== e.get(d.API_KEY) && (e.remove(d.API_KEY), d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | logged out from bounce")), null !== e.get(d.USER_NAME) && (e.remove(d.USER_NAME), e.remove(d.USER_PICTURE)), a.resetDefaults()
        }, function(b) {
	    console.error(d.ERROR_PREFIX + " | " + socialNetwork.name + " logout error: " + b.error.message), a.userLoggedIn = !0
        }), a.userLoggedIn = !1, a.hamburgerMenuActive = !1
    }, a.resetDefaults = function() {
        d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | resetDefaults..."), d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | resetDefaults | bounce object keys: " + Object.keys(a.bounce)), a.visibleBounceControls = !1, a.fullHeightTextarea = !1, a.textareaExpanded = !1, a.pictureToUpload = null, a.bounce = n();
        for (var b in a.expiration) delete a.expiration[b];
        for (var b in a.distance) delete a.distance[b]
    }, a.createBounce = function() {
        if (s() === !1) return void(a.visibleBounceControls = !0);
        "" === a.bounce.text && (a.bounce.text = a.textareaPlaceholder);
        var c = null !== a.pictureUploadedId ? [a.pictureUploadedId] : [],
        f = a.expiration.selected;
        f = "undefined" == typeof f ? a.expirations[5] : f;
        var g = a.distance.selected;
        g = "undefined" == typeof g ? a.distances[4] : g;
        var h = {
	    message: a.bounce.text,
	    latitude: d.LATITUDE,
	    longitude: d.LONGITUDE,
	    category: 1,
	    length: f.value.toString(),
	    files: c,
	    scope: parseFloat(g.value),
	    locationVisibility: a.bounce.location ? "visible" : "hidden",
	    infinity: "infin" == g.value ? 1 : 0,
	    eternity: "eternity" == f.value ? 1 : 0
        };
        d.VERBOSE >= 3 && console.log(d.LOG_PREFIX + " | bounce to send: " + JSON.stringify(h, null, 1)), b({
	    method: "POST",
	    url: d.API_BASE_URL + "/bounces/create",
	    data: h,
	    headers: {
                Authorization: "Bearer " + e.get(d.API_KEY),
                "Content-Type": "application/json"
	    }
        }).then(function(b) {
	    if (d.VERBOSE >= 1 && console.log(d.LOG_PREFIX + " | Bounce has been created"), d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | Bounce response object : " + JSON.stringify(b, null, 1)), -1 != Object.keys(b.data).indexOf("files")) {
                var c = b.data.files[0].url;
                a.pictureUrl = {
		    facebook: c,
		    twitter: c.substring(7)
                }
	    }
	    a.bounce.shareFacebook && t("facebook"), a.bounce.shareTwitter && t("twitter"), a.resetDefaults()
        }, function(a) {
	    console.error(d.ERROR_PREFIX + " | couldn't create the Bounce with the error: " + JSON.stringify(a, null, 1))
        })
    }, a.upload = function(b, c, e, f, g, i) {
        if (d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | ngUpload upload event triggered"), d.VERBOSE >= 2 && console.log(d.LOG_PREFIX + " | $file: " + JSON.stringify(c, null, 1)), a.pictureToUpload = c, null !== c)
	    if ("image/jpeg" == c.type) var j = "jpeg";
        else {
            if ("image/png" != c.type) return;
            var j = "png"
        }
        h.compress({
	    sourceFile: c,
	    maxWidth: 1e3,
	    outputFormat: j,
	    quality: .8
        }).then(function(a) {
	    u(a, d.API_BASE_URL + "/bounces/picture", "POST")
        })
    }
}]), angular.module("BounceApp").controller("MainController", ["$scope", "$timeout",/*"$interval",*/ "$timeout", "$http", "bounces", "Globals", function(a, b, c, d, e, f) {
    function g(a) {
        var b = {
	    1: "Permission denied",
	    2: "Position unavailable",
	    3: "Request timeout"
        };
        console.error(f.ERROR_PREFIX + " | with the error: " + b[a.code]), f.VERBOSE >= 1 && console.log(f.LOG_PREFIX + " | reload document..."), w >= x && c(function() {
	    x++, location.reload()
        }, 1e3)
    }

    function h(b) {
        a.geoLocationMessage = !1, a.$apply(), f.LATITUDE = B.latitude = b.coords.latitude, f.LONGITUDE = B.longitude = b.coords.longitude, l()
    }

    function i() {
        A = !0, B.offset = 0, y = 0, z = 0
    }

    function j() {
        angular.isDefined(n) && (b.cancel(n), n = void 0)
    }

    function k() {
        document.getElementById("top").scrollTop <= t && (i(), l(!0, !1))
    }

    function l(c, d) {
        if (d = "undefined" != typeof d ? d : !0, null !== B.latitude && null !== B.longitude) {
	    var f = angular.copy(B);
	    A === !0 && (f.limit = o), e.nextPage(a.mode, f).success(function(e) {
                if (A === !0 || a.bounces.length != e.length || m(a.bounces, e) === !1) {
		    c === !0 && (a.bounces = []);
		    for (var f = 0, g = e.length; g > f; f++) a.bounces.push(e[f])
                }
                A === !0 && d === !0 && (j(), n = b(k, s)), A = !1;
	//////////////////MODIFIED TO INTEGRATE ANGULAR JS WITH BC SYSTEM////////////////////
		appContext.resultJSON.searchJSON=e;
		appContext.getUserId();
		setTimeout("appContext.userinterface.updateBounceUI("+JSON.stringify(appContext.resultJSON.searchJSON)+');',1);
	//////////////////MODIFIED TO INTEGRATE ANGULAR JS WITH BC SYSTEM////////////////////
	    })
        }
    }

    function m(b, c) {
        for (var d = 0, e = a.bounces.length; e > d; d++)
	    if (b[d].bounceId !== c[d].bounceId) return !1;
        return !0
    }
    var n, o = 20,
    p = 1,
    q = 10,
    r = p * q * 2,
    s = 1e3,
    t = 600,
    u = [91.44, 1609.34, 16093.4, 160934, -1],
    v = 3,
    w = 4,
    x = 0,
    y = 0,
    z = 0,
    A = !0;
    a.bounces = [], a.radioModel = "Everyone", a.mode = 0, a.geoLocationMessage = !0, a.geoLocationError = !1;
    var B = {
        distance: u[v - 1],
        latitude: null,
        longitude: null,
        limit: r,
        offset: 0
    };
    if (a.slider = {
        value: v - 1,
        oldValue: 0
    }, navigator.geolocation) {
        var C = navigator.userAgent.indexOf("android") > -1 ? "10000" : "5000",
        D = {
            enableHighAccuracy: !0,
            timeout: C,
            maximumAge: 1e3
        },
        E = navigator.geolocation.watchPosition(h, g, D);
        setTimeout(function() {
	    navigator.geolocation.clearWatch(E)
        }, C)
    } else console.error(f.ERROR_PREFIX + " | Geolocation is not available with your browser."), a.geoLocationError = !0;
    a.slideEnded = function() {
        a.slider.value !== a.slider.oldValue && (a.slider.oldValue = a.slider.value, B.distance = u[a.slider.value], i(), l(!0))
    }, a.changeDisplayMode = function(b) {
        a.mode = b, i(), l(!0)
    }, a.$on("bottom-reached", function() {
        y++, z++, (z === p || 3 > y) && (z = 0, y > 1 ? B.offset += r : B.offset = 0, l(!1))
    })
}]), angular.module("BounceApp").directive("bounceStructure", function() {
    return {
        restrict: "E",
        scope: {
	    bounce: "="
        },
        templateUrl: "dist/bounce-structure.html"
    }
}), angular.module("BounceApp").directive("dynamicPlaceholder", function() {
    return {
        restrict: "A",
        link: function(a, b, c) {
	    c.$observe("dynamicPlaceholder", function(a) {
                b.attr("placeholder", a)
	    })
        }
    }
}), angular.module("BounceApp").directive("fileread", [function() {
    return {
        scope: {
	    fileread: "="
        },
        link: function(a, b, c) {
	    b.bind("change", function(b) {
                a.$apply(function() {
		    console.log(b.target.files[0]), a.fileread = b.target.files[0]
                })
	    })
        }
    }
}]), angular.module("BounceApp").directive("ngImageCompress", ["$q", function(a) {
    var b = window.URL || window.webkitURL,
    c = function(a, b) {
        var c = b.resizeType,
        d = 100 * b.resizeQuality || 70,
        e = "image/jpeg";
        void 0 !== c && "png" === c && (e = "image/png");
        var f = b.resizeMaxHeight || 300,
        g = b.resizeMaxWidth || 250,
        h = a.height,
        i = a.width;
        i > h ? i > g && (h = Math.round(h *= g / i), i = g) : h > f && (i = Math.round(i *= f / h), h = f);
        var j = document.createElement("canvas");
        j.width = i, j.height = h;
        var k = (j.getContext("2d").drawImage(a, 0, 0, i, h), j.toDataURL(e, d / 100)),
        l = new Image;
        return l.src = k, l.src
    },
    d = function(a, b) {
        var c = new Image;
        c.onload = function() {
            b(c)
        }, c.src = a
    },
    e = function(b) {
        var c = a.defer(),
        d = new FileReader;
        return d.onload = function(a) {
            c.resolve(a.target.result)
        }, d.readAsDataURL(b), c.promise
    };
    return {
        restrict: "A",
        scope: {
	    image: "=",
	    resizeMaxHeight: "@?",
	    resizeMaxWidth: "@?",
	    resizeQuality: "@?",
	    resizeType: "@?"
        },
        link: function(a, f, g) {
	    var h = function(b, e) {
                d(b.url, function(d) {
                    var f = c(d, a);
                    b.compressed = {
                        dataURL: f,
                        type: f.match(/:(.+\/.+);/)[1]
                    }, e(b)
                })
            },
            i = function(b) {
                a.$apply(function() {
                    g.multiple ? a.image.push(b) : a.image = b
                })
            };
	    f.bind("change", function(c) {
                g.multiple && (a.image = []);
                for (var d = c.target.files, f = 0; f < d.length; f++) {
		    var j = {
                        file: d[f],
                        url: b.createObjectURL(d[f])
		    };
		    e(d[f]).then(function(a) {
                        j.dataURL = a
		    }), a.resizeMaxHeight || a.resizeMaxWidth ? h(j, function(a) {
                        i(a)
		    }) : i(j)
                }
	    })
        }
    }
}]), angular.module("BounceApp").directive("validFile", function() {
    return {
        require: "ngModel",
        link: function(a, b, c, d) {
	    b.bind("change", function() {
                a.$apply(function() {
		    d.$setViewValue(b.val()), d.$render()
                }), console.log(b.val())
	    })
        }
    }
}), angular.module("bouncefilters").filter("linkyUnsanitized", ["$sanitize", function(a) {
    var b = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
    c = /^mailto:/;
    return function(a, d) {
        function e(a) {
	    a && k.push(a)
        }

        function f(a, b) {
	    console.log("FILTER_DEBUG"), k.push("<a "), k.push('target="_blank" '), k.push('href="'), k.push(a), k.push('">'), e(b), k.push("</a>")
        }
        if (!a) return a;
        for (var g, h, i, j = a, k = []; g = j.match(b);) h = g[0], g[2] == g[3] && (h = "mailto:" + h), i = g.index, e(j.substr(0, i)), f(h, g[0].replace(c, "")), j = j.substring(i + g[0].length);
        return e(j), k.join("")
    }
}]), angular.module("bouncefilters").filter("prettyDurationStr", function() {
    return function(a) {
        var b = new Date(a.replace(" ", "T") + "Z");
        return getPrettyDurationStr(new Date, b)
    }
}), angular.module("bouncefilters").filter("toFixed", function() {
    return function(a, b) {
        return a.toFixed(b)
    }
}), angular.module("bouncefilters").filter("toTrust", ["$sce", function(a) {
    return function(b) {
        return a.trustAsHtml(b)
    }
}]), angular.module("BounceApp").factory("bounces", ["$http", "Globals", function(a, b) {
    var c = function() {
        this.after = ""
    };
    return c.prototype.nextPage = function(c, d) {
        if (-1 === d.distance) var e = 1;
        else var e = 0;
        var f = b.API_BASE_URL + "/bounces/search?comments=1",
        g = f + "&lat=" + d.latitude + "&limit=" + d.limit + "&long=" + d.longitude + "&offset=" + d.offset + "&distance=" + d.distance + "&eternity=1";
	return 1 === c && (g += "&feed=popular"), 1 === e && (g += "&infinity=1"), b.VERBOSE >= 2 && console.log(b.LOG_PREFIX + " | queryUrl: " + g), a.get(g)
    }, new c
}]);

//LEGACY ANGULARJS CODE ABOVE
//////////////////////////////////////////////////////////
//CUSTOM BOUNCECHAT SYSTEM BELOW

/* AUTHENTICATION CLASS */
var authentication={
    "initialize":function(){
	$(document).ready(function(){
	    appContext.getBearerToken();
	    appContext.getUserId();
	});
    },
    "getBearerToken":function(){
	return	appContext.BEARER_TOKEN=window.localStorage.getItem('ls.api_key');
    },
    "getFacebookId":function(){
	return window.localStorage.getItem('ls.fb_id');
    },
    "getUserId":function(){
	appContext.userId=window.localStorage.getItem('ls.userId');
	appContext.facebookId=appContext.getFacebookId();
	if(!(facebookId==null || facebookId==undefined || facebookId=='') &&
	   (appContext.userId==null || appContext.userId==undefined || appContext.userId=='')){
	    app.authentication.clearLocalStorageAndLogout();
	}
	return appContext.userId;
    },
    "clearLocalStorageAndLogout":function(){
	    window.localStorage.clear();
	    location.reload();
    }
};

/* EVENT HANDLERS CLASS */
var eventHandlers={
    "clickEventHandler":function(requestName,args){
	event.preventDefault();  
	if (event.stopPropagation) { event.stopPropagation(); } 
	else { event.cancelBubble = true; }
	var requestTimeout=appContext.requestTimeout[
	    appContext.requestNameIndex.indexOf(requestName)];
	if(requestTimeout!=""){return false;}
	appContext.BEARER_TOKEN=appContext.getBearerToken();
	if((appContext.BEARER_TOKEN==null || appContext.BEARER_TOKEN==undefined || appContext.BEARER_TOKEN=='')
	   && appContext.eventRequiresToken[appContext.requestNameIndex.indexOf(requestName)]){
	    return false;
	}
	var eventHandler=appContext.eventHandler[appContext.requestNameIndex.indexOf(requestName)];
	var arguments=args;
	appContext.eventArguments[appContext.requestNameIndex.indexOf(requestName)]=arguments;
	eventHandler(requestName,arguments);
	appContext.requestTimeout[
	    appContext.requestNameIndex.indexOf(requestName)]=
	    setTimeout('try{var xhr=appContext.asyncJSONHTTPRequest['+
		       appContext.requestNameIndex.indexOf(requestName)+
		       '];if(xhr!=null && xhr!=undefined && xhr!=""'+
		       '&& xhr.readyState != 4){xhr.abort();}}'+
		       'catch(e){;}appContext.util.asyncHTTPJSONCompleteCallBackCompleted("",'
		       appContext.requestNameIndex.indexOf(requestName)+
		       ');alert("Timeout on '+requestName+'. Try again.");',
		       appContext.configuration.AJAX_TIME_OUT);
	return false;
    },
    "bounceHeartClick":function(requestName,likeArgs){
	var heartEl=$("i.bcf-heart[data-bounceid='"+likeArgs.likeBounceId+"']")[0];
	appContext.eventArguments[appContext.requestNameIndex.indexOf(requestName)].likeBounceId=$(heartEl).attr('data-bounceid');
	setTimeout('appContext.asyncEventHandler.asyncHeartClick('+appContext.eventArguments[1].likeBounceId+',"'+requestName+'",'+JSON.stringify(likeArgs)+');',1);
	return false;
    },
    "asyncHeartClick":function(bounceId,requestName,args){
	var requestIndex=appContext.requestNameIndex.indexOf('HEART');
	appContext.asyncJSONHTTPRequest[requestIndex]=
	    appContext.network.asyncHTTPRequest('HEART', {
		method: 'POST',
		url: appContext.configuration.API_BASE_URL+
		    "/bounces/"+bounceId+"/like?"+
		    appContext.configuration.API_QUERY_STRING,
		headers: {'Authorization':'Bearer '+ 
			  appContext.BEARER_TOKEN.replace(/\"/g,"")
			 },
		dataType: "json"},appContext.asyncHTTPRequestCallback[requestIndex].fail,appContext.asyncHTTPRequestCallback[requestIndex].done);
    }
};

/* NETWORK CLASS */
var network={
    "asyncHTTPRequest":function(requestName,parms,failcallback,donecallback){
	var requestIndex=appContext.requestNameIndex.indexOf(requestName);
	try{
	    var request = $.ajax(parms).
		fail(function(jqXHR,textStatus){
		    failcallback(jqXHR,textStatus);
		}).
		done(function(result){
		    setTimeout('donecallback('+JSON.stringify(result)+');',1);
		});
	}catch(e){
	    appContext.util.exceptionHandler(e);
	    appContext.util.asyncHTTPJSONCompleteCallBackCompleted('',requestIndex);
	}
    },
    "asyncHTTPJSONComplete":function(result ,completeCallback,requestedIndex) {
	try{
	    if(appContext.requestTimeout[requestedIndex]=="" ||
	       appContext.requestTimeout[requestedIndex]==null ||
	       appContext.requestTimeout[requestedIndex]==undefined)return false;
	    if(completeCallback!=null && completeCallback!=undefined && completeCallback!='')
		completeCallback(result);
	}catch(e){;}
    },
    "asyncHTTPJSONCompleteCallBackCompleted":function(result,requestIndex){
	try{
	    clearTimeout(appContext.requestTimeout[requestedIndex]);
	    try{
		appContext.requestTimeout[requestedIndex]="";
		appContext.asyncJSONHTTPRequest[requestedIndex]="";
	    }catch(exx){;}
	}catch(ex){;}
    }
    "asyncHTTPJSONFailed":function asyncHTTPJSONFailed( jqXHR, textStatus, failCallback, requestedIndex ) {
	try{
	    if(failCallback!=null && failCallback!=undefined && failCallback!='')
		failCallback(jqXHR,textStatus);
	}catch(e){;}
	finally{
	    appContext.network.asyncHTTPJSONCallTimeoutDestructructor(requestedIndex)
	};
	alert( "Request failed: " + textStatus );
    },
    "asyncHTTPJSONCallTimeoutDestructructor":function(requestIndex){
	try{
	    clearTimeout(appContext.requestTimeout[requestedIndex]);
	    try{
		appContext.requestTimeout[requestedIndex]="";
		appContext.asyncJSONHTTPRequest[requestedIndex]="";
	    }catch(exx){;}
	}catch(ex){;}
    }
};

/* USER INTERFACE CLASS */
var userinterface={
    "renderLikeBounceUI":function(likeBounceJSON){
	var requestIndex=appContext.requestNameIndex.indexOf('HEART');
        try{
            appContext.resultJSON.likeJSON=likeBounceJSON;
            $("span.number-likes[data-bounceid='"+likeBounceJSON.bounceId+"']")[0].
                innerHTML=likeBounceJSON.likes.length;
            var heart=$("i.bcf-heart[data-bounceid='"+likeBounceJSON.bounceId+"']")[0];
            var heartclass=heart.getAttribute('class');
            if(heartclass.indexOf(' active')>-1){
                heart.setAttribute('class',heartclass.replace(/ active/g,''));
            }else{
                heart.setAttribute('class',heartclass+' active');
            }
        }catch(e){
	    appContext.util.exceptionHandler(e);
	}
	finally{
	    appContext.network.asyncHTTPJSONCallTimeoutDestructructor(requestedIndex);
	}
	return requestIndex;
    },
    "updateBounceUI":function(bounceJSON){
	for(var ibounce in bounceJSON){
	    var liked=false;
	    var heart=$('i.bcf-heart[data-bounceid="'+appContext.resultJSON.searchJSON[ibounce].bounceId+'"]')[0];
	    var heartList=$('span.heartNameList[data-bounceid="'+appContext.resultJSON.searchJSON[ibounce].bounceId+'"]')[0];
	    $(heartList).html('');
	    var heartclass=heart.getAttribute('class');
	    $("span.number-likes[data-bounceid='"+appContext.resultJSON.searchJSON[ibounce].bounceId+"']")[0].innerHTML=
		appContext.resultJSON.searchJSON[ibounce].likes.length;
	    for(var ilike in appContext.resultJSON.searchJSON[ibounce].likes){
		try{
		    var uname=appContext.resultJSON.searchJSON[ibounce].likes[ilike].author.username;
		    if(uname!=null && uname!=undefined && uname!=''){
			$(heartList).append($('<span class="heartNameListItem">'+uname+'&nbsp;</span>'))
			$(heartList).append($('<span class="heartNameListComman">,</span>'))
		    }
		}catch(e){;}
		if(appContext.resultJSON.searchJSON[ibounce].likes[ilike].userId==appContext.userId){
		    liked=true;
		    if(heartclass.indexOf(' active')>-1){
			;
		    }else{
			heart.setAttribute('class',heartclass+' active');
		    }
		}
		if(!liked){
		    heart.setAttribute('class',heartclass.replace(/ active/g,''));
		}
	    }
	}
    }
}

/* UTILITYS CLASS */
var util={
    "getInnerElementAttributeValue":function(element,jquerypath,attributeid){
	return $(element).find(jquerypath)[0].getAttribute(attributeid);
    },
    "exceptionHandler":function(e){
	var stack=e.stack;
	if(stack==null || stack==undefined)
	    stack='';
	else
	    stack+='\n';
	appContext.util.errorMessage(e.message+stack);
    },
    "errorMessage":function(message){
	if(confirm("Error: "+message+'\n\n'+
		   'If you continue to get errors, click yes '+
		   'to clear your local storage, logout and refresh. ' +
		   'Also try clearing your cache, cookies and check other '+
		   'settings on your browser, or try another browser.')){
	    app.authentication.clearLocalStorageAndLogout();
	}
    }
 };

/* MAIN CLASS AGREGGATING ALL DATA AND FUNCTIONALITY */
var appContext={
/* CONSTANTS AND CONFIGURATION */
    "BEARER_TOKEN":"",
    "userId":"",
    "facebookId":"",
    "configuration":{
	"API_BASE_URL": "http://ibounce.co:8678",
	"API_QUERY_STRING":"v=2.1",
	"AJAX_TIME_OUT":30000,
	"FACEBOOK_API_KEY": "373372816160699",
	"FACEBOOK_API_KEY_WWW_BOUNCECHAT_COM":"373372816160699",
        "FACEBOOK_API_KEY_LOCAL_BOUNCECHAT_COM":"452593051600402",
	"TWITTER_API_KEY":"m6QMakbr907D6dGmdEkPeY6By",
    },
/* REQUEST TYPES
Each array element on the same index on all of the arrays in this object
are related. 
*/  "requestNameIndex":["SEARCH","HEART","COMMENT"],
    "requestId":{"searchId":"","likeBounceId":"","commentBounceId":""},
    "requestTimeout":["","",""],
    "eventArguments":[{},{"likeBounceId":""},{"commentBounceId":""}],    
    "eventRequiresToken":[false,true,true],

/* EVENT HANDLERS
These handlers initial the event system on clicking, calls the specific click
handler and and spins off an asychronous handler which then submits an
asychronous JSON HTTP Request
*/  "clickEventHandler":eventHandlers.clickEventHandler,
    "eventHandler":[function(){},eventHandlers.bounceHeartClick,function(){}],
    "asyncEventHandler":{"asyncHeartClick":eventHandlers.asyncHeartClick,},
    "asyncJSONHTTPRequest":["","",""],
/* ASYNC HTTP CALL BACK HANDLERS
These handlers respond to the HTTP requests in a non blocking manner.
Typically the specific fail and complete call backs associated with the 
original event handle the JSON request and then call the standard 
asyncHTTPJSON[Failed/Complete] handlers to handle standard event processing
managment common to the event system. At that point the final handler for 
processing the request is executed asynchronously without blocking.
*/    "asyncHTTPRequestCallback":[
	{"fail":function(jqXHR,textStatus){appContext.network.asyncHTTPJSONFailed( jqXHR, textStatus,
	 "done":function(result){appContext.network.asyncHTTPJSONComplete(result,function(){},0);return true;}},
	{"fail":function(jqXHR,textStatus){appContext.network.asyncHTTPJSONFailed( jqXHR, textStatus, function(){},1);return true;},
	 "done":function(result){appContext.network.asyncHTTPJSONComplete(result,
									  userinterface.renderLikeBounceJSON, 1 );return true;},},
//--------Notice this final event handler that renders the screen---- -->
	   {"fail":function(jqXHR,textStatus){appContext.network.asyncHTTPJSONFailed( jqXHR, textStatus,function(){}, 2 );return true;},
	 "done":function(result){appContext.network.asyncHTTPJSONComplete(result ,function(){},2);return true;}}
    ],
/* ASYNC REQUEST HANDLER METHODS
You pass in your handlers into these objects.  The final one is for after your
custom event handler has finished, for cleaning up the event, as there is a 
timeout incase a handler hangs, so it doesn't lock the event system, it will
unlock.
*/  
  "network":{
    "asyncHTTPRequest":network.asyncHTTPRequest,
    "asyncHTTPJSONFailed":network.asyncHTTPJSONFailed,
    "asyncHTTPJSONComplete":network.asyncHTTPJSONComplete,
    "asyncHTTPJSONCompleteCallBackCompleted":network.asyncHTTPJSONCompleteCallBackCompleted",
"asyncHTTPJSONCallTimeoutDestructructor":network.asyncHTTPJSONCallTimeoutDestructructor
},

/* JSON RESULTS AND UI RENDERING LOGIC
This is the retrieved data and likely the final event for rendering
*/  "resultJSON":{"searchJSON":"","likeJSON":"","commentJSON":""},

    "userinterface":{
	"renderLikeBounceUI":userinterface.renderLikeBounceJSON,
	"updateBounceUI":userinterface.updateBounceUI
    },

    "util":{
	"getInnerElementAttributeValue":util.getInnerElementAttributeValue,
	"asyncHTTPJSONErrorHandler":util.asyncHTTPJSONErrorHandler,
"exceptionHandler":util.exceptionHandler,
"errorMessage":util.errorMessage,
    },

    "clearLocalStorageAndLogout":authentication.clearLocalStorageAndLogout,
    "getFacebookId":authentication.getFacebookId,
    "getUserId":authentication.getUserId,
    "getBearerToken":authentication.getBearerToken,
    "initialize":authentication.initialize,
};
appContext.initialize();
///////////////////////////////////////////////////////////////////////////






