# twitter-firebase-stream

Aplicación hecha con [expressjs](http://expressjs.com/) y [firebase](https://firebase.google.com) para el [Curso de NodeJS](https://github.com/Fictizia/Curso-Node.js-para-desarrolladores-Front-end_ed5) de [@Fictizia](https://github.com/Fictizia);

El objetivo es crear un mapa que visualize en tiempo real los tweets de un determinado hashtag.

## Instalación

> Por defecto la aplicación arrancará en el puerto **8080**.

```
git clone https://github.com/josex2r/twitter-firebase-stream.git
cd twitter-firebase-stream
npm install
npm server
```

## Plantilla

En la rama [#template](https://github.com/josex2r/twitter-firebase-stream/tree/template) se encuentra el proyecto inicializado con toda la parte del cliente de tal manera que únicamente es necesario programar la parte de firebase.

## Ejercicio

Completar los siguientes ficheros:

- `lib/firebase-client.js`: Establecer conexión con Firebase
- `lib/twitter-stream.js`: Persistir datos en Firebase
- `public/javascripts/index.js`: Autenticación
- `public/javascripts/map.js`: Recuperar datos de la base de datos
