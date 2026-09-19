/* =====================================================
   ELEMENTS
===================================================== */

const form =
    document.getElementById("predictionForm");

const predictBtn =
    document.getElementById("predictBtn");

const btnText =
    document.getElementById("btnText");

const loader =
    document.getElementById("loader");

const result =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const scoreCircle =
    document.querySelector(".score-circle");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");


/* =====================================================
   TOP COUNTRIES
===================================================== */

const topCountries = [

    "Other",
    "India",
    "USA",
    "Canada",
    "Australia",
    "UK",
    "Germany",
    "Mexico",
    "Turkey",
    "France"

];


/* =====================================================
   FORM SUBMIT
===================================================== */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* Hide old results */

        result.classList.add("hidden");

        errorBox.classList.add("hidden");


        /* Loading state */

        predictBtn.disabled = true;

        btnText.classList.add("hidden");

        loader.classList.remove("hidden");


        /* =================================================
           GET COUNTRY
        ================================================= */

        const country =
            document
                .getElementById("country")
                .value
                .trim();


        /* =================================================
           GROUP COUNTRY
        ================================================= */

        const groupedCountry =
            topCountries.includes(country)
                ? country
                : "Other";


        /*
            Update hidden field too
        */

        document
            .getElementById("groupedCountry")
            .value =
            groupedCountry;


        /* =================================================
           CREATE JSON DATA
        ================================================= */

        const data = {

            Age:
                Number(
                    document
                        .getElementById("age")
                        .value
                ),

            Gender:
                document
                    .getElementById("gender")
                    .value,

            Country:
                country,

            Academic_Level:
                document
                    .getElementById("academicLevel")
                    .value,

            Most_Used_Platform:
                document
                    .getElementById("platform")
                    .value,

            Purpose_Of_Use:
                document
                    .getElementById("purpose")
                    .value,

            Avg_Daily_Usage_Hours:
                Number(
                    document
                        .getElementById("usage")
                        .value
                ),

            Daily_Unlocks:
                Number(
                    document
                        .getElementById("unlocks")
                        .value
                ),

            Study_Hours:
                Number(
                    document
                        .getElementById("study")
                        .value
                ),

            Physical_Activity_Hours:
                Number(
                    document
                        .getElementById("physical")
                        .value
                ),

            Sleep_Hours_Per_Night:
                Number(
                    document
                        .getElementById("sleep")
                        .value
                ),

            Stress_Level:
                document
                    .getElementById("stress")
                    .value,

            Grouped_Country:
                groupedCountry

        };


        console.log(
            "Sending data:",
            data
        );


        /* =================================================
           SEND TO FASTAPI
        ================================================= */

        try {

            const response =
                await fetch(
                    "http://127.0.0.1:8000/predict",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            /* =============================================
               CHECK RESPONSE
            ============================================= */

            if (!response.ok) {

                let errorData;

                try {

                    errorData =
                        await response.json();

                }
                catch {

                    errorData = null;

                }


                console.error(
                    "FastAPI error:",
                    errorData
                );


                throw new Error(
                    errorData?.detail
                        ? JSON.stringify(
                            errorData.detail
                        )
                        : "Prediction failed"
                );

            }


            /* =============================================
               GET RESPONSE
            ============================================= */

            const predictionData =
                await response.json();


            console.log(
                "Prediction:",
                predictionData
            );


            /* =============================================
               GET SCORE
            ============================================= */

            const predictedScore =
                Number(
                    predictionData
                        .predicted_mental_health_score
                );


            if (
                Number.isNaN(
                    predictedScore
                )
            ) {

                throw new Error(
                    "Invalid prediction received from server."
                );

            }


            /* =============================================
               DISPLAY SCORE
            ============================================= */

            scoreElement.textContent =
                predictedScore.toFixed(2);


            /*
                Your UI assumes:

                Minimum = 0
                Maximum = 100

                Example:

                Score 50
                = 180 degrees

                Score 80
                = 288 degrees
            */

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        predictedScore
                    )
                );


            const degrees =
                percentage * 3.6;


            /* =============================================
               ANIMATE CIRCLE
            ============================================= */

            scoreCircle.style.background =

                `conic-gradient(
                    #6366f1 0deg,
                    #8b5cf6 ${degrees}deg,
                    #1e293b ${degrees}deg,
                    #1e293b 360deg
                )`;


            /* =============================================
               RESULT MESSAGE
            ============================================= */

            if (
                predictedScore >= 7
            ) {

                resultTitle.textContent =
                    "Higher Predicted Score";

                resultMessage.textContent =
                    "The model predicts a relatively higher mental health score based on the information provided.";

            }

            else if (
                predictedScore >= 4
            ) {

                resultTitle.textContent =
                    "Moderate Predicted Score";

                resultMessage.textContent =
                    "The model predicts a moderate mental health score based on the information provided.";

            }

            else {

                resultTitle.textContent =
                    "Lower Predicted Score";

                resultMessage.textContent =
                    "The model predicts a relatively lower mental health score based on the information provided.";

            }


            /* =============================================
               SHOW RESULT
            ============================================= */

            result.classList.remove(
                "hidden"
            );


            /* =============================================
               SCROLL TO RESULT
            ============================================= */

            result.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }


        /* =================================================
           ERROR
        ================================================= */

        catch (error) {

            console.error(
                "Error:",
                error
            );


            errorMessage.textContent =
                error.message ||
                "Could not connect to the FastAPI server.";


            errorBox.classList.remove(
                "hidden"
            );

        }


        /* =================================================
           RESET BUTTON
        ================================================= */

        finally {

            predictBtn.disabled =
                false;

            btnText.classList.remove(
                "hidden"
            );

            loader.classList.add(
                "hidden"
            );

        }

    }
);