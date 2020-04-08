# GameStats

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

### Load API Keys
Create apiKeys.js and add:
```
export const APIKEY = {
  imgur: 'YOUR KEY',
  twitch: 'YOUR KEY',
  gamestats: 'YOUR KEY'
};
```

To import in your component
```
<script>
import {APIKEY} from "../apiKeys.js";

console.log(APIKEY.twitch);
</script>
```
