!function () {
    spark.login({accessToken:'a4b2caee461af9eb3ddf1f4fec22db59b760f652'});
    var dataResetTimeout;
    spark.getDevice('3b003b000747343232363230', function(err, device){
        device.subscribe('temperature', function(data){
            $('#temperature').html(data.data);
        });
        device.subscribe('speed', function(data){
            clearTimeout(dataResetTimeout);
            $('#speed').html(parseFloat(data.data).toFixed(2));
            resetData();
        });
        device.subscribe('distance', function(data){
            $('#distance').html(parseFloat(data.data).toFixed(2));
        });
        
        device.subscribe('sound', function(data){
            $('#sound').html(parseInt(data.data)).toFixed(2));
        })
        
    });

    var resetData = function(){
        dataResetTimeout = setTimeout(function(){
            $('#speed').html("0");
            $('#distance').html("0");
        }, 5000);
    };

    // Get the initial temperature
    $.get('https://api.particle.io/v1/devices/3b003b000747343232363230/temp?access_token=a4b2caee461af9eb3ddf1f4fec22db59b760f652', function(data){
        $('#temperature').html(data.result);
    });

    // The Keen.io data
    var client = new Keen({
        projectId: "5579d31ac2266c48ad2b17a6",
        readKey: "81afb1829add42142453e0fef36073b7b9c63bfb56f0b57c2eadcbe2a1becd49d354324b6730c9b43c5bd14be6abad2a29553589a35d5537a7d9899b48af45a70ba9ba46c77c5824334710156048e28e885a559c15cc896ff715af7ebb407db64ceaa54f5f617b1a0f2bb461c295c1f3"
    });

    Keen.ready(function(){
        // Daily distance over 7 days
        var query = new Keen.Query("sum", {
            eventCollection: "trip",
            interval: "every_1_day",
            targetProperty: "distance",
            timeframe: "this_7_days",
            timezone: "US/Pacific"
        });

        client.draw(query, document.getElementById("distance-7days"), {
            title:'Distance Ran Each Day',
            chartType: "columnchart",
            height:300,
            vAxis: {
                format:"#,###",
                title:'ft',
                ticks:[0, 5280, 5280*2, 5280*3, 5280*4, 5280*5]
            }
        });

        var daily_area = new Keen.Query("sum", {
            eventCollection: "trip",
            interval: "every_30_minutes",
            targetProperty: "distance",
            timeframe: "this_3_days",
            timezone: "US/Pacific"
        });

        client.draw(daily_area, document.getElementById("distance-72hr"), {
            title:'Distance Ran in the Past 72 Hours',
            height:120,
            vAxis: {
                format:"#,###",
                title:'ft'
            }
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
            title:'Average Speed by Day',
            chartType: "columnchart",
            height:120,
            hAxis: {
                format:'MMM d',
                gridlines:  {count: 7}
            },
            vAxis: {
                title: 'ft/s',
                format: '#,###'
            },
            colors:["#d9534f"]
        });

        var chart = new Keen.Dataviz()
            .el(document.getElementById("max-avg-speed-by-day"))
            .chartType("columnchart")
            .height(120)
            .chartOptions({
                legend:{
                    position:'bottom'
                },
                hAxis: {
                    format:'MMM d',
                    gridlines:  {count: 7}
                },
                vAxis: {
                    title: 'ft/s',
                    format: '#,###',
                    logScale:true
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
