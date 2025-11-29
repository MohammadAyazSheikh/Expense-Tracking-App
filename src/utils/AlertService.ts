export type AlertButton = {
    text: string;
    onPress?: () => void;
    style?: 'cancel' | 'destructive';
};

type AlertOptions = {
    cancelable?: boolean;
    onDismiss?: () => void;
};

export type AlertConfig = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
};

type AlertListener = (config: AlertConfig | null) => void;

class AlertService {
    private listener: AlertListener | null = null;

    setListener(listener: AlertListener) {
        this.listener = listener;
    }

    show(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) {
        if (this.listener) {
            this.listener({ title, message, buttons, options });
        }
    }

    close() {
        if (this.listener) {
            this.listener(null);
        }
    }
}

export const alertService = new AlertService();
