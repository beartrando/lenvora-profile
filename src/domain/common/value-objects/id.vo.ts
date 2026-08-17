export class Id {
    constructor(
        readonly value: string,
    ) {
        if (!value) {
            throw new Error("Id cannot be empty");
        }

        if (/\s/.test(value)) {
            throw new Error("Id cannot contain whitespace");
        }
    }

    equals(other: Id): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

export default Id;
