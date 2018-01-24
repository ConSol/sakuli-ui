_dynamicInclude($includeFolder);

var define = (function() {
    var modules = {
        require: {deps: [], module: function() {}, exported: {}},
        exports: {deps: [], module: function() { return ({});}, exported: null, scope: 'prototype'}
    }
    function define(mName, deps, module) {
        modules[mName] = {
            deps: deps,
            module: module,
            exported: null
        }
    }

    define.resolve = function(mName) {
        Logger.logInfo("Resolve", mName);
        var mod = modules[mName];
        if(!mod.exported) {
            var resolvedDeps = [];
            var exportRef;
            for(var i in mod.deps) {
                dep = mod.deps[i];
                if(dep === 'exports') {
                    exportRef = {};
                    resolvedDeps.push(exportRef);
                } else {
                    resolved = define.resolve(dep);
                    resolvedDeps.push(resolved);
                }
            }
            mod.module.apply(mod.module, resolvedDeps);
            mod.exported = exportRef ? exportRef: {}
        }
        return mod.exported
    }
    return define;
})()

_include("test.js");

define.resolve("test");