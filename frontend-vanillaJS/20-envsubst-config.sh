#!/bin/sh
envsubst '${API_URL}' < /usr/share/nginx/config.template.js > /usr/share/nginx/html/config.js