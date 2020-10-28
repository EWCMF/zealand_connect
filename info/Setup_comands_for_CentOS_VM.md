# Upsætning af VM med CentOS til at køre docker.
Bemærk 1: At for at få https på domænet er Nginx brugt som et lag mellem node.js og internettet. Bliver kaldet reverse proxy.
Bemærk 2: Mange at kommandoerne kan komme med ekstra spørgsmål som man skal svar på. Svar på dem hvis ikke er ja/nej spørgsmål, og hvis de er et ja/nej spørgsmål, så svar ja.

Log ind som root:

	yum check-update
	
	yum install epel-release
	
	yum update
	
	curl -fsSL https://get.docker.com/ | sh
	
	yum install nano git htop fish util-linux-user certbot nginx python3-certbot-nginx mc 
	
	reboot
	
Log ind som root:

	adduser devdata
	
	passwd devdata
	
	 Definere kodeord.
	 
	usermod -aG wheel devdata
	
	usermod -aG docker devdata
	
	nano /etc/ssh/sshd_config
	
	 Ændre "PermitRootLogin yes" til "PermitRootLogin no"
	 
	systemctl enable docker
	
	reboot
	
Log ind som devdata (Muligheden for at logge ind som root gennem SSH er nu deaktiveret. Dette er grundlæggende sikkerhed opsætning af VM):

	chsh -s /usr/bin/fish
	
	sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
	
	sudo iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT
	
	sudo iptables -I INPUT -p tcp -m tcp --dport 8000 -j ACCEPT
	
	sudo setsebool -P httpd_can_network_connect 1
	
	sudo nano /etc/nginx/nginx.conf
	
	 Ændre det mellem server_name og ; til det brugte domæne.
	 
	 Fjern linjen med "root /usr/share/ngnix/html" eller udkommenter med #;
	 
	 Erstat alt i "location /" med proxy_pass http://127.0.0.1:8080;
	 
	sudo systemctl start nginx
	
	sudo systemctl enable nginx
	
	sudo certbot --nginx
