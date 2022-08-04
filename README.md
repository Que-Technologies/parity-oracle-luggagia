# Raspberry/Strato deployment steps for parity-oracle

1. Ensure that the user have root privileges using sudo command
2. In order to user the Oracle component Nodejs should be installed in prior.

````
>> sudo apt install nodejs
````
In order to check that node is correctly installed please use
````
>> node -v
````

3. The next commands are used in order to be able to download the Oracle component to a specific directory on Raspberry 
or Strato device. 
````
>> cd /home/pi/
>> mkdir oracle
>> cd oracle
>> git clone https://github.com/Que-Technologies/parity-oracle-test.git
````
A prompt command will be displayed asking for the github username & password (for a password a personal token should be 
generated). After retrieving successfully the git package then rename it with the following, deploy and test the Oracle
````
>> mv parity-oracle-test/ parity-oracle/ 
>> cd parity-oracle/bin
>> node www
````
In order to test that the oracle is operational open a new console (don't close the current one and don't press CTRL+C)
and type
````
>> wget http://localhost:8080/getUserPseudonym
````
If this is successful then the oracle has been installed correctly.

The next steps are required in order to build the Oracle as a service. If not, by pressing CTRL+C then the oracle will exit
and stop operating.

ORACLE AS A SERVICE steps

````
>> cd /home/pi/oracle
>> touch oracleStart.sh
````
Then inside the file should be copy - paste the following
````
#!/bin/bash
sudo node /home/pi/oracle/parity-oracle/bin/www
````

SAVE the file and type:
````
>> sudo chmod +x oracleStart.sh
````
Then:
````
>> cd /etc/systemd/system
>> sudo touch oracle.service
>> sudo nano oracle.service
````
Then inside the file should be copy - paste the following
````
[Unit]
Documentation=https://docs.influxdata.com/influxdb/

[Service]
User=root
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=/home/pi
ExecStart=/home/pi/oracle/oracleStart.sh

[Install]
WantedBy=multi-user.target
````
Save and close the file and continue by enabling the service:
````
>> sudo systemctl enable oracle.service
>> sudo systemctl start oracle.service
>> sudo systemctl status oracle.service
````
After starting the service we can check it using the status command. In order to check again the oracle you can type
````
>> wget http://localhost:8080/getUserPseudonym
````
