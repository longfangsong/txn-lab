export function assert(condition: boolean) {
    if (!condition) {
        console.warn("assertion failed!")
    }
}