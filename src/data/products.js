export let products = [];
export let idCounter = 1;

export function getNextId() {
    return idCounter++;
}