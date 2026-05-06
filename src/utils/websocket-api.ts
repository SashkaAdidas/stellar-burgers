import { TOrdersData } from './types';

const WS_URL =
  process.env.BURGER_WS_URL || 'wss://norma.education-services.ru/orders/all';

export type TWSMessageHandler = (data: TOrdersData) => void;
export type TWSConnectionHandler = () => void;
export type TWSErrorHandler = (event: Event) => void;

export class WebSocketApi {
  private socket: WebSocket | null = null;
  private messageHandler: TWSMessageHandler | null = null;
  private openHandler: TWSConnectionHandler | null = null;
  private closeHandler: TWSConnectionHandler | null = null;
  private errorHandler: TWSErrorHandler | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly reconnectDelay = 3000; // 3 seconds
  private isManualDisconnect = false;

  connect(token: string) {
    this.isManualDisconnect = false;
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.openHandler) {
        this.openHandler();
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && this.messageHandler) {
          this.messageHandler(data);
        }
      } catch (error) {}
    };

    this.socket.onclose = (event) => {
      // Don't reconnect if it was a manual disconnect
      if (!this.isManualDisconnect && !event.wasClean) {
        this.reconnectTimer = setTimeout(() => {
          this.connect(token);
        }, this.reconnectDelay);
      }

      if (this.closeHandler) {
        this.closeHandler();
      }
    };

    this.socket.onerror = (event) => {
      if (this.errorHandler) {
        this.errorHandler(event);
      }
    };
  }

  disconnect() {
    this.isManualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onMessage(handler: TWSMessageHandler) {
    this.messageHandler = handler;
  }

  onOpen(handler: TWSConnectionHandler) {
    this.openHandler = handler;
  }

  onClose(handler: TWSConnectionHandler) {
    this.closeHandler = handler;
  }

  onError(handler: TWSErrorHandler) {
    this.errorHandler = handler;
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
    }
  }
}
