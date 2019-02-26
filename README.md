# Jobox.ai web site

## Local development

If you don't have [Jekyll](https://jekyllrb.com/) installed - use next command to install it:

``` bash
$ gem install jekyll bundler
```

Then build site and run it locally:

``` bash
$ bundle exec jekyll serve
```

Now browse to http://localhost:4000

## Deploying to production:

To build production version run:
``` bash
$ JEKYLL_ENV=production bundle exec jekyll build
```

Then copy content of the `_site` folder to the `ftp.jobox.ai`
