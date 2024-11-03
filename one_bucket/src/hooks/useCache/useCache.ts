import { useState, useEffect } from 'react'
import {
    SQLiteDatabase,
    Transaction,
    openDatabase,
} from 'react-native-sqlite-storage'

type ColumnTypes = number | string | boolean

interface UseCacheOptions<T> {
    tableName: string
    columns: { [key in keyof T]: ColumnTypes } // T 타입의 필드에 대해 ColumnTypes 지정
}

const useCache = <T extends Record<string, ColumnTypes>>({
    tableName,
    columns,
}: UseCacheOptions<T>) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null)

    useEffect(() => {
        setDb(
            openDatabase(
                {
                    name: 'cache.db',
                    location: 'default',
                },
                DB => {
                    console.log('Database opened')
                    createTableIfNotExists()
                },
                error => {
                    console.log('Error:', error)
                },
            ),
        )
    }, [])

    // 데이터베이스 타입 매핑 함수
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

    const createTableIfNotExists = () => {
        if (!db) return

        // 컬럼 정의 쿼리 문자열 생성, autoIncrement PK id 컬럼 추가
        const columnDefinitions = ['id INTEGER PRIMARY KEY AUTOINCREMENT']
            .concat(
                Object.keys(columns).map(
                    key => `${key} ${mapType(columns[key as keyof T])}`,
                ),
            )
            .join(', ')

        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`,
                [],
                (tx, results) => {
                    console.log('Table created')
                },
                error => {
                    console.log('Error:', error)
                },
            )
        })
    }

    const getAllCaches = async (): Promise<T[]> => {
        if (!db) return []

        return new Promise<T[]>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName}`,
                    [],
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i) as T)
                        }
                        resolve(data)
                    },
                    error => {
                        console.log('Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const getCaches = async (params: Partial<T>) => {
        if (!db) return

        // WHERE 절 조건을 생성합니다.
        const whereClause = Object.keys(params)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(params)

        return new Promise<T[]>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} WHERE ${whereClause}`,
                    values,
                    (_, results) => {
                        const rows = results.rows
                        const data: T[] = []
                        for (let i = 0; i < rows.length; i++) {
                            data.push(rows.item(i) as T)
                        }
                        resolve(data)
                    },
                    error => {
                        console.log('Error:', error)
                        reject(error)
                    },
                )
            })
        })
    }

    const addCache = async (data: T) => {
        if (!db) return

        const fields = Object.keys(data).join(', ')
        const values = Object.values(data)
            .map(() => '?')
            .join(', ')

        db.transaction(tx =>
            tx.executeSql(
                `INSERT INTO ${tableName} (${fields}) VALUES (${values})`,
                Object.values(data) as ColumnTypes[],
                () => console.log('Data added to cache'),
                error => console.log('Error:', error),
            ),
        )
    }

    const removeCache = (params: Partial<T>) => {
        if (!db) return

        // WHERE 절 조건을 생성합니다.
        const whereClause = Object.keys(params)
            .map(key => `${key} = ?`)
            .join(' AND ')
        const values = Object.values(params)

        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM ${tableName} WHERE ${whereClause}`,
                values,
                () => console.log('Data removed from cache'),
                error => console.log('Error:', error),
            )
        })
    }

    return { getAllCaches, getCaches, addCache, removeCache }
}

export default useCache
