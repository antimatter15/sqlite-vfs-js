Module.SQLITE_OK = 0

// Error codes
Module.SQLITE_ERROR = 1 /* Generic error */
Module.SQLITE_INTERNAL = 2 /* Internal logic error in SQLite */
Module.SQLITE_PERM = 3 /* Access permission denied */
Module.SQLITE_ABORT = 4 /* Callback routine requested an abort */
Module.SQLITE_BUSY = 5 /* The database file is locked */
Module.SQLITE_LOCKED = 6 /* A table in the database is locked */
Module.SQLITE_NOMEM = 7 /* A malloc() failed */
Module.SQLITE_READONLY = 8 /* Attempt to write a readonly database */
Module.SQLITE_INTERRUPT = 9 /* Operation terminated by sqlite3_interrupt()*/
Module.SQLITE_IOERR = 10 /* Some kind of disk I/O error occurred */
Module.SQLITE_CORRUPT = 11 /* The database disk image is malformed */
Module.SQLITE_NOTFOUND = 12 /* Unknown opcode in sqlite3_file_control() */
Module.SQLITE_FULL = 13 /* Insertion failed because database is full */
Module.SQLITE_CANTOPEN = 14 /* Unable to open the database file */
Module.SQLITE_PROTOCOL = 15 /* Database lock protocol error */
Module.SQLITE_EMPTY = 16 /* Internal use only */
Module.SQLITE_SCHEMA = 17 /* The database schema changed */
Module.SQLITE_TOOBIG = 18 /* String or BLOB exceeds size limit */
Module.SQLITE_CONSTRAINT = 19 /* Abort due to constraint violation */
Module.SQLITE_MISMATCH = 20 /* Data type mismatch */
Module.SQLITE_MISUSE = 21 /* Library used incorrectly */
Module.SQLITE_NOLFS = 22 /* Uses OS features not supported on host */
Module.SQLITE_AUTH = 23 /* Authorization denied */
Module.SQLITE_FORMAT = 24 /* Not used */
Module.SQLITE_RANGE = 25 /* 2nd parameter to sqlite3_bind out of range */
Module.SQLITE_NOTADB = 26 /* File opened that is not a database file */
Module.SQLITE_NOTICE = 27 /* Notifications from sqlite3_log() */
Module.SQLITE_WARNING = 28 /* Warnings from sqlite3_log() */
Module.SQLITE_ROW = 100 /* sqlite3_step() has another row ready */
Module.SQLITE_DONE = 101 /* sqlite3_step() has finished executing */

Module.SQLITE_ROW = 100
Module.SQLITE_DONE = 101
Module.SQLITE_INTEGER = 1
Module.SQLITE_FLOAT = 2
Module.SQLITE_TEXT = 3
Module.SQLITE_BLOB = 4
Module.SQLITE_NULL = 5

Module.SQLITE_IOCAP_ATOMIC = 0x00000001
Module.SQLITE_IOCAP_ATOMIC512 = 0x00000002
Module.SQLITE_IOCAP_ATOMIC1K = 0x00000004
Module.SQLITE_IOCAP_ATOMIC2K = 0x00000008
Module.SQLITE_IOCAP_ATOMIC4K = 0x00000010
Module.SQLITE_IOCAP_ATOMIC8K = 0x00000020
Module.SQLITE_IOCAP_ATOMIC16K = 0x00000040
Module.SQLITE_IOCAP_ATOMIC32K = 0x00000080
Module.SQLITE_IOCAP_ATOMIC64K = 0x00000100
Module.SQLITE_IOCAP_SAFE_APPEND = 0x00000200
Module.SQLITE_IOCAP_SEQUENTIAL = 0x00000400
Module.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN = 0x00000800
Module.SQLITE_IOCAP_POWERSAFE_OVERWRITE = 0x00001000
Module.SQLITE_IOCAP_IMMUTABLE = 0x00002000
Module.SQLITE_IOCAP_BATCH_ATOMIC = 0x00004000

Module.SQLITE_FCNTL_LOCKSTATE = 1
Module.SQLITE_FCNTL_GET_LOCKPROXYFILE = 2
Module.SQLITE_FCNTL_SET_LOCKPROXYFILE = 3
Module.SQLITE_FCNTL_LAST_ERRNO = 4
Module.SQLITE_FCNTL_SIZE_HINT = 5
Module.SQLITE_FCNTL_CHUNK_SIZE = 6
Module.SQLITE_FCNTL_FILE_POINTER = 7
Module.SQLITE_FCNTL_SYNC_OMITTED = 8
Module.SQLITE_FCNTL_WIN32_AV_RETRY = 9
Module.SQLITE_FCNTL_PERSIST_WAL = 10
Module.SQLITE_FCNTL_OVERWRITE = 11
Module.SQLITE_FCNTL_VFSNAME = 12
Module.SQLITE_FCNTL_POWERSAFE_OVERWRITE = 13
Module.SQLITE_FCNTL_PRAGMA = 14
Module.SQLITE_FCNTL_BUSYHANDLER = 15
Module.SQLITE_FCNTL_TEMPFILENAME = 16
Module.SQLITE_FCNTL_MMAP_SIZE = 18
Module.SQLITE_FCNTL_TRACE = 19
Module.SQLITE_FCNTL_HAS_MOVED = 20
Module.SQLITE_FCNTL_SYNC = 21
Module.SQLITE_FCNTL_COMMIT_PHASETWO = 22
Module.SQLITE_FCNTL_WIN32_SET_HANDLE = 23
Module.SQLITE_FCNTL_WAL_BLOCK = 24
Module.SQLITE_FCNTL_ZIPVFS = 25
Module.SQLITE_FCNTL_RBU = 26
Module.SQLITE_FCNTL_VFS_POINTER = 27
Module.SQLITE_FCNTL_JOURNAL_POINTER = 28
Module.SQLITE_FCNTL_WIN32_GET_HANDLE = 29
Module.SQLITE_FCNTL_PDB = 30
Module.SQLITE_FCNTL_BEGIN_ATOMIC_WRITE = 31
Module.SQLITE_FCNTL_COMMIT_ATOMIC_WRITE = 32
Module.SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE = 33
Module.SQLITE_FCNTL_LOCK_TIMEOUT = 34
Module.SQLITE_FCNTL_DATA_VERSION = 35
Module.SQLITE_FCNTL_SIZE_LIMIT = 36
Module.SQLITE_FCNTL_CKPT_DONE = 37
Module.SQLITE_FCNTL_RESERVE_BYTES = 38
Module.SQLITE_FCNTL_CKPT_START = 39

Module.sqlite3_initialize = cwrap('sqlite3_initialize', 'number', [], { async: true })
Module.sqlite3_open = cwrap('sqlite3_open', 'number', ['string', 'number'], { async: true })
Module.sqlite3_close_v2 = cwrap('sqlite3_close_v2', 'number', ['number'], { async: true })
Module.sqlite3_exec = cwrap(
    'sqlite3_exec',
    'number',
    ['number', 'string', 'number', 'number', 'number'],
    { async: true }
)
Module.sqlite3_finalize = cwrap('sqlite3_finalize', 'number', ['number'], { async: true })
Module.sqlite3_prepare_v2 = cwrap(
    'sqlite3_prepare_v2',
    'number',
    ['number', 'string', 'number', 'number', 'number'],
    { async: true }
)
Module.sqlite3_errmsg = cwrap('sqlite3_errmsg', 'string', ['number'])
Module.sqlite3_step = cwrap('sqlite3_step', 'number', ['number'], { async: true })

Module.sqlite3_column_count = cwrap('sqlite3_column_count', 'number', ['number'])
Module.sqlite3_data_count = cwrap('sqlite3_data_count', 'number', ['number'])

Module.sqlite3_column_double = cwrap('sqlite3_column_double', 'number', ['number', 'number'], {
    async: true,
})
Module.sqlite3_column_text = cwrap('sqlite3_column_text', 'string', ['number', 'number'], {
    async: true,
})
Module.sqlite3_column_blob = cwrap('sqlite3_column_blob', 'number', ['number', 'number'], {
    async: true,
})
Module.sqlite3_column_bytes = cwrap('sqlite3_column_bytes', 'number', ['number', 'number'], {
    async: true,
})
Module.sqlite3_column_type = cwrap('sqlite3_column_type', 'number', ['number', 'number'], {
    async: true,
})
Module.sqlite3_column_name = cwrap('sqlite3_column_name', 'string', ['number', 'number'], {
    async: true,
})

Module.sqlite3_interrupt = cwrap('sqlite3_interrupt', 'null', ['number'])

return Module;

}