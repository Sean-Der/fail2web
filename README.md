# fail2web

fail2web is a [fail2ban](http://www.fail2ban.org) GUI that communicates with a fail2ban instance via [fail2rest](https://github.com/Sean-Der/fail2rest)

fail2ban allows you to administer the following

* **Failregex** - Delete and add new failregexes
* **Banned IPs** - Ban and Unban IP address
* **Per Jail Config** - Configure find time, max retry and usedns per jail, and view the filelist per jail
* **Alerting** - Notifications when an IP address is banned and unbanned with a user configurable time span
* **Regex Testing** - Testing ignore+fail regexes on your current logs to quickly build and debug regexes
* **Reporting** - Expose the time that an IP address was banned, and show trends via visualizations

with the following features planned in the future

* **More Jail Controls** - Create new jails and expose more settings for current jails

![alt text](http://i.imgur.com/Duy0aKM.gif "fail2web Demo")
![alt text](http://i.imgur.com/vDKYnql.gif "fail2web Demo2")

##Requirements
fail2web communicates with fail2ban via a REST server called [fail2rest](https://github.com/Sean-Der/fail2rest)
before fail2web can be used you will need an operational fail2rest instance.

fail2web has been reported to work on IE8 or newer, but is not actively tested on older platforms.

##Installing
A guide to install fail2web on Ubuntu can be found [here](http://siobud.com/blog/installing-fail2web)

If you find any errors open an PR against the markdown [here](https://github.com/Sean-Der/sioBuD.com/blob/master/lisp/blog/installing-fail2web.md)

###Production
To install the production build of fail2web download the newest release. A fully built release will then be in the
`web` directory. Now you just need to serve the index.html, you can find further instructions [here](https://github.com/Sean-Der/fail2web#deploying-and-configuration)

###Development
* **Install build requirements**
    * nodejs and npm for browserify (not a runtime requirement) [Installing Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* **Install libraries**
    * execute `npm install` in the root of the fail2web repository
* **Building**
    * When writing code run `npm run watch` this will rebuild web/bundle.js on every change
    * When deploying run `npm run build` this will build once and exit

##Deploying and Configuration
fail2web is best accessed via a HTTP server, you can find example HTTP server configs [here](https://github.com/Sean-Der/fail2web/tree/master/http-configs)

Fail2web has only one configuration option available via config.json in the root of the web folder.
This config option allows you to specify the path to your fail2rest handler. Currently the config.json uses /api/
which is what all the example HTTP configs are configured to do.

##Security
It is very important that you configured fail2rest correctly, a public facing fail2rest server could be very dangerous
(someone could add inclusive regexes, remove themselves from the banned IP lists etc..)

Out of the box fail2rest has no authentication, and I have no plans of rolling my own authentication.

###HTTP Basic Auth
The HTTP configs are both set to use HTTP basic auth, this and SSL should be the absolute minimum security
requirements. In both HTTP configs you will see a placeholder with the label of `YOUR_HTPASSWD_FILE`

To generate a HTTPASSWD file you can use the `htpasswd` util distributed with Apache HTTPD
and `htpasswd -c YOUR_HTPASSWD_FILE USERNAME` will create it.

###SSH Tunnel
I also recommend only serving fail2web/fail2rest on loopback only. You would access the server via a
SSH tunnel, you can find more info [Here](http://www.revsys.com/writings/quicktips/ssh-tunnel.html)

##Getting Help
###IRC
The #fail2web channel on Freenode is the official channel.

Feel free to mention Sean-Der in channel, and I will do my best to help you as soon as possible

If you are using OSX [Adium](https://www.sweetprocess.com/procedures/298/connect-to-irc-channel-with-adium/#.U8Puho1dXR0) is a popular choice

If you are using a Unix clone [Xchat](https://help.ubuntu.com/community/XChatHowto) is a popular choice

##License
The MIT License (MIT)

Copyright (c) 2014 Sean DuBois

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
