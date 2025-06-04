import * as XLSX from "xlsx";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";

export interface Workbook {
    name: string;
    sheets: WorkbookSheet<string>[];
}

export interface WorkbookSheet<Column extends string> {
    name: string;
    columns: readonly Column[];
    columnsInfo: Record<Column, { title: string }>;
    records: Array<Record<Column, string | number | boolean | undefined>>;
}

export type Row<Column extends string> = Record<Column, string | number | boolean | undefined>;

export function exportToSpreadsheet(workbook: Workbook): FutureData<void> {
    const xlsxWorkbook = XLSX.utils.book_new();

    workbook.sheets.forEach(sheet => {
        const header = sheet.columns.map(column => {
            const { title } = sheet.columnsInfo[column] || { title: "-" };
            return { id: column, title };
        });

        const worksheet = XLSX.utils.json_to_sheet(sheet.records, {
            header: header.map(o => o.id),
        });
        XLSX.utils.book_append_sheet(xlsxWorkbook, worksheet, sheet.name);
        XLSX.utils.sheet_add_aoa(worksheet, [header.map(o => o.title)], { origin: "A1" });
    });

    const timestamp = new Date().toISOString().slice(0, 19);

    const filename = `${workbook.name}-${timestamp}.xlsx`;
    const contents = XLSX.write(xlsxWorkbook, { type: "array" });
    downloadFromContents({
        filename: filename,
        mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        contents: contents,
    });

    return Future.success(undefined);
}

export function downloadFromContents(options: {
    filename: string;
    contents: string | Buffer;
    mimetype: string;
}): void {
    const { filename, contents, mimetype } = options;
    const blob = new Blob([contents], { type: mimetype });
    const element =
        document.querySelector<HTMLAnchorElement>("#download") || document.createElement("a");
    element.id = "download-file";
    element.href = window.URL.createObjectURL(blob);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
}
