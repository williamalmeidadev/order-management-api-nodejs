export let customers = [];
export let idCounter = 1;

export function getNextId() {
    return idCounter++;
}