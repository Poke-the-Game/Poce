# RESTful API overview

Base url: `<server>/api/`

* `/status`
  * `GET` → retrieve print status
* `/jobs`
  * `GET` → retrieve list of jobs
  * `POST` → create new job (and automatically start it)
    * `file=<filename>` - file to print
    * `resin=<id>` - id of resin profile to use
* `/cancelCurrentJob`
  * `POST` → cancel current job
* `/projector/currentImage`
  * `GET` → PNG of currently projected image
