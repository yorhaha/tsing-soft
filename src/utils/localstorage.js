let db = {
    save(key, value) {
        console.log(`save ${key} ${value}`)
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        console.log(`get ${key} ${JSON.parse(localStorage.getItem(key))}`)
        return JSON.parse(localStorage.getItem(key))
    },
    remove(key) {
        console.log(`remove ${key}`)
        localStorage.removeItem(key)
    },
    clear() {
        localStorage.clear()
    }
}

export default db