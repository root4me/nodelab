            $(document).foundation();
            $(document).ready(function($) {

                // init ScrollMagic Controller
                controller = new ScrollMagic();


                // Scene2 Handler
                var scene2 = new ScrollScene({
                    triggerElement: "#pinned-trigger2", // point of execution
                    duration: ($(window).height() / 2) + 200, // pin the element for a total of 400px
                    reverse: true
                }).setPin("#pinned-element2").on("enter", function(e) {

                    // ajax call to get next set
                    // hide/push down existing pin trigger
                    console.log($(window).height() / 2);
                    console.log(e);
                }); // the element we want to pin

                var c = 1;

                var scene4 = new ScrollScene({
                    triggerElement: "#loader",
                    triggerHook: "onEnter"
                }).addTo(controller).on("start", function(e) {
                    console.log('1');
                    if (!$("#loader").hasClass("active")) {
                        $("#loader").addClass("active");
                        if (console) {
                            console.log("loading new items");
                        }
                        // simulate ajax call to add content using the function below
                        //setTimeout(addBoxes, 1500, 9);

                        $.ajax({
                            url: "index" + c+++".html",
                            cache: false
                        }).done(function(html) {
                            $("#content").append(html);
                            scene4.update();
                            $("#loader").removeClass("active");
                        });
                    }
                });


                // Add Scenes to ScrollMagic Controller
                controller.addScene([
                scene2,
                scene4]);


            });