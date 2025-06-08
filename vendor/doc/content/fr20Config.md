Config
======

Like settings, config in _Flow-ER_ is a JSON based description of parameters for the application.

While settings are a predefined set of global parameters, mainly technical ones (database or SMTP credentials for example), the config is the mean to adapt the default application model or, what's most important, to define new application’s model from scratch.

The term _model_ encompasses both the data model describing data structure to persist in a database typically, and the view model which is the the mean of presenting the data to the end user.

Think of the config as the mean for you to present to the end user &laquo; things &raquo; that are related to her own semantics, ie clients or invoices or products&hellip;

In terms of code architecture, the config is defined on a per module basis. Inside a module, the __config__ folder contains JSON files that are automatically loaded for each module declared as a middleware (see [Settings](fr10Settings)). All the modules configs are merged into a resulting dictionary (key-value pairs) that constitutes the application model.

The configs defined in each module for a given application should be disjoint in terms of defined keys in the dictionary, since the way of choosing between two ambiguous keys (same key between two different modules) is unpredictable.

In addition to this aggregation of per module configs, the __config/__ folder provides a way of overwriting values in the config dictionary, after the module config are merged.

In order to define a global config to overwrite given entries in the per module config, you have to specify the __current__ entry in the __settings.json__ file, replacing or adding folder name in the array.

    config: {
        dir: "../config",
        current: ["my-client"]
    }
    
In this example, the __my-client__ folder contains json files describing the config entries that specifies for _my client_ some parameters against their standard values as defined in some of the application’s modules.
