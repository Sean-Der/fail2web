# fail2web

fail2web is a [fail2ban](http://www.fail2ban.org) GUI that communicates with a fail2ban instance via [fail2rest](https://github.com/Sean-Der/fail2rest)

fail2ban allows you to administer the following

* **Failregex** - Delete and add new failregexes
* **Banned IPs** - Ban and Unban IP address
* **Per Jail Config** - Configure find time, max retry and usedns per jail, and view the filelist per jail

with the following features planned in the future

* **Reporting** - Expose the time that an IP address was banned, and show trends via visualizations
* **Alerting** - Desktop notification when an IP address is banned
* **Regex Testing** - Testing ignore+fail regexes on your current logs to quickly build and debug regexes
* **More Jail Controls** - Create new jails and expose more settings for current jails

![alt text](http://i.imgur.com/Duy0aKM.gif "fail2web Demo")

## Installing
###Development

* **Install build requirements**
    * nodejs and npm for browserify (not a runtime requirement) [Installing Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
    * Git
* **Install libraries**
    * execute `npm install` in the root of the fail2web repository
* **Building**
    * When writing code run `npm run watch` this will rebuild web/bundle.js on every change
    * When deploying run `npm run build` this will build once and exit

###Production
There is no production release of fail2web, but I plan to have one soon.

##Deploying and Configuration
To run fail2web you should host it via a HTTP server, the following is an example nginx config to do so

    server {
        listen       80;
        server_name  YOUR_SERVER_NAME;

        auth_basic "Restricted";
        auth_basic_user_file YOUR_HTPASSWD_FILE;

        location / {
            root FAIL2WEB_WEB_FOLDER;
        }
        location /api/ {
            proxy_pass         http://127.0.0.1:5000/;
            proxy_redirect     off;
        }
    }

Fail2web has only one configuration option available via config.json in the root of the web folder.
This config option allows you to specify the path to your fail2rest handler. Currently the config.json uses /api/
which is what the above nginx config is also set to do.

Fail2web then has to communicate with a fail2rest instance, details on how to configure fail2rest can be found [here](https://github.com/Sean-Der/fail2rest)

###Security
It is very important that you configured fail2rest correctly, a public facing fail2rest server could be very dangerous
(someone could add inclusive regexes, remove themselves from the banned IP lists etc..)

Out of the box fail2rest has no authentication, and I have no plans of rolling my own authentication. I have used two different methods
for securing my fail2rest instances.

####HTTP Auth
In the nginx example above I have enabled HTTP basic auth with the following lines

        auth_basic "Restricted";
        auth_basic_user_file YOUR_HTPASSWD_FILE;

To generate a HTTPASSWD file you can use the `htpasswd` util distributed with Apache HTTPD
and `htpasswd -c YOUR_HTPASSWD_FILE USERNAME` will create it.

####Serve on loopback only
Your other choice would be to serve on the loopback only. You could then use an
SSH tunnel as a socks proxy.


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
