'use strict';

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var path = require('path');
var fs = require('fs-extra');
var flatted = require('flatted');
var tsMorph = require('ts-morph');
var convertType = require('@magical-types/convert-type');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var path__default = /*#__PURE__*/_interopDefault(path);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var flatted__namespace = /*#__PURE__*/_interopNamespace(flatted);

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

{
  var OTHERFILES = ['stateManager', 'Async', 'Creatable'];
  var getOtherProps = function getOtherProps(obj) {
    OTHERFILES.forEach(function (name) {
      var pkgExports = {};
      obj["".concat(name)] = pkgExports;
      var sourceFile = project.getSourceFile(path__default["default"].join(__dirname, '../../PropTypes', "".concat(name, ".ts")));
      if (!sourceFile) {
        sourceFile = project.getSourceFile(path__default["default"].join(__dirname, '../../PropTypes', "".concat(name, ".tsx")));
      }
      if (!sourceFile) {
        throw new Error("source file not found for ".concat(name));
      }
      resolveTypes({
        sourceFile: sourceFile,
        item: name,
        pkgExports: pkgExports
      });
    });
  };
  var resolveTypes = function resolveTypes(_ref) {
    var sourceFile = _ref.sourceFile,
      item = _ref.item,
      pkgExports = _ref.pkgExports;
    var exportedDeclarations = sourceFile.getExportedDeclarations();
    var _iterator = _createForOfIteratorHelper(exportedDeclarations),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          exportName = _step$value[0],
          declaration = _step$value[1];
        if (declaration.length) {
          var type = declaration[0].getType().compilerType;
          var typeKind = 'other';
          console.log("about to convert ".concat(exportName, " from ").concat(item));
          if (exportName[0].toUpperCase() === exportName[0]) {
            try {
              type = convertType.getPropTypesType(type);
              typeKind = 'component';
            } catch (err) {}
          }
          pkgExports[exportName] = {
            node: convertType.convertType(type, []),
            type: typeKind
          };
          console.log('converted');
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var project = new tsMorph.Project({
    addFilesFromTsConfig: true,
    tsConfigFilePath: path__default["default"].resolve(__dirname, '../../../tsconfig.json')
  });
  console.log('done');
  var pkgDir = path__default["default"].resolve(__dirname, '../../../packages');
  var pkgs = fs__default["default"].readdirSync(pkgDir, {
    withFileTypes: true
  }).filter(
  // @ts-ignore
  function (x) {
    return x.isDirectory() && fs__default["default"].existsSync(path__default["default"].join(pkgDir, path__default["default"].join(x.name), 'package.json'));
  })
  // @ts-ignore
  .map(function (x) {
    return x.name;
  });
  var obj = {};
  var _iterator2 = _createForOfIteratorHelper(pkgs),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      var pkgExports = {};
      obj["".concat(item)] = pkgExports;
      var sourceFile = project.getSourceFile(path__default["default"].join(pkgDir, item, 'src', 'index.tsx'));
      if (!sourceFile) {
        sourceFile = project.getSourceFile(path__default["default"].join(pkgDir, item, 'src', 'index.ts'));
      }
      if (!sourceFile) {
        throw new Error("source file not found for ".concat(item));
      }
      resolveTypes({
        sourceFile: sourceFile,
        item: item,
        pkgExports: pkgExports
      });
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  getOtherProps(obj);
  fs__default["default"].outputFileSync(path__default["default"].join(__dirname, '..', 'dist', 'magical-types.json'), flatted__namespace.stringify(obj));
}
