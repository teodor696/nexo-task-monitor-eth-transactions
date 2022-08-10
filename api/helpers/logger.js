class Logger {
    /**
     * Provides logging methods for specific log level
     *
     * @param {string} logLevel
     */
    constructor(logLevel) {
        if (typeof logLevel === 'string' && Logger.logLevels.hasOwnProperty(logLevel.toUpperCase())) {
            this.logLevel = Logger.logLevels[logLevel.toUpperCase()];
        } else {
            throw new Error("Invalid log level");
        }
    }

    static logLevels = {
        OFF: 0,
        FATAL: 1,
        ERROR: 2,
        WARN: 3,
        INFO: 4,
        TRACE: 5,
        DEBUG: 6,
        ALL: 7,
    };

    fatal(message) {
        if (this.logLevel >= 1) {
            console.log({ level: "fatal", message })
        }
    }

    error(message) {
        if (this.logLevel >= 2) {
            console.log({ level: "error", message })
        }
    }

    warn(message) {
        if (this.logLevel >= 3) {
            console.log({ level: "warn", message })
        }
    }

    info(message) {
        if (this.logLevel >= 4) {
            console.log({ level: "info", message })
        }
    }

    trace(message) {
        if (this.logLevel >= 5) {
            console.log({ level: "trace", message })
        }
    }

    debug(message) {
        if (this.logLevel >= 6) {
            console.log({ level: "debug", message })
        }
    }

    all(message) {
        if (this.logLevel === 7) {
            console.log({ level: "all", message })
        }
    }
}

module.exports = Logger;
