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
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("../runtime");
function CategoryFromJSON(json) {
    return {
        'id': !runtime_1.exists(json, 'id') ? undefined : json['id'],
        'name': !runtime_1.exists(json, 'name') ? undefined : json['name'],
    };
}
exports.CategoryFromJSON = CategoryFromJSON;
function CategoryToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    return {
        'id': value.id,
        'name': value.name,
    };
}
exports.CategoryToJSON = CategoryToJSON;
