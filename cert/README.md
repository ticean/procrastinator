## HTTPS (SSL) Certs

If you enable SSL, you can keep your certs anywhere you'd like, but by default the server will look in this folder for the private key and certificate.

- privatekey.pem
- certificate.pem


## Creating Keys
You can generate the keys with the following code. Of course, you'll need openssl.

    openssl genrsa -out privatekey.pem 1024 
    openssl req -new -key privatekey.pem -out certrequest.csr 
    openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
