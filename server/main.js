'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var fs = require('fs.promised');
var path = _interopDefault(require('path'));
var Router = require('koa-router');
var serve = _interopDefault(require('koa-static'));
var bodyParser = _interopDefault(require('koa-bodyparser'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var config = {
    port: 12301,
    template: '/public/index.html',
    publicUrl: '/public/'
};
var app = new Koa();
var router = new Router();
var index = fs.readFileSync(path.join(process.cwd(), config.template), 'utf8');
var writed = false;
var writeFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dir, exists;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir = path.join(process.cwd(), config.publicUrl);
                if (!!writed) return [3 /*break*/, 3];
                writed = !!1;
                return [4 /*yield*/, fs.exists(dir)];
            case 1:
                exists = _a.sent();
                if (!exists) {
                    fs.mkdir(dir);
                }
                return [4 /*yield*/, fs.writeFile(path.join(dir, 'index.html'), index)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, fs.readFile(path.join(dir, 'index.html'), 'utf8')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
writeFile();
app.use(bodyParser({}));
app.use(serve(path.join(process.cwd(), config.publicUrl), {}));
router.get('/:name', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                name = ctx.params.name;
                ctx.response.type = 'html';
                _a = ctx.response;
                return [4 /*yield*/, fs.readFile(path.join(process.cwd(), config.publicUrl, name + '.html'), 'utf8')];
            case 1:
                _a.body = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
router.get('/', function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ctx.response.type = 'html';
                _a = ctx.response;
                return [4 /*yield*/, writeFile()];
            case 1:
                _a.body = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
app.use(router.routes());
app.listen(config.port);
console.log('');
console.log('http://localhost:' + config.port);
console.log('');
