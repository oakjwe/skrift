FROM nginx:stable-alpine
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY app/ /usr/share/nginx/html/app/
COPY mms/260127SkriftisKrokar.woff2 mms/260127SkriftisTengd.woff2 mms/260127SkriftisPenna.woff2 /usr/share/nginx/html/mms/
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["nginx", "-g", "daemon off;"]
