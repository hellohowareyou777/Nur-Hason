const DB_NAME = "NurHasonDB";
const DB_VERSION = 2;
const STORE_NAME = "files";

function openDatabase() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function () {

            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}


async function saveFile(file) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        const store =
            transaction.objectStore(STORE_NAME);

        const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            file: file,
            date: new Date().toISOString(),
            starred: false,
            deleted: false
        };

        const request = store.add(fileData);

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}


async function getAllFiles() {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readonly");

        const store =
            transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}


async function updateFile(id, changes) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        const store =
            transaction.objectStore(STORE_NAME);

        const request = store.get(id);

        request.onsuccess = function () {

            const fileData = request.result;

            if (!fileData) {
                reject("File not found");
                return;
            }

            Object.assign(fileData, changes);

            const updateRequest = store.put(fileData);

            updateRequest.onsuccess = function () {
                resolve();
            };

            updateRequest.onerror = function () {
                reject(updateRequest.error);
            };
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}


async function toggleStar(id) {

    const files = await getAllFiles();

    const file = files.find(function (item) {
        return item.id === id;
    });

    if (!file) {
        return;
    }

    await updateFile(id, {
        starred: !file.starred
    });
}


async function getStarredFiles() {

    const files = await getAllFiles();

    return files.filter(function (item) {
        return item.starred === true &&
               item.deleted !== true;
    });
}


async function moveToTrash(id) {

    await updateFile(id, {
        deleted: true
    });

}


async function restoreFile(id) {

    await updateFile(id, {
        deleted: false
    });

}


async function getTrashFiles() {

    const files = await getAllFiles();

    return files.filter(function (item) {
        return item.deleted === true;
    });

}


async function deleteFile(id) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        const store =
            transaction.objectStore(STORE_NAME);

        const request = store.delete(id);

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
}