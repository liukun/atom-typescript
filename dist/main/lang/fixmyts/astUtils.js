exports.forEachChild = ts.forEachChild;
function forEachChildRecursive(node, cbNode, depth) {
    if (depth === void 0) { depth = 0; }
    var res = cbNode(node, depth);
    forEachChildRecursive(node, cbNode, depth + 1);
    return res;
}
exports.forEachChildRecursive = forEachChildRecursive;
function getNodeByKindAndName(program, kind, name) {
    var found = undefined;
    function findNode(node) {
        if (node.kind == kind) {
            if (node.kind == 201) {
                if (node.name.text == name) {
                    found = node;
                }
            }
            if (node.kind == 202) {
                if (node.name.text == name) {
                    found = node;
                }
            }
        }
        if (!found) {
            exports.forEachChild(node, findNode);
        }
    }
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var file = _a[_i];
        exports.forEachChild(file, findNode);
    }
    return found;
}
exports.getNodeByKindAndName = getNodeByKindAndName;
function getSourceFileImports(srcFile) {
    var modules = [];
    getImports(srcFile, modules);
    return modules;
}
exports.getSourceFileImports = getSourceFileImports;
function getImports(searchNode, importedModules) {
    ts.forEachChild(searchNode, function (node) {
        if (node.kind === 209 || node.kind === 208 || node.kind === 215) {
            var moduleNameExpr = getExternalModuleName(node);
            if (moduleNameExpr && moduleNameExpr.kind === 8) {
                importedModules.push(moduleNameExpr.text);
            }
        }
        else if (node.kind === 205 && node.name.kind === 8) {
            getImports(node.body, importedModules);
        }
    });
}
function getExternalModuleName(node) {
    if (node.kind === 209) {
        return node.moduleSpecifier;
    }
    if (node.kind === 208) {
        var reference = node.moduleReference;
        if (reference.kind === 219) {
            return reference.expression;
        }
    }
    if (node.kind === 215) {
        return node.moduleSpecifier;
    }
}
