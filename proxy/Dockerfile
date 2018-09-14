FROM alpine
RUN apk --no-cache add dnsmasq nginx
COPY nginx.conf /etc/nginx/nginx.conf
CMD dnsmasq && nginx -g 'daemon off;'
