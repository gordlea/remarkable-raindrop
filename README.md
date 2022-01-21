# remarkable-raindrop

A service that will sync items from your [raindrop.io](https://raindrop.io/) account to your remarkable tablet in pdf format.

It will check your raindrop.io account for any items that match a search expression (by default: `#on_remarkable`), 
and when it finds them, it will simplify the html (using outline.com for now), convert to pdf, then 
upload to your remarkable account via the cloud api.

The docker container is configured to run periodically.


## Prerequisites

Before you begin, you will need both your *remarkable device token*, and a *raindrop api test token* for your account.

### How to get your Remarkable Device Token

1. Generate a new uuid for your deviceId. You can do this by running `uuidgen` on the cli, or by going to one of many [online uuid generators](https://www.uuidgenerator.net/). This will be your deviceId.

2. Grab a one time code by going to (https://my.remarkable.com/#desktop).

3. Make a post request to the remarkable api to generate new device token:
    ```shell
    # example using curl
    curl -X "POST" "https://webapp-production-dot-remarkable-production.appspot.com/token/json/2/device/new" \
        -H 'Content-Type: application/json' \
        -d $'{
    "deviceDesc": "desktop-windows",
    "deviceID": "put your generated deviceId here",
    "code": "<place one time code from step 2 here"
    }'
    ```

### How to get your Raindrop API Test Token

1. Log into your raindrop.io account in the browser, then go to (https://app.raindrop.io/settings/integrations)

2. Down at the bottom, under "For Developers", click create new app.

3. Give it a name, accept the terms, and click create

4. Click on the newly created app, and the under "Credentials" click on "Create test token".

## How to use

The easiest way to use this is via the docker image.

### Run using docker / docker-compose

The docker image uses cron to periodically check for new raindrop.io items.

#### Docker Run

```shell
docker run \
    --env RMKDROP_REMARKABLE_DEVICE_TOKEN=<deviceToken from above> \
    --env RMKDROP_RAINDROP_TEST_TOKEN=<raindrop test token from above> \
    -it gordlea/remarkable-raindrop
```

#### Docker Compose

Example docker-compose.yml
```yaml
version: "3.8"
    
services:
  remarkable_raindrop:
      image: gordlea/remarkable-raindrop:latest
      environment:
       - RMKDROP_REMARKABLE_DEVICE_TOKEN=<deviceToken from above> 
       - RMKDROP_RAINDROP_TEST_TOKEN=<raindrop test token from above>
```


### Run locally

#### Setup

Ensure you have nodejs 16 + installed, as well as the yarn package manager.

1. clone the git repo locally
2. run yarn inside the repo directory
4. create a .env file in the repo directory with the following in it:

```
RMKDROP_REMARKABLE_DEVICE_TOKEN=<deviceToken from above> 
RMKDROP_RAINDROP_TEST_TOKEN=<raindrop test token from above>
```

#### Run it
In the project directory, run `yarn start`.


### Additional Configuration

You can run `yarn start --help` for detailed information on cli options.

| cli option | env var | default | description |
| --- | --- | --- | --- |
| <nobr>`--raindrop-test-token` | RMKDROP_RAINDROP_TEST_TOKEN</nobr> | no default, required | Your raindrop.io api test token. See [How to get your Raindrop API Test Token](#How-to-get-your-Raindrop-API-Test-Token) above. |
| </nobr>`--raindrop-search` | RMKDROP_RAINDROP_SEARCH</nobr> | `#on_remarkable` | This is the search query used to determine which items in your raindrop.io account to send to your remarkable tablet. See https://help.raindrop.io/using-search/#operators for more information. Basically any raindrop item in your account that matches this search will be copied to your tablet. |
| <nobr>`--log-level` | RMKDROP_LOG_LEVEL</nobr> | `info` | One of [error, warn, info, debug, trace]. This sets how verbose you want the log output to be. |
| <nobr>`--remarkable-device-token` | RMKDROP_REMARKABLE_DEVICE_TOKEN</nobr> | no default, required | Your remarkable device token. See [How to get your Remarkable Device Token](How-to-get-your-Remarkable-Device-Token) above. |
| <nobr>`--remarkable-directory` | RMKDROP_REMARKABLE_DIRECTORY</nobr> | `raindrop.io` | The name of the directory on your remarkable device where pdfs will be placed. |
| | <nobr>RMKDROP_CRON</nobr> | `*/10 * * * *` | This option is only available when running the docker container. This sets the cron expression that determines how often the docker container will check raindrop.io for updates. The default is 10 minutes. See https://crontab.guru/. |