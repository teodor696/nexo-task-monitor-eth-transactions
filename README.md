# nexo-task-monitor-eth-transactions

CAUTION! Unfortunately the program can't perform the task, because the code is still unfinished. The lifecyle of the program is not complete. For now you can only use the api to create a configuration and send a messsage in kafka

My idea was to create an api which when a new configuration is created/updated/deleted to send a kafka message to the sync program, where it will initialize new model with the newly created/updated configuration (In order to not restart the program manualy). And if the configurations were somewhat wrong and throw error, because of bad writing, or any other error occurs that would stop the program, when the program fall I would be using some kind of cache (my choice was redis) so I can find which was the previous configuration.

## Technologies used: ##
 * Redis, Kafka, PostgreSQL, Nodejs;
	
## Prerequisites ##
 * OS Ubuntu/Debian or other linux distribution
 * Installed Nodejs version 16 or above
 * Used Infura for native node provider. Make sure you have registered in their website `https://infura.io` and set the api-key in the .env file in my project	
 * Make sure you have running apache kafka locally on `localhost:9092`. (best way for me is to have installed docker-compose on your computer and just follow the steps in this link `https://www.baeldung.com/ops/kafka-docker-setup`)
 * Make sure you have running redis locally on `localhost:6379` (You can follow steps how to install it from here `https://redis.io/docs/getting-started/installation/install-redis-on-linux`)
 * Installed postgresql and running it on `localhost:5432` (You can install it by following these steps on `https://linuxhint.com/postgresql_installation_guide_ubuntu_20-04/`. We are going to use the "postgres" superuser's privileges for our app's purposes, so you don't have to do any manual work like creating new user etc. Just set a postgresql super user a password you know.You should use user "postgres" in the .env file in my project)
 
 * run npm i on the root level of the repo/project.
 * finally run `npm run init-tables` to create the tables in your postgresql
 * you can run `npm run start-sync` or `npm run start-api`
 
 Now you can start breaking :D

