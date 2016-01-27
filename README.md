The project is intended for the automatic generation of the workpiece for the front-end based on the xml-file which describes api of the existing back-end.
The generation takes place according to the pre-prepared templates with the help of the regular expressions.
The generator functional allows you to generate index.html with all the connections as well as controllers, views and operation services with the data for each api method.
There is also a generation functional and dependencies installation for bower.
The generator operates as a server, which receives the input parameters in the body of POST-request.
ES6 Harmony on the level of the native support of the current version v8, express, library Q are used as the project technologies to work with the promises, winston - for logging. The project is built with the help of grunt-js. Sass (scss) is used as the css preprocessor.

---

Проект предназначен для автоматической генерации заготовки под фронт-энд на основе xml-файла описывающего api существующего бек-энда.
Генерация происходит по предварительно подготовленным шаблонам с помощью регулярных выражений.
Функционал генератора позволяет сгенерировать index.html со всеми подключениями а так же контроллеры, отображения и сервисы работы с даннными для каждого метода api.
Так же имеется функционал генерации и установки зависимостей для bower.
Генератор работает в виде сервера, который принимает входящие параметры в теле POST-запроса.
В качестве технологий проекта используются: ES6 Harmony на уровне нативной поддержки текущей весии v8, express, библиотека Q - для работы с промисами,
winston - для логирования. Сборка проекта осуществляется с помощью grunt-js. Как препроцессор css используется sass (scss).