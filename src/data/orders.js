export let orders = [];
export let idCounter = 1;

export function getNextId() {
    return idCounter++;
}
