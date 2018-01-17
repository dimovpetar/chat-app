export interface Chat {
    title: string;
    _id: number;
}

export interface ChatMessage {
    chatId: number;
    message: string;
    sender: string;
}

export interface ChatHash {
    [key: string]: ChatMessage[];
}

