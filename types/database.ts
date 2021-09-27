export interface Identifiable {
    id: string;
    name: string;
}

export interface DataBase<Fact extends Identifiable> {
    identifiers: string[];
    exists(identifier: string): boolean;
    save(fact: Fact): Promise<void> | void;
    get(identifier: string): Fact | undefined;
    remove(identifier: string): Promise<void> | void;
}
