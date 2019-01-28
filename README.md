#vayout
Lightweight layout resolver for Vue Router.

#Installation
```
npm install vayout
```

#Usage
main.js
```
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vayout from 'vayout'

Vue.use(Vayout, {
    layouts: {
        account: require('./layouts/Account.vue'),
        default: require('./layouts/Default.vue')
    }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

router.js
```
import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
          path: '/',
          component: Home
        },
        {
          path: '/login',
          component: Login,
          layout: 'account'
        },
        {
          path: '/register',
          component: Register,
          meta: {
              layout: 'account'
          }
        },
        {
            path: '/about',
            component: About,
            layout: 'default'
        }
    ]
})
```

App.vue
```
<template>
  <vayout/>
</template>
```

layouts/Account.vue
```
<template>
    <div>
        <h1>
            Account layout
        </h1>
        <slot/>
    </div>
</template>
```

layouts/Default.vue
```
<template>
    <div>
        <h1>
            Default layout
        </h1>
        <slot/>
    </div>
</template>
```
#Options
```
Vue.use(Vayout, {
    layouts: {
        ...
    },
    name   : 'vayout',         // component name
    default: 'default',        // default layout
});
```

#Layout for Layout
layouts/Parent.vue
```
<template>
    <div>
        <h1>
            Parent layout
        </h1>
        <slot/>
    </div>
</template>
```

layouts/Child.vue
```
<template>
    <div>
        <h1>
            Child layout
        </h1>
        <slot/>
    </div>
</template>

<script>
    export default {
        layout: 'parent'
    }
</script>
```
    
#License
MIT