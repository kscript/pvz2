export const F_OK: number;
export class FileReadStream {
    constructor(path: any, options: any);
    path: any;
    fd: any;
    flags: any;
    mode: any;
    start: any;
    end: any;
    autoClose: any;
    pos: any;
    bytesRead: any;
    closed: any;
    addListener(ev: any, fn: any): any;
    close(cb: any): void;
    destroy(err: any, cb: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    isPaused(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(ev: any, fn: any): any;
    once(type: any, listener: any): any;
    open(): void;
    pause(): any;
    pipe(dest: any, pipeOpts: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    push(chunk: any, encoding: any): any;
    rawListeners(type: any): any;
    read(n: any): any;
    removeAllListeners(ev: any): any;
    removeListener(ev: any, fn: any): any;
    resume(): any;
    setEncoding(enc: any): any;
    setMaxListeners(n: any): any;
    unpipe(dest: any): any;
    unshift(chunk: any): any;
    wrap(stream: any): any;
}
export class FileWriteStream {
    constructor(path: any, options: any);
    path: any;
    fd: any;
    flags: any;
    mode: any;
    start: any;
    autoClose: any;
    pos: any;
    bytesWritten: any;
    closed: any;
    addListener(type: any, listener: any): any;
    close(cb: any): void;
    cork(): void;
    destroy(err: any, cb: any): any;
    destroySoon(chunk: any, encoding: any, cb: any): any;
    emit(type: any, args: any): any;
    end(chunk: any, encoding: any, cb: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    open(): void;
    pipe(): void;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setDefaultEncoding(encoding: any): any;
    setMaxListeners(n: any): any;
    uncork(): void;
    write(chunk: any, encoding: any, cb: any): any;
}
export const R_OK: number;
export class ReadStream {
    constructor(path: any, options: any);
    path: any;
    fd: any;
    flags: any;
    mode: any;
    start: any;
    end: any;
    autoClose: any;
    pos: any;
    bytesRead: any;
    closed: any;
    addListener(ev: any, fn: any): any;
    close(cb: any): void;
    destroy(err: any, cb: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    isPaused(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(ev: any, fn: any): any;
    once(type: any, listener: any): any;
    open(): void;
    pause(): any;
    pipe(dest: any, pipeOpts: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    push(chunk: any, encoding: any): any;
    rawListeners(type: any): any;
    read(n: any): any;
    removeAllListeners(ev: any): any;
    removeListener(ev: any, fn: any): any;
    resume(): any;
    setEncoding(enc: any): any;
    setMaxListeners(n: any): any;
    unpipe(dest: any): any;
    unshift(chunk: any): any;
    wrap(stream: any): any;
}
export class Stats {
    constructor(dev: any, mode: any, nlink: any, uid: any, gid: any, rdev: any, blksize: any, ino: any, size: any, blocks: any, atim_msec: any, mtim_msec: any, ctim_msec: any, birthtim_msec: any);
    dev: any;
    mode: any;
    nlink: any;
    uid: any;
    gid: any;
    rdev: any;
    blksize: any;
    ino: any;
    size: any;
    blocks: any;
    atimeMs: any;
    mtimeMs: any;
    ctimeMs: any;
    birthtimeMs: any;
    atime: any;
    mtime: any;
    ctime: any;
    birthtime: any;
    isBlockDevice(): any;
    isCharacterDevice(): any;
    isDirectory(): any;
    isFIFO(): any;
    isFile(): any;
    isSocket(): any;
    isSymbolicLink(): any;
}
export const W_OK: number;
export class WriteStream {
    constructor(path: any, options: any);
    path: any;
    fd: any;
    flags: any;
    mode: any;
    start: any;
    autoClose: any;
    pos: any;
    bytesWritten: any;
    closed: any;
    addListener(type: any, listener: any): any;
    close(cb: any): void;
    cork(): void;
    destroy(err: any, cb: any): any;
    destroySoon(chunk: any, encoding: any, cb: any): any;
    emit(type: any, args: any): any;
    end(chunk: any, encoding: any, cb: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    once(type: any, listener: any): any;
    open(): void;
    pipe(): void;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setDefaultEncoding(encoding: any): any;
    setMaxListeners(n: any): any;
    uncork(): void;
    write(chunk: any, encoding: any, cb: any): any;
}
export const X_OK: number;
export function access(...args: any[]): any;
export function accessSync(p: any, mode: any, ...args: any[]): any;
export function appendFile(...args: any[]): any;
export function appendFileSync(path: any, data: any, options: any): void;
export function chmod(...args: any[]): any;
export function chmodSync(path: any, mode: any): void;
export function chown(...args: any[]): any;
export function chownSync(path: any, uid: any, gid: any): void;
export function close(...args: any[]): any;
export function closeSync(fd: any): void;
export const constants: {
    COPYFILE_EXCL: number;
    COPYFILE_FICLONE: number;
    COPYFILE_FICLONE_FORCE: number;
    F_OK: number;
    O_APPEND: number;
    O_CREAT: number;
    O_EXCL: number;
    O_RDONLY: number;
    O_RDWR: number;
    O_TRUNC: number;
    O_WRONLY: number;
    R_OK: number;
    S_IFCHR: number;
    S_IFDIR: number;
    S_IFLNK: number;
    S_IFMT: number;
    S_IFREG: number;
    UV_FS_COPYFILE_EXCL: number;
    UV_FS_COPYFILE_FICLONE: number;
    UV_FS_COPYFILE_FICLONE_FORCE: number;
    UV_FS_SYMLINK_DIR: number;
    UV_FS_SYMLINK_JUNCTION: number;
    W_OK: number;
    X_OK: number;
};
export function copyFile(...args: any[]): any;
export function copyFileSync(...args: any[]): any;
export function createReadStream(path: any, options: any): any;
export function createWriteStream(path: any, options: any): any;
export function exists(pathname: any): any;
export function existsSync(p: any): any;
export function fchmod(...args: any[]): any;
export function fchmodSync(fd: any, mode: any): void;
export function fchown(...args: any[]): any;
export function fchownSync(fd: any, uid: any, gid: any): void;
export function fdatasync(fd: any, callback: any): void;
export function fdatasyncSync(fd: any): void;
export function fstat(...args: any[]): any;
export function fstatSync(fd: any): any;
export function fsync(...args: any[]): any;
export function fsyncSync(fd: any): void;
export function ftruncate(...args: any[]): any;
export function ftruncateSync(fd: any, len: any): void;
export function futimes(...args: any[]): any;
export function futimesSync(fd: any, atime: any, mtime: any): void;
export function link(...args: any[]): any;
export function linkSync(existingPath: any, newPath: any): any;
export function lstat(...args: any[]): any;
export function lstatSync(p: any): any;
export function lstatSyncNoException(path: any): any;
export function mkdir(...args: any[]): any;
export function mkdirSync(p: any, mode: any): any;
export function mkdtemp(prefix: any, options: any, callback: any): void;
export function mkdtempSync(prefix: any, options: any): any;
export function open(...args: any[]): any;
export function openSync(...args: any[]): any;
export function read(...args: any[]): any;
export function readFile(...args: any[]): any;
export function readFileSync(p: any, options: any, ...args: any[]): any;
export function readSync(fd: any, buffer: any, offset: any, length: any, position: any): any;
export function readdir(...args: any[]): any;
export function readdirSync(p: any, ...args: any[]): any;
export function readlink(...args: any[]): any;
export function readlinkSync(path: any, options: any): any;
export function realpath(...args: any[]): any;
export function realpathSync(p: any, ...args: any[]): any;
export namespace realpathSync {
    function native(p: any, ...args: any[]): any;
}
export function rename(...args: any[]): any;
export function renameSync(oldPath: any, newPath: any): void;
export function rmdir(...args: any[]): any;
export function rmdirSync(path: any): void;
export function stat(...args: any[]): any;
export function statSync(p: any): any;
export function statSyncNoException(p: any): any;
export function symlink(...args: any[]): any;
export function symlinkSync(target: any, path: any, type: any): void;
export function truncate(...args: any[]): any;
export function truncateSync(path: any, len: any): any;
export function unlink(...args: any[]): any;
export function unlinkSync(path: any): void;
export function unwatchFile(filename: any, listener: any): void;
export function utimes(...args: any[]): any;
export function utimesSync(path: any, atime: any, mtime: any): void;
export function watch(filename: any, options: any, listener: any): any;
export function watchFile(filename: any, options: any, listener: any): any;
export function write(...args: any[]): any;
export function writeFile(...args: any[]): any;
export function writeFileSync(path: any, data: any, options: any): void;
export function writeSync(fd: any, buffer: any, offset: any, length: any, position: any): any;
