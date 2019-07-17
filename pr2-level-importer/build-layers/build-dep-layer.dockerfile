FROM amazonlinux
RUN mkdir -p /root/nodejs
WORKDIR root/nodejs
RUN curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install nodejs zip -y
COPY package.json package-lock.json ./
RUN npm install --production
RUN cd /root && zip -r node_modules.zip nodejs
