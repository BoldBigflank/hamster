!function () {
    var client = new Keen({
        projectId: "5579d31ac2266c48ad2b17a6",
        readKey: "81afb1829add42142453e0fef36073b7b9c63bfb56f0b57c2eadcbe2a1becd49d354324b6730c9b43c5bd14be6abad2a29553589a35d5537a7d9899b48af45a70ba9ba46c77c5824334710156048e28e885a559c15cc896ff715af7ebb407db64ceaa54f5f617b1a0f2bb461c295c1f3"
    });

    Keen.ready(function(){
        // Hourly distance over 3 days
        var query = new Keen.Query("sum", {
            eventCollection: "trip",
            interval: "every_30_minutes",
            targetProperty: "distance",
            timeframe: "this_3_days",
            timezone: "US/Pacific"
        });

        client.draw(query, document.getElementById("distance-72hr"), {
            title:'',
            height:240,
            // Custom configuration here
        });


        // Daily Max speed over 7 days
        var max_speed = new Keen.Query("maximum", {
            eventCollection: "trip",
            interval: "daily",
            targetProperty: "max_speed",
            timeframe: "this_7_days",
            timezone: "US/Pacific"
        });
          
        client.draw(max_speed, document.getElementById("max-speed-by-day"), {
            title:'',
            chartType: "columnchart",
            height:120
            // Custom configuration here
        });

        // Daily average speed over 7 days
        var avg_speed = new Keen.Query("average", {
            eventCollection: "trip",
            interval: "daily",
            targetProperty: "average_speed",
            timeframe: "this_7_days",
            timezone: "US/Pacific"
        });
          
        client.draw(avg_speed, document.getElementById("avg-speed-by-day"), {
            title:'',
            chartType: "columnchart",
            height:120
            // Custom configuration here
        });

        var chart = new Keen.Dataviz()
            .el(document.getElementById("max-avg-speed-by-day"))
            .chartType("columnchart")
            .chartOptions({
                height:120,
                hAxis: {
                    format:'MMM d',
                    gridlines:  {count: 7}
                }
            })
            .prepare();

        client.run([max_speed, avg_speed], function(err, res){ // run the queries

            var result1 = res[0].result;  // data from first query
            var result2 = res[1].result;  // data from second query
            var data = [];  // place for combined results
            var i=0;

            while (i < result1.length) {

                data[i]={ // format the data so it can be charted
                    timeframe: result1[i]["timeframe"],
                    value: [
                        { category: "Max Speed", result: result1[i]["value"] },
                        { category: "Average Speed", result: result2[i]["value"] }
                    ]
                };
                if (i == result1.length-1) { // chart the data
                chart
                  .parseRawData({ result: data })
                  .render();
                }
                i++;
            }
        });


    });
}();
