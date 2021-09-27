export namespace Util {
    export class Generator {
        static get id(): string {
            return new Date().getTime().toString();
        }
    }

    export class Std {
        static in(message: string, defect: string = ""): string {
            let data: string | null = "";

            while (!data) {
                data = prompt(message, defect);
            }

            return data as string;
        }
    }
}
