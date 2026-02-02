export type AlertButton = {
    text: string;
    onPress?: () => void;
    style?: 'cancel' | 'destructive';
};

type AlertOptions = {
    cancelable?: boolean;
    onDismiss?: () => void;
};

type showAlertParams = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
}

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

    /**
     * Show alert
     * @param {showAlertParams} params - Alert parameters
     */
    show({ title, message, buttons, options }: showAlertParams) {
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
