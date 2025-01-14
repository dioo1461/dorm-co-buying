import { useState, useEffect, useCallback, useRef } from 'react'
import { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage'

type ColumnMapTypes = 'number' | 'string' | 'boolean' | 'serializable'

type ColumnTypes = number | string | boolean | Object

type UseDatabaseOptions<T> = {
    tableName: string
    columns: { [key in keyof T]: ColumnMapTypes }
    debug?: boolean
}

const serialize = (value: ColumnTypes): string => {
    return JSON.stringify(value)
}

const deserialize = <ColumnTypes>(data: string): ColumnTypes => {
    return JSON.parse(data)
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

    const waitForDbInitialization = useCallback(async () => {
        while (dbLock.current) {
            debug && console.log('[waitForDbInitialization] Waiting for db...')
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        return dbRef.current
    }, [debug])

    const createTableIfNotExists = async () => {
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
    }

    const dropTable = async () => {
        const database = await waitForDbInitialization()

        database!.transaction(tx => {
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

    const getAllData = async (inverted: boolean = false): Promise<T[]> => {
        const database = await waitForDbInitialization()

        return new Promise<T[]>((resolve, reject) => {
            database!.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName}`,
                    [],
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            const item = rows.item(i) as T
                            // 역직렬화
                            const deserializedItem = Object.fromEntries(
                                Object.entries(item).map(([key, value]) => [
                                    key,
                                    columns[key as keyof T] === 'serializable'
                                        ? () => {
                                              console.log('value: ', value)
                                              return deserialize(
                                                  value as string,
                                              )
                                          }
                                        : value,
                                ]),
                            ) as T
                            data.push(deserializedItem)
                        }
                        debug &&
                            console.log('[getAllData] Retrieved data:', data)
                        !inverted ? resolve(data) : resolve(data.reverse())
                    },
                    error => {
                        debug && console.log('[getAllData] Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getDataByKeys = async (
        keys: Partial<T>,
        inverted: boolean = false,
    ) => {
        const database = await waitForDbInitialization()

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values: ColumnTypes[] = Object.values(keys).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        return new Promise<T[]>((resolve, reject) => {
            database!.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} WHERE ${whereClause}`,
                    values,
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            const item = rows.item(i) as T
                            // 역직렬화
                            const deserializedItem = Object.fromEntries(
                                Object.entries(item).map(([key, value]) => [
                                    key,
                                    columns[key as keyof T] === 'serializable'
                                        ? deserialize(value as string)
                                        : value,
                                ]),
                            ) as T
                            data.push(deserializedItem)
                        }
                        debug &&
                            console.log('[getDataByKeys] Retrieved data:', data)
                        !inverted ? resolve(data) : resolve(data.reverse())
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

        return new Promise<T[]>((resolve, reject) => {
            database!.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} ${whereClause}`,
                    [],
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            const item = rows.item(i) as T
                            // 역직렬화
                            const deserializedItem = Object.fromEntries(
                                Object.entries(item).map(([key, value]) => [
                                    key,
                                    columns[key as keyof T] === 'serializable'
                                        ? () => {
                                              console.log('value: ', value)
                                              return deserialize(
                                                  value as string,
                                              )
                                          }
                                        : value,
                                ]),
                            ) as T
                            data.push(deserializedItem)
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

        const fields = Object.keys(data).join(', ')
        const placeholders = Object.keys(data)
            .map(() => '?')
            .join(', ')
        const values: ColumnTypes[] = Object.values(data).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )
        database!.transaction(tx =>
            tx.executeSql(
                `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})`,
                values,
                () =>
                    debug &&
                    console.log('[addData] Data added to database:', data),
                error => debug && console.log('[addData] Error:', error),
            ),
        )
    }

    const deleteDataByKeys = async (keys: Partial<T>) => {
        const database = await waitForDbInitialization()

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values: ColumnTypes[] = Object.values(keys).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        database!.transaction(tx => {
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

    const updateDataByKeys = async (
        keys: Partial<T>,
        updatedData: Partial<T>,
    ) => {
        const database = await waitForDbInitialization()

        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const fields = Object.keys(updatedData)
            .map(key => `${key} = ?`)
            .join(', ')
        const values: ColumnTypes[] = Object.values(keys).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        database!.transaction(tx => {
            tx.executeSql(
                `UPDATE ${tableName} SET ${fields} WHERE ${whereClause}`,
                values,
                () =>
                    debug &&
                    console.log(
                        '[updateData] Data updated in database:',
                        updatedData,
                    ),
                error => debug && console.log('[updateData] Error:', error),
            )
        })
    }

    const updateDataByWhereClause = async (
        updatedData: Partial<T>,
        whereClause: string,
    ) => {
        const database = await waitForDbInitialization()

        const fields = Object.keys(updatedData)
            .map(key => `${key} = ?`)
            .join(', ')
        const values: ColumnTypes[] = Object.values(updatedData).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        database!.transaction(tx => {
            tx.executeSql(
                `UPDATE ${tableName} SET ${fields} WHERE ${whereClause}`,
                values,
                () =>
                    debug &&
                    console.log(
                        '[updateData] Data updated in database:',
                        updatedData,
                    ),
                error => debug && console.log('[updateData] Error:', error),
            )
        })
    }

    const upsertDataByKeys = async (data: Partial<T>, keys: Partial<T>) => {
        const database = await waitForDbInitialization()

        const fields = Object.keys(data).join(', ')
        const placeholders = Object.keys(data)
            .map(() => '?')
            .join(', ')
        const updates = Object.keys(data)
            .map(key => `${key} = excluded.${key}`)
            .join(', ')
        const whereClause = Object.keys(keys)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values: ColumnTypes[] = Object.values(keys).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        database!.transaction(tx => {
            tx.executeSql(
                `INSERT INTO ${tableName} (${fields}) 
                VALUES (${placeholders})
                ON CONFLICT(${Object.keys(data)[0]}) DO UPDATE SET ${updates} 
                WHERE ${whereClause}`,
                values,
                () =>
                    debug &&
                    console.log('[upsertDataByKeys] Upsert successful:', data),
                error =>
                    debug && console.log('[upsertDataByKeys] Error:', error),
            )
        })
    }

    const upsertDataByWhereClause = async (
        data: Partial<T>,
        whereClause: string,
    ) => {
        const database = await waitForDbInitialization()

        const fields = Object.keys(data).join(', ')
        const placeholders = Object.keys(data)
            .map(() => '?')
            .join(', ')
        const updates = Object.keys(data)
            .map(key => `${key} = excluded.${key}`)
            .join(', ')
        const values: ColumnTypes[] = Object.values(data).map(
            value => (typeof value === 'object' ? serialize(value) : value), // 직렬화
        )

        database!.transaction(tx => {
            tx.executeSql(
                `
                INSERT INTO ${tableName} (${fields}) 
                VALUES (${placeholders})
                ON CONFLICT(${Object.keys(data)[0]}) DO UPDATE SET ${updates} 
                WHERE ${whereClause}
                `,
                values,
                () =>
                    debug &&
                    console.log(
                        '[upsertDataByWhereClause] Upsert successful:',
                        data,
                    ),
                error =>
                    debug &&
                    console.log('[upsertDataByWhereClause] Error:', error),
            )
        })
    }

    return {
        getAllData,
        getDataByKeys,
        getDataByWhereClause,
        addData,
        updateDataByKeys,
        updateDataByWhereClause,
        deleteDataByKeys,
        dropTable,
    }
}

export default useDatabase
