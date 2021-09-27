import { green, magenta, yellow, blue, red, cyan } from "https://deno.land/std@0.108.0/fmt/colors.ts";
import { NoteFactory, TaskFactory } from "./classes/factory.ts";
import { Virtual } from "./classes/virtual.ts";
import { Util } from "./classes/util.ts";
import { Note } from "./types/note.ts";
import { Task } from "./types/task.ts";

async function makeIfNotExist(path: string) {
    try {
        const stat = await Deno.stat(path);
    } catch (error) {
        await Deno.writeTextFile(path, "[]");
    }
}

await makeIfNotExist("./notes.json");
await makeIfNotExist("./tasks.json");

const storages = {
    notes: await new Virtual<Note>().load("./notes.json"),
    tasks: await new Virtual<Task>().load("./tasks.json"),
};

const factories = {
    note: new NoteFactory(),
    task: new TaskFactory(),
};

enum Commands {
    create,
    remove,
    change,
    clear,
    show,
    help,
    exit,
}

let running = true;

console.log(
    blue(
        "Welcome to your personal note and task manager. Enter the help command if you need to know more about the terminal and its capabilities."
    )
);

while (running) {
    let name: string = "";
    const input = Util.ReadLine.read(green("waiting for your orders:")) as keyof typeof Commands;

    if (input === "create") {
        Util.ReadLine.read(magenta("What are you going to create")) === "note"
            ? storages.notes.save(factories.note.create())
            : storages.tasks.save(factories.task.create());
    } else if (input === "change") {
        if (Util.ReadLine.read(magenta("What are you going to change")) === "note") {
            name = Util.ReadLine.read(cyan("Write on behalf of the note to change"));

            storages.notes.exists(name)
                ? factories.note.change(storages.notes.get(name) as Note)
                : console.log(red(`note ${name} is not exist`));
        } else {
            name = Util.ReadLine.read(cyan("Write on behalf of the task to change"));

            storages.tasks.exists(name)
                ? factories.task.change(storages.tasks.get(name) as Task)
                : console.log(red(`task ${name} is not exist`));
        }
    } else if (input === "remove") {
        if (Util.ReadLine.read(magenta("what are you going to delete")) === "note") {
            name = Util.ReadLine.read(cyan("Write the name of the note to delete"));

            storages.notes.exists(name)
                ? storages.notes.remove(name)
                : console.log(red(`note ${name} is non exist`));
        } else {
            name = Util.ReadLine.read(cyan("Write the name of the task to delete"));

            storages.tasks.exists(name)
                ? storages.tasks.remove(name)
                : console.log(red(`task ${name} is non exist`));
        }
    } else if (input === "show") {
        console.log(magenta("notes"));

        for (const id of storages.notes.identifiers) {
            const { name, content } = storages.notes.get(id) as Note;
            console.log(`\t${green(name)}\n\t${cyan(content)}\n`);
        }

        console.log(magenta("tasks"));

        for (const id of storages.tasks.identifiers) {
            const { name, content, finished } = storages.tasks.get(id) as Task;
            console.log(`\t${yellow(name)} ${finished ? green("completed") : red("uncompleted")}`);
            console.log(`\t${cyan(content)}\n`);
        }
    } else if (input === "help") {
        console.log(`${magenta("avail commands")}`);
        console.log(`${yellow("create")} > ${cyan("create a note or task")}`);
        console.log(`${yellow("change")} > ${cyan("change a note or task")}`);
        console.log(`${yellow("remove")} > ${cyan("remove a note or task")}`);
        console.log(`${yellow("clear ")} > ${cyan("clean the terminal   ")}`);
        console.log(`${yellow("help  ")} > ${cyan("show help            ")}`);
        console.log(`${yellow("help  ")} > ${cyan("close the terminal   ")}`);
    } else if (input === "exit") {
        await storages.notes.update("./notes.json");
        await storages.tasks.update("./tasks.json");
        running = false;
    } else {
        console.clear();
    }
}
