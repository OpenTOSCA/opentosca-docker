#
# You need to install the docker-compose plugin before using this Vagrantfile:
#
#   vagrant plugin install vagrant-docker-compose
#

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :docker
  config.vm.provision :docker_compose, yml: "/vagrant/docker-compose.yml", run: "always"
end
