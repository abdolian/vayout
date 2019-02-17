export default function plugin (Vue, options) {

    options         = options         || {};
    options.name    = options.name    || 'vayout';
    options.default = options.default || 'default';
    options.layouts = options.layouts || {};
    options.prefix  = options.prefix  || 'layout-';
    options.suffix  = options.suffix  || '';
    options.source  = options.source  || ['component', 'meta', 'route'];

    const getComponentName = function(name){

        return (options.prefix || '') + name.toLowerCase() + (options.suffix || '');
    };

    for (let key in options.layouts) {

        options.layouts[key.toLowerCase()] = options.layouts[key];

        // delete options.layouts[key];

        key = key.toLowerCase();

        options.layouts[key] = options.layouts[key].default || options.layouts[key];

        Vue.component(getComponentName(key), options.layouts[key]);
    }

    const layouts = {};

    const init = function(name) {

        name = (name || '').toLowerCase();

        const layouts = options.layouts || {};

        const layout = layouts[name] || {};

        if (layout.layout) {

            return init(layout.layout).concat(getComponentName(name));
        }
        else {

            return [getComponentName(name)];
        }
    };

    for (let key in options.layouts) {

        layouts[key] = init(key);
    }

    Vue.component(
        options.name,
        {
            computed: {
                layout: {
                    get: function() {

                        let result;

                        for (let i = 0; i < options.source.length; i++) {

                            try {

                                if (result) break;

                                let item = options.source[i];

                                item = item.charAt(0).toUpperCase() + item.slice(1);

                                result = this[`getFrom${item}`]();
                            }
                            catch (error) {
                                /**/
                            }
                        }

                        result = result || options.default || '';

                        result = result.toLowerCase();

                        return (result || undefined);
                    },
                },
                routes(){

                    return this.$router.options.routes;
                },
                ready(){

                    return this.$route.name;
                }
            },
            methods: {
                getFromComponent: function() {

                    return this.$route.matched[0].components.default.layout;
                },
                getFromMeta: function() {

                    return this.$route.meta.layout;
                },
                getFromRoute: function() {

                    const route = this.routes.filter((item) => item.name === this.$route.name)[0];

                    return route.layout;
                }
            },
            render: function(createElement) {

                if(!this.ready) return createElement('div');

                let result = '___CHILD___';

                if(!this.layout) throw new Error('layout undefined');

                const items = layouts[this.layout];

                if(this.layout && !items) throw new Error('layout "' + this.layout + '" not defined');

                for (let i = 0; i < items.length; i++) {

                    result = result.replace('___CHILD___', `createElement('${items[i]}', {}, [___CHILD___])`);
                }

                result = result.replace('___CHILD___', `createElement('router-view')`);

                result = eval(result);

                return result;
            }
        }
    );

    // Vue.mixin({
    //     methods: {
    //         $vayout: function() {
    //
    //             let element = this;
    //
    //             while (element.layout || element.$parent){
    //
    //                 if(element.layout){
    //
    //                     break;
    //                 }
    //                 else{
    //
    //                     element = element.$parent;
    //                 }
    //             }
    //         }
    //     },
    // });
}