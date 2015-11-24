(function () {
    var notifReader = {
        notify: function (titleid, body, bodyid, onClick) {
            var notification = new window.Notification(titleid, {
                body: body,
                icon: 'https://codingfree.com/nr_32.png'
            });

            notification.onclick = function () {
                notification.close();
                if (onClick) {
                    new MozActivity({
                      name: "view",
                      data: {
                        type: "url", 
                        url: body
                      }
                    });
                }
            };
        },
        handleEvent: function (evt) {
            switch (evt.type) {
                case 'mozChromeNotificationEvent':
                    if (evt.detail.type === 'desktop-notification') {
                        setTimeout(function(){
                            var msg = new SpeechSynthesisUtterance(evt.detail.title);
                            msg.lang = navigator.mozL10n.language.code;
                            window.speechSynthesis.speak(msg);
                        },1000); 
                        setTimeout(function(){
                            var msg = new SpeechSynthesisUtterance(evt.detail.text);
                            msg.lang = navigator.mozL10n.language.code; 
                            window.speechSynthesis.speak(msg);
                        },3000);                            
                    }
                    break;

                default:
                    break;
            }
        },
        initialize: function initialize() {
            var that = this;
            this.notify('Notifications Reader: ', "http://www.twitter.com/codingfree", null, true);
            if(window.speechSynthesis){
                var msg = new SpeechSynthesisUtterance('Notification Reader enabled!');
                msg.lang = "en-US"; 
                window.speechSynthesis.speak(msg);               
                window.addEventListener('mozChromeNotificationEvent', this.handleEvent);
                navigator.mozApps.mgmt.addEventListener('enabledstatechange', function(event) {
                    var app = event.application;
                    var wasEnabled = app.enabled;
                    if(!wasEnabled){
                        var msg = new SpeechSynthesisUtterance('Notification Reader disxabled!');
                        msg.lang = "en-US";            
                        window.speechSynthesis.speak(msg);  
                        window.removeEventListener('mozChromeNotificationEvent', this.handleEvent);
                    }
                });

            }else{
                window.alert("Sorry, your device does not support the Speech API.");
            }

        }
    }

    if (document.documentElement) {
        notifReader.initialize();
    } else {
        window.addEventListener('DOMContentLoaded', notifReader.initialize);
    }
}());