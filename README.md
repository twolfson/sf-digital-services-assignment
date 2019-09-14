# sf-digital-services-assignment
Website for take-home assignment from [San Francisco Digital Services][]

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
- Missing
    - Error monitoring, usually would use Sentry or similar

### Double check we have
- Tests, including CI
- Link to GitHub pages if we go that route
- Form of cache busting for assets (either timestamp or md5)
- CSS that matches
- Bonus feature

## License
As of Sep 14 2019, Todd Wolfson has relesaed this repository and its contents to the public domain.

It has been released under the [Creative Commons Zero license][CC0].

[CC0]: LICENSE
