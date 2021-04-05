export class ApiResponseHistoricalPrice {
    id: string;
    firstTradeDate: number;
    prices: Price[];
    eventsData: Event[];
}

export class Price {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjclose: number;
    type: string;
}

export class Event {
    date: number;
    amount: number;
    type: string;
    data: number;
    numerator: number;
    denominator: number;
    splitRatio: number;
}
