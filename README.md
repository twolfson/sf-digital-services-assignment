# sf-digital-services-assignment [![Build status](https://circleci.com/gh/twolfson/sf-digital-services-assignment/tree/master.svg?style=svg)](https://circleci.com/gh/twolfson/sf-digital-services-assignment/tree/master)

Website for take-home assignment from [San Francisco Digital Services][]

Demo website: <https://twolfson.github.io/sf-digital-services-assignment/>

[San Francisco Digital Services]: https://digitalservices.sfgov.org/

## Getting started
To compile a local copy of our repo, run the following:

```bash
# Clone the repository
git clone https://github.com/twolfson/sf-digital-services-assignment
cd sf-digital-services-assignment

# Install our dependencies
npm install

# Run the server
npm start
# Server is listening at http://localhost:3000/
```

Our webpage will be accessible at <http://localhost:3000/>

## Known issues
- Markers in map are often grouped on same lines. This is due to low resolution for `latitude` in the original data
    - One way to fix this would be a location lookup based on the street address but we felt this was low priority for the exercise

## Documentation
### File structure
- `browser/` - Files loaded into the browser (e.g. `css/`, `js/`)
- `build/` - Assets compiled via `gulp` for development and distribution
- `server/` - Files used to run our server and generate HTTP responses
    - In an MVC application, there would be a lot more files but this is a very browser heavy application
- `test/` - Collection of tests for both `browser/` and `server/`

### Architecture
Our architecture is as follows:

- JavaScript, version ECMAScript 5 for both browser and server. We felt this was a good middleground for supporting older browsers without adding too much tooling
    - We did see IE8+ comment on the <https://sf.gov/> site which helped inform our decision
- [Gulp][] and [Browserify][] for asset bundling. These are easy to maintain and grow well with complexity. Additionally, we wanted to avoid any time sinks with configuring [Webpack][]
- Vanilla JavaScript with [hyperscript][] for our browser components
    - React was on the roadmap but vanilla JS worked very well initially and we were running low on time for the second half of the assignment
    - If this project were to keep on being worked on/growing, we'd likely move to a larger framework (e.g. React)
    - Additional considered choices: Angular (team already familiar with it but moving away from it), vanilla JS with jQuery (more useful for complex hierarchies, doesn't add much nowadays)
- [Pug][] for server-side templating
    - Similar to Slim which is team is familiar with (<https://github.com/Exygy/sf-dahlia-web>)
    - Prevents missed close tags, which can cause inconsistent rendering across browsers

[Gulp]: https://gulpjs.com/
[Browserify]: https://github.com/browserify/browserify
[Webpack]: https://webpack.js.org/
[hyperscript]: https://github.com/hyperhype/hyperscript
[Pug]: https://pugjs.org/

We made the following architectural decisions:

- No server runtime except for development
    - Reason: Data is static (i.e. entries in table/map are consistent). This could be a feature in the future (e.g. add/remove attributes to table)
    - Potential future drawbacks: Localization on the server can provide better experience as minimizes bandwidth usage
- No server-side rendering of MOHCD data
    - Reason: If we added this, then interactivity would have to either extract data from our HTML or load it again. This is a poor experience for mobile users (i.e. more processing or bandwidth respectively)
- No trimming of MOHCD data as it's small enough (35kb gzipped)
- Use data directly from DataSF's website via CORS. We could self host but it's more work and data would out of date

We excluded the following functionality due to time constraints:

- Error monitoring, usually would use Sentry or similar
- Analytics, usually would use Google Analytics or Mixpanel
- Cache busting. An outline would be updating `gulpfile.js` to process HTML after CSS and JS, then using the MD5 digests of those files in the template rendering
- Asynchronous loading of heavier components (e.g. map)

Our release workflow is different from our typical professional one:

- Normally we would submit a PR and squash commits
- Instead used solo contributor open source workflow where I still use `git tag` to tag releases but entire commit history is visible
- Rationale: Using squash technique is additional work that might hide my thought and work process

### Development
To run our development server, run the following:

```bash
npm run develop
```

#### LiveReload
This script includes running a [LiveReload][] server so [LiveReload][] browser extensions will work here

[LiveReload]: http://livereload.com/

### Testing
To run our full test suite, run the following:

```bash
npm test
```

Below are specific test commands:

- `npm run lint`, runs linter
- `npm run test-karma-continuous`, runs browser tests continuously with file watcher
- `npm run test-karma-develop`, runs browser tests with a visible browser for debugging

### Releasing
To publish a new release, run the following:

```bash
# Update the CHANGELOG with a new semantic version
$EDITOR CHANGELOG.md

# Install foundry.cli if it's not yet installed
npm install -g foundry.cli

# Stage our CHANGELOG changes
git add -p

# Publish a new release
foundry release <semver>

# Verify our release looks good on GitHub pages
## Linux
xdg-open "https://twolfson.github.io/sf-digital-services-assignment/"

## OS X
open "https://twolfson.github.io/sf-digital-services-assignment/"
```

## License
As of Sep 14 2019, Todd Wolfson has relesaed this repository and its contents to the public domain.

It has been released under the [Creative Commons Zero license][CC0].

[CC0]: LICENSE
