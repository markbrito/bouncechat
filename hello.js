jsonHash[divHTML.id].c=[
    {
        "e": "DIV",
        "id": "main",
        "style": {
            "position": "fixed",
            "width": "100%",
            "height": "100%",
            "left": "0%",
            "top": "0%",
            "background-color": "white"
        },
        "c": [
            {
                "e": "DIV",
                "id": "splash",
                "style": {
                    "position": "fixed",
                    "left": "5%",
                    "top": "5%",
                    "right": "",
                    "bottom": "",
                    "x": "",
                    "y": "",
                    "margin-left": "",
                    "margin-top": "",
                    "margin-right": "",
                    "margin-bottom": "",
                    "width": "15%",
                    "height": "15%"
                },
                "c": [
                    {
                        "e": "IFRAME",
                        "id": "splashView",
                        "style": {
                            "position": "absolute",
                            "left": "0%",
                            "top": "0%",
                            "width": "100%",
                            "height": "100%"
                        },
                        "src": "../splash/splash.html"
                    },
                    {
                        "e": "INPUT",
                        "id": "INPUTSplash",
                        "innerHTML": "",
                        "style": {
                            "position": "absolute",
                            "left": "0%",
                            "top": "101%",
                            "width": "100%"
                        },
                        "type": "button",
                        "value": "Splash",
                        "onclick": "document.getElementById%28%27splash%27%29.setAttribute%28%27style%27%2C%27position%3Afixed%3Bleft%3A0%25%3Btop%3A0%25%3Bwidth%3A100%25%3Bheight%3A100%25%3B%27%29%3B"
                    }
                ]
            },
            {
                "e": "DIV",
                "id": "home",
                "style": {
                    "position": "fixed",
                    "left": "25%",
                    "top": "5%",
                    "color": null,
                    "width": "15%",
                    "height": "15%"
                },
                "c": [
                    {
                        "e": "IFRAME",
                        "id": "homeView",
                        "style": {
                            "width": "100%",
                            "height": "100%"
                        },
                        "src": "../home/home.html"
                    },
                    {
                        "e": "INPUT",
                        "id": "INPUTHome",
                        "innerHTML": "",
                        "style": {
                            "position": "absolute",
                            "left": "0%",
                            "top": "101%",
                            "width": "100%"
                        },
                        "type": "button",
                        "value": "Home",
                        "onclick": "document.getElementById%28%27home%27%29.setAttribute%28%27style%27%2C%20%27position%3Afixed%3Bleft%3A0%25%3Btop%3A0%25%3Bwidth%3A100%25%3Bheight%3A100%25%3B%27%29%3B"
                    }
                ]
            }
        ]
    }
]