Paths
---

### Project
```
project
├── a
│   ├── a.js
│   └── c
│       └── c.js
├── b
│   └── b.js
└── ins.js
```

### Usage
```js
// ins.js
const Paths = require('root-paths')
global.paths = new Paths(__dirname)

require(paths.a.a) == require('./a/a')
require(paths.b.b) == require('./b/b')
require(paths.a.c.c) == require('./a/c/c')
```

#### Options
```js
{
    root: __dirname,                    // 项目根目录
    folders: [],                        // 执行要查询的子目录
    filter: ['**/node_modules/**']      // 过滤条件，请参考 glob
}
```
