"use strict";
// tslint:disable
/**
 * Swagger Petstore
 * This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: apiteam@swagger.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var runtime = require("../runtime");
var models_1 = require("../models");
/**
 * no description
 */
var PetApi = /** @class */ (function (_super) {
    __extends(PetApi, _super);
    function PetApi() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Add a new pet to the store
     */
    PetApi.prototype.addPetRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.body === null || requestParameters.body === undefined) {
                            throw new runtime.RequiredError('body', 'Required parameter requestParameters.body was null or undefined when calling addPet.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        headerParameters['Content-Type'] = 'application/json';
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet",
                                method: 'POST',
                                headers: headerParameters,
                                query: queryParameters,
                                body: models_1.PetToJSON(requestParameters.body),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.VoidApiResponse(response)];
                }
            });
        });
    };
    /**
     * Add a new pet to the store
     */
    PetApi.prototype.addPet = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addPetRaw(requestParameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes a pet
     */
    PetApi.prototype.deletePetRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.petId === null || requestParameters.petId === undefined) {
                            throw new runtime.RequiredError('petId', 'Required parameter requestParameters.petId was null or undefined when calling deletePet.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        if (requestParameters.api_key !== undefined && requestParameters.api_key !== null) {
                            headerParameters['api_key'] = String(requestParameters.api_key);
                        }
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/{petId}".replace("{" + "petId" + "}", encodeURIComponent(String(requestParameters.petId))),
                                method: 'DELETE',
                                headers: headerParameters,
                                query: queryParameters,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.VoidApiResponse(response)];
                }
            });
        });
    };
    /**
     * Deletes a pet
     */
    PetApi.prototype.deletePet = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deletePetRaw(requestParameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Multiple status values can be provided with comma separated strings
     * Finds Pets by status
     */
    PetApi.prototype.findPetsByStatusRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.status === null || requestParameters.status === undefined) {
                            throw new runtime.RequiredError('status', 'Required parameter requestParameters.status was null or undefined when calling findPetsByStatus.');
                        }
                        queryParameters = {};
                        if (requestParameters.status) {
                            queryParameters['status'] = requestParameters.status;
                        }
                        headerParameters = {};
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/findByStatus",
                                method: 'GET',
                                headers: headerParameters,
                                query: queryParameters,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.JSONApiResponse(response, function (jsonValue) { return jsonValue.map(models_1.PetFromJSON); })];
                }
            });
        });
    };
    /**
     * Multiple status values can be provided with comma separated strings
     * Finds Pets by status
     */
    PetApi.prototype.findPetsByStatus = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPetsByStatusRaw(requestParameters)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.value()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * Finds Pets by tags
     */
    PetApi.prototype.findPetsByTagsRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.tags === null || requestParameters.tags === undefined) {
                            throw new runtime.RequiredError('tags', 'Required parameter requestParameters.tags was null or undefined when calling findPetsByTags.');
                        }
                        queryParameters = {};
                        if (requestParameters.tags) {
                            queryParameters['tags'] = requestParameters.tags;
                        }
                        headerParameters = {};
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/findByTags",
                                method: 'GET',
                                headers: headerParameters,
                                query: queryParameters,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.JSONApiResponse(response, function (jsonValue) { return jsonValue.map(models_1.PetFromJSON); })];
                }
            });
        });
    };
    /**
     * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * Finds Pets by tags
     */
    PetApi.prototype.findPetsByTags = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPetsByTagsRaw(requestParameters)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.value()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns a single pet
     * Find pet by ID
     */
    PetApi.prototype.getPetByIdRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.petId === null || requestParameters.petId === undefined) {
                            throw new runtime.RequiredError('petId', 'Required parameter requestParameters.petId was null or undefined when calling getPetById.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        if (this.configuration && this.configuration.apiKey) {
                            headerParameters["api_key"] = this.configuration.apiKey("api_key"); // api_key authentication
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/{petId}".replace("{" + "petId" + "}", encodeURIComponent(String(requestParameters.petId))),
                                method: 'GET',
                                headers: headerParameters,
                                query: queryParameters,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.JSONApiResponse(response, function (jsonValue) { return models_1.PetFromJSON(jsonValue); })];
                }
            });
        });
    };
    /**
     * Returns a single pet
     * Find pet by ID
     */
    PetApi.prototype.getPetById = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPetByIdRaw(requestParameters)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.value()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update an existing pet
     */
    PetApi.prototype.updatePetRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.body === null || requestParameters.body === undefined) {
                            throw new runtime.RequiredError('body', 'Required parameter requestParameters.body was null or undefined when calling updatePet.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        headerParameters['Content-Type'] = 'application/json';
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet",
                                method: 'PUT',
                                headers: headerParameters,
                                query: queryParameters,
                                body: models_1.PetToJSON(requestParameters.body),
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.VoidApiResponse(response)];
                }
            });
        });
    };
    /**
     * Update an existing pet
     */
    PetApi.prototype.updatePet = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updatePetRaw(requestParameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates a pet in the store with form data
     */
    PetApi.prototype.updatePetWithFormRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, formData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.petId === null || requestParameters.petId === undefined) {
                            throw new runtime.RequiredError('petId', 'Required parameter requestParameters.petId was null or undefined when calling updatePetWithForm.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        formData = new FormData();
                        if (requestParameters.name !== undefined) {
                            formData.append('name', requestParameters.name);
                        }
                        if (requestParameters.status !== undefined) {
                            formData.append('status', requestParameters.status);
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/{petId}".replace("{" + "petId" + "}", encodeURIComponent(String(requestParameters.petId))),
                                method: 'POST',
                                headers: headerParameters,
                                query: queryParameters,
                                body: formData,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.VoidApiResponse(response)];
                }
            });
        });
    };
    /**
     * Updates a pet in the store with form data
     */
    PetApi.prototype.updatePetWithForm = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updatePetWithFormRaw(requestParameters)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * uploads an image
     */
    PetApi.prototype.uploadFileRaw = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryParameters, headerParameters, formData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (requestParameters.petId === null || requestParameters.petId === undefined) {
                            throw new runtime.RequiredError('petId', 'Required parameter requestParameters.petId was null or undefined when calling uploadFile.');
                        }
                        queryParameters = {};
                        headerParameters = {};
                        if (this.configuration && this.configuration.accessToken) {
                            // oauth required
                            if (typeof this.configuration.accessToken === 'function') {
                                headerParameters["Authorization"] = this.configuration.accessToken("petstore_auth", ["write:pets", "read:pets"]);
                            }
                            else {
                                headerParameters["Authorization"] = this.configuration.accessToken;
                            }
                        }
                        formData = new FormData();
                        if (requestParameters.additionalMetadata !== undefined) {
                            formData.append('additionalMetadata', requestParameters.additionalMetadata);
                        }
                        if (requestParameters.file !== undefined) {
                            formData.append('file', requestParameters.file);
                        }
                        return [4 /*yield*/, this.request({
                                path: "/pet/{petId}/uploadImage".replace("{" + "petId" + "}", encodeURIComponent(String(requestParameters.petId))),
                                method: 'POST',
                                headers: headerParameters,
                                query: queryParameters,
                                body: formData,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new runtime.JSONApiResponse(response, function (jsonValue) { return models_1.ModelApiResponseFromJSON(jsonValue); })];
                }
            });
        });
    };
    /**
     * uploads an image
     */
    PetApi.prototype.uploadFile = function (requestParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadFileRaw(requestParameters)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.value()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PetApi;
}(runtime.BaseAPI));
exports.PetApi = PetApi;
/**
    * @export
    * @enum {string}
    */
var FindPetsByStatusStatusEnum;
(function (FindPetsByStatusStatusEnum) {
    FindPetsByStatusStatusEnum["Available"] = "available";
    FindPetsByStatusStatusEnum["Pending"] = "pending";
    FindPetsByStatusStatusEnum["Sold"] = "sold";
})(FindPetsByStatusStatusEnum = exports.FindPetsByStatusStatusEnum || (exports.FindPetsByStatusStatusEnum = {}));
