import { Factory } from "../types/factory.ts";
import { Note } from "../types/note.ts";
import { Task } from "../types/task.ts";
import { Util } from "./util.ts";

export class NoteFactory implements Factory<Note> {
    create(): Note {
        return {
            id: Util.Generator.id,
            name: Util.ReadLine.read("please write the name of the note:"),
            content: Util.ReadLine.read("please, write the content of the note:"),
        };
    }

    change(product: Note): void {
        product.name = Util.ReadLine.read("please write the new name of the note:", product.name);
        product.content = Util.ReadLine.read("please write the new content of the note:", product.content);
    }
}

export class TaskFactory implements Factory<Task> {
    create(): Task {
        return {
            id: Util.Generator.id,
            name: Util.ReadLine.read("please write the name of the task:"),
            content: Util.ReadLine.read("please write the content of the task:"),
            finished: false,
        };
    }

    change(product: Task): void {
        product.name = Util.ReadLine.read("please write the new name of the task:", product.name);
        product.content = Util.ReadLine.read("please write the new content of the task:", product.content);
        product.finished = confirm("Have you completed this task yet?");
    }
}
