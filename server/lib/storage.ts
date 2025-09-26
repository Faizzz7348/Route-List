import { TableRow, TableColumn, InsertTableRow, InsertTableColumn, ImageWithCaption } from "@shared/schema.js";

// In-memory storage for development
class InMemoryStorage {
  private rows: Map<string, TableRow> = new Map();
  private columns: Map<string, TableColumn> = new Map();
  private nextSortOrder = 0;

  constructor() {
    this.initializeDefaultColumns();
    this.initializeSampleData();
  }

  private initializeDefaultColumns() {
    const defaultColumns: Omit<TableColumn, "id">[] = [
      { name: "No", dataKey: "no", type: "number", sortOrder: 0, isEditable: "false", options: [] },
      { name: "Route", dataKey: "route", type: "text", sortOrder: 1, isEditable: "true", options: [] },
      { name: "Code", dataKey: "code", type: "text", sortOrder: 2, isEditable: "true", options: [] },
      { name: "Location", dataKey: "location", type: "text", sortOrder: 3, isEditable: "true", options: [] },
      { name: "Trip", dataKey: "trip", type: "text", sortOrder: 4, isEditable: "true", options: [] },
      { name: "Info", dataKey: "info", type: "text", sortOrder: 5, isEditable: "true", options: [] },
      { name: "TNG Site", dataKey: "tngSite", type: "text", sortOrder: 6, isEditable: "true", options: [] },
      { name: "TNG Route", dataKey: "tngRoute", type: "text", sortOrder: 7, isEditable: "true", options: [] },
      { name: "Images", dataKey: "images", type: "images", sortOrder: 8, isEditable: "true", options: [] },
    ];

    defaultColumns.forEach((col) => {
      const id = `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.columns.set(id, { ...col, id });
    });
  }

  private initializeSampleData() {
    const sampleRows: Omit<TableRow, "id" | "sortOrder">[] = [
      {
        no: 1,
        route: "Route A",
        code: "RT001",
        location: "Downtown",
        trip: "Morning",
        info: "Main route",
        tngSite: "Site 1",
        tngRoute: "TNG-001",
        latitude: "40.7128",
        longitude: "-74.0060",
        images: [],
        qrCode: "",
      },
      {
        no: 2,
        route: "Route B",
        code: "RT002",
        location: "Uptown",
        trip: "Evening",
        info: "Secondary route",
        tngSite: "Site 2",
        tngRoute: "TNG-002",
        latitude: "40.7589",
        longitude: "-73.9851",
        images: [],
        qrCode: "",
      },
    ];

    sampleRows.forEach((row, index) => {
      const id = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.rows.set(id, { ...row, id, sortOrder: index });
    });
  }

  // Row operations
  async getAllRows(): Promise<TableRow[]> {
    return Array.from(this.rows.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getRowById(id: string): Promise<TableRow | null> {
    return this.rows.get(id) || null;
  }

  async createRow(data: InsertTableRow): Promise<TableRow> {
    const id = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const row: TableRow = {
      id,
      sortOrder: this.nextSortOrder++,
      no: data.no || 0,
      route: data.route || "",
      code: data.code || "",
      location: data.location || "",
      trip: data.trip || "",
      info: data.info || "",
      tngSite: data.tngSite || "",
      tngRoute: data.tngRoute || "",
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      images: (data.images as ImageWithCaption[]) || [],
      qrCode: data.qrCode || "",
    };
    this.rows.set(id, row);
    return row;
  }

  async updateRow(id: string, data: Partial<InsertTableRow>): Promise<TableRow | null> {
    const existingRow = this.rows.get(id);
    if (!existingRow) return null;

    const updatedRow: TableRow = { 
      ...existingRow, 
      ...data,
      id: existingRow.id,
      sortOrder: existingRow.sortOrder,
      images: data.images ? (data.images as ImageWithCaption[]) : existingRow.images,
    };
    this.rows.set(id, updatedRow);
    return updatedRow;
  }

  async deleteRow(id: string): Promise<boolean> {
    return this.rows.delete(id);
  }

  async reorderRows(rowIds: string[]): Promise<void> {
    rowIds.forEach((id, index) => {
      const row = this.rows.get(id);
      if (row) {
        this.rows.set(id, { ...row, sortOrder: index });
      }
    });
  }

  // Column operations
  async getAllColumns(): Promise<TableColumn[]> {
    return Array.from(this.columns.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getColumnById(id: string): Promise<TableColumn | null> {
    return this.columns.get(id) || null;
  }

  async createColumn(data: InsertTableColumn): Promise<TableColumn> {
    const id = `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const column: TableColumn = {
      id,
      name: data.name,
      dataKey: data.dataKey,
      type: data.type || "text",
      sortOrder: this.columns.size,
      isEditable: data.isEditable || "true",
      options: data.options ? (data.options as string[]) : [],
    };
    this.columns.set(id, column);
    return column;
  }

  async updateColumn(id: string, data: Partial<InsertTableColumn>): Promise<TableColumn | null> {
    const existingColumn = this.columns.get(id);
    if (!existingColumn) return null;

    const updatedColumn: TableColumn = { 
      ...existingColumn, 
      ...data,
      id: existingColumn.id,
      sortOrder: existingColumn.sortOrder,
      options: data.options ? (data.options as string[]) : existingColumn.options,
    };
    this.columns.set(id, updatedColumn);
    return updatedColumn;
  }

  async deleteColumn(id: string): Promise<boolean> {
    return this.columns.delete(id);
  }

  async reorderColumns(columnIds: string[]): Promise<void> {
    columnIds.forEach((id, index) => {
      const column = this.columns.get(id);
      if (column) {
        this.columns.set(id, { ...column, sortOrder: index });
      }
    });
  }
}

// Export singleton instance
export const storage = new InMemoryStorage();