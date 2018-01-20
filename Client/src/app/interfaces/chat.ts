export interface Chat {
    title: string;
    _id: number;
}

export interface ChatMessage {
    roomId: number;
    message: string;
    sender: string;
}

export interface ChatHash {
    [key: string]: ChatMessage[];
}

