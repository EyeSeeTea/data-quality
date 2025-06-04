import { FutureData } from "$/data/api-futures";
import { Sequential } from "$/domain/entities/Sequential";

export interface SequentialRepository {
    get(): FutureData<Sequential>;
}
