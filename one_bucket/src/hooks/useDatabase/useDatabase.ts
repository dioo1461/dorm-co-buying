import { useState, useEffect, useCallback, useRef } from 'react'
import { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage'

type Serializable =
    | string
    | number
    | boolean
    | null
    | Serializable[]
    | { [key: string]: Serializable }

export type ColumnTypes = number | string | boolean | Serializable

type ColumnMapTypes = 'number' | 'string' | 'boolean' | 'serializable'

type UseDatabaseOptions<T> = {
    tableName: string
    columns: { [key in keyof T]: ColumnMapTypes }
    debug?: boolean
}

const useDatabase = <T extends Record<string, ColumnTypes>>({
    tableName,
    columns,
    debug = false,
}: UseDatabaseOptions<T>) => {
    const dbRef = useRef<SQLiteDatabase | null>(null)
    const dbLock = useRef<boolean>(true)

    useEffect(() => {
        const initializeDatabase = () => {
            openDatabase(
                {
                    name: 'database.db',
                    location: 'default',
                },
                DB => {
                    debug && console.log('[useDatabase] Database opened')
                    dbRef.current = DB
                    dbLock.current = true
                    createTableIfNotExists().then(() => {
                        dbLock.current = false
                    })
                },
                error => {
                    debug &&
                        console.log(
                            '[useDatabase] Error opening database:',
                            error,
                        )
                },
            )
        }

        initializeDatabase()
    }, [])

    const mapType = (type: ColumnMapTypes): string => {
        switch (type) {
            case 'string':
                return 'TEXT'
            case 'number':
                return 'INTEGER'
            case 'boolean':
                return 'BOOLEAN'
            case 'serializable':
                return 'BLOB'
            default:
                throw new Error(`Unsupported type: ${type}`)
        }
    }

    const createTableIfNotExists = useCallback(async () => {
        const columnDefinitions = ['tupleId INTEGER PRIMARY KEY AUTOINCREMENT']
            .concat(
                Object.keys(columns).map(
                    key => `${key} ${mapType(columns[key as keyof T])}`,
                ),
            )
            .join(', ')

        await dbRef.current!.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`,
                [],
                () =>
                    debug &&
                    console.log(
                        '[createTableIfNotExists] create table if not exists:',
                        tableName,
                    ),
                error => {
                    debug &&
                        console.log('[createTableIfNotExists] Error:', error)
                },
            )
        })
    }, [tableName, columns, debug])

    const getAllData = async (): Promise<T[]> => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[getAllData] db is not set yet')
            return []
        }

        return new Promise<T[]>((resolve, reject) => {
            database.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName}`,
                    [],
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i) as T)
                        }
                        debug &&
                            console.log('[getAllData] Retrieved data:', data)
                        resolve(data)
                    },
                    error => {
                        debug && console.log('[getAllData] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getDataByKeys = async (keys: Partial<T>) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[getDataByKeys] db is not set yet')
            return
        }

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(keys)

        return new Promise<T[]>((resolve, reject) => {
            database.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} WHERE ${whereClause}`,
                    values,
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i) as T)
                        }
                        debug &&
                            console.log('[getDataByKeys] Retrieved data:', data)
                        resolve(data)
                    },
                    error => {
                        debug && console.log('[getDataByKeys] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getDataByWhereClause = async (whereClause: string) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[getDataByWhereClause] db is not set yet')
            return []
        }

        return new Promise<T[]>((resolve, reject) => {
            database.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} ${whereClause}`,
                    [],
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i) as T)
                        }
                        debug &&
                            console.log(
                                '[getDataByWhereClause] Retrieved data:',
                                data,
                            )
                        resolve(data)
                    },
                    error => {
                        debug &&
                            console.log('[getDataByWhereClause] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const addData = async (data: T) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[addData] db is not set yet')
            return
        }

        const fields = Object.keys(data).join(', ')
        const values = Object.values(data)
            .map(() => '?')
            .join(', ')

        database.transaction(tx =>
            tx.executeSql(
                `INSERT INTO ${tableName} (${fields}) VALUES (${values})`,
                Object.values(data) as ColumnTypes[],
                () =>
                    debug &&
                    console.log('[addData] Data added to database:', data),
                error => debug && console.log('[addData] Error:', error),
            ),
        )
    }

    const removeData = async (keys: Partial<T>) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[removeData] db is not set yet')
            return
        }

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(keys)

        database.transaction(tx => {
            tx.executeSql(
                `DELETE FROM ${tableName} WHERE ${whereClause}`,
                values,
                () =>
                    debug &&
                    console.log(
                        '[removeData] Data removed from database with keys:',
                        keys,
                    ),
                error => debug && console.log('[removeData] Error:', error),
            )
        })
    }

    const dropTable = async () => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[dropTable] db is not set yet')
            return
        }

        database.transaction(tx => {
            tx.executeSql(
                `DROP TABLE ${tableName}`,
                [],
                () =>
                    debug &&
                    console.log('[dropTable] Table deleted:', tableName),
                error => debug && console.log('[dropTable] Error:', error),
            )
        })
    }

    const waitForDbInitialization = async () => {
        while (dbLock.current) {
            debug && console.log('[waitForDbInitialization] Waiting for db...')
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        return dbRef.current
    }

    const updateDataByKey = async (data: Partial<T>, keys: Partial<T>) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[updateData] db is not set yet')
            return
        }

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(keys)

        const fields = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ')

        database.transaction(tx => {
            tx.executeSql(
                `UPDATE ${tableName} SET ${fields} WHERE ${whereClause}`,
                Object.values(data).concat(values) as ColumnTypes[],
                () =>
                    debug &&
                    console.log('[updateData] Data updated in database:', data),
                error => debug && console.log('[updateData] Error:', error),
            )
        })
    }

    const updateDataByWhereClause = async (
        data: Partial<T>,
        whereClause: string,
    ) => {
        const database = await waitForDbInitialization()
        if (!database) {
            debug && console.log('[updateData] db is not set yet')
            return
        }

        const fields = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ')

        database.transaction(tx => {
            tx.executeSql(
                `UPDATE ${tableName} SET ${fields} WHERE ${whereClause}`,
                Object.values(data) as ColumnTypes[],
                () =>
                    debug &&
                    console.log('[updateData] Data updated in database:', data),
                error => debug && console.log('[updateData] Error:', error),
            )
        })
    }

    return {
        getAllData,
        getDataByKeys,
        getDataByWhereClause,
        addData,
        updateDataByKey,
        updateDataByWhereClause,
        removeData,
        dropTable,
    }
}

export default useDatabase
