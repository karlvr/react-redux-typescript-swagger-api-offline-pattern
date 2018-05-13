/// <reference path="../custom.d.ts" />
import { Configuration } from "./configuration";
/**
 *
 * @export
 */
export declare const COLLECTION_FORMATS: {
    csv: string;
    ssv: string;
    tsv: string;
    pipes: string;
};
/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}
/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}
/**
 *
 * @export
 * @class BaseAPI
 */
export declare class BaseAPI {
    protected basePath: string;
    protected fetch: FetchAPI;
    protected configuration: Configuration;
    constructor(configuration?: Configuration, basePath?: string, fetch?: FetchAPI);
}
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export declare class RequiredError extends Error {
    field: string;
    name: "RequiredError";
    constructor(field: string, msg?: string);
}
/**
 *
 * @export
 * @interface ApiResponse
 */
export interface ApiResponse {
    /**
     *
     * @type {number}
     * @memberof ApiResponse
     */
    code?: number;
    /**
     *
     * @type {string}
     * @memberof ApiResponse
     */
    type?: string;
    /**
     *
     * @type {string}
     * @memberof ApiResponse
     */
    message?: string;
}
/**
 *
 * @export
 * @interface Category
 */
export interface Category {
    /**
     *
     * @type {number}
     * @memberof Category
     */
    id?: number;
    /**
     *
     * @type {string}
     * @memberof Category
     */
    name?: string;
}
/**
 *
 * @export
 * @interface Order
 */
export interface Order {
    /**
     *
     * @type {number}
     * @memberof Order
     */
    id?: number;
    /**
     *
     * @type {number}
     * @memberof Order
     */
    petId?: number;
    /**
     *
     * @type {number}
     * @memberof Order
     */
    quantity?: number;
    /**
     *
     * @type {Date}
     * @memberof Order
     */
    shipDate?: string;
    /**
     * Order Status
     * @type {string}
     * @memberof Order
     */
    status?: Order.StatusEnum;
    /**
     *
     * @type {boolean}
     * @memberof Order
     */
    complete?: boolean;
}
/**
 * @export
 * @namespace Order
 */
export declare namespace Order {
    /**
     * @export
     * @enum {string}
     */
    enum StatusEnum {
        Placed,
        Approved,
        Delivered,
    }
}
/**
 *
 * @export
 * @interface Pet
 */
export interface Pet {
    /**
     *
     * @type {number}
     * @memberof Pet
     */
    id?: number;
    /**
     *
     * @type {Category}
     * @memberof Pet
     */
    category?: Category;
    /**
     *
     * @type {string}
     * @memberof Pet
     */
    name: string;
    /**
     *
     * @type {Array&lt;string&gt;}
     * @memberof Pet
     */
    photoUrls: Array<string>;
    /**
     *
     * @type {Array&lt;Tag&gt;}
     * @memberof Pet
     */
    tags?: Array<Tag>;
    /**
     * pet status in the store
     * @type {string}
     * @memberof Pet
     */
    status?: Pet.StatusEnum;
}
/**
 * @export
 * @namespace Pet
 */
export declare namespace Pet {
    /**
     * @export
     * @enum {string}
     */
    enum StatusEnum {
        Available,
        Pending,
        Sold,
    }
}
/**
 *
 * @export
 * @interface Tag
 */
export interface Tag {
    /**
     *
     * @type {number}
     * @memberof Tag
     */
    id?: number;
    /**
     *
     * @type {string}
     * @memberof Tag
     */
    name?: string;
}
/**
 *
 * @export
 * @interface User
 */
export interface User {
    /**
     *
     * @type {number}
     * @memberof User
     */
    id?: number;
    /**
     *
     * @type {string}
     * @memberof User
     */
    username?: string;
    /**
     *
     * @type {string}
     * @memberof User
     */
    firstName?: string;
    /**
     *
     * @type {string}
     * @memberof User
     */
    lastName?: string;
    /**
     *
     * @type {string}
     * @memberof User
     */
    email?: string;
    /**
     *
     * @type {string}
     * @memberof User
     */
    password?: string;
    /**
     *
     * @type {string}
     * @memberof User
     */
    phone?: string;
    /**
     * User Status
     * @type {number}
     * @memberof User
     */
    userStatus?: number;
}
/**
 * PetApi - fetch parameter creator
 * @export
 */
export declare const PetApiFetchParamCreator: (configuration?: Configuration) => {
    addPet(body: Pet, options?: any): FetchArgs;
    deletePet(petId: number, apiKey?: string, options?: any): FetchArgs;
    findPetsByStatus(status: string[], options?: any): FetchArgs;
    findPetsByTags(tags: string[], options?: any): FetchArgs;
    getPetById(petId: number, options?: any): FetchArgs;
    updatePet(body: Pet, options?: any): FetchArgs;
    updatePetWithForm(petId: number, name?: string, status?: string, options?: any): FetchArgs;
    uploadFile(petId: number, additionalMetadata?: string, file?: any, options?: any): FetchArgs;
};
/**
 * PetApi - functional programming interface
 * @export
 */
export declare const PetApiFp: (configuration?: Configuration) => {
    addPet(body: Pet, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    deletePet(petId: number, apiKey?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    findPetsByStatus(status: string[], options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Pet[]>;
    findPetsByTags(tags: string[], options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Pet[]>;
    getPetById(petId: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Pet>;
    updatePet(body: Pet, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    updatePetWithForm(petId: number, name?: string, status?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    uploadFile(petId: number, additionalMetadata?: string, file?: any, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiResponse>;
};
/**
 * PetApi - factory interface
 * @export
 */
export declare const PetApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    addPet(body: Pet, options?: any): Promise<Response>;
    deletePet(petId: number, apiKey?: string, options?: any): Promise<Response>;
    findPetsByStatus(status: string[], options?: any): Promise<Pet[]>;
    findPetsByTags(tags: string[], options?: any): Promise<Pet[]>;
    getPetById(petId: number, options?: any): Promise<Pet>;
    updatePet(body: Pet, options?: any): Promise<Response>;
    updatePetWithForm(petId: number, name?: string, status?: string, options?: any): Promise<Response>;
    uploadFile(petId: number, additionalMetadata?: string, file?: any, options?: any): Promise<ApiResponse>;
};
/**
 * PetApi - object-oriented interface
 * @export
 * @class PetApi
 * @extends {BaseAPI}
 */
export declare class PetApi extends BaseAPI {
    /**
     *
     * @summary Add a new pet to the store
     * @param {} body Pet object that needs to be added to the store
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    addPet(body: Pet, options?: any): Promise<Response>;
    /**
     *
     * @summary Deletes a pet
     * @param {} petId Pet id to delete
     * @param {} [apiKey]
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    deletePet(petId: number, apiKey?: string, options?: any): Promise<Response>;
    /**
     * Multiple status values can be provided with comma separated strings
     * @summary Finds Pets by status
     * @param {} status Status values that need to be considered for filter
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    findPetsByStatus(status: Array<string>, options?: any): Promise<Pet[]>;
    /**
     * Muliple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * @summary Finds Pets by tags
     * @param {} tags Tags to filter by
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    findPetsByTags(tags: Array<string>, options?: any): Promise<Pet[]>;
    /**
     * Returns a single pet
     * @summary Find pet by ID
     * @param {} petId ID of pet to return
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    getPetById(petId: number, options?: any): Promise<Pet>;
    /**
     *
     * @summary Update an existing pet
     * @param {} body Pet object that needs to be added to the store
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    updatePet(body: Pet, options?: any): Promise<Response>;
    /**
     *
     * @summary Updates a pet in the store with form data
     * @param {} petId ID of pet that needs to be updated
     * @param {} [name] Updated name of the pet
     * @param {} [status] Updated status of the pet
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    updatePetWithForm(petId: number, name?: string, status?: string, options?: any): Promise<Response>;
    /**
     *
     * @summary uploads an image
     * @param {} petId ID of pet to update
     * @param {} [additionalMetadata] Additional data to pass to server
     * @param {} [file] file to upload
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PetApi
     */
    uploadFile(petId: number, additionalMetadata?: string, file?: any, options?: any): Promise<ApiResponse>;
}
/**
 * StoreApi - fetch parameter creator
 * @export
 */
export declare const StoreApiFetchParamCreator: (configuration?: Configuration) => {
    deleteOrder(orderId: number, options?: any): FetchArgs;
    getInventory(options?: any): FetchArgs;
    getOrderById(orderId: number, options?: any): FetchArgs;
    placeOrder(body: Order, options?: any): FetchArgs;
};
/**
 * StoreApi - functional programming interface
 * @export
 */
export declare const StoreApiFp: (configuration?: Configuration) => {
    deleteOrder(orderId: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    getInventory(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{
        [key: string]: number;
    }>;
    getOrderById(orderId: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Order>;
    placeOrder(body: Order, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Order>;
};
/**
 * StoreApi - factory interface
 * @export
 */
export declare const StoreApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    deleteOrder(orderId: number, options?: any): Promise<Response>;
    getInventory(options?: any): Promise<{
        [key: string]: number;
    }>;
    getOrderById(orderId: number, options?: any): Promise<Order>;
    placeOrder(body: Order, options?: any): Promise<Order>;
};
/**
 * StoreApi - object-oriented interface
 * @export
 * @class StoreApi
 * @extends {BaseAPI}
 */
export declare class StoreApi extends BaseAPI {
    /**
     * For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
     * @summary Delete purchase order by ID
     * @param {} orderId ID of the order that needs to be deleted
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StoreApi
     */
    deleteOrder(orderId: number, options?: any): Promise<Response>;
    /**
     * Returns a map of status codes to quantities
     * @summary Returns pet inventories by status
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StoreApi
     */
    getInventory(options?: any): Promise<{
        [key: string]: number;
    }>;
    /**
     * For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
     * @summary Find purchase order by ID
     * @param {} orderId ID of pet that needs to be fetched
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StoreApi
     */
    getOrderById(orderId: number, options?: any): Promise<Order>;
    /**
     *
     * @summary Place an order for a pet
     * @param {} body order placed for purchasing the pet
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StoreApi
     */
    placeOrder(body: Order, options?: any): Promise<Order>;
}
/**
 * UserApi - fetch parameter creator
 * @export
 */
export declare const UserApiFetchParamCreator: (configuration?: Configuration) => {
    createUser(body: User, options?: any): FetchArgs;
    createUsersWithArrayInput(body: User[], options?: any): FetchArgs;
    createUsersWithListInput(body: User[], options?: any): FetchArgs;
    deleteUser(username: string, options?: any): FetchArgs;
    getUserByName(username: string, options?: any): FetchArgs;
    loginUser(username: string, password: string, options?: any): FetchArgs;
    logoutUser(options?: any): FetchArgs;
    updateUser(username: string, body: User, options?: any): FetchArgs;
};
/**
 * UserApi - functional programming interface
 * @export
 */
export declare const UserApiFp: (configuration?: Configuration) => {
    createUser(body: User, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    createUsersWithArrayInput(body: User[], options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    createUsersWithListInput(body: User[], options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    deleteUser(username: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    getUserByName(username: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<User>;
    loginUser(username: string, password: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<string>;
    logoutUser(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
    updateUser(username: string, body: User, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Response>;
};
/**
 * UserApi - factory interface
 * @export
 */
export declare const UserApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    createUser(body: User, options?: any): Promise<Response>;
    createUsersWithArrayInput(body: User[], options?: any): Promise<Response>;
    createUsersWithListInput(body: User[], options?: any): Promise<Response>;
    deleteUser(username: string, options?: any): Promise<Response>;
    getUserByName(username: string, options?: any): Promise<User>;
    loginUser(username: string, password: string, options?: any): Promise<string>;
    logoutUser(options?: any): Promise<Response>;
    updateUser(username: string, body: User, options?: any): Promise<Response>;
};
/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export declare class UserApi extends BaseAPI {
    /**
     * This can only be done by the logged in user.
     * @summary Create user
     * @param {} body Created user object
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    createUser(body: User, options?: any): Promise<Response>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {} body List of user object
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    createUsersWithArrayInput(body: Array<User>, options?: any): Promise<Response>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {} body List of user object
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    createUsersWithListInput(body: Array<User>, options?: any): Promise<Response>;
    /**
     * This can only be done by the logged in user.
     * @summary Delete user
     * @param {} username The name that needs to be deleted
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    deleteUser(username: string, options?: any): Promise<Response>;
    /**
     *
     * @summary Get user by user name
     * @param {} username The name that needs to be fetched. Use user1 for testing.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    getUserByName(username: string, options?: any): Promise<User>;
    /**
     *
     * @summary Logs user into the system
     * @param {} username The user name for login
     * @param {} password The password for login in clear text
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    loginUser(username: string, password: string, options?: any): Promise<string>;
    /**
     *
     * @summary Logs out current logged in user session
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    logoutUser(options?: any): Promise<Response>;
    /**
     * This can only be done by the logged in user.
     * @summary Updated user
     * @param {} username name that need to be updated
     * @param {} body Updated user object
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    updateUser(username: string, body: User, options?: any): Promise<Response>;
}
