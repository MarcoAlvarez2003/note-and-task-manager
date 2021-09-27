import { DataBase, Identifiable } from "../types/database.ts";

export class Virtual<Fact extends Identifiable> implements DataBase<Fact> {
    protected storage: Fact[] = [];

    get identifiers(): string[] {
        return this.storage.map((fact) => fact.id);
    }

    exists(identifier: string): boolean {
        return this.storage.some((fact) => fact.id == identifier || (fact as any).name == identifier);
    }

    save(fact: Fact): void {
        this.storage.push(fact);
    }

    get(identifier: string): Fact | undefined {
        return this.storage.find((fact) => fact.id == identifier || (fact as any).name == identifier);
    }

    remove(identifier: string): void {
        const index = this.storage.findIndex((fact) => fact.id == identifier);
        this.storage.splice(index, 1);
    }

    async update(path: string) {
        const data = JSON.stringify(this.storage);
        await Deno.writeTextFile(path, data);
        return this;
    }

    async load(path: string) {
        const data = await Deno.readTextFile(path);
        const storage = JSON.parse(data) as Fact[];
        this.storage = storage;
        return this;
    }
}
