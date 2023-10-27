import {type ProjectData} from "~/types/generated";
import type {_AsyncData} from "#app/composables/asyncData";

type TodoDataResponse = {
    data: TodoData[],
    links?: any,
    meta?: any
}

export const useTodos = () => {

    async function index(params: any = null) {
        return useAsyncData<TodoDataResponse>(() =>
            $larafetch(`/todo`, {params})
        )
    }

    async function show(id: string | string[], params: any = null): Promise<_AsyncData<TodoData|null, Error | null>> {
        return useAsyncData<TodoData>(() =>
            $larafetch(`/todo/${id}`, {params})
        )
    }

    return {
        index, show
    }
}
