# gamestats

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Load API Keys
Create apiKeys.js and add:
```
export const APIKEY = {
    twitch: "YOUR_KEY"
};
```

To import in your component
```
<script>
import {APIKEY} from "../apiKeys.js";

console.log(APIKEY.twitch);
</script>
```