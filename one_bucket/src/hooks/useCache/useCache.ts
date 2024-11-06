import { useState, useEffect, useCallback, useRef } from 'react'
import { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage'

export type ColumnTypes = number | string | boolean

interface UseCacheOptions<T> {
    tableName: string
    columns: { [key in keyof T]: ColumnTypes }
    debug?: boolean
}

const useCache = <T extends Record<string, ColumnTypes>>({
    tableName,
    columns,
    debug = false,
}: UseCacheOptions<T>) => {
    const dbRef = useRef<SQLiteDatabase | null>(null)

    useEffect(() => {
        const initializeDatabase = () => {
            openDatabase(
                {
                    name: 'cache.db',
                    location: 'default',
                },
                DB => {
                    debug && console.log('[useCache] Database opened')
                    // setDb(DB)
                    dbRef.current = DB
                },
                error => {
                    debug &&
                        console.log('[useCache] Error opening database:', error)
                },
            )
        }

        initializeDatabase()
    }, [])

    useEffect(() => {
        if (dbRef.current) {
            createTableIfNotExists()
        }
    }, [dbRef.current])

    const mapType = (type: ColumnTypes): string => {
        switch (typeof type) {
            case 'string':
                return 'TEXT'
            case 'number':
                return 'INTEGER'
            case 'boolean':
                return 'BOOLEAN'
            default:
                throw new Error(`Unsupported type: ${type}`)
        }
    }

    const createTableIfNotExists = useCallback(async () => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[createTableIfNotExists] db is not set yet')
            return
        }

        const columnDefinitions = ['id INTEGER PRIMARY KEY AUTOINCREMENT']
            .concat(
                Object.keys(columns).map(
                    key => `${key} ${mapType(columns[key as keyof T])}`,
                ),
            )
            .join(', ')

        database.transaction(tx => {
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

    const getAllCaches = async (): Promise<T[]> => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[getAllCaches] db is not set yet')
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
                            console.log('[getAllCaches] Retrieved data:', data)
                        resolve(data)
                    },
                    error => {
                        debug && console.log('[getAllCaches] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getCachesByKeys = async (params: Partial<T>) => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[getCachesByKeys] db is not set yet')
            return
        }

        const whereClause = Object.keys(params)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(params)

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
                            console.log(
                                '[getCachesByKeys] Retrieved data:',
                                data,
                            )
                        resolve(data)
                    },
                    error => {
                        debug && console.log('[getCachesByKeys] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getCachesByWhereClause = async (whereClause: string) => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[getCachesByWhereClause] db is not set yet')
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
                                '[getCachesByWhereClause] Retrieved data:',
                                data,
                            )
                        resolve(data)
                    },
                    error => {
                        debug &&
                            console.log(
                                '[getCachesByWhereClause] Error:',
                                error,
                            )
                        reject(error)
                    },
                )
            })
        })
    }

    const addCache = async (data: T) => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[addCache] db is not set yet')
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
                    console.log('[addCache] Data added to cache:', data),
                error => debug && console.log('[addCache] Error:', error),
            ),
        )
    }

    const removeCache = async (params: Partial<T>) => {
        const database = await waitForDb()
        if (!database) {
            debug && console.log('[removeCache] db is not set yet')
            return
        }

        const whereClause = Object.keys(params)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(params)

        database.transaction(tx => {
            tx.executeSql(
                `DELETE FROM ${tableName} WHERE ${whereClause}`,
                values,
                () =>
                    debug &&
                    console.log(
                        '[removeCache] Data removed from cache with params:',
                        params,
                    ),
                error => debug && console.log('[removeCache] Error:', error),
            )
        })
    }

    const dropTable = async () => {
        const database = await waitForDb()
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

    const waitForDb = async () => {
        while (!dbRef.current) {
            debug && console.log('[waitForDb] Waiting for db...')
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        return dbRef.current
    }

    return {
        getAllCaches,
        getCachesByKeys,
        getCachesByWhereClause,
        addCache,
        removeCache,
        dropTable,
    }
}

export default useCache
