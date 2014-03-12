module.exports = config = {
    apps:{
        main: {
            name:'',
            github:{
                /* user (String): Required.
                 *  - repo (String): Required.
                 *  - path (String): Optional. The content path.
                 *  - ref (String): Optional. The String name of the Commit/Branch/Tag. Defaults to master.
                 */
               path:'',
               user:'schematical',
               repo:'fish_tank'
            },
            wd:'/var/www/fish_tank',
            process:{
                id:'fish_tank'
            },
            script:'app.js',
            local:true,

            route:{
                from:{
                    alias:'fishtank.schematical.com'
                },
                to:{
                    host:'localhost',
                    port:3002
                }
            }
        }
    }
}