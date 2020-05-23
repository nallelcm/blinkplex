# blinkplex
Plex notification box for Raspberry Pi using a blinkstick.

An options.js file is required. Located at the root of the project.
<br />
Example:
<pre>

const options = {
    hostname:"PLEXHOSTNAME or IP",
    username:"PLEX USERNAME",
    password:"PLEX PASSWORD",
    options:
    {
        identifier:"blinkplex",
        product:"BlinkPlex",
        version:"1.0",
        deviceName:"Cobra",
        device:"Ubuntu"
    }
}
module.exports = options;
</pre>
