import { useState, useEffect } from 'react'
import {
    SQLiteDatabase,
    Transaction,
    openDatabase,
} from 'react-native-sqlite-storage'

type ColumnTypes = number | string | boolean

interface UseCacheOptions<T> {
    /** 캐시 테이블의 이름 */
    tableName: string
    /** 테이블의 컬럼 정의 (필드명 및 타입) */
    columns: { [key in keyof T]: ColumnTypes } // T 타입의 필드에 대해 ColumnTypes 지정
}

/**
 * SQLite 데이터베이스를 캐시로 사용하기 위한 커스텀 훅
 * @param tableName 캐시 테이블 이름
 * @param columns 테이블의 컬럼 정의 (필드명 및 타입)
 * @returns 캐시 데이터 가져오기, 추가하기, 삭제하기 위한 함수들
 *
 * @example
 * const { getAllCaches, addCache, removeCache } = useCache({
 *     tableName: 'users',
 *     columns: {
 *         name: '',
 *         age: 0,
 *         isActive: true,
 *     },
 * })
 *
 * // 데이터 추가
 * addCache({ name: 'Alice', age: 25, isActive: true })
 *
 * // 모든 데이터 조회
 * const allUsers = await getAllCaches()
 *
 * // 특정 데이터 삭제
 * removeCache({ name: 'Alice' })
 */
const useCache = <T extends Record<string, ColumnTypes>>({
    tableName,
    columns,
}: UseCacheOptions<T>) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null)

    // 데이터베이스 초기화 및 테이블 생성
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

    /**
     * ColumnTypes를 SQLite 데이터 타입으로 매핑
     * @param type ColumnTypes 타입 (string, number, boolean)
     * @returns SQLite 데이터 타입 (TEXT, INTEGER, BOOLEAN)
     */
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

    /**
     * 테이블이 존재하지 않으면 생성하는 함수
     */
    const createTableIfNotExists = () => {
        if (!db) return

        // 컬럼 정의 쿼리 문자열 생성, autoIncrement PK id 컬럼 추가
        const columnDefinitions = ['id INTEGER PRIMARY KEY AUTOINCREMENT']
            .concat(
                Object.keys(columns).map(
                    // ex) 'name TEXT, age INTEGER, isMale BOOLEAN'
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

    /**
     * 테이블의 모든 데이터를 가져오는 함수
     * @returns T 타입의 데이터 배열
     *
     * @example
     * const allCaches = await getAllCaches()
     * console.log(allCaches) // 모든 캐시 데이터를 출력
     */
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

    /**
     * 특정 키-값 쌍에 맞는 데이터를 가져오는 함수
     * @param params 검색 조건으로 사용할 객체 (키-값 쌍)
     * @returns 조건에 맞는 T 타입의 데이터 배열
     *
     * @example
     * const users = await getCachesByKeys({ isActive: true })
     * console.log(users) // 활성화된 사용자 데이터만 출력
     */
    const getCachesByKeys = async (params: Partial<T>) => {
        if (!db) return

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

    /**
     * 특정 키-값 쌍에 맞는 데이터를 가져오는 함수
     * @param params 검색 조건으로 사용할 객체 (키-값 쌍)
     * @returns 조건에 맞는 T 타입의 데이터 배열
     *
     * @example
     * const users = await getCachesByKeys({ isActive: true })
     * console.log(users) // 활성화된 사용자 데이터만 출력
     */
    const getCachesByCondition = async (whereClause: string) => {
        if (!db) return

        return new Promise<T[]>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} WHERE ${whereClause}`,
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

    /**
     * 데이터를 캐시에 추가하는 함수
     * @param data 추가할 데이터 객체
     *
     * @example
     * addCache({ name: 'Bob', age: 30, isActive: false })
     */
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

    /**
     * 특정 조건에 맞는 데이터를 캐시에서 삭제하는 함수
     * @param params 삭제할 조건을 지정하는 객체
     *
     * @example
     * removeCache({ name: 'Alice' }) // 이름이 'Alice'인 데이터 삭제
     */
    const removeCache = (params: Partial<T>) => {
        if (!db) return

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

    return { getAllCaches, getCachesByKeys, addCache, removeCache }
}

export default useCache
