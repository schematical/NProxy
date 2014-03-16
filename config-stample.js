module.exports = config = {
    /**
     * NOT ACTUALLY YOUR ROOT PASS.
     * Right now this is the password the WWW interface propts for before shutting down an app
     */
    root_pass:'testtest',
    /**
     * This is the directory that the apps you create will be installed into
     */
    app_dir:__dirname + '/apps',
    /**
     * This is the port your traffic will be running on. 80 Obviously should forward to this port.
     * Ubuntu Users: Look at the bottom of the /bin/setup_box.sh for the code to do it
     */
    proxy_port:3000,
    /**
     * If your project is not public you will need to authenticate with Github to get the project
     * I actually recomend setting up a proxy account and share with it as a colaborator
     */
    default_git_user:{
        username:'your_proxies_git_hub_username',
        password:'your_proxies_git_hub_password'
    },
    /**
     * Here is the big shabang. Where all of the apps are registered. YOu can run as many apps as you can fit on the box here.
     */
    apps:{
        /**
         * This is an example using the demo of one of my themes on Theme Forrest
         */
        vanilla_ionic:{
            /**
             * Just a brief description. Not used much
             */
            name:'Vanilla Ionic Ghost Theme',
            /**
             * The github info where the repo is
             */
            github:{
                path:'',
                /**
                 * User: The account under which the project is owned
                 */
                user:'schematical',
                /**
                 * Repo: The repo id
                 */
                repo:'ionic_ghost_theme',
                /**
                 * On our end where this repo should be installed
                 */
                deploy_to_dir:'/var/www/ghost/content/themes/git_ionic_test',
                /**
                 * Ref: the branch (Optional - Default: master)
                 */
                ref:'master'
            },
            /**
             * The directory where you want Forever to run the app from
             */
            wd:'/var/www/NProxy/_test/ionic_ghost_theme-master',
            /**
             * The script location
             */
            script:'index.js',
            /**
             * This is important. This is the information for the proxy
             */
            route:{
                /**
                 * From:
                 * Info on filtering out vhosts that point to this server
                 */
                from:{
                    /**
                     * The vhost of the request that comes in on port 80-->3000-->??
                     */
                    alias:'vanillaionic.schematical.com'
                },
                /**
                 * TO: Info on where requests will be routed to
                 */
                to:{
                    host:'localhost',
                    port:3003
                }
            }
        }
    }
}