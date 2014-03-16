#Mongo FIrst
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

#Now apt-get update

sudo apt-get update;
sudo apt-get install python g++ make checkinstall
src=$(mktemp -d) && cd $src
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd node-v*
./configure
fakeroot checkinstall -y --install=no --pkgversion $(echo $(pwd) | sed -n -re's/.+node-v(.+)$/\1/p') make -j$(($(nproc)+1)) install
sudo dpkg -i node_*


sudo apt-get install git


sudo apt-get install mongodb-10gen

#--------------------GIT KEY GENERATION---------------------##
#You may need to run this manually
ssh-keygen -t rsa -C "mlea@schematical.com"

