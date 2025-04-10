export interface CreateWidgetDTO {
   IDWorkSpace: string;
   IDNote: string;
   widgetType: string;
   z_Index?: number;
   dimension?: { width: number; height: number };
   position?: { positionX: number; positionY: number };
   style?: { color: string; theme: string };
}

export interface UpdateWidgetDTO {
   widgetType?: string;
   z_Index?: number;
   dimension?: { width: number; height: number };
   position?: { positionX: number; positionY: number };
   style?: { color: string; theme: string };
}

export interface QueryWidgetDTO {
   IDWorkSpace?: string;
   IDNote?: string;
   widgetType?: string;
}
