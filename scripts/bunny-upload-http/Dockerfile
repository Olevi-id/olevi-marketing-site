FROM alpine:3.18

RUN apk add --no-cache bash curl file jq

COPY upload.sh /uploader/upload.sh
RUN chmod +x /uploader/upload.sh

ENTRYPOINT ["/uploader/upload.sh"]
