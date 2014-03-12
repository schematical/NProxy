module.exports = config = {
    app_dir:__dirname + '/_test',
    apps:{
        fish_tank: {
            name:'Welcome to the Fishtank',
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
            wd:'/var/www/NProxy/_test/fish_tank-master',
           /* process:{
                id:'fish_tank'
            },*/
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
        },
        vanilla_ionic:{
            name:'Vanilla Ionic Ghost Theme',
            github:{
                /* user (String): Required.
                 *  - repo (String): Required.
                 *  - path (String): Optional. The content path.
                 *  - ref (String): Optional. The String name of the Commit/Branch/Tag. Defaults to master.
                 */
                path:'',
                user:'schematical',
                repo:'ghost'
            },
            //wd:'/var/www/NProxy/_test/fish_tank-master',
            /* process:{
             id:'fish_tank'
             },*/
            script:'index.js',
            local:true,

            route:{
                from:{
                    alias:'vanillaionic.schematical.com'
                },
                to:{
                    host:'localhost',
                    port:3003
                }
            }
        }
    }
}