import { FutureData } from "$/data/api-futures";
import _ from "$/domain/entities/generic/Collection";
import { Country } from "$/domain/entities/Country";
import { CountryRepository } from "$/domain/repositories/CountryRepository";
import { Future } from "$/domain/entities/generic/Future";

export class CountryTestRepository implements CountryRepository {
    getBy(): FutureData<Country[]> {
        throw new Error("Method not implemented.");
    }
    getByIds(): FutureData<Country[]> {
        return Future.success([]);
    }
}
