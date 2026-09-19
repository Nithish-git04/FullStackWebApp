FROM nginx:alpine
COPY config.js /usr/share/nginx/config.template.js
COPY 20-envsubst-config.sh /docker-entrypoint.d/
RUN ["chmod", "+x", "/docker-entrypoint.d/20-envsubst-config.sh"]
COPY . /usr/share/nginx/html
EXPOSE 80