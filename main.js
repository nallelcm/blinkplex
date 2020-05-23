const PlexAPI = require("plex-api");
const options = require("./options.js");
const nodeCleanup = require('node-cleanup');
const blinkstick = require('blinkstick');

const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: '/tmp/' });
const app = express();


const led = blinkstick.findFirst();


const refreshMS = 1000;

var client = new PlexAPI(options);

nodeCleanup(function (exitCode, signal)
{
    LEDCleanup(0);
    LEDCleanup(1);
});
function LEDCleanup(index)
{
    led.setColor("#000000",{"index":index});
    //LED.unexport();
}
function getStreamData(dataItem)
{
    var localCount = 0;
    var remoteCount = 0;
    if (dataItem.Player.state != "paused")
    {
        if (dataItem.Session)
        {
            var sessionLocation = dataItem.Session.location;
            
            if (sessionLocation == 'lan')
            {
                localCount++;
            }
            else
            {
                remoteCount++;
            }
        }
    }
    return {
        local: localCount,
        remote: remoteCount
    }

}
function queryServer()
{
    led.blink("blue", {"index":0});
    led.blink("blue", {"index":1});
    client.query("/status/sessions").then(function(result) 
    {
        var remote =0;
        var local  =0;
        var data = result.MediaContainer.Metadata;
        if (data)
        {    
            for (var i = 0; i < data.length; i++)
            {
                var dataItem = data[i];
                var counts = getStreamData(dataItem);
                remote+=counts.remote;
                local+=counts.local;
            }
        }
        updateLEDs(remote,local,false);

    }, function (err) 
    {
        updateLEDs(0,0,true);
    });
}
function updateLEDs(remote,local,error=false)
{
    if (!error)
    {
        console.log("remote: %s - local: %s",remote,local);
        // LED 1
        if (remote >0 )
        {
            setColor("#118800",0); // #118800
        }
        else
        {
            setColor("off",0);
        }
        // LED 2
        if (local >0 )
        {
            setColor("#881100",1);
        }
        else
        {
            setColor("off",1);
        }
    }
}
function setColor(color, index)
{
    if (color=="off")
    {
        color="#000000";
    }
    led.morph(color, {"index":index},function(){ led.setColor(color,{"index":index})});
}
app.post('/', upload.single('thumb'),(req, res) => {
    
    queryServer();
    res.sendStatus(200);
});
queryServer();
app.listen(9091, () => console.log('Started server'));
