import { Note } from "./note.ts";

export interface Task extends Note {
    finished: boolean;
}
