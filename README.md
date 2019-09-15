# sf-digital-services-assignment
Website for take-home assignment from [San Francisco Digital Services][]

Demo website: <https://twolfson.github.io/sf-digital-services-assignment/>

[San Francisco Digital Services]: https://digitalservices.sfgov.org/

## Getting started
Coming soon!

## Documentation
### Architecture
Coming soon!

Gist:

- No server since data is static (i.e. columns are consistent), this could be a feature in the future
- No server-side rendering of data to prevent double sends
- Gulp and browserify as they're straightforward tools that I've used before. No experience with webpack and feared of its infamous configuration time sink for this project
- React, while its overkill for this project (nothing too interactive), it's a familiar code base for the rest of the team
    - Other choices would be Angular (team is moving away from), hyperscript (fastest to setup, smallest footprint, not too familiar for team), or jQuery
    - In retrospect, maybe we should do server side rendering for better i18n? We don't want to send the entire i18n translation set in JS
- Pug for server-side templating as it:
    - Is very similar to Slim which is established as a template language in https://github.com/Exygy/sf-dahlia-web
    - Prevents missed close tags, which can cause inconsistent rendering
    - Could set up React server-side templating but we are barely using this as is; not worth the effort
- Not stripping down data as it's small (35kb gzipped)
- Leveraging CORS, could self host but it's more work and data goes out of date
- LiveReload
- ES version rationale... still depends on how we build
- Using XHR instead of newer APIs like `fetch` for older browser support (saw IE8+ in new `sf.gov` website)
- Document `publish-to-gh-pages` and releasing
- Missing
    - Error monitoring, usually would use Sentry or similar
    - Analytics, usually would use Google Analytics or Mixpanel
- Different than professional workflow
    - Normally would submit a PR and squash commits
    - Instead adopted personal project open source workflow where I still use `git tag` to tag releases but entire commit history is visible
    - Rationale: Using squash technique is additional work that might hide my thought and work process

### Double check we have
- Tests, including CI
- Link to GitHub pages if we go that route
- Form of cache busting for assets (either timestamp or md5)
- CSS that matches
- Bonus feature
- Viewport support, or conclude it makes less sense for tables
- Handled all TODOs

## License
As of Sep 14 2019, Todd Wolfson has relesaed this repository and its contents to the public domain.

It has been released under the [Creative Commons Zero license][CC0].

[CC0]: LICENSE
