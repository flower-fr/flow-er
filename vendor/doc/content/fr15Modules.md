Modules
=======

A module is a set of features or services that can be added, cooperate, the whole being used by the main application. Modules can be public and reusable by a number of applications, or be private and specific to a particular application. In that case, a module is not necessarily a way to reuse code, but rather a mean to manage complexity by dividing it to smaller problems.

Conventionally, modules can be added in two places: _vendor/_ and _module/_. Modules in _vendor/_ are reusable libraries, typically provided by third parts, while modules in _module/_ belong to your application.

_Flow-er_ comes with several vendor modules : 
* __flCore__ : The core _Flow-er_ reusable services
* __flBo__: A powerfull back-office and user interface that can be the foundation for building a CRM for example
* __flDoc__: Everything that you need to publish documentation for your application
* __flDocument__: An engine for a simple document management system
* __flHub__: An API orchestrator for providing graphically supervised automations
* __flMy__: A set of services to help implementing a public app
* __flPub__: Public and protected web form to integrate as iframe in a website or as a personalized link inside a mail
* __flStudio__: a no-code app to adapt __flow-er__ configuration and settings to each client context
* __flTranslation__: for applications usable worldwide adapting to local languages
* __flUser__: for managing user enrollment.

Except the vendor modules listed above, modules added to __flow-er__ are gitignored, so you are free to manage the git versioning on a per module basis.
